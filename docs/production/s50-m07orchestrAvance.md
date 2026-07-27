# SECTION 50 — MODULE 7 : COMBINAISONS ET ORCHESTRATION AVANCÉE — OUVERTURE

## 50.1 Positionnement — le module qui ne contient (presque) rien de neuf

M7 a un statut unique dans le cursus : c'est le module de **convergence** — il n'introduit presque aucun concept nouveau, il apprend à faire travailler ensemble tout ce qui existe :

```
M5 a donné LES INSTRUMENTS (les fiches : qui peut quoi)
M2 a donné LA LIGNE (ce qui mérite d'être orchestré)
M3 a donné LES COULEURS (ce que l'harmonie demande à la masse)
M4 a donné LE TISSAGE (plusieurs lignes en conscience)
M6 a donné L'AUTRE MOITIÉ DU MONDE (le layering = l'orchestration en Hz)
M7 = l'art de la DISTRIBUTION : quelle idée à quel pupitre, dans quel
     registre, avec qui, contre qui — le passage de "j'ai composé" à
     "ça sonne"
```

Sa thèse, héritée de m05-l01 §3 et vérifiée partout depuis : **rôle → registre → couleur, dans cet ordre** — le module entier est le déploiement méthodique de cette phrase. Et son format de travail est nouveau côté produit : les exercices ORCHESTRATE passent au **format `Part[]` multi-pistes** (annoncé en F-14 : la notation mono-flux atteignait sa limite ; la voici franchie — chaque part porte son `instrumentId`, ses notes, ses dynamiques, et le moteur applique `orch.*` par part et `densityMap`/`effectivePower` sur l'ensemble).

**Extensions moteur actées à l'ouverture** :

| Extension | Contenu |
|---|---|
| Format `Part[]` en soumission | parts nommées par `instrumentId` (le registre §25.1 en source de vérité), dynamiques par note ou par part |
| `rolePlan` | la contrainte-mère du module : le plan de rôles déclaré (qui est melody/counter/harmony/bass/rhythm/texture — le jumeau orchestral du `tensionPlan`/`texturePlan` : la famille des plans déclarés s'agrandit) et vérifié (le rôle détecté par part : la mélodie a l'ambitus et l'activité, la basse a le registre et les fondamentales — heuristiques §4.1.6 enfin consommées en contrainte) |
| Détection de doublures | paires de parts aux `notes` identiques modulo octave/unisson sur une fenêtre → tag `doubling` (type unison/octave/compound) — la mécanique de la « doublure fantôme » de m06-e14, généralisée |
| `orch.*` au complet | balance/masking/register-color/density sur le format multi-parts : le chapitre §4.1.6 passe de spécifié à central |

Prérequis : M5 complet + M2 ; M4-l11 fortement recommandée. Les 10 leçons :

| # | Titre | min |
|---|---|---|
| 1 | La distribution : des rôles aux pupitres | 25 |
| 2 | Les doublures : l'art d'épaissir | 30 |
| 3 | Le tapis : orchestrer l'harmonie | 25 |
| 4 | Le moteur : orchestrer le rythme | 25 |
| 5 | La ligne et son âme : mélodie + contrechant au pupitre | 25 |
| 6 | Le crescendo orchestral : recruter | 25 |
| 7 | Le tutti : l'architecture de la masse | 30 |
| 8 | L'intime : orchestrer le peu | 25 |
| 9 | De l'esquisse à la partition : le protocole | 30 |
| 10 | Synthèse : le cue orchestré | 40 |

---

## 50.2 LEÇON m07-l01 — « La distribution : des rôles aux pupitres »

```mdx
---
id: m07-l01-distribution
module: module-07-orchestration-avancee
title: "La distribution : des rôles aux pupitres"
estMinutes: 25
skills: { orchestration: 1.0 }
---
```

### Pourquoi l'orchestration est un casting

Une esquisse de piano contient des *idées* ; une partition contient des *emplois*. Entre les deux, l'acte d'orchestrer est exactement un casting : chaque idée reçoit un rôle (m05-l01 en donnait six : melody, countermelody, harmony, bass, rhythm, texture), chaque rôle reçoit un interprète, et — la partie qu'on oublie — chaque interprète reçoit un **espace** où être entendu. Cette leçon installe la méthode ; les neuf suivantes la déclinent par rôle et par situation.

### 1. La méthode en quatre questions (l'extension de rôle→registre→couleur)

```
1. QUELS RÔLES cette musique contient-elle ? (l'inventaire : rarement
   plus de 4 rôles SIMULTANÉS — au-delà, l'auditeur n'en suit plus —
   la loi du stack de m06-l03 §3, valable à 80 musiciens comme à
   4 couches : max 3-4 plans actifs + les événements)
2. QUELLE HIÉRARCHIE ? à chaque instant, UN rôle est premier (le regard
   de l'auditeur), un ou deux sont seconds, le reste est décor — la
   hiérarchie du contrechant (m04-l11 §1) généralisée à tout l'orchestre
3. QUELS ÉTAGES ? chaque rôle reçoit SA bande de registre (l'immeuble
   de m09-l02 §3, érigé en méthode universelle : la puissance ET la
   clarté viennent de l'espace couvert, pas de la densité locale)
4. QUELLES COULEURS ? enfin les fiches M5 : parmi les instruments qui
   couvrent l'étage, lequel a le timbre du rôle et de l'émotion ?
```

L'erreur structurelle des débutants est de commencer par la question 4 (« je veux des cors ») — mais l'erreur des intermédiaires est plus sournoise : sauter la question 2. Une orchestration où tout est « important » est un tutti permanent en germe : **la hiérarchie est la première décision sonore**, et elle se paie en retenue (les pupitres qui se taisent — la soustraction de m06-l03, côté acoustique).

### 2. La grille de distribution (l'outil de travail du module)

Chaque exercice ORCHESTRATE du module commence par remplir cette grille — c'est le `rolePlan`, désormais un livrable :

| Rôle | Étage (bande) | Pupitre(s) | Hiérarchie | Notes |
|---|---|---|---|---|
| melody | — | — | 1er / 2e / décor | — |
| countermelody | — | — | — | (m04-l11 : la recette) |
| harmony | — | — | — | (l03 : le tapis) |
| bass | — | — | — | — |
| rhythm | — | — | — | (l04 : le moteur) |
| texture | — | — | — | — |

Trois lois de remplissage : **un pupitre, un rôle à la fois** (m05-l04 : le violoncelle ne peut pas être basse ET ténor simultanément — divise ou choisis) ; **les étages ne se chevauchent qu'en connaissance** (le chevauchement est légal quand les timbres séparent — m03-l16 §1 : les trois séparateurs valent ici) ; **la grille se re-remplit à chaque section** (la distribution n'est pas un décor planté : elle évolue avec la scène — c'est même elle, souvent, la dramaturgie : l06 en fera un art).

### 3. Le premier réflexe : la partition mentale en cinq lignes

Avant tout logiciel, l'orchestrateur pense sa page en cinq portées mentales — le conducteur réduit :

```
CIEL        (au-dessus de C6)  : brillance, voûte, air
CHANT       (C5–C6)            : là où la mélodie règne par défaut
CŒUR        (C4–C5)            : contrechants, harmonie haute — la
                                  zone la plus disputée de l'orchestre
CORPS       (C3–C4)            : harmonie, ténor, la chaleur
SOCLE       (sous C3)          : basse, fondations — l'espace obligatoire
                                  (low-interval-limit, éternel)
```

L'exercice mental qui change tout : à l'écoute de n'importe quel score, dessine ces cinq lignes et place ce que tu entends — cinq secondes de diagnostic, et tu *vois* la distribution (M11 systématisera ; le rapport du produit te montre déjà cette vue : la `densityMap` de §4.1.6 est exactement ce dessin).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Commencer par la couleur | le registre pris, le rôle flou (m05-l01, confirmé au carré) | les quatre questions, dans l'ordre |
| Tout au rang 1 | le tutti permanent en germe | la hiérarchie se décide — et se paie en silences |
| Cinq rôles simultanés | l'auditeur décroche | 3–4 plans actifs, comme en M6 |
| La grille remplie une fois pour toutes | l'orchestration-décor | elle se rejoue par section : c'est la dramaturgie |

### La mission (m07-e01, ORCHESTRATE — le premier Part[])

L'esquisse fournie (piano, 8 mesures : un thème, des accords, une basse — trois rôles évidents, un caché) : remplis la grille (`rolePlan`), distribue sur 5 parts (pool MVP §25.1), étages déclarés. Le moteur vérifie : les rôles détectés ≈ déclarés (la première confrontation plan↔réalisation du module), zéro chevauchement d'étage non justifié, `orch.range-violation`/`balance` muets. Le rôle caché (un contre-rythme dans la main gauche de l'esquisse) : le trouver vaut un crédit craft — l'oreille de casting, testée dès l'entrée.

- [ ] L'orchestration est un casting : rôles → hiérarchie → étages → couleurs
- [ ] Un rôle premier à chaque instant ; 3–4 plans actifs maximum
- [ ] Les cinq lignes mentales : le diagnostic en cinq secondes
- [ ] La grille se rejoue par section — la distribution est une dramaturgie

<QuizBlock id="m07-l01-quiz" questions={5} />
<LessonFooter exercises={["m07-e01-first-casting"]} />

---

## 50.3 LEÇON m07-l02 — « Les doublures : l'art d'épaissir »

```mdx
---
id: m07-l02-doublures
module: module-07-orchestration-avancee
title: "Les doublures : l'art d'épaissir"
estMinutes: 30
skills: { orchestration: 1.0 }
---
```

### Pourquoi la doublure est le geste central de l'orchestration

Doubler = confier **la même ligne** à deux interprètes. Le geste paraît trivial ; il est l'atelier d'alchimie de l'orchestre : deux timbres sur une ligne ne font pas « deux fois plus fort » — ils font **un troisième timbre** qui n'existe dans aucun instrument seul. L'orchestrateur qui maîtrise les doublures possède une palette infinie avec seize pupitres ; celui qui les ignore n'a que seize couleurs. (Et tu connais déjà la théorie par deux chemins : la fusion des timbres qui bougent ensemble, m06-e14 ; et le planing comme « doublure généralisée », m03-l14 §2.)

### 1. Les trois distances (la première décision)

| Distance | Mécanique | Effet |
|---|---|---|
| **L'unisson** | même ligne, même octave | la FUSION : les timbres s'épousent en un alliage — le troisième timbre pur (violons+hautbois : le chant focalisé, m05-l07 ; celli+cors : LA doublure signature, §5.2/l04) |
| **L'octave** | même ligne, ±12 | l'ÉLARGISSEMENT : la ligne gagne de l'espace vertical sans gagner d'épaisseur locale — le thème qui devient panoramique (violons+celli 8va : le lyrisme de film, m05-l04 ; +flûte 8va sup : la lumière ajoutée, m05-l06) |
| **La double octave et plus** | ±24, l'échafaudage | le MONUMENTAL : la ligne devient une colonne (le tutti d'octaves : trois, quatre étages de la même ligne — l07 en vivra) |

La loi d'alliage de l'unisson, à connaître par cœur : **le timbre le plus caractérisé domine l'alliage** — hautbois+clarinette sonne hautbois adouci (le focalisant gagne, m05-l07/l08) ; cordes+bois sonne cordes éclairées (la masse gagne) ; et les `avoidWith` des fiches (cor+trompette ff) sont des alliages où l'un *avale* l'autre : la table §25.1 est ta table de chimie.

### 2. Le catalogue des alliages (les dix doublures de métier)

| Alliage | Distance | Le troisième timbre | Territoire |
|---|---|---|---|
| Violons + flûte | 8va sup | la lumière classique | l'élégance, le lumineux |
| Violons + hautbois | unisson | le chant qui parle | le narratif, le poignant |
| Violons I + II | 8va | l'unisson large | le grand thème (m05-l02 §3) |
| Celli + cors | unisson | la chaleur cuivrée-charnue | LE thème de film (double source fiches) |
| Violons + celli | 8va | le lyrisme panoramique | la romance déployée (m09-l01) |
| Altos + clarinette | unisson | le velours | la douceur voilée (m05-l03/l08) |
| Celli + bassons¹ | unisson | le grave boisé, articulé | la basse qui parle |
| Cor + trombones¹ | unisson | le bronze | le choral, la solennité |
| Flûte + clarinette | 8va | l'air pur | le pastoral, l'aérien |
| Piccolo + tout tutti | 8va sup | le sommet perçant | l'éclat final (m05-l06 : jamais discret) |

¹ pupitres V1 — l'alliage se note dès maintenant, la fiche suivra.

Et la méta-règle qui organise le catalogue : **on double par familles voisines pour fondre, par familles distantes pour éclairer** — cordes+bois = l'alliage doux ; cordes+cuivres = l'alliage riche ; bois+cuivres = l'alliage franc (les deux caractères s'additionnent sans se fondre : à réserver aux lignes qui doivent percer).

### 3. Les doublures d'harmonie (l'autre moitié du geste)

Doubler ne concerne pas que la mélodie — et les règles changent quand on double des *accords* :

```
LA LOI DES DOUBLURES D'ACCORD (l'héritage vl.* enfin orchestral) :
  on double LA FONDAMENTALE d'abord, la quinte ensuite, la tierce
  avec parcimonie (la tierce doublée épaissit l'émotion jusqu'à la
  caricature — sauf choix), la SENSIBLE jamais (§7.4 : la règle de
  M1 était une règle d'orchestre avant tout)
LA RÉPARTITION : l'acoustique aime l'espacement harmonique naturel —
  larges en bas, serrés en haut (m01-l12, la loi qui ne meurt jamais)
  et les doublures REMPLISSENT les étages sans les brouiller :
  le même accord à 8 voix = 4 notes bien étagées, pas 8 notes serrées
```

### 4. La discipline : doubler est une dépense

Chaque doublure dépense deux ressources : **un pupitre** (qui n'est plus disponible pour un autre rôle — le budget d'effectif) et **du contraste futur** (la ligne doublée dès la mesure 1 n'a plus d'épaississement à offrir — le budget de crescendo, l06). La règle d'économie, sœur de toutes les règles d'économie du cursus : *la doublure se mérite* — le thème s'expose souvent PUR (une couleur nue : l'ancrage), se double à la reprise (l'adjectif — m04-l11 §erreurs : le contrechant entrait à la reprise ; la doublure aussi : les deux enrichissements obéissent à la même dramaturgie).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Doubler pour « plus fort » | l'épaisseur sans la puissance (la vraie puissance : l'étage et la dynamique — effectivePower) | on double pour le TIMBRE ; le volume a d'autres outils |
| Tout doubler dès le début | plus de contraste disponible | la doublure se mérite : pur d'abord, allié ensuite |
| L'alliage au hasard | le focalisant avalé, l'avoidWith ignoré | la table de chimie : les fiches décident |
| La tierce et la sensible doublées | l'émotion caricaturée, l'embouteillage | fondamentale d'abord — vl.* était de l'orchestration |

### La mission (m07-e02, ORCHESTRATE)

Le thème fourni (8 mesures, lyrique) orchestré **trois fois** (trois parts-groupes successives) : (1) pur — une couleur nue au choix ; (2) fondu — un alliage d'unisson du catalogue (déclaré) ; (3) panoramique — l'octave à 2–3 étages. Le moteur détecte les doublures (tags unison/octave), vérifie la ligne identique entre versions, l'alliage contre la table `blendsWith`/`avoidWith` (§25.1 — les données des fiches en juge de chimie), et la répartition d'accords si tu ajoutes le tapis (bonus craft : sensible jamais doublée).

- [ ] Deux timbres = un troisième : la doublure est une chimie, pas une addition
- [ ] Trois distances : fusion (unisson), élargissement (octave), monument (double octave)
- [ ] Le catalogue des alliages + la loi du plus caractérisé
- [ ] La doublure se mérite : pur d'abord — c'est un budget

<QuizBlock id="m07-l02-quiz" questions={5} />
<LessonFooter exercises={["m07-e02-the-alloys"]} />

---

## 50.4 LEÇON m07-l03 — « Le tapis : orchestrer l'harmonie »

```mdx
---
id: m07-l03-tapis
module: module-07-orchestration-avancee
title: "Le tapis : orchestrer l'harmonie"
estMinutes: 25
skills: { orchestration: 0.8, harmony: 0.2 }
---
```

### Pourquoi le tapis est un art invisible

Le rôle `harmony` est le moins glorieux et le plus décisif : le **tapis** — les tenues qui portent l'accord pendant que la mélodie vit dessus. Invisible quand il est réussi, catastrophique quand il est raté (le tapis boueux tue le plus beau thème). Son art tient en trois décisions : le *voicing orchestral* (où vivent les notes), la *matière* (qui les tient), la *vie* (comment elles respirent) — et tu vas reconnaître au passage la fiche du pad (m06-l04) : le tapis orchestral et le pad synthétique sont le même objet dans deux mondes, jusqu'au détail.

### 1. Le voicing orchestral (l'accord déplié dans l'espace)

```
LA RECETTE DE BASE (l'accord de do majeur, tapis de cordes) :
SOCLE   C2 (contrebasses) + C3 (celli)     — l'octave de fondation :
                                              JAMAIS de tierce ici
CORPS   G3, E4 (celli div. ou altos)        — l'accord s'ouvre : les
                                              intervalles rétrécissent
                                              en montant (la série
                                              harmonique comme modèle —
                                              m01-l12 §4 avait donné la
                                              loi ; voici son pourquoi
                                              acoustique)
CŒUR    C4... — reprenons proprement : G3 (celli), E4 (altos),
CHANT   C5, G5 (violons II div.)            — le haut respire large ou
                                              serré selon la couleur
LE TEST : joue le voicing au piano, pédale tenue — s'il est boueux
au piano, il sera boueux à l'orchestre (le piano dit vrai sur les
registres, m05-l10 : c'est l'un de ses rares aveux fiables)
```

Deux variantes de caractère : le tapis **serré au cœur** (les notes groupées C4–C5 : l'intimité, la densité chaleureuse — le choral) vs **éclaté sur cinq octaves** (l'espace, la transparence — le tapis « cathédrale ») : même accord, deux architectures, et le choix EST une émotion (le width du pad, m06-l04 : le même curseur).

### 2. La matière (qui tient le tapis)

| Matière | Caractère | Piège de fiche |
|---|---|---|
| **Cordes tenues** | le tapis par défaut : infini (archet alterné), toute dynamique, fondu total | aucun — c'est le défaut pour une raison |
| **Cordes con sordino** | la brume (m05-l02) | la puissance plafonne : pas de tapis ff en sourdines |
| **Bois en tenues** | la clarté organisée — chaque bois s'entend (des *lignes* de tapis plus qu'une nappe) | le hautbois ne se fond pas (m05-l07) : chaque note de sa tenue est un événement — dose-le |
| **Cors en tenues** | le liant noble, le tapis qui a un torse (§5.2) | l'endurance (lips) : les tenues de cors se relaient |
| **Le tapis mixte** | cordes + un bois doubleur discret par note (la clarinette-caméléon, m05-l08 : les entrées invisibles) | le sur-mélange : 2 matières max (la loi des familles de pads, m06-l04 §6 — identique) |

### 3. La vie du tapis (contre la nappe morte)

Un tapis n'est pas un accord d'orgue — la leçon de m06-l02 (« ce qui bouge est vivant ») vaut mot pour mot, avec les moyens de l'orchestre :

```
LA RESPIRATION DYNAMIQUE : les tenues enflent et retombent (le CC1 de
  m10-l04, forme 1 : l'arche de note — à l'orchestre c'est l'archet
  et le souffle qui la font, en maquette c'est TA molette)
LE RENOUVELLEMENT INTERNE : les voix du tapis se REDISTRIBUENT au
  changement d'accord (les notes communes tiennent — m01-l12 §2, la
  loi des liaisons, appliquée aux pupitres : le tapis coule au lieu
  de sauter) ; et sur un accord long, une voix interne peut broder
  (la broderie de m04-l04, employée comme scintillement de nappe)
LE COMPLÉMENT : le tapis respire QUAND la mélodie parle et gonfle
  quand elle respire (m04-l07 : le complément rythmique, appliqué
  aux dynamiques — le tapis qui gonfle sous la tenue du thème est
  le geste d'accompagnement le plus expressif de l'orchestre)
```

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| La tierce au socle | la boue harmonique (l'éternelle) | octave/quinte sous C3 — la série harmonique est la loi |
| Le tapis qui double la mélodie dans son étage | le thème mangé par son propre lit | le CHANT appartient à la mélodie : le tapis vit dessous (et au-dessus s'il éclate — jamais dedans) |
| La nappe morte | l'orgue déguisé en orchestre | respiration, renouvellement, complément — trois vies au choix, une minimum |
| Trois matières mélangées | le gris riche (le band-pileup orchestral) | deux matières max — m06-l04 avait raison pour les deux mondes |

### La mission (m07-e03, ORCHESTRATE)

La progression fournie (8 mesures — la boucle romance de m09-l01, encore elle : le fil des exemples) : construis le tapis SEUL (pas de mélodie — l'exercice de l'invisible, comme m06-e05) en deux versions : (a) serré-intime (cœur, sordines), (b) éclaté-cathédrale (cinq octaves, matière mixte déclarée). Voicings vérifiés (socle sans tierce, étagement harmonique), notes communes tenues entre accords (le checker de liaisons par part), dynamiques d'arche exigées sur les tenues > 2 temps (le checker CC de m10-e04, recyclé au tapis), 2 matières max.

- [ ] Le voicing orchestral suit la série harmonique : large en bas, vivant en haut
- [ ] Serré = l'intimité, éclaté = la cathédrale — l'architecture est une émotion
- [ ] Deux matières max ; le hautbois s'entend, la clarinette s'efface, le cor se relaie
- [ ] Trois vies : la respiration, le renouvellement, le complément — jamais d'orgue

<QuizBlock id="m07-l03-quiz" questions={5} />
<LessonFooter exercises={["m07-e03-the-carpet"]} />

---

## 50.5 État de production

| Module 7 | Statut |
|---|---|
| Fondations | le format `Part[]` acté (la limite F-14 levée), `rolePlan` + détection de doublures + `orch.*` en régime multi-parts — le chapitre orchestral du moteur (§4.1.6, §25.1) passe au premier plan |
| l01–l03 | ✅ **3/10** — la méthode (le casting en quatre questions, les cinq lignes), les doublures (la chimie des alliages, les données de fiches en juge), le tapis (le pad orchestral, les trois vies) |
| Fil rouge | la convergence en acte : chaque leçon fait travailler ≥ 3 modules antérieurs, et les jumeaux M5↔M6 sont systématiquement nommés (tapis↔pad, alliage↔layering, largeur↔width) ; la famille des plans déclarés s'agrandit (rolePlan) |
| Prochain lot | l04–l06 : le moteur (orchestrer le rythme — ostinatos, percussions, l'articulation des pupitres), la ligne et son âme (m04-l11 au pupitre : le duo thème-contrechant distribué), le crescendo orchestral (recruter — la dramaturgie d'effectif) |

---

**Point de confirmation.** Le Module 7 est ouvert sur son socle méthodologique. Je poursuis avec le **lot l04–l06** — le moteur (le rôle rhythm orchestré : les ostinatos par pupitre, l'articulation qui fait le groove d'orchestre), la ligne et son âme (la distribution du couple thème+contrechant : les cinq recettes de m04-l11 rencontrent les alliages de l02), et le crescendo orchestral (l'art de recruter : la dramaturgie d'effectif, des paliers de m09-l02 à la vague continue) ?