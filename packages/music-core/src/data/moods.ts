/**
 * `MOOD_TEMPLATES` — annexe D du Manuel, **valeurs normatives copiées telles
 * quelles**. 16 points 0–1, chacun sourcé à sa spécification qualitative de
 * leçon. Recalibrage possible via le verrou d'auto-cohérence UNIQUEMENT
 * (Manuel §3.9 : si un gabarit ne sépare pas ses propres exemples, on recalibre
 * le gabarit, pas la fiche).
 *
 * Note de transcription : l'annexe s'intitule « LES 15 GABARITS » mais n'en
 * énumère que 14. Les 14 lignes sont reproduites ici sans en inventer une
 * quinzième ; l'écart est signalé, pas comblé.
 */
export const MOOD_TEMPLATES: Record<string, readonly number[]> = {
  default: [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.50, 0.60, 0.70, 0.85, 1.0, 0.80, 0.50, 0.30, 0.10],
  // climax haut TENU
  heroic: [0.20, 0.25, 0.30, 0.35, 0.40, 0.50, 0.55, 0.60, 0.70, 0.80, 0.90, 1.0, 1.0, 0.90, 0.60, 0.30],
  sad: [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.55, 0.60, 0.65, 0.70, 0.60, 0.45, 0.30, 0.20, 0.10],
  lullaby: [0.10, 0.12, 0.15, 0.18, 0.20, 0.22, 0.25, 0.28, 0.25, 0.22, 0.20, 0.18, 0.15, 0.12, 0.10, 0.08],
  // pics jamais résolus
  tension: [0.40, 0.50, 0.45, 0.60, 0.55, 0.70, 0.60, 0.75, 0.70, 0.85, 0.75, 0.90, 0.80, 0.95, 0.85, 0.90],
  ambiguous_dark: [0.30, 0.35, 0.40, 0.38, 0.45, 0.42, 0.50, 0.48, 0.55, 0.60, 0.70, 0.65, 0.50, 0.45, 0.40, 0.35],
  // micro-pics, pas de creux
  joyful: [0.25, 0.35, 0.28, 0.40, 0.32, 0.45, 0.35, 0.50, 0.40, 0.55, 0.45, 0.60, 0.50, 0.45, 0.35, 0.25],
  // paliers
  epic: [0.20, 0.25, 0.25, 0.25, 0.40, 0.45, 0.45, 0.45, 0.60, 0.65, 0.65, 0.65, 0.85, 1.0, 1.0, 0.70],
  // vagues, coda qui redescend
  romantic: [0.15, 0.30, 0.22, 0.40, 0.30, 0.50, 0.38, 0.62, 0.48, 0.80, 1.0, 0.85, 0.60, 0.40, 0.30, 0.18],
  // régime platitude + altitude
  mysterious: [0.40, 0.45, 0.38, 0.48, 0.42, 0.50, 0.44, 0.52, 0.46, 0.50, 0.42, 0.48, 0.44, 0.50, 0.46, 0.44],
  // idem
  scifi: [0.45, 0.48, 0.50, 0.48, 0.52, 0.50, 0.48, 0.52, 0.50, 0.54, 0.52, 0.50, 0.52, 0.50, 0.48, 0.46],
  // sommet modeste ~60 %
  western: [0.20, 0.24, 0.28, 0.32, 0.36, 0.40, 0.44, 0.48, 0.52, 0.55, 0.50, 0.44, 0.38, 0.32, 0.26, 0.20],
  // + couplage tension × harmonie
  jazz_ballad: [0.20, 0.30, 0.25, 0.38, 0.30, 0.45, 0.38, 0.55, 0.45, 0.65, 0.55, 0.70, 0.55, 0.42, 0.32, 0.22],
  // extension finale qui traîne
  elena: [0.15, 0.28, 0.22, 0.38, 0.30, 0.48, 0.38, 0.58, 0.48, 0.78, 1.0, 0.80, 0.62, 0.55, 0.58, 0.30],
};

/** Alias déclaratifs (annexe D) — les fiches nomment l'émotion, pas le gabarit. */
export const MOOD_ALIASES: Record<string, string> = {
  bittersweet: 'sad',
  'ambiguous-dark': 'ambiguous_dark',
  wonder: 'scifi',
  'noble-melancholy': 'sad',
  playful: 'joyful',
  comic: 'joyful', // anticlimax : V1
};

/** Antagonistes déclarés (Manuel §3.9) — le verrou n°4 les oppose deux à deux. */
export const MOOD_ANTAGONISTS: Record<string, string> = {
  joyful: 'sad',
  sad: 'joyful',
  epic: 'scifi',
  scifi: 'epic',
  heroic: 'mysterious',
  mysterious: 'heroic',
};

/** Le gabarit d'un mood, alias résolus. Lance si l'identifiant est inconnu. */
export function moodTemplate(moodId: string): readonly number[] {
  const id = MOOD_ALIASES[moodId] ?? moodId;
  const template = MOOD_TEMPLATES[id];
  if (!template) throw new Error(`moods : gabarit inconnu "${moodId}"`);
  return template;
}

/** Vrai si l'identifiant (ou son alias) a un gabarit. */
export function hasMood(moodId: string): boolean {
  return (MOOD_ALIASES[moodId] ?? moodId) in MOOD_TEMPLATES;
}
