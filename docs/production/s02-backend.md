# SECTION 2 — BACKEND (NestJS + Prisma + PostgreSQL)

## 2.1 Structure de dossiers

```
apps/api/
├── src/
│   ├── main.ts                        # bootstrap, pipes globaux, CORS
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── env.validation.ts          # Zod : DATABASE_URL, JWT_SECRET, etc.
│   │   └── config.module.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts           # @Global()
│   │   └── prisma.service.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts         # register, login, refresh, me
│   │   ├── auth.service.ts
│   │   ├── strategies/jwt.strategy.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   ├── guards/roles.guard.ts      # ADMIN pour le contenu
│   │   └── dto/
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   │
│   ├── courses/                       # Course Engine
│   │   ├── courses.module.ts
│   │   ├── courses.controller.ts
│   │   ├── courses.service.ts
│   │   └── dto/
│   │
│   ├── exercises/                     # Exercise Engine
│   │   ├── exercises.module.ts
│   │   ├── exercises.controller.ts
│   │   ├── exercises.service.ts
│   │   ├── submission.service.ts      # orchestration du Flux B
│   │   ├── generator.service.ts       # missions paramétriques
│   │   └── dto/
│   │
│   ├── progress/                      # XP, niveaux, compétences
│   │   ├── progress.module.ts
│   │   ├── progress.controller.ts
│   │   ├── progress.service.ts
│   │   └── xp.rules.ts                # barème centralisé
│   │
│   ├── analysis/                      # façade autour de @ma/music-core
│   │   ├── analysis.module.ts
│   │   ├── analysis.controller.ts     # endpoints d'analyse "libre"
│   │   ├── music-analysis.service.ts
│   │   └── feedback-engine.service.ts
│   │
│   ├── export/
│   │   ├── export.module.ts
│   │   ├── export.controller.ts
│   │   ├── midi-export.service.ts     # Note[] 480 PPQ → .mid
│   │   └── pdf-export.service.ts      # fiche mission (pdfkit)
│   │
│   ├── content-sync/                  # seed packages/content → DB
│   │   ├── content-sync.module.ts
│   │   └── content-sync.service.ts    # CLI + hook de déploiement
│   │
│   └── common/
│       ├── decorators/current-user.decorator.ts
│       ├── filters/http-exception.filter.ts
│       └── interceptors/logging.interceptor.ts
├── test/
└── nest-cli.json
```

**Principes de dépendance** (stricts, vérifiables par ESLint `import/no-restricted-paths`) :

```
controllers → services → @ma/music-core + prisma
exercises → analysis, progress          (jamais l'inverse)
analysis  → @ma/music-core uniquement   (aucun accès DB : service pur)
progress  → prisma                      (ne connaît pas la musique)
```

Le module `analysis` est **stateless et sans DB** : c'est ce qui garantit que la logique musicale reste testable en isolation et identique au client.

---

## 2.2 Schéma Prisma complet

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────── UTILISATEURS ───────────────────────────

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  displayName   String
  role          UserRole @default(STUDENT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  profile       UserProfile?
  skillStates   SkillState[]
  lessonStates  LessonProgress[]
  submissions   Submission[]
  practiceLogs  PracticeSession[]
  refreshTokens RefreshToken[]
}

enum UserRole {
  STUDENT
  ADMIN
}

model UserProfile {
  userId          String  @id
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  level           Int     @default(1)        // niveau global 1..30
  totalXp         Int     @default(0)
  dailyGoalMin    Int     @default(20)
  hasMidiKeyboard Boolean @default(false)
  usesCubase      Boolean @default(true)
  preferredStyles String[] @default([])      // ["epic","neo-noir","jazz"]
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
}

// ─────────────────────────── CONTENU (seedé depuis Git) ───────────────────────────

model Module {
  id          String   @id                  // "module-05-orchestration"
  slug        String   @unique
  title       String
  summary     String
  orderIndex  Int
  minLevel    Int      @default(1)          // gating par niveau
  lessons     Lesson[]
  contentHash String                        // détection de changement au seed
}

