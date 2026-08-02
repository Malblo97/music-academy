import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('orchestration fixtures (fil rouge S2–S3)', () => {
  it.each(fixtures)('$name', f => f.run());
});
