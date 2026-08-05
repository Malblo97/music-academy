import type { Issue } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { ruleIssue } from './types.js';
import { functionOf } from '../analyzers/cadence.js';

/** Part maximale d'accords chromatiques non expliqués. */
const CHROMATIC_TOLERANCE = 0.25;

/**
 * **Les septièmes qui OBLIGENT : celles qui portent un triton.**
 *
 * `/7/` attrapait aussi `maj7`, `m7` et `mMaj7` — or la septième majeure d'un
 * Imaj7 ou d'un IVmaj7 est une COULEUR de repos, pas une question : elle ne
 * demande rien. C'est bien ce que dit la `pedagogy` de la règle (« la quarte
 * au-dessus, ou le demi-ton en dessous ») : elle décrit la septième de
 * dominante. Le triton est le critère exact — `7`, `m7♭5` et `dim7` le portent,
 * `maj7`, `m7`, `mMaj7`, `6` et `m6` non.
 */
const TENSION_SEVENTHS = new Set(['7', 'm7b5', 'dim7']);

/** Les septièmes de SENSIBLE, qui résolvent en montant d'un demi-ton (vii°7 → I). */
const LEADING_SEVENTHS = new Set(['m7b5', 'dim7']);

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

function tagged(ctx: RuleCtx, tick: number): boolean {
  return (ctx.analysis.idioms ?? []).some(t => tick >= t.from && tick < t.to);
}

/**
 * La consigne déclare-t-elle une BOUCLE ? Le corpus la nomme toujours par une
 * contrainte dédiée — `loopTours`, `maxLoopChords`, `loopReturnChord`,
 * `loopBarsLength`… On teste donc le nom de la clé plutôt qu'une liste fermée,
 * qui rouillerait au premier ajout du contenu.
 */
function declaresLoop(spec: RuleCtx['spec']): boolean {
  return Object.keys(spec.constraints ?? {}).some(k => /loop/i.test(k));
}

