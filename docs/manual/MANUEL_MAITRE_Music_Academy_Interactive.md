# MUSIC ACADEMY INTERACTIVE — MANUEL MAÎTRE DU PROJET

**Version 1.0 — 9 juillet 2026**
**Statut : document de référence unique.** Toute production future (leçons, exercices, solutions, code moteur, assets) se conforme à ce manuel. En cas de conflit entre une conversation passée et ce document, ce document fait foi. En cas de lacune, la section 7 (Règles de travail) définit la procédure d'amendement.

---

## 0. PRÉAMBULE — OBJET ET MODE D'EMPLOI

### 0.1 Objet

Ce manuel consolide l'intégralité de la conception du produit **Music Academy Interactive** : un SaaS professionnel de formation à la composition de musique de film et à l'orchestration, du niveau débutant au niveau professionnel, avec exercices interactifs à correction automatique **entièrement rule-based** (aucune IA externe dans la boucle de correction) et intégration au workflow réel du compositeur (clavier MIDI + Cubase Pro 13).

Le projet a atteint le jalon : **la rédaction du curriculum est close.** Douze modules, ≈152 leçons + ~30 pages de référence, ~179 spécifications d'exercices, 56 solutions de référence, un moteur musical complet et traçable, quatre pièces de portfolio. Il ne reste que de la production (solutions V1, quiz, assets, implémentation logicielle).

### 0.2 Comment utiliser ce manuel

- **Pour produire du contenu** (leçon, exercice, quiz, solution) : sections 4 (conventions) et 5 (modules), annexes A–D.
- **Pour développer le logiciel** : sections 2 (architecture) et 3 (moteur), annexes B, C, F.
- **Pour arbitrer une décision** : section 6 (registre des décisions) — toute décision existante y est actée avec sa justification ; les nouvelles décisions s'y ajoutent.
- **Pour maintenir la cohérence dans le temps** : section 7.

### 0.3 Terminologie et identifiants

- **Module** : `module-NN-nom` (ex. `module-02-melodie`). Abréviation courante : M1…M12.
- **Leçon** : `mNN-lNN-slug` (ex. `m02-l04-developper-2`). Abréviation : `l04 M2` ou `m02-l04`.
- **Exercice** : `mNN-eNN-slug` (ex. `m02-e30-elena-and-you`).
- **Solution de référence** : `mNN-sNN` (miroir de l'exercice).
- **Règle du moteur** : `famille.nom-kebab` (ex. `melody.leap-recovery`, `orch.balance`, `sd.masking`).
- **Règle d'or des identifiants : un ID n'est JAMAIS renommé** (voir §7.2).

---

# 1. VISION DU PRODUIT

## 1.1 Objectif

Former des compositeurs de musique à l'image **opérationnels** : capables de recevoir un brief (« thème du mentor, chaleureux, un peu triste », « la bataille commence, 3 min »), de le traduire en décisions techniques (mode, intervalle-signature, orchestration, courbe de tension), de le réaliser dans un DAW professionnel, et de livrer.

Le produit couvre l'intégralité de la chaîne : théorie fondamentale → mélodie → harmonie avancée → contrepoint → instrumentation → sound design → orchestration → jazz → genres cinématographiques → workflow Cubase → analyse → ressources sonores.

## 1.2 Les cinq principes directeurs

1. **Le vocabulaire du cours EST le vocabulaire du moteur.** Chaque concept enseigné correspond à une règle, une métrique ou une contrainte vérifiable en machine (`findMotifs`, `archFit`, `orch.balance`…). Les leçons citent les règles par leur ID ; le feedback cite les leçons. L'élève apprend un langage que le produit parle en retour. C'est l'exigence d'architecture fondatrice — elle est tenue de bout en bout du curriculum et doit le rester.

2. **Correction rule-based, jamais d'IA générative dans la boucle.** L'évaluation repose sur des algorithmes d'analyse musicale déterministes et des règles déclaratives pondérées. Avantages assumés : explicabilité totale (chaque point perdu cite sa règle et sa leçon), reproductibilité, coût nul par soumission, pas de dérive. Conséquence : tout ce qui est exigé d'un élève doit être **vérifiable mécaniquement** — c'est un filtre de conception permanent sur les exercices.

3. **Le workflow réel.** L'élève travaille avec son clavier MIDI et Cubase Pro 13. Le produit n'est pas un jeu à côté du métier : il exporte et ré-importe du MIDI (flux C), enseigne le DAW lui-même (Module 10), et ses missions avancées se **prouvent** par le fichier livré, pas par des cases cochées.

4. **Jamais de reproduction d'œuvres protégées** (charte du produit). Les leçons enseignent des *principes* (progressions-types, gestes, recettes), jamais des partitions ou extraits d'œuvres existantes. Tout exemple musical est original. Le corpus d'analyse (Module 11) est à deux étages : interne vérifiable en machine (pièces originales du produit) / répertoire abordé en principes seulement. Les ~400 clips de la sonothèque (M12) sont produits en interne. Le guide d'équipement enseigne des catégories et des critères, jamais des marques imposées (neutralité commerciale).

5. **La pédagogie du feedback.** Chaque règle du moteur porte un bloc `pedagogy { why, how, when, commonMistake, alternative }`. Le rapport de correction n'est pas une sanction : c'est un mentor qui explique pourquoi, montre comment, indique quand la règle s'applique (et quand elle ne s'applique pas — les profils de style désactivent des règles), nomme l'erreur classique et propose l'alternative.

## 1.3 Philosophie du cursus

- **De la matière au métier.** M1 livre les matériaux (intervalles, gammes, fonctions, cadences) ; les modules suivants enseignent des métiers (le thème, l'orchestration, le mix, l'analyse). Chaque module retourne les acquis précédents comme outils.
- **Composer = développer, pas inventer.** Doctrine mélodique centrale : ~60 % d'un thème est réorganisation d'une cellule. Les débutants inventent trop ; les professionnels développent.
- **La règle avant l'écart.** On enseigne la norme (résolution des tensions, conduite des voix), puis l'écart comme choix conscient (le thriller évite la résolution ; l'épique assume les quintes parallèles). Les profils de style (§3.6) encodent cette philosophie : une même règle change de poids selon le style visé.
- **L'oreille avant le crayon.** Exemples jouables partout (composant `MusicExample`, bouton ▶), ≥1 question jouable par quiz, le test des trois écoutes comme protocole permanent.
- **L'élève finit par produire ses propres consignes.** Le cursus va des exercices contraints aux briefs libres (m02-e30 part 2 : l'élève écrit son propre brief) jusqu'à l'analyse en autonomie (m11-e08) et au portfolio.

## 1.4 Le rôle du compositeur tel qu'enseigné

Le compositeur de film que forme le produit : traduit des briefs émotionnels en curseurs techniques ; conçoit des thèmes **déclinables** (un thème non déclinable est une impasse de production) ; orchestre en rôles et en étages, pas en tas ; gère le temps de l'auditeur (attente, surprise, dette de tension) ; livre proprement (stems, tempo track, spotting) ; analyse en continu (trois régimes : passant, ciblé, projet) ; vole des **procédés**, jamais des notes (éthique de m11-l08).

## 1.5 Public et progression

Débutant complet → professionnel. Gamification sobre : XP par exercice, niveaux, badges de module, gating `minLevel` (les modules 5 et 9 exigent le niveau atteint en sortie de M1+M2, ≈ niveau 9–10 pour ~6 600 XP cumulés). Le Module 12 fait exception : ressource ouverte dès M5, sans badge ni progression (« la banque est un lieu, pas un trajet »).

**Portfolio de sortie (4 pièces maîtresses)** :
| Pièce | Exercices | Nature |
|---|---|---|
| Diptyque « La Remise » | m10-e15 (version orchestrale/DAW) + m06-e15 (version hybride) | le même cue à l'image, deux mondes sonores |
| Triptyque « Trois palettes » | m03-e18 | la même scène en trois systèmes harmoniques |
| Cue « Elena » | m07-e10 (48 mes.) — thème né en m02-e30 | le fil narratif du cursus, orchestré |
| « Le standard » | m08-e15 | un AABA original de jazz écrit |

---

# 2. ARCHITECTURE DU SYSTÈME

## 2.1 Vue d'ensemble

**Monolithe modulaire** (NestJS) — pas de microservices au lancement. **Monorepo Turborepo** :

```
/
├── apps/
│   ├── web/          Next.js 14+ (App Router), TypeScript, Tailwind, Zustand
│   └── api/          NestJS, PostgreSQL, Prisma, auth JWT
├── packages/
│   ├── music-core/   le moteur musical — TypeScript PUR, isomorphe
│   │                 (zéro dépendance DOM/Node : tourne en Web Worker
│   │                 côté client ET en process côté serveur)
│   ├── shared/       schémas Zod (specs, contraintes, payloads),
│   │                 types partagés, validation
│   └── content/      leçons MDX, specs d'exercices JSON, quiz,
│                     solutions de référence, assets référencés
```

**Doctrine d'isomorphisme** : `music-core` est la source de vérité unique de toute analyse musicale. Le client et le serveur exécutent LE MÊME code — jamais deux implémentations d'une règle.

## 2.2 Représentation musicale

- **Note** : `{ pitch: number (MIDI, C4=60), start: number, duration: number, velocity?: number }` — temps en **ticks, 480 PPQ**.
- **Part** (multi-pistes, introduit en M7 — décision actée, solde F-14) : `{ instrumentId, notes: Note[], dynamics?, articulations?, cc?: … }`. Les soumissions mono-flux restent un `Note[]` simple.
- **Layer / LayerStack** (M6, sound design — modèle **déclaratif**) : l'élève déclare ses couches (`role: sub|body|top|texture|movement|fx|melodic`, `band` en Hz, enveloppe ADSR, `motion`, `sidechainedBy`, champ `removed` pour la soustraction). Le produit **n'analyse pas d'audio** : il juge la déclaration + le MIDI. Décision fondatrice du M6.
- **Notation textuelle** (annexe A) : format d'écriture des exemples et solutions — `C4:q`, accords `[C4+E4+G4]:h`, silences `r:q`, liaisons `~`, mesures `|`.

