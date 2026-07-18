import { db } from "@nuxthub/db";
import { asc, eq } from "drizzle-orm";

import type { CitedItemDto, ConfidenceLevel, EvidenceStance, ReportDto, ReportSourceDto } from "~~/shared/types/report";
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
} from "../db/schema";

type Database = typeof db;

type ItemRow = { id: string; title: string; detail: string };

export async function getReportById(id: string, database: Database = db): Promise<ReportDto | null> {
  const [report] = await database.select().from(reports).where(eq(reports.id, id)).limit(1);
  if (!report) return null;

  const [claims, claimItems, conclusions, sources, confidence, evidence, timeline, context, rhetoric, changeFactors, followUps, citations, supersedingReports] = await Promise.all([
    database.select().from(reportClaims).where(eq(reportClaims.reportId, id)).limit(1),
    database.select().from(reportClaimItems).where(eq(reportClaimItems.reportId, id)).orderBy(asc(reportClaimItems.kind), asc(reportClaimItems.sortOrder)),
    database.select().from(reportConclusions).where(eq(reportConclusions.reportId, id)).limit(1),
    database.select().from(reportSources).where(eq(reportSources.reportId, id)).orderBy(asc(reportSources.kind), asc(reportSources.sortOrder)),
    database.select().from(reportConfidenceItems).where(eq(reportConfidenceItems.reportId, id)).orderBy(asc(reportConfidenceItems.sortOrder)),
    database.select().from(reportEvidenceItems).where(eq(reportEvidenceItems.reportId, id)).orderBy(asc(reportEvidenceItems.sortOrder)),
    database.select().from(reportTimelineItems).where(eq(reportTimelineItems.reportId, id)).orderBy(asc(reportTimelineItems.sortOrder)),
    database.select().from(reportContextItems).where(eq(reportContextItems.reportId, id)).orderBy(asc(reportContextItems.sortOrder)),
    database.select().from(reportRhetoricItems).where(eq(reportRhetoricItems.reportId, id)).orderBy(asc(reportRhetoricItems.sortOrder)),
    database.select().from(reportChangeFactors).where(eq(reportChangeFactors.reportId, id)).orderBy(asc(reportChangeFactors.sortOrder)),
    database.select().from(reportFollowUps).where(eq(reportFollowUps.reportId, id)).limit(1),
    database.select().from(reportCitations).where(eq(reportCitations.reportId, id)).orderBy(asc(reportCitations.sortOrder)),
    database.select({ id: reports.id }).from(reports).where(eq(reports.supersedesReportId, id)).limit(1),
  ]);

  const claim = claims[0];
  const conclusion = conclusions[0];
  if (!claim || !conclusion) return null;

  const sourceDtos = sources.map(source => ({
    id: source.id,
    kind: source.kind as ReportSourceDto["kind"],
    title: source.title,
    publisher: source.publisher,
    url: source.url,
    note: source.note,
  }));
  const sourceById = new Map(sourceDtos.map(source => [source.id, source]));
  const sourcesFor = (targetType: string, targetId: string) => citations
    .filter(citation => citation.targetType === targetType && citation.targetId === targetId)
    .map(citation => sourceById.get(citation.sourceId))
    .filter((source): source is ReportSourceDto => Boolean(source));
  const cited = (row: ItemRow, targetType: string): CitedItemDto => ({
    id: row.id,
    title: row.title,
    detail: row.detail,
    sources: sourcesFor(targetType, row.id),
  });

  const evidenceGroups: ReportDto["evidence"] = { support: [], contradict: [], unverified: [] };
  for (const item of evidence) {
    evidenceGroups[item.stance as EvidenceStance].push(cited(item, "evidence"));
  }
  const confidenceRank: Record<string, number> = { high: 0, moderate: 1, limitation: 2 };
  confidence.sort((left, right) => confidenceRank[left.level]! - confidenceRank[right.level]! || left.sortOrder - right.sortOrder);

  return {
    id: report.id,
    supersedesReportId: report.supersedesReportId,
    supersededByReportId: supersedingReports[0]?.id ?? null,
    title: report.title,
    language: report.language,
    isDemo: report.isDemo,
    publishedAt: report.publishedAt,
    claim: {
      quote: claim.quote,
      author: claim.author,
      role: claim.role,
      publisher: claim.publisher,
      date: claim.claimDate,
      verifiableClaims: claimItems.filter(item => item.kind === "verifiable").map(item => item.text),
      interpretations: claimItems.filter(item => item.kind === "interpretation").map(item => item.text),
    },
    conclusion: { label: conclusion.label, summary: conclusion.summary },
    confidence: confidence.map(item => ({ ...cited(item, "confidence"), level: item.level as ConfidenceLevel })),
    evidence: evidenceGroups,
    timeline: timeline.map(item => ({ ...cited(item, "timeline"), date: item.eventDate, kind: item.kind as "event" | "gap" })),
    missingContext: context.map(item => cited(item, "context")),
    rhetoric: rhetoric.map(item => cited(item, "rhetoric")),
    sources: sourceDtos,
    changeFactors: changeFactors.map(item => ({ id: item.id, title: item.title, detail: item.detail })),
    followUp: followUps[0] ? { suggestion: followUps[0].suggestion, frequency: followUps[0].frequency } : null,
    rhetoricDisclaimer: report.rhetoricDisclaimer,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}
