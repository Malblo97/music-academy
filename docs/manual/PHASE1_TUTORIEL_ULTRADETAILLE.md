# PHASE 1 — TUTORIEL ULTRA-DÉTAILLÉ (semaines 1–8)
## Le moteur `music-core` : de zéro au verrou n°2 vert sur 87 solutions

**Prérequis** : Phase 0 close (tag `v0.1-content-mvp`, `content:count` vert, annexe I + errata E-1→E-3 appliqués). **Objectif de la phase** : à la fin de la semaine 8, le moteur analyse, juge et explique — prouvé par les 5 verrous CI, dont le verrou-roi : **les 87 solutions M1+M2+M3 passent le pipeline avec score ≥ 85**.

**Les trois lois de la phase** (affiche-les) :
1. **Fixtures d'abord.** Aucune fonction ne s'écrit avant ses cas de test. Les entrées des fixtures sont de la notation réelle — souvent copiée des solutions.
2. **Version finale directement.** Chaque analyseur intègre ses findings à l'écriture (Consolidation §3 = ta spec). Tu ne codes JAMAIS la version naïve « à patcher plus tard ».
3. **Une PR par brique**, CI verte, message qui cite la spec (`feat(core): detectCadence — F-2/F-5/F-16`).

**Le rituel quotidien** : matin = fixtures du jour ; journée = code jusqu'au vert ; fin de journée = brancher au script `analyze` + commit. Pas de brique à moitié finie qui traîne la nuit.

---

# ORGANISATION DES FICHIERS (à créer semaine 1, jour 1 — vide, mais créé)

```
packages/music-core/
├── src/
│   ├── index.ts                  # ré-exporte tout ; ENGINE_VER
│   ├── types.ts
│   ├── notation/
│   │   ├── parse.ts  print.ts  swing.ts  humanize.ts
│   ├── analyzers/
│   │   ├── key.ts  chord.ts  cadence.ts  collection.ts  idioms.ts
│   │   ├── motifs.ts  contour.ts  phrase.ts  tension.ts
│   │   ├── rhythm.ts  swing.ts  chordscale.ts
│   │   ├── voiceleading.ts  species.ts  imitation.ts  suspension.ts
│   │   └── orchestration.ts
│   ├── data/
│   │   ├── instruments.ts  moods.ts  idioms.ts  jazzMarkers.ts
│   │   ├── translations.ts  krumhansl.ts  chordForms.ts
│   ├── rules/
│   │   ├── types.ts  registry.ts  profiles.ts
│   │   ├── melody.ts  harmony.ts  vl.ts  rhythm.ts  orch.ts  cp.ts  sd.ts  jazz.ts
│   ├── constraints/
│   │   ├── schema.ts  window.ts            # window.ts = F-41
│   │   └── checkers/{melody,harmony,structure,plans,performance}.ts
│   ├── pipeline/
│   │   ├── evaluate.ts  scoring.ts  feedback.ts  craft.ts  live.ts
│   ├── midi/{export,import,cc,tempo,quantize}.ts
│   └── generator/{recipe,truth,render}.ts
├── test/
│   ├── fixtures/<domaine>/*.json            # les cas nommés
│   ├── runner.ts                            # le lanceur générique de fixtures
│   ├── locks/{roundtrip,completeness,solutions,templates,generator}.test.ts   # verrous 3,1,2,4,5
│   └── solutions.ts                         # loadSolutions() → lit packages/content
└── scripts/analyze.ts
```

**Le format de fixture (unique pour tout le moteur)** — `test/fixtures/<domaine>/<nom>.json` :
```json
{ "name": "ger6-half-not-subv",
  "input": { "notation": "[Eb2+Bb3+C#4+G4]:w | [D2+A3+D4+F#4]:w",
             "opts": { "key": { "tonic": "G", "mode": "minor" }, "segmentEnd": true } },
  "expect": { "cadence": "half", "idioms": ["aug6-german"], "notCadence": ["perfect"] } }
```
**Le runner (`test/runner.ts`, ~40 lignes, écris-le jour 1)** : charge tous les JSON d'un dossier, `describe(domaine) → it(name)`, compare `expect` clé à clé (deep-subset : `expect` peut être partiel). Chaque analyseur n'a plus qu'à exposer une fonction `runFixture(input) → objet` enregistrée dans une map.

---

# SEMAINE 1 — TYPES + NOTATION (verrou n°3)

## S1.J1 — `types.ts` (le contrat de tout le moteur)

**OÙ** : `src/types.ts`. **CONTENU COMPLET** :
```ts
export const PPQ = 480;
export const TICKS: Record<string, number> = { w: 1920, h: 960, q: 480, e: 240, s: 120 };

export interface Note { pitch: number; start: number; duration: number; velocity?: number }
export interface DynPoint { tick: number; value: number }                     // F-39 (0–127)
export type Mute = 'con-sord' | 'straight' | 'cup';                           // F-40
export type Articulation = { tick: number; kind: 'staccato'|'legato'|'accent'|'tenuto' };

export interface Part {
  instrumentId: string; notes: Note[];
  dyn?: DynPoint[]; mute?: Mute; articulations?: Articulation[];
  swingTarget?: [number, number];                                             // F-44
}

export type LayerRole = 'sub'|'body'|'top'|'texture'|'movement'|'fx'|'melodic';
export interface Layer {
  id: string; role: LayerRole;
  source?: 'sine'|'saw'|'square'|'wavetable'|'granular'|'sample';
  band?: { low: number; high: number };
  adsr?: { a: number; d: number; s: number; r: number };                      // ms / 0–1
  motion?: { type: 'lfo'|'automation'|'lfo-random'; dst: string; [k: string]: unknown };
  sidechainedBy?: string; trigger?: boolean;                                  // F-38
  removed?: string; level?: number; width?: number; notes?: Note[];
}
export interface LayerStack { layers: Layer[]; bus?: { glue?: string }; space?: unknown }

export type Submission =
  | { kind: 'mono'; notes: Note[] }
  | { kind: 'voices'; voices: Note[][] }                                       // M4
  | { kind: 'parts'; parts: Part[] }                                           // M7+
  | { kind: 'layers'; stack: LayerStack; }                                     // M6
  | { kind: 'annotations'; annotations: unknown }                              // M11
  | { kind: 'midi'; parts: Part[]; cc: DynPoint[]; tempoEvents: TempoEvent[]; quantizeInfo: number };

export interface TempoEvent { tick: number; bpm: number; ramp?: boolean }
export type Severity = 'error' | 'warning' | 'suggestion' | 'info';
export interface Issue { ruleId: string; severity: Severity; atTick?: number;
  message: string; lessonRef?: string }
```
**FINI QUAND** : `typecheck` vert ; `index.ts` ré-exporte ; le smoke test importe `TICKS.q === 480`.

