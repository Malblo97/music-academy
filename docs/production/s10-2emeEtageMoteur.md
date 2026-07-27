# SECTION 10 — DEUXIÈME ÉTAGE DU MOTEUR

## 10.1 `melody.ts` — `findMotifs` (implémentation complète)

```typescript
import type { Note } from "./types";
import { PPQ } from "./types";

export type VariationType = "exact" | "transposed" | "rhythmic";

export interface MotifOccurrence {
  startIndex: number;        // index de note dans la mélodie triée
  startTick: number;
  endTick: number;
  variation: VariationType;
  transposition?: number;    // en demi-tons si "transposed"
}

export interface Motif {
  intervalShape: number[];   // intervalles successifs en demi-tons
  rhythmShape: number[];     // ratios de durées normalisés (durée[i]/durée[0])
  length: number;            // nombre de notes
  occurrences: MotifOccurrence[];
}

export interface MotifReport {
  motifs: Motif[];           // triés par valeur pédagogique décroissante
  bestMotif: Motif | null;
  hasVariedRepetition: boolean;   // ≥1 motif avec ≥1 occurrence non-exacte
  maxExactRepetitions: number;    // alimente melody.monotony
}

/** Clé d'un n-gramme : intervalles + rythme quantifié grossièrement. */
function shapeAt(notes: Note[], i: number, len: number) {
  const intervals: number[] = [];
  const rhythm: number[] = [];
  const base = notes[i].duration || 1;
  for (let k = 0; k < len; k++) {
    if (k > 0) intervals.push(notes[i + k].pitch - notes[i + k - 1].pitch);
    // quantification du ratio rythmique en classes {0.25,0.5,1,1.5,2,3,4}
    const r = notes[i + k].duration / base;
    rhythm.push([0.25, 0.5, 1, 1.5, 2, 3, 4]
      .reduce((a, b) => Math.abs(b - r) < Math.abs(a - r) ? b : a));
  }
  return { intervals, rhythm };
}

const sameArr = (a: number[], b: number[]) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

export function findMotifs(
  input: readonly Note[], minLen = 3, maxLen = 6,
): MotifReport {
  const notes = [...input].sort((a, b) => a.start - b.start);
  const motifs: Motif[] = [];
  const claimed = new Set<string>();      // évite les sous-motifs redondants

  // Du plus long au plus court : un motif long "réclame" ses positions,
  // ses sous-motifs triviaux ne sont plus comptés séparément.
  for (let len = Math.min(maxLen, notes.length); len >= minLen; len--) {
    for (let i = 0; i + len <= notes.length; i++) {
      const key = `${i}:${len}`;
      if (claimed.has(key)) continue;
      const ref = shapeAt(notes, i, len);
      const occ: MotifOccurrence[] = [{
        startIndex: i,
        startTick: notes[i].start,
        endTick: notes[i + len - 1].start + notes[i + len - 1].duration,
        variation: "exact",
      }];

      for (let j = i + 1; j + len <= notes.length; j++) {
        const cand = shapeAt(notes, j, len);
        let variation: VariationType | null = null;
        let transposition: number | undefined;

        if (sameArr(cand.intervals, ref.intervals)) {
          // même forme intervallique : exact si même hauteur de départ ET rythme
          const samePitch = notes[j].pitch === notes[i].pitch;
          if (sameArr(cand.rhythm, ref.rhythm)) {
            variation = samePitch ? "exact" : "transposed";
          } else {
            variation = "rhythmic";      // augmentation/diminution
          }
          if (!samePitch) transposition = notes[j].pitch - notes[i].pitch;
        }
        if (variation) {
          occ.push({
            startIndex: j,
            startTick: notes[j].start,
            endTick: notes[j + len - 1].start + notes[j + len - 1].duration,
            variation, transposition,
          });
        }
      }

      if (occ.length >= 2) {
        for (const o of occ) for (let s = 0; s < len; s++) {
          // réclame positions et sous-fenêtres pour éviter le double comptage
          for (let l = minLen; l < len; l++) claimed.add(`${o.startIndex + s}:${l}`);
        }
        motifs.push({ intervalShape: ref.intervals, rhythmShape: ref.rhythm,
                      length: len, occurrences: occ });
      }
    }
  }

  // Valeur pédagogique : longueur × occurrences, bonus si variations présentes
  motifs.sort((a, b) => {
    const val = (m: Motif) =>
      m.length * m.occurrences.length
      + (m.occurrences.some(o => o.variation !== "exact") ? 3 : 0);
    return val(b) - val(a);
  });

  const maxExact = motifs.reduce((mx, m) =>
    Math.max(mx, m.occurrences.filter(o => o.variation === "exact").length), 0);

  return {
    motifs,
    bestMotif: motifs[0] ?? null,
    hasVariedRepetition: motifs.some(m =>
      m.occurrences.some(o => o.variation !== "exact")),
    maxExactRepetitions: maxExact,
  };
}
```

