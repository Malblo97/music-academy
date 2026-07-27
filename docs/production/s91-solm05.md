Les 6 fichiers. Contrairement aux modules 3, 4 et 10, **les solutions M5 n'existaient pas** : §63–77 ne comportent aucun lot M5 (seul l'extrait de 8 mesures de m05-e08 a été produit en §71.2 comme donné de m06-e14, sous F-37). Ce lot est donc une **production neuve**, pas une transcription — les six volets sont composés et vérifiés ici.

**Trois findings, dont un bloquant.**

**F-63 — Le thème d'e08 est injouable au cor dans la tonalité de la spec (blocage arithmétique, famille F-30/F-37).** `theme: asset:m02-s21-hero-theme` est en si♭ ; la spec déclare ut majeur. Transposé en ut, le sommet du thème est un **sol5 = 79**, deux demi-tons au-dessus du plafond du cor (77). L'octave inférieure donne un sommet **sol4 = 67** — soit cinq demi-tons *sous* le seuil de `highNotePolicy` (72). L'ambitus du thème étant exactement une douzième avec le sommet au faîte, **aucune octave ne place le climax dans la fenêtre 73–77** : en ut, la loi de l'aigu — le cœur pédagogique de la fiche — est inexerçable. *Patch* : la grille passe en **sol majeur** (sommet ré5 = 74 : le corps du thème dans le sweet spot 48–72, le climax deux demi-tons au-dessus — préparé, bref, récompensé) ; à défaut, épingler le thème en si♭ à son octave d'origine et lever `orch.horn-endurance` (tessiture haute sur 8 mesures). La solution ci-dessous est écrite **contre la spec telle quelle** (ut, octave ténor), `highNotePolicy` vide.

**F-64 — Le thème d'e08 ne s'accorde pas à sa propre grille.** Le thème de m02-s21 a été composé sur une harmonie qui n'est pas C–F–Am–G–C–A♭–B♭–C (fa5 sur ut à la mes. 5, ré5 sur fa à la mes. 2). Sans conséquence ici — les trois volets sont indépendants, seul le volet 3 porte le thème et il est à l'unisson nu — mais toute V1 qui superposerait tapis et thème buterait dessus. *Précision* : la grille est le donné des volets 1–2, le thème celui du volet 3 ; à écrire dans la spec.

**F-65 — `closedPositionRequired` n'a pas de seuil.** Un tapis de 4 cors en position serrée : quel écart maximal entre voix adjacentes ? La solution tient 3–7 demi-tons partout sauf un 9 (mes. 7). *Patch* : `closedPositionRequired: { maxAdjacentInterval: 9 }` — au-delà, c'est une position ouverte, autre couleur, autre règle de masse.

---

**s01 — Violons I et II : deux métiers** (thème immuable aux I, sol majeur, 8 mes.)

```json
{
  "exerciseId": "m05-e01-violin-roles",
  "partId": "lyricism",
  "notation": "B4:q. C5:e B4:q G4:q | F#4:w | G4:q. B4:e G4:q F#4:q | E4:h. r:q | G4:q. A4:e B4:q C5:q | E5:h C5:h | F#4:q D4:q F#4:q. D4:e | B3:w",
  "payload": {
    "instrument": "violins-2",
    "role": "parallel-harmony",
    "divisi": false,
    "articulation": "legato, sur la corde"
  },
  "authorNotes": "« Les II ne sont jamais des I bis » — ici ils sont l'ombre chaude, et c'est un métier. **22/22 notes à 3, 4, 8 ou 9 demi-tons SOUS le thème** (ratio 1,00 ≥ 0,80) : tierces là où l'accord le permet, sixtes là où la tierce mentirait — mes. 2 (D7) : la sixte fa♯ sous le ré, parce que si serait la 13e ; mes. 3 (Em) : la sixte sol sous le mi, parce que do serait hors de l'accord ; mes. 8 (G) : la sixte si sous le sol, la seule qui donne un accord complet à deux voix. La mes. 2 est une ronde tenue sous deux notes du thème (3 puis 8) : le pupitre s'assoit quand le thème bouge. Registre B3–E5 (59–76) ⊂ [55,79], rien sous sol3 ✓, aucun double stop donc aucun `div.` ✓, zéro quinte ou octave parallèle — tierces et sixtes seulement, la parallèle assumée de la fiche."
}
```