## S1.J2–J3 — `notation/parse.ts` + `print.ts`

**La grammaire (annexe A, formalisée)** :
```
score   := event (WS event)*            (les '|' sont des séparateurs ignorés MAIS comptés
                                         pour le contrôle de mesure : option strictBars)
event   := (rest | note | chord) ':' dur tie?
rest    := 'r'
note    := PITCH tie?                    # le tie POST-hauteur ne vaut que dans un accord (F-21)
chord   := '[' note ('+' note)* ']'
PITCH   := /[A-G](#|b)?-?\d/             # C4=60 ; Cb4=59 ; B#3=60 (enharmonie assumée, F-6)
dur     := [whqes] '.'?
tie     := '~'
```
**Sémantique des liaisons** (le point délicat — écris ces règles en commentaire au-dessus du code) :
- `X:d~` (mono) : la note fusionne avec la PROCHAINE occurrence de la même hauteur (événement suivant obligatoirement).
- Dans un accord : `[E4~+F4]:q` — E4 est lié individuellement ; F4 attaque (F-21). Une liaison vers une hauteur absente de l'événement suivant = **erreur de compilation** (message : `liaison F-21 sans cible : E4 lié mais absent de l'événement suivant (tick N)`).
- `print()` régénère les liaisons à l'identique (le round-trip exige la conservation).

**Implémentation (structure imposée)** :
```ts
// 1) tokenize : /\[|\]|\+|\||~|r|[A-G](?:#|b)?-?\d|:[whqes]\.?|\s+/g — tout token inconnu = erreur avec position
// 2) parse → événements bruts {tick, items:[{pitch|rest, tie}], durTicks}
// 3) résolution des liaisons (2e passe) → Note[] fusionnées
// 4) options : applySwing(notes, ratio) puis applyHumanize(notes, {seed, offsetRange})
export function parseNotation(src: string, opts?: ParseOpts): Note[]
export function printNotation(notes: Note[]): string
```

**`swing.ts` (F-43) — code complet, il est court et critique** :
```ts
/** Décale déterministiquement les croches de CONTRETEMPS. ratio 2.0 => le "et" au triolet. */
export function applySwing(notes: Note[], ratio: number): Note[] {
  const half = PPQ / 2;                          // 240 = la croche
  const off = Math.round(PPQ * ratio / (1 + ratio)) - half; // ex. r=2 → 320-240=+80 ticks
  return notes.map(n => {
    const pos = n.start % PPQ;
    const isOffbeatEighth = pos === half && n.duration <= half + 1;
    if (!isOffbeatEighth) return n;
    return { ...n, start: n.start + off, duration: Math.max(1, n.duration - off) };
  });
}
/** Mesure : ratio moyen des paires on/off ; null si aucune croche de contretemps (F-44). */
export function measureSwingRatio(notes: Note[]): number | null { /* miroir de l'aller */ }
```
**`humanize.ts` (F-35)** : PRNG déterministe (mulberry32(seed)), offset ∈ [−range, +range] sur `start`, jamais sur la première note, `print` n'est PAS censé survivre au humanize (il s'applique au RENDU) — donc le round-trip se teste AVANT humanize, et `measureSwingRatio` se teste APRÈS swing. Écris ce commentaire dans le fichier.

## S1.J4 — Les fixtures du parseur + le verrou n°3

**`test/fixtures/notation/`** — les 18 cas minimum (nom → entrée → attendu) :
| Fixture | Entrée | Attendu |
|---|---|---|
| basic-melody | `C4:q D4:e E4:e F4:h` | 4 notes, ticks 0/480/720/960, durées 480/240/240/960 |
| dotted | `G4:q.` | duration 720 |
| tie-mono | `E5:h~ E5:q` | UNE note, duration 1440 |
| tie-mono-broken | `E5:h~ F5:q` | erreur `liaison sans cible` |
| chords | `[C3+E4+G4]:w` | 3 notes même start/duration |
| inner-tie-f21 | `[E4~+F4]:q [E4+G4]:q` | E4 : 1 note dur 960 ; F4, G4 : 480 |
| inner-tie-invalid | `[E4~+F4]:q [G4+A4]:q` | erreur de compilation |
| rests | `r:q C4:q r:h` | 1 note à t=480 |
| accidentals | `F#3:q Bb4:q B#3:q` | pitches 54, 70, 60 (enharmonie F-6) |
| bars-ignored | `C4:h D4:h \| E4:w` | 3 notes, pas d'erreur |
| bars-strict | idem avec `strictBars:true` + métrique 3/4 | erreur de mesure |
| swing-2.0 | `C4:e D4:e C4:e D4:e` + ratio 2 | starts 0/320/480/800 |
| swing-quarters-noop | `C4:q D4:q` + ratio 2 | inchangé |
| swing-measure | (le résultat de swing-2.0) → `measureSwingRatio` | ≈ 2.0 ; sur des noires → null (F-44) |
| humanize-deterministic | seed 42 ×2 | sorties identiques |
| humanize-bounds | range 18 | max abs(offset) ≤ 18, note 1 intacte |
| solution-m03-s02 | la notation de `solutions/m03/m03-e02*.json` | 32 notes (8 accords ×4), round-trip |
| roundtrip-batch | 10 solutions M1 au hasard | `print(parse(x)) === normalize(x)` |

**Le verrou n°3** — `test/locks/roundtrip.test.ts` :
```ts
import { loadSolutions } from '../solutions.js';
test.each(loadSolutions().filter(s => s.notation))('roundtrip %s', s => {
  expect(printNotation(parseNotation(s.notation))).toBe(normalize(s.notation));
});
```
`normalize` : espaces uniques, barres régénérées selon la métrique. ⚠ Si une solution extraite casse le round-trip, c'est presque toujours un accident de copie de la Phase 0 (guillemets, tilde décollé) → corrige le CONTENU, note-le au commit.

## S1.J5 — `scripts/analyze.ts` (v0) + jalon

`pnpm analyze <chemin-solution.json>` : parse → imprime nb de notes, ambitus, durée en mesures, la notation régénérée. (Il s'enrichira chaque semaine — c'est ton stéthoscope.)

✅ **SEMAINE 1 FINIE QUAND** : verrou n°3 vert en CI sur M1+M2 entiers (56 notations) ; les 18 fixtures notation vertes ; `analyze` répond.

---

# SEMAINES 2–3 — LES ANALYSEURS (l'ordre est une dépendance)

**Discipline** : un analyseur par jour ouvré environ, dans l'ordre du tableau du Guide v2 §1.2. Pour chacun ci-dessous : signature exacte, algorithme numéroté, findings, fixtures avec ENTRÉES concrètes.

