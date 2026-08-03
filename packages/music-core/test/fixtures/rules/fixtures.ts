import { expect } from 'vitest';
import { buildCtx } from './harness.js';
import type { CaseInput } from './harness.js';
import { REGISTRY, rule, runRules } from '../../../src/rules/registry.js';
import { PROFILES, effectiveWeight, isSilenced, profileFlag } from '../../../src/rules/profiles.js';
import { parseNotation } from '../../../src/notation/parse.js';
import type { Part } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

/** Vrai si la règle nommée a parlé sur ce cas. */
function fires(ruleId: string, input: CaseInput): boolean {
  const ctx = buildCtx(input);
  return rule(ruleId).detect(ctx).length > 0;
}

/**
 * Le gabarit de fixture des règles (S4.J1) : **déclenche / silencieuse /
 * re-pondérée par profil**. La détection, elle, est déjà couverte par les
 * fixtures d'analyseurs — ici on vérifie le JUGEMENT et son extinction.
 */
function triad(ruleId: string, triggering: CaseInput, silent: CaseInput, profile?: string): Fixture[] {
  const out: Fixture[] = [
    { name: `${ruleId} — déclenche`, run: () => expect(fires(ruleId, triggering), 'devrait déclencher').toBe(true) },
    { name: `${ruleId} — silencieuse`, run: () => expect(fires(ruleId, silent), 'devrait se taire').toBe(false) },
  ];
  if (profile) {
    out.push({
      name: `${ruleId} — éteinte sous ${profile}`,
      run: () => {
        const base = rule(ruleId);
        expect(isSilenced(base.id, base.weight, { id: profile })).toBe(true);
        const ctx = buildCtx({ ...triggering, styleProfile: { id: profile } });
        expect(runRules(ctx).silenced).toContain(ruleId);
        expect(runRules(ctx).issues.some(i => i.ruleId === ruleId)).toBe(false);
      },
    });
  }
  return out;
}

const parts = (list: { id: string; notation: string }[]): Part[] =>
  list.map(p => ({ instrumentId: p.id, notes: parseNotation(p.notation) }));

