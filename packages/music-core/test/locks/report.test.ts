import { describe, it, expect } from 'vitest';
import { evaluate } from '../../src/pipeline/evaluate.js';
import { changedRatio, sortIssues } from '../../src/pipeline/feedback.js';
import { IMPROVED_VERSION_MAX_CHANGE, MAX_ISSUES_SHOWN } from '../../src/pipeline/scoring.js';
import { compileSolution, loadSolutions, specOf } from '../solutions.js';
import type { WeightedIssue } from '../../src/pipeline/scoring.js';
import type { Note } from '../../src/types.js';

/**
 * **LE CONTRAT `FeedbackReport`** (Guide §1.4) — figé en snapshot.
 *
 * La Phase 2 construit l'API dessus et la Phase 3 l'affiche : à partir
 * d'aujourd'hui, toute évolution de cette forme casse deux couches en aval. Le
 * snapshot n'est pas là pour détecter les régressions de NOTE (c'est le rôle du
 * verrou n°2) mais de FORME — il doit être mis à jour sciemment, jamais par
 * réflexe.
 *
 * La pièce témoin est m03-e02 soumis avec sa solution s02 : une progression
 * napolitaine à quatre voix, exemple du Guide.
 */

describe('contrat FeedbackReport — snapshot de m03-e02', () => {
  const solution = loadSolutions(['m03']).find(s => s.exerciseId === 'm03-e02-solemn-shadow');
  const spec = specOf(solution?.exerciseId);
  const report = evaluate(compileSolution(solution!, spec), spec, { skipPerformance: true });

  it('rend la forme complète attendue par l\'API et le front', () => {
    expect(Object.keys(report).sort()).toEqual([
      'constraintResults', 'engineVer', 'hiddenIssueCount', 'improvedVersion',
      'issues', 'score', 'silencedRules', 'strengths', 'subscores',
    ]);
    expect(report.subscores).toHaveProperty('correctness');
    expect(report.subscores).toHaveProperty('constraints');
    expect(report.subscores).toHaveProperty('craft');
    for (const c of report.constraintResults) {
      expect(Object.keys(c)).toEqual(expect.arrayContaining(['key', 'pass', 'detail', 'mode']));
    }
  });

  it('fige le rapport de la pièce témoin', () => {
    expect(report).toMatchSnapshot();
  });
});

describe('contrat FeedbackReport — les règles d\'assemblage', () => {
  const issue = (ruleId: string, severity: WeightedIssue['severity'], weight: number, atTick: number): WeightedIssue =>
    ({ ruleId, severity, weight, atTick, message: ruleId });

  it('trie par sévérité, puis poids, puis position', () => {
    const sorted = sortIssues([
      issue('c', 'suggestion', 5, 0),
      issue('b', 'warning', 1, 100),
      issue('a', 'error', 0.1, 50),
      issue('d', 'warning', 2, 900),
    ]);
    expect(sorted.map(i => i.ruleId)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('plafonne les issues montrées et COMPTE les masquées', () => {
    const many = Array.from({ length: 10 }, (_, i) => issue('melody.leap-recovery', 'suggestion', 1, i * 100));
    expect(sortIssues(many).slice(0, MAX_ISSUES_SHOWN)).toHaveLength(MAX_ISSUES_SHOWN);
    // Le rapport réel : le compte des masquées est la différence, jamais zéro
    // par omission — on hiérarchise, on ne dissimule pas.
    expect(many.length - MAX_ISSUES_SHOWN).toBe(4);
  });

  it('mesure la part de notes touchées par une improvedVersion', () => {
    const original: Note[] = [
      { pitch: 60, start: 0, duration: 480 },
      { pitch: 62, start: 480, duration: 480 },
      { pitch: 64, start: 960, duration: 480 },
      { pitch: 65, start: 1440, duration: 480 },
    ];
    expect(changedRatio(original, original)).toBe(0);
    const oneChanged = [...original.slice(0, 3), { pitch: 67, start: 1440, duration: 480 }];
    expect(changedRatio(original, oneChanged)).toBeCloseTo(0.25);
    expect(changedRatio(original, oneChanged)).toBeLessThanOrEqual(IMPROVED_VERSION_MAX_CHANGE + 0.001);
    const recomposed = original.map(n => ({ ...n, pitch: n.pitch + 3 }));
    expect(changedRatio(original, recomposed)).toBeGreaterThan(IMPROVED_VERSION_MAX_CHANGE);
  });

  it('rend improvedVersion NULLE au MVP', () => {
    const s = loadSolutions(['m03']).find(x => x.exerciseId === 'm03-e02-solemn-shadow')!;
    const sp = specOf(s.exerciseId);
    expect(evaluate(compileSolution(s, sp), sp, { skipPerformance: true }).improvedVersion).toBeNull();
  });
});