## 2.3 Les trois flux d'exécution

| Flux | Où | Usage | Contrainte |
|---|---|---|---|
| **A — Live** | client, Web Worker | feedback temps réel pendant la saisie (Melody Practice, éditeurs) | latence < 150 ms |
| **B — Soumission** | serveur | correction officielle, scorée, persistée ; alimente XP/progression | même code que A (isomorphisme) |
| **C — Aller-retour MIDI** | export/import | l'élève exporte la mission en MIDI, travaille dans Cubase, ré-importe ; le serveur vérifie le fichier livré | fondement des DAW_MISSION niveau « PROUVÉ » |

## 2.4 Backend

- **API REST** `/api/v1`, ~30 endpoints (auth, users, progression, modules/leçons, exercices, soumissions, feedback, quiz, portfolio, MIDI import/export, banque M12).
- **PostgreSQL + Prisma.** Entités principales : User, Progress, Module, Lesson, Exercise, Submission, FeedbackReport, QuizAttempt, Badge, PortfolioPiece, SolutionFixture.
- **Auth JWT** (access + refresh).
- **Enum `ExerciseKind`** : `THEORY_QUIZ`, `EAR_TRAINING`, `MELODY_COMPOSE`, `HARMONIZE_MELODY`, `CHORD_PROGRESSION`, `COUNTERPOINT`, `ORCHESTRATE`, `LAYERING`, `DAW_MISSION`, `ANALYSIS`, `REFERENCE` (pages de ressource M12, non notées).
- **FeedbackReport** : `{ score: 0–100, issues[] (plafonnées — le rapport ne noie jamais l'élève), strengths[], improvedVersion? }`. Contrainte dure : `improvedVersion` modifie **≤ 30 %** des notes de l'élève — le moteur améliore, il ne recompose pas.

## 2.5 Frontend

- Next.js App Router ; état client Zustand ; Tailwind.
- **Design system** : thème sombre, fond `#0B0D10`, accent doré `#E8B44A` ; UI sobre orientée lecture longue + éditeurs.
- **Composants clefs** : Course Reader (rendu MDX + `<MusicExample>` jouable + `<QuizBlock>` + `<LessonFooter>`), Piano Roll / éditeur de saisie (clavier MIDI supporté), **StaffLite** (rendu de portée léger, MVP) → migration **VexFlow** en V1, éditeur LayerStack (M6), éditeur Part[] multi-pistes (M7), vues d'annotation ANALYSIS (M11), mode `canonShadow` (M4 : le fantôme de la voix qui suivra, affiché décalé pendant la saisie du canon).
- Lecture audio : synthèse client des exemples et soumissions (▶ omniprésent).

## 2.6 Structure du contenu (`packages/content`)

```
content/
├── modules/module-NN-slug/
│   ├── lessons/mNN-lNN-slug.mdx
│   ├── exercises/mNN-eNN-slug.json
│   └── quizzes/mNN-lNN-quiz.json
├── solutions/mNN/mNN-sNN.json      { exerciseId, notation, authorNotes }
├── reference/ (M12 : fiches, guides — kind REFERENCE)
└── assets/ (audio, vidéo « La Remise », clips M12)
```

Le contenu est **compilé et validé au seed** : schémas Zod (`packages/shared`), parseur de notation (annexe A), verrous CI (§3.9).

## 2.7 Roadmap (rappel — figée)

| Phase | Sprints | Contenu |
|---|---|---|
| Phase 0–1 : moteur | S1–S8 | music-core complet + fixtures + CI |
| MVP | S9–S16 | M1, M2, M5 (11 fiches), M9 (4 genres) ; Reader, éditeurs, flux A/B ; ~59 leçons, 79 specs, 56 solutions |
| Beta | S17–S20 | flux C (MIDI), calibrage seuils sur soumissions réelles |
| V1 | S21–S32 | M3, M4, M6, M7, M8, M10, M11, M12 ; VexFlow ; paiement Stripe ; canonShadow ; vues ANALYSIS |

---

# 3. LE MOTEUR MUSICAL ISOMORPHE (`packages/music-core`)

Le moteur se compose de quatre couches : **analyseurs** (extraient des faits), **règles** (jugent les faits, pondérées par style), **checkers de contraintes** (vérifient la conformité à la spec d'exercice), **générateur de feedback** (assemble le rapport pédagogique).

## 3.1 Analyseurs — tonalité et harmonie

| Fonction | Rôle | Points de conception actés |
|---|---|---|
| `estimateKey()` | détection de tonalité : corrélation de Krumhansl sur les 24 profils majeur/mineur, **puis passe modale** (inférence dorien/mixolydien/lydien/phrygien…) ; rend `{ tonic, mode, confidence, ambiguous, alternates[] }` | **F-11** : la contrainte `requireAmbiguousKey` s'évalue sur la confiance des **24 profils bruts, avant** la passe modale — l'ambiguïté est une propriété du matériau, pas de l'étiquette |
| `detectChord()` | dictionnaire de **14 formes** d'accords, travail en **pitch-classes** (insensible à l'enharmonie — F-6, verrouillé par fixtures) ; triades exigées complètes, la quinte est `optional` uniquement sur les accords de 7e (règle d'écriture F-3) ; qualifie les notes étrangères (table des six : passage, broderie, appoggiature, retard, anticipation, échappée — arrivée/départ/position) | |
| `functionOf()` | fonction tonale T/S/D d'un accord dans une tonalité | |
| `detectCadence()` / `detectProgression` | ponctuations : parfaite, imparfaite, demi, rompue, plagale | **F-5** : en mode segment, une cadence n'est enregistrée que si l'accord d'arrivée **tient ≥ 1 mesure ou termine le segment** (une résolution de passage n'est pas une ponctuation). **F-2** : fallback monophonique — sur une mélodie seule, `requiredCadence: "perfect"` ⇔ pénultième ∈ {7̂, 2̂} + finale 1̂ longue sur temps fort ; `half` ⇔ finale ∈ {5̂, 2̂} suspendue |
| `detectCollection()` (M3) | reconnaît les collections non diatoniques : tons entiers, octatonique, quartal, clusters, polyaccords, pandiatonisme | alimente les leçons du « Système 3 » et le capstone tri-palettes |
| détection d'idiomes | ~10 idiomes tagués **par comportement** (napolitain, sixtes augmentées It/Fr/Ger — Ger⁶ ≡ V7 enharmonique —, dim7 pivot, médiantes chromatiques, planing, line cliché, subV, back-door…) | le tag neutralise les règles fonctionnelles concernées (ex. quintes parallèles créditées en planing — la « dette » historique de la matrice de style est soldée en M3) |

## 3.2 Analyseurs — mélodie

| Fonction | Rôle | Points de conception actés |
|---|---|---|
| `findMotifs()` **v2** | représentation d'un motif en trois couches séparables : `intervalShape` (suite d'intervalles), `rhythmShape` (durées **en ratios** relatifs à la première note), ancrage. Variations reconnues : `exact`, `transposed` (réelle, **et tonale à ±1 dt si les signes du contour sont identiques ET le rythme conservé — F-12**), `rhythmic` (**y compris l'augmentation/diminution uniforme, invisible aux ratios : comparaison du facteur d'échelle absolu, seuil ≥1.5 ou ≤0.67 — F-10**), `inverted` (miroir : gardes ≥3 intervalles + rythme conservé). Rend `{ motifs, bestMotif, hasVariedRepetition, maxExactRepetitions, fragments[] }` | fragmentation : sous-motifs (≥3 notes) à ≥3 occurrences **hors** occurrences complètes (covered-set), avec drapeau `isDistinctive` (le fragment porte l'aspérité du parent : l'intervalle max ou la durée la plus atypique) — le feedback distingue « tu fragmentes le remplissage : martèle l'aspérité » |
| `contour()` | chaîne U/D/R segmentée ; appariement aux **5 silhouettes** : arche, chute (lament), ascension, vague, plateau | |
| `leapProfile` | ratios conjoint/disjoint, intervalles présents, plus grand saut, récupération des sauts | |
| `phraseAnalysis()` | frontières de phrases (silences, réattaques), détection d'**élision** (frontière sans silence + réattaque sur temps fort), structures `period` (antécédent/conséquent) et `sentence` (1+1+2 : dire, redire, précipiter, conclure) | |
| `tensionCurve()` | courbe de tension 0–1 (termes : hauteur relative, densité, dissonance, `surprise`) ; comparée aux gabarits par `archFit()` | |
| `archFit()` | corrélation de Pearson entre la courbe rééchantillonnée (16 pts) et le gabarit du mood — **régime spécial « platitude + altitude »** pour les gabarits à faible variance (mysterious, scifi), où Pearson est instable : note alors la platitude et l'altitude moyenne (50/50) | + `tensionHarmonyCoupling()` pour `jazz_ballad` : les pics de tension doivent tomber sur des tensions harmoniques (9/11/13) — « le climax sur la 9, pas sur la tonique » |

**`MOOD_TEMPLATES`** : **15 gabarits** de 16 points, chacun sourcé à sa spécification qualitative de leçon (annexe D) : `default, heroic, sad, lullaby, tension, ambiguous_dark, joyful, epic, romantic, mysterious, scifi, western, jazz_ballad, elena` + alias déclaratifs (`bittersweet→sad`, `wonder→scifi`, `playful/comic→joyful`…).

## 3.3 Analyseurs — conduite des voix et contrepoint

- `voiceLeading` : quintes/octaves parallèles (`parallelPerfects`), espacement (`vl.spacing`), doublure de sensible, résolution des sensibles et des septièmes. **Exceptions codées** (chacune avec message dédié) : sensible frustrée en voix interne (→5̂), octave/quinte cadentielle au soprano par degré, **sensible de passage** (F-1 : approchée par degré supérieur ET quittée par degré inférieur dans une ligne conjointe ≥3 notes, hors position cadentielle → rétrogradée en suggestion), **idiome « la sensible de V/V devient la 7e de V »** (extension F-1 : trajet chromatique descendant idiomatique, tagué).
- **Contrepoint 5 espèces** (M4) — codé AVANT le contenu (décision de méthode) : 1re (verticalités, méthode fin-début-climax), 2e (note de passage), 3e (catalogue passage/broderie/double broderie/cambiata), 4e (retard : préparation-suspension-résolution, chaînes 7-6), 5e (fleuri, `texturePlan`). Détections d'imitation : canon (avec `canonShadow` côté UI), strette, sujet/contre-sujet invertible (fugato).
- **Juge double** (M8, walking bass) : la même ligne est évaluée par la grille Fux (conduite) ET la grille jazz (cible→approche→chemin) — deux rapports fusionnés.

