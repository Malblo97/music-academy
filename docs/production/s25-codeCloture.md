# SECTION 25 — LE CODE DE CLÔTURE : `instruments.ts`, `MOOD_TEMPLATES`, extension `findMotifs`

## 25.1 `orchestration/instruments.ts` — la transcription des fiches

Principe de gouvernance (même logique que §7.9 pour les règles) : **chaque valeur numérique doit être traçable à sa fiche** — les commentaires citent la leçon source. Quand une fiche évoluera, ce fichier suivra dans la même PR : le cours et le moteur ne divergent pas.

```typescript
import type { Role } from "../types";

export type InstrumentFamily =
  | "strings" | "winds" | "brass" | "perc" | "keys" | "voice" | "synth";

export interface RegisterZone {
  from: number;              // MIDI inclus
  to: number;                // MIDI inclus
  color: string;             // la description de la fiche — affichée telle quelle
                             // par orch.register-color (§7.7 : la règle "mentor")
  exposedRisk?: boolean;     // zone risquée si exposée (canard, gorge, grave pp…)
}

export interface AvoidPair { id: string; reason: string; context?: string }

export interface InstrumentDef {
  id: string;
  label: string;             // affichage FR
  family: InstrumentFamily;
  lessonId: string;          // traçabilité fiche ↔ données
  range: { low: number; high: number };       // praticable — orch.range-violation
  sweetSpot: { low: number; high: number };
  registerZones: RegisterZone[];
  dynamicPower: { pp: number; ff: number };   // 1..10 — orch.balance (§4.1.6)
  agility: number;                             // 1..10 — orch.agility
  sustain: "unlimited" | "breath" | "lips" | "decay";
  // breath/lips alimentent orch.endurance avec des budgets différents (§25.1.2)
  roles: Role[];                               // par ordre de fréquence réelle
  blendsWith: string[];
  avoidWith: AvoidPair[];
  transposing?: { interval: number; label: string };  // écrit vs réel (V1 partition)
  isSection?: boolean;       // pupitre de section (archet alterné = sustain réel)
  notes?: string;            // mentions de fiche (sourdines, piccolo…)
}

// Rappels MIDI : C4 = 60 ; une octave = 12.

export const INSTRUMENTS: Record<string, InstrumentDef> = {

  // ─────────────── CORDES (m05-l02 → l05) ───────────────

  "violin-1": {
    id: "violin-1", label: "Violons I", family: "strings",
    lessonId: "m05-l02-violins",
    range: { low: 55, high: 95 },            // G3–B6 (l02 : au-delà = risqué en section)
    sweetSpot: { low: 57, high: 88 },        // A3–E6
    registerZones: [
      { from: 55, to: 62, color: "chaud, râpeux, voilé — la corde de sol : le lyrisme viscéral" },
      { from: 63, to: 88, color: "le chant — toute l'expressivité humaine vit ici" },
      { from: 89, to: 95, color: "cristal, tendu, irréel — nappes célestes ou brillance de tutti" },
    ],
    dynamicPower: { pp: 2, ff: 7 },          // l02 : par pupitre ; la section multiplie
    agility: 10, sustain: "unlimited", isSection: true,
    roles: ["melody", "countermelody", "texture", "harmony"],
    blendsWith: ["flute", "oboe", "cello", "french-horn", "violin-2"],
    avoidWith: [],
  },

  "violin-2": {
    id: "violin-2", label: "Violons II", family: "strings",
    lessonId: "m05-l02-violins",
    range: { low: 55, high: 95 },
    sweetSpot: { low: 55, high: 84 },        // l02 : registre typique plus médium
    registerZones: [
      { from: 55, to: 62, color: "chaud, râpeux — la corde de sol" },
      { from: 63, to: 84, color: "le médium du contrechant et de l'harmonie" },
      { from: 85, to: 95, color: "aigu de doublure — rarement seul ici" },
    ],
    dynamicPower: { pp: 2, ff: 7 },
    agility: 10, sustain: "unlimited", isSection: true,
    roles: ["countermelody", "harmony", "texture", "melody"],
    // l02 : "l'alto aigu de l'harmonie, pas un écho" — roles inversés vs violin-1
    blendsWith: ["violin-1", "viola", "clarinet"],
    avoidWith: [],
  },

  "viola": {
    id: "viola", label: "Altos", family: "strings",
    lessonId: "m05-l03-viola",
    range: { low: 48, high: 88 },            // C3–E6
    sweetSpot: { low: 48, high: 74 },        // C3–D5 (l03 : 90 % du rôle)
    registerZones: [
      { from: 48, to: 55, color: "sombre, boisé, grain profond" },
      { from: 56, to: 74, color: "voilé, doux-amer — LA couleur alto" },
      { from: 75, to: 88, color: "tendu, plaintif, intense — une tension timbrale VOULUE, pas un violon raté" },
    ],
    dynamicPower: { pp: 2, ff: 6 },          // l03 : le moins puissant des cordes
    agility: 8, sustain: "unlimited", isSection: true,
    roles: ["harmony", "countermelody", "texture", "melody"],
    blendsWith: ["cello", "bassoon", "english-horn", "clarinet", "violin-2"],
    avoidWith: [],
  },

  "cello": {
    id: "cello", label: "Violoncelles", family: "strings",
    lessonId: "m05-l04-cello",
    range: { low: 36, high: 81 },            // C2–A5 (section : prudence après E5)
    sweetSpot: { low: 36, high: 64 },        // C2–E4
    registerZones: [
      { from: 36, to: 43, color: "assise, gravité, ombre — le profond" },
      { from: 44, to: 54, color: "basse ronde et souple — la marche" },
      { from: 55, to: 64, color: "LE chant ténor : viril, chaleureux — l'or pur, à dépenser avec parcimonie" },
      { from: 65, to: 81, color: "intense, presque douloureux" },
    ],
    dynamicPower: { pp: 2, ff: 7 },
    agility: 8, sustain: "unlimited", isSection: true,
    roles: ["bass", "melody", "countermelody", "harmony", "rhythm"],
    blendsWith: ["french-horn", "double-bass", "bassoon", "viola"],
    avoidWith: [],
  },

  "double-bass": {
    id: "double-bass", label: "Contrebasses", family: "strings",
    lessonId: "m05-l05-double-bass",
    range: { low: 28, high: 55 },            // E1–G3 réel
    sweetSpot: { low: 28, high: 50 },        // E1–D3
    registerZones: [
      { from: 28, to: 45, color: "le plancher : l'assise, la menace — son entrée/sortie est un événement" },
      { from: 46, to: 55, color: "haut, tendu, grognant — rare" },
    ],
    dynamicPower: { pp: 3, ff: 7 },          // l05 : + une présence physique
    agility: 4, sustain: "unlimited", isSection: true,
    roles: ["bass", "texture", "rhythm"],
    blendsWith: ["cello", "tuba", "bassoon"],
    avoidWith: [],
    transposing: { interval: 12, label: "écrite une octave au-dessus du réel" },
  },

  // ─────────────── BOIS (m05-l06 → l08) ───────────────

  "flute": {
    id: "flute", label: "Flûte", family: "winds",
    lessonId: "m05-l06-flute",
    range: { low: 60, high: 96 },            // C4–C7
    sweetSpot: { low: 67, high: 91 },        // G4–G6
    registerZones: [
      { from: 60, to: 66, color: "velouté, SUPERBE et INAUDIBLE sous quoi que ce soit — solo exposé ou rien", exposedRisk: true },
      { from: 67, to: 91, color: "clair, souple — le dessin au-dessus de l'orchestre" },
      { from: 92, to: 96, color: "brillant, perçant, dominant" },
    ],
    // l06, LE piège : la puissance CROÎT avec la hauteur —
    // modélisé par powerByZone, consommé par orch.balance/masking (§25.1.1)
    dynamicPower: { pp: 2, ff: 5 },
    agility: 10, sustain: "breath",
    roles: ["melody", "texture", "countermelody"],
    blendsWith: ["violin-1", "oboe", "clarinet", "harp"],
    avoidWith: [],
    notes: "Piccolo = +1 octave, perce TOUT en ff (le sommet du tutti) ; jamais discret.",
  },

  "oboe": {
    id: "oboe", label: "Hautbois", family: "winds",
    lessonId: "m05-l07-oboe",
    range: { low: 58, high: 93 },            // Bb3–A6
    sweetSpot: { low: 60, high: 81 },        // C4–A5
    registerZones: [
      { from: 58, to: 59, color: "épais, « canard » — risqué exposé", exposedRisk: true },
      { from: 60, to: 81, color: "LE hautbois : pastoral, poignant — la voix qui parle" },
      { from: 82, to: 93, color: "fin, pâle, fragile" },
    ],
    dynamicPower: { pp: 3, ff: 5 },          // l07 : pénétrance hors norme malgré le chiffre
    agility: 7, sustain: "breath",
    roles: ["melody", "countermelody", "harmony"],
    blendsWith: ["flute", "violin-1"],
    avoidWith: [
      { id: "trumpet", reason: "deux solos focalisants simultanés : deux voix qui parlent en même temps", context: "solos concurrents" },
    ],
    notes: "Fondu FAIBLE : chaque note de tenue s'entend (orch.blend-risk). Cor anglais = le hautbois alto, la mélancolie incarnée (fiche V1).",
  },

  "clarinet": {
    id: "clarinet", label: "Clarinette", family: "winds",
    lessonId: "m05-l08-clarinet",
    range: { low: 50, high: 94 },            // D3–Bb6 réel
    sweetSpot: { low: 50, high: 84 },        // le plus large des bois (l08)
    registerZones: [
      { from: 50, to: 65, color: "chalumeau : sombre, boisé, mystérieux — le nocturne, le jazz, le conte qui commence" },
      { from: 66, to: 70, color: "la gorge : pâle, terne — à traverser vite, pas à exposer", exposedRisk: true },
      { from: 71, to: 84, color: "clairon : clair, chantant, souple — le chant fondu" },
      { from: 85, to: 94, color: "suraigu perçant, criard — effet" },
    ],
    dynamicPower: { pp: 1, ff: 6 },          // l08 : LE ppp de l'orchestre (subtone)
    agility: 9, sustain: "breath",
    roles: ["melody", "harmony", "texture", "countermelody"],
    blendsWith: ["viola", "french-horn", "flute", "bassoon", "violin-2"],
    avoidWith: [],
    transposing: { interval: 2, label: "en si♭ : écrite un ton au-dessus du réel" },
    notes: "Le caméléon : entrées invisibles (tenue ppp DANS un accord sonnant). Clarinette basse = le chalumeau vers l'abîme (fiche V1).",
  },

  // ─────────────── CUIVRES (m05-l09, §5.2) ───────────────

  "trumpet": {
    id: "trumpet", label: "Trompette", family: "brass",
    lessonId: "m05-l09-trumpet",
    range: { low: 52, high: 84 },            // E3–C6
    sweetSpot: { low: 55, high: 79 },        // G3–G5
    registerZones: [
      { from: 52, to: 54, color: "cuivré sombre, voilé — rare" },
      { from: 55, to: 79, color: "franc, noble, héroïque — le signal" },
      { from: 80, to: 84, color: "éclatant, triomphal — COÛTEUX (endurance)", exposedRisk: true },
    ],
    dynamicPower: { pp: 3, ff: 10 },         // l09 : le sommet de l'orchestre
    agility: 7, sustain: "lips",
    roles: ["melody", "rhythm", "harmony"],
    blendsWith: ["trombone", "french-horn"],
    avoidWith: [
      { id: "french-horn", reason: "à l'unisson ff, la trompette avale le cor — préférer octaves ou registres séparés", context: "unisson ff" },
      { id: "oboe", reason: "deux solos focalisants simultanés", context: "solos concurrents" },
    ],
    notes: "Sourdines = un AUTRE instrument : straight (néo-noir, distant), cup (nostalgie), harmon (le noir au néon). 2–4 mesures de silence pour poser/ôter — à écrire.",
  },

  "french-horn": {
    id: "french-horn", label: "Cor", family: "brass",
    lessonId: "m05-l12-french-horn",
    range: { low: 34, high: 77 },            // §5.2 : B1–F5 réel
    sweetSpot: { low: 46, high: 70 },        // C3–C5... — §5.2 : 46=Bb2 ; la fiche dit C3–C5 :
    // trace : sweetSpot littéral de la fiche §1.4 = { 46, 70 } — conservé tel quel (source §1.4/§5.2)
    registerZones: [
      { from: 34, to: 45, color: "sombre, pédale, menace sourde — risqué en pp, lent à parler", exposedRisk: true },
      { from: 46, to: 65, color: "noble, chaleureux, fondu — LE registre du cor : 90 % de ton écriture" },
      { from: 66, to: 77, color: "héroïque, tendu, FATIGANT — préparé, bref, récompensé", exposedRisk: true },
    ],
    dynamicPower: { pp: 2, ff: 9 },
    agility: 4, sustain: "lips",
    roles: ["harmony", "countermelody", "melody", "texture"],
    blendsWith: ["cello", "bassoon", "trombone", "viola", "clarinet"],
    avoidWith: [
      { id: "trumpet", reason: "à l'unisson ff, le cor disparaît", context: "unisson ff" },
    ],
    transposing: { interval: 7, label: "en fa : écrit une quinte au-dessus du réel" },
    notes: "Mélodie ff = cors à l'unisson par 2 ou 4, jamais seul. L'attaque « ronde » (~30 ms) : ni percussif ni traits rapides.",
  },

  // ─────────────── CLAVIER (m05-l10) ───────────────

  "piano": {
    id: "piano", label: "Piano", family: "keys",
    lessonId: "m05-l10-piano",
    range: { low: 21, high: 108 },           // A0–C8
    sweetSpot: { low: 36, high: 96 },
    registerZones: [
      { from: 21, to: 47, color: "graves : puissance percussive — JAMAIS serré (la pédale n'excuse rien)" },
      { from: 48, to: 84, color: "le médium : l'ostinato, le lyrisme intime, le liant" },
      { from: 85, to: 108, color: "la goutte, le cristal — la solitude dans la reverb" },
    ],
    dynamicPower: { pp: 1, ff: 9 },
    agility: 10, sustain: "decay",           // AUCUNE tenue vraie (l10) —
    // orch.* : une "tenue" piano > 2 mesures déclenche une info register-color dédiée
    roles: ["melody", "harmony", "rhythm", "texture", "bass"],
    blendsWith: ["strings-section", "harp", "celesta"],
    avoidWith: [],
    notes: "L'instrument qui MENT sur l'orchestre : tenues, densité, grave, dynamique-timbre (l10 §2).",
  },
};

// ── Helpers consommés par orchestration/checks.ts (§4.1.6) ──────

export function getInstrument(id: string): InstrumentDef {
  const def = INSTRUMENTS[id];
  if (!def) throw new Error(`Unknown instrument: ${id}`);   // échec bruyant (§19.1)
  return def;
}

export function zoneOf(def: InstrumentDef, pitch: number): RegisterZone | null {
  return def.registerZones.find(z => pitch >= z.from && pitch <= z.to) ?? null;
}

/** §25.1.1 — Puissance effective : interpolation pp→ff par la dynamique,
 *  corrigée par la zone pour les cas fiches (flûte : croît avec la hauteur). */
export function effectivePower(def: InstrumentDef, pitch: number, velocity: number): number {
  const t = Math.max(0, Math.min(1, (velocity - 20) / 90));   // ~pp → ~ff
  let p = def.dynamicPower.pp + t * (def.dynamicPower.ff - def.dynamicPower.pp);
  if (def.id === "flute") {
    // l06 : grave 2/10, suraigu 6/10 — le facteur de zone module ±60 %
    const h = (pitch - def.range.low) / (def.range.high - def.range.low);
    p *= 0.4 + h * 1.2;
  }
  return p;
}

/** §25.1.2 — Budgets d'endurance par type de tenue (orch.endurance, §7.7).
 *  Valeurs en mesures de jeu continu avant repos requis, à 4/4 ♩=100 —
 *  calibrage beta comme les seuils de §8.8. */
export const ENDURANCE_BUDGET: Record<string, { normal: number; highRegister: number }> = {
  breath: { normal: 8, highRegister: 6 },     // bois : la respiration (l06/l07)
  lips:   { normal: 12, highRegister: 4 },    // cuivres : l'aigu coûte (l09, §5.2)
  unlimited: { normal: Infinity, highRegister: Infinity },
  decay:  { normal: Infinity, highRegister: Infinity },
};
```