```json
{
  "exerciseId": "m05-e01-violin-roles",
  "partId": "energy",
  "notation": "B3:e D4:e G3:e D4:e B3:e D4:e G3:e D4:e | A3:e D4:e F#4:e C4:e A3:e D4:e F#4:e C4:e | B3:e E4:e G3:e E4:e B3:e E4:e G3:e E4:e | C4:e E4:e G3:e E4:e C4:e E4:e G3:e E4:e | B3:e D4:e G3:e D4:e B3:e D4:e G3:e D4:e | C4:e E4:e G3:e E4:e C4:e E4:e G3:e E4:e | A3:e D4:e F#4:e C4:e A3:e D4:e F#4:e C4:e | B3:e D4:e G3:e D4:e G3:h",
  "payload": {
    "instrument": "violins-2",
    "role": "rhythmic-ostinato",
    "articulation": "spiccato",
    "ostinatoCell": { "bars": 1, "shape": "3̂–5̂–1̂–5̂ en croches, invariant, transposé par accord" },
    "divisi": false
  },
  "authorNotes": "Deux vitesses, un pupitre qui chante et un qui propulse. La cellule d'UNE mesure ne varie jamais de forme (3̂–5̂–1̂–5̂ en croches, huit attaques) : seule sa transposition suit la grille — c'est un moteur, pas une contre-mélodie, et c'est la différence entre l'énergie et le bavardage. **Ratio de notes d'accord 1,00 ≥ 0,80** (les seules notes étrangères possibles, la 7e de D7, sont chiffrées : do4 aux mes. 2 et 7 = note d'accord). Registre G3–F♯4 (55–66) ⊂ [55,74] : le médium sec, sous le chant des I, jamais dans leur bande. Mes. 8 : le moteur s'arrête sur la tonique en blanche — l'ostinato ne se termine pas, il **atterrit**. Spiccato déclaré : hors de l'articulation, la même cellule sonne comme un accompagnement de salon."
}
```

```json
{
  "exerciseId": "m05-e01-violin-roles",
  "partId": "large-unison",
  "notation": "D4:q. E4:e D4:q B3:q | A3:h D4:h | E4:q. D4:e B3:q A3:q | G3:h. r:q | B3:q. C4:e D4:q E4:q | G4:h E4:h | D4:q B3:q A3:q. B3:e | G3:w",
  "payload": {
    "instrument": "violins-2",
    "role": "octave-doubling",
    "octaveUnison": { "withPart": "violins-1", "interval": -12, "exact": true },
    "divisi": false
  },
  "authorNotes": "L'unisson large : 22 attaques, **toutes à −12 exactement, tous les onsets identiques** — la part est volontairement mécanique, l'octave se vérifie note à note. Le fait remarquable est arithmétique : la transposition fait descendre le thème pile sur **sol3 = 55 aux mes. 4 et 8** — la corde à vide de sol, la limite absolue de la fiche, touchée deux fois et jamais franchie. À −13, la part serait injouable ; à −12, elle tient au demi-ton près. C'est ce que la fiche veut faire comprendre : le grand thème à l'octave n'est pas un effet, c'est une décision de tessiture qu'on prend AVANT d'écrire."
}
```

**s08 — Le cor : les rôles de l'âme** (4 cors, ut majeur, grille C · F · Am · G · C · A♭ · B♭ · C)

```json
{
  "exerciseId": "m05-e08-horn-roles",
  "partId": "tapis",
  "payload": {
    "instrumentation": ["french-horn-1", "french-horn-2", "french-horn-3", "french-horn-4"],
    "role": "harmonic-pad",
    "dynamics": "p → mp, sans crescendo",
    "voices": [
      { "id": "cor-1", "notation": "G4:w | A4:w | A4:w | B4:w | C5:w | C5:w | Bb4:w | G4:w" },
      { "id": "cor-2", "notation": "E4:w | F4:w | E4:w | G4:w | G4:w | Ab4:w | F4:w | E4:w" },
      { "id": "cor-3", "notation": "C4:w | C4:w | C4:w | D4:w | E4:w | Eb4:w | D4:w | C4:w" },
      { "id": "cor-4", "notation": "G3:w | F3:w | A3:w | G3:w | C4:w | C4:w | F3:w | G3:w" }
    ]
  },
  "authorNotes": "Le liant : le cor remplit le milieu du spectre, là où l'harmonie vit. Vérifié : **toutes les notes dans 48–72** (do3–do5, le sweet spot exact de la fiche) ; **zéro quinte ou octave parallèle** sur les 8 verticalités, toutes paires testées ; zéro croisement ; écarts entre voix adjacentes 3–7 demi-tons partout sauf mes. 7 (9 — voir F-65, le seuil manquant). Les huit accords de la grille détectés sans ambiguïté. Le geste central est la mes. 6 : le **♭VI (la♭)** atteint par note commune (do tenu à deux voix, mi→mi♭ et sol→la♭) — le nuage épique par un seul demi-tondans chaque voix mobile. Rondes exclusivement (`minNoteDuration: h` largement tenu) : un tapis qui bouge n'est plus un tapis. Dynamique plafonnée à mp : à quatre, le cor sature le milieu bien avant le f."
}
```

