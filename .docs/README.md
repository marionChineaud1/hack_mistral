# Project documentation

This folder describes the current persisted-investigation architecture for **North**, the Mistral hackathon project.

## Documents

- [Product vision](./product-vision.md): positioning, principles, and the split between concise Vibe output and durable reports.
- [Agent architecture](./agent-architecture.md): visible investigative roles, MCP tools, persistence, and Nuxt rendering flow.
- [MVP and roadmap](./mvp-and-roadmap.md): demo scope, acceptance signals, failure behavior, and deferred work.
- [Engineering handoff](./engineering-handoff.md): system boundaries, MCP contracts, schema mapping, and technical acceptance criteria.
- [Pitch and demo](./pitch-and-demo.md): jury narrative and the end-to-end live demonstration.

## Working product description

North is an AI investigative assistant for viral information. A user submits an X post URL in Mistral Vibe, sees brief live investigation statuses, and receives a cautious conclusion plus a link. The complete structured investigation is saved by `save_investigation` and rendered by the companion Nuxt application at the public report route.

> AI should not tell people what to think. It should help them inspect the evidence and uncertainty behind a claim.
