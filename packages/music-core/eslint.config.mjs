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
  },
  {
    // Dérogation scopée : ces fichiers lisent du contenu réel (packages/content)
    // pour le verrou n°3 (S1.J4). D-T2 protège le moteur LIVRÉ (src/) et le reste
    // de la suite de tests, qui restent isomorphes ; ce harnais de fixtures/locks
    // n'est ni l'un ni l'autre.
    files: [
      'test/fixtures/notation/solutions.test.ts',
      'test/solutions.ts',
      'test/locks/roundtrip.test.ts',
    ],
    rules: { 'no-restricted-imports': 'off' }
  }
);