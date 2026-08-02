import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('chord-scale & swing fixtures (S3.J3)', () => {
  it.each(fixtures)('$name', f => f.run());
});
