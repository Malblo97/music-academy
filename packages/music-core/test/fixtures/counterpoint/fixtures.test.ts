import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('counterpoint fixtures (S3.J5)', () => {
  it.each(fixtures)('$name', f => f.run());
});
