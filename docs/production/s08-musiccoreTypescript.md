# SECTION 8 — SQUELETTE TYPESCRIPT DE `@ma/music-core`

Principe tenu : **zéro dépendance runtime**, TypeScript strict, fonctions pures, double build (ESM navigateur + Node) via tsup. Je livre : la structure du package, les types fondateurs, le registre de règles en code, et les **implémentations complètes** de `keyDetect` et `detectChord` — les deux fonctions dont tout dépend (Sprint S3–S6).

## 8.1 Structure du package

```
packages/music-core/
├── src/
│   ├── index.ts              # exports publics
│   ├── types.ts              # ⭐ types fondateurs
│   ├── constants.ts          # PPQ, profils Krumhansl, dictionnaire d'accords
│   ├── pitch.ts              # pitch-class, intervalles, spelling
│   ├── keyDetect.ts          # ⭐ implémenté ci-dessous
│   ├── chords.ts             # ⭐ implémenté ci-dessous
│   ├── melody.ts             # contour, motifs, tensionCurve (signatures)
│   ├── harmony.ts            # fonctions, cadences (signatures)
│   ├── voiceLeading.ts
│   ├── orchestration/
│   │   ├── instruments.ts    # base InstrumentDef (~40 entrées)
│   │   └── checks.ts
│   └── rules/
│       ├── types.ts          # Rule, Violation, Pedagogy
│       ├── registry.ts       # enregistrement + résolution par domaine
│       ├── engine.ts         # RuleEngine.run
│       ├── melody.rules.ts   # une règle complète ci-dessous
│       └── styleProfiles.ts  # les 8 profils de la matrice §7.8
├── test/
│   ├── fixtures/…
│   └── property/…
├── package.json              # "sideEffects": false, exports ESM+CJS
└── tsup.config.ts            # dts: true, target: ["es2022"], format: ["esm","cjs"]
```

## 8.2 `types.ts` — les fondations

```typescript
// ─── Temps ───────────────────────────────────────────────────────
/** Résolution fixe du produit : 480 ticks par noire (export MIDI direct). */
export const PPQ = 480;
export type Tick = number;

export interface Meter {
  beatsPerBar: number;      // 4 pour 4/4, 6 pour 6/8
  beatUnit: number;         // 4 = noire, 8 = croche
}

// ─── Notes ───────────────────────────────────────────────────────
export interface Note {
  pitch: number;            // MIDI 0–127
  start: Tick;
  duration: Tick;           // > 0
  velocity: number;         // 1–127
}

/** Classe de hauteur 0–11 (0 = do). */
export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// ─── Tonalité ────────────────────────────────────────────────────
export type Mode =
  | "major" | "minor"                       // détectés (MVP)
  | "dorian" | "mixolydian" | "lydian" | "phrygian"; // passe 2 (inférence)

export interface KeyContext {
  tonic: PitchClass;
  mode: Mode;
  confidence: number;       // 0–1
  ambiguous: boolean;       // true si confidence < AMBIGUITY_THRESHOLD
  alternates: Array<{ tonic: PitchClass; mode: Mode; score: number }>;
}

// ─── Accords ─────────────────────────────────────────────────────
export type ChordQuality =
  | "maj" | "min" | "dim" | "aug" | "sus4" | "sus2"
  | "maj7" | "m7" | "7" | "m7b5" | "dim7" | "mMaj7" | "6" | "m6";

export type Extension = "9" | "b9" | "#9" | "11" | "#11" | "13" | "b13" | "add9";

export interface ChordEvent {
  root: PitchClass;
  quality: ChordQuality;
  extensions: Extension[];
  bass: PitchClass;         // note la plus grave réelle
  inversion: 0 | 1 | 2 | 3;
  impliedRoot: boolean;     // voicing rootless (jazz)
  start: Tick;
  duration: Tick;
  confidence: number;       // 0–1
  foreignNotes: ForeignNote[];
}

export interface ForeignNote {
  pitch: number;
  kind: "passing" | "neighbor" | "appoggiatura" | "unexplained";
}

// ─── Partition multi-parts (orchestration) ───────────────────────
export type Role =
  | "melody" | "countermelody" | "harmony" | "bass" | "texture" | "rhythm";

export interface Part {
  instrumentId: string;
  role: Role;
  notes: Note[];
  doubles?: string;         // id de la part doublée (légalise vl.parallel-octaves)
}

export interface Score {
  parts: Part[];
  meter: Meter;
  tempoBpm: number;
}
```

