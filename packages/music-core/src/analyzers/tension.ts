import type { Meter, Note, Part } from '../types.js';
import { MOOD_TEMPLATES, moodTemplate } from '../data/moods.js';
import { barTicks } from './rhythm.js';
import { detectCollection, collectionPcs } from './collection.js';
import type { Vertical } from './idioms.js';

/**
 * La courbe de tension : un point par DEMI-MESURE, quatre termes bruts, et
 * **F-23** — chaque terme est z-scoré SUR LA PIÈCE avant la somme pondérée.
 *
 * Sans F-23, les termes vivent sur des échelles étrangères (une hauteur MIDI
 * vaut 60, une densité vaut 4) : la somme n'est plus qu'un décalque du registre,
 * et une pièce octatonique dont la dissonance sature contre l'étalon diatonique
 * voit son arche s'aplatir. Normalisée dans sa propre palette, la même pièce
 * retrouve son arche — « le cluster n'est pas un accord sale, sa tension se
 * mesure chez lui » (m03-s17, solution-témoin).
 */
export type TensionTerm = 'pitch' | 'density' | 'dissonance' | 'surprise';

export interface TensionOpts {
  /** Défaut [4,4] : aucune solution M1–M3 ne déclare de mètre. */
  meter?: Meter;
  /**
   * F-23. Défaut `true`. Le passer à `false` sert à MONTRER le finding (la
   * fixture `octatonic-f23` compare les deux régimes) — jamais en production.
   */
  normalize?: boolean;
  weights?: Partial<Record<TensionTerm, number>>;
  /**
   * Lissage (nombre de fenêtres de la moyenne glissante). Une arche de tension
   * est une TENDANCE, pas une dentelle : sans lissage, la dentelle de surface
   * masque le geste que le gabarit décrit. Défaut 5 (deux mesures et demie).
   */
  smoothing?: number;
}

/** Pondération des quatre moteurs : la surprise pèse moins, elle est bruitée. */
const DEFAULT_WEIGHTS: Record<TensionTerm, number> = {
  pitch: 2,
  density: 1,
  dissonance: 1,
  surprise: 0.5,
};

/**
 * Les deux termes de la SAILLANCE DE CLIMAX — la mesure dédiée à la
 * localisation (décision n°38). Voir `climaxSalience`.
 */
export type SalienceTerm = 'pitch' | 'holding';

/**
 * Deux pour la hauteur, un pour la tenue. Le rapport est le seul réglage de la
 * mesure, et il est plat : de 0,3 à 0,6 de tenue pour une hauteur, le banc rend
 * 9/11 sans bouger. Ce n'est pas un poids ajusté au corpus, c'est un ordre de
 * grandeur — la hauteur décide, la tenue arbitre les ex æquo.
 */
const SALIENCE_WEIGHTS: Record<SalienceTerm, number> = {
  pitch: 2,
  holding: 1,
};

/** Intervalles « durs » comptés dans la dissonance : seconde mineure, triton, septième majeure. */
const HARD_INTERVALS = new Set([1, 6, 11]);

/**
 * En deçà de cette variance, Pearson est instable : régime platitude + altitude.
 * Le Manuel cite `mysterious` et `scifi` en exemples ; au seuil normatif de
 * 0.015 la règle couvre aussi `lullaby`, `joyful`, `western` et
 * `ambiguous_dark` — les quatre autres gabarits « sans vraie arche », pour
 * lesquels Pearson est tout aussi instable. Le seuil est donc pris à la lettre.
 */
const FLATNESS_VARIANCE = 0.015;

/** Lissage par défaut de la courbe : cinq demi-mesures. */
const DEFAULT_SMOOTHING = 5;

/** Part du sommet en deçà de laquelle on est sorti du plateau du climax. */
const CLIMAX_PLATEAU = 0.9;

/** Le gabarit fait 16 points ; la courbe y est rééchantillonnée. */
const TEMPLATE_POINTS = 16;

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

function isParts(input: readonly Note[] | readonly Part[]): input is readonly Part[] {
  const first = input[0];
  return first !== undefined && 'notes' in first;
}

function flatten(input: readonly Note[] | readonly Part[]): Note[] {
  return isParts(input) ? input.flatMap(p => [...p.notes]) : [...input];
}

function mean(values: readonly number[]): number {
  return values.length === 0 ? 0 : values.reduce((s, v) => s + v, 0) / values.length;
}

function variance(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  return mean(values.map(v => (v - m) ** 2));
}

