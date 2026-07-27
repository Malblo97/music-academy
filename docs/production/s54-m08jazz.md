# SECTION 54 — MODULE 8 : LE JAZZ — OUVERTURE

## 54.1 Positionnement — pourquoi un module jazz dans un cursus de musique de film

Trois raisons, par ordre d'importance croissante :

```
1. LE JAZZ EST UN GENRE DE FILM : le noir (m09-l03 en vivait déjà),
   la comédie urbaine, le biopic, la scène de club — le compositeur
   à l'image DOIT savoir le parler (ou le citer proprement)
2. LE JAZZ EST UN RÉSERVOIR : ses voicings, ses substitutions, son
   rythme ont infusé TOUTE la musique moderne — la moitié de M1
   (l17-l20) et de M3 (l09, l13) venait de lui sans le dire
3. LE JAZZ EST UNE ÉCOLE D'OREILLE ET DE DÉCISION : l'idiome où
   l'harmonie se pense en temps réel — le musicien qui a intégré
   le ii-V-I sous toutes ses formes entend plus vite, partout
```

**Le contrat d'honnêteté** (le même que M10 §30.1) : ce module enseigne le jazz *écrit* — le langage, les voicings, la conduite, le rythme swing composé. Il ne prétend pas enseigner l'improvisation en temps réel (ça s'apprend en jouant, des années) — mais il enseigne **tout ce que l'improvisateur sait**, et les exercices de « solo écrit » (l10) sont exactement l'atelier que les improvisateurs appellent la composition de chorus. La frontière est dite ; à l'intérieur, tout est réel.

**Le terrain acquis** — ce module récolte plus qu'il ne sème : le ii-V-I et les guide tones (m01-l19/l26), le subV (m01-l20), les tensions (m01-l18), l'altéré et le locrien ♮2 (m03-l09), le quartal (m03-l13), la cambiata→enclosure et la walking bass annoncées (m04), la syncope (m01-l09), la fenêtre 0.35–0.7 (§7.8), la mélodie de standard (m02-l14 §3). Le profil `jazz` de la matrice attend depuis §7.8.

**Extensions moteur actées à l'ouverture** :

| Extension | Contenu |
|---|---|
| `swingRatio` | l'analyse de la croche inégale : le ratio mesuré sur les paires de croches (1:1 straight → ~2:1 swing ternaire) — nouvelle métrique de `rhythmProfile`, consommée par `swingTarget: [min, max]` (le jumeau jazz de `syncopationTarget`) |
| Idiomes tagués | `walking-bass` (noires conjointes/chromatiques sur fondamentales cibles), `enclosure` (l'encerclement chromatique d'une cible), `shell-voicing`, `rootless-voicing` (le dictionnaire §8.5 les connaissait — les tags les nomment), `blues-scale`, `turnaround` |
| `chordScaleCheck` | la contrainte reine du module : chaque note de la ligne évaluée contre la gamme de l'accord courant (le chord-scale system en checker — la généralisation de `guideToneTargets`) |
| Grilles en `given` étendues | les qualités m7♭5, 7alt, 7♯11, dim7 en progression — le parseur d'accords de spec s'aligne sur le dictionnaire complet |

Prérequis : M1 complet, m03-l09/l13 recommandées. Les 15 leçons :

| # | Titre | min |
|---|---|---|
| 1 | Le swing : le temps qui roule | 25 |
| 2 | Les voicings I : shells, rootless — la main du pianiste | 30 |
| 3 | Le ii–V–I sous toutes ses formes | 25 |
| 4 | Le blues : la forme-mère | 30 |
| 5 | La walking bass : la 3e espèce du jazz | 25 |
| 6 | Les gammes d'accords : le chord-scale system | 30 |
| 7 | Le vocabulaire bebop : enclosures, chromatismes, le langage | 25 |
| 8 | La ballade : l'harmonie qui respire | 25 |
| 9 | Réharmoniser : l'art de changer les accords sous la mélodie | 30 |
| 10 | Le solo écrit : composer un chorus | 25 |
| 11 | Le jazz modal : le lieu plutôt que le trajet | 20 |
| 12 | Le big band : les sections qui parlent | 30 |
| 13 | Le trio et le combo : l'écriture de petit groupe | 20 |
| 14 | Le jazz à l'image : citer, styliser, hybrider | 25 |
| 15 | Synthèse : le standard original | 40 |

---

## 54.2 LEÇON m08-l01 — « Le swing : le temps qui roule »

```mdx
---
id: m08-l01-swing
module: module-08-jazz
title: "Le swing : le temps qui roule"
estMinutes: 25
skills: { rhythm: 0.7, ear_training: 0.3 }
---
```

### Pourquoi commencer par le temps

On peut jouer les bons accords, les bonnes gammes, les bonnes substitutions — sans swing, ce n'est pas du jazz ; avec le swing, trois notes en sont. Le swing est la **signature temporelle** de l'idiome : il se comprend en une leçon et s'incorpore en des mois — raison de plus pour l'installer en premier : tout le reste du module se jouera *dedans*.

### 1. La croche inégale (la mécanique)

Le swing divise le temps en deux croches **inégales** : la première longue, la seconde courte — le ratio glisse entre ~3:2 (léger, rapide) et ~2:1 (le ternaire franc, medium) :

```
ÉCRIT :    ♪ ♪        (deux croches égales sur la partition)
JOUÉ :     ♩ ♪        (pensé en triolet : noire + croche de triolet)
           └─2─┘└1┘
LA LOI DU TEMPO : le ratio DÉPEND du tempo — ballade lente : presque
  ternaire assumé (2:1 et plus) ; medium : le 2:1 classique ; up-tempo
  (200+) : le swing s'APLATIT vers 1:1 (les croches redeviennent
  presque égales — c'est l'accentuation qui porte alors le swing)
```

Le second pilier, aussi important que l'inégalité : **l'accentuation inversée** — le jazz accentue la *seconde* croche (le « et »), pas la première : la hiérarchie métrique de m01-l08 se renverse (le temps fort s'allège, le contretemps porte l'élan). C'est le couple inégalité+accent qui fait rouler le temps ; l'un sans l'autre boite.

### 2. Les strates du temps jazz

| Strate | Rôle | Le mot du métier |
|---|---|---|
| **La pulsation** (walking bass, ride) | le tapis roulant : imperturbable, noires égales — LE paradoxe fondateur : le swing roule sur une pulsation qui ne swingue pas (elle est droite ; ce sont les subdivisions qui penchent) | le *time* |
| **Le placement** | jouer devant / sur / derrière le temps — le laid-back (la mélodie de ballade traîne de 20-40ms derrière la pulsation : la nonchalance composée) | le *feel* |
| **Les anticipations** | l'accord ou la note qui arrive une croche AVANT le temps (m02-l14 §3 l'annonçait) — la syncope structurelle du jazz : la moitié des attaques harmoniques tombent sur le « et de 4 » | le *push* |

