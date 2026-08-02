import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('rule fixtures (S4.J1–J2)', () => {
  it.each(fixtures)('$name', f => f.run());
});
