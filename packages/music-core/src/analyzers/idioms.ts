import type { Note } from '../types.js';
import type { ChordResult } from './chord.js';
import type { KeyEstimate } from './key.js';
import { IDIOM_PATTERNS, idiomPattern } from '../data/idioms.js';
import type { IdiomFamily, IdiomId } from '../data/idioms.js';
import { detectCollection } from './collection.js';

/**
 * Une verticalité datée. `chord` est FACULTATIF : les empilements non tertiens
 * (quartal, clusters) font rendre `null` à `detectChord`, et ce sont justement
 * ceux que l13/l14 demandent de tagger — la détection d'idiomes travaille donc
 * sur les notes, pas sur un chiffrage préalable.
 */
export interface Vertical {
  from: number;
  to: number;
  notes: readonly Note[];
  chord?: ChordResult | null;
}

export interface IdiomTag {
  id: IdiomId;
  family: IdiomFamily;
  from: number;
  to: number;
  /** Le COMPORTEMENT constaté, en clair — c'est lui qui a décidé, pas les notes. */
  evidence: string;
}

export interface TagIdiomsOpts {
  /** Défaut 1920 (F-5, F-2 : aucune solution M1–M3 ne déclare de mètre). */
  barTicks?: number;
}

const DEFAULT_BAR_TICKS = 1920;

/** Quartes justes/augmentées — et les quintes empilées, qui en sont l'inversion. */
const FOURTHS = new Set([5, 6]);
const FIFTHS = new Set([7]);

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

