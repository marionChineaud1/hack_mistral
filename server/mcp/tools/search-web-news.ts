import { z } from 'zod'

interface MistralTextChunk {
  type: 'text'
  text: string
}

interface MistralToolReferenceChunk {
  type: 'tool_reference'
  tool: string
  title?: string
  url?: string
  source?: string
}

type MistralContentChunk = MistralTextChunk | MistralToolReferenceChunk

interface MistralMessageOutput {
  type: 'message.output'
  role: string
  content: string | MistralContentChunk[]
}

interface MistralConversationResponse {
  outputs: Array<MistralMessageOutput | Record<string, unknown>>
}

interface WebNewsResult {
  title: string
  url: string
  publisher: string
  excerpt: null
  published_at: null
  retrieval_timestamp: string
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  }
  catch {
    return url
  }
}

export default defineMcpTool({
  description:
    'Searches the live web and news for sources related to a target video\'s content, using Mistral\'s built-in '
    + 'web_search connector. Returns structured, cited results (title, publisher, URL, retrieval timestamp).',
  inputSchema: {
    content: z
      .string()
      .describe('Markdown containing the extracted information about the target video (transcript, description, claim, metadata)'),
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async ({ content }): Promise<{ results: WebNewsResult[] }> => {
    const apiKey = useRuntimeConfig().mistralApiKey
    if (!apiKey) {
      throw createError({ statusCode: 500, message: 'NUXT_MISTRAL_API_KEY is not configured' })
    }

    const prompt = [
      'Identify the main claim or topic in the following content, then search the web and news for sources',
      'that corroborate or contradict it. Use the web_search tool.',
      '',
      '---',
      content,
      '---',
    ].join('\n')

    const response = await $fetch<MistralConversationResponse>('https://api.mistral.ai/v1/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: {
        model: 'mistral-small-latest',
        inputs: [{ role: 'user', content: prompt }],
        tools: [{ type: 'web_search' }],
      },
    })

    const retrievalTimestamp = new Date().toISOString()
    const results: WebNewsResult[] = []
    const seenUrls = new Set<string>()

    for (const output of response.outputs) {
      if (!('type' in output) || output.type !== 'message.output')
        continue

      const message = output as MistralMessageOutput
      if (!Array.isArray(message.content))
        continue

      for (const chunk of message.content) {
        if (chunk.type !== 'tool_reference' || chunk.tool !== 'web_search')
          continue
        if (!chunk.url || seenUrls.has(chunk.url))
          continue

        seenUrls.add(chunk.url)
        results.push({
          title: chunk.title ?? chunk.url,
          url: chunk.url,
          publisher: hostnameOf(chunk.url),
          excerpt: null,
          published_at: null,
          retrieval_timestamp: retrievalTimestamp,
        })
      }
    }

    return { results }
  },
})
