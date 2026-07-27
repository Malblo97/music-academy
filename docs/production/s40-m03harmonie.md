# SECTION 40 — MODULE 3 : HARMONIE AVANCÉE — OUVERTURE

## 40.1 Positionnement — et l'honnêteté qui structure le module

Le Module 1 t'a donné **une** grammaire : l'harmonie fonctionnelle (T-S-D, l'aimant de la dominante). Elle est majoritaire, pas universelle — et la musique de film moderne passe son temps à en sortir : l'impressionnisme flotte, l'horreur symétrise, la fantasy modalise, le drame contemporain empile des quartes. Ce module cartographie **trois systèmes harmoniques** et t'apprend à circuler entre eux :

```
SYSTÈME 1 — LE FONCTIONNEL ÉTENDU (leçons 2–7)
  la grammaire de M1 poussée à ses frontières : napolitain, sixtes
  augmentées, enharmonie, médiantes systématisées — le romantisme
  tardif : la fonction étirée jusqu'à la rupture
SYSTÈME 2 — LE MODAL (leçons 8–10)
  la gravité sans aimant : chaque mode harmonisé comme un monde,
  le pandiatonisme — la fantasy, le folk, le sacré
SYSTÈME 3 — LE NON-FONCTIONNEL (leçons 11–16)
  la couleur comme seule loi : gammes symétriques, quartes, planing,
  clusters, polyaccords — l'impressionnisme, l'horreur, la SF
+ LA SYNTHÈSE (17–18) : la tension sans dominante, et le capstone
  tri-palettes
```

**Extensions moteur actées à l'ouverture** (même méthode que `sd.*` en §35.1 — les leçons détaillent, voici le contrat) :

| Extension | Contenu |
|---|---|
| `detectCollection()` | nouveau détecteur de *collections* : pentatonique, tons entiers, octatonique, chromatique, diatonique — par couverture pondérée de pitch-classes (le cousin de `estimateKey`, sans hypothèse de tonique) ; alimente les leçons 11–12 et `requireCollection` |
| Idiomes tagués | napolitain, sixtes augmentées, quartal voicing, polychord — détectés par **pitch-classes + basse + résolution** (pas de nouvelles formes au dictionnaire : l'enharmonie F-6 a montré la voie — c'est le *comportement* qui distingue Ger6 de subV7, voir l03) |
| Poids par système | en profil non-fonctionnel, `harmony.retrogression` et `harmony.unresolved-seventh` → 0 (il n'y a plus de rétrogradation là où il n'y a plus de fonction) ; les quintes parallèles deviennent craft positif en planing (l14) — la matrice §7.8 gagne 2 profils : `impressionist`, `modern-horror` |
| Contraintes nouvelles | `requireCollection`, `requireIdiom` (napolitain/aug6/quartal…), `planingCheck`, `forbidFunctionalCadence` (l'inverse exact de `requiredCadence` : le garde-fou des systèmes 2–3) |

Prérequis : Module 1 complet (niveau ≥ 8). Les 18 leçons :

| # | Titre | Système | min |
|---|---|---|---|
| 1 | La carte au-delà de la fonction | — | 20 |
| 2 | Le napolitain : l'ombre solennelle | 1 | 25 |
| 3 | Les sixtes augmentées : le coin qui force la porte | 1 | 30 |
| 4 | Le dim7 pivot : l'accord aux quatre visages | 1 | 25 |
| 5 | La modulation enharmonique : les passages secrets | 1 | 30 |
| 6 | Les médiantes systématisées : la table des huit mondes | 1 | 25 |
| 7 | La pédale avancée : l'harmonie qui frotte le sol | 1 | 20 |
| 8 | Harmoniser les modes : sept mondes, sept grammaires | 2 | 30 |
| 9 | Les modes du mineur mélodique : la seconde galaxie | 2 | 25 |
| 10 | Le pandiatonisme : la fonction dissoute | 2 | 20 |
| 11 | La gamme par tons : l'apesanteur | 3 | 25 |
| 12 | L'octatonique : la symétrie qui menace | 3 | 30 |
| 13 | L'harmonie quartale : la verticalité moderne | 3 | 25 |
| 14 | Le planing : le bloc qui glisse | 3 | 25 |
| 15 | Clusters et secondes : la densité comme couleur | 3 | 20 |
| 16 | Polyaccords et polytonalité : deux mondes superposés | 3 | 25 |
| 17 | La tension sans dominante | synthèse | 25 |
| 18 | Synthèse : trois palettes, trois pièces | capstone | 40 |

---

## 40.2 LEÇON m03-l01 — « La carte au-delà de la fonction »

```mdx
---
id: m03-l01-carte
module: module-03-harmonie-avancee
title: "La carte au-delà de la fonction"
estMinutes: 20
skills: { harmony: 1.0 }
---
```

### Pourquoi il existe plusieurs harmonies

Souviens-toi du moteur de M1 : la tension qui veut sa résolution, la dominante aimantée vers sa tonique (l14–l15). Ce moteur est une *convention* — trois siècles de musique européenne l'ont câblé dans nos oreilles — mais il n'est pas la seule façon d'organiser des accords. Deux autres logiques existent, et le cinéma les emploie quotidiennement :

| Système | Le moteur | Ce que l'oreille suit | L'analogie |
|---|---|---|---|
| **Fonctionnel** | l'attraction (T-S-D, la dette et son remboursement) | *où ça va* | le récit : intrigue → climax → dénouement |
| **Modal** | la gravité sans attraction : un centre, pas d'aimant — la tonique est un *lieu*, pas une destination | *où l'on est* | le paysage : on l'habite, on ne le traverse pas |
| **Non-fonctionnel** | la couleur et le geste : les accords valent par leur sonorité et leur enchaînement sensoriel, pas par leur rôle | *ce que ça fait* | la peinture : la touche, pas l'histoire |

### 1. Le test des trois questions

Devant n'importe quelle harmonie — la tienne ou celle d'un maître — trois questions la classent :

```
1. Y a-t-il une SENSIBLE qui tire ? (7̂→1̂ actif)      → fonctionnel
2. Y a-t-il un CENTRE sans sensible ? (on revient      → modal
   toujours au même accord, mais rien n'y FORCE)
3. Ni centre ni sensible ? (les accords flottent,      → non-fonctionnel
   la cohérence est ailleurs : une collection, un
   geste, un intervalle fétiche)
```

Et le corollaire de métier : **les systèmes se choisissent par scène, pas par carrière**. Le même cue peut être modal dans l'exposition (le monde), fonctionnel au climax (le récit s'emballe — l'aimant est le meilleur accélérateur qui existe) et non-fonctionnel à la rupture (le monde se défait). Circuler entre les grammaires est LA compétence de ce module — la leçon 17 en fera une méthode.

### 2. Ce que « avancé » veut dire ici (le contrat du module)

Pas « plus compliqué » : **plus de mondes**. Chaque leçon livre un outil avec son territoire dramatique, son mode d'emploi, et — c'est la marque du module — **sa position sur la carte** : le napolitain est du fonctionnel poussé, le quartal est du non-fonctionnel, le lydien ♭7 est un pont. Tu ne collectionnes pas des accords exotiques ; tu apprends trois langues et leurs frontières.

Et l'avertissement d'entrée, qui vaut pour les 17 leçons suivantes : **plus un outil est coloré, plus il coûte cher** — la sixte augmentée employée trois fois par pièce est un tic ; l'octatonique en continu est un aquarium. La règle de M1 l22 (« chaque chromatisme s'explique ») devient ici : *chaque système s'assume* — on ne « pimente » pas du fonctionnel avec trois clusters ; on choisit sa grammaire et on la parle.

### 3. Le moteur du produit et les trois systèmes

Le produit te suit sur les trois cartes : les profils de style de tes exercices déclarent le système, et les règles se recalibrent — en profil `impressionist`, la « rétrogradation » n'existe plus (il n'y a pas de sens interdit là où il n'y a pas de sens), les quintes parallèles du planing deviennent une qualité mesurée, et `detectCollection` remplace `estimateKey` comme boussole. La leçon apprise en §7.8 (« une faute dans une grammaire est la norme d'une autre ») cesse d'être un réglage fin : elle devient le sujet.

