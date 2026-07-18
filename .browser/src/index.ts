import {
  canonicalizeXPostUrl,
  parseXPostMarkdown,
  type XPost,
} from "./parse-x-post";

type BrowserMarkdownResponse = {
  success: boolean;
  result?: string;
  errors?: Array<{ message: string }>;
};

const MAX_MARKDOWN_BYTES = 1_000_000;
const MAX_ERROR_DETAIL_LENGTH = 300;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error
    ? error.message.replace(/\s+/g, " ").slice(0, MAX_ERROR_DETAIL_LENGTH)
    : fallback;
}

async function renderMarkdown(url: string, env: Env): Promise<string> {
  const response = await env.BROWSER.quickAction("markdown", { url });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Browser Rendering failed with status ${response.status}.`);
  }

  let payload: BrowserMarkdownResponse;
  try {
    payload = JSON.parse(body) as BrowserMarkdownResponse;
  }
  catch {
    if (body.trim()) {
      return body;
    }
    throw new Error("Browser Rendering did not return Markdown.");
  }

  if (!payload.success || typeof payload.result !== "string") {
    const message = payload.errors?.map(error => error.message).join("; ")
      || "Browser Rendering did not return Markdown.";
    throw new Error(message);
  }

  return payload.result;
}

async function transcribeVideo(
  videoUrl: string,
  env: Env,
): Promise<{ transcription: unknown; transcriptionError: string | null }> {
  if (!env.NITRO_TRANSCRIPTION_URL) {
    return {
      transcription: null,
      transcriptionError: "NITRO_TRANSCRIPTION_URL is not configured.",
    };
  }

  if (!env.NITRO_TRANSCRIPTION_TOKEN) {
    return {
      transcription: null,
      transcriptionError: "NITRO_TRANSCRIPTION_TOKEN is not configured.",
    };
  }

  try {
    const response = await fetch(env.NITRO_TRANSCRIPTION_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.NITRO_TRANSCRIPTION_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ url: videoUrl }),
    });
    const body = await response.text();

    if (!response.ok) {
      return {
        transcription: null,
        transcriptionError: `Transcription service failed with status ${response.status}: ${body.slice(0, MAX_ERROR_DETAIL_LENGTH)}`,
      };
    }

    let transcription: unknown;
    try {
      transcription = JSON.parse(body);
    }
    catch {
      return {
        transcription: null,
        transcriptionError: "Transcription service returned invalid JSON.",
      };
    }

    return {
      transcription,
      transcriptionError: null,
    };
  }
  catch (error) {
    return {
      transcription: null,
      transcriptionError: errorMessage(error, "Unable to reach the transcription service."),
    };
  }
}

async function extractXPost(
  target: URL,
  env: Env,
): Promise<{ post: XPost; markdown: string }> {
  const canonicalUrl = canonicalizeXPostUrl(target);
  if (!canonicalUrl) {
    throw new Error("The url parameter must be an X post URL.");
  }

  if (!env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not configured.");
  }

  const markdown = await renderMarkdown(canonicalUrl, env);
  const post = await parseXPostMarkdown({
    markdown,
    canonicalUrl,
    apiKey: env.MISTRAL_API_KEY,
  });

  return { post, markdown };
}

function parseCanonicalXPostUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return canonicalizeXPostUrl(new URL(value));
  }
  catch {
    return null;
  }
}

async function handleDirectParse(
  request: Request,
  requestUrl: URL,
  env: Env,
): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  }
  catch {
    return Response.json(
      { error: "The test endpoint expects multipart form data" },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json(
      { error: "Missing required Markdown file field: file" },
      { status: 400 },
    );
  }

  if (file.size === 0 || file.size > MAX_MARKDOWN_BYTES) {
    return Response.json(
      { error: "The Markdown file must be between 1 byte and 1 MB" },
      { status: 400 },
    );
  }

  const formUrl = form.get("url");
  const canonicalUrl = parseCanonicalXPostUrl(
    typeof formUrl === "string" ? formUrl : requestUrl.searchParams.get("url"),
  );
  if (!canonicalUrl) {
    return Response.json(
      { error: "A valid X post URL is required in the url field or query parameter" },
      { status: 400 },
    );
  }

  if (!env.MISTRAL_API_KEY) {
    return Response.json(
      { error: "MISTRAL_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const post = await parseXPostMarkdown({
      markdown: await file.text(),
      canonicalUrl,
      apiKey: env.MISTRAL_API_KEY,
    });
    return Response.json(post);
  }
  catch (error) {
    return Response.json(
      { error: errorMessage(error, "Unable to parse the X post Markdown.") },
      { status: 502 },
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url);

    if (request.method === "POST" && requestUrl.pathname === "/test/parse") {
      return handleDirectParse(request, requestUrl, env);
    }

    if (request.method !== "GET" || requestUrl.pathname !== "/") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: requestUrl.pathname === "/test/parse" ? "POST" : "GET" },
      });
    }

    const url = requestUrl.searchParams.get("url");

    if (!url) {
      return new Response("Missing required query parameter: url", { status: 400 });
    }

    let target: URL;
    try {
      target = new URL(url);
    } catch {
      return new Response("The url parameter must be a valid URL", { status: 400 });
    }

    if (target.protocol !== "http:" && target.protocol !== "https:") {
      return new Response("The url parameter must use HTTP or HTTPS", { status: 400 });
    }

    const canonicalUrl = canonicalizeXPostUrl(target);
    if (!canonicalUrl) {
      return Response.json(
        { error: "The url parameter must be an X post URL." },
        { status: 400 },
      );
    }

    try {
      const { post, markdown } = await extractXPost(new URL(canonicalUrl), env);
      const { transcription, transcriptionError } = post.video_urls[0]
        ? await transcribeVideo(post.video_urls[0], env)
        : { transcription: null, transcriptionError: null };

      return Response.json({
        ...post,
        context: markdown,
        transcription,
        transcription_error: transcriptionError,
      });
    }
    catch (error) {
      return Response.json(
        { error: errorMessage(error, "Unable to extract the X post.") },
        { status: 502 },
      );
    }
  },
} satisfies ExportedHandler<Env>;
