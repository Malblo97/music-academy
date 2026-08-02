/**
 * Table accord → gamme (m08-l06, « la carte »). Une forme d'accord appelle une
 * gamme ; les notes de la gamme qui ne sont pas dans l'accord sont des
 * couleurs, sauf celles qui frottent — les AVOID NOTES.
 *
 * Les avoid notes ne sont pas listées à la main : elles se DÉDUISENT. Une note
 * de la gamme située un demi-ton AU-DESSUS d'un son de l'accord frotte contre
 * lui — c'est le fa sur Cmaj7 (un demi-ton au-dessus du mi). La règle est la
 * même partout, ce qui évite d'entretenir quinze listes qui divergeront.
 */
export interface ChordScale {
  /** Nom de la forme, tel que `data/chordForms.ts` la nomme. */
  form: string;
  scale: string;
  /** Intervalles de la gamme depuis la FONDAMENTALE de l'accord. */
  intervals: readonly number[];
  /** Sons de l'accord (mêmes intervalles que la forme) — servent au calcul des avoid. */
  chordTones: readonly number[];
  /** Exceptions explicites : degrés à ne PAS traiter en avoid malgré la règle. */
  allowed?: readonly number[];
}

export const CHORD_SCALES: readonly ChordScale[] = [
  { form: 'maj', scale: 'ionien', intervals: [0, 2, 4, 5, 7, 9, 11], chordTones: [0, 4, 7] },
  { form: 'maj7', scale: 'ionien', intervals: [0, 2, 4, 5, 7, 9, 11], chordTones: [0, 4, 7, 11] },
  { form: '6', scale: 'ionien', intervals: [0, 2, 4, 5, 7, 9, 11], chordTones: [0, 4, 7, 9] },
  { form: '7', scale: 'mixolydien', intervals: [0, 2, 4, 5, 7, 9, 10], chordTones: [0, 4, 7, 10] },
  { form: 'min', scale: 'dorien', intervals: [0, 2, 3, 5, 7, 9, 10], chordTones: [0, 3, 7] },
  { form: 'm7', scale: 'dorien', intervals: [0, 2, 3, 5, 7, 9, 10], chordTones: [0, 3, 7, 10] },
  { form: 'm6', scale: 'dorien', intervals: [0, 2, 3, 5, 7, 9, 10], chordTones: [0, 3, 7, 9] },
  { form: 'mMaj7', scale: 'mineur mélodique', intervals: [0, 2, 3, 5, 7, 9, 11], chordTones: [0, 3, 7, 11] },
  { form: 'm7b5', scale: 'locrien', intervals: [0, 1, 3, 5, 6, 8, 10], chordTones: [0, 3, 6, 10] },
  { form: 'dim', scale: 'diminuée ton-demi-ton', intervals: [0, 2, 3, 5, 6, 8, 9, 11], chordTones: [0, 3, 6] },
  { form: 'dim7', scale: 'diminuée ton-demi-ton', intervals: [0, 2, 3, 5, 6, 8, 9, 11], chordTones: [0, 3, 6, 9] },
  { form: 'aug', scale: 'tons entiers', intervals: [0, 2, 4, 6, 8, 10], chordTones: [0, 4, 8] },
  // Le sus4 EST bâti sur la quarte : elle ne peut pas y être une note d'évitement.
  { form: 'sus4', scale: 'mixolydien', intervals: [0, 2, 4, 5, 7, 9, 10], chordTones: [0, 5, 7], allowed: [5] },
  { form: 'sus2', scale: 'mixolydien', intervals: [0, 2, 4, 5, 7, 9, 10], chordTones: [0, 2, 7], allowed: [2] },
];

const BY_FORM = new Map(CHORD_SCALES.map(cs => [cs.form, cs]));

export function chordScaleOf(form: string): ChordScale | undefined {
  return BY_FORM.get(form);
}

/**
 * Les degrés d'évitement d'une forme : toute note de la gamme placée un
 * demi-ton au-dessus d'un son de l'accord, hors exceptions déclarées.
 */
export function avoidDegrees(cs: ChordScale): number[] {
  const tones = new Set(cs.chordTones);
  return cs.intervals.filter(deg =>
    !tones.has(deg) &&
    !(cs.allowed ?? []).includes(deg) &&
    tones.has(((deg - 1) % 12 + 12) % 12));
}
