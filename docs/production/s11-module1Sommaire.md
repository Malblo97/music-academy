# SECTION 11 — MODULE 1 : SOMMAIRE COMPLET + LEÇONS 1–2 INTÉGRALES

## 11.1 Les 25 leçons du Module 1 (plan de production)

| # | id | Titre | Règles citées | min |
|---|---|---|---|---|
| 1 | m01-l01 | Le son, la note, le clavier : ton alphabet | — | 20 |
| 2 | m01-l02 | Les intervalles : mesurer la musique | melody.tritone-leap (préfiguré) | 25 |
| 3 | m01-l03 | La gamme majeure : l'échelle de référence | melody.out-of-key | 20 |
| 4 | m01-l04 | Degrés et fonctions des notes | — | 20 |
| 5 | m01-l05 | Tonalités et armures : le cycle des quintes | — | 25 |
| 6 | m01-l06 | Les gammes mineures (naturelle, harmonique, mélodique) | vl.augmented-second | 25 |
| 7 | m01-l07 | Les modes : sept couleurs pour le cinéma | — | 30 |
| 8 | m01-l08 | Rythme I : pulsation, mesures, valeurs | rhythm.meter-integrity | 20 |
| 9 | m01-l09 | Rythme II : syncopes, triolets, contretemps | rhythm.syncopation-target | 25 |
| 10 | m01-l10 | Tempo, nuances, articulations : les mots de l'expression | — | 20 |
| 11 | m01-l11 | Construire les triades | — | 20 |
| 12 | m01-l12 | Renversements et positions | vl.spacing | 20 |
| 13 | m01-l13 | Accords de 7e : le premier enrichissement | harmony.unresolved-seventh | 25 |
| 14 | m01-l14 | Tension et résolution : le moteur de toute musique | melody.tension-placement | 25 |
| 15 | m01-l15 | Fonctions harmoniques : T, S, D | harmony.retrogression | 25 |
| 16 | m01-l16 | Les cadences : ponctuer la musique | harmony.no-cadence, melody.ending-weak | 25 |
| 17 | m01-l17 | Enrichissements : add9, sus, 6te | harmony.poor-vocab | 20 |
| 18 | m01-l18 | Tensions d'accord : 9, 11, 13 | — | 25 |
| 19 | m01-l19 | Dominantes secondaires : dramatiser une arrivée | sub.secondary-dom | 25 |
| 20 | m01-l20 | Substitutions : relative, tritonique | sub.relative, sub.tritone | 30 |
| 21 | m01-l21 | Emprunts modaux : la couleur du cinéma | sub.borrowed-iv | 25 |
| 22 | m01-l22 | Chromatismes mélodiques : passer entre les notes | melody.out-of-key | 20 |
| 23 | m01-l23 | Moduler I : tonalités voisines, accord pivot | harmony.overchromatic | 30 |
| 24 | m01-l24 | Moduler II : modulations expressives du film | — | 25 |
| 25 | m01-l25 | Synthèse : analyse guidée d'une progression complète | (toutes) | 35 |

La leçon 14 est déjà écrite (§5.1). Voici les leçons 1 et 2, intégrales.

---

## 11.2 LEÇON m01-l01 — « Le son, la note, le clavier : ton alphabet »

```mdx
---
id: m01-l01-notes-clavier
module: module-01-fondamentaux
title: "Le son, la note, le clavier : ton alphabet"
estMinutes: 20
skills: { melody: 0.5, rhythm: 0.5 }
---
```

### Pourquoi commencer ici

Tout ce que tu composeras — le thème qui fait pleurer, le braam qui fait sursauter — sera fait de notes placées dans le temps. Cette leçon installe l'alphabet ; la grammaire viendra ensuite. Elle est courte, mais **fais chaque manipulation au clavier** : la théorie qui ne passe pas par les doigts s'évapore.

### 1. La hauteur : douze noms, à l'infini