function std(values: readonly number[]): number {
  return Math.sqrt(variance(values));
}

/** F-23 : z-score sur la pièce. Un terme constant devient nul (il n'informe pas). */
function zScore(values: readonly number[]): number[] {
  const m = mean(values);
  const s = std(values);
  return s === 0 ? values.map(() => 0) : values.map(v => (v - m) / s);
}

/** Moyenne glissante centrée. */
function smoothCurve(values: readonly number[], window: number): number[] {
  if (window <= 1) return [...values];
  const half = Math.floor(window / 2);
  return values.map((_, i) => mean(values.slice(Math.max(0, i - half), Math.min(values.length, i + half + 1))));
}

function minMax(values: readonly number[]): number[] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return hi === lo ? values.map(() => 0.5) : values.map(v => (v - lo) / (hi - lo));
}

function pearson(a: readonly number[], b: readonly number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i]! - ma;
    const y = b[i]! - mb;
    num += x * y; da += x * x; db += y * y;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

/** Rééchantillonnage linéaire à `points` valeurs. */
export function resample(curve: readonly number[], points = TEMPLATE_POINTS): number[] {
  if (curve.length === 0) return new Array<number>(points).fill(0);
  if (curve.length === 1) return new Array<number>(points).fill(curve[0]!);
  return Array.from({ length: points }, (_, i) => {
    const x = (i * (curve.length - 1)) / (points - 1);
    const lo = Math.floor(x);
    const hi = Math.min(lo + 1, curve.length - 1);
    return curve[lo]! + (curve[hi]! - curve[lo]!) * (x - lo);
  });
}

interface Window { from: number; to: number; sounding: Note[]; attacks: Note[] }

function windowsOf(notes: readonly Note[], meter: Meter): Window[] {
  const step = barTicks(meter) / 2; // un point par demi-mesure
  const end = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const out: Window[] = [];
  for (let from = 0; from < end; from += step) {
    const to = from + step;
    out.push({
      from,
      to,
      sounding: notes.filter(n => n.start < to && n.start + n.duration > from),
      attacks: notes.filter(n => n.start >= from && n.start < to),
    });
  }
  return out;
}

/**
 * Hauteur relative d'une fenêtre, pondérée par la DURÉE effectivement sonnée.
 * Un aigu de passage ne tend pas comme un aigu tenu : le sommet d'Elena est une
 * blanche pointée, l'aigu de sa mesure 3 une croche — sans pondération, les
 * deux pèsent pareil et l'arche se déplace.
 */
function weightedPitch(w: Window): number {
  let sum = 0;
  let total = 0;
  for (const n of w.sounding) {
    const dur = Math.min(n.start + n.duration, w.to) - Math.max(n.start, w.from);
    if (dur <= 0) continue;
    sum += n.pitch * dur;
    total += dur;
  }
  return total === 0 ? 0 : sum / total;
}

/** Dissonance d'une fenêtre : les pcs hors collection locale + les intervalles durs. */
function dissonanceOf(w: Window, collection: ReadonlySet<number>): number {
  let outside = 0;
  for (const n of w.sounding) if (!collection.has(pc(n.pitch))) outside++;

  let hard = 0;
  const pitches = [...new Set(w.sounding.map(n => n.pitch))].sort((a, b) => a - b);
  for (let i = 0; i < pitches.length; i++) {
    for (let j = i + 1; j < pitches.length; j++) {
      if (HARD_INTERVALS.has(pc(pitches[j]! - pitches[i]!))) hard++;
    }
  }
  return outside + hard;
}

/**
 * **La TENUE d'une fenêtre** : la durée moyenne des notes qui y sont ATTAQUÉES.
 *
 * C'est le terme de densité RETOURNÉ, dans l'unité que la musique lui donne. Le
 * banc de la passe 12 a mesuré que la densité travaille CONTRE le sommet : au
 * moment où la hauteur culmine, les attaques se raréfient. Compter les attaques
 * fait donc baisser la courbe précisément là où l'arrivée se produit. Mesurer
 * ce que ces attaques DURENT dit la même chose à l'endroit.
 *
 * Sans attaque, c'est une tenue qui TRAVERSE la fenêtre, et ce qui la mesure
 * est le temps que la fenêtre passe SONNÉE — pas sa largeur nominale. La
 * nuance n'est pas théorique : la dernière fenêtre d'une pièce est presque
 * toujours tronquée (`windowsOf` la coupe à la demi-mesure, pas à la dernière
 * note), et sa largeur nominale y créditait une tenue pleine à ce qui n'était
 * qu'un reste. Sur `m02-s29`, cela suffisait à placer le climax sur la
 * toute dernière croche. Une fenêtre entièrement silencieuse rend 0, ce qui est
 * la seule lecture juste : un silence ne tient rien.
 */
