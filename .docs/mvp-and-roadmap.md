# MVP and roadmap

## One-day hackathon MVP

The smallest complete experience is:

1. paste a supported X post URL into Mistral Vibe;
2. display brief live investigation statuses and MCP calls;
3. extract the post and investigate it with live web, news, institutional, and rhetorical-analysis tools;
4. synthesise a complete structured investigation;
5. persist the full investigation atomically;
6. show no more than three French bullets in Vibe: a nuanced conclusion, one decisive cited finding, and the returned public-report link;
7. open the detailed investigation in the companion Nuxt application.

The goal is not broad fact-checking coverage. It is a memorable, transparent investigation experience with a durable evidence trail.

## Must-have capabilities

| Capability | Acceptance signal |
| --- | --- |
| X post submission | Supported URLs are extracted live; unsupported or failed extraction does not create a report. |
| Visible orchestration | Brief, relevant statuses expose the investigation without leaking premature conclusions. |
| Live evidence research | Web/news and institutional sources are queried without mock fallback data. |
| Missing context and rhetoric | The report distinguishes factual evidence from presentation analysis. |
| Structured persistence | `save_investigation` writes the complete aggregate in one transaction and returns a real public URL. |
| Public detailed report | The existing Nuxt page reconstructs the investigation from the database alone. |
| Concise Vibe result | At most three bullets, one decisive source citation, and exactly one full-report link on success. |
| Transparent uncertainty | Confidence reasons, limitations, unverified evidence, and change factors remain visible in the report. |

## Demo priorities

### Live investigation

Use short status messages such as:

- Recherche de la publication d’origine et de la chronologie
- Vérification auprès de sources institutionnelles
- Comparaison des sources indépendantes
- Recherche du contexte manquant
- Analyse du cadrage et des incertitudes
- Enregistrement de l’enquête détaillée

The statuses are part of the Mistral Vibe demonstration, not merely a loading screen.

### Durable evidence report

The public page is the detailed experience. It displays the received claim, contextualised conclusion, confidence reasons, supporting/contradicting/unverified evidence, timeline and gaps, missing context, rhetorical analysis, classified sources, change factors, and optional follow-up.

### Failure behavior

- Extraction failure: provide a helpful French error and do not save.
- Save validation failure: repair the structured payload once without repeating research.
- Persistence failure: provide a concise result, disclose that the detailed report was not saved, and omit a report link.
- Live dependency failure: never substitute mock evidence or a fallback URL.

## Deferred work

- Investigation history, discovery, ownership, access control, and deletion workflows.
- Storage of raw tool-call traces and research snapshots beyond the structured public report.
- Rich Origin Map and evidence-graph visualisations beyond the current report UI.
- Inputs beyond X posts, including general web pages, PDFs, images, and plain text.
- Image/video authenticity and reverse-origin analysis.
- Autonomous follow-up execution and notifications outside Mistral Vibe.
- Dedicated scientific, legal, financial, and perspective research tools.