Une note est d'abord une **hauteur**. Le système occidental en nomme douze, qui se répètent de grave en aigu :

```
do  do♯  ré  ré♯  mi  fa  fa♯  sol  sol♯  la  la♯  si   puis do à nouveau
C   C#   D   D#   E   F   F#   G    G#    A    A#   B    (notation anglo-saxonne)
```

Le produit utilise la notation anglo-saxonne (`C`, `D`, `E`…) parce que c'est celle de Cubase, de tes banques de sons et du MIDI. Les deux te seront demandées au quiz — un compositeur de film navigue entre les deux mondes.

Chaque répétition du cycle s'appelle une **octave**, numérotée : `C4` est le do central du piano. `C5` est le do au-dessus, `C3` en dessous. En MIDI, chaque note a un numéro : `C4 = 60`, et chaque demi-ton ajoute 1 (`C#4 = 61`, `D4 = 62`…). Retiens `C4 = 60` : c'est la boussole de tout ton travail en DAW.

<MusicExample id="octaves" title="La même note, trois étages">
  C3:h C4:h C5:h C4:w
  Écoute : c'est « le même do » — même identité, autre altitude. Cette
  identité s'appelle la classe de hauteur (pitch class).
</MusicExample>

### 2. Le clavier : la carte que tu liras toute ta vie

```
        C#  D#      F#  G#  A#
       ┌─┐ ┌─┐     ┌─┐ ┌─┐ ┌─┐
       │ │ │ │     │ │ │ │ │ │
 ┌─────┴─┴─┴─┴─────┴─┴─┴─┴─┴─┴────┐
 │  C  │ D │ E │ F │ G │ A │ B │ C │
 └────────────────────────────────┘
   ↑ le groupe de DEUX touches noires : le C est juste à sa gauche
```

Deux repères et tout le clavier s'ouvre : **C est à gauche du groupe de deux noires ; F à gauche du groupe de trois**. Exercice immédiat : sans regarder de schéma, pose la main sur ton clavier et trouve tous les C, puis tous les F, sur toute la largeur. Trente secondes par jour pendant une semaine, et c'est acquis à vie.

### 3. Demi-ton et ton : l'unité de mesure

Le **demi-ton** est la plus petite distance : deux touches adjacentes (noire ou blanche, peu importe). Le **ton** = deux demi-tons.

| De → à | Distance | Vérifie au clavier |
|---|---|---|
| E → F | demi-ton | aucune touche entre elles |
| B → C | demi-ton | idem — les deux « pièges » du clavier |
| C → D | ton | C♯ est entre les deux |
| F♯ → G♯ | ton | G est entre les deux |

E–F et B–C sont les deux seuls couples de blanches sans noire entre elles. Toute la construction des gammes (leçon 3) repose sur cette asymétrie — vérifie-la physiquement maintenant.

### 4. Dièses, bémols, enharmonie

`♯` monte d'un demi-ton, `♭` descend d'un demi-ton. Donc `C♯` et `D♭` sont **la même touche** : on dit qu'ils sont *enharmoniques*. Pourquoi deux noms pour un son ? Parce que le nom dit *d'où l'on vient et où l'on va* : dans un contexte de ré, cette touche s'écrira `C♯` (elle monte vers D) ; dans un contexte de la♭, elle s'écrira `D♭`. Tu n'as pas encore les contextes — retiens seulement : **un son, plusieurs orthographes, et l'orthographe est un choix de sens**. Le produit choisira l'orthographe pour toi selon la tonalité (c'est le `spell()` de l'analyseur) ; ton travail est de comprendre pourquoi elle change.

### 5. La durée : placer la note dans le temps

Une note, c'est une hauteur **et** une durée. Les valeurs, chacune valant la moitié de la précédente :

| Valeur | Symbole produit | Durée (si la noire = 1 temps) |
|---|---|---|
| ronde | `w` | 4 temps |
| blanche | `h` | 2 temps |
| noire | `q` | 1 temps |
| croche | `e` | ½ temps |
| double-croche | `s` | ¼ temps |