function holdingOf(w: Window): number {
  if (w.attacks.length > 0) return mean(w.attacks.map(n => n.duration));
  return Math.max(0, ...w.sounding.map(n => Math.min(n.start + n.duration, w.to) - Math.max(n.start, w.from)));
}

/** Surprise : ce que la fenêtre apporte que la précédente n'annonçait pas. */
function surpriseOf(w: Window, previous: Window | undefined): number {
  if (!previous) return 0;
  const before = new Set(previous.sounding.map(n => pc(n.pitch)));
  const now = new Set(w.sounding.map(n => pc(n.pitch)));
  let fresh = 0;
  for (const p of now) if (!before.has(p)) fresh++;
  const registerJump = Math.abs(mean(w.sounding.map(n => n.pitch)) - mean(previous.sounding.map(n => n.pitch)));
  return fresh + registerJump / 12;
}

/**
 * `tensionCurve(notes | parts, opts)` → un point 0–1 par demi-mesure.
 */
export function tensionCurve(input: readonly Note[] | readonly Part[], opts: TensionOpts = {}): number[] {
  return minMax(shapedTension(input, opts));
}

/**
 * **L'AMPLITUDE de la tension** — ce que `tensionCurve` jette en sortant.
 *
 * `minMax` ramène toute courbe non constante sur [0, 1] pile : une pièce qui
 * ne bouge presque pas et une pièce qui construit une arche entière en
 * ressortent avec la même étendue. C'est ce qu'on veut pour comparer des
 * FORMES (l'archFit compare des silhouettes), et c'est exactement ce qu'il ne
 * faut pas pour répondre à « cette courbe est-elle plate ? ». Le checker
 * `flatTension` posait la question à la courbe normalisée et n'a jamais pu
 * obtenir « oui » : les deux seules specs du corpus qui la déclarent
 * (m02-e24, m02-e26) échouaient toutes les deux, celle de m02-s26 pendant que
 * son `archFit` la créditait de 0,87 en régime PLATITUDE — le moteur se
 * contredisait d'un fichier à l'autre.
 *
 * L'écart-type rendu ici porte sur la somme pondérée de termes déjà réduits en
 * z-scores : il est sans unité et comparable d'une pièce à l'autre.
 */
export function tensionSpread(input: readonly Note[] | readonly Part[], opts: TensionOpts = {}): number {
  const shaped = shapedTension(input, opts);
  return shaped.length < 2 ? 0 : std(shaped);
}

function shapedTension(input: readonly Note[] | readonly Part[], opts: TensionOpts = {}): number[] {
  const meter = opts.meter ?? ([4, 4] as Meter);
  const normalize = opts.normalize ?? true;
  const weights = { ...DEFAULT_WEIGHTS, ...opts.weights };
  const notes = flatten(input);
  if (notes.length === 0) return [];

  const windows = windowsOf(notes, meter);
  if (windows.length === 0) return [];

  // F-23, première moitié : la dissonance se mesure contre la collection de LA
  // PIÈCE. Le régime dégradé (`normalize: false`) reprend l'étalon diatonique —
  // et alors, dans une pièce octatonique, TOUT est dissonant tout le temps : le
  // terme sature, n'informe plus, et l'arche s'aplatit. C'est le finding en acte.
  const detected = normalize ? detectCollection(notes) : null;
  const collection = new Set(detected
    ? collectionPcs(detected.family, detected.transposition)
    : collectionPcs('diatonic', 0));

  const raw: Record<TensionTerm, number[]> = {
    pitch: windows.map(weightedPitch),
    density: windows.map(w => w.attacks.length),
    dissonance: windows.map(w => dissonanceOf(w, collection)),
    surprise: windows.map((w, i) => surpriseOf(w, windows[i - 1])),
  };

  const terms = (Object.keys(raw) as TensionTerm[]).map(term => {
    const series = normalize ? zScore(raw[term]) : raw[term];
    return series.map(v => v * weights[term]);
  });

  const summed = windows.map((_, i) => terms.reduce((s, t) => s + t[i]!, 0));
  return smoothCurve(summed, opts.smoothing ?? DEFAULT_SMOOTHING);
}