### Erreurs fréquentes

| Erreur | Correction |
|---|---|
| « Le modal, c'est du fonctionnel sans dominante » | non : c'est une AUTRE écoute — le lieu, pas le trajet ; composer modal avec des réflexes T-S-D donne du fonctionnel anémié |
| Pimenter au lieu de choisir | trois clusters dans une pièce fonctionnelle = trois taches, pas une couleur : le système s'assume |
| L'exotisme comme valeur | l'octatonique ne vaut pas mieux que le I-IV-V : elle vaut AILLEURS |
| Classer par les accords | on classe par le MOTEUR (les trois questions) : le même accord de quartes peut être modal ou non-fonctionnel selon ce qui l'entoure |

- [ ] Trois systèmes, trois moteurs : l'attraction, la gravité, la couleur
- [ ] Le test des trois questions classe toute harmonie
- [ ] Les systèmes se choisissent par scène — circuler est la compétence
- [ ] Plus c'est coloré, plus c'est cher : chaque système s'assume

<QuizBlock id="m03-l01-quiz" questions={5} />
<LessonFooter exercises={["m03-e01-three-motors"]} />

---

## 40.3 LEÇON m03-l02 — « Le napolitain : l'ombre solennelle »

```mdx
---
id: m03-l02-napolitain
module: module-03-harmonie-avancee
title: "Le napolitain : l'ombre solennelle"
estMinutes: 25
skills: { harmony: 1.0 }
---
```