### 3. Écrire le swing (la traduction studio)

En notation et en MIDI, le swing s'écrit en croches égales + la mention *swing* — et se **joue** inégal. Dans Cubase : le paramètre swing du Quantize Preset (m10-l03 §2 : la fenêtre en un curseur — te voilà à son usage natal) règle le ratio ; mais la vérité de m10-l03 tient : **le swing joué à la main bat le swing quantisé** (le ratio vivant fluctue légèrement — c'est cette fluctuation qui respire). Le protocole : joue en écoutant un ride pattern, quantise en Iterative léger, ne touche pas aux accents.

Le moteur t'accompagne : `swingRatio` mesure ton inégalité réelle, et les exercices du module portent `swingTarget` (ex. [1.6, 2.4] en medium) — le rapport dit « ton swing est à 1.9 : le ternaire medium ✓ » ou « 1.1 : tu joues droit — pense triolet ».

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Le swing mathématique exact | le ternaire mécanique — la valse boiteuse | joué à la main, ratio vivant ; la machine s'humanise (m10-l09 : jamais de Random ici — le swing n'est pas du bruit, c'est un penchant) |
| L'accent sur le temps | le swing qui marche au pas | le « et » porte l'élan : accentuation inversée |
| Tout swinguer (la basse aussi) | le temps qui se noie | la pulsation est droite ; les subdivisions penchent |
| Le même ratio à tous les tempos | la ballade raide, l'up-tempo pataud | le ratio suit le tempo : la loi §1 |

### La mission (m08-e01, MELODY_COMPOSE + rythme)

