# SECTION 20 — MODULE 2 : MÉLODIE — SOMMAIRE COMPLET + LEÇONS 1–3

## 20.1 Positionnement du module (l'articulation avec M1)

Le Module 1 a livré les **matériaux** de la mélodie (degrés, intervalles, arche de tension, méthode charpente/habillage). Le Module 2 enseigne le **métier** : comment une suite de notes devient un *thème* — quelque chose qu'on retient, qui a une identité, qui raconte. Sa seconde moitié honore l'exigence du brief : la composition **par ambiance** (les 11 moods), qui est aussi le banc d'essai des gabarits `MOOD_TEMPLATES` de `archFit()` (§10.2) — chaque leçon d'ambiance calibre son gabarit.

## 20.2 Les 15 leçons du Module 2

| # | id | Titre | Règles/moteur cités | min |
|---|---|---|---|---|
| 1 | m02-l01 | L'anatomie d'une mélodie mémorable | melody.no-motif, findMotifs | 25 |
| 2 | m02-l02 | Le motif : concevoir la cellule | findMotifs | 25 |
| 3 | m02-l03 | Développer I : répétition, transposition, séquence | melody.monotony | 25 |
| 4 | m02-l04 | Développer II : augmentation, inversion, fragmentation | findMotifs (variations) | 25 |
| 5 | m02-l05 | Contour et direction : arches, lignes, plateaux | contour(), melody.climax | 20 |
| 6 | m02-l06 | La phrase et la respiration : au-delà de la période | melody.phrase-breathing, phraseAnalysis | 20 |
| 7 | m02-l07 | Anticipation et surprise : gérer l'attente | tensionCurve | 25 |
| 8 | m02-l08 | Mélodie et harmonie : la négociation | detectChord (notes étrangères) | 25 |
| 9 | m02-l09 | Le rythme mélodique : la prosodie du thème | rhythm.syncopation-target | 20 |
| 10 | m02-l10 | Ambiances I : joyeuse, triste | archFit | 30 |
| 11 | m02-l11 | Ambiances II : héroïque, épique | archFit, profil epic-film | 30 |
| 12 | m02-l12 | Ambiances III : romantique, mystérieuse | profil romantic-film | 30 |
| 13 | m02-l13 | Ambiances IV : thriller, science-fiction | profil thriller-tension | 30 |
| 14 | m02-l14 | Ambiances V : western, néo-noir, jazz | profils jazz, neo-noir | 35 |
| 15 | m02-l15 | Synthèse : le thème de personnage | (tout) | 35 |