## S2.J1 — `analyzers/key.ts`

```ts
export interface KeyEstimate { tonic: number /*pc*/; mode: Mode; confidence: number;
  ambiguous: boolean; alternates: KeyEstimate[]; rawProfiles: number[] /*24, F-11*/ }
export function estimateKey(notes: Note[], opts?: { window?: [number, number] }): KeyEstimate
```
**Données** — `data/krumhansl.ts` (valeurs standard, copie-les telles quelles) :
```ts
export const KS_MAJOR = [6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88];
export const KS_MINOR = [6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17];
```
**Algorithme** :
1. Histogramme des 12 pitch-classes pondéré par durée.
2. Corrélation de Pearson contre les 24 rotations (12 maj + 12 min) → `rawProfiles` (**stocke-les AVANT toute retouche : F-11 en dépend**).
3. `confidence = best − second` ; `ambiguous = confidence < 0.08` (constante de calibrage, fichier `scoring.ts`).
4. **F-19, l'ancrage par insistance (AVANT d'accepter le verdict)** : calcule `insistencePc` = la pitch-class qui cumule (a) ≥ 50 % de la durée de la voix la plus grave, OU (b) première ET dernière basse identiques + majorité des temps forts. Si `insistencePc` existe ET diffère de la tonique Krumhansl ET que la collection est diatonique : **la tonique devient l'insistance**, et le mode = la rotation diatonique correspondante (dorien/mixolydien/…). Garde-fou (fixture négative) : si les degrés exposés autour de l'insistance ne contiennent pas la note caractéristique du mode candidat (le si du mixolydien de sol…), on NE bascule PAS.
5. Passe modale classique (sans insistance) : si majeur détecté mais ♭7 exposé/cadentiel → mixolydien, etc. (raffinement d'étiquette, jamais de changement de tonique hors F-19).

**Fixtures (8+)** : `c-major-plain` (gamme + cadence → C ionien, conf > .2) · `a-minor-harmonic` · `d-dorian-bourdon` (bourdon D2 sous collection blanche → **ré dorien**) · `mixo-cadence` (extrait de m03-s08-mixolydien → sol mixolydien) · `insistence-negative` (do majeur avec pédale de sol §s07b → **reste do**) · `ambiguous-f11` (`ambiguous:true`, rawProfiles exposés) · `phrygian-anchor` (s08-phrygien) · `window` (fenêtre mes. 9–14 de m03-s04 → mi♭ majeur).

## S2.J2 — `data/chordForms.ts` + `analyzers/chord.ts`

**Les 14 formes (fixe-les dans `chordForms.ts`)** — intervalles depuis la fondamentale, drapeau `fifthOptional` :
```
maj [0,4,7] · min [0,3,7] · dim [0,3,6] · aug [0,4,8] · sus2 [0,2,7] · sus4 [0,5,7]
maj7 [0,4,7,11]* · 7 [0,4,7,10]* · m7 [0,3,7,10]* · m7b5 [0,3,6,10]
dim7 [0,3,6,9] · mMaj7 [0,3,7,11]* · 6 [0,4,7,9] · m6 [0,3,7,9]        (* = fifthOptional, F-3)
```
```ts
export function detectChord(notes: Note[], at: {from:number;to:number},
  ctx?: { pedalPlan?: PedalPlan }): ChordResult | null
```
**Algorithme** : 1) verticalité = pitch-classes sonnant sur la fenêtre ; 2) **F-18** : si `ctx.pedalPlan` couvre la fenêtre, retire la pc de pédale AVANT le matching (elle sera jugée par le plan) ; 3) essaie chaque forme × 12 fondamentales — **match exact des pcs requises** (triade : les 3 ; accord de 7e : fondamentale+3+7 obligatoires, 5 optionnelle) ; 4) départage : forme la plus riche compatible, puis basse = fondamentale > renversement ; 5) `null` si rien (jamais de fallback — échec bruyant) ; 6) qualification des étrangères (la table des six) exposée par `classifyNonChordTone(note, prev, next, beatWeight)`.

**Fixtures (12+)** : les 14 formes ×2 voicings · `enharmonic-ger6` (`[Eb3+G3+Bb3+C#4]` → forme `7` sur E♭, F-6) · `incomplete-rejected` (`[D3+F3+D4+D4]` → null, F-3) · `seventh-no-fifth-ok` (`[G2+B3+F4]` → G7 ✓) · `pedal-excluded-f18` (s07 mes. 7 avec plan → F majeur) · `nct-passing/appoggiatura/suspension` (3 cas de la table des six).

## S2.J3 — `analyzers/cadence.ts` (+ `functionOf`)

