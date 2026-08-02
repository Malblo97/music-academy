import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('motif fixtures (S2.J5)', () => {
  it.each(fixtures)('$name', f => f.run());
});