8 mesures sur la pulsation fournie (walking + ride en `given`, ▶ actif) : une ligne simple (pentatonique de fa, ≤ 6 hauteurs — l'harmonie attendra) entièrement au service du temps : `swingTarget: [1.6, 2.4]`, accents sur les « et » (corrélation vélocité×contretemps — le checker de prosodie inversé), ≥ 3 anticipations (l'attaque sur le « et de 4 » taguée), et une note laid-back déclarée (le retard de placement en champ dédié). Le rapport te rend tes trois strates mesurées.

- [ ] Croche inégale (le ratio suit le tempo) + accent sur le « et » : le couple qui roule
- [ ] La pulsation est droite, les subdivisions penchent — le paradoxe fondateur
- [ ] Devant/sur/derrière : le placement est un paramètre expressif
- [ ] Joué puis à peine quantisé — le swing vivant bat le swing exact

<QuizBlock id="m08-l01-quiz" questions={5} />
<LessonFooter exercises={["m08-e01-the-rolling-time"]} />

---

## 54.3 LEÇON m08-l02 — « Les voicings I : shells, rootless — la main du pianiste »

```mdx
---
id: m08-l02-voicings
module: module-08-jazz
title: "Les voicings I : shells, rootless — la main du pianiste"
estMinutes: 30
skills: { harmony: 1.0 }
---
```

### Pourquoi le jazz voice autrement

L'harmonie classique voice pour des *voix* (SATB, la conduite de M1/M4) ; le jazz voice pour une **main** — et pour un contexte : la basse joue la fondamentale (l05), donc le piano ne la répète pas ; la mélodie ou le soliste occupe le haut, donc le piano reste au milieu. Le voicing jazz est une économie : *le minimum de notes qui dit le maximum d'accord* — et tu en connais le cœur depuis m01-l26 : les guide tones. Cette leçon en fait un système de main.

### 1. Le shell voicing : le squelette qui suffit

```
LE SHELL = fondamentale + guide tones (3 et 7) — TROIS notes, tout
l'accord : la fondamentale nomme, la tierce dit majeur/mineur, la
septième dit la fonction. La quinte ? ABSENTE — elle ne dit rien
(sauf altérée : ♭5/♯5 réintègrent le voicing en porteuses de sens).
Dm7  :  D2 + F3 C4      (1 + 3 7)
G7   :  G2 + F3 B3      (1 + 7 3)  ← note l'échange : les guide tones
Cmaj7:  C2 + E3 B3      (1 + 3 7)     PERMUTENT entre accords voisins —
                                      le toboggan de m01-e36, devenu main
```

Le shell est le voicing des mains gauches de bebop, des guitaristes, et de TOUTE esquisse jazz rapide : apprends les deux formes (3-7 et 7-3) dans les douze tons — c'est la conjugaison de base de l'idiome (le générateur du produit te drille : m08-e02).

### 2. Le rootless : la main du trio moderne

Quand la basse est là (le trio, le combo), la fondamentale du piano devient redondante — le **rootless voicing** la supprime et la remplace par des tensions :

| Accord | Voicing A (3 en bas) | Voicing B (7 en bas) | Ce qui s'entend |
|---|---|---|---|
| Dm7 | F–A–C–E (3-5-7-9) | C–E–F–A (7-9-3-5) | le m7 crémeux à 9 |
| G7 | F–A–B–E (7-9-3-13) | B–E–F–A (3-13-7-9) | le V7 habillé 9/13 |
| Cmaj7 | E–G–B–D (3-5-7-9) | B–D–E–G (7-9-3-5) | le maj9 |

La mécanique magique du couple A/B : sur un ii–V–I, **alterner les formes (A→B→A) donne une conduite quasi immobile** — chaque voix bouge d'un demi-ton ou tient (la smoothness de m01-e26, industrialisée : le ii-V-I entier sous une main qui ne se déplace pas). Le registre de la main : **C3–C5** (la « zone du voicing » : plus bas, la boue — le low-interval-limit connaît le jazz aussi ; plus haut, la guerre avec la mélodie).

### 3. Les altérations dans la main (le pont m03-l09)

