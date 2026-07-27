# SECTION 19 — RENDRE LE LOT EXÉCUTABLE : SCHÉMA v2 + VÉRIFICATEURS DE CONTRAINTES

Trois livrables : le schéma Zod v2 complet dans `@ma/shared`, le **module `constraints/` de music-core** (l'architecture jumelle du module `rules/`, qui manquait), et le parseur de notation textuelle. Décision structurante d'abord.

## 19.1 Architecture : contraintes ≠ règles

Le registre §7 produit des `Violation[]` (pénalités sur la composante *correctness*). Les contraintes d'exercice sont un autre animal : elles sont **binaires ou graduelles, déclarées dans la spec, et alimentent la composante *constraints* du score ET la `ConstraintsChecklist` live du front** (§3.5 — l'élève voit ses cases se cocher pendant qu'il compose). D'où un module symétrique mais distinct :

```
packages/music-core/src/constraints/
├── types.ts          # ConstraintChecker, ConstraintResult
├── registry.ts       # enregistrement + résolution + test de complétude
├── engine.ts         # checkConstraints(spec.constraints, input, ctx)
├── helpers.ts        # degreeOf, strongBeats, barOf, finalNote…
├── melody.checks.ts
├── harmony.checks.ts
├── structure.checks.ts
└── notation.ts       # parseNotation("C4:q [E4+G4]:h r:q") → Note[]
```

### `constraints/types.ts`

```typescript
import type { AnalysisContext, AnalysisInput } from "../rules/types";

export interface ConstraintResult {
  key: string;                 // "mustEndOnDegrees"
  satisfied: boolean;          // pour la checklist live (vert/gris)
  score: number;               // 0..1 — crédit partiel (§4.2 : "ratio 3/4 = 75%")
  message: string;             // texte checklist : "Termine sur la tonique"
  detail?: string;             // pourquoi ça échoue : "ta dernière note est 5̂"
  locations?: { startTick: number; endTick: number; pitches?: number[] }[];
}

export interface ConstraintChecker {
  key: string;                          // = la clé JSON dans spec.constraints
  label: (value: unknown) => string;    // libellé checklist, interpolé
  /** Certaines contraintes ne sont vérifiables qu'avec l'analyse déjà faite
   *  (accords détectés, cadence, motifs). Le moteur les exécute en phase 2. */
  needs?: ("chords" | "cadence" | "motifs" | "keyWindows")[];
  evaluate(input: AnalysisInput, value: unknown, ctx: AnalysisContext,
           derived: DerivedAnalysis): ConstraintResult;
}

/** Résultats d'analyse partagés, calculés UNE fois par soumission. */
export interface DerivedAnalysis {
  chords?: import("../types").ChordEvent[];
  cadence?: import("../harmony").Cadence | null;
  cadencesBySegment?: (import("../harmony").Cadence | null)[];
  motifs?: import("../melody").MotifReport;
  keyWindows?: import("../types").KeyContext[];   // fenêtre glissante (modulations)
}
```

### `constraints/engine.ts`

```typescript
import { REGISTRY } from "./registry";
import type { ConstraintResult } from "./types";

export function checkConstraints(
  constraints: Record<string, unknown>,
  input: AnalysisInput, ctx: AnalysisContext, derived: DerivedAnalysis,
): { results: ConstraintResult[]; constraintsScore: number } {
  const results: ConstraintResult[] = [];
  for (const [key, value] of Object.entries(constraints)) {
    const checker = REGISTRY.get(key);
    if (!checker) {
      // Complétude garantie par la CI (§19.6) — en prod, on échoue BRUYAMMENT
      // plutôt que d'ignorer une contrainte en silence (score menteur).
      throw new Error(`Unknown constraint key: ${key}`);
    }
    results.push(checker.evaluate(input, value, ctx, derived));
  }
  const score = results.length
    ? results.reduce((s, r) => s + r.score, 0) / results.length
    : 1;
  return { results, constraintsScore: Math.round(score * 100) };
}
```

Note d'implémentation : les clés **descriptives** (`key`, `meter`, `keys`, `startKey`, `targetKey`, `patternBars`, `segmentBars`, `seamChord`, `motifType`, `mvpFallback`, `chromaticResolutionRequired`¹, `forbiddenCadencesBeforeBar`¹) ne sont pas des vérifications autonomes mais des **paramètres** consommés par d'autres checkers ou par le contexte — le registre les enregistre comme `paramOnly: true` (résultat automatique `satisfied: true, score: 1`, invisibles dans la checklist). ¹ absorbées respectivement par `minChromaticFigures` et `forbiddenCadencesBefore`.

## 19.2 Le schéma Zod v2 (`@ma/shared/src/exercise-spec.ts`)

```typescript
import { z } from "zod";

// ── Primitives musicales (inchangées, rappel) ─────────────────────
export const PitchClass = z.number().int().min(0).max(11);
export const KeyContextSchema = z.object({
  tonic: PitchClass,
  mode: z.enum(["major","minor","dorian","mixolydian","lydian","phrygian"]),
});
export const NoteSchema = z.object({
  pitch: z.number().int().min(0).max(127),
  start: z.number().int().min(0),
  duration: z.number().int().positive(),
  velocity: z.number().int().min(1).max(127).default(90),
});
export const ChordRefSchema = z.object({
  root: PitchClass,
  quality: z.enum(["maj","min","dim","aug","sus4","sus2",
    "maj7","m7","7","m7b5","dim7","mMaj7","6","m6"]),
  start: z.number().int().optional(),      // omis dans les grilles "1/mesure"
  duration: z.number().int().optional(),
});
const Degrees = z.array(z.number().int().min(1).max(7));
const BarRange = z.tuple([z.number().int().positive(), z.number().int().positive()]);
const Ratio01 = z.number().min(0).max(1);

// ── Contraintes v2 : le catalogue complet ─────────────────────────
export const ConstraintsSchema = z.object({
  // — héritées v1 —
  key: KeyContextSchema.optional(),
  meter: z.string().regex(/^\d+\/\d+$/).optional(),
  lengthBars: BarRange.optional(),
  noteRange: z.tuple([z.number().int(), z.number().int()]).optional(),
  allowedDurations: z.array(z.number()).optional(),
  requiredCadence: z.enum(["perfect","imperfect","plagal","half","deceptive"]).optional(),
  mustUseMotif: z.boolean().optional(),
  maxLeap: z.number().int().positive().optional(),
  instrumentPool: z.array(z.string()).optional(),
  maxSimultaneousParts: z.number().int().positive().optional(),
  minVoices: z.number().int().min(1).optional(),
  maxVoices: z.number().int().min(1).optional(),
  mustEndOnDegrees: Degrees.optional(),
  minConjunctRatio: Ratio01.optional(),
  mustInclude: z.array(z.string()).optional(),        // vocabulaire fermé, cf. §19.4
  forbiddenCadences: z.array(z.string()).optional(),
  mustLoop: z.boolean().optional(),
  requiredRoles: z.array(z.string()).optional(),
  melodyInstrumentFamily: z.string().optional(),

  // — mélodie (lot §18) —
  strongBeatDegrees: Degrees.optional(),
  penultimateDegrees: Degrees.optional(),
  requireLeadingToneBeforeFinal: z.boolean().optional(),
  mustExposeDegrees: Degrees.optional(),
  minExposureCount: z.number().int().positive().optional(),
  climaxWindow: z.tuple([Ratio01, Ratio01]).optional(),
  samePitchSequenceAsGiven: z.boolean().optional(),
  minChromaticFigures: z.number().int().positive().optional(),
  chromaticResolutionRequired: z.boolean().optional(),

  // — rythme / silence —
  syncopationTarget: z.tuple([Ratio01, Ratio01]).optional(),
  requireRestAtBar: z.array(z.number().int().positive()).optional(),
  requireSilentStrongBeat: z.boolean().optional(),
  motifType: z.enum(["melodic","rhythmic"]).optional(),
  minMotifOccurrences: z.number().int().min(2).optional(),
  requireMotifVariation: z.boolean().optional(),

  // — harmonie / progression —
  mustKeepChordFunctions: z.boolean().optional(),
  functionPlan: z.array(z.enum(["T","S","D"])).optional(),
  minSubstitutions: z.number().int().positive().optional(),
  bassMaxLeap: z.number().int().positive().optional(),
  minBassConjunctRatio: Ratio01.optional(),
  bassContour: z.enum(["ascending","descending"]).optional(),
  requiredProgressionPattern: z.string().optional(),   // "Am-AmMaj7-Am7-Am6"
  patternBars: BarRange.optional(),
  keys: z.array(PitchClass).optional(),                // multi-tonalités (e26)
  guideToneVoicing: z.boolean().optional(),
  minEnrichedChords: z.number().int().positive().optional(),
  forbidEnrichmentOnDegrees: Degrees.optional(),
  allowedOnV: z.array(z.enum(["sus4resolving"])).optional(),
  requirePlainTriadCount: BarRange.optional(),
  staticRootBars: BarRange.optional(),
  staticRootPc: PitchClass.optional(),
  minDistinctVoicings: z.number().int().min(2).optional(),
  targetOnStrongBeat: z.boolean().optional(),
  mustKeepOneNaturalDominant: z.boolean().optional(),
  maxBorrowedChords: z.number().int().positive().optional(),
  innerChromaticLine: z.array(PitchClass).min(2).optional(),
  commonToneThread: z.boolean().optional(),
  allMediantsMajor: z.boolean().optional(),

  // — structure / modulation —
  phraseStructure: z.enum(["period"]).optional(),
  antecedentEndDegrees: Degrees.optional(),
  segmentBars: z.number().int().positive().optional(),
  requiredCadences: z.array(z.enum(["perfect","imperfect","half","deceptive","plagal"])).optional(),
  forbiddenCadencesBefore: z.array(z.string()).optional(),
  forbiddenCadencesBeforeBar: z.number().int().positive().optional(),
  startKey: KeyContextSchema.optional(),
  targetKey: KeyContextSchema.optional(),
  requireEstablishingCadence: z.boolean().optional(),
  requireConfirmingCadence: z.enum(["perfect"]).optional(),
  modulationType: z.enum(["pivot","direct"]).optional(),
  structure: z.enum(["statement-seam-restatement"]).optional(),
  seamChord: ChordRefSchema.optional(),
  restatementTransposition: z.number().int().optional(),
  restatementMinVoicesDelta: z.number().int().optional(),
  restatementVelocityDelta: z.number().int().optional(),
}).strict();   // ⭐ toute clé inconnue = échec de validation AU SEED, pas en prod

// ── Quiz ──────────────────────────────────────────────────────────
export const QuizItemSchema = z.object({
  q: z.string(),
  interaction: z.enum(["mc","multi","keyboard-pick","roll-pick","order"]).optional(),
  play: z.string().optional(),             // notation textuelle → bouton ▶
  options: z.array(z.string()).optional(), // mc/multi/order
  answer: z.union([z.string(), z.array(z.string())]),
  why: z.string(),                          // TOUJOURS : la correction enseigne
});
export const QuizSchema = z.object({
  interaction: z.enum(["mc","multi","keyboard-pick","roll-pick","order"]),
  items: z.array(QuizItemSchema).min(1),
  generator: z.record(z.string(), z.unknown()).optional(),
});

// ── Spec v2 ───────────────────────────────────────────────────────
export const ExerciseSpecV2 = z.object({
  version: z.literal(2),
  prompt: z.string(),
  given: z.object({
    notes: z.array(NoteSchema).optional(),
    notation: z.string().optional(),        // ⭐ compilée au seed (§19.3)
    notesRef: z.string().optional(),        // asset externe
    chords: z.array(ChordRefSchema).optional(),
    key: KeyContextSchema.optional(),
  }).optional(),
  constraints: ConstraintsSchema.default({}),
  quiz: QuizSchema.optional(),
  mvpFallback: z.enum(["THEORY_QUIZ"]).optional(),
  styleProfile: z.object({
    id: z.string(),
    targetMood: z.string().optional(),
    ruleWeights: z.record(z.string(), z.number().min(0).max(2)).default({}),
  }),
  craftMultipliersOverride: z.record(z.string(), z.number()).optional(),  // §18, e26
  rubric: z.object({
    correctness: z.number(), constraints: z.number(), craft: z.number(),
  }).refine(r => r.correctness + r.constraints + r.craft === 100,
            "rubric must sum to 100"),
});
```

Le `.strict()` sur les contraintes est le verrou de gouvernance : **une leçon ne peut pas inventer une contrainte non implémentée** — le seed échoue, la PR est bloquée, le registre reste la seule source de vérité.

## 19.3 `notation.ts` — le parseur (même grammaire que `MusicExample`)

```typescript
import { PPQ, type Note } from "../types";

const PC: Record<string, number> =
  { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const DUR: Record<string, number> =
  { w: 4*PPQ, h: 2*PPQ, q: PPQ, e: PPQ/2, s: PPQ/4 };

/** Grammaire : tokens séparés par espaces ; "|" = barre (validation only).
 *  NOTE   := PITCH ":" DUR MODS      → C4:q   F#3:e.   Bb4:h
 *  CHORD  := "[" PITCH("+"PITCH)* "]" ":" DUR   → [C4+E4+G4]:w
 *  REST   := "r:" DUR                → r:q
 *  MODS   := "."? "~"? "!"?          → pointé, liaison (tie au suivant), accent
 */
export function parseNotation(src: string, defaultVelocity = 90): Note[] {
  const notes: Note[] = [];
  let cursor = 0;
  const pending = new Map<number, Note>();   // liaisons : pitch → note à étendre

  for (const raw of src.trim().split(/\s+/)) {
    if (raw === "|") continue;
    const m = raw.match(/^(\[[^\]]+\]|r|[A-G][#b]?-?\d+):([whqes])(\.?)(~?)(!?)$/);
    if (!m) throw new NotationError(`Token invalide : "${raw}"`);
    const [, head, durKey, dot, tie, accent] = m;
    let dur = DUR[durKey];
    if (dot) dur *= 1.5;

    if (head === "r") { cursor += dur; pending.clear(); continue; }

    const pitches = head.startsWith("[")
      ? head.slice(1, -1).split("+").map(parsePitch)
      : [parsePitch(head)];

    for (const pitch of pitches) {
      const tied = pending.get(pitch);
      if (tied && tied.start + tied.duration === cursor) {
        tied.duration += dur;                 // liaison : on étend
        if (!tie) pending.delete(pitch);
      } else {
        const n: Note = { pitch, start: cursor, duration: dur,
          velocity: accent ? Math.min(127, defaultVelocity + 25) : defaultVelocity };
        notes.push(n);
        if (tie) pending.set(pitch, n); else pending.delete(pitch);
      }
    }
    cursor += dur;
  }
  return notes;
}

function parsePitch(s: string): number {
  const m = s.match(/^([A-G])([#b]?)(-?\d+)$/);
  if (!m) throw new NotationError(`Hauteur invalide : "${s}"`);
  const [, letter, acc, oct] = m;
  const midi = PC[letter] + (acc === "#" ? 1 : acc === "b" ? -1 : 0)
             + (parseInt(oct, 10) + 1) * 12;
  if (midi < 0 || midi > 127) throw new NotationError(`Hors MIDI : "${s}"`);
  return midi;
}
export class NotationError extends Error {}
```

`content-sync` compile `given.notation` → `given.notes` au seed et **valide les barres** (`|`) contre le `meter` déclaré : une mesure incomplète dans un asset de leçon est une erreur de build, pas une surprise en prod. (C'est ce contrôle qui aurait attrapé les deux glissements de plume des MDX — le contenu aussi a sa CI.)

## 19.4 Les vérificateurs — implémentations

### `helpers.ts` (le socle partagé)

```typescript
import { PPQ, type KeyContext, type Meter, type Note } from "../types";

const MAJOR = [0,2,4,5,7,9,11];
const MODE_OFFSETS: Record<string, number[]> = {
  major: MAJOR, lydian: [0,2,4,6,7,9,11], mixolydian: [0,2,4,5,7,9,10],
  minor: [0,2,3,5,7,8,10], dorian: [0,2,3,5,7,9,10], phrygian: [0,1,3,5,7,8,10],
};

/** Degré 1..7, ou null si chromatique. Tolérance mineure : 7̂ haussée = degré 7. */
export function degreeOf(pitch: number, key: KeyContext): number | null {
  const rel = ((pitch % 12) - key.tonic + 12) % 12;
  const scale = MODE_OFFSETS[key.mode];
  const idx = scale.indexOf(rel);
  if (idx >= 0) return idx + 1;
  if (key.mode === "minor" && (rel === 11 || rel === 9))
    return rel === 11 ? 7 : 6;                    // sensible / 6̂ mélodique
  return null;
}

export function ticksPerBar(meter: Meter) { return PPQ * (4/meter.beatUnit) * meter.beatsPerBar; }
export function barOf(tick: number, meter: Meter) { return Math.floor(tick / ticksPerBar(meter)) + 1; }
export function isStrongBeat(tick: number, meter: Meter): boolean {
  const tpb = PPQ * (4/meter.beatUnit), pos = tick % ticksPerBar(meter);
  if (pos % tpb !== 0) return false;
  const beat = pos / tpb;
  return beat === 0 || (meter.beatsPerBar === 4 && beat === 2);
}
export const sortByStart = (ns: readonly Note[]) => [...ns].sort((a,b)=>a.start-b.start);
export const finalNote = (ns: readonly Note[]) =>
  [...ns].sort((a,b)=>(a.start+a.duration)-(b.start+b.duration)).pop();
export function pass(key: string, msg: string): ConstraintResult { return { key, satisfied:true, score:1, message:msg }; }
export function fail(key: string, msg: string, detail: string, score=0, locations?): ConstraintResult {
  return { key, satisfied:false, score, message:msg, detail, locations };
}
```

### `melody.checks.ts` — les représentatifs, en entier

```typescript
export const mustEndOnDegrees: ConstraintChecker = {
  key: "mustEndOnDegrees",
  label: v => `Termine sur ${(v as number[]).map(d=>`${d}̂`).join(" ou ")}`,
  evaluate(input, value, ctx) {
    const last = finalNote(input.notes);
    if (!last) return fail(this.key, this.label(value), "aucune note");
    const deg = degreeOf(last.pitch, ctx.key);
    const ok = deg !== null && (value as number[]).includes(deg);
    return ok ? pass(this.key, this.label(value))
      : fail(this.key, this.label(value),
          deg === null ? "ta dernière note est chromatique"
                       : `ta dernière note est ${deg}̂`,
          0, [{ startTick: last.start, endTick: last.start+last.duration, pitches:[last.pitch] }]);
  },
};

export const strongBeatDegrees: ConstraintChecker = {
  key: "strongBeatDegrees",
  label: v => `Temps forts sur ${(v as number[]).map(d=>`${d}̂`).join("/")}`,
  evaluate(input, value, ctx) {
    const wanted = value as number[];
    const onStrong = sortByStart(input.notes).filter(n => isStrongBeat(n.start, ctx.meter));
    if (!onStrong.length) return fail(this.key, this.label(value), "aucune note sur temps fort");
    const bad = onStrong.filter(n => {
      const d = degreeOf(n.pitch, ctx.key);
      return d === null || !wanted.includes(d);
    });
    const score = (onStrong.length - bad.length) / onStrong.length;   // graduel
    return bad.length === 0 ? pass(this.key, this.label(value))
      : fail(this.key, this.label(value),
          `${bad.length}/${onStrong.length} temps forts hors charpente`,
          Math.max(0.2, score),          // plancher : l'effort partiel compte
          bad.map(n => ({ startTick:n.start, endTick:n.start+n.duration, pitches:[n.pitch] })));
  },
};

export const climaxWindow: ConstraintChecker = {
  key: "climaxWindow",
  label: v => { const [a,b]=v as [number,number];
    return `Climax entre ${Math.round(a*100)} % et ${Math.round(b*100)} % de la durée`; },
  evaluate(input, value) {
    const notes = sortByStart(input.notes);
    if (!notes.length) return fail(this.key, this.label(value), "aucune note");
    const total = Math.max(...notes.map(n=>n.start+n.duration));
    const top = Math.max(...notes.map(n=>n.pitch));
    // Le climax = la PREMIÈRE atteinte de la note la plus haute
    const climax = notes.find(n => n.pitch === top)!;
    const pos = climax.start / total;
    const [lo, hi] = value as [number, number];
    if (pos >= lo && pos <= hi) return pass(this.key, this.label(value));
    // Crédit partiel : décroît avec la distance à la fenêtre
    const dist = pos < lo ? lo-pos : pos-hi;
    return fail(this.key, this.label(value),
      `ton sommet (${noteName(top)}) tombe à ${Math.round(pos*100)} % — ${pos<lo?"trop tôt":"trop tard"}`,
      Math.max(0, 1 - dist*3),
      [{ startTick: climax.start, endTick: climax.start+climax.duration, pitches:[top] }]);
  },
};

export const mustExposeDegrees: ConstraintChecker = {
  key: "mustExposeDegrees",
  label: v => `Expose la note-signature (${(v as number[]).map(d=>`${d}̂`).join(", ")})`,
  evaluate(input, value, ctx) {
    // "Exposée" (l07 §4) = temps fort OU tenue ≥ 1 temps OU sommet local
    const wanted = value as number[];
    const min = (ctx.constraints?.minExposureCount as number) ?? 1;
    const notes = sortByStart(input.notes);
    const beat = PPQ * (4/ctx.meter.beatUnit);
    const exposed = notes.filter((n, i) => {
      const d = degreeOf(n.pitch, ctx.key);
      if (d === null || !wanted.includes(d)) return false;
      const localPeak = (i===0 || notes[i-1].pitch < n.pitch)
                     && (i===notes.length-1 || notes[i+1].pitch < n.pitch);
      return isStrongBeat(n.start, ctx.meter) || n.duration >= beat || localPeak;
    });
    return exposed.length >= min ? pass(this.key, this.label(value))
      : fail(this.key, this.label(value),
          exposed.length === 0
            ? "la note-signature est présente mais cachée (temps faibles, valeurs courtes) — ou absente"
            : `exposée ${exposed.length}×, il en faut ${min}`,
          exposed.length / min * 0.6);
  },
};

export const minChromaticFigures: ConstraintChecker = {
  key: "minChromaticFigures",
  label: v => `Au moins ${v} figures chromatiques résolues`,
  evaluate(input, value, ctx) {
    const notes = sortByStart(input.notes);
    const figures: {kind:string; i:number}[] = [];
    for (let i = 0; i < notes.length; i++) {
      if (degreeOf(notes[i].pitch, ctx.key) !== null) continue;   // diatonique
      const prev = notes[i-1], next = notes[i+1];
      const resolves = next && Math.abs(next.pitch - notes[i].pitch) === 1;
      if (!resolves) continue;   // chromatisme non résolu : melody.out-of-key s'en charge
      const fromStep = prev && Math.abs(notes[i].pitch - prev.pitch) === 1;
      const kind =
        prev && next && prev.pitch === next.pitch        ? "broderie" :
        fromStep && Math.sign(next.pitch-notes[i].pitch)
                 === Math.sign(notes[i].pitch-prev.pitch) ? "passage" :
        isStrongBeat(notes[i].start, ctx.meter)           ? "appoggiature" :
                                                            "approche";
      figures.push({ kind, i });
    }
    const min = value as number;
    const families = new Set(figures.map(f=>f.kind)).size;
    // e41 exige "familles différentes" : on crédite le nombre ET la variété
    const ok = figures.length >= min && families >= Math.min(min, 3);
    return ok ? pass(this.key, `${this.label(value)} (${[...new Set(figures.map(f=>f.kind))].join(", ")})`)
      : fail(this.key, this.label(value),
          figures.length < min
            ? `${figures.length} figure(s) résolue(s) détectée(s) sur ${min}`
            : `assez de figures mais ${families} famille(s) — varie : passage, broderie, appoggiature, approche`,
          Math.min(figures.length/min, families/Math.min(min,3)) * 0.8);
  },
};
```

Mécaniques du même moule, listées avec leur cœur algorithmique (implémentation ~10 lignes chacune) : `penultimateDegrees` (avant-dernière note, `degreeOf`), `requireLeadingToneBeforeFinal` (avant-dernière = tonique−1 demi-ton), `samePitchSequenceAsGiven` (comparaison des suites de `pitch`, score = plus longue sous-séquence commune / longueur), `noteRange`/`maxLeap`/`minConjunctRatio` (déjà en v1, portés au format `ConstraintResult`), `syncopationTarget` (le `syncopationScore()` de §4.1.4 projeté dans la fenêtre, crédit partiel par distance), `requireRestAtBar` (silence ≥ 1 temps dans la mesure : gap entre fin de note et attaque suivante), `requireSilentStrongBeat` (aucun `n.start ≤ t < n.start+n.duration` sur au moins un temps fort).

### `harmony.checks.ts` — les trois épineux, en entier

```typescript
export const functionPlan: ConstraintChecker = {
  key: "functionPlan", needs: ["chords"],
  label: v => `Suis le récit ${(v as string[]).join("-")}`,
  evaluate(input, value, ctx, derived) {
    const plan = value as ("T"|"S"|"D")[];
    const chords = derived.chords ?? [];
    if (chords.length !== plan.length)
      return fail(this.key, this.label(value),
        `${chords.length} accord(s) détecté(s) pour un plan de ${plan.length}`,
        Math.min(chords.length, plan.length)/plan.length * 0.3);
    let good = 0; const bad: number[] = [];
    chords.forEach((ch, i) => {
      const fn = functionOf(ch, ctx.key);            // §4.1.3
      if (fn.function === plan[i]) good++; else bad.push(i);
    });
    return bad.length === 0 ? pass(this.key, this.label(value))
      : fail(this.key, this.label(value),
          `accord(s) ${bad.map(i=>i+1).join(", ")} hors plan (attendu : ${bad.map(i=>plan[i]).join(", ")})`,
          good/plan.length,
          bad.map(i => ({ startTick: chords[i].start, endTick: chords[i].start+chords[i].duration })));
  },
};

export const innerChromaticLine: ConstraintChecker = {
  key: "innerChromaticLine",
  label: v => `Ligne interne ${(v as number[]).length} notes dans UNE voix`,
  evaluate(input, value, ctx) {
    const targetRel = value as number[];             // pc relatives à la tonique
    const target = targetRel.map(r => (ctx.key.tonic + r) % 12);
    // Sans parts déclarées (saisie piano) : reconstruire les "voix" par
    // continuité de registre — greedy : chaque note rejoint la voix dont la
    // dernière hauteur est la plus proche (< 5 demi-tons), sinon nouvelle voix.
    const voices: Note[][] = [];
    for (const n of sortByStart(input.notes)) {
      let best: Note[] | null = null, bestDist = 5;
      for (const v of voices) {
        const last = v[v.length-1];
        const d = Math.abs(last.pitch - n.pitch);
        if (n.start >= last.start && d < bestDist) { best = v; bestDist = d; }
      }
      if (best) best.push(n); else voices.push([n]);
    }
    // Chercher la séquence cible CONSÉCUTIVE dans une voix
    for (const v of voices) {
      for (let i = 0; i + target.length <= v.length; i++) {
        if (target.every((pc, k) => v[i+k].pitch % 12 === pc))
          return pass(this.key,
            `Ligne interne trouvée : ${target.map(noteNameFromPc).join("–")}`);
      }
    }
    // Crédit partiel : plus long préfixe trouvé quelque part
    let bestPrefix = 0;
    for (const v of voices) for (let i = 0; i < v.length; i++) {
      let k = 0;
      while (k < target.length && i+k < v.length && v[i+k].pitch % 12 === target[k]) k++;
      bestPrefix = Math.max(bestPrefix, k);
    }
    return fail(this.key, this.label(value),
      bestPrefix > 1
        ? `la ligne démarre (${bestPrefix}/${target.length} notes) puis se perd — la voix doit la porter SEULE, consécutivement`
        : "ligne interne introuvable : suis une seule voix, note à note",
      bestPrefix/target.length * 0.7);
  },
};

export const mustInclude: ConstraintChecker = {
  key: "mustInclude", needs: ["chords"],
  label: v => `Inclure : ${(v as string[]).join(", ")}`,
  evaluate(input, value, ctx, derived) {
    // Vocabulaire FERMÉ (validé au seed) : "extendedChord>=N",
    // "secondaryDominant>=N", "tritoneSub>=N", "tritoneSubOrChromaticBass",
    // "borrowedChord>=N" / "borrowed-iv", "chromaticMediant>=N"
    const chords = derived.chords ?? [];
    const tagged = chords.map(ch => ({ ch, tags: classifyChromatic(ch, chords, ctx.key) }));
    // classifyChromatic (harmony.ts) : les heuristiques de §4.1.3 —
    // V/x (cible ≤ 2 accords), subV (triton partagé + basse −1 vers cible),
    // borrowed (accord de l'homonyme), mediant (majeur à la tierce, ≥1 note
    // commune, hors fonction), extended (extensions.length ≥ 1 ou 7e)
    const results = (value as string[]).map(req => {
      const m = req.match(/^([a-zA-Z-]+)(?:>=(\d+))?$/)!;
      const [, tag, nStr] = m; const n = nStr ? +nStr : 1;
      if (tag === "tritoneSubOrChromaticBass") {
        const found = tagged.filter(t=>t.tags.includes("subV")).length >= 1
                   || hasChromaticBassRun(chords, 3);
        return { req, found };
      }
      const map: Record<string,string> = { extendedChord:"extended",
        secondaryDominant:"V/x", tritoneSub:"subV", borrowedChord:"borrowed",
        "borrowed-iv":"borrowed-iv", chromaticMediant:"mediant" };
      return { req, found: tagged.filter(t=>t.tags.includes(map[tag] ?? tag)).length >= n };
    });
    const missing = results.filter(r=>!r.found);
    return missing.length === 0 ? pass(this.key, this.label(value))
      : fail(this.key, this.label(value),
          `manquant : ${missing.map(r=>r.req).join(", ")}`,
          (results.length - missing.length)/results.length);
  },
};
```

Le reste du domaine, par réutilisation directe : `mustKeepChordFunctions` (functionOf de chaque accord soumis = functionOf du `given` correspondant), `minSubstitutions` (accords ≠ given mais même fonction — le complément exact du précédent), `bassMaxLeap`/`minBassConjunctRatio`/`bassContour` (extraire la voix la plus grave par verticalité §10.3, puis `leapProfile`/régression de signe), `requiredProgressionPattern` (parser le pattern en `ChordRef[]` via le dictionnaire §8.5, matcher racine+qualité en séquence, `patternBars` restreint la fenêtre), `guideToneVoicing` (chaque verticalité contient 3 et 7 de l'accord détecté ; fondamentale = note la plus grave ; ≤ 1 note hors {1,3,5,7}), `minEnrichedChords`/`requirePlainTriadCount` (compter `extensions.length>0 || quality∈{maj7,m7,6,m6,sus}` vs triades pures), `forbidEnrichmentOnDegrees`+`allowedOnV` (degré de la fondamentale via `degreeOf` ; exception sus4→3 : détection de la 4te résolue à la 3ce sur le même root), `staticRootBars/Pc` (basse constante sur la fenêtre), `minDistinctVoicings` (ensembles de pitchs distincts sur le root statique), `targetOnStrongBeat` (pour chaque accord tagué V/x : la cible démarre sur temps fort), `mustKeepOneNaturalDominant` (≥1 accord "7" fonction D non tagué subV), `maxBorrowedChords`, `commonToneThread` (à chaque couture taguée mediant : ∃ pitch identique tenu ou réattaqué dans la même voix reconstruite), `allMediantsMajor`, `forbiddenCadences`(+`Before`/`BeforeBar` : `detectCadence` sur fenêtre glissante jusqu'à la mesure butoir), `mustLoop` (la jonction dernier→premier passée à `harmony.loop-coherence` en mode contrainte).

### `structure.checks.ts` — le plus intégrateur, en entier

```typescript
export const modulationCheck: ConstraintChecker = {
  key: "targetKey", needs: ["keyWindows", "cadence", "chords"],
  label: () => "Module et CONFIRME la nouvelle tonalité",
  evaluate(input, value, ctx, derived) {
    const target = value as KeyContext;
    const start = ctx.constraints?.startKey as KeyContext | undefined;
    const windows = derived.keyWindows ?? [];      // estimateKeySliding par 8 notes
    // 1. ÉTABLIR : les premières fenêtres concluent à startKey
    const established = !start || windows.slice(0, 2)
      .every(w => !w.ambiguous && w.tonic === start.tonic);
    // 2. S'INSTALLER : les dernières fenêtres concluent STABLEMENT à target
    const settled = windows.slice(-2)
      .every(w => !w.ambiguous && w.tonic === target.tonic && w.mode === target.mode);
    // 3. CONFIRMER : cadence finale parfaite DANS target
    const conf = derived.cadence;
    const confirmed = ctx.constraints?.requireConfirmingCadence
      ? conf?.type === "perfect" && conf.key.tonic === target.tonic
      : true;
    // 4. Établissement cadencé (si exigé) : une cadence dans startKey avant le pivot
    const estCadence = !ctx.constraints?.requireEstablishingCadence
      || (derived.cadencesBySegment ?? []).some(c =>
           c && start && c.key.tonic === start.tonic);

    const steps = [
      { ok: established, msg: "établis la tonalité de départ (une phrase complète)" },
      { ok: estCadence,  msg: "cadence dans la tonalité de départ avant de partir" },
      { ok: settled,     msg: "la nouvelle tonalité doit s'installer (fin ambiguë ou restée au départ)" },
      { ok: confirmed,   msg: "confirme par une cadence parfaite avec la nouvelle sensible" },
    ];
    const failed = steps.filter(s => !s.ok);
    return failed.length === 0
      ? pass(this.key, "Modulation établie → installée → confirmée")
      : fail(this.key, this.label(undefined),
          failed.map(s=>s.msg).join(" ; "),
          (steps.length - failed.length)/steps.length);
  },
};
```

`phraseStructure: "period"` (+`antecedentEndDegrees`) découpe aux `lengthBars/2`, exige la demi-cadence + degré mélodique de fin d'antécédent, la parfaite au conséquent, et **crédite en craft** la reprise de tête détectée par `findMotifs` (occurrence en début de conséquent). `structure: "statement-seam-restatement"` vérifie : segment 2 = segment 1 transposé de `restatementTransposition` (comparaison de suites d'intervalles — la transposition exacte est vérifiable sans fuzzy), l'accord de couture = `seamChord`, `Δvoix` et `Δvelocity` moyens ≥ seuils. `requiredCadences`+`segmentBars` : `detectCadence` par segment, ordre imposé, crédit partiel par segment juste. `keys` (e26) : découpe en tiers, `estimateKey` par tiers = chaque tonalité imposée.

## 19.5 Correction serveur des quiz

```typescript
// apps/api — quiz.grader.ts (le client n'a JAMAIS les answers : la spec
// publique est expurgée par exercises.service avant envoi — champ `answer`
// et `why` retirés, renvoyés seulement dans le rapport de correction)
export function gradeQuiz(spec: QuizSpec, submitted: (string|string[])[]) {
  const items = spec.items.map((item, i) => {
    const a = submitted[i];
    const correct = Array.isArray(item.answer)
      ? Array.isArray(a) && sameSet(a, item.answer)
      : a === item.answer;
    return { correct, why: item.why,           // le "pourquoi" part TOUJOURS,
             expected: item.answer };           // réponse juste ou fausse : la
  });                                           // correction enseigne (§brief)
  return { score: Math.round(100 * items.filter(i=>i.correct).length / items.length),
           items };
}
```

`keyboard-pick`/`roll-pick` soumettent des noms de notes normalisés (`"C4"`, enharmonie résolue côté client par pitch MIDI — `"A#3"` et `"Bb3"` sont le même 58) ; `sameSet` compare sur les pitches MIDI, pas les strings.

## 19.6 Tests : les trois verrous CI

```typescript
// 1. COMPLÉTUDE — aucune contrainte du contenu sans checker
test("every constraint key used in content has a checker", () => {
  for (const ex of loadAllExercises()) {                  // packages/content
    for (const key of Object.keys(ex.spec.constraints ?? {}))
      expect(REGISTRY.has(key), `${ex.id} → ${key}`).toBe(true);
  }
});

// 2. RÉSOLUBILITÉ — chaque exercice de composition a une solution qui passe
//    (une "solution de référence" par exercice, dans test/solutions/m01/*.json,
//    écrite à la main — 24 solutions à produire : c'est le vrai coût de ce
//    verrou, et il en vaut chaque heure : un exercice insoluble est un bug
//    pédagogique de la pire espèce)
test.each(loadSolutions())("%s reference solution scores ≥ 85", (id, solution) => {
  const report = submitPipeline(id, solution);            // §2.5 en local
  expect(report.score).toBeGreaterThanOrEqual(85);
  expect(report.constraintResults.every(r => r.satisfied)).toBe(true);
});

// 3. PARSEUR — propriété d'aller-retour
test("parseNotation round-trips through renderNotation", () => {
  fc.assert(fc.property(arbNotationString(), src => {
    const notes = parseNotation(src);
    return deepEqual(parseNotation(renderNotation(notes)), notes);
  }));
});
```

Le verrou 2 change le processus de production de contenu : **écrire un exercice = écrire aussi sa solution de référence**. C'est du travail (≈ 20 min/exercice), et c'est le meilleur investissement qualité du produit — chaque solution est simultanément un test de régression du moteur, un exemple pour la `improvedVersion`, et la preuve que la consigne est réalisable au niveau visé.

---

## Checklist de validation Section 19

- [x] Contraintes = module jumeau des règles : `ConstraintResult` graduel, checklist live, score /100 de la composante *constraints*
- [x] Schéma Zod v2 `.strict()` : le contenu ne peut pas inventer de contrainte — verrou au seed
- [x] Parseur de notation : une grammaire, trois consommateurs (MDX, given, quiz `play`), validation des mesures au build
- [x] 12 checkers épineux implémentés en entier, ~30 mécaniques spécifiés sur l'existant (§4, §8, §10) — zéro capacité d'analyse nouvelle requise, comme promis en §18.8
- [x] Clés descriptives = `paramOnly`, échec bruyant sur clé inconnue en prod
- [x] Quiz : answers côté serveur uniquement, le `why` systématique (la correction enseigne)
- [x] Trois verrous CI, dont la résolubilité par solutions de référence — 24 solutions à produire, nouveau poste de la roadmap contenu

---

**Point de confirmation.** Le Module 1 est désormais spécifié de bout en bout : leçons → exercices → schéma → vérificateurs → tests. Fronts suivants : **(a)** Module 2 — Mélodie (15 leçons, second module obligatoire du MVP, moteur déjà prêt) ; **(b)** les 24 solutions de référence du Module 1 (notation textuelle — je peux les composer par lots) ; **(c)** les fiches instruments MVP du Module 5. Ma recommandation : **(a)** — le contenu Module 2 est le chemin critique de la roadmap (§6.4), les solutions peuvent se produire en parallèle de la beta. Je lance le sommaire complet du Module 2 + son premier lot de leçons ?