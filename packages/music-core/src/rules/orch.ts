import type { Issue, Part } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { ruleIssue } from './types.js';
import { densityMap, dynamicAt, effectivePower, enduranceIssues, rangeIssues } from '../analyzers/orchestration.js';
import { instrument } from '../data/instruments.js';

/** Sous cette hauteur, deux notes serrées deviennent une bouillie (low-interval-limit). */
const LOW_LIMIT_PITCH = 48; // C3
const LOW_LIMIT_MIN_INTERVAL = 7; // en deçà de la quinte, ça vase
/** Écart de puissance à partir duquel une voix en couvre une autre. */
const MASKING_DELTA = 3;
/** Une ligne dont la vitesse dépasse l'agilité déclarée de l'instrument. */
const FAST_TICKS = 240; // la croche

function parts(ctx: RuleCtx): readonly Part[] {
  return ctx.analysis.parts ?? (ctx.submission.kind === 'parts' ? ctx.submission.parts : []);
}

function judged(ctx: RuleCtx, issues: Issue[]): Issue[] {
  return issues.filter(i => i.atTick === undefined || ctx.window.judges(i.atTick));
}

export const ORCH_RULES: Rule[] = [
  {
    id: 'orch.range-violation',
    severity: 'error',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm05-l01',
    detect: (ctx: RuleCtx) => judged(ctx, parts(ctx).flatMap(rangeIssues)),
    pedagogy: {
      why: "Une note hors tessiture n'est pas difficile : elle est INJOUABLE. L'instrumentiste ne peut pas la produire, et la partition s'arrête là.",
      how: "Vérifie les deux bornes de chaque instrument avant d'écrire. Les fiches M5 donnent la tessiture praticable — celle où l'on joue en concert, pas celle des records.",
      when: "Toujours, sans exception de style. C'est la seule famille de règles où « c'est un choix artistique » n'est pas une réponse recevable.",
      commonMistake: "Écrire pour l'instrument transpositeur en sons écrits et oublier la transposition. Le cor sonne une quinte plus bas que ce que tu lis.",
      alternative: "Confie la note à l'instrument voisin : c'est exactement ce que fait un orchestrateur — la ligne passe d'un pupitre à l'autre sans que l'auditeur s'en aperçoive.",
    },
  },
  {
    id: 'orch.register-color',
    severity: 'info',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm05-l01',
    detect: (ctx: RuleCtx): Issue[] => {
      const self = { id: 'orch.register-color', severity: 'info' as const, lessonRef: 'm05-l01' };
      const issues: Issue[] = [];
      for (const part of parts(ctx)) {
        const inst = instrument(part.instrumentId);
        if (!inst?.registerZones) continue;
        for (const note of part.notes) {
          const zone = inst.registerZones.find(z => note.pitch >= z.from && note.pitch <= z.to);
          if (!zone?.exposedRisk) continue;
          issues.push(ruleIssue(self, note.start,
            `${inst.id} dans sa zone « ${zone.label} » : couleur exposée, à traverser en connaissance de cause`));
          break; // une mention par partie suffit : c'est un mentor, pas un compteur
        }
      }
      return judged(ctx, issues);
    },
    pedagogy: {
      why: "Chaque instrument change de personnalité selon la hauteur. Le grave de flûte est superbe et inaudible ; la gorge de la clarinette est terne ; l'aigu du cor est fragile. Ce ne sont pas des défauts, ce sont des couleurs à connaître.",
      how: "Regarde la zone où tombe ta ligne, et demande-toi si tu veux CETTE couleur-là. Si oui, protège-la : allège l'accompagnement, expose-la.",
      when: "En mentor, toujours : la règle ne sanctionne rien, elle informe. C'est la première chose que le rapport te dira sur une flûte grave.",
      commonMistake: "Écrire une contre-mélodie de flûte dans le grave sous un tutti. Elle est écrite, elle est jolie, et personne ne l'entendra jamais.",
      alternative: "Change d'octave, ou change d'instrument : la clarinette dans son chalumeau fait ce que la flûte grave voudrait faire, et on l'entend.",
    },
  },
  {
    id: 'orch.balance',
    severity: 'warning',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm07-l03',
    detect: (ctx: RuleCtx): Issue[] => {
      const list = parts(ctx);
      if (list.length < 2) return [];
      const self = { id: 'orch.balance', severity: 'warning' as const, lessonRef: 'm07-l03' };
      const melody = list[0]!; // convention : la première partie porte la ligne
      const issues: Issue[] = [];
      for (const note of melody.notes.slice(0, 1)) {
        const lead = effectivePower(melody.instrumentId, note.pitch, dynamicAt(melody, note.start, note), melody.mute);
        const rivals = list.slice(1).filter(p => {
          const under = p.notes.find(n => n.start <= note.start && n.start + n.duration > note.start);
          if (!under) return false;
          return effectivePower(p.instrumentId, under.pitch, dynamicAt(p, under.start, under), p.mute) > lead + MASKING_DELTA;
        });
        if (rivals.length > 0) {
          issues.push(ruleIssue(self, note.start,
            `la ligne principale (${melody.instrumentId}) est dépassée en puissance par ${rivals.map(r => r.instrumentId).join(', ')}`));
        }
      }
      return judged(ctx, issues);
    },
    pedagogy: {
      why: "L'équilibre ne se règle pas au mixage : il s'écrit. Une ligne confiée à un instrument faible sous un accompagnement puissant est perdue avant d'avoir commencé.",
      how: "Compare les puissances EFFECTIVES — celles de la fiche, corrigées par le registre et la sourdine — pas les noms des instruments.",
      when: "Dès qu'il y a plus d'une partie. Une pièce soliste n'a pas de problème d'équilibre.",
      commonMistake: "Écrire la mélodie au hautbois et l'accompagnement aux cuivres en ff, puis « monter le hautbois » à la console. Il n'y a pas de console à l'orchestre.",
      alternative: "Double la ligne (octave ou unisson) : deux pupitres faibles font une voix qui passe. C'est la solution de l'orchestrateur, pas celle de l'ingénieur.",
    },
  },
  {
    id: 'orch.masking',
    severity: 'warning',
    weight: 1,
    appliesTo: ['parts', 'midi', 'layers'],
    lessonRef: 'm07-l03',
    detect: (ctx: RuleCtx): Issue[] => {
      const list = parts(ctx);
      if (list.length < 2) return [];
      const end = list.flatMap(p => p.notes).reduce((m, n) => Math.max(m, n.start + n.duration), 0);
      const map = densityMap(list, { from: 0, to: end });
      const self = { id: 'orch.masking', severity: 'warning' as const, lessonRef: 'm07-l03' };
      return map.filter(b => b.overloaded).map(b =>
        ruleIssue(self, undefined, `bande « ${b.label} » occupée par ${b.voices} parties : les timbres se masquent mutuellement`));
    },
    pedagogy: {
      why: "Deux timbres qui occupent la même bande de fréquences se mangent. Ce n'est pas une question de volume : c'est physique, et aucun équilibrage ne le répare.",
      how: "Étale. Un instrument par étage : basse, bas-médium, médium, haut-médium, aigu. C'est « l'immeuble » contre « le tas ».",
      when: "Dès trois ou quatre parties simultanées. À deux voix, la question ne se pose pas.",
      commonMistake: "Écrire un accord serré au médium à huit instruments en croyant faire un tutti riche. On fait une masse indistincte — le même accord étalé sur quatre octaves sonne trois fois plus grand.",
      alternative: "Si tu veux la masse : assume-la comme un effet ponctuel (un choc, un mur) et ouvre l'espace juste après. Le contraste fait le tutti.",
    },
  },
  {
    id: 'orch.blend-risk',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm05-l01',
    detect: (ctx: RuleCtx): Issue[] => {
      const list = parts(ctx);
      const self = { id: 'orch.blend-risk', severity: 'suggestion' as const, lessonRef: 'm05-l01' };
      const issues: Issue[] = [];
      for (const a of list) {
        const avoid = instrument(a.instrumentId)?.avoidWith ?? [];
        for (const b of list) {
          if (a === b || !avoid.includes(b.instrumentId)) continue;
          const clash = a.notes.find(n => b.notes.some(m => m.start < n.start + n.duration && n.start < m.start + m.duration));
          if (clash) {
            issues.push(ruleIssue(self, clash.start,
              `${a.instrumentId} et ${b.instrumentId} se disputent le même plan : la fiche les déconseille ensemble`));
          }
        }
      }
      return judged(ctx, issues);
    },
    pedagogy: {
      why: "Certaines paires ne fondent pas : hautbois et trompette se disputent la pénétrance, piano et harpe superposent deux décroissances qui s'annulent. Les mettre ensemble ne fait pas une couleur, ça fait un conflit.",
      how: "Vérifie les `avoidWith` de tes fiches avant de superposer deux solos. Si les deux doivent jouer, sépare-les dans le temps ou dans le registre.",
      when: "Quand les deux instruments jouent EN MÊME TEMPS et au même plan. Se répondre, alterner, se relayer : aucun problème — c'est même le bon usage.",
      commonMistake: "Doubler une mélodie de hautbois à la trompette pour « la renforcer ». On obtient deux solistes qui s'annulent, pas un timbre plus fort.",
      alternative: "Cherche les `blendsWith` : violoncelle et cor, alto et cor anglais, flûte et harpe. Ces paires-là ont été inventées pour fusionner.",
    },
  },
  {
    id: 'orch.low-interval-limit',
    severity: 'warning',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm07-l03',
    detect: (ctx: RuleCtx): Issue[] => {
      const verticals = ctx.analysis.verticals ?? [];
      const self = { id: 'orch.low-interval-limit', severity: 'warning' as const, lessonRef: 'm07-l03' };
      const issues: Issue[] = [];
      for (const v of verticals) {
        const low = [...new Set(v.notes.map(n => n.pitch))].filter(p => p < LOW_LIMIT_PITCH).sort((a, b) => a - b);
        for (let i = 0; i < low.length - 1; i++) {
          if (low[i + 1]! - low[i]! < LOW_LIMIT_MIN_INTERVAL) {
            issues.push(ruleIssue(self, v.from,
              `intervalle de ${low[i + 1]! - low[i]!} demi-tons sous do3 : dans le grave, serré veut dire boueux`));
            break;
          }
        }
      }
      return judged(ctx, issues);
    },
    pedagogy: {
      why: "Dans le grave, les harmoniques des deux notes se recouvrent et l'oreille ne sépare plus rien. Une tierce à l'aigu est un accord ; la même tierce deux octaves plus bas est un grondement.",
      how: "Sous do3, écris large : quinte ou octave. La tierce grave se place au-dessus, jamais en dessous.",
      when: "Sur toute écriture qui descend sous do3 — orchestre, piano main gauche, sound design. Un cluster grave VOULU (le mur, la menace) échappe à la règle, mais dis-le.",
      commonMistake: "Transposer un accord serré vers le grave sans le ré-espacer. L'accord était bon à l'octave d'origine ; il ne l'est plus.",
      alternative: "Garde la basse seule et confie l'accord au registre médium : c'est le voicing le plus sûr de tout l'orchestre.",
    },
  },
  {
    id: 'orch.agility',
    severity: 'warning',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm05-l01',
    detect: (ctx: RuleCtx): Issue[] => {
      const self = { id: 'orch.agility', severity: 'warning' as const, lessonRef: 'm05-l01' };
      const issues: Issue[] = [];
      for (const part of parts(ctx)) {
        const inst = instrument(part.instrumentId);
        if (!inst || inst.agility >= 7) continue;
        const fast = part.notes.filter(n => n.duration <= FAST_TICKS);
        if (fast.length >= 4) {
          issues.push(ruleIssue(self, fast[0]!.start,
            `${fast.length} notes rapides confiées à ${inst.id} (agilité ${inst.agility}/10) : le trait ne sortira pas net`));
        }
      }
      return judged(ctx, issues);
    },
    pedagogy: {
      why: "Tous les instruments ne bougent pas à la même vitesse. Le contrebasson met un temps réel à parler ; la coulisse du trombone doit se déplacer. Un trait rapide écrit là s'empâte.",
      how: "Réserve les traits aux agiles (flûte, clarinette, violon, piano) et donne aux lents ce qu'ils font le mieux : des lignes tenues, des notes qui pèsent.",
      when: "Dès que la valeur descend sous la croche à tempo modéré. À tempo lent, la même écriture est parfaitement jouable.",
      commonMistake: "Doubler un trait de violon au basson à l'unisson. Le violon le joue, le basson le subit — et on entend le basson.",
      alternative: "Donne au lent la charpente (les appuis du trait) pendant que l'agile joue le trait complet : les deux sonnent ensemble et personne ne rame.",
    },
  },
  {
    id: 'orch.endurance',
    severity: 'warning',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm05-l16',
    detect: (ctx: RuleCtx) => judged(ctx, parts(ctx).flatMap(p => enduranceIssues(p))),
    pedagogy: {
      why: "Le souffle et les lèvres s'épuisent. Une trompette qui reste dans l'aigu tient quatre mesures, pas douze — après, le son se dégrade, puis s'arrête.",
      how: "Compte les mesures de jeu continu et place des silences. Une mesure de repos suffit à rendre le souffle.",
      when: "Sur les vents et les cuivres. Cordes, claviers et orgue n'ont pas ce problème — l'archet alterne, l'orgue ne respire pas.",
      commonMistake: "Écrire une longue montée de cor jusqu'au sommet et enchaîner immédiatement sur la reprise. Le cor n'y arrivera pas deux fois.",
      alternative: "Alterne deux pupitres du même instrument (cor 1 et cor 2 se relaient) : la ligne est continue pour l'auditeur, et chacun respire.",
    },
  },
  {
    id: 'orch.role-coverage',
    severity: 'warning',
    weight: 1,
    appliesTo: ['parts', 'layers', 'midi'],
    lessonRef: 'm07-l02',
    detect: (ctx: RuleCtx): Issue[] => {
      const list = parts(ctx);
      if (list.length === 0) return [];
      const end = list.flatMap(p => p.notes).reduce((m, n) => Math.max(m, n.start + n.duration), 0);
      const map = densityMap(list, { from: 0, to: end });
      const self = { id: 'orch.role-coverage', severity: 'warning' as const, lessonRef: 'm07-l02' };
      const bass = map.find(b => b.label === 'sub' || b.label === 'grave');
      const hasBass = map.some(b => (b.label === 'sub' || b.label === 'grave') && b.voices > 0);
      if (!hasBass && list.length >= 3) {
        return [ruleIssue(self, bass?.from, 'aucune partie sous do3 : l\'orchestration n\'a pas de socle')];
      }
      return [];
    },
    pedagogy: {
      why: "Une orchestration est une répartition de RÔLES : un socle, un corps, un dessus, du mouvement. Quand un rôle manque, l'oreille cherche ce qui manque au lieu d'écouter ce qu'il y a.",
      how: "Avant d'écrire les notes, écris les rôles : qui tient le sol, qui remplit, qui chante, qui bouge. Puis distribue.",
      when: "Dès trois parties. Un duo assume très bien de n'avoir ni basse ni tapis — c'est un duo.",
      commonMistake: "Empiler trois voix superbes toutes au même registre et se demander pourquoi ça sonne maigre. Il n'y a personne en dessous.",
      alternative: "Le rôle peut être tenu par le silence : une basse qui entre à la mesure 9 après huit mesures sans socle fait un effet qu'aucune basse continue ne produira.",
    },
  },
  {
    id: 'orch.density-overload',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['parts', 'layers', 'midi'],
    lessonRef: 'm07-l03',
    detect: (ctx: RuleCtx): Issue[] => {
      const list = parts(ctx);
      if (list.length < 4) return [];
      const end = list.flatMap(p => p.notes).reduce((m, n) => Math.max(m, n.start + n.duration), 0);
      const map = densityMap(list, { from: 0, to: end });
      const busy = map.filter(b => b.voices > 0).length;
      if (busy >= 3) return [];
      return [ruleIssue({ id: 'orch.density-overload', severity: 'suggestion', lessonRef: 'm07-l03' }, undefined,
        `${list.length} parties réparties sur ${busy} bande(s) seulement : tout l'effectif joue au même étage`)];
    },
    pedagogy: {
      why: "La densité ne se mesure pas au nombre d'instruments mais au nombre d'étages occupés. Huit parties sur un seul étage sonnent moins grand que quatre parties sur quatre.",
      how: "Compte tes bandes avant d'ajouter un pupitre. Si tout le monde est au médium, la solution n'est pas d'en ajouter un : c'est d'en déplacer trois.",
      when: "À partir de quatre parties simultanées. En dessous, la question ne se pose pas : trois voix trouvent toujours leur place.",
      commonMistake: "Répondre à « ça manque de puissance » en ajoutant des instruments. On ajoute de la boue, pas de la puissance.",
      alternative: "Ouvre l'espace : monte le dessus d'une octave, descends la basse d'une octave. Même effectif, même notes — deux fois plus grand.",
    },
  },
];
