import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHECKERS, MEASURED_KEYS } from '../../src/constraints/checkers/index.js';
import { CONSTRAINT_SCHEMA, validateConstraints } from '../../src/constraints/schema.js';
import { REGISTRY } from '../../src/rules/registry.js';

/**
 * VERROU N°1 — complétude des checkers de contraintes.
 *
 * Toute clé employée par une spec DOIT avoir un checker : une contrainte sans
 * vérification est pire qu'une contrainte absente, parce que l'auteur croit
 * qu'elle est tenue. L'inverse (un checker que personne n'emploie) n'est qu'un
 * avertissement — il servira au prochain module.
 *
 * Périmètre : **M1 + M2 + M5 + M9**, comme prescrit. Les autres modules
 * emploient ~300 clés de plus ; elles s'ajouteront au registre quand leur
 * verrou s'ouvrira.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODULES = join(__dirname, '../../../content/modules');
const SCOPE = ['module-01', 'module-02', 'module-05', 'module-09'];

interface Loaded {
  keys: Map<string, string[]>;
  blocks: { file: string; constraints: Record<string, unknown> }[];
}

function walk(node: unknown, file: string, into: Loaded): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item, file, into);
    return;
  }
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === 'constraints' && value && typeof value === 'object' && !Array.isArray(value)) {
      const constraints = value as Record<string, unknown>;
      into.blocks.push({ file, constraints });
      for (const used of Object.keys(constraints)) {
        const seen = into.keys.get(used) ?? [];
        if (!seen.includes(file)) seen.push(file);
        into.keys.set(used, seen);
      }
    }
    walk(value, file, into);
  }
}

function loadSpecs(): Loaded {
  const loaded: Loaded = { keys: new Map(), blocks: [] };
  for (const dir of readdirSync(MODULES)) {
    if (!SCOPE.some(prefix => dir.startsWith(prefix))) continue;
    const exercises = join(MODULES, dir, 'exercises');
    let files: string[];
    try { files = readdirSync(exercises); } catch { continue; }
    for (const file of files.filter(f => f.endsWith('.json'))) {
      walk(JSON.parse(readFileSync(join(exercises, file), 'utf8')), file, loaded);
    }
  }
  return loaded;
}

describe('verrou n°1 : chaque clé de contrainte a son checker', () => {
  const { keys: used, blocks } = loadSpecs();
  const implemented = new Set(Object.keys(CHECKERS));

  it("aucune clé employée n'est sans vérification", () => {
    const orphans = [...used.keys()].filter(k => !implemented.has(k)).sort();
    // Le message doit dire OÙ, sinon la correction prend une heure.
    const detail = orphans.map(k => `${k} (${used.get(k)!.slice(0, 2).join(', ')})`);
    expect(detail).toEqual([]);
  });

  it("le registre de l'annexe C couvre le périmètre", () => {
    expect([...used.keys()].filter(k => !(k in CONSTRAINT_SCHEMA)).sort()).toEqual([]);
  });

  it('toutes les specs du périmètre passent la validation de forme', () => {
    const errors = blocks.flatMap(b => validateConstraints(b.constraints).map(e => `${b.file} → ${e.message}`));
    expect(errors).toEqual([]);
  });

  it('rapporte la couverture (mesuré vs déclaratif)', () => {
    const usedKeys = [...used.keys()];
    const measured = usedKeys.filter(k => MEASURED_KEYS.includes(k));
    const declared = usedKeys.filter(k => !MEASURED_KEYS.includes(k)).sort();
    const unused = [...implemented].filter(k => !used.has(k)).sort();

    // Le tableau de bord de la semaine 4 : le verrou est vert dès que toute clé
    // a un checker, mais ce qui compte pour l'élève, c'est la part de MESURÉ.
    console.warn(`verrou n°1 — clés employées : ${usedKeys.length}`);
    console.warn(`  mesurées     : ${measured.length} (${Math.round((measured.length / usedKeys.length) * 100)} %)`);
    console.warn(`  déclaratives : ${declared.length}`);
    console.warn(`checkers orphelins : ${unused.join(', ') || 'aucun'}`);

    expect(usedKeys.length).toBeGreaterThan(150);
    expect(measured.length).toBeGreaterThan(40);
  });
});

describe('verrou n°1 : le registre des règles', () => {
  it("enregistre les familles de l'annexe B sans doublon", () => {
    const ids = [...REGISTRY.keys()];
    expect(new Set(ids).size).toBe(ids.length);
    for (const family of ['melody', 'harmony', 'vl', 'rhythm', 'orch', 'cp', 'sd', 'jazz']) {
      expect(ids.some(id => id.startsWith(`${family}.`)), family).toBe(true);
    }
    expect(ids.length).toBeGreaterThanOrEqual(45);
  });

  it('chaque règle porte son bloc pedagogy COMPLET', () => {
    for (const rule of REGISTRY.values()) {
      for (const field of ['why', 'how', 'when', 'commonMistake', 'alternative'] as const) {
        const text = rule.pedagogy[field];
        expect(text, `${rule.id}.${field}`).toBeTruthy();
        // Faute de pouvoir tester le TON automatiquement, on impose au moins
        // qu'aucun champ ne soit expédié en trois mots.
        expect(text.length, `${rule.id}.${field}`).toBeGreaterThan(40);
      }
      expect(rule.lessonRef, rule.id).toMatch(/^m\d\d-l\d\d$/);
      expect(rule.appliesTo.length, rule.id).toBeGreaterThan(0);
    }
  });
});
