import { db } from '@nuxthub/db'
import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import { z } from 'zod'

import {
  reportChangeFactors,
  reportCitations,
  reportClaimItems,
  reportClaims,
  reportConclusions,
  reportConfidenceItems,
  reportContextItems,
  reportEvidenceItems,
  reportFollowUps,
  reportRhetoricItems,
  reports,
  reportSources,
  reportTimelineItems,
} from '../../db/schema'

const nonEmptyText = z.string().trim().min(1)
const httpUrl = z.url({ protocol: /^https?$/ })
const isoDate = z.iso.date()
const nullableIsoDate = isoDate.nullable()
const sourceKind = z.enum(['primary', 'secondary'])
const confidenceLevel = z.enum(['high', 'moderate', 'limitation'])
const verdictLabel = z.enum([
  'Well supported',
  'Limited evidence',
  'Conflicting sources',
  'Too early to conclude',
  'Probably satirical',
  'Original source unavailable',
  'We could not verify this claim',
  'Partly supported, but incomplete or misleading by omission',
])

const uniqueUrls = z.array(httpUrl).superRefine((urls, context) => {
  const seen = new Set<string>()
  for (const [index, url] of urls.entries()) {
    if (seen.has(url)) {
      context.addIssue({
        code: 'custom',
        message: 'A source URL may be cited only once per item.',
        path: [index],
      })
    }
    seen.add(url)
  }
})

const sourceMetadata = z.strictObject({
  kind: sourceKind,
  title: nonEmptyText,
  publisher: nonEmptyText,
  note: nonEmptyText.nullable(),
})

const source = sourceMetadata.extend({
  url: httpUrl,
})

const citedItem = z.strictObject({
  title: nonEmptyText,
  detail: nonEmptyText,
  source_urls: uniqueUrls,
})

const investigationSchema = z.strictObject({
  report: z.strictObject({
    title: nonEmptyText.describe('English report title. Preserve any original French wording only in source details.'),
    language: z.literal('en').describe('Vera publishes its report copy in English.'),
    published_at: nullableIsoDate,
    supersedes_report_id: z.uuid().nullable().default(null).describe('The UUID of the public Vera report this new immutable version corrects, if any.'),
  }),
  origin: sourceMetadata.extend({
    submitted_url: httpUrl,
    canonical_url: httpUrl,
  }),
  claim: z.strictObject({
    quote: nonEmptyText.describe('English translation of the claim. The original French wording must remain traceable through its source.'),
    author: nonEmptyText,
    role: nonEmptyText,
    publisher: nonEmptyText,
    date: isoDate,
    verifiable_components: z.array(nonEmptyText).min(1),
    interpretations: z.array(nonEmptyText),
  }),
  conclusion: z.strictObject({
    label: verdictLabel,
    summary: nonEmptyText.describe('Plain-English explanation of why the verdict is warranted and its main limitation.'),
  }),
  confidence: z.array(citedItem.extend({ level: confidenceLevel })),
  evidence: z.strictObject({
    supporting: z.array(citedItem),
    contradicting: z.array(citedItem),
    unverified: z.array(citedItem),
  }),
  sources: z.array(source),
  chronology: z.array(citedItem.extend({
    kind: z.enum(['event', 'gap']),
    date: nullableIsoDate,
  }).superRefine((item, context) => {
    if (item.kind === 'event' && item.date === null) {
      context.addIssue({ code: 'custom', message: 'A chronology event requires a date.', path: ['date'] })
    }
    if (item.kind === 'gap' && item.date !== null) {
      context.addIssue({ code: 'custom', message: 'A chronology gap must have a null date.', path: ['date'] })
    }
  })),
  missing_context: z.array(citedItem),
  rhetoric: z.strictObject({
    disclaimer: nonEmptyText.nullable(),
    items: z.array(citedItem),
  }),
  change_factors: z.array(z.strictObject({
    title: nonEmptyText,
    detail: nonEmptyText,
  })),
  follow_up: z.strictObject({
    suggestion: nonEmptyText,
    frequency: nonEmptyText,
  }).nullable(),
}).superRefine((investigation, context) => {
  const allSourceUrls = [
    investigation.origin.submitted_url,
    investigation.origin.canonical_url,
    ...investigation.sources.map(item => item.url),
  ]
  const knownSourceUrls = new Set(allSourceUrls)

  if (knownSourceUrls.size !== allSourceUrls.length
    && investigation.origin.submitted_url !== investigation.origin.canonical_url) {
    context.addIssue({
      code: 'custom',
      message: 'Every persisted source URL must be unique within an investigation.',
      path: ['sources'],
    })
  }

  const additionalUrls = new Set<string>()
  for (const [index, item] of investigation.sources.entries()) {
    if (additionalUrls.has(item.url)
      || item.url === investigation.origin.submitted_url
      || item.url === investigation.origin.canonical_url) {
      context.addIssue({
        code: 'custom',
        message: 'Every additional source URL must be unique and distinct from the submitted and canonical URLs.',
        path: ['sources', index, 'url'],
      })
    }
    additionalUrls.add(item.url)
  }

  const citedSections = [
    ...investigation.confidence,
    ...investigation.evidence.supporting,
    ...investigation.evidence.contradicting,
    ...investigation.evidence.unverified,
    ...investigation.chronology,
    ...investigation.missing_context,
    ...investigation.rhetoric.items,
  ]
  for (const [itemIndex, item] of citedSections.entries()) {
    for (const [sourceIndex, url] of item.source_urls.entries()) {
      if (!knownSourceUrls.has(url)) {
        context.addIssue({
          code: 'custom',
          message: `Citation references an unknown source URL: ${url}`,
          path: ['citations', itemIndex, 'source_urls', sourceIndex],
        })
      }
    }
  }
})