export interface ArchFitResult {
  fit: number;
  regime: 'pearson' | 'flatness';
}

/**
 * `archFit(curve, moodId)` — l'accord entre ce que la pièce fait et ce que son
 * ambiance promet. Sur les gabarits à faible variance (mysterious, scifi),
 * Pearson est instable : on note alors la PLATITUDE et l'ALTITUDE, 50/50.
 */
export function archFit(curve: readonly number[], moodId: string): ArchFitResult {
  const template = moodTemplate(moodId);
  const sampled = resample(curve, template.length);

  if (variance(template) < FLATNESS_VARIANCE) {
    const flatness = Math.abs(std(sampled) - std(template));
    const altitude = Math.abs(mean(sampled) - mean(template));
    const fit = 0.5 * (1 - Math.min(1, flatness)) + 0.5 * (1 - Math.min(1, altitude));
    return { fit, regime: 'flatness' };
  }
  return { fit: pearson(sampled, template), regime: 'pearson' };
}

/**
 * **OÙ LA PIÈCE CULMINE — la mesure DÉDIÉE à la localisation** (décision n°38).
 * Un point 0–1 par demi-mesure, comme `tensionCurve`, et lue par les seuls
 * consommateurs qui posent la question « OÙ ? » : `climaxWindow`,
 * `melody.climax`, `melody.tension-placement`.
 *
 * Le climax n'est pas la note la plus aiguë. Sur une mélodie seule les deux
 * coïncident presque toujours, mais dès qu'il y a une texture, elles divorcent,
 * et c'est la tension qui a raison : `m03-s18 [fonctionnel-etendu]` place son
 * ré5 aux mesures 9–10 et son VRAI sommet à la sixte augmentée de la mesure 11.
 * C'était la décision n°36, et elle tient. Ce qu'elle avait de trop court, la
 * passe 12 l'a chiffré : la courbe de tension, à qui l'on demandait DEPUIS
 * cette décision de localiser un point, ne retrouvait que 6 des 11 sommets que
 * le corpus chiffre lui-même, à 11 points de distance moyenne.
 *
 * La cause n'était pas un réglage mais un CUMUL DE MANDATS. `archFit` compare
 * une silhouette à un gabarit, `flatTension` mesure une amplitude, la
 * localisation cherche un point : les quatre moteurs de la tension servent bien
 * les deux premiers et brouillent le troisième. Chaque repondération de la
 * courbe gagnait sur l'un en perdant sur l'autre — d'où une mesure séparée,
 * dérivée de la même matière (mêmes fenêtres, même z-score F-23) mais pondérée
 * pour sa seule tâche, qui laisse `archFit` et `flatTension` sur la courbe
 * qu'ils ont toujours lue.
 *
 * DEUX termes, tous deux mesurés sur le banc (`scripts/tension-calibration.ts`) :
 *  - **la hauteur tenue** — elle porte tout le signal ; seule, elle fait déjà
 *    mieux que les quatre moteurs réunis (6/11 à 7,7 contre 6/11 à 11,0) ;
 *  - **la tenue** — la densité retournée dans son unité musicale (`holdingOf`),
 *    parce que l'arrivée se TIENT.
 *
 * Dissonance et surprise en sont ABSENTES, mesurées et écartées : ajoutées à
 * ces deux-là, elles ne gagnent rien (dissonance 0,25 → 9/11 mais l'erreur
 * remonte) ou dégradent. Elles restent dans `tensionCurve`, où elles ont leur
 * place.
 *
 * **Résultat sur le banc : 9/11, 4,7 points d'erreur moyenne** — contre 6/11 et
 * 11,0 pour la courbe de tension sur la même question.
 */
export function climaxSalience(input: readonly Note[] | readonly Part[], opts: TensionOpts = {}): number[] {
  const meter = opts.meter ?? ([4, 4] as Meter);
  const notes = flatten(input);
  if (notes.length === 0) return [];
  const windows = windowsOf(notes, meter);
  if (windows.length === 0) return [];

  const weights = SALIENCE_WEIGHTS;
  const pitch = zScore(windows.map(weightedPitch)).map(v => v * weights.pitch);
  const holding = zScore(windows.map(holdingOf)).map(v => v * weights.holding);
  const summed = windows.map((_, i) => pitch[i]! + holding[i]!);
  return minMax(smoothCurve(summed, opts.smoothing ?? DEFAULT_SMOOTHING));
}

