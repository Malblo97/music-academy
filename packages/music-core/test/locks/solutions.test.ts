import { describe, it, expect } from 'vitest';
import { evaluateDetailed } from '../../src/pipeline/evaluate.js';
import type { FeedbackReport } from '../../src/pipeline/feedback.js';
import { compileSolution, labelOf, loadSolutions, lockKindOf, specOf } from '../solutions.js';
import type { Solution } from '../solutions.js';

/**
 * **VERROU N°2 — LE VERROU-ROI (F-48, polymorphe).**
 *
 * Les 86 solutions de M1, M2 et M3 ont été écrites à la main et vérifiées une
 * par une AVANT que le moteur n'existe. Elles sont donc la seule chose du
 * projet que le code ne peut pas influencer : si le moteur les note mal, c'est
 * le moteur qui a tort. C'est tout l'intérêt d'un corpus antérieur au code, et
 * c'est pourquoi ce verrou passe avant tout le reste.
 *
 * **La règle du calibrage** : on ne baisse jamais le seuil pour faire passer
 * une pièce. Quand une solution est rouge, il y a trois diagnostics et un seul
 * est un patch de seuil — celui qui passe par une décision écrite au registre.
 */

const SCOPE = ['m01', 'm02', 'm03'];
const PASS_MARK = 85;

/** Le dump d'échec doit suffire à diagnostiquer sans relancer quoi que ce soit. */
function dump(label: string, report: FeedbackReport): string {
  const lines = [
    ``,
    `${label} — score ${report.score} (attendu ≥ ${PASS_MARK})`,
    `  sous-scores : correctness ${report.subscores.correctness} · contraintes ${report.subscores.constraints} · craft ${report.subscores.craft}`,
  ];
  if (report.issues.length > 0) {
    lines.push(`  issues (${report.issues.length} montrées, ${report.hiddenIssueCount} masquées) :`);
    for (const i of report.issues) {
      lines.push(`    [${i.severity} ×${i.weight}] ${i.ruleId} @${i.atTick ?? '—'} : ${i.message}`);
    }
  }
  const failed = report.constraintResults.filter(c => !c.pass);
  if (failed.length > 0) {
    lines.push(`  contraintes en échec :`);
    for (const c of failed) lines.push(`    ${c.key} (${c.mode}) : ${c.detail}`);
  }
  return lines.join('\n');
}

const solutions = loadSolutions(SCOPE);

describe('verrou n°2 : le corpus de référence', () => {
  it('charge les solutions du périmètre', () => {
    expect(solutions.length).toBeGreaterThan(0);
    // Chaque solution doit se rattacher à une spec : une orpheline est un bug
    // de contenu, pas un bug de moteur — et elle doit se voir immédiatement.
    const orphans = solutions.filter(s => {
      try { specOf(s.exerciseId); return false; } catch { return true; }
    }).map(labelOf);
    expect(orphans).toEqual([]);
  });
});

for (const mod of SCOPE) {
  const inModule = solutions.filter(s => s.module === mod);

  describe(`verrou n°2 — ${mod} (${inModule.length} solutions)`, () => {
    for (const s of inModule) {
      const spec = specOf(s.exerciseId);
      const kind = typeof spec.kind === 'string' ? spec.kind : 'INCONNU';
      const label = labelOf(s);

      it(`${label} — ${kind}`, () => {
        switch (lockKindOf(kind)) {
          case 'score': {
            // F-35 : une solution est une PARTITION, pas une exécution.
            const { report } = evaluateDetailed(compileSolution(s, spec), spec, { skipPerformance: true });
            expect(report.score, dump(label, report)).toBeGreaterThanOrEqual(PASS_MARK);
            const broken = report.constraintResults.filter(c => !c.performanceOnly && !c.pass);
            expect(broken.map(c => `${c.key} : ${c.detail}`), dump(label, report)).toEqual([]);
            break;
          }
          case 'proof':
          case 'checklist':
          case 'analysis':
            // Hors périmètre des semaines 5–6 : M10 (preuve) ouvre en S7,
            // M11 (concordance) en S8. Les marquer « passés » ici serait un
            // verrou creux ; ils n'ont simplement aucune solution dans M1–M3.
            throw new Error(`${label} : kind « ${kind} » hors périmètre du verrou n°2 (S5–S6)`);
        }
      });
    }
  });
}

/** Le tableau de bord : ce que le verrou a réellement exercé. */
describe('verrou n°2 : couverture', () => {
  it('rapporte la note de chaque module', () => {
    const rows: string[] = [];
    // Les textures à densité variable sont ÉVALUÉES (décision n°32) mais sans
    // les familles `vl.*`/`cp.*` : la couverture doit le dire, sinon le verrou
    // laisse croire que la conduite y a été regardée.
    const byVerticals: string[] = [];
    for (const mod of SCOPE) {
      const scores: number[] = [];
      for (const s of solutions.filter(x => x.module === mod)) {
        const spec = specOf(s.exerciseId);
        if (lockKindOf(typeof spec.kind === 'string' ? spec.kind : undefined) !== 'score') continue;
        const submission = compileSolution(s as Solution, spec);
        if (submission.kind === 'harmony') byVerticals.push(labelOf(s));
        scores.push(evaluateDetailed(submission, spec, { skipPerformance: true }).report.score);
      }
      const green = scores.filter(x => x >= PASS_MARK).length;
      const min = scores.length ? Math.min(...scores) : 0;
      const mean = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      rows.push(`${mod} : ${green}/${scores.length} verts · moyenne ${mean} · minimum ${min}`);
    }
    for (const r of rows) console.warn(`verrou n°2 — ${r}`);
    console.warn(`verrou n°2 — lues en verticalités, sans conduite de voix : ${byVerticals.length} pièces`);
    for (const o of byVerticals) console.warn(`  · ${o}`);
    expect(rows.length).toBe(SCOPE.length);
  });
});