model Lesson {
  id           String   @id                 // "m05-l12-french-horn"
  moduleId     String
  module       Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  slug         String
  title        String
  orderIndex   Int
  estMinutes   Int      @default(15)
  bodyMdx      String                       // contenu complet MDX
  audioAssets  Json?                        // [{id, url, caption}]
  quiz         Json?                        // QuizSpec (voir 2.4)
  exercises    Exercise[]
  progress     LessonProgress[]
  contentHash  String

  @@unique([moduleId, slug])
  @@index([moduleId, orderIndex])
}

model Exercise {
  id           String       @id             // "m02-e04-sad-melody-minor"
  lessonId     String?
  lesson       Lesson?      @relation(fields: [lessonId], references: [id], onDelete: SetNull)
  title        String
  kind         ExerciseKind
  difficulty   Int          // 1..10
  spec         Json         // ExerciseSpec : contraintes + styleProfile (voir 2.4)
  xpReward     Int          @default(50)
  skills       Json         // {"melody": 0.8, "harmony": 0.2} pondération XP
  isGenerated  Boolean      @default(false) // true si issu du generator
  submissions  Submission[]
  contentHash  String?

  @@index([lessonId])
  @@index([kind, difficulty])
}

enum ExerciseKind {
  MELODY_COMPOSE       // composer une mélodie sous contraintes
  MELODY_CONTINUE      // continuer un début donné
  HARMONY_PROGRESSION  // écrire/compléter une progression
  HARMONIZE_MELODY     // harmoniser une mélodie donnée
  VOICE_LEADING        // corriger/écrire un enchaînement à 4 voix
  COUNTERPOINT         // espèces, contrechant
  ORCHESTRATE          // assigner instruments/rôles à un matériau
  LAYERING             // sound design hybride : empilement de couches
  EAR_QUIZ             // QCM audio (intervalles, accords, cadences)
  THEORY_QUIZ          // QCM/texte à trous
  DAW_MISSION          // mission Cubase avec checklist auto-déclarée
}

// ─────────────────────────── PROGRESSION ───────────────────────────