## 8.3 `rules/types.ts` — le registre en code (miroir exact de la Section 7)

```typescript
import type { KeyContext, Meter, Note, Part, Tick } from "../types";

export type Severity = "error" | "warning" | "suggestion";
export type RuleDomain =
  | "melody" | "harmony" | "voiceLeading" | "counterpoint" | "rhythm" | "orch";

export interface Pedagogy {
  why: string;
  how: string;
  when: string;
  commonMistake: string;
  alternative: string;
}

export interface Location {
  startTick: Tick;
  endTick: Tick;
  partIndex?: number;
  pitches?: number[];       // pour surligner des notes précises dans le roll
}

export interface Violation {
  ruleId: string;
  severity: Severity;       // sévérité EFFECTIVE (après style, cf. engine)
  locations: Location[];    // occurrences groupées (cf. §4.2)
  data?: Record<string, number | string>; // valeurs pour interpoler le texte
}

/** Ce que voit chaque règle : l'entrée normalisée + tout le contexte. */
export interface AnalysisContext {
  key: KeyContext;
  meter: Meter;
  userLevel: number;
  styleProfileId: string;
  ruleWeights: Record<string, number>;   // déjà résolus (wildcards expansées)
  constraints?: Record<string, unknown>; // spec de l'exercice
}

export interface AnalysisInput {
  notes: Note[];            // aplati si mono-part
  parts?: Part[];           // présent pour VL/contrepoint/orchestration
}

export interface Rule {
  id: string;                              // "melody.leap-recovery"
  domain: RuleDomain;
  baseSeverity: Severity;
  minLevel: number;                        // appliesTo, cf. §7.0
  pedagogy: Pedagogy;
  /** Surcharges de texte par styleProfileId (cf. quintes // en epic-film §4.1.5) */
  pedagogyOverrides?: Record<string, Partial<Pedagogy>>;
  evaluate(input: AnalysisInput, ctx: AnalysisContext): Violation[];
}
```

### `rules/engine.ts`

```typescript
import type { AnalysisContext, AnalysisInput, Rule, Violation } from "./types";
import { PENALTY } from "../constants"; // { error: 12, warning: 5, suggestion: 0 }

const DEMOTE_THRESHOLD = 0.3; // poids ≤ 0.3 → rétrogradé en suggestion (§7.0)

export function runRules(
  rules: readonly Rule[],
  input: AnalysisInput,
  ctx: AnalysisContext,
): { violations: Violation[]; penalty: number } {
  const violations: Violation[] = [];
  let penalty = 0;

  for (const rule of rules) {
    if (ctx.userLevel < rule.minLevel) continue;
    const weight = ctx.ruleWeights[rule.id] ?? 1.0;
    if (weight === 0) continue;

    for (const v of rule.evaluate(input, ctx)) {
      const demoted = weight <= DEMOTE_THRESHOLD && rule.baseSeverity !== "suggestion";
      const severity = demoted ? "suggestion" : rule.baseSeverity;
      // Amortisseur de répétition : 1re occurrence ×1, suivantes ×0.4 (§4.2)
      const n = v.locations.length;
      const occFactor = n === 0 ? 0 : 1 + (n - 1) * 0.4;
      penalty += PENALTY[severity] * weight * occFactor;
      violations.push({ ...v, severity });
    }
  }
  return { violations, penalty: Math.min(penalty, 100) };
}
```

### Une règle complète : `melody.leap-recovery` (gabarit de toutes les autres)

