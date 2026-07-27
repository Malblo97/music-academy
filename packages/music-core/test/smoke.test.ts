import { describe, it, expect } from 'vitest';
import { PPQ, TICKS } from '../src/index.js';
describe('smoke', () => {
  it('PPQ vaut 480 (Manuel §2.2)', () => expect(PPQ).toBe(480));
  it('TICKS.q vaut 480 (noire = PPQ)', () => expect(TICKS.q).toBe(480));
});