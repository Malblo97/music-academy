# SECTION 4 — CORE SERVICES EN PROFONDEUR

Quatre services, un principe : **tout est déterministe, explicable, testable**. Chaque résultat doit pouvoir répondre à "pourquoi ?" — c'est la condition du feedback pédagogique honnête.

---

## 4.1 MusicAnalysisService

Façade fine autour de `@ma/music-core`. Je détaille les algorithmes module par module.

### 4.1.1 Détection de tonalité (`keyDetect`)

**Algorithme : corrélation de profils Krumhansl-Schmuckler, adapté.**

```
1. Construire le vecteur de durées par pitch-class :
   pcWeights[0..11] = Σ durées des notes de cette classe
   (pondérer par durée, PAS par occurrence — une ronde compte plus qu'une croche)

2. Pondérations additionnelles :
   × 1.5 pour les notes sur temps forts (position % ticksParMesure)
   × 1.3 pour la première et la dernière note (ancrage tonal)

3. Corréler avec les 24 profils (12 majeurs, 12 mineurs) :
   score(key) = corrélation de Pearson(pcWeights, profil tourné)

4. Retourner : { tonic, mode, confidence, alternates[3] }
   confidence = (score₁ − score₂) / score₁   // écart au 2e candidat
```

**Décisions spécifiques au produit :**

| Cas | Traitement |
|---|---|
| `confidence < 0.15` | Retourner `ambiguous: true` → le feedback dit "ta tonalité est ambiguë entre Ré m et Fa M" au lieu d'affirmer à tort. **Ne jamais faire semblant de savoir.** |
| Mineur mélodique/harmonique | Profils mineurs étendus : la sensible (VII♯) ne pénalise pas la corrélation mineure |
| Mode (dorien, mixolydien…) | Passe 2 : si majeur détecté mais ♭7 très pondéré → proposer mixolydien ; si mineur avec 6te majeure → dorien. Essentiel pour la musique de film (Module 9) |
| Fenêtre glissante (live) | 16 dernières notes, recalcul débounce 120 ms ; l'historique des estimations permet de détecter une **modulation** (changement stable > 8 notes) |
| `hint` fourni par l'exercice | La tonalité imposée devient le contexte ; la détection ne sert qu'à vérifier la cohérence |

### 4.1.2 Détection d'accords (`chords`)

```
1. SEGMENTATION : regrouper les notes en événements verticaux
   - simultanées si |start_a − start_b| < 30 ticks (~15 ms à 120 BPM)
   - arpèges : fenêtre harmonique = 1 temps si les notes se chevauchent
     ou appartiennent au même beat sans note étrangère intercalée

2. Pour chaque segment, ensemble de pitch-classes → matching :
   dictionnaire ordonné par spécificité décroissante :
   maj7, m7, 7, m7b5, dim7, maj, min, dim, aug, sus4, sus2,
   puis extensions : 9, b9, #9, 11, #11, 13, b13, 6, m6, add9…

3. Score de matching :
   +2 par note de l'accord présente
   −1 par note étrangère au candidat
   +1 si la basse (note la plus grave) = fondamentale
   +0.5 si la basse = tierce ou quinte (renversement plausible)

4. Sortie : { root, quality, extensions[], bass, inversion, confidence }
   Notes non expliquées → tension: ["passing" | "neighbor" | "appoggiatura"]
   selon leur résolution (conjoint descendant vers note d'accord = appoggiature…)
```

**Cas jazz (Module 8)** : voicings sans fondamentale (rootless) — si le matching échoue mais que {3,7,9,13} d'un X7 sont présents, proposer le candidat avec `impliedRoot: true`. Le dictionnaire couvre drop 2 / drop 3 par détection d'écarts caractéristiques entre voix.

### 4.1.3 Analyse harmonique fonctionnelle (`harmony`)

Une fois les accords détectés + tonalité connue :