```typescript
import type { Rule } from "./types";

export const leapRecovery: Rule = {
  id: "melody.leap-recovery",
  domain: "melody",
  baseSeverity: "warning",
  minLevel: 1,
  pedagogy: {
    why: "Un saut ≥ sixte est une dépense d'énergie : sans retour, la ligne se disloque et devient inchantable.",
    how: "Après le saut, reviens par mouvement contraire majoritairement conjoint dans les 2 notes suivantes.",
    when: "Quasi universel ; assoupli en écriture héroïque où les sauts enchaînés sont un idiome.",
    commonMistake: "Enchaîner octave puis quarte ascendantes « pour faire grandiose » — ça fait surtout désarticulé.",
    alternative: "Le saut non compensé comme geste isolé (cri, appel) : une fois par phrase, pas trois.",
  },
  pedagogyOverrides: {
    "epic-film": {
      when: "En style épique, le saut héroïque répété est un idiome accepté — vérifie simplement qu'il est voulu.",
    },
  },
  evaluate(input, _ctx) {
    const notes = [...input.notes].sort((a, b) => a.start - b.start);
    const locations = [];
    for (let i = 0; i + 1 < notes.length; i++) {
      const leap = notes[i + 1].pitch - notes[i].pitch;
      if (Math.abs(leap) < 8) continue;               // < 6te mineure : rien à faire
      // Fenêtre de récupération : les 2 notes suivantes
      const w = notes.slice(i + 1, i + 4);
      let recovered = false;
      for (let j = 0; j + 1 < w.length; j++) {
        const step = w[j + 1].pitch - w[j].pitch;
        if (Math.sign(step) === -Math.sign(leap) && Math.abs(step) <= 2) {
          recovered = true; break;
        }
      }
      if (!recovered) {
        locations.push({
          startTick: notes[i].start,
          endTick: notes[i + 1].start + notes[i + 1].duration,
          pitches: [notes[i].pitch, notes[i + 1].pitch],
        });
      }
    }
    return locations.length
      ? [{ ruleId: this.id, severity: this.baseSeverity, locations,
           data: { count: locations.length } }]
      : [];
  },
};
```

## 8.4 `keyDetect.ts` — implémentation complète

```typescript
import type { KeyContext, Mode, Note, Meter, PitchClass } from "./types";
import { PPQ } from "./types";

// Profils Krumhansl-Kessler (valeurs canoniques de la littérature)
const MAJOR_PROFILE = [6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88];
// Profil mineur ÉTENDU : on relève légèrement VII♯ (indice 11) pour que le
// mineur harmonique/mélodique ne pénalise pas la corrélation mineure (§4.1.1)
const MINOR_PROFILE = [6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.90];

const AMBIGUITY_THRESHOLD = 0.15;
const STRONG_BEAT_BOOST = 1.5;
const EDGE_NOTE_BOOST = 1.3;

function pearson(a: readonly number[], b: readonly number[]): number {
  const n = a.length;
  let sa = 0, sb = 0;
  for (let i = 0; i < n; i++) { sa += a[i]; sb += b[i]; }
  const ma = sa / n, mb = sb / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    const xa = a[i] - ma, xb = b[i] - mb;
    num += xa * xb; da += xa * xa; db += xb * xb;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

/** Vecteur de poids par pitch-class : durée × boosts métriques/positionnels. */
function buildPcWeights(notes: readonly Note[], meter: Meter): number[] {
  const w = new Array<number>(12).fill(0);
  if (notes.length === 0) return w;

  const ticksPerBeat = PPQ * (4 / meter.beatUnit);
  const ticksPerBar = ticksPerBeat * meter.beatsPerBar;
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const first = sorted[0], last = sorted[sorted.length - 1];

  for (const n of sorted) {
    let weight = n.duration / PPQ;                       // pondération par DURÉE
    const posInBar = n.start % ticksPerBar;
    if (posInBar % ticksPerBeat === 0) {
      const beatIndex = posInBar / ticksPerBeat;
      // temps fort : 1er temps toujours ; 3e temps en 4/4
      if (beatIndex === 0 || (meter.beatsPerBar === 4 && beatIndex === 2)) {
        weight *= STRONG_BEAT_BOOST;
      }
    }
    if (n === first || n === last) weight *= EDGE_NOTE_BOOST;  // ancrage tonal
    w[n.pitch % 12] += weight;
  }
  return w;
}

interface Candidate { tonic: PitchClass; mode: Mode; score: number }

export function estimateKey(
  notes: readonly Note[],
  meter: Meter = { beatsPerBar: 4, beatUnit: 4 },
): KeyContext {
  const pc = buildPcWeights(notes, meter);
  const candidates: Candidate[] = [];

  for (let t = 0 as PitchClass; t < 12; t++) {
    // rotation du vecteur observé pour l'aligner sur la tonique candidate
    const rotated = pc.map((_, i) => pc[(i + t) % 12]);
    candidates.push({ tonic: t as PitchClass, mode: "major", score: pearson(rotated, MAJOR_PROFILE) });
    candidates.push({ tonic: t as PitchClass, mode: "minor", score: pearson(rotated, MINOR_PROFILE) });
  }
  candidates.sort((a, b) => b.score - a.score);

  const [best, second] = candidates;
  const confidence = best.score <= 0 ? 0
    : Math.max(0, (best.score - second.score) / Math.abs(best.score));

  // ── Passe 2 : inférence modale (§4.1.1) ──
  let mode: Mode = best.mode;
  const rel = (i: number) => pc[(best.tonic + i) % 12];   // poids du degré relatif
  const total = pc.reduce((s, x) => s + x, 0) || 1;
  if (best.mode === "major" && rel(10) / total > 0.10 && rel(10) > rel(11)) {
    mode = "mixolydian";              // ♭7 dominant sur la sensible → mixolydien
  } else if (best.mode === "minor" && rel(9) / total > 0.10 && rel(9) > rel(8)) {
    mode = "dorian";                  // 6te majeure dominante → dorien
  }

  return {
    tonic: best.tonic,
    mode,
    confidence,
    ambiguous: confidence < AMBIGUITY_THRESHOLD,
    alternates: candidates.slice(1, 4)
      .map(({ tonic, mode, score }) => ({ tonic, mode, score })),
  };
}

/** Fenêtre glissante pour le feedback live (worker client, §3.4). */
export function estimateKeySliding(
  notes: readonly Note[], meter: Meter, windowSize = 16,
): KeyContext {
  const recent = [...notes].sort((a, b) => a.start - b.start).slice(-windowSize);
  return estimateKey(recent, meter);
}
```

