
---

# SECTION 1 — SYSTEM DESIGN : ARCHITECTURE GLOBALE

## 1.1 Décision structurante : monolithe modulaire, pas microservices

Avant tout schéma, une décision d'équipe (dev senior + réalité produit) :

| Critère | Microservices | **Monolithe modulaire (choisi)** |
|---|---|---|
| Équipe | 5+ devs | 1–3 devs (ton cas probable) |
| Latence feedback musical | Réseau inter-services | Appels in-process (< 5 ms) |
| Déploiement MVP | Complexe (K8s, service mesh) | 1 container + 1 DB |
| Évolution vers SaaS | Possible mais coûteux tôt | Extraction de services *plus tard* si besoin |
| Moteur de règles musicales | Doit être partagé partout | Librairie interne importable partout |

**Verdict** : un monolithe NestJS strictement découpé en modules internes, avec le **moteur musical isolé dans un package pur TypeScript sans dépendance** (`@ma/music-core`). C'est le point le plus important de toute l'architecture : les règles d'harmonie/mélodie/orchestration doivent tourner **côté serveur (correction officielle, scoring, anti-triche)** ET **côté client (feedback temps réel pendant que l'élève joue)**. Un package isomorphe résout ça sans dupliquer la logique.

## 1.2 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Next.js 14)                     │
│                                                                  │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │  Course    │ │  Practice  │ │  Exercise   │ │ Progression │  │
│  │  Reader    │ │  Studio    │ │  Runner     │ │ Dashboard   │  │
│  └─────┬──────┘ └─────┬──────┘ └──────┬──────┘ └──────┬──────┘  │
│        │              │               │               │         │
│  ┌─────┴──────────────┴───────────────┴───────────────┴──────┐  │
│  │              Zustand stores (session, midi, player)        │  │
│  └─────┬──────────────┬───────────────────────────────────────┘  │
│        │              │                                          │
│  ┌─────┴──────┐ ┌─────┴─────────────────────────┐               │
│  │ Web MIDI / │ │  @ma/music-core (client-side) │ ← feedback     │
│  │ Web Audio /│ │  analyse temps réel, léger    │   instantané   │
│  │ Tone.js    │ └───────────────────────────────┘               │
│  └────────────┘                                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / JSON (REST)
┌───────────────────────────┴─────────────────────────────────────┐
│                     API (NestJS, monolithe modulaire)            │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐           │
│  │ Auth     │ │ Courses  │ │ Exercises │ │ Progress │           │
│  │ (JWT)    │ │ Engine   │ │ Engine    │ │ /XP      │           │
│  └──────────┘ └──────────┘ └─────┬─────┘ └──────────┘           │
│                                  │                               │
│  ┌───────────────────────────────┴────────────────────────────┐ │
│  │            CORE SERVICES (logique métier pure)              │ │
│  │  ┌───────────────┐ ┌────────────────┐ ┌─────────────────┐  │ │
│  │  │ MusicAnalysis │ │ FeedbackEngine │ │ ExerciseGen     │  │ │
│  │  │ Service       │ │ (règles→texte) │ │ (missions)      │  │ │
│  │  └───────┬───────┘ └───────┬────────┘ └────────┬────────┘  │ │
│  │          └─────────────────┴───────────────────┘           │ │
│  │                            │                                │ │
│  │              ┌─────────────┴─────────────┐                  │ │
│  │              │   @ma/music-core (server)  │                  │ │
│  │              │ pitch, intervalles, gammes │                  │ │
│  │              │ accords, voice leading,    │                  │ │
│  │              │ contrepoint, orchestration │                  │ │
│  │              └───────────────────────────┘                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌──────────┐ ┌──────────────┐                                  │
│  │ Export   │ │ Content Admin│                                  │
│  │ MIDI/PDF │ │ (CMS interne)│                                  │
│  └──────────┘ └──────────────┘                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Prisma
                  ┌─────────┴──────────┐
                  │    PostgreSQL      │
                  └────────────────────┘