```
functionOf(chord, key) → { degree: "ii", function: T | S | D, chromatic? }

Table diatonique (majeur) :  I=T, ii=S, iii=T faible, IV=S, V=D, vi=T, vii°=D
Chromatismes reconnus :
  - V/x  : dominante secondaire (X7 dont la cible diatonique suit dans ≤ 2 accords)
  - subV : substitution tritonique (7 à un triton de V, résolution ½ ton desc.)
  - iv en majeur, ♭VI, ♭VII : emprunts modaux (tags "borrowed")
  - N6, It/Fr/Ger+6 : sixtes augmentées (V1, pas MVP)

detectCadence(progression) :
  fenêtre sur les 2–3 derniers accords + position métrique :
  V→I (fond. à la basse, I sur temps fort)   → perfect (authentique parfaite)
  V→I (renversement ou mélodie ≠ tonique)    → imperfect
  IV→I                                        → plagal
  …→V (fin sur V)                             → half
  V→vi                                        → deceptive (rompue)
```

**Suggestions d'enrichissement/substitution (Harmony Coach)** — moteur de règles génératives, chacune avec sa pédagogie :

| Règle | Condition | Suggestion | `why` (extrait) |
|---|---|---|---|
| `sub.relative` | accord majeur, fonction T | remplacer par vi (ou l'inverse) | même fonction, couleur assombrie |
| `sub.tritone` | X7 fonction D | subV(7♯11) | basse chromatique descendante, tension néo-noir |
| `enrich.add9` | triade M/m, style ≠ strict | add9 | épaissit sans changer la fonction |
| `sub.borrowed-iv` | IV en majeur, mood triste/romantique | iv | l'emprunt modal le plus expressif du cinéma |
| `sub.secondary-dom` | tout accord cible diatonique | insérer V/x avant | dramatise l'arrivée |
| `reharm.line-cliche` | accord tenu ≥ 2 mesures | ligne chromatique interne | mouvement sans changer d'harmonie |

Chaque suggestion est **jouable** (le service génère le voicing concret, 4 voix, voice leading correct) — d'où les `SuggestionChips` cliquables du front.

### 4.1.4 Analyse mélodique (`melody`)

```
contour()        : chaîne de directions {U, D, R} + segmentation en arches
                   → détecte : arche classique, ligne descendante "lament",
                     ascension héroïque, statisme (tension par répétition)
leapProfile()    : % conjoint / sauts petits (3ce) / grands (≥ 4te)
                   + compensation : chaque saut ≥ 5te est-il suivi d'un
                     mouvement contraire conjoint ? (règle "leap recovery")
findMotifs()     : n-grammes d'intervalles (longueur 3–6) ;
                   égalité = exacte | transposée | augmentée/diminuée rythmiquement
                   → { motif, occurrences[], variationTypes[] }
tensionCurve()   : par note, somme pondérée de :
                   stabilité du degré (1̂,3̂,5̂ stables ; 4̂,7̂ instables ; chromatique max)
                   + hauteur relative dans l'ambitus
                   + dissonance vs accord courant (si contexte harmonique)
                   + surprise intervallique (grand saut = pic)
                   → courbe normalisée 0..1, affichée par TensionCurve.tsx
phraseAnalysis() : détection de respirations (silences ≥ 1 temps, notes longues)
                   → phrases ; symétrie antécédent/conséquent (4+4 ?)
rhythmProfile()  : densité, syncopes (attaques sur contretemps pondérées),
                   variété des durées (entropie), motifs rythmiques récurrents
```

`findMotifs` est la fonction pédagogiquement la plus rentable : elle nourrit à la fois le feedback positif ("motif réutilisé 3× dont 1 transposition — très bon pour la mémorisation") et négatif ("aucune répétition détectée : ta mélodie est difficile à mémoriser" / "répétition exacte 6× sans variation : monotonie").

### 4.1.5 Voice leading & contrepoint (`voiceLeading`, `counterpoint`)

Représentation : `parts: Note[][]` alignées par tick. Règles vérifiées par paire de voix :

```
Mouvements entre deux accords consécutifs, pour chaque paire (a,b) :
  parallelFifths()   : intervalle = 5te juste avant ET après, mêmes voix, mouvement //
  parallelOctaves()  : idem octave/unisson
  hiddenFifths()     : mouvement direct vers 5te/8ve, soprano par saut (sévérité moindre)
  voiceCrossing()    : voix a passe sous voix b
  overlap()          : a monte au-delà de l'ancienne position de b
  spacing()          : > 8ve entre voix adjacentes (sauf ténor-basse)
  resolution()       : sensible → tonique (voix extrêmes obligatoire) ;
                       7e d'accord → descente conjointe
  augmentedSecond()  : mélodique, en contexte mineur harmonique strict
```

Contrepoint d'espèces (Module 4) — chaque espèce est un **jeu de règles paramétré**, pas du code séparé :

| Espèce | Ratio | Règles additionnelles activées |
|---|---|---|
| 1re | 1:1 | consonances uniquement ; départ/arrivée 8ve-5te-unisson ; climax unique ; mouvements contraires majoritaires |
| 2e | 2:1 | temps fort consonant ; temps faible dissonant SEULEMENT si passage conjoint |
| 3e | 4:1 | idem + cambiata reconnue comme idiome légal |
| 4e | syncopes | dissonance préparée-suspendue-résolue (7-6, 4-3, 9-8) |
| 5e | fleuri | combinaison ; densité de dissonances plafonnée |

Chaque violation renvoie `{ruleId, tick, voices, pedagogy}` → surlignage précis dans le roll. Le `styleProfile` fait le reste : en `epic-film`, `parallelFifths` a un poids 0.1 (quintes parallèles = son "trailer" assumé) avec un texte différent : *"Quintes parallèles détectées — interdites en écriture classique, mais c'est ici un choix de couleur valide (puissance brute). Assure-toi que c'est voulu."* **Même règle, deux pédagogies** — la table `pedagogy` peut être surchargée par style.

### 4.1.6 Heuristiques d'orchestration (`orchestration`)

Base de données statique dans music-core (~40 instruments) :

```typescript
InstrumentDef = {
  id: "french-horn",
  family: "brass",
  range: { low: 34, high: 77 },              // MIDI, limites praticables
  sweetSpot: { low: 46, high: 70 },          // registre expressif
  registerZones: [                            // couleur par zone
    { from: 34, to: 45, color: "sombre, pédale, risqué en pp" },
    { from: 46, to: 65, color: "noble, chaleureux — LE registre du cor" },
    { from: 66, to: 77, color: "héroïque, tendu, fatiguant" }],
  dynamicPower: { pp: 2, ff: 9 },            // puissance relative 1..10
  agility: 4,                                 // 1..10 (traits rapides)
  sustainCapable: true,
  roles: ["harmony", "countermelody", "melody", "texture"],
  blendsWith: ["cello", "bassoon", "trombone", "strings-section"],
  avoidWith: [{ id: "trumpet", reason: "à l'unisson ff, le cor disparaît" }],
}
```

Vérifications sur un `Score` multi-parts :

```
rangeViolations()  : notes hors range (error) ou hors sweetSpot (info avec la
                     couleur de zone : "ce passage de flûte est dans le grave,
                     il sera inaudible sous les cordes")
densityMap()       : grille (bandes de registre × temps) ; comptage pondéré par
                     dynamicPower → zones > seuil = surcharge (heatmap du front)
maskingRisks()     : deux parts de rôle ≠ dans la même bande de registre avec
                     dynamiques proches → "ton contrechant de violoncelle est
                     masqué par les cors : même registre, même dynamique"
roleCoverage()     : la partition a-t-elle mélodie ? basse ? Un trou de rôle
                     n'est pas une erreur, mais est signalé ("pas de basse :
                     voulu ? L'orchestre flotte")
balanceCheck()     : dynamicPower cumulé par rôle → la mélodie (1 hautbois, 5)
                     face à l'accompagnement (tutti cuivres, 27) = étouffée
```

C'est volontairement **heuristique et assumé comme tel** : le feedback d'orchestration utilise "risque de", "sera probablement", jamais de certitudes acoustiques. Honnêteté = crédibilité du produit auprès de musiciens.

---

## 4.2 FeedbackEngine

Pipeline : `(Violations, Metrics, Rubric, StyleProfile, UserLevel) → FeedbackReport`

### Scoring /100

```
score = correctness × w_c + constraints × w_k + craft × w_f     (w = rubric)

CORRECTNESS (règles dures, pondérées par style) :
  100 − Σ pénalité(v) où pénalité = base(severity) × ruleWeight(style) × repetitionDamper
    base : error 12, warning 5, suggestion 0
    repetitionDamper : 1re occurrence ×1, suivantes ×0.4 (une erreur répétée
    est UNE leçon à apprendre, pas dix fautes)
  plancher 0

CONSTRAINTS (binaire par contrainte, partiel si mesurable) :
  ex : lengthBars [4,8] demandé, rendu 3 mesures → ratio 3/4 = 75% de ce critère
  moyenne pondérée des contraintes de la spec

CRAFT (bonus qualitatifs, mesurés) :
  + variété rythmique (entropie des durées dans une cible par niveau)
  + présence de motif réutilisé avec ≥ 1 variation
  + arche de tension (corrélation de tensionCurve avec un gabarit du mood cible)
  + compensation des sauts
  chaque critère 0..1 → moyenne × 100
```

**Adaptation au niveau** (le même rendu ne vaut pas le même score) :

| UserLevel | Règles actives | Craft attendu |
|---|---|---|
| 1–5 (débutant) | erreurs fondamentales seulement (`appliesTo` filtre) | motif présent = bonus, absent = pas de malus |
| 6–15 | + warnings de style | arche de tension évaluée |
| 16+ (avancé/pro) | tout, seuils resserrés | monotonie pénalisée, originalité intervallique mesurée (distribution vs corpus de clichés) |

### Sélection pédagogique des issues (le "coach")

```
1. Trier : errors > warnings > suggestions, puis par impact score
2. Grouper par ruleId (6 quintes parallèles = 1 issue, 6 locations)
3. Plafond : 3 issues (niveau 1–5), 5 (6–15), 8 (16+)
4. Toujours ≥ 2 strengths, même sur un rendu faible — les strengths sont
   MESURÉES (motifs, contour, respect partiel), jamais des compliments vides.
   S'il n'y a objectivement rien : "tu as terminé l'exercice dans les
   contraintes de longueur" reste factuel.
5. Reste de l'analyse → section repliée "analyse complète"
```

### `improvedVersion` — transformations rule-based

Ordre d'application (chaque transformation loggue sa justification) :

```
1. Hors-tonalité non résolus  → note diatonique la plus proche compatible accord
2. Saut non compensé          → insérer/modifier la note suivante : mouvement
                                contraire conjoint
3. Sensible non résolue       → forcer résolution à la tonique
4. Monotonie (motif ×N exact) → 3e occurrence : transposition à la 2de ou
                                variation rythmique (augmentation)
5. Fin non conclusive         → allonger la dernière note + la poser sur 1̂ ou 3̂
GARDE-FOU : ≤ 30% des notes modifiées. Au-delà, pas d'improvedVersion —
"reprends l'exercice avec ces conseils" (réécrire à sa place n'apprend rien).
```

---

## 4.3 ExerciseGenerator

Générateur **paramétrique par templates** — pas de génération libre :

```typescript
GeneratorTemplate = {
  kind: "MELODY_COMPOSE",
  paramSpace: {
    key:        weightedPick(userWeakKeys ∪ allKeys),   // cible les tonalités faibles
    mode:       byMood,                                  // triste → mineur/dorien…
    mood:       pick(spec.moods),
    lengthBars: byDifficulty,     // d1-3: [4,4] ; d4-6: [8,8] ; d7+: [8,16]
    maxLeap:    byDifficulty,     // d1-3: 5te ; d4-6: 8ve ; d7+: libre
    requiredCadence: byDifficulty,
  },
  promptTemplate: "Compose une mélodie {mood} en {key} {mode}, {lengthBars}
                   mesures, {constraints...}",
  styleProfileId: byMood,         // triste → "romantic-film" ; héroïque → "epic-film"
  rubric: byKind,
}
```

Pour `MELODY_CONTINUE` et `HARMONIZE_MELODY`, le générateur doit produire le **matériau donné** : mélodies d'amorce générées par marche aléatoire contrainte (probabilités : 60% conjoint, 25% 3ce, 15% saut compensé ; rythme tiré de patterns idiomatiques par mood ; validées par le propre analyseur — un matériau généré qui ne score pas ≥ 90 chez nous est rejeté et retiré). **Le générateur mange sa propre nourriture** : c'est le test d'intégration permanent du moteur.

Ciblage adaptatif : `POST /exercises/generate` sans paramètres → le service lit `SkillState`, prend la compétence la plus faible, une difficulté = niveau de compétence ± 1, et les tonalités les moins pratiquées (stats des soumissions). C'est le moteur du CTA "travailler mon point faible" du dashboard.

---

## 4.4 CourseEngine

Le plus simple, mais deux mécanismes à préciser :

**Gating** : une leçon est déverrouillée si `user.level ≥ module.minLevel` ET leçon précédente `COMPLETED` (quiz ≥ 60). Les modules 1→4 sont séquentiels ; 5→10 s'ouvrent en parallèle dès le niveau requis (un élève peut faire orchestration et jazz en même temps — c'est réaliste).