## 8.5 `chords.ts` — implémentation complète

```typescript
import type { ChordEvent, ChordQuality, Extension, ForeignNote, Note, PitchClass } from "./types";
import { PPQ } from "./types";

// ── Dictionnaire ordonné par spécificité décroissante (§4.1.2) ──
// intervals = pitch-classes relatives à la fondamentale
interface ChordShape {
  quality: ChordQuality;
  intervals: number[];       // notes DÉFINITOIRES
  optional?: number[];       // quinte omissible, etc.
}
const SHAPES: ChordShape[] = [
  { quality: "mMaj7", intervals: [0, 3, 11], optional: [7] },
  { quality: "maj7",  intervals: [0, 4, 11], optional: [7] },
  { quality: "m7b5",  intervals: [0, 3, 6, 10] },
  { quality: "dim7",  intervals: [0, 3, 6, 9] },
  { quality: "m7",    intervals: [0, 3, 10], optional: [7] },
  { quality: "7",     intervals: [0, 4, 10], optional: [7] },
  { quality: "m6",    intervals: [0, 3, 9],  optional: [7] },
  { quality: "6",     intervals: [0, 4, 9],  optional: [7] },
  { quality: "aug",   intervals: [0, 4, 8] },
  { quality: "dim",   intervals: [0, 3, 6] },
  { quality: "min",   intervals: [0, 3, 7] },
  { quality: "maj",   intervals: [0, 4, 7] },
  { quality: "sus4",  intervals: [0, 5, 7] },
  { quality: "sus2",  intervals: [0, 2, 7] },
];

// Extensions reconnues au-dessus d'une qualité identifiée
const EXTENSION_MAP: Array<{ pc: number; ext: Extension; excludeIf?: ChordQuality[] }> = [
  { pc: 1,  ext: "b9" },
  { pc: 2,  ext: "9" },
  { pc: 3,  ext: "#9", excludeIf: ["min", "m7", "m6", "mMaj7", "m7b5"] },
  { pc: 5,  ext: "11" },
  { pc: 6,  ext: "#11", excludeIf: ["dim", "dim7", "m7b5"] },
  { pc: 8,  ext: "b13", excludeIf: ["aug"] },
  { pc: 9,  ext: "13" },
];

/** 1) SEGMENTATION : regroupe les notes en événements verticaux. */
export function segmentVerticalities(notes: readonly Note[], simultaneityTicks = 30) {
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const segments: Note[][] = [];
  for (const n of sorted) {
    const cur = segments[segments.length - 1];
    if (cur && n.start - cur[0].start < simultaneityTicks) cur.push(n);
    else segments.push([n]);
  }
  // Fusion arpèges : segments mono-note dans le même temps, se chevauchant
  const merged: Note[][] = [];
  for (const seg of segments) {
    const prev = merged[merged.length - 1];
    const sameBeat = prev &&
      Math.floor(seg[0].start / PPQ) === Math.floor(prev[0].start / PPQ);
    const overlaps = prev &&
      prev.some(p => p.start + p.duration > seg[0].start);
    if (prev && seg.length === 1 && sameBeat && overlaps) prev.push(...seg);
    else merged.push([...seg]);
  }
  return merged.filter(s => s.length >= 2);   // il faut ≥ 2 sons pour un accord
}

/** 2–3) MATCHING sur un segment. */
export function detectChord(segment: readonly Note[]): ChordEvent | null {
  if (segment.length < 2) return null;
  const pcs = new Set(segment.map(n => (n.pitch % 12) as PitchClass));
  const bassNote = segment.reduce((a, b) => (a.pitch < b.pitch ? a : b));
  const bass = (bassNote.pitch % 12) as PitchClass;
  const start = Math.min(...segment.map(n => n.start));
  const end = Math.max(...segment.map(n => n.start + n.duration));

  interface Match { root: PitchClass; shape: ChordShape; score: number;
                    covered: Set<number>; implied: boolean }
  let best: Match | null = null;

  for (let root = 0 as PitchClass; root < 12; root++) {
    for (const shape of SHAPES) {
      const need = shape.intervals.map(i => (root + i) % 12);
      const opt  = (shape.optional ?? []).map(i => (root + i) % 12);
      const missing = need.filter(pc => !pcs.has(pc));

      // Rootless jazz : fondamentale absente tolérée si 3 notes définitoires présentes
      const rootlessOk = missing.length === 1 && missing[0] === root
        && need.filter(pc => pcs.has(pc)).length >= 3;
      if (missing.length > 0 && !rootlessOk) continue;

      const covered = new Set<number>([...need, ...opt].filter(pc => pcs.has(pc)));
      let score = 0;
      score += 2 * covered.size;                               // +2 / note d'accord
      for (const pc of pcs) if (!covered.has(pc)) {
        // note hors accord : extension légale = neutre, sinon −1
        const rel = (pc - root + 12) % 12;
        const isExt = EXTENSION_MAP.some(e => e.pc === rel
          && !(e.excludeIf ?? []).includes(shape.quality));
        if (!isExt) score -= 1;
      }
      if (bass === root) score += 1;                           // fondamentale à la basse
      else if (need.includes(bass)) score += 0.5;              // renversement plausible
      score += shape.intervals.length * 0.1;                   // départage : + spécifique gagne
      if (rootlessOk) score -= 0.5;

      if (!best || score > best.score) {
        best = { root: root as PitchClass, shape, score, covered, implied: rootlessOk };
      }
    }
  }
  if (!best || best.score < 4) return null;   // seuil : en dessous, cluster/ambigu

  // Extensions et notes étrangères
  const extensions: Extension[] = [];
  const foreignNotes: ForeignNote[] = [];
  for (const n of segment) {
    const pc = n.pitch % 12;
    if (best.covered.has(pc)) continue;
    const rel = (pc - best.root + 12) % 12;
    const ext = EXTENSION_MAP.find(e => e.pc === rel
      && !(e.excludeIf ?? []).includes(best!.shape.quality));
    if (ext) { if (!extensions.includes(ext.ext)) extensions.push(ext.ext); }
    else foreignNotes.push({ pitch: n.pitch, kind: "unexplained" });
    // la qualification passing/neighbor/appoggiatura se fait au niveau
    // progression (contexte avant/après), pas ici — cf. qualifyForeignNotes()
  }

  const chordTones = best.shape.intervals.map(i => (best!.root + i) % 12);
  const inversion = (best.implied ? 0
    : Math.max(0, chordTones.indexOf(bass))) as 0 | 1 | 2 | 3;
  const maxScore = 2 * (best.shape.intervals.length + (best.shape.optional?.length ?? 0)) + 1;

  return {
    root: best.root,
    quality: best.shape.quality,
    extensions,
    bass,
    inversion,
    impliedRoot: best.implied,
    start,
    duration: end - start,
    confidence: Math.min(1, best.score / maxScore),
    foreignNotes,
  };
}

/** API de haut niveau : notes brutes → progression d'accords. */
export function detectProgression(notes: readonly Note[]): ChordEvent[] {
  return segmentVerticalities(notes)
    .map(detectChord)
    .filter((c): c is ChordEvent => c !== null);
}
```