/**
 * **Le climax est une RÉGION, pas un point.** La courbe a la résolution d'une
 * demi-mesure et ses sommets sont des plateaux : sur `m03-s18 [modal]`, la
 * saillance tient son maximum des mesures 9 à 11 — l'auteur écrit « Sommet
 * m11 », l'argmax brut tombe sur la 10ᵉ, et les deux désignent le même plateau.
 * Réduire cela à un index puis le comparer à une borne dure fabrique des échecs
 * qui ne disent rien de la musique : on prétendrait une précision que la mesure
 * n'a pas.
 *
 * La région rendue est la plus longue plage CONTIGUË où la courbe se tient à au
 * moins `CLIMAX_PLATEAU` de son sommet, celle qui contient l'argmax. Bornes en
 * fraction de la durée totale. La fonction est agnostique de la courbe qu'on
 * lui donne ; depuis la décision n°38, ses appelants lui donnent tous
 * `climaxSalience`.
 */
export function climaxPlateau(curve: readonly number[]): [number, number] | null {
  if (curve.length < 2) return null;
  const peak = Math.max(...curve);
  const floor = peak - (peak - Math.min(...curve)) * (1 - CLIMAX_PLATEAU);
  let argmax = 0;
  for (let i = 0; i < curve.length; i++) if (curve[i]! > curve[argmax]!) argmax = i;
  let from = argmax;
  let to = argmax;
  while (from > 0 && curve[from - 1]! >= floor) from--;
  while (to < curve.length - 1 && curve[to + 1]! >= floor) to++;
  return [from / curve.length, (to + 1) / curve.length];
}

/**
 * **La fenêtre de climax PROMISE par une ambiance**, dérivée de son propre
 * gabarit — ou `null` quand l'ambiance ne promet aucune arche.
 *
 * Chaque gabarit place son sommet où il veut : la berceuse au milieu (47 %),
 * le triste aux deux tiers (67 %), l'épique très tard (87–93 %). Leur imposer à
 * tous la même fenêtre [55–85 %] revient à juger chaque ambiance contre une
 * autre. Et deux cas rendent `null` :
 *
 *  - **l'ambiance est inconnue du registre** — les specs de M3 emploient
 *    `targetMood` comme une étiquette d'atmosphère (`weightless`, `dread`,
 *    `modal-world`, `the-roller`), pas comme une clé de gabarit : rien n'y
 *    promet une arche, et `moodTemplate` rendrait le gabarit `default` par
 *    défaut, c'est-à-dire une promesse que personne n'a faite ;
 *  - **le gabarit est PLAT** (mysterious, scifi) — une courbe volontairement
 *    sans relief n'a pas de sommet à placer. C'est le même seuil de variance
 *    que celui qui fait basculer `archFit` en régime de platitude.
 */
export function expectedClimaxWindow(moodId: string, tolerance = 0.2): [number, number] | null {
  if (!(moodId in MOOD_TEMPLATES)) return null;
  const template = moodTemplate(moodId);
  if (variance(template) < FLATNESS_VARIANCE) return null;
  const peak = template.indexOf(Math.max(...template)) / (template.length - 1);
  return [Math.max(0, peak - tolerance), Math.min(1, peak + tolerance)];
}

/**
 * `tensionHarmonyCoupling` (jazz_ballad) — « le climax sur la 9, pas sur la
 * tonique ». Corrélation entre la courbe et la présence d'une TENSION posée
 * (9/11/13) sur la verticalité qui sonne au même moment.
 */
export function tensionHarmonyCoupling(
  curve: readonly number[],
  verticals: readonly Vertical[],
  opts: { meter?: Meter } = {},
): number {
  if (curve.length === 0 || verticals.length === 0) return 0;
  const step = barTicks(opts.meter ?? ([4, 4] as Meter)) / 2;
  const extensions = [2, 5, 9]; // 9e, 11e, 13e au-dessus de la fondamentale

  const exposure = curve.map((_, i) => {
    const from = i * step;
    const to = from + step;
    const active = verticals.filter(v => v.from < to && v.to > from);
    let found = 0;
    for (const v of active) {
      const pitches = v.notes.map(n => n.pitch);
      if (pitches.length === 0) continue;
      const root = v.chord ? v.chord.root : pc(Math.min(...pitches));
      if (pitches.some(p => extensions.includes(pc(p - root)))) found++;
    }
    return found;
  });
  return pearson(curve, exposure);
}
