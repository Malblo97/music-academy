import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('contour fixtures (S3.J1)', () => {
  it.each(fixtures)('$name', f => f.run());
});
