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
| Après la remontée décrite ci-dessous | 13/27 | 9/28 | 17/31 | **39/86** |

Le verrou pose DEUX conditions par solution : la note ≥ 85 **et** aucune
contrainte non tenue hors performance. **39 atteignent la note**, dont **33
passent aussi la seconde clause** — les 6 restantes sont notées assez haut
malgré une contrainte en échec, et figurent dans « Reste à faire ».

Points perdus en moyenne, par terme de la rubric : correctness 6,6 (départ 8,5) ·
contraintes 3,8 · craft 7,7 (départ 12,9).

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
sont des manques de contenu (voir B-1).

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

## Reste à faire

47 solutions encore rouges. Les postes de coût, par ordre :

| Coût | Règle / clé | À instruire |
|---|---|---|
| 124 pts | `vl.parallel-perfects` (17 sol.) | vérifiées par sondage sur m01-s40 : les quintes parallèles composées y sont RÉELLES entre basse et voix interne. Reste à trancher si l'écriture de clavier des solutions justifie une exception, ou si les solutions sont à corriger (diagnostic B). |
| 116 pts | `vl.leading-tone-resolution` (16 sol.) | résiduel après A-4/A-5, à instruire pièce par pièce |
| 63 pts | `melody.climax` (24 sol.) | sur les exercices qui déclarent bien une forme : le seuil ou la mesure du sommet |
| 56 pts | `vl.spacing` (10 sol.) | l'écart > 12 demi-tons entre voix supérieures est-il pertinent sur une écriture de clavier ? |
| 8 sol. | `requiredCadence` | `detectCadences` ne trouve que 2 des 4 cadences de m01-s30, qui est LE laboratoire de cadences. À instruire en premier : c'est le crash-test annoncé de M3. |
| 6 sol. | `key` | `estimateKey` sur des pièces modales ou à modulations |
| 3 sol. | `lengthBars` | m01-s42 (7 mesures pour 8), m02-s03 (6,75 pour 8), m02-s25 (4 mesures pour 16 — boucle à répéter ?) : diagnostic **B**, contenu à vérifier |

**Aucun seuil de `scoring.ts` n'a été touché.** Les constantes de calibrage
(`SEVERITY_PENALTY`, `MAX_ISSUES_SHOWN`, `IMPROVED_VERSION_MAX_CHANGE`,
`AMBIGUOUS_KEY_CONF`) sont celles du tutoriel, intactes.
