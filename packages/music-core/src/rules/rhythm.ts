import type { Issue } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { ruleIssue } from './types.js';

/** Fenêtre de syncope par défaut : ni raide, ni flottant. */
const SYNCOPATION_WINDOW: [number, number] = [0.05, 0.5];
/** En deçà, la déclamation contredit le mètre au point de le dissoudre. */
const PROSODY_FLOOR = -0.3;

export const RHYTHM_RULES: Rule[] = [
  {
    id: 'rhythm.syncopation-target',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['mono', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l09',
    detect: (ctx: RuleCtx): Issue[] => {
      const profile = ctx.analysis.rhythm;
      if (!profile) return [];
      const declared = ctx.spec.constraints?.syncopationTarget;
      const [lo, hi] = Array.isArray(declared) && declared.length === 2
        ? (declared as [number, number])
        : SYNCOPATION_WINDOW;
      const value = profile.offBeatRatio;
      if (value >= lo && value <= hi) return [];
      return [ruleIssue({ id: 'rhythm.syncopation-target', severity: 'suggestion', lessonRef: 'm01-l09' }, undefined,
        value < lo
          ? `${Math.round(value * 100)} % d'attaques hors temps : la grille est là, mais rien ne la contredit jamais`
          : `${Math.round(value * 100)} % d'attaques hors temps : à force de décaler, on ne sait plus par rapport à quoi`)];
    },
    pedagogy: {
      why: "Une syncope ne vaut que contre une grille qu'on entend encore. Trop peu, la musique est raide ; trop, il n'y a plus de temps fort à contredire et le décalage devient la nouvelle normale.",
      how: "Attaque les temps 1 régulièrement, et décale ce qui compte : la note d'arrivée, le sommet, le début d'une reprise.",
      when: "Les fenêtres changent selon le style : très basse en choral, autour de 0.35–0.7 en jazz, autour de 0.15–0.4 pour la joie rebondie. La consigne peut la déclarer.",
      commonMistake: "Tout décaler d'une croche en croyant faire du groove. On a juste déplacé la grille — et l'auditeur la réentend au bout de deux mesures.",
      alternative: "Les asymétries (3+3+2) : au lieu de décaler par rapport à un mètre régulier, tu changes la scansion elle-même. C'est un autre outil, plus radical, et il se déclare.",
    },
  },
  {
    id: 'rhythm.asymmetry',
    severity: 'info',
    weight: 1,
    appliesTo: ['mono', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l09',
    detect: (ctx: RuleCtx): Issue[] => {
      const profile = ctx.analysis.rhythm;
      if (!profile || profile.asymmetries.length === 0) return [];
      const self = { id: 'rhythm.asymmetry', severity: 'info' as const, lessonRef: 'm01-l09' };
      return [ruleIssue(self, profile.asymmetries[0]!.at,
        `scansion 3+3+2 détectée sur ${profile.asymmetries.length} mesure(s) : l'asymétrie est en place`)];
    },
    pedagogy: {
      why: "Le 3+3+2 découpe huit croches en trois groupes inégaux. Ce n'est pas une syncope — c'est un autre mètre à l'intérieur du mètre, et l'oreille l'entend comme une pulsation boiteuse et dansante.",
      how: "Attaque aux croches 1, 4 et 7 de la mesure, et laisse les autres vides ou tenues. C'est la clave, et elle marche telle quelle.",
      when: "Le moteur la SIGNALE (c'est une info, pas une faute) partout où il la trouve, pour que le rapport puisse te dire que ton geste est reconnu.",
      commonMistake: "Écrire 3+3+2 puis remplir tous les autres temps : les groupes disparaissent sous les notes.",
      alternative: "Le 2+3+3 et le 3+2+3 donnent la même somme et un tout autre balancement — essaie les trois avant de choisir.",
    },
  },
  {
    id: 'rhythm.prosody',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['mono', 'voices', 'parts', 'midi'],
    lessonRef: 'm02-l09',
    detect: (ctx: RuleCtx): Issue[] => {
      const profile = ctx.analysis.rhythm;
      if (!profile) return [];
      const inverted = ctx.spec.styleProfile?.id === 'jazz';
      const value = inverted ? -profile.prosodyCorrelation : profile.prosodyCorrelation;
      if (value >= PROSODY_FLOOR) return [];
      return [ruleIssue({ id: 'rhythm.prosody', severity: 'suggestion', lessonRef: 'm02-l09' }, undefined,
        `déclamation à contre-mètre (corrélation ${value.toFixed(2)}) : les valeurs longues fuient systématiquement les appuis`)];
    },
    pedagogy: {
      why: "Les notes longues et fortes tombent naturellement là où la mesure appuie : c'est ainsi qu'on entend où l'on est. Les faire fuir l'appui en permanence brouille la scansion.",
      how: "Mets tes valeurs longues sur le premier temps (et le troisième en quatre-quatre), tes brèves sur les temps faibles. L'anacrouse est faite pour ça : une brève AVANT la longue.",
      when: "En déclamation classique. **Le jazz déclame à l'envers** et le moteur le sait : sous le profil `jazz`, la corrélation est jugée inversée, et un swing bien placé rend alors une valeur POSITIVE.",
      commonMistake: "Écrire la mélodie sans penser au mètre, puis se demander pourquoi elle paraît « molle ». Elle n'est pas molle : elle est mal accentuée.",
      alternative: "L'anticipation : jouer la note longue une croche AVANT l'appui. Elle fuit le temps fort tout en le désignant — c'est la base du groove.",
    },
  },
];