Structure en deux actes : **l01–l09, le métier** (la cellule, son développement, sa mise en phrase, sa négociation avec l'harmonie et le rythme) ; **l10–l15, l'atelier des ambiances** (chaque leçon = 2–3 moods disséqués : intervalles-signatures, gabarit de tension, rythme, registre — puis composition immédiate).

---

## 20.3 LEÇON m02-l01 — « L'anatomie d'une mélodie mémorable »

```mdx
---
id: m02-l01-anatomie
module: module-02-melodie
title: "L'anatomie d'une mélodie mémorable"
estMinutes: 25
skills: { melody: 1.0 }
---
```

### Pourquoi commencer par la mémoire

Le test ultime d'un thème de film n'est pas « est-il beau ? » mais : **le spectateur peut-il le fredonner en sortant de la salle ?** Un thème qu'on ne retient pas ne peut pas faire son travail narratif — revenir, se transformer, signifier. Cette leçon dissèque ce qui rend une mélodie *mémorisable* : ce n'est ni un mystère ni un don, c'est une liste de propriétés mesurables — celles, précisément, que `findMotifs` et ses collègues calculent sur tes exercices.

### 1. Le contrat avec l'auditeur

Une mélodie mémorable honore un contrat en trois clauses :

```
1. IDENTITÉ    quelque chose d'assez distinctif pour être reconnu
               (un motif, un intervalle-signature, un rythme)
2. ÉCONOMIE    assez peu de matériau pour être retenu
               (les grands thèmes tiennent sur 1 ou 2 cellules)
3. FAMILIARITÉ ORGANISÉE   assez de répétition pour ancrer,
               assez de variation pour ne pas lasser
```

La clause 3 est l'équilibre central du module — le couloir entre deux règles du moteur que tu connais : `melody.no-motif` (rien à retenir) et `melody.monotony` (répétition sans vie). Tout le métier mélodique habite entre ces deux murs.

### 2. La dissection : de quoi un thème est fait

Prends n'importe quel grand thème que tu as en tête (on travaille sur les *principes*, jamais sur les partitions — charte du produit) et dissèque-le mentalement. Tu trouveras presque toujours :

| Composant | Taille typique | Rôle |
|---|---|---|
| **Le motif** (la cellule) | 2–6 notes | l'ADN — c'est LUI qu'on retient |
| **La phrase** | 2–4 mesures | le motif mis en situation, avec sa respiration |
| **Le thème** | 8–16 mesures | 2–4 phrases organisées (souvent en période, l16 M1) |
| **L'intervalle-signature** | 1 intervalle | le geste identitaire (la quinte héroïque, la sixte romantique — table l02 M1 §6) |

Proportion révélatrice : dans un thème de 8 mesures (~30 notes), le matériau *nouveau* représente souvent moins de 40 % — le reste est répétition et variation du motif. **Composer une mélodie, c'est à 60 % réorganiser ce qu'on a déjà dit.** Les débutants inventent trop ; les professionnels développent.

<MusicExample id="dissection" title="Dissection d'un thème original de 8 mesures">
  G4:q. D5:e D5:q C5:e B4:e | A4:q. D4:e D4:h | G4:q. D5:e D5:q C5:e B4:e | C5:q. A4:e A4:h |
  B4:q. G4:e G4:q A4:e B4:e | C5:q D5:q E5:h | D5:q C5:e B4:e A4:q D4:q | G4:w
  Dissèque : motif = « q. e » + saut de quinte G→D (mes. 1). Mes. 3 : répétition
  EXACTE (ancrage). Mes. 5 : le rythme du motif, l'intervalle inversé (variation).
  Mes. 7 : descente conclusive = fragment du motif étiré. Matériau nouveau : la
  mesure 6 — UNE sur huit. Et pourtant, rien ne se répète « bêtement ».
</MusicExample>

Rejoue l'exemple et vérifie chaque affirmation au clavier — puis passe-le dans le Melody Practice : `findMotifs` retrouvera le motif, ses 3 occurrences (1 exacte, 2 variées) et créditera `hasVariedRepetition`. **L'analyse machine et la dissection manuelle doivent coïncider : c'est ton contrôle qualité mutuel.**

### 3. Les cinq propriétés mesurables de la mémorabilité

Ce que la recherche sur la mémoire musicale et deux siècles de métier convergent à dire — et ce que le produit mesure :

1. **Un motif court, répété avec variation** — la propriété reine (`findMotifs` : occurrences ≥ 3, dont ≥ 1 variée).
2. **Un contour simple** — arche, ligne descendante, ou vague : les contours à plus de 3 changements de direction par phrase se retiennent mal (`contour()` compte les segments).
3. **Majorité de mouvement conjoint, sauts rares donc signifiants** — le saut mémorable est celui qui est SEUL de son espèce dans la phrase (`leapProfile`).
4. **Un rythme identifiable indépendamment des hauteurs** — le test de la table (l09 M1 §3) : tape le rythme seul ; s'il est reconnaissable, la mélodie tiendra.
5. **Un atterrissage clair** — la fin est la deuxième chose qu'on retient après le début (`melody.ending-weak`).

Remarque ce que la liste NE contient PAS : l'originalité harmonique, la sophistication, la virtuosité. Un thème mémorable peut être harmoniquement banal (beaucoup le sont) ; un thème sophistiqué et sans motif s'évapore. **La hiérarchie du métier : mémorable d'abord, intéressant ensuite.**

### 4. Le test des trois écoutes (ton protocole de validation)

Avant de soumettre toute mélodie du module, applique ce protocole :

```
1. Joue ta mélodie UNE fois, attentivement.
2. Fais autre chose pendant 2 minutes (littéralement : lève-toi).
3. Essaie de la CHANTER de mémoire, sans clavier.
   → tu la chantes entière : mémorable ✓
   → tu chantes le début puis inventes : le développement ne tient pas
     (trop de matériau nouveau après la mesure 4 — cas le plus fréquent)
   → tu ne retrouves rien : pas de motif, ou contour chaotique
4. Ce que ta mémoire a GARDÉ est ton vrai motif — même si ce n'est pas
   celui que tu croyais avoir écrit. Ce que ta mémoire a JETÉ est ce
   qu'il faut retravailler.
```

L'étape 4 est l'enseignement le plus précieux : **ta propre mémoire est ton premier analyseur** — elle exécute `findMotifs` biologiquement. Le produit fait le même travail en machine ; quand les deux divergent, écoute ta mémoire.

### 5. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Inventer en continu | « jolie mais je ne la retiens pas moi-même » | 60 % de développement, 40 % de nouveau — maximum |
| Confondre mémorable et simpliste | peur de la répétition → fuite en avant | la répétition VARIÉE est l'outil des maîtres, pas des paresseux |
| Trois idées dans une phrase | l'auditeur ne sait pas quoi retenir | une cellule par thème ; la 2e idée attendra le pont |
| Juger au clavier, jamais de mémoire | l'oreille suit les doigts, tout semble tenir | le test des trois écoutes, systématique |
| Chercher LA grande mélodie d'emblée | paralysie | un bon motif développé bat une grande idée isolée — toujours |

### Récapitulatif

- [ ] Le contrat : identité, économie, familiarité organisée
- [ ] Anatomie : motif (2–6 notes) → phrase → thème ; ~60 % de développement
- [ ] Les 5 propriétés mesurables — et ce qui n'en fait pas partie
- [ ] Le test des trois écoutes est mon protocole permanent
- [ ] Ma mémoire exécute findMotifs : quand elle jette quelque chose, je retravaille

<QuizBlock id="m02-l01-quiz" questions={5} />
<LessonFooter exercises={["m02-e01-dissect", "m02-e02-three-listens"]} />

---

## 20.4 LEÇON m02-l02 — « Le motif : concevoir la cellule »

```mdx
---
id: m02-l02-motif
module: module-02-melodie
title: "Le motif : concevoir la cellule"
estMinutes: 25
skills: { melody: 1.0 }
---
```

### Pourquoi une leçon entière pour 2 à 6 notes

Parce que ces notes vont porter tout le reste. Un thème de film vit des années, se décline en dizaines de variations (Module 11 te montrera les principes) — et tout repose sur la cellule initiale. Un motif mal conçu ne se développe pas : il se répète ou il meurt. Cette leçon t'apprend à concevoir des cellules *développables* — et à reconnaître celles qui ne le sont pas avant d'avoir bâti dessus.

### 1. Les trois dimensions d'un motif

Un motif est défini par trois couches — et c'est exactement la représentation de `findMotifs` (§10.1 : `intervalShape` + `rhythmShape`) :

```
1. LA FORME INTERVALLIQUE   la suite des intervalles (ex : +7, -2, -2)
2. LA FORME RYTHMIQUE       la suite des durées (ex : q. e q q)
3. LE POINT D'ANCRAGE       où il tombe dans la mesure et sur quel degré
```

Découverte capitale : **ces couches sont séparables**. Le motif reste reconnaissable si tu gardes le rythme en changeant les intervalles, ou l'inverse. C'est ce qui rend le développement possible (l03–l04) — et c'est pourquoi le motif le plus robuste a une identité forte dans *chaque* couche : un rythme qui se tape sur une table ET un geste intervallique qui se dessine dans l'air.

### 2. Concevoir : les quatre archétypes de cellules

Il n'existe pas de recette du « bon motif », mais quatre familles couvrent l'essentiel du répertoire — apprends à composer dans chacune :

| Archétype | Construction | Caractère | Exemple à jouer |
|---|---|---|---|
| **L'appel** | saut ascendant (4te/5te/8ve) + note tenue ou rebond | héroïsme, ouverture, adresse | `G4:e C5:q.` |
| **Le pas** | mouvement conjoint, 3–5 notes, rythme marqué | narration, marche, humanité | `E4:q F4:e G4:e E4:q` |
| **Le soupir** | 2–3 notes descendantes, souvent ½ ton, temps fort→faible | tristesse, tendresse, plainte | `F4:q. E4:e` (l'appoggiature de l22 M1, devenue cellule) |
| **Le signal** | notes répétées + rythme distinctif | tension, code, obstination, menace | `D4:e D4:e D4:e D4:q.` |

Note ce que ces archétypes ont en commun : **chacun tient en une respiration et contient UN geste**. Un motif qui contient deux gestes (un saut PUIS une gamme PUIS un rebond) n'est pas un motif : c'est déjà une phrase — trop long pour être une cellule, trop court pour vivre seul.

<MusicExample id="quatre-archetypes" title="Les quatre archétypes, puis leur premier développement naïf">
  A) G4:e C5:q. r:e G4:e C5:q. r:e         — l'appel, répété : déjà de la musique
  B) E4:q F4:e G4:e E4:q r:q E4:q F4:e G4:e E4:q r:q  — le pas
  C) F4:q. E4:e r:h A4:q. G4:e r:h          — le soupir, transposé : déjà une plainte qui monte
  D) D4:e D4:e D4:e D4:q. r:e D4:e D4:e D4:e D4:q. r:e — le signal
  Chaque archétype répété deux fois SUFFIT à installer un monde. C'est le
  pouvoir de la cellule : elle n'a pas besoin de toi pour exister — elle a
  besoin de toi pour se développer.