## 3.4 Analyseurs — rythme et jazz

- `rhythmProfile` : densité, entropie, syncopes (fenêtres `syncopationTarget [min,max]`), asymétries (3+3+2), corrélation durée×poids métrique (prosodie).
- **Swing** (M8) : `swingRatio` mesuré / `swingTarget` de spec — le ratio attendu **suit le tempo** (plus c'est rapide, plus c'est droit) ; accent sur le « et » ; la pulsation de référence reste droite dans les ticks (le swing est déclaré, pas quantifié).
- `chordScaleCheck` (M8) : conformité note-à-accord dans le système chord-scale ; **les avoid notes passent** (elles ne s'exposent pas) ; réindexation des acquis M1+M3 en horizontal/vertical.

## 3.5 Analyseurs — orchestration et sound design

- **`InstrumentDef`** (annexe F) : tessiture praticable, sweet spot, `registerZones[]` (couleur textuelle affichée par la règle-mentor `orch.register-color` + drapeau `exposedRisk`), `dynamicPower {pp, ff}` (1–10), `agility`, `sustain: unlimited|breath|lips|decay`, rôles par fréquence réelle, `blendsWith/avoidWith` (paires symétriques, contextualisées : « unisson ff », « solos concurrents »), transposition, `notes` (sourdines, variantes).
- **`effectivePower()`** : interpolation pp→ff par la vélocité, corrigée par zone pour les cas de fiche (la flûte : la puissance croît avec la hauteur, ×0.4→×1.6).
- **`ENDURANCE_BUDGET`** : mesures de jeu continu avant repos requis — `breath {8, aigu 6}`, `lips {12, aigu 4}` (calibrage beta).
- **`densityMap`** : occupation du spectre par bandes de registre — usage négatif (`orch.density-overload` : le « tas ») et positif (l'épique s'étage : la puissance vient de l'espace couvert).
- Règles `orch.*` : range-violation, register-color (mentor, non punitive), balance, masking, blend-risk, low-interval-limit (jamais serré sous C3), agility, endurance, role-coverage, density-overload…
- **Règles `sd.*`** (M6) : six règles **jumelles des règles orchestrales** (masking spectral, balance de rôles, sur-densité, budget stéréo, tenue/sidechain, cohabitation hybride) — le sound design est enseigné comme « l'orchestration en hertz ».
- **Plans déclaratifs** (M7/M3/M10) : `rolePlan`, `crescendoPlan` (les 5 leviers : effectif→étages→doublures→activité→dynamique), `tensionPlan` (M3 : tension sans dominante, 6 moteurs), `pedalPlan`, `pillarExposure` (modes : exposition des piliers), `forbidFunctionalCadence` (Système 2/3 : « le V7 est un poison »).
- **Checkers DAW** (M10) : `ccCoverage` (couverture CC1), `ccTensionCorrelation` (CC1 ↔ tensionCurve de la pièce), cohérence tempo×timecode (spotting), vérification de ré-import MIDI (niveau « PROUVÉ »).

## 3.6 Les règles et les profils de style

- **~46 règles déclaratives** au registre (familles `melody.*`, `harmony.*`, `vl.*`, `rhythm.*`, `orch.*`, `cp.*`, `sd.*`, `jazz.*`) + extensions V1. Chaque règle : `{ id, severity, weight, detect(), pedagogy { why, how, when, commonMistake, alternative } }`.
- **Profils de style pondérés** (8 au MVP, étendus en V1) : `classical-common`, `romantic-film`, `epic-film`, `thriller-tension`, `neo-noir`, `jazz`, `hybrid-sd`, + `impressionist`, `modern-horror` (M3). Un profil est une matrice de poids sur les règles + drapeaux sémantiques (`repetitionIsPositive: true` en thriller — `melody.monotony` à poids 0, `melody.tension-placement` à 0 car la non-résolution est le but ; quintes parallèles à 0.1 en épique ; `melody.leap-recovery` renforcé ×1.3 en romantique où le geste saut+récupération EST le style).
- Les specs peuvent surcharger localement : `styleProfile: { id, targetMood, ruleWeights: {...} }`.

## 3.7 Le pipeline de correction (flux B)

```
Submission (Note[] | Part[] | LayerStack | annotations | MIDI)
  → parse + validation Zod
  → analyseurs (faits)
  → checkers de contraintes (conformité à la spec)       → constraints /100
  → règles pondérées par le profil (issues, plafonnées)  → correctness /100
  → métriques positives (craft : motif développé, arche, couplages…) → craft /100
  → score = pondération de la rubric de la spec { correctness, constraints, craft }
  → FeedbackReport (issues citant règle+leçon, strengths, improvedVersion ≤30 %)
```

## 3.8 Le kind ANALYSIS (M11) — six types d'annotations

L'élève annote des pièces du **corpus interne** (dont le produit possède l'intention de génération — vérité terrain) :

1. `mark-occurrences` — cliquer les occurrences d'un motif et leurs variations ;
2. `label-segments` — segmenter la forme et nommer les sections ;
3. `name-chords/functions` — chiffrer accords et fonctions ;
4. `identify-idioms` — pointer les idiomes (tags du moteur retournés en détecteurs) ;
5. `draw-tension` — dessiner la courbe de tension au doigt, comparée à la courbe machine ;
6. `role-map` — cartographier les rôles orchestraux par couche.

Le reverse-engineering (m11-e07) ajoute le **différentiel de reconstruction** : comparaison note à note par couche entre la maquette de l'élève et le MIDI de référence (mélodie ≥90 % attendue, voix internes créditées par proximité), avec « carte des écarts » par famille comme diagnostic de formation.

## 3.9 Gouvernance du moteur et verrous CI

- **Un ID de règle n'est jamais renommé** ; toute modification de comportement = bump de `engineVer` (les scores historiques restent interprétables).
- **≥ 10 fixtures par règle** (cas positifs, négatifs, limites) ; chaque exception codée a ses fixtures dédiées (F-1 : +5 ; F-12 : +6 dont 2 négatives ; F-6 : 3 fixtures d'enharmonie qui verrouillent l'insensibilité au spelling contre un futur refactor).
- **Verrous CI du contenu** (3 + 1) :
  1. **Complétude** : toute clé de contrainte utilisée par une spec a un checker implémenté ;
  2. **Résolubilité** : chaque solution de référence, compilée et soumise au pipeline complet, obtient **score ≥ 85** et satisfait toutes les contraintes (`test.each(loadSolutions())`) ;
  3. **Round-trip** : notation → Note[] → notation stable ;
  4. **Auto-cohérence des gabarits** : la solution de chaque leçon d'ambiance obtient `archFit ≥ 0.6` sur SON mood et un score inférieur sur les moods antagonistes déclarés (joyful↔sad, epic↔scifi, heroic↔mysterious). Si un gabarit ne sépare pas ses propres exemples, on recalibre le gabarit, pas la fiche.
- **Ordre des PR** : patchs moteur (findings) AVANT les solutions qui en dépendent.
- **Échec bruyant** : id inconnu (instrument, règle, mood) = exception, jamais de fallback silencieux.

---

# 4. CONVENTIONS PÉDAGOGIQUES

## 4.1 Gabarit de leçon (MDX) — obligatoire

```mdx
---
id: mNN-lNN-slug
module: module-NN-slug
title: "Titre en français"
estMinutes: 20–35
skills: { melody: 0.7, harmony: 0.3 }   # somme = 1.0 ; alimente la progression par compétence
---
```

Structure du corps, dans l'ordre :

1. **« Pourquoi … »** — l'accroche : pourquoi ce concept existe et ce qu'il permet (jamais « dans cette leçon nous verrons »). Une leçon commence par un enjeu de métier.
2. **Sections numérotées `### 1. … ### N.`** — le contenu : concepts, tables de référence, schémas ASCII (courbes de scène, coupes de registre), blocs `code` pour les protocoles pas-à-pas.
3. **`<MusicExample id="…" title="…">`** — exemples **originaux** en notation textuelle (annexe A), toujours jouables, suivis d'un commentaire de dissection. Consigne systématique de rejouer/vérifier au clavier.
4. **« Erreurs fréquentes »** — table `| Erreur | Symptôme | Correction |` (le symptôme est optionnel dans les fiches courtes). Cette table est **le gisement officiel des distracteurs de quiz** (charte, §4.3).
5. **« Alternatives »** quand pertinent (variantes intérieures au genre, frontières avec les genres voisins).
6. **Récapitulatif** — checklist `- [ ]` de 4–6 lignes, une idée par ligne.
7. **`<QuizBlock id="mNN-lNN-quiz" questions={N} />`** (N = 5–8).
8. **`<LessonFooter exercises={["mNN-eNN-…", …]} />`** — la mission en pied de leçon.

**Règles de rédaction** :
- Tutoiement de l'élève ; ton de mentor exigeant et chaleureux ; formules mémorables assumées (« la doublure se mérite », « le V7 est un poison », « l'ostinato ne varie pas : il recrute »).
- **Renvois croisés systématiques** : chaque concept réutilisé cite sa source (`l16 M1`, `§10.2`) — le cursus est un réseau, chaque leçon l'entretient.
- Les règles du moteur sont citées par ID dans le texte quand la leçon les légitime.
- Principes uniquement, jamais d'extraits d'œuvres protégées (rappel en tête des leçons de genre).
- Les valeurs numériques enseignées (fenêtres de climax, ratios, seuils) sont **les mêmes** que celles des contraintes — jamais de divergence cours/moteur.

## 4.2 Gabarit de spec d'exercice (JSON)

