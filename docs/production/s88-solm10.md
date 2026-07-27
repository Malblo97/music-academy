# SECTION 88 — LES ÉTALONS M10 EN JSON : §76 RENDU EXÉCUTABLE (15 fichiers + 6 findings)

## 88.0 Méthode — matérialiser n'est pas re-livrer

Les 15 étalons M10 ont été **décidés** en §76 (et comptés : ils sont dans les 183 d'alors, donc dans les 191 d'aujourd'hui). Ce lot ne les livre pas une seconde fois : il les **écrit en données**, dans la forme que le verrou CI n°2 polymorphe (F-48) doit pouvoir exécuter. Le compteur de solutions ne bouge donc pas — c'est volontaire, et c'est la règle : *un étalon décidé en prose n'est pas un étalon, c'est une intention*.

Le protocole de M9 s'applique tel quel : **findings d'abord**, valeurs chiffrées contrôlées à la main (ici : arithmétique de tempo, de ticks et de timecode plutôt que voice leading), `authorNotes` sur chaque piège.

Et le constat, prévisible mais net : **écrire le JSON a produit six findings que la prose de §76 ne pouvait pas produire**. Trois d'entre eux sont des *chiffres manquants* (deux assets décrits mais non notés, une loi de conversion non spécifiée), un est une *erreur arithmétique* dans un manifeste épinglé, un est une *erreur de calibrage* dans un témoin déjà déclaré conforme, un est un *prérequis de schéma* du verrou lui-même. Aucun n'était visible sans compter.

Livrable : `m10-etalons.json` — un bundle de 15 entrées ; `content-sync` écrit chacune dans `test/solutions/m10/<exerciseId>.json`.

---

## 88.1 Le schéma de fichier — les deux branches du verrou

```
{ exerciseId, kind: "DAW_MISSION", mode, ciBranch, payload, expected, authorNotes }
```

| Branche (F-48) | `payload` porte | `expected` porte |
|---|---|---|
| `checklist-lint` (déclaratif / guidé) | `checklistRef: [{id, expect}]` — **des IDs et des attendus chiffrés, jamais le texte** (le texte canonique vit dans l'exercice : F-60) | `lint: {steps, hintCoverage, idsStable}` + les cibles chiffrées du métier (−10 dB, −1 dB, 48/24, 5 min/10) |
| `proof-witness` (PROUVÉ) | `witness: {ppq, meter, tempoPlan[], tracks[{notation, humanize, quantize, dyn[], mute}], pipeline}` | **la valeur mesurée en face de chaque valeur requise**, checker par checker |

Deux conséquences de forme, adoptées ici :

1. **Un étalon de checklist ne recopie pas la consigne.** Il porte `{id, expect}` : l'ID rend le lint stable, l'`expect` rend le `verifyHint` falsifiable. Recopier le texte aurait créé une seconde source de vérité — la faute exacte que F-36 a corrigée sur les assets.
2. **Un étalon PROUVÉ affiche `required` ET `measured`.** Un étalon qui dit seulement « ça passe » n'est pas un test de régression : c'est une promesse. Les 8 volets prouvés du lot portent 31 couples requis/mesuré.

---

## 88.2 Findings de calibrage (à traiter avant le merge)

**F-57 — Le manifeste de « La Remise » : H2 tombe hors de l'asset, et l'origine du temps n'est pas déclarée (erratum + extension, famille F-36).**
Le manifeste (F-36, repris en §86.4) place `H2` à **1'34"** — soit 94 s — sur un asset de **90 s**. Impossible d'écrire la table de markers sans buter dessus. Deux lectures possibles (l'image ne commence pas à zéro / la valeur est fausse), et **le manifeste ne permet pas de trancher** : il ne porte ni `frameRate`, ni `startTimecode`, ni `durationSec`. Or l'identité canonique « B2 = mes. 26 t1 à ♩=96,8 » n'est vraie que si l'origine est zéro (25 × 2,4793 s = 61,98 s ✓) : l'origine EST zéro, donc H2 est un erratum.
*Patch* : le manifeste gagne `frameRate: 24`, `startTimecode: "00:00:00:00"`, `durationSec: 90` ; **H2 est corrigé à 1'26"** (le regard caméra, 4 s avant la fin — la place dramaturgique que le brief lui donne) ; l'`OUT` est chiffré à 1'29"05. Rappel exécutoire de F-36 au passage : les specs d'e12 et e15 portent **encore** le timecode brut `1:02.0` pour le hit de la porte (c'est le timecode de B2) — la réindexation par IDs annoncée en §71.1 n'a jamais été appliquée au JSON publié en §23.3. Les étalons référencent `hitRef: "H1"`, résolu au seed depuis le manifeste. +fixtures (TC→offset, offset→TC, marker hors durée → erreur de seed).

**F-58 — Deux assets-notation ne sont chiffrés qu'en prose (blocage de témoin, famille F-49).**
Un volet PROUVÉ compare un MIDI à une référence. Deux références n'existaient qu'en mots : (1) `m10-e05-phrase` — « une ligne de 8 mesures qui alterne legato / staccato / pizz / tremolo » ; (2) `fredon-target` — F-49 chiffre **4 mesures** et écrit « ×2 varié ». Dans les deux cas, `pitchSequenceMatch` et `pitchSequenceTolerance` comparaient à un fantôme.
*Patch* : les deux notations sont **chiffrées dans ce lot** (§88.4) et versées au manifeste ; la PR de l'asset (PDF de mission, prise vocale) cite la notation, jamais l'inverse. Règle générale actée : *aucune spec ne peut invoquer `pitchSequence*` contre une référence non notée* — test de complétude ajouté au verrou n°1 (toute référence de checker doit résoudre vers une notation existante).

**F-59 — La force d'Iterative Quantize : déplacement ou résidu ? (précision de sémantique + recalibrage du témoin e03).**
`quantizeProfilePlan` d'e03 exige un résidu dans `[8, 60]` ticks pour la piste jouée. §76 déclarait le témoin conforme avec `humanize {seed 11, ±14}` puis « itération ×0.6 ». Dans Cubase, une force de 60 % **rapproche** de 60 % : le résidu est de 40 % de l'écart, soit **5,6 ticks** — sous le plancher de 8. Le témoin échouait à son propre checker, et personne ne pouvait le voir sans faire la multiplication.
*Patch* : (1) la sémantique est normative — `strength` = fraction du chemin parcouru vers la grille, `résidu = (1 − strength) × écart` ; (2) le témoin est recalibré : `humanize {seed: 11, offsetTicks: 60}` (± 75 ms à ♩=100, un jeu au clavier plausible) → résidu **moyen 12 ticks, max 24** ✓ dans la fenêtre. Le chiffre de *sortie* de §76 (profil `quantizeInfo` 0,63) était juste ; son chiffre d'*entrée* ne l'était pas. +4 fixtures (dur, iteratif 0,6, iteratif 0,9, humanisé non quantisé).

**F-60 — `stepId` obligatoire dans `mission.checklist` (prérequis du lint F-48).**
F-48 exige « des IDs d'étapes stables » — mais aucune des 15 specs ne porte d'ID : les étapes sont des chaînes dans un tableau. Conséquence silencieuse : insérer une étape en cours de route décale tout, et un étalon qui référence « l'étape 7 » devient faux sans qu'aucun test ne rougisse.
*Patch* : `checklist[].id` obligatoire, format `e{NN}-s{N}` (ou `e15-p{N}-s{N}` pour le tri-parts), **immuable** — même règle que les IDs d'exercices ; le lint compare des ensembles d'IDs, plus des positions. Migration : 137 étapes à identifier sur les 15 missions (mécanique, une passe de `content-sync`).

**F-61 — `derivedFrom` + `injections[]` : le témoin dérivé se génère, il ne se stocke pas (extension de schéma).**
Le témoin d'e09 est *l'export d'e03, sali de trois notes fantômes, puis nettoyé*. Stocké comme fichier, il se désynchronise au premier tick que bouge le témoin e03 — et la CI restera verte en comparant deux choses fausses ensemble.
*Patch* : le fichier d'étalon déclare `derivedFrom` + `injections: [{type, track, bar, tickInBar, pitch, velocity, durTicks}]` + `pipeline` + `seed` ; la CI **fabrique** le fichier sali, applique la macro, puis assert. Les trois injections du lot sont posées au bord du filtre (vel. 9–13 < 15 ; durées 12–22 ticks < 30) : le preset doit attraper celles-là, et `samePitchSequenceAsSubmission = 1.0` prouve qu'il n'attrape que celles-là. +5 fixtures.

**F-62 — La loi `dyn[] → CC` (déterminisme des témoins d'expression — jumeau de F-39 et F-55).**
§76 annonce que le flux CC1 du témoin e04 est « généré depuis `dyn[]` ». Mais aucune loi ne dit *comment* : à quelle résolution, avec quelle interpolation, avec quelle forme d'arche par note. Sans elle, `ccCoverage: 0.94`, `ccPerNoteVariance: 11` et surtout `ccTensionCorrelation: 0.66` ne sont pas des mesures — ce sont des souvenirs, différents sur chaque machine.
*Patch* : `dynToCc: {cc, resolutionTicks: 40, interp: "cosine", perNoteArch: {appliesToNotesLongerThanBeats, shape, peakAt, depth}, phraseArch: {peak, target, floor}}`, compilé par une **fonction pure** de l'engine (même statut que le rendu de `humanize`, F-35). Deux couches déclaratives = les deux passes de molette de la leçon. Le témoin devient reproductible au bit, et M7 y gagne le chemin retour (`dyn[]` → CC pour l'écoute ▶).

---

## 88.3 Table de calibrage des 15 étalons

| # | Branche | Ce que le fichier porte | Chiffres vérifiés |
|---|---|---|---|
| **e01** | lint | 9 IDs + 9 attendus | 48/24 · Auto Save 5/10 · 4 pistes rôle-first · 2 `.cpr` |
| **e02** | lint + témoin | 12 IDs + témoin « banal » 8 mes. | 27 notes ≥ 8 · round-trip `parseNotation ≡ renderNotation` |
| **e03** | témoin ×2 pistes | s18 au crayon / s21 joué | écart max **0** tick vs moyen **12**, max 24 ∈ [8,60] · profils 1,00 / 0,63 |
| **e04** | témoin + `dyn[]` | 15 points de dynamique → CC1 (F-62) | couverture **0,94** ≥ 0,9 · variance **11** ≥ 8 · corrélation **0,66** ≥ 0,5 |
| **e05** | lint + témoin | 9 IDs + la phrase chiffrée (F-58) | note la plus grave **A3 (57)** ≫ G2 (43) · staccato **0,42** ≤ 0,5 · legato **+18** ticks |
| **e06** | lint | 8 IDs | 5 presets · 10 ★★★★★ sur ≥ 3 tags-moods **du registre M2/M9** |
| **e07** | lint + topologie | 10 IDs + le graphe de bus | 4 GRP familles → GRP Orchestra · GRP Synths hors somme · 3 FX |
| **e08** | lint | 6 IDs, l'ORDRE étant le contenu | −10 dB piste · −6 dB tutti · −1 dB limiteur · le mono en pivot |
| **e09** | lint + témoin dérivé | 8 IDs + 3 injections (F-61) | min **240** ticks ≥ 30 · 0 chevauchement · séquence **1,00** |
| **e10** | lint | 6 IDs | jauge avant/après chiffrée · réversibilité prouvée · Render DRY source gardée |
| **e11** | témoin (tempo seul) | 8 événements de `tempoPlan` (F-55) | rit. **−11 %** ∈ [8,15] · rubato **2,2** BPM ∈ [1,5] · a tempo mes. 17 · **notes identiques** |
| **e12** | lint + table | 12 IDs + les 7 markers + la carte tempo | écart max **0,149 s** ≤ 1,0 · H1 à **2 ms** (1 tick) de la porte |
| **e13** | témoin | `fredon-target` 8 mes. (F-58) + 4 corrections | **25/26 = 0,962** ≥ 0,90 · 1 divergence documentée |
| **e14** | lint + gabarit | 11 IDs + `notes.txt` rempli | WAV 24/48 · ≤ −1 dB · 3 stems · test de la somme |
| **e15** | tri-parts | CSV + témoin 36 mes., 9 pistes + colis | 4 occurrences de motif ≥ 3 · tension croissante r=**0,91** sur 0'31"→1'02" · CC **0,91**/**9** · **hitAlignment 1 tick** · fin non résolue ✓ |

---

## 88.4 Les trois chiffrages que ce lot ajoute au corpus

**1. `fredon-target`, les 8 mesures (F-58).** Ré mineur, 26 notes ; mes. 1–4 = F-49 verbatim ; mes. 5–8 = la même tête, la réponse ouverte à la sixte (`Bb4`) et la descente qui ferme sur la tonique au lieu de tomber à la quinte grave.
```
D4:q F4:q E4:q D4:q | A4:h  G4:q F4:q | E4:q F4:q D4:h | C4:q D4:q A3:h |
D4:q F4:q E4:q D4:q | Bb4:h A4:q G4:q | F4:q G4:q E4:h | D4:q C4:q D4:h
```
La prise vocale chantera **celles-là**, avec les défauts spécifiés (2 octaves fausses mes. 3 et 6, un segment doublé mes. 5, tempo flottant ±8 %) — et c'est cette phrase que le cue de e15 déploie en thème-mémoire : le réal fredonne, l'élève extrait, l'orchestre le déploie.

**2. `m10-e05-phrase`, la ligne aux quatre articulations (F-58).** La mineur, celli, 8 mesures, registre **A3–F4** — quatorze demi-tons au-dessus du seuil G2 du test anti-keyswitch, pour qu'un échec ne puisse venir que d'un keyswitch réellement joué :
```
A3:h C4:h | B3:h. A3:q | E4:q E4:q F4:q E4:q | A3:q C4:q E4:q C4:q |
D4:q F4:q E4:q D4:q | C4:w | B3:h D4:h | C4:h A3:h
  legato        legato        staccato              pizz
  pizz          tremolo       legato                legato
```

**3. La carte tempo de « La Remise » (e12 et e15).** La découverte arithmétique du lot : **♩=96,8 cale B2 mais laisse H1 nulle part** (68,0 s = 27,4 mesures). Un tempo constant ne peut pas tenir les deux ancrages du manifeste — il faut un second geste, et le plus musical est métrique :

| Section | Mesures | Métrique | Tempo | Ancrage tenu |
|---|---|---|---|---|
| 1 | 1–25 | 4/4 | ♩=96,8 | **B2** = mes. 26 t1 → 61,98 s (cible 1'02") |
| 2 | 26–27 | **5/4** | ♩=99,7 | **H1** = mes. 28 t1 → 68,002 s (cible 1'08", écart **2 ms**) |
| 3 | 28–36 | 4/4 | ♩=93,3 | **H2** = mes. 35 t1 → 86,008 s · **B3** = mes. 33 t3 → 82,15 s |

+2,9 BPM que personne n'entend, deux mesures à 5/4 que tout le monde ressent : la « méthode manuelle » de l12 conduite jusqu'à son terme, et l'extension métrique que la spec d'e15 autorise explicitement. L'argument dramaturgique tombe juste : **la mesure s'allonge au moment où le personnage trouve l'objet**, et la porte claque sur le temps 1 de la mesure suivante. B1 (bascule) se cale sur un temps (mes. 13 t3, écart 8 ms), pas sur une barre — *un hit est un rendez-vous, une bascule est une zone*.

---

## 88.5 Bilan du lot

| Livré | **15 fichiers d'étalon en JSON** (`m10-etalons.json` → `test/solutions/m10/*.json`) : 4 checklists pures, 3 guidées pures, **8 avec volet PROUVÉ** — 31 couples `required`/`measured` |
|---|---|
| Findings | **F-57** (manifeste : H2 hors durée + origine du temps ; F-36 jamais appliqué au JSON d'e12/e15), **F-58** (deux assets-notation non chiffrés — bloquants pour deux témoins), **F-59** (sémantique d'Iterative Quantize + recalibrage du témoin e03, qui échouait à son propre checker), **F-60** (`stepId` — prérequis du lint F-48), **F-61** (`derivedFrom`/`injections[]`), **F-62** (loi `dyn[] → CC`) |
| Ordre des PR | **F-60 + F-58 d'abord** (sans IDs, aucun lint ne tient ; sans notations, deux témoins ne compilent pas), puis **F-59 + F-62** (les deux corrections de témoin), puis **F-57** (manifeste + réindexation d'e12/e15), puis **F-61** (CI), puis les 15 fichiers |
| Constat de méthode | ~15–20 min/étalon, dont **la moitié en arithmétique** : ticks de résidu, secondes de timecode, barres de tempo. Zéro composition neuve hors les deux assets chiffrés — le module consomme ses acquis, comme annoncé. Mais le rendement en findings est le plus élevé du projet à ce jour (**6 pour 15 fichiers, 0 note composée**) : écrire un chiffre force à le calculer, écrire une prose ne force rien |
| Écart de comptage relevé | §23.3 annonçait « 6 missions avec volet prouvé » ; il y en a **8** (e02 et e15 n'y étaient pas rangés — cible libre et capstone). Le verrou doit exécuter les huit : correction de comptage, pas de contenu |
| État M10 | **15/15 ✅ exécutables** — le module était clos côté décision (§76), il l'est désormais côté données |
| Cumul projet | **191 solutions/étalons** (inchangé : les 15 étaient déjà comptés) · **62 findings** |

**Ce que ce lot prouve.** Trois des six findings sont des chiffres qui manquaient, deux sont des chiffres qui étaient faux, un est le prérequis qui rendait les cinq autres indétectables. Aucun n'exigeait d'oreille : ils exigeaient une multiplication (5,6 < 8), une division (68,0 / 2,4793) et une soustraction (94 > 90). La leçon de production est la même que celle du verrou n°2 lui-même : **tant qu'un étalon n'est pas écrit en données, il ne prouve rien — et ce qu'il ne prouve pas, il le cache.**