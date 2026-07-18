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

interface WebNewsResult {
  title: string
  url: string
  publisher: string
  excerpt: null
  published_at: null
  retrieval_timestamp: string
  summary: string | null
  relevance: number | null
}

interface ConversationResponse {
  conversation_id: string
  outputs: Array<MistralMessageOutput | Record<string, unknown>>
}

const sourceSummarySchema = z.object({
  sources: z.array(
    z.object({
      url: z.string(),
      summary: z.string().describe('1 to 5 lines describing what the page actually says'),
      relevance: z.number().min(0).max(1).describe('How relevant this source is to the claim, 0 to 1'),
    }),
  ),
})

type SourceSummary = z.infer<typeof sourceSummarySchema>['sources'][number]

function extractMessageText(output: MistralMessageOutput | Record<string, unknown>): string {
  if (!('type' in output) || output.type !== 'message.output')
    return ''

  const message = output as MistralMessageOutput
  if (typeof message.content === 'string')
    return message.content

  if (!Array.isArray(message.content))
    return ''

  return message.content
    .filter((chunk): chunk is MistralTextChunk => chunk.type === 'text')
    .map(chunk => chunk.text)
    .join('\n')
}

function parseSourceSummaries(rawText: string): SourceSummary[] | null {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch)
    return null

  try {
    const parsed = JSON.parse(jsonMatch[0])
    return sourceSummarySchema.parse(parsed).sources
  }
  catch {
    return null
  }
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
    + 'web_search connector. Returns structured, cited results (title, publisher, URL, retrieval timestamp), each '
    + 'with a short summary of the page content and a relevance score, ranked most relevant first.',
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

    const headers = { Authorization: `Bearer ${apiKey}` }

    // Step 1: search the web via Mistral's native web_search connector.
    const searchPrompt = [
      'Identify the main claim or topic in the following content, then search the web and news for sources',
      'that corroborate or contradict it. Use the web_search tool.',
      '',
      '---',
      content,
      '---',
    ].join('\n')

    const searchResponse = await $fetch<ConversationResponse>('https://api.mistral.ai/v1/conversations', {
      method: 'POST',
      headers,
      body: {
        model: 'mistral-small-latest',
        inputs: [{ role: 'user', content: searchPrompt }],
        tools: [{ type: 'web_search' }],
      },
    })

    const retrievalTimestamp = new Date().toISOString()
    const results: WebNewsResult[] = []
    const seenUrls = new Set<string>()

    for (const output of searchResponse.outputs) {
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
          summary: null,
          relevance: null,
        })
      }
    }

    if (results.length === 0)
      return { results }

    // Step 2: continue the same conversation to summarize and rank each source found above.
    // Reusing the conversation means the model still has what it actually retrieved during the search.
    const summarizePrompt = [
      'For each of the following sources you just found, write a short summary (1 to 5 lines) of what the',
      'page actually says, and a relevance score (0 to 1) against the original claim below.',
      'Respond with ONLY a JSON object matching this shape, no other text:',
      '{"sources":[{"url":"...","summary":"...","relevance":0.0}]}',
      '',
      'Sources:',
      ...results.map(r => `- ${r.url}`),
      '',
      'Original claim/content:',
      '---',
      content,
      '---',
    ].join('\n')

    let summaries = parseSourceSummaries(
      extractMessageText(
        (await $fetch<ConversationResponse>(`https://api.mistral.ai/v1/conversations/${searchResponse.conversation_id}`, {
          method: 'POST',
          headers,
          body: { inputs: [{ role: 'user', content: summarizePrompt }] },
        })).outputs.at(-1) ?? {},
      ),
    )

    // One repair attempt if the model didn't return valid JSON.
    if (!summaries) {
      const repairResponse = await $fetch<ConversationResponse>(`https://api.mistral.ai/v1/conversations/${searchResponse.conversation_id}`, {
        method: 'POST',
        headers,
        body: {
          inputs: [{
            role: 'user',
            content: 'Your previous reply was not valid JSON matching the requested shape. '
              + 'Reply again with ONLY the JSON object: {"sources":[{"url":"...","summary":"...","relevance":0.0}]}',
          }],
        },
      })
      summaries = parseSourceSummaries(extractMessageText(repairResponse.outputs.at(-1) ?? {}))
    }

    if (summaries) {
      const summaryByUrl = new Map(summaries.map(s => [s.url, s]))
      for (const result of results) {
        const summary = summaryByUrl.get(result.url)
        if (summary) {
          result.summary = summary.summary
          result.relevance = summary.relevance
        }
      }
    }

    results.sort((a, b) => (b.relevance ?? -1) - (a.relevance ?? -1))

    return { results }
  },
})
