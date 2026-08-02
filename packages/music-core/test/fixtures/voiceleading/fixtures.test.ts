import { describe, it } from 'vitest';
import { fixtures } from './fixtures.js';

describe('voice-leading fixtures (S3.J4)', () => {
  it.each(fixtures)('$name', f => f.run());
});
