



Yesterday 7:23 PM
I'm going to another hackathon tomorrow, organized by Mistral, and I want to do the following of https://soubiran.dev/posts/from-idea-to-victory-the-2026-mistral-ai-paris-hackathon

It's a one-day hackathon. My idea is to create a website where anyone can submit a news from social network for example and get some context about it, similar to how grok works on X or community notes on X but automatically. Without really diving into the technic, what to build to impress the jury? The goal is to win so I want to have an feature that can impress them while having a story to market the projet for the pitch. Also, this have to incorporate agents usi g Mistral models and eventually technologies

Grill me

Your core idea is already strong, because it solves a very visible problem: "information without context." That's a much better story than "we built another AI chat."

However, automatic Community Notes is not enough to win. The judges will have seen fact-checking demos before. You need one memorable idea that makes them say, "I haven't seen this."

I would frame the project around a different narrative:

"AI shouldn't tell you what to think. It should help you understand why something deserves your attention."

That changes the product from a fact-checker into an information intelligence agent.

The story
Imagine someone pastes:

"France bans Linux in public administration."

Instead of replying:

"False."

The system builds an investigation.

Claim received

↓

Find original source

↓

Find first appearance

↓

Track how it spread

↓

Compare independent sources

↓

Find official statements

↓

Detect missing context

↓

Explain confidence
The output becomes almost like a detective report.

That is much more compelling than "here's an answer."

What agents actually do
Don't make one giant agent.

Have several visible specialists.

The jury likes seeing orchestration.

Example:

Scout Agent

Finds original sources.

↓

Timeline Agent

Reconstructs chronology.

↓

Evidence Agent

Finds supporting and contradicting evidence.

↓

Context Agent

Adds geopolitical, historical and technical context.

↓

Bias Agent

Looks for emotionally loaded wording,
possible manipulation,
missing information.

↓

Judge Agent

Produces the final explanation with confidence.
Each agent has a visible card.

Watching them work feels impressive.

Make uncertainty a first-class citizen
This is probably the feature I'd spend the most time on.

Instead of saying

True

or

False

say

Highly supported

Weak evidence

Conflicting reports

Too early to conclude

Likely satire

Original source unavailable
People trust systems that admit uncertainty.

The "Origin Map"
This could be your killer feature.

Imagine a tweet.

The system reconstructs

Telegram

↓

anonymous X account

↓

Reddit

↓

Influencer

↓

Media

↓

Politician
with timestamps.

You literally visualize misinformation propagation.

That's memorable.

Missing Context detector
This one has huge demo value.

Input:

NASA confirms alien life.

Output:

What is missing?

✓ The article talks about microbial signatures.

✓ The headline exaggerates.

✓ Original paper says "possible evidence".

✓ Scientists disagree.
This is much stronger than fact checking.

Manipulation detection
Not

"this is fake"

Instead detect persuasion techniques.

Example:

Appeal to fear

Cherry-picked statistics

Emotional vocabulary

Out-of-context image

False dilemma

Loaded language
People immediately understand it.

Time Machine
Very demo-friendly.

Show

What did we know

1 hour later

12 hours later

24 hours later

3 days later
Many breaking-news mistakes disappear over time.

This teaches users why waiting matters.

The "Would this fool me?" score
My favorite fun feature.

The AI estimates

"How convincing is this misinformation?"

Example

Professional layout

Official-looking wording

Real photo

Known source copied

Emotionally charged
Then

Estimated deception score

92%
That gets attention during the demo.

Perspective Agent
Instead of one explanation.

Journalist

Scientist

Lawyer

Economist

Historian
Each explains why the news matters from their domain.

Not opinions.

Context.

Live Investigation
This is pure demo magic.

Don't instantly show the answer.

Show the agents working.

Searching official statements...

Searching historical precedents...

Comparing headlines...

Checking image metadata...

Building timeline...
Even if everything finishes in 15 seconds.

People love watching AI think.

Explain WHY the model believes something
Not

Confidence: 84%
Instead

Confidence is high because

• 7 independent sources

• Official government statement

• Publication matches timestamps

• Original video found
Transparency wins.

Multi-modal
Paste

tweet

screenshot

video

article

PDF

Same workflow.

One feature nobody expects
Ask

"What information would change this conclusion?"

Example

Current confidence

74%

Confidence would become HIGH if

□ official police report appears

□ satellite images become available

□ Reuters confirms
This is extremely "agentic."

The system reasons about missing evidence.

Product name ideas
Context

ContextOS

Origin

Signal

Signal Chain

Lens

Frame

Anchor

Source

Grounded