</MusicExample>

### 3. Le test de développabilité (avant de bâtir)

Un motif est développable s'il **survit aux transformations** de l03–l04 en restant reconnaissable. Test rapide, à faire au clavier sur toute cellule candidate :

```
1. TRANSPOSE-le à la seconde supérieure : reste-t-il « lui » ?
2. Joue-le DEUX FOIS PLUS LENT (augmentation) : tient-il ?
3. Garde son RYTHME, change ses hauteurs : le reconnais-tu encore ?
   → oui aux trois : cellule robuste, bâtis
   → non au 3 : ton identité est toute dans les hauteurs — fragile
     (le rythme est trop générique : que des noires, ou que des croches)
   → non au 2 : ton motif est un effet de vitesse, pas une forme
```

Le point 3 est le plus discriminant : **les motifs immortels ont presque tous un rythme distinctif** (le test de la table encore). Si ton rythme est `q q q q`, ton motif n'a qu'une jambe.

Deux propriétés supplémentaires des cellules très développables :
- **une asymétrie interne** (un long parmi des courts, un saut parmi des pas) : c'est l'aspérité qui accroche la mémoire ET le levier des variations ;
- **une fin ouverte** (dernier degré instable, ou rythme suspendu) : la cellule *demande* sa suite — elle appelle son propre développement. Une cellule qui finit sur 1̂-temps-fort-note-longue est une mélodie finie de trois notes : nulle part où aller.

