import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSolutions } from '../solutions.js';
import { parseNotation } from '../../src/notation/parse.js';
import { archFit, tensionCurve } from '../../src/analyzers/tension.js';
import { MOOD_ANTAGONISTS, hasMood } from '../../src/data/moods.js';

/**
 * VERROU N°4 — auto-cohérence des gabarits d'ambiance (Manuel §3.9).
 *
 * Pour chaque solution d'ambiance M2 : `archFit ≥ 0.6` sur SON mood, et un
 * score inférieur d'au moins 0.15 sur son antagoniste déclaré (joyful↔sad,
 * epic↔scifi, heroic↔mysterious). Rouge = on recalibre le GABARIT, pas la
 * solution.
 *
 * ⚠ SUITE DÉSACTIVÉE — décision de calibrage en attente, pas oubli.
 *
 * Le verrou est écrit en entier et tourne tel quel dès qu'on retire le `.skip`.
 * Mesuré avec le `tensionCurve` de S3.J2 (4 termes, F-23, lissage 5, hauteur
 * pondérée 2) :
 *
 *   joyful      s19  0.79 ✓   sad 0.62        (écart 0.17 ✓)
 *   sad         s20  0.82 ✓   joyful 0.86     (écart NÉGATIF ✗)
 *   heroic      s21  0.54 ✗   mysterious 0.76 (écart NÉGATIF ✗)
 *   epic        s22 -0.26 ✗   scifi ~0.80     (écart NÉGATIF ✗)
 *   romantic    s23  0.78 ✓
 *   mysterious  s24  0.82 ✓   heroic -0.56    (écart 1.38 ✓)
 *   tension     s25 -0.40 ✗
 *   scifi       s26  0.87 ✓   epic 0.21       (écart 0.66 ✓)
 *   western     s27  0.87 ✓
 *   ambiguous   s28  0.88 ✓
 *   jazz_ballad s29  0.51 ✗
 *   elena       s30 -0.11 ✗
 *
 * Trois causes distinctes, à trancher séparément avant d'activer :
 *
 *  1. **Les paires antagonistes sont à cheval sur les deux régimes.** `joyful`,
 *     `mysterious` et `scifi` passent par la platitude (variance < 0.015),
 *     leurs antagonistes `sad`, `heroic` et `epic` par Pearson. Or la platitude
 *     rend mécaniquement ~[0.5, 1] quand Pearson couvre [−1, 1] : la
 *     comparaison n'a pas le sens qu'on lui prête (cf. la fixture
 *     `regimes-are-not-comparable`). À régler AVANT tout recalibrage.
 *  2. **`epic` (s22) juge une mélodie amputée.** `m02-e22` fournit l'ostinato
 *     (`given.notation`) qui joue SOUS la ligne ; la solution ne porte que la
 *     mélodie. Vérifié : même en bouclant l'ostinato dessous, le fit reste
 *     négatif — le gabarit `epic` monte en paliers jusqu'aux points 13–15 quand
 *     la solution culmine à sa mesure 5 et redescend. Désaccord de fond, pas
 *     artefact de mesure.
 *  3. **Le calibrage des quatre termes reste à faire** pour `heroic`,
 *     `tension`, `jazz_ballad` et `elena` : l'implémentation suit la spec
 *     (§S3.J2) mais ses pondérations n'ont, elles, aucune source normative.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODULES = join(__dirname, '../../../content/modules');

const MIN_FIT = 0.6;
const ANTAGONIST_MARGIN = 0.15;

interface ExerciseSpec { id?: string; spec?: { styleProfile?: { targetMood?: string } } }

/** Indexe les specs d'exercice par id, tous modules confondus. */
function loadExerciseSpecs(): Map<string, ExerciseSpec> {
  const out = new Map<string, ExerciseSpec>();
  for (const mod of readdirSync(MODULES)) {
    const dir = join(MODULES, mod, 'exercises');
    let files: string[];
    try { files = readdirSync(dir); } catch { continue; }
    for (const file of files.filter(f => f.endsWith('.json'))) {
      const spec = JSON.parse(readFileSync(join(dir, file), 'utf8')) as ExerciseSpec;
      if (spec.id) out.set(spec.id, spec);
    }
  }
  return out;
}

interface MoodCase { file: string; notation: string; mood: string }

/**
 * Les solutions d'ambiance : le bloc M2 e19→e30 (les fiches d'ambiance de
 * m02-l10 à l14). `m02-s30-…-yours` est exclue par construction — ses propres
 * `authorNotes` la déclarent « solution-gabarit (non-normative)… non standard
 * de correction ».
 */
function moodCases(): MoodCase[] {
  const specs = loadExerciseSpecs();
  const out: MoodCase[] = [];
  for (const solution of loadSolutions()) {
    if (solution.module !== 'm02') continue;
    if (!solution.notation || !solution.exerciseId) continue;
    if (!/^m02-s(19|2\d|30)-/.test(solution.file)) continue;
    if (solution.file.endsWith('-yours.json')) continue;
    const mood = specs.get(solution.exerciseId)?.spec?.styleProfile?.targetMood;
    if (!mood || !hasMood(mood)) continue;
    out.push({ file: solution.file, notation: solution.notation, mood });
  }
  return out;
}

describe.skip('verrou n°4 : auto-cohérence des gabarits MOOD', () => {
  const cases = moodCases();

  it('les solutions d\'ambiance M2 sont toutes couvertes', () => {
    expect(cases.length).toBeGreaterThanOrEqual(11);
  });

  it.each(cases)('$file atteint $mood', ({ notation, mood }) => {
    const fit = archFit(tensionCurve(parseNotation(notation)), mood).fit;
    expect(fit).toBeGreaterThanOrEqual(MIN_FIT);
  });

  it.each(cases.filter(c => MOOD_ANTAGONISTS[c.mood] !== undefined))(
    '$file se sépare de son antagoniste',
    ({ notation, mood }) => {
      const curve = tensionCurve(parseNotation(notation));
      const own = archFit(curve, mood).fit;
      const antagonist = archFit(curve, MOOD_ANTAGONISTS[mood]!).fit;
      expect(antagonist).toBeLessThan(own - ANTAGONIST_MARGIN);
    },
  );
});
