import type { Meter } from './types.js';
import { barTicks } from './analyzers/rhythm.js';

/**
 * `meter.ts` — la métrique d'une spec, lue une fois pour toutes.
 *
 * Vit dans son propre module parce que les checkers ET le pipeline en ont
 * besoin : si le pipeline l'exportait, les checkers en dépendraient et le
 * pipeline dépendrait des checkers. Ce fichier casse le cycle.
 */

/** La métrique déclarée par la spec (`"6/8"` ou `[6, 8]`), 4/4 par défaut. */
export function meterOfSpec(spec: Record<string, unknown>, fallback: Meter = [4, 4]): Meter {
  const raw = spec.meter;
  if (typeof raw === 'string' && /^\d+\/\d+$/.test(raw)) {
    const [n, d] = raw.split('/').map(Number);
    return [n!, d!];
  }
  if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === 'number' && typeof raw[1] === 'number') {
    return [raw[0], raw[1]];
  }
  return fallback;
}

/**
 * **Le nombre de mesures d'une pièce**, compté AU PLUS PROCHE.
 *
 * L'empan brut (dernier tick / mesure) ne dit pas le nombre de mesures, et se
 * tromper là-dessus fait échouer une pièce sur douze du corpus :
 *
 *  - une mélodie qui finit sur une blanche au 3e temps de la mesure 8, sans
 *    silence écrit après, mesure 7,75 — c'est une pièce de HUIT mesures ;
 *  - une note liée par-dessus la dernière barre (m01-s17 : `C4:h~ | C4:e`)
 *    mesure 4,125 — c'est une pièce de QUATRE mesures, pas de cinq : la
 *    résonance n'ouvre pas une mesure ;
 *  - une levée décale tout l'empan d'une fraction (m02-s18) sans rien changer
 *    au compte.
 *
 * L'arrondi au plus proche traite les trois cas d'un coup, avec une tolérance
 * d'une demi-mesure. En dessous, la pièce est réellement plus courte que
 * demandé — et c'est alors un défaut de contenu, que le verrou doit signaler.
 */
export function barCount(notes: readonly { start: number; duration: number }[], meter: Meter): number {
  if (notes.length === 0) return 0;
  const span = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  return Math.round(span / barTicks(meter));
}
