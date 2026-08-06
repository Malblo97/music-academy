/**
 * `scripts/tension-calibration.ts` — LE BANC D'ESSAI DE LA COURBE DE TENSION.
 *
 * Depuis la décision n°36, `climaxWindow` et `melody.climax` demandent à la
 * courbe de LOCALISER le sommet d'une pièce. Ce script mesure si elle en est
 * capable, contre la seule référence qui ne vienne pas du code : les sommets que
 * les `authorNotes` du corpus CHIFFRENT elles-mêmes.
 *
 *   pnpm -F @ma/music-core exec tsx scripts/tension-calibration.ts
 *   pnpm -F @ma/music-core exec tsx scripts/tension-calibration.ts --sweep
 *
 * Conclusion de la passe 12 (décision n°37) : la courbe de TENSION place le
 * sommet dans la cible 6 fois sur 11, et AUCUNE repondération de ses quatre
 * moteurs ne vaut son prix — la meilleure trouvée (8/11) ne gagne rien au verrou
 * et oblige à recalibrer `FLAT_TENSION_MAX_SPREAD`. Le banc a conclu que le
 * problème n'était pas le réglage mais le cumul de mandats de la courbe.
 *
 * Conclusion de la passe 13 (décision n°38) : la mesure DÉDIÉE qui en est sortie
 * — `climaxSalience`, deux termes, hauteur tenue et tenue — porte le banc à
 * **9/11 et 4,7 points d'erreur**, sans toucher à `tensionCurve`. Le banc mesure
 * désormais les deux, côte à côte : c'est la comparaison qui est la preuve.
 *
 *   pnpm -F @ma/music-core exec tsx scripts/tension-calibration.ts
 *   pnpm -F @ma/music-core exec tsx scripts/tension-calibration.ts --sweep
 */
import { climaxSalience, tensionCurve, climaxPlateau } from '../src/analyzers/tension.js';
import type { TensionOpts } from '../src/analyzers/tension.js';
import type { Note } from '../src/types.js';
import { notesOf } from '../src/pipeline/evaluate.js';
import { compileSolution, loadSolutions, specForSolution } from '../test/solutions.js';

/**
 * **LA VÉRITÉ TERRAIN** : ce que les `authorNotes` déclarent du sommet, en
 * fraction de la pièce. Douze solutions le chiffrent — « climax F5 à 62,5 % »,
 * « Sommet m11 (69 %) », « sommet à 56 % ». Comme le reste du corpus, ces
 * chiffres sont ANTÉRIEURS au moteur : c'est ce qui en fait une référence.
 *
 * `m02-s27-whistle-test` est écarté à dessein et le cas mérite d'être dit : ses
 * `authorNotes` annoncent « arche aplatie, sommet à 50-60 % », mais sa note la
 * plus aiguë (ré5) tombe à 9 % puis à 34 %, et rien — ni la hauteur ni la
 * tension — ne culmine au milieu. L'étiquette décrit une intention, pas un
 * événement mesurable. La garder fausserait le banc ; la taire serait pire.
 */
const DECLARED_SUMMITS: Record<string, [number, number]> = {
  'm01-s49-tension-arch': [0.625, 0.625],
  'm02-s08-fragment-drive': [0.625, 0.625],
  'm02-s10-peak-ladder': [0.79, 0.79],
  'm02-s20-sad-two-ways': [0.625, 0.625],
  'm02-s21-hero-theme': [0.625, 0.625],
  'm02-s23-romantic-surge': [0.625, 0.625],
  'm03-s14-the-roller': [0.56, 0.56],
  'm03-s17-the-arch-without-the-magnet-octatonique': [0.70, 0.70],
  'm03-s18-three-palettes-fonctionnel-etendu': [0.69, 0.75],
  'm03-s18-three-palettes-modal': [0.69, 0.69],
  'm03-s18-three-palettes-non-fonctionnel': [0.69, 0.69],
};

const cases = loadSolutions(['m01', 'm02', 'm03'])
  .filter(s => DECLARED_SUMMITS[s.file.replace('.json', '')])
  .map(s => ({ name: s.file.replace('.json', ''), notes: notesOf(compileSolution(s, specForSolution(s))) }));

/** Les deux courbes candidates à la question « où ça culmine ? ». */
type Measure = (notes: readonly Note[], opts: TensionOpts) => number[];
const TENSION: Measure = (notes, opts) => tensionCurve(notes, opts);
const SALIENCE: Measure = (notes, opts) => climaxSalience(notes, opts);

/** Combien de sommets déclarés le réglage retrouve, et à quelle distance. */
function score(opts: TensionOpts, verbose = false, measure: Measure = TENSION): { hits: number; err: number } {
  let hits = 0;
  let err = 0;
  for (const c of cases) {
    const [lo, hi] = DECLARED_SUMMITS[c.name]!;
    const range = climaxPlateau(measure(c.notes, opts));
    if (!range) continue;
    const hit = range[0] <= hi && range[1] >= lo;
    if (hit) hits++;
    err += Math.abs((range[0] + range[1]) / 2 - (lo + hi) / 2);
    if (verbose) {
      const shown = lo === hi ? `${(lo * 100).toFixed(0)} %` : `${(lo * 100).toFixed(0)}–${(hi * 100).toFixed(0)} %`;
      console.log(`   ${hit ? '✓' : '✗'} ${c.name.padEnd(48)} déclaré ${shown.padEnd(9)} · mesuré ${(range[0] * 100).toFixed(0)}–${(range[1] * 100).toFixed(0)} %`);
    }
  }
  return { hits, err: err / cases.length };
}

const report = (label: string, r: { hits: number; err: number }): void =>
  console.log(`   ${label.padEnd(52)} ${r.hits}/${cases.length}, erreur ${(r.err * 100).toFixed(1)} points`);

console.log('LA MESURE DÉDIÉE — climaxSalience (hauteur tenue 2 · tenue 1 · lissage 5)');
report('', score({}, true, SALIENCE));

console.log('\nLA COURBE DE TENSION sur la même question (pitch 2 · density 1 · dissonance 1 · surprise 0.5)');
console.log('   — ce que `climaxWindow` et `melody.climax` lisaient avant la décision n°38');
report('', score({}, true, TENSION));

if (process.argv.includes('--sweep')) {
  console.log('\nLISSAGE (poids inchangés) — 5 est déjà le meilleur, ce n\'est pas là que ça se joue');
  for (const smoothing of [1, 3, 5, 7, 9]) report(`lissage ${smoothing}`, score({ smoothing }));

  console.log('\nCHAQUE MOTEUR SEUL — la hauteur porte tout, la densité travaille contre');
  for (const term of ['pitch', 'density', 'dissonance', 'surprise'] as const) {
    report(`${term} seul`, score({ weights: { pitch: 0, density: 0, dissonance: 0, surprise: 0, [term]: 1 } }));
  }

  console.log('\nEN RETIRER UN');
  for (const term of ['pitch', 'density', 'dissonance', 'surprise'] as const) {
    report(`sans ${term}`, score({ weights: { [term]: 0 } }));
  }

  console.log('\nLE MEILLEUR TROUVÉ — et il ne vaut pas son prix (voir décision n°37)');
  report('pitch 4 · density 0.5 · dissonance 1 · surprise 0.25',
    score({ weights: { pitch: 4, density: 0.5, dissonance: 1, surprise: 0.25 } }));
}