## 8.6 Signatures du reste (contrats S5–S6, corps à implémenter)

```typescript
// melody.ts
export function contour(notes: Note[]): { symbols: ("U"|"D"|"R")[]; arches: Arch[] };
export function leapProfile(notes: Note[]): { conjunctRatio: number; leaps: Leap[] };
export function findMotifs(notes: Note[], minLen?: number, maxLen?: number): MotifReport;
export function tensionCurve(notes: Note[], key: KeyContext, chords?: ChordEvent[]): number[];

// harmony.ts
export function functionOf(chord: ChordEvent, key: KeyContext): HarmonicFunction;
export function detectCadence(prog: ChordEvent[], key: KeyContext, meter: Meter): Cadence | null;
export function suggest(prog: ChordEvent[], key: KeyContext, style: string): Suggestion[];

// voiceLeading.ts — toutes sur Part[] alignées par verticalité
export function alignVerticalities(parts: Part[]): Verticality[];
export function parallelPerfects(v: Verticality[], interval: 7 | 12): Violation[];
```

## 8.7 Tests : fixture + propriété (le contrat qualité)

```typescript
// test/fixtures/keys/greensleeves-opening.json (annoté À LA MAIN)
{ "notes": [...], "meter": {"beatsPerBar":6,"beatUnit":8},
  "expected": { "tonic": 9, "modeOneOf": ["minor","dorian"], "ambiguousOk": true } }

// test/property/transpose.spec.ts
import fc from "fast-check";
test("la transposition préserve la tonique relative", () => {
  fc.assert(fc.property(arbMelody(), fc.integer({min:1,max:11}), (m, t) => {
    const k1 = estimateKey(m.notes, m.meter);
    const k2 = estimateKey(m.notes.map(n => ({...n, pitch: n.pitch + t})), m.meter);
    if (k1.ambiguous) return true;                    // pas d'exigence sur l'ambigu
    return k2.tonic === (k1.tonic + t) % 12 && k2.mode === k1.mode;
  }));
});
```