Le **point** ajoute la moitié de la valeur : `h.` = 3 temps. Le silence se note `r` : `r:q` = un temps de silence. Le silence est une note à part entière — tu l'apprendras à tes dépens si tu l'oublies (leçon 9, et la règle `melody.phrase-breathing` te le rappellera).

<MusicExample id="premiere-phrase" title="Ta première phrase (joue-la !)">
  C4:q D4:q E4:q C4:q | E4:q C4:q E4:h
  Hauteurs + durées + un contour qui monte et redescend : c'est déjà de la musique.
</MusicExample>

### 6. Erreurs fréquentes

| Erreur | Conséquence | Correction |
|---|---|---|
| Confondre note et touche | « il y a 7 notes » — non : 12 classes de hauteur | compte les demi-tons, pas les touches blanches |
| Oublier E–F et B–C | gammes fausses dès la leçon 3 | vérifie au clavier, pas de mémoire pure |
| Ignorer les octaves MIDI | notes saisies une octave trop haut/bas dans le DAW | ancre-toi sur C4 = 60 |
| Négliger les durées | tout saisir en noires « pour l'instant » | dès aujourd'hui, chaque exemple avec ses vraies durées |

### 7. Et après ?

Tu sais nommer et placer. La leçon 2 t'apprend à **mesurer** : les intervalles, c'est-à-dire la distance entre deux notes — la notion dont découle *tout le reste du programme*, des accords à l'orchestration.

- [ ] Je trouve C et F instantanément sur mon clavier
- [ ] Je sais que E–F et B–C sont les demi-tons naturels
- [ ] C4 = MIDI 60
- [ ] `C4:q` = do central, une noire — je lis la notation du produit

<QuizBlock id="m01-l01-quiz" questions={5} />
<LessonFooter exercises={["m01-e01-find-notes", "m01-e02-note-durations"]} />

---

## 11.3 LEÇON m01-l02 — « Les intervalles : mesurer la musique »

```mdx
---
id: m01-l02-intervalles
module: module-01-fondamentaux
title: "Les intervalles : mesurer la musique"
estMinutes: 25
skills: { melody: 0.6, ear_training: 0.4 }
---
```

### Pourquoi c'est la leçon la plus importante du module

Un intervalle est la distance entre deux notes. Tout ce qui suit en dépend : une gamme est une suite d'intervalles, un accord est un empilement d'intervalles, une mélodie est un chemin d'intervalles, l'orchestration est une gestion d'intervalles entre pupitres. Quand un compositeur « entend » une partition en la lisant, il lit des intervalles. Investis dans cette leçon : elle paie sur les onze modules suivants.

### 1. Le tableau à connaître par cœur (oui, par cœur)

| Demi-tons | Nom | Abrév. | Caractère émotionnel brut | Repère mnémotechnique* |
|---|---|---|---|---|
| 0 | unisson | P1 | fusion | — |
| 1 | seconde mineure | m2 | frottement, menace | le suspense qui approche |
| 2 | seconde majeure | M2 | pas simple, neutre | début de « Frère Jacques » |
| 3 | tierce mineure | m3 | ombre, tristesse | la douceur sombre |
| 4 | tierce majeure | M3 | lumière, clarté | la douceur claire |
| 5 | quarte juste | P4 | appel, ouverture | fanfares, hymnes |
| 6 | triton | TT | instabilité maximale | l'inquiétude pure |
| 7 | quinte juste | P5 | force, espace ouvert | puissance neutre — ni majeur ni mineur |
| 8 | sixte mineure | m6 | élan douloureux | le romantisme inquiet |
| 9 | sixte majeure | M6 | élan chaleureux | le grand saut lyrique |
| 10 | septième mineure | m7 | tension douce, jazz | la question posée |
| 11 | septième majeure | M7 | tension lumineuse | le frottement sophistiqué |
| 12 | octave | P8 | même identité, autre étage | le héros qui se redresse |

