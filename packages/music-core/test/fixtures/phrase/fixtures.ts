import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { phraseAnalysis } from '../../../src/analyzers/phrase.js';
import type { Meter } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

const METER: Meter = [4, 4];

/** m01-s29-first-period : antécédent → demi-cadence sur 2̂, conséquent → parfaite. */
const S29 =
  'B4:q. A4:e G4:q B4:q | C5:q. B4:e A4:q G4:q | A4:q. B4:e C5:q E5:q | D5:h A4:h | ' +
  'B4:q. A4:e G4:q B4:q | C5:q. B4:e A4:q C5:q | D5:q C5:q B4:q A4:q | G4:w';

/** m02-s12-elision-chain : « le D5 conclut la phrase 1 ET lance la 2 ». */
const S12 =
  'D4:q F4:q A4:q D5:q | C5:q A4:q F4:q A4:q | G4:q A4:q Bb4:q C5:q | D5:q C5:q Bb4:q A4:q | ' +
  'G4:q F4:q E4:q G4:q | F4:h r:h | A4:q G4:q E4:q C#4:q | D4:w';

/** m02-s06-three-sentences, 2e segment : dire, redire, précipiter-conclure. */
const S06_SEGMENT2 = 'B4:q. A4:e r:h | B4:q. A4:e r:h | C5:q. B4:e A4:q. G4:e | A4:q G4:q~ G4:q r:q';

export const fixtures: Fixture[] = [
  {
    name: 'boundary-rest',
    run: () => {
      // Le silence d'une noire suffit à faire respirer : deux phrases.
      const r = phraseAnalysis(parseNotation('C4:q D4:q E4:q r:q | G4:q F4:q E4:q D4:q'), METER);
      expect(r.boundaries).toEqual([{ at: 1920, kind: 'rest' }]);
      expect(r.phrases.map(p => [p.from, p.to])).toEqual([[0, 1920], [1920, 3840]]);
    },
  },
  {
    name: 'boundary-long-note',
    run: () => {
      // La note longue qui BOUCLE la mesure fait frontière ; la même valeur au
      // milieu d'une mesure n'est qu'une valeur d'écriture (cf. le ré blanche
      // de la mesure 4 de m01-s29, qui ne coupe rien).
      const r = phraseAnalysis(parseNotation(S29), METER);
      expect(r.boundaries).toEqual([{ at: 7680, kind: 'long-note' }]);
    },
  },
  {
    name: 'period-s29',
    run: () => {
      // m01-s29 : deux phrases de quatre mesures, l'antécédent SUSPENDU (il
      // s'arrête sur 2̂, pas sur la finale) et le conséquent CONCLUSIF.
      const r = phraseAnalysis(parseNotation(S29), METER);
      expect(r.structure).toBe('period');
      expect(r.phrases).toHaveLength(2);
      expect(r.phrases.map(p => p.to - p.from)).toEqual([7680, 7680]);
    },
  },
  {
    name: 'elision',
    run: () => {
      // m02-s12 : « soudure sans respiration, réattaque temps fort » — une seule
      // élision, celle de la mesure 4, et la vraie respiration de la mesure 6
      // reste une frontière ordinaire.
      const r = phraseAnalysis(parseNotation(S12), METER);
      expect(r.elisions).toEqual([5760]);
      expect(r.boundaries).toEqual([
        { at: 5760, kind: 'elision' },
        { at: 11520, kind: 'rest' },
      ]);
    },
  },
  {
    name: 'elision-negative-s29',
    run: () => {
      // Le contre-exemple : le ré du conséquent de m01-s29 est bien un sommet
      // sur temps fort sans silence — mais il n'est approché que par deux
      // degrés. Sans l'élan, pas d'élision : c'est un climax intérieur.
      const r = phraseAnalysis(parseNotation(S29), METER);
      expect(r.elisions).toEqual([]);
    },
  },
  {
    name: 'sentence-112',
    run: () => {
      // m02-s06, 2e segment : 1 + 1 + 2 mesures. Les deux énoncés courts sont
      // JUMEAUX (même tête) et la continuation vaut les deux — mesuré de seuil
      // à seuil, silences compris.
      const r = phraseAnalysis(parseNotation(S06_SEGMENT2), METER);
      expect(r.structure).toBe('sentence');
      // 1 + 1 + 2 mesures d'écriture ; la dernière portée s'arrête à la
      // dernière NOTE (le soupir final n'appartient à aucune phrase), d'où 1.75.
      expect(r.phrases.map(p => (p.to - p.from) / 1920)).toEqual([1, 1, 1.75]);
    },
  },
  {
    name: 'sentence-negative-different-heads',
    run: () => {
      // Même géométrie 1+1+2, mais le second énoncé ne redit pas le premier :
      // il n'y a plus de « dire-redire », donc plus de phrase-période.
      const r = phraseAnalysis(parseNotation('B4:q. A4:e r:h | C5:q. G4:e r:h | C5:q. B4:e A4:q. G4:e | A4:q G4:q~ G4:q r:q'), METER);
      expect(r.phrases.map(p => (p.to - p.from) / 1920)).toEqual([1, 1, 1.75]);
      expect(r.structure).toBeNull();
    },
  },
  {
    name: 'period-negative-antecedent-concludes',
    run: () => {
      // Deux phrases équilibrées, mais l'antécédent se pose DÉJÀ sur la finale :
      // rien n'est suspendu, rien n'appelle de réponse — ce n'est pas une période.
      const r = phraseAnalysis(parseNotation('C4:q D4:q E4:q r:q | E4:q D4:q C4:h | C4:q D4:q E4:q r:q | G4:q F4:q C4:h'), METER);
      expect(r.phrases.length).toBeGreaterThanOrEqual(2);
      expect(r.structure).toBeNull();
    },
  },
  {
    name: 'empty',
    run: () => {
      expect(phraseAnalysis([], METER)).toEqual({ phrases: [], boundaries: [], elisions: [], structure: null });
    },
  },
];
