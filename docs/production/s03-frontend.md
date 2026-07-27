# SECTION 3 — FRONTEND (Next.js 14 App Router + Zustand + Web MIDI/Audio)

## 3.1 Arborescence des pages (App Router)

```
apps/web/src/app/
├── layout.tsx                     # RootLayout : thème sombre, fonts, providers
├── page.tsx                       # Landing (public)
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (app)/                         # layout protégé : sidebar + topbar
│   ├── layout.tsx                 # AuthGuard + AppShell
│   ├── dashboard/page.tsx         # vue d'ensemble : reprendre, recommandations, streak
│   │
│   ├── learn/                     # ── Course System ──
│   │   ├── page.tsx               # grille des 12 modules + progression
│   │   ├── [moduleSlug]/page.tsx  # sommaire du module, leçons, verrous
│   │   └── [moduleSlug]/[lessonSlug]/page.tsx   # Course Reader
│   │
│   ├── practice/                  # ── Practice Studio (temps réel) ──
│   │   ├── melody/page.tsx        # Melody Practice System
│   │   ├── harmony/page.tsx       # Harmony & Chord Coach
│   │   ├── orchestration/page.tsx # Orchestration Guided Learning
│   │   └── layering/page.tsx      # Hybrid Sound Design Layering
│   │
│   ├── exercises/
│   │   ├── page.tsx               # bibliothèque + générateur de missions
│   │   ├── [id]/page.tsx          # Exercise Runner
│   │   └── [id]/report/[subId]/page.tsx   # FeedbackReport détaillé
│   │
│   ├── progress/page.tsx          # radar 8 compétences, XP, historique
│   └── settings/page.tsx          # MIDI device, préférences, objectif quotidien
│
└── api/                           # (vide — tout passe par l'API NestJS)
```

**Stratégie de rendu** :

| Zone | Mode | Raison |
|---|---|---|
| Course Reader | **RSC** (Server Components) + MDX compilé | contenu lourd, SEO interne inutile mais TTFB rapide, zéro JS pour le texte |
| Practice Studio | **Client Components** intégralement | Web MIDI, Web Audio, 60 fps, zéro serveur |
| Exercise Runner | Hybride : shell RSC, éditeur client | spec chargée serveur, interaction client |
| Dashboard/Progress | RSC + îlots clients (graphiques) | données fraîches par requête |

Les composants musicaux interactifs sont chargés en `dynamic(() => import(...), { ssr: false })` — Web MIDI et AudioContext n'existent pas côté serveur.

## 3.2 Arborescence des composants

