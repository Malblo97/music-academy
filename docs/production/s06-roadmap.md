# SECTION 6 — ROADMAP MVP → V1

## 6.1 Principe directeur : le moteur d'abord

L'erreur classique serait de commencer par l'app (auth, pages, design) et de garder « la musique » pour plus tard. C'est l'inverse qu'il faut faire : **toute la valeur du produit est dans `music-core` + le contenu**. Si le moteur d'analyse est médiocre, le reste n'est qu'un joli site de cours de plus. Donc :

```
Ordre de construction (dépendances réelles) :

music-core ──► analysis/feedback ──► exercise engine ──► frontend riche
    │                                                        ▲
    └──► contenu (leçons citent les règles) ─────────────────┘

Auth, progression, XP, dashboard : en parallèle, n'importe quand,
c'est du CRUD sans risque.
```

Corollaire : **les 3 premières semaines ne produisent aucun écran**. C'est contre-intuitif et c'est voulu.

## 6.2 Découpage en phases

```
Phase 0        Phase 1           Phase 2            Phase 3         V1
FONDATIONS     MOTEUR            PRODUIT MVP        BETA PRIVÉE
S1–S2          S3–S8             S9–S16             S17–S20         S21–S32
├ monorepo     ├ music-core      ├ frontend complet ├ 15–30 vrais   ├ modules 4,7,8,
├ CI/CD        │ (pitch→melody   ├ Course Reader    │ utilisateurs  │ 10 complets
├ auth         │  →harmony→VL)   ├ Practice melody  ├ calibrage     ├ orchestration
├ schéma DB    ├ feedback engine │  + harmony       │ scoring       │ + layering
├ content      ├ 400+ fixtures   ├ Exercise Runner  ├ contenu M2,   ├ générateur
│  pipeline    ├ exercices A/B/C │  + export MIDI/  │  M3, M9       │  adaptatif
└ tokens UI    │  fonctionnels   │  PDF             └ correction    ├ StaffLite→
               └ leçons gabarit  ├ progression/XP     des règles    │  notation V1
                 (M1 complet)    └ déploiement        mal calibrées └ paiement/SaaS
```

## 6.3 Périmètre MVP — exact et négatif

**Dans le MVP (fin S16)** :

| Bloc | Contenu MVP |
|---|---|
| Modules de cours | **M1 complet** (25 leçons), **M2 complet** (15), **M5 partiel** (12 fiches : cordes + cor + trompette + flûte/clarinette/hautbois + piano), **M9 partiel** (4 genres : romance, épique, néo-noir, thriller) |
| Exercices | ~80 rédigés main + générateur pour `MELODY_COMPOSE` uniquement |
| Practice Studio | Melody + Harmony Coach (pas orchestration/layering) |
| Moteur | keyDetect, chords, harmony/cadences, melody complet, voice leading de base (parallèles, résolutions, espacement) |
| Kinds d'exercices | MELODY_COMPOSE, MELODY_CONTINUE, HARMONY_PROGRESSION, THEORY_QUIZ |
| Export | MIDI + PDF mission |
| Entrées | Web MIDI + clavier virtuel + saisie piano roll |

**Hors MVP (assumé, communiqué)** : contrepoint d'espèces complet (M4), orchestration multi-parts et heatmap (→ V1), layering sound design (→ V1), EAR_QUIZ audio, mode adaptatif du générateur, notation sur portée, paiement. Le MVP est **gratuit en beta fermée** — on vend quand le feedback est calibré, pas avant.

**Test de sortie du MVP** (critères mesurables, pas de "ça a l'air bien") :

