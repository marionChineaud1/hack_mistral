# MVP and roadmap

## One-day hackathon MVP

Build the smallest experience that proves the story:

1. Paste an X post URL into Mistral Vibe.
2. Display live Vibe tool calls as the multi-agent investigation progresses.
3. Reconstruct a basic origin timeline.
4. Identify missing context and rhetorical framing.
5. Present a final, cited evidence report with uncertainty.

The goal is not broad fact-checking coverage. It is a memorable, transparent investigation experience.

## Must-have demo capabilities

| Capability | Why it matters |
| --- | --- |
| X post submission | Establishes the focused “paste an X link” interaction. |
| Planner orchestration | Makes the Mistral-agent architecture clear to the jury. |
| Source timeline / Origin Map | Strong visual proof of the investigation. |
| Institutional evidence lookup | Grounds the demo in trustworthy, official material. |
| Missing-context analysis | Differentiates the product from a simple verdict. |
| Rhetorical analysis | Shows that truth and honest presentation are separate. |
| Evidence report with citations | Builds trust and makes the final result actionable. |
| “What would change my mind?” | Demonstrates reasoning about uncertainty and missing evidence. |

## Features to prioritise visually

### Origin Map

Visualise how a claim propagates through accounts, platforms, media, and public figures, with timestamps. This is the clearest candidate for a memorable “wow” moment.

### Evidence Graph

Show the claim at the centre, then group evidence into **supports**, **contradicts**, and **unverified**. Make institutional sources visibly distinct.

### Live Investigation

Show status cards such as:

- Searching official statements
- Finding the original publication
- Comparing independent sources
- Checking historical precedents
- Detecting missing context
- Analysing persuasive language
- Building the evidence graph

The progress view is part of the product, not merely a loading screen.

### Transparent confidence

Do not display only “Confidence: 84%.” Explain it with concrete reasons, for example:

- seven independent sources agree;
- an official statement confirms the timeline;
- the original video was located;
- publication timestamps match.

## Stretch goals

Prioritise these only after the core experience works end to end:

| Feature | Demonstration value |
| --- | --- |
| Time Machine | Shows what was known at one hour, twelve hours, one day, and three days after a breaking event. |
| “Would this fool me?” score | Estimates how convincing misleading content appears based on professional design, official-looking wording, genuine media, copied sources, and emotion. |
| Follow-up investigation | The Vibe Skill suggests a Mistral Vibe scheduled task for an uncertain or developing claim. Vibe owns execution and notifications. |
| Image and video analysis | Extends the same investigation flow to media. |
| Perspective cards | Adds journalist, scientist, lawyer, economist, or historian context. |

## Scope guardrails

- Do not claim absolute truth or replace professional journalists and fact-checkers.
- Keep citations visible and distinguish primary from secondary sources.
- Treat confidence as an explanation of evidence quality, not a model certainty illusion.
- Limit the visible agent count and keep each responsibility easy to explain in one sentence.
- Prefer one polished investigation scenario over several shallow features.
- Use live sources only for the demo. Present a clear error state rather than silently falling back to mocked data.
