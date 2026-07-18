# Engineering handoff

This document is the implementation reference for North’s persisted-investigation MVP.

## Goal and non-goal

**Goal:** accept an X post URL in Mistral Vibe, run a live cited investigation, atomically save its structured result, and return a concise French conclusion linking to the detailed Nuxt report.

**Non-goal:** proclaim absolute truth. North exposes evidence quality, competing findings, uncertainty, missing context, and cautious rhetorical analysis.

## Confirmed boundaries

| Area | Decision |
| --- | --- |
| Supported input | `x.com/.../status/...` URL, including tracking parameters |
| Data mode | Live extraction and live sources only; no mock fallback |
| Orchestration | Mistral Vibe follows `.skills/north-orchestrator.md` |
| Integration | North capabilities are MCP connector tools |
| Vibe output | French, at most three bullets; detailed content stays out of chat |
| Persistence | Every successfully completed investigation must be saved before the final response |
| Detailed rendering | Existing Nuxt public route `/reports/:id`, backed by its API and structured database records |
| Public identifier | Generated UUID stored as `reports.id` and used by the route |
| Follow-up | Optional persisted suggestion; Vibe may offer scheduling, but North runs no scheduler |

## System boundary

```mermaid
flowchart LR
    U[User in Mistral Vibe] --> V[Vibe agent]
    K[North orchestrator Skill] --> V
    V --> M[North MCP surface]
    M --> X[Browser worker]
    M --> W[Live web/news search]
    M --> I[Institutional search]
    M --> A[Rhetorical analysis]
    V --> SAVE[save_investigation]
    SAVE --> DB[(NuxtHub SQLite)]
    DB --> API[/api/reports/:id]
    API --> PAGE[/reports/:id]
    SAVE --> V
    V --> C[Concise conclusion and saved URL]
```

### Responsibilities

- **Orchestrator Skill:** controls sequence, evidence policy, retries, status messages, complete payload synthesis, and final response shape.
- **Vibe agent:** executes the Skill and passes only retrieved facts into the save payload.
- **Research tools:** retrieve or analyse live context; they do not own report persistence.
- **`save_investigation`:** validates nested domain concepts and cross-references, generates all internal IDs, maps to existing tables, commits one transaction, and derives the public URL from runtime request/application configuration.
- **Nuxt report API and repository:** load the persisted aggregate by UUID.
- **Nuxt report page:** renders the complete stored investigation without chat history or MCP logs.

## Implemented MCP surface

| Tool | Purpose | Behavior |
| --- | --- | --- |
| `get_url_context` | Extract a supported X post through the browser worker | Read-only, open-world; returns canonical URL, post/author/date context, Community Note URL, video URLs, and transcription state. |
| `search_web_news` | Find live web/news evidence and context | Read-only but non-idempotent due to live search. |
| `search_institutional_evidence` | Search official French institutional domains | Read-only but non-idempotent; returns relevance and stance where available. |
| `analyse_rhetoric` | Analyse framing in extracted content | Read-only and non-idempotent; does not decide factual truth. |
| `save_investigation` | Persist a complete structured investigation | Write, non-destructive, non-idempotent; creates a fresh report on each successful call. |

## Save contract and database mapping

The tool accepts one strict `investigation` object. Nullable singleton values are explicit `null`; repeated sections are explicit arrays, including empty arrays. Caller-supplied database IDs are not accepted.

| Domain section | Persistence target |
| --- | --- |
| Report title, language, publication date, rhetoric disclaimer | `reports` |
| Received claim and speaker metadata | `report_claims` |
| Verifiable components and interpretations | `report_claim_items` |
| Nuanced verdict and contextual summary | `report_conclusions` |
| Submitted/canonical origin URL and additional classified sources | `report_sources` |
| Confidence reasons and limitations | `report_confidence_items` |
| Supporting, contradicting, and unverified findings | `report_evidence_items` |
| Dated events and undated gaps | `report_timeline_items` |
| Missing context | `report_context_items` |
| Rhetorical findings | `report_rhetoric_items` |
| Evidence that could change the conclusion | `report_change_factors` |
| Optional follow-up suggestion | `report_follow_ups` |
| Source links for confidence, evidence, timeline, context, and rhetoric findings | `report_citations` |

Source citations are supplied as source URLs, validated against the investigation’s source set, then resolved to generated source IDs inside the transaction. Source URLs must be unique per report, matching the database constraint. Event dates use ISO `YYYY-MM-DD`; chronology gaps require `null`. The tool returns exactly an absolute `url` and UUID `public_id`, and only after commit succeeds.

The schema has no dedicated storage for an investigation plan, raw research log, source independence graph, retrieval timestamps, engagement metrics, transcripts, standalone manipulation score, or citations on conclusions/change factors. These are not overloaded into unrelated columns and are not part of the save contract.

## Public report contract

The detailed report is stored and rendered by the Nuxt application. It contains:

1. received claim, author metadata, verifiable components, and interpretations;
2. nuanced conclusion;
3. confidence reasons and limitations;
4. supporting, contradicting, and unverified evidence;
5. origin/chronology and explicit gaps;
6. missing context;
7. rhetoric analysis and optional disclaimer;
8. primary and secondary sources with citations;
9. evidence that could change the conclusion;
10. optional follow-up suggestion.

Vibe does not reproduce this report. On success it gives a cautious label, one decisive contextual finding with one clickable evidence source, and exactly one **Consulter l’enquête complète** link returned by the save tool.

## Acceptance criteria

- Unsupported URLs or extraction failures do not trigger research persistence.
- Status messages remain brief, useful, and non-conclusive.
- Research uses live sources and never falls back to example content.
- `save_investigation` is called before every successful final response.
- Malformed dates, URLs, enums, chronology states, duplicate sources, and unknown citation URLs are rejected before writes.
- A valid call creates every supplied related record atomically and the existing API can load it.
- A related-record failure rolls back the report row and all preceding inserts.
- The returned URL is absolute, uses the generated public UUID, and points to `/reports/:id`.
- A successful Vibe response has at most three bullets and exactly one full-report link.
- A failed save is disclosed concisely and produces no report link.

## Deferred work

- Raw tool-trace persistence, source snapshots, and audit/version history.
- Authentication, report ownership, moderation, retention, and deletion.
- Rich Origin Map and evidence graph UI.
- Additional URL/media input types and media-authenticity analysis.
- Autonomous scheduled follow-up execution and notifications.