- [ ] Un débutant complet finit M1-L1→L5 + 3 exercices sans aide extérieure (test utilisateur filmé, 5 personnes)
- [ ] Sur 50 soumissions de test annotées à la main par toi/un musicien : accord score moteur ↔ score humain à ±10 points dans 80 % des cas
- [ ] Zéro feedback jugé « faux musicalement » par un musicien pro sur 30 rapports relus (les « discutables » sont tolérés, les « faux » non)
- [ ] Latence live < 150 ms avec clavier MIDI, roll fluide à 500 notes
- [ ] `improvedVersion` re-scorée > originale dans 100 % des cas (propriété CI)

## 6.4 Sprint par sprint (Phases 0–2)

| Sprint | Livrable | Détail |
|---|---|---|
| **S1–S2** | Fondations | Turborepo, NestJS+Prisma+migrations, auth JWT complète, pipeline `content-sync` (MDX→DB), tokens Tailwind, CI (lint, test, typecheck, deploy staging) |
| **S3–S4** | music-core I | `pitch`, `scales`, `rhythm`, `keyDetect` + 100 fixtures tonalité. **Jalon : détection correcte sur les 60 mélodies annotées** |
| **S5–S6** | music-core II | `chords`, `harmony` (fonctions, cadences, suggestions), `melody` (contour, motifs, tension) + fixtures. Architecture `Rule` + registre de règles |
| **S7–S8** | Feedback + exercices | FeedbackEngine (scoring 3 composantes, sélection d'issues, improvedVersion), pipeline de soumission bout en bout **en tests d'intégration**, exercices A et B du §5.4 corrigés correctement. **Jalon : soumettre du JSON brut via l'API et recevoir un rapport pédagogiquement bon** |
| **S9–S10** | PianoRoll + player | Canvas roll (édition, undo, zoom), VirtualKeyboard, TransportBar, Tone.js sampler, stores midi/player/session, Web MIDI |
| **S11–S12** | Practice Studio | Melody live (worker + LiveFeedbackPanel + analyse à la demande), Harmony Coach (détection accords + SuggestionChips jouables) |
| **S13–S14** | Course + Exercise Runner | LessonRenderer MDX + MusicExample ▶ + Quiz + gating ; Exercise Runner complet (checklist live, ScoreRing, FeedbackReport cliquable, ImprovedVersionDiff A/B) |
| **S15–S16** | Progression + polish | XP/niveaux/radar, dashboard, exports MIDI/PDF, settings MIDI, onboarding (« as-tu un clavier ? Cubase ? »), déploiement prod. **Rédaction contenu en parallèle continu depuis S5** |

**⚠️ Le chemin critique caché : la rédaction.** ~55 leçons MVP au gabarit de la Section 5 ≈ 3–4 h/leçon avec exemples jouables et quiz = **~200 h de travail éditorial**. C'est autant que le code du frontend. À lancer dès S5 (le gabarit existe), en continu, sinon S13 arrive avec un Course Reader vide. Si tu es seul : 2 leçons/semaine dès maintenant, ou le MVP glisse de deux mois.

## 6.5 Beta privée (S17–S20) : calibrer, pas construire

Recruter 15–30 utilisateurs réels (forums compo à l'image, communautés Cubase, écoles de musique) avec un contrat clair : accès gratuit contre feedback hebdo.

Instrumentation à poser avant la beta :
- table `admin/stats` déjà prévue : **score moyen et taux d'abandon par exercice** → un exercice avec score moyen < 40 ou > 95 est mal calibré ;
- bouton « ce feedback est faux/injuste » sur chaque issue du rapport → chaque signalement devient une fixture de test (vraie ou fausse alerte, les deux sont de l'or) ;
- funnel : inscription → 1re leçon finie → 1er exercice soumis → J7 retention.

Le travail de ces 4 semaines est à 80 % du **réglage de `ruleWeights`, de seuils et de textes pédagogiques** — pas des features. Résister à la tentation d'en ajouter.

## 6.6 V1 (S21–S32)

| Bloc | Contenu |
|---|---|
| Contenu | M3 (harmonie avancée), M4 (contrepoint + espèces), M5 complet (35 fiches), M7, M8 (jazz), M10 (Cubase — leçons DAW_MISSION avec checklists), M6 + M11 |
| Moteur | contrepoint d'espèces, `orchestration` complet (densityMap, masking, balance), analyse multi-parts |
| Practice | Orchestration Guided Learning (OrchestraPalette + DensityHeatmap), Layering sound design |
| Exercices | ORCHESTRATE, COUNTERPOINT, VOICE_LEADING, LAYERING, EAR_QUIZ (Tone.js génère l'audio des quiz — pas d'assets à produire), générateur adaptatif complet |
| Notation | StaffLite → notation lecture correcte (VexFlow), transpositions automatiques des instruments |
| SaaS | Stripe, plan gratuit (M1 + 10 exercices) / plan payant, emails transactionnels, RGPD |

## 6.7 Registre des risques

| Risque | Probabilité | Impact | Parade |
|---|---|---|---|
| Feedback musical perçu comme faux/injuste | moyenne | **fatal** (crédibilité) | fixtures massives, ton prudent sur l'heuristique, bouton de signalement, beta de calibrage dédiée |
| Sous-estimation du contenu éditorial | **haute** | glissement 2–3 mois | démarrage S5, gabarit strict, volumétrie suivie hebdo |
| Web MIDI/latence décevants sur machines réelles | moyenne | moyen | app 100 % utilisable sans MIDI (déjà conçu), tests multi-OS dès S9 |
| Scoring « gamé » (l'élève optimise le score, pas la musique) | moyenne | moyen | craft mesuré sur plusieurs axes, noveltyFactor, exercices générés variés |
| Périmètre qui enfle (« et si on ajoutait… ») | **haute** | glissement | ce document = contrat de périmètre ; toute addition passe par retrait équivalent |
| Un seul dev sur un produit à deux métiers (code + pédagogie) | haute | épuisement | envisager un co-rédacteur musicien dès la beta ; le pipeline Git/MDX le permet sans accès au code |

## 6.8 Semaine 1, concrètement

```
Jour 1–2 : monorepo Turborepo, packages vides typés, CI verte
Jour 3   : schéma Prisma migré, seed minimal, auth register/login/me
Jour 4–5 : content-sync : un MDX de test traverse Git → DB → API GET /lessons/:id
Weekend  : relire Section 4, écrire les 20 premières fixtures de keyDetect
           (des mélodies que TU annotes à la main — c'est le vrai début du produit)
```

---

## Récapitulatif final du plan complet

| Section | Livré |
|---|---|
| 1. System design | Monolithe modulaire, `music-core` isomorphe, flux A/B/C, monorepo |
| 2. Backend | Dossiers NestJS, schéma Prisma intégral, ~30 endpoints, contrats Zod, pipeline de soumission, barème XP |
| 3. Frontend | Routes App Router, arbre de composants, 5 stores Zustand, worker d'analyse live, 4 écrans clés, design system |
| 4. Core services | Algorithmes complets (tonalité, accords, fonctions, mélodie, contrepoint, orchestration), scoring, coach, générateur, stratégie de tests |
| 5. Contenu | 3 leçons intégrales (gabarit éditorial), 3 exercices JSON, charte, volumétrie |
| 6. Roadmap | Phases S1–S32, périmètre MVP exact, critères de sortie mesurables, risques, semaine 1 |

Le plan est exécutable tel quel. Si tu veux pousser plus loin, les suites naturelles les plus rentables seraient : **(a)** la rédaction du registre complet des règles (`melody.*`, `harmony.*`, `voiceLeading.*`, `orch.*` — id, sévérité, pédagogie, poids par style : c'est le référentiel qui alimente à la fois le moteur et le contenu), **(b)** le squelette de code réel de `music-core` (signatures TypeScript + implémentation de `keyDetect` et `detectChord`), ou **(c)** la rédaction en série des leçons du Module 1. Dis-moi où tu veux creuser.