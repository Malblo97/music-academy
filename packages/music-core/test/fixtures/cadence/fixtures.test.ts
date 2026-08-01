import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('cadence fixtures (S2.J3)', () => {
  it.each(fixtures)('$name', f => f.run());
});
