# Product vision

## The problem

Viral information often reaches people without the source, chronology, evidence, or context needed to interpret it. A simple “true or false” answer is not enough: it hides uncertainty and does not teach users how a claim is constructed.

## Positioning

**North** is an **AI investigative journalist**, not an AI fact-checker.

It investigates a submitted claim and helps the user decide what to think by showing:

- where the information originated;
- how it propagated;
- what supports or contradicts it;
- what context is absent;
- how the wording tries to persuade the reader;
- how confident the investigation can be, and why.

**Core message:** Every viral post deserves an investigation before it deserves your attention.

## Product principles

### Evidence, not authority

The product must expose its sources and reasoning. A confidence value is useful only when the evidence behind it is visible.

### Uncertainty is a feature

Avoid binary verdicts wherever the evidence is incomplete. Prefer outcomes such as:

- Highly supported
- Weak evidence
- Conflicting reports
- Too early to conclude
- Likely satire
- Original source unavailable

### Two independent dimensions

The product evaluates both:

1. **Factual quality:** Is the claim supported by reliable evidence?
2. **Argumentative quality:** Is the content presented fairly, or is it using misleading framing or rhetoric?

A statement may be factually accurate while still being manipulative or incomplete.

### User agency

The system does not decide the user’s opinion. It gathers evidence, makes gaps explicit, and enables a better-informed conclusion.

### Scope for the hackathon

The initial user journey accepts an **X post URL** and returns a contextualised answer in Mistral Vibe. Other formats remain future extensions, not MVP promises.

## Distinctive experience

Instead of immediately returning an answer, show a **live investigation**. Visible specialist agents make the product feel concrete and agentic:

- searching for official statements;
- tracing the first appearance of the claim;
- comparing headlines and sources;
- finding missing context;
- building a timeline and evidence graph.

The output should feel like a short detective report, not a chatbot response.

## Core investigation report

A final report should include:

1. **Claim received**
2. **Verdict and confidence**, with a clear uncertainty label
3. **Why the system reached this conclusion**
4. **Origin map and timeline**
5. **Supporting, contradicting, and unverified evidence**
6. **Missing context**
7. **Rhetorical analysis and manipulation risk**
8. **What would change this conclusion**
9. **Citations to primary and institutional sources**