Le V7 rootless accueille les altérations par simple substitution de notes : le 13 devient ♭13, le 9 devient ♭9/♯9 — la main de G7alt : B–E♭–F–A♭ (3-♭13-7-♭9). Règle de contexte héritée de M1/M3 : **V7 altéré vers un i mineur, V7 naturel (9/13) vers un I majeur** — par défaut ; le goût inverse existe et s'assume (le 7♭9 vers majeur : le frisson gospel).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| La fondamentale dans le rootless | le pléonasme avec la basse + la main trop grave | la basse nomme, la main colore : c'est le contrat |
| La quinte gardée par habitude | une note dépensée pour rien | 3 et 7 d'abord, les tensions ensuite — la quinte seulement altérée |
| Les voicings qui sautent | la main qui se déplace à chaque accord | l'alternance A/B : la conduite immobile est le but |
| Le voicing sous C3 | la boue jazz | la zone C3–C5 — éternelle loi, idiome ou pas |

### La mission (m08-e02, HARMONY_PROGRESSION)

La grille fournie (ii–V–I majeur ×2, ii–V–i mineur ×1, 12 mesures) réalisée **deux fois** : (1) en shells (basse + 3-7, les permutations vérifiées — le tag `shell-voicing`), (2) en rootless A/B alternés (le tag `rootless-voicing`, la smoothness mesurée ≤ 1.5 dt/voix/transition, le V7 du mineur altéré). Generator en amont : le drill des shells dans les 12 tons (8 rounds). Le rapport montre ta conduite voix à voix : « ta main n'a pas bougé de plus d'un ton sur 12 mesures — la main du pianiste ✓ ».

- [ ] Le shell : 1 + 3-7 — trois notes, tout l'accord (et la quinte ne dit rien)
- [ ] Le rootless : la basse nomme, la main colore — tensions à la place de la fondamentale
- [ ] A/B alternés = la conduite immobile : le ii-V-I sous une main
- [ ] Altéré vers mineur, naturel vers majeur — par défaut, et le goût s'assume

<QuizBlock id="m08-l02-quiz" questions={5} />
<LessonFooter exercises={["m08-e02-the-pianist-hand"]} />

---

## 54.4 LEÇON m08-l03 — « Le ii–V–I sous toutes ses formes »

```mdx
---
id: m08-l03-ii-v-i
module: module-08-jazz
title: "Le ii–V–I sous toutes ses formes"
estMinutes: 25
skills: { harmony: 1.0 }
---
```

### Pourquoi une leçon entière sur trois accords

Le ii–V–I est au jazz ce que la cadence parfaite est au classique — mais avec une différence d'échelle : **il est partout** (80 % des mesures d'un standard appartiennent à un ii–V–I de quelque tonalité), il se décline (majeur, mineur, tronqué, enchaîné, substitué), et il est l'unité de pensée de l'improvisateur (on ne pense pas accord par accord : on pense ii-V-I par ii-V-I). Cette leçon en fait la grammaire complète — la cellule-mère dont le module entier est le développement.

### 1. Les deux formes de base (le rappel armé)

```
MAJEUR :  Dm7 – G7 – Cmaj7        (m01-l19/l26 : acquis)
MINEUR :  Dm7♭5 – G7alt – Cm(maj7 ou m7 ou m6)
          └ le locrien ♮2 (m03-l09) └ l'altéré (m03-l09) : les deux
            gammes de la seconde galaxie avaient rendez-vous ICI —
            le ii-V mineur est leur maison commune
```

La différence de caractère : le majeur *arrive* (la résolution lumineuse), le mineur *tombe* (chaque accord plus sombre que le précédent — la gravité tragique élégante : le ii-V mineur est LA cadence du film noir, m09-l03 avait sa boucle, voici sa cadence).

### 2. Le catalogue des variantes (la déclinaison complète)

| Variante | Mécanique | Usage |
|---|---|---|
| **Le tronqué** | ii–V sans son I (la résolution escamotée : le ii-V suivant enchaîne) | la circulation perpétuelle des standards — la dette jamais soldée, toujours refinancée |
| **L'enchaîné descendant** | les ii-V qui tombent par tons ou demi-tons (Em7-A7 / Dm7-G7 / Cmaj7) | la séquence-reine des grilles (m02-l03 : la séquence, version harmonique) |
| **Le substitué** | le V remplacé par son subV (Dm7–D♭7–Cmaj7 : la basse chromatique) — m01-l20 en habitat natif | le couloir (et le ii peut se substituer aussi : A♭m7–D♭7–Cmaj7, le ii-V entier tritonisé) |
| **Le back-door** | ♭VII7 → I (B♭7 → Cmaj7) : la « dominante de la porte arrière » — l'emprunt de m01-l21 (♭VII) devenu cadence | la résolution douce-nostalgique, sans sensible |
| **Le turnaround** | I–vi–ii–V (ou iii–VI7–ii–V) : la boucle de fin de section qui relance le début | LA cheville des formes AABA — tag `turnaround` |

