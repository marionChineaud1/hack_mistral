import { relations, sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  supersedesReportId: text("supersedes_report_id"),
  title: text("title").notNull(),
  language: text("language").notNull().default("fr"),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at"),
  rhetoricDisclaimer: text("rhetoric_disclaimer"),
  ...timestamps,
}, table => [
  check("reports_language_check", sql`${table.language} IN ('fr', 'en')`),
  index("reports_supersedes_idx").on(table.supersedesReportId),
]);

export const reportClaims = sqliteTable("report_claims", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  publisher: text("publisher").notNull(),
  claimDate: text("claim_date").notNull(),
}, table => [uniqueIndex("report_claims_report_uidx").on(table.reportId)]);

export const reportClaimItems = sqliteTable("report_claim_items", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull(),
}, table => [
  check("report_claim_items_kind_check", sql`${table.kind} IN ('verifiable', 'interpretation')`),
  index("report_claim_items_order_idx").on(table.reportId, table.kind, table.sortOrder),
]);

export const reportConclusions = sqliteTable("report_conclusions", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  summary: text("summary").notNull(),
}, table => [uniqueIndex("report_conclusions_report_uidx").on(table.reportId)]);

export const reportSources = sqliteTable("report_sources", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  publisher: text("publisher").notNull(),
  url: text("url").notNull(),
  note: text("note"),
  sortOrder: integer("sort_order").notNull(),
}, table => [
  check("report_sources_kind_check", sql`${table.kind} IN ('primary', 'secondary')`),
  uniqueIndex("report_sources_report_url_uidx").on(table.reportId, table.url),
  index("report_sources_order_idx").on(table.reportId, table.kind, table.sortOrder),
]);

export const reportConfidenceItems = sqliteTable("report_confidence_items", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  level: text("level").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  sortOrder: integer("sort_order").notNull(),
}, table => [
  check("report_confidence_level_check", sql`${table.level} IN ('high', 'moderate', 'limitation')`),
  index("report_confidence_order_idx").on(table.reportId, table.level, table.sortOrder),
]);

export const reportEvidenceItems = sqliteTable("report_evidence_items", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  stance: text("stance").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  sortOrder: integer("sort_order").notNull(),
}, table => [
  check("report_evidence_stance_check", sql`${table.stance} IN ('support', 'contradict', 'unverified')`),
  index("report_evidence_order_idx").on(table.reportId, table.stance, table.sortOrder),
]);

export const reportTimelineItems = sqliteTable("report_timeline_items", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  eventDate: text("event_date"),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  sortOrder: integer("sort_order").notNull(),
}, table => [
  check("report_timeline_kind_check", sql`${table.kind} IN ('event', 'gap')`),
  index("report_timeline_order_idx").on(table.reportId, table.sortOrder),
]);

function orderedSectionTable(name: string) {
  return {
    id: text("id").primaryKey(),
    reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    detail: text("detail").notNull(),
    sortOrder: integer("sort_order").notNull(),
  };
}

export const reportContextItems = sqliteTable("report_context_items", orderedSectionTable("context"), table => [index("report_context_order_idx").on(table.reportId, table.sortOrder)]);
export const reportRhetoricItems = sqliteTable("report_rhetoric_items", orderedSectionTable("rhetoric"), table => [index("report_rhetoric_order_idx").on(table.reportId, table.sortOrder)]);
export const reportChangeFactors = sqliteTable("report_change_factors", orderedSectionTable("change"), table => [index("report_change_order_idx").on(table.reportId, table.sortOrder)]);

export const reportFollowUps = sqliteTable("report_follow_ups", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  suggestion: text("suggestion").notNull(),
  frequency: text("frequency").notNull(),
}, table => [uniqueIndex("report_follow_ups_report_uidx").on(table.reportId)]);

export const reportCitations = sqliteTable("report_citations", {
  id: text("id").primaryKey(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  sourceId: text("source_id").notNull().references(() => reportSources.id, { onDelete: "cascade" }),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  sortOrder: integer("sort_order").notNull(),
}, table => [
  check("report_citations_target_check", sql`${table.targetType} IN ('confidence', 'evidence', 'timeline', 'context', 'rhetoric')`),
  uniqueIndex("report_citations_target_source_uidx").on(table.targetType, table.targetId, table.sourceId),
  index("report_citations_report_target_idx").on(table.reportId, table.targetType, table.targetId, table.sortOrder),
]);

export const reportsRelations = relations(reports, ({ one, many }) => ({
  claim: one(reportClaims), conclusion: one(reportConclusions), followUp: one(reportFollowUps),
  claimItems: many(reportClaimItems), sources: many(reportSources), confidence: many(reportConfidenceItems),
  evidence: many(reportEvidenceItems), timeline: many(reportTimelineItems), context: many(reportContextItems),
  rhetoric: many(reportRhetoricItems), changeFactors: many(reportChangeFactors), citations: many(reportCitations),
}));