function sameSet(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function subsetOf(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function triadOf(pcs: ReadonlySet<number>): { root: number; quality: 'maj' | 'min' } | null {
  if (pcs.size !== 3) return null;
  for (const root of pcs) {
    if (pcs.has(pc(root + 4)) && pcs.has(pc(root + 7))) return { root, quality: 'maj' };
    if (pcs.has(pc(root + 3)) && pcs.has(pc(root + 7))) return { root, quality: 'min' };
  }
  return null;
}

/** La plus longue pile contiguë de quartes (ou de quintes) dans une verticalité. */
function quartalRun(pitches: readonly number[]): number {
  let best = 1;
  for (const family of [FOURTHS, FIFTHS]) {
    let run = 1;
    for (let i = 1; i < pitches.length; i++) {
      if (family.has(pitches[i]! - pitches[i - 1]!)) run++;
      else run = 1;
      if (run > best) best = run;
    }
  }
  return best;
}

/** Vue pré-mâchée d'une verticalité : tout ce que les détecteurs regardent. */
interface View {
  from: number;
  to: number;
  pitches: number[]; // hauteurs distinctes, graves → aigus
  pcs: Set<number>;
  degrees: Set<number>;
  bass: number; // hauteur de la basse
  bassDegree: number;
  quartal: boolean;
  chord: ChordResult | null;
}

function view(v: Vertical, tonic: number): View {
  const pitches = [...new Set(v.notes.map(n => n.pitch))].sort((a, b) => a - b);
  const pcs = new Set(pitches.map(pc));
  const bass = pitches[0] ?? 0;
  return {
    from: v.from,
    to: v.to,
    pitches,
    pcs,
    degrees: new Set([...pcs].map(p => pc(p - tonic))),
    bass,
    bassDegree: pc(bass - tonic),
    quartal: quartalRun(pitches) >= 3,
    chord: v.chord ?? null,
  };
}

/** Fin (incluse) de la tenue : les verticalités consécutives de même pc-set. */
function heldEnd(views: readonly View[], i: number): number {
  let j = i;
  while (j + 1 < views.length && sameSet(views[j + 1]!.pcs, views[i]!.pcs)) j++;
  return j;
}

function isHeldStart(views: readonly View[], i: number): boolean {
  return i === 0 || !sameSet(views[i]!.pcs, views[i - 1]!.pcs);
}

function isDim7(v: View): boolean {
  if (v.pcs.size !== 4) return false;
  const b = pc(v.bass);
  const ivs = [...v.pcs].map(p => pc(p - b)).sort((x, y) => x - y);
  return ivs[0] === 0 && ivs[1] === 3 && ivs[2] === 6 && ivs[3] === 9;
}

function isAugmentedTriad(v: View): boolean {
  if (v.pcs.size !== 3) return false;
  const b = pc(v.bass);
  const ivs = [...v.pcs].map(p => pc(p - b)).sort((x, y) => x - y);
  return ivs[0] === 0 && ivs[1] === 4 && ivs[2] === 8;
}

/** Le noyau de dominante {fondamentale, 3ce M, 7e m} — les extensions n'y font rien. */
function hasDominantCore(v: View, root: number): boolean {
  return v.pcs.has(pc(root)) && v.pcs.has(pc(root + 4)) && v.pcs.has(pc(root + 10));
}

/** Toutes les voix conjointes ou communes entre deux verticalités (≤ 2 dt). */
function allVoicesSmooth(a: View, b: View): boolean {
  if (a.pitches.length !== b.pitches.length) return false;
  return a.pitches.every((p, k) => Math.abs(b.pitches[k]! - p) <= 2);
}

function matchesDegrees(id: IdiomId, degrees: ReadonlySet<number>): boolean {
  const pat = idiomPattern(id);
  const required = pat.requiredDegrees ?? [];
  if (!required.every(d => degrees.has(d))) return false;
  return pat.exactDegrees !== true || degrees.size === required.length;
}

function aug6TypeOf(degrees: ReadonlySet<number>): IdiomId | null {
  for (const id of ['aug6-ger', 'aug6-fr', 'aug6-it'] as const) {
    if (matchesDegrees(id, degrees)) return id;
  }
  return null;
}

function tag(id: IdiomId, from: number, to: number, evidence: string): IdiomTag {
  return { id, family: idiomPattern(id).family, from, to, evidence };
}

/**
 * `tagIdioms` — les ~16 idiomes du cursus, tagués PAR COMPORTEMENT.
 *
 * L'ordre interne est une dépendance : **aug6 est tagué AVANT subV (F-16)**,
 * si bien qu'en tonalité établie un A♭7 qui descend sur G est une sixte
 * allemande, jamais « la substitution du monde d'à côté » — et `detectCadences`
 * lit ce tag pour ne pas fabriquer de cadence parfaite d'ailleurs.
 */
export function tagIdioms(
  verticals: readonly Vertical[],
  key: KeyEstimate,
  opts: TagIdiomsOpts = {},
): IdiomTag[] {
  const barTicks = opts.barTicks ?? DEFAULT_BAR_TICKS;
  const views = verticals.map(v => view(v, key.tonic));
  const n = views.length;
  const tags: IdiomTag[] = [];
  const aug6At = new Set<number>();

  const heldBars = (i: number, end: number): number => (views[end]!.to - views[i]!.from) / barTicks;

  // --- 1. Sixtes augmentées (et le pivot ger6-v7) — AVANT subV, F-16. -------
  for (let i = 0; i < n; i++) {
    if (!isHeldStart(views, i)) continue;
    const v = views[i]!;
    const id = aug6TypeOf(v.degrees);
    if (!id) continue;
    const pat = idiomPattern(id);
    if (v.bassDegree !== pat.bassDegree) continue;
    const end = heldEnd(views, i);
    const next = views[end + 1];
    if (!next || next.bassDegree !== pat.resolvesToBassDegree) continue;

    for (let k = i; k <= end; k++) aug6At.add(k);
    tags.push(tag(id, v.from, views[end]!.to, 'basse ♭6̂→5̂, {♭6̂,1̂,♯4̂} exposé'));

    // Le TENU fait le pivot : l'oreille lâche le monde de départ, et la même
    // verticalité (≡ V7 enharmonique, F-6) se relit Ger⁶ de l'arrivée (s05).
    const pivot = idiomPattern('ger6-v7');
    if (id === 'aug6-ger' && heldBars(i, end) >= (pivot.minHeldBars ?? 1)) {
      tags.push(tag('ger6-v7', v.from, views[end]!.to, `Ger⁶ tenu ${heldBars(i, end)} mes. puis sortie ♭6̂→5̂`));
    }
  }

  const isDominantish = (i: number): boolean => {
    const v = views[i];
    if (!v) return false;
    if (aug6At.has(i)) return true; // un aug6 est un pré-dominant : la marche vers D continue
    if (v.degrees.has(7) && v.degrees.has(11)) return true;
    return v.chord !== null && pc(v.chord.root - key.tonic) === 7;
  };

  // --- 2. Napolitain : ♭II en position de sixte, en contexte S→D. -----------
  for (let i = 0; i < n; i++) {
    if (!isHeldStart(views, i)) continue;
    const v = views[i]!;
    if (!matchesDegrees('neapolitan', v.degrees)) continue;
    if (v.bassDegree !== idiomPattern('neapolitan').bassDegree) continue;
    const end = heldEnd(views, i);
    if (!isDominantish(end + 1)) continue;
    tags.push(tag('neapolitan', v.from, views[end]!.to, 'majeur sur ♭2̂, basse 4̂ (position de sixte), sortie vers D'));
  }

  // --- 3. Les deux métiers du dim7 : le passant et le pivot. ----------------
  for (let i = 0; i < n; i++) {
    const v = views[i]!;
    if (!isDim7(v)) continue;

    // Le PASSANT : escalier de basse (½ ton, même direction) et toutes les
    // voix conjointes ou communes de part et d'autre. Il ne se tient pas.
    const prev = views[i - 1];
    const after = views[i + 1];
    if (prev && after) {
      const d1 = v.bass - prev.bass;
      const d2 = after.bass - v.bass;
      if (Math.abs(d1) === 1 && d1 === d2 && allVoicesSmooth(prev, v) && allVoicesSmooth(v, after)) {
        tags.push(tag('dim7-passing', v.from, v.to, 'escalier de basse ½ ton, toutes voix conjointes ou communes'));
        continue;
      }
    }

    // Le PIVOT : tenu ≥ 1 mesure, puis sortie sur une tonique à distance
    // (une triade en position de fondamentale qui n'est PAS la tonique courante).
    if (!isHeldStart(views, i)) continue;
    const end = heldEnd(views, i);
    const bars = heldBars(i, end);
    if (bars < (idiomPattern('dim7-pivot').minHeldBars ?? 1)) continue;
    const exit = views[end + 1];
    if (!exit) continue;
    const triad = triadOf(exit.pcs);
    if (!triad || triad.root !== pc(exit.bass) || triad.root === key.tonic) continue;
    tags.push(tag('dim7-pivot', v.from, views[end]!.to, `tenu ${bars} mes. puis sortie sur une tonique à distance`));
  }

  // --- 4. subV : noyau de dominante, basse ½ ton descendant sur la cible. ---
  for (let i = 0; i < n; i++) {
    if (aug6At.has(i)) continue; // F-16 : en tonalité établie, aug6 gagne
    const v = views[i]!;
    const root = pc(v.bass);
    if (!hasDominantCore(v, root)) continue;
    const next = views[i + 1];
    if (!next || next.bass !== v.bass - 1) continue;
    tags.push(tag('subV', v.from, v.to, '7 de dominante dont la basse descend d\'un ½ ton sur la cible'));
  }

  // --- 5. Back-door : ♭VII7 → I, la cadence sans sensible. ------------------
  for (let i = 0; i < n; i++) {
    const v = views[i]!;
    if (!matchesDegrees('back-door', v.degrees)) continue;
    if (v.bassDegree !== idiomPattern('back-door').bassDegree) continue;
    const next = views[i + 1];
    if (!next || next.bassDegree !== 0) continue;
    if (!next.degrees.has(0) || !(next.degrees.has(4) || next.degrees.has(3))) continue;
    const prev = views[i - 1];
    const fromIv = prev && prev.degrees.has(5) && prev.degrees.has(8) && prev.bassDegree === 5;
    tags.push(tag('back-door', v.from, v.to, fromIv ? 'iv → ♭VII7 → I, sans sensible' : '♭VII7 → I, sans sensible'));
  }

  // --- 6. Augmenté pivot : 4+4+4 tenu, puis un monde neuf. -----------------
  for (let i = 0; i < n; i++) {
    if (!isHeldStart(views, i)) continue;
    const v = views[i]!;
    if (!isAugmentedTriad(v)) continue;
    const end = heldEnd(views, i);
    const bars = heldBars(i, end);
    if (bars < (idiomPattern('augmented-pivot').minHeldBars ?? 1)) continue;
    const exit = views[end + 1];
    if (!exit) continue;
    const triad = triadOf(exit.pcs);
    if (!triad || triad.root === key.tonic) continue;
    tags.push(tag('augmented-pivot', v.from, views[end]!.to, `augmenté tenu ${bars} mes., sortie hors de la tonalité courante`));
  }

  // --- 7. Quartal, et son ouverture tertienne. -----------------------------
  for (let i = 0; i < n; i++) {
    const v = views[i]!;
    if (!v.quartal) continue;
    if (i === 0 || !views[i - 1]!.quartal) {
      let end = i;
      while (end + 1 < n && views[end + 1]!.quartal) end++;
      tags.push(tag('quartal', v.from, views[end]!.to, 'pile de quartes (ou de quintes) ≥ 3 sons'));
    }
    // La sortie : la tertienne s'ouvre DANS les pitch-classes de la pile,
    // une note au moins tenue (s13 m9→10 : ré majeur étalé, F♯ commun).
    const next = views[i + 1];
    if (!next || next.quartal) continue;
    if (!triadOf(next.pcs)) continue;
    if (!subsetOf(next.pcs, v.pcs)) continue;
    if (!next.pitches.some(p => v.pitches.includes(p))) continue;
    tags.push(tag('quartal-release', v.from, next.to, 'la tertienne s\'ouvre dans les pcs de la pile, une voix tenue'));
  }

  // --- 8. Planing : ≥ 3 verticalités parallèles de même structure. ---------
  tags.push(...tagPlaning(views, verticals));

  // --- 9. Line cliché : une voix INTERNE chromatique, tout le reste immobile.
  tags.push(...tagLineCliche(views));

  const order = new Map(IDIOM_PATTERNS.map((p, i) => [p.id, i]));
  return tags.sort((a, b) => a.from - b.from || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

/** Un pas de planing : mêmes voix, ≥ 3 voix mobiles dans la MÊME direction. */
interface Step {
  deltas: number[];
  movers: number[];
  holders: string; // les index immobiles, sérialisés (la pédale doit être la même tout du long)
  uniform: boolean; // toutes les voix mobiles bougent du même intervalle
}

function stepOf(a: View, b: View): Step | null {
  if (a.pitches.length !== b.pitches.length || a.pitches.length < 3) return null;
  const deltas = a.pitches.map((p, k) => b.pitches[k]! - p);
  const movers: number[] = [];
  const holders: number[] = [];
  deltas.forEach((d, k) => (d === 0 ? holders : movers).push(k));
  if (movers.length < 3) return null;
  const dir = Math.sign(deltas[movers[0]!]!);
  if (!movers.every(k => Math.sign(deltas[k]!) === dir)) return null;
  const first = deltas[movers[0]!]!;
  return { deltas, movers, holders: holders.join(','), uniform: movers.every(k => deltas[k] === first) };
}

function tagPlaning(views: readonly View[], verticals: readonly Vertical[]): IdiomTag[] {
  const out: IdiomTag[] = [];
  const minSpan = idiomPattern('planing-real').minSpan ?? 3;
  let i = 0;
  while (i < views.length - 1) {
    const first = stepOf(views[i]!, views[i + 1]!);
    if (!first) { i++; continue; }
    let end = i + 1;
    let uniform = first.uniform;
    while (end + 1 < views.length) {
      const step = stepOf(views[end]!, views[end + 1]!);
      // La pédale (voix immobile) doit rester LA MÊME : sinon ce n'est plus le
      // même geste, c'est une autre texture.
      if (!step || step.holders !== first.holders) break;
      uniform = uniform && step.uniform;
      end++;
    }
    if (end - i + 1 >= minSpan) {
      const from = views[i]!.from;
      const to = views[end]!.to;
      const movers = first.movers;
      const allQuartal = views.slice(i, end + 1).every(v => quartalRun(movers.map(k => v.pitches[k]!)) >= 3);
      const notes = verticals.slice(i, end + 1).flatMap(v => [...v.notes]);
      // `detectCollection` ne rend une famille que si elle tient au seuil strict :
      // « diatonique » suffit donc à dire que le planing reste dans UNE gamme.
      const diatonic = detectCollection(notes, [from, to])?.family === 'diatonic';

      if (allQuartal) {
        out.push(tag('planing-quartal', from, to, `${end - i + 1} piles de quartes en mouvement parallèle`));
      } else if (uniform) {
        out.push(tag('planing-real', from, to, `${end - i + 1} verticalités, structure exacte transposée`));
      } else if (diatonic) {
        out.push(tag('planing-diatonic', from, to, `${end - i + 1} verticalités parallèles dans une seule collection diatonique`));
      }
    }
    i = end > i ? end : i + 1;
  }
  return out;
}

function tagLineCliche(views: readonly View[]): IdiomTag[] {
  const out: IdiomTag[] = [];
  const minSpan = idiomPattern('line-cliche').minSpan ?? 3;

  /** Un pas de line cliché : UNE seule voix bouge, d'un ½ ton, et elle est interne. */
  const chromaticStep = (a: View, b: View): { voice: number; dir: number } | null => {
    if (a.pitches.length !== b.pitches.length || a.pitches.length < 3) return null;
    let voice = -1;
    for (let k = 0; k < a.pitches.length; k++) {
      if (a.pitches[k] === b.pitches[k]) continue;
      if (voice >= 0) return null;
      voice = k;
    }
    if (voice <= 0 || voice >= a.pitches.length - 1) return null; // ni la basse ni le soprano
    const d = b.pitches[voice]! - a.pitches[voice]!;
    return Math.abs(d) === 1 ? { voice, dir: Math.sign(d) } : null;
  };

  let i = 0;
  while (i < views.length - 1) {
    const first = chromaticStep(views[i]!, views[i + 1]!);
    if (!first) { i++; continue; }
    let end = i + 1;
    while (end + 1 < views.length) {
      const step = chromaticStep(views[end]!, views[end + 1]!);
      if (!step || step.voice !== first.voice || step.dir !== first.dir) break;
      end++;
    }
    if (end - i + 1 >= minSpan) {
      out.push(tag(
        'line-cliche',
        views[i]!.from,
        views[end]!.to,
        `voix interne chromatique ${first.dir > 0 ? 'montante' : 'descendante'} sur ${end - i} pas, tout le reste immobile`,
      ));
    }
    i = end > i ? end : i + 1;
  }
  return out;
}
