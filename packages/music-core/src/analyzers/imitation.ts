import type { Note } from '../types.js';

/**
 * `imitation.ts` — qui répond à qui, et comment.
 *
 * **F-28, la réponse tonale** : la fugue mute le premier intervalle de la tête
 * (1̂→5̂ répondu 5̂→1̂) pour ne pas quitter le ton. La tolérance ±1/±2 dt est
 * donc accordée à la ZONE DE MUTATION SEULEMENT — le premier ou le deuxième
 * intervalle — contour et rythme conservés partout. Sans cette restriction,
 * F-12 (la transposition tonale des motifs) avalerait tout : n'importe quelle
 * approximation passerait pour une réponse.
 */

export type AnswerKind = 'real' | 'tonal';

export interface Entry {
  voice: number;
  at: number;
  /** Décalage de hauteur par rapport à la tête de référence. */
  transposition: number;
  kind: AnswerKind;
}

export interface EntryOpts {
  /** `tonal` autorise la mutation de zone de tête (F-28) ; `real` exige l'exactitude. */
  answer?: AnswerKind;
  /** Tolérance en demi-tons DANS la zone de mutation (défaut 2). */
  tolerance?: number;
  /** Nombre d'intervalles constituant la zone de mutation (défaut 2). */
  mutationZone?: number;
}

const DEFAULT_TOLERANCE = 2;
const DEFAULT_MUTATION_ZONE = 2;

function intervalsOf(line: readonly Note[]): number[] {
  return line.slice(1).map((n, i) => n.pitch - line[i]!.pitch);
}

function rhythmOf(line: readonly Note[]): number[] {
  return line.map(n => n.duration);
}