Ce rapport alimente directement : `melody.no-motif` (`motifs.length === 0` sur ≥ 8 mesures), `melody.monotony` (`maxExactRepetitions ≥ 4` sans occurrence variée), et le **craft positif** (`hasVariedRepetition` → bonus + strength textuelle avec les locations des occurrences).

## 10.2 `melody.ts` — `tensionCurve` (implémentation complète)

```typescript
import type { ChordEvent, KeyContext, Note } from "./types";

/** Instabilité intrinsèque du degré (m01-l14, §7 hiérarchie) — indexé par
 *  intervalle à la tonique en demi-tons. */
const DEGREE_TENSION_MAJOR = [0.0,0.9,0.45,0.85,0.15,0.6,0.95,0.15,0.85,0.5,0.8,0.75];
//                            1̂   ♭2   2̂   ♭3   3̂   4̂  ♯4/♭5  5̂   ♭6   6̂   ♭7   7̂
const DEGREE_TENSION_MINOR = [0.0,0.85,0.5,0.15,0.8,0.6,0.95,0.15,0.5,0.55,0.45,0.75];

const W = { degree: 0.40, height: 0.15, dissonance: 0.30, surprise: 0.15 };

export function tensionCurve(
  input: readonly Note[],
  key: KeyContext,
  chords?: readonly ChordEvent[],
): number[] {
  const notes = [...input].sort((a, b) => a.start - b.start);
  if (notes.length === 0) return [];
  const lo = Math.min(...notes.map(n => n.pitch));
  const hi = Math.max(...notes.map(n => n.pitch));
  const span = Math.max(1, hi - lo);
  const table = key.mode === "minor" ? DEGREE_TENSION_MINOR : DEGREE_TENSION_MAJOR;

  return notes.map((n, i) => {
    // 1. stabilité du degré
    const rel = ((n.pitch % 12) - key.tonic + 12) % 12;
    const tDegree = table[rel];

    // 2. hauteur relative dans l'ambitus
    const tHeight = (n.pitch - lo) / span;

    // 3. dissonance vs accord courant (si progression fournie)
    let tDiss = 0;
    if (chords?.length) {
      const ch = chords.find(c => n.start >= c.start && n.start < c.start + c.duration);
      if (ch) {
        const chordPcs = new Set<number>();
        // reconstitue les pitch-classes de l'accord depuis root+quality
        // (helper chordTonePcs(ch) dans chords.ts — omis ici)
        for (const pc of chordTonePcs(ch)) chordPcs.add(pc);
        tDiss = chordPcs.has(n.pitch % 12) ? 0
          : (rel === 1 || rel === 6 || rel === 11 ? 1.0 : 0.7);
      }
    }

    // 4. surprise intervallique
    const leap = i > 0 ? Math.abs(n.pitch - notes[i - 1].pitch) : 0;
    const tSurprise = Math.min(1, leap <= 2 ? 0 : (leap - 2) / 10);

    const hasChords = Boolean(chords?.length);
    // sans contexte harmonique, redistribue le poids de la dissonance
    const wDeg = hasChords ? W.degree : W.degree + W.dissonance * 0.7;
    const wSur = hasChords ? W.surprise : W.surprise + W.dissonance * 0.3;

    return Math.min(1,
      tDegree * wDeg + tHeight * W.height
      + tDiss * (hasChords ? W.dissonance : 0) + tSurprise * wSur);
  });
}

/** Corrélation de la courbe avec le gabarit du mood (craft, §4.2). */
export function archFit(curve: number[], mood: string): number {
  if (curve.length < 4) return 0.5;
  const template = MOOD_TEMPLATES[mood] ?? MOOD_TEMPLATES["default"];
  const resampled = resample(curve, 16);
  return Math.max(0, pearson(resampled, template));   // pearson importé de keyDetect
}

const MOOD_TEMPLATES: Record<string, number[]> = {
  // 16 points, climax ≈ 2/3
  default:  [.1,.15,.2,.25,.3,.35,.4,.5,.6,.7,.85,1,.8,.5,.3,.1],
  heroic:   [.2,.25,.3,.35,.4,.5,.55,.6,.7,.8,.9,1,1,.9,.6,.3],
  sad:      [.15,.2,.25,.3,.35,.4,.45,.55,.6,.65,.7,.6,.45,.3,.2,.1],
  lullaby:  [.1,.12,.15,.18,.2,.22,.25,.28,.25,.22,.2,.18,.15,.12,.1,.08],
  tension:  [.4,.5,.45,.6,.55,.7,.6,.75,.7,.85,.75,.9,.8,.95,.85,.9], // pics jamais résolus
  ambiguous_dark: [.3,.35,.4,.38,.45,.42,.5,.48,.55,.6,.7,.65,.5,.45,.4,.35],
};

function resample(arr: number[], n: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    const x = (i / (n - 1)) * (arr.length - 1);
    const lo = Math.floor(x), hi = Math.ceil(x);
    return arr[lo] + (arr[hi] - arr[lo]) * (x - lo);
  });
}
```

