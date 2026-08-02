import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { metricWeight, prosodyCorrelation, rhythmProfile } from '../../../src/analyzers/rhythm.js';
import type { Meter } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

const METER: Meter = [4, 4];

/** m01-s17-syncopation-lab : la grille reste audible sous les déplacements. */
const S17 =
  'C4:q. E4:e~ E4:e G4:e E4:q | A4:q. G4:e~ G4:e E4:e D4:q | ' +
  'C4:e E4:q. G4:q A4:q~ | A4:e G4:e~ G4:e C4:e~ C4:h~ | C4:e';

/** m02-s17-prosody-swap, volet déclamatoire : les longues sur les appuis. */
const S17_DECLAMATORY = 'G4:h. B4:e A4:e | G4:h D5:q. B4:e | A4:h. G4:e A4:e | B4:q G4:h.';

export const fixtures: Fixture[] = [
  {
    name: 'metric-weight',
    run: () => {
      // 3 = premier temps · 2 = temps 3 · 1 = temps 2 et 4 · 0 = hors temps.
      expect([0, 480, 960, 1440, 240, 1920].map(t => metricWeight(t, METER))).toEqual([3, 1, 2, 1, 0, 3]);
      // En 3/4 il n'y a pas de temps fort médian : aucun degré 2.
      expect([0, 480, 960].map(t => metricWeight(t, [3, 4]))).toEqual([3, 1, 1]);
    },
  },
  {
    name: 'density-and-entropy',
    run: () => {
      // Quatre noires par mesure : densité 4, entropie nulle (une seule valeur).
      const uniform = rhythmProfile(parseNotation('C4:q D4:q E4:q F4:q'), METER);
      expect(uniform.density).toBe(4);
      expect(uniform.durationEntropy).toBe(0);
      // Deux valeurs en parts ÉGALES : exactement un bit.
      const mixed = rhythmProfile(parseNotation('C4:h D4:q E4:q F4:h'), METER);
      expect(mixed.durationEntropy).toBeCloseTo(1, 10);
    },
  },
  {
    name: 'syncopation-332',
    run: () => {
      // La clave : trois attaques par mesure, aux croches 0, 3 et 6.
      const r = rhythmProfile(parseNotation('C4:q. D4:q. E4:q | C4:q. D4:q. E4:q'), METER);
      expect(r.asymmetries).toEqual([{ pattern: '3+3+2', at: 0 }, { pattern: '3+3+2', at: 1920 }]);
      expect(r.offBeatRatio).toBeCloseTo(1 / 3, 10); // la deuxième attaque de chaque mesure
    },
  },
  {
    name: 'syncopation-332-negative',
    run: () => {
      // Le même nombre d'attaques, scandées régulièrement : aucune asymétrie.
      const r = rhythmProfile(parseNotation('C4:q D4:q E4:h | C4:q D4:q E4:h'), METER);
      expect(r.asymmetries).toEqual([]);
    },
  },
  {
    name: 'syncopation-s17',
    run: () => {
      // Le cas réel. Les `authorNotes` comptent « 6/14 ≈ 0.43 » en nommant les
      // syncopes (dont le la TENU à travers la barre, qui n'est pas une attaque
      // hors temps) ; l'analyseur compte 7 attaques hors temps sur 14. Les deux
      // lectures tiennent dans l'intervalle [0.25, 0.5] de la consigne, mais
      // elles ne comptent pas la même chose — écart consigné, pas comblé.
      const r = rhythmProfile(parseNotation(S17), METER);
      expect(r.offBeatRatio).toBeCloseTo(0.5, 10);
      expect(r.offBeatRatio).toBeGreaterThanOrEqual(0.25);
      expect(r.offBeatRatio).toBeLessThanOrEqual(0.5);
      // La pondération distingue la croche « et » de la double égarée.
      expect(r.syncopationScore).toBeLessThan(r.offBeatRatio);
    },
  },
  {
    name: 'prosody-trochee',
    run: () => {
      // Trochée : long-bref, long-bref — les valeurs longues tombent sur les
      // appuis. Corrélation franchement positive.
      expect(prosodyCorrelation(parseNotation('C4:q. D4:e E4:q. F4:e | G4:q. F4:e E4:q. D4:e'), METER))
        .toBeGreaterThan(0.9);
    },
  },
  {
    name: 'prosody-declamatory-s17',
    run: () => {
      // m02-s17-prosody-swap, volet déclamatoire : « longues sur temps 1,
      // anacrouses croche ».
      expect(prosodyCorrelation(parseNotation(S17_DECLAMATORY), METER)).toBeGreaterThan(0.5);
    },
  },
  {
    name: 'prosody-inverted-swing',
    run: () => {
      // Le jazz déclame à l'envers : les valeurs longues fuient les appuis. En
      // lecture droite la corrélation est fortement NÉGATIVE — ce qui n'est pas
      // une faute de prosodie mais un autre système (m08-l01).
      const swing = parseNotation('C4:e D4:q~ D4:e E4:e F4:q~ F4:e | G4:e A4:q~ A4:e B4:e C5:q~ C5:e');
      expect(prosodyCorrelation(swing, METER)).toBeLessThan(-0.9);
      expect(prosodyCorrelation(swing, METER, { inverted: true })).toBeGreaterThan(0.9);
    },
  },
  {
    name: 'attacks-not-durations',
    run: () => {
      // Une ronde liée ne scande qu'une fois, si longtemps qu'elle dure : la
      // densité compte les ATTAQUES.
      expect(rhythmProfile(parseNotation('C4:w~ | C4:w'), METER).density).toBe(0.5);
    },
  },
  {
    name: 'empty',
    run: () => {
      const r = rhythmProfile([], METER);
      expect(r).toEqual({ density: 0, durationEntropy: 0, syncopationScore: 0, offBeatRatio: 0, asymmetries: [], prosodyCorrelation: 0 });
    },
  },
];
