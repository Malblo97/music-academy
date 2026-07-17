import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['react', 'react-*', 'next', 'next/*', 'node:*',
                  'fs', 'path', 'os', 'child_process', '@nestjs/*',
                  '@prisma/*', 'express', 'tone'],
          message: 'music-core est ISOMORPHE : zéro import d\'environnement (Manuel §2.1, D-T2). Il ne peut importer que lui-même et @ma/shared.'
        }]
      }]
    }
  }
);