Note d'honnêteté algorithmique (à garder dans la doc du code) : cette courbe est un **modèle**, pas une vérité perceptive. Elle est cohérente avec ce que le cours enseigne (m01-l14) — c'est exactement ce qu'on lui demande : le produit note l'élève sur le modèle qu'il lui a appris, jamais sur un jugement esthétique opaque.

## 10.3 `voiceLeading.ts` — pipeline complet

```typescript
import type { Note, Part } from "./types";
import type { Location, Violation } from "./rules/types";

export interface Verticality {
  tick: number;
  pitches: (number | null)[];   // une entrée par part, null = silence/tenue expirée
}

/** Aligne les parts sur les instants d'attaque (union des starts). */
export function alignVerticalities(parts: readonly Part[]): Verticality[] {
  const ticks = [...new Set(parts.flatMap(p => p.notes.map(n => n.start)))]
    .sort((a, b) => a - b);
  return ticks.map(tick => ({
    tick,
    pitches: parts.map(p => {
      const sounding = p.notes.find(n => tick >= n.start && tick < n.start + n.duration);
      return sounding ? sounding.pitch : null;
    }),
  }));
}

type IntervalClass = 7 | 12;   // 5te juste | 8ve (mod 12 : 0)

function isPerfect(a: number, b: number, ic: IntervalClass): boolean {
  const d = Math.abs(a - b) % 12;
  return ic === 7 ? d === 7 : d === 0;
}

/** Quintes/octaves parallèles — cœur de vl.parallel-fifths / -octaves.
 *  Respecte la clause de doublure (§7.4) : paires colinéaires exclues en amont. */
export function parallelPerfects(
  verts: readonly Verticality[],
  parts: readonly Part[],
  ic: IntervalClass,
): Violation[] {
  const locations: Location[] = [];
  const nParts = parts.length;

  // paires exclues : doublures déclarées
  const excluded = new Set<string>();
  parts.forEach((p, i) => {
    if (!p.doubles) return;
    const j = parts.findIndex(q => q.instrumentId === p.doubles);
    if (j >= 0) excluded.add(`${Math.min(i, j)}-${Math.max(i, j)}`);
  });

  for (let v = 0; v + 1 < verts.length; v++) {
    const cur = verts[v], nxt = verts[v + 1];
    for (let a = 0; a < nParts; a++) for (let b = a + 1; b < nParts; b++) {
      if (excluded.has(`${a}-${b}`)) continue;
      const [c1, c2, n1, n2] = [cur.pitches[a], cur.pitches[b], nxt.pitches[a], nxt.pitches[b]];
      if (c1 == null || c2 == null || n1 == null || n2 == null) continue;
      if (c1 === n1 && c2 === n2) continue;               // oblique/statique : légal
      if (!isPerfect(c1, c2, ic) || !isPerfect(n1, n2, ic)) continue;
      const m1 = Math.sign(n1 - c1), m2 = Math.sign(n2 - c2);
      if (m1 !== 0 && m1 === m2) {                         // mouvement parallèle
        locations.push({ startTick: cur.tick, endTick: nxt.tick,
                         partIndex: a, pitches: [c1, c2, n1, n2] });
      }
    }
  }
  return locations.length
    ? [{ ruleId: ic === 7 ? "vl.parallel-fifths" : "vl.parallel-octaves",
         severity: "error", locations }]
    : [];
}

/** Résolution de la sensible (vl.leading-tone-resolution). */
export function leadingToneResolutions(
  verts: readonly Verticality[],
  parts: readonly Part[],
  tonic: number,               // pitch-class
): Violation[] {
  const leadingPc = (tonic + 11) % 12;
  const locations: Location[] = [];
  const outer = new Set([0, parts.length - 1]);   // voix extrêmes = strict

  for (let v = 0; v + 1 < verts.length; v++) {
    for (let p = 0; p < parts.length; p++) {
      const cur = verts[v].pitches[p], nxt = verts[v + 1].pitches[p];
      if (cur == null || nxt == null) continue;
      if (cur % 12 !== leadingPc) continue;
      const resolved = nxt - cur === 1;                   // ½ ton ascendant
      // tolérance "sensible frustrée" en voix interne : descente à 5̂ (§7.4)
      const frustrated = !outer.has(p) && (nxt % 12) === (tonic + 7) % 12;
      if (!resolved && !frustrated && nxt !== cur) {
        locations.push({ startTick: verts[v].tick, endTick: verts[v + 1].tick,
                         partIndex: p, pitches: [cur, nxt] });
      }
    }
  }
  return locations.length
    ? [{ ruleId: "vl.leading-tone-resolution", severity: "error", locations }]
    : [];
}

/** Métrique de craft vl.smoothness : déplacement total moyen par transition. */
export function smoothness(verts: readonly Verticality[]): number {
  let total = 0, transitions = 0;
  for (let v = 0; v + 1 < verts.length; v++) {
    let moved = 0, voices = 0;
    verts[v].pitches.forEach((cur, p) => {
      const nxt = verts[v + 1].pitches[p];
      if (cur != null && nxt != null) { moved += Math.abs(nxt - cur); voices++; }
    });
    if (voices) { total += moved / voices; transitions++; }
  }
  if (!transitions) return 1;
  const avg = total / transitions;             // demi-tons/voix/transition
  return Math.max(0, Math.min(1, 1 - (avg - 1) / 6));   // 1 dt = parfait, 7+ = 0
}
```

Les autres règles VL (`crossing`, `overlap`, `spacing`, `hidden-fifths`, `doubled-leading-tone`) suivent le même patron sur `Verticality[]` — chacune ~20 lignes, pas de difficulté nouvelle. Fixtures prioritaires : les cas-limites de la Section 7 (antiparallèles 5te→12te, exception cadentielle des hidden fifths, doublure déclarée).
