import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('chord fixtures (S2.J2)', () => {
  it.each(fixtures)('$name', f => f.run());
});
