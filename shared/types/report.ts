export type SourceKind = "primary" | "secondary";
export type EvidenceStance = "support" | "contradict" | "unverified";
export type ConfidenceLevel = "high" | "moderate" | "limitation";

export interface ReportSourceDto {
  id: string;
  kind: SourceKind;
  title: string;
  publisher: string;
  url: string;
  note: string | null;
}

export interface CitedItemDto {
  id: string;
  title: string;
  detail: string;
  sources: ReportSourceDto[];
}

export interface ReportDto {
  id: string;
  supersedesReportId: string | null;
  supersededByReportId: string | null;
  title: string;
  language: string;
  isDemo: boolean;
  publishedAt: string | null;
  claim: {
    quote: string;
    author: string;
    role: string;
    publisher: string;
    date: string;
    verifiableClaims: string[];
    interpretations: string[];
  };
  conclusion: { label: string; summary: string };
  confidence: Array<CitedItemDto & { level: ConfidenceLevel }>;
  evidence: Record<EvidenceStance, CitedItemDto[]>;
  timeline: Array<CitedItemDto & { date: string | null; kind: "event" | "gap" }>;
  missingContext: CitedItemDto[];
  rhetoric: CitedItemDto[];
  sources: ReportSourceDto[];
  changeFactors: Array<{ id: string; title: string; detail: string }>;
  followUp: { suggestion: string; frequency: string } | null;
  rhetoricDisclaimer: string | null;
  createdAt: string;
  updatedAt: string;
}