type Investigation = z.infer<typeof investigationSchema>
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
type CitationTarget = 'confidence' | 'evidence' | 'timeline' | 'context' | 'rhetoric'
type CitedInput = { source_urls: string[] }

function newId(): string {
  return crypto.randomUUID()
}

function publicReportUrl(publicId: string): string {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = z.url({ protocol: /^https?$/ }).safeParse(runtimeConfig.public.siteUrl)
  if (!siteUrl.success) {
    throw createError({
      statusCode: 500,
      message: 'NUXT_PUBLIC_SITE_URL must be configured as an absolute HTTP(S) URL.',
    })
  }

  const baseUrl = runtimeConfig.app.baseURL.replace(/^\/+|\/+$/g, '')
  const reportPath = [baseUrl, 'reports', publicId].filter(Boolean).join('/')
  return new URL(reportPath, `${siteUrl.data.replace(/\/$/, '')}/`).href
}

async function persistInvestigation(transaction: Transaction, investigation: Investigation, reportId: string) {
  await transaction.insert(reports).values({
    id: reportId,
    supersedesReportId: investigation.report.supersedes_report_id,
    title: investigation.report.title,
    language: investigation.report.language,
    isDemo: false,
    publishedAt: investigation.report.published_at,
    rhetoricDisclaimer: investigation.rhetoric.disclaimer,
  })

  await transaction.insert(reportClaims).values({
    id: newId(),
    reportId,
    quote: investigation.claim.quote,
    author: investigation.claim.author,
    role: investigation.claim.role,
    publisher: investigation.claim.publisher,
    claimDate: investigation.claim.date,
  })

  const claimItems = [
    ...investigation.claim.verifiable_components.map((text, index) => ({ id: newId(), reportId, kind: 'verifiable', text, sortOrder: index })),
    ...investigation.claim.interpretations.map((text, index) => ({ id: newId(), reportId, kind: 'interpretation', text, sortOrder: index })),
  ]
  if (claimItems.length > 0)
    await transaction.insert(reportClaimItems).values(claimItems)

  await transaction.insert(reportConclusions).values({
    id: newId(),
    reportId,
    label: investigation.conclusion.label,
    summary: investigation.conclusion.summary,
  })

  const originUrls = investigation.origin.submitted_url === investigation.origin.canonical_url
    ? [investigation.origin.canonical_url]
    : [investigation.origin.submitted_url, investigation.origin.canonical_url]
  const sourceInputs = [
    ...originUrls.map(url => ({ ...investigation.origin, url })),
    ...investigation.sources,
  ]
  const sourceRows = sourceInputs.map((item, index) => ({
    id: newId(),
    reportId,
    kind: item.kind,
    title: item.title,
    publisher: item.publisher,
    url: item.url,
    note: item.note,
    sortOrder: index,
  }))
  await transaction.insert(reportSources).values(sourceRows)
  const sourceIdByUrl = new Map(sourceRows.map(item => [item.url, item.id]))

  const citations: Array<{
    id: string
    reportId: string
    sourceId: string
    targetType: CitationTarget
    targetId: string
    sortOrder: number
  }> = []
  const addCitations = (item: CitedInput, targetType: CitationTarget, targetId: string) => {
    for (const [sortOrder, url] of item.source_urls.entries()) {
      const sourceId = sourceIdByUrl.get(url)
      if (!sourceId)
        throw new Error('Validated citation source was not mapped for persistence.')
      citations.push({ id: newId(), reportId, sourceId, targetType, targetId, sortOrder })
    }
  }

  const confidenceRows = investigation.confidence.map((item, index) => {
    const id = newId()
    addCitations(item, 'confidence', id)
    return { id, reportId, level: item.level, title: item.title, detail: item.detail, sortOrder: index }
  })
  if (confidenceRows.length > 0)
    await transaction.insert(reportConfidenceItems).values(confidenceRows)

  const evidenceGroups = [
    ['support', investigation.evidence.supporting],
    ['contradict', investigation.evidence.contradicting],
    ['unverified', investigation.evidence.unverified],
  ] as const
  const evidenceRows = evidenceGroups.flatMap(([stance, items]) => items.map((item, index) => {
    const id = newId()
    addCitations(item, 'evidence', id)
    return { id, reportId, stance, title: item.title, detail: item.detail, sortOrder: index }
  }))
  if (evidenceRows.length > 0)
    await transaction.insert(reportEvidenceItems).values(evidenceRows)

  const timelineRows = investigation.chronology.map((item, index) => {
    const id = newId()
    addCitations(item, 'timeline', id)
    return { id, reportId, kind: item.kind, eventDate: item.date, title: item.title, detail: item.detail, sortOrder: index }
  })
  if (timelineRows.length > 0)
    await transaction.insert(reportTimelineItems).values(timelineRows)

  const contextRows = investigation.missing_context.map((item, index) => {
    const id = newId()
    addCitations(item, 'context', id)
    return { id, reportId, title: item.title, detail: item.detail, sortOrder: index }
  })
  if (contextRows.length > 0)
    await transaction.insert(reportContextItems).values(contextRows)

  const rhetoricRows = investigation.rhetoric.items.map((item, index) => {
    const id = newId()
    addCitations(item, 'rhetoric', id)
    return { id, reportId, title: item.title, detail: item.detail, sortOrder: index }
  })
  if (rhetoricRows.length > 0)
    await transaction.insert(reportRhetoricItems).values(rhetoricRows)

  const changeFactorRows = investigation.change_factors.map((item, index) => ({
    id: newId(),
    reportId,
    title: item.title,
    detail: item.detail,
    sortOrder: index,
  }))
  if (changeFactorRows.length > 0)
    await transaction.insert(reportChangeFactors).values(changeFactorRows)

  if (investigation.follow_up) {
    await transaction.insert(reportFollowUps).values({
      id: newId(),
      reportId,
      suggestion: investigation.follow_up.suggestion,
      frequency: investigation.follow_up.frequency,
    })
  }

  if (citations.length > 0)
    await transaction.insert(reportCitations).values(citations)
}

