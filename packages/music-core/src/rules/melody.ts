import type { Issue, Note } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { judgedLine, judgedNotes, ruleIssue } from './types.js';
import { scalePcs } from '../analyzers/key.js';
import { STRICT_COVERAGE } from '../analyzers/collection.js';
import { climaxPlateau, expectedClimaxWindow } from '../analyzers/tension.js';
import type { CollectionFamily } from '../analyzers/collection.js';

/** Les collections qui constituent une grammaire de rechange assumée. */
const ALTERNATIVE_COLLECTIONS = new Set<CollectionFamily>(['whole-tone', 'octatonic', 'pentatonic', 'melodic-minor']);

/**
 * **Le saut qui contracte une DETTE : la sixte mineure et au-delà.**
 *
 * Deux seuils à ne pas confondre. Une quarte est déjà un saut — en deçà, la
 * ligne marche — mais toute la théorie mélodique du cursus réserve le
 * remboursement conjoint aux GRANDS intervalles. `m01-l02-intervalles` le dit
 * mot pour mot : « la règle `melody.leap-recovery` que tu rencontreras dès tes
 * premiers exercices parle d'intervalles mélodiques **≥ 6te** ». Et
 * `m02-l12-ambiances-3` nomme le geste canonique : « le couple grand saut +
 * résolution conjointe — l'élan (LA SIXTE) suivi du retour tendre ».
 *
 * Le code exigeait le remboursement dès la quarte : 83 des 91 alertes du corpus
 * portaient sur des quartes et des quintes justes — des intervalles consonants,
 * chantables, qui structurent tout arpège sans rien devoir à personne.
 */
const LEAP = 8;
/** Fenêtre de climax par défaut, quand la spec n'en déclare pas. */
const CLIMAX_WINDOW: [number, number] = [0.55, 0.85];
/** Part maximale de notes hors gamme avant que l'amortisseur ne cède. */
const OUT_OF_KEY_TOLERANCE = 0.12;
/** Répétitions exactes d'affilée à partir desquelles on parle de monotonie. */
const MONOTONY_REPEATS = 4;
/** Une phrase qui dépasse cette durée sans respirer étouffe l'auditeur. */
const MAX_PHRASE_TICKS = 1920 * 8;

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

/**
 * **L'exercice demande-t-il d'ÉCRIRE UNE MÉLODIE ?**
 *
 * Sur une progression harmonique, la voix supérieure n'est pas un thème : c'est
 * le produit des accords. Lui réclamer une cellule qui revient, une dette de
 * saut remboursée ou une conclusion sur 1̂ longue, c'est juger un exercice qui
 * n'a pas été donné — et `melody.no-motif` le dit elle-même : « la règle se
 * tait sur un exercice de conduite pure (harmonisation, contrepoint sur cantus
 * donné), où la matière vient d'ailleurs ».
 *
 * Le kind ne suffit pas seul : une spec d'harmonie qui déclare des contraintes
 * mélodiques (motif, contour, ambitus) demande bien une ligne, et la règle doit
 * alors parler.
 */
const MELODIC_KINDS = new Set(['MELODY_COMPOSE', 'HARMONIZE_MELODY', 'COUNTERPOINT']);

function judgesMelody(ctx: RuleCtx): boolean {
  const kind = typeof ctx.spec.kind === 'string' ? ctx.spec.kind : undefined;
  if (kind !== undefined && MELODIC_KINDS.has(kind)) return true;
  const c = ctx.spec.constraints ?? {};
  return c.mustUseMotif !== undefined
    || c.minMotifOccurrences !== undefined
    || c.requireMotifVariation !== undefined
    || c.contourShape !== undefined
    || c.maxLeap !== undefined
    || c.minConjunctRatio !== undefined
    || c.phraseStructure !== undefined;
}

/**
 * **La fenêtre de climax ATTENDUE par cette consigne**, ou `null` quand aucune
 * arche n'est promise.
 *
 * Trois sources, de la plus explicite à la plus implicite :
 *
 *  1. `climaxWindow` déclarée — la consigne a tranché, on la suit ;
 *  2. `contourShape` déclarée — si elle ne contient pas `arch`, la forme
 *     demandée n'est PAS une arche et la règle n'a rien à dire. Demander un
 *     sommet aux deux tiers d'une ligne dont le contour déclaré est
 *     « descent, plateau » (m02-e28) est une contradiction : sa note la plus
 *     aiguë est au début par construction ;
 *  3. l'ambiance visée — mais seulement si c'est un GABARIT connu, et non plat.
 *     La fenêtre vient alors du gabarit lui-même (`expectedClimaxWindow`).
 *
 * Le point 3 corrige la porte posée en passe 1, qui traitait tout `targetMood`
 * déclaré comme une promesse d'arche. Les specs de M3 s'en servent comme d'une
 * étiquette d'atmosphère — `weightless`, `dread`, `modal-world`, `the-roller`,
 * `menace` — qui ne figure dans aucun gabarit et ne promet aucune montée.
 */
