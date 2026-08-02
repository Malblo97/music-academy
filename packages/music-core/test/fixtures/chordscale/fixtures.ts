import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { chordScaleCheck } from '../../../src/analyzers/chordscale.js';
import { avoidDegrees, chordScaleOf } from '../../../src/data/chordScales.js';
import { swingReport, measureSwingRatio } from '../../../src/analyzers/swing.js';
import type { Vertical } from '../../../src/analyzers/idioms.js';
import type { Note, Part } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

/** Une seule verticalité Cmaj7 qui tient toute la fenêtre demandée. */
function cmaj7(notes: readonly Note[], bars = 1): Vertical[] {
  return [{
    from: 0,
    to: 1920 * bars,
    notes,
    chord: { root: 0, form: 'maj7', bass: 0, inversion: 0, pcs: [0, 4, 7, 11] },
  }];
}

/** m08-s05-the-walk : walking bass en noires — aucune croche à mesurer (F-44). */
const WALK =
  'F2:q A2:q C3:q B2:q | Bb2:q D3:q F3:q Gb3:q | F3:q Eb3:q D3:q Db3:q | ' +
  'C3:q Eb3:q F3:q A2:q';

export const fixtures: Fixture[] = [
  {
    name: 'avoid-degrees-are-derived',
    run: () => {
      // La règle générale, une seule fois : est note d'évitement le degré de la
      // gamme situé un demi-ton AU-DESSUS d'un son de l'accord. Sur Cmaj7
      // ionien, c'est le fa (au-dessus du mi) — et lui seul.
      expect(avoidDegrees(chordScaleOf('maj7')!)).toEqual([5]);
      // Sur un dorien de m7, aucun degré ne frotte : rien à éviter.
      expect(avoidDegrees(chordScaleOf('m7')!)).toEqual([]);
      // Le sus4 est BÂTI sur sa quarte : elle ne peut pas y être un évitement.
      expect(avoidDegrees(chordScaleOf('sus4')!)).toEqual([]);
    },
  },
  {
    name: 'avoid-4-lives-passing',
    run: () => {
      // Le fa sur Cmaj7, vie n°1 — PASSANT : temps faible, brève, quittée par
      // degré. C'est la seule des quatre que m08-s06 écrit.
      const notes = parseNotation('E4:q G4:e F4:e E4:q G4:q');
      expect(chordScaleCheck(notes, cmaj7(notes))).toEqual([]);
    },
  },
  {
    name: 'avoid-4-lives-posed-strong-beat',
    run: () => {
      // Vie n°2 — POSÉE sur temps fort. Même durée brève, même sortie par
      // degré : c'est l'appui métrique qui la condamne.
      const notes = parseNotation('E4:q D4:q F4:e E4:e G4:q');
      const issues = chordScaleCheck(notes, cmaj7(notes));
      expect(issues.map(i => i.ruleId)).toEqual(['jazz.avoid-note']);
      expect(issues[0]!.atTick).toBe(960); // le troisième temps
    },
  },
  {
    name: 'avoid-4-lives-posed-long',
    run: () => {
      // Vie n°3 — POSÉE par la DURÉE : une noire suffit à ce qu'on l'entende
      // s'installer, fût-ce sur un temps faible.
      const notes = parseNotation('E4:e G4:e F4:q E4:q G4:q');
      const issues = chordScaleCheck(notes, cmaj7(notes));
      expect(issues.map(i => i.ruleId)).toEqual(['jazz.avoid-note']);
      expect(issues[0]!.atTick).toBe(480);
    },
  },
  {
    name: 'avoid-4-lives-left-by-leap',
    run: () => {
      // Vie n°4 — QUITTÉE PAR SAUT : brève et sur un temps faible, mais on la
      // quitte en sautant, donc on l'a montrée.
      const notes = parseNotation('E4:q G4:e F4:e C5:q G4:q');
      const issues = chordScaleCheck(notes, cmaj7(notes));
      expect(issues.map(i => i.ruleId)).toEqual(['jazz.avoid-note']);
      expect(issues[0]!.atTick).toBe(720);
    },
  },
  {
    name: 'out-of-scale-flagged',
    run: () => {
      // Hors gamme et sans conduite : une issue.
      const notes = parseNotation('E4:q G4:q Ab4:q C5:q');
      const issues = chordScaleCheck(notes, cmaj7(notes));
      expect(issues.map(i => i.ruleId)).toEqual(['jazz.chord-scale']);
    },
  },
  {
    name: 'out-of-scale-conducted-chromatic-ok',
    run: () => {
      // La MÊME note étrangère, cette fois approchée et quittée d'un demi-ton
      // dans la même direction : le chromatisme MÈNE quelque part (m01-l22),
      // il n'est pas une faute de gamme.
      const notes = parseNotation('E4:q G4:e Ab4:e A4:q C5:q');
      expect(chordScaleCheck(notes, cmaj7(notes))).toEqual([]);
    },
  },
  {
    name: 'no-chord-no-verdict',
    run: () => {
      // Une verticalité sans chiffrage (pile quartale, cluster) ne relève pas
      // de la grammaire chord-scale : l'analyseur se tait au lieu d'inventer.
      const notes = parseNotation('E4:q F4:q Ab4:q B4:q');
      const quartal: Vertical[] = [{ from: 0, to: 1920, notes, chord: null }];
      expect(chordScaleCheck(notes, quartal)).toEqual([]);
    },
  },
  {
    name: 'walking-na-f44',
    run: () => {
      // m08-s05-the-walk : « la walking exige swingRatio ≈ 1 sur des NOIRES —
      // aucun contretemps, division par rien ». Le moteur répond `null`, pas 1.0
      // ni une erreur : la contrainte passe quand l'inégalité est absente.
      expect(measureSwingRatio(parseNotation(WALK))).toBeNull();
    },
  },
  {
    name: 'swing-per-part',
    run: () => {
      // F-44 par PARTIE : la basse marche pendant que le thème swingue. Un seul
      // chiffre pour tout l'ensemble mentirait sur les deux.
      const parts: Part[] = [
        { instrumentId: 'double-bass', notes: parseNotation(WALK) },
        { instrumentId: 'tenor-sax', notes: parseNotation('C4:e D4:e E4:e F4:e G4:e A4:e B4:e C5:e', { swingRatio: 2 }) },
      ];
      const report = swingReport(parts);
      expect(report[0]).toEqual({ partId: 'double-bass', ratio: null });
      expect(report[1]!.partId).toBe('tenor-sax');
      expect(report[1]!.ratio).toBeCloseTo(2, 1);
    },
  },
];
