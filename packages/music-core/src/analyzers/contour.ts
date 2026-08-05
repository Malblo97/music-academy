import type { Note } from '../types.js';

/**
 * Les CINQ silhouettes du cursus (m02-l05). Le vocabulaire est celui des
 * contraintes (`contourShape`) et du générateur de quiz de `m02-e09` :
 * arch / descent / ascent / wave / plateau.
 */
export type Silhouette = 'arch' | 'descent' | 'ascent' | 'wave' | 'plateau';

export interface Peak {
  /** Index dans la ligne jugée. */
  index: number;
  /** Tick de l'attaque — c'est cette valeur que lit `climaxWindow`. */
  at: number;
  pitch: number;
  /** Vrai pour le(s) sommet(s) absolu(s) de la pièce. */
  isGlobal: boolean;
}

export interface ContourResult {
  /** Une lettre par intervalle : U (monte), D (descend), R (répète). */
  raw: string;
  /** La même, runs fusionnés — la forme compressée dont on lit la silhouette. */
  shape: string;
  silhouette: Silhouette | null;
  peaks: Peak[];
  ambitus: number;
}

/** Le plateau se juge à l'ambitus : « statisme + micro-mouvements » (l05 §1). */
const PLATEAU_AMBITUS = 4;

/** Une vague, c'est au moins deux alternances de direction. */
const MIN_WAVE_ALTERNATIONS = 2;

/** Une note par attaque, la plus aiguë (le chant) — même convention que `motifs.ts`. */
function melodyLine(notes: readonly Note[]): Note[] {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

function compress(raw: string): string {
  let out = '';
  for (const c of raw) if (c !== out[out.length - 1]) out += c;
  return out;
}

/** Les sommets locaux stricts : plus haut que le voisin de gauche ET de droite. */
function peaksOf(line: readonly Note[]): Peak[] {
  const max = line.reduce((m, n) => Math.max(m, n.pitch), -Infinity);
  const peaks: Peak[] = [];
  for (let i = 0; i < line.length; i++) {
    const p = line[i]!.pitch;
    const before = line[i - 1]?.pitch;
    const after = line[i + 1]?.pitch;
    // Une extrémité n'est un sommet que si elle domine son unique voisin.
    if (before === undefined && after === undefined) continue;
    if (before !== undefined && p <= before) continue;
    if (after !== undefined && p <= after) continue;
    peaks.push({ index: i, at: line[i]!.start, pitch: p, isGlobal: p === max });
  }
  return peaks;
}

function silhouetteOf(shape: string, ambitus: number, peaks: readonly Peak[]): Silhouette | null {
  // Le plateau d'abord : il se reconnaît à ce qu'il NE fait pas (l05 §1) — sans
  // quoi ses micro-mouvements seraient lus « vague ».
  //
  // **ÉCART CONNU, non corrigé ici** (cf. `docs/qa/lock2-run.md`) : le seuil
  // porte sur l'AMBITUS BRUT, ce qui refuse le nom de plateau à `m02-s22` dont
  // les `authorNotes` écrivent « plateau (ambitus 7) ✓ ». Une lecture sur le
  // contour RÉDUIT (moyenne par quart de pièce, seuil inchangé à 4) rend bien
  // « plateau » sur cette pièce — mais elle relit aussi `silhouette-wave` en
  // « arche » et ne débloque aucune solution de plus. Le désaccord reste donc
  // visible ici plutôt que noyé, et appelle une décision éditoriale.
  if (ambitus <= PLATEAU_AMBITUS) return 'plateau';

  const directions = shape.replace(/R/g, '');
  if (directions === 'UD' && peaks.filter(p => p.isGlobal).length === 1) return 'arch';
  if (directions === 'U') return 'ascent';
  if (directions === 'D') return 'descent';
  if (directions.length - 1 >= MIN_WAVE_ALTERNATIONS) return 'wave';
  return null;
}

/**
 * `contour(notes)` — la silhouette et ses sommets. Le contour se juge sur la
 * LIGNE (une note par attaque), pas sur la verticalité : c'est le dessin que
 * l'auditeur suit, et la fin de la silhouette EST le message (l05 §1).
 */
export function contour(notes: readonly Note[]): ContourResult {
  const line = melodyLine(notes);
  if (line.length < 2) return { raw: '', shape: '', silhouette: null, peaks: [], ambitus: 0 };

  let raw = '';
  for (let i = 1; i < line.length; i++) {
    const d = line[i]!.pitch - line[i - 1]!.pitch;
    raw += d > 0 ? 'U' : d < 0 ? 'D' : 'R';
  }
  const shape = compress(raw);
  const pitches = line.map(n => n.pitch);
  const ambitus = Math.max(...pitches) - Math.min(...pitches);
  const peaks = peaksOf(line);

  return { raw, shape, silhouette: silhouetteOf(shape, ambitus, peaks), peaks, ambitus };
}

/**
 * La position du climax dans la pièce, en fraction de la durée totale — la
 * valeur que `climaxWindow` compare à son intervalle (ex. [0.6, 0.85]).
 *
 * **L'ex æquo se départage par le POIDS, puis par la place.** La lecture
 * d'origine prenait le premier sommet absolu rencontré, « celui qui accomplit
 * la montée » — juste tant que le sommet n'est atteint qu'une fois. Le corpus
 * dit le contraire dès qu'il se répète :
 *
 *  - `m03-s17` (octatonique) touche son mi♭5 deux fois — une croche de passage
 *    dans un arpège montant à 38 %, puis la ronde du cluster à sept sons de la
 *    mesure 7, à 60 %. Le climax de cette pièce est la masse tenue, pas la note
 *    traversée ; la fenêtre de la consigne ([0,6 – 0,8]) le dit aussi ;
 *  - `m03-s14` (« le rouleau ») roule TROIS FOIS le même dessin — la consigne le
 *    déclare (`sameTopLineAcrossSegments`). Son ré5 revient à l'identique, et
 *    prendre le premier revenait à placer le sommet d'une pièce de douze
 *    mesures à sa deuxième.
 *
 * À durée égale, c'est donc le DERNIER énoncé du sommet qui compte : ce qui
 * précède n'était qu'une visite, la dernière est celle après quoi rien ne monte
 * plus.
 */
export function climaxPosition(notes: readonly Note[]): number | null {
  const line = melodyLine(notes);
  if (line.length === 0) return null;
  const total = line.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  if (total === 0) return null;
  const peak = line.reduce((m, n) => Math.max(m, n.pitch), -Infinity);
  const summits = line.filter(n => n.pitch === peak);
  const chosen = summits.reduce((best, n) =>
    (n.duration > best.duration || (n.duration === best.duration && n.start > best.start)) ? n : best);
  return chosen.start / total;
}