```

## 1.3 Découpage en packages (monorepo)

```
music-academy/
├── apps/
│   ├── web/          # Next.js 14 App Router
│   └── api/          # NestJS
├── packages/
│   ├── music-core/   # ⭐ moteur musical pur TS, zéro dépendance
│   ├── shared/       # types DTO, schémas Zod partagés client/serveur
│   └── content/      # contenu pédagogique versionné (MDX + JSON)
├── prisma/
└── turbo.json        # Turborepo
```

**Pourquoi `packages/content` séparé de la DB ?** Le contenu de cours (Modules 1–12) est un **actif éditorial versionné dans Git** (MDX + JSON d'exercices), pas de la donnée utilisateur. On le *seed* en base à chaque déploiement. Avantages : relecture par PR, diff historique, pas de CMS à construire pour le MVP, rollback trivial. La DB ne stocke que : utilisateurs, progression, soumissions, scores.

## 1.4 Le cœur : `@ma/music-core`

C'est le module qui différencie ton produit d'un simple site de cours. Sa conception mérite d'être détaillée dès maintenant.

### Représentation interne des données musicales

```
Note        = { pitch: int (MIDI 0–127), start: Tick, duration: Tick, velocity: int }
Tick        = int (480 PPQ, compatible export MIDI direct)
KeyContext  = { tonic: PitchClass, mode: Mode, confidence: float }
ChordEvent  = { root, quality, extensions[], bass, start, duration }
Melody      = Note[] + KeyContext
Progression = ChordEvent[] + KeyContext
Score       = { parts: Part[], meter, tempoMap }   // pour l'orchestration
Part        = { instrumentId, notes: Note[], role: Role }
Role        = melody | countermelody | harmony | bass | texture | rhythm
```

Tout le moteur travaille sur ces structures. MIDI entrant, piano virtuel, saisie note-à-note : tout converge vers `Note[]` avant analyse. **Une seule représentation = un seul moteur de règles.**

### Sous-modules du music-core

| Sous-module | Responsabilité | Exemples de fonctions |
|---|---|---|
| `pitch` | notes, intervalles, enharmonie | `interval(a,b)`, `spell(pitch, key)` |
| `scales` | gammes, modes, degrés | `degreeOf(pitch, key)`, `isDiatonic()` |
| `chords` | détection/construction d'accords | `detectChord(notes)`, `voicings()` |
| `harmony` | fonctions, cadences, substitutions | `functionOf(chord, key)`, `detectCadence()` |
| `melody` | contour, sauts, tension, motifs | `contour()`, `findMotifs()`, `tensionCurve()` |
| `voiceLeading` | mouvement des voix | `parallelFifths()`, `resolutionErrors()` |
| `counterpoint` | règles des espèces | `checkSpecies(cf, cp, species)` |
| `rhythm` | métrique, syncopes, densité | `syncopationScore()`, `quantizeInfo()` |
| `orchestration` | registres, densité, masquage | `rangeViolations(part)`, `densityMap(score)` |
| `keyDetect` | estimation de tonalité (Krumhansl) | `estimateKey(notes)` |

### Architecture du système de règles

Chaque règle est un objet déclaratif, pas du code éparpillé — c'est ce qui rend le feedback pédagogique maintenable :

```
Rule = {
  id: "melody.leap-recovery",
  domain: "melody",
  severity: "warning" | "error" | "suggestion",
  appliesTo: (context) => boolean,          // ex: seulement niveau ≥ 2
  evaluate: (input, ctx) => Violation[],
  pedagogy: {
    why: "Un saut > sixte crée une tension forte...",
    how: "Après un grand saut, reviens par mouvement conjoint...",
    when: "Règle stricte en style classique, assouplie en jazz/film...",
    commonMistake: "Enchaîner deux grands sauts dans la même direction...",
    alternative: "Le saut non compensé est un effet expressif valide si..."
  }
}
```

Le **FeedbackEngine** consomme les `Violation[]`, les pondère selon le niveau de l'élève et le style demandé (une quinte parallèle est une *erreur* en contrepoint strict, un *choix stylistique* en musique épique à la Zimmer), calcule le score /100, et génère le texte actionnable. Cette pondération contextuelle par style est la clé pour que le produit soit un coach de musique de film et pas un correcteur de conservatoire rigide — ton brief exige les deux, donc **chaque exercice déclare son `styleProfile`** qui module la sévérité des règles.

## 1.5 Flux critiques

**Flux A — Pratique temps réel (latence < 50 ms, tout client)**
```
Clavier MIDI → Web MIDI API → midiStore (Zustand)
  → music-core client : analyse incrémentale (tonalité glissante, sauts, hors-gamme)
  → affichage feedback léger (badges, surlignage) pendant que l'élève joue
  → AUCUN appel réseau pendant le jeu
```

**Flux B — Soumission d'exercice (source de vérité serveur)**
```
Élève valide → POST /exercises/:id/submissions { notes[], meta }
  → ExerciseEngine charge la spec de l'exercice (contraintes + styleProfile)
  → MusicAnalysisService (music-core server) → Violations + métriques
  → FeedbackEngine → score /100, points forts, erreurs, suggestions d'amélioration
  → ProgressService → XP, compétences, déblocages
  → réponse complète persistée (historique consultable)
```

**Flux C — Real-World Workflow Mode**
```
Exercice → ExportService → MIDI (fichier .mid depuis Note[], trivial en 480 PPQ)
                        → PDF (fiche mission : consignes, grille, checklist Cubase)
Élève travaille dans Cubase Pro 13 → rejoue le résultat via MIDI ou saisit → Flux B
```

## 1.6 Ce qu'on ne construit PAS (périmètre négatif, assumé)

- Pas de rendu de partition gravée complète (MVP : piano roll + notation textuelle ; VexFlow envisageable en V1)
- Pas d'analyse audio (uniquement MIDI/notes symboliques — l'analyse audio est un autre produit)
- Pas d'import de projets Cubase (on exporte *vers* le workflow, on n'ingère pas)
- Pas de temps réel collaboratif, pas de social au MVP

## 1.7 Checklist de validation de cette architecture

- [x] Le moteur musical tourne client ET serveur sans duplication
- [x] Le contenu pédagogique est versionnable et relisible hors DB
- [x] Le feedback temps réel ne dépend pas du réseau
- [x] Le scoring officiel est inviolable (serveur)
- [x] Les règles portent leur propre pédagogie (Pourquoi/Comment/Quand/Erreurs/Alternatives) — exigence non négociable du brief
- [x] Le style module la sévérité (conservatoire ↔ musique de film)
- [x] Export MIDI/PDF natif grâce à la représentation en ticks

---

**Point de confirmation.** Cette architecture te convient-elle ? Deux questions avant la suite :

1. **NestJS ou Express ?** Je recommande NestJS (modules injectables = découpage propre des core services). Je pars là-dessus sauf objection.
2. Prochaine section : **Backend complet** (structure de dossiers, endpoints API détaillés, schéma Prisma intégral) — je continue ?