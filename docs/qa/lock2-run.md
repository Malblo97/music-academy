# Verrou n°2 — journal de calibrage (S5–S6)

Ce fichier **est** la preuve de calibrage du moteur. Une ligne par rouge résolu :
l'identifiant, le diagnostic, le correctif. Rien n'y entre sans avoir été
diagnostiqué d'abord — et aucun seuil n'y est baissé pour faire passer une pièce.

**Périmètre** : M1 (27 solutions) + M2 (28) + M3 (31) = **86 fichiers**.
Le Guide annonce 87 (M2 : 29) ; le corpus extrait en compte 28. L'écart est un
manque de CONTENU, pas de moteur — voir « Reste à faire ».

**Outil** : `pnpm analyze <solution.json> --spec` pour une pièce,
`pnpm analyze --spec` pour le tableau de bord complet.

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
| Passe 6 — F-0 à F-5 (périmètre, puis `harmony.*`/`vl.*`) | 19/26 | 11/27 | 19/20 | **42 pleinement verts sur 73 — et 13 pièces sorties du périmètre** |

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
sont pas repliées en `mono` : compilées ainsi, **16 des 17 candidates passaient
la barre sans qu'une seule règle d'harmonie ne leur soit posée** — vert et creux,
exactement ce que la décision n°29(2) refusait. Aucun `Submission['kind']` ne
décrit une texture à densité variable ; c'est ce qui manque, et c'est écrit.

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

## Reste à faire

**31 solutions** du lot A encore rouges, **13** au lot B. Les blocages `vl.*`
restants sont peu nombreux et **le diagnostic n'est plus le moteur** : le sondage
de la passe précédente sur `m01-s40` s'est confirmé pièce par pièce.

| Occurrences | Règle | À instruire |
|---|---|---|
| 4 sol. | `vl.parallel-perfects` | **les quintes sont RÉELLES** (diagnostic B). `m01-s32` : quintes parallèles franches soprano/alto (A4/D4 → D5/G4). `m01-s35`, `m01-s40` : douzièmes parallèles alto/basse. `m01-s40` cumule quintes parallèles ET octave directe sur sa parfaite finale. Ce sont des exercices d'HARMONIE dont les `authorNotes` vérifient le chiffrage et la basse, jamais la conduite — au contraire de M3, dont les `authorNotes` parlent SATB. Trancher : corriger le contenu M1, ou acter que ces solutions sont des voicings de clavier et non des chorals. |
| 4 sol. | `vl.direct-perfect` | même famille. Les sopranos concernés arrivent par SAUT, donc l'exception « soprano par degré » — celle que `m03-s02` revendique — ne les couvre pas. |
| 7 occ. | `vl.spacing` | concentrées sur deux textures larges revendiquées : le tapis+arabesque de `m03-s11` et `m03-s04`. Le `when` de la règle s'exclut lui-même des « textures orchestrales larges » sans que le code l'implémente — mais le faire proprement demande un critère, pas une exception ; à instruire avec les profils. |

Le gros du rouge restant n'est plus harmonique : **16 des 31** sont les mélodies
de M2 (`melody.*`, `rhythm.prosody`, contraintes de motif), un chantier distinct.

**Aucun seuil de `scoring.ts` n'a été touché dans cette passe non plus**, et
aucun poids de profil.

| Occurrences | Règle | À instruire |
|---|---|---|
| 17 sol. | `vl.parallel-perfects` | vérifié par sondage sur m01-s40 : les quintes parallèles composées y sont RÉELLES entre basse et voix interne. Reste à trancher si l'écriture de clavier des solutions justifie une exception, ou si les solutions sont à corriger (diagnostic B). |
| 13 sol. | `harmony.unresolved-seventh` | les septièmes de M3 (couleur, pas tension) — probablement une affaire de profil. |
| 12 sol. | `vl.leading-tone-resolution` | résiduel après A-4, A-5 et B-5, à instruire pièce par pièce. |

Contraintes encore en échec, toutes à faible occurrence : `minMotifOccurrences`
(4), `contourShape` (3), `climaxWindow` (3), `lengthBars` (3), `minEnrichedChords`
(2), `phraseStructure` (2), `ascendingPhrasePeaks` (2), `syncopationTarget` (2),
`flatTension` (2), plus neuf clés à une occurrence.

**Trois `lengthBars` sont des manques de contenu, pas de moteur** (diagnostic B) :
m01-s42 mesure 7 mesures pour 8 demandées, m02-s03 en mesure 6,75 pour 8, et
m02-s25 en mesure 4 pour 16 — cette dernière étant vraisemblablement une boucle
à répéter quatre fois, ce que la solution ne dit pas.

**Aucun seuil de `scoring.ts` n'a été touché.** Les constantes de calibrage
(`SEVERITY_PENALTY`, `MAX_ISSUES_SHOWN`, `IMPROVED_VERSION_MAX_CHANGE`,
`AMBIGUOUS_KEY_CONF`) sont celles du tutoriel, intactes.