## 8.8 Notes d'implémentation (les pièges connus)

1. **`this` dans `evaluate`** : les règles utilisent `this.id` — les déclarer avec `function` ou passer par une factory `defineRule()` qui capture l'id ; ne jamais les déstructurer.
2. **Immutabilité** : chaque fonction trie ses copies (`[...notes].sort`), jamais l'entrée — le worker client et le serveur partagent des structures avec l'UI.
3. **Seuil de `detectChord` (score < 4)** : c'est un réglage de beta — le remonter rend le détecteur taiseux, le baisser le rend affabulateur. Chaque signalement « faux accord » de la beta devient une fixture qui verrouille le réglage.
4. **Enharmonie** : tout le moteur travaille en pitch-classes ; le *spelling* (fa♯ vs sol♭) n'intervient qu'à l'affichage (`pitch.spell(pc, key)`) et à l'export partition (V1). Ne jamais laisser l'orthographe polluer l'analyse.
5. **Performance** : `estimateKey` = 24 corrélations sur 12 flottants — négligeable. `detectChord` = 12 racines × 14 formes — négligeable aussi. Le seul point chaud sera `findMotifs` (n-grammes) : fenêtrer à 64 notes en live, complet à la soumission.

---

**Point de confirmation.** Le noyau est exécutable : types, moteur de règles, détection de tonalité et d'accords conformes aux specs des Sections 4 et 7, avec leurs tests. Suites possibles : **(c)** rédaction en série des leçons du Module 1 (je peux enchaîner par lots de 3–4 leçons au gabarit de la Section 5), **(d)** implémentation d'un deuxième étage du moteur (`findMotifs` + `tensionCurve` complets, ou le pipeline voice leading), ou **(e)** les 8 `styleProfiles.ts` complets en code depuis la matrice §7.8. Tu choisis ?