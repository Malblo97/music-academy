# Verrou n°2 — journal de calibrage (S5–S6)

Ce fichier **est** la preuve de calibrage du moteur. Une ligne par rouge résolu :
l'identifiant, le diagnostic, le correctif. Rien n'y entre sans avoir été
diagnostiqué d'abord — et aucun seuil n'y est baissé pour faire passer une pièce.

**Périmètre** : M1 (27 solutions) + M2 (28) + M3 (31) = **86 fichiers**.
Le Guide annonce 87 (M2 : 29) ; le corpus extrait en compte 28. L'écart est un
manque de CONTENU, pas de moteur — voir « Reste à faire ».

**Outils** : `pnpm analyze <solution.json>` pour une pièce ;
`pnpm -F @ma/music-core lock2` pour le tableau de bord des 86 (`--all` pour tout
le corpus y compris les verts, `--by-cause` pour le classement des blocages).

---

## État

| Passe | m01 | m02 | m03 | total |
|---|---|---|---|---|
| Première exécution du verrou | 2/27 | 5/28 | 0/31 | **9/86** |
| Passe 1 — A-1 à A-10 | 13/27 | 9/28 | 17/31 | **39 à la note, 33 pleinement verts** |
| Passe 2 — B-1 à B-5 (cadences et tonalité) | 15/27 | 9/28 | 17/31 | **41 à la note, 36 pleinement verts** |
| Passe 3 — C-1 à C-3 (`melody.out-of-key`) | 15/27 | 10/28 | 18/31 | **43 à la note, 38 pleinement verts** |
| Passe 4 — D-1 à D-3 (`melody.climax`) | 17/27 | 10/28 | 20/31 | **47 à la note, 42 pleinement verts** |
| Passe 5 — E-1 (`melody.leap-recovery`) | 17/27 | 11/28 | 20/31 | **48 à la note, 42 pleinement verts** |
| Passe 6 — F-0 à F-5 (périmètre, puis `harmony.*`/`vl.*`) | 15/26 | 9/27 | 18/20 | **42 pleinement verts sur 73 — et 13 pièces sorties du périmètre** |
| Passe 7 — G-1 à G-5 (M2 : phrase, prosodie, motifs) | 15/26 | 13/27 | 18/20 | **46 pleinement verts sur 73** |
| Passe 8 — H-1 à H-12 (le lot B rentre, les tensions se chiffrent) | 20/27 | 21/28 | 27/31 | **68 pleinement verts sur 86** |
| Passe 9 — I-1 à I-6 (M1 requalifié en écriture de clavier) | 24/27 | 21/28 | 27/31 | **72 pleinement verts sur 86** |

À la passe 8, les dénominateurs redeviennent ceux du corpus entier : le lot B
n'est plus hors périmètre (H-1). À la passe 9, **72/86**, 14 rouges.

À la passe 6, les dénominateurs changent : le verrou ne compte plus que le
**lot A**, les pièces dont l'effectif se lit (voir F-0). Le total vert ne bouge
pas — 42 avant, 42 après — mais sa composition, si : quatre pièces qui passaient
sans qu'aucune règle d'harmonie ne leur soit posée sont sorties, quatre pièces
réellement jugées sont entrées. On ne peut pas atteindre 86/86 tant que le lot B
n'a pas de forme de soumission ; le plafond honnête est **73**.

Le verrou pose DEUX conditions par solution : la note ≥ 85 **et** aucune
contrainte non tenue hors performance. Le second chiffre est le seul qui compte
pour le jalon.

La passe 2 a surtout changé la NATURE de ce qui reste : quatre familles de
contraintes ont entièrement disparu de la liste des échecs (`requiredCadence`,
`requiredCadences`, `key`, `mustEndOnDegrees` — 20 échecs cumulés), et les
blocages restants sont désormais concentrés sur quatre règles de conduite et de
mélodie plutôt que dispersés.

**Le verrou n'est pas vert.** Il n'a pas vocation à l'être avant la fin de la
remontée, et le laisser rouge est la seule attitude honnête : un verrou qu'on
neutralise pour livrer ne verrouille plus rien.

---

## Les rouges résolus

Diagnostic selon la nomenclature du tutoriel : **(A)** le code diverge de la spec,
**(B)** la solution extraite est corrompue, **(C)** divergence d'interprétation
réelle — décision au registre avant patch.

### A-1 — les règles de mélodie jugeaient la texture, pas la ligne
*Touchait ~40 solutions à quatre voix.*
`judgedNotes` rend toutes les voix entremêlées par ordre d'attaque. Sur un choral,
`melody.leap-recovery` y voit un « saut de septième non récupéré » à chaque
accord — entre le soprano d'un temps et la basse du suivant — alors qu'aucune
ligne ne saute. Idem pour `contour`, `findMotifs` et `phraseAnalysis`, nourris de
la même soupe.
**Correctif** : `judgedLine(ctx)` / `melodicLine(notes)` (une note par attaque, la
plus aiguë) ; les analyses mélodiques du pipeline lisent la ligne, la tension
continue de lire la texture entière — sa dissonance et sa densité SONT le tout.
`rules/types.ts`, `rules/melody.ts`, `pipeline/evaluate.ts`.

### A-2 — `lengthBars` mesurait l'empan brut, en 4/4 supposé
*12 solutions rouges, dont 9 sans aucun défaut.*
Deux erreurs cumulées : la mesure était toujours de 1920 ticks (faux dès qu'une
spec est en 6/8), et l'empan brut n'est pas le nombre de mesures. Une mélodie qui
finit sur une blanche au 3ᵉ temps de la 8ᵉ mesure mesurait 7,75 ; une note liée
par-dessus la dernière barre (`C4:h~ | C4:e`, m01-s17) en mesurait 4,125 pour une
pièce de quatre mesures.
**Correctif** : `src/meter.ts` — `meterOfSpec` + `barCount`, qui compte **au plus
proche**. Tolérance d'une demi-mesure ; en dessous, la pièce est réellement plus
courte que demandé, et le verrou doit le dire. 9 des 12 résolues ; les 3 autres
sont des manques de contenu (voir « Reste à faire »).

### A-3 — le craft notait 0 ce qui ne s'applique pas
*Premier poste de perte : 12,9 points par solution en moyenne.*
Mon propre code. Trois défauts : `motif-development` MULTIPLIAIT couverture et
variété (un thème énonçant sa cellule quatre fois à l'identique plafonnait à 0,33 ;
moyenne du corpus : 0,31) ; `idioms-used` réclamait deux idiomes de toute
progression, y compris diatonique ; `inversion-variety` exigeait 25 % d'accords
renversés d'un laboratoire de cadences écrit en fondamentale.
**Correctif** : couverture et variété s'additionnent (0,6/0,4) ; `idioms-used` ne
compte que si la consigne parle d'idiomes ou d'enrichissement ; `inversion-variety`
compte les positions DISTINCTES employées, pas un ratio ; une composante sans
objet est retirée de la moyenne au lieu d'être notée zéro. Craft moyen : 0,31 →
0,65 sur le motif, 0,50 → 0,80 sur les positions.

### A-4 — la sensible était signalée à chaque RÉPÉTITION avant sa résolution
*17 occurrences.*
`m01-s34` en est la preuve : ses `authorNotes` écrivent « B3→C4 (sensible ✓) », et
le moteur y voyait deux erreurs — le si est réénoncé sous chaque voicing de
dominante avant de résoudre.
**Correctif** : la sensible se juge sur son DÉPART ; on avance jusqu'à la première
hauteur différente. `analyzers/voiceleading.ts`.

### A-5 — le 7ᵉ degré pris pour une sensible hors contexte fonctionnel (F-66)
*10 occurrences.*
`m01-s26` est un exercice de guide-tones jazz qui module toutes les deux mesures
(F, G, B♭). La tonalité globale estimée faisait passer chaque septième majeure
d'accord pour une sensible non résolue — or rien n'oblige une septième à monter.
C'est exactement le finding **F-66** consigné dans le corpus M9 : « un si qui n'est
ni précédé d'une dominante ni résolu sur la tonique n'est pas une sensible, c'est
la tierce d'un accord ».
**Correctif** : `VoiceLeadingCtx.chords` + `underDominant()` — le 7ᵉ degré n'est
jugé que sous une fonction de dominante. Sans chiffrage transmis, l'ancien
comportement est conservé (on ne désactive pas une règle en silence).

### A-6 — `rhythm.syncopation-target` exigeait de la syncope partout
*Parlait sur 31 solutions, dont 28 sans aucune cible déclarée : des chorals en
rondes et des grilles harmoniques, tous correctement écrits.*
La règle appliquait une fenêtre par défaut universelle [0,05 – 0,5]. Sa propre
`when` dit pourtant : « les fenêtres changent selon le style… la consigne peut la
déclarer ».
**Correctif** : sans cible déclarée, la règle se tait. Il n'existe pas de taux de
syncope juste dans l'absolu, seulement un taux juste POUR une consigne.

