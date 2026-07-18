# 7. Jury pitch: Vera as a startup

**Target length:** 2 minutes, delivered while the live investigation runs.

## The pitch

“Every day, people make decisions based on posts that arrive without their source, their timeline, or the context needed to interpret them. The problem is not only misinformation. It is that information moves faster than investigation.

That is why we built **Vera**: an AI investigation layer for the internet. Vera turns a viral post into a transparent, shareable evidence report. Instead of giving users a black-box answer, it shows them what supports a claim, what challenges it, what is still unknown, and what evidence could change the conclusion.

We start in Mistral Vibe. That makes Vera accessible to anyone, not only technical users: there is no command line, no research workflow to configure, and no prompt-engineering expertise required. A user simply drops an X post URL, and Vera immediately begins a live investigation. The specialised workflow traces the original source, checks web and institutional evidence, recovers missing context, and separately analyses how the claim is framed. The visible statuses are not a loading screen. They make the investigation understandable.

Mistral Vibe is our live interface, and the Vera Skill is the orchestration layer. MCP tools connect it to live extraction, research, and analysis. Once the investigation is complete, `save_investigation` validates and stores a structured evidence trail, with citations, limitations, and contradictory findings. That creates a public report that remains useful after the conversation ends.

What you are seeing is our MVP: X posts in, durable investigations out. But the opportunity is much bigger. Vera can become the trust layer wherever information spreads. Next, we expand to public web pages, articles, PDFs, images, and video. For images and video, Vera can add reverse-origin checks, metadata analysis, transcription, and authenticity signals. We can also add source snapshots, investigation history, collaborative follow-ups, alerts when new evidence appears, and domain-specific workflows for science, health, politics, and finance.

The product is not trying to replace journalists or decide the truth for users. It gives journalists, researchers, and everyday readers a faster way to do the first responsible thing: inspect the evidence before they share the claim.

Vera is built on a simple conviction: before information earns attention, it should earn investigation.”

## Startup framing for the slides

### The problem

**Information moves at feed speed. Verification does not.**

- Viral claims arrive without provenance, evidence, or context.
- Current AI chat answers are often opaque and disappear with the conversation.

### The product

**Vera is the investigation layer for online information.**

- Input: a viral claim, beginning with an X post.
- Engine: live retrieval, specialised investigation, and evidence synthesis.
- Output: a concise answer plus a durable, citable report.

### Why it can scale

**One investigation pipeline, many inputs and use cases.**

| Now | Next | Later |
| --- | --- | --- |
| X posts | Web pages, articles, and PDFs | Images, video, and cross-platform investigations |
| Live source and institutional research | Domain workflows for science, health, politics, and finance | Source snapshots, change alerts, and collaborative follow-ups |
| Public, structured evidence report | Investigation history and ownership | Evidence graph and origin map |

### Why Mistral Vibe matters

**Vibe makes the agent’s work visible, not magical.**

- A familiar conversational interface makes investigation accessible without technical expertise.
- Users provide a link; Vera handles the investigative workflow.
- The Skill governs how Vera investigates.
- MCP connectors provide live capabilities.
- Structured persistence turns an agent response into a reusable product asset.

## Closing options

Choose one:

1. **“Vera is not another AI that gives an answer. It is the investigation layer that lets people see whether an answer deserves trust.”**
2. **“We are making the first step of responsible verification as fast as the feed itself.”**
3. **“Before information earns attention, it should earn investigation.”**

## Likely jury question: Why start with X?

“X is a strong MVP entry point because posts are short, highly shareable, and often detached from their original context. The architecture is intentionally input-agnostic: the same structured investigation pipeline can accept web pages, PDFs, images, and videos as we add their extraction and authenticity capabilities.”

## Likely jury question: What is the business opportunity?

“Vera can serve a broad consumer need for reliable context, while creating professional workflows for newsrooms, research teams, NGOs, public institutions, and trust-and-safety teams. The core asset is the structured investigation: it is shareable, revisitable, and can support monitoring and alerts as evidence changes.”
