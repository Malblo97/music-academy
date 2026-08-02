import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { densityMap, effectivePower, enduranceIssues, rangeIssues } from '../../../src/analyzers/orchestration.js';
import { ENDURANCE_BUDGET, INSTRUMENTS, instrument } from '../../../src/data/instruments.js';
import type { Part } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

const FF = 127;

function part(instrumentId: string, notation: string, extra: Partial<Part> = {}): Part {
  return { instrumentId, notes: parseNotation(notation), ...extra };
}

export const fixtures: Fixture[] = [
  {
    name: 'annexe-f-transcribed',
    run: () => {
      // Les onze lignes normatives de l'annexe F, vérifiées une à une contre la
      // table du Manuel. Ce test verrouille la transcription (règle §7.1).
      const expected: Record<string, [number, number, number, number, number]> = {
        // id → [range.from, range.to, pp, ff, agilité]
        'violin-1': [55, 95, 2, 7, 10],
        'violin-2': [55, 95, 2, 7, 10],
        viola: [48, 88, 2, 6, 8],
        cello: [36, 81, 2, 7, 8],
        'double-bass': [28, 55, 3, 7, 4],
        flute: [60, 96, 2, 5, 10],
        oboe: [58, 93, 3, 5, 7],
        clarinet: [50, 94, 1, 6, 9],
        trumpet: [52, 84, 3, 10, 7],
        'french-horn': [34, 77, 2, 9, 4],
        piano: [21, 108, 1, 9, 10],
      };
      for (const [id, [lo, hi, pp, ff, agility]] of Object.entries(expected)) {
        const inst = instrument(id);
        expect(inst, id).toBeDefined();
        expect(inst!.range, id).toEqual([lo, hi]);
        expect(inst!.dynamicPower, id).toEqual({ pp, ff });
        expect(inst!.agility, id).toBe(agility);
      }
      // Chaque entrée cite sa fiche (règle §7.1 : donnée et fiche vivent ensemble).
      expect(INSTRUMENTS.every(i => /^m05-l\d\d$/.test(i.lessonRef))).toBe(true);
    },
  },
  {
    name: 'new-fiches-v1',
    run: () => {
      // Les fiches V1 (décision n°27) : quelques valeurs-clés qui font le
      // caractère de chaque instrument, prises à leur §Carte d'identité.
      expect(instrument('piccolo')!.dynamicPower.ff).toBe(10); // « à égalité avec la trompette »
      expect(instrument('celesta')!.dynamicPower.ff).toBe(2); // « le plus faible de l'orchestre »
      expect(instrument('organ')!.sustain).toBe('infinite'); // le seul sans respiration
      expect(instrument('harp')!.sustain).toBe('decay'); // « la corde décroît »
      expect(instrument('contrabassoon')!.agility).toBe(2); // « le plus lent à parler »
      expect(instrument('alto-flute')!.dynamicPower.ff).toBe(3); // le pupitre mélodique le plus faible
      expect(instrument('bass-clarinet')!.range).toEqual([34, 79]);
      expect(instrument('marimba')!.range).toEqual([36, 96]);
      // 26 fiches, 28 entrées : `l02` porte les DEUX violons (« rôles inversés »)
      // et `l25` les quatre claviers de percussion ; `l01` (la palette) et `l26`
      // (les percussions orchestrales, non traitées à la hauteur) n'en portent
      // aucune. La table suit les instruments, pas la pagination du module.
      expect(INSTRUMENTS).toHaveLength(28);
    },
  },
  {
    name: 'flute-low-vs-high',
    run: () => {
      // « La puissance de la flûte CROÎT avec la hauteur — l'inverse d'aucune
      // intuition. » Grave ×0.4 (velouté et inaudible), suraigu ×1.6.
      const low = effectivePower('flute', 62, FF); // D4, dans le grave
      const high = effectivePower('flute', 94, FF); // B♭6, suraigu
      expect(high / low).toBeCloseTo(4, 5);
      expect(low).toBeLessThan(effectivePower('violin-1', 62, FF)); // inaudible sous les cordes
    },
  },
  {
    name: 'con-sord-065',
    run: () => {
      // F-40 : la sourdine est un MODIFICATEUR, pas un autre instrument dans les
      // données — ×0.65 sur la puissance, +1 au fondu.
      const open = effectivePower('violin-1', 70, FF);
      const muted = effectivePower('violin-1', 70, FF, 'con-sord');
      expect(muted / open).toBeCloseTo(0.65, 10);
      expect(instrument('violin-1')!.muteModifiers?.['con-sord']?.blend).toBe(1);
      // La trompette bouchée : « deux instruments dans un étui ».
      expect(effectivePower('trumpet', 70, FF, 'straight') / effectivePower('trumpet', 70, FF))
        .toBeCloseTo(0.5, 10);
    },
  },
  {
    name: 'out-of-range-is-silent',
    run: () => {
      // Hors tessiture, la puissance n'est pas « faible » : elle est nulle, et
      // `rangeIssues` le dit en toutes lettres.
      expect(effectivePower('flute', 50, FF)).toBe(0);
      const issues = rangeIssues(part('flute', 'D3:w'));
      expect(issues.map(i => i.ruleId)).toEqual(['orch.range']);
    },
  },
  {
    name: 'lips-high-budget',
    run: () => {
      // Annexe F : lips {12, aigu 4}. Six mesures de trompette dans l'aigu sans
      // respirer : l'issue tombe à la 5e mesure — là où le budget est épuisé.
      const trumpet = part('trumpet', 'G5:w | A5:w | G5:w | A5:w | G5:w | A5:w');
      const issues = enduranceIssues(trumpet);
      expect(issues.map(i => i.ruleId)).toEqual(['orch.endurance-lips']);
      expect(issues[0]!.atTick).toBe(ENDURANCE_BUDGET.lips.high * 1920);
      expect(issues[0]!.message).toContain('aigu');
    },
  },
  {
    name: 'lips-medium-budget-ok',
    run: () => {
      // Les mêmes six mesures au MÉDIUM : le budget est de 12, rien à signaler.
      expect(enduranceIssues(part('trumpet', 'G4:w | A4:w | G4:w | A4:w | G4:w | A4:w'))).toEqual([]);
    },
  },
  {
    name: 'endurance-recovers-on-rest',
    run: () => {
      // Une mesure de silence rend le souffle : deux plages de 4 mesures ne
      // s'additionnent pas.
      const flute = part('flute', 'C6:w | D6:w | C6:w | D6:w | r:w | C6:w | D6:w | C6:w | D6:w');
      expect(enduranceIssues(flute)).toEqual([]);
    },
  },
  {
    name: 'no-endurance-for-strings',
    run: () => {
      // L'archet en section ne respire pas : la question ne se pose pas.
      expect(enduranceIssues(part('violin-1', 'G4:w | A4:w | G4:w | A4:w | G4:w | A4:w | G4:w | A4:w | G4:w | A4:w | G4:w | A4:w | G4:w'))).toEqual([]);
      expect(enduranceIssues(part('organ', 'C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w | C4:w'))).toEqual([]);
    },
  },
  {
    name: 'density-tas',
    run: () => {
      // « LE TAS » : huit voix serrées au médium. Une seule bande porte tout le
      // monde — les timbres cessent de se distinguer.
      const window = { from: 0, to: 1920 };
      const chord = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
      const parts = chord.map((p, i) => part(i < 4 ? 'clarinet' : 'oboe', `${p}:w`));
      const map = densityMap(parts, window);
      const overloaded = map.filter(b => b.overloaded);
      expect(overloaded.map(b => b.label)).toEqual(['médium']);
      expect(overloaded[0]!.voices).toBe(7);
    },
  },
  {
    name: 'density-immeuble',
    run: () => {
      // « L'IMMEUBLE » : les mêmes huit voix, un étage chacune. Aucune bande ne
      // sature — c'est le même nombre d'instruments, et ce n'est plus le même son.
      const window = { from: 0, to: 1920 };
      const parts = [
        part('double-bass', 'E1:w'),
        part('cello', 'C2:w'),
        part('bassoon', 'G2:w'),
        part('viola', 'C3:w'),
        part('french-horn', 'G3:w'),
        part('clarinet', 'C4:w'),
        part('flute', 'G5:w'),
        part('piccolo', 'C7:w'),
      ];
      const map = densityMap(parts, window);
      expect(map.filter(b => b.overloaded)).toEqual([]);
      expect(map.filter(b => b.voices > 0).length).toBeGreaterThanOrEqual(5);
    },
  },
  {
    name: 'dyn-beats-velocity-f39',
    run: () => {
      // F-39 : quand la partie déclare une courbe `dyn[]`, elle PRIME sur la
      // vélocité des notes — c'est le troisième service du checker CC.
      const soft: Part = {
        instrumentId: 'trumpet',
        notes: [{ pitch: 67, start: 0, duration: 1920, velocity: 127 }],
        dyn: [{ tick: 0, value: 20 }],
      };
      const map = densityMap([soft], { from: 0, to: 1920 });
      const band = map.find(b => b.label === 'bas-médium')!;
      expect(band.power).toBeLessThan(effectivePower('trumpet', 67, 127));
    },
  },
];