*Les caractères sont des tendances, pas des lois — le contexte peut tout renverser. Mais ces tendances sont assez fiables pour que le cinéma les exploite depuis un siècle, et l'exerciseur d'oreille (EAR_QUIZ, V1) te les fera reconnaître les yeux fermés.

**Méthode de mémorisation** (deux semaines, 5 min/jour) : joue chaque intervalle depuis des notes de départ *différentes* — l'intervalle est une distance, pas une paire de touches. Monte, descends, chante-le. L'ordre d'acquisition qui marche : P8, P5, P4 (les piliers) → M3, m3 (les couleurs) → M2, m2 (les pas) → le reste.

### 2. Qualifier : majeur, mineur, juste, augmenté, diminué

Pourquoi « tierce mineure » et pas juste « 3 demi-tons » ? Parce que le nom porte deux informations : le **nombre de degrés** enjambés (tierce = 3 noms de notes : C→E) et la **qualité** (mineure = version courte, majeure = version longue). Les quartes, quintes et octaves sont dites **justes** : elles n'ont pas de version majeure/mineure, seulement des altérations *augmentée* (+1 demi-ton) ou *diminuée* (−1).

```
C → E  = tierce majeure (4 dt)      C → E♭ = tierce mineure (3 dt)
C → G  = quinte juste  (7 dt)       C → G♯ = quinte augmentée (8 dt)
C → G♭ = quinte diminuée (6 dt)  ⚠️ même son que le triton F♯ :
                                     l'enharmonie de la leçon 1, appliquée
                                     aux intervalles — le NOM dépend du contexte
```

Au niveau du MVP, l'analyseur travaille en demi-tons (il te dira « saut de 6 demi-tons ») et le cours te donne les noms ; l'orthographe fine des intervalles devient cruciale au Module 4 (contrepoint) — pour l'instant, sache qu'elle existe.

### 3. Mélodique ou harmonique : le même intervalle, deux métiers

**Mélodique** (notes successives) : c'est un *geste*. **Harmonique** (simultanées) : c'est une *couleur*.

<MusicExample id="melodique-vs-harmonique" title="Un intervalle, deux vies">
  A) C4:q G4:h.            — quinte MÉLODIQUE : un élan, un départ de thème héroïque
  B) [C4+G4]:w             — quinte HARMONIQUE : un espace ouvert, vide, ni gai ni triste
</MusicExample>

Cette distinction structure tout le produit : l'analyse de mélodie (Module 2) juge tes intervalles mélodiques ; le voice leading et l'orchestration (Modules 3, 5, 7) jugent tes intervalles harmoniques. La règle `melody.leap-recovery` que tu rencontreras dès tes premiers exercices parle d'intervalles mélodiques ≥ 6te : tu sais désormais lire son vocabulaire.

### 4. Consonance et dissonance : la physique de la tension

Classement traditionnel, du plus stable au plus instable :

```
CONSONANCES parfaites : P1, P8, P5          — stables, « creuses »
CONSONANCES imparfaites : M3, m3, M6, m6    — stables, « pleines » (la chaleur)
DISSONANCES douces : m7, M2                 — tension habitable
DISSONANCES dures : m2, M7, TT              — tension exigeante
```

Attention au mot : **dissonance ≠ laideur**. Une dissonance est une *énergie* — la leçon 14 t'apprendra à la dépenser (résolution). La musique sans dissonance est une musique sans mouvement : les nappes « célestes » de film sont pleines de M7 et de M2 qui flottent. Le classement te dit le *coût* de chaque intervalle, pas sa valeur.