export default defineMcpTool({
  name: 'save_investigation',
  description: 'Persist one complete, structured Vera investigation and return its committed public report URL. Report copy must be in English; research and sources must be French-language. Creates a new immutable investigation on every successful call. To correct a report, create a new report and provide report.supersedes_report_id. All source references and related report sections are validated before an atomic database transaction is started.',
  inputSchema: {
    investigation: investigationSchema,
  },
  outputSchema: {
    url: z.url({ protocol: /^https?$/ }),
    public_id: z.uuid(),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async ({ investigation }) => {
    if (investigation.report.supersedes_report_id) {
      const [supersededReport] = await db
        .select({ id: reports.id })
        .from(reports)
        .where(eq(reports.id, investigation.report.supersedes_report_id))
        .limit(1)
      if (!supersededReport) {
        throw createError({
          statusCode: 400,
          message: 'The report selected for correction does not exist.',
        })
      }
    }

    const reportId = newId()
    const result = {
      url: publicReportUrl(reportId),
      public_id: reportId,
    }

    try {
      await db.transaction(async (transaction) => {
        await persistInvestigation(transaction, investigation, reportId)
      })
    }
    catch {
      throw createError({
        statusCode: 500,
        message: 'The investigation could not be saved. No partial report was kept.',
      })
    }

    return { structuredContent: result }
  },
})