function sameRhythm(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * La fenêtre est-elle un énoncé de la tête ? Rend le sous-type, ou `null`.
 * `real` : intervalles identiques. `tonal` : identiques SAUF dans la zone de
 * mutation, où l'écart est borné — et partout le contour et le rythme tiennent.
 */
function matchHead(head: readonly Note[], window: readonly Note[], opts: EntryOpts): AnswerKind | null {
  if (window.length !== head.length) return null;
  if (!sameRhythm(rhythmOf(head), rhythmOf(window))) return null;

  const a = intervalsOf(head);
  const b = intervalsOf(window);
  if (a.every((v, i) => v === b[i])) return 'real';
  if ((opts.answer ?? 'real') !== 'tonal') return null;

  const zone = opts.mutationZone ?? DEFAULT_MUTATION_ZONE;
  const tolerance = opts.tolerance ?? DEFAULT_TOLERANCE;
  for (let i = 0; i < a.length; i++) {
    const diff = Math.abs(a[i]! - b[i]!);
    if (i < zone) {
      if (diff > tolerance) return null;
      if (Math.sign(a[i]!) !== Math.sign(b[i]!)) return null; // le contour tient
    } else if (diff !== 0) {
      return null; // hors zone de tête : la suite est EXACTE
    }
  }
  return 'tonal';
}

/**
 * `detectEntries(voices, head, opts)` — les entrées de la tête dans toutes les
 * voix. Les fenêtres se lisent note à note ; une entrée trouvée fait sauter à
 * la fin de son énoncé (deux entrées ne se chevauchent pas dans la même voix).
 */
export function detectEntries(
  voices: readonly (readonly Note[])[],
  head: readonly Note[],
  opts: EntryOpts = {},
): Entry[] {
  if (head.length < 2) return [];
  const entries: Entry[] = [];

  voices.forEach((voice, vi) => {
    const line = [...voice].sort((a, b) => a.start - b.start);
    let i = 0;
    while (i + head.length <= line.length) {
      const window = line.slice(i, i + head.length);
      const kind = matchHead(head, window, opts);
      if (kind) {
        entries.push({
          voice: vi,
          at: window[0]!.start,
          transposition: window[0]!.pitch - head[0]!.pitch,
          kind,
        });
        i += head.length;
        continue;
      }
      i++;
    }
  });

  return entries.sort((a, b) => a.at - b.at || a.voice - b.voice);
}

export interface CanonReport {
  /** Vrai si l'identité tient partout hors ruptures déclarées. */
  identical: boolean;
  /** Ticks où la voix suivante cesse d'être la copie décalée (la clausule, typiquement). */
  breaks: number[];
}

/**
 * `canonCheck(dux, comes, opts)` — la machine : `comes` doit être `dux` décalé
 * de `delay` ticks et transposé de `interval`. La rupture finale est ATTENDUE
 * (« la machine s'arrête, les humains concluent ») : elle est rapportée, pas
 * condamnée — c'est à l'appelant de vérifier qu'elle est taguée.
 */
export function canonCheck(
  dux: readonly Note[],
  comes: readonly Note[],
  opts: { delay: number; interval: number },
): CanonReport {
  const lead = [...dux].sort((a, b) => a.start - b.start);
  const follow = [...comes].sort((a, b) => a.start - b.start);
  const breaks: number[] = [];

  for (const note of follow) {
    const expected = lead.find(n => n.start + opts.delay === note.start);
    if (!expected) {
      breaks.push(note.start);
      continue;
    }
    if (expected.pitch + opts.interval !== note.pitch || expected.duration !== note.duration) {
      breaks.push(note.start);
    }
  }
  return { identical: breaks.length === 0, breaks };
}

export interface StretteReport {
  /** Délais successifs entre entrées, en ticks. */
  delays: number[];
  /** Vrai si les délais se resserrent : la compression EST le moteur de tension. */
  compresses: boolean;
  /** Vrai si deux énoncés se chevauchent — la strette au sens strict. */
  overlaps: boolean;
}

/**
 * `stretteCheck(entries, headTicks)` — **F-32**. Quand plusieurs TÊTES
 * différentes circulent, les entrées de chacune sont fusionnées sur UNE
 * timeline avant de mesurer l'arche des délais : sinon deux sujets entrelacés
 * se lisent comme deux strettes molles au lieu d'une seule qui se resserre.
 */
export function stretteCheck(entries: readonly Entry[], headTicks: number): StretteReport {
  const timeline = [...entries].sort((a, b) => a.at - b.at);
  const delays: number[] = [];
  for (let i = 1; i < timeline.length; i++) {
    delays.push(timeline[i]!.at - timeline[i - 1]!.at);
  }
  const compresses = delays.length >= 2 && delays.every((d, i) => i === 0 || d <= delays[i - 1]!);
  const overlaps = delays.some(d => d < headTicks);
  return { delays, compresses, overlaps };
}

export interface InvertibleReport {
  /** Intervalles-classes du contre-sujet contre le sujet, position d'origine. */
  original: number[];
  /** Les mêmes, contre-sujet transposé à l'octave sous le sujet. */
  inverted: number[];
  /** Vrai si les DEUX positions ne contiennent que des consonances. */
  ok: boolean;
}

const CONSONANT = new Set([0, 3, 4, 7, 8, 9]);

/**
 * `invertibleCheck(subject, counterSubject, opts)` — un contre-sujet invertible
 * à l'octave n'a le droit qu'aux tierces et aux sixtes : toute quinte devient
 * une QUARTE à l'inversion, donc une dissonance. Les deux positions sont
 * mesurées, pas déduites.
 */
export function invertibleCheck(
  subject: readonly Note[],
  counterSubject: readonly Note[],
  opts: { at?: number } = {},
): InvertibleReport {
  const shift = opts.at ?? 12;
  const points = [...new Set([...subject, ...counterSubject].map(n => n.start))].sort((a, b) => a - b);
  const sounding = (voice: readonly Note[], tick: number): Note | undefined =>
    voice.find(n => n.start <= tick && n.start + n.duration > tick);

  const original: number[] = [];
  const inverted: number[] = [];
  for (const tick of points) {
    const s = sounding(subject, tick);
    const c = sounding(counterSubject, tick);
    if (!s || !c) continue;
    // Classe d'intervalle mesurée du grave vers l'aigu : à l'inversion, la
    // quinte DOIT se lire quarte — c'est tout le sujet du contrôle.
    original.push(Math.abs(c.pitch - s.pitch) % 12);
    inverted.push(Math.abs(c.pitch - shift - s.pitch) % 12);
  }
  return {
    original,
    inverted,
    ok: original.every(i => CONSONANT.has(i)) && inverted.every(i => CONSONANT.has(i)),
  };
}
