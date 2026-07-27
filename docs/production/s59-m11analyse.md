# SECTION 59 — MODULE 11 : L'ANALYSE DE SCORES — OUVERTURE

## 59.1 Positionnement — et le problème du droit résolu par le corpus

M11 referme la boucle promise dès m01-l25 : *analyser pour composer*. Mais un module d'analyse pose au produit son problème de charte : **jamais de reproduction d'œuvres protégées** (§brief). La solution est structurelle, et elle était préparée depuis le début :

```
LE CORPUS À DEUX ÉTAGES
ÉTAGE 1 — LE CORPUS INTERNE (analysable EN MACHINE, note à note) :
  les pièces originales du produit — "Départ" (m01-l25), les solutions
  de référence (56 pièces annotées !), Elena et ses trois vérités
  (m02/m08), les deux cues de "La Remise" (m10/m06), "le standard"
  (m08), la pièce-mystère (m01-e48), + les pièces GÉNÉRÉES par
  l'ExerciseGenerator (§4.3 : un corpus infini, calibré par niveau).
  → sur cet étage, les exercices d'analyse sont VÉRIFIABLES : l'élève
  annote, le moteur connaît la vérité (il a composé ou validé chaque
  pièce) — l'analyse devient un exercice à correction automatique,
  ce qu'aucun manuel d'analyse n'a jamais pu offrir
ÉTAGE 2 — LE RÉPERTOIRE (analysé EN PRINCIPES, jamais en notes) :
  les scores célèbres discutés en prose — procédés nommés, jamais
  cités : "tel score construit son thème sur une quarte ascendante
  et le fragmente à chaque défaite du héros" se dit sans une note.
  Les leçons donnent la MÉTHODE sur l'étage 1 ; l'élève l'applique
  lui-même au répertoire qu'il possède (ses disques, ses films) —
  le produit enseigne à pêcher, il ne distribue pas le poisson
  d'autrui.
```

**Extension moteur actée** : le kind `ANALYSIS` — la soumission-annotation. L'élève reçoit une pièce du corpus interne (roll + lecture) et soumet des annotations typées, toutes vérifiables :