**Liaison contenu ↔ moteur** : le MDX peut référencer des règles : `<RuleCard id="melody.leap-recovery" />` rend la pédagogie de la règle (why/how/when/mistakes/alternatives) **depuis music-core** — la théorie du cours et le feedback des exercices citent littéralement la même source. Zéro divergence possible entre "ce que le cours enseigne" et "ce que le correcteur exige". C'est l'exigence "aucune étape théorique sautée" rendue structurelle.

---

## 4.5 Stratégie de tests du music-core

```
packages/music-core/test/
├── fixtures/           # cas en JSON : notes + résultat attendu annoté à la main
│   ├── keys/           # 60+ mélodies étiquetées (dont ambiguës, modales, modulantes)
│   ├── chords/         # voicings serrés, larges, rootless, renversés
│   ├── cadences/
│   ├── counterpoint/   # exemples licites ET fautifs par espèce
│   └── orchestration/
└── property/           # tests par propriétés (fast-check) :
    # transposer une mélodie ne change ni contour ni violations
    # une gamme majeure pure → détection = 100% confidence
    # improvedVersion re-analysée → score strictement supérieur
```

La dernière propriété est le garde-fou absolu : **si la "version améliorée" ne score pas mieux que l'original, le moteur est incohérent** — test bloquant en CI.