### 3. La pensée en cibles (ce que le ii-V-I fait à la ligne)

Le ii-V-I n'est pas qu'une affaire d'accords : c'est une **rampe de lancement mélodique** — la ligne qui le traverse vise les guide tones aux changements (m02-e29 l'a fait sentir) et la leçon 6 en fera un système (chord-scale). Retiens dès maintenant la cible d'or : **la 3 du I** — la note d'arrivée canonique de tout ii-V-I (le mi sur Cmaj7 : l'atterrissage qui dit « majeur, arrivé, lumineux »), et son chemin royal : la 7 du V descend dessus d'un demi-ton (F→E : le toboggan, toujours lui).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Penser accord par accord | la ligne qui redémarre à chaque mesure | l'unité est le ii-V-I : une phrase par cellule, la cible au bout |
| Le ii-V mineur avec le V naturel | le mineur qui sonne majeur au pire moment | l'altéré vers le mineur — les deux gammes de m03-l09 sont là pour ça |
| Le turnaround oublié | la forme qui s'arrête au lieu de reboucler | I–vi–ii–V : la boucle est une pièce de la forme |
| Substituer partout | le couloir permanent (m01-l20 : la leçon tient) | une substitution par passage — la porte reste la norme |

### La mission (m08-e03, HARMONY_PROGRESSION)

La tournée des formes : 16 mesures qui enchaînent — un ii-V-I majeur (rootless, l02), un mineur (altéré vérifié), une chaîne de ii-V tronqués descendante (≥ 2 maillons), un back-door, un turnaround final (tags à l'appui). Voicings en zone, smoothness surveillée. Le rapport nomme chaque cellule : la grille lue comme le jazzman la lit — en unités, pas en accords.

- [ ] Deux formes de base : le majeur qui arrive, le mineur qui tombe
- [ ] Le catalogue : tronqué, enchaîné, substitué, back-door, turnaround
- [ ] L'unité de pensée est la cellule — et la cible d'or est la 3 du I
- [ ] 80 % d'un standard est du ii-V-I déguisé : apprends à le voir

<QuizBlock id="m08-l03-quiz" questions={5} />
<LessonFooter exercises={["m08-e03-the-mother-cell"]} />

---

## 54.5 État d'ouverture du module

| Module 8 | Statut |
|---|---|
| Fondations | le contrat d'honnêteté (le jazz écrit, la frontière de l'impro dite), le terrain acquis inventorié, 4 extensions moteur actées (`swingRatio`/`swingTarget`, les idiomes, `chordScaleCheck`, les grilles étendues) |
| l01–l03 | ✅ **3/15** — le temps (le swing en trois strates), la main (shells/rootless), la cellule-mère (ii-V-I en catalogue complet) |
| Fil rouge | la récolte systématique : chaque acquis de M1/M3/M4 retrouve son habitat natal (le toboggan→la main, la seconde galaxie→le ii-V mineur, le subV→la grille) — le module confirme la thèse de §54.1 : le jazz était déjà partout dans le cursus |
| Prochain lot | l04–l06 : le blues (la forme-mère, ses 12 mesures et sa gamme), la walking bass (la 3e espèce du jazz — la promesse de m04-l04 tenue), et le chord-scale system (la contrainte reine `chordScaleCheck` en service) |

---

**Point de confirmation.** Le Module 8 est ouvert sur son socle temps-main-cellule. Je poursuis avec le **lot l04–l06** — le blues (la forme de 12 mesures, la gamme blues et la blue note, le blues mineur et le jazz-blues enrichi), la walking bass (les quatre noires qui portent tout : cibles, approches, la 3e espèce de m04 en habitat swing), et les gammes d'accords (le chord-scale system : quelle gamme sur quel accord — la carte complète qui arme le solo écrit) ?