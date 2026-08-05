import type { Issue, Part } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { ruleIssue } from './types.js';
import { chordScaleCheck } from '../analyzers/chordscale.js';
import { swingReport } from '../analyzers/swing.js';

/** Zone des voicings de main gauche (m08-l02) : au-dessus, ça flotte ; en dessous, ça vase. */
const VOICING_ZONE: [number, number] = [48, 72]; // C3–C5

export const JAZZ_RULES: Rule[] = [
  {
    id: 'jazz.chord-scale',
    severity: 'warning',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm08-l06',
    detect: (ctx: RuleCtx): Issue[] => {
      const verticals = ctx.analysis.verticals;
      if (!verticals || verticals.length === 0) return [];
      return chordScaleCheck(ctx.analysis.notes, verticals)
        .filter(i => i.atTick === undefined || ctx.window.judges(i.atTick));
    },
    pedagogy: {
      why: "Chaque accord appelle une gamme. Les notes de cette gamme sont disponibles ; celles qui frottent contre un son de l'accord — les avoid notes — ne sont disponibles qu'EN PASSANT.",
      how: "Sur un maj7, le fa passe, il ne se pose pas. Concrètement : temps faible, brève, quittée par degré. Dès qu'elle est sur un appui, longue, ou quittée par saut, on l'entend comme une note de l'accord — et elle est fausse.",
      when: "En langage jazz. **F-45** a chiffré « se poser » précisément pour que le checker sache le mesurer, au lieu d'agiter une consigne floue.",
      commonMistake: "Croire qu'une avoid note est interdite. Elle ne l'est pas : elle est interdite de SÉJOUR. Le fa sur Cmaj7 vit ses quatre vies, et une seule est bonne.",
      alternative: "Change de gamme plutôt que d'éviter la note : sur un sus4, la quarte n'est plus un évitement, c'est la couleur même de l'accord.",
    },
  },
  {
    id: 'jazz.voicing',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm08-l02',
    detect: (ctx: RuleCtx): Issue[] => {
      const verticals = ctx.analysis.verticals ?? [];
      const self = { id: 'jazz.voicing', severity: 'suggestion' as const, lessonRef: 'm08-l02' };
      const issues: Issue[] = [];
      for (const v of verticals) {
        const pitches = v.notes.map(n => n.pitch).filter(p => p >= VOICING_ZONE[0] - 24);
        const inner = pitches.filter(p => p >= VOICING_ZONE[0] && p <= VOICING_ZONE[1]);
        if (pitches.length >= 3 && inner.length === 0 && ctx.window.judges(v.from)) {
          issues.push(ruleIssue(self, v.from,
            `voicing hors de la zone ${VOICING_ZONE[0]}–${VOICING_ZONE[1]} (do3–do5) : trop haut il flotte, trop bas il vase`));
        }
      }
      return issues;
    },
    pedagogy: {
      why: "La main gauche du pianiste de jazz vit dans une zone étroite, do3–do5. En dessous, les intervalles serrés deviennent boueux ; au-dessus, l'accord perd son assise et se met à concurrencer la mélodie.",
      how: "Prends les guide tones (3 et 7) comme squelette, ajoute une ou deux tensions, et garde le tout dans la zone. La fondamentale, c'est le travail du bassiste.",
      when: "En comping jazz. Un voicing orchestral étalé sur quatre octaves obéit à d'autres lois (m07-l03).",
      commonMistake: "Jouer la fondamentale à la main gauche en même temps que le bassiste. Deux fondamentales ne font pas une basse plus solide : elles font de la boue.",
      alternative: "Le voicing rootless : pas de fondamentale du tout. C'est la solution standard, et elle libère la place pour une tension de plus.",
    },
  },
  {
    id: 'jazz.swing-target',
    severity: 'warning',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm08-l01',
    detect: (ctx: RuleCtx): Issue[] => {
      const list: readonly Part[] = ctx.analysis.parts ?? (ctx.submission.kind === 'parts' ? ctx.submission.parts : []);
      if (list.length === 0) return [];
      const self = { id: 'jazz.swing-target', severity: 'warning' as const, lessonRef: 'm08-l01' };
      const issues: Issue[] = [];
      for (const report of swingReport(list)) {
        const part = list.find(p => p.instrumentId === report.partId);
        const target = part?.swingTarget;
        if (!target) continue;
        // **F-44** : `null` = aucune croche de contretemps à mesurer. La
        // contrainte PASSE — une walking en noires ne swingue par rien.
        if (report.ratio === null) continue;
        if (report.ratio >= target[0] && report.ratio <= target[1]) continue;
        issues.push(ruleIssue(self, undefined,
          `${report.partId} : ratio de swing ${report.ratio.toFixed(2)} hors de la cible ${target[0]}–${target[1]}`));
      }
      return issues;
    },
    pedagogy: {
      why: "Le swing n'est pas un rythme écrit, c'est un RAPPORT entre la croche du temps et celle du contretemps. Ce rapport change avec le tempo : ternaire strict au médium, presque égal au très vif.",
      how: "Vise la fourchette de ton tempo plutôt qu'une valeur : autour de 1.5 à tempo moyen, plus proche de 1 quand ça file.",
      when: "Sur les parties qui ont des croches à swinguer. **F-44** : une walking bass en noires rend `n/a` — il n'y a rien à mesurer, et la contrainte passe.",
      commonMistake: "Quantifier tout au triolet et appeler ça du swing. Le swing vit dans les micro-écarts autour du rapport, pas dans le rapport exact.",
      alternative: "Le laid-back : jouer légèrement EN RETARD sur le temps, sans changer le rapport des croches. C'est un autre levier, souvent plus efficace.",
    },
  },
  {
    id: 'jazz.walking-target',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['parts', 'midi'],
    lessonRef: 'm08-l05',
    detect: (ctx: RuleCtx): Issue[] => {
      const list: readonly Part[] = ctx.analysis.parts ?? (ctx.submission.kind === 'parts' ? ctx.submission.parts : []);
      const chords = ctx.analysis.chords ?? [];
      const bass = list.find(p => p.notes.length > 0 && Math.min(...p.notes.map(n => n.pitch)) < 48);
      if (!bass || chords.length === 0) return [];
      const self = { id: 'jazz.walking-target', severity: 'suggestion' as const, lessonRef: 'm08-l05' };
      const issues: Issue[] = [];
      for (const chord of chords) {
        const onBeat = bass.notes.find(n => n.start === chord.from);
        if (!onBeat) continue;
        const degree = ((onBeat.pitch - chord.chord.root) % 12 + 12) % 12;
        const chordTone = degree === 0 || degree === 3 || degree === 4 || degree === 7 || degree === 10 || degree === 11;
        if (chordTone || !ctx.window.judges(chord.from)) continue;
        issues.push(ruleIssue(self, chord.from,
          'la cible du temps 1 n\'est pas un son de l\'accord : la marche perd son ancrage'));
      }
      return issues;
    },
    pedagogy: {
      why: "Une walking bass se compose à l'envers : la CIBLE d'abord (le temps 1, toujours un son de l'accord), l'approche ensuite (le demi-ton qui vise), et le chemin en dernier. C'est la même méthode que la première espèce.",
      how: "Pose tes temps 1 sur les fondamentales et les tierces. Place tes approches chromatiques au temps 4. Remplis le reste par degrés.",
      when: "Sur toute basse de jazz en noires. Une basse qui tient des rondes sous une grille lente n'a pas de cible à viser : la règle se tait.",
      commonMistake: "Composer la ligne de gauche à droite et arriver au temps 1 suivant par hasard. La marche bégaie, et on ne sait pas pourquoi.",
      alternative: "Varie les approches : chromatique par en dessous, par au-dessus, ou par la dominante. Deux fois la même approche à deux mesures d'écart, et la marche se répète.",
    },
  },
];