```json
{ "id": "mNN-eNN-slug", "lessonId": "mNN-lNN-slug",
  "title": "…", "kind": "MELODY_COMPOSE",
  "difficulty": 1-10, "xpReward": 50-350,
  "skills": { "MELODY": 1.0 },
  "spec": {
    "prompt": "consigne complète, citant les sections de leçon (l0X §N)",
    "given": { "key": {...}, "notation": "…", "chords": [...] },
    "constraints": { ... },          // clés du registre — annexe C
    "styleProfile": { "id": "…", "targetMood": "…", "ruleWeights": {...} },
    "rubric": { "correctness": 20, "constraints": 45, "craft": 35 }  // somme 100
  } }
```

- Défauts : version 2, métrique 4/4, rubrics standards par kind.
- **`variants[]`** : l'exercice propose 2+ jeux de contraintes, l'élève en choisit UN avant de composer (la soumission porte `variantId`) — pour les consignes « décide laquelle avant d'écrire ».
- **`submissionParts[]`** : exercice multi-soumissions séquentielles (capstones bi/tri-parts) ; une part peut porter `userBrief: true` (l'élève saisit son brief, stocké et affiché dans le rapport). `variants` et `submissionParts` sont mutuellement exclusifs avec les contraintes racine (validation Zod au seed).
- **Filtre de conception** : toute exigence du prompt doit avoir sa clé de contrainte vérifiable, et réciproquement le prompt doit annoncer ce qui sera vérifié. Quand `requireFragmentation` est actif, dimensionner `minMotifOccurrences` sur les occurrences complètes du plan dramatique (règle F-13).
- Difficultés typiques : drills 3–4, compositions 5–7, capstones 8 (XP 250–350, badge de module).

## 4.3 Charte des quiz (5 règles — verbatim, à appliquer mécaniquement)

1. **Chaque question teste UN point de la leçon, cité par section** dans le `why` — le quiz est une table des matières déguisée ;
2. **Les distracteurs sont les erreurs fréquentes de la leçon** (la table « Erreurs » de chaque leçon EST le gisement de mauvaises réponses) — jamais de distracteurs absurdes ;
3. **≥ 1 question jouable (`play`) par quiz** quand le sujet s'entend — l'oreille avant le crayon, même en quiz ;
4. **La dernière question est intégrative** : elle croise la leçon avec une leçon antérieure (le quiz entretient le réseau, pas seulement le nœud) ;
5. **Le `why` enseigne même quand on a juste** — deux phrases max, la règle et son pourquoi.

Format : `{ "id": "mNN-lNN-quiz", "interaction": "mc" | "roll-pick" | générateur, "items": [ { q, play?, options[], answer, why } ] }`. Correction serveur ; les quiz à générateur (drills EAR, silhouettes, défi de la palette M12) sont rejouables à l'infini.

## 4.4 Solutions de référence

- Fichier `test/solutions/mNN/<exerciseId>.json` : `{ exerciseId, notation, authorNotes }` — compilé par le parseur, soumis au pipeline complet par le verrou CI n° 2 (score ≥ 85, toutes contraintes satisfaites).
- **La composition se fait contre les règles telles que codées** : chaque friction moteur/pratique musicale devient un **finding** (annexe E), traité AVANT le merge du lot. Rendement constaté : **1 finding / 4 solutions** — c'est la moitié de la valeur du travail, et le meilleur investissement qualité du produit.
- Règles d'écriture : triades complètes sur toute verticalité porteuse de fonction (F-3, quinte omise réservée aux 7es) ; homophonie pour les solutions harmonisées en notation textuelle (mono-flux — les rythmes de voix indépendants exigent `Part[]`, F-14) ; `authorNotes` documente les choix, les pièges rencontrés et les réécritures (matière pédagogique réutilisée par le feedback).
- Coût constaté : ~45–55 min/solution harmonique (vérification VL paire à paire), ~20 min/solution mélodique.

## 4.5 Gabarits transversaux spécialisés

- **Fiche d'instrument (M5/M12)** — rubriques fixes : Carte d'identité (table : tessiture, sweet spot, agilité, tenue, puissance pp→ff) · « Pourquoi irremplaçable » · Couleur par registre (schéma ASCII de la coupe) · Rôles (table) · Techniques signatures · Associations (croisées et **symétriques** entre fiches) · Erreurs fréquentes ↔ règles `orch.*` · Récapitulatif · Quiz. Les valeurs de la fiche SONT les données d'`instruments.ts` (transcription directe, tracée par `lessonId`).
- **Leçon de genre (M9)** — rubriques fixes : Pourquoi/principe cardinal du genre · Vocabulaire harmonique (table Outil/Construction/Effet/« Vu en ») + progression-type · Mélodie (fiche M2 appliquée + loi de dramaturgie) · Instrumentation en couches (table COUCHE/INSTRUMENTS/RÔLE) · Tempo, rythme, forme · Construction émotionnelle d'une scène type (schéma ASCII de la courbe) · Erreurs fréquentes · Alternatives intérieures et frontières avec les genres voisins.
- **Fiche d'ambiance (M2 l10–l14)** — les **6 curseurs** : mode · intervalles-signatures · silhouette · prosodie · tempo/registre · gabarit de tension (+ ligne « lexique » pour les idiomes western/néo-noir/jazz). Chaque fiche calibre son `MOOD_TEMPLATE` et a son exercice jumeau (leçon et gabarit se valident mutuellement).
- **DAW_MISSION (M10)** — trois niveaux : **déclaratif** (checklist auto-déclarée), **PROUVÉ** (le MIDI ré-importé est vérifié par les checkers), **guidé** (pas-à-pas). Toute mission indique son niveau ; le capstone est PROUVÉ.
- **Page REFERENCE (M12)** — fiche du lexique unifié, cherchable par registre/rôle/émotion, armée de ses clips sonores.

---

# 5. LES MODULES DU CURSUS

## 5.0 Vue d'ensemble et progression

| # | Module | Leçons | Exercices | Tier | Dépendances |
|---|---|---|---|---|---|
| M1 | Fondamentaux | 25 | 49 | MVP | — |
| M2 | Mélodie | 15 | 30 | MVP | M1 |
| M3 | Harmonie avancée | 18 | ~18 | V1 | M1 |
| M4 | Contrepoint | 12 | ~12 | V1 | M1, M2 |
| M5 | Instrumentation | 11 fiches (+9 via M12) | banque | MVP (gating minLevel) | M1+M2 |
| M6 | Sound design hybride | 15 | 15 | V1 | M5 |
| M7 | Orchestration avancée | 10 | 10 | V1 | M5, M2 |
| M8 | Jazz | 15 | 15 | V1 | M1, M3 |
| M9 | Genres de film | 4 (extensible) | 8 | MVP (gating) | M1, M2, M5 |
| M10 | Cubase / workflow réel | 15 | 15 | V1 | M5 |
| M11 | Analyse | 8 | 8 | V1 | tout |
| M12 | Banque de sons | ressource (~30 pages) | 1 generator | V1 | ouvert dès M5, sans badge |

**Logique de progression** : M1–M2 = le socle obligatoire ; M5+M9 = l'application MVP (gated) ; V1 déploie la profondeur (M3/M4), les mondes sonores (M6/M7), les idiomes (M8), le métier réel (M10), le retour réflexif (M11) et la ressource (M12). M11 exige le maximum d'acquis : il retourne tout le bestiaire de tags en détecteurs.

## 5.1 M1 — Fondamentaux (25 leçons, m01-e01→e49)

Trajet : notes/clavier → intervalles (+ table des sens « cinéma ») → gammes majeures → degrés → cycle des quintes → gammes mineures (les trois formes, « les deux mondes ») → modes (les 7, notes-signatures) → rythme et syncope (fenêtres, 3+3+2) → dynamiques/budget de nuances → triades → charpente/habillage (mélodie↔accord) → basse et renversements (low-interval-limit) → accords de 7e et guide tones → **tension/résolution** (la leçon-concept : dette et remboursement, arche, l'évitement comme choix de style) → fonctions T-S-D (le récit) → cadences (les 5) et la période → enrichissements (sus, add9, maj7 ; « D laissé net ») → tensions jazz (9/11/13 : appoggiatures institutionnalisées) → dominantes secondaires et chaînes → subV tritonique (« la porte devient couloir ») → emprunts modaux — **les trois portes** : tirer (V/x), glisser (subV/basse chromatique), voiler (iv et les emprunts) → figures chromatiques (les six étrangères) et line cliché → gear change légitime → modulations (pivot notarié : établir-pivoter-confirmer) → médiantes chromatiques (fil de note commune) → synthèse : la pièce « Départ » + **protocole d'analyse en 7 étapes**.

## 5.2 M2 — Mélodie (15 leçons, m02-e01→e30)

Deux actes. **Le métier (l01–l09)** : mémorabilité (contrat identité/économie/familiarité organisée ; les 5 propriétés mesurables ; test des trois écoutes) · le motif (3 couches séparables ; **4 archétypes : l'appel, le pas, le soupir, le signal** ; test de développabilité) · développer I (répétition = ancrage « deux fois pareil, la troisième différente » ; transposition tonale/réelle ; séquence : 3 occurrences max, une destination ; le **sentence 1+1+2**) · développer II (échelle de variation : augmentation, inversion, rétrograde = générateur privé, **fragmentation = la crise**) · contour (5 silhouettes ; sommets progressifs ; réserver un étage) · phrase (extension, compression, **élision** ; 3 calibres de silence) · attente (**60/30/10** confirmer/dévier/rompre ; les 5 déviations ; toute rupture se rembourse) · négociation mélodie-harmonie (protocole A mélodie d'abord / B grille d'abord ; chaque note a 3 harmonisations ; table des six étrangères ; ratio de friction) · prosodie (5 archétypes ; anacrouse constante ; front-loading). **L'atelier des ambiances (l10–l15)** : 11 moods en fiches à 6 curseurs (joyeuse « la joie est rythmique », triste retenue/lyrique, héroïque « la promesse tenue » vs épique « l'immensité, peu mélodique », romantique « l'élan et sa retenue », mystérieuse « la question entretenue », thriller « l'étau », SF « l'apesanteur », western « la sifflabilité », néo-noir « la ruine de mélodie », jazz « la conversation avec la grille ») · synthèse : **le brief en 8 étapes** et le thème d'« Elena » (cartographe exilée — le personnage-fil du cursus) + le brief libre de l'élève.

## 5.3 M3 — Harmonie avancée (18 leçons)

**La carte des trois systèmes** (fonctionnel / modal / non-fonctionnel — test des trois questions) puis chaque système. **Système 1 (chromatisme fonctionnel)** : napolitain · sixtes augmentées (It/Fr/Ger ; Ger⁶ ≡ V7 : la porte enharmonique) · dim7 pivot (3 objets, 4 visages) · modulation enharmonique (3 clés) · médiantes (la **table des 8 mondes**, chaînes 4+4+4 et 3+3+3+3) · pédale avancée (3 degrés de friction). **Système 2 (modal)** : les 7 modes harmonisés (piliers / l'interdit / la cadence modale — « **le V7 est un poison** » en modal) · mineur mélodique et ses modes (lydien ♭7, altéré, locrien ♮2) · pandiatonisme. **Système 3 (non-fonctionnel)** : tons entiers (le rêve) · octatonique (la menace, « gravité truquée ») · quartal · planing (quintes parallèles créditées) · clusters · polyaccords. **Synthèse** : la tension sans dominante (6 moteurs, `tensionPlan`) · capstone tri-palettes « Trois palettes » (la même scène dans les trois systèmes). Extensions moteur : `detectCollection`, ~10 idiomes, profils `impressionist`/`modern-horror`, `forbidFunctionalCadence`, `pillarExposure`, `pedalPlan`.

## 5.4 M4 — Contrepoint (12 leçons)

Le dialogue (4 mouvements) → les **5 espèces** (1re : verticalités, méthode fin-début-climax ; 2e : le passage ; 3e : le catalogue passage/broderie/double/cambiata ; 4e : le retard préparation-suspension-résolution, chaînes 7-6 — « l'espèce-reine » ; 5e : le fleuri, `texturePlan`) → la sortie du laboratoire (inventaire rendre/garder ; l'appoggiature libre) → 3 voix (le milieu) → imitation (canon avec `canonShadow`, strette) → fugato (contre-sujet invertible, exposition+épisode+strette) → **le contrechant de film** (contrat 3 clauses ; 5 recettes : la réponse, le fleuve lent, la ligne chromatique, le contre-rythme, le descant) → capstone « la scène tissée » (inaugure le **commentaire vérifié** : l'élève justifie, la machine confronte).

## 5.5 M5 — Instrumentation (fiches)

MVP : **10 fiches / 12 pupitres** — violons I+II (une fiche, deux métiers), alto (« le cœur discret »), violoncelle (« basse chantante + ténor lyrique, l'or pur G3–E4 »), contrebasse (« l'interrupteur de gravité »), flûte (« la puissance croît avec la hauteur »), hautbois (« la voix qui focalise, ne se fond jamais »), clarinette (« le caméléon, trois instruments ; la gorge se traverse »), trompette (« l'annonce ; la sourdine est un autre instrument »), cor (« le liant ; l'aigu se paie »), piano (« ce que le piano MENT sur l'orchestre » — la fiche-pont vers l'esquisse honnête). + m05-l01 (intro courte, à rédiger : familles, dynamicPower, logique registre/rôle). V1 via M12 : trombone, tuba, basson, timbales/percussions, harpe, chœur (+ fiches complètes cor anglais, clarinette basse, piccolo si besoin).

## 5.6 M6 — Sound design hybride (15 leçons)

Modèle **Layer/LayerStack déclaratif** (l'élève déclare, le produit n'analyse pas d'audio) ; 6 règles `sd.*` à jumeaux orchestraux. Trajet : synthèse (soustractive : les blocs) → modulation (LFO/enveloppes : la vie) → **le spectre** (7 rôles = « l'orchestration en hertz » ; méthode body→sub→top→vie→**SOUSTRACTION**, champ `removed`) → pads (×5 familles) → textures/drones → basses → keys → leads → plucks/arps → FX (riser ciblé en ticks, impact tri-couche, braam ; reverse/granular : 4 poignées, source-first) → l'espace (reverb/delay, budget stéréo, scène sonore 3D) → la tenue (saturation/glue/**sidechain = de l'écriture**) → l'hybride (« un rôle, un monde » ; 3 protocoles : doublure fantôme, fantôme granulaire, relais d'enveloppe ; **5 lois de cohabitation**) → capstone « La Remise hybride » (`sd.*` + `orch.*` jugent ensemble).

## 5.7 M7 — Orchestration avancée (10 leçons)

Format **`Part[]` multi-pistes** ; `rolePlan`/`crescendoPlan`. Trajet : la distribution (casting en 4 questions ; les **5 lignes mentales : ciel, chant, cœur, corps, socle**) → les doublures (3 distances ; catalogue de 10 alliages ; « **la doublure se mérite** ») → le tapis (voicing en série harmonique ; 2 matières max ; les 3 vies d'un tapis) → le moteur (articulation unifiée ; gradation 6 crans) → le duo ligne/âme (table de casting ; l'échange de hiérarchie) → le crescendo (**5 leviers ordonnés** : effectif→étages→doublures→activité→dynamique ; la fausse décrue) → le tutti (« l'immeuble 5 étages », 3 types) → l'intime (table des solistes ; « le silence organisé » ; zéro doublure) → le protocole esquisse→partition (**7 passes**, checklist anti-mensonges du piano) → capstone « Elena, le cue » (48 mesures). Fil Elena : e05 la garde-robe → e06 la crue → e07 le tutti → e08 la coupure → e10 la forme. **Thèse du module : l'orchestration EST la forme.**

## 5.8 M8 — Jazz (15 leçons)

Ouvre sur le **contrat d'honnêteté** (on enseigne le jazz *écrit*, pas l'improvisation vécue). Trajet : le swing (le ratio suit le tempo ; l'accent sur le « et » ; `swingRatio/swingTarget`) → voicings (shells ; rootless A/B alternés ; zone C3–C5) → ii-V-I (majeur, mineur, tronqué, substitué, back-door, turnaround ; « la cible = la 3 du I ») → le blues (12 mes., blue notes pliées, AAB) → walking bass (cible→approche→chemin, composé à l'envers ; **juge double Fux/jazz**) → chord-scale system (réindexation M1+M3 ; horizontal/vertical ; les avoid notes passent) → bebop (enclosures au temps ; gammes bebop) → la ballade (3 régimes de temps ; spreads ; line cliché ; cadence retardée) → la réharmonisation (5 techniques ; protocole 5 pas ; « les trois vérités d'Elena ») → le solo écrit (territoire→développement→sommet ; motivic development = m02-l04 retourné) → le jazz modal (vamp ; quartal en résidence ; in-out) → big band (4 sections ; thickened line drop 2 ; shout chorus) → combo (comping = ponctuation ; interaction composée) → le jazz à l'image (3 distances : citer/styliser/hybrider ; table des marqueurs par puissance) → capstone « le standard original » (AABA, tri-parts). Le module solde 10 promesses de longue durée du cursus.

## 5.9 M9 — Genres de film (4 leçons MVP, extensible)

Gabarit §4.5. **Romance** (« la retenue qui cède » ; le iv emprunté roi ; le thème donné incomplet d'abord ; la coda qui redescend — toujours) · **Épique** (« l'immensité par étages » ; ♭VII→I au marteau, pas de sensible ; l'ostinato qui **recrute** ; l'immeuble, pas le tas) · **Néo-noir** (« ne jamais résoudre complètement » ; m(maj7), subV-couloir, quartes ; espace et reverb) · **Thriller** (« l'étau », la **vis** : une boucle, un paramètre qui se serre ; sec, pas de reverb ; la résolution appartient à l'image). Extension des genres en V1+ : **par la méthode m11-l06** (protocole de distillation : corpus 5–8 œuvres, trait ≥4/6, test du retrait, ≤10 traits, fiche compilée en contraintes) — le produit fabrique ses futures leçons de genre avec son propre outil d'analyse.

## 5.10 M10 — Cubase Pro 13 / Real-World Workflow (15 leçons)

Format **DAW_MISSION 3 niveaux** (déclaratif / PROUVÉ par ré-import MIDI / guidé). Trajet : le projet bien né → le template 3 tailles → le Key Editor (Iterative Quantize 60 % ; **CC1 : 5 formes ; corrélation CC1↔tensionCurve**) → Expression Maps → MediaBay → routing → le mix du compositeur (gain staging ; le test mono) → Logical Editor/PLE/macros (la macro PREP = une CI locale) → Render in Place/Freeze → la Tempo Track → à l'image (spotting IN/OUT/hits ; l'anti-mickey-mousing) → VariAudio → export/stems → capstone « **La Remise** » (tri-parts, sur la vidéo de 90 s + l'audio « fredon du réal »). Checkers : `ccCoverage`, `ccTensionCorrelation`, cohérence tempo×timecode.

## 5.11 M11 — Analyse (8 leçons)

**Corpus à deux étages** (décision fondatrice : interne vérifiable en machine — les 56 solutions, Elena, les deux Remises, le standard, les pièces générées — / répertoire en principes seulement). Kind ANALYSIS (§3.8). Trajet : le protocole armé (3 passes auditeur/cartographe/artisan ; 6 familles de questions ; **l'hypothèse avant la vérification**) → la biographie de thème (tableau occurrence-transformation-harmonie-porteur ; 3 régimes de leitmotiv) → le diagnostic de système (kit des détecteurs-signatures) → la lecture d'effectifs (la coupe, socle d'abord ; timeline d'effectif ; « indécidable » est un verdict) → le temps (frontières par faisceaux ; autopsie des montées par moteurs ; le spotting inversé) → **la fiche de genre** (protocole de distillation ; mission western : 5 pièces générées + contre-exemple ; la fiche compilée en contraintes — l'exercice méta) → le reverse-engineering (analyse→maquette ; 3 niveaux esquisse/maquette/clone ; la carte des écarts = diagnostic de formation ; règle éthique : corpus interne seul) → synthèse (3 régimes d'hygiène : passant, ciblé, projet ; **3 cahiers** : genres, procédés, idées volées ; capstone « l'enquête en autonomie » avec le **vol légal** : un procédé transplanté, matériau original absent vérifié par `findMotifs` — zéro occurrence).

## 5.12 M12 — Banque de sons (module-ressource)

**Pas un parcours.** Trois composantes : (1) **le lexique des fiches unifié** — toutes les fiches (M5 + pupitres V1 + familles de patchs M6 + alliages M7 + sections M8) sous UN point d'entrée cherchable/filtrable par registre, rôle, émotion ; (2) **la sonothèque de référence** — ~400 clips de 5–15 s produits en interne (registres joués, alliages A/B, articulations), zéro problème de droits — le plus gros chantier d'assets, spécifié par les fiches elles-mêmes ; (3) **le guide d'équipement** — catégories et critères de choix, **jamais de marques** ; gabarits de template pré-câblés par catégories. Format : ~30 pages `REFERENCE` (21 fiches ré-indexées + 9 nouvelles + 3 guides) + un exercice unique rejouable, le « **défi de la palette** » (generator : « trouve trois porteurs pour [émotion × registre] »). **Pas de badge ni de progression** ; ouvert dès M5.

---

# 6. REGISTRE DES DÉCISIONS DE CONCEPTION

Toute décision structurante est actée ici. Une décision ne se rediscute qu'avec un argument nouveau ; l'amendement suit §7.4.

## 6.1 Décisions techniques

| ID | Décision | Justification |
|---|---|---|
| D-T1 | Monolithe modulaire NestJS, monorepo Turborepo | vélocité solo/petite équipe ; découpage futur possible par modules Nest |
| D-T2 | `music-core` en TypeScript pur isomorphe | une seule implémentation des règles client+serveur ; testabilité |
| D-T3 | Correction 100 % rule-based, zéro IA en boucle | explicabilité, coût, reproductibilité (principe fondateur 1.2.2) |
| D-T4 | Note = MIDI + ticks 480 PPQ | interop MIDI directe (flux C) |
| D-T5 | Contraintes déclaratives, `ConstraintsSchema` Zod (~80 clés), validées au seed | le contenu est du data, jamais du code |
| D-T6 | `improvedVersion` ≤ 30 % des notes | le moteur améliore, il ne recompose pas — respect du geste de l'élève |
| D-T7 | Issues plafonnées dans le rapport | pédagogie : ne jamais noyer |
| D-T8 | StaffLite au MVP → VexFlow en V1 | livrer vite, migrer proprement |
| D-T9 | Échec bruyant sur tout ID inconnu | jamais de fallback silencieux |
| D-T10 | Design sombre `#0B0D10` / accent `#E8B44A` | identité pro, studio nocturne |

## 6.2 Décisions pédagogiques et de format

| ID | Décision | Justification |
|---|---|---|
| D-P1 | Gabarit de leçon fixe (Pourquoi/…/Erreurs/Récap/Quiz/Footer) | uniformité, industrialisation, gisement de quiz |
| D-P2 | Renvois croisés systématiques par ID | le cursus est un réseau ; les promesses se soldent (10 promesses soldées par M8) |
| D-P3 | Charte quiz 5 règles (§4.3) | qualité constante à coût mécanique (~25 min/quiz) |
| D-P4 | `variants[]` et `submissionParts[]` (+ `userBrief`) | choix conscients et briefs libres — la sortie du cursus |
| D-P5 | DAW_MISSION à 3 niveaux (déclaratif/PROUVÉ/guidé) | honnêteté : on ne note « prouvé » que ce que le MIDI démontre |
| D-P6 | LayerStack déclaratif, pas d'analyse audio | faisabilité rule-based ; on juge l'intention déclarée + le MIDI |
| D-P7 | Corpus d'analyse à deux étages | droit d'auteur résolu par l'architecture ; vérité terrain machine |
| D-P8 | `Part[]` multi-pistes introduit en M7 | M1–M6 restent mono-flux simples ; F-14 soldé |
| D-P9 | M12 sans badge ni progression, ouvert dès M5 | « la banque est un lieu, pas un trajet » |
| D-P10 | Violons I et II : une fiche, deux métiers | même instrument ; `instruments.ts` garde 2 entrées |
| D-P11 | Genres futurs produits par la méthode m11-l06 | le produit s'auto-étend avec son propre outil |
| D-P12 | Solutions composées contre le moteur codé | la boucle contenu→solution→calibrage (findings) |
| D-P13 | Guide d'équipement en catégories, jamais de marques | neutralité commerciale |
| D-P14 | Exemples 100 % originaux ; principes seulement | charte anti-contrefaçon (principe fondateur 1.2.4) |

## 6.3 Doctrines musicales (conventions harmoniques, mélodiques, orchestrales, analytiques)

Ces doctrines sont enseignées ET encodées ; elles priment en cas d'ambiguïté rédactionnelle.

**Mélodie** : composer = ~60 % développer ; deux fois pareil, la troisième différente ; séquence ≤ 3 occurrences, avec destination ; une silhouette par phrase ; réserver un étage pour le climax (fenêtre canonique 55–80 %) ; budget d'attente 60/30/10 ; toute rupture se rembourse ; front-loading ; anacrouse à politique constante.

**Harmonie** : la tension est une dette, le style est la politique de remboursement ; les trois portes (tirer/glisser/voiler) ; la sensible se résout — sauf exceptions codées (frustrée interne, passage F-1, idiome V/V→7e de V) ; les 7es descendent ; le D reste net dans l'écriture simple ; jamais serré sous C3 (low-interval-limit) ; en modal, « le V7 est un poison » ; les trois systèmes ne se mélangent qu'en conscience (test des 3 questions).

**Orchestration** : penser en rôles et en 5 lignes (ciel/chant/cœur/corps/socle) ; la doublure se mérite ; l'orchestre s'étage, il ne s'empile pas ; l'entrée/sortie des contrebasses est un événement ; l'aigu des cuivres se paie (endurance) ; le piano ment (tenues, densité, grave, dynamique-timbre) — l'esquisse se traduit en rôles ; l'orchestration EST la forme.

**Sound design** : le spectre s'orchestre (7 rôles) ; la soustraction est une écriture (champ `removed`) ; un rôle, un monde (hybride) ; le sidechain est de l'écriture.

**Genres** : la romance retient avant de donner et redescend en coda ; l'épique gravit par paliers et son ostinato recrute ; le thriller est une vis, sec, jamais résolu ; le noir refinance sa dette indéfiniment ; la SF flotte, l'épique gravit.

**Analyse** : l'hypothèse avant la vérification ; le socle se lit en premier ; « indécidable » est un verdict ; on vole des procédés, jamais des notes ; la reconstruction est la seule preuve (corpus interne uniquement).

## 6.4 Registre des extensions moteur par module (traçabilité)

| Module | Extensions actées |
|---|---|
| M2 | `findMotifs` v2 (inversion, fragmentation, F-10, F-12) ; 19 clés de contraintes mélodiques ; 9 gabarits MOOD ; `variants`/`submissionParts` |
| M3 | `detectCollection` ; ~10 idiomes ; profils `impressionist`/`modern-horror` ; `forbidFunctionalCadence`, `pillarExposure`, `pedalPlan`, `tensionPlan` |
| M4 | checkers 5 espèces ; canon/strette ; `canonShadow` (UI) ; `texturePlan` ; commentaire vérifié |
| M6 | `Layer/LayerStack` ; 6 règles `sd.*` ; contraintes riser/impact/braam en ticks |
| M7 | format `Part[]` ; `rolePlan`, `crescendoPlan` ; alliages/doublures vérifiés via `instruments.ts` |
| M8 | `swingRatio/swingTarget` ; `chordScaleCheck` ; juge double walking bass ; voicings rootless |
| M10 | `ccCoverage`, `ccTensionCorrelation` ; tempo×timecode ; vérif ré-import MIDI |
| M11 | kind ANALYSIS 6 annotations ; différentiel de reconstruction ; vérité de génération |
| M12 | index du lexique ; generator « défi de la palette » |

---

# 7. RÈGLES DE TRAVAIL POUR LES PRODUCTIONS FUTURES

## 7.1 Le contrat de cohérence

Avant toute production, vérifier les trois alignements :
1. **Cours ↔ moteur** : toute valeur enseignée existe en contrainte/règle, sous le même chiffre ; toute règle citée existe au registre.
2. **Spec ↔ checker** : toute clé de contrainte a son checker (verrou CI n°1) ; tout prompt annonce ce qui sera vérifié.
3. **Fiche ↔ données** : toute donnée chiffrée (instruments, gabarits) est transcrite de sa fiche, commentaire-citation à l'appui, et **évolue dans la même PR** que la fiche.

## 7.2 Immutabilité et versionnage

- **Les IDs ne sont jamais renommés** (leçons, exercices, règles, moods, instruments). Un contenu déprécié est marqué, jamais supprimé.
- Tout changement de comportement d'une règle ou d'un analyseur = **bump `engineVer`** + fixtures nouvelles (≥ 10 par règle au total ; chaque exception a les siennes).
- Les amendements de specs (findings F-8, F-13, F-14) se font par PR dédiée, documentée dans l'annexe E de ce manuel.

## 7.3 Le protocole de production d'un lot (l'ordre qui marche)

1. Rédiger/relire la **leçon** au gabarit §4.1 (renvois croisés vérifiés) ;
2. Écrire les **specs** §4.2 (chaque exigence ↔ une clé ; nouvelles clés ajoutées à l'annexe C avec leur mécanique) ;
3. Composer les **solutions de référence** contre le moteur codé — consigner chaque friction en **finding** ;
4. Traiter les findings (patch moteur + fixtures, ou amendement de spec, ou règle d'écriture) — **PR moteur avant PR solutions** ;
5. Écrire les **quiz** à la charte §4.3 (distracteurs = table d'erreurs) ;
6. Passer les 4 verrous CI ;
7. Mettre à jour ce manuel (annexes C/D/E/F, registre §6.4) dans la même PR.

## 7.4 Amendement du manuel

Une décision nouvelle ou modifiée : (a) s'inscrit au registre §6 avec ID, date, justification ; (b) référence les sections impactées ; (c) incrémente la version du manuel. Le manuel est stocké dans le repo (`docs/MANUEL_MAITRE.md`) et versionné avec le code.

## 7.5 Backlog de production (état au 9 juillet 2026)

| Lot | Volume | Notes de méthode |
|---|---|---|
| 1. Solutions de référence V1 (M3, M4, M6, M7, M8, M10, M11) | ~120 solutions | dérouler le protocole M1/M2 ; **commencer par M3** (le plus exigeant en calibrage) ; ~45–55 min/solution harmonique, ~20 min/mélodique ; attendre ~1 finding/4 solutions |
| 2. Quiz | ~50 quiz M1/M2 (~135 items, ~21 h) + quiz V1 | production mécanique à la charte ; tables Erreurs + Récapitulatifs = questions et distracteurs prêts |
| 3. Assets | vidéo « La Remise » (90 s, 3 bascules, 2 hits) ; audio « fredon du réal » (30 s) ; ~400 clips M12 ; 2 pièces MVP (e48 « mystère », e08-M5 thème héroïque, ~2 h au gabarit de « Départ ») | les clips sont spécifiés par les fiches elles-mêmes |
| 4. Fronts produit | StaffLite→VexFlow ; paiement Stripe ; mode `canonShadow` ; vues ANALYSIS ; éditeur Part[] ; éditeur LayerStack | roadmap §2.7, S21–S32 |

---

# ANNEXE A — LA NOTATION TEXTUELLE (spécification)

Format d'écriture des exemples (`<MusicExample>`) et des solutions. Compilé par `parseNotation()` ; round-trip garanti (verrou CI n°3).

- **Hauteur** : nom anglo-saxon + octave — `C4` = do central (MIDI 60). Altérations `#`, `b` (`F#3`, `Bb4`).
- **Durée** (suffixe après `:`) : `w` ronde, `h` blanche, `q` noire, `e` croche, `s` double-croche ; pointée par `.` (`q.`) ; liaison par `~` (`E5:h~E5:q` ou `A4~` en fin d'événement, prolongé sur l'événement suivant de même hauteur).
- **Silence** : `r:q`.
- **Accord** (attaque simultanée) : `[C3+E4+G4+C5]:w`.
- **Barre de mesure** : `|` (indicative ; la métrique vient de la spec, défaut 4/4).
- Mono-flux : une seule voix rythmique par flux ; l'homophonie s'écrit en accords ; le polyrythme de voix exige `Part[]` JSON (F-14).
- Suite de hauteurs sans durées (donnés d'exercices « mêmes hauteurs ») : `G4 B4 A4 G4 …`.

# ANNEXE B — REGISTRE DES RÈGLES DU MOTEUR (par famille)

*(comportements normatifs ; la liste exhaustive vit dans `music-core/rules/` — tout ajout se reporte ici)*

- **melody.** : `no-motif` (rien à retenir), `monotony` (≥4 répétitions exactes sans variation — poids 0 en thriller), `climax` (placement/hiérarchie des sommets), `leap-recovery` (saut remboursé en conjoint contraire — renforcé en romantique), `out-of-key` (avec amortisseur ; la dérive de l'étau thriller l'assume), `ending-weak`, `phrase-breathing`, `tension-placement` (0 en thriller).
- **harmony.** : `loop-coherence` (la couture de boucle), `unresolved-seventh`, `retrogression`, `overchromatic` (silencieux quand chaque chromatisme est expliqué/tagué), `tritone-sub-resolution` (le demi-ton de basse, renforçable ×1.5).
- **vl.** : `parallel-perfects` (exceptions : planing tagué, épique 0.1), `leading-tone-resolution` (exceptions F-1 et famille), `spacing`, `doubled-leading-tone`.
- **rhythm.** : `syncopation-target` (fenêtres par style), asymétries, prosodie.
- **orch.** : `range-violation`, `register-color` (mentor : affiche la couleur de zone + `exposedRisk`), `balance` (via `effectivePower`), `masking`, `blend-risk` (paires `avoidWith` contextualisées), `low-interval-limit`, `agility`, `endurance` (budgets breath/lips), `role-coverage`, `density-overload`.
- **cp.** : les contrats d'espèces (consonances/dissonances par position, préparation/résolution du retard, cambiata), imitation/canon/strette.
- **sd.** : les six jumelles spectrales (masking de bande, couverture de rôles, densité, stéréo, tenue/sidechain, cohabitation hybride).
- **jazz.** : conformité chord-scale (avoid en passage), voicings (shells/rootless, zone C3–C5), swing target, cibles de walking.

Sévérités : `error` (points pleins), `warning`, `suggestion`, `info` (mentor). Le profil de style peut re-pondérer chaque règle, jusqu'à 0.

# ANNEXE C — REGISTRE DES CLÉS DE CONTRAINTES (sélection normative)

Générales : `key {tonic, mode}`, `lengthBars [min,max]`, `noteRange [lo,hi]` (MIDI), `segmentBars`, `phraseBarPlan[]`, `requireRestAtBar[]`, `minVoices/maxVoices`.

Mélodie/motif : `mustUseMotif`, `minMotifOccurrences`, `requireMotifVariation`, `requiredVariationTypes[]`, `minMotifCoverage`, `givenCellAsMotif`, `motifType`, `cellArchetypes[]` (call/step/sigh/signal — mécaniques : call = saut ≥5↑ + longue ; step = conjoint ≥80 % ; sigh = 2–3 notes desc. fort→faible ; signal = ≤2 hauteurs + entropie rythmique >0), `requireSequence`/`sequenceMaxRun`, `minTransformations`/`allowedTransformations[]`, `requireFragmentation`, `patternThenDeviation`, `phraseStructure` (period/sentence), `antecedentEndDegrees[]`, `minElisions/maxElisions`, `requireAnacrusis`/`anacrusisPolicy`, `prosodyPlan[]`, `contourShape[]`, `ascendingPhrasePeaks`, `climaxWindow [a,b]`, `climaxMinDuration`, `climaxApproachLeap`, `ambitusMax`, `maxLeap`, `minConjunctRatio`, `maxDistinctPitches`, `minAvgDuration`, `minRestRatio`, `maxPhraseNotes`, `minPerfectIntervalRatio`, `mustContainInterval[]`/`intervalDirection`, `mustExposeDegrees[]`/`minExposureCount`, `mustEndOnDegrees[]`, `strongBeatDegrees[]`, `requireLeadingToneBeforeFinal`, `minChromaticFigures`/`chromaticResolutionRequired`, `requireChromaticDrift {everyBars, semitones}`, `flatTension`, `requireAmbiguousKey` (F-11 ; les contraintes de degrés basculent alors sur le meilleur candidat), `syncopationTarget [a,b]`, `samePitchSequenceAsGiven`.

Harmonie : `requiredCadence` / `requiredCadenceOneOf[]` (F-14), fallback monophonique (F-2), `functionPlan`, `requirePlainTriadCount [a,b]`, `innerChromaticLine[]`, `guideToneVoicing` (F-4 : les doublures ne consomment pas le quota de note libre), `guideToneTargets` (seuil 0.6, {3,7} + {9,13} en profil jazz), `harmonizationVariants`/`structuralNotesCovered`, `tritoneSub`/`mustKeepOneNaturalDominant`, `commonToneThread` (F-7 : le fil d'octave = crédit 0.5), `requireEstablishingCadence`, `forbidFunctionalCadence`, `pillarExposure`, `pedalPlan`, `tensionPlan`.

Multi-pistes/DAW/SD/Analyse : `instrumentPool[]` (aligné au tier — la spec ne référence que des ids existants), `rolePlan`, `crescendoPlan`, contraintes de Layer (rôles requis, bandes, `removed`), cibles FX en ticks, `ccCoverage`/`ccTensionCorrelation`, cibles d'annotation ANALYSIS (vérité de génération), seuils de reconstruction.

**Règle d'ajout** : toute nouvelle clé s'ajoute ici avec sa mécanique de vérification **sur l'existant** — l'objectif permanent : « aucune clé n'exige d'analyse nouvelle » au-delà d'extensions minimales chiffrées.

# ANNEXE D — LES 15 GABARITS `MOOD_TEMPLATES`

16 points 0–1, chacun sourcé à sa spécification qualitative de leçon. Valeurs normatives (recalibrage possible via le verrou d'auto-cohérence uniquement) :

```
default  .10 .15 .20 .25 .30 .35 .40 .50 .60 .70 .85 1.0 .80 .50 .30 .10
heroic   .20 .25 .30 .35 .40 .50 .55 .60 .70 .80 .90 1.0 1.0 .90 .60 .30   (climax haut TENU)
sad      .15 .20 .25 .30 .35 .40 .45 .55 .60 .65 .70 .60 .45 .30 .20 .10
lullaby  .10 .12 .15 .18 .20 .22 .25 .28 .25 .22 .20 .18 .15 .12 .10 .08
tension  .40 .50 .45 .60 .55 .70 .60 .75 .70 .85 .75 .90 .80 .95 .85 .90   (pics jamais résolus)
ambiguous_dark .30 .35 .40 .38 .45 .42 .50 .48 .55 .60 .70 .65 .50 .45 .40 .35
joyful   .25 .35 .28 .40 .32 .45 .35 .50 .40 .55 .45 .60 .50 .45 .35 .25   (micro-pics, pas de creux)
epic     .20 .25 .25 .25 .40 .45 .45 .45 .60 .65 .65 .65 .85 1.0 1.0 .70   (paliers)
romantic .15 .30 .22 .40 .30 .50 .38 .62 .48 .80 1.0 .85 .60 .40 .30 .18   (vagues, coda qui redescend)
mysterious .40 .45 .38 .48 .42 .50 .44 .52 .46 .50 .42 .48 .44 .50 .46 .44 (régime platitude+altitude)
scifi    .45 .48 .50 .48 .52 .50 .48 .52 .50 .54 .52 .50 .52 .50 .48 .46   (idem)
western  .20 .24 .28 .32 .36 .40 .44 .48 .52 .55 .50 .44 .38 .32 .26 .20   (sommet modeste ~60 %)
jazz_ballad .20 .30 .25 .38 .30 .45 .38 .55 .45 .65 .55 .70 .55 .42 .32 .22 (+ couplage tension×harmonie)
elena    .15 .28 .22 .38 .30 .48 .38 .58 .48 .78 1.0 .80 .62 .55 .58 .30   (extension finale qui traîne)
```

Alias : `bittersweet→sad`, `ambiguous-dark→ambiguous_dark`, `wonder→scifi`, `noble-melancholy→sad`, `playful→joyful`, `comic→joyful` (anticlimax : V1).

# ANNEXE E — LES 14 FINDINGS DE CALIBRAGE (F-1 → F-14)

La preuve de la boucle contenu→solution→moteur. Tous traités ; à connaître avant toute production V1.

| ID | Nature | Résolution |
|---|---|---|
| F-1 | Faux positif VL : la sensible **de passage** à la basse (G–F#–E) flaguée | exception codée (approche degré sup. + départ degré inf., ligne conjointe ≥3, hors cadence) → suggestion ; +5 fixtures ; **étendu** à l'idiome « la sensible de V/V devient la 7e de V » |
| F-2 | `requiredCadence` inéchouable en monophonie | fallback mélodique du checker (pénultième {7̂,2̂} + finale 1̂ longue / demi ⇔ {5̂,2̂}) |
| F-3 | Triades incomplètes indétectables | règle d'ÉCRITURE des solutions/givens : triade complète sur toute verticalité fonctionnelle ; quinte omise réservée aux 7es |
| F-4 | `guideToneVoicing` refusait la doublure d'octave pianistique | les doublures de notes présentes ne consomment pas le quota de note libre |
| F-5 | Cadences parasites détectées lors de tonicisations internes | en mode segment, cadence = arrivée **tenue ≥1 mesure ou fin de segment** |
| F-6 | Enharmonie du triton (F–C♭ ≡ F–B) | aucun patch (pitch-classes) ; 3 fixtures verrouillent contre un futur refactor « spelling-aware » |
| F-7 | Note commune de médiante réattaquée à l'octave | le fil est un événement de **voix** : octave = crédit 0.5 + message dédié |
| F-8 | e40 : `tritoneSubOrChromaticBass` × `requiredCadence perfect` piégeux | amendement du prompt : « la substitution ne peut pas remplacer la dominante FINALE » |
| F-9 | Erratum de comptage des solutions M2 | 29 (et non 31) ; backlog total 56 |
| F-10 | L'augmentation uniforme invisible au `rhythmShape` en ratios | comparaison du **facteur d'échelle absolu** (≥1.5 ou ≤0.67 → `rhythmic`) ; +4 fixtures |
| F-11 | `requireAmbiguousKey` neutralisé par la passe modale | évaluation sur la confiance des 24 profils **bruts**, avant inférence modale |
| F-12 | Transposition **tonale** (±1 dt diatonique) non reconnue | tolérance ±1 si contour identique ET rythme conservé → `transposed` (sous-type tonal) ; +6 fixtures dont 2 négatives |
| F-13 | e08 : conflit prompt (2 expositions) / `minMotifOccurrences: 3` | amendement à 2 ; règle README : dimensionner minOcc sur les occurrences complètes quand `requireFragmentation` |
| F-14 | e15 : parfaite impossible (mélodie donnée finit sur 3̂) + limite mono-flux | `requiredCadenceOneOf` ; note de format : polyrythme de voix ⇒ `Part[]` (introduit en M7) |

# ANNEXE F — DONNÉES INSTRUMENTS (`instruments.ts`, MVP — traçables aux fiches)

| id | range (MIDI) | sweet spot | pp/ff | agilité | sustain | notes normatives |
|---|---|---|---|---|---|---|
| violin-1 | 55–95 (G3–B6) | 57–88 | 2/7 | 10 | unlimited (section) | corde de sol = lyrisme viscéral ; suraigu désincarné |
| violin-2 | 55–95 | 55–84 | 2/7 | 10 | unlimited | rôles inversés : contrechant/harmonie d'abord — jamais « I bis » |
| viola | 48–88 (C3–E6) | 48–74 | 2/6 | 8 | unlimited | le liant du milieu ; l'aigu = intensité voulue |
| cello | 36–81 (C2–A5) | 36–64 | 2/7 | 8 | unlimited | ténor G3–E4 = « l'or pur » ; + cor = LA doublure chaude |
| double-bass | 28–55 (E1–G3) | 28–50 | 3/7 | 4 | unlimited | écrite +8va ; lignes seulement ; le silence = apesanteur |
| flute | 60–96 (C4–C7) | 67–91 | 2/5 | 10 | breath | **puissance croît avec la hauteur** (effectivePower ×0.4→×1.6) ; grave exposedRisk ; piccolo jamais discret |
| oboe | 58–93 | 60–81 | 3/5 | 7 | breath | pénétrance hors norme, fondu FAIBLE ; avoidWith trompette (solos concurrents) ; cor anglais V1 |
| clarinet | 50–94 (D3–B♭6) | 50–84 | **1**/6 | 9 | breath | chalumeau / gorge (exposedRisk, à traverser) / clairon ; entrées invisibles ; transpose +2 |
| trumpet | 52–84 (E3–C6) | 55–79 | 3/**10** | 7 | lips | le sommet ; sourdines = autre instrument (2–4 mes. pour poser/ôter) ; avoidWith cor (unisson ff) |
| french-horn | 34–77 | 46–70 | 2/9 | 4 | lips | mélodie ff = cors par 2/4 ; attaque ronde ~30 ms ; transpose +7 ; aigu exposedRisk |
| piano | 21–108 | 36–96 | 1/9 | 10 | **decay** | l'instrument qui MENT ; tenue >2 mes. déclenche l'info dédiée |

`ENDURANCE_BUDGET` : breath {8, aigu 6} · lips {12, aigu 4} · unlimited/decay ∞. Gouvernance : fiche et données évoluent dans la même PR ; `instrumentPool` des specs aligné au tier (correction e08 actée).

# ANNEXE G — ASSETS ET PIÈCES DU CORPUS

| Asset | Spéc | Usage |
|---|---|---|
| « Départ » | pièce de synthèse M1 (l25) — structure A/A' à reprise voilée | cas d'école (réutilisée en m09-l01) ; gabarit de production des pièces |
| « La Remise » (vidéo) | 90 s, 3 bascules d'ambiance, 2 hits | M10 capstone + M6 capstone (diptyque) |
| « fredon du réal » | audio 30 s | mission VariAudio / à l'image (M10) |
| Pièce « mystère » (e48) + thème héroïque (e08-M5) | 2 pièces MVP, ~2 h au gabarit « Départ » | à produire |
| Pièces générées (§4.3 du moteur) | générateur paramétrique avec vérité de génération (tensionPlan, motifs, rôles) | corpus M11 (dont mission western : 5 pièces + contre-exemple ; « la pièce inconnue » de m11-e08) |
| Sonothèque M12 | ~400 clips 5–15 s internes | spécifiés par les fiches |

# ANNEXE H — GLOSSAIRE MINIMAL

**Archétypes de cellule** : appel, pas, soupir, signal. **Sentence** : structure 1+1+2. **Les trois portes** : tirer (dominante secondaire), glisser (subV/basse chromatique), voiler (emprunt). **Les cinq lignes** : ciel, chant, cœur, corps, socle. **La vis** : forme du thriller (boucle + un paramètre qui se serre). **Le nuage** : IV→iv→I. **Vol légal** : transplanter un procédé identifié, matériau original absent (vérifié). **Finding** : friction moteur/pratique découverte en composant une solution, traitée avant merge. **PROUVÉ** : niveau de DAW_MISSION vérifié par ré-import MIDI. **Fil** : note commune tenue dans la même voix lors d'une bascule de médiante.

---

*Fin du Manuel Maître v1.0 — toute production future s'y réfère et l'amende selon §7.4.*

/*
Le Manuel Maître v1.0 est produit. Il consolide l'intégralité du projet en un document de référence autonome (~45 pages équivalent), structuré ainsi :
§0 Préambule — statut de référence unique, mode d'emploi, terminologie des IDs.
§1 Vision — les 5 principes directeurs (dont « le vocabulaire du cours EST le vocabulaire du moteur » et la charte anti-contrefaçon), philosophie du cursus, portfolio de sortie.
§2 Architecture — monorepo Turborepo, les 3 flux (live / soumission / MIDI aller-retour), backend, frontend, structure du contenu, roadmap figée.
§3 Moteur isomorphe — tous les analyseurs (avec les décisions F-x intégrées directement dans leur spécification), les ~46 règles et profils de style, le pipeline de correction, le kind ANALYSIS, la gouvernance CI (4 verrous).
§4 Conventions — gabarits leçon/spec/quiz/solution, la charte des quiz verbatim (retrouvée dans le transcript), les gabarits spécialisés (fiche instrument, leçon de genre, fiche d'ambiance, DAW_MISSION 3 niveaux).
§5 Les 12 modules — objectifs, trajet leçon par leçon, dépendances, formules-doctrines de chacun.
§6 Registre des décisions — 10 techniques, 14 pédagogiques, les doctrines musicales par domaine, la traçabilité des extensions moteur par module.
§7 Règles de travail — contrat de cohérence, immutabilité/versionnage, le protocole de production en 7 étapes (moteur avant solutions), procédure d'amendement, backlog chiffré.
Annexes A–H — notation textuelle, registre des règles, registre des clés de contraintes, les 15 MOOD_TEMPLATES avec valeurs, les 14 findings, les données instruments complètes, les assets, glossaire.
Deux recommandations d'usage : versionnez-le dans le repo (docs/MANUEL_MAITRE.md) comme le prévoit §7.4, et lors de la prochaine session de production (les solutions M3, par exemple), fournissez uniquement ce document — c'est le test de son autosuffisance. Si un manque apparaît, on l'amende en v1.1 plutôt que de repuiser dans l'historique.
*/