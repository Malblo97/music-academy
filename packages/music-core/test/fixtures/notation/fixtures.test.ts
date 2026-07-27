import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('notation fixtures (S1.J4)', () => {
  it.each(fixtures)('$name', f => f.run());
});