export const HARMONY_RULES: Rule[] = [
  {
    id: 'harmony.loop-coherence',
    severity: 'warning',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm09-l02',
    detect: (ctx: RuleCtx): Issue[] => {
      // Une couture n'existe que sur une grille qui BOUCLE — c'est ce que dit
      // le `when` de cette règle, et la lettre du code disait autre chose : la
      // distance du dernier accord au premier était mesurée sur TOUTE
      // progression. Une période classique qui finit sur sa parfaite ne
      // repasse jamais par son premier accord ; lui reprocher l'écart entre son
      // do final et son sol initial, c'est juger un raccord qui n'existe pas.
      if (!declaresLoop(ctx.spec)) return [];
      const chords = ctx.analysis.chords ?? [];
      if (chords.length < 3) return [];
      const first = chords[0]!;
      const last = chords[chords.length - 1]!;
      // La couture : le retour au premier accord doit coûter aussi peu que les
      // autres liaisons de la boucle. Sinon on entend le raccord.
      const moves = chords.slice(1).map((c, i) => Math.abs(pc(c.chord.root - chords[i]!.chord.root)));
      const seam = Math.abs(pc(first.chord.root - last.chord.root));
      const average = moves.reduce((s, v) => s + v, 0) / moves.length;
      if (seam <= average + 2) return [];
      return [ruleIssue({ id: 'harmony.loop-coherence', severity: 'warning', lessonRef: 'm09-l02' }, last.from,
        'la couture de la boucle s\'entend : le retour au premier accord saute plus loin que tous les autres enchaînements')];
    },
    pedagogy: {
      why: "Une boucle qu'on entend boucler cesse d'être un décor et devient un tic. Le raccord doit coûter aussi peu à l'oreille que le reste du tour.",
      how: "Choisis ton dernier accord pour ce qu'il fait au PREMIER, pas pour ce qu'il conclut. Une note commune, un demi-ton de basse, et la couture disparaît.",
      when: "Sur toute grille bouclée : jeu vidéo, néo-noir, tapis de scène. Une progression qui ne boucle pas n'a pas de couture à cacher.",
      commonMistake: "Composer les quatre mesures dans l'ordre et découvrir le raccord à la fin. La couture se compose EN PREMIER — c'est elle qui contraint le reste.",
      alternative: "Assume-la : place un vrai événement au raccord (un accord qui change, une note ajoutée). Ce qui est audible et voulu n'est plus un défaut.",
    },
  },
  {
    id: 'harmony.unresolved-seventh',
    severity: 'warning',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l13',
    detect: (ctx: RuleCtx): Issue[] => {
      const chords = ctx.analysis.chords ?? [];
      const self = { id: 'harmony.unresolved-seventh', severity: 'warning' as const, lessonRef: 'm01-l13' };
      const issues: Issue[] = [];
      for (let i = 0; i < chords.length - 1; i++) {
        const chord = chords[i]!;
        if (!TENSION_SEVENTHS.has(chord.chord.form)) continue;
        if (tagged(ctx, chord.from)) continue;

        // La CIBLE, c'est le prochain accord qui change de fondamentale. Un G7
        // qui se reverse en G7, un D7sus4 qui devient D7 : l'harmonie n'a pas
        // bougé, la septième n'est pas abandonnée — elle TIENT. Sur
        // m03-s09 (« le monde et la flèche », pédale de G7), le moteur voyait
        // quatre abandons dans un seul accord tenu.
        let j = i + 1;
        while (j < chords.length && pc(chords[j]!.chord.root) === pc(chord.chord.root)) j++;
        const next = chords[j];
        if (!next) continue; // la pièce s'arrête sur la tension : ce n'est plus un enchaînement

        // Le chiffrage doit être CONTINU jusqu'à la cible. Un trou veut dire
        // qu'une verticalité n'a pas pu se chiffrer (add9, quinte à vide,
        // agrégat) — et non qu'elle est absente. La même doctrine que F-66 :
        // sans chiffrage, on ne tranche pas. Sur m01-s26, le G7 de la mesure 1
        // résout sur un Cmaj9 illisible, et la règle lisait le Em7 deux mesures
        // plus loin comme sa « suite ».
        if (chords.slice(i, j + 1).some((c, k, arr) => k > 0 && c.from !== arr[k - 1]!.to)) continue;

        const down = pc(chord.chord.root + 5) === pc(next.chord.root); // quinte descendante
        const semitone = pc(chord.chord.root - 1) === pc(next.chord.root); // subV
        // La septième diminuée et la demi-diminuée sont des accords de SENSIBLE :
        // leur fondamentale monte d'un demi-ton sur la tonique (vii°7 → I).
        const leading = LEADING_SEVENTHS.has(chord.chord.form) && pc(chord.chord.root + 1) === pc(next.chord.root);
        if (down || semitone || leading) continue;
        issues.push(ruleIssue(self, chord.from,
          'accord de septième laissé sans suite : la tension est posée puis abandonnée'));
      }
      return issues;
    },
    pedagogy: {
      why: "Une septième est une question. La poser et passer à autre chose, c'est parler sans écouter la réponse — l'oreille garde la question ouverte et n'entend plus la suite.",
      how: "Fais suivre ton accord de septième par sa cible : la quarte au-dessus (le mouvement de quinte descendante), ou le demi-ton en dessous si tu passes par la substitution.",
      when: "En harmonie fonctionnelle. **Poids 0.3 en `jazz`** : là, les septièmes sont la matière ordinaire du langage, pas des événements — on ne résout pas chaque accord d'une grille.",
      commonMistake: "Enchaîner les accords de septième parce que « ça sonne riche », sans qu'aucun ne mène nulle part. Riche et immobile, c'est de la moquette.",
      alternative: "La chaîne de dominantes : chaque septième résout sur la suivante, qui est elle-même une septième. Tu ne résous jamais vraiment, et pourtant tout avance.",
    },
  },
  {
    id: 'harmony.retrogression',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l15',
    detect: (ctx: RuleCtx): Issue[] => {
      const chords = ctx.analysis.chords ?? [];
      const key = ctx.analysis.key;
      const self = { id: 'harmony.retrogression', severity: 'suggestion' as const, lessonRef: 'm01-l15' };
      const issues: Issue[] = [];
      for (let i = 0; i < chords.length - 1; i++) {
        const from = functionOf(chords[i]!.chord, key);
        const to = functionOf(chords[i + 1]!.chord, key);
        // D → S est le seul recul franc de la grammaire fonctionnelle.
        if (from === 'D' && to === 'S' && !tagged(ctx, chords[i]!.from)) {
          issues.push(ruleIssue(self, chords[i + 1]!.from,
            'la dominante recule sur une sous-dominante : la marche T→S→D repart en arrière'));
        }
      }
      return issues;
    },
    pedagogy: {
      why: "Les trois fonctions racontent un aller : on part du repos, on s'éloigne, on tire, on revient. Une dominante qui repart vers la sous-dominante défait ce qu'elle venait de faire.",
      how: "Après une dominante, va vers la tonique (ou vers son leurre, le vi). Si tu veux repasser par la sous-dominante, retourne d'abord au repos.",
      when: "En système fonctionnel. En modal et en non-fonctionnel, la notion même de recul n'a plus de sens — les profils correspondants la neutralisent.",
      commonMistake: "Écrire V–IV parce que c'est la même chose que IV–V dans l'autre sens. Ce n'est pas la même chose : l'ordre EST le sens.",
      alternative: "Le back-door (iv–♭VII7→I) et la cadence plagale finale sont deux manières reconnues d'arriver par la sous-dominante — elles arrivent, elles ne reculent pas.",
    },
  },
  {
    id: 'harmony.overchromatic',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l21',
    detect: (ctx: RuleCtx): Issue[] => {
      const chords = ctx.analysis.chords ?? [];
      if (chords.length === 0) return [];
      const key = ctx.analysis.key;
      const diatonic = new Set([0, 2, 4, 5, 7, 9, 11].map(d => pc(d + key.tonic)));
      // Silencieuse dès que chaque chromatisme est expliqué : un accord tagué
      // (napolitain, aug6, subV…) a déjà rendu ses comptes.
      const strangers = chords.filter(c => !diatonic.has(pc(c.chord.root)) && !tagged(ctx, c.from));
      const ratio = strangers.length / chords.length;
      if (ratio <= CHROMATIC_TOLERANCE) return [];
      return [ruleIssue({ id: 'harmony.overchromatic', severity: 'suggestion', lessonRef: 'm01-l21' },
        strangers[0]!.from,
        `${strangers.length} accords chromatiques sur ${chords.length} n'ont pas d'explication : l'exception devient la règle`)];
    },
    pedagogy: {
      why: "Un emprunt vaut par le contraste avec ce qui l'entoure. Quand tout est emprunté, il n'y a plus de maison à laquelle comparer le nuage.",
      how: "Compte tes accords chromatiques. Au-delà d'un sur quatre, demande-toi lequel porte vraiment le sens — et rends les autres diatoniques.",
      when: "Silencieuse dès que les chromatismes sont TAGUÉS : un napolitain, une sixte augmentée, une substitution tritonique se sont déjà expliqués au moteur.",
      commonMistake: "Enrichir tous les degrés d'un coup et appeler ça de la couleur. C'est une peinture où toutes les touches sont rouges.",
      alternative: "Si tu veux ce chromatisme partout, change de système : déclare une palette non fonctionnelle et le moteur cessera de compter les écarts à une tonalité que tu as quittée.",
    },
  },
  {
    id: 'harmony.tritone-sub-resolution',
    severity: 'warning',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l20',
    detect: (ctx: RuleCtx): Issue[] => {
      const idioms = (ctx.analysis.idioms ?? []).filter(t => t.family === 'subV');
      const chords = ctx.analysis.chords ?? [];
      const self = { id: 'harmony.tritone-sub-resolution', severity: 'warning' as const, lessonRef: 'm01-l20' };
      const issues: Issue[] = [];
      for (const tag of idioms) {
        const at = chords.findIndex(c => c.from === tag.from);
        // `findIndex` rend -1 quand le tag ne coïncide avec aucun début
        // d'accord chiffré — et `chords[-1]` est `undefined`. Sans ce garde, la
        // règle plantait sur m01-s38, qui est pourtant l'exercice de la
        // substitution : le moteur mourait sur le cas qu'il devait juger.
        if (at < 0) continue;
        const target = chords[at + 1];
        if (!target) continue;
        const bassA = Math.min(...chords[at]!.notes.map(n => n.pitch));
        const bassB = Math.min(...target.notes.map(n => n.pitch));
        if (bassA - bassB === 1) continue;
        issues.push(ruleIssue(self, tag.from,
          'la substitution est là mais son demi-ton de basse ne descend pas : c\'est le glissement qui fait le couloir'));
      }
      return issues;
    },
    pedagogy: {
      why: "La substitution tritonique n'est pas un accord, c'est un GESTE : la basse qui descend d'un demi-ton sur la cible. Sans ce glissement, on a juste posé un accord bizarre.",
      how: "Écris la cible d'abord, puis place la substitution un demi-ton au-dessus de sa fondamentale. La basse fait le reste du travail.",
      when: "Partout où la substitution est déclarée. Le poids monte à ×1.5 quand la consigne fait du demi-ton de basse l'objet même de l'exercice.",
      commonMistake: "Substituer à la dominante sans toucher à la basse — l'accord change, le mouvement reste celui d'avant. Le couloir n'est pas ouvert.",
      alternative: "Garde une dominante naturelle quelque part dans la pièce : le contraste porte-couloir n'existe que si les deux sont là (c'est exactement ce que demande `mustKeepOneNaturalDominant`).",
    },
  },
];
