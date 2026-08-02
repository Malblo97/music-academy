import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('idiom fixtures (S2.J4)', () => {
  it.each(fixtures)('$name', f => f.run());
});
