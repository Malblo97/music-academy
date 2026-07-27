import { PPQ } from '../types.js';
import type { Note } from '../types.js';

/** Décale déterministiquement les croches de CONTRETEMPS. ratio 2.0 => le "et" au triolet. */
export function applySwing(notes: Note[], ratio: number): Note[] {
  const half = PPQ / 2;                          // 240 = la croche
  const off = Math.round(PPQ * ratio / (1 + ratio)) - half; // ex. r=2 → 320-240=+80 ticks
  return notes.map(n => {
    const pos = n.start % PPQ;
    const isOffbeatEighth = pos === half && n.duration <= half + 1;
    if (!isOffbeatEighth) return n;
    return { ...n, start: n.start + off, duration: Math.max(1, n.duration - off) };
  });
}

/** Mesure : ratio moyen des paires on/off ; null si aucune croche de contretemps (F-44). */
export function measureSwingRatio(notes: Note[]): number | null {
  const half = PPQ / 2;
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const ratios: number[] = [];

  for (const on of sorted) {
    if (on.start % PPQ !== 0) continue; // pas une position "on" (début de temps)
    const beatStart = on.start;
    const partner = sorted.find(n => n.start > beatStart && n.start < beatStart + PPQ && n.duration <= half + 1);
    if (!partner) continue;
    const off = (partner.start - beatStart) - half;
    if (off === 0) continue; // croche déjà "on" : pas de contretemps swingué à mesurer
    ratios.push((off + half) / (half - off)); // miroir de applySwing : off = round(PPQ*r/(1+r)) - half
  }

  if (ratios.length === 0) return null;
  return ratios.reduce((a, b) => a + b, 0) / ratios.length;
}