```
src/components/
├── shell/
│   ├── AppShell.tsx               # sidebar gauche (nav) + topbar (XP, streak, MIDI status)
│   ├── SidebarNav.tsx
│   └── MidiStatusBadge.tsx        # 🟢 device connecté / 🔴 absent / clic → settings
│
├── course/
│   ├── LessonRenderer.tsx         # MDX → composants custom ci-dessous
│   ├── MusicExample.tsx           # notation textuelle + mini piano-roll + ▶ lecture Tone.js
│   ├── ChordCard.tsx              # accord : notes, fonction, voicing jouable au clic
│   ├── ComparisonTable.tsx        # tableaux récap du brief
│   ├── DecisionTree.tsx           # arbres de décision (ex: "quel bois pour ce registre ?")
│   ├── InstrumentSheet.tsx        # fiche Module 5 : tessiture visuelle, rôles, erreurs
│   ├── QuizBlock.tsx              # QCM/à-trous, correction via POST /lessons/:id/quiz
│   └── LessonFooter.tsx           # marquer terminé, leçon suivante, exercices liés
│
├── music/                         # ⭐ le cœur réutilisable
│   ├── PianoRoll/
│   │   ├── PianoRoll.tsx          # <canvas>, virtualisé, zoom H/V
│   │   ├── useRollInteraction.ts  # draw/resize/move/delete notes, snap à la grille
│   │   ├── RollOverlays.tsx       # surlignages de feedback (location des issues)
│   │   └── rollRenderer.ts        # rendu canvas pur (testable sans React)
│   ├── VirtualKeyboard.tsx        # clavier écran 2 octaves+, vélocité au clic-Y
│   ├── StaffLite.tsx              # portée simplifiée SVG (lecture seule, MVP)
│   ├── TransportBar.tsx           # ▶ ■ ⏺ | tempo | métronome | boucle
│   ├── KeySignaturePicker.tsx
│   └── TensionCurve.tsx           # courbe de tension mélodique (SVG)
│
├── practice/
│   ├── LiveFeedbackPanel.tsx      # badges temps réel : tonalité détectée, sauts, hors-gamme
│   ├── MelodyAnalysisView.tsx     # analyse complète à la demande
│   ├── ChordDetector.tsx          # accord joué → nom, fonction dans la tonalité
│   ├── SuggestionChips.tsx        # "essaie une substitution tritonique" → clic = écoute
│   ├── OrchestraPalette.tsx       # instruments par famille, drag → assignation de rôle
│   ├── DensityHeatmap.tsx         # carte registre × temps, zones de surcharge en rouge
│   └── LayerStack.tsx             # sound design : couches, gain, sends, largeur stéréo
│
├── exercises/
│   ├── ExerciseCard.tsx
│   ├── ExerciseRunner.tsx         # orchestre : consignes | éditeur | soumission
│   ├── ConstraintsChecklist.tsx   # contraintes cochées en direct (client-side music-core)
│   ├── MissionGenerator.tsx       # formulaire kind/skill/style → POST /exercises/generate
│   ├── ScoreRing.tsx              # score /100 animé
│   ├── FeedbackReport.tsx         # strengths, issues cliquables → surlignage roll
│   ├── ImprovedVersionDiff.tsx    # A/B : ta version ↔ version améliorée, lecture des deux
│   └── ExportButtons.tsx          # MIDI / PDF mission
│
└── ui/                            # primitives (Button, Card, Tabs, Dialog, Tooltip…)
```

**Règle d'or** : `components/music/*` ne connaît ni l'API ni les stores métier — uniquement des props `Note[]` + callbacks. C'est ce qui permet de réutiliser le PianoRoll dans le Course Reader (lecture seule), le Practice Studio (live) et l'Exercise Runner (édition).

## 3.3 Stores Zustand

Découpage par **durée de vie**, pas par page :

```typescript
// ── stores/midiStore.ts ── durée de vie : application
{
  devices: MIDIInput[],
  activeDeviceId: string | null,
  status: "unsupported" | "denied" | "disconnected" | "connected",
  lastEvents: RingBuffer<NoteEvent>,     // 256 derniers, pour le détecteur d'accords
  actions: { requestAccess(), selectDevice(id), panic() }
}
// S'abonne à navigator.requestMIDIAccess ; publie des NoteEvent normalisés
// {pitch, velocity, on/off, timestampMs} — même format que le VirtualKeyboard,
// donc tout le reste de l'app ignore la provenance des notes.

// ── stores/playerStore.ts ── durée de vie : application
{
  ctxState: "suspended" | "running",     // AudioContext démarre sur 1er geste utilisateur
  tempo: number, isPlaying: boolean, loop: {start, end} | null,
  metronome: boolean,
  actions: { play(notes|parts), stop(), setTempo(), toggleMetronome() }
}
// Implémentation : Tone.js — Sampler piano (MVP) + Tone.Transport.
// Les fiches instruments (Module 5) réutilisent le même player avec
// des presets synthétiques par famille (pas de banque orchestrale au MVP).

// ── stores/sessionStore.ts ── durée de vie : page de pratique/exercice
{
  notes: Note[],                          // le matériau en cours d'édition
  selection: Set<noteId>,
  keyHint: KeyContext | null,
  liveAnalysis: LiveAnalysis | null,      // recalculée par worker (voir 3.4)
  history: UndoStack<Note[]>,             // undo/redo (Ctrl+Z indispensable)
  actions: { addNote, updateNotes, deleteSelection, undo, redo, clear, recordFromMidi(bool) }
}

// ── stores/exerciseStore.ts ── durée de vie : Exercise Runner
{
  spec: ExerciseSpec, constraintsState: Record<constraintId, boolean>,
  submitting: boolean, lastReport: FeedbackReport | null,
  actions: { checkConstraints(), submit() }
}

// ── stores/userStore.ts ── durée de vie : application
{ profile, skills, streak, actions: { refresh(), applyXpDelta(delta) } }
// applyXpDelta : mise à jour optimiste à la réception de la réponse de soumission
// (animation XP immédiate), puis refresh() en arrière-plan.
```

