import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('tension fixtures (S3.J2)', () => {
  it.each(fixtures)('$name', f => f.run());
});
