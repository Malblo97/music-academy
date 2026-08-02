import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { voiceLeadingIssues } from '../../../src/analyzers/voiceleading.js';
import type { VoiceLeadingCtx } from '../../../src/analyzers/voiceleading.js';
import type { IdiomTag } from '../../../src/analyzers/idioms.js';
import type { KeyEstimate } from '../../../src/analyzers/key.js';

export interface Fixture { name: string; run: () => void }

function key(tonic: number, mode: KeyEstimate['mode']): KeyEstimate {
  return { tonic, mode, confidence: 1, ambiguous: false, alternates: [], rawProfiles: [] };
}

function aug6(from: number, to: number): IdiomTag {
  return { id: 'aug6-ger', family: 'aug6', from, to, evidence: 'fixture' };
}

function planing(from: number, to: number): IdiomTag {
  return { id: 'planing-real', family: 'planing', from, to, evidence: 'fixture' };
}

/** m03-s03-the-wedge, mes. 9→10 : le Ger⁶ direct vers la demi-cadence. */
const WEDGE_9_10 = {
  bass: 'Eb2:w | D2:w',
  tenor: 'Bb3:w | A3:w',
  alto: 'C#4:w | D4:w',
  soprano: 'G4:w | F#4:w',
};

function ids(issues: readonly { ruleId: string }[]): string[] {
  return issues.map(i => i.ruleId);
}