### 4. Le motif et son ADN émotionnel

La table cinéma de l02 M1 §6 devient ici un outil de conception : **choisis ton intervalle-signature d'après le brief émotionnel**, puis construis la cellule autour :

```
Brief : « thème du mentor, chaleureux, un peu triste »
→ intervalle-signature candidat : m6 ascendante (élan douloureux) ou m3
  descendante (nostalgie)
→ archétype : l'appel (m6 asc.) adouci d'un soupir : E4:e C5:q B4:e A4:q
→ test de développabilité : ✓ (rythme e-q-e-q distinctif, asymétrie
  du saut initial, fin sur 2̂ ouverte)
```

C'est le protocole des leçons d'ambiance (l10–l14) : *brief → intervalle-signature → archétype → cellule → test*. L'exercice m02-e04 te le fait pratiquer six fois sur six briefs différents.

### 5. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Cellule de 10 notes | « mon motif » est une phrase — rien à développer, tout à répéter | coupe : le motif est ce qui reste quand tu ne peux plus rien enlever |
| Rythme générique | le motif disparaît dès qu'on change une hauteur | une asymétrie rythmique minimum (un point, une syncope, un silence) |
| Fin fermée | chaque répétition sonne comme une fin — la musique bégaie | dernier degré instable OU rythme suspendu : la cellule appelle sa suite |
| Deux gestes dans la cellule | les variations n'en gardent qu'un et l'identité se dilue | un geste par cellule ; le deuxième geste sera le contre-motif (l15) |
| Composer la cellule à l'écran | formes abstraites, injouables, inchantables | conçois AU CLAVIER et à la voix : si tu ne peux pas la chanter, coupe |

### Récapitulatif

- [ ] Trois couches séparables : intervalles, rythme, ancrage — identité forte dans chacune
- [ ] Quatre archétypes : appel, pas, soupir, signal — un geste par cellule
- [ ] Test de développabilité : transposition, augmentation, rythme seul
- [ ] Asymétrie interne + fin ouverte = cellule qui appelle sa suite
- [ ] Protocole : brief → intervalle-signature → archétype → cellule → test

<QuizBlock id="m02-l02-quiz" questions={6} />
<LessonFooter exercises={["m02-e03-archetype-cells", "m02-e04-brief-to-cell"]} />

