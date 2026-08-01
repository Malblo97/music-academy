---
id: m05-l06-harpe
module: module-05-instrumentation
title: "La harpe"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `Cb1`–`G#7` (47 cordes ; en pratique raisonne `C1`–`G7`, sons réels) |
| Sweet spot | `C2`–`C6` |
| Agilité | 9/10 **dans un accordage donné** — 3/10 dès qu'il faut changer de pédale |
| Tenue | AUCUNE : la corde décroît (même mensonge que le piano, l21) |
| Puissance | pp 1/10 → ff 4/10 — le pupitre le plus fragile de l'orchestre |

### Pourquoi irremplaçable

La harpe n'est ni une grosse guitare ni un piano à cordes pincées : c'est une **machine diatonique** qui produit trois choses qu'aucun autre instrument ne fait. Le *glissando* — quarante notes lancées en une seconde puis plus rien. La *résonance arpégée* — l'accord qui se dépose au lieu de sonner. L'*harmonique* — ce son de verre soufflé, une octave au-dessus, qui ne ressemble à rien d'autre. Elle est l'instrument du halo : l'eau, le rêve, la magie, et surtout **la transition** (le geste de harpe qui fait basculer une scène d'un état à un autre coûte une mesure et remplace un montage).

### Le piège des pédales — la section qui compte

```
  pied gauche        pied droit
  D   C   B    |    E   F   G   A
  ↑   ↑   ↑         ↑   ↑   ↑   ↑
  chaque pédale = 3 positions : ♭  ♮  ♯
  et elle s'applique à TOUTES les octaves à la fois
```

Conséquences non négociables : pas de gamme chromatique, pas de `F4` et `F#4` simultanés, pas de modulation instantanée. Un changement de pédale prend du temps (compte une croche à tempo modéré) et **fait du bruit** (le clac de la tringlerie s'entend en pp exposé). Un pied ne bouge qu'une pédale à la fois : deux changements simultanés maximum, un par pied.

En échange, l'enharmonie est ton outil : `C♭` = si, `E♯` = fa. Deux cordes voisines accordées sur la même hauteur permettent la **note répétée rapide** (impossible autrement : une corde qui vibre encore ne se repince pas proprement) et le **bisbigliando**, ce frémissement chuchoté sur deux doigts.

**Glissando** : le réglage des pédales *est* la gamme. Le diatonique (7 sons) est le tout-venant ; la vraie signature, c'est le pentatonique et surtout la **septième diminuée** (4 sons doublés) — le glissando de vertige, celui du basculement narratif. Écris toujours la gamme voulue en toutes lettres au-dessus du trait.

### Rôles

| Rôle | Écriture |
|---|---|
| Le geste de bascule (n° 1) | glissando ou arpège montant sur un changement d'harmonie |
| Arpèges d'accompagnement | figures larges, main gauche/main droite alternées — le tapis liquide |
| Ponctuation-résonance | accord plaqué p, laissé vibrer sous une tenue de cordes |
| Basse pincée | notes graves espacées : la marche sombre, la goutte (parenté avec le piano, l21) |
| Harmoniques | sons de verre, exposés, orchestre quasi muet |
| Doublure de contour | double la mélodie en notes pincées : donne de l'attaque sans donner du timbre |

### Associations

Harpe + flûte = l'archétype pastoral/aquatique ; + célesta (l22) = la magie au carré (attention : ils se doublent mal, ils se répondent bien) ; + cordes en harmoniques ou sourdines = le halo suspendu ; + pizzicati de cordes = la ponctuation amplifiée ; + piano = méfiance, deux décroissances qui s'annulent, choisis.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Écriture chromatique ou altération contradictoire dans la même mesure | `orch.harp-pedal` — physiquement injouable, pas « difficile » |
| Glissando sans gamme spécifiée | `orch.harp-pedal` — le produit ne peut pas deviner l'accordage |
| Accords de 5 sons et plus par main | `orch.harp-hand` — 4 doigts par main, pas d'auriculaire : 8 sons maximum |
| Note répétée vite sur la même corde | l'étouffement parasite : passe par l'enharmonie (deux cordes) |
| ff attendu sous un tutti | `orch.balance` — 4/10 : la harpe se protège, elle ne s'impose jamais |
| Traiter la résonance comme une tenue | même piège que le piano : elle décroît |

- [ ] Machine diatonique : 7 pédales, 3 positions, toutes les octaves à la fois
- [ ] L'enharmonie donne la note répétée, le bisbigliando et le glissando pentatonique/dim7
- [ ] Elle ne force jamais : geste, halo, bascule — jamais volume

<QuizBlock id="m05-l06-quiz" questions={5} />

---
id: m05-l08-piccolo
module: module-05-instrumentation
title: "Le piccolo"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `D5`–`C8` en sons réels (écrit une octave plus bas — le produit gère) |
| Sweet spot | `D6`–`A7` |
| Agilité | maximale (10/10) — comme la flûte, en plus nerveux |
| Tenue | courte : l'air part vite, les phrases doivent respirer souvent |
| Puissance | pp 1/10 → **ff 10/10** : à égalité avec la trompette, le sommet du tutti |

### Pourquoi irremplaçable

Le piccolo est le **plafond de l'orchestre**. Il n'ajoute pas une couleur, il ajoute une *altitude* : dans un tutti ff, c'est lui qui donne l'impression que le son monte encore alors que tout le monde est déjà au maximum. C'est aussi la stridence — le sifflet, la tempête, la marche militaire, l'oiseau dément, le cri glacé. Corollaire immédiat : **il ne sait pas être discret**. Un piccolo dans une texture, on l'entend, point final.

### Couleur par registre

```
D5 ────── G5 ────── D6 ─────────── A7 ────── C8
│ GRAVE   │ MÉDIUM  │    AIGU       │ EXTRÊME │
│ faible, │ pâle,   │ brillant,     │ strident,│
│ terne,  │ sans    │ perçant —     │ douloureux,│
│ inutile │ identité│ LE piccolo    │ justesse │
│ (1/10)  │ (flûte  │ (90 % du rôle)│ hasardeuse│
│         │  en moins)│             │          │
```

Le grave du piccolo est doublement inutile : trop faible pour porter, et la flûte fait la même chose en mieux dans cette zone. Le médium est une flûte appauvrie. **Tout l'intérêt du piccolo commence à `D6`** — au-dessus du plafond de la flûte utile, là où il est seul.

### Rôles

| Rôle | Écriture |
|---|---|
| Le sommet du tutti (n° 1) | doublure des flûtes/violons à l'octave sup., ff : l'altitude ajoutée |
| Traits et arabesques éclairs | doubles croches, gammes, trilles : le scintillement nerveux |
| L'oiseau / le sifflement | motifs courts, exposés, aigus — le grotesque ou le sauvage |
| Le froid glacé | tenue aiguë pp exposée, orchestre suspendu : la tension irréelle |
| La marche | doublure aiguë des bois sur rythme pointé — l'archétype militaire |

### Associations

Piccolo + flûtes à l'octave = la lumière classique poussée d'un cran ; + violons suraigus (l02) = la lame brillante ; + triangle/glockenspiel (l25) = le scintillement composite ; + clarinette en chalumeau = l'écart extrême de registre, le vide entre les deux devient un effet.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| L'employer « pour doubler discrètement » | il ne fait rien discrètement (`orch.balance`) : soit tu l'assumes, soit tu ne l'écris pas |
| Écrire dans son grave | `orch.register-color` — donne-le à la flûte, c'est son territoire |
| Extrême aigu tenu | `orch.endurance` — pénible pour l'instrumentiste, douloureux pour l'auditeur, faux pour tout le monde |
| Piccolo en continu sur une longue séquence | l'oreille sature : c'est un condiment, pas un pupitre de fond |
| Oublier qu'un flûtiste double | en session, c'est le 2e ou 3e flûtiste qui prend le piccolo : laisse-lui 2–4 mesures pour changer |

- [ ] Le piccolo commence à `D6` — en dessous, c'est une flûte en moins bien
- [ ] ff 10/10 : le plafond du tutti, jamais le remplissage
- [ ] Condiment : bref, assumé, espacé

<QuizBlock id="m05-l08-quiz" questions={5} />

---
id: m05-l09-flute-alto
module: module-05-instrumentation
title: "La flûte alto"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `G3`–`G6` en sons réels (instrument en sol : écrit une quarte au-dessus — le produit gère) |
| Sweet spot | `G3`–`D5` |
| Agilité | 8/10 — agile, mais plus lourde à mettre en vibration que la flûte |
| Tenue | **la plus courte des bois** : elle consomme énormément d'air pour peu de son |
| Puissance | pp 1/10 → ff 3/10 — le pupitre mélodique le plus faible de l'orchestre |

### Pourquoi irremplaçable

La flûte alto existe pour **une seule zone** : son grave, `G3`–`D4`. Là, elle produit un timbre que rien d'autre ne donne — velouté, sombre, avec un halo de souffle audible autour de la note, comme une voix qui parle tout près du micro. C'est la couleur du mystère doux, de l'antique, du sous-marin, du rêve éveillé (Ravel, Holst, et à peu près tout le fantasy symphonique depuis).

Sa faiblesse n'est pas un défaut à compenser : c'est la condition de son emploi. **Tu n'écris pas de la flûte alto, tu écris du silence autour d'une flûte alto.**

### Couleur par registre

```
G3 ───────────── D5 ─────── D6 ────── G6
│    GRAVE       │  MÉDIUM   │  AIGU   │
│ velouté, sombre,│ neutre — │ inutile:│
│ souffle audible │ une flûte│ prends  │
│ — LA raison     │ un peu   │ une     │
│ d'exister       │ terne    │ flûte   │
```

Plus tu montes, plus elle redevient une flûte médiocre. Le test est simple : si le passage sonnerait aussi bien à la flûte, écris-le pour la flûte.

### Rôles

| Rôle | Écriture |
|---|---|
| Solo grave exposé (n° 1) | mélodie `G3`–`C5`, accompagnement pp minimal ou rien du tout |
| Doublure des flûtes à l'octave inf. | épaissit le bois par en dessous, sans le noircir comme la clarinette |
| Couleur de tapis | tenues graves p sous des cordes con sordino : la brume |
| Le souffle comme timbre | jeu volontairement soufflé, flatterzunge doux : la texture organique (utile en hybride, M6) |
| Duo avec cor anglais ou alto | l'unisson des voilés : le médium doux-amer poussé au maximum |

### Associations

Flûte alto + altos (l03) = fusion presque parfaite, deux timbres voilés qui n'en font qu'un ; + harpe = l'archétype du rêve ; + clarinette en chalumeau = le nocturne épaissi ; + cordes en sourdine = le lit idéal, le seul qui ne la couvre pas.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| L'écrire sous un accompagnement normal | `orch.masking` — erreur n° 1, et elle est fatale : on n'entend rien du tout |
| L'employer dans l'aigu | `orch.register-color` — tu paies un instrument rare pour une flûte quelconque |
| Phrases longues sans respiration | `orch.endurance` — elle vide un flûtiste deux fois plus vite qu'une flûte |
| L'écrire en section (2–3 flûtes altos « pour le volume ») | trois fois rien reste rien : le volume ne s'additionne pas à ce niveau |
| Oublier le changement d'instrument | c'est un flûtiste qui double : 2–4 mesures pour poser la flûte et prendre l'alto |

- [ ] Une seule zone la justifie : `G3`–`D5`
- [ ] Tu écris le silence autour d'elle, pas seulement sa ligne
- [ ] Si ça marcherait à la flûte, c'est de la flûte

<QuizBlock id="m05-l09-quiz" questions={5} />

---
id: m05-l11-cor-anglais
module: module-05-instrumentation
title: "Le cor anglais"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `E3`–`B5` en sons réels (hautbois en fa : écrit une quinte au-dessus — le produit gère) |
| Sweet spot | `F3`–`D5` |
| Agilité | 6/10 — un cran sous le hautbois, plus lourd à articuler |
| Tenue | excellente ; même paradoxe que le hautbois : c'est l'expiration qui fatigue |
| Puissance | pp 2/10 → ff 4/10 — moins pénétrant que le hautbois, mais toujours audible |

### Pourquoi irremplaçable

Le cor anglais est un hautbois qui a vieilli. Même anche double, même façon de *parler* plutôt que de chanter (voir l10), mais le pincé s'est arrondi, le nasal est devenu voilé, et la voix s'est éloignée. Résultat : **il ne raconte pas au présent, il se souvient**. C'est l'instrument du lointain, de l'exil, de la plaine vide, de la chose perdue — le solo qui installe une nostalgie en quatre notes sans qu'aucune image ne soit nécessaire.

Là où le hautbois focalise et expose, le cor anglais **estompe** : c'est un solo narratif à qui on a mis une distance.

### Couleur par registre

```
E3 ──────── F3 ─────────── D5 ────── B5
│  GRAVE    │    MÉDIUM     │  AIGU   │
│ épais,    │ voilé, ample, │ pressé,  │
│ pâteux,   │ mélancolique  │ tendu,   │
│ sourd     │ — LE cor      │ proche du│
│ (rare)    │   anglais     │ hautbois │
```

Son aigu perd son identité (il redevient un hautbois moins net) ; son grave s'empâte. Toute la valeur est dans le médium, et il est large : une bonne octave et demie de pure couleur.

### Rôles

| Rôle | Écriture |
|---|---|
| Le solo du souvenir (n° 1) | mélodie médium, phrasés longs et vocaux, orchestre en retrait |
| Contrechant voilé | réponse au thème des violons dans les creux — l'ombre qui commente |
| Renfort de couleur | unisson avec altos ou violoncelles : donne un grain d'anche à la corde |
| Tenue d'harmonie dans les bois | plus fondu que le hautbois, mais toujours identifiable : à doser |
| Le pastoral lointain | motif d'appel, souvent hors scène ou avec réverbération longue |

### Associations

Cor anglais + altos (l03) = la mélancolie au carré, la doublure signature ; + clarinette en chalumeau = le nocturne grave ; + cor bouché = le lointain composite ; + harpe = le souvenir suspendu ; hautbois **et** cor anglais en duo (tierces) = la famille qui se parle, un des plus beaux effets de bois.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| L'écrire dans l'aigu | `orch.register-color` — tu perds exactement ce pour quoi tu l'as choisi |
| L'utiliser comme un hautbois qui perce | `orch.balance` — 4/10 : il traverse une texture légère, pas un tutti |
| Solo permanent | la nostalgie ne fonctionne qu'une fois par pièce : un vrai solo de cor anglais est un événement |
| Phrases sans expiration | `orch.endurance` — comme le hautbois, il faut VIDER l'air : écris les silences |
| Oublier le changement d'instrument | c'est le 2e ou 3e hautboïste qui double : 2–4 mesures pour changer d'anche et d'instrument |

- [ ] Le hautbois raconte au présent, le cor anglais se souvient
- [ ] Tout est dans le médium `F3`–`D5` ; l'aigu le banalise
- [ ] Un solo par pièce : c'est un événement, pas une couleur de fond

<QuizBlock id="m05-l11-quiz" questions={5} />

---
id: m05-l13-clarinette-basse
module: module-05-instrumentation
title: "La clarinette basse"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `Bb1`–`G5` en sons réels (en si♭ : écrite une neuvième au-dessus — le produit gère) |
| Sweet spot | `Bb1`–`F3` (le chalumeau prolongé) |
| Agilité | 8/10 — étonnamment leste pour sa taille |
| Tenue | excellente ; le ppp le plus grave et le plus doux de l'orchestre |
| Puissance | ppp 1/10 → ff 6/10 |

### Pourquoi irremplaçable

C'est le **chalumeau prolongé vers l'abîme** (voir l12). La clarinette basse descend une octave sous la clarinette avec la même douceur, la même absence d'attaque agressive — et c'est exactement ce qui la rend unique : elle est le **seul grave feutré** de l'orchestre. Le basson grogne, le contrebasson gronde, les contrebasses pèsent, le trombone basse menace ouvertement. La clarinette basse, elle, *rôde* : un grave sans poids, sans grain, qui glisse sous une texture et l'assombrit sans qu'on sache d'où ça vient.

C'est l'instrument du danger poli. Le pas dans le couloir. Le monstre avant qu'on le voie.

### Couleur par registre

```
Bb1 ─────────── F3 ──── C4 ────── G4 ─────── G5
│  CHALUMEAU GRAVE│GORGE │ CLAIRON  │ AIGU     │
│ velouté, noir,  │ pâle,│ chantant,│ nasillard,│
│ menaçant,       │ terne│ proche de│ étrange   │
│ sans poids —    │ (tra-│ la clari-│ (effet,   │
│ LA raison       │ verse│ nette    │ pas chant)│
│ d'exister       │  vite)│ normale │           │
```

Même architecture que la clarinette : trois instruments, une gorge à traverser. Mais ici, la proportion s'inverse — le chalumeau représente **90 % de son emploi utile**. Dans le clairon, elle fait ce qu'une clarinette ordinaire fait mieux.

### Rôles

| Rôle | Écriture |
|---|---|
| La menace feutrée (n° 1) | ligne ou tenue grave pp, sous une texture calme : l'inquiétude sans cause |
| Basse des bois | fondamentales p–mf, plus souple et moins boisée que le basson |
| Ostinato sombre | croches détachées `Bb1`–`C3` : le moteur du suspense (le pouls qui approche) |
| Doublure des violoncelles / bassons | ajoute du velours à la ligne grave sans ajouter de grain |
| Solo grave exposé | rare et saisissant : la confession noire, le jazz-noir (m09-l03) |
| Entrée invisible | tenue ppp démarrée dans un accord déjà sonnant — le tour de la famille |

### Associations

Clarinette basse + violoncelles = la ligne grave chantante et feutrée ; + contrebasses pizz = le pouls noir ; + cor bouché = la couleur trouble ; + clarinettes (famille complète en accord) = le choral de velours, un des plus beaux tutti de bois ; + synthé/pad grave (M6) = le pont naturel vers l'hybride.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| La réduire à « doubler le basson » | `orch.role-coverage` — tu paies un timbre unique pour un renfort : donne-lui une ligne |
| L'écrire dans le clairon/aigu | `orch.register-color` — une clarinette ordinaire y est meilleure et moins chère |
| Exposer la gorge | `orch.register-color` — même règle que la clarinette : traverse, n'habite pas |
| Compter sur elle pour la puissance grave | `orch.balance` — 6/10 : elle colore le grave, elle ne le soutient pas seule |
| Sous `Bb1` | `orch.range-violation` (et attention : certains instruments s'arrêtent à `C2` — reste à `C2` si tu écris pour n'importe quel orchestre) |

- [ ] Le seul grave feutré : sans poids, sans grain, sans attaque
- [ ] 90 % chalumeau ; le clairon ne la justifie pas
- [ ] Menace, ostinato noir, entrée invisible — pas un doubleur de basson

<QuizBlock id="m05-l13-quiz" questions={5} />
---
id: m05-l14-basson
module: module-05-instrumentation
title: "Le basson"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `Bb1`–`Eb5` (praticable serein `Bb1`–`C5`) |
| Sweet spot | `G2`–`G4` |
| Agilité | 7/10 — remarquable en staccato, plus lourd en legato rapide |
| Tenue | bonne ; il consomme beaucoup d'air dans le grave |
| Puissance | pp 2/10 → ff 6/10 |

### Pourquoi irremplaçable

Le basson est le **ténor et la basse des bois en une seule personne**, et il a deux visages qu'aucun autre instrument ne réunit. En notes liées, médium, c'est la voix la plus humaine des bois après le hautbois : grave, un peu voilée, poignante — la voix du vieil homme, de la dignité fatiguée, de la confidence. En staccato, c'est le pitre officiel de l'orchestre : sec, rebondissant, comique, et à un cheveu du macabre (le même détaché qui fait rire fait peur si on baisse la lumière).

Il est aussi le **liant du grave** : il colle aux cors, aux violoncelles, aux clarinettes. Sans bassons, la famille des bois n'a pas de fondations.

### Couleur par registre

```
Bb1 ─────── G2 ─────────── G4 ────── C5 ── Eb5
│  GRAVE    │    MÉDIUM     │  AIGU   │EXTRÊME│
│ râpeux,   │ voilé, humain,│ pincé,  │ étran-│
│ sombre,   │ chantant —    │ étranglé,│ glé, │
│ puissant, │ LE basson     │ intense │ effet │
│ un peu    │ (90 % du rôle)│ (voulu) │ pur   │
│ « grognon »│              │         │       │
```

L'aigu du basson n'est pas un défaut à éviter : c'est la tension incarnée — une voix qui force. L'ouverture la plus célèbre du XXe siècle est un basson en haut de sa tessiture, et elle sonne exactement comme quelque chose qui ne devrait pas parler.

### Rôles

| Rôle | Écriture |
|---|---|
| Basse des bois (n° 1) | fondamentales et lignes graves, p–mf : le socle de la famille |
| Chant ténor | mélodie `G2`–`G4` liée, exposée : la confidence, la dignité |
| Le détaché comique/macabre | staccato rapide, sauts d'octave : le pitre ou le squelette |
| Contrechant grave | réponse sombre sous les violons, souvent doublé aux violoncelles |
| Liant harmonique | tenues médium sous les cors : le fondu total (voir l17) |
| L'aigu de tension | mélodie au-dessus de `A4`, exposée : le cri contenu |

### Associations

Bassons + cors = fondu total du médium-grave (la doublure discrète par excellence) ; + violoncelles = le grave boisé et charnu ; + clarinettes = la famille complète, choral doux ; + contrebasson à l'octave (l15) = la basse des bois définitive ; deux bassons en tierces = le duo pastoral-grotesque, un classique.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Le cantonner à la basse | `orch.role-coverage` — c'est un soliste que tu utilises comme un tuyau |
| Legato rapide et chromatique | `orch.agility` — le doigté du basson est le plus tordu de l'orchestre : le staccato passe, le legato virtuose non |
| Accords serrés dans le grave | `orch.low-interval-limit` — même règle que partout : écarte sous `C3` |
| Attendre de la puissance en ff exposé | `orch.balance` — 6/10 : il perd contre les cuivres, toujours |
| Phrases graves interminables | `orch.endurance` — le grave vide un bassoniste vite |
| Sous `Bb1` | `orch.range-violation` — c'est le territoire du contrebasson |

- [ ] Deux visages : la voix humaine liée, le pitre détaché
- [ ] `G2`–`G4` = 90 % ; l'aigu est une tension choisie
- [ ] Basse des bois **et** soliste : ne le réduis pas à un rôle

<QuizBlock id="m05-l14-quiz" questions={5} />

---
id: m05-l15-contrebasson
module: module-05-instrumentation
title: "Le contrebasson"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `Bb0`–`Bb3` en sons réels (écrit une octave au-dessus — le produit gère) |
| Sweet spot | `C1`–`G2` |
| Agilité | 2/10 — l'instrument le plus lent de l'orchestre à parler |
| Tenue | bonne, mais il consomme un volume d'air considérable |
| Puissance | pp 2/10 → ff 5/10 — mais une présence *physique* : on le sent dans le ventre |

### Pourquoi irremplaçable

Le contrebasson est le **sol sous le sol**. Là où les contrebasses définissent le plancher harmonique (l05), lui définit ce qu'il y a en dessous : une vibration plus qu'une note, un grondement qui donne du corps et de la définition à tout le grave orchestral. Son grain d'anche double ajoute quelque chose que les cordes et les cuivres n'ont pas — une **rugosité organique**, un souffle de créature.

Deux emplois canoniques : la fondation invisible (il double la basse à l'octave inférieure et personne ne l'entend consciemment — mais retire-le et l'orchestre rétrécit), et le monstre exposé (une ligne seule, lente, dans le `C1`–`C2` : le grotesque, la bête, la lourdeur comique ou terrifiante).

### Couleur par registre

```
Bb0 ──────── C1 ─────── G2 ─────── Bb3
│  ABYSSAL   │  PROFOND  │  MÉDIUM   │
│ grondement,│ le grain, │ un basson │
│ hauteur    │ la bête,  │ épais et  │
│ floue,     │ LE registre│ terne —  │
│ physique   │  utile    │ sans intérêt│
```

Au-dessus de `G2`, il redevient un basson médiocre : si tu montes là, écris pour un basson. En dessous de `C1`, la hauteur cesse d'être perceptible — c'est un effet de matière, pas une note d'harmonie.

### Rôles

| Rôle | Écriture |
|---|---|
| Doublure de la basse à l'octave inf. (n° 1) | avec bassons/contrebasses/tuba : le corps ajouté au grave |
| Pédale abyssale | tenue longue `C1`–`G1` sous une harmonie mouvante : la gravité qui attend |
| La bête | ligne lente exposée, notes longues, valeurs simples : le grotesque ou la menace |
| Ponctuation grave | notes isolées ff : le coup de pied dans le plancher |
| Le silence | comme la contrebasse : son entrée et sa sortie sont des événements |

### Associations

Contrebasson + contrebasses = le plancher doublé (le grain d'anche donne de la lisibilité à la corde) ; + tuba = la fondation cuivrée-boisée ; + bassons à l'octave = la basse des bois complète ; + grosse caisse / timbales graves (l24, l26) = le tremblement de terre composite ; + clarinette basse = deux graves feutrés/rugueux qui se complètent parfaitement.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Traits rapides, doubles croches | `orch.agility` — 2/10 : l'attaque met un temps réel à s'installer, tout devient de la boue |
| Écriture chromatique rapide | même règle : il ne suit pas |
| Accords ou tierces dans le grave | `orch.low-interval-limit` — des lignes, des octaves, des quintes, jamais des positions serrées |
| L'employer en permanence | il perd tout : l'oreille s'habitue au plancher et ne l'entend plus disparaître |
| L'écrire au-dessus de `G2` | `orch.register-color` — c'est un basson, et un moins bon |
| Sous `Bb0` | `orch.range-violation` |

- [ ] Le sol sous le sol : matière et grain, pas mélodie
- [ ] `C1`–`G2` ; au-dessus c'est un basson, en dessous c'est une vibration
- [ ] Lent, rare, événementiel

<QuizBlock id="m05-l15-quiz" questions={5} />

---
id: m05-l18-trombone-tenor
module: module-05-instrumentation
title: "Le trombone ténor"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `E2`–`Bb4` (praticable serein `F2`–`F4` ; pédales `Bb1` et voisines : effet) |
| Sweet spot | `Bb2`–`D4` |
| Agilité | 5/10 — la coulisse impose un temps de déplacement réel |
| Tenue | excellente ; endurance meilleure que la trompette, à surveiller dans l'aigu |
| Puissance | pp 2/10 → **ff 9/10** — le mur |

### Pourquoi irremplaçable

Le trombone est le seul cuivre à **hauteur continue** : pas de pistons, une coulisse, donc tous les micro-intervalles du monde et le vrai glissando. Il est aussi le timbre du **choral** — deux ténors et une basse (l19) forment le bloc le plus noble et le plus solennel de l'orchestre, celui qui a signifié « sacré » pendant quatre siècles avant de signifier « le mal arrive » pendant un siècle de cinéma.

Sa signature émotionnelle est double : **la noblesse grave** (choral tenu, p–mf, la cathédrale) et **la puissance qui écrase** (ff, accents, la masse qui s'abat). Entre les deux, il n'y a pas grand-chose : le trombone n'est pas un instrument de nuances tièdes.

### Couleur par registre

```
E2 ────── Bb2 ─────────── D4 ────── F4 ── Bb4
│ GRAVE   │    MÉDIUM     │  AIGU   │EXTRÊME│
│ large,  │ noble, plein, │ éclatant,│ tendu,│
│ sombre, │ chantant —    │ tranchant│ coûteux│
│ un peu  │ LE trombone   │ (attention│(solistes)│
│ mou     │ (90 % du rôle)│ endurance)│      │
```

### La coulisse : ce qu'elle autorise et interdit

Sept positions, un demi-ton d'écart chacune. Conséquences concrètes :

- **Legato** : un vrai legato n'existe qu'entre notes de la même série d'harmoniques. Ailleurs, le tromboniste articule légèrement (« legato de coulisse »). Une ligne conjointe rapide et parfaitement liée n'est pas réaliste.
- **Glissando** : uniquement à l'intérieur d'une même position d'harmonique, donc **un triton maximum** (7 positions), et sans changer d'harmonique. Un « glissando » d'une octave n'est pas un glissando, c'est un portamento simulé — écris-le autrement.
- **Vitesse** : les grands écarts de position (I → VII) prennent du temps. Un trait rapide qui saute d'un bout à l'autre de la coulisse s'empâte.

### Rôles

| Rôle | Écriture |
|---|---|
| Le choral (n° 1) | 2 ténors + 1 basse, accords tenus, position ouverte, p–ff : la solennité |
| Le mur | accords ff, valeurs longues ou accents : la puissance brute (l'archétype du danger) |
| Ponctuation / accents | notes courtes marcato : la frappe de cuivre |
| Doublure de basse mélodique | à l'unisson des violoncelles ou du cor : le poids ajouté |
| Le glissando | bref, dans le triton : le grotesque, le dérapage, le cartoon ou l'effondrement |
| Contrechant noble | ligne médium mf, conjointe : la voix grave qui répond |

### Associations

Trombones + cors = mur de cuivres nobles (le cor arrondit, le trombone structure) ; + tuba (l20) = le choral complet de cuivres graves ; + trompettes = la fanfare pleine, mais attention à l'équilibre : la trompette domine, écris les trombones plus fournis ; + violoncelles/contrebasses = la basse pesante ; + orgue (l23) = redondance, choisis.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Traits rapides et conjoints | `orch.agility` / `orch.trombone-slide` — la coulisse a une inertie physique |
| Glissando de plus d'un triton | `orch.trombone-slide` — impossible : au-delà, ce n'est plus un glissando |
| Accords de trombones serrés dans le grave | `orch.low-interval-limit` — ouvre l'accord, sinon c'est un grondement indistinct |
| Écriture continue en ff | `orch.endurance` — et l'oreille sature : le mur ne fonctionne que s'il est rare |
| L'employer comme remplissage d'harmonie | `orch.balance` — 9/10 : une tenue de trombones s'entend toujours, comme la trompette |
| Aigu prolongé | `orch.endurance` — moins coûteux que la trompette, mais réel |

- [ ] Hauteur continue : vrai glissando, mais **un triton maximum**
- [ ] Le choral et le mur : deux régimes, pas de tiède entre les deux
- [ ] La coulisse a une inertie — pas de virtuosité conjointe rapide

<QuizBlock id="m05-l18-quiz" questions={5} />

---
id: m05-l19-trombone-basse
module: module-05-instrumentation
title: "Le trombone basse"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `Bb1`–`F4` (praticable serein `C2`–`Bb3` ; barillets/triggers : jusqu'à `C1` ; pédales en dessous : effet) |
| Sweet spot | `Bb1`–`Bb2` |
| Agilité | 4/10 — plus lourde que le ténor (perce plus large, coulisse plus longue à charger) |
| Tenue | excellente ; le grave consomme énormément d'air |
| Puissance | pp 3/10 → **ff 9/10**, avec une masse que le ténor n'a pas |

### Pourquoi irremplaçable

Ce n'est pas « un trombone plus grave » : c'est **la fondation du choral de cuivres**. Perce plus large, pavillon plus grand, un ou deux barillets qui donnent accès aux notes manquantes du bas — il produit un grave à la fois défini et énorme, qui a une qualité que le tuba n'a pas : **il reste tranchant**. Le tuba enveloppe et arrondit ; le trombone basse coupe.

En musique de film, il porte à lui seul un archétype : **la menace articulée**. Le motif grave, rythmique, dans le `C2`–`G2`, avec cette attaque nette de cuivre — c'est le vocabulaire du danger moderne, depuis les blockbusters jusqu'aux bandes-annonces.

### Couleur par registre

```
Bb1 ─────── C2 ─────── Bb2 ─────── Bb3 ── F4
│  PÉDALES/ │ PROFOND   │  MÉDIUM   │  AIGU  │
│  EXTRÊME  │ énorme,   │ plein,    │ = un   │
│ grondement│ tranchant,│ noble,    │ ténor, │
│ (effet,   │ LE registre│ le socle │ inutile│
│  rare)    │  signature│ du choral │ ici    │
```

Au-dessus de `Bb3`, il fait le travail d'un ténor, en moins bien. Sa valeur est intégralement dans les deux octaves du bas.

### Rôles

| Rôle | Écriture |
|---|---|
| Basse du choral de cuivres (n° 1) | fondamentales sous les 2 ténors : le socle, position ouverte |
| La menace articulée | motif rythmique `C2`–`G2`, marcato, ff : l'archétype du danger contemporain |
| Pédale de puissance | tenue grave avec crescendo : la montée qui écrase |
| Doublure du tuba / des contrebasses | ajoute de la définition d'attaque à une basse molle |
| Ponctuation abyssale | note unique ff : le coup |

### Associations

Trombone basse + tuba (l20) = la basse cuivrée complète (l'un tranche, l'autre remplit — ils ne font pas doublon) ; + contrebasses et violoncelles = le grave orchestral total ; + contrebasson = grain et masse ; + grosse caisse (l26) = l'impact ; + trombones ténors = le choral, sa raison d'être.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| L'écrire dans l'aigu | `orch.register-color` — c'est un ténor moins agile : donne le passage à un ténor |
| Le confondre avec le tuba | rôles différents : le trombone basse articule, le tuba soutient. Les deux, pas l'un pour l'autre |
| Accords serrés dans le profond | `orch.low-interval-limit` — sous `C3`, octaves et quintes seulement |
| Traits rapides | `orch.agility` / `orch.trombone-slide` — encore plus lourd que le ténor |
| ff en continu | `orch.endurance` — le grave ff vide un poumon en quelques mesures ; écris les respirations |
| Pédales notées comme des notes normales | ce sont des effets : rares, longues, exposées, jamais dans un trait |

- [ ] Le grave qui **tranche** — le tuba, lui, enveloppe
- [ ] Deux octaves utiles : `Bb1`–`Bb3`, et rien au-dessus
- [ ] Fondation du choral + menace articulée

<QuizBlock id="m05-l19-quiz" questions={5} />

---
id: m05-l20-tuba
module: module-05-instrumentation
title: "Le tuba"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `D1`–`F4` (praticable serein `E1`–`F3`) |
| Sweet spot | `F1`–`F3` |
| Agilité | 6/10 — plus leste qu'on ne croit, mais chaque note pèse |
| Tenue | bonne, MAIS c'est le plus gros consommateur d'air de l'orchestre : respirations obligatoires |
| Puissance | pp 2/10 → ff 8/10 — une masse, pas un tranchant |

### Pourquoi irremplaçable

Le tuba est le **fondement rond**. Sa fonction première n'est pas d'être entendu : c'est de donner une assise au choral de cuivres, comme la contrebasse en donne une aux cordes. Il enveloppe, il remplit, il légitime tout ce qui est au-dessus. Et — détail que les débutants ignorent — **il n'y en a qu'un** dans l'orchestre. Un seul homme pour porter l'ensemble des cuivres : ménage-le.

Son second visage est un des plus attachants de l'orchestre : le **soliste improbable**. Dans le `F2`–`F3`, exposé, il est étonnamment doux, presque tendre, et un peu pathétique — la lourdeur qui essaie de chanter. C'est le personnage : le géant gentil, le charretier, le monstre triste.

### Couleur par registre

```
D1 ──────── F1 ─────── F3 ─────── F4
│  ABYSSAL  │  PROFOND/ │  MÉDIUM-  │
│ vague,    │  MÉDIUM   │  AIGU     │
│ lent à    │ rond,     │ chantant, │
│ parler,   │ plein,    │ tendu,    │
│ effet     │ LE socle  │ le soliste│
│           │ (90 %)    │ improbable│
```

### Rôles

| Rôle | Écriture |
|---|---|
| Basse du choral de cuivres (n° 1) | fondamentales sous les trombones, p–ff : l'assise ronde |
| Doublure des contrebasses / du contrebasson | ajoute du corps sans ajouter d'attaque |
| Pédale grave | tenue longue : la gravité, souvent avec crescendo |
| Ostinato lourd | valeurs simples, notes détachées : le pas du géant |
| Solo caractériel | `F2`–`F3` exposé : le personnage lourd, comique ou touchant |
| Ponctuation | note grave marcato : le point final |

### Associations

Tuba + trombone basse (l19) = la basse cuivrée complète, tranchant + masse ; + contrebasses à l'unisson = la basse orchestrale la plus dense qui existe ; + cors = fondu chaud (le tuba est le meilleur ami du cor pour asseoir un accord) ; + contrebasson = grain et souffle ; + timbales (l24) = l'assise avec impact.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| L'écrire en continu | `orch.endurance` — un seul instrumentiste, une consommation d'air énorme : écris de vrais silences, pas des soupirs de politesse |
| Attendre une attaque nette | l'attaque du tuba est ronde et légèrement lente : pour la précision, double-le au trombone basse ou aux timbales |
| Traits rapides dans le grave | `orch.agility` — sous `F1`, tout devient indistinct |
| Accords tuba + trombone basse serrés | `orch.low-interval-limit` |
| Le traiter comme la basse de tout l'orchestre | c'est la basse des **cuivres** ; la basse de l'orchestre, ce sont les contrebasses (l05) |
| L'oublier dans un tutti de cuivres | `orch.role-coverage` — un choral de cuivres sans fondement flotte |

- [ ] Un seul tuba : chaque mesure écrite est une mesure d'air dépensée
- [ ] Il enveloppe (le trombone basse tranche) — les deux sont complémentaires
- [ ] Basse des cuivres, pas basse de l'orchestre ; et un soliste caché en `F2`–`F3`

<QuizBlock id="m05-l20-quiz" questions={5} />
---
id: m05-l22-celesta
module: module-05-instrumentation
title: "Le célesta"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `C4`–`C8` en sons réels (écrit une octave plus bas — le produit gère) |
| Sweet spot | `C5`–`C7` |
| Agilité | élevée (clavier), mais l'écriture doit rester claire : c'est un timbre, pas un piano |
| Tenue | courte décroissance douce ; pédale de prolongation (comme le piano, l21) |
| Puissance | pp 1/10 → ff 2/10 — **le plus faible instrument de l'orchestre** |

### Pourquoi irremplaçable

Le célesta est un clavier dont les marteaux frappent des lames d'acier posées sur des résonateurs de bois. Résultat : un son de **boîte à musique cristalline, sans agressivité** — l'attaque est douce, la couleur est pure, et la note s'évanouit. C'est exactement ce que le glockenspiel (l25) n'est pas : le glock frappe et perce, le célesta apparaît et se dissout.

Il porte un archétype si fort qu'il est presque un mot du vocabulaire : **la magie**. La fée, le flocon, le jouet qui s'anime, l'enfance, le merveilleux inquiet. Depuis la Fée Dragée jusqu'au thème de sorcellerie le plus célèbre du cinéma contemporain, c'est le même timbre qui dit « quelque chose d'impossible est en train de se produire ».

### Couleur par registre

```
C4 ──────── C5 ─────────── C7 ────── C8
│  GRAVE    │    MÉDIUM     │  AIGU   │
│ sourd,    │ cristallin,   │ ténu,   │
│ mat,      │ rond, doux —  │ scintil-│
│ sans      │ LE célesta    │ lant,   │
│ intérêt   │ (90 % du rôle)│ fragile │
```

Le grave du célesta est un son mou et sans identité : rien à y faire. Sa magie commence à `C5`.

### Rôles

| Rôle | Écriture |
|---|---|
| Le geste magique (n° 1) | arpège ou gamme rapide médium-aigu, orchestre en retrait : l'apparition |
| Mélodie de boîte à musique | thème simple, notes détachées, accompagnement très léger : l'enfance |
| Doublure de contour | double une flûte, un violon solo ou un glockenspiel à l'octave : ajoute une aura sans ajouter de poids |
| Ponctuation scintillante | notes isolées dans le silence ou la réverbération : la goutte magique |
| Ostinato de féerie | cellule répétée aiguë p : le temps enchanté |

### Associations

Célesta + harpe (l06) = le duo de la magie (ils se répondent, ils ne se doublent pas bien : la harpe pince, le célesta frappe) ; + flûte à l'unisson = l'apparition douce ; + violons en harmoniques ou divisi pp = le halo suspendu ; + glockenspiel = doublure fréquente, mais le glock domine — écris-le p ou renonce ; + cordes con sordino = le lit idéal.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| L'écrire dans un tutti | `orch.balance` — 2/10 : il disparaît totalement, tu as écrit du silence |
| Le confondre avec le glockenspiel | deux timbres opposés : le célesta se dissout, le glock perce (l25) |
| Écriture pianistique (accords épais, grands déplacements) | c'est une couleur, pas un piano : lignes claires, textures aérées |
| Grave exposé | `orch.register-color` — mat et sans magie |
| L'utiliser en continu | l'effet magique s'use en quinze secondes : geste bref, retrait |

- [ ] Le plus faible de l'orchestre : il exige du vide autour de lui
- [ ] `C5`–`C7` ; le grave n'existe pas
- [ ] Il apparaît et se dissout — le glockenspiel, lui, frappe

<QuizBlock id="m05-l22-quiz" questions={5} />

---
id: m05-l23-orgue
module: module-05-instrumentation
title: "L'orgue"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | claviers `C2`–`C7` ; pédalier `C2`–`G4` écrit — mais les jeux de 16′ et 32′ descendent réellement à `C1` et `C0` |
| Sweet spot | tout, selon la registration |
| Agilité | élevée aux mains, faible au pédalier |
| Tenue | **infinie et parfaitement stable** — le seul instrument sans aucune décroissance ni respiration |
| Puissance | 1/10 (une flûte 8′ seule) → 11/10 (le plein-jeu : il couvre l'orchestre entier) |

### Pourquoi irremplaçable

L'orgue n'est pas un instrument, c'est **un orchestre concurrent** que tu invites dans le tien. Deux propriétés uniques justifient sa présence.

**1) La tenue absolue.** Aucun archet ne change, aucun souffle ne s'épuise : un accord d'orgue peut durer trois minutes exactement identique. C'est un son *inhumain* — et cette inhumanité est précisément son effet dramatique. Ce qui ne respire pas ne peut pas être vivant.

**2) Le 32′.** En dessous de `C1`, l'orgue produit des fréquences que le corps perçoit avant l'oreille. Le sol qui tremble. Rien d'autre dans l'orchestre ne fait ça (le contrebasson et la grosse caisse s'en approchent, sans y arriver).

Son archétype : le sacré — et son revers, le sacré dévoyé (l'orgue est le raccourci le plus court vers le gothique, le monstrueux, le fanatique).

### Le piège : la dynamique n'existe pas

Une touche d'orgue est un robinet : ouverte ou fermée. **Le toucher n'a aucun effet sur le volume.** Conséquences :

| Le piano/orchestre fait croire que… | La vérité de l'orgue |
|---|---|
| on peut faire un crescendo sur un accord tenu | non — sauf dans la boîte expressive (récit), et c'est un changement de *timbre* autant que de volume |
| on nuance note à note | non : la nuance est un **changement de registration** (on ajoute ou retire des jeux), donc par paliers, et cela demande un geste et parfois un assistant |
| une ligne se phrase par l'attaque | non : le phrasé d'orgue se fait par **l'articulation** — la durée des silences entre les notes est ton seul outil expressif |

**Registration = orchestration.** Un même accord peut être une flûte lointaine, un hautbois pincé, un mur de cuivres ou un tremblement de terre. Indique une intention (« fonds 8′ doux », « anches, plein-jeu », « 32′ seul en pédale ») plutôt que d'espérer un rendu par défaut.

### Rôles

| Rôle | Écriture |
|---|---|
| La pédale immobile (n° 1) | tenue de 16′/32′ sous tout l'orchestre : le sol qui ne bouge pas |
| Le choral | accords tenus, écriture à 4 voix, tempo lent : le sacré |
| Le tutti écrasant | plein-jeu avec l'orchestre : le sommet absolu de puissance (rare, et une fois par pièce) |
| La couleur exotique | un seul jeu solo (flûte, hautbois d'orgue) : une voix venue d'ailleurs |
| Le hors-temps | accord infini pendant que l'orchestre bouge : la suspension du temps |

### Associations

Orgue + cuivres = redondance dangereuse (les deux font des murs) ; + cordes = superbe, l'orgue tient, les cordes vibrent — le contraste est l'effet ; + chœur = la fusion naturelle ; + percussions graves (l26) = l'apocalypse ; + tout l'orchestre = attention à l'accord (l'orgue d'un lieu donné a sa propre justesse et son propre tempérament : c'est un problème réel, pas théorique).

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Crescendo écrit sur une tenue | `orch.organ-dynamics` — impossible hors boîte expressive : écris un ajout de jeux ou renonce |
| Écriture pianistique (arpèges de pédale, textures floues) | l'orgue ne pardonne rien : chaque voix s'entend jusqu'au bout |
| Harmonie rapide dans un lieu réverbérant | `orch.organ-acoustics` — 4 à 8 secondes de réverbération : ralentis le rythme harmonique ou tout se superpose |
| Pédalier virtuose | ce sont des pieds : lignes simples, pas de doubles croches |
| L'employer longtemps | son immobilité fascine deux minutes puis écrase tout le reste |
| Oublier qu'il couvre l'orchestre | `orch.balance` — au plein-jeu, personne n'existe : n'écris rien d'important dessous |

- [ ] Tenue absolue = son inhumain : c'est l'effet, pas un défaut
- [ ] Pas de dynamique au toucher — registration et articulation à la place
- [ ] Le 32′ se sent ; la réverbération dicte le rythme harmonique

<QuizBlock id="m05-l23-quiz" questions={5} />

---
id: m05-l24-timbales
module: module-05-instrumentation
title: "Les timbales"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `D2`–`A3` sur un jeu standard de 4 fûts (voir tableau ci-dessous) |
| Sweet spot | `F2`–`D3` |
| Agilité | 7/10 — deux mailloches, donc deux notes maximum simultanées et une vitesse limitée |
| Tenue | résonance longue, contrôlable (étouffement à la main) |
| Puissance | pp 1/10 → ff 9/10 — et un impact physique unique |

### Pourquoi irremplaçable

Les timbales sont **les seules percussions à hauteur déterminée du noyau orchestral** — c'est-à-dire le seul instrument qui frappe *et* participe à l'harmonie. Elles font trois choses irremplaçables : elles **fondent** (une tonique de timbale sous un accord donne à tout l'orchestre une assise que la contrebasse seule ne donne pas), elles **ponctuent** (l'accent qui fait sursauter), et elles **construisent** (le roulement avec crescendo est le mécanisme de tension le plus fiable jamais inventé).

Elles sont aussi le pouls dramatique : le cœur qui bat, la marche, l'orage, l'exécution.

### Le jeu de fûts — la contrainte concrète

| Fût | Diamètre | Tessiture |
|---|---|---|
| Grave | 32″ | `D2`–`A2` |
| Médium-grave | 29″ | `F2`–`C3` |
| Médium-aigu | 26″ | `Bb2`–`F3` |
| Aigu | 23″ | `D3`–`A3` |

**Un fût = une note à la fois.** Un jeu de 4 fûts donne donc quatre hauteurs disponibles simultanément, pas plus. Toute note supplémentaire exige un **changement d'accord** : le timbalier appuie sur une pédale et vérifie la hauteur à l'oreille. Cela demande du temps (compte deux mesures de silence à tempo modéré, davantage si la salle est bruyante) et un endroit où le glissando de peau ne s'entendra pas.

### Rôles

| Rôle | Écriture |
|---|---|
| Assise harmonique (n° 1) | tonique et dominante sur les temps forts : le fondement classique |
| Le roulement de tension | trémolo avec crescendo vers un point d'arrivée : le mécanisme universel |
| Ponctuation / accent | note isolée ff : le coup de tonnerre |
| Le pouls | rythme répété p : le cœur, la marche, la menace qui approche |
| Le solo rythmique | motif exposé — rare, spectaculaire |
| Le glissando de pédale | montée ou descente de hauteur pendant un roulement : l'effet moderne (le vertige) |

**Les mailloches changent tout** : feutre dur = attaque nette et sèche ; feutre doux = tonnerre lointain ; bois = claquement brutal. Un changement de mailloches demande aussi quelques mesures. Indique-le.

### Associations

Timbales + contrebasses/violoncelles = l'assise complète (l'impact plus la hauteur) ; + cuivres graves = la puissance solennelle ; + grosse caisse (l26) = attention, deux graves qui se brouillent — décale ou choisis ; + cordes en trémolo = le suspense classique ; timbales seules, pp, sous un silence = un des plus grands effets de l'orchestre.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Plus de notes que de fûts | `orch.timp-tuning` — quatre hauteurs simultanées maximum |
| Changement d'accord sans temps | `orch.timp-tuning` — deux mesures minimum, et pas pendant un pp exposé |
| Écriture chromatique | ce n'est pas un instrument mélodique : tonique, dominante, quelques degrés forts |
| Oublier l'étouffement | la peau résonne longtemps : écris `étouffez` ou des silences réels, sinon tout se superpose |
| Roulement permanent | `orch.balance` — le roulement est un mécanisme de tension : utilisé partout, il ne tend plus rien |
| Frappe ff sous une texture délicate | 9/10 : elles couvrent tout ce qui n'est pas un tutti |

- [ ] Un fût = une note ; quatre fûts = quatre hauteurs ; le reste coûte du temps
- [ ] Assise, ponctuation, roulement de tension : les trois métiers
- [ ] Les mailloches sont une orchestration à elles seules

<QuizBlock id="m05-l24-quiz" questions={5} />

---
id: m05-l25-claviers-de-percussion
module: module-05-instrumentation
title: "Les claviers de percussion : le glockenspiel, le xylophone, le vibraphone et le marimba"
estimatedMinutes: 30
skills: { orchestration: 1.0 }
---

### Carte d'identité comparée

| | Glockenspiel | Xylophone | Vibraphone | Marimba |
|---|---|---|---|---|
| Matière | acier | bois | aluminium + moteur | bois + résonateurs longs |
| Tessiture réelle | `G5`–`C8` | `C5`–`C8` | `F3`–`F6` | `C2`–`C7` |
| Transposition | écrit 2 octaves plus bas | écrit 1 octave plus bas | sons réels | sons réels |
| Résonance | longue, non contrôlable | **nulle** (sec) | longue, **pédale** | moyenne, chaude |
| Puissance | ff 8/10 (perce) | ff 7/10 (claque) | ff 5/10 | ff 4/10 (grave : 2/10) |
| Archétype | l'éclat, la magie dure | le squelette, le mécanique | le jazz, le rêve froid | le bois, l'organique, l'Afrique |

Tous se jouent à 2 mailloches (lignes, octaves) ou 4 (accords, roulements) — au-delà de 4 sons simultanés, c'est deux instrumentistes.

### Comment choisir : la question de la résonance

C'est le seul critère qui compte vraiment.

```
SEC ──────────────────────────────────► RÉSONANT
xylophone   glockenspiel   marimba   vibraphone
(rien)      (longue, non   (moyenne, (longue, ET
            contrôlable)   chaude)   contrôlable)
```

Le **xylophone** ne laisse rien derrière lui : c'est de l'articulation pure, du rythme à hauteur définie. Le **glockenspiel** sonne longtemps et tu n'y peux rien : chaque note s'empile sur la précédente, donc écris peu de notes. Le **marimba** a la chaleur du bois avec de la résonance : c'est le seul des quatre qui puisse faire un tapis. Le **vibraphone** est le seul avec une pédale d'étouffoir : il phrase, il lie, il respire — c'est le plus « musical » des quatre, et le seul avec un moteur (les ailettes qui tournent créent le vibrato ; **moteur off** est un choix légitime et souvent meilleur).

### Rôles par instrument

| Instrument | Rôle n° 1 | Autres emplois |
|---|---|---|
| Glockenspiel | doubler la mélodie aiguë au sommet d'un tutti : l'éclat ajouté | ponctuation magique, motif d'enfance, le carillon militaire |
| Xylophone | l'articulation rythmique : doubler un trait de bois ou de cordes pour le rendre net | le macabre (os qui s'entrechoquent), le mécanique, le comique |
| Vibraphone | la couleur jazz/noir : accords tenus, mélodie liée, pédale | le rêve, le flou hybride (M6), le liant froid |
| Marimba | l'ostinato chaud : cellules répétées médium, roulements | le tapis organique, la basse boisée, le solo lyrique |

### Associations

Glockenspiel + célesta (l22) = la magie doublée, mais dose le glock (il écrase le célesta) ; glockenspiel + piccolo + triangle = le sommet scintillant du tutti ; xylophone + pizzicati de cordes + bassons staccato = l'attelage grotesque classique ; vibraphone + piano feutré + cordes en sourdine = le néo-noir (m09-l03) ; marimba + clarinette basse = l'ostinato sombre et organique ; marimba + harpe = deux résonances qui se marient bien, contre toute attente.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Confondre les quatre | `orch.mallet-choice` — la résonance décide, pas la brillance |
| Écriture dense au glockenspiel | pas d'étouffoir : dix notes rapides = une bouillie métallique. Écris peu, écris haut, écris fort |
| Attendre du legato au xylophone | il n'a aucune résonance : le legato n'existe pas, seul le trémolo simule une tenue |
| Ignorer la pédale du vibraphone | c'est son outil unique : indique `ped.` / `senza ped.` comme tu indiques un archet |
| Moteur du vibraphone par défaut | `orch.mallet-choice` — précise la vitesse ou demande le moteur arrêté |
| Attendre de la puissance du marimba grave | `orch.balance` — 2/10 dans le bas : superbe et fragile, il faut du silence autour |
| Accords de plus de 4 sons | quatre mailloches maximum par instrumentiste |
| Oublier de compter les joueurs | un percussionniste = un instrument à la fois (voir l26) |

- [ ] La résonance décide : xylophone (rien) → vibraphone (tout, contrôlable)
- [ ] Glockenspiel : peu de notes, haut, fort — il n'a pas d'étouffoir
- [ ] Vibraphone = pédale + moteur : deux paramètres à écrire
- [ ] Marimba = le seul qui fasse un tapis chaud, et il est fragile dans le grave

<QuizBlock id="m05-l25-quiz" questions={5} />

---
id: m05-l26-percussions-orchestrales
module: module-05-instrumentation
title: "Les percussions orchestrales"
estMinutes: 30
skills: { orchestration: 1.0 }
---

### De quoi on parle

Cette fiche couvre les percussions **à hauteur indéterminée** (plus les cloches tubulaires, qui font exception) : tout ce qui frappe, siffle, gratte ou résonne sans jouer une note d'harmonie. Les timbales ont leur fiche (l24), les claviers la leur (l25).

Le principe directeur tient en une phrase : **une percussion n'est pas une couleur, c'est un geste.** Une cymbale suspendue ne « s'ajoute » pas à une texture — elle dit quelque chose, une fois, et ce qu'elle dit occupe tout l'espace. Écrire des percussions, c'est écrire des ponctuations.

### La contrainte que tout le monde oublie : combien de percussionnistes ?

**Un percussionniste = un instrument à la fois.** Un orchestre de film standard en compte 2 à 4 (plus le timbalier, qui ne joue que ses timbales). Si ta mesure demande simultanément grosse caisse, cymbales frappées, tam-tam et tambourin, il te faut **quatre personnes** — et chacune doit avoir eu le temps physique de rejoindre son instrument.

Avant de valider une page de percussions, fais le compte par mesure. C'est exactement ce que vérifie `orch.perc-player-count`.

### Le catalogue

**Peaux**

| Instrument | Couleur | Emploi typique |
|---|---|---|
| Grosse caisse | grave profond, sans hauteur, physique | l'impact, le tonnerre lointain (roulement pp), le pas du colosse |
| Caisse claire | sèche, mordante, timbre métallique du timbre | la marche militaire, la tension (roulement pp), la frappe nerveuse de l'action |
| Tambourin (basque) | grelots + peau | la danse, le folklore, l'ivresse — **le cliché n° 1 des percussions** |

**Métaux**

| Instrument | Couleur | Emploi typique |
|---|---|---|
| Cymbales frappées (paire) | éclat court et large | l'accent du tutti, le point d'exclamation |
| Cymbale suspendue | roulement à mailloches : montée continue ; frappée : le crash | le crescendo de tension, l'arrivée, le scintillement (mailloches douces, pp) |
| Tam-tam | grondement immense, sans hauteur, très lent à s'installer | le destin, la mort, l'irréversible — **il met plusieurs secondes à donner tout son son** |
| Gong (à hauteur) | métallique, focalisé, exotique | la couleur rituelle, l'Asie imaginaire |
| Triangle | scintillement aigu, perce tout | la lumière ponctuelle, le merveilleux, le roulement de tension aiguë |
| Cloches tubulaires | **à hauteur déterminée**, `C4`–`F5` | l'église, le glas, l'annonce solennelle |
| Agogo | deux cloches métalliques claires | le motif latin, la couleur rythmique brillante |
| Vibraslap | grésillement de dents qui claquent | le comique grinçant, le frisson — une fois par film, maximum |

**Bois et petites percussions**

| Instrument | Couleur | Emploi typique |
|---|---|---|
| Woodblock / jam block | claquement sec, aigu | le mécanique, l'horloge, le comique ; le jam block est sa version moderne et plus dure |
| Claves | claquement très net, projette énormément | la clave latine, l'accent sec |
| Castagnettes | crépitement bref | l'Espagne, la danse |
| Guiro | raclement rythmique | la couleur latine, le grincement (aussi : la texture inquiétante, joué lentement) |
| Maracas | bruissement continu | le tapis rythmique léger |
| Cabasa | bruissement métallique granuleux | la texture rythmique moderne, le tapis discret |

### Les trois mécanismes à connaître

1. **Le roulement-crescendo** — cymbale suspendue, caisse claire, grosse caisse, triangle : n'importe lequel monte une tension et amène un point d'arrivée. C'est le mécanisme le plus fiable de la musique de film ; c'est aussi le plus usé.
2. **L'impact** — grosse caisse + cymbale + timbales ensemble sur un temps : le coup. Superposer plusieurs graves et plusieurs aigus dans le même impact le rend « gros » ; utiliser toujours la même combinaison le rend prévisible.
3. **L'étouffement** — presque tous ces instruments résonnent longtemps. Écrire `laissez vibrer` (l.v.) ou `étouffez` **change complètement** le résultat. C'est un paramètre, pas un détail.

### Associations

Grosse caisse + contrebasses/contrebasson = l'impact avec fondation ; cymbale suspendue (roulement) + cordes en trémolo + cuivres crescendo = la montée standard ; triangle + glockenspiel + piccolo = le sommet scintillant ; caisse claire + trompettes = la marche ; tam-tam seul, dans le silence, après un tutti = un des rares effets qui n'a pas besoin d'aide.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Plus d'instruments simultanés que d'instrumentistes | `orch.perc-player-count` — compte par mesure, et laisse le temps de se déplacer |
| Percussion continue | `orch.balance` — un geste répété n'est plus un geste : le silence des percussions est ce qui rend leur entrée efficace |
| Tam-tam traité comme une cymbale | il monte lentement et dure très longtemps : réserve-lui de l'espace avant ET après |
| Oublier `l.v.` / `étouffez` | la résonance non gérée transforme une ponctuation en flaque |
| Le tambourin par réflexe folklorique | le cliché le plus repéré : demande-toi ce qu'il dit, pas ce qu'il évoque |
| Impact toujours identique | varie la recette (grave seul, aigu seul, avec ou sans cymbale) : sinon le troisième impact ne fait plus rien |
| Percussions sous un tutti déjà saturé | `orch.masking` — au-dessus d'un certain seuil, seuls le triangle, les claves et les cymbales passent encore |

- [ ] Une percussion est un geste, pas une couleur de fond
- [ ] Compte tes percussionnistes, mesure par mesure — un joueur, un instrument
- [ ] Roulement-crescendo, impact, étouffement : les trois mécanismes
- [ ] Le silence des percussions est la moitié de leur écriture

<QuizBlock id="m05-l26-quiz" questions={5} />