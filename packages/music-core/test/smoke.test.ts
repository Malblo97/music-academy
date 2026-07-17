import { describe, it, expect } from 'vitest';
import { PPQ } from '../src/index.js';
describe('smoke', () => { it('PPQ vaut 480 (Manuel §2.2)', () => expect(PPQ).toBe(480)); });