export const fixtures: Fixture[] = [
  {
    name: 'parallel-fifths-basic',
    run: () => {
      // Deux voix, une quinte, la même direction : la faute de base.
      const issues = voiceLeadingIssues(
        [parseNotation('C5:w | D5:w'), parseNotation('F3:w | G3:w')],
        key(0, 'major'));
      expect(ids(issues)).toEqual(['vl.parallel-perfects']);
      expect(issues[0]!.severity).toBe('error');
    },
  },
  {
    name: 'contrary-arrival-ok',
    run: () => {
      // L'octave ATTEINTE par mouvement contraire : légal, et silencieux — on
      // ne félicite pas l'élève d'avoir respecté la règle.
      const issues = voiceLeadingIssues(
        [parseNotation('E4:w | D4:w'), parseNotation('Bb2:w | D3:w')],
        key(0, 'major'));
      expect(issues).toEqual([]);
    },
  },
  {
    name: 'direct-octave-cadential-ok',
    run: () => {
      // La fin de m03-s02-solemn-shadow : V→i, basse A2→D3 et soprano C♯5→D5.
      // Octave directe aux voix extrêmes — couverte par l'exception « soprano
      // par degré » en zone cadentielle (les `authorNotes` la nomment).
      const ctx: VoiceLeadingCtx = { cadences: [{ kind: 'perfect', at: 1920 }] };
      const issues = voiceLeadingIssues([
        parseNotation('A2:w | D3:w'),
        parseNotation('A3:w | A3:w'),
        parseNotation('E4:w | F4:w'),
        parseNotation('C#5:w | D5:w'),
      ], key(2, 'minor'), ctx);
      expect(issues).toEqual([]);
    },
  },
  {
    name: 'direct-octave-soprano-leaps-error',
    run: () => {
      // La même arrivée, soprano par SAUT : l'exception tombe.
      const issues = voiceLeadingIssues(
        [parseNotation('A2:w | D3:w'), parseNotation('F4:w | D5:w')],
        key(2, 'minor'), { cadences: [{ kind: 'perfect', at: 1920 }] });
      expect(ids(issues)).toContain('vl.direct-perfect');
    },
  },
  {
    name: 'mozart-tagged-info',
    run: () => {
      // **F-15.** m03-s03 mes. 9→10 : basse E♭2→D2 (♭6̂→5̂) et ténor B♭3→A3
      // (♭3̂→2̂) — deux quintes parallèles vieilles de deux siècles. Sous le tag
      // `aug6`, elles descendent en `info` et sont NOMMÉES, jamais fautives.
      const issues = voiceLeadingIssues([
        parseNotation(WEDGE_9_10.bass),
        parseNotation(WEDGE_9_10.tenor),
        parseNotation(WEDGE_9_10.alto),
        parseNotation(WEDGE_9_10.soprano),
      ], key(7, 'minor'), { idioms: [aug6(0, 1920)] });

      expect(ids(issues)).toEqual(['vl.mozart-fifths']);
      expect(issues[0]!.severity).toBe('info');
      expect(issues[0]!.message).toContain('Mozart');
    },
  },
  {
    name: 'mozart-untagged-error',
    run: () => {
      // Les MÊMES notes, sans le tag : l'idiome n'existe pas pour le moteur, et
      // les quintes redeviennent ce qu'elles sont — une erreur. C'est la paire
      // de fixtures qui prouve que le tag fait le verdict (F-15/F-16).
      const issues = voiceLeadingIssues([
        parseNotation(WEDGE_9_10.bass),
        parseNotation(WEDGE_9_10.tenor),
        parseNotation(WEDGE_9_10.alto),
        parseNotation(WEDGE_9_10.soprano),
      ], key(7, 'minor'));

      const parallels = issues.filter(i => i.ruleId === 'vl.parallel-perfects');
      expect(parallels).toHaveLength(1);
      expect(parallels[0]!.severity).toBe('error');
      expect(ids(issues)).not.toContain('vl.mozart-fifths');
    },
  },
  {
    name: 'frustrated-inner-ok',
    run: () => {
      // La sensible FRUSTRÉE : en voix interne, elle a le droit de descendre
      // chercher la quinte — sans quoi l'accord d'arrivée serait incomplet.
      // (Voix : basse, ténor porteur de la sensible, soprano.)
      const issues = voiceLeadingIssues([
        parseNotation('G3:w | C3:w'),
        parseNotation('B3:w | G3:w'),
        parseNotation('D5:w | E5:w'),
      ], key(0, 'major'));
      expect(ids(issues)).not.toContain('vl.leading-tone-resolution');
    },
  },
  {
    name: 'lt-unresolved-error',
    run: () => {
      // La même sensible, mais à la voix EXTRÊME (le soprano) : là, elle monte.
      const issues = voiceLeadingIssues([
        parseNotation('G2:w | C3:w'),
        parseNotation('B4:w | G4:w'),
      ], key(0, 'major'));
      const lt = issues.filter(i => i.ruleId === 'vl.leading-tone-resolution');
      expect(lt).toHaveLength(1);
      expect(lt[0]!.severity).toBe('error');
    },
  },
  {
    name: 'passing-lt-f1',
    run: () => {
      // **F-1.** La sensible DE PASSAGE à la basse : G–F♯–E, approchée par le
      // degré supérieur, quittée par l'inférieur, ligne conjointe, hors cadence.
      // Ce n'est pas une faute — c'est un chemin : `suggestion`, pas `error`.
      const issues = voiceLeadingIssues([
        parseNotation('G3:q F#3:q E3:q D3:q'),
        parseNotation('D5:q C5:q B4:q A4:q'),
      ], key(7, 'major'), { cadences: [{ kind: 'perfect', at: 19200 }] });
      const lt = issues.filter(i => i.ruleId === 'vl.leading-tone-resolution');
      expect(lt.map(i => i.severity)).toContain('suggestion');
      expect(lt.some(i => i.message.includes('F-1'))).toBe(true);
    },
  },
  {
    name: 'seventh-up-error',
    run: () => {
      // La 7e monte : erreur. (G7 → C, mais le fa grimpe au sol.)
      const issues = voiceLeadingIssues([
        parseNotation('G2:w | C3:w'),
        parseNotation('F4:w | G4:w'),
      ], key(0, 'major'));
      expect(ids(issues)).toContain('vl.seventh-resolution');
    },
  },
  {
    name: 'seventh-down-ok',
    run: () => {
      // La même 7e, qui descend : rien à dire.
      const issues = voiceLeadingIssues([
        parseNotation('G2:w | C3:w'),
        parseNotation('F4:w | E4:w'),
      ], key(0, 'major'));
      expect(ids(issues)).not.toContain('vl.seventh-resolution');
    },
  },
  {
    name: 'doubled-lt-error',
    run: () => {
      // Deux voix sur la sensible : elles ne peuvent pas monter toutes les deux
      // sur la même tonique.
      const issues = voiceLeadingIssues([
        parseNotation('G2:w | C3:w'),
        parseNotation('B3:w | C4:w'),
        parseNotation('B4:w | C5:w'),
      ], key(0, 'major'));
      expect(ids(issues)).toContain('vl.doubled-leading-tone');
    },
  },
  {
    name: 'spacing-tenth',
    run: () => {
      // Une dixième entre deux voix SUPÉRIEURES : au-delà de l'octave, le tissu
      // se déchire. (La basse, elle, a le droit de respirer.)
      const issues = voiceLeadingIssues([
        parseNotation('C2:w'),
        parseNotation('C4:w'),
        parseNotation('E5:w'),
      ], key(0, 'major'));
      expect(ids(issues)).toContain('vl.spacing');
    },
  },
  {
    name: 'planing-credited',
    run: () => {
      // Sous le tag `planing`, les parallèles sont le PROCÉDÉ : créditées en
      // `info` (la dette de §7.4, soldée en M3).
      const issues = voiceLeadingIssues([
        parseNotation('C4:q D4:q E4:q'),
        parseNotation('G4:q A4:q B4:q'),
      ], key(0, 'major'), { idioms: [planing(0, 1440)] });
      expect(issues.every(i => i.severity === 'info')).toBe(true);
      expect(issues.some(i => i.message.includes('planing'))).toBe(true);
    },
  },
];
