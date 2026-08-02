import type { Issue, Meter, Mode, Note } from '../types.js';
import type { KeyEstimate } from './key.js';
import { barTicks } from './rhythm.js';
import { suspensionCheck } from './suspension.js';

/**
 * `species.ts` — les cinq espèces de Fux, avec leurs deux findings transverses.
 *
 * **F-25 (ficta)** : la fenêtre de CLAUSULE admet la sensible haussée d'un mode
 * qui n'en a pas (le do♯ du ré dorien). Taguée `ficta`, elle est légale ; la
 * même altération en milieu de ligne est une erreur — le contre-exemple
 * `ficta-midline-error` verrouille la différence.
 *
 * **F-26 (contour en miroir)** : quand le contrepoint est SOUS le cantus, son
 * extremum est le CREUX, pas le sommet. Sans ce miroir, toute voix grave
 * correcte était lue « sans climax ». La remontée cadentielle sort du comptage.
 */

export type Species = 1 | 2 | 3 | 4 | 5;

export type SpeciesFigureKind =
  | 'passing'
  | 'neighbor'
  | 'cambiata'
  | 'double-neighbor'
  | 'suspension'
  | 'syncope-break';

export interface SpeciesFigure {
  kind: SpeciesFigureKind;
  at: number;
}

export interface SpeciesOpts {
  /** Le contrepoint est-il au-dessus ou au-dessous du cantus firmus ? */
  cpPosition: 'above' | 'below';
  /** Nécessaire à F-25 : sans mode déclaré, aucune ficta n'est jugée. */
  key?: KeyEstimate;
  meter?: Meter;
}

export interface SpeciesReport {
  issues: Issue[];
  /** Intervalle (classe) contre le CF à chaque attaque du contrepoint. */
  intervals: number[];
  figures: SpeciesFigure[];
  /** Ticks des notes altérées acceptées comme ficta (F-25). */
  ficta: number[];
  /** L'extremum de la ligne — sommet au-dessus, CREUX au-dessous (F-26). */
  climaxAt: number | null;
  /** Position de l'extremum dans la ligne, en fraction. */
  climaxPosition: number | null;
}

const CONSONANT = new Set([0, 3, 4, 7, 8, 9]);
const PERFECT = new Set([0, 7]);

/** F-27 : une seule rupture de syncope tolérée hors clausule. */
const MAX_SYNCOPE_BREAKS = 1;

/** F-26 : l'extremum doit tomber dans cette fenêtre de la ligne. */
const CLIMAX_WINDOW: [number, number] = [0.4, 0.75];

const SCALES: Record<Mode, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

function isStep(a: number, b: number): boolean {
  const d = Math.abs(a - b);
  return d >= 1 && d <= 2;
}

function soundingAt(voice: readonly Note[], tick: number): Note | undefined {
  return voice.find(n => n.start <= tick && n.start + n.duration > tick);
}

function issue(ruleId: string, atTick: number, message: string, severity: Issue['severity'] = 'error'): Issue {
  return { ruleId, severity, atTick, message, lessonRef: 'm04-l02' };
}

/** F-25 : la clausule = les deux dernières notes du cantus. */
function clausuleFrom(cf: readonly Note[]): number {
  if (cf.length < 2) return Infinity;
  return cf[cf.length - 2]!.start;
}

/**
 * Le catalogue des figures de 3e espèce : passage, broderie, cambiata et
 * double broderie. La **cambiata** est un dessin EXACT — 8-7-5-6, c'est-à-dire
 * degré descendant, tierce descendante, degré ascendant : l'à-peu-près est
 * refusé (m04-s04).
 */
function figureAt(line: readonly Note[], i: number): SpeciesFigureKind | null {
  const a = line[i - 1];
  const b = line[i];
  const c = line[i + 1];
  const d = line[i + 2];
  if (!a || !b || !c) return null;

  if (d && a.pitch - b.pitch >= 1 && a.pitch - b.pitch <= 2 &&
      b.pitch - c.pitch >= 3 && b.pitch - c.pitch <= 4 &&
      d.pitch - c.pitch >= 1 && d.pitch - c.pitch <= 2) {
    return 'cambiata';
  }
  if (isStep(a.pitch, b.pitch) && isStep(b.pitch, c.pitch)) {
    if (Math.sign(b.pitch - a.pitch) === Math.sign(c.pitch - b.pitch)) return 'passing';
    if (a.pitch === c.pitch) return 'neighbor';
    return 'double-neighbor';
  }
  return null;
}

