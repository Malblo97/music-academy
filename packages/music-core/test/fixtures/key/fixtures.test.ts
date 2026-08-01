import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('key fixtures (S2.J1)', () => {
  it.each(fixtures)('$name', f => f.run());
});
