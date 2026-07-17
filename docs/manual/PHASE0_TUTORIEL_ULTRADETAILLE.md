# PHASE 0 — TUTORIEL ULTRA-DÉTAILLÉ (jour par jour, fichier par fichier)
## Semaine 0 : de « rien » à « le contenu MVP est dans le repo, compté et validé »

**Objectif de la semaine** : à la fin du jour 5, tu as un monorepo qui build en CI, les documents de référence versés, et **M1 + M2 + M5 + M9 intégralement extraits** (55 leçons/fiches, 87 specs, 56 solutions, 55 quiz), prouvés par `pnpm content:count`. Rien d'autre. Pas une ligne de moteur, pas un écran — la fondation.

**Durées** : compte 5 jours pleins en solo (J1 outillage+repo · J2 docs+gabarits · J3–J5 extraction). En duo : 3 jours (l'un fait J1–J2, l'autre commence M1 dès J2).

---

# JOUR 1 — OUTILLAGE ET MONOREPO

## 1.1 La décision de mode (30 min, avant tout)

**QUOI** : le premier fichier du projet. **OÙ** : tu le créeras en 1.4 (`docs/DECISIONS_LOCALES.md`) — pour l'instant, écris sur papier : mode (solo/duo/équipe), jours/semaine, et la date du jalon « verrou n°2 vert sur M1+M2 » (solo : aujourd'hui + 8 semaines ; duo : + 6). Bloque les créneaux dans ton calendrier MAINTENANT. **FINI QUAND** : les créneaux existent dans ton agenda.

## 1.2 L'outillage machine (45 min)

```bash
# --- Node LTS >= 20 via pnpm ---
curl -fsSL https://get.pnpm.io/install.sh | sh -
# ferme/rouvre ton terminal, puis :
pnpm env use --global lts
node -v    # attendu : v20.x ou v22.x
pnpm -v    # attendu : >= 9

# --- Git configuré ---
git config --global user.name "TonNom"
git config --global user.email "ton@email"
git config --global init.defaultBranch main
```