Pulse

Veritas

Compass

North

Pitch
I wouldn't pitch it as

AI fact checker

I'd pitch

The first AI investigative journalist.

Or

Every viral post deserves an investigation before it deserves your attention.

If I had only one day
I'd build only five things:

Paste any URL, image, or post.

Multi-agent investigation with visible specialist agents.

Timeline + origin reconstruction.

Missing context analysis.

Final evidence report with transparent confidence and citations.

Everything else can be mocked or simplified.

The combination of a clear social problem, visible agent collaboration, and an investigation experience is likely to stand out more than maximizing the number of features. During the pitch, emphasize that the product is designed to increase users' agency: it doesn't decide what's true for them; it gathers evidence, exposes uncertainty, and helps them reach a better-informed conclusion. That narrative aligns naturally with an agent-based architecture and is easy for judges to remember.


Je pense qu'il faut distinguer deux choses :

les agents indispensables au produit (ceux que le jury verra),

les agents internes (qui peuvent exister mais qu'on ne met pas forcément en avant).

Pour un hackathon d'une journée, je viserais 6 agents maximum. Au-delà, ça devient difficile à expliquer en 2 minutes.

Agent	Rôle	Tools / Skills	Visible dans la démo ?
1. Planner Agent	Analyse la requête, découpe le travail et choisit quels agents lancer.	Classification, Task Planning	Oui ⭐⭐⭐⭐⭐
2. Source Hunter Agent	Trouve la source primaire, les articles, les reposts et l'origine de l'information.	Web Search, News Search	Oui ⭐⭐⭐⭐
3. France Data Agent	Vérifie les informations auprès des sources institutionnelles françaises.	Web Search ciblé (site:legifrance.gouv.fr, site:insee.fr, site:data.gouv.fr, site:vie-publique.fr) ou APIs/MCP plus tard	Oui ⭐⭐⭐⭐⭐
4. Context Agent	Explique le contexte historique, juridique ou technique qui manque pour comprendre le sujet.	Web Search, Wikipédia, sources spécialisées	Oui ⭐⭐⭐⭐
5. Evidence Agent	Agrège toutes les preuves, détecte les contradictions et construit un graphe d'évidence.	Fusion des résultats des autres agents	Oui ⭐⭐⭐⭐⭐
6. Judge Agent	Produit le rapport final : verdict, confiance, explication et "What would change my mind".	Synthèse LLM	Oui ⭐⭐⭐⭐⭐
Le Planner Agent
C'est le chef d'orchestre.

Exemple :

"Le gouvernement français interdit X"

Il répond :

Sujet : politique française

J'ai besoin de :

✓ France Data Agent
✓ Source Hunter
✓ Context Agent

Pas besoin de :

✗ Scientific Agent
✗ Financial Agent
C'est lui qui donne le côté "agentique".

Le Source Hunter
Il répond aux questions :

Qui a publié ça en premier ?

Est-ce un repost ?

Quelle est la source primaire ?

Cette citation est-elle sortie de son contexte ?

Il produit une timeline simple.

Tweet

↓

Article

↓

Communiqué officiel

↓

Document original
Le France Data Agent
C'est votre différenciation.

Il ne fait qu'une chose :

"Est-ce que les institutions françaises disent quelque chose à ce sujet ?"

Il peut consulter :

Légifrance

INSEE

data.gouv.fr

Vie-publique

Assemblée nationale

Sénat

Le Context Agent
C'est probablement celui qui apporte le plus de valeur utilisateur.

Exemple :

Tweet :

"L'Europe interdit les moteurs thermiques."

Il explique :

ce qui est vrai ;

ce qui est simplifié ;

les exceptions ;

les échéances ;

les décisions précédentes.

Il répond :

"Que manque-t-il pour comprendre correctement cette information ?"

L'Evidence Agent
C'est le cerveau analytique.

Il reçoit tous les résultats :

Source Hunter

+

France Data

+

Context
Puis construit quelque chose comme :

Claim

├── Confirmé par :
│   - Légifrance
│   - Reuters
│
├── Contredit par :
│   - INSEE
│
└── Non vérifié :
    - déclaration du ministre
C'est aussi lui qui pourrait générer un Evidence Graph, très visuel pendant la démo.

Le Judge Agent
Il ne cherche plus rien.

Il répond :

Verdict

Misleading

Confidence

89 %

Pourquoi ?

- Confusion entre une proposition de loi et une loi promulguée.

Ce qui manque

- Décret d'application.

Ce qui changerait notre conclusion

- Publication au Journal Officiel.
Le "What would change my mind" est une excellente façon de montrer que le système raisonne sur son incertitude.

Si vous avez le temps : deux agents bonus
Media Analysis Agent
Il analyse la forme plutôt que le fond.

Il détecte :

langage émotionnel ;

clickbait ;

biais de formulation ;

titres trompeurs ;

statistiques sans source.

Exemple :

Emotional wording

High

Cherry-picked statistics

Likely

Fear framing

Detected
Très démonstratif.

Follow-up Agent (Scheduled Task)
Celui-ci est particulièrement intéressant si vous voulez mettre en avant Mistral Vibe.

À la fin de l'enquête, il peut dire :

"Cette information est encore incertaine. Voulez-vous suivre cette enquête ?"

Puis il crée une tâche planifiée :

Toutes les heures

↓

Recherche de nouvelles preuves

↓

Recalcul du niveau de confiance

↓

Notification à l'utilisateur
C'est une excellente démonstration des capacités de Vibe autour des agents autonomes.

L'architecture que je présenterais au jury
                User
                  │
                  ▼
        ┌─────────────────┐
        │ Planner Agent   │
        └────────┬────────┘
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
Source Hunter  France Data  Context
     └───────────┼───────────┘
                 ▼
        ┌─────────────────┐
        │ Evidence Agent  │
        └────────┬────────┘
                 ▼
        ┌─────────────────┐
        │ Judge Agent     │
        └────────┬────────┘
                 ▼
      Investigation Report
Je choisirais cette architecture parce qu'elle reste simple à expliquer (6 blocs), tout en montrant clairement les concepts que le hackathon cherche à valoriser : un Planner qui orchestre, des agents spécialisés, des tools/MCPs pour accéder aux sources, et une synthèse finale produite par un agent dédié. C'est suffisamment ambitieux pour raconter une vraie histoire, tout en restant réalisable en une journée.


il manquerais pas le un agent sur l'analyse verbale?

Oui, et je pense même que c'est l'agent qui donne de la profondeur au produit. Je ne l'avais pas mis dans les 6 pour rester simple, mais si tu veux vraiment un produit qui impressionne, je l'ajouterais.

En revanche, je ne l'appellerais pas Bias Agent. C'est un peu réducteur.

Je l'appellerais plutôt :

Rhetorical Analysis Agent

ou

Discourse Analysis Agent

Parce qu'il ne cherche pas si c'est vrai. Il cherche comment on essaie de te convaincre.

Son rôle
Il répond à la question :

*"Même si cette information est vraie, est-ce qu'on essaie de me manipuler ?"

Ce sont deux problèmes complètement différents.

Par exemple :

« Les crimes ont augmenté de 30 % dans cette ville. »

Peut-être que c'est vrai.

Mais l'agent peut remarquer :

le chiffre est sorti de son contexte ;

il manque la période ;

il n'y a pas de comparaison nationale ;

le titre est volontairement alarmiste.

Ce qu'il analyse
1. Le langage émotionnel
Il détecte :

peur

colère

indignation

urgence

sensationnalisme

Exemple :

Emotional intensity

█████████░ 90%

Detected:

- "scandale"
- "catastrophe"
- "ils vous cachent"
- "incroyable"
2. Les sophismes (fallacies)
C'est là que ça devient vraiment intéressant.

Il pourrait détecter automatiquement :

Faux dilemme

Généralisation abusive

Cherry-picking

Appel à l'émotion

Homme de paille

Ad hominem

Pente glissante

Argument d'autorité

Exemple :

Detected reasoning issues

✓ Cherry-picking

✓ Appeal to fear

✓ False dilemma
Ça, je trouve que c'est une vraie valeur ajoutée.

3. Le niveau de certitude
Le texte dit-il :

"Il est possible que..."

ou

"C'est absolument certain."

L'agent mesure si le niveau de certitude est cohérent avec les preuves.

4. Les omissions
C'est probablement ce que Grok fait le moins bien.

Exemple :

"L'Union européenne interdit les moteurs thermiques."

Le Context Agent va expliquer la réglementation.

Le Discourse Agent va dire :

"La formulation omet les exceptions, les échéances et le périmètre d'application, ce qui rend le message trompeur."

Ce n'est pas la même analyse.

5. Le framing
Une même information peut être racontée de plusieurs façons.

Exemple :

Titre A :

Les impôts augmentent.

Titre B :

Les investissements publics augmentent.

Même donnée.

Deux narratifs.

L'agent peut détecter ce cadrage.

J'ajouterais même un score
Pas un score de vérité.

Un score de manipulation.

Par exemple :

Rhetorical Analysis

Emotional language:
High

Evidence quality:
Medium

Reasoning quality:
Low

Manipulation risk:
76%
Très parlant pendant une démo.

Je pense même qu'il faut réorganiser les agents
Au lieu de les voir comme des "experts métier", je les verrais comme des étapes d'une enquête.

                 Planner
                     │
     ┌───────────────┼────────────────┐
     │               │                │
     ▼               ▼                ▼
Source Hunter   France Data    Context Agent
     │               │                │
     └───────────────┼────────────────┘
                     │
                     ▼
          Rhetorical Analysis
                     │
                     ▼
             Evidence Synthesis
                     │
                     ▼
              Investigation Judge
Tu remarqueras quelque chose : le Rhetorical Analysis Agent n'utilise presque pas de tools.

C'est un pur agent de raisonnement. Il prend tout ce qui a été collecté et répond à une question très précise :

*"Indépendamment de la véracité des faits, ce contenu est-il présenté de manière honnête ?"

Je trouve que c'est une distinction très forte pour le pitch. Tu peux même dire :

"Nous évaluons deux dimensions indépendantes : la qualité factuelle de l'information et la qualité de son argumentation."

C'est beaucoup plus riche qu'un simple verdict "vrai ou faux", et ça donne au produit une dimension éducative qui, à mon avis, le rend beaucoup plus intéressant.


ajoute dans la table

Je pense que je réorganiserais même la table pour qu'elle raconte une enquête. Chaque agent répond à une question précise.

#	Agent	Question à laquelle il répond	Rôle	Tools / Skills	Visible ?
1	Planner Agent	Comment doit-on enquêter ?	Analyse le contenu, extrait les grandes thématiques et décide quels agents lancer.	Planning, Routing, Task orchestration	⭐⭐⭐⭐⭐
2	Source Hunter Agent	D'où vient cette information ?	Retrouve la source primaire, les reprises, les citations et la chronologie initiale.	Web Search, News Search	⭐⭐⭐⭐
3	France Data Agent	Que disent les institutions françaises ?	Vérifie les affirmations auprès des sources officielles françaises.	Web Search ciblé, Légifrance, INSEE, data.gouv.fr, Vie-publique (API/MCP plus tard)	⭐⭐⭐⭐⭐
4	Context Agent	Que faut-il savoir pour comprendre ?	Ajoute le contexte historique, politique, juridique ou scientifique qui manque.	Web Search, Wikipédia, bases documentaires	⭐⭐⭐⭐
5	Rhetorical Analysis Agent	Comment essaie-t-on de me convaincre ?	Analyse la rhétorique, détecte les biais, sophismes, omissions, langage émotionnel et manipulation potentielle.	LLM reasoning, NLP, Argument analysis	⭐⭐⭐⭐⭐
6	Evidence Agent	Quelles sont les preuves ?	Agrège toutes les informations collectées, détecte les contradictions et construit l'Evidence Graph.	Fusion des résultats des autres agents	⭐⭐⭐⭐⭐
7	Judge Agent	Quelle est notre conclusion ?	Produit le rapport final, le niveau de confiance, les incertitudes et le "What would change my mind".	Synthèse LLM	⭐⭐⭐⭐⭐
Agents bonus (si vous avez le temps)
Agent	Question	Idée
Follow-up Agent	Que se passe-t-il si la situation évolue ?	Planifie des Scheduled Tasks avec Vibe pour surveiller l'apparition de nouvelles preuves et notifier l'utilisateur si le verdict change.
Image / Video Analysis Agent	L'image ou la vidéo est-elle authentique ?	OCR, analyse visuelle, recherche d'origine, détection de contenu sorti de son contexte.
Scientific Agent	Que dit la littérature scientifique ?	Recherche dans PubMed, HAL, Crossref pour les sujets santé et science.
Je pense aussi qu'il y a une légère évolution à faire sur le nom de France Data Agent.

Je l'appellerais plutôt Institutional Evidence Agent.

Pourquoi ? Parce qu'à terme il ne sera pas limité à la France.

Aujourd'hui il interroge :

Légifrance

INSEE

data.gouv.fr

Vie-publique

Demain, il pourrait utiliser :

EUR-Lex (Union européenne)

SEC (États-Unis)

Companies House (Royaume-Uni)

WHO

NASA

Banque mondiale

Le nom devient plus pérenne, tout en conservant exactement la même responsabilité : interroger les sources institutionnelles les plus fiables du domaine concerné. C'est également plus facile à présenter au jury : "Cet agent est spécialisé dans les sources officielles, quel que soit le pays ou le domaine."
