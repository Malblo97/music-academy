import type { Part } from '../types.js';
import { measureSwingRatio } from '../notation/swing.js';

export interface SwingPartReport {
  partId: string;
  /**
   * `null` = la question ne se pose pas : aucune croche de contretemps à
   * mesurer. **F-44** — une walking bass en noires ne swingue par rien, et le
   * moteur doit répondre « n/a », pas « 1.0 » ni « faux ».
   */
  ratio: number | null;
}

/**
 * `swingReport(parts)` (F-44) — le ratio de swing PAR PARTIE. Une section
 * rythmique peut swinguer pendant que la basse marche : un seul chiffre pour
 * tout l'ensemble mentirait sur les deux.
 */
export function swingReport(parts: readonly Part[]): SwingPartReport[] {
  return parts.map(part => ({
    partId: part.instrumentId,
    ratio: measureSwingRatio([...part.notes]),
  }));
}

export { measureSwingRatio } from '../notation/swing.js';
