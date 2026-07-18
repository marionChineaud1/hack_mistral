# North presentation

A concise, editable presentation for the North hackathon demo.

## Core message

> Every viral post deserves an investigation before it deserves your attention.

North is an AI investigative assistant. It does not decide what people should think; it makes the evidence, context, uncertainty, and framing behind a viral claim inspectable.

## Suggested two-minute flow

| Time | Section | File | Goal |
| --- | --- | --- | --- |
| 0:00–0:15 | Problem and solution | [01-problem-and-solution.md](./01-problem-and-solution.md) | Establish the need for context. |
| 0:15–0:45 | Specialised investigator | [02-specialised-agent.md](./02-specialised-agent.md) | Explain the visible investigative responsibilities. |
| 0:45–1:05 | More than a Skill | [03-why-not-just-a-skill.md](./03-why-not-just-a-skill.md) | Explain the product and architecture boundary. |
| 1:05–1:45 | Live demo | [04-live-demo.md](./04-live-demo.md) | Show the investigation and public evidence report. |
| 1:45–2:00 | Closing | [05-closing.md](./05-closing.md) | Reinforce transparent uncertainty. |

## Demo principles

- Call North an **investigative assistant**, not an infallible fact-checker.
- Treat visible statuses and tool calls as product features.
- Keep Mistral Vibe concise; use the Nuxt report for detail.
- Explain confidence through source quality, independence, contradictions, and limitations, never an unexplained percentage.
- Separate factual evidence from rhetorical analysis.
- End by showing what could change the conclusion.

## Demo setup

- Use a supported X post URL with a stable, explainable claim.
- Have the public report route open as a fallback.
- If a live dependency fails, state that North does not substitute mock evidence or fabricate a report link.
