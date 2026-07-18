import { createError } from 'h3'
import { z } from 'zod'
import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'

const httpUrl = z
  .string()
  .url()
  .refine(value => {
    try {
      const { protocol } = new URL(value)
      return protocol === 'http:' || protocol === 'https:'
    }
    catch {
      return false
    }
  }, 'URL must use HTTP or HTTPS')
  .describe('Public HTTP(S) URL to retrieve as rendered page context. Currently, only X post URLs are supported.')

const videoTranscription = z.object({
  source_url: z.string().url(),
  video: z.object({
    file_name: z.string(),
  }),
  transcript: z.string(),
  transcription: z.object({
    language: z.string().nullable(),
    duration_seconds: z.number().nullable(),
    segments: z.array(z.object({
      text: z.string(),
      start_second: z.number(),
      end_second: z.number(),
    })),
  }),
})

const xPostContext = z.object({
  post_content: z.string().nullable(),
  author: z.object({
    display_name: z.string().nullable(),
    handle: z.string().nullable(),
    profile_url: z.string().url().nullable(),
  }).nullable(),
  publication_date: z.string().nullable(),
  has_video: z.boolean(),
  community_notes_url: z.string().url().nullable(),
  metrics: z.object({
    replies: z.number().int().nonnegative().nullable(),
    reposts: z.number().int().nonnegative().nullable(),
    likes: z.number().int().nonnegative().nullable(),
    bookmarks: z.number().int().nonnegative().nullable(),
    views: z.number().int().nonnegative().nullable(),
  }),
  canonical_url: z.string().url(),
  video_urls: z.array(z.string().url()),
  context: z.string(),
  transcription: videoTranscription.nullable(),
  transcription_error: z.string().nullable(),
})

function parseWorkerResponse(body: string): z.infer<typeof xPostContext> {
  try {
    return xPostContext.parse(JSON.parse(body))
  }
  catch {
    throw createError({
      statusCode: 502,
      message: 'Browser worker returned an invalid X-post response.',
    })
  }
}

export default defineMcpTool({
  description: `Retrieve live, browser-rendered context for a public HTTP(S) URL. This is North's generic URL-context entry point: it is named for future support of multiple web sources, but the current browser worker supports X post URLs only. For a supported X post, it returns the canonical URL, parsed post text and author metadata, publication date, engagement metrics when available, rendered Markdown context, Community Note URL when detected, video references, and an available video transcription. Use this before investigating a submitted post; do not assume that a video asset or transcription exists.`,
  inputSchema: {
    url: httpUrl,
  },
  outputSchema: xPostContext.shape,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  handler: async ({ url }) => {
    const { browserWorkerUrl } = useRuntimeConfig()
    if (!browserWorkerUrl) {
      throw createError({
        statusCode: 500,
        message: 'BROWSER_WORKER_URL is not configured.',
      })
    }

    let workerUrl: URL
    try {
      workerUrl = new URL(browserWorkerUrl)
    }
    catch {
      throw createError({
        statusCode: 500,
        message: 'BROWSER_WORKER_URL must be a valid URL.',
      })
    }

    workerUrl.searchParams.set('url', url)

    let response: Response
    try {
      response = await fetch(workerUrl, {
        headers: { accept: 'application/json, text/markdown;q=0.9, text/plain;q=0.8' },
      })
    }
    catch {
      throw createError({
        statusCode: 502,
        message: 'Unable to reach the browser worker.',
      })
    }

    const body = await response.text()
    if (!response.ok) {
      throw createError({
        statusCode: 502,
        message: `Browser worker failed with status ${response.status}: ${body.slice(0, 300)}`,
      })
    }

    const result = parseWorkerResponse(body)
    if (!result.context.trim()) {
      throw createError({
        statusCode: 502,
        message: 'Browser worker returned no page context.',
      })
    }

    return {
      structuredContent: result,
    }
  },
})
