# MUSIC ACADEMY INTERACTIVE — GUIDE D'EXÉCUTION v2 (ULTRA-DÉTAILLÉ)
## De « tout est conçu » à « le produit tourne », sans aucune zone floue

**Version 2.0 — remplace le Tutoriel d'exécution v1.** Même colonne vertébrale (Phases 0→7), mais chaque tâche descend au niveau **fichier / contenu / exemple / critère de fin**. Il s'appuie exclusivement sur le Manuel Maître v1.0 et la Consolidation v1.1 — quand ce guide cite un ID (m03-e18, F-41, B2…), la définition canonique est là-bas.

**Comment lire ce guide.** Chaque tâche suit le même gabarit :
> **QUOI** (le livrable) · **OÙ** (chemin exact) · **CONTENU** (structure, exemple) · **ORDRE** (dépendances) · **FINI QUAND** (critère objectif).

**Règle d'or inchangée** : aucune décision de conception à chaud. Cas non couvert → décision au registre (Manuel §7.4) AVANT de coder.

---

# PHASE 0 — LA MISE EN PLACE (semaine 0, 3–5 jours)

## 0.1 Le mode d'exécution (jour 1, 1 h)

**QUOI** : une décision écrite. **OÙ** : `docs/DECISIONS_LOCALES.md`, entrée n°1. **CONTENU** : mode (solo / duo / équipe), jours/semaine consacrés, date-cible du jalon « verrou n°2 vert sur M1+M2 » (fin de semaine 6 en duo, fin de semaine 8 en solo). **FINI QUAND** : la date est dans ton calendrier avec des créneaux bloqués.

## 0.2 L'outillage (jour 1, 2 h)

```bash
# 1. Node LTS >= 20 + pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm env use --global lts
# 2. Comptes (crée-les tous maintenant, tu configureras plus tard) :
#    GitHub (repo privé) · Vercel · Railway ou Fly.io · Neon (Postgres) ·
#    Cloudflare R2 · Resend · Sentry · Stripe (dormant jusqu'en Phase 6)
```
**FINI QUAND** : `node -v` ≥ 20, `pnpm -v` ≥ 9, les 8 comptes existent.

## 0.3 Le monorepo (jours 1–2)

**QUOI** : le squelette exact du Manuel §2.1 + l'outillage transverse.

```bash
mkdir music-academy && cd music-academy && git init
pnpm dlx create-turbo@latest . --package-manager pnpm
```

**Arborescence-cible à obtenir (crée les dossiers vides, commit) :**
```
apps/web/                      # Next.js 14+ App Router, TS, Tailwind, Zustand
apps/api/                      # NestJS, Prisma, JWT
packages/music-core/src/       # TS PUR — le moteur
packages/music-core/test/      # fixtures + verrous
packages/shared/src/           # Zod, types partagés
packages/content/              # tout le contenu (voir 0.4)
docs/manual/                   # Manuel v1.0 + Consolidation v1.1
docs/production/               # archives des sections 1–86
docs/DECISIONS_LOCALES.md
.github/workflows/ci.yml
```

**Trois fichiers d'outillage à écrire jour 1 :**

1. `packages/music-core/.eslintrc.cjs` — **le verrou d'isomorphisme** :
```js
module.exports = { rules: { 'no-restricted-imports': ['error', {
  patterns: [{ group: ['react', 'react-*', 'next*', 'node:*', 'fs', 'path', '@nestjs/*'],
  message: 'music-core est isomorphe : aucun import d\'environnement (Manuel §2.1).' }] }] } };
```
2. `tsconfig.base.json` : `"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`.
3. `.github/workflows/ci.yml` : jobs `lint`, `typecheck`, `test` sur push/PR (tu ajouteras `content-locks` en Phase 1.4 et `seed-dry-run` en Phase 2.4).

**FINI QUAND** : `pnpm turbo lint typecheck test` passe (avec un test bidon), la CI GitHub est verte sur le premier push, et un import de `react` dans music-core fait échouer le lint (teste-le vraiment).

## 0.4 L'EXTRACTION DU CONTENU — la tâche fondatrice (jours 2–5)

Le contenu vit dans les conversations (sections 1–86). Tant qu'il n'est pas dans le repo, ton projet dépend d'un historique de chat. **Tout se joue ici.**

### 0.4.1 La structure-cible de `packages/content/`

```
packages/content/
├── modules/
│   └── module-01-fondamentaux/
│       ├── module.json                         # {id, title, tier:"MVP", order:1, minLevel:0}
│       ├── lessons/m01-l01-notes-et-clavier.mdx
│       ├── exercises/m01-e01-....json
│       └── quizzes/m01-l01-quiz.json
├── solutions/m01/m01-e01.json ... m11/...
├── reference/                                   # M12 : fiches ré-indexées + guides (Phase 6)
├── assets/
│   ├── la-remise/manifest.json                  # F-36 + F-49 (fredon-target inclus)
│   └── m12/clips/*.json                         # manifestes de clips (§ ASSETS de ce guide)
├── generator/recipes/{G-M48,G-05,G-07,G-08,G-W1..5}.json
└── scripts/count.ts                             # pnpm content:count
```

### 0.4.2 Les quatre formats, avec un exemple réel chacun

**a) Leçon MDX** — gabarit Manuel §4.1. Exemple de tête pour la première leçon :
```mdx
---
id: m01-l01-notes-et-clavier
module: module-01-fondamentaux
title: "Les notes et le clavier"
estMinutes: 20
skills: { theory: 1.0 }
---
### Pourquoi tout commence au clavier
...corps extrait verbatim de la section de production...
<QuizBlock id="m01-l01-quiz" questions={5} />
<LessonFooter exercises={["m01-e01-...", "m01-e02-..."]} />
```
Règle d'extraction : tu copies **verbatim** (le texte a été calibré) ; tu n'édites que si un renvoi croisé cite une numérotation de section de conversation (« §10.2 ») — tu le remplaces alors par le renvoi produit (« l13 » etc.) et tu notes la substitution dans le commit.

**b) Spec d'exercice JSON** — gabarit Manuel §4.2. Exemple réel (extrait de §63) :
```json
{ "id": "m03-e02-neapolitan-phrase", "lessonId": "m03-l02-napolitain",
  "title": "La phrase napolitaine", "kind": "CHORD_PROGRESSION",
  "difficulty": 5, "xpReward": 90, "skills": { "HARMONY": 1.0 },
  "spec": {
    "prompt": "Ré mineur, 8 mesures : la phrase-norme i–iv–V–i, puis sa reprise où le iv devient bII6 (l02 §2-3). Cadence parfaite finale. La b2 se conduit : doublure de basse, plongée vers la sensible.",
    "given": { "key": { "tonic": "D", "mode": "minor" }, "meter": "4/4" },
    "constraints": { "lengthBars": [8,8], "minVoices": 4, "maxVoices": 4,
      "requireIdiom": ["neapolitan"], "requiredCadence": "perfect",
      "phraseBarPlan": [4,4] },
    "styleProfile": { "id": "classical-common" },
    "rubric": { "correctness": 40, "constraints": 40, "craft": 20 } } }
```

**c) Solution** — format F-33. Exemple réel (m03-s02, §63.2, verbatim) :
```json
{ "exerciseId": "m03-e02-neapolitan-phrase",
  "notation": "[D3+A3+D4+F4]:w | [G2+Bb3+D4+G4]:w | [A2+A3+C#4+E4]:w | [D3+A3+D4+F4]:w | [D3+A3+F4+D5]:w | [G2+Bb3+G4+Eb5]:w | [A2+A3+E4+C#5]:w | [D3+A3+F4+D5]:w",
  "authorNotes": "b2 au soprano (D5→Eb5), tierce diminuée Eb5→C#5 ; doublure de basse du bII6 (G2+G4) ; octave directe finale couverte par l'exception soprano-par-degré." }
```
Kinds non notationnels → `payload` : `{ "voices": ["...", "..."] }` (M4), `{ "layers": [...] }` (M6), `{ "parts": [...] }` (M7+), `{ "annotations": {...} }` (M11), `{ "checklist": [...] } / { "midiRef": "..." }` (M10).

**d) Quiz JSON** — charte §4.3. Exemple réel (item 1 de m03-l01-quiz, §78.1) :
```json
{ "id": "m03-l01-quiz", "items": [
  { "q": "Le test des trois questions sert à…",
    "options": ["identifier le système d'un passage", "trouver la tonique",
                "compter les modulations", "choisir le tempo"],
    "answer": 0,
    "why": "l01 §2 — avant de nommer un accord, on identifie le régime : les mêmes notes changent de sens selon le système." },
  { "q": "…", "play": "notation ou clipId", "options": ["…"], "answer": 1, "why": "…" } ] }
```