model LessonProgress {
  userId      String
  lessonId    String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  status      ProgressStatus @default(NOT_STARTED)
  quizScore   Int?
  completedAt DateTime?
  updatedAt   DateTime @updatedAt

  @@id([userId, lessonId])
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

model SkillState {
  userId  String
  skill   SkillKey
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  xp      Int    @default(0)
  level   Int    @default(1)   // dérivé de xp mais dénormalisé pour requêtes

  @@id([userId, skill])
}

enum SkillKey {
  MELODY
  HARMONY
  COUNTERPOINT
  ORCHESTRATION
  RHYTHM
  SOUND_DESIGN
  DAW_WORKFLOW
  EAR_TRAINING
}

model Submission {
  id          String   @id @default(cuid())
  userId      String
  exerciseId  String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercise    Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  payload     Json     // SubmissionPayload : notes[], parts[], answers[]
  score       Int      // 0..100
  report      Json     // FeedbackReport complet (voir 2.4)
  xpAwarded   Int
  engineVer   String   // version de music-core (rejouabilité des scores)
  createdAt   DateTime @default(now())

  @@index([userId, exerciseId, createdAt])
  @@index([exerciseId, score])
}

model PracticeSession {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mode       String   // "melody-practice" | "harmony-coach" | "layering" | "free"
  durationS  Int
  stats      Json     // métriques agrégées client (notes jouées, tonalités...)
  createdAt  DateTime @default(now())

  @@index([userId, createdAt])
}
```

**Choix à défendre :**

| Décision | Raison |
|---|---|
| `spec`, `report`, `payload` en `Json` | Ces structures évoluent avec le moteur ; elles sont validées par **Zod dans `@ma/shared`** (une seule source de vérité de schéma, partagée client/serveur), pas par la DB. On garde les colonnes relationnelles pour tout ce qui est requêtable (score, kind, difficulty). |
| `engineVer` sur Submission | Quand tu amélioreras une règle, les anciens scores restent explicables. Optionnellement re-scorables par batch. |
| IDs de contenu = strings lisibles | Le contenu vient de Git ; `"m05-l12-french-horn"` est stable entre environnements, diffable, référençable dans le MDX. |
| `contentHash` | Le seed compare hash Git ↔ DB et n'upsert que ce qui a changé. Déploiement idempotent. |
| Pas de table `Skill` | Enum suffit : la liste des compétences est un choix produit, pas de la donnée. |

---

## 2.3 API — Endpoints complets

Toutes les routes sous `/api/v1`. 🔒 = JWT requis, 👑 = ADMIN.

### Auth
| Méthode | Route | Corps / Retour |
|---|---|---|
| POST | `/auth/register` | `{email, password, displayName}` → `{user, accessToken, refreshToken}` |
| POST | `/auth/login` | idem |
| POST | `/auth/refresh` | `{refreshToken}` → nouveaux tokens (rotation, hash stocké) |
| POST | `/auth/logout` 🔒 | révoque le refresh token |
| GET | `/auth/me` 🔒 | `{user, profile}` |

### Courses
| Méthode | Route | Retour |
|---|---|---|
| GET | `/modules` 🔒 | liste + état de progression agrégé de l'utilisateur |
| GET | `/modules/:slug` 🔒 | module + leçons (métadonnées, statuts, verrouillage par `minLevel`) |
| GET | `/lessons/:id` 🔒 | leçon complète (MDX, quiz, exercices liés) |
| POST | `/lessons/:id/progress` 🔒 | `{status}` → progression mise à jour |
| POST | `/lessons/:id/quiz` 🔒 | `{answers[]}` → correction serveur, score, XP |

### Exercises
| Méthode | Route | Description |
|---|---|---|
| GET | `/exercises/:id` 🔒 | spec publique (les contraintes sont visibles, c'est pédagogique — seuls les *seuils exacts de scoring* restent serveur) |
| POST | `/exercises/:id/submissions` 🔒 | **Flux B** : `{payload}` → `{score, report, xpAwarded, skillDeltas, levelUp?}` |
| GET | `/exercises/:id/submissions` 🔒 | historique de l'élève sur cet exercice |
| GET | `/submissions/:id` 🔒 | rapport complet d'une soumission |
| POST | `/exercises/generate` 🔒 | `{kind, skill, difficulty?, style?}` → exercice paramétrique persisté (`isGenerated: true`) — le générateur choisit tonalité/mode/contraintes selon le niveau réel de l'élève |

### Analysis (pratique libre — pas de scoring, pas d'XP)
| Méthode | Route | Description |
|---|---|---|
| POST | `/analysis/melody` 🔒 | `{notes[], hint?}` → analyse complète (tonalité, contour, sauts, motifs, tension) |
| POST | `/analysis/harmony` 🔒 | `{chords[] \| notes[]}` → fonctions, cadences, suggestions de substitution/enrichissement |
| POST | `/analysis/voice-leading` 🔒 | `{parts[]}` → parallèles, croisements, résolutions |
| POST | `/analysis/orchestration` 🔒 | `{score}` → violations de registre, carte de densité, risques de masquage |

> Note : le client fait la même analyse en temps réel via `music-core` embarqué ; ces endpoints servent pour l'analyse "approfondie" à la demande et garantissent la parité de résultats (mêmes fonctions, même package).

### Progress
| Méthode | Route | Retour |
|---|---|---|
| GET | `/progress/overview` 🔒 | niveau global, XP, 8 compétences, streak, prochaine étape recommandée |
| GET | `/progress/skills/:skill` 🔒 | historique XP, exercices faibles, suggestions ciblées |
| POST | `/practice-sessions` 🔒 | log d'une session de pratique libre (durée, mode, stats) |

### Export (Real-World Workflow Mode)
| Méthode | Route | Retour |
|---|---|---|
| GET | `/export/exercises/:id/midi` 🔒 | `.mid` (matériau de départ : mélodie donnée, grille…) |
| GET | `/export/submissions/:id/midi` 🔒 | `.mid` de la soumission de l'élève |
| GET | `/export/exercises/:id/mission-pdf` 🔒 | fiche mission PDF : consignes, contraintes, checklist Cubase pas-à-pas |

### Admin
| Méthode | Route | Description |
|---|---|---|
| POST | `/admin/content/sync` 👑 | déclenche le seed `packages/content` → DB |
| GET | `/admin/stats` 👑 | métriques d'usage (soumissions/jour, scores moyens par exercice → détecte les exercices mal calibrés) |

---

## 2.4 Contrats de données clés (Zod dans `@ma/shared`)

### ExerciseSpec (colonne `Exercise.spec`)

```typescript
const ExerciseSpec = z.object({
  version: z.literal(1),
  prompt: z.string(),                    // consigne affichée
  given: z.object({                      // matériau fourni (optionnel)
    notes: z.array(NoteSchema).optional(),      // ex: début de mélodie
    chords: z.array(ChordEventSchema).optional(),
    key: KeyContextSchema.optional(),
  }).optional(),
  constraints: z.object({
    key: KeyContextSchema.optional(),           // tonalité imposée
    meter: z.string().optional(),               // "4/4", "6/8"
    lengthBars: z.tuple([z.number(), z.number()]).optional(),
    noteRange: z.tuple([z.number(), z.number()]).optional(),  // MIDI
    allowedDurations: z.array(z.number()).optional(),
    requiredCadence: z.enum(["perfect","plagal","half","deceptive"]).optional(),
    mustUseMotif: z.boolean().optional(),
    maxLeap: z.number().optional(),
    instrumentPool: z.array(z.string()).optional(),   // pour ORCHESTRATE
    maxSimultaneousParts: z.number().optional(),
  }),
  styleProfile: z.object({                // ⭐ module la sévérité des règles
    id: z.string(),                       // "strict-counterpoint" | "epic-film" | "jazz" | "neo-noir"...
    ruleWeights: z.record(z.string(), z.number()),  // ruleId → 0..2 (0 = ignorée)
    targetMood: z.string().optional(),    // "sad", "heroic"... → active des heuristiques
  }),
  rubric: z.object({                      // pondération du score /100
    correctness: z.number(),              // respect des règles dures
    constraints: z.number(),              // respect des consignes
    craft: z.number(),                    // qualités : contour, variété, motifs
  }),
});
```

### FeedbackReport (colonne `Submission.report`)

```typescript
const FeedbackReport = z.object({
  score: z.number(),                      // 0..100
  breakdown: z.object({
    correctness: z.number(), constraints: z.number(), craft: z.number(),
  }),
  strengths: z.array(z.object({          // ⭐ toujours commencer par le positif
    ruleId: z.string().optional(),
    text: z.string(),                     // "Ton motif initial est réutilisé 3× avec variation — excellent pour la mémorisation"
    location: LocationSchema.optional(),  // {startTick, endTick, part?}
  })),
  issues: z.array(z.object({
    ruleId: z.string(),
    severity: z.enum(["error","warning","suggestion"]),
    text: z.string(),                     // constat
    why: z.string(),                      // pédagogie de la règle
    how: z.string(),                      // action concrète
    location: LocationSchema.optional(),  // → surlignage dans le piano roll client
  })),
  improvedVersion: z.object({             // Module 12 : "version améliorée suggérée"
    notes: z.array(NoteSchema),
    changes: z.array(z.string()),         // liste des modifications expliquées
  }).optional(),
  metrics: z.record(z.string(), z.number()), // tension moyenne, % conjoint, ambitus...
});
```

La `improvedVersion` est générée **par transformations rule-based** (pas d'IA) : résoudre les sauts non compensés par mouvement conjoint, corriger une note hors gamme vers le degré le plus proche compatible avec l'harmonie, resserrer un voicing trop grave, etc. Chaque transformation loggue sa justification dans `changes[]`. C'est borné, explicable, et pédagogiquement honnête.

---

## 2.5 SubmissionService — le pipeline du Flux B en détail

```
async submit(userId, exerciseId, payload):
  1. spec ← exercises.load(exerciseId)          // + validation Zod du payload
  2. normalized ← musicCore.normalize(payload)  // quantize info, tri, dédoublonnage
  3. ctx ← { spec.constraints, spec.styleProfile, userLevel }
  4. violations ← analysisService.run(normalized, ctx)
       // sélectionne les règles par domain + appliesTo(ctx)
       // applique styleProfile.ruleWeights
  5. metrics ← analysisService.metrics(normalized)
  6. report ← feedbackEngine.build(violations, metrics, spec.rubric, userLevel)
       // scoring : base 100, pénalités pondérées, bonus craft
       // sélection des 3–5 issues les plus pédagogiques (pas 40 d'un coup)
       // génération improvedVersion si score < 85
  7. xp ← xpRules.compute(spec, report.score, isFirstPass, streak)
  8. transaction Prisma:
       - Submission.create
       - SkillState.upsert (répartition selon Exercise.skills)
       - UserProfile.update (totalXp, level si seuil franchi)
  9. return { score, report, xpAwarded, skillDeltas, levelUp }
```

**Point pédagogique crucial à l'étape 6** : le FeedbackEngine **plafonne le nombre d'issues affichées** et les priorise (erreurs > warnings > suggestions, puis par impact sur le score). Un débutant qui reçoit 40 remarques abandonne ; il en reçoit 5, les plus formatrices, avec le reste disponible en "voir l'analyse complète". C'est un choix de coach, pas de correcteur.

### Barème XP (`xp.rules.ts`, centralisé)

```
xpAwarded = xpReward × scoreFactor × noveltyFactor
  scoreFactor   : score/100, plancher 0.2 (l'échec instructif paie un peu)
  noveltyFactor : 1.0 première réussite ≥ 70 ; 0.3 les re-soumissions
                  (encourage la persévérance sans farming)
Niveaux : seuil(n) = 100 × n^1.6   (progression douce puis exigeante)
```

---

## 2.6 Transversal

**Validation** : `ZodValidationPipe` global — tous les DTO viennent de `@ma/shared`, donc le front connaît exactement les mêmes schémas.

**Erreurs** : filtre global → format unique `{statusCode, code, message, details?}` avec codes métier (`EXERCISE_LOCKED`, `SUBMISSION_INVALID_NOTES`, `LEVEL_TOO_LOW`).

**Sécurité** : bcrypt (cost 12), access token 15 min, refresh 30 j avec rotation + hash en DB, rate-limit (`@nestjs/throttler`) : 10/min sur les submissions, 5/min sur auth.

**Tests** : le gros de la valeur est dans `music-core` (tests unitaires purs, ~centaines de cas : "cette progression contient une cadence rompue", "ces deux voix font des quintes parallèles au tick 960"). Le backend n'a besoin que de tests d'intégration sur le pipeline de soumission et l'attribution d'XP.

---

## Checklist de validation Backend

- [x] Schéma Prisma complet : contenu, progression, soumissions, sessions
- [x] Contenu Git-seedé, idempotent via `contentHash`
- [x] Pipeline de soumission explicite, transactionnel, versionné (`engineVer`)
- [x] Contrats Zod partagés client/serveur (`ExerciseSpec`, `FeedbackReport`)
- [x] `styleProfile` → la même règle change de sévérité selon le style (exigence clé du brief)
- [x] Feedback plafonné et priorisé = posture de coach
- [x] `improvedVersion` rule-based, explicable, sans IA externe
- [x] Export MIDI/PDF branché sur la représentation 480 PPQ

---

**Point de confirmation.** Le backend te convient ? La prochaine section est le **Frontend** : pages (App Router), arborescence de composants (Piano Roll, Practice Studio, Exercise Runner…), stores Zustand détaillés, intégration Web MIDI/Tone.js, et le design system sombre "cinématique". Je continue ?