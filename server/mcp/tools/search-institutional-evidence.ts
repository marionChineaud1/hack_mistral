import { z } from 'zod'

const OFFICIAL_SOURCES = [
  'legifrance.gouv.fr',
  'insee.fr',
  'data.gouv.fr',
  'vie-publique.fr',
  'assemblee-nationale.fr',
  'senat.fr',
]

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

interface InstitutionalEvidenceResult {
  title: string
  url: string
  publisher: string
  excerpt: null
  published_at: null
  retrieval_timestamp: string
  summary: string | null
  relevance: number | null
  stance: 'supports' | 'contradicts' | 'unrelated' | null
}

interface ConversationResponse {
  conversation_id: string
  outputs: Array<MistralMessageOutput | Record<string, unknown>>
}

const sourceAnalysisSchema = z.object({
  sources: z.array(
    z.object({
      url: z.string(),
      summary: z.string().describe('1 to 5 lines describing what the page actually says'),
      relevance: z.number().min(0).max(1).describe('How relevant this source is to the claim, 0 to 1'),
      stance: z.enum(['supports', 'contradicts', 'unrelated']).describe('Whether this source supports, contradicts, or is unrelated to the claim'),
    }),
  ),
})

type SourceAnalysis = z.infer<typeof sourceAnalysisSchema>['sources'][number]

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

function parseSourceAnalyses(rawText: string): SourceAnalysis[] | null {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch)
    return null

  try {
    const parsed = JSON.parse(jsonMatch[0])
    return sourceAnalysisSchema.parse(parsed).sources
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
    'Searches official and authoritative French institutional sources (Légifrance, INSEE, data.gouv.fr, Vie-publique, '
    + 'Assemblée nationale, Sénat) for evidence related to a claim, using Mistral\'s built-in web_search connector '
    + 'restricted to these domains. Returns structured, cited results, each with a summary, a relevance score, and a '
    + 'stance (supports, contradicts, or unrelated) against the claim. If relevant dates or other context (e.g. the '
    + 'period the claim refers to, related legislation, or prior events) are known, include them directly in `content`.',
  inputSchema: {
    content: z.string().describe(
      'The claim or subject to verify against official French institutional sources. Include any relevant dates '
      + 'or other context (e.g. the period the claim refers to) directly in this text to help narrow the search.',
    ),
    transcription: z.string().describe('Full transcript of the target video, used to enrich the search with more context'),
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async ({ content, transcription }): Promise<{ results: InstitutionalEvidenceResult[], notice: string | null }> => {
    const apiKey = useRuntimeConfig().mistralApiKey
    if (!apiKey) {
      throw createError({ statusCode: 500, message: 'NUXT_MISTRAL_API_KEY is not configured' })
    }

    const headers = { Authorization: `Bearer ${apiKey}` }

    // Step 1: search official French institutional sources via Mistral's native web_search connector.
    const searchPrompt = [
      'Search the web and news for official evidence about the following claim, restricted to these sites only:',
      `site:${OFFICIAL_SOURCES.join(' OR site:')}`,
      'Use the web_search tool.',
      '',
      'Claim/subject:',
      '---',
      content,
      '---',
      '',
      'Video transcript for additional context:',
      '---',
      transcription,
      '---',
    ].filter(Boolean).join('\n')

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
    const results: InstitutionalEvidenceResult[] = []
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
          stance: null,
        })
      }
    }

    if (results.length === 0) {
      return {
        results,
        notice: `Aucune des sources officielles interrogées (${OFFICIAL_SOURCES.join(', ')}) ne mentionne ce sujet.`,
      }
    }

    // Step 2: continue the same conversation to summarize, score, and classify the stance of each source found above.
    // Reusing the conversation means the model still has what it actually retrieved during the search.
    const analysisPrompt = [
      'For each of the following sources you just found, write a short summary (1 to 5 lines) of what the',
      'page actually says, a relevance score (0 to 1) against the original claim below, and a stance:',
      '"supports" if the source supports the claim, "contradicts" if it contradicts it, or "unrelated" otherwise.',
      'Respond with ONLY a JSON object matching this shape, no other text:',
      '{"sources":[{"url":"...","summary":"...","relevance":0.0,"stance":"supports"}]}',
      '',
      'Sources:',
      ...results.map(r => `- ${r.url}`),
      '',
      'Original claim/subject:',
      '---',
      content,
      '---',
    ].join('\n')

    let analyses = parseSourceAnalyses(
      extractMessageText(
        (await $fetch<ConversationResponse>(`https://api.mistral.ai/v1/conversations/${searchResponse.conversation_id}`, {
          method: 'POST',
          headers,
          body: { inputs: [{ role: 'user', content: analysisPrompt }] },
        })).outputs.at(-1) ?? {},
      ),
    )

    // One repair attempt if the model didn't return valid JSON.
    if (!analyses) {
      const repairResponse = await $fetch<ConversationResponse>(`https://api.mistral.ai/v1/conversations/${searchResponse.conversation_id}`, {
        method: 'POST',
        headers,
        body: {
          inputs: [{
            role: 'user',
            content: 'Your previous reply was not valid JSON matching the requested shape. '
              + 'Reply again with ONLY the JSON object: {"sources":[{"url":"...","summary":"...","relevance":0.0,"stance":"supports"}]}',
          }],
        },
      })
      analyses = parseSourceAnalyses(extractMessageText(repairResponse.outputs.at(-1) ?? {}))
    }

    if (analyses) {
      const analysisByUrl = new Map(analyses.map(a => [a.url, a]))
      for (const result of results) {
        const analysis = analysisByUrl.get(result.url)
        if (analysis) {
          result.summary = analysis.summary
          result.relevance = analysis.relevance
          result.stance = analysis.stance
        }
      }
    }

    results.sort((a, b) => (b.relevance ?? -1) - (a.relevance ?? -1))

    return { results, notice: null }
  },
})