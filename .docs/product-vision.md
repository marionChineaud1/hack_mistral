# Product vision

## The problem

Viral information often reaches people without the source, chronology, evidence, or context needed to interpret it. A binary “true or false” answer hides uncertainty and does not teach users how a claim was constructed.

## Positioning

**North** is an **AI investigative assistant**, not an authority that decides the truth. It helps users decide what to think by showing where information originated, what supports or contradicts it, what remains unknown, which context is absent, and how confidently the available evidence can be interpreted.

**Core message:** Every viral post deserves an investigation before it deserves your attention.

## Product principles

### Evidence, not authority

North exposes sources, limitations, and reasoning. Confidence is explained through evidence quality, independence, coherence, and missing information, never an unexplained percentage.

### Uncertainty is a feature

North uses nuanced labels such as **Fortement étayé**, **Sources contradictoires**, **Trop tôt pour conclure**, or **Preuves insuffisantes**. It separates sourced facts, cautious interpretation, and unverified elements.

### Factual and rhetorical context

The investigation considers two independent dimensions:

1. whether reliable evidence supports the claim;
2. whether the content presents its message fairly through its wording, omissions, certainty, and emotional framing.

Rhetorical analysis evaluates the content, not the author’s personality or intentions.

### Live sources and durable transparency

Research uses live extraction and live sources only. A completed investigation is then saved as structured records, with source-to-finding citations, so it can be reconstructed without chat history or MCP logs.

## MVP experience

The user submits an X post URL in Mistral Vibe. Brief statuses make the investigation visible while North extracts the post, searches the web and institutions, compares evidence, and analyses framing. North then saves the complete investigation through `save_investigation`.

Vibe displays only a cautious conclusion, one decisive cited finding, and a link. The companion Nuxt application renders the durable, detailed public investigation: claim components, conclusion, confidence, evidence groups, chronology, missing context, rhetoric, sources, change factors, and optional follow-up.

This division keeps the live-agent experience concise while preserving full transparency in the public report.