```ts
export function functionOf(chord: ChordResult, key: KeyEstimate): 'T'|'S'|'D'|'other'
export function detectCadences(chords: TimedChord[], key: KeyEstimate,
  opts: { segmentEnd?: number; melodyOnly?: Note[] }): CadenceEvent[]
```
**Algorithme** : 1) fenêtre glissante paire (pénultième→finale) ; 2) classes : perfect (V fond.→I fond. + soprano 1̂), imperfect, half (arrêt sur V), deceptive (V→vi), plagal ; 3) **F-5** : n'enregistre que si l'accord d'arrivée tient ≥ 1 mesure OU termine le segment ; 4) **F-16** : si la pénultième porte le tag `aug6` (l'idiome tagger tourne AVANT — dépendance d'ordre à respecter dans le pipeline), la paire est classée dans la tonalité COURANTE (half le plus souvent), jamais « perfect du monde du subV » ; 5) **F-2**, fallback monophonique (si `melodyOnly`) : perfect ⇔ pénultième ∈ {7̂,2̂} + finale 1̂ longue sur temps fort ; half ⇔ finale ∈ {5̂,2̂} suspendue.
**Fixtures** : `perfect-basic` · `imperfect-soprano-3` · `half-hold` · `deceptive` · `passing-not-cadence-f5` (m03-s04 mes. 4–5 en cours de segment → []) · `mono-perfect-f2` / `mono-half-f2` · `ger6-half-not-subv-f16` (l'exemple du format de fixture, plus haut).

## S2.J4 — `analyzers/collection.ts` + `analyzers/idioms.ts`

Collections : diatonique (12 rotations), pentatonique, tons entiers (2), octatonique (3), chromatique, **melodic-minor (12, F-20)** → `detectCollection(notes, window) → {family, transposition, coverage}` (coverage = part des durées dans la collection ; seuil 0.95 pour « stricte »).
Idiomes (détection PAR COMPORTEMENT, `data/idioms.ts` déclare les patterns) : `neapolitan` (majeur sur ♭2̂, position de sixte, contexte S→D) · `aug6-{it,fr,ger}` ({♭6̂,1̂,♯4̂}+, basse ♭6̂→5̂) · `dim7-passing` (escalier de basse, toutes voix conjointes/communes) · `dim7-pivot` (tenu ≥ 1 mes. + sortie vers une tonique à distance) · `subV` (7 sur ♭2̂ → basse ½ ton desc.) · `back-door` (iv–♭VII7→I) · `line-cliche` (voix interne chromatique sous accord tenu) · `planing-{real,diatonic,quartal}` (≥ 3 verticalités de même structure en mouvement parallèle) · `quartal` / `quartal-release` · `augmented-pivot` · `ger6-v7`.
**Fixtures** : un extrait RÉEL de solution par idiome (copie la/les mesures concernées : s02 m6 → neapolitan ; s03 m4 → aug6-ger ; s04 m2 → dim7-passing ; s04 m7–8 → dim7-pivot ; s14-M3 → les trois planing ; etc.) + `collection-lydian-b7-f20` (s09 → melodic-minor, rotation IV).

## S2.J5 — `analyzers/motifs.ts` (le plus gros analyseur : réserve la journée pleine)

```ts
export interface Motif { anchor: number; length: number;
  intervalShape: number[]; rhythmShape: number[]; occurrences: Occurrence[] }
export interface Occurrence { at: number; kind: 'exact'|'transposed'|'rhythmic'|'inverted';
  sub?: 'real'|'tonal'|'augmentation'|'diminution' }
export function findMotifs(notes: Note[], opts?): MotifReport
// MotifReport: { motifs, bestMotif, hasVariedRepetition, maxExactRepetitions, fragments }
```
**Algorithme** : 1) candidats = toutes fenêtres 3–8 notes ; 2) signature = (intervalShape, rhythmShape en RATIOS sur la 1re durée) ; 3) matching des occurrences : exact (les deux identiques) ; `transposed.real` (intervalles identiques, ancrage libre) ; **`transposed.tonal` (F-12)** : intervalles à ±1 dt près SI signes du contour identiques ET rhythmShape identique ; `rhythmic` : intervalShape identique + rythme différent — **y compris le facteur d'échelle uniforme (F-10)** : si rhythmShape égal mais durées absolues × k, k ≥ 1.5 → `augmentation`, k ≤ 0.67 → `diminution` ; `inverted` : intervalShape × (−1), gardes ≥ 3 intervalles ET rythme conservé ; 4) le `bestMotif` = couverture × distinctivité ; 5) `fragments` : sous-motifs ≥ 3 notes à ≥ 3 occurrences HORS occurrences complètes (covered-set), drapeau `isDistinctive` si le fragment contient l'intervalle max OU la durée la plus atypique du parent.
**Fixtures (10+, entrées écrites en notation)** : `exact-x3` (`C4:q E4:q G4:h` ×3) · `transposed-real` (+5 exact) · `tonal-f12` (`G4:q A4:q B4:q C5:q` puis `E4:q F#4:q G#4:q A4:q` → tonal ✓ — l'exemple de s05) · `tonal-negative-contour` (un signe inversé → refusé) · `tonal-negative-rhythm` (rythme changé → refusé) · `augmentation-f10` (`C4:q D4:q E4:h` puis `C4:h D4:h E4:w` → rhythmic/augmentation) · `inverted` · `inverted-too-short` (2 intervalles → refusé) · `fragment-distinctive` (la tête au saut de 6te fragmentée sur le saut → isDistinctive:true) · `fragment-filler` (fragment conjoint du remplissage → false) · `covered-set` (les occurrences complètes n'alimentent pas le compte des fragments).

## S3.J1 — `contour.ts`, `phrase.ts`, `rhythm.ts`

- `contour(notes)` → chaîne compressée U/D/R + appariement aux **5 silhouettes** (arche : U+ puis D+ avec sommet unique ; chute ; ascension ; vague : ≥ 2 alternances ; plateau : ambitus ≤ 4 dt) + `peaks[]` (les sommets, pour `climaxWindow`).
- `phraseAnalysis(notes, meter)` → frontières (silence ≥ noire OU longue+réattaque), `elisions` (frontière sans silence + réattaque temps fort), structures `period` (2 phrases, antécédent suspendu / conséquent conclusif) et `sentence` (1+1+2 : deux énoncés courts semblables + un long).
- `rhythmProfile(notes, meter)` → densité, entropie des durées, `syncopationScore` (part des attaques hors temps pondérée), asymétries (détection 3+3+2), `prosodyCorrelation(notes)` = Pearson(durée×vélocité, poids métrique) avec option `inverted` (le jazz, m08).
**Fixtures** : 5 silhouettes (une notation chacune) · `elision` · `sentence-112` (le gabarit 1+1+2 sur 4 mes.) · `syncopation-332` · `prosody-trochee` / `prosody-inverted-swing`.

## S3.J2 — `tension.ts` (+ `data/moods.ts`)

`data/moods.ts` : **copie les 15 gabarits de l'annexe D du Manuel, valeurs exactes**, + les alias (`bittersweet→sad`…).
```ts
export function tensionCurve(notes: Note[] | Part[], opts?): number[]   // 1 point / demi-mesure
export function archFit(curve: number[], moodId: string): { fit: number; regime: 'pearson'|'flatness' }
```
**Algorithme tensionCurve** : par fenêtre — termes bruts : hauteur relative (moyenne pondérée), densité d'attaques, dissonance (pcs hors accord/collection locale + intervalles durs), surprise (écart au n-gramme précédent) ; **F-23 : chaque terme est z-scoré SUR LA PIÈCE** avant la somme pondérée ; sortie re-normalisée 0–1.
**archFit** : rééchantillonne à 16 points ; si `variance(template) < 0.015` (mysterious, scifi) → **régime platitude** : `fit = 0.5·(1−|flat(curve)−flat(tpl)|) + 0.5·(1−|alt(curve)−alt(tpl)|)` ; sinon Pearson. `tensionHarmonyCoupling` (jazz_ballad) : corrélation pics↔tensions harmoniques posées.
**Fixtures** : `heroic-fit` (la solution m02 du thème héroïque → fit ≥ 0.6 sur `heroic`) · `mysterious-flatness` · **`octatonic-f23`** (s17-octatonique : fit < 0.4 SANS normalisation — teste en désactivant F-23 par option interne — et ≥ 0.7 AVEC) · `antagonists` (une solution `joyful` → fit(sad) < fit(joyful) − 0.15 : prépare le verrou n°4).