---

## Checklist de validation Core Services

- [x] Détection de tonalité pondérée durée/métrique, avoue son ambiguïté, gère les modes
- [x] Détection d'accords : renversements, extensions, rootless jazz, notes étrangères qualifiées
- [x] Harmonie fonctionnelle + cadences + suggestions jouables avec pédagogie
- [x] Mélodie : contour, motifs, tension, phrasé — nourrit strengths ET issues
- [x] Contrepoint = jeux de règles paramétrés par espèce ; sévérité modulée par style avec pédagogie surchargeable
- [x] Orchestration : base d'instruments structurée, densité, masquage, équilibre — heuristique assumée
- [x] Scoring à 3 composantes, adapté au niveau, erreurs répétées amorties
- [x] Coach : issues plafonnées, strengths mesurées, improvedVersion bornée à 30%
- [x] Générateur paramétrique auto-validé par le moteur, ciblage adaptatif
- [x] RuleCard : cours et correcteur citent la même source
- [x] Tests : fixtures annotées + propriétés invariantes bloquantes

---

**Point de confirmation.** Il reste deux gros blocs : le **contenu pédagogique exemplaire** (2–3 leçons rédigées intégralement — je propose : une leçon Module 1 "Tensions et résolutions", une fiche instrument Module 5 "Le cor", une leçon Module 9 "Néo-noir" — plus 2–3 exercices complets au format JSON `ExerciseSpec`), puis la **Roadmap MVP → V1**. Je pars sur le contenu ?