### Pourquoi cet accord a un nom propre

Un accord **majeur** construit sur le **deuxième degré abaissé** (♭II) : en la mineur, un accord de si bémol majeur. Trois siècles d'opéra en ont fait LE signe de la gravité tragique — la sentence, le serment funèbre, la solennité qui écrase. Il mérite son nom propre parce qu'il ne ressemble à rien d'autre : un accord parfaitement consonant, lumineux même (majeur !), qui assombrit tout ce qu'il touche. C'est le paradoxe de l21 M1 (« du majeur, de l'ombre ») poussé d'un cran : l'ombre à UN demi-ton de la tonique.

### 1. La mécanique : d'où vient la ♭2̂

La ♭2̂ est le demi-ton *au-dessus* de la tonique — le voisin d'en haut, le plus instable des degrés (le phrygien de l07 M1 en a fait sa signature ; le thriller de m09-l04 son balancement). Le napolitain l'**harmonise en majeur** : l'instabilité maximale portée par la consonance maximale — d'où l'effet de solennité étrange, ni tension criarde ni repos.

Sa fonction sur la carte (l01) : **sous-dominante fonctionnelle** — il remplace le iv/ii° dans la marche vers la dominante :

```
au lieu de :   iv → V → i        (la cadence mineure standard)
napolitain :   ♭II⁶ → V → i      (la même marche, l'ombre en plus)
```

### 2. La position de sixte : ♭II⁶ (le réglage d'usine)

L'usage classique le met **en premier renversement** (la « sixte napolitaine ») : la basse porte 4̂ — pas ♭2̂. Pourquoi : la basse 4̂ → 5̂ (vers V) est la marche de sous-dominante la plus naturelle qui soit (l12 M1), et la ♭2̂, reléguée dans les voix hautes, y fait son travail de couleur sans déstabiliser le sol. Conduite canonique, à connaître :