function climaxExpectation(ctx: RuleCtx): [number, number] | null {
  const c = ctx.spec.constraints ?? {};

  const declared = c.climaxWindow;
  if (Array.isArray(declared) && declared.length === 2) return declared as [number, number];

  const shapes = c.contourShape;
  const declaresArch = Array.isArray(shapes) && shapes.includes('arch');
  if (Array.isArray(shapes) && !declaresArch) return null;
  // Une consigne qui propose des ALTERNATIVES (`["wave", "arch"]`) laisse le
  // choix : si la pièce a réalisé l'une des autres formes admises, elle a
  // obéi, et lui réclamer le sommet d'une arche qu'elle n'a pas choisie n'a
  // pas de sens. Et si la silhouette réalisée n'est admise par aucune, c'est
  // au checker `contourShape` de le dire — une faute, un message.
  if (Array.isArray(shapes)) {
    const realised = ctx.analysis.contour?.silhouette;
    if (realised && realised !== 'arch' && shapes.includes(realised)) return null;
    if (realised && !shapes.includes(realised)) return null;
  }

  const mood = ctx.spec.styleProfile?.targetMood;
  const fromMood = mood ? expectedClimaxWindow(mood) : null;
  // Un contour « arch » explicitement demandé vaut promesse, même si son
  // ambiance ne porte pas de gabarit : on retombe alors sur la norme du cursus.
  if (fromMood) return fromMood;
  return declaresArch ? CLIMAX_WINDOW : null;
}


/**
 * Les notes chromatiques qui SE RÉSOLVENT : celles dont la voisine immédiate,
 * dans leur propre ligne, est un degré de la gamme à un demi-ton.
 *
 * Le calcul se fait voix par voix quand la soumission en a — sur une texture
 * aplatie, la « note suivante » serait celle d'une autre voix, et n'importe
 * quel chromatisme paraîtrait résolu par accident.
 */
function resolvesBySemitone(ctx: RuleCtx, scale: ReadonlySet<number>): Set<Note> {
  const lines: readonly (readonly Note[])[] = ctx.analysis.voices ?? [ctx.analysis.notes];
  const out = new Set<Note>();
  for (const raw of lines) {
    const line = [...raw].sort((a, b) => a.start - b.start);
    for (let i = 0; i < line.length; i++) {
      const n = line[i]!;
      if (scale.has(pc(n.pitch))) continue;
      const next = line[i + 1];
      // Une figure RETOMBE dans la gamme : c'est ce qui la distingue de la
      // saturation chromatique. Excuser aussi les notes seulement ATTEINTES par
      // demi-ton depuis un degré reviendrait à absoudre n'importe quelle montée
      // chromatique intégrale — chaque note y est approchée d'un demi-ton.
      if (next && Math.abs(next.pitch - n.pitch) === 1 && scale.has(pc(next.pitch))) out.add(n);
    }
  }
  return out;
}