**Server state vs client state** : les données API (leçons, historique, progression) passent par **TanStack Query** (cache, invalidation) ; Zustand ne garde que l'état *vivant* (notes en cours, MIDI, transport). Mélanger les deux dans Zustand est l'erreur classique — on l'évite dès le départ.

## 3.4 Analyse temps réel : le pipeline client

Contrainte : l'analyse ne doit **jamais** bloquer le thread UI pendant que l'élève joue.

```
MIDI event ──► midiStore ──► sessionStore.notes (si recording)
                                   │
                                   │ debounce 120 ms après la dernière note
                                   ▼
                      ┌─────────────────────────┐
                      │  Web Worker              │
                      │  @ma/music-core (client) │
                      │  - estimateKey (fenêtre  │
                      │    glissante 16 notes)   │
                      │  - sauts > maxLeap       │
                      │  - notes hors gamme      │
                      │  - détection d'accord    │
                      │    (notes tenues < 80ms  │
                      │    d'écart = simultanées)│
                      └───────────┬─────────────┘
                                  ▼
                  sessionStore.liveAnalysis ──► LiveFeedbackPanel
                                             ──► RollOverlays (surlignage)
```

Deux niveaux de feedback, deux tempos :

| Niveau | Latence | Contenu | Où |
|---|---|---|---|
| **Live** (worker) | < 150 ms | tonalité glissante, hors-gamme, saut brutal, accord détecté | badges + surlignage discret |
| **À la demande** | ~1 s | analyse complète (motifs, tension, structure) via `POST /analysis/*` | MelodyAnalysisView |

Le feedback live est volontairement **non-jugeant** (informer, pas corriger) : pendant qu'on joue, un rouge clignotant à chaque chromatisme serait pédagogiquement désastreux. Les couleurs live sont neutres (bleu = info) ; le rouge/orange n'apparaît que dans les rapports demandés explicitement.

## 3.5 Les 4 écrans clés

### A. Course Reader (`/learn/[module]/[lesson]`)

```
┌────────────┬──────────────────────────────────────────┬─────────┐
│ Sommaire   │  # La clarinette                          │ Sur     │
│ du module  │  ## Registre et tessiture                 │ cette   │
│ (sticky)   │  [InstrumentSheet: tessiture visuelle]    │ page    │
│            │  Texte MDX…                               │ (toc)   │
│ ✓ Leçon 1  │  [MusicExample ▶ : arpège chalumeau]      │         │
│ ✓ Leçon 2  │  ## Erreurs fréquentes                    │         │
│ ● Leçon 3  │  [ComparisonTable]                        │         │
│ 🔒 Leçon 4 │  [QuizBlock 5 questions]                  │         │
│            │  [LessonFooter: exercices liés →]         │         │
└────────────┴──────────────────────────────────────────┴─────────┘
```

Chaque `MusicExample` du MDX embarque ses notes en JSON inline → mini piano-roll lecture seule + bouton ▶ (playerStore). L'élève **entend chaque exemple**, exigence implicite du brief ("audio optionnel" mais différenciant).

### B. Practice Studio — Melody (`/practice/melody`)

```
┌──────────────────────────────────────────────────────────────────┐
│ TransportBar   ⏺ REC │ ♩=90 │ Tonalité détectée: Ré mineur (92%) │
├──────────────────────────────────────────────┬───────────────────┤
│                                              │ LiveFeedbackPanel │
│              PianoRoll (canvas)              │ • 78% conjoint    │
│                                              │ • Ambitus: 11e    │
│                                              │ • Saut m.3 → ok   │
│                                              │ [Analyser à fond] │
├──────────────────────────────────────────────┴───────────────────┤
│ VirtualKeyboard (masqué si device MIDI actif)                     │
└──────────────────────────────────────────────────────────────────┘
```

### C. Exercise Runner (`/exercises/[id]`)

