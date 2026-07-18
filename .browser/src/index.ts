import { canonicalizeXPostUrl, parseXPostMarkdown } from "./parse-x-post";

const MAX_MARKDOWN_BYTES = 1_000_000;

function jsonResponse(body: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

function getSafeErrorDetail(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unknown error";
  }

  return error.message.replace(/\s+/g, " ").slice(0, 300);
}

function getCanonicalXPostUrl(url: string | null):
  | { canonicalUrl: string }
  | { error: string } {
  if (!url) {
    return { error: "Missing required post URL" };
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return { error: "The post URL must be a valid URL" };
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return { error: "The post URL must use HTTP or HTTPS" };
  }

  const canonicalUrl = canonicalizeXPostUrl(target);
  if (!canonicalUrl) {
    return { error: "The post URL must be an X post URL" };
  }

  return { canonicalUrl };
}

async function structurePost(
  markdown: string,
  canonicalUrl: string,
  env: Env,
): Promise<Response> {
  if (!env.MISTRAL_API_KEY) {
    return jsonResponse(
      { error: "The Mistral API key is not configured" },
      500,
    );
  }

  try {
    const post = await parseXPostMarkdown({
      markdown,
      canonicalUrl,
      apiKey: env.MISTRAL_API_KEY,
    });

    return jsonResponse(post);
  } catch (error) {
    console.error("Unable to structure the extracted X post", error);
    return jsonResponse(
      {
        error: "Unable to structure the extracted X post",
        detail: getSafeErrorDetail(error),
      },
      502,
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url);

    if (request.method === "POST" && requestUrl.pathname === "/test/parse") {
      let form: FormData;
      try {
        form = await request.formData();
      } catch {
        return jsonResponse(
          { error: "The test endpoint expects multipart form data" },
          400,
        );
      }

      const file = form.get("file");
      if (!file || typeof file === "string") {
        return jsonResponse(
          { error: "Missing required Markdown file field: file" },
          400,
        );
      }

      if (file.size === 0 || file.size > MAX_MARKDOWN_BYTES) {
        return jsonResponse(
          { error: "The Markdown file must be between 1 byte and 1 MB" },
          400,
        );
      }

      const parsedUrl = getCanonicalXPostUrl(
        typeof form.get("url") === "string"
          ? (form.get("url") as string)
          : requestUrl.searchParams.get("url"),
      );
      if ("error" in parsedUrl) {
        return jsonResponse({ error: parsedUrl.error }, 400);
      }

      return structurePost(await file.text(), parsedUrl.canonicalUrl, env);
    }

    if (request.method !== "GET" || requestUrl.pathname !== "/") {
      return jsonResponse(
        { error: "Method Not Allowed" },
        405,
        { Allow: "GET, POST" },
      );
    }

    const parsedUrl = getCanonicalXPostUrl(requestUrl.searchParams.get("url"));
    if ("error" in parsedUrl) {
      return jsonResponse({ error: parsedUrl.error }, 400);
    }

    let markdownResponse: Response;
    try {
      markdownResponse = await env.BROWSER.quickAction("markdown", {
        url: parsedUrl.canonicalUrl,
      });
    } catch {
      return jsonResponse(
        { error: "Unable to extract the X post with Browser Rendering" },
        502,
      );
    }

    if (!markdownResponse.ok) {
      return jsonResponse(
        { error: "Browser Rendering could not extract the X post" },
        502,
      );
    }

    return structurePost(
      await markdownResponse.text(),
      parsedUrl.canonicalUrl,
      env,
    );
  },
} satisfies ExportedHandler<Env>;
