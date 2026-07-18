import { createMistral } from '@ai-sdk/mistral'
import { generateText, Output } from 'ai'
import { z } from 'zod'

const manipulationTechniqueSchema = z.object({
  technique: z.string().describe('Name of the rhetorical/manipulation technique, e.g. "straw man", "appeal to fear", "cherry-picking"'),
  evidence: z.string().describe('Exact quote or close paraphrase from the transcript showing this technique'),
  explanation: z.string().describe('1 to 2 sentences explaining why this is manipulative in this context'),
})

const rhetoricAnalysisSchema = z.object({
  manipulation_techniques: z.array(manipulationTechniqueSchema).length(3)
    .describe('The 3 most evident manipulation techniques used, ordered from most to least evident'),
})

export default defineMcpTool({
  description:
    'Analyses a video transcript for rhetorical manipulation, independently of whether the underlying claims are true. '
    + 'Answers: "Even if this information is true, is it being presented honestly?" Tailored for political discourse '
    + '(elected officials speaking on current-affairs topics). Uses a powerful Mistral model to identify the 3 most '
    + 'evident manipulation techniques (e.g. false dilemma, cherry-picking, appeal to emotion, straw man, ad hominem, '
    + 'slippery slope, appeal to authority), each backed by a quote from the transcript.',
  inputSchema: {
    content: z.string().describe('The video transcript to analyse for rhetorical manipulation'),
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async ({ content }) => {
    const apiKey = useRuntimeConfig().mistralApiKey
    if (!apiKey) {
      throw createError({ statusCode: 500, message: 'NUXT_MISTRAL_API_KEY is not configured' })
    }

    const mistral = createMistral({ apiKey })

    const { output } = await generateText({
      model: mistral('mistral-large-latest'),
      output: Output.object({ schema: rhetoricAnalysisSchema }),
      system: `You are a rhetoric analyst. You assess HOW a video transcript presents its message, not whether its claims are factually true.

The transcript is a political discourse: an elected official speaking about a current-affairs topic. Judge the presentation, not the facts.

Look for signals such as:
- emotional intensity: fear, anger, indignation, urgency, sensationalism;
- reasoning issues: false dilemma, hasty generalisation, cherry-picking, appeal to emotion, straw man, ad hominem, slippery slope, appeal to authority;
- mismatch between the certainty asserted and the evidence actually given;
- important omissions that would change how the statement is understood;
- framing: narrating facts in a way that pushes a particular interpretation.

From everything you detect, select ONLY the 3 most evident manipulation techniques actually used in this transcript, ordered from most to least evident. For each one, quote or closely paraphrase the exact part of the transcript that shows it, and explain in 1-2 sentences why it is manipulative here.

If the transcript contains fewer than 3 clear techniques, still return the 3 strongest candidates, but keep the explanation honest about how weak or borderline the weaker ones are.`,
      prompt: `Video transcript:
---
${content}
---`,
    })

    if (!output) {
      throw createError({ statusCode: 502, message: 'Mistral did not return a structured rhetorical analysis.' })
    }

    return output
  },
})
