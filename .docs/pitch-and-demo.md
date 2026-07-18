# Pitch and demo

## Jury narrative

North addresses **information without context**. Viral posts spread faster than the evidence needed to understand them.

Do not present North as another infallible fact-checker. Present it as an investigative assistant:

> Every viral post deserves an investigation before it deserves your attention.

North makes the investigation visible, saves the evidence trail, and lets the audience inspect the complete report rather than asking them to trust a chat answer.

## Suggested short pitch

> People encounter viral claims before they encounter the context needed to judge them. North turns an X post into a transparent investigation. In Mistral Vibe, specialised tools trace the origin, consult institutional sources, recover missing context, and analyse framing. North then saves the structured evidence and returns a concise conclusion with a link to a public Nuxt report showing what we know, what remains uncertain, and what could change the conclusion.

## Suggested two-minute demo

1. **Submit the live X post in Mistral Vibe.** Show that the supported URL is extracted live, including its canonical URL and available media/transcription state.
2. **Show brief investigation statuses.** Let the jury see origin research, institutional verification, independent-source comparison, missing-context research, and rhetoric analysis without exposing a premature verdict.
3. **Show the live tools.** Highlight the distinction between the original post, Community Note, primary evidence, institutional material, and contextual reporting.
4. **Show persistence.** Display the “Enregistrement de l’enquête détaillée” status and the `save_investigation` call after synthesis.
5. **Reveal the concise Vibe result.** It contains no more than three French bullets: cautious conclusion, one decisive cited finding, and the returned **Consulter l’enquête complète** link.
6. **Open the Nuxt report.** Demonstrate that the database-backed page contains the full claim breakdown, confidence, evidence groups, chronology, missing context, rhetoric, sources, uncertainties, and possible follow-up.
7. **Close with honest uncertainty.** Point to “what could change this conclusion” rather than claiming North owns the truth.

## Failure demo behavior

- Extraction failure produces a helpful French explanation and no saved investigation.
- Validation failure triggers one structured-payload repair, not repeated research.
- Persistence failure is disclosed in at most three bullets and never produces a fabricated or reconstructed report URL.
- Live source failure remains visible; no mock source or example report is substituted.

## Presentation guidance

- Treat visible statuses and tool calls as product features.
- Keep Vibe concise and use the public report for detail.
- Make evidence links clickable and distinguish primary from secondary sources.
- Explain confidence through source quality and limitations, not a theatrical percentage.
- Emphasise that North supports investigation and information literacy rather than replacing journalists or professional fact-checkers.
