/**
 * `scripts/lock2.ts` — le tableau de bord de la remontée.
 *
 * Le verrou lui-même (`test/locks/solutions.test.ts`) est fait pour ÉCHOUER
 * lisiblement, une pièce à la fois. Pendant la remontée, on a besoin de l'autre
 * vue : les 88 solutions d'un coup, triées, avec ce qui les bloque — pour voir
 * si un correctif en débloque douze ou en casse trois.
 *
 *   pnpm -F @ma/music-core exec tsx scripts/lock2.ts            → les rouges
 *   pnpm -F @ma/music-core exec tsx scripts/lock2.ts --all      → tout le corpus
 *   pnpm -F @ma/music-core exec tsx scripts/lock2.ts --by-cause → par blocage
 */
import { evaluateDetailed } from '../src/pipeline/evaluate.js';
import { compileSolution, labelOf, loadSolutions, lockKindOf, specForSolution } from '../test/solutions.js';

const SCOPE = ['m01', 'm02', 'm03'];
const PASS_MARK = 85;

const args = new Set(process.argv.slice(2));
const showAll = args.has('--all');
const byCause = args.has('--by-cause');

interface Row {
  label: string; module: string; kind: string; score: number;
  correctness: number; constraints: number; craft: number;
  issues: string[]; broken: string[]; green: boolean;
}

const rows: Row[] = [];
for (const s of loadSolutions(SCOPE)) {
  const spec = specForSolution(s);
  const kind = typeof spec.kind === 'string' ? spec.kind : 'INCONNU';
  if (lockKindOf(kind) !== 'score') continue;
  const submission = compileSolution(s, spec);
  const { report } = evaluateDetailed(submission, spec, { skipPerformance: true });
  const broken = report.constraintResults.filter(c => !c.performanceOnly && !c.pass);
  rows.push({
    label: labelOf(s),
    module: s.module,
    kind: submission.kind,
    score: report.score,
    correctness: report.subscores.correctness,
    constraints: report.subscores.constraints,
    craft: report.subscores.craft,
    issues: report.issues.map(i => `${i.ruleId}@${i.atTick ?? '—'}`),
    broken: broken.map(c => `${c.key} : ${c.detail}`),
    // Décision n°11 : un gabarit de sous-partie ouverte ne vise pas la note.
    green: (report.score >= PASS_MARK || spec.userBrief === true) && broken.length === 0,
  });
}

if (byCause) {
  const tally = new Map<string, string[]>();
  for (const r of rows.filter(x => !x.green)) {
    for (const i of new Set(r.issues.map(x => x.split('@')[0]!))) {
      tally.set(`règle ${i}`, [...(tally.get(`règle ${i}`) ?? []), r.label]);
    }
    for (const c of new Set(r.broken.map(x => x.split(' : ')[0]!))) {
      tally.set(`contrainte ${c}`, [...(tally.get(`contrainte ${c}`) ?? []), r.label]);
    }
  }
  for (const [cause, who] of [...tally].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`${String(who.length).padStart(3)}  ${cause}`);
    console.log(`     ${who.join(', ')}`);
  }
} else {
  for (const r of rows) {
    if (r.green && !showAll) continue;
    const mark = r.green ? '✓' : '✗';
    console.log(`${mark} ${r.label.padEnd(42)} ${String(r.score).padStart(3)}  [c ${r.correctness} · k ${r.constraints} · cr ${r.craft}] ${r.kind}`);
    for (const i of r.issues) console.log(`      · ${i}`);
    for (const c of r.broken) console.log(`      ! ${c}`);
  }
}

for (const mod of SCOPE) {
  const inModule = rows.filter(r => r.module === mod);
  console.log(`${mod} : ${inModule.filter(r => r.green).length}/${inModule.length} verts`);
}
console.log(`TOTAL : ${rows.filter(r => r.green).length}/${rows.length} verts`);