| Type d'annotation | Le geste élève | La vérification |
|---|---|---|
| `mark-occurrences` | cliquer les occurrences du motif sur le roll | contre `findMotifs` (avec crédit partiel sur les variées) |
| `label-segments` | poser les frontières et nommer (A, A', B, pont…) | contre `phraseAnalysis` + les segments de la solution |
| `name-chords` / `name-functions` | chiffrer la grille entendue | contre `detectProgression`/`functionOf` |
| `identify-idioms` | pointer les idiomes (emprunt, subV, napolitain, planing…) | contre les tags — tout le bestiaire accumulé sert en sens inverse |
| `draw-tension` | **dessiner la courbe de tension au doigt** | corrélation avec `tensionCurve` calculée (archFit entre ton oreille et la machine — l'exercice signature du module) |
| `role-map` | assigner les rôles par pupitre/section | contre le `rolePlan` de la pièce |

Prérequis : M1–M2 (le protocole de m01-l25) ; chaque leçon d'analyse spécialisée demande son module source. Les 8 leçons :

| # | Titre | min |
|---|---|---|
| 1 | Écouter en compositeur : le protocole armé | 25 |
| 2 | Analyser le thème : l'identité et ses vies | 25 |
| 3 | Analyser l'harmonie : reconnaître le système | 25 |
| 4 | Analyser l'orchestration : lire les effectifs | 25 |
| 5 | Analyser le temps : la forme, la tension, l'image | 25 |
| 6 | La fiche de genre : constituer son propre savoir | 20 |
| 7 | Le reverse-engineering : de l'écoute à la maquette | 30 |
| 8 | Synthèse : l'analyse qui nourrit — le cahier du compositeur | 30 |

---

## 59.2 LEÇON m11-l01 — « Écouter en compositeur : le protocole armé »

```mdx
---
id: m11-l01-protocole
module: module-11-analyse
title: "Écouter en compositeur : le protocole armé"
estMinutes: 25
skills: { ear_training: 0.5, harmony: 0.2, melody: 0.2, orchestration: 0.1 }
---
```

### Pourquoi réapprendre à écouter

Tu écoutes de la musique depuis toujours — en auditeur : porté par elle. L'analyse exige l'autre écoute : **active, questionnante, outillée** — celle qui demande *comment c'est fait* sans cesser d'entendre *ce que ça fait*. Le protocole de m01-l25 (sept étapes) en était l'embryon ; ce module l'arme de tout ce que tu as appris depuis : tu n'es plus le débutant qui cherchait la tonalité — tu es un compositeur qui possède six familles de questions.

### 1. Les trois passes (la discipline de base)

```
PASSE 1 — L'AUDITEUR (obligatoire, et la plus violée) :
  écouter ENTIER, sans rien noter, sans analyser — recevoir. Deux
  livrables seulement : l'émotion dominante (trois adjectifs) et
  LE moment (l'instant qui t'a pris — c'est lui qu'on analysera
  en priorité : l'analyse commence toujours par ce qui marche)
PASSE 2 — LE CARTOGRAPHE : la forme et les événements — les sections
  (où ça change), les entrées (qui arrive quand), l'arche globale
  (dessine la tension AU DOIGT : l'exercice draw-tension est cette
  passe, industrialisée). Aucun détail : le plan du bâtiment.
PASSE 3 — L'ARTISAN : le zoom sur LE moment (passe 1) et sur 2-3
  points de la carte (passe 2) — LÀ, les six familles de questions
  (§2) s'appliquent. On n'analyse jamais tout : on analyse ce qui
  compte (le "moment" et les charnières) — l'analyse exhaustive
  est un inventaire, pas une compréhension.
```

### 2. Les six familles de questions (le protocole armé)

Le tableau de bord complet — chaque famille renvoie à sa leçon de zoom (l02–l05) et à ses modules sources :

| Famille | Les questions-clés | Armé par |
|---|---|---|
| **Le thème** | quelle cellule ? quelles vies (variations, états dramatiques) ? | M2, M4 → l02 |
| **L'harmonie** | quel système (les trois questions de m03-l01) ? quels idiomes ? | M1, M3, M8 → l03 |
| **L'orchestration** | qui joue quoi ? les cinq lignes ? les entrées/sorties ? | M5, M7, M6 → l04 |
| **Le temps** | quelle forme ? où les bascules ? comment la tension est-elle fabriquée (les moteurs de m03-l17) ? | M1, M9, M10 → l05 |
| **La production** | quel espace (sec/large, m06-l12) ? quels mondes (acoustique/synthétique, m06-l14) ? | M6, M10 |
| **L'absence** | qu'est-ce qui MANQUE — et pourquoi c'est juste ? (m01-l25 : la question des maîtres) | tout |

### 3. La règle d'or : l'hypothèse avant la vérification

L'analyse de compositeur n'est pas une dictée — c'est une **enquête** : à chaque question, formule d'abord ton hypothèse (« je crois que c'est un emprunt au mineur »), PUIS vérifie (au clavier, au roll, au ralenti). L'hypothèse fausse vaut plus que la bonne réponse copiée : c'est elle qui muscle l'oreille (l'écart entre ce que tu croyais et ce qui est EST l'apprentissage — le produit exploite ça : les exercices ANALYSIS te font annoter AVANT de révéler, et le rapport commente tes écarts, pas seulement tes erreurs).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Analyser dès la première écoute | l'artisan sans le plan : les détails sans le sens | les trois passes, dans l'ordre — l'auditeur d'abord |
| Tout analyser | quarante minutes d'inventaire, zéro compréhension | LE moment + les charnières : l'analyse choisit |
| La dictée passive | reconnaître sans questionner | l'hypothèse d'abord — l'enquête, pas la dictée |
| Oublier la sixième famille | l'analyse qui liste ce qui est là | l'absence est une décision : la question des maîtres |

### La mission (m11-e01, ANALYSIS — la première enquête)

La pièce-mystère (m01-e48 — elle attendait ce module) en trois passes outillées : passe 1 déclarée (trois adjectifs + LE moment pointé sur la timeline), passe 2 : `label-segments` + **`draw-tension`** (ta courbe au doigt contre la machine — corrélation ≥ 0.5 attendue, et le rapport superpose les deux courbes : la rencontre de ton oreille et du moteur), passe 3 : deux annotations d'artisan au choix sur TON moment (`name-chords` ou `mark-occurrences`). Le rapport commente tes écarts : « ta courbe monte deux mesures avant la machine — tu entends la tension ARRIVER : c'est une qualité d'oreille, pas une erreur ».

- [ ] Trois passes : l'auditeur, le cartographe, l'artisan — dans l'ordre
- [ ] Six familles de questions — et la sixième est l'absence
- [ ] L'hypothèse avant la vérification : l'enquête muscle, la dictée endort
- [ ] On analyse LE moment et les charnières — jamais tout

<QuizBlock id="m11-l01-quiz" questions={5} />
<LessonFooter exercises={["m11-e01-first-inquiry"]} />

---

## 59.3 LEÇON m11-l02 — « Analyser le thème : l'identité et ses vies »

```mdx
---
id: m11-l02-analyser-theme
module: module-11-analyse
title: "Analyser le thème : l'identité et ses vies"
estMinutes: 25
skills: { melody: 0.7, ear_training: 0.3 }
---
```

### Pourquoi le thème s'analyse en biographie

Un thème de film n'existe pas en une occurrence : il **vit** — exposé, varié, fragmenté, réharmonisé, transfiguré au fil du récit (m02-l15 §2 le promettait au compositeur ; l'analyste le lit dans l'autre sens). Analyser un thème, c'est écrire sa biographie : l'identité de naissance (la cellule), puis chaque vie et ce qu'elle dit du récit. C'est l'analyse la plus directement rentable : chaque biographie lue est un plan de déclinaison volé aux maîtres — légalement (les procédés ne s'approprient pas, §59.1).

### 1. L'identité : l'autopsie de la cellule

Le protocole d'identité, sur toute exposition de thème (les outils de m02-l01/l02, en sens inverse) :

```
1. ISOLE LA CELLULE : fredonne le thème, garde ce qui survit — le
   motif (2-5 notes) ; vérifie au roll si corpus interne
2. SÉPARE LES TROIS COUCHES (m02-l02 §1) : la forme intervallique
   (quel intervalle-signature ? — la table des caractères de m01-l02
   en grille de lecture : la quarte dit l'appel, la m6 l'élan
   douloureux...), la forme rythmique (quel archétype ? appel/pas/
   soupir/signal), l'ancrage (quel degré, quelle position)
3. TESTE LA DÉVELOPPABILITÉ à rebours : le thème EST-il décliné dans
   l'œuvre ? (s'il ne l'est pas, c'est une information aussi : le
   thème-affiche vs le thème-matériau — deux métiers)
```

### 2. Les vies : la grille des transformations

Pour chaque occurrence repérée, deux questions — *comment* et *pourquoi* :

| Le COMMENT (l'échelle de m02-l04, en détecteur) | Le POURQUOI (la lecture dramatique) |
|---|---|
| répétition exacte / transposition | l'ancrage, l'intensification |
| variation rythmique, augmentation/diminution | le changement d'état (le motif d'action en hymne : la victoire ; en fébrile : la crise) |
| fragmentation | la crise, la perte (le thème brisé = le personnage brisé) |
| inversion | le double, le reflet, la question retournée |
| **la réharmonisation** (m08-l09 : les « trois vérités ») | LE détecteur d'état dramatique le plus fin : même mélodie, autre monde — note l'harmonie SOUS chaque occurrence |
| **le changement d'orchestration** (m07-l05 : la garde-robe) | qui porte le thème = où en est le personnage (le thème au tutti puis au violon seul : la chute) |

La biographie type tient en un tableau : occurrence / timecode / transformation / harmonie / porteur / ce que dit la scène — cinq lignes de ce tableau valent dix pages de prose (et c'est le format de soumission de l'exercice : l'annotation structurée).

### 3. Le leitmotiv et ses degrés (le vocabulaire de métier)

Le mot « leitmotiv » couvre trois régimes qu'il faut distinguer à l'analyse : **le thème-étiquette** (l'association simple : le motif sonne quand le personnage paraît — le degré zéro, efficace, limité), **le thème-récit** (les transformations suivent l'arc : la biographie complète — le régime noble), et **le tissu de motifs** (plusieurs cellules courtes combinées, superposées, hybridées — les thèmes qui se *rencontrent* dans l'orchestre quand les personnages se rencontrent à l'écran : le contrepoint de m04 devenu dramaturgie). Identifier le régime d'un score est la première conclusion d'une analyse thématique — et un choix à faire pour tes propres projets.

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Analyser la mélodie entière | huit mesures décrites, l'identité manquée | la cellule d'abord : ce qui survit au fredon |
| Le comment sans le pourquoi | le catalogue de variations sans le récit | chaque transformation dit un état — la colonne « scène » est obligatoire |
| Ignorer l'harmonie sous le thème | la moitié des vies invisibles (la réharmonisation EST la transformation reine du cinéma) | l'harmonie se note sous chaque occurrence |
| Confondre les trois régimes | attendre un thème-récit d'un thème-étiquette | le régime se diagnostique d'abord |

### La mission (m11-e02, ANALYSIS — la biographie)

Le cue « Elena » complet (m07-e10 — la solution de référence : 48 mesures, le thème et ses vies composés en M7) en biographie : `mark-occurrences` du motif (contre `findMotifs` — les transformations créditées par type), le tableau des vies (occurrence / transformation / harmonie / porteur — les colonnes vérifiées contre les tags et le rolePlan de la solution), et le diagnostic de régime (thème-récit : argumenté en champ guidé). Le rapport confronte ta biographie à la genèse réelle de la pièce — *tu analyses une œuvre dont le produit possède l'intention* : l'exercice d'analyse le plus vérifiable jamais construit.

- [ ] L'identité : la cellule, les trois couches, l'intervalle-signature
- [ ] La biographie : comment × pourquoi — le tableau des vies
- [ ] La réharmonisation et le porteur : les deux transformations reines du cinéma
- [ ] Trois régimes de leitmotiv : l'étiquette, le récit, le tissu

<QuizBlock id="m11-l02-quiz" questions={5} />
<LessonFooter exercises={["m11-e02-elenas-biography"]} />

---

## 59.4 LEÇON m11-l03 — « Analyser l'harmonie : reconnaître le système »

```mdx
---
id: m11-l03-analyser-harmonie
module: module-11-analyse
title: "Analyser l'harmonie : reconnaître le système"
estMinutes: 25
skills: { harmony: 0.7, ear_training: 0.3 }
---
```

### Pourquoi le système avant les accords

L'erreur universelle de l'analyse harmonique débutante : chiffrer accord par accord — et produire une liste juste qui ne comprend rien. La leçon de m03-l01 s'inverse ici : **on identifie le système d'abord** (fonctionnel ? modal ? non-fonctionnel ? — le test des trois questions, appliqué à l'écoute), et le système dicte quelles questions poser ensuite : chiffrer du planing en degrés fonctionnels est un contresens ; chercher la couleur d'un ii-V-I en rate le trajet.

### 1. Le diagnostic de système à l'oreille (les trois questions, armées)

```
1. LA SENSIBLE TIRE-T-ELLE ? → écoute les fins de phrases : l'aimant
   V→I s'entend (la résolution qui "ferme") — OUI = fonctionnel :
   les questions de M1/M8 (fonctions, cadences, circulations,
   substitutions)
2. UN CENTRE SANS AIMANT ? → la musique revient toujours au même
   accord sans y être forcée (la boucle, l'insistance) — OUI = modal :
   les questions de m03-l08 (quel mode ? quels piliers ? quelle
   cadence de remplacement ?)
3. NI CENTRE NI AIMANT ? → les accords valent par leur sonorité et
   leur geste — non-fonctionnel : les questions de m03-l10-l16
   (quelle collection ? quelle brique ? quel geste — planing, grappe,
   superposition ?)
ET LE CAS RÉEL : les systèmes ALTERNENT dans un même cue (m03-l01 §1 :
"par scène") — le diagnostic se refait à chaque section, et les
FRONTIÈRES de système sont des événements dramatiques à noter
(le moment où le modal devient fonctionnel = le récit qui s'emballe)
```

### 2. Les détecteurs rapides (le kit de l'oreille harmonique)

L'analyste expérimenté n'entend pas « des accords » : il entend des **signatures** — le kit des détecteurs, tout en acquis :

| Ce qu'on entend | Le détecteur | La signature de |
|---|---|---|
| le sourire qui se voile | 6̂→♭6̂ dans une voix | l'emprunt iv (m01-l21) — LE détecteur n° 1 du film |
| la basse qui glisse d'un demi-ton vers sa cible | le couloir | subV (m01-l20) |
| le monde qui bascule, une note qui tient | le fil | la médiante (m03-l06) |
| la solennité étrange à un demi-ton | — | le napolitain (m03-l02) |
| tout devient majeur ET sombre | — | la boucle éolienne ♭VI-♭VII (m09-l02) |
| l'apesanteur sans bas | aucune quinte juste | les tons entiers (m03-l11) |
| le familier qui ment | triades normales, boussole folle | l'octatonique (m03-l12) |
| le velours immobile sous une ligne | la main qui ne bouge pas | rootless A/B (m08-l02) |
| l'ouvert sans majeur/mineur | la neutralité vaste | le quartal (m03-l13) |

La méthode d'entraînement : **un détecteur à la fois** — une semaine à traquer le iv dans tout ce qu'on écoute, puis le suivant (l'oreille se muscle par obsessions successives, pas par exhaustivité).

### 3. Le chiffrage utile (quand et comment noter)

Le chiffrage n'est pas le but, c'est l'outil de zoom (la passe 3) — les règles d'économie : **on chiffre les charnières** (les cadences, les bascules, LE moment) et on *décrit* le reste (« quatre mesures de boucle i–♭VII ») ; **on chiffre dans le langage du système** (degrés fonctionnels en système 1, piliers modaux en système 2, collections+gestes en système 3 — le respect d'objet de m03-l18, appliqué à la notation d'analyse) ; et **le doute se note comme doute** (l'accord ambigu porte un « ? » : l'honnêteté du diagnostic vaut mieux que la fausse précision — le moteur fait pareil : `ambiguous: true`).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Chiffrer avant de diagnostiquer | la liste juste qui ne comprend rien | le système d'abord — il dicte les questions |
| Un seul système par œuvre | les frontières de système manquées (les vrais événements) | le diagnostic par section |
| Le chiffrage exhaustif | quarante accords notés, zéro conclusion | les charnières se chiffrent, le reste se décrit |
| Tout entendre en fonctionnel | le planing chiffré en degrés : le contresens | le respect d'objet vaut à l'analyse |

### La mission (m11-e03, ANALYSIS — le diagnostic)

Trois extraits du corpus interne (générés + solutions : un fonctionnel à emprunts, un modal à piliers, un non-fonctionnel en planing/collection) : pour chacun — le diagnostic de système (les trois questions en QCM argumenté), puis les annotations du système : `name-functions` + `identify-idioms` sur le fonctionnel (le iv et le subV à pointer), les piliers et la cadence modale sur le deuxième (`identify-idioms` contre les tags), la collection et le geste sur le troisième (`requireCollection` en sens inverse : nomme-la). Bonus : l'extrait 4 — un cue qui CHANGE de système à mi-course : la frontière à pointer (±1 mesure). Le rapport te dit où ton oreille a diagnostiqué juste — et dans quel langage tu as chiffré.

- [ ] Le système d'abord : les trois questions, par section
- [ ] Le kit des détecteurs : les signatures s'entendent avant les accords
- [ ] Un détecteur à la fois — l'oreille se muscle par obsessions
- [ ] Chiffrer les charnières, décrire le reste, noter le doute

<QuizBlock id="m11-l03-quiz" questions={5} />
<LessonFooter exercises={["m11-e03-the-diagnosis"]} />

---

## 59.5 État d'ouverture du module

| Module 11 | Statut |
|---|---|
| Fondations | le corpus à deux étages (interne vérifiable / répertoire en principes — le problème de droit résolu par l'architecture), le kind `ANALYSIS` avec ses six types d'annotations (dont `draw-tension` : l'oreille contre la machine) |
| l01–l03 | ✅ **3/8** — le protocole armé (trois passes, six familles, l'enquête), la biographie de thème, le diagnostic de système |
| Fil rouge | l'analyse comme sens inverse du cursus (chaque détecteur est un acquis retourné ; les 56 solutions et les pièces de portfolio deviennent le corpus — l'élève analyse des œuvres dont le produit possède l'intention) ; l'exercice draw-tension comme signature du module |
| Prochain lot | l04–l06 : analyser l'orchestration (les cinq lignes en lecture, les entrées/sorties, le diagnostic acoustique/synthétique), analyser le temps (la forme, les moteurs de tension à rebours, le spotting inversé sur « La Remise »), et la fiche de genre (constituer son propre savoir — la méthode qui a produit les fiches de M9, transmise) |

---

**Point de confirmation.** Le Module 11 est ouvert — l'analyse vérifiable en machine est sa trouvaille structurante. Je poursuis avec le **lot l04–l06** (l'orchestration en lecture — la coupe d'immeuble à l'oreille ; le temps — la forme, les moteurs de tension à rebours, et le spotting inversé ; la fiche de genre — la méthode de constitution de savoir personnel, celle-là même qui a écrit m09), puis le **lot final l07–l08** (le reverse-engineering et le cahier du compositeur) dans la foulée ?