### A-7 — les règles d'arche et de thème jugeaient des exercices d'harmonie
*`melody.climax` sur 43 solutions, `melody.no-motif` sur 19, `melody.ending-weak`
sur 27.*
Sur une progression harmonique, la voix supérieure n'est pas un thème : c'est le
produit des accords. Les textes des règles le disaient déjà — « un ostinato, un
tapis, une pédale n'ont pas de climax », « la règle se tait sur un exercice de
conduite pure ».
**Correctif** : deux périmètres explicites dans `rules/melody.ts` —
`hasShapeIntent` (une fenêtre de climax, un contour, un plan de tension ou une
ambiance visée) pour `melody.climax` et `melody.tension-placement` ;
`judgesMelody` (kind mélodique ou contraintes mélodiques déclarées) pour
`no-motif`, `leap-recovery`, `ending-weak`, `phrase-breathing`.

### A-8 — `harmony.tritone-sub-resolution` plantait sur l'exercice de la substitution
*1 exception, sur m01-s38 — précisément la pièce que la règle devait juger.*
`chords.findIndex(...)` rend `-1` quand le tag ne coïncide avec aucun début
d'accord chiffré, et `chords[-1].notes` lève.
**Correctif** : garde `if (at < 0) continue;`.

### A-9 — les issues fines n'étaient rattachées à aucune règle du registre
*6 exceptions.*
`voiceLeadingIssues` produit `vl.direct-perfect` et `vl.mozart-fifths`, qui ne sont
pas enregistrés : `buildFeedback` levait en cherchant leur `pedagogy`.
**Correctif** : `Issue.ownerRuleId` — le diagnostic précis est conservé (« octave
directe » et « quintes parallèles » ne se corrigent pas pareil), la pédagogie et
le poids viennent de la règle porteuse. `runRules` estampille l'attribution.

### A-10 — le registre de contraintes ne couvrait pas M3
*18 solutions en exception.*
L'annexe C avait été ouverte sur M1+M2+M5+M9 (verrou n°1) ; le verrou n°2 étend le
périmètre à M3, dont 42 clés étaient absentes. `checkConstraints` lève sur une clé
inconnue — c'est le bon comportement, et c'est ce qui a rendu le trou visible.
**Correctif** : les 42 clés ajoutées à `CONSTRAINT_SCHEMA`, toutes déclaratives
pour l'instant. Le mode `declared` le dit à chaque exécution : une clé
silencieusement approuvée serait pire qu'une clé absente.

### Compilation des solutions — une décision, pas un correctif
Le tutoriel écrit `notation → {kind:'mono'}`. Appliqué à la lettre, les familles
`harmony.*` et `vl.*` — qui ne s'appliquent qu'aux soumissions à voix — se
taisaient sur les 50 chorals du corpus : le verrou aurait été vert parce qu'on
n'aurait rien demandé. `compileSolution` défait donc les empilements verticaux en
VOIX par registre. Un choral écrit en accords EST à quatre voix ; le compiler
ainsi, c'est lire la solution, pas la contourner.
**Limite assumée** : l'attribution est registrale, pas contrapuntique. Sur un
texte où une voix interne se tait puis rentre, elle peut décaler d'un rang.

---

## Passe 2 — les cadences, puis la tonalité

### B-1 — F-5 ne connaissait qu'une seule frontière de segment
*4 cadences manquantes sur `m01-s30`, le laboratoire de cadences lui-même.*
F-5 n'enregistre une cadence que si l'accord d'arrivée tient une mesure OU
termine un segment. Le pipeline ne passait qu'un `segmentEnd` : la fin de la
pièce. Or `m01-e30` demande quatre cadences en quatre segments de deux mesures
(`segmentBars: 2`), chacune arrivant sur une blanche — trois étaient invisibles,
dont la parfaite, sur l'exercice qui l'enseigne.
**Correctif** : `detectCadences` accepte `segmentEnds[]` ; `segmentEndsOf()`
les dérive de `segmentBars` et de la métrique. `cadence.ts`, `evaluate.ts`.

### B-2 — le repli monophonique F-2 n'était appelé par personne
*4 mélodies sans aucune cadence détectée.*
`monophonicCadence` était écrit dans `cadence.ts` et le pipeline appelait
toujours la voie harmonique — avec une liste d'accords VIDE sur une monodie.
Résultat : `requiredCadence: "perfect"` échouait sur toutes les mélodies.
**Correctif** : le pipeline bascule sur `melodyOnly` quand aucun accord ne se
chiffre. Et le critère d'accent du repli exigeait `start % mesure === 0`,
c'est-à-dire le PREMIER TEMPS — or les quatre mélodies concluent sensible →
tonique au temps 3 ou après une levée. Ce qui fait la conclusion n'est pas la
position absolue mais que l'arrivée soit plus accentuée et au moins aussi longue
que sa préparation (`metricWeight`, m01-l16).

### B-3 — la famille des cadences MODALES n'existait pas
*`modal:♭VII-I`, `modal:II-I`, `modal:♭II-i`, `modal:IV-i` : quatre formules
employées par cinq specs de M3, aucune branche pour les classer.*
`classifyPair` ne connaît que la grammaire fonctionnelle ; en modal il n'y a pas
de dominante pour porter la fonction, donc c'est le CHEMIN qui fait la cadence.
Trois des quatre formules sortaient nulles, la quatrième était lue « plagale ».
**Correctif** : un `CadenceKind` `modal` portant ses `degrees: [pénultième,
arrivée]`, émis quand le mode est exotique et que l'arrivée sur la tonique vient
de ♭II, II, IV ou ♭VII. Le checker sait lire les chiffres romains.

### B-4 — `requiredCadence` faisait doublon avec `finalCadence`
Le checker comparait la DERNIÈRE cadence, alors qu'une clé `finalCadence` existe
séparément et est employée par quatre specs. Les deux doivent dire deux choses
différentes, sinon l'auteur de specs n'a aucun moyen d'écrire « la pièce contient
une cadence parfaite » — ce que demande exactement `m03-e11-weightless`, dont la
parfaite ancre les quatre premières mesures avant l'apesanteur.
**Correctif** : `requiredCadence` vérifie la PRÉSENCE. Les 8 échecs sont soldés.

### B-5 — la tonalité était devinée alors que la consigne la déclare
*6 échecs `key`, et tout ce qui en dépend.*
91 des 97 specs de M1–M3 fixent la tonalité (`given.key` ou `constraints.key`).
`estimateKey` la redécouvrait, et se trompait précisément là où c'est le plus
coûteux : trois confusions de relatif (ré dorien lu la mineur, do majeur lu la
mineur — la bonne collection, le mauvais centre) et trois estimations à
confiance ≤ 0,02. Tonique fausse, tout ce qui raisonne en degrés devient faux :
notes hors gamme, finale attendue, degrés exposés, fonction des accords, donc
cadences.
**Correctif** : la tonalité de travail vient de la consigne quand elle la
déclare ; l'estimation est conservée dans `analysis.estimatedKey`. Le checker
`key` ne compare plus deux lectures de la consigne — il MESURE la part de notes
appartenant à la collection déclarée, avec la même tolérance que
`melody.out-of-key`.
**Effet de bord instructif** : le changement a d'abord fait REGRESSER M3 de 16 à
13, en révélant que `underDominant` (F-66, cf. A-5) traitait « aucun accord
chiffré ici » comme « on ne sait pas, donc on juge ». Sur toute la section en
apesanteur de `m03-s11` — agrégats par tons entiers, rien de chiffrable — chaque
7e degré passait pour une sensible d'un accord inexistant. Distinction posée :
aucun chiffrage transmis = ancien comportement ; chiffrage transmis mais rien à
cet endroit = pas de contexte fonctionnel, donc pas de sensible.

---

## Passe 3 — `melody.out-of-key`, de 26 solutions à une seule

La règle parlait sur 26 solutions. Trois causes distinctes, chacune encadrée par
une fixture positive et une négative.

### C-1 — la gamme était câblée en majeur/mineur
Le mode exotique n'était pas lu : `[0,2,4,5,7,9,11]` transposé sur la tonique,
avec un correctif pour le mineur seulement. Une pièce en dorien était donc jugée
contre le MAJEUR de sa tonique, sa tierce et sa septième mineures comptées comme
étrangères. Le problème est devenu visible en passe 2, quand la tonalité de
travail est devenue celle de la consigne — souvent modale en M3.
**Correctif** : `scalePcs(tonic, mode)` exporté depuis `analyzers/key.ts`, une
seule définition partagée par la règle et par le checker `key`. Les avoir
écrites deux fois, c'était garantir qu'elles divergent. **26 → 17.**

