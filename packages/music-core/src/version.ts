/**
 * La version du moteur, isolée de `index.ts` : le pipeline l'estampille dans
 * chaque `FeedbackReport` (le rapport doit dire QUI l'a produit), et l'importer
 * depuis l'index ferait un cycle — l'index exporte le pipeline.
 *
 * 0.2 : le pipeline et le verrou n°2 (semaines 5–6).
 */
export const ENGINE_VER = '0.2.0';