export const fixtures: Fixture[] = [
  // ------------------------------------------------------------------ mélodie
  ...triad('melody.no-motif',
    { notation: 'C4:q D4:e F#4:e A4:h | Bb4:q E4:q G#4:h' },
    { notation: 'C4:q E4:q G4:h | C4:q E4:q G4:h | C4:q E4:q G4:h' }),

  ...triad('melody.monotony',
    { notation: 'C4:q E4:q G4:h | C4:q E4:q G4:h | C4:q E4:q G4:h | C4:q E4:q G4:h' },
    { notation: 'C4:q E4:q G4:h | C4:q E4:q G4:h | D4:q F4:q A4:h | C4:q E4:q G4:h' },
    'thriller-tension'),

  ...triad('melody.climax',
    // Sommet à 12 % : tout ce qui suit n'est qu'une redescente.
    { notation: 'C4:q C5:h. | B4:q A4:q G4:q F4:q | E4:q D4:q C4:h' },
    { notation: 'C4:q D4:q E4:q F4:q | G4:q A4:q G4:q F4:q | E4:q G4:q C5:h | B4:q A4:q C4:h' }),

  ...triad('melody.leap-recovery',
    { notation: 'C4:q A4:q E5:q C5:q' },
    { notation: 'C4:q A4:q G4:q F4:q' }),

  // La tonalité est DÉCLARÉE : sans elle, `estimateKey` lit une montée
  // chromatique intégrale dans une tonalité arbitraire, et la fixture ne teste
  // plus la règle qu'elle vise.
  ...triad('melody.out-of-key',
    { notation: 'C4:q C#4:q D4:q D#4:q | E4:q F#4:q G#4:q A#4:q', given: { key: { tonic: 0, mode: 'major' } } },
    { notation: 'C4:q D4:q E4:q F4:q | G4:q A4:q B4:q C5:q', given: { key: { tonic: 0, mode: 'major' } } }),

  ...triad('melody.ending-weak',
    { notation: 'C4:q D4:q E4:q F4:q | G4:q A4:q B4:q E4:e' },
    { notation: 'C4:q D4:q E4:q F4:q | G4:q A4:q B4:q C5:w' }),

  ...triad('melody.phrase-breathing',
    // Dix mesures d'affilée sans un silence ni une valeur longue : le contour
    // ondule (aucune élision possible), donc rien ne découpe la phrase.
    { notation: ('C4:q E4:q D4:q F4:q | ').repeat(10).trim().replace(/\|$/, '') },
    { notation: 'C4:q D4:q E4:q r:q | G4:q F4:q E4:h' }),

  // ------------------------------------------------------------------ harmonie
  ...triad('harmony.unresolved-seventh',
    // G7 qui part sur un accord sans rapport : la question reste ouverte.
    { voices: ['G2:w | A2:w | C3:w', 'B3:w | C4:w | E4:w', 'F4:w | E4:w | G4:w'] },
    { voices: ['G2:w | C3:w', 'B3:w | C4:w', 'F4:w | E4:w'] }),

  ...triad('harmony.retrogression',
    // V → IV : la dominante repart en arrière.
    { voices: [
      'C3:w | G2:w | F2:w | C3:w', 'G3:w | G3:w | A3:w | G3:w',
      'E4:w | D4:w | C4:w | E4:w', 'C5:w | B4:w | A4:w | C5:w'] },
    { voices: [
      'C3:w | F2:w | G2:w | C3:w', 'G3:w | A3:w | G3:w | G3:w',
      'E4:w | C4:w | D4:w | E4:w', 'C5:w | A4:w | B4:w | C5:w'] }),

  // ---------------------------------------------------------------- conduite
  ...triad('vl.parallel-perfects',
    { voices: ['C5:w | D5:w', 'F3:w | G3:w'] },
    { voices: ['E4:w | D4:w', 'Bb2:w | D3:w'] },
    'impressionist'),

  ...triad('vl.doubled-leading-tone',
    { voices: ['G2:w | C3:w', 'B3:w | C4:w', 'B4:w | C5:w'] },
    { voices: ['G2:w | C3:w', 'D4:w | E4:w', 'B4:w | C5:w'] }),

  ...triad('vl.spacing',
    { voices: ['C2:w', 'C4:w', 'E5:w'] },
    { voices: ['C2:w', 'C4:w', 'E4:w'] }),

  // ------------------------------------------------------------------ rythme
  ...triad('rhythm.syncopation-target',
    { notation: 'C4:w | D4:w | E4:w | F4:w', constraints: { syncopationTarget: [0.3, 0.6] } },
    { notation: 'C4:e D4:e E4:q F4:e G4:e A4:q', constraints: { syncopationTarget: [0.0, 0.6] } }),

  ...triad('rhythm.prosody',
    // Les longues fuient systématiquement les appuis : déclamation à contre-mètre.
    { notation: 'C4:e D4:q~ D4:e E4:e F4:q~ F4:e | G4:e A4:q~ A4:e B4:e C5:q~ C5:e' },
    { notation: 'C4:q. D4:e E4:q. F4:e | G4:q. F4:e E4:q. D4:e' }),

  // ------------------------------------------------------------ orchestration
  ...triad('orch.range-violation',
    { parts: parts([{ id: 'flute', notation: 'D3:w' }]) },
    { parts: parts([{ id: 'flute', notation: 'D5:w' }]) }),

  ...triad('orch.endurance',
    { parts: parts([{ id: 'trumpet', notation: 'G5:w | A5:w | G5:w | A5:w | G5:w | A5:w' }]) },
    { parts: parts([{ id: 'trumpet', notation: 'G4:w | A4:w | G4:w | A4:w' }]) }),

  ...triad('orch.agility',
    { parts: parts([{ id: 'contrabassoon', notation: 'C2:e D2:e E2:e F2:e G2:e A2:e' }]) },
    { parts: parts([{ id: 'contrabassoon', notation: 'C2:w | D2:w' }]) }),

  ...triad('orch.masking',
    { parts: parts([
      { id: 'flute', notation: 'C5:w' }, { id: 'oboe', notation: 'D5:w' },
      { id: 'clarinet', notation: 'E5:w' }, { id: 'violin-1', notation: 'F5:w' },
    ]) },
    { parts: parts([
      { id: 'double-bass', notation: 'E1:w' }, { id: 'cello', notation: 'C2:w' },
      { id: 'viola', notation: 'C3:w' }, { id: 'flute', notation: 'C6:w' },
    ]) }),

  // -------------------------------------------------------------------- jazz
  ...triad('jazz.chord-scale',
    // Le fa POSÉ sur un Cmaj7 tenu : avoid note installée (F-45).
    { notation: 'F4:h E4:h', harmony: ['C3:w', 'E3:w', 'G3:w', 'B3:w'] },
    { notation: 'E4:q F4:e E4:e G4:h', harmony: ['C3:w', 'E3:w', 'G3:w', 'B3:w'] }),

  // ---------------------------------------------------- registre et profils
  {
    name: 'registre — 45 règles, identifiants uniques, familles complètes',
    run: () => {
      expect(REGISTRY.size).toBeGreaterThanOrEqual(45);
      const families = new Map<string, number>();
      for (const id of REGISTRY.keys()) {
        const family = id.split('.')[0]!;
        families.set(family, (families.get(family) ?? 0) + 1);
      }
      expect([...families.keys()].sort()).toEqual(['cp', 'harmony', 'jazz', 'melody', 'orch', 'rhythm', 'sd', 'vl']);
      expect(families.get('melody')).toBe(8);
      expect(families.get('orch')).toBe(10);
    },
  },
  {
    name: 'registre — échec bruyant sur un identifiant inconnu',
    run: () => {
      // Une spec qui référence une règle inexistante doit s'ARRÊTER, pas passer.
      expect(() => rule('melody.tres-jolie')).toThrow(/règle inconnue/);
    },
  },
  {
    name: 'profil thriller — la même soumission, deux verdicts',
    run: () => {
      // LE test du tutoriel : quatre énoncés strictement identiques.
      const input: CaseInput = { notation: 'C4:q E4:q G4:h | C4:q E4:q G4:h | C4:q E4:q G4:h | C4:q E4:q G4:h' };

      const classical = runRules(buildCtx({ ...input, styleProfile: { id: 'classical-common' } }));
      expect(classical.issues.some(i => i.ruleId === 'melody.monotony'), 'monotony devrait parler en classique').toBe(true);
      expect(classical.silenced).not.toContain('melody.monotony');

      const thriller = runRules(buildCtx({ ...input, styleProfile: { id: 'thriller-tension' } }));
      expect(thriller.issues.some(i => i.ruleId === 'melody.monotony'), 'monotony doit se taire en thriller').toBe(false);
      expect(thriller.silenced).toContain('melody.monotony');
      expect(thriller.silenced).toContain('melody.tension-placement');
      // Le drapeau sémantique dit POURQUOI : la répétition y est un moyen.
      expect(profileFlag('repetitionIsPositive', { id: 'thriller-tension' })).toBe(true);
    },
  },
  {
    name: 'profils — les matrices du Manuel §3.6',
    run: () => {
      expect(Object.keys(PROFILES).sort()).toEqual([
        'classical-common', 'epic-film', 'hybrid-sd', 'impressionist', 'jazz',
        'modern-horror', 'neo-noir', 'romantic-film', 'thriller-tension',
      ]);
      expect(effectiveWeight('melody.leap-recovery', 1, { id: 'romantic-film' })).toBe(1.3);
      expect(effectiveWeight('vl.parallel-perfects', 1, { id: 'epic-film' })).toBe(0.1);
      expect(effectiveWeight('vl.parallel-perfects', 1, { id: 'impressionist' })).toBe(0);
      expect(effectiveWeight('harmony.unresolved-seventh', 1, { id: 'jazz' })).toBe(0.3);
      // Poids par défaut quand le profil ne dit rien.
      expect(effectiveWeight('melody.climax', 1, { id: 'jazz' })).toBe(1);
    },
  },
  {
    name: 'profils — la surcharge locale passe PAR-DESSUS',
    run: () => {
      // `spec.styleProfile.ruleWeights` gagne contre la matrice du profil : le
      // plus local l'emporte, toujours.
      const ref = { id: 'epic-film', ruleWeights: { 'vl.parallel-perfects': 1 } };
      expect(effectiveWeight('vl.parallel-perfects', 1, ref)).toBe(1);
      expect(isSilenced('vl.parallel-perfects', 1, ref)).toBe(false);
      // Et inversement : une spec peut éteindre ce que le profil laissait vivre.
      const off = { id: 'classical-common', ruleWeights: { 'melody.climax': 0 } };
      expect(isSilenced('melody.climax', 1, off)).toBe(true);
    },
  },
  {
    name: 'F-41 — le matériau donné n\'est jamais jugé',
    run: () => {
      // Une quinte parallèle DANS l'ostinato fourni ne doit rien coûter à l'élève.
      const given = { bars: [1, 1] as [number, number] };
      const withGiven = buildCtx({ voices: ['C5:w | D5:w', 'F3:w | G3:w'], given });
      const without = buildCtx({ voices: ['C5:w | D5:w', 'F3:w | G3:w'] });
      expect(without.window.isGiven(0)).toBe(false);
      expect(withGiven.window.isGiven(0)).toBe(true);
      expect(withGiven.window.judges(0)).toBe(false);
      // La faute tombe au tick 1920 (l'arrivée), hors du donné : elle reste jugée.
      expect(withGiven.window.judges(1920)).toBe(true);
    },
  },

  // -------------------------------------------------------------------------
  // APPLICABILITÉ (S5–S6) — les périmètres resserrés pendant le verrou n°2.
  //
  // Chaque écart trouvé sur le corpus est encadré ici par une fixture positive
  // (la règle parle où elle doit) ET une négative (elle se tait où elle n'a
  // rien à dire). Sans la négative, rien n'empêcherait de rouvrir le périmètre
  // par inadvertance à la prochaine relecture.
  // -------------------------------------------------------------------------
  {
    name: 'melody.no-motif — se tait sur une progression harmonique',
    run: () => {
      const grid: CaseInput = { notation: '[C3+E4+G4+C5]:w | [F3+F4+A4+C5]:w | [G3+D4+G4+B4]:w | [C3+E4+G4+C5]:w' };
      expect(fires('melody.no-motif', { ...grid, kind: 'MELODY_COMPOSE' }), 'parle sur un exercice de thème').toBe(true);
      expect(fires('melody.no-motif', { ...grid, kind: 'HARMONY_PROGRESSION' }), 'se tait sur une grille').toBe(false);
    },
  },
  {
    name: 'melody.climax — se tait sans intention de forme déclarée',
    run: () => {
      const early: CaseInput = { notation: 'C4:q C5:h. | B4:q A4:q G4:q F4:q | E4:q D4:q C4:h' };
      expect(fires('melody.climax', { ...early, styleProfile: { id: 'classical-common', targetMood: 'sad' } }),
        'parle quand une ambiance est visée').toBe(true);
      expect(fires('melody.climax', { ...early, styleProfile: { id: 'classical-common' } }),
        'se tait sans forme demandée').toBe(false);
      expect(fires('melody.climax', { ...early, styleProfile: { id: 'classical-common' }, constraints: { climaxWindow: [0.55, 0.85] } }),
        'parle dès que la fenêtre est déclarée').toBe(true);
    },
  },
  {
    name: 'rhythm.syncopation-target — n\'exige rien sans cible déclarée',
    run: () => {
      const straight: CaseInput = { notation: 'C4:q D4:q E4:q F4:q | G4:q A4:q B4:q C5:q' };
      expect(fires('rhythm.syncopation-target', straight), 'aucune cible : silence').toBe(false);
      expect(fires('rhythm.syncopation-target', { ...straight, constraints: { syncopationTarget: [0.2, 0.5] } }),
        'cible déclarée et non tenue : parle').toBe(true);
    },
  },
  {
    name: 'vl.leading-tone-resolution — une sensible réénoncée se juge sur son DÉPART',
    run: () => {
      // Si tenu sous deux dominantes puis résolu sur do : résolu UNE fois, pas
      // fautif deux fois. C'est l'écriture de m01-s34, que le moteur punissait.
      const held: CaseInput = { voices: ['A4:h E5:h | D5:w', 'B3:h B3:h | C4:w', 'G2:h G2:h | C3:w'] };
      expect(fires('vl.leading-tone-resolution', held), 'la répétition n\'est pas une non-résolution').toBe(false);
      // La même sensible, au SOPRANO (voix extrême) et sous une dominante
      // franche (I–IV–V7–I, do majeur sans ambiguïté), qui redescend au lieu de
      // monter : la faute reste une faute.
      const broken: CaseInput = {
        voices: ['C5:w | C5:w | B4:w | G4:w', 'E4:w | F4:w | D4:w | E4:w', 'G3:w | A3:w | F3:w | E3:w', 'C3:w | F3:w | G2:w | C3:w'],
      };
      expect(fires('vl.leading-tone-resolution', broken), 'descendue au lieu de résolue : faute').toBe(true);
    },
  },
  {
    name: 'melody.out-of-key — la FIGURE chromatique qui retombe est expliquée',
    run: () => {
      const key = { key: { tonic: 0, mode: 'major' } };
      // do–do♯–ré : la chromatique passe et RETOMBE dans la gamme (m01-l22).
      const figure: CaseInput = { notation: 'C4:q C#4:q D4:q E4:q | F4:q F#4:q G4:q C5:q', given: key };
      expect(fires('melody.out-of-key', figure), 'les notes de passage résolvent').toBe(false);
      // La même densité de chromatismes, mais qui ne retombent nulle part.
      const saturated: CaseInput = { notation: 'C4:q C#4:q D#4:q F#4:q | G#4:q A#4:q C#5:q D#5:q', given: key };
      expect(fires('melody.out-of-key', saturated), 'saturation : plus de cadre').toBe(true);
    },
  },
  {
    name: 'melody.out-of-key — le mode est lu, pas le majeur de la tonique',
    run: () => {
      // Ré dorien : le fa et le do naturels SONT la tonalité, pas des écarts.
      const dorian: CaseInput = {
        notation: 'D4:q E4:q F4:q G4:q | A4:q B4:q C5:q D5:q',
        given: { key: { tonic: 2, mode: 'dorian' } },
      };
      expect(fires('melody.out-of-key', dorian), 'ré dorien est dans sa gamme').toBe(false);
      // Les mêmes notes annoncées en ré MAJEUR : là, fa et do sont étrangers.
      const major: CaseInput = { ...dorian, given: { key: { tonic: 2, mode: 'major' } } };
      expect(fires('melody.out-of-key', major), 'annoncé majeur : deux degrés abaissés').toBe(true);
    },
  },
  {
    name: "melody.out-of-key — une note d'un accord chiffré est expliquée",
    run: () => {
      const key = { key: { tonic: 0, mode: 'major' } };
      // V/V : le fa♯ est la TIERCE de ré majeur, pas un accident.
      const secondary: CaseInput = {
        voices: ['A4:w | B4:w | C5:w', 'F#4:w | G4:w | E4:w', 'D3:w | G2:w | C3:w'],
        given: key,
      };
      expect(fires('melody.out-of-key', secondary), "tierce d'une dominante secondaire").toBe(false);
    },
  },
  {
    name: "melody.climax — la fenêtre vient du GABARIT de l'ambiance",
    run: () => {
      // Sommet unique à 50 % de la pièce : DANS la fenêtre que le gabarit
      // « triste » promet (47–87 %), HORS de celle de l'épique, qui culmine
      // beaucoup plus tard (67–100 %). Une même ligne, deux verdicts, parce que
      // les deux ambiances ne promettent pas la même chose.
      const line: CaseInput = { notation: 'C4:q D4:q E4:q F4:q | G4:q A4:q B4:q C5:q | E5:h C5:h | G4:q E4:q C4:h' };
      expect(fires('melody.climax', { ...line, styleProfile: { id: 'classical-common', targetMood: 'sad' } }),
        'le sommet est dans la fenêtre du gabarit triste').toBe(false);
      expect(fires('melody.climax', { ...line, styleProfile: { id: 'epic-film', targetMood: 'epic' } }),
        "le même sommet est trop tôt pour l'épique, qui culmine très tard").toBe(true);
    },
  },
  {
    name: 'melody.climax — une ambiance sans arche promise ne réclame pas de sommet',
    run: () => {
      const early: CaseInput = { notation: 'C5:h. C4:q | B4:q A4:q G4:q F4:q | E4:q D4:q C4:h' };
      // `scifi` est un gabarit PLAT : aucune arche promise.
      expect(fires('melody.climax', { ...early, styleProfile: { id: 'classical-common', targetMood: 'scifi' } }),
        'gabarit plat : pas de sommet à placer').toBe(false);
      // `weightless` n'est pas un gabarit du tout — c'est une étiquette d'atmosphère.
      expect(fires('melody.climax', { ...early, styleProfile: { id: 'classical-common', targetMood: 'weightless' } }),
        'étiquette inconnue du registre : aucune promesse').toBe(false);
      // `sad` en est un, non plat : là, un sommet au tout début se voit.
      expect(fires('melody.climax', { ...early, styleProfile: { id: 'classical-common', targetMood: 'sad' } }),
        'gabarit connu et non plat : le sommet est jugé').toBe(true);
    },
  },
  {
    name: 'melody.climax — une consigne à alternatives laisse le choix de la forme',
    run: () => {
      // Contour réalisé : une descente. La consigne admettait descent OU arch —
      // la pièce a choisi, et on ne lui réclame pas le sommet de l'autre.
      const descent: CaseInput = {
        notation: 'C5:q B4:q A4:q G4:q | F4:q E4:q D4:q C4:h',
        constraints: { contourShape: ['descent', 'arch'] },
        styleProfile: { id: 'classical-common', targetMood: 'sad' },
      };
      expect(fires('melody.climax', descent), 'la descente était admise').toBe(false);
      // La même ligne quand SEULE l'arche est admise : le checker `contourShape`
      // dira la faute, la règle de climax se tait — une faute, un message.
      const archOnly: CaseInput = { ...descent, constraints: { contourShape: ['arch'] } };
      expect(fires('melody.climax', archOnly), "silhouette hors consigne : c'est `contourShape` qui parle").toBe(false);
    },
  },
  {
    name: 'melody.leap-recovery — la dette commence à la SIXTE, pas à la quarte',
    run: () => {
      // Quartes et quintes justes enchaînées : un arpège, pas une dette.
      // `m01-l02-intervalles` : « la règle parle d'intervalles mélodiques >= 6te ».
      const arpege: CaseInput = { notation: 'C4:q F4:q C5:q G4:q | C4:h C4:h' };
      expect(fires('melody.leap-recovery', arpege), 'quartes et quintes : aucune dette').toBe(false);
      // Une sixte mineure non remboursée, elle, reste une dette.
      const sixte: CaseInput = { notation: 'C4:q Ab4:q C5:q G4:q | C4:h C4:h' };
      expect(fires('melody.leap-recovery', sixte), 'sixte repartant par saut : dette').toBe(true);
      // La même sixte, soldée par un degré conjoint en sens contraire.
      const soldee: CaseInput = { notation: 'C4:q Ab4:q G4:q F4:q | E4:h C4:h' };
      expect(fires('melody.leap-recovery', soldee), 'sixte puis seconde descendante : soldée').toBe(false);
    },
  },
];