### C-2 — une note d'accord chiffré n'est pas « inexpliquée »
Le message de la règle dit « notes étrangères NON EXPLIQUÉES » — encore
faut-il regarder l'explication. La tierce d'une dominante secondaire, la
fondamentale d'un accord emprunté, une note de médiante chromatique
appartiennent à un accord parfaitement chiffré. Sans ce regard, la règle parlait
sur les exercices qui ENSEIGNENT le chromatisme : `m01-e36-dominant-chain`,
`m01-e46-mediant-voyage`, `m03-e05-secret-passage`, `m03-e06-eight-worlds`.
**Correctif** : une note étrangère appartenant aux pitch-classes d'un accord
chiffré au même moment est excusée. Ajouté au passage : une pièce dont la
collection détectée est une grammaire de rechange assumée (par tons, octatonique,
pentatonique, mineur mélodique) avec une couverture stricte sort du champ — c'est
littéralement ce que propose l'`alternative` de la règle. **`chromatic` en est
exclue** : elle contient les douze notes, sa couverture vaut toujours 1, et
l'accepter éteindrait la règle sur exactement la musique qu'elle doit juger.
**17 → 4.**

### C-3 — la FIGURE chromatique n'était pas implémentée
Le `how` de la règle l'énonce pourtant : « une note chromatique qui monte d'un
demi-ton vers une note de l'accord s'explique toute seule ». Le critère était
écrit et jamais appliqué — d'où les alertes sur `m01-e41-chromatic-figures` et
`m02-e29-talk-to-changes`, dont toutes les notes de passage résolvent.
**Correctif** : `resolvesBySemitone` — une chromatique est excusée si sa voisine
immédiate, DANS SA PROPRE LIGNE, est un degré de la gamme à un demi-ton. Deux
précisions qui font toute la différence : le calcul se fait voix par voix (sur
une texture aplatie, la « note suivante » serait celle d'une autre voix et
n'importe quel chromatisme paraîtrait résolu par accident) ; et la figure doit
RETOMBER dans la gamme — excuser aussi les notes seulement approchées par
demi-ton absoudrait n'importe quelle montée chromatique intégrale, où chaque note
est approchée d'un demi-ton. **4 → 1.**

**Effet collatéral** : le harnais de fixtures honore désormais la tonalité
déclarée, comme le pipeline. Sans cela, une fixture chromatique se faisait lire
par `estimateKey` dans une tonalité arbitraire (la♭ mixolydien pour une montée
chromatique en do) et ne testait plus la règle qu'elle visait.

**Reste une seule occurrence** : `m03-e11-weightless`, 14 % — le do♯ et le mi♭ de
la section en apesanteur, dont les agrégats ne se chiffrent pas. À instruire avec
le reste de cette pièce.

## Passe 4 — `melody.climax`, de 23 solutions à quatre

La règle parlait sur 23 solutions, et sa jumelle `melody.tension-placement` sur
21. Aucune des deux n'apparaît plus dans les postes de coût.

### D-1 — la fenêtre était universelle, les ambiances ne le sont pas
Le point de départ : **aucune** des 23 solutions ne déclarait de `climaxWindow`.
Toutes passaient par la porte posée en passe 1 — « une ambiance est visée » — et
recevaient la même fenêtre [55–85 %]. Or les gabarits de l'annexe D placent leur
sommet où ils veulent : la berceuse au milieu (47 %), le triste aux deux tiers
(67 %), l'épique très tard (87–93 %). Imposer une fenêtre unique, c'est juger
chaque ambiance contre une autre.
**Correctif** : `expectedClimaxWindow(moodId)` dans `analyzers/tension.ts`
dérive la fenêtre du gabarit lui-même, autour de son propre sommet.

### D-2 — `targetMood` n'est pas toujours une clé de gabarit
La vraie cause de l'ampleur du problème, et un défaut de ma porte de passe 1 :
les specs de M3 emploient `targetMood` comme une **étiquette d'atmosphère** —
`weightless`, `dread`, `modal-world`, `the-roller`, `menace`,
`suspended-then-released` — qui ne figure dans aucun gabarit. Rien là n'annonce
une montée, et `moodTemplate` rendait le gabarit `default` par défaut,
c'est-à-dire une promesse que personne n'avait faite.
**Correctif** : `expectedClimaxWindow` rend `null` sur une ambiance absente du
registre, et aussi sur un gabarit PLAT (mysterious, scifi, lullaby, joyful,
ambiguous_dark) — une courbe volontairement sans relief n'a pas de sommet à
placer. Le seuil de platitude est celui qui fait déjà basculer `archFit` en
régime de platitude : une seule notion de « plat » dans le moteur.

### D-3 — une consigne à alternatives laisse le choix de la forme
`m02-e28-ruins-of-melody` déclare `contourShape: ["descent", "plateau"]`, et on
lui réclamait un sommet aux deux tiers : sa note la plus aiguë est au début par
construction. Et `m02-e19-joyful` déclare `["wave", "arch"]` — une alternative,
pas une obligation d'arche.
**Correctif** : si le contour déclaré ne contient pas `arch`, silence. S'il
offre des alternatives et que la pièce a réalisé l'une des autres formes
admises, elle a obéi : silence. Et si la silhouette réalisée n'est admise par
aucune, c'est au checker `contourShape` de le dire — **une faute, un message**,
plutôt que deux plaintes pour le même défaut.

**Restent quatre occurrences**, toutes des signaux légitimes : deux pièces ne
tiennent pas la `climaxWindow` qu'elles déclarent elles-mêmes (m03-e14,
m03-e17), et deux manquent la fenêtre de leur gabarit (m01-e18 à 59 % pour une
fenêtre de 67–100 %, m02-e29 dont le sommet est la première note).

## Passe 5 — `melody.leap-recovery`, de 91 occurrences à 7

**Le compte de solutions vertes ne bouge presque pas, et c'est normal** : la
règle est une `suggestion`, elle coûte 2 points de correctness par occurrence.
La valeur du correctif est ailleurs — **91 remarques parasites de moins dans les
rapports rendus à l'élève**, sur 22 solutions de référence. Une suggestion qui
se déclenche à tort quatre fois par pièce n'est pas une petite gêne : c'est ce
qui apprend à l'élève à ne plus lire le rapport.

### E-1 — la dette commençait à la quarte, le cursus la fait commencer à la sixte
La distribution était sans appel : **58 des 91 alertes portaient sur des quartes
justes, 25 sur des quintes** — des intervalles consonants, chantables, qui
structurent tout arpège sans rien devoir à personne.

Le contenu du cursus tranche, et il est explicite. `m01-l02-intervalles` :
« la règle `melody.leap-recovery` que tu rencontreras dès tes premiers exercices
parle d'intervalles mélodiques **≥ 6te** ». Et `m02-l12-ambiances-3` nomme le
geste canonique : « le couple grand saut + résolution conjointe — l'élan (LA
SIXTE) suivi du retour tendre ».

Le code posait `LEAP = 5`, soit une quarte. Deux seuils avaient été confondus :
celui qui distingue le SAUT du degré conjoint (une quarte, ce que dit le
commentaire d'origine) et celui qui déclenche le REMBOURSEMENT (une sixte, ce
que dit la leçon).
**Correctif** : `LEAP = 8`. **91 → 7 occurrences**, et les sept restantes sont
des sixtes et au-delà réellement non soldées.

## Passe 6 — le périmètre d'abord, puis `harmony.*` et `vl.*`

Cette passe fait deux choses, et il fallait les faire dans cet ordre : d'abord
dire QUELLES pièces se lisent en voix, ensuite seulement corriger les règles qui
jugent des voix. Le contraire — calibrer `vl.*` sur un lot qui contient des
clusters à huit notes jugés par des règles à quatre voix — aurait produit des
exceptions taillées pour du bruit.

### F-0 — le périmètre : le lot A et le lot B (décision n°31)

La décision n°29(2) tenait : un choral écrit en accords EST à quatre voix, et le
compiler ainsi c'est le LIRE. Ce qui manquait, c'est de vérifier que la pièce est
un choral avant de le faire. Le déclencheur d'origine était « la notation empile
des hauteurs » — il embarquait donc aussi `m03-e15-the-veil-the-blade-the-mass`,
dont la spec déclare `minVoices: 1, maxVoices: 8`, `styleProfile: impressionist`,
et dont la leçon porte sur le cluster.

