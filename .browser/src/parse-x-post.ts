import { createMistral } from "@ai-sdk/mistral";
import { generateText, Output } from "ai";
import { z } from "zod";

const modelExtractionSchema = z.object({
  post_content: z
    .string()
    .nullable()
    .describe("The submitted post's text only, excluding all page interface text."),
  author: z
    .object({
      display_name: z.string().nullable(),
      handle: z.string().nullable(),
      profile_url: z.string().url().nullable(),
    })
    .nullable(),
  publication_date: z
    .string()
    .nullable()
    .describe("The publication date/time exactly as displayed by X, when present."),
  has_video: z.boolean(),
  community_notes_url: z
    .string()
    .url()
    .nullable()
    .describe("The Birdwatch URL for the submitted post's Community Note, if present."),
  metrics: z.object({
    replies: z.number().int().nonnegative().nullable(),
    reposts: z.number().int().nonnegative().nullable(),
    likes: z.number().int().nonnegative().nullable(),
    bookmarks: z.number().int().nonnegative().nullable(),
    views: z.number().int().nonnegative().nullable(),
  }),
});

export const xPostSchema = modelExtractionSchema.extend({
  canonical_url: z.string().url(),
  video_urls: z.array(z.string().url()),
});

export type XPost = z.infer<typeof xPostSchema>;
type ModelExtraction = z.infer<typeof modelExtractionSchema>;

type XMetrics = ModelExtraction["metrics"];

function normalizeMarkdownLineBreaks(markdown: string): string {
  return markdown.replaceAll("\\n", "\n");
}

function parseMetricValue(value: string): number | null {
  const normalized = value.replace(/\s/g, "").replace(/,/g, ".");
  const match = normalized.match(/^(\d+(?:\.\d+)?)([KM])?$/i);
  if (!match) {
    return null;
  }

  const multiplier = match[2]?.toUpperCase() === "M"
    ? 1_000_000
    : match[2]?.toUpperCase() === "K"
      ? 1_000
      : 1;
  return Math.round(Number(match[1]) * multiplier);
}

function extractMetric(markdown: string, label: string): number | null {
  const match = markdown.match(
    new RegExp(`(?:^|\\n|\\))\\s*\\[?([0-9][0-9.,]*\\s*[KM]?)\\s*${label}\\b`, "im"),
  );

  return match ? parseMetricValue(match[1]) : null;
}

export function extractExplicitMetrics(markdown: string): XMetrics {
  const normalizedMarkdown = normalizeMarkdownLineBreaks(markdown);

  return {
    replies: extractMetric(normalizedMarkdown, "repl(?:y|ies)"),
    reposts: extractMetric(normalizedMarkdown, "reposts?"),
    likes: extractMetric(normalizedMarkdown, "likes?"),
    bookmarks: extractMetric(normalizedMarkdown, "bookmarks?"),
    views: extractMetric(normalizedMarkdown, "views?"),
  };
}

export function isVideoIndicated(markdown: string): boolean {
  const postSection = normalizeMarkdownLineBreaks(markdown).split(
    /\n\nReaders added context/i,
    1,
  )[0];
  return /\n00:\d{2}\s*(?:\n|$)/.test(postSection);
}

export function canonicalizeXPostUrl(url: URL): string | null {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const match = url.pathname.match(/^\/([^/]+)\/status\/(\d+)\/?$/);

  if (hostname !== "x.com" || !match) {
    return null;
  }

  return `https://x.com/${match[1]}/status/${match[2]}`;
}

export function finalizeXPost(
  extraction: ModelExtraction,
  canonicalUrl: string,
): XPost {
  return xPostSchema.parse({
    ...extraction,
    canonical_url: canonicalUrl,
    video_urls: extraction.has_video ? [`${canonicalUrl}/video/1`] : [],
  });
}

export async function parseXPostMarkdown({
  markdown,
  canonicalUrl,
  apiKey,
}: {
  markdown: string;
  canonicalUrl: string;
  apiKey: string;
}): Promise<XPost> {
  const mistral = createMistral({ apiKey });
  const { output } = await generateText({
    model: mistral("mistral-small-latest"),
    output: Output.object({ schema: modelExtractionSchema }),
    providerOptions: {
      mistral: {
        // Mistral rejects the JSON Schema generated for this nullable extraction
        // shape. JSON-object mode still lets AI SDK validate the response against
        // modelExtractionSchema locally.
        structuredOutputs: false,
      },
    },
    system: `You extract a single X post from browser-generated Markdown. Respond with one JSON object and no Markdown.

Your JSON object must have exactly these top-level fields:
{
  "post_content": string | null,
  "author": { "display_name": string | null, "handle": string | null, "profile_url": string | null } | null,
  "publication_date": string | null,
  "has_video": boolean,
  "community_notes_url": string | null,
  "metrics": { "replies": integer | null, "reposts": integer | null, "likes": integer | null, "bookmarks": integer | null, "views": integer | null }
}

Do not wrap this object in a "post" object. Do not add fields such as id, text, timestamp, images, retweets, quotes, or media URLs.

Return data only for the submitted post URL. Ignore login/sign-up controls, related people, trending content, terms, repeated text, quoted Community Note text, and all post replies.

Copy the post wording faithfully. Never invent values. If a field is absent, unclear, or the Markdown does not map a number to a named metric, return null. Do not assign unlabeled engagement counts by position.

Set has_video to true only when the submitted post itself is explicitly shown as video content. If it is true, the application will construct its post video-view URL; do not infer a downloadable media URL.

Treat a 00:00 duration in the submitted post's media section as an indication of video. For metrics, use null unless the Markdown explicitly labels the number with that metric's name.

Return a Community Notes URL only if it belongs to the submitted post and points to Birdwatch.`,
    prompt: `Submitted post URL: ${canonicalUrl}

Browser-generated Markdown:
---
${markdown}
---`,
  });

  if (!output) {
    throw new Error("Mistral did not return a structured extraction.");
  }

  return finalizeXPost(
    {
      ...output,
      has_video: isVideoIndicated(markdown),
      metrics: extractExplicitMetrics(markdown),
    },
    canonicalUrl,
  );
}