<MusicExample id="echelle-tension" title="L'échelle de tension, à l'oreille">
  [C4+C5]:h [C4+G4]:h [C4+E4]:h [C4+A4]:h [C4+A#4]:h [C4+B4]:h [C4+F#4]:w
  P8 → P5 → M3 → M6 → m7 → M7 → TT : écoute la tension monter marche par marche.
  Rejoue la série à l'envers : tu viens d'entendre ta première « résolution ».
</MusicExample>

### 5. Renversement : le raccourci qui double ta connaissance

Renverser un intervalle = monter la note du bas à l'octave. La règle : **les nombres somment à 9, les qualités s'échangent** (majeur↔mineur, augmenté↔diminué, juste reste juste).

| Intervalle | Renversement |
|---|---|
| m2 (C→D♭) | M7 (D♭→C) |
| M3 (C→E) | m6 (E→C) |
| P4 (C→F) | P5 (F→C) |
| TT | TT (le seul auto-symétrique — encore lui) |

Utilité immédiate : tu ne mémorises vraiment que la moitié du tableau du §1 ; l'autre moitié se déduit. Utilité future : les renversements d'accords (leçon 12) et les voicings (Module 8) reposent entièrement sur ce mécanisme.

### 6. Les intervalles au cinéma : premier aperçu

| Geste | Intervalle typique | Tu l'entendras dans |
|---|---|---|
| Héroïsme, appel | P4, P5 ascendantes | fanfares, thèmes d'aventure |
| Romantisme, élan | M6, m6 ascendantes | thèmes d'amour |
| Menace rampante | m2 répétée | requins et couloirs sombres |
| Inquiétude, étrangeté | TT | SF, danger, magie noire |
| Nostalgie | m3 descendante | adieux, souvenirs |
| Émerveillement | P8 ascendante | révélations, envols |

Le Module 2 transformera ce tableau en exercices de composition par ambiance ; le Module 9 l'appliquera genre par genre. Pour l'instant : joue chaque ligne au clavier et *ressens* la correspondance — c'est ton premier vocabulaire expressif.

### 7. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Compter les touches au lieu des demi-tons | tierces fausses autour de E–F et B–C | compte les *pas*, pas les positions |
| Apprendre les intervalles seulement depuis C | incapacité dès qu'on transpose | chaque jour, une note de départ différente |
| Confondre le nombre (tierce) et les demi-tons (3 ou 4) | qualités fausses | le nombre vient des noms de notes, la qualité des demi-tons |
| Éviter les dissonances « parce que c'est moche » | musique plate, sans énergie | la dissonance est un coût à dépenser, pas une faute |

### Récapitulatif

- [ ] Je connais les 13 intervalles (0–12 demi-tons) avec noms et caractères
- [ ] Je distingue mélodique (geste) et harmonique (couleur)
- [ ] Je connais l'échelle consonance → dissonance et je sais que dissonance = énergie
- [ ] Renversement : somme 9, qualités échangées, juste reste juste
- [ ] J'ai joué le tableau « cinéma » et ressenti chaque geste

<QuizBlock id="m01-l02-quiz" questions={7} />
<LessonFooter exercises={["m01-e03-interval-build", "m01-e04-interval-ear"]} />

---

## 11.4 État de production du Module 1

| Livré | Reste |
|---|---|
| Sommaire complet des 25 leçons avec règles citées et durées | leçons 3–13, 15–25 (l14 déjà écrite §5.1) |
| Leçons 1, 2, 14 intégrales — le gabarit tient sur trois registres différents (fondamentaux purs, tableau de référence, concept transversal) | exercices JSON associés (m01-e01 à e04 suivent le gabarit §5.4) |

---

**Point de confirmation.** Le chaînage a livré : les 8 profils en code testables, le deuxième étage du moteur (motifs, tension, voice leading — les trois analyses les plus citées par le contenu), et le Module 1 lancé en série. Je peux enchaîner de la même façon : **lot suivant de leçons M1 (l03–l06 : gammes majeure et mineures, degrés, cycle des quintes)**, ou basculer sur un autre front si tu préfères (base `instruments.ts` des 40 instruments, ou le FeedbackEngine complet en code). Par défaut, je continue les leçons — dis-moi si je poursuis.