**Périmètre assumé** : 10 définitions = les fiches rédigées. Les mentions (piccolo, cor anglais, clarinette basse) et les pupitres V1 (trombone, tuba, timbales, harpe, chœur…) entreront avec leurs fiches — le champ `notes` porte déjà l'essentiel pour le feedback. `instrumentPool` de m05-e08 (§5.4 C) référence des ids V1 (trombone, tuba, timpani…) : **la spec de e08 est amendée au pool MVP** (les 10 + `strings-section` alias) — correction de cohérence actée, à répercuter dans `packages/content`.

## 25.2 `melody.ts` — `MOOD_TEMPLATES` complet + `archFit` raffiné

Chaque gabarit : 16 points, calibrés depuis les fiches (§10.2 en portait 6 ; les 9 nouveaux viennent des leçons d'ambiance et de genre, source citée).

```typescript
/** Gabarits de courbe de tension par mood — 16 points, 0..1.
 *  Source de calibrage : les fiches m02-l10→l14, m09-l01→l04.
 *  Le commentaire de chaque gabarit cite sa spécification qualitative. */
export const MOOD_TEMPLATES: Record<string, number[]> = {

  // ── existants (§10.2), inchangés ──
  default:  [.10,.15,.20,.25,.30,.35,.40,.50,.60,.70,.85,1.0,.80,.50,.30,.10],
  heroic:   [.20,.25,.30,.35,.40,.50,.55,.60,.70,.80,.90,1.0,1.0,.90,.60,.30],
  sad:      [.15,.20,.25,.30,.35,.40,.45,.55,.60,.65,.70,.60,.45,.30,.20,.10],
  lullaby:  [.10,.12,.15,.18,.20,.22,.25,.28,.25,.22,.20,.18,.15,.12,.10,.08],
  tension:  [.40,.50,.45,.60,.55,.70,.60,.75,.70,.85,.75,.90,.80,.95,.85,.90],
  ambiguous_dark: [.30,.35,.40,.38,.45,.42,.50,.48,.55,.60,.70,.65,.50,.45,.40,.35],

  // ── m02-l10 : "arche basse et rebondie, micro-pics fréquents,
  //    jamais de creux profond — la joie ne s'inquiète pas longtemps" ──
  joyful:   [.25,.35,.28,.40,.32,.45,.35,.50,.40,.55,.45,.60,.50,.45,.35,.25],

  // ── m02-l11 / m09-l02 : "paliers successifs : montée-plateau-montée-
  //    plateau, climax final à 85 % — l'épique gravit par étages" ──
  epic:     [.20,.25,.25,.25,.40,.45,.45,.45,.60,.65,.65,.65,.85,1.0,1.0,.70],

  // ── m02-l12 / m09-l01 : "montée par vagues (chaque vague plus haute),
  //    climax à 65 % atteint par saut, longue détente" + la coda qui
  //    redescend d'un étage (m09-l01 §5) ──
  romantic: [.15,.30,.22,.40,.30,.50,.38,.62,.48,.80,1.0,.85,.60,.40,.30,.18],

  // ── m02-l12 : "ligne moyenne ondulante SANS résolution : ni pics
  //    francs ni repos — l'énigme ne conclut pas" ──
  mysterious: [.40,.45,.38,.48,.42,.50,.44,.52,.46,.50,.42,.48,.44,.50,.46,.44],

  // ── m02-l13 : "courbe quasi PLATE à altitude moyenne-haute : la
  //    fascination constante" ──
  scifi:    [.45,.48,.50,.48,.52,.50,.48,.52,.50,.54,.52,.50,.52,.50,.48,.46],

  // ── m02-l14 : "arche très aplatie, sommet modeste à 60 % — la
  //    dignité tranquille" ──
  western:  [.20,.24,.28,.32,.36,.40,.44,.48,.52,.55,.50,.44,.38,.32,.26,.20],

  // ── m02-l14 : "arche douce dont les pics tombent sur les tensions
  //    harmoniques" — la forme est douce, le couplage harmonie fait
  //    le reste (voir archFit ci-dessous) ──
  jazz_ballad: [.20,.30,.25,.38,.30,.45,.38,.55,.45,.65,.55,.70,.55,.42,.32,.22],

  // ── m02-l15 / e30 : "montée par vagues, climax 65 %, extension
  //    finale" — comme romantic mais la détente TRAÎNE (la phrase qui
  //    n'arrive pas à finir) et remonte d'un souffle avant de poser ──
  elena:    [.15,.28,.22,.38,.30,.48,.38,.58,.48,.78,1.0,.80,.62,.55,.58,.30],
};

/** Alias déclaratifs : les moods de specs qui pointent un gabarit existant.
 *  (targetMood des exercices §18/§24 : "bittersweet", "wonder"…) */
export const MOOD_ALIASES: Record<string, string> = {
  bittersweet: "sad", "ambiguous-dark": "ambiguous_dark",
  wonder: "scifi", "noble-melancholy": "sad", playful: "joyful",
  comic: "joyful",   // l'anticlimax volontaire (m01 §7.2) : traité en V1
};

export function archFit(curve: number[], mood: string): number {
  if (curve.length < 4) return 0.5;
  const key = MOOD_TEMPLATES[mood] ? mood : (MOOD_ALIASES[mood] ?? "default");
  const template = MOOD_TEMPLATES[key] ?? MOOD_TEMPLATES.default;
  const resampled = resample(curve, 16);
  const r = pearson(resampled, template);

  // Raffinement 1 — moods "plats" (mysterious, scifi) : la corrélation de
  // Pearson est instable sur des gabarits à faible variance. On note alors
  // la PLATITUDE et l'ALTITUDE plutôt que la forme :
  const variance = template.reduce((s, x, _, a) =>
    s + (x - a.reduce((p, q) => p + q, 0) / a.length) ** 2, 0) / 16;
  if (variance < 0.004) {
    const tMean = template.reduce((s, x) => s + x, 0) / 16;
    const cMean = resampled.reduce((s, x) => s + x, 0) / 16;
    const cVar = resampled.reduce((s, x) => s + (x - cMean) ** 2, 0) / 16;
    const altitudeFit = 1 - Math.min(1, Math.abs(cMean - tMean) * 2.5);
    const flatnessFit = 1 - Math.min(1, Math.sqrt(cVar) * 3);
    return Math.max(0, altitudeFit * 0.5 + flatnessFit * 0.5);
  }
  return Math.max(0, r);
}

/** Raffinement 2 — jazz_ballad : bonus de couplage tension×harmonie.
 *  Appelé par le FeedbackEngine quand chords est disponible (m02-l14 :
 *  "le climax sur la 9, pas sur la tonique"). */
export function tensionHarmonyCoupling(
  notes: Note[], curve: number[], chords: ChordEvent[],
): number {
  // Les pics locaux de la courbe tombent-ils sur des tensions (9/11/13)
  // ou des notes étrangères qualifiées de l'accord courant ?
  const peaks = curve
    .map((v, i) => ({ v, i }))
    .filter(({ v, i }) => i > 0 && i < curve.length - 1
      && v > curve[i - 1] && v > curve[i + 1] && v > 0.5);
  if (!peaks.length) return 0.5;
  const sorted = sortByStart(notes);
  const onTension = peaks.filter(({ i }) => {
    const n = sorted[Math.min(i, sorted.length - 1)];
    const ch = chords.find(c => n.start >= c.start && n.start < c.start + c.duration);
    if (!ch) return false;
    const rel = ((n.pitch % 12) - ch.root + 12) % 12;
    return [1, 2, 3, 5, 6, 8, 9].includes(rel);   // l'espace des tensions (l18 M1)
  });
  return onTension.length / peaks.length;
}
```

Verrou CI ajouté (famille §19.6) : **auto-cohérence des gabarits** — pour chaque leçon d'ambiance, sa solution de référence doit obtenir `archFit ≥ 0.6` sur SON mood et `< son score` sur les moods antagonistes déclarés (`joyful` vs `sad`, `epic` vs `scifi`, `heroic` vs `mysterious`). Si le gabarit d'une fiche ne sépare pas ses propres exemples, c'est le gabarit qu'on recalibre, pas la fiche.

## 25.3 `findMotifs` v2 — inversion et fragmentation

Extension promise (§24.7), livrée en deux blocs minimaux sur le code de §10.1.

```typescript
// types étendus
export type VariationType = "exact" | "transposed" | "rhythmic" | "inverted";

export interface MotifReport {
  motifs: Motif[];
  bestMotif: Motif | null;
  hasVariedRepetition: boolean;
  maxExactRepetitions: number;
  fragments: FragmentReport[];        // ⭐ nouveau
}

export interface FragmentReport {
  parentMotifIndex: number;           // index dans motifs[]
  intervalShape: number[];            // le sous-motif (longueur ≥ 2 intervalles... 
                                      // — soit ≥ 3 notes, l'aspérité minimale)
  occurrences: MotifOccurrence[];     // hors occurrences du motif complet
  isDistinctive: boolean;             // porte l'aspérité du parent (§25.3.2)
}
```

**Bloc 1 — l'inversion** (~12 lignes dans la boucle de comparaison de §10.1) :

```typescript
// dans la boucle des candidats j, après le test sameArr(cand, ref) :
else if (sameArr(cand.intervals, ref.intervals.map(x => -x))) {
  // Miroir vertical (m02-l04 §2). Deux gardes contre les faux positifs :
  // 1. longueur ≥ 3 intervalles (4 notes) — l'inversion d'un geste de
  //    2 intervalles est trop souvent fortuite ;
  // 2. le rythme doit être conservé (exact ou quantifié égal) — c'est lui
  //    qui porte l'identité pendant que le geste se retourne (l04, l02 §1).
  if (ref.intervals.length >= 3 && sameArr(cand.rhythm, ref.rhythm)) {
    variation = "inverted";
    transposition = undefined;   // non pertinent pour un miroir
  }
}
```

**Bloc 2 — la fragmentation** (fonction séparée, appelée en fin de `findMotifs`) :

```typescript
function detectFragments(
  notes: Note[], motifs: Motif[], minOcc = 3,
): FragmentReport[] {
  const reports: FragmentReport[] = [];

  motifs.slice(0, 3).forEach((parent, pIdx) => {        // les 3 motifs de tête
    const L = parent.intervalShape.length;               // en intervalles
    if (L < 3) return;                                   // rien à fragmenter

    // §25.3.2 — l'aspérité du parent : l'intervalle |max| et la durée
    // la plus atypique (ratio le plus éloigné de 1) — m02-l04 : "fragmente
    // la partie DISTINCTIVE, pas le remplissage"
    const maxLeapIdx = parent.intervalShape
      .reduce((mi, x, i, a) => Math.abs(x) > Math.abs(a[mi]) ? i : mi, 0);
    const oddRhythmIdx = parent.rhythmShape
      .reduce((mi, r, i, a) => Math.abs(Math.log(r)) > Math.abs(Math.log(a[mi])) ? i : mi, 0);

    // Fenêtres couvertes par les occurrences complètes du parent → exclues
    const covered = new Set<number>();
    parent.occurrences.forEach(o => {
      for (let k = 0; k <= L; k++) covered.add(o.startIndex + k);
    });

    // Chercher chaque sous-forme contiguë de longueur 2..L-1 intervalles
    for (let len = L - 1; len >= 2; len--) {
      for (let off = 0; off + len <= L; off++) {
        const sub = parent.intervalShape.slice(off, off + len);
        const occ: MotifOccurrence[] = [];
        for (let i = 0; i + len < notes.length; i++) {
          if (covered.has(i)) continue;                   // hors motif complet
          const cand = shapeAt(notes, i, len + 1).intervals;
          const match = sameArr(cand, sub)
            || (cand.length === sub.length
                && cand.every((x, k) => x === sub[k]));   // transposé = même forme
          if (match) occ.push({
            startIndex: i, startTick: notes[i].start,
            endTick: notes[i + len].start + notes[i + len].duration,
            variation: notes[i].pitch === notes[parent.occurrences[0].startIndex + off].pitch
              ? "exact" : "transposed",
          });
        }
        if (occ.length >= minOcc) {
          reports.push({
            parentMotifIndex: pIdx,
            intervalShape: sub,
            occurrences: occ,
            isDistinctive: (maxLeapIdx >= off && maxLeapIdx < off + len)
                        || (oddRhythmIdx >= off && oddRhythmIdx <= off + len),
          });
          return;   // le fragment le plus long par parent suffit (anti-bruit)
        }
      }
    }
  });
  return reports;
}
```

Consommateurs branchés : `requireFragmentation` (e08, e30 : `fragments.some(f => f.isDistinctive && f.occurrences.length >= 3)` — et le feedback distingue « tu fragmentes, mais le remplissage : martèle l'aspérité » quand `isDistinctive` est faux, la pédagogie de l04 §erreurs mot pour mot) ; `minTransformations`/`allowedTransformations` (e07 : les types comptés = variations `rhythmic`+`inverted` du rapport + fragmentation détectée) ; et le **craft positif** de M2 (une fragmentation distinctive au climax = strength mesurée).

Tests ajoutés au verrou §19.6, par propriétés :

```typescript
// L'inversion d'une mélodie est détectée comme inverted par rapport à elle-même
fc.assert(fc.property(arbCell({ minIntervals: 3 }), cell => {
  const inverted = invertNotes(cell);
  const r = findMotifs([...cell, ...gap(), ...inverted]);
  return r.motifs.some(m => m.occurrences.some(o => o.variation === "inverted"));
}));
// La fragmentation ne "vole" jamais les occurrences complètes
// (covered-set : fragments.occurrences ∩ motif.occurrences = ∅)
```

---

## Checklist de validation Section 25

- [x] `instruments.ts` : 10 définitions traçables ligne à ligne aux fiches (lessonId, commentaires-citations), zones à `exposedRisk`, `effectivePower` avec le cas flûte, budgets d'endurance breath/lips distincts
- [x] Gouvernance : fiche et données évoluent dans la même PR ; échec bruyant sur id inconnu ; incohérence e08/pool MVP détectée et corrigée côté contenu
- [x] `MOOD_TEMPLATES` : 15 gabarits, chacun sourcé à sa spécification qualitative ; alias déclaratifs pour les targetMood des specs
- [x] `archFit` raffiné : régime « platitude+altitude » pour les gabarits à faible variance (mysterious, scifi) — Pearson seul y était instable ; couplage tension×harmonie pour jazz_ballad
- [x] Verrou CI d'auto-cohérence : les solutions de référence séparent leurs propres gabarits
- [x] `findMotifs` v2 : inversion (gardes longueur+rythme) et fragmentation (aspérité, exclusion des occurrences complètes, anti-bruit) — ~90 lignes, tests par propriétés
- [x] Tous les consommateurs des specs §18/§24 ont désormais leur implémentation ou leur mécanique spécifiée : **le contenu MVP est exécutable de bout en bout sur le papier**

---

**Point de confirmation.** Le triptyque contenu–moteur–données est clos pour le MVP. Fronts restants, tous de production ou d'expansion : **(a)** les solutions de référence (55 au total — je peux composer le premier lot m01-s07→s20 en notation textuelle, avec auto-vérification mentale contre les contraintes) ; **(b)** m05-l01 (l'intro du Module 5) + un échantillon de quiz `<QuizBlock>` ; **(c)** V1 : le Module 10 (Cubase/workflow) ou le Module 6 (sound design hybride) — les deux gros blocs suivants de la roadmap §6.6. Tu choisis ?