### 0.4.3 Le plan d'extraction module par module

| Ordre | Module | Sources (sections) | À extraire | Compte-cible |
|---|---|---|---|---|
| 1 | **M1** | §11–18 (leçons+specs), §26–27 (solutions), §84–85 + 8 quiz historiques | 25 MDX · 49 specs · 27 solutions · 25 quiz | 25/49/27/25 |
| 2 | **M2** | §20–21, §24 (specs), §28 (solutions), §85 | 15 · 30 · 29 · 15 | 15/30/29/15 |
| 3 | **M5** | §22 + §5.2 (fiches), §85 | 11 fiches MDX · 11 quiz | 11/–/–/11 |
| 4 | **M9** | §23 + §5.3, §85 | 4 leçons · 8 specs · 4 quiz | 4/8/–/4 |
| 5 (Phase 6) | M3 | §40–45, §63–66, §78–79 | 18 · 18 · 31 · 18 | 18/18/31/18 |
| 6 | M4 | §46–49, §67–69, §80 | 12 · 12 · 25 · 12 | 12/12/25/12 |
| 7 | M6 | §35–39, §70–71, §81 | 15 · 15 · 19 · 15 | 15/15/19/15 |
| 8 | M7 | §50–53, §72–73, §82.1 | 10 · 10 · 15 · 10 | 10/10/15/10 |
| 9 | M8 | §54–58, §74–75, §82.2 | 15 · 15 · 22 · 15 | 15/15/22/15 |
| 10 | M10 | §30–34, §76, §83.1 | 15 · 15 · 15 étalons · 15 | 15/15/15/15 |
| 11 | M11 | §59–61, §77, §83.2 | 8 · 8 · 8 étalons · 8 | 8/8/8/8 |
| 12 | M12 | §62, §86 | ~30 pages REFERENCE · 1 generator-spec · manifestes clips | — |
| — | Manifestes/recettes | F-36, F-49, §77, §86 | la-remise/manifest.json · 8 recettes · gabarits clips | — |

**Semaine 0 : lignes 1–4 uniquement** (le MVP). Le reste s'extrait en Phase 6, quand le pipeline valide au fil de l'eau. Amendements à appliquer PENDANT l'extraction (ne pas extraire la version pré-finding) : la Consolidation §3.3 liste les 7 specs amendées (F-22, F-30, F-31, F-37, F-42, F-46, F-51) + F-8/F-13/F-14 du Manuel.

### 0.4.4 Le script de comptage

**QUOI** : `packages/content/scripts/count.ts` → commande `pnpm content:count`. **CONTENU** : parcourt l'arbre, valide que chaque fichier a un ID conforme (`m\d\d-(l|e)\d\d-...`), croise leçons↔footers↔specs↔solutions↔quiz (tout exercice référencé existe ; toute solution a son exercice ; tout quiz a sa leçon), imprime le tableau des comptes vs les cibles ci-dessus. **FINI QUAND** : pour M1+M2+M5+M9, le tableau imprime `25/49/27/25 ✓ · 15/30/29/15 ✓ · 11/11 ✓ · 4/8/4 ✓` et zéro référence orpheline.

## ✅ CHECKLIST PHASE 0
- [ ] Décision de mode + jalon daté (`docs/DECISIONS_LOCALES.md`)
- [ ] Monorepo + lint d'isomorphisme (testé en le violant) + CI verte
- [ ] Manuel v1.0 + Consolidation v1.1 dans `docs/manual/`, sections 1–86 dans `docs/production/`
- [ ] M1+M2+M5+M9 extraits, `content:count` vert
- [ ] `assets/la-remise/manifest.json` créé (F-36+F-49, valeurs de la Consolidation §3.4)

---

# PHASE 1 — LE MOTEUR `music-core` (semaines 1–8)

**Méthode invariable, fonction par fonction** : (1) lire la spec (Manuel §3 + Consolidation §3 pour les findings — tu codes DIRECTEMENT la version finale) ; (2) écrire les fixtures d'abord ; (3) coder jusqu'au vert ; (4) brancher la fonction au script `analyze`.

**Organisation des fichiers** :
```
packages/music-core/src/
├── types.ts            ├── notation/{parse,print,swing,humanize}.ts
├── analyzers/{key,chord,cadence,collection,idioms,motifs,contour,phrase,
│             tension,rhythm,swing,chordscale,voiceleading,counterpoint,
│             imitation,suspension,orchestration}.ts
├── data/{instruments,moods,jazzMarkers,idioms,translations}.ts
├── rules/{melody,harmony,vl,rhythm,orch,cp,sd,jazz}.ts + registry.ts + profiles.ts
├── constraints/{schema.ts, checkers/*.ts}
├── pipeline/{evaluate.ts, feedback.ts, craft.ts}
├── generator/{recipe.ts, render.ts, truth.ts}
└── midi/{import,export,cc,tempo}.ts
packages/music-core/test/
├── fixtures/<analyzer>/*.json    └── solutions/  (symlink → packages/content/solutions)
```

## 1.1 Semaine 1 — `types.ts` + le parseur (verrou n°3)

**types.ts (contenu exact minimal)** :
```ts
export interface Note { pitch: number; start: number; duration: number; velocity?: number }
export const PPQ = 480;
export interface DynPoint { tick: number; value: number }                 // F-39
export type Mute = 'con-sord' | 'straight' | 'cup';                        // F-40
export interface Part { instrumentId: string; notes: Note[]; dyn?: DynPoint[];
  mute?: Mute; articulations?: Articulation[]; swingTarget?: [number,number] } // F-44
export interface Layer { role: 'sub'|'body'|'top'|'texture'|'movement'|'fx'|'melodic';
  band?: {low:number; high:number}; adsr?: ADSR; motion?: Motion;
  sidechainedBy?: string; trigger?: boolean; removed?: string; notes?: Note[] } // F-38
```

**Le parseur** — grammaire à implémenter (annexe A du Manuel) :
`event := (note | chord | rest) ':' dur tie?` · `chord := '[' note ('~'? '+' note '~'?)* ']'` (liaison **par note**, F-21) · `dur := w|h|q|e|s ('.')?` · `'|'` ignoré (contrôle de mesure optionnel).
Options de compilation : `{ swing?: {ratio}, humanize?: {seed, offsetRange} }` (F-43/F-35 — offsets déterministes, le swing ne décale QUE les croches de contretemps).

**Fixtures nommées à écrire (minimum 18)** : `basic-melody` (`C4:q D4:e E4:e F4:h`) · `dotted-and-ties` (`E5:h~E5:q.`) · `chords` (`[C3+E4+G4]:w`) · `inner-tie-f21` (`[E4~+F4]:q [E4+G4]:q` → E4 fusionné) · `inner-tie-invalid` (liaison vers hauteur absente → erreur de compilation) · `rests` · `swing-2.0` (le « et » au tick 320 du temps) · `swing-quarters-noop` (noires intactes) · `humanize-deterministic` (deux compilations seed 42 → identiques) · `roundtrip-*` (×8 : `print(parse(x)) === normalize(x)`, cas F-21/F-43 inclus) · `multibar-solution` (m03-s02 verbatim → 8×4 rondes, 32 événements).
**FINI QUAND** : le verrou n°3 tourne en test CI sur ≥ 40 chaînes dont 10 solutions M1 réelles.

## 1.2 Semaines 2–3 — Les analyseurs (l'ordre est une dépendance, pas une suggestion)