**Les comptes (crée-les tous, 30 min, tu configureras plus tard)** — coche au fur et à mesure :
- [ ] GitHub — crée le repo **privé** `music-academy` (vide, sans README)
- [ ] Vercel · [ ] Railway ou Fly.io · [ ] Neon (Postgres) · [ ] Cloudflare R2 · [ ] Resend · [ ] Sentry · [ ] Stripe (tu n'y touches plus avant la Phase 6)

**FINI QUAND** : `node -v`, `pnpm -v`, `git config user.email` répondent, le repo GitHub privé existe.

## 1.3 Le monorepo — création complète (2–3 h)

On ne passe PAS par `create-turbo` (il génère du bruit) : on construit à la main, fichier par fichier. Copie-colle tel quel.

```bash
mkdir music-academy && cd music-academy && git init
mkdir -p apps packages/music-core/src packages/music-core/test/fixtures \
         packages/shared/src packages/content docs/manual docs/production docs/qa \
         .github/workflows
```

### Fichier 1 — `.gitignore`
```
node_modules/
.turbo/
dist/
.next/
.env
.env.*
coverage/
*.wav
*.mp4
```
*(les WAV/MP4 vivront sur R2, jamais dans git — seuls les manifestes JSON sont versionnés)*

### Fichier 2 — `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Fichier 3 — `package.json` (racine)
```json
{
  "name": "music-academy",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "content:count": "pnpm --filter @ma/content count",
    "analyze": "pnpm --filter @ma/music-core analyze"
  },
  "devDependencies": {
    "turbo": "^2.1.0",
    "typescript": "^5.5.0",
    "prettier": "^3.3.0"
  }
}
```

### Fichier 4 — `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "lint":      { "outputs": [] },
    "typecheck": { "outputs": [] },
    "test":      { "outputs": ["coverage/**"] },
    "build":     { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] }
  }
}
```

### Fichier 5 — `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "declaration": true
  }
}
```

### Fichier 6 — `packages/music-core/package.json`
```json
{
  "name": "@ma/music-core",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "lint": "eslint src test",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "analyze": "tsx scripts/analyze.ts"
  },
  "devDependencies": {
    "eslint": "^9.10.0",
    "typescript-eslint": "^8.5.0",
    "tsx": "^4.19.0",
    "vitest": "^2.1.0"
  }
}
```

### Fichier 7 — `packages/music-core/eslint.config.mjs` — **LE verrou d'isomorphisme**
```js
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
```

### Fichier 8 — `packages/music-core/tsconfig.json`
```json
{ "extends": "../../tsconfig.base.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["src", "test", "scripts"] }
```

### Fichier 9 — `packages/music-core/src/index.ts` (stub honnête — sera remplacé en Phase 1)
```ts
/** music-core — moteur musical isomorphe. Manuel §3, Consolidation §3. */
export const ENGINE_VER = '0.1.0';
export const PPQ = 480;
```

### Fichier 10 — `packages/music-core/test/smoke.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { PPQ } from '../src/index.js';
describe('smoke', () => { it('PPQ vaut 480 (Manuel §2.2)', () => expect(PPQ).toBe(480)); });
```

### Fichier 11 — `packages/shared/package.json`
```json
{ "name": "@ma/shared", "version": "0.1.0", "type": "module",
  "main": "./src/index.ts",
  "scripts": { "lint": "echo ok", "typecheck": "tsc --noEmit", "test": "echo no-tests" },
  "dependencies": { "zod": "^3.23.0" } }
```
+ `packages/shared/tsconfig.json` (identique au fichier 8) + `packages/shared/src/index.ts` : `export {};` (stub).

### Fichier 12 — `packages/content/package.json`
```json
{ "name": "@ma/content", "version": "0.1.0", "type": "module",
  "scripts": { "lint": "echo ok", "typecheck": "echo ok",
               "test": "echo no-tests", "count": "tsx scripts/count.ts" },
  "devDependencies": { "tsx": "^4.19.0" } }
```

### Fichier 13 — `.github/workflows/ci.yml`
```yaml
name: ci
on: { push: { branches: [main] }, pull_request: {} }
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm content:count        # échouera tant que 0.4 n'est pas fini : c'est VOULU
        continue-on-error: true         # passe à false à la fin du J5
```

### Installation et premier commit
```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm test        # tout doit passer
git add -A && git commit -m "chore: monorepo skeleton (Manuel §2.1)"
git remote add origin git@github.com:TOI/music-academy.git
git push -u origin main
```

## 1.4 Les trois vérifications de fin de J1 (obligatoires)

1. **La CI est verte sur GitHub** (onglet Actions).
2. **Le verrou d'isomorphisme mord** : ajoute `import fs from 'fs';` en haut de `packages/music-core/src/index.ts` → `pnpm lint` doit ÉCHOUER avec ton message. Retire la ligne. Si ça ne mord pas, corrige avant de dormir.
3. **`docs/DECISIONS_LOCALES.md` existe** avec l'entrée n°1 :
```md
# Décisions locales d'exécution (complète le registre §6 du Manuel)
| n° | Date | Décision | Pourquoi |
|---|---|---|---|
| 1 | 2026-07-XX | Mode: solo, 5 j/sem. Jalon « verrou n°2 vert M1+M2 » : 2026-09-XX | — |
```
Commit : `git commit -am "docs: décision n°1 (mode d'exécution)"`.

✅ **JOUR 1 FINI QUAND** : CI verte + verrou testé-en-le-violant + décision n°1 commitée.

---

# JOUR 2 — LES DOCUMENTS DE RÉFÉRENCE ET LES GABARITS D'EXTRACTION

## 2.1 Verser la connaissance (matin, ~2 h)

**QUOI** : les 4 sources dans `docs/`. **OÙ / CONTENU** :

1. `docs/manual/MANUEL_MAITRE_v1.0.md` — le fichier livré, tel quel.
2. `docs/manual/CONSOLIDATION_v1.1.md` — idem.
3. `docs/manual/GUIDE_EXECUTION_v2.md` — idem (ce guide-ci le détaille pour la Phase 0).
4. `docs/production/` — **les sections de conversation, une par fichier** : `s01-architecture.md` … `s86-assets.md`. Méthode pratique : ouvre chaque conversation, copie chaque section (du titre `# SECTION NN` au point de confirmation inclus) dans son fichier. C'est mécanique et long (~1 h 30) mais c'est ta **source de vérité d'extraction** — plus jamais tu ne rouvriras un chat pour chercher une leçon.

**Convention de nommage** : `sNN-<mot-clé>.md` (s20-m2-lecons.md, s26-solutions-m1.md, s63-solutions-m3-lot1.md, s84-quiz-m1.md…). Ajoute `docs/production/INDEX.md` : la table §2 de la Consolidation, avec en face de chaque section le nom de fichier.

**FINI QUAND** : `ls docs/production | wc -l` ≥ 40 fichiers, et INDEX.md permet de trouver n'importe quel contenu en < 30 s (teste : « où est la solution m02-e14 ? » → INDEX → s28).

## 2.2 La structure de `packages/content/` + les module.json (30 min)

```bash
cd packages/content
mkdir -p modules/module-01-fondamentaux/{lessons,exercises,quizzes} \
         modules/module-02-melodie/{lessons,exercises,quizzes} \
         modules/module-05-instrumentation/{lessons,quizzes} \
         modules/module-09-genres/{lessons,exercises,quizzes} \
         solutions/{m01,m02} assets/la-remise generator/recipes scripts
```

**Les 4 `module.json` (contenu exact)** — `modules/module-01-fondamentaux/module.json` :
```json
{ "id": "module-01-fondamentaux", "title": "Fondamentaux", "tier": "MVP",
  "order": 1, "minLevel": 0 }
```
Idem pour : `module-02-melodie` (order 2, minLevel 0), `module-05-instrumentation` (order 5, **minLevel 9** — gating Manuel §1.5), `module-09-genres` (order 9, **minLevel 9**).

## 2.3 Les quatre gabarits `_TEMPLATE` (1 h — tu les copieras 200 fois, soigne-les)

**OÙ** : `packages/content/_templates/`. Crée les 4 fichiers suivants, qui matérialisent le Manuel §4 :

**`_templates/lesson.mdx`**
```mdx
---
id: mNN-lNN-slug
module: module-NN-slug
title: ""
estMinutes: 20
skills: {}
---
<!-- CORPS : copie VERBATIM depuis docs/production/sXX.
     Seule édition permise : les renvois "§X.Y" (numérotation de conversation)
     → renvoi produit ("lNN", "mNN-lNN"). Note chaque substitution dans le commit. -->
<QuizBlock id="mNN-lNN-quiz" questions={5} />
<LessonFooter exercises={[]} />
```

**`_templates/exercise.json`**
```json
{ "id": "mNN-eNN-slug", "lessonId": "mNN-lNN-slug", "title": "",
  "kind": "MELODY_COMPOSE", "difficulty": 4, "xpReward": 60,
  "skills": {}, "spec": { "prompt": "", "given": {}, "constraints": {},
  "styleProfile": { "id": "classical-common" },
  "rubric": { "correctness": 30, "constraints": 45, "craft": 25 } } }
```

**`_templates/solution.json`**
```json
{ "exerciseId": "mNN-eNN-slug", "notation": "", "authorNotes": "" }
```
*(kinds non notationnels : remplace `notation` par `payload` — F-33. Au MVP, tout est notationnel sauf les `submissionParts` de m02-e30 : `payload: { "parts": [{ "partId": "elena", "notation": "..." }, { "partId": "perso", "notation": "...", "userBrief": "..." }] }`.)*

**`_templates/quiz.json`**
```json
{ "id": "mNN-lNN-quiz", "items": [
  { "q": "", "options": ["", "", "", ""], "answer": 0, "why": "" },
  { "q": "", "play": "", "options": ["", "", "", ""], "answer": 0, "why": "" } ] }
```

## 2.4 Le manifeste « La Remise » (30 min — il est court, fais-le maintenant)

**OÙ** : `packages/content/assets/la-remise/manifest.json`. **CONTENU EXACT** (valeurs Consolidation §3.4, F-36 + F-49) :
```json
{ "id": "la-remise", "video": { "durationSec": 90, "fps": 24,
    "files": { "clean": "assets/la-remise/la-remise_clean_1080p24.mp4",
               "tc": "assets/la-remise/la-remise_tc_1080p24.mp4" } },
  "spotting": { "tempo": 96.8, "meter": "4/4" },
  "markers": [
    { "id": "IN", "tc": "00:00:00", "kind": "in" },
    { "id": "B1", "tc": "00:00:31", "kind": "bascule", "label": "le lieu — la porte s'ouvre" },
    { "id": "B2", "tc": "00:01:02", "kind": "bascule", "bar": 26, "beat": 1, "label": "la ponctuation — la malle" },
    { "id": "H1", "tc": "00:01:08", "kind": "hit", "label": "la porte claque" },
    { "id": "B3", "tc": "00:01:22", "kind": "bascule", "label": "la compréhension" },
    { "id": "H2", "tc": "00:01:34", "kind": "hit", "label": "il referme — regard porte" },
    { "id": "OUT", "tc": "00:01:30", "kind": "out" } ],
  "fredonTarget": {
    "notation": "D4:q F4:q E4:q D4:q | A4:h G4:q F4:q | E4:q F4:q D4:h | C4:q D4:q A3:h",
    "repeat": "x2, reprise variée librement",
    "errorBrief": ["m3: mi à l'octave sup", "m6 (reprise): sol à l'octave inf",
                   "m5: segment A4-G4 chanté deux fois", "tempo flottant ±8%",
                   "fin parlée ~2s (à couper par l'élève)"],
    "file": "assets/la-remise/fredon-du-real.wav" } }
```
⚠ **Anomalie à trancher toi-même, tout de suite (exercice réel de la règle §7.4)** : H2 (1'34") est APRÈS l'OUT (1'30") — c'est une incohérence héritée du brief §86. Décision recommandée : `OUT = 00:01:36` (la vidéo dure 96 s de tournage, 90 s utiles + marge) OU `H2 = 00:01:28`. Choisis, corrige le JSON, et inscris la décision n°2 dans `DECISIONS_LOCALES.md`. *(Oui, c'est volontairement ton premier arbitrage : la procédure compte plus que le choix.)*

✅ **JOUR 2 FINI QUAND** : docs/production peuplé + INDEX · 4 module.json · 4 templates · manifest.json commité avec la décision n°2.

---

# JOURS 3–5 — L'EXTRACTION DU CONTENU MVP

## 3.0 La méthode générale (lis ceci avant de commencer)

1. **Un module à la fois, dans l'ordre M1 → M2 → M5 → M9.** Dans un module : leçons → specs → solutions → quiz (les leçons contiennent les footers qui te donnent la liste exacte des specs).
2. **Rythme de commit** : 1 commit par lot de ~5 fichiers (`content(m01): lessons l01-l05`). Jamais de commit géant.
3. **Verbatim** : tu es copiste, pas éditeur. Trois éditions autorisées seulement : (a) renvois de section → renvois produits ; (b) amendements de specs listés en 3.4 ; (c) typographie cassée par le copier-coller (voir pièges 3.6).
4. **Le doute** : si une section source est ambiguë (ID absent, deux versions), tu n'inventes pas — tu inscris une décision dans DECISIONS_LOCALES.md et tu appliques. C'est la règle d'or, dès le premier jour.

## 3.1 JOUR 3 — MODULE 1 (25 leçons, 49 specs, 27 solutions, 25 quiz)

### 3.1.a Les 25 leçons — la table de référence (titres canoniques, Manuel §5.1 + sections 84–85)

| ID (slug à confirmer sur la source) | Titre | Source | Footer attendu |
|---|---|---|---|
| m01-l01-notes-et-clavier | Les notes et le clavier | s11 | e01, e02 |
| m01-l02-intervalles | Les intervalles (+ table des sens « cinéma ») | s11 | e03–e05 |
| m01-l03-gammes-majeures | Les gammes majeures | s11 | … |
| m01-l04-degres | Les degrés | s11 | |
| m01-l05-cycle-des-quintes | Le cycle des quintes | s12 | |
| m01-l06-gammes-mineures | Les mineures — les deux mondes | s12 | |
| m01-l07-modes | Les 7 modes, notes-signatures | s12 | |
| m01-l08-rythme-syncope | Rythme et syncope (fenêtres, 3+3+2) | s12 | |
| m01-l09-dynamiques | Le budget de nuances | s13 | |
| m01-l10-triades | Les triades | s13 | |
| m01-l11-charpente-habillage | Charpente et habillage | s13 | |
| m01-l12-basse-renversements | La basse et les renversements | s13 | |
| m01-l13-tension-resolution | Tension/résolution — la dette | s14 | |
| m01-l14-septiemes-guide-tones | Les 7es et les guide tones | s14 | |
| m01-l15-fonctions-tsd | Les fonctions T-S-D | s14 | |
| m01-l16-cadences-periode | Les cadences et la période | s15 | |
| m01-l17-enrichissements | Enrichissements (sus, add9, maj7) | s15 | |
| m01-l18-dominantes-secondaires | Les dominantes secondaires | s15 | |
| m01-l19-subv | Le subV tritonique | s16 | |
| m01-l20-emprunts-trois-portes | Les emprunts — les trois portes | s16 | |
| m01-l21-gear-change | Le gear change légitime | s16 | |
| m01-l22-figures-chromatiques | Les six figures + line cliché | s17 | |
| m01-l23-modulations-pivot | Le pivot notarié | s17 | |
| m01-l24-mediantes | Les médiantes chromatiques | s17 | |
| m01-l25-synthese-depart | Synthèse : « Départ » + protocole 7 étapes | s18 | e48, e49 |

*(Les numéros de sections-sources 11–18 sont indicatifs — ta référence exacte est `docs/production/INDEX.md`. Si le slug de la source diffère de cette table : **le slug de la source gagne**, les IDs sont immuables — Manuel §7.2.)*

**Protocole par leçon (8–12 min chacune)** :
```bash
cp _templates/lesson.mdx modules/module-01-fondamentaux/lessons/m01-l01-notes-et-clavier.mdx
```
1. Remplis le frontmatter (id, module, title, estMinutes de la source, skills de la source).
2. Colle le corps verbatim (de « ### Pourquoi… » au récapitulatif).
3. Vérifie les 8 invariants du gabarit §4.1 : Pourquoi ✓ · sections numérotées ✓ · ≥1 MusicExample ✓ · table Erreurs ✓ · récapitulatif ✓ · QuizBlock ✓ · LessonFooter ✓ · renvois croisés convertis ✓.
4. Coche la ligne dans ton fichier de suivi `docs/qa/extraction-m01.md` (une table 25×4 : leçon / specs / solutions / quiz).

### 3.1.b Les 49 specs (m01-e01 → m01-e49)
La liste exacte = **l'union des LessonFooter** que tu viens d'extraire. Pour chacune : `cp _templates/exercise.json …` puis remplis depuis la source (s11–s18 contiennent les specs JSON complètes du MVP — copie-les telles quelles, elles sont déjà au format §4.2).
**Contrôle en fin de lot** : `ls exercises | wc -l` → 49 ; aucun ID de footer sans fichier ; aucun fichier sans footer.

### 3.1.c Les 27 solutions (`solutions/m01/`)
Source : s26–s27 (+ les amendements de findings intégrés — les solutions publiées y sont déjà conformes). Une solution = un fichier `m01-eNN.json`. ⚠ Tous les exercices n'ont PAS de solution (les 49 specs M1 comptent des quiz/EAR à réponses en spec) : la liste canonique des 27 est celle de la section source — ton compte-cible est **27, ni 26 ni 28** (F-9 a réglé ça une fois pour toutes).

### 3.1.d Les 25 quiz
Sources : les 8 historiques (l01–l08, section quiz MVP d'origine) + s84 (l09–l21) + s85.1 (l22–l25). Copie chaque quiz dans le format template ; les items ▶ portent leur notation dans `play`.

✅ **JOUR 3 FINI QUAND** : `docs/qa/extraction-m01.md` = 25 lignes toutes cochées ×4, et les comptes bruts : 25 mdx · 49 json · 27 json · 25 json.

## 3.2 JOUR 4 — MODULES 2 ET 5

### 3.2.a M2 (15 leçons — sources s20–s21 ; 30 specs — s24 ; 29 solutions — s28 ; 15 quiz — s85.2)
Table des 15 : l01 mémorabilité · l02 le motif · l03 développer I · l04 développer II · l05 le contour · l06 la phrase · l07 l'attente · l08 la négociation · l09 la prosodie · l10 ambiances I (joie/tristesse) · l11 ambiances II (héroïque/épique) · l12 ambiances III (romance/mystère) · l13 ambiances IV (thriller/SF) · l14 ambiances V (western/noir/jazz) · l15 synthèse (le brief, Elena).
**Points d'attention M2** : ① les specs à `variants[]` (ex. m02-e20) et `submissionParts[]` (m02-e30 : `userBrief: true` sur la part 2) se copient tels quels — la validation Zod arrivera en Phase 1 ; ② **s30-elena** (la solution du capstone) est un fichier stratégique : il est le `given` de m04-e11 (F-30) et de m08-e09 (F-46) — vérifie ses **14 mesures** au caractère près.

### 3.2.b M5 (11 fiches — sources s22 + s5.2 ; 11 quiz — s85.3)
Les fiches sont des leçons MDX au gabarit spécialisé (§4.5 du Manuel) : m05-l01-intro + les 10 fiches (violons-1-2 en UNE fiche — D-P10, alto, violoncelle, contrebasse, flûte, hautbois, clarinette, trompette, cor, piano). Pas d'exercices propres au MVP (la banque M12 viendra en Phase 6) — le dossier `exercises/` de M5 n'existe pas, c'est normal.
⚠ **Trace la donnée** : chaque valeur chiffrée des fiches (tessitures, sweet spots, pp/ff) sera retranscrite dans `instruments.ts` en Phase 1 — la fiche est la source (règle §7.1). Ne « corrige » aucun chiffre à l'extraction, même s'il t'étonne.

✅ **JOUR 4 FINI QUAND** : M2 = 15/30/29/15 · M5 = 11 fiches + 11 quiz, tables de suivi cochées.

## 3.3 JOUR 5 (matin) — MODULE 9 + LES AMENDEMENTS + LE SCRIPT

### 3.3.a M9 (4 leçons — s23 + s5.3 ; 8 specs ; 4 quiz — s85.4)
romance · épique · néo-noir · thriller. Les 8 specs sont dans les footers (2 par genre).

### 3.3.b Les amendements de specs à vérifier/appliquer (30 min — liste EXHAUSTIVE pour le MVP)
| Finding | Fichier | Ce que tu vérifies (la source publiée est normalement déjà amendée — tu contrôles) |
|---|---|---|
| **F-8** | `m01-e40*.json` | le prompt contient « la substitution ne peut pas remplacer la dominante FINALE » |
| **F-13** | `m02-e08*.json` | `minMotifOccurrences: 2` (pas 3) quand `requireFragmentation` est actif |
| **F-14** | `m02-e15*.json` | `requiredCadenceOneOf` (pas `requiredCadence`) |
Si un fichier source montre la version pré-amendement : applique l'amendement, note-le dans le message de commit (`content(m02): e08 — F-13 appliqué`).

### 3.3.c Le script `count.ts` — code complet
**OÙ** : `packages/content/scripts/count.ts`
```ts
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const TARGETS: Record<string, { lessons: number; specs: number; solutions: number; quizzes: number }> = {
  'module-01-fondamentaux':  { lessons: 25, specs: 49, solutions: 27, quizzes: 25 },
  'module-02-melodie':       { lessons: 15, specs: 30, solutions: 29, quizzes: 15 },
  'module-05-instrumentation': { lessons: 11, specs: 0, solutions: 0, quizzes: 11 },
  'module-09-genres':        { lessons: 4,  specs: 8,  solutions: 0, quizzes: 4 },
};
const ID_RE = /^m\d{2}-(l|e)\d{2}[a-z0-9-]*$/;
let errors = 0;
const err = (m: string) => { console.error('  ✗ ' + m); errors++; };
const list = (d: string) => existsSync(d) ? readdirSync(d).filter(f => !f.startsWith('_')) : [];

for (const [mod, t] of Object.entries(TARGETS)) {
  const base = join(ROOT, 'modules', mod);
  const lessons = list(join(base, 'lessons'));
  const specs   = list(join(base, 'exercises'));
  const quizzes = list(join(base, 'quizzes'));
  const mNN = mod.slice(7, 9);
  const sols = list(join(ROOT, 'solutions', 'm' + mNN));

  console.log(`\n${mod}`);
  const check = (label: string, got: number, want: number) =>
    got === want ? console.log(`  ✓ ${label}: ${got}/${want}`)
                 : err(`${label}: ${got}/${want}`);
  check('leçons', lessons.length, t.lessons);
  check('specs', specs.length, t.specs);
  check('solutions', sols.length, t.solutions);
  check('quiz', quizzes.length, t.quizzes);

  // IDs conformes + croisements
  const specIds = new Set(specs.map(f => JSON.parse(readFileSync(join(base,'exercises',f),'utf8')).id));
  for (const f of lessons) {
    const src = readFileSync(join(base, 'lessons', f), 'utf8');
    const id = /id:\s*(\S+)/.exec(src)?.[1] ?? '';
    if (!ID_RE.test(id)) err(`ID de leçon invalide: ${f} (${id})`);
    for (const ex of [...src.matchAll(/"(m\d{2}-e\d{2}[a-z0-9-]*)"/g)].map(m => m[1]))
      if (t.specs > 0 && !specIds.has(ex)) err(`footer de ${id} référence ${ex} : spec absente`);
  }
  for (const f of sols) {
    const s = JSON.parse(readFileSync(join(ROOT,'solutions','m'+mNN,f),'utf8'));
    if (!specIds.has(s.exerciseId)) err(`solution ${f} : exercice ${s.exerciseId} inconnu`);
    if (!s.notation && !s.payload) err(`solution ${f} : ni notation ni payload (F-33)`);
  }
  for (const f of quizzes) {
    const q = JSON.parse(readFileSync(join(base,'quizzes',f),'utf8'));
    if (!q.items?.length || q.items.some((i: any) => !i.why))
      err(`quiz ${f} : item sans why (charte règle 5)`);
  }
}
console.log(errors === 0 ? '\n✅ CONTENT COUNT: tout est vert.' : `\n❌ ${errors} erreur(s).`);
process.exit(errors === 0 ? 0 : 1);
```

## 3.4 JOUR 5 (après-midi) — VALIDATION FINALE

```bash
pnpm content:count            # doit imprimer 4 blocs verts et « tout est vert »
```
Puis :
1. Passe `continue-on-error: false` dans `ci.yml` (le comptage devient bloquant pour toujours).
2. `git tag v0.1-content-mvp && git push --tags`.
3. Relis en diagonale 3 fichiers au hasard par type (leçon, spec, solution, quiz) — l'échantillonnage attrape les accidents de copie que les compteurs ne voient pas.

## 3.5 Les recettes du générateur (20 min — pendant que tu y es)
**OÙ** : `packages/content/generator/recipes/`. Copie les 8 recettes de s77 (`G-M48.json`, `G-05`, `G-07`, `G-08`, `G-W1..5`). Elles ne serviront qu'en Phase 1.5/6, mais elles font partie du contenu versionné.

## 3.6 Les cinq pièges de copie (lis AVANT le jour 3, relis après)
1. **Les symboles musicaux** : la notation machine utilise `b` et `#` (`Bb4`, `F#3`) — si ta source affiche ♭/♯ dans une chaîne de notation, c'est un artefact d'affichage : convertis. Dans la PROSE des leçons, ♭/♯ restent.
2. **Les tildes de liaison** : `~` colle à la note (`C5:h~`), jamais d'espace avant.
3. **Les guillemets typographiques** dans les JSON (« » “ ”) : ils cassent le parse — la prose des `prompt` les garde, mais vérifie que ton éditeur n'a pas converti les `"` structurels.
4. **Les tableaux MDX** : une ligne de tableau cassée par un retour à la ligne intempestif = rendu détruit ; prévisualise chaque leçon extraite dans un viewer Markdown.
5. **Les IDs** : jamais « corrigés », jamais francisés, jamais renommés — même si un slug te semble mal choisi (Manuel §7.2).

---

# ✅ LA CHECKLIST DE FIN DE PHASE 0 (imprime-la)

- [ ] J1 — CI verte · verrou d'isomorphisme testé en le violant · décision n°1 commitée
- [ ] J2 — Manuel + Consolidation + Guide dans `docs/manual/` · sections dans `docs/production/` + INDEX · 4 module.json · 4 templates · `la-remise/manifest.json` + **décision n°2 (l'anomalie H2/OUT tranchée)**
- [ ] J3 — M1 : 25/49/27/25, table de suivi cochée
- [ ] J4 — M2 : 15/30/29/15 (dont s30-elena vérifié à 14 mesures) · M5 : 11+11
- [ ] J5 — M9 : 4/8/4 · amendements F-8/F-13/F-14 contrôlés · `count.ts` écrit · **`pnpm content:count` vert** · CI bloquante · tag `v0.1-content-mvp` · 8 recettes copiées
- [ ] Aucune zone floue rencontrée sans décision inscrite dans `DECISIONS_LOCALES.md`

**Et ensuite ?** Lundi de la semaine 1, tu ouvres la Phase 1.1 du Guide v2 : `types.ts` + le parseur. Tu as déjà tes 10 premières fixtures de round-trip sous la main — ce sont les solutions M1 que tu viens d'extraire.