---

## 20.5 LEÇON m02-l03 — « Développer I : répétition, transposition, séquence »

```mdx
---
id: m02-l03-developper-1
module: module-02-melodie
title: "Développer I : répétition, transposition, séquence"
estMinutes: 25
skills: { melody: 1.0 }
---
```

### Pourquoi le développement est le vrai métier

Tu as une cellule robuste. La tentation : en inventer une deuxième, puis une troisième — et produire ce catalogue d'idées que personne ne retient (l01 §5). Le métier fait l'inverse : **tirer d'une cellule tout ce qu'elle contient**. Cette leçon couvre les trois outils de développement *conservateurs* (l'identité reste évidente) ; la leçon 4 couvrira les outils *transformateurs* (l'identité se cache). Ensemble, ils sont l'échelle de variation — du plus reconnaissable au plus dissimulé.

### 1. La répétition exacte : l'ancrage

Répéter la cellule à l'identique n'est pas de la paresse : c'est **l'installation du contrat** (l01 §1). La première fois, l'auditeur entend ; la deuxième, il *reconnaît* — et la reconnaissance est un plaisir en soi. Règles d'usage :

- **une répétition exacte immédiate est presque toujours juste** (mes. 1 → mes. 2, ou mes. 1–2 → mes. 3–4 : la moitié des thèmes du répertoire commencent ainsi) ;
- **la troisième exacte est le seuil de vigilance** : c'est là que `melody.monotony` commence à compter (§7.2 : ≥ 4 exactes sans variation = alerte) — et que l'auditeur commence à attendre autre chose. La règle des pros : *deux fois pareil, la troisième différente* ;
- exception assumée : l'ostinato (profil `thriller-tension`, où la répétition est l'outil — la matrice §7.8 t'en a montré le poids 0).

### 2. La transposition : le même geste, ailleurs