| # | Fonction | Ce qu'elle rend | Findings à coder d'emblée | Fixtures-clés (exemples nommés) |
|---|---|---|---|---|
| 1 | `estimateKey(notes, opts)` | `{tonic, mode, confidence, ambiguous, alternates, rawProfiles}` | **F-19** (ancrage par insistance AVANT corrélation), **F-11** (`rawProfiles` pour requireAmbiguousKey) | `c-major-plain` · `d-dorian-bourdon` (le bourdon D ≥50 % → dorien, PAS do majeur) · `mixo-cadence` (s08-mixolydien : sol mixo) · `insistence-negative` (pièce en do qui pédale sol → reste do : l'insistance sans piliers ne suffit pas) · `ambiguous-f11` |
| 2 | `detectChord(pcs, bass, ctx)` | `{root, quality, inversion, extensions}` | pitch-classes (**F-6**), triades complètes (**F-3**), **F-18** (exclusion `pedalPlan`) | les 14 formes ×2 voicings · `enharmonic-ger6` ({3,7,10,1} = E♭7 quelle que soit l'orthographe) · `incomplete-rejected` ({D,F,D,D} → null) · `pedal-excluded` (s07 m7 : {G2+F4+A4+C5} sous pedalPlan → F majeur, pas F9) |
| 3 | `detectCadence(chords, seg)` | ponctuations taguées | **F-5** (arrivée tenue ≥1 mes. ou fin de segment), **F-2** (fallback monophonique), **F-16** (aug6 avant subV) | `perfect-basic` · `passing-resolution-ignored` (tonicisation interne s04 m4→m5 : pas de cadence enregistrée) · `mono-perfect-f2` (7̂→1̂ finale longue) · `ger6-half-not-subv` (s03 m9–10 : demi-cadence en sol, PAS parfaite en ré) |
| 4 | `detectCollection` + `tagIdioms` | collection + idiomes datés | **F-20** (famille melodic-minor) | `wholetone-wt1` (s11 m6–13) · `octatonic-c` (s12a) · `lydian-b7-f20` (s09) · `neapolitan/aug6/dim7-passing/dim7-pivot/planing/line-cliche` (un extrait réel chacun, pris des solutions) |
| 5 | `findMotifs(notes)` | motifs, variations, fragments | **F-10** (facteur d'échelle absolu), **F-12** (tonale ±1) | `exact-x3` · `transposed-real` · `transposed-tonal-f12` (s05 : G-A-B-C → E-F#-G#-A) · `tonal-negative` (contour brisé → refusé) · `augmentation-f10` (q q h → h h w = rhythmic) · `fragment-distinctive` (l'aspérité martelée) |
| 6 | `contour/leapProfile/phraseAnalysis` | silhouettes, sauts, frontières/élisions | — | `arch/fall/rise/wave/plateau` (5) · `elision` · `sentence-112` |
| 7 | `tensionCurve` + `archFit` | courbe normalisée + fit | **F-23** (z-score intra-pièce), régime platitude | `s17-octatonic-f23` (0.31 brut → 0.74 normalisé) · `mysterious-flatness` · `heroic-fit` (s21-M2 ≥ 0.6) |
| 8 | `rhythm/swingRatio/chordScaleCheck` | profils, ratio, conformité | **F-44** (n/a sans croches, par part), **F-45** (« posée » chiffrée) | `swing-measured-2.0` · `walking-quarters-na` (m08-s05) · `avoid-passing-ok` / `avoid-posed-flagged` (le fa sur Cmaj7, 4 vies) |
| 9 | `voiceLeading` | parallèles, sensibles, espacement | **F-15** (quintes de Mozart sous tag aug6), F-1 et famille | `parallel-fifths-basic` · `mozart-fifths-tagged` (s03 m9→10 : `info`, pas error) · `mozart-untagged-still-error` · `frustrated-inner-lt` (s24-M1) · `passing-lt-f1` |
| 10 | espèces 1–5, `imitation`, `suspensionCheck` | contrats d'espèces, entrées, retards | **F-25** (ficta en clausule), **F-26** (miroir du grave), **F-27** (≤1 rupture), **F-28** (answer tonal), **F-32** (heads[]), **F-29** (généralisé) | `ficta-clausule-ok` / `ficta-midline-error` · `below-cf-mirror` (s02-v2) · `syncope-break-cadential` · `tonal-answer-f28` (s10 : D→G pour G→D) · `two-heads-strette` (s12 acte 2) · `free-suspension` (s08 m12–13) |
| 11 | orchestration : `effectivePower`, `densityMap`, endurance | puissances, coupes, budgets | **F-40** (modificateurs mute), cas flûte | `flute-power-by-zone` (×0.4→×1.6) · `con-sord-065` · `endurance-lips-high` · `density-tas-vs-immeuble` |
| 12 | registres de données | — | **F-47** (`jazzMarkers.ts` : détecteur+puissance), **F-42** (`translations.ts`), F-51 (traits compilables) | `markers-count-s14a/b/c` (4 forts / ≤1 fort / 0 fort + 2 faibles — les trois étalons) |

**Le script compagnon** — `pnpm analyze <solution.json>` : compile, exécute tous les analyseurs pertinents, imprime un rapport texte. Tu l'utiliseras des centaines de fois ; écris-le dès la fonction 1.
**FINI QUAND** : ≥ 500 fixtures vertes ; `pnpm analyze solutions/m03/m03-e04.json` imprime : tonalité C→E♭ détectée, `dim7-passing` m2, `dim7-pivot` m7, parfaite m12 — conformes à §63.2.

## 1.3 Semaine 4 — Règles, profils, contraintes (verrou n°1)

**Une règle = un objet complet, pedagogy incluse le jour même.** Exemple-gabarit à recopier :
```ts
export const leapRecovery: Rule = {
  id: 'melody.leap-recovery', severity: 'warning', weight: 1.0,
  detect(ctx) { /* saut > 5 dt non suivi d'un mouvement conjoint contraire */ },
  pedagogy: {
    why: "Un grand saut crée une attente : l'oreille veut qu'on revienne combler l'espace.",
    how: "Après un saut, redescends (ou remonte) par degré dans la direction opposée.",
    when: "Style romantique : le geste saut+récupération EST le style (poids renforcé).",
    commonMistake: "Enchaîner deux sauts dans le même sens : la ligne se disloque.",
    alternative: "Assumer le saut non récupéré comme rupture — alors il se rembourse (m02-l07)." } };
```
Profils (`profiles.ts`) : les 8+2 matrices du Manuel §3.6 (`thriller-tension: { 'melody.monotony': 0, 'melody.tension-placement': 0, repetitionIsPositive: true }`, `epic-film: { 'vl.parallel-perfects': 0.1 }`, etc.).
Contraintes : `constraints/schema.ts` (Zod, ~80 clés, annexe C) + un checker par clé dans `checkers/` **avec d'emblée** : fenêtrage hors given (**F-41** : `markGivenTicks()` en amont de tout), `performanceOnly` (**F-35**), `transposed` (**F-17**), `pedalPlan` (**F-18**), `direction` du tensionPlan (**F-24**).
**Verrou n°1** (`test/locks/completeness.test.ts`) : lit toutes les specs extraites, échoue si une clé n'a pas de checker — et inversement (checker orphelin = warning).
**FINI QUAND** : verrou n°1 vert sur M1+M2+M5+M9 ; chaque règle a ses 10 fixtures et sa pedagogy relue par toi à voix haute (si une phrase sonne faux, elle EST fausse).

## 1.4 Semaines 5–6 — Le pipeline + le verrou-roi (n°2)

`pipeline/evaluate.ts` : `evaluate(submission, spec) → FeedbackReport` selon Manuel §3.7. Exemple de sortie attendue (c'est un contrat, fige-le en snapshot) :
```json
{ "score": 91, "engineVer": "1.0.0",
  "subscores": { "correctness": 38, "constraints": 40, "craft": 13 },
  "issues": [ { "ruleId": "vl.spacing", "severity": "suggestion", "atTick": 5760,
      "message": "Ténor et alto s'écartent d'une dixième à la mesure 4.",
      "pedagogy": { "why": "...", "how": "..." }, "lessonRef": "m01-l13" } ],
  "strengths": [ "Le bII6 double sa basse et sa b2 plonge en tierce diminuée — l'idiome complet (m03-l02 §3)." ],
  "constraintResults": [ { "key": "requiredCadence", "pass": true, "detail": "parfaite, soprano 1, arrivée tenue" } ],
  "improvedVersion": null }
```
Contraintes dures à tester : issues **plafonnées** (max ~6, triées par sévérité×poids), `improvedVersion` modifie ≤ 30 % des notes ou est nul.
**Verrou n°2 polymorphe (F-48)** : `test.each(loadSolutions())` par kind (score ≥ 85 / checkers de preuve / lint / concordance).
**Procédure quand une solution est rouge** : (1) `pnpm analyze` dessus ; (2) compare à la vérification écrite dans sa section (§63–77 — chaque solution a sa table) ; (3) 9 fois sur 10 c'est ton code ; si c'est réellement une divergence d'interprétation, décision au registre AVANT patch.
**FINI QUAND** : M1 (27) + M2 (29) + M3 (31) verts. M3 est le crash-test des analyseurs harmoniques — ne passe pas à la suite sans lui.

## 1.5 Semaines 7–8 — Worker, MIDI, générateur

1. **Worker (flux A)** : `music-core` exporte `evaluateLive(partial, spec) → issues` (sous-ensemble rapide : pas de craft, pas d'improvedVersion). Emballage `apps/web/workers/engine.worker.ts`, protocole `{type:'evaluate', submission, specId} → {issues[], ms}`. Budget : **p95 < 150 ms sur un laptop à 4 cœurs de 2018** (profile réellement).
2. **MIDI (flux C)** : `midi/export.ts` (Part[]→SMF : notes, CC1 depuis `dyn[]` F-39, tempo map) et `midi/import.ts` (SMF→Part[] + `ccStream`, `tempoEvents`, `quantizeInfo`). Checkers DAW : `ccCoverage`, `ccPerNoteVariance`, `ccTensionCorrelation`, `tempoEvents` (rampes ≥ 8 %), profils de quantisation. Fixtures = **les 5 MIDI-témoins de §76** (e03, e04, e09, e11, e13) que tu fabriques avec ton propre export (le serpent se mord la queue : c'est voulu, c'est le round-trip du flux C).
3. **Générateur** : `recipe.ts` (schéma §77.0), `truth.ts`, `render.ts` (rendu simple : le juste avant le beau). **Verrou n°5** : chaque recette régénérée → ses détecteurs retrouvent ⊇ la vérité. Les 8 recettes extraites sont les tests.

## ✅ CHECKLIST PHASE 1
- [ ] Verrou n°3 (round-trip, F-21/F-43 inclus) — semaine 1
- [ ] 12 familles d'analyseurs + ≥ 500 fixtures — semaines 2–3
- [ ] 46+ règles avec pedagogy + profils + checkers + verrou n°1 — semaine 4
- [ ] Pipeline + verrou n°2 vert sur M1+M2+M3 (87 solutions) — semaines 5–6 ← **LE jalon**
- [ ] Worker < 150 ms p95 · flux C round-trip · verrou n°5 sur 8 recettes — semaines 7–8

---

# PHASE 2 — LE BACKEND (semaines 8–11, chevauche la fin de Phase 1)

## 2.1 Le schéma Prisma (jour 1–2)

**OÙ** : `apps/api/prisma/schema.prisma`. **CONTENU** (champs essentiels — complète librement les timestamps/index) :
```prisma
model User        { id String @id @default(cuid())  email String @unique  passwordHash String
                    level Int @default(1)  xp Int @default(0)  createdAt DateTime @default(now()) }
model Module      { id String @id  title String  tier String  order Int  minLevel Int }
model Lesson      { id String @id  moduleId String  title String  order Int  mdxPath String  estMinutes Int }
model Exercise    { id String @id  lessonId String  kind String  difficulty Int  xpReward Int  specJson Json }
model Submission  { id String @id @default(cuid())  userId String  exerciseId String
                    payload Json  engineVer String  createdAt DateTime @default(now()) }
model FeedbackReport { id String @id @default(cuid())  submissionId String @unique
                    score Int  reportJson Json  flagged Boolean @default(false) }
model QuizAttempt { id String @id @default(cuid())  userId String  quizId String  answers Json  score Int }
model Progress    { userId String  lessonId String  status String  @@id([userId, lessonId]) }
model Badge       { userId String  moduleId String  earnedAt DateTime  @@id([userId, moduleId]) }
model PortfolioPiece { id String @id @default(cuid())  userId String  exerciseId String  submissionId String }
```
**FINI QUAND** : `prisma migrate dev` passe, la base Neon de dev existe.

## 2.2 Auth + endpoints (semaines 8–10)

Auth : JWT access 15 min + refresh 30 j (rotation), bcrypt/argon2, reset par Resend. **Ordre de livraison des endpoints** (chaque ligne testée par un test e2e supertest avant la suivante) :
```
POST /api/v1/auth/{register,login,refresh,forgot,reset}
GET  /api/v1/modules · GET /modules/:id · GET /lessons/:id          # lecture, gating minLevel
GET  /quizzes/:id · POST /quizzes/:id/attempts                      # correction serveur, why renvoyés
GET  /exercises/:id                                                 # spec SANS la solution
POST /exercises/:id/submissions   → 201 {reportId}                  # pipeline music-core
GET  /reports/:id                                                   # FeedbackReport JSON (contrat 1.4)
POST /reports/:id/flag                                              # « signaler ce rapport » (Phase 7)
GET  /me/progress · POST /progress/:lessonId/complete               # XP, niveaux, badges
GET  /exercises/:id/midi  ·  POST /exercises/:id/midi-import        # flux C
GET  /me/portfolio
```
**Exemple de contrat POST submissions (fige-le)** : requête `{ "kind":"CHORD_PROGRESSION", "notation":"[D3+A3+D4+F4]:w | ..." , "variantId": null }` → 201 → `GET /reports/:id` renvoie le JSON du §1.4. Rate limit : 10 soumissions/min/user. Sentry + logs structurés (pino) branchés avant la première mise en ligne.

## 2.3 Le seed (semaine 10–11) — ta CI de contenu pour toujours

**QUOI** : `apps/api/src/seed/seed.ts` (commande `pnpm seed`). **CONTENU** : (1) compile `packages/content` (MDX front-matter validé, specs par Zod, quiz par Zod, solutions compilées) ; (2) **exécute les verrous 1–5** ; (3) upsert en base (idempotent — les IDs sont immuables, Manuel §7.2). Option `--dry-run` pour la CI (`content-locks` job).
**FINI QUAND** : `pnpm seed` sur base vide → M1+M2+M5+M9 en base, verrous verts ; un ID de règle inconnu dans une spec fait échouer bruyamment (teste-le).

## ✅ CHECKLIST PHASE 2
- [ ] Migrations + auth + les 12 groupes d'endpoints (e2e verts)
- [ ] Contrat FeedbackReport figé en snapshot partagé (`packages/shared`)
- [ ] Seed idempotent + verrous en CI (`--dry-run`)
- [ ] Depuis curl : register → lire m01-l01 → soumettre m01-e05 (solution) → rapport ≥ 85

---

# PHASE 3 — LE FRONTEND MVP (semaines 10–16)

## 3.1 Les écrans (routes exactes, dans l'ordre de construction)

| Ordre | Route | Contenu | FINI QUAND |
|---|---|---|---|
| 1 | `/login`, `/register` | auth | un compte réel créé |
| 2 | `/app` | tableau de bord : modules (tuiles, progression, gating minLevel grisé) | M5/M9 grisés pour un compte neuf |
| 3 | `/app/m/:moduleId` | sommaire des leçons (état : à faire / en cours / faite) | navigation complète M1 |
| 4 | `/app/l/:lessonId` | **Course Reader** : MDX + `<MusicExample>` + `<QuizBlock>` + `<LessonFooter>` | m01-l05 se lit et se JOUE de bout en bout |
| 5 | `/app/q/:quizId` | quiz : QCM, items `play` (▶ rejoue la notation/le clip), correction immédiate, `why` toujours affiché | m01-l01-quiz complet, le why apparaît même sur bonne réponse |
| 6 | `/app/e/:exerciseId` | **l'atelier** : consigne + éditeur + flux A + Soumettre | voir 3.3 |
| 7 | `/app/r/:reportId` | le rapport : score, issues cliquables → leçon, strengths, improvedVersion en A/B, bouton « signaler » | le rapport de m03-e02 (soumis avec s02) est lisible par un tiers |
| 8 | `/app/portfolio` | les pièces (vides au début) | — |

## 3.2 Les composants du Reader

- **`<MusicExample notation="..." tempo?>`** : compile côté client (music-core !), joue via **Tone.js** (un `Sampler` piano + un `PolySynth` doux ; les samples piano vont sur R2). Affiche ▶/⏸ + mini piano-roll statique. *FINI QUAND* : l'exemple de m01-l10 (triades) sonne juste et se rejoue sans fuite mémoire (100 lectures).
- **`<QuizBlock id>`** : fetch + rendu + tentatives ; les items `play` réutilisent le lecteur.
- **`<LessonFooter exercises>`** : cartes mission (kind, difficulté, XP).

## 3.3 L'atelier (le gros morceau, ~3 semaines)

MoSCoW du MVP :
- **Must** : piano-roll (grille 480 PPQ, snap réglable, sélection multiple, vélocité par drag vertical), **Web MIDI in** (fallback clavier écran), lecture Tone.js, undo/redo, sauvegarde brouillon (localStorage + serveur), panneau **flux A** (les issues du Worker, non bloquantes, throttle 400 ms), Soumettre, `variants[]` (choix avant d'écrire, m02-e20) et `submissionParts[]` (capstones, `userBrief` en textarea).
- **Should** : StaffLite (portée lecture seule sous le roll — un rendu canvas maison de ~300 lignes suffit : clé de sol/fa, notes, altérations ; VexFlow attendra la V1).
- **Won't (MVP)** : Part[] multi-pistes, LayerStack, annotations — Phase 6.
Protocole Worker : `postMessage({type:'evaluate', notes, specId})` → `{issues:[{ruleId,severity,message,atTick}], ms}` ; l'UI surligne les ticks concernés.
**FINI QUAND (test du cobaye)** : une personne extérieure traverse m01-l01→l05, réussit deux quiz, soumet m01-e05 depuis SON clavier MIDI et explique son rapport à voix haute sans ton aide.

## ✅ CHECKLIST PHASE 3
- [ ] Reader + lecteur audio + quiz (écrans 1–5)
- [ ] Atelier Must complet + flux A < 150 ms perçu (écrans 6–7)
- [ ] Test du cobaye réussi (filmé, pour revoir les frictions)

---

# PHASE 4 — SEED MVP + QA MUSICALE (semaines 15–17)

## 4.1 Le seed complet MVP
`pnpm seed` : 55 leçons + fiches, 87 specs, 56 solutions, 55 quiz. Verrous verts. *FINI QUAND* : `content:count` et le seed racontent les mêmes chiffres.

## 4.2 Le protocole de QA à trois soumissions (ta semaine d'oreille)

**QUOI** : pour **20 exercices** répartis, trois soumissions chacun : (a) la solution, (b) une version « moyenne » (2–3 défauts de craft), (c) une **fausse-typique** construite depuis la table Erreurs de la leçon. Vérifie score(a) > score(b) > score(c) ET que chaque issue est musicalement juste.
**Les 20** (couvrent tous les kinds MVP et les zones à risque) : m01-e05, e12 (renversements), e20 (7es), e31 (cadences), e40 (subV — F-8), e49 (synthèse) · m02-e02 (motif), e08 (sentence), e14 (climax), e20 (variants), e26 (mood), e30 (capstone, parts+userBrief) · m09-e01, e03, e05, e07 · m01-e08, e16, e27 · m02-e11.
**Exemple de fausse-typique** (m02-e02, table Erreurs de l02) : un « motif » de 9 hauteurs sans répétition, sauts non récupérés → attendu : `melody.no-motif` + `melody.leap-recovery`, score < 55.
**OÙ consigner** : `docs/qa/mvp-run-1.md` — une ligne par soumission : exercice, version, score, issues, verdict (✓ / bizarre / faux). **FINI QUAND** : 60 lignes, zéro « faux » non traité (chaque « faux » → finding, voir 5.3).

## 4.3 L'alpha fermée (5–10 personnes)
Profils : 2 débutants complets, 2 amateurs, 1 pro. Consigne unique : « avance et dis tout haut ce qui te bloque ». Tu corriges **l'UX**, pas le contenu. Livrable : `docs/qa/alpha-notes.md`, trié en trois tas : bug / friction UX / incompréhension pédagogique (le 3e tas attend la beta : c'est peut-être l'élève, peut-être le texte — les nombres trancheront).

---

# PHASE 5 — LA BETA (semaines 17–22)

## 5.1 Mise en production réelle
Vercel (web) · Railway/Fly (api) · Neon (Postgres, sauvegarde quotidienne — **teste une restauration une fois**, chronomètre-la) · R2 (samples, clips, MIDI) · Resend · Sentry · domaine + page liste d'attente. *FINI QUAND* : un inconnu s'inscrit depuis son téléphone et finit m01-l01.

## 5.2 La beta et ses instruments (30–80 utilisateurs)
Événements à tracker (table `AnalyticsEvent` maison ou Posthog) : `lesson_completed`, `quiz_score`, `submission_created{score}`, `report_flagged`, `exercise_abandoned{screen}`. Tableaux hebdo : complétion par leçon, score moyen + taux « deux échecs » par exercice, funnels d'écran.

## 5.3 Le rituel de calibrage hebdomadaire (le cœur de la beta)

Chaque vendredi (2–3 h) :
1. Lis **tous les rapports flaggés** + un échantillon de 15 rapports aléatoires.
2. Pour chaque cas douteux, l'arbre de décision :
   - l'issue est musicalement fausse → **bug** (fixture qui reproduit → patch → `engineVer`↑) ;
   - l'issue est juste mais la règle mord trop fort/trop souvent → **calibrage** (ajuste `weight`/seuil ; procédure : ① écris la fixture du cas réel anonymisé, ② change la valeur, ③ vérifie que les 191 solutions restent vertes, ④ note l'ajustement dans `docs/DECISIONS_LOCALES.md` avec avant/après) ;
   - l'issue est juste et la règle aussi, mais le TEXTE est incompris → **pedagogy** (réécris why/how, pas le detect) ;
   - l'élève avait tort → rien (et c'est la majorité : le produit fait son travail).
3. Ce que tu ne touches JAMAIS sans finding documenté : le comportement des analyseurs (Consolidation §3.1).
Les seuils explicitement en attente de données réelles (Consolidation §7.3) : `ENDURANCE_BUDGET`, tolérance `draw-tension`, seuils de reconstruction m11-e07, fenêtres `climaxWindow` si les élèves les vivent comme injustes.

## 5.4 En parallèle : la production d'assets P1 démarre (→ voir la GRANDE SECTION ASSETS)
Ta semaine type en beta : lundi–mercredi matin = code/fixes ; mercredi pm–jeudi = **prises audio P1** ; vendredi = rituel de calibrage.

## ✅ CHECKLIST PHASES 4–5
- [ ] Seed MVP + QA 60 lignes + alpha triée
- [ ] Prod réelle + restauration de backup testée
- [ ] 4 rituels de calibrage documentés minimum
- [ ] Assets P1 : ≥ 80/160 clips pris (mi-beta), 160/160 + vidéo + fredon (fin de beta)

---

# PHASE 6 — LA V1 (semaines 22–32)

## 6.1 L'ordre de seed des modules V1 (avec la dépendance d'éditeur de chacun)

| Ordre | Module | Extraction (0.4.3) + seed | Front requis AVANT le seed public | Exemple de flux utilisateur à tester |
|---|---|---|---|---|
| 1 | M3 | 18/18/31/18 | rien de neuf (mono-flux + bi-plans : deux rolls empilés pour m03-e16) | m03-e18 : 3 parts soumises l'une après l'autre, verdict transversal (3 archFit alignés) affiché |
| 2 | M4 | 12/12/25/12 | éditeur 2 voix (deux lanes) + **canonShadow** | m04-e09-v2 : je saisis le dux, le fantôme du comes s'affiche décalé d'1 mesure une octave plus bas, mes fautes contre moi-même s'allument en live |
| 3 | M6 | 15/15/19/15 | **éditeur LayerStack** | m06-e03 : je déclare 4 couches (formulaires : role/band/ADSR/motion) + le champ `removed`, mini-visualiseur du spectre déclaré, soumission |
| 4 | M7 | 10/10/15/10 | **éditeur Part[]** (pistes + lane dyn + mute) | m07-e10 : 3 parts (plan / partition 8 pistes / lecture), le rapport croise melody+harmony+orch+dyn |
| 5 | M8 | 15/15/22/15 | toggle swing au playback + grilles d'accords affichées | m08-e15 : grille AABA saisie (éditeur d'accords), thème, chorus, arrangement |
| 6 | M10 | 15/15/15/15 | **missions DAW** : checklists interactives (verifyHint dépliables) + upload .mid → checkers | m10-e15 : je téléverse mon export, le rapport croise cc/tempo/timecode/harmonie, part 3 = checklist du colis |
| 7 | M11 | 8/8/8/8 | **vues ANALYSIS** (voir 6.3) | m11-e07 : analyse préalable soumise, puis reconstruction dans l'éditeur avec ▶ de l'original, différentiel par couche |
| 8 | M12 | REFERENCE + generator | **le lexique** : index cherchable (registre/rôle/émotion) + lecteur de clips + « défi de la palette » | je tape « mélancolie ténor » → celli, cor anglais, chalumeau, Rhodes sombre, avec clips |

Règle : un module = une PR de seed, verrous verts, PUIS le suivant. Chaque seed V1 est un test d'intégration géant (les solutions existent).

## 6.2 VexFlow (remplace StaffLite) — 1 semaine
Adaptateur `Part[] → VexFlow` (mesures, altérations par tonalité, liaisons, voix multiples pour M4). *FINI QUAND* : m03-s02 et m04-s08 s'affichent juste (compare à la notation source œil par œil).

## 6.3 Les vues ANALYSIS (M11) — le composant le plus original du produit
Une timeline (piano-roll condensé + ▶) et 6 outils d'annotation :
`mark-occurrences` (cliquer-glisser des plages, choisir le type de variation) · `label-segments` (bornes + libellés) · `name-chords/functions` (popover par verticalité) · `identify-idioms` (tags posés sur plages) · `draw-tension` (dessin au doigt/souris sur un canvas 16 colonnes, superposé à la courbe machine APRÈS soumission) · `role-map` (grille couches × sections, valeurs : rôle ou « indécidable » — F-50).
*FINI QUAND* : l'étalon m11-s04 se rejoue dans l'UI et la concordance s'affiche zone par zone (dont les 2 « indécidable » crédités).

## 6.4 Stripe (2 semaines pleines, pas 2 jours)
1. Produits : `abo-mensuel`, `abo-annuel` (+ `fondateurs` remisé). Essai = **M1 l01–l08 gratuits** (gating par flag `freeTier` sur Lesson, pas par paywall d'écran).
2. Checkout hébergé Stripe → webhook (`checkout.session.completed`, `customer.subscription.updated|deleted`, `invoice.payment_failed`) → table `Subscription {userId, status, currentPeriodEnd}` → middleware d'accès.
3. Portail client Stripe pour la gestion. 4. Teste en mode test : souscription, échec de paiement (carte 4000…0341), annulation, réactivation.
*FINI QUAND* : les 4 scénarios passent en test ET en live avec ta vraie carte (rembourse-toi).

## 6.5 Juridique (avant toute ouverture payante)
CGU/CGV, confidentialité, mentions légales, RGPD (export JSON du compte + suppression effective — écris les deux endpoints), cookies (bandeau minimal si analytics), TVA (OSS si UE). *FINI QUAND* : les pages existent, les deux endpoints RGPD sont testés, un juriste (ou un service en ligne sérieux) a relu.

## ✅ CHECKLIST PHASE 6
- [ ] 8 seeds V1 dans l'ordre, verrous verts à chaque PR
- [ ] VexFlow · canonShadow · LayerStack · Part[] · missions DAW · vues ANALYSIS · lexique M12
- [ ] Assets P2 puis P3 produits (→ SECTION ASSETS)
- [ ] Stripe 4 scénarios + juridique complet

---

# PHASE 7 — LANCEMENT ET VIE DU PRODUIT

1. **Lancement doux** : liste d'attente d'abord (prix fondateurs, 2 semaines), puis public. Pas de « big bang » : ton produit s'améliore par cohortes.
2. **La boucle de findings post-launch** : le bouton « signaler ce rapport » alimente `FeedbackReport.flagged` → le rituel du vendredi (5.3) devient permanent (1 j/semaine).
3. **Extensions de contenu** : un nouveau genre M9 = la méthode m11-l06 (D-P11) — corpus de recettes générées, distillation, fiche compilée, leçon au gabarit §4.5, solutions, quiz à la charte. Compte ~1 semaine par genre, tout compris.
4. **Discipline documentaire** : toute décision → registre ; tout changement de comportement moteur → finding + fixtures + `engineVer`. Pour toujours.

---

# LA GRANDE SECTION ASSETS — LE PLAN DE PRODUCTION COMPLET

Cette section rend exécutable le §86 de la Consolidation, clip par clip. **Où vivent les fichiers** : audio sur R2 (`assets/m12/audio/<id>.wav`), manifestes dans `packages/content/assets/m12/clips/<id>.json`, référencés par les fiches via `lessonRefs` et par le lexique via `tags`.

## A.0 Le manifeste de clip (schéma + exemple complet)

```json
{ "id": "m12-inst-cello-sweetspot",
  "ficheId": "m05-cello", "lessonRefs": ["m05-cello", "m07-l02", "m07-l05"],
  "type": "sweet-spot", "durationSec": 12,
  "params": { "register": "tenor", "dynamic": "mp", "articulation": "legato", "tempo": 90, "key": "C" },
  "notation": "G3:q C4:q. B3:e A3:q | E4:h D4:q C4:q | A3:q C4:q E4:h | D4:h. r:q",
  "tags": { "register": "tenor", "role": ["chant","corps"], "emotions": ["mélancolie","chaleur","noblesse"] },
  "file": "assets/m12/audio/m12-inst-cello-sweetspot.wav",
  "notes": "La phrase-étalon cordes, jouée dans l'or pur G3–E4 (fiche §Couleur). C'est LE clip que le lexique sort pour « mélancolie au ténor »." }
```
Conventions rappelées (D-P20) : WAV 48/24 · 5–15 s · −18 LUFS de référence, **contrastes préservés par paires** · nommage `m12-{cat}-{ficheId}-{type}-{variante}` · la notation jouée est OBLIGATOIRE (re-productibilité) · PR clip+fiche commune.

## A.1 CATÉGORIE A — LES INSTRUMENTS (19 fiches × 12 = 228 clips)

**Le gabarit des 12, valable pour chaque fiche** (les valeurs par fiche sont dans la table A.1.b) :

| # | Type | Durée | Contenu musical | Ce que l'élève doit comprendre | Champ manifeste |
|---|---|---|---|---|---|
| 1–4 | `register-<zone>` | 8–10 s | **la phrase-étalon de famille** (2 mes., ♩=90) transposée dans chaque zone de la coupe, zone `exposedRisk` incluse et NOMMÉE | la même phrase change de PERSONNAGE selon l'étage — la coupe de la fiche, entendue | `params.register`, tag registre |
| 5–6 | `dynamic-pp` / `dynamic-ff` | 6 s | LA même note du sweet spot, tenue 4 temps, pp puis ff (gain de paire partagé) | `dynamicPower` s'entend : le 1/6 de la clarinette n'est pas le 3/10 de la trompette | `params.dynamic` |
| 7–9 | `artic-<nom>` ×3 | 5–8 s | les techniques signatures de la fiche (1 mes. chacune, répétée ×2) | le vocabulaire d'écriture réel (ce que l'Expression Map de M10 mappera) | `params.articulation` |
| 10 | `sweet-spot` | 10–12 s | la phrase lyrique de 4 mes. dans la zone d'or | « voilà pourquoi cette zone est chère » — le clip-vitrine du lexique | tag émotions ++ |
| 11 | `risk` | 8 s | LE MÊME matériau que #10, transposé dans la zone périlleuse | l'A/B intra-fiche : jouable ≠ recommandé (la règle-mentor `orch.register-color`) | `params.register = <risk>` |
| 12 | `context` | 12–15 s | le rôle-type dans un mini-tutti de 4 mes. (3–4 autres pupitres en accords) | l'instrument DANS la pâte : le hautbois perce, le cor lie, la flûte grave disparaît | tag `role` |

**Les phrases-étalons par famille (à figer une fois, réutilisées partout)** :
- Cordes/bois : `1^:q 4^:q. 3^:e 2^:q | 5^:h 3^:q 1^:q` (en degrés, transposée par zone — lyrique, conjointe, un saut).
- Cuivres : `5^:q. 1^:e 1^:q 2^:q | 3^:h 1^:h` (l'appel — teste l'attaque et la tenue).
- Percussions/harpe/piano/chœur : gabarit adapté (voir table).

**A.1.b — La table des 19 fiches (les valeurs qui varient)** :

| Fiche (12 clips chacune) | Zones #1–4 (dont ⚠ = exposedRisk) | Artics #7–9 | Sweet spot #10 | Risk #11 | Contexte #12 |
|---|---|---|---|---|---|
| violin-1 | G3 corde de sol · médium D4–A5 · aigu · suraigu ⚠ | legato · spiccato · trémolo | E4–A5 lyrique | suraigu >E6 | la ligne sur tutti mf |
| violin-2 | idem, phrasé en contrechant | legato · pizz · sourdine (F-40) | médium contrechant | — (clip « jamais I-bis » : V2 sous V1) | contrechant sous V1 |
| viola | C3 grave · médium ⚠ gorge d'alto · aigu voulu | legato · trémolo · pizz | G3–D4 le liant | aigu >C5 | le milieu qui lie |
| cello | C2 basse · **G3–E4 or pur** · aigu La | legato · pizz · spiccato | G3–E4 (exemple A.0) | aigu >A4 exposé | basse chantante sous quatuor |
| double-bass | E1–G2 (+8va rappelée dans notes) | arco · pizz · trémolo | lignes lentes G1–D2 | — (clip « l'entrée-événement » : tutti sans/avec Cb) | le socle qui s'allume |
| flute | grave ⚠ · médium · aigu (puissance ↑) · suraigu | legato · double coup · flatterzunde | aigu brillant | GRAVE sous cordes (englouti — le clip-preuve F-34 de la fiche) | le ciel du tutti |
| oboe | grave ⚠ · médium chantant · aigu | legato · staccato · tenuto | ré4–la5 la voix | grave dur | il PERCE le tutti (le clip-thèse) |
| clarinet | **chalumeau** · gorge ⚠ · clairon · aigu | legato · staccato · sub-tone | chalumeau (le secret) | la traversée de gorge (gamme lente qui la traverse) | l'entrée invisible pp |
| trumpet | grave · médium · aigu ⚠ (lips) | ouvert · **straight mute** · cup | l'appel Sib4 | aigu tenu (l'endurance qui fatigue — 8 mes.) | le sommet du tutti |
| french-horn | grave pédale · médium liant · aigu ⚠ | ouvert · bouché · cuivré | le liant F3–C4 | aigu solo | LE liant (accord bois+cordes, avec/sans cor) |
| piano | grave · médium · aigu | legato pédale · staccato · — | — | — | remplacés par **les 4 mensonges** : tenue qui meurt vs cordes · grave serré vs éclaté · dynamique sans timbre · 10 doigts ≠ densité (4 clips A/B — la fiche-pont) |
| trombone (V1) | pédales · médium noble · aigu ⚠ | legato · glissando · sourdine | le choral Fa2–Sib3 | aigu | la colonne des cuivres |
| tuba (V1) | contre-grave · grave · médium | tenuto · staccato · — | le socle des cuivres | médium solo (rare) | sous le choral |
| bassoon (V1) | grave boisé · ténor ⚠ chantant · aigu | legato · staccato · — | le ténor (le « violoncelle des bois ») | aigu exposé | le liant grave des bois |
| timpani/perc (V1) | *gabarit adapté : 6 timbres* (timbale roulée/coup sec · GC · cymbale · caisse claire · tam · mark tree) | — | — | — | +3 contextes (le hit orchestré, le roulement de crue, la ponctuation) — total 12 quand même |
| harp (V1) | grave · médium · aigu | arpège · **glissando accordé** · près de la table | l'arpège qui scintille | glissando hors accord (le cliché ⚠) | la harpe DANS le tapis |
| choir (V1) | hommes · mixte · femmes | « ah » legato · « oh » tenu · staccato syllabique | la nappe mixte | l'aigu forcé | chœur + cordes (l'alliage sacré) |
| cor-anglais (V1) | grave · médium élégiaque · aigu | legato · tenuto · — | la mélancolie Ré4–Sol5 | grave | le solo sur tapis |
| clar-basse (V1) | contre-grave ⚠ mystère · chalumeau · clairon | legato · staccato · sub-tone | le contre-grave feutré | clairon exposé | l'ombre sous les bois |

*(19 × 12 = 228. Le piano et les percussions comptent 12 via leurs clips spéciaux.)*

## A.2 CATÉGORIE B — ALLIAGES ET DOUBLURES (36 clips)

Triptyque par alliage : `-solo-a` (6 s) / `-solo-b` (6 s) / `-blend` (10 s, la même phrase-étalon à l'unisson ou à l'octave selon l'alliage) — **l'élève entend le troisième timbre naître**. `lessonRefs: ["m07-l02"]`, tags émotion par alliage.
Les 10 alliages (tracés aux `blendsWith` des fiches — si la table extraite de §50 diffère à la marge, la section extraite prime, D-P19) : celli+cor (« LA doublure chaude ») · violons+flûte 8va (le ciel doublé) · alto+clarinette (le velours du milieu) · flûte+clarinette en tierces · celli+contrebasse 8va (le socle) · cor+basson (le liant grave) · trompette+trombone (la colonne) · violons+hautbois unisson (la ligne qui focalise) · chœur+cordes (la nappe sacrée) · harpe+piano (le scintillement) — soit 30 clips. Plus **les 3 distances** ×2 exemples (unisson / octave / écart composé, sur le thème T de m07-e02) = 6 clips `m12-alloy-distance-*`.

## A.3 CATÉGORIE C — LA SYNTHÈSE (40 clips, `lessonRefs` M6)

| Clips (id-suffixe) | n | Durée | Contenu et leçon |
|---|---|---|---|
| `adsr-percussif/soutenu/nappe/geste` | 4 | 6 s | les 4 existences de s01, mêmes hauteurs (m06-l01) |
| `motion-lfo/automation/random` | 3 | 10 s | les 3 vitesses de vie de s02 (m06-l02) |
| `pad-analog/digital/choir/ambient/hybrid` | 5 | 10 s | le même accord (Am9) dans les 5 familles (m06-l04) |
| `bass-sub/growl/attelage/ouverture` | 4 | 8 s | e06 décomposé : sub seul, growl seul, l'attelage, l'ouverture de filtre m7–8 (m06-l06) |
| `keys-rhodes/lofi` | 2 | 10 s | la progression de s07 dans les deux familles (m06-l07) |
| `lead-mono-glide/poly/vibrato-ab` | 3 | 8 s | Bruma 2 mes. : mono+glide sélectif · poly · vibrato immédiat VS delay 260 ms (m06-l08) |
| `pluck-calibre` + `arp-3v4` | 2 | 8 s | le release calculé (s09) · le pattern 3-contre-4 avec dérive (m06-l09) |
| `texture-grain/vent` + `drone-ouvert/musicalise` | 4 | 12 s | l'invisible de s05, dont le « néon accordé » (m06-l05) |
| `fx-riser/impact-sub/impact-corps/impact-debris/impact-full/braam/reverse/granular-drone` | 8 | 4–8 s | la phrase de bascule DÉCOMPOSÉE (les 3 couches de l'impact séparées puis ensemble) + reverse + nuage (m06-l10/l11) |
| `space-studio/cathedrale` | 2 | 12 s | le stack s03 dans les deux mises en scène de s12 (m06-l12) |
| `sidechain-off/on` | 2 | 8 s | le pad qui pompe (480 ms) — avant/après (m06-l13) |
| `sat-clean/driven` | 1 paire | 6 s | le growl 2400 → 4800 (F-34/m06-l13) |

## A.4 CATÉGORIE D — LES IDIOMES JAZZ (20 clips, `lessonRefs` M8)

`swing-1.0/2.0/3.2` (3×6 s, la phrase de s01 — m08-l01) · `voicing-shell/rootless` (2×8 s — l02) · `walking-2bars` (1×6 s — l05) · `comping-troue` (1×8 s — l13) · `bigband-saxes/bones/trumpets/rhythm` (4×6 s, le même riff par section — l12) · `block-close/drop2` (2×6 s — l12) · `distance-citer/styliser/hybrider` (3×12 s, la scène de s14 — l14) · `blue-note/enclosure/laidback/spread` (4×5 s — l04/l07/l01/l08).

## A.5 CATÉGORIE E — LES CONTRASTES PÉDAGOGIQUES (15 paires = 30 clips)

Chaque paire : `-wrong` puis `-right`, 8–10 s, MÊME matériau, un seul paramètre change. C'est le rayon « erreurs entendues » — chaque paire est citée par la table Erreurs de sa leçon ET utilisable en item ▶ de quiz.

| Paire | Leçon | Le paramètre qui change |
|---|---|---|
| masquage 300–800 / résolu | m06-l03 | le 2e pad muté |
| le tas / l'immeuble | m07-l07 | la densityMap étalée |
| boue sous C3 / éclaté | m01-l12 | l'intervalle grave |
| sub stéréo / mono | m06-l06 | width |
| pad statique / motion | m06-l02 | un LFO |
| crescendo-fader / leviers | m07-l06 | matière vs volume |
| thème couvert / duo réglé | m07-l05 | registre+cran du contrechant |
| quintes fautives / planing assumé | m01-l13 ↔ m03-l14 | le régime (le même passage !) |
| cadence de passage / arrivée tenue | m01-l16 (F-5) | la durée d'arrivée |
| quantize dur / Iterative 60 % | m10-l03 | le profil de grille |
| CC plat / arche | m10-l04 | dyn |
| tutti-tas / étagé | m07-l07 | (variante orchestrale de la paire 2, effectif plein) |
| glide permanent / sélectif | m06-l08 | le portamento |
| avoid posée / passante | m08-l06 (F-45) | la durée du fa |
| doublure gratuite / méritée | m07-l02 | la raison mesurable |

## A.6 CATÉGORIES F + G — AMBIANCES (15) ET GENRES (16)

**F — `mood-<id>`** : les 15 MOOD_TEMPLATES en démos de 8 mes. (12–15 s) — **rejoue les solutions M2 existantes** (m02-e21→e29 + s30-elena) : coût quasi nul, la notation existe déjà ; `lessonRefs`: m02-l10→l14, + item ▶ des quiz d'ambiance.
**G — 4 clips × 4 genres M9** : `<genre>-progression` (la progression-type, 10 s) · `-melodie` (le geste, 8 s) · `-couche` (l'instrumentation signature, 12 s) · `-anti` (l'anti-modèle : la romance qui ne redescend pas, l'épique-tas, le noir résolu, le thriller réverbéré — 10 s). `lessonRefs`: m09-l01→l04.

## A.7 Le pipeline de production d'un clip (20 min chrono, à la chaîne)

1. **Session-gabarit** (à créer une fois) : projet DAW `m12-template.cpr` — ♩=90, 4 pistes (source / contexte / bounce / talkback), export préréglé WAV 48/24, chaîne de mesure LUFS.
2. Par clip : ① colle la notation du manifeste (écris le manifeste AVANT la prise — c'est ta partition) ; ② joue/programme ; ③ édite (têtes/queues propres, 0.3 s de silence aux bords) ; ④ normalise la SESSION de paire à −18 LUFS (jamais clip par clip dans une paire) ; ⑤ exporte sous l'ID exact ; ⑥ upload R2 + commit du manifeste (PR avec la fiche).
3. **Contrôle qualité par lot de 20** : réécoute à froid le lendemain, au casque puis sur enceintes de téléphone ; re-prends sans état d'âme (variante `-v2`, D-P20).

## A.8 Le planning des 3 vagues

| Vague | Contenu | Clips | Heures | Quand |
|---|---|---|---|---|
| **P1** | 11 fiches MVP (132) + 6 alliages cités par les fiches MVP (18) + 10 paires-contrastes cœur | 160 | ~9 h 30 | pendant la beta (Phase 5.4) |
| **P2** | 8 fiches V1 (96) + synthèse (40) + jazz (20) | 156 | ~9 h | Phase 6, au fil des seeds M6/M8/M12 |
| **P3** | contrastes restants (10) + moods (15) + genres (16) + alliages restants (18) + marge | ~70 | ~3 h 30 | fin de Phase 6 |

## A.9 LES DEUX ASSETS AUDIOVISUELS (briefs de tournage complets)

### A.9.1 « La Remise » — la vidéo (90 s, MUETTE par conception)

**Rattachement** : m10-e12 (spotting), m10-e15 (capstone DAW), m06-e15 (capstone hybride), m11-e04 (corpus). **Il n'y a rien à dire dans cette vidéo** : c'est le film que l'élève doit mettre en musique — le silence est le produit. Le cahier des charges temporel EST le manifeste F-36 (♩=96.8 pour le spotting, marqueurs B1/B2/B3/H1/H2).

**Le plan de tournage, plan par plan** :

| TC | Marqueur | Plan | Contenu (ce qu'on voit) | Intention dramatique (ce que la musique devra porter) |
|---|---|---|---|---|
| 0'00–0'12 | IN | ext. jour, plan large | une allée de jardin en friche, un personnage (dos ou mains — pas de visage nécessaire) marche vers une remise en bois | l'ordinaire, la croisière — installation |
| 0'12–0'31 | — | plans moyens | il cherche une clé, hésite, essaie la porte | la première micro-tension |
| **0'31** | **B1** | int., l'entrée | la porte s'ouvre : l'INTÉRIEUR — poussière, rais de lumière, formes bâchées | **bascule de LIEU** (l'espace sonore s'ouvre — s12) |
| 0'31–1'02 | — | plans rapprochés, lents | il avance, effleure des objets : un vélo d'enfant, des cartons datés, un tissu | la mémoire qui monte — la crue |
| **1'02** | **B2** | insert | sa main soulève une bâche : UNE MALLE avec un nom peint | **bascule de PONCTUATION** (la phrase riser→impact de s10 se cale ici, barre 26) |
| 1'02–1'08 | — | il ouvre la malle | photos, un objet qu'on ne voit pas bien encore | la suspension |
| **1'08** | **H1** | CUT sec | **la porte claque** derrière lui (courant d'air) — il se retourne | **le HIT** (impact sec + apnée ; tempo×timecode : la mesure tombe dessus) |
| 1'08–1'22 | — | il revient à la malle | il sort l'objet : une petite boîte à musique / un carnet (au choix du tournage) | la compréhension qui approche |
| **1'22** | **B3** | plan poitrine | il comprend (geste : il s'assoit lentement, l'objet contre lui) | **bascule finale** — l'émotion nue |
| 1'22–1'34 | — | lent zoom / lumière qui bouge | immobilité habitée | la coda qui ne résout pas |
| **1'34** | **H2** | dernier geste | il referme doucement la malle — regard vers la porte (OUT ouvert) | le second hit, doux ; **l'OUT non résolu** (m09-l04 : la résolution appartient à l'image… suivante) |
| 1'30–1'30? → 1'30 | OUT | fondu | — | fin à 1'30 exactement (90 s) |

**Production** : deux options — (a) tournage smartphone stabilisé (2 h, lumière naturelle, aucune compétence rare : plans fixes, pas de dialogue, pas de visage) ; (b) montage de banque libre **avec cession écrite** (charte D-P14). Dans les deux cas, monte AU CHRONO : les 5 marqueurs à ±0,2 s des timecodes du manifeste (c'est non négociable : les checkers tempo×timecode en dépendent).
**Livrables** : `la-remise_clean_1080p24.mp4` (le film) + `la-remise_tc_1080p24.mp4` (timecode incrusté, pour les missions) + une vignette. **OÙ** : R2 `assets/la-remise/`, référencés par le manifeste (`files.clean`, `files.tc`).
**Intégration produit** : composant `<VideoMissionPlayer>` (Phase 6, missions DAW) — lecteur avec règle de timecode, marqueurs cliquables (les IDs du manifeste), et bouton « exporter les markers » (le .csv que l'élève importe dans Cubase pour m10-e12).
**FINI QUAND** : la vidéo lue dans le player affiche B2 exactement quand la main soulève la bâche, et le témoin MIDI de m10-e15 (dont la mesure 26 tombe sur B2) se vérifie contre elle.

### A.9.2 « Le fredon du réal » — l'audio (30 s)

**Rattachement** : m10-e13 (VariAudio) ; la cible est `fredon-target` du manifeste (F-49). **La partition à chanter** (ré mineur, ~♩=85 flottant) :
```
D4:q F4:q E4:q D4:q | A4:h G4:q F4:q | E4:q F4:q D4:h | C4:q D4:q A3:h   (×2, la reprise variée librement)
```
**Le brief de fausseté (voulu, spécifié — c'est la matière de l'exercice)** : ① mesure 3 : le mi chanté à l'octave SUPÉRIEURE ; ② mesure 6 (reprise) : le sol à l'octave INFÉRIEURE ; ③ mesure 5 : le segment `A4 G4` chanté DEUX fois (le réal se reprend) ; ④ tempo flottant ±8 % (ne te cale sur rien) ; ⑤ finit en parlant : « …tu vois, un truc comme ça » (2 s — l'humanité du document, coupée par l'élève).
**Prise** : n'importe quelle voix (la tienne), micro de téléphone acceptable, mono, pièce normale (le léger bruit est réaliste), UNE prise continue de ~30 s — ne corrige RIEN.
**Livrable** : `fredon-du-real.wav` (48/24 mono) sur R2 ; le manifeste F-49 pointe le fichier ET la cible notée (le checker `samePitchSequenceAsGiven` tolérant ≥ 90 % jugera la relecture de l'élève contre elle).
**FINI QUAND** : tu passes toi-même la mission m10-e13 sur ta propre prise et tu obtiens ≥ 90 % après correction des trois défauts (si TU n'y arrives pas, la prise est trop sale — refais-la).

---

# LES DIX PIÈGES (inchangés de la v1 — relis-les chaque fin de phase)
1. Front avant moteur. 2. Analyseurs « naïfs » à patcher plus tard. 3. Extraction bâclée. 4. music-core qui importe de l'app. 5. Pedagogy « plus tard ». 6. Pixel-perfect avant l'alpha. 7. Seuil ajusté sur UNE plainte. 8. Backups « après ». 9. Stripe avant des beta-users heureux. 10. Un son non traçable, un seul.

# LA CHECKLIST DE DÉMARRAGE (cette semaine)
- [ ] Décision de mode + jalon « verrou n°2 vert M1+M2 » daté
- [ ] Monorepo + lint d'isomorphisme + CI (0.2–0.3)
- [ ] docs/ versés (Manuel, Consolidation, sections de production)
- [ ] M1 extrait en entier (25/49/27/25) + `content:count` qui le prouve
- [ ] `types.ts` + `parseNotation` + verrou n°3 sur 10 solutions M1
- [ ] La session-gabarit `m12-template.cpr` créée (tu la remercieras en Phase 5)

*Fin du Guide d'exécution v2. Chaque tâche de ce guide a un chemin, un contenu, un exemple et un critère de fin — s'il te reste une zone floue, c'est une décision à inscrire au registre, pas une devinette à faire.*