`voiceTextureOf(notes, spec)` demande deux témoins concordants. Ce que la spec
DÉCLARE : `minVoices`/`maxVoices` compatibles et fermés — une plage ouverte
(1–8, 2–7) annonce un travail de densité, pas un effectif. Ce que la pièce
TIENT : effectif ≥ 2, aucune verticalité plus épaisse que la norme, aucune plus
mince sauf la dernière (finir à moins de voix qu'on n'en tenait est un geste de
composition — « l'atterrissage EST le fil resté seul », m03-s06 boucle).

**Lot A : 73 solutions**, jugées par les familles `harmony.*`/`vl.*`.
**Lot B : 13 solutions** hors périmètre, qui ÉCHOUENT BRUYAMMENT
(`UnrepresentableTexture`) et sont nommées à chaque exécution du verrou. Elles ne
sont PAS repliées en `mono` : compilées ainsi, **aucune des 13 ne reçoit une
seule règle d'harmonie** (`harmony.*` et `vl.*` ont `appliesTo: ['voices',
'parts', 'midi']`), et **8 des 13 passeraient le verrou entier** — les cinq
autres ne butant que sur une contrainte, jamais sur une règle. C'est du vert
creux, exactement ce que la décision n°29(2) refusait. Aucun
`Submission['kind']` ne décrit une texture à densité variable ; c'est ce qui
manque, et c'est écrit.

| Lot B | Motif |
|---|---|
| m01-e45-gear-change-done-right, m03-e12 [creature] | la verticalité dominante n'a qu'une note — une ligne, pas un effectif |
| m03-e10-white-light, m03-e15-the-veil-the-blade-the-mass | la spec déclare une plage ouverte (2–7, 1–8) : l'exercice porte sur la densité |
| m02-e15-three-lights, m03-e12 [corruption], m03-e13, m03-e14, m03-e17 ×3, m03-e18 [modal] et [non-fonctionnel] | des verticalités plus épaisses que l'effectif dominant : une voix apparaîtrait de nulle part |

### F-1 — `unstackVoices` répartissait sur les ATTAQUES, pas sur ce qui SONNE
Une ronde liée par-dessus la barre tient sa voix sans réattaquer. En groupant par
`note.start`, la répartition la voyait absente : tout ce qui était sous elle
remontait d'un rang le temps d'un accord, et les quatre lignes devenaient fausses
ensemble. Sur `m01-s34`, l'accord final `[C3+C4+E4+D5]` porte une 9e liée depuis
la mesure précédente ; le si de l'alto se retrouvait suivi du do de la BASSE, et
le moteur signalait une sensible non résolue — quand les `authorNotes` écrivent
« B3→C4 (sensible ✓) ».
**Correctif** : la répartition et la mesure de largeur lisent la verticalité
SONNANTE (`start ≤ t < start+duration`), seules les notes qui attaquent étant
poussées. `m01-s34` et `m03-s11` rentrent au lot A, et `m01-s34` passe de 88 à 94.

### F-2 — `harmony.unresolved-seventh` : 18 signalements, 17 faux, quatre causes
Le relevé exhaustif sur le lot A donnait 18 occurrences. Aucune n'a demandé de
seuil ; chacune tombait sous une cause nommable.

- **La septième majeure n'est pas une tension.** `/7/.test(form)` attrapait
  `maj7`, `m7` et `mMaj7`. Or la `pedagogy` de la règle décrit la septième de
  DOMINANTE (« la quarte au-dessus, ou le demi-ton en dessous »). Le critère
  exact est le triton : `7`, `m7b5` et `dim7` le portent, `maj7`, `m7`, `6` et
  `m6` non. Un Cmaj7 en IV ne demande rien.
- **La même fondamentale n'est pas un abandon.** Un G7 qui se reverse en G7, un
  D7sus4 qui devient D7 : l'harmonie n'a pas bougé, la septième TIENT. Sur
  `m03-s09` (pédale de G7), le moteur voyait quatre abandons dans un seul accord.
  La cible est désormais le prochain accord qui CHANGE de fondamentale.
- **Un trou de chiffrage n'est pas une résolution manquée.** Le G7 de la mesure 1
  de `m01-s26` résout sur un Cmaj9 que l'analyseur ne sait pas chiffrer ; la
  règle lisait le Em7 deux mesures plus loin comme sa « suite ». Même doctrine
  que F-66 : sans chiffrage, pas de verdict.
- **La septième diminuée résout en MONTANT.** vii°7 → I : la fondamentale monte
  d'un demi-ton. Seules la quinte descendante et le subV étaient acceptés, si
  bien que le B°7 → C de `m03-s04` était compté pour un abandon.

**Résultat : 12,4 points de coût pondéré → 0.**

### F-3 — `vl.leading-tone-resolution` : une FONDAMENTALE n'est pas une sensible
Le garde F-66 exigeait que l'accord soit de fonction dominante. Mais `functionOf`
range en « D » **tout accord fondé sur le 7e degré, quelle que soit sa qualité** —
et il manquait la seconde moitié de la condition : que la note TIENNE la place de
la sensible dans cet accord. Trois pièces payaient pour trois fondamentales : la
basse mi du Em7 de `m01-s26` (ii d'un ii–V–I en ré, dans une pièce dont la
tonalité globale est fa), la fondamentale du Mi majeur V/vi de `m01-s35`, celle
du si mineur de `m03-s05`.
**Correctif** : la sensible est la tierce majeure d'une dominante (V, V7), ou la
fondamentale d'un accord de sensible (`dim`, `dim7`, `m7b5`).

Second défaut au même endroit : la sensible RÉÉNONCÉE. Le saut en avant cherchait
bien sa cible par-delà les répétitions, mais chaque répétition rouvrait le
procès — `m03-s18` récoltait trois erreurs pour un seul sol♯ tenu sous trois
voicings de mi. Elle se juge maintenant sur son DÉPART, qu'elle résolve ou non.
**9,6 → 1.**

### F-4 — `vl.doubled-leading-tone` n'avait pas reçu le garde F-66
La règle comptait les hauteurs sur le 7e degré, sans se demander si elles en
jouaient le rôle. Dans l'apesanteur de `m03-s11`, le si du tapis E♭+ et celui de
l'arabesque appartiennent à un agrégat par tons entiers : aucune dominante, donc
aucune sensible, donc rien à doubler. Le commentaire du code nommait déjà ce cas
pour la non-résolution — il n'avait simplement pas été appliqué ici.
**Correctif** : même garde `actsAsLeadingTone` dans les deux règles. `m03-s11`
passe de 71 à 80. **3 → 0.**

*La fixture de `vl.doubled-leading-tone` a dû être complétée : elle posait un
G–B sans quinte, une verticalité qui ne se chiffre pas, donc invisible au garde.
Une fixture doit poser le cas EN ENTIER — la quinte du V y est maintenant.*

### F-5 — `harmony.loop-coherence` s'appliquait à des grilles qui ne bouclent pas
Le `when` de la règle est explicite : « sur toute grille bouclée … une
progression qui ne boucle pas n'a pas de couture à cacher ». Le `detect` mesurait
la distance du dernier accord au premier sur TOUTE progression d'au moins trois
accords. Une période classique qui finit sur sa parfaite ne repasse jamais par
son premier accord ; on lui reprochait l'écart entre son do final et son sol
initial.
**Correctif** : la règle ne s'applique que si la consigne déclare une boucle. Le
test porte sur le NOM de la clé (`/loop/i` : `loopTours`, `maxLoopChords`,
`loopReturnChord`, `loopBarsLength`…) plutôt que sur une liste fermée, qui
rouillerait au premier ajout de contenu. **5 → 0.**

## Passe 7 — M2, le chantier mélodique

Le profil de M2 n'est pas celui de M1/M3 : le coût y est dominé par les
CHECKERS DE CONTRAINTES, pas par les règles — et le verrou pose deux clauses,
si bien qu'une contrainte en échec suffit à barrer une pièce quelle que soit sa
note. Quatre correctifs, tous adossés à une source du cursus.

### G-1 — la période a le droit d'être ÉTENDUE
`m02-e11-stretch-and-cut` déclare `phraseBarPlan: [4,6]` ET
`phraseStructure: "period"` dans le même bloc de contraintes, et son prompt dit
« une période... déséquilibrée ». L'analyseur rendait « indéterminée » : sa
tolérance de symétrie `PERIOD_BALANCE = 0.25` refusait 4+6. Le moteur
contredisait la spec qu'il vérifiait.

`m02-l06-phrase` §1 donne les deux bornes, chiffrées : « l'extension retarde la
cadence attendue : la phrase de 4 mesures en dure **5 ou 6** » (×1.5) ; « la
compression fait l'inverse : la phrase attendue sur 4 mesures conclut en **3** »
(×0.75). **Correctif** : `CONSEQUENT_MIN = 0.75`, `CONSEQUENT_MAX = 1.5`, deux
procédés nommés à la place d'une tolérance anonyme.

### G-2 — la phrase-période se cherche dans une SUITE de phrases
`detectStructure` exigeait `phrases.length === 3`, c'est-à-dire qu'une pièce ne
contienne qu'une seule articulation. `m02-s06` en aligne trois — son titre le
dit (« three-sentences »), ses `authorNotes` aussi (« chaque segment :
dire-redire-précipiter-conclure ✓ ») — l'analyseur y lisait cinq phrases et
rendait « indéterminée », sur l'exercice canonique de la phrase-période.
**Correctif** : balayage des fenêtres de trois phrases consécutives.

*La période, elle, reste une lecture de la pièce entière.* Le balayage lui a
été retiré après essai : son gabarit est trop lâche, et deux mesures voisines
qui ne finissent pas sur la même note en fabriquaient une. Les fixtures
négatives `period-negative-antecedent-concludes` et
`sentence-negative-different-heads` l'ont dit immédiatement — elles ont fait
leur travail.

### G-3 — `rhythm.prosody` punissait l'anticipation que sa `pedagogy` recommande
Cinq pièces, corrélation **toujours négative** (−0.33 à −0.65) : un signe de
défaut systématique, pas de cinq mélodies mal déclamées. La preuve est
`m02-e18-anacrusis-power`, à −0.65 — l'exercice DE l'anacrouse, dont les
`authorNotes` déclarent « 4 occurrences, chacune précédée d'une anacrouse d'UNE
croche (politique constante ✓) ».

`metricWeight` est lu au tick d'ATTAQUE. Or chaque cible de cette pièce est liée
par-dessus la barre : elle commence une croche avant l'appui et sonne à travers
lui. Comptée « hors temps », donc. C'est exactement ce que l'`alternative` de la
règle appelle par son nom : « l'anticipation : jouer la note longue une croche
AVANT l'appui — elle fuit le temps fort tout en le désignant ».
**Correctif** : `articulatedWeight(note, meter)` — le poids de l'appui qu'une
note ARTICULE, son attaque ou l'appui qu'elle anticipe. Seul l'appui
immédiatement suivant compte : une blanche attaquée au temps 2 traverse le
temps 3 sans l'articuler, et lui offrir ce poids surévaluerait toute valeur
longue. **5 pièces → 0**, et la fixture `prosody-inverted-swing` (le jazz
déclame à l'envers) reste vérifiée.

### G-4 — `minMotifOccurrences` posait une question existentielle à un classement
La contrainte demande « la pièce énonce-t-elle une cellule au moins N fois ? ».
Elle le demandait au seul `bestMotif`, choisi par `couverture ×
distinctivité` — un classement qui ne parle pas de compte. Sur `m02-s18`, il
retenait une version à 5 notes énoncée 2 fois plutôt que la cellule à 4 notes
énoncée 3 fois ; la 5e note est le retour vers l'anacrouse suivante, c'est-à-dire
la COUTURE entre deux énoncés, pas la cellule.
**Correctif** : la question se pose à `report.motifs`. La contrainte garde ses
dents — `m02-e03` reste « aucun motif détecté » et `m02-e25` reste à 3 énoncés
pour 8 exigés, tous deux pour des raisons de contenu (ci-dessous).

### G-5 — `melody.ending-weak` contredisait la consigne
Son `when` dit : « une question laissée ouverte échappe à la règle — **mais
dis-le dans ta consigne** ». Quand la consigne le dit, elle le dit par
`mustEndOnDegrees`, et c'est son checker qui juge la finale. La règle imposait
par-dessus sa liste générique (tonique ou dominante) : `m02-e28`, néo-noir
« ambiguous-dark », admet `[2,5]`, sa contrainte PASSAIT, et la règle lui
reprochait quand même sa finale sur 2̂. Même contradiction sur `m02-e03` et
`m02-e16`, dont les finales sur la tierce sont explicitement admises.
**Correctif** : la règle se tait dès que `mustEndOnDegrees` est déclarée. **5
occurrences → 1** (`m02-e25`, la seule où la consigne ne dit rien).

### G-0 — ce qui N'A PAS été touché, et pourquoi
`contourShape` reste en échec sur trois pièces (`m02-e22`, `e27`, `e28`), toutes
lues « wave » là où l'on attend plateau, arche et chute. Une réduction de la
ligne à ses rebroussements significatifs a été écrite, essayée, puis
**retirée** : elle ne changeait aucune des trois (3 → 3) et cassait une fixture.
Et surtout, la fixture `plateau-divergence-s22` documente déjà le cas comme un
ÉCART CONNU, délibérément laissé visible : « `m02-e22` contraint plateau et les
`authorNotes` écrivent “plateau (ambitus 7) ✓” — mais le seuil du tutoriel
(≤ 4 dt) ne peut pas l'accepter […] à trancher : élargir le seuil ou requalifier
la contrainte ». C'est un diagnostic C, qui appelle une décision au registre
AVANT tout patch — pas un correctif de moteur.


---

## Passe 8 — le lot B rentre, les tensions se chiffrent

**46 → 68 pleinement verts, sur le corpus entier de 86** (le dénominateur
redevient 86 : le lot B n'est plus hors périmètre). m01 20/27, m02 21/28,
m03 27/31.

Deux verrous structurels tombent dans cette passe, et ils expliquent à eux seuls
la moitié des remontées : le corpus avait deux choses que le moteur ne savait pas
REPRÉSENTER — une texture sans effectif, et un accord coloré.

### H-1 — le lot B : `{kind:'harmony'}`, la troisième forme (diagnostic A)

*11 pièces qui ne compilaient même pas.*

La décision n°31 avait raison de refuser `voices` (qui invente un effectif) et
`mono` (qui tait toute l'harmonie) sur les textures à densité variable, et elle
échouait bruyamment faute d'une troisième forme. Cette forme existe maintenant :
`{kind:'harmony'}` dit exactement ce qu'on sait lire d'une telle pièce — les
verticalités se chiffrent (`harmony.*`, `jazz.*`, `orch.low-interval-limit`
s'appliquent), la ligne supérieure se lit (`melody.*`, `rhythm.*` aussi), les
lignes intérieures n'existent pas (`vl.*` et `cp.*` restent muettes).

**Le craft ne prend aucun point gratuit** : la composante `clean-voice-leading`
est RETIRÉE de la moyenne sur ces pièces au lieu d'y valoir 1 — on ne récompense
pas une propreté qu'on n'a pas regardée. 8 des 11 sont passées d'emblée ; le
tableau de bord du verrou continue de les nommer une par une à chaque exécution,
sous « lues en verticalités, sans conduite de voix ».

*Registre : décision n°32.*

### H-2 — les tensions : 169 verticalités polyphoniques illisibles sur 593 (diagnostic C)

*Bloquait m01-e31, e32, e34 ; faussait `minEnrichedChords`,
`requirePlainTriadCount`, `requiredCadence` et le craft de toute la famille
harmonique.*

Le tutoriel fixe 14 formes et un « match exact » : aucune pitch-class étrangère.
Le CONTENU, lui, enseigne les tensions — `m01-l17` enrichissements, `m01-l18`
« au moins 3 voicings distincts : V7 → V9 → V13 → V7♭9 », tout M3
impressionniste. Sur `m01-s34`, l'exercice DE LA TENSION, le moteur ne chiffrait
aucun de ses cinq accords : ni cadence, ni enrichissement compté, rien. Il ne
disait pas « c'est faux », il ne disait RIEN.

**Correctif** : une tension n'est pas une quinzième forme, c'est une couleur
POSÉE SUR une forme — G13 reste un G7. La table reste intacte ; `detectChord`
accepte par-dessus au plus **deux** degrés parmi {♭9, 9, 11, ♯11, ♭13, 13} et les
NOMME dans `ChordResult.tensions`. La quinte peut s'omettre dès qu'une tension la
remplace (`[C3+C4+E4+D5]` = do add9), mais un dyade nu reste rejeté : {ré, fa} ne
porte aucune tension, sa quinte ne lui est pas substituée, elle MANQUE — la
fixture `incomplete-rejected` (F-3) tient. À lecture égale, l'accord qui
s'explique SANS tension gagne toujours.

Verticalités polyphoniques non chiffrées : **169 → 43** (les 43 restantes sont
des clusters de M3, et c'est correct : ce sont des clusters).

*Registre : décision n°33.*

### H-3 — la tension chiffrée redevenait une faute au chord-scale (diagnostic A)

*4 régressions immédiates de H-2, sur m03-e16 et m03-e18.*

`chordScaleCheck` raisonne sur la seule FORME de l'accord : le ♭9 d'un G7♭9, lu
comme tension au chiffrage, ressortait « hors gamme mixolydienne ». La même note
comptée deux fois, une fois comme couleur et une fois comme faute.
**Correctif** : une tension déclarée de l'accord est un son de l'accord.

### H-4 — `vl.smoothness` : la métrique que 13 specs nomment et que rien ne mesurait (diagnostic A)

*Débloquait m01-e26 et m01-e36 (84 tous les deux, aucune contrainte en échec).*

Treize specs la citent (`craftMultipliersOverride: {"vl.smoothness": 1.8}`,
`smoothnessMaxPerVoice`, listes de `checkers`) et elle n'existait nulle part.
`m01-e26` va jusqu'à écrire « Objectif mesuré : le voice leading des guide tones
— mouvement minimal », et les `authorNotes` de `m01-s36` donnent le chiffre
attendu : « smoothness ≈ 0.5 dt/voix/transition (hors basse) ✓ ».

**Correctif** : composante de craft `voice-smoothness` — déplacement moyen des
voix SUPÉRIEURES (la basse fonde, elle ne conduit pas), active seulement là où la
consigne en fait l'objet de l'exercice. Mesuré : 1,00 dt sur m01-s36, 1,31 sur
m01-s26, 0,89 sur m01-s42 — conforme aux `authorNotes`.

Dans le même geste, `singing-bass` ne s'applique plus là où la consigne CLOUE la
basse (`guideToneVoicing`, basse obstinée, lamento) : récompenser une basse
chantante quand l'exercice impose « fondamentale seule à gauche », c'est noter
l'exercice qu'on aurait aimé donner — la faute que `caresAboutIdioms` évitait
déjà dans l'autre sens.

### H-5 — les DEGRÉS ignoraient le mode (diagnostic A)

*3 solutions, et chaque fois sur la note qui FAIT le mode.*

`degreeToSemitone` ne connaissait que deux échelles, majeure et mineure, les cinq
modes exotiques étant rabattus sur l'une des deux. Elle se trompait donc
exactement sur le 6̂ du dorien, le 4̂ du lydien, le 7̂ du mixolydien. Sur
`m01-e13`, dont la leçon EST cette note — « remplace les B par B♭, tout bascule
en éolien », et les `authorNotes` : « Expositions du B (6̂ majeure) » — le moteur
cherchait un si♭ et refusait la solution parce qu'elle avait raison.

**Correctif** : table des sept modes. `m01-e13`, `m02-e26` (4̂ lydien),
`m02-e27` (7̂ mixolydien).

### H-6 — `minRestRatio` jetait le silence final (diagnostic A)

*m02-e26 « weightless », dont le sujet EST l'espace.*

Le dénominateur s'arrêtait à la fin de la dernière note. Sur `C5:h r:h`, le
demi-silence terminal disparaissait et le ratio tombait de 0,31 — le chiffre des
`authorNotes` — à 0,27, sous le seuil de sa propre consigne.
**Correctif** : on mesure sur la mesure COMPLÈTE où la pièce s'achève. 0,3125.

### H-7 — `flatTension` interrogeait une courbe déjà normalisée (diagnostic A)

*Les DEUX seules specs du corpus qui la déclarent échouaient.*

`tensionCurve` termine par un `minMax` : toute courbe non constante occupe
exactement [0, 1]. Demander l'écart-type de cette courbe-là, c'est poser une
question à laquelle « oui » est impossible — et pendant ce temps, `archFit`
créditait `m02-s26` de 0,87 en régime PLATITUDE. Le moteur se contredisait d'un
fichier à l'autre.

**Correctif** : `tensionSpread()` expose l'amplitude AVANT normalisation (somme
pondérée de z-scores : sans unité, comparable d'une pièce à l'autre). Le seuil
0,65 est **calibré sur le corpus, pas choisi** : sur les 86 solutions, les deux
pièces qui déclarent `flatTension` sortent 2ᵉ et 3ᵉ plus plates à 0,53 et 0,59,
la médiane est à ≈ 1,05, et seule la pédale de G7 de m01-s34 descend plus bas
(0,24). 0,65 ne retient que les 5 % les plus immobiles — une barre haute.

### H-8 — la consigne fixait le profil d'intervalles, le craft notait le contraire (diagnostic A)

*m02-e05, e07, e26 : `step-leap-balance` à 0,00 sur des pièces conformes.*

Trois cas où la « norme du style » ne vient pas du style :
`minPerfectIntervalRatio` (m02-e26 EXIGE ≥ 50 % d'intervalles justes — une quarte
est un saut ; la pièce, conforme à 67 %, était notée zéro pour manque de degrés
conjoints) ; `minConjunctRatio` (le checker mesure déjà le ratio, avec le seuil
de la consigne — deux verdicts pour un fait) ; `givenCellAsMotif` (la cellule est
FOURNIE, ses sauts ne sont pas ceux de l'élève, F-41).
**Correctif** : la composante se retire dans ces trois cas.

### H-9 — `ascendingPhrasePeaks` comparait tous les maxima locaux (diagnostic A)

*m02-e10, m02-e21.*

La clé s'appelle « sommets de PHRASE » et le checker lisait `contour().peaks` —
tous les maxima locaux de la ligne, une dizaine par pièce, qui montent et
redescendent par construction à l'intérieur d'une même phrase. `m02-s10`
(« l'échelle des sommets ») annonce les siens en toutes lettres : « Sommets
B♭4 < D5 < F5 ✓ ». Trois phrases, trois sommets.

**Correctif** : le sommet de chaque phrase, découpée par `segmentBars` quand la
consigne la déclare (m02-e10 écrit `segmentBars: 4` et son prompt ne laisse aucun
doute : « 12 mesures = 3 phrases de 4 mesures […] L'analyseur compare les trois
sommets »), par la détection automatique sinon.

### H-10 — le climax ex æquo était pris au premier passage (diagnostic A)

*m03-e14, m03-e17 [octatonique], et le confort de m01-e18.*

« Le premier sommet absolu, celui qui accomplit la montée » est juste tant que le
sommet n'est atteint qu'une fois. `m03-s17` touche son mi♭5 deux fois : une
croche de passage dans un arpège à 38 %, puis la RONDE du cluster à sept sons à
60 % — le climax de cette pièce est la masse tenue, et la fenêtre de la consigne
([0,6 – 0,8]) le dit aussi. `m03-s14` roule trois fois le même dessin (la
consigne le déclare, `sameTopLineAcrossSegments`) : prendre le premier plaçait le
sommet d'une pièce de douze mesures à sa deuxième.

**Correctif** : à hauteur égale, le sommet le plus LONG ; à durée égale, le
DERNIER. La fixture `climax-hero-s21` (62,5 %) est inchangée.

### H-11 — quatre checkers lisaient à côté de leur consigne (diagnostic A)

- **`forbidEnrichmentOnDegrees`** ne lisait que la première moitié de la consigne
  de `m01-e31` : « laisse le V NET **(sus4→3 autorisé)** ». `allowedOnV` n'était
  implémenté nulle part. Le sus4 qui résout sur sa tierce est maintenant excepté.
- **`requirePlainTriadCount`** / **`minEnrichedChords`** comptaient par forme
  seule : depuis H-2, un `Gadd9` est un `maj` QUI PORTE une neuvième — enrichi,
  pas nu. `m01-s32` comptait trois triades nues là où ses `authorNotes` en
  revendiquent une (« la triade nue = le G final »).
- **`minSubstitutions`** ne comptait que les tags `subV` — la substitution
  tritonique, un seul des deux idiomes que le cursus appelle ainsi. `m01-e28`
  (« Même récit, autre lumière ») demande l'autre : la doublure de FAMILLE, vi
  pour I, ii pour IV. Ajouté : comparaison position par position à
  `given.chords`, en exigeant que la FONCTION survive.
- **`requiredVariationTypes`** ne retenait que le `sub` de l'occurrence, jamais
  son `kind` : `m02-s04` porte bien sa transposition réelle (+5, annoncée par ses
  `authorNotes`, classée `kind:'transposed', sub:'real'`) et le checker répondait
  « variation manquante : transposed ».

### H-12 — deux contraintes d'une même spec se contredisaient (diagnostic A)

- **`requiredCadence: "perfect"` sur mélodie FOURNIE** (m02-e15) : parfaite et
  imparfaite ne diffèrent que par le soprano, et quand la mélodie est donnée ce
  soprano n'appartient pas à l'élève. `m02-e15` donne une mélodie « souveraine »
  qui finit sur 3̂ et demande une parfaite dans la même consigne ; ses
  `authorNotes` le signalent elles-mêmes (« soprano sur 3̂ imposé par la mélodie
  souveraine — à contrôler »). L'authentique est reçue, et le rapport le DIT.
- **`mustEndOnDegrees` sous `requireAmbiguousKey`** (m02-e24) : l'exercice EST
  que la tonalité reste indécise, et le checker élisait quand même une tonique
  pour en déduire un degré. Les `authorNotes` : « fin E = 2̂ (dorien) ou 5̂
  (éolien) — juste dans les deux mondes ». Les toniques rivales sont désormais
  admises, mais seulement là où la consigne revendique l'ambiguïté.

### H-0 — ce qui a été essayé puis RETIRÉ

La silhouette lue sur le contour RÉDUIT (moyenne pondérée par quart de pièce,
seuil de plateau inchangé à 4 demi-tons) a été écrite, mesurée, puis retirée.
Elle rend bien « plateau » sur `m02-s22` — le cas que la fixture
`plateau-divergence-s22` documente comme écart connu — mais elle relit aussi
`silhouette-wave` (un extrait réel de m02-s19) en « arche », casse deux fixtures,
et **ne débloque aucune solution** : 68 avant, 68 après. Le constat est versé au
dossier de la décision éditoriale à venir ; le code garde la lecture normative et
le désaccord reste visible.

**Aucun seuil de `scoring.ts` n'a été touché** dans cette passe, ni aucun poids
de profil. `SEVERITY_PENALTY`, `MAX_ISSUES_SHOWN`, `IMPROVED_VERSION_MAX_CHANGE`,
`AMBIGUOUS_KEY_CONF` sont celles du tutoriel.

---

## Reste à faire — les 18 rouges, triés par ce qu'ils exigent

Aucun des 18 n'est un défaut de moteur qu'on saurait corriger sans trancher
d'abord une question qui n'appartient pas au code. Ils se rangent en trois
dossiers.

### Dossier 1 — la doctrine `vl.*` sur les réalisations de M1 (6 pièces)

`m01-e32`, `m01-e38`, `m01-e40`, `m03-e18 [fonctionnel-etendu]`, et par ricochet
`m01-e34`, `m03-e11`.

**Les quintes sont RÉELLES** — vérifié pièce par pièce, pas par sondage.
`m01-s38` porte des douzièmes parallèles franches entre soprano et basse sur
Gm7→A7 (tout le voicing monte d'un ton) ; `m01-s40` cumule une octave directe
finale et des quintes parallèles. Ce ne sont pas des artefacts de
`unstackVoices`.

Ce qui a été instruit cette passe, et qui ferme une partie du dossier : la
substitution tritonique GLISSE, son geste entier est le demi-ton descendant de
tout le voicing sur la cible (« c'est le glissement qui fait le couloir »). Les
quintes que ce glissement produit sont maintenant créditées en `info` sous le tag
`subV`, exactement comme le planing et les quintes de Mozart — condition serrée :
le tag couvre l'accord de départ ET les deux voix descendent d'un demi-ton
exactement. Sur `m01-s38`, la quinte du Ab7→G est excusée, celle du Gm7→A7 (ton
entier, hors tag) est conservée.

**Ce qui reste est une question éditoriale, pas un patch.** Trois faits, tous
vérifiés :

1. **M1 n'enseigne nulle part les quintes parallèles.** `vl.parallel-perfects`
   cite `lessonRef: 'm01-l12'` ; m01-l12 porte sur les renversements et la
   disposition et ne dit pas un mot des parallèles. Les seules leçons du corpus
   qui les enseignent sont `m03-l01`, `m03-l03`, `m03-l14` et `m09-l02`.
2. **Les prompts et les `authorNotes` de M1 ne parlent jamais de conduite** :
   ils vérifient le chiffrage, le mouvement de basse, les tags. Ceux de M3
   parlent SATB (c'est le constat qui fonde la décision n°31).
3. **Aucun critère structurel ne sépare les deux groupes.** Mesuré : l'écart
   moyen basse→voix supérieure ne discrimine pas (m03-e08 [dorien] est vert à
   19,8 dt avec 2 parallélismes, m01-e40 est rouge à 13,8) ; `minVoices === 4`
   fermé non plus (m03-e09/e11/e13/e14 déclarent un maximum ouvert et sont bien
   des chorals).

Il faut donc **choisir**, et le choix n'est pas au code : soit les réalisations
de clavier de M1 sont requalifiées (une clé de spec, un profil, ou une révision
des solutions), soit les six voicings sont corrigés en contenu. Tant que ce n'est
pas tranché, poser une exception serait la tailler pour le cas, pas pour la
règle.

### Dossier 2 — la silhouette et la syncope, deux mesures à requalifier (5 pièces)

- **`contourShape`** — `m02-e22` (plateau), `m02-e27` (arch), `m02-e28`
  (descent), toutes lues « wave ». La lecture actuelle classe sur la suite des
  directions NOTE À NOTE : `arch` exige la chaîne exacte `UD`, c'est-à-dire une
  montée puis une descente strictement monotones, ce qu'aucune mélodie réelle ne
  fait. Les trois `authorNotes` disent le contraire de l'analyseur, chacune sur
  sa propre contrainte. La piste mesurée est en H-0 ; elle demande une décision,
  parce qu'elle rouvre le seuil de plateau du tutoriel et deux fixtures.
- **`syncopationTarget`** — `m02-e19` (0,44 mesuré, 0,15–0,40 demandé) et
  `m02-e27` (0,04 mesuré, 0,10–0,35 demandé), l'un au-dessus, l'autre en
  dessous. `offBeatRatio` compte toute attaque hors temps ; dans une pièce en
  croches courantes, la moitié des attaques le sont par construction — c'est du
  mouvement, pas de la syncope. Les `authorNotes` de `m02-s19` comptent autre
  chose : « syncopes douces (`q.` hors temps) ≈ 0.3 ». Il faut fixer la
  définition (attaque hors temps ? note qui SONNE à travers un appui qu'elle n'a
  pas articulé ?) avant de recalibrer quoi que ce soit, et les deux pièces
  bougent en sens opposé — ce n'est pas un seuil, c'est la grandeur.

### Dossier 3 — six écarts de CONTENU, chacun vérifié (diagnostic B)

| Pièce | Écart |
|---|---|
| `m01-e42` | 7 mesures écrites pour 8 demandées. |
| `m01-e45` | `minVoices: 4` : les accords du premier volet n'ont que 3 notes, et la mélodie sonne seule entre eux. Les `authorNotes` (« Δvoix = +1 ») confirment un volet à 3 voix — la spec et la solution ne peuvent pas être vraies ensemble. |
| `m02-e03` | 7 mesures pour 8, et la solution répond à une AUTRE consigne : elle aligne les quatre archétypes énoncés une fois chacun quand les contraintes demandent UN motif ≥ 3 fois. La leçon `m02-l01` porte sur les archétypes, la contrainte sur le développement — l'une des deux doit céder. |
| `m02-e25` | 4 mesures écrites pour 16 demandées, avec 8 énoncés attendus : très probablement une boucle à répéter quatre fois, que la solution ne dit pas. |
| `m02-e16` | conjoint 0,55 pour 0,60 exigé — cinq centièmes, sur une mélodie de guide tones qui saute par construction. À trancher : le seuil ou la pièce. |
| `m02-e27` | saut de 9 demi-tons pour `maxLeap: 7` (en plus de sa silhouette et de sa syncope). |

### Et deux pièces à un cheveu, pour mémoire

`m01-e34` (89) et `m03-e17 [pandiatonique]` (88) passent la note et ne butent que
sur une contrainte : la première sur la définition classique de la cadence
parfaite appliquée à un voicing jazz — son accord final est un do add9, et aucun
voicing de ce langage ne pose la tonique nue au sommet ; la seconde sur une
fenêtre de climax que son sommet manque de trente points.

**Le verrou n'est pas vert, le tag `v0.2-engine-core` n'est pas posé.**

---

## Passe 9 — les réalisations de M1 sont requalifiées

**68 → 72 pleinement verts sur 86.** m01 24/27, m02 21/28, m03 27/31.

Le dossier 1 de la passe 8 est tranché : **arbitrage utilisateur, les solutions
de M1 sont des voicings de clavier.** Cette passe applique la décision, et rien
d'autre — le dossier 2 (silhouette, syncope) et le dossier 3 (écarts de contenu)
restent ouverts tels quels.

### I-1 — `ExerciseSpec.texture` : `choral` (défaut) ou `keyboard`

`kind` dit ce qu'on produit, `texture` dit comment c'est disposé. La déclaration
vit dans le CONTENU, une clé par exercice, à côté de `kind` — pas dans une
heuristique du moteur : elle doit être auditable fichier par fichier.

Côté moteur, chaque règle déclare désormais si elle SUIT une ligne d'un accord
au suivant (`Rule.needsIndependentVoices`) : les quatre `vl.*` et les cinq
`cp.*`, personne d'autre. Sur une texture de clavier, elles sont **éteintes et
NOMMÉES** dans `silencedRules` — le même canal que les règles qu'un profil
neutralise. Le rapport dit « en écriture de clavier, la main droite est un bloc :
la conduite des voix ne s'y juge pas ». Rien n'est tu en silence.

Le défaut est `choral` : aucune spec non déclarée ne change de comportement.
M3 n'est pas touché — la décision n°31 a établi que ses `authorNotes` parlent
SATB.

### I-2 — les neuf exercices requalifiés, et leur témoin

Le critère n'est pas « la pièce est-elle rouge » mais « la consigne demande-t-elle
quoi que ce soit de la CONDUITE ». Quand elle en demande, `choral`. En cas de
doute, `choral` — le défaut garde la règle active.

| Requalifié `keyboard` | Ce que la consigne dit |
|---|---|
| `m01-e26` | « fondamentale seule à gauche, tierce+septième (+1 note libre max) à droite » — une disposition à deux mains, littéralement |
| `m01-e28` | remplacement d'accords par leur doublure de famille, plan T-S-D-T |
| `m01-e31` | enrichissement d'accords, « UNE couleur par accord » |
| `m01-e32` | enrichissement, « D plus net que T/S » |
| `m01-e34` | « Lois du voicing l18 §3 : grave vide, guide tones, tensions à l'aigu » |
| `m01-e36` | « voicings guide-tones (l13 §5) » |
| `m01-e38` | substitution tritonique, « la basse du substitut descend d'un demi-ton » |
| `m01-e40` | les trois portes, « chaque note chromatique doit savoir pourquoi elle est là » |
| `m01-e45` | « grille + mélodie simple » |

Laissés `choral`, et pourquoi — ce sont eux qui prouvent que le critère mord :

| Resté `choral` | Ce que la consigne demande de la conduite |
|---|---|
| `m01-e23` | « que la basse devienne une LIGNE majoritairement conjointe » |
| `m01-e24` | « la basse DESCEND en ligne diatonique de G3 à G2 » |
| `m01-e27` | « les renversements POUR LA BASSE » |
| `m01-e30` | « parfaite complète (les 4 conditions) » — les quatre conditions sont SATB |
| `m01-e35` | « chaque sensible LOCALE monte d'un demi-ton » |
| `m01-e39` | « la ligne interne 6̂→♭6̂→5̂ doit être audible dans UNE VOIX SUIVIE » |
| `m01-e42` | « la voix interne A→G♯→G→F♯ […] TOUTES les autres voix tiennent » |
| `m01-e44` | établir/pivoter/confirmer — mais rien ne dit un layout de clavier |
| `m01-e46` | « une note commune dans UNE VOIX qui la tient » |

### I-3 — ce que la requalification coûte, en chiffres

C'est le contrôle qui dit si l'on a calibré ou taillé sur mesure. Mesuré, pièce
par pièce, en réévaluant chacune des neuf sous les deux textures :

| | conduite retirée | score choral → clavier |
|---|---|---|
| `m01-e26` | **0** | 93 → 90 |
| `m01-e28` | **0** | 90 → 85 |
| `m01-e31` | **0** | 96 → 94 |
| `m01-e32` | 1 | 88 → 91 |
| `m01-e34` | **0** | 89 → 91 |
| `m01-e36` | **0** | 93 → 90 |
| `m01-e38` | 3 | 84 → 93 |
| `m01-e40` | 5 | 76 → 92 |
| `m01-e45` | **0** | 79 → 79 |

**Six des neuf pièces n'avaient aucun jugement de conduite à perdre** : sur
elles, l'étiquette ne change rien à ce qui est contrôlé. Neuf jugements
disparaissent en tout, tous concentrés sur les trois pièces du dossier 1.

Et la requalification n'est pas un laissez-passer : **quatre scores BAISSENT**
(e26, e28, e31, e36), parce que le craft perd sa composante `clean-voice-leading`
au lieu de l'encaisser à 1 — on ne récompense pas une propreté qu'on a cessé de
regarder. Même doctrine qu'en H-1 pour le lot B.

### I-4 — la cadence parfaite sur un voicing de clavier

`m01-e34` butait sur `requiredCadence: "perfect"` avec un do add9 final. La
parfaite et l'imparfaite ne diffèrent que par le soprano ; sur une écriture de
clavier, le sommet de la main droite est une tension ou un guide tone, jamais la
tonique nue — c'est la loi de voicing que l'exercice ÉNONCE lui-même (« grave
vide, guide tones, tensions à l'aigu »). L'authentique est reçue, et le rapport
le dit, exactement comme pour la mélodie fournie de H-12.

### I-5 — deux défauts que la requalification a fait remonter

Ils étaient masqués par les `vl.*` ; une fois celles-ci éteintes, le craft est
devenu le seul poste de coût de `m01-e32`, et deux erreurs sont apparues — toutes
deux introduites par mon propre correctif H-2.

**(a) Le départage des candidats préférait la RICHESSE à la basse.**
`[G3+B3+D4+A4]` — un sol add9, basse sol, que les `authorNotes` de `m01-s32`
nomment « Gadd9 » — ressortait en « si mineur septième avec treizième bémol »,
un si mineur dont le si n'est pas à la basse. L'ordre richesse-puis-basse était
juste tant que la richesse ne s'ACHETAIT pas ; depuis les tensions, une forme
plus riche se fabrique toujours en relisant un son de l'accord comme la couleur
d'un autre. **Correctif** : la basse départage — mais UNIQUEMENT entre lectures
à tension. Élargi à tous les cas, le départage rendait systématiquement l'état
fondamental et aplatissait `inversion-variety` sur tout le corpus (m03-s17 y
perdait neuf points sans qu'une note ait changé).

**(b) N'importe quelle tension autorisait l'omission de la quinte.**
`{mi, si, ré}` — un accord sans tierce — se faisait lire « si mineur avec
onzième, quinte absente » : inventer une fondamentale pour ne pas avoir à dire
« je ne sais pas ». **Correctif** : seule une NEUVIÈME remplace la quinte, parce
que c'est elle qui le fait dans le voicing d'add9. Le corpus est indifférent au
score (72 dans les deux cas) ; on garde la lecture qui refuse d'inventer, suivant
la doctrine du moteur — `null` plutôt qu'un repli.

### I-6 — `caresAboutIdioms` réclamait des idiomes à des grilles diatoniques

*`m01-e28` et `m01-e32`, notés 0,00 sur `idioms-used`.*

La fonction est censée écarter exactement ce cas — son commentaire le dit :
« une progression diatonique n'a aucun idiome à exploiter ; lui en réclamer,
c'est noter l'exercice qu'on aurait aimé donner ». Deux clés l'y faisaient
pourtant entrer par un mauvais proxy : `minEnrichedChords` (enrichir, c'est
ajouter une couleur à un degré DIATONIQUE — un Gadd9, un Cmaj7 ; ce n'est pas un
geste chromatique nommé, et l'enrichissement a déjà son propre checker) et
`minSubstitutions` (depuis H-11 il compte AUSSI les doublures de famille, qui ne
taguent aucun idiome ; son unique porteur du corpus, `m01-e28`, ne substitue que
par famille — la clé garantissait un zéro).

**Essayé puis retiré dans la même passe** : exclure aussi `singing-bass` sur les
textures de clavier, au motif que « fondamentale seule à gauche » cloue la basse.
Le corpus a répondu non — `m01-s32`, `s34` et `s40` y PERDAIENT des points, parce
que leurs mains gauches marchent réellement par degrés. La consigne contraint le
registre, pas le mouvement : une basse de clavier qui chante mérite son crédit.

**Aucun seuil de `scoring.ts` n'a été touché** dans cette passe non plus.
270 fixtures vertes, dont les 35 d'accord et les 14 de conduite.

---

## Après la passe 9 — les 14 rouges

Les dossiers 2 et 3 de la passe 8 sont inchangés ; le dossier 1 est clos.

| Dossier | Pièces |
|---|---|
| **2 — mesures à requalifier** (silhouette, syncope) | `m02-e19`, `m02-e22`, `m02-e27`, `m02-e28` |
| **3 — écarts de contenu** (diagnostic B) | `m01-e42`, `m01-e45`, `m02-e03`, `m02-e16`, `m02-e25` |
| **4 — M3, resté choral** | `m03-e04`, `m03-e11`, `m03-e18 [fonctionnel-etendu]` |
| **5 — divers** | `m01-e18` (climax + leap-recovery), `m03-e17 [pandiatonique]` (fenêtre de climax) |

Le dossier 4 est le pendant du dossier 1, côté M3 : mêmes familles `vl.*`, mais
la décision n°31 a établi que les `authorNotes` de M3 parlent SATB. Les
`vl.spacing` de `m03-e04` et `m03-e11` sont les deux textures « tapis +
arabesque » revendiquées, dont seule une partie est couverte par le test de
stratification de la passe 8 (le tapis réattaque au premier temps de chaque
mesure). C'est le prochain dossier instructible.

**Le verrou n'est pas vert, le tag `v0.2-engine-core` n'est pas posé.**