Rejouer la cellule **plus haut ou plus bas** — même forme intervallique, autre point de départ. C'est la variation la plus économique et la plus puissante : l'identité est intacte (l'oreille suit la *forme*, l02 §1), mais la position change le *sens* :

```
transposition ASCENDANTE  = intensification, question qui insiste, espoir
transposition DESCENDANTE = apaisement, résignation, écho qui s'éloigne
```

Nuance de métier — **les deux transpositions** :
- **réelle** (chromatique) : intervalles exacts, quitte à sortir de la gamme — le geste garde sa taille précise. Dramatique, moderne, cinéma ;
- **tonale** (diatonique) : on reste dans la gamme, les intervalles s'ajustent (la quinte devient parfois quarte...) — le geste s'adapte au terrain. Classique, fluide, invisible.

`findMotifs` reconnaît les deux comme `transposed` (il compare les formes intervalliques — la tonale à ±1 demi-ton près est gérée par la variation rythmique... non : elle est reconnue quand la forme reste dans la tolérance de la comparaison exacte des intervalles ; sinon elle bascule en « variation » au sens large). En pratique : commence par la tonale (elle ne te sortira jamais de la tonalité), réserve la réelle aux moments où le geste doit garder sa taille exacte — typiquement l'intervalle-signature.

### 3. La séquence : la transposition mise en marche

Répète la cellule en la transposant **chaque fois du même intervalle, dans la même direction** : tu obtiens une séquence — l'outil de progression dramatique le plus fiable du langage tonal.

```
cellule sur I  →  cellule un degré plus haut  →  encore un degré  →  ...
   énoncé            insistance                    montée en puissance
```

<MusicExample id="sequence" title="Une cellule, une séquence, une phrase entière">
  Cellule : C4:e E4:e G4:q E4:e (le pas arpégé)
  C4:e E4:e G4:q E4:e | D4:e F4:e A4:q F4:e | E4:e G4:e B4:q G4:e | F4:e A4:e C5:q. r:e |
  E4:e G4:e C5:q G4:e | D4:q B3:q C4:h
  Mesures 1–4 : séquence ascendante par degrés (tonale). La mesure 4 CASSE
  la séquence (rythme suspendu) — juste avant la lassitude. Mesures 5–6 :
  descente conclusive bâtie sur la même cellule. SIX mesures, UNE cellule.
</MusicExample>

Les trois lois de la séquence, héritées de trois siècles d'usage :

1. **Trois occurrences maximum** (deux, c'est une séquence ; trois, c'est le plafond ; quatre, c'est une machine — l'auditeur a compris le procédé et décroche). La quatrième case doit casser : rythme suspendu, saut, silence ;
2. **La séquence a une destination** : elle monte VERS quelque chose (le climax, la dominante, la cadence). Une séquence qui monte puis redescend sans événement est un escalier vers rien ;
3. **Le pas de séquence porte le sens** : par degrés (2de) = progression organique ; par tierces = envol lyrique ; par quartes/quintes = le toboggan harmonique (elle épouse alors la chaîne de dominantes de l19 M1 — séquence mélodique et séquence harmonique sont le même animal vu de deux côtés).

### 4. Assembler : la grammaire énoncé–répétition–développement

Les trois outils de la leçon suffisent déjà à construire des phrases entières selon le schéma le plus productif du métier — le **sentence** (pour l'appeler par son nom de manuel), petit frère de la période (l16 M1) :

```
ÉNONCÉ (cellule, 1 mes.) → RÉPÉTITION (exacte ou transposée, 1 mes.)
→ DÉVELOPPEMENT (séquence resserrée ou fragments, 1 mes.)
→ CONCLUSION (geste cadentiel, 1 mes.)
        = la structure « 1+1+2 » : dire, redire, précipiter, conclure
```

Vérifie : l'exemple de dissection de l01 §2 suit ce schéma en 8 mesures (2+2+4). L'exercice m02-e06 te fait composer trois sentences sur trois cellules d'archétypes différents — c'est l'exercice charnière du module : après lui, tu ne « cherches » plus la suite d'une cellule, tu la *construis*.

### 5. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Peur de la répétition exacte | variation dès la 2e occurrence : l'ancrage n'a pas lieu | deux fois pareil, la troisième différente |
| Séquence de 4+ occurrences | l'effet « machine à coudre » | trois maximum, la quatrième casse |
| Séquence sans destination | montée qui retombe dans le vide | décide l'arrivée AVANT d'écrire la séquence |
| Transposition réelle par accident | sorties de tonalité inexpliquées (`melody.out-of-key`) | tonale par défaut ; réelle en conscience |
| Tout développer, jamais conclure | la phrase tourne sans atterrir | le schéma 1+1+2 réserve son dernier quart au geste cadentiel |

### Récapitulatif

- [ ] Répétition exacte = ancrage : deux fois pareil, la troisième différente
- [ ] Transposition : ascendante intensifie, descendante apaise ; tonale par défaut
- [ ] Séquence : 3 occurrences max, une destination, le pas porte le sens
- [ ] Le sentence (1+1+2) : dire, redire, précipiter, conclure — ma deuxième structure
- [ ] Une cellule bien développée = une phrase entière sans rien inventer

<QuizBlock id="m02-l03-quiz" questions={6} />
<LessonFooter exercises={["m02-e05-transpose-and-sequence", "m02-e06-three-sentences"]} />

---

## 20.6 État de production

| Module 2 | Statut |
|---|---|
| Sommaire | ✅ 15 leçons planifiées, deux actes (métier / ambiances), gabarits `archFit` à calibrer en l10–l14 |
| l01–l03 | ✅ rédigées intégralement — la cellule et son premier développement |
| Prochain lot | l04–l06 : les transformations (augmentation, inversion, fragmentation), le contour, la phrase — clôture du noyau « développement » |
| Exercices | m02-e01 → e06 référencés (solutions de référence à produire au fil, verrou CI §19.6) |

Chaînages posés : l01 fait de `findMotifs` un miroir biologique (le test des trois écoutes) ; l02 reprend la représentation exacte du moteur (`intervalShape`/`rhythmShape`) comme outil de pensée ; l03 introduit le *sentence* qui rejoindra la période (M1 l16) dans `phraseAnalysis` — et son exemple de séquence prépare la jonction séquence mélodique / chaîne harmonique (l19 M1). Le module honore la promesse d'architecture : le vocabulaire du cours EST le vocabulaire du moteur.

---

**Point de confirmation.** Je poursuis avec le **lot l04–l06** (Développer II : augmentation, diminution, inversion, rétrograde, fragmentation — puis contour et phrase), qui achève l'acte « métier » avant les leçons charnières l07–l09 ? Ou tu préfères sauter directement à l'atelier des ambiances (l10–l14) pour valider tôt le format de ces leçons-là, quitte à revenir combler l04–l09 ensuite ?