Trois zones : **consigne + ConstraintsChecklist** (gauche, la checklist se coche en direct grâce au music-core client — l'élève sait *avant* de soumettre s'il respecte les contraintes formelles), **éditeur** (PianoRoll ou LayerStack ou OrchestraPalette selon `kind`), **soumission**. Après soumission : ScoreRing animé → FeedbackReport, chaque issue cliquable surligne sa `location` dans le roll, puis `ImprovedVersionDiff` avec écoute A/B.

### D. Progress (`/progress`)

Radar 8 compétences (SVG maison, pas de lib lourde), courbe XP, "compétence la plus faible" → CTA vers le MissionGenerator pré-rempli.

## 3.6 Design system "cinématique"

```typescript
// tailwind.config.ts — extraits des tokens
colors: {
  bg:      { DEFAULT: "#0B0D10", raised: "#12151A", overlay: "#1A1E26" },
  line:    { DEFAULT: "#242A33", strong: "#333B47" },
  text:    { DEFAULT: "#E8EAED", dim: "#9AA3AF", faint: "#5C6672" },
  accent:  { DEFAULT: "#E8B44A", hover: "#F2C566" },   // ambre "pupitre éclairé"
  info:    "#4A9FE8",     // feedback live neutre
  success: "#4AE88F", warn: "#E8A44A", error: "#E85A4A",
  // familles d'instruments (constantes dans toute l'app : palette, heatmap, roll)
  fam: { strings: "#C97B4A", winds: "#6FBF73", brass: "#E8C44A",
         perc: "#B06FBF", keys: "#5C9FD6", synth: "#4ADCE8", voice: "#E86FA0" }
}
fontFamily: {
  sans: ["Inter", ...],           // UI
  display: ["Fraunces", ...],     // titres de leçons — touche "partition ancienne"
  mono: ["JetBrains Mono", ...],  // notation textuelle, degrés, chiffrages
}
```

Principes DAW appliqués : densité d'information élevée mais hiérarchisée, panneaux redimensionnables (`react-resizable-panels`), raccourcis clavier globaux (`Espace` = play/stop, `R` = rec, `Ctrl+Z/Y`, `Suppr`), aucune animation > 200 ms, focus visible ambre. Le fond quasi-noir `#0B0D10` (pas #000) réduit la fatigue en session longue — même logique que Cubase/Nuendo.

## 3.7 Points de vigilance techniques

| Risque | Parade |
|---|---|
| Web MIDI absent (Safari, Firefox partiel) | Détection → bandeau explicite + VirtualKeyboard toujours fonctionnel ; l'app est utilisable à 100% sans device |
| AudioContext bloqué avant geste utilisateur | `Tone.start()` sur le premier clic ▶, état visible dans TransportBar |
| PianoRoll lent en DOM | Canvas + virtualisation dès le MVP (un roll DOM meurt à ~300 notes) |
| Latence MIDI→son | Sampler préchargé, pas de `setTimeout` : scheduling Tone.Transport |
| Worker + music-core | build du package en double cible (ESM browser / node) via tsup — déjà prévu en 1.4 |

## Checklist de validation Frontend

- [x] Routes App Router complètes, RSC là où c'est du contenu, client là où c'est du temps réel
- [x] PianoRoll canvas réutilisé dans les 3 contextes (lecture / live / édition)
- [x] MIDI et clavier virtuel unifiés en amont → un seul format d'événement
- [x] Analyse live en Web Worker, non-bloquante, non-jugeante ; analyse profonde à la demande
- [x] ConstraintsChecklist en direct = l'élève ne soumet jamais à l'aveugle
- [x] Zustand = état vivant ; TanStack Query = état serveur (séparation stricte)
- [x] Design tokens sombres + couleurs par famille d'instruments, cohérents partout
- [x] Utilisable sans matériel MIDI (accessibilité du produit)

---

**Point de confirmation.** Prochaine section, la plus lourde : **Core Services en profondeur** — algorithmes du MusicAnalysisService (détection de tonalité, d'accords, de cadences, règles de contrepoint, heuristiques d'orchestration), l'ExerciseGenerator paramétrique, et le FeedbackEngine avec son scoring détaillé. Ou préfères-tu que j'attaque d'abord le **contenu pédagogique** (rédaction intégrale de 2–3 leçons + exercices JSON) ? Les deux sont au programme — dis-moi l'ordre.