<MusicExample id="napolitaine" title="La sixte napolitaine, conduite d'école (la mineur)">
  [A2+E4+A4+C5]:h [D3+F4+Bb4+D5]:h | [E3+E4+G#4+B4]:h~[E3+E4+G#4+B4]:q [E3+D4+G#4+B4]:q | [A2+C4+A4+E4]:w
  i → ♭II⁶ (basse D, la ♭2̂=Bb au soprano) → V(7) → i.
  La voix qui compte : Bb4 → G#4 — la ♭2̂ PLONGE d'une tierce diminuée
  vers la sensible (le seul saut de tierce diminuée légal du répertoire :
  il EST la signature du napolitain). Joue, puis rejoue avec un Dm à la
  place : la solennité s'évapore, il ne reste que la grammaire.
</MusicExample>

Trois règles de conduite (que l'analyseur connaît — idiome tagué `neapolitan`, vérifié par pitch-classes + basse 4̂ + résolution vers V) :

- la ♭2̂ descend vers la sensible (♭2̂ → 7̂, la tierce diminuée) ou vers 1̂ en passant ;
- on double **la basse** (4̂ — la tierce de l'accord), jamais la ♭2̂ (une ♭2̂ doublée = deux résolutions obligées : l'embouteillage, même logique que la sensible doublée de l20... de §7.4) ;
- il précède V (éventuellement via i6/4 cadentiel : ♭II⁶ → i6/4 → V → i, la version cérémonie).

### 3. En position fondamentale : le napolitain de cinéma

L'usage moderne s'affranchit du renversement : **♭II en position fondamentale, en bloc** — la basse tombe d'un demi-ton (♭2̂ → 1̂) et l'accord devient un événement de *bascule* plus que de cadence : le monde glisse d'un cran vers le bas. C'est le napolitain des scores sombres contemporains : i → ♭II → i en balancement (le thriller de m09-l04 §1 harmonisé — son balancement mélodique 1̂–♭2̂ avait donc un accord de famille), ou ♭II comme accord d'arrivée d'une phrase qui devait finir sur i (la déception d'un demi-ton : plus sombre que la cadence rompue).

### 4. Le cousin caché : ♭II et subV (la retrouvaille)

Tu connais déjà un accord sur ♭2̂ : le **subV7** de l20 M1 (D♭7 → C). La parenté est réelle — même fondamentale — et la différence est nette :

| | ♭II (napolitain) | subV7 (tritonique) |
|---|---|---|
| Nature | triade majeure (pas de 7e) | accord de dominante (le triton à bord) |
| Fonction | SOUS-dominante : il va vers V | DOMINANTE : il va vers I |
| Monde | le drame classique, la solennité | le jazz, le couloir chromatique |

Le même endroit de la gamme, deux métiers — et l'analyseur les distingue exactement ainsi : la présence de la 7e et la cible de résolution. Ajouter une 7e à ton napolitain le fait changer de siècle : c'est parfois exactement le geste voulu (le drame qui glisse vers le noir).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| La ♭2̂ doublée | deux voix qui plongent en parallèle | doubler la basse (4̂) |
| La ♭2̂ qui monte | la signature effacée | ♭2̂ → 7̂ (la tierce diminuée assumée) ou → 1̂ |
| Le napolitain toutes les quatre mesures | la solennité devenue tic | UN par pièce en fonctionnel — c'est un événement |
| ♭II confondu avec subV | l'analyse fausse, la conduite bancale | la 7e et la cible : sous-dominante vs dominante |

### La mission (m03-e02, HARMONY_PROGRESSION)

8 mesures en ré mineur : une phrase qui installe i–iv–V–i (la norme d'abord, l01 §2), puis sa reprise où le iv devient **♭II⁶** conduit dans les règles (tierce diminuée au soprano ou à l'alto, doublure de basse), cadence parfaite finale. `requireIdiom: ["neapolitan"]`, conduite vérifiée voix à voix.

- [ ] ♭II majeur : l'instabilité maximale portée par la consonance maximale
- [ ] ♭II⁶ : basse 4̂, ♭2̂ qui plonge en tierce diminuée, doublure de basse
- [ ] En fondamentale : la bascule d'un demi-ton — le napolitain de cinéma
- [ ] ♭II va vers V ; subV va vers I — même adresse, deux métiers

<QuizBlock id="m03-l02-quiz" questions={5} />
<LessonFooter exercises={["m03-e02-solemn-shadow"]} />

---

## 40.4 LEÇON m03-l03 — « Les sixtes augmentées : le coin qui force la porte »

```mdx
---
id: m03-l03-sixtes-augmentees
module: module-03-harmonie-avancee
title: "Les sixtes augmentées : le coin qui force la porte"
estMinutes: 30
skills: { harmony: 1.0 }
---
```

### Pourquoi un intervalle a engendré une famille d'accords

Prends la dominante en la mineur : E. Deux notes veulent y aller de toutes leurs forces : **F (♭6̂), le demi-ton d'en haut**, et **D♯ (♯4̂), le demi-ton d'en bas**. Fais-les sonner ENSEMBLE — F à la basse, D♯ dans l'aigu : l'intervalle de **sixte augmentée**, un coin enfoncé dans la porte du V, qui s'ouvre en s'écartant : F descend, D♯ monte, les deux atterrissent sur E à l'octave. C'est la double sensible — l'attraction de l14 M1, mais en tenaille : la résolution la plus inévitable de toute l'harmonie fonctionnelle.

<MusicExample id="le-coin" title="Le coin nu, puis habillé (la mineur)">
  A) [F3+D#5]:h [E3+E5]:h                      — l'intervalle seul : la tenaille
  B) [F3+A3+C4+D#5]:h [E3+G#3+B3+E5]:h | [A2+A3+C4+E5]:w
     — habillé (version allemande, §2) → V → i : la porte forcée, puis franchie
</MusicExample>

### 1. Les trois nationalités (le folklore des noms, la réalité des notes)

Le coin (♭6̂ + ♯4̂) s'habille de deux ou trois notes intérieures — trois recettes, trois noms hérités (aucun rapport réel avec les pays, mais tout le monde les emploie) :

| Accord | Notes (en la mineur, basse F) | L'intérieur | Couleur |
|---|---|---|---|
| **Italienne** (It⁶) | F–A–D♯ | 1̂ seul (doublé) | la plus maigre, la plus perçante |
| **Française** (Fr⁶) | F–A–B–D♯ | 1̂ + 2̂ | la plus étrange : DEUX tritons emboîtés — l'aïeule de la gamme par tons (l11 te la rendra) |
| **Allemande** (Ger⁶) | F–A–C–D♯ | 1̂ + ♭3̂ | la plus riche, la plus courante — et la plus piégée (§3) |

Toutes vont à V. Le seul soin de conduite : la Ger⁶ → V en accords directs produit des quintes parallèles (F–C → E–B) — l'école l'évite par le **i6/4 cadentiel intercalé** (Ger⁶ → i6/4 → V : le 64-cérémonie de l12 M1 trouve ici son emploi le plus fréquent), le cinéma les assume souvent (le poids 0.1 d'`epic-film`, §7.8 — tu sais désormais arbitrer).

### 2. Le territoire dramatique

La sixte augmentée est **l'approche de dominante la plus intense du système** — plus que ii, plus que iv, plus que le napolitain : la tenaille annonce que la porte va céder. D'où ses emplois : l'avant-climax (la dernière marche avant le sommet), le pathétique tendu (le romantisme en a fait sa signature d'angoisse noble), et — usage film — **la demi-cadence monumentale** : la phrase qui s'arrête sur Ger⁶ → V et NE résout pas (la dette maximale laissée ouverte : le « à suivre » harmonique).

### 3. La retrouvaille enharmonique : Ger⁶ = un accord de septième déguisé

Écoute une allemande hors contexte : F–A–C–D♯ ≡ F–A–C–**E♭** — **un F7**. Les mêmes pitch-classes exactement (l'insensibilité du moteur à l'orthographe, F-6, cesse d'être un détail technique : elle devient un fait musical majeur). Un seul et même son, deux futurs :

```
F7 entendu comme SUBV7 :  la basse F glisse vers E... — non : subV7 de
                          quoi ? F7 → E : subV de la DOMINANTE ? Reprenons
                          proprement :
F–A–C–E♭ lu en MI♭ :      V7/♭... — la lecture standard :
F7 = V7 de B♭            → il résout sur B♭ (la quinte descendante, l19 M1)
F–A–C–D♯ lu en LA mineur : Ger⁶     → il résout sur E (le coin qui s'écarte)
UN SON, DEUX PORTES DE SORTIE À UN TRITON L'UNE DE L'AUTRE (B♭ vs E).
```

C'est le **passage secret** le plus célèbre de l'harmonie : arriver sur l'accord dans un monde, en sortir dans l'autre — la modulation enharmonique, dont la leçon 5 fera un système. Retiens dès maintenant le principe : *les accords symétriques ou enharmoniques sont des gares de correspondance* — et l'analyseur les tague par leur **résolution réelle** (la cible dit la fonction : c'est exactement ainsi que le moteur distingue Ger⁶ de V7, aucune extension de dictionnaire nécessaire, l'idiome `aug6` est un comportement).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Le coin qui ne s'écarte pas | ♭6̂ ou ♯4̂ quittées par saut : la tenaille désamorcée | ♭6̂→5̂ ET ♯4̂→5̂, toujours — c'est la définition |
| Ger⁶→V direct sans y penser | les quintes (F–C→E–B) | i6/4 intercalé, ou l'assumer EN CONNAISSANCE (profil) |
| La sixte augmentée décorative | l'intensité maximale gaspillée sur une mesure quelconque | l'avant-climax, la demi-cadence monumentale — les grands moments |
| Confondre Ger⁶ et V7 à l'analyse | tout le passage lu de travers | la cible tranche : ½ ton écarté = aug6 ; quinte descendante = V7 |

### La mission (m03-e03, HARMONY_PROGRESSION)

10 mesures en sol mineur, le crescendo d'approche : iv → napolitain (l02 : la révision en acte) → **Ger⁶ → i6/4 → V** → i (l'escalade des sous-dominantes : chaque marche plus tendue), puis la reprise qui s'arrête sur la demi-cadence monumentale (Ger⁶ → V, non résolu, `requiredCadence: "half"`). Conduite du coin vérifiée (♭6̂ et ♯4̂ tracées jusqu'à 5̂), `requireIdiom: ["neapolitan","aug6"]`.

- [ ] Le coin : ♭6̂ + ♯4̂ en tenaille sur 5̂ — la double sensible
- [ ] It/Fr/Ger : trois habillages, une résolution ; la Fr porte deux tritons
- [ ] Territoire : l'avant-climax, la demi-cadence monumentale
- [ ] Ger⁶ ≡ V7 en pitch-classes : la gare de correspondance — la l05 s'annonce

<QuizBlock id="m03-l03-quiz" questions={6} />
<LessonFooter exercises={["m03-e03-the-wedge"]} />

---

## 40.5 État d'ouverture du module

| Module 3 | Statut |
|---|---|
| Fondations | la carte des trois systèmes (le cadre conceptuel du module entier), extensions moteur actées (`detectCollection`, idiomes par comportement, 2 profils, 4 contraintes) |
| l01–l03 | ✅ **3/18** — la carte + les deux premiers outils du fonctionnel étendu (napolitain, sixtes augmentées), avec leurs ponts arrière (subV, phrygien, 64 cadentiel, F-6) et avant (l05 enharmonie, l11 tons entiers) |
| Fil rouge | chaque outil positionné sur la carte, chiffré en coût dramatique, et détecté par comportement plutôt que par dictionnaire — la philosophie moteur de F-6 érigée en méthode |
| Prochain lot | l04–l06 : le dim7 aux quatre visages, la modulation enharmonique (les passages secrets systématisés), les médiantes en table des huit mondes |

---

**Point de confirmation.** Le Module 3 est ouvert : la carte, et le romantisme tardif est entamé. Je poursuis avec le **lot l04–l06** — le dim7 pivot (l'accord symétrique aux quatre résolutions, la deuxième gare de correspondance), la modulation enharmonique (où Ger⁶/V7 et dim7 deviennent un réseau de passages secrets entre tonalités lointaines), et les médiantes systématisées (la table complète des huit mondes à une tierce, qui achève ce que l24 M1 avait ouvert) ?