/** Intervalle-classe du contrepoint contre le cantus, à un tick donné. */
function intervalAt(cf: readonly Note[], note: Note): number | null {
  const against = soundingAt(cf, note.start);
  return against ? pc(note.pitch - against.pitch) : null;
}

function fictaIssues(cp: readonly Note[], cf: readonly Note[], opts: SpeciesOpts): { issues: Issue[]; ficta: number[] } {
  const issues: Issue[] = [];
  const ficta: number[] = [];
  if (!opts.key) return { issues, ficta };

  const scale = new Set(SCALES[opts.key.mode].map(d => pc(d + opts.key!.tonic)));
  const clausule = clausuleFrom(cf);

  for (const note of cp) {
    if (scale.has(pc(note.pitch))) continue;
    if (note.start >= clausule) {
      ficta.push(note.start);
      continue;
    }
    issues.push(issue(
      'cpt.ficta',
      note.start,
      'altération hors fenêtre de clausule (F-25) : la ficta ne se justifie qu\'à la cadence',
    ));
  }
  return { issues, ficta };
}

/** F-26 : sous le cantus, l'extremum est le creux — et la remontée cadentielle ne compte pas. */
function contourReport(cp: readonly Note[], cf: readonly Note[], opts: SpeciesOpts): {
  issues: Issue[]; climaxAt: number | null; climaxPosition: number | null;
} {
  const clausule = clausuleFrom(cf);
  const judged = cp.filter(n => n.start < clausule);
  if (judged.length === 0) return { issues: [], climaxAt: null, climaxPosition: null };

  const below = opts.cpPosition === 'below';
  const extremum = judged.reduce((best, n) =>
    (below ? n.pitch < best.pitch : n.pitch > best.pitch) ? n : best);

  const total = cp.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const position = total > 0 ? extremum.start / total : null;

  const issues: Issue[] = [];
  if (position !== null && (position < CLIMAX_WINDOW[0] || position > CLIMAX_WINDOW[1])) {
    issues.push(issue(
      'cpt.climax-window',
      extremum.start,
      `${below ? 'creux' : 'sommet'} à ${Math.round(position * 100)} % — attendu entre ${CLIMAX_WINDOW[0] * 100} et ${CLIMAX_WINDOW[1] * 100} % (F-26)`,
      'warning',
    ));
  }
  const ties = judged.filter(n => n.pitch === extremum.pitch);
  if (ties.length > 1) {
    issues.push(issue('cpt.climax-unique', extremum.start, `${below ? 'creux' : 'sommet'} atteint ${ties.length} fois : l'extremum doit être unique`, 'warning'));
  }
  return { issues, climaxAt: extremum.start, climaxPosition: position };
}

/**
 * Parallèles parfaites, mesurées **d'APPUI À APPUI** — d'une note du cantus à
 * la suivante.
 *
 * La règle ne s'applique qu'aux 1re et 2e espèces. Dès la 3e, la doctrine reçue
 * (Fux, et le corpus M4 avec lui : m04-s04 enchaîne deux quintes d'appui et
 * reste l'étalon) veut que l'interposition de notes BRISE le parallélisme —
 * l'oreille n'entend plus deux quintes consécutives mais deux quintes séparées
 * par trois notes. Flaguer ici reviendrait à condamner la solution de référence.
 */
function parallelIssues(cp: readonly Note[], cf: readonly Note[], species: Species): Issue[] {
  if (species > 2) return [];
  const issues: Issue[] = [];
  const anchors = new Set(cf.map(n => n.start));
  const onAnchor = cp.filter(n => anchors.has(n.start));
  for (let i = 0; i < onAnchor.length - 1; i++) {
    const a = onAnchor[i]!;
    const b = onAnchor[i + 1]!;
    const ca = soundingAt(cf, a.start);
    const cb = soundingAt(cf, b.start);
    if (!ca || !cb || ca === cb) continue;
    const before = pc(a.pitch - ca.pitch);
    const after = pc(b.pitch - cb.pitch);
    if (!PERFECT.has(after) || before !== after) continue;
    const d1 = b.pitch - a.pitch;
    const d2 = cb.pitch - ca.pitch;
    if (d1 === 0 || d2 === 0 || Math.sign(d1) !== Math.sign(d2)) continue;
    issues.push(issue('cpt.parallel-perfects', b.start, `${after === 0 ? 'octaves' : 'quintes'} parallèles avec le cantus`));
  }
  return issues;
}

export function checkSpecies(
  species: Species,
  cf: readonly Note[],
  cp: readonly Note[],
  opts: SpeciesOpts,
): SpeciesReport {
  const meter = opts.meter ?? ([4, 4] as Meter);
  const bar = barTicks(meter);
  const line = [...cp].sort((a, b) => a.start - b.start);
  const cantus = [...cf].sort((a, b) => a.start - b.start);
  const clausule = clausuleFrom(cantus);

  const issues: Issue[] = [...parallelIssues(line, cantus, species)];
  const figures: SpeciesFigure[] = [];
  const intervals: number[] = [];

  for (const note of line) {
    const iv = intervalAt(cantus, note);
    if (iv !== null) intervals.push(iv);
  }

  if (species === 1) {
    // Note contre note : TOUT est consonant, sans exception.
    line.forEach(note => {
      const iv = intervalAt(cantus, note);
      if (iv !== null && !CONSONANT.has(iv)) {
        issues.push(issue('species1.dissonance', note.start, `dissonance (classe ${iv}) : la 1re espèce ne connaît que les consonances`));
      }
    });
  }

  if (species === 2 || species === 3) {
    // Appuis consonants ; les temps faibles ne dissonnent qu'en PASSANT.
    line.forEach((note, i) => {
      const iv = intervalAt(cantus, note);
      if (iv === null || CONSONANT.has(iv)) return;
      const strong = (note.start % bar) === 0;
      if (strong) {
        issues.push(issue(`species${species}.dissonance`, note.start, 'dissonance sur l\'appui : seuls les temps faibles peuvent dissoner'));
        return;
      }
      const kind = figureAt(line, i);
      if (kind === null) {
        issues.push(issue(`species${species}.dissonance`, note.start, 'dissonance de temps faible non conduite : ni passage, ni broderie, ni cambiata'));
        return;
      }
      figures.push({ kind, at: note.start });
    });
    // Les figures consonantes du catalogue sont aussi rapportées (3e espèce).
    if (species === 3) {
      line.forEach((note, i) => {
        if (figures.some(f => f.at === note.start)) return;
        const kind = figureAt(line, i);
        if (kind === 'cambiata') figures.push({ kind, at: note.start });
      });
    }
  }

  if (species === 4) {
    // Syncopes : le retard est le seul sujet. F-27 — une rupture tolérée hors
    // clausule ; à la clausule, la rupture est GRATUITE (la cadence délie).
    const { suspensions } = suspensionCheck([line, cantus], { meter });
    for (const s of suspensions) figures.push({ kind: 'suspension', at: s.at });

    let breaks = 0;
    for (let i = 0; i < line.length - 1; i++) {
      const note = line[i]!;
      const next = line[i + 1]!;
      if (note.start >= clausule) continue;
      const tied = next.start === note.start + note.duration && note.duration >= bar / 2;
      const suspended = suspensions.some(s => s.preparedAt === note.start);
      if (tied && suspended) continue;
      if (note.start === 0 && note.duration < bar) continue; // la levée inaugurale
      breaks++;
      figures.push({ kind: 'syncope-break', at: note.start });
    }
    if (breaks > MAX_SYNCOPE_BREAKS) {
      issues.push(issue('species4.syncope-break', line[0]?.start ?? 0, `${breaks} ruptures de syncope hors clausule : F-27 en tolère ${MAX_SYNCOPE_BREAKS}`));
    }
  }

  if (species === 5) {
    // Fleuri : le mélange EST le sujet. On exige seulement que les appuis
    // consonent et que chaque dissonance de temps faible soit conduite.
    line.forEach((note, i) => {
      const iv = intervalAt(cantus, note);
      if (iv === null || CONSONANT.has(iv)) return;
      const strong = (note.start % bar) === 0;
      const kind = figureAt(line, i);
      const suspended = suspensionCheck([line, cantus], { meter }).suspensions.some(s => s.at === note.start);
      if (strong && !suspended) {
        issues.push(issue('species5.dissonance', note.start, 'dissonance sur l\'appui sans préparation : le fleuri mélange les espèces, il ne les oublie pas'));
        return;
      }
      if (!strong && kind === null && !suspended) {
        issues.push(issue('species5.dissonance', note.start, 'dissonance de temps faible non conduite'));
        return;
      }
      if (kind) figures.push({ kind, at: note.start });
    });
  }

  const ficta = fictaIssues(line, cantus, opts);
  const contour = contourReport(line, cantus, opts);

  return {
    issues: [...issues, ...ficta.issues, ...contour.issues].sort((a, b) => (a.atTick ?? 0) - (b.atTick ?? 0)),
    intervals,
    figures: figures.sort((a, b) => a.at - b.at),
    ficta: ficta.ficta,
    climaxAt: contour.climaxAt,
    climaxPosition: contour.climaxPosition,
  };
}