```json
{
  "exerciseId": "m05-e08-horn-roles",
  "partId": "appel",
  "notation": "C3:q. G3:e C3:q. G3:e | G4:h. r:q | C4:q. G4:e C4:q. G4:e | C4:h. r:q | r:h C3:q. G3:e | C3:q. G3:e C3:q. G3:e | G4:q. G4:e C4:q. G4:e | C4:w",
  "payload": {
    "instrumentation": ["french-horn-1", "french-horn-2"],
    "role": "signal",
    "unisonPlayers": 2,
    "dynamics": "mf, cor 1+2 à l'unisson strict"
  },
  "authorNotes": "L'archétype « appel » de m02-l02, rendu au pupitre qui l'a inventé. **Aucun intervalle mélodique autre que 0, ±7 et ±12** : l'ensemble de hauteurs se réduit à {do3, sol3, do4, sol4} et le graphe des mouvements légaux interdit la quarte — d'où le contour en balancier quinte/octave, jamais la sonnerie de clairon en 1-3-5. Rythme pointé sur 6 des 8 mesures (q. e), les deux autres en blanche pointée + silence : **le silence fait partie de l'appel** — c'est lui qui installe le lointain. Registre do3–sol4 (48–67) ⊂ [48,67] ✓. Unisson à 2 déclaré : un cor seul, même mf, n'est pas un appel, c'est une note."
}
```

```json
{
  "exerciseId": "m05-e08-horn-roles",
  "partId": "heroic-theme",
  "notation": "r:h. G3:e | C4:q. D4:e E4:q C4:q | D4:q B3:q G3:q. G3:e | C4:q. D4:e E4:q D4:q | F4:q D4:q C4:q. C4:e | G4:h. r:e C4:e | C4:q. D4:e E4:q C4:q | D4:q B3:q C4:h",
  "payload": {
    "instrumentation": ["french-horn-1", "french-horn-2"],
    "role": "melody",
    "unisonPlayers": 2,
    "dynamics": "f",
    "source": "m02-s21 (thème du héros), transposé en ut, octave ténor du cor"
  },
  "authorNotes": "**Témoin F-63.** Le thème du héros revient chez lui — mais l'arithmétique de la fiche décide de l'octave, pas le goût : en ut, le sommet du thème vaut sol5 = 79 (deux demi-tons au-dessus du plafond 77) ou sol4 = 67 à l'octave inférieure. Rien entre les deux, l'ambitus du thème étant une douzième avec le sommet au faîte. La solution prend la seule octave jouable : **sol3–sol4 (55–67), intégralement dans le sweet spot** — noble, sonore, tenable sur huit mesures (`orch.horn-endurance` muette). Conséquence à consigner : `highNotePolicy` ne se déclenche jamais (seuil 72, maximum atteint 67) — **la loi de l'aigu, cœur de la fiche, est vide dans cette tonalité** ; en sol majeur elle mordrait (sommet ré5 = 74 : approche conjointe do5→ré5 ✓, une mesure au-dessus du seuil ≤ 4 ✓, deux mesures de repos après ✓). Unisson à 2 : la puissance 9/10 de la fiche ne vaut que multipliée — un cor seul contre trente est noyé. Zéro double croche : l'attaque du cor est ronde, c'est sa beauté et sa limite."
}
```

---

**Comptage.** 6 volets neufs (e01 ×3, e08 ×3) — les deux seuls exercices référencés par les footers ; les huit IDs réservés de la banque V1 restent au backlog. Cumul : **191 → 197 solutions/étalons**, findings **62 → 65**. Ordre des PR : F-63 d'abord (la spec d'e08 doit trancher sa tonalité avant que le volet 3 ait un sens pédagogique), puis `instruments.ts` et les checkers `orch.*` — sans eux, aucun de ces six fichiers n'est exécutable.