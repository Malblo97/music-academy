import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const TARGETS: Record<string, { lessons: number; specs: number; solutions: number; quizzes: number }> = {
  'module-01-fondamentaux':         { lessons: 25, specs: 49, solutions: 27, quizzes: 25 },
  'module-02-melodie':               { lessons: 15, specs: 30, solutions: 28, quizzes: 15 },
  'module-03-harmonie-avancee':      { lessons: 18, specs: 18, solutions: 31, quizzes: 18 },
  'module-04-contrepoint':           { lessons: 12, specs: 12, solutions: 25, quizzes: 12 },
  'module-05-instrumentation':       { lessons: 26, specs: 2,  solutions: 6,  quizzes: 26 },
  'module-06-sound-design':          { lessons: 15, specs: 15, solutions: 19, quizzes: 15 },
  'module-07-orchestration-avancee': { lessons: 10, specs: 10, solutions: 15, quizzes: 10 },
  'module-08-jazz':                  { lessons: 15, specs: 15, solutions: 22, quizzes: 15 },
  'module-09-genres':                { lessons: 4,  specs: 8,  solutions: 8,  quizzes: 4 },
  'module-10-cubase':                { lessons: 15, specs: 15, solutions: 15, quizzes: 15 },
  'module-11-analyse':               { lessons: 8,  specs: 8,  solutions: 8,  quizzes: 8 },
};
const ID_RE = /^m\d{2}-(l|e)\d{2}[a-z0-9-]*$/;
let errors = 0;
const err = (m: string) => { console.error('  ✗ ' + m); errors++; };
const list = (d: string) => existsSync(d) ? readdirSync(d).filter(f => !f.startsWith('_')) : [];

for (const [mod, t] of Object.entries(TARGETS)) {
  const base = join(ROOT, 'modules', mod);
  const lessons = list(join(base, 'lessons'));
  const specs   = list(join(base, 'exercises'));
  const quizzes = list(join(base, 'quizzes'));
  const mNN = mod.slice(7, 9);
  const sols = list(join(ROOT, 'solutions', 'm' + mNN));

  console.log(`\n${mod}`);
  const check = (label: string, got: number, want: number) =>
    got === want ? console.log(`  ✓ ${label}: ${got}/${want}`)
                 : err(`${label}: ${got}/${want}`);
  check('leçons', lessons.length, t.lessons);
  check('specs', specs.length, t.specs);
  check('solutions', sols.length, t.solutions);
  check('quiz', quizzes.length, t.quizzes);

  // IDs conformes + croisements
  const specIds = new Set(specs.map(f => JSON.parse(readFileSync(join(base,'exercises',f),'utf8')).id));
  for (const f of lessons) {
    const src = readFileSync(join(base, 'lessons', f), 'utf8');
    const id = /id:\s*(\S+)/.exec(src)?.[1] ?? '';
    if (!ID_RE.test(id)) err(`ID de leçon invalide: ${f} (${id})`);
    for (const ex of [...src.matchAll(/"(m\d{2}-e\d{2}[a-z0-9-]*)"/g)].map(m => m[1]))
      if (t.specs > 0 && !specIds.has(ex)) err(`footer de ${id} référence ${ex} : spec absente`);
  }
  for (const f of sols) {
    const s = JSON.parse(readFileSync(join(ROOT,'solutions','m'+mNN,f),'utf8'));
    if (!specIds.has(s.exerciseId)) err(`solution ${f} : exercice ${s.exerciseId} inconnu`);
    if (!s.notation && !s.payload) err(`solution ${f} : ni notation ni payload (F-33)`);
  }
  for (const f of quizzes) {
    const q = JSON.parse(readFileSync(join(base,'quizzes',f),'utf8'));
    if (!q.items?.length || q.items.some((i: any) => !i.why))
      err(`quiz ${f} : item sans why (charte règle 5)`);
  }
}
console.log(errors === 0 ? '\n✅ CONTENT COUNT: tout est vert.' : `\n❌ ${errors} erreur(s).`);
process.exit(errors === 0 ? 0 : 1);