**Verrou n°4** — `test/locks/templates.test.ts` : pour chaque solution d'ambiance M2 (e21→e29 + s30-elena) : `archFit ≥ 0.6` sur SON mood ET score inférieur sur ses antagonistes déclarés (joyful↔sad, epic↔scifi, heroic↔mysterious). Rouge = on recalibre le GABARIT, pas la solution (Manuel §3.9).

## S3.J3 — `swing.ts` (mesure), `chordscale.ts`

- `measureSwingRatio(notes)` : déjà écrit S1 — ajoute la version **par part** (F-44) : `swingReport(parts) → {partId, ratio | null}[]`.
- `chordScaleCheck(notes, chords, key)` : mappe chaque note → gamme de l'accord (table chord→scale dans `data/`) ; hors-gamme = issue SAUF chromatisme conduit ; **avoid notes (F-45)** : la note d'évitement (la 4 sur maj, la ♭9 d'un ii…) est légale si *passante* (temps faible ET durée < noire ET quittée par degré), flaguée si *posée* (temps fort OU ≥ noire OU quittée par saut).
**Fixtures** : `avoid-4-lives` (le fa sur Cmaj7 : passant ✓ · posé-temps-fort ✗ · posé-long ✗ · quitté-par-saut ✗ — QUATRE fixtures) · `walking-na-f44` · `swing-per-part`.

## S3.J4 — `voiceleading.ts`

```ts
export function voiceLeadingIssues(voices: Note[][], key: KeyEstimate,
  ctx: { idioms: IdiomTag[]; cadences: CadenceEvent[] }): Issue[]
```
**Détections + EXCEPTIONS codées (chacune → message dédié)** :
1. Parallèles parfaites : deux voix, intervalles de classe {0,7} (mod 12, composés inclus) sur deux verticalités CONSÉCUTIVES en mouvement de MÊME direction. Exceptions : (a) octave/quinte d'arrivée par mouvement contraire = légal silencieux ; (b) directe aux voix extrêmes avec soprano par degré en zone cadentielle = légal (l'« exception soprano-par-degré ») ; (c) **F-15** : la paire ♭6̂→5̂ // ♭3̂→2̂ sous tag `aug6-ger` → `info` « quintes de Mozart » (jamais error) ; (d) sous tag `planing` → crédit (profil décide).
2. Sensible : doit monter à 1̂. Exceptions : frustrée en voix INTERNE (→5̂) ; **F-1** sensible de passage (approchée degré sup., quittée degré inf., ligne conjointe ≥ 3, hors cadence → suggestion) ; idiome « sensible de V/V devient 7e de V » (trajet chromatique descendant tagué).
3. 7e : descend (issue sinon, sauf tag d'échange de voix).
4. Espacement (`vl.spacing`) ; doublure de sensible.
**Fixtures (12+, notation à 2–4 voix)** : `parallel-fifths-basic` · `contrary-arrival-ok` · `direct-octave-cadential-ok` (la fin de s02) · **`mozart-tagged-info`** (s03 m9→10 AVEC tag) · `mozart-untagged-error` (mêmes notes SANS tag) · `frustrated-inner-ok` · `passing-lt-f1` · `lt-unresolved-error` · `seventh-up-error` · `doubled-lt-error` · `spacing-tenth` · `planing-credited`.

## S3.J5 — `species.ts`, `imitation.ts`, `suspension.ts`

- **Espèces 1–5** : `checkSpecies(n, cf, cp, opts)` — contrats par espèce (consonances par position ; passage sp2 ; catalogue sp3 dont **cambiata** 8-7-5-6 ; sp4 : préparation-liaison-résolution + **F-27** ≤ 1 rupture (`syncope-break`, gratuite en clausule) ; sp5 : mix + `texturePlan`). Transverses : **F-25** (fenêtre de clausule admet ♯7̂, tag `ficta` ; hors fenêtre = erreur) ; **F-26** (voix sous le CF : contour évalué en miroir — extremum = le creux, fenêtre 40–75 % ; remontée cadentielle hors comptage).
- **`imitation.ts`** : `detectEntries(voices, head, opts)` — entrées de tête ; `opts.answer: 'real'|'tonal'` (**F-28** : tolérance ±1/±2 dt sur la ZONE DE MUTATION seulement — 1er ou 2e intervalle — contour/rythme conservés) ; `canonCheck` (identité décalée sauf clausule, rupture taguée) ; `stretteCheck(entries|heads[])` (**F-32** : plusieurs têtes → timeline fusionnée, arche de délais mesurée) ; `invertibleCheck(cs, subject)` (les deux positions consonantes).
- **`suspension.ts` (F-29)** : sur TOUTE paire de voix, pattern préparation (consonance) → liaison → dissonance sur appui → résolution descendante par degré ; typage 4-3/7-6/9-8 ; chaînes détectées.
**Fixtures** : par espèce, **les volets de M4 servent d'étalons positifs** (s02-v1 → sp1 propre ; s05-v2 → chaîne 7-6 ×3 ; etc. — copie les notations des solutions) + négatifs fabriqués : `ficta-midline-error` · `syncope-two-breaks-error` · `tonal-answer-f28` (le sujet de s10 : `G3:q D4:e C4:e Bb3:q A3:q…` répondu `D4:q G4:e F4:e Eb4:q D4:q…` → accepté tonal ; muté au 3e intervalle → refusé) · `two-heads-strette-f32` (les entrées de s12-M4 acte 2 : Δ mesurés 2/1/0.5) · `free-suspension-f29` (s08-M4 m12–13).

## S2–S3, fil rouge — `orchestration.ts` + `data/instruments.ts`

**`data/instruments.ts`** : transcris l'annexe F du Manuel LIGNE À LIGNE (ranges, sweetSpots, registerZones+exposedRisk, dynamicPower, agility, sustain, blendsWith/avoidWith, transposition, **muteModifiers F-40** : `{'con-sord': {power: 0.65, blend: +1}}`…) + `ENDURANCE_BUDGET = { breath: {normal: 8, high: 6}, lips: {normal: 12, high: 4} }`. Commentaire-citation au-dessus de chaque entrée : `// fiche m05-cello §Carte d'identité` (règle §7.1).
```ts
export function effectivePower(instrumentId, pitch, dynOrVelocity, mute?): number
export function densityMap(parts: Part[], window): BandOccupancy[]
export function enduranceIssues(part: Part): Issue[]
```
`effectivePower` : interpolation pp→ff par la dynamique (dyn[] F-39 prioritaire sur velocity), **corrections par zone** (flûte ×0.4→×1.6 selon la hauteur — les valeurs de la fiche), × muteModifier.
**Fixtures** : `flute-low-vs-high` · `con-sord-065` · `lips-high-budget` (trompette aiguë 6 mes. → issue à la 5e) · `density-tas` (accord serré médium 8 voix → surcharge de bande) vs `density-immeuble`.

✅ **SEMAINES 2–3 FINIES QUAND** : ≥ 500 fixtures vertes (compte-les : `grep -rl name test/fixtures | wc -l`) ; verrou n°4 vert ; `pnpm analyze solutions/m03/m03-e04.json` imprime : « tonalité C→E♭ (fenêtres) ; idiomes : dim7-passing m2, dim7-pivot m7 ; cadence parfaite m12 » — conforme à la table de §63.2.

---

# SEMAINE 4 — RÈGLES, PROFILS, CONTRAINTES (verrou n°1)

## S4.J1 — `rules/types.ts` + le registre

```ts
export interface RuleCtx { submission: Submission; analysis: AnalysisBundle;
  spec: ExerciseSpec; window: EvalWindow /* F-41 */ }
export interface Rule { id: string; severity: Severity; weight: number;
  appliesTo: SubmissionKind[]; detect(ctx: RuleCtx): Issue[];
  pedagogy: { why: string; how: string; when: string; commonMistake: string; alternative: string };
  lessonRef: string }
export const REGISTRY: Map<string, Rule>  // rules/registry.ts — échec bruyant si id inconnu
```
**Écris les ~46 règles de l'annexe B, famille par famille, PEDAGOGY LE JOUR MÊME.** Rythme réaliste : 12–15 règles/jour (le `detect` appelle les analyseurs déjà faits — c'est de l'assemblage). Ordre : `melody.*` (J1) → `harmony.*` + `vl.*` (J2) → `rhythm.*` + `orch.*` (J3) → `cp.*` + `sd.*` + `jazz.*` (J3–J4). Chaque règle : ≥ 10 fixtures ? Non — les analyseurs portent déjà la détection ; ici, **3 fixtures/règle suffisent** (déclenche / silencieuse / re-pondérée par profil), le solde des « 10 » vit dans les fixtures d'analyseurs.
**Test de qualité pedagogy (fais-le vraiment)** : lis chaque bloc à voix haute comme si tu répondais à un élève. Une phrase qui sonne prof-de-solfège-aigri se réécrit.

## S4.J2 — `rules/profiles.ts`

Matrices EXPLICITES (extraits — complète depuis Manuel §3.6) :
```ts
export const PROFILES: Record<string, StyleProfile> = {
  'classical-common': { weights: {}, flags: {} },                       // les poids par défaut
  'romantic-film':    { weights: { 'melody.leap-recovery': 1.3 } },
  'epic-film':        { weights: { 'vl.parallel-perfects': 0.1 } },
  'thriller-tension': { weights: { 'melody.monotony': 0, 'melody.tension-placement': 0 },
                        flags: { repetitionIsPositive: true } },
  'neo-noir': {...}, 'jazz': { weights: { 'harmony.unresolved-seventh': 0.3 } },
  'hybrid-sd': {...}, 'impressionist': { weights: { 'vl.parallel-perfects': 0 } },
  'modern-horror': {...},
};
```
Surcharge locale : `spec.styleProfile.ruleWeights` fusionne PAR-DESSUS. Fixture : la même soumission thriller notée sous `classical-common` (monotony déclenche) puis `thriller-tension` (silencieuse).

## S4.J3–J4 — `constraints/` (les ~80 checkers)

- `schema.ts` : le Zod de l'annexe C (copie la liste clé à clé — c'est long et bête : 2 h).
- `window.ts` (**F-41**) : `markGivenTicks(spec) → EvalWindow` ; TOUT checker et TOUTE règle reçoivent `window` et ignorent les ticks du given (le given reste contexte : liaisons, préparations, raccords aux frontières).
- `checkers/` : une fonction par clé, signature commune `check(key, value, ctx) → {pass, detail, performanceOnly?}`. Groupes : `melody.ts` (motif/contour/climax/ambitus/degrés…), `harmony.ts` (cadences/idiomes/plans/guide-tones…), `structure.ts` (longueurs/phrases/segments), `plans.ts` (tensionPlan **avec direction F-24**, pedalPlan, rolePlan, crescendoPlan), `performance.ts` (quantize/swingTarget — drapeau **F-35** : sautés par le verrou n°2, exigés des soumissions).
- Les clés à mécanique spéciale, avec leur fixture-témoin : `samePitchSequenceAsGiven{transposed}` (**F-17** — s05-M3 fenêtre finale) · `requireAmbiguousKey` (**F-11**, lit rawProfiles) · `requiredCadenceOneOf` (**F-14**) · `acceptedTranslations` (**F-42**) · `minMotifOccurrences` sous `requireFragmentation` (**F-13**).

**Verrou n°1** — `test/locks/completeness.test.ts` :
```ts
const used = collectConstraintKeys(loadSpecs());        // toutes les specs extraites
const impl = new Set(Object.keys(CHECKERS));
expect([...used].filter(k => !impl.has(k))).toEqual([]);           // clé sans checker = ROUGE
console.warn('checkers orphelins:', [...impl].filter(k => !used.has(k)));  // l'inverse = warning
```
✅ **SEMAINE 4 FINIE QUAND** : verrou n°1 vert sur M1+M2+M5+M9 ; les 46+ règles enregistrées ; 3 fixtures/règle ; le test de profil thriller passe.

---

# SEMAINES 5–6 — LE PIPELINE ET LE VERROU-ROI (n°2)

## S5.J1–J2 — `pipeline/evaluate.ts` + `scoring.ts`

**`evaluate.ts` — la fonction-produit (structure imposée, écris-la dans cet ordre)** :
```ts
export function evaluate(submission: Submission, spec: ExerciseSpec,
  opts?: { profileOverride?: string }): FeedbackReport {
  // 1. Validation Zod (submission conforme au kind de la spec) — échec bruyant sinon
  // 2. window = markGivenTicks(spec)                                     (F-41)
  // 3. analysis = runAnalyzers(submission, spec, window)
  //    ORDRE OBLIGATOIRE : key → collection → IDIOMS → chord → cadence → le reste
  //    (F-16 : le tagueur d'idiomes tourne AVANT la classification cadentielle)
  // 4. constraints = runCheckers(spec.constraints, {submission, analysis, window})
  //    — les performanceOnly sont évaluées mais marquées (F-35)
  // 5. issues = runRules(REGISTRY, ctx) pondérées par le profil (spec.styleProfile)
  // 6. craft = computeCraft(kind, analysis, spec)                        (pipeline/craft.ts)
  // 7. score = computeScore(spec.rubric, {issues, constraints, craft})   (scoring.ts)
  // 8. report = buildFeedback(...)                                       (feedback.ts)
}
```

**`scoring.ts` — LES CONSTANTES DE CALIBRAGE (un seul fichier, commenté, versionné)** :
```ts
/** Constantes validées par le verrou n°2 (les 191 solutions >= 85).
 *  Toute modification = procédure de finding (fixture du cas réel + re-run des 191 + note DECISIONS). */
export const SEVERITY_PENALTY: Record<Severity, number> =
  { error: 0.15, warning: 0.06, suggestion: 0.02, info: 0 };
export const AMBIGUOUS_KEY_CONF = 0.08;
export const MAX_ISSUES_SHOWN = 6;
export const IMPROVED_VERSION_MAX_CHANGE = 0.30;

export function computeScore(rubric, { issues, constraints, craft }) {
  const correctness = clamp01(1 - sum(issues.map(i => SEVERITY_PENALTY[i.severity] * i.weight)));
  const scoredCs = constraints.filter(c => !c.performanceOnly || c.evaluated);   // F-35/F-48
  const constraintsScore = scoredCs.length ? avg(scoredCs.map(c => c.pass ? 1 : 0)) : 1;
  return Math.round(correctness * rubric.correctness
                  + constraintsScore * rubric.constraints
                  + craft * rubric.craft);
}
```

**`craft.ts` — les métriques positives PAR KIND (c'est ici que « bien » devient un chiffre)** :
| Kind | Composantes du craft (moyenne pondérée, chacune 0–1) |
|---|---|
| MELODY_COMPOSE | motif développé (couverture × variété des types) · archFit vs targetMood · conjoint/disjoint dans la norme du style · prosodie |
| CHORD_PROGRESSION / HARMONIZE | conduite propre (bonus zéro-parallèle) · variété des positions · idiomes tagués exploités · basse chantante (contour de la voix grave, F-26 réutilisé) |
| COUNTERPOINT | indépendance (contraire/oblique %) · grappes d'imparfaites ≤ 3 · figures du catalogue employées |
| LAYERING | complétude des rôles · discipline des bandes · `removed` argumenté (présence + longueur ≥ 40 car.) |
| ORCHESTRATE (parts) | rolePlan tenu · alliages de la table · dyn[] vivante (variance par tenue) · densityMap étagée |
| DAW/ANALYSIS | — (le craft vit dans les checkers de preuve / la concordance) |

## S5.J3 — `pipeline/feedback.ts`

Règles d'assemblage (chacune testée) :
1. Tri des issues : `error > warning > suggestion` puis poids ; **plafond MAX_ISSUES_SHOWN = 6** ; les masquées comptent dans le score mais pas dans le rapport (champ `hiddenIssueCount`).
2. Chaque issue embarque `pedagogy` + `lessonRef` (déjà dans la Rule) + `atTick`.
3. `strengths` (2–4) : générées depuis le craft (composante ≥ 0.8 → phrase-gabarit : « Le b2 plonge en tierce diminuée — l'idiome complet (m03-l02 §3) ») et les contraintes remarquables passées.
4. `improvedVersion` : **null au MVP** (décision d'implémentation : la V1 branchera des heuristiques par famille de défaut ; le plafond ≤ 30 % de notes modifiées est déjà codé dans le type et vérifié). Inscris la décision dans DECISIONS_LOCALES.
5. Snapshot-test du rapport COMPLET de m03-e02 soumis avec s02 (le JSON du Guide v2 §1.4 est la référence).

## S5.J4–J5 + S6 — Le verrou n°2 et la remontée des 87

**`test/solutions.ts`** :
```ts
export function loadSolutions(modules?: string[]): SolutionFile[]   // lit packages/content/solutions
export function compileSolution(s: SolutionFile, spec): Submission  // par kind :
// notation → {kind:'mono'} · payload.voices → 'voices' · payload.parts → 'parts'
// payload.layers → 'layers' · payload.annotations → 'annotations'
// + application de solution.swing / solution.humanize au RENDU (F-43/F-35)
```
**`test/locks/solutions.test.ts` (F-48, polymorphe)** :
```ts
for (const s of loadSolutions(['m01','m02','m03'])) {
  const spec = specOf(s.exerciseId);
  it(`${s.exerciseId} — ${spec.kind}`, () => {
    const sub = compileSolution(s, spec);
    switch (lockKindOf(spec.kind)) {
      case 'score': {
        const r = evaluate(sub, spec);
        expect(r.score, dump(r)).toBeGreaterThanOrEqual(85);
        expect(r.constraintResults.filter(c => !c.performanceOnly && !c.pass)).toEqual([]);
        break; }
      case 'proof':      expect(runProofCheckers(sub, spec).every(c => c.pass)).toBe(true); break; // M10, S7
      case 'checklist':  expect(lintChecklist(s.payload)).toEqual([]); break;
      case 'analysis':   expect(concordance(s.payload, truthOf(spec))).toBeGreaterThanOrEqual(0.95); break; // M11, S8
    }
  });
}
```
**La remontée (le vrai travail de la semaine 6)** — procédure par solution rouge :
1. `pnpm analyze solutions/mXX/<id>.json --spec` → le rapport complet.
2. Compare à la table de vérification de la solution (sa section §26–§77 : chaque solution a la sienne). Trois diagnostics possibles :
   - **ton code diverge de la spec** (le cas dominant : un seuil mal lu, une fenêtre off-by-one, un ordre d'analyse) → fixture minimale qui reproduit → patch ;
   - **la solution extraite est corrompue** (accident de copie Phase 0) → corrige le contenu, commit `content(fix)` ;
   - **divergence d'interprétation réelle** (rare) → décision au registre AVANT tout patch, avec le raisonnement.
3. Journal : `docs/qa/lock2-run.md` — une ligne par rouge résolu (id, diagnostic, correctif). Ce journal EST ta preuve de calibrage.
**Ordre de remontée conseillé** : M1 (le plus simple) → M2 (motifs/moods) → M3 (le crash-test harmonique : si `estimateKey`+`idioms`+`cadence` tiennent M3, ils tiennent tout).

✅ **SEMAINES 5–6 FINIES QUAND** : verrou n°2 vert sur **87/87** (M1 27, M2 29, M3 31) ; le snapshot du rapport m03-e02 figé ; `lock2-run.md` raconte chaque rouge ; tag `v0.2-engine-core`.

---

# SEMAINES 7–8 — WORKER, MIDI, GÉNÉRATEUR (verrou n°5)

## S7.J1–J2 — Le flux A : `pipeline/live.ts` + le Worker

- `evaluateLive(partial: Note[], spec): Issue[]` — sous-ensemble RAPIDE : pas de craft, pas de strengths, pas d'improvedVersion ; analyseurs coûteux (motifs, tension) en mode fenêtre courte ; contraintes `performanceOnly` ignorées.
- `apps/web/workers/engine.worker.ts` (10 lignes : import music-core, onmessage → evaluateLive → postMessage). Protocole : `{seq, notes, specId} → {seq, issues, ms}` (le `seq` évite les réponses périmées).
- **Mesure de perf obligatoire** : un bench (`test/perf/live.bench.ts`) sur la plus grosse solution M3 (s18-part1, 16 mes. ×4 voix) : **p95 < 150 ms** avec CPU throttling ×4 (Chrome DevTools ou `--cpu-prof`). Si tu dépasses : memoïze l'analyse d'accords par fenêtre, et ne relance motifs que toutes les N frappes.

## S7.J3–J5 — Le flux C : `midi/`

- Dépendance autorisée : `@tonejs/midi` (pur JS, isomorphe — inscris l'exception dans le commentaire du lint).
- `export.ts` : Part[] → SMF type 1 (une piste/part, nom = instrumentId), **CC1 généré depuis `dyn[]`** (F-39 : interpolation linéaire entre points, résolution 1/32), tempo map depuis `tempoEvents`, PPQ natif 480.
- `import.ts` : SMF → Part[] + `ccStream` + `tempoEvents` + **`quantizeInfo`** (part des attaques à < 10 ticks d'une grille 1/16 → 1.0 = mécanique ; 0.55–0.75 = « vivant Iterative »).
- Checkers de preuve (`midi/checkers.ts`, consommés par le verrou n°2 branche `proof`) : `ccCoverage` (≥ x % des tenues > 2 temps couvertes) · `ccPerNoteVariance` (zéro plateau) · `ccTensionCorrelation` (Pearson CC1 ↔ tensionCurve ≥ seuil de la spec) · `tempoEvents` (rampe ≥ 8 % en cadence, variance bornée, **notes identiques au donné**) · profils de quantisation.
- **Fabrique les 5 MIDI-témoins de §76** avec ton propre `export.ts` (e03, e04, e09, e11, e13 — leurs recettes sont dans la section) → `packages/content/solutions/m10/*.mid` + le JSON étalon qui les référence. Round-trip : export→import→les checkers passent. *(Oui, le serpent se mord la queue — c'est le test d'intégration du flux C.)*

## S8.J1–J3 — Le générateur + verrou n°5

- `generator/recipe.ts` : le schéma Zod de §77.0 (seed, system, form, motif.plan, tensionPlan F-24, rolePlan, idioms, ambiguousZones).
- `truth.ts` : résout la recette en ticks → `GenerationTruth`.
- `render.ts` (v1 volontairement simple — « le juste avant le beau ») : par système — fonctionnel : grille par functionPlan + mélodie = motif planté + remplissage conjoint ; modal : boucle de piliers + insistance ; non-fonctionnel : collection + textures types. PRNG seedé partout : **recette+seed = mêmes notes, toujours** (fixture d'idempotence).
- **Verrou n°5** — `test/locks/generator.test.ts` : pour chacune des 8 recettes extraites (G-M48, G-05, G-07, G-08, G-W1..5) : régénère → passe les détecteurs → **détection ⊇ vérité** (chaque occurrence/segment/idiome planté est retrouvé ; l'émergent en plus est LÉGAL — F-50). Rouge = la RECETTE est rejetée (ou le render est trop pauvre pour l'exprimer) — jamais un assouplissement du détecteur.

## S8.J4–J5 — `analyze` final + consolidation

- `scripts/analyze.ts` version finale : `--spec` (charge la spec et déroule evaluate complet), `--live`, `--midi <fichier>`, `--recipe <G-xx>`. C'est l'outil de la Phase 4 (QA) et de la beta (rituel du vendredi).
- Passe de dette : TODO grep = zéro ; couverture des fichiers `analyzers/` ≥ 85 % lignes (vitest --coverage) ; `ENGINE_VER = '1.0.0'`.

✅ **SEMAINES 7–8 FINIES QUAND** : bench live p95 < 150 ms · 5 MIDI-témoins verts en branche `proof` · verrou n°5 vert sur 8 recettes · `analyze --spec` reproduit le snapshot m03-e02 · tag `v1.0-engine`.

---

# RÉCAPITULATIF DE PHASE — LE TABLEAU DE MARCHE

| Sem. | Livrable | Verrou | Jalon vérifiable |
|---|---|---|---|
| 1 | types + notation (F-21/F-43/F-35) | **n°3** | round-trip sur 56 notations MVP |
| 2 | key/chord/cadence/collection/idioms/motifs | — | analyze lit m03-s04 correctement |
| 3 | contour/phrase/tension/swing/VL/espèces/orch | **n°4** | fixtures ≥ 500 ; moods auto-cohérents |
| 4 | 46 règles + profils + 80 checkers | **n°1** | complétude specs↔checkers |
| 5–6 | pipeline + scoring + feedback | **n°2** | **87/87 solutions ≥ 85** ← LE jalon |
| 7 | Worker (flux A) + MIDI (flux C) | n°2/proof | p95 < 150 ms ; 5 témoins verts |
| 8 | générateur + analyze final | **n°5** | 8 recettes ; tag v1.0-engine |

# LES SEPT PIÈGES SPÉCIFIQUES DE LA PHASE 1
1. Coder `detectChord` avant `estimateKey`, ou `cadence` avant `idioms` — **l'ordre du tableau est une dépendance** (F-16 casse sinon, silencieusement).
2. Écrire les fixtures APRÈS le code : tu testeras ton implémentation, pas la spec.
3. « Optimiser » le parseur ou les motifs avant le bench de S7 — mesure d'abord.
4. Ajuster une constante de `scoring.ts` pour faire passer UNE solution rouge — la procédure, c'est fixture → diagnostic → patch ciblé (ou décision).
5. Laisser un analyseur retourner un fallback silencieux (`?? 'C major'`) — échec bruyant partout (D-T9).
6. Reporter les blocs pedagogy — au verrou n°2, le snapshot de rapport les exige déjà.
7. Tester le round-trip APRÈS humanize/swing appliqués — le contrat est : round-trip sur la notation source, mesures sur le rendu.

**Et ensuite ?** La Phase 2 (backend) démarre dès la fin de la semaine 8 — et peut chevaucher dès la semaine 7 si vous êtes deux : le contrat `FeedbackReport` est figé depuis la semaine 5, l'API peut se construire dessus sans attendre le générateur.

*Fin du tutoriel Phase 1. Chaque brique a ses fixtures nommées, son algorithme numéroté et son critère de fin — la seule chose que ce document ne peut pas faire à ta place, c'est les huit semaines.*