export const MELODY_RULES: Rule[] = [
  {
    id: 'melody.no-motif',
    severity: 'warning',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm02-l03',
    detect: (ctx: RuleCtx): Issue[] => {
      const report = ctx.analysis.motifs;
      if (!report) return [];
      if (!judgesMelody(ctx)) return [];
      if (report.bestMotif && report.bestMotif.occurrences.length >= 2) return [];
      return [ruleIssue({ id: 'melody.no-motif', severity: 'warning', lessonRef: 'm02-l03' }, undefined,
        'aucune cellule ne revient : il n\'y a rien à retenir dans cette mélodie')];
    },
    pedagogy: {
      why: "On ne retient pas une suite de notes, on retient une CELLULE qui revient. Sans elle, ta mélodie est jolie à la première écoute et oubliée à la seconde.",
      how: "Prends trois à cinq notes de ton début — celles que tu chanterais si on te demandait ton thème — et fais-les revenir au moins une fois, même transposées, même au rythme changé.",
      when: "Partout où l'on te demande de composer un thème. La règle se tait sur un exercice de conduite pure (harmonisation, contrepoint sur cantus donné), où la matière vient d'ailleurs.",
      commonMistake: "Écrire huit mesures de belles notes toutes différentes, en croyant que la variété est une qualité. La variété sans retour est du bavardage.",
      alternative: "Si tu veux vraiment éviter la répétition littérale : varie la cellule (transpose-la, augmente-la, inverse-la). Le lien reste audible, la surprise aussi.",
    },
  },
  {
    id: 'melody.monotony',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm02-l07',
    detect: (ctx: RuleCtx): Issue[] => {
      const report = ctx.analysis.motifs;
      if (!report) return [];
      if (report.maxExactRepetitions < MONOTONY_REPEATS) return [];
      if (report.hasVariedRepetition) return [];
      return [ruleIssue({ id: 'melody.monotony', severity: 'suggestion', lessonRef: 'm02-l07' },
        report.bestMotif?.anchor,
        `${report.maxExactRepetitions} énoncés EXACTEMENT identiques et aucune variation : la cellule se répète sans jamais se transformer`)];
    },
    pedagogy: {
      why: "Répéter installe ; répéter sans jamais bouger endort. La troisième fois, l'oreille a compris et attend autre chose.",
      how: "Garde les deux premiers énoncés identiques — c'est ce qui installe — puis change quelque chose au troisième : une note du sommet, une durée, la direction de la fin.",
      when: "Dans la plupart des styles. **Pas en thriller** : le profil `thriller-tension` met cette règle à zéro, parce que la répétition obstinée y EST le moyen (l'étau qui se resserre).",
      commonMistake: "Croire qu'on a fait une variation en changeant l'harmonie sous une mélodie identique. C'est une variation d'accompagnement — la ligne, elle, n'a pas bougé.",
      alternative: "La séquence : le même dessin, un degré plus haut. Tu répètes ET tu avances, dans le même geste.",
    },
  },
  {
    id: 'melody.climax',
    severity: 'warning',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm02-l06',
    detect: (ctx: RuleCtx): Issue[] => {
      const contour = ctx.analysis.contour;
      // La LIGNE, pas la texture : le sommet d'un choral est celui du soprano.
      const notes = judgedLine(ctx);
      if (!contour || notes.length < 4) return [];
      const total = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
      if (total === 0) return [];

      // Sa propre `when` fixe le périmètre : « dès qu'une LIGNE A UNE FORME À
      // DÉFENDRE ; un ostinato, un tapis, une pédale n'ont pas de climax ».
      const window = climaxExpectation(ctx);
      if (!window) return [];
      const [lo, hi] = window;

      const globals = contour.peaks.filter(p => p.isGlobal);

      const issues: Issue[] = [];
      const self = { id: 'melody.climax', severity: 'warning' as const, lessonRef: 'm02-l06' };
      if (globals.length > 1) {
        issues.push(ruleIssue(self, globals[1]!.at,
          `la note la plus aiguë est atteinte ${globals.length} fois : un sommet qui revient n'est plus un sommet`));
      }
      // **Décision n°36** : OÙ la pièce culmine est un fait de TENSION, pas de
      // hauteur — et cette règle comparait un pic de hauteur à une fenêtre que
      // `climaxExpectation` dérive, elle, du gabarit de TENSION. Les deux
      // lectures cohabitaient sous le même identifiant, avec deux chiffres
      // différents pour une seule affirmation.
      // **Décision n°38** : et la courbe qui répond est la saillance dédiée,
      // pas la courbe de tension, qui servait trois maîtres à la fois.
      const plateau = climaxPlateau(ctx.analysis.climax ?? []);
      if (plateau && !(plateau[0] <= hi && plateau[1] >= lo)) {
        issues.push(ruleIssue(self, Math.round(plateau[0] * total),
          `la tension culmine entre ${Math.round(plateau[0] * 100)} et ${Math.round(plateau[1] * 100)} % de la pièce — la fenêtre attendue est ${Math.round(lo * 100)}–${Math.round(hi * 100)} %`));
      }
      return issues;
    },
    pedagogy: {
      why: "Une mélodie raconte une montée vers un point et une retombée. Si le point le plus haut arrive trop tôt, tout ce qui suit est une redescente ; s'il arrive à la toute fin, il n'y a pas de retombée du tout.",
      how: "Place ta note la plus aiguë vers les deux tiers de la pièce, tiens-la, et ne la rejoue plus après. Les sommets intermédiaires doivent être plus BAS qu'elle, et de préférence croissants.",
      when: "Dès qu'une ligne a une forme à défendre. Un ostinato, un tapis, une pédale n'ont pas de climax — la règle ne les concerne pas.",
      commonMistake: "Toucher le sommet trois fois en croyant l'affirmer. Chaque rappel lui enlève de la valeur : le sommet vaut par sa rareté.",
      alternative: "Si ton matériau exige l'aigu tôt, redescends franchement et construis un SECOND sommet, plus haut, à sa place — l'échelle des sommets (m02-l06) est faite pour ça.",
    },
  },
  {
    id: 'melody.leap-recovery',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l07',
    detect: (ctx: RuleCtx): Issue[] => {
      // Un saut se juge DANS une ligne. Entre le soprano d'un temps et la
      // basse du suivant, il n'y a pas de saut : il y a deux voix.
      if (!judgesMelody(ctx)) return [];
      const notes = judgedLine(ctx);
      const issues: Issue[] = [];
      const self = { id: 'melody.leap-recovery', severity: 'suggestion' as const, lessonRef: 'm01-l07' };
      for (let i = 0; i < notes.length - 2; i++) {
        const leap = notes[i + 1]!.pitch - notes[i]!.pitch;
        if (Math.abs(leap) < LEAP) continue;
        const after = notes[i + 2]!.pitch - notes[i + 1]!.pitch;
        const contrary = Math.sign(after) === -Math.sign(leap);
        const conjunct = Math.abs(after) >= 1 && Math.abs(after) <= 2;
        if (contrary && conjunct) continue;
        issues.push(ruleIssue(self, notes[i + 1]!.start,
          `saut de ${Math.abs(leap)} demi-tons non remboursé : la note d'après repart ${contrary ? 'par saut' : 'dans la même direction'}`));
      }
      return issues;
    },
    pedagogy: {
      why: "Un saut est une dette : l'oreille est projetée quelque part et veut être ramenée. Un degré conjoint en sens contraire suffit à solder — c'est le geste le plus économique de toute la mélodie.",
      how: "Après un saut d'une quarte ou plus, redescends (ou remonte) d'un degré dans l'autre sens. Deux notes, et la ligne respire de nouveau.",
      when: "Partout, et **renforcé ×1.3 en `romantic-film`** : là, le geste saut-puis-récupération n'est pas une précaution, c'est la signature du style.",
      commonMistake: "Enchaîner deux sauts dans la même direction en croyant faire un élan. On fait surtout un arpège — et un arpège n'est pas une mélodie.",
      alternative: "Si tu veux vraiment enchaîner les sauts : reste dans un seul accord (l'oreille les entend alors comme une harmonie déployée) et solde la dette à la sortie.",
    },
  },
  {
    id: 'melody.out-of-key',
    severity: 'warning',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l22',
    detect: (ctx: RuleCtx): Issue[] => {
      const collection = ctx.analysis.collection;
      const notes = judgedNotes(ctx);
      if (!collection || notes.length === 0) return [];

      // La pièce vit dans une AUTRE collection DÉFINIE, et le dit clairement :
      // c'est exactement ce que propose l'`alternative` de cette règle — « change
      // de collection et déclare-le, le moteur juge alors chez toi ». Une pièce
      // octatonique n'a pas 24 % de notes fautives : elle a une autre grille.
      //
      // `chromatic` est explicitement EXCLUE de cette porte de sortie : elle
      // contient les douze notes, donc sa couverture vaut toujours 1, et
      // l'accepter reviendrait à éteindre la règle sur exactement la musique
      // qu'elle doit juger — « quand il y en a partout, il n'y a plus de cadre ».
      if (ALTERNATIVE_COLLECTIONS.has(collection.family) && collection.coverage >= STRICT_COVERAGE) return [];

      const key = ctx.analysis.key;
      // La gamme du MODE, pas le majeur supposé : une pièce en dorien était
      // jugée contre le majeur de sa tonique, sa tierce et sa septième mineures
      // comptées comme étrangères. Définition unique, partagée avec le checker
      // `key` (`analyzers/key.ts`).
      const scale = scalePcs(key.tonic, key.mode);

      const idioms = ctx.analysis.idioms ?? [];
      // Une note chromatique qui appartient à un ACCORD CHIFFRÉ est expliquée :
      // c'est la tierce d'une dominante secondaire, la fondamentale d'un accord
      // emprunté, une note de médiante chromatique. Le message de la règle dit
      // « non expliquées » — encore faut-il regarder l'explication. Sans cela,
      // elle parlait sur les exercices qui ENSEIGNENT le chromatisme :
      // `m01-e41-chromatic-figures`, `m01-e46-mediant-voyage`,
      // `m01-e36-dominant-chain`, `m03-e05-secret-passage`.
      const chords = ctx.analysis.chords ?? [];
      const inSomeChord = (n: { pitch: number; start: number }): boolean =>
        chords.some(c => c.from <= n.start && n.start < c.to && c.chord.pcs.includes(pc(n.pitch)));

      // La FIGURE CHROMATIQUE, telle que la règle la décrit elle-même dans son
      // `how` : « une note chromatique qui monte d'un demi-ton vers une note de
      // l'accord s'explique toute seule ». Le critère était énoncé et jamais
      // appliqué — d'où les alertes sur `m01-e41-chromatic-figures` et
      // `m02-e29-talk-to-changes`, dont les notes de passage résolvent toutes.
      const resolves = resolvesBySemitone(ctx, scale);

      const strangers = notes.filter(n =>
        !scale.has(pc(n.pitch))
        && !idioms.some(t => n.start >= t.from && n.start < t.to)
        && !inSomeChord(n)
        && !resolves.has(n));
      const ratio = strangers.length / notes.length;
      // L'amortisseur : quelques notes étrangères sont de la couleur, pas une faute.
      if (ratio <= OUT_OF_KEY_TOLERANCE) return [];
      return [ruleIssue({ id: 'melody.out-of-key', severity: 'warning', lessonRef: 'm01-l22' },
        strangers[0]!.start,
        `${Math.round(ratio * 100)} % de notes étrangères non expliquées : la tonalité ne tient plus`)];
    },
    pedagogy: {
      why: "Une note étrangère est un événement : elle attire l'oreille parce qu'elle sort du cadre. Quand il y en a partout, il n'y a plus de cadre, donc plus d'événement — juste du flou.",
      how: "Garde tes altérations pour les moments qui comptent, et RÉSOUS-LES : une note chromatique qui monte d'un demi-ton vers une note de l'accord s'explique toute seule.",
      when: "En musique tonale et modale. La règle s'amortit d'elle-même sous les tags d'idiomes (un napolitain, une sixte augmentée ne comptent pas), et l'étau du thriller assume sa dérive.",
      commonMistake: "Ajouter des altérations pour « faire savant ». Une altération non résolue ne fait pas savant, elle fait accident.",
      alternative: "Si tu veux ce son-là durablement, change de collection et déclare-le : un mode, une gamme par tons, une octatonique — le moteur juge alors chez toi, pas chez le voisin.",
    },
  },
  {
    id: 'melody.ending-weak',
    severity: 'warning',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm01-l16',
    detect: (ctx: RuleCtx): Issue[] => {
      // La note qu'on garde est la dernière du CHANT, pas la dernière basse.
      // Sur une grille, c'est la CADENCE qui conclut, et `requiredCadence` la juge.
      if (!judgesMelody(ctx)) return [];
      // Le `when` de cette règle dit : « une question laissée ouverte échappe à
      // la règle — MAIS DIS-LE DANS TA CONSIGNE. » Quand la consigne le dit,
      // c'est `mustEndOnDegrees` qui le dit, et c'est son checker qui juge la
      // finale. La règle n'a alors plus à imposer sa liste générique par-dessus :
      // `m02-e28` admet [2,5] (néo-noir, « ambiguous-dark »), sa contrainte
      // passait, et la règle lui reprochait quand même sa finale sur 2̂.
      if (ctx.spec.constraints?.mustEndOnDegrees !== undefined) return [];
      const notes = judgedLine(ctx);
      const last = notes[notes.length - 1];
      if (!last) return [];
      const degree = pc(last.pitch - ctx.analysis.key.tonic);
      const restful = degree === 0 || degree === 7;
      const long = last.duration >= 960;
      if (restful && long) return [];
      return [ruleIssue({ id: 'melody.ending-weak', severity: 'warning', lessonRef: 'm01-l16' }, last.start,
        !restful
          ? `la dernière note tombe sur le degré ${degree} : rien ne se referme`
          : 'la dernière note est trop brève pour qu\'on s\'y pose')];
    },
    pedagogy: {
      why: "La dernière note est celle qu'on garde. Si elle ne se pose pas, l'auditeur reste suspendu — ce qui est un choix magnifique quand c'est voulu, et une maladresse quand ça ne l'est pas.",
      how: "Termine sur la tonique (ou la dominante si tu veux laisser ouvert), et donne-lui de la durée : au moins une blanche, sur un temps fort.",
      when: "Dès qu'une pièce doit CONCLURE. Un fragment, un ostinato bouclé, une question laissée ouverte échappent à la règle — mais dis-le dans ta consigne.",
      commonMistake: "Finir sur la tierce en croyant que c'est plus doux. C'est plus doux, et c'est aussi moins fini : sache lequel des deux tu veux.",
      alternative: "Pour une fin ouverte assumée : arrête-toi sur la dominante, longue, et laisse le silence. C'est une suspension, pas une erreur — et le rapport la nommera comme telle.",
    },
  },
  {
    id: 'melody.phrase-breathing',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm02-l06',
    detect: (ctx: RuleCtx): Issue[] => {
      const phrases = ctx.analysis.phrases;
      if (!phrases || !judgesMelody(ctx)) return [];
      const self = { id: 'melody.phrase-breathing', severity: 'suggestion' as const, lessonRef: 'm02-l06' };
      return phrases.phrases
        .filter(p => p.to - p.from > MAX_PHRASE_TICKS)
        .map(p => ruleIssue(self, p.from,
          `${Math.round((p.to - p.from) / 1920)} mesures sans respiration : la phrase ne reprend jamais son souffle`));
    },
    pedagogy: {
      why: "On écoute comme on respire. Une ligne qui ne s'arrête jamais épuise l'auditeur avant de l'émouvoir — et elle empêche d'entendre où commencent et finissent les idées.",
      how: "Place un silence, ou une note longue qui boucle la mesure, toutes les quatre à huit mesures. C'est là que l'auditeur range ce qu'il vient d'entendre.",
      when: "Sur les lignes chantées ou soufflées surtout, où la respiration est physique. Un tapis de cordes ou un arpège de harpe peuvent couler sans fin.",
      commonMistake: "Confondre respiration et arrêt. Une respiration peut être une croche de silence : il ne s'agit pas de casser l'élan, mais de le ponctuer.",
      alternative: "L'élision : la note qui conclut une phrase ET lance la suivante. Tu ne respires pas, mais la frontière reste audible — c'est le geste avancé de m02-l06.",
    },
  },
  {
    id: 'melody.tension-placement',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['mono', 'harmony', 'voices', 'parts', 'midi'],
    lessonRef: 'm02-l10',
    detect: (ctx: RuleCtx): Issue[] => {
      // « Où la tension culmine » est la MÊME affirmation que celle de
      // `melody.climax` : les deux règles doivent la lire sur la même courbe,
      // sous peine de sortir deux chiffres pour un seul fait dans un seul
      // rapport — exactement la contradiction que la décision n°36 avait
      // corrigée entre hauteur et tension. C'est donc la saillance (n°38).
      const curve = ctx.analysis.climax;
      if (!curve || curve.length < 4) return [];
      // Même périmètre que `melody.climax` : sa `when` dit « dès qu'une AMBIANCE
      // EST VISÉE ». Sans arche promise, il n'y a rien à placer.
      if (!climaxExpectation(ctx)) return [];
      const peak = curve.indexOf(Math.max(...curve));
      const position = peak / (curve.length - 1);
      if (position >= 0.5 && position <= 0.9) return [];
      return [ruleIssue({ id: 'melody.tension-placement', severity: 'suggestion', lessonRef: 'm02-l10' }, undefined,
        `la tension culmine à ${Math.round(position * 100)} % : ${position < 0.5 ? 'trop tôt, tout ce qui suit retombe' : 'si tard que la retombée n\'a plus de place'}`)];
    },
    pedagogy: {
      why: "La tension est une dette qu'on contracte puis qu'on rembourse. Le moment où elle culmine décide de la forme entière de la pièce.",
      how: "Fais monter jusqu'aux deux tiers environ, puis redescends. Registre, densité, dissonance et surprise sont tes quatre leviers — ils n'ont pas besoin de monter ensemble.",
      when: "Dès qu'une ambiance est visée. **Poids zéro en `thriller-tension`** : là, la non-résolution EST le but, et une tension qui ne retombe jamais est la réussite, pas la faute.",
      commonMistake: "Tout mettre au même endroit — l'aigu, le fort, le dense et le dissonant sur la même mesure. Le climax gagne à être préparé par un seul moteur à la fois.",
      alternative: "L'arche en paliers : monter, tenir, monter encore. C'est le gabarit `epic`, et il place son sommet très tard sans jamais paraître en retard.",
    },
  },
];
