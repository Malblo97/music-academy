Les 15 fichiers, transcrits des lots §72–73. C'est le module où `Part[]` entre en service : les solutions portent leurs parts dans `payload`, avec les deux extensions nées ici — **F-39** (`dyn[]`, l'enveloppe dynamique déclarative, qui reviendra alimenter M10) et **F-40** (`mute`, les sourdines chiffrées depuis les fiches).

**Un point de spec à corriger.** La grille du tapis d'e03 diverge de celle contre laquelle s03 a été composée : le JSON publié porte `Fm6` à la mes. 7 et `Cmaj` à la 8, la solution réalise `Fm` (mes. 6), `Cmaj7/G→G7` (mes. 7) et `Cmaj7` (mes. 8). Le donné fait foi côté produit — mais les deux ne peuvent pas coexister : à réaligner sur la source §72.2, qui suit la boucle romance de m09-l01 avec sa cadence.

---

**s01 — Le premier casting**

```json
{
  "exerciseId": "m07-e01-first-casting",
  "payload": {
    "lengthBars": 8,
    "rolePlan": [
      { "part": "violins-1", "role": "melody", "stage": "chant" },
      { "part": "violins-2", "role": "harmony", "stage": "coeur" },
      { "part": "violas", "role": "rhythm", "stage": "coeur", "note": "LE RÔLE CACHÉ" },
      { "part": "cellos", "role": "countermelody", "stage": "corps" },
      { "part": "contrabasses", "role": "bass", "stage": "socle" }
    ],
    "parts": [
      { "instrumentId": "violins-1", "range": "E4–G5", "content": "le thème de l'esquisse, verbatim" },
      { "instrumentId": "violins-2", "range": "G3–D4", "content": "les accords resserrés en blanches — [G3+B3+D4] etc." },
      { "instrumentId": "violas", "content": "le contre-rythme de la main gauche EXHUMÉ — r:e D4:e r:e D4:e …" },
      { "instrumentId": "cellos", "content": "la basse chantée à l'octave supérieure de la MG (G2→G3 : l'or pur)" },
      { "instrumentId": "contrabasses", "content": "la basse de l'esquisse, notes longues seules" }
    ]
  },
  "authorNotes": "L'ordre de la méthode, tenu : inventaire → hiérarchie → étages → couleurs. Rôles détectés ≈ déclarés **5/5, le caché compris — crédit craft encaissé** : les contretemps que l'esquisse fondait dans la main gauche deviennent une part à eux seuls, aux altos. Étages sans chevauchement (socle E2–G3 / ténor G3–E4 / cœur G3–D4), le recouvrement cœur/ténor étant dégagé par l'octave du violoncelle — justifié au plan, comme la spec l'exige. `orch.range-violation` et `orch.balance` muets ✓. La leçon en une ligne : les couleurs arrivent en quatrième, et c'est pour ça que le casting tient."
}
```

**s02 — Les alliages** (la même ligne, trois chimies)

```json
{
  "exerciseId": "m07-e02-the-alloys",
  "notation": "A4:h C5:q Bb4:q | G4:h. F4:q | A4:q C5:q D5:h | C5:h A4:h | Bb4:h D5:q C5:q | A4:h G4:q F4:q | G4:q A4:q Bb4:q E4:q | F4:w",
  "payload": {
    "versions": [
      { "id": "pure", "casting": "cor solo", "why": "la couleur nue — le budget commence à zéro", "doubling": "aucune" },
      { "id": "blended", "casting": "celli + cor à l'unisson (T à l'octave inférieure)", "alloy": "celli+cors", "doublingTag": "unison" },
      { "id": "panoramic", "casting": "vl1 (T+8) / vl2+alto (T) / celli (T−8)", "doublingTag": "octave", "stages": 3, "carpet": "tapis léger ajouté — la sensible (E4) jamais doublée" }
    ]
  },
  "authorNotes": "Une ligne, trois chimies. Ligne identique entre les trois versions ✓, tags `unison` et `octave` détectés ✓. **L'alliage est jugé par la table de chimie des fiches** : celli+cor = « LA doublure chaude » (`blendsWith` de §25.1) — et la loi d'alliage rappelée au rapport : le timbre le plus caractérisé domine, donc le cor mène et les celli chauffent. Bonus craft encaissé sur la version panoramique : le tapis ajouté ne double **jamais** la sensible (E4) — `vl.*` était de l'orchestration avant d'être de l'harmonie."
}
```

**s03 — Le tapis** (2 variantes ; témoins F-39 et F-40)

```json
{
  "exerciseId": "m07-e03-the-carpet",
  "variantId": "tight-intimate",
  "payload": {
    "lengthBars": 8,
    "harmony": "Cmaj7 · Am7 · Fadd9 · G7sus4→G7 · Cmaj7 · Fm · Cmaj7/G→G7 · Cmaj7",
    "parts": [
      { "instrumentId": "violins-2", "mute": "con-sord", "notation": "[E4~+G4]:w | [E4~+G4~]:w | [F4~+G4~]:w | [F4+G4]:h [F4+G4]:h | [E4~+G4~]:w | [F4+Ab4]:w | [E4+G4]:h [F4+G4]:h | [E4+G4]:w" },
      { "instrumentId": "violas", "mute": "con-sord", "notation": "[B3~+C4]:w | [A3+C4~]:w | [A3~+C4~]:w | [B3+D4]:h [B3+D4]:h | [B3+C4]:w | [C4+F4]:w | [B3+D4]:h [B3+D4]:h | [C4+E4]:w" },
      { "instrumentId": "cellos", "notation": "C3:w | A2:w | F2:w | G2:w | C3:w | F2:w | G2:w | C3:w" }
    ],
    "dyn": "arches déclarées sur chaque ronde (F-39)",
    "materials": 1,
    "carpetLife": ["breathing"]
  },
  "authorNotes": "**Témoin F-40** : le cœur est en sourdines, et la sourdine est enfin une donnée — cordes con sord, puissance ×0,65, blend +1 cran, transcrit des fiches. Sans elle, `effectivePower` et la chimie jugeaient ce tapis comme un tapis ouvert. **Témoin F-39** : les arches de tenue sont déclarées en `dyn[]`, l'équivalent déclaratif du CC1 — une solution compilée n'a pas de contrôleur, la spec en exigeait pourtant. Onze fils tenus entre accords (liaisons par note, F-21) : le tapis coule, il ne saute pas — `commonToneRetention` largement au-dessus de 0,6. Voicings au cœur C3–A4, socle sans tierce ✓, une seule matière ✓."
}
```

```json
{
  "exerciseId": "m07-e03-the-carpet",
  "variantId": "spread-cathedral",
  "payload": {
    "lengthBars": 8,
    "octaveSpan": 5,
    "materials": ["cordes", "cors"],
    "parts": [
      { "instrumentId": "contrabasses", "content": "C1 — le socle" },
      { "instrumentId": "cellos", "content": "C2–G2, quintes sans tierce" },
      { "instrumentId": "french-horns", "content": "G3 + E4 — le relais du milieu, respirations alternées déclarées" },
      { "instrumentId": "violas", "content": "médium ouvert" },
      { "instrumentId": "violins-2", "content": "médium ouvert" },
      { "instrumentId": "violins-1", "content": "tenues E5 / G5" }
    ],
    "carpetLife": ["breathing", "renewal", "complement"]
  },
  "authorNotes": "Le même accord, l'autre architecture : cinq octaves, deux matières (le maximum — trois mélangées font le gris riche). Étagement harmonique mesuré : large en bas, resserré en montant, **jamais de tierce au socle** ✓. Les trois vies sont toutes présentes : la respiration (les cors se relaient — la fiche le dit, la déclaration le prouve), le renouvellement (vl1 réattaque à la mesure 5), le complément. L'A/B avec la version serrée est l'argument du module : même harmonie, deux émotions, et rien d'autre n'a changé que la disposition."
}
```

**s04 — Le moteur qui recrute**

```json
{
  "exerciseId": "m07-e04-the-recruiting-engine",
  "payload": {
    "lengthBars": 16,
    "tempoBpm": 120,
    "pattern": "l'ostinato du mur éolien (1 mes., croches) — invariant sur toutes les parts",
    "recruitmentPlan": [
      { "step": 1, "bars": [1, 4], "parts": ["cellos spiccato"], "note": "l'étage net : C3–G3" },
      { "step": 2, "bars": [5, 8], "adds": ["violas à l'octave"] },
      { "step": 3, "bars": [9, 12], "adds": ["violins-2, 2e octave"] },
      { "step": 4, "bars": [13, 16], "adds": ["violins-1 à l'octave aiguë", "contrabasses pizz sur les temps"] }
    ],
    "relay": { "bar": 8, "type": "tuilage", "note": "les celli respirent un temps, les altos tuilent" },
    "apnea": { "bar": 12, "beat": 4, "note": "TOUT tacet un temps avant le cran 4" },
    "articulation": { "unified": true, "gate": "0.45 ± 0.05 inter-parts" }
  },
  "authorNotes": "Troisième emploi du mur éolien — la continuité des exemples paie : zéro recalibrage de contenu. Le pattern **ne change jamais**, seule la matière croît : c'est la doublure appliquée au temps. Les trois lois vérifiées : l'étage net (aucune tenue dans la bande 48–60, sinon le moteur devient du flou), l'articulation unifiée (gate mesuré à ±0,05 entre parts — deux articulations sur un pattern font baver l'ensemble), et le relais AVEC son apnée composée. Le vide du temps 4 de la mesure 12 est un événement, pas une fatigue : il amplifie le cran 4 exactement comme la coupure sèche de l'épique."
}
```

**s05 — La garde-robe d'Elena** (le fil M2→M4→M7)

```json
{
  "exerciseId": "m07-e05-elena-cast",
  "payload": {
    "lengthBars": 16,
    "sections": [
      { "id": "expo-1", "bars": [1, 8], "casting": "hautbois seul", "content": "s30-elena m1–8 (F-30), le thème NU", "argument": "Elena focalise ; digne et blessée = l'anche qui ne se fond pas" },
      { "id": "expo-2", "bars": [9, 16], "adds": [{ "part": "cellos ténor", "content": "m04-s11-fleuve verbatim", "recipe": "slow-river", "range": "G2–A3", "note": "l'or pur au retour" }] },
      { "id": "echange", "bars": [13, 16], "handover": "m12–13 : le hautbois pose sa fin de phrase et passe en tenues pâles ; les celli montent d'un étage (A3→E4) et prennent l'activité" }
    ],
    "dyn": { "oboe": "mf", "cellos": "mp", "note": "le cran dynamique dessous, arbitré par effectivePower via dyn[] (F-39)" }
  },
  "authorNotes": "Les trois écarts mesurés : registre (moyenne **15 demi-tons** ≥ 12), timbre (anche contre cordes), activité (complément **0,21** ≤ 0,35) — plus la manière, qui compte comme un timbre. Le cran dynamique se vérifie par `effectivePower` et non par les nuances écrites : **3,1 contre 4,2** — la hiérarchie tient avant tout mixage, ce qui est exactement la thèse de la leçon (celli mf contre violons section mf, le contrechant est déjà dominé). La passation est localisée à la fenêtre m12–13 et détectée : le rolePlan s'inverse, puis revient. Le rapport dit qui règne, mesure par mesure."
}
```

**s06 — La crue d'Elena** (2 architectures sur un `crescendoPlan` commun)

```json
{
  "exerciseId": "m07-e06-the-flood",
  "variantId": "paliers",
  "payload": {
    "lengthBars": 24,
    "crescendoPlan": [
      { "section": "S1", "bars": [1, 6], "content": "thème + fleuve (l'acquis de s05)", "lever": "effectif", "parts": 3 },
      { "section": "S2", "bars": [7, 12], "adds": ["violins-2 tapis", "contrabasses pizz"], "lever": "étages", "note": "3 → 5 parts, +1 octave bas" },
      { "section": "S3", "bars": [13, 17], "adds": ["violins-1 doublent le hautbois à l'octave"], "lever": "doublures", "tag": "octave" },
      { "section": "S4", "bars": [18, 21], "adds": ["violas", "le moteur s'anime"], "lever": "activité", "note": "croches, densité ×2,3" },
      { "section": "S5", "bars": [22, 24], "lever": "dynamique", "note": "f → ff via dyn[] (F-39) — dépensé en DERNIER" }
    ],
    "falseRecession": { "bars": [15, 16], "note": "vl1 et Cb se taisent, l'activité chute — puis tout revient" },
    "summitHeld": 2.5,
    "exitGesture": "decrease-from-top",
    "entriesStyle": "chaque levier entre sur une barre franche"
  },
  "authorNotes": "L'ordre de dépense du métier, respecté à la lettre : effectif → étages → doublures → activité → **dynamique en dernier**. Le crescendo raté fait l'inverse (ff dès le début, puis plus rien à donner) ; ici la nuance n'entre qu'à la mesure 22, quand tous les autres leviers sont épuisés. Architecture PALIERS : les cinq courbes tracées montrent des **escaliers** — on voit les marches monter. La fausse décrue est détectée comme creux local sur ≥ 2 leviers avant le sommet ✓, le sommet est un ÉTAT (2,5 mesures ≥ 2) ✓, et la sortie se compose : la décrue par le haut — vl1 puis hautbois se retirent, le fleuve reste. F-41 aux raccords."
}
```

```json
{
  "exerciseId": "m07-e06-the-flood",
  "variantId": "vague",
  "payload": {
    "lengthBars": 24,
    "crescendoPlan": "identique à la variante paliers — mêmes leviers, mêmes sections",
    "entriesStyle": "entrées tuilées : chaque part entre en cours de phrase, crescendos individuels",
    "falseRecession": { "bars": [15, 16] },
    "summitHeld": 2.5,
    "exitGesture": "cut-to-solo",
    "exitDetail": "m24 temps 4 : tacet général → le hautbois seul — le pont vers e08"
  },
  "authorNotes": "Le même plan, l'autre architecture : les cinq courbes montrent des **rampes** au lieu d'escaliers. C'est toute la différence entre le crescendo qu'on voit monter et celui qu'on subit — les entrées invisibles de la clarinette-caméléon, appliquées à l'ensemble. La sortie change aussi de nature : la coupure vers le solo au dernier temps, qui n'est pas une fin mais **une porte** — elle ouvre littéralement sur e08, où le monde entier se tait pour une voix. Le diptyque a/b est une expérience contrôlée : mêmes leviers, mêmes mesures, deux dramaturgies."
}
```

**s07 — L'immeuble** (2 versions du tutti)

```json
{
  "exerciseId": "m07-e07-the-edifice",
  "variantId": "hymn",
  "payload": {
    "lengthBars": 8,
    "edifice": [
      { "stage": "ciel", "parts": ["violins-1"], "employment": "melody", "range": "E5–A5", "content": "la ligne d'Elena au sommet" },
      { "stage": "chant", "parts": ["violins-2", "oboe", "trumpet"], "employment": "melody", "content": "LA COLONNE — thème aux octaves ×3" },
      { "stage": "coeur", "parts": ["violas", "clarinet"], "employment": "harmony", "content": "les murs, voicings serrés, arches dyn[]" },
      { "stage": "corps", "parts": ["cellos", "french-horns"], "employment": "countermelody", "content": "le ténor en blanches" },
      { "stage": "socle", "parts": ["contrabasses", "cellos div."], "employment": "bass", "content": "rondes, quintes sans tierce" }
    ],
    "homophony": "≥ 0.8",
    "slowSocle": "durée moyenne du grave = 2,6× le corps"
  },
  "authorNotes": "La masse qui chante d'une voix. Les trois lois vérifiées étage par étage : **un emploi par étage** (le cœur qui doublerait le chant volerait l'étage du contrechant — LA source de boue des tuttis amateurs) ; **la mélodie en colonne** (≥ 2 étages d'octaves, détectés par les tags de doublure : le tutti n'expose pas une ligne fine, il l'érige) ; **le socle lent** (2,6× ≥ 2,0 — quand la masse doit courir, c'est le moteur qui court au corps, jamais le grave). Le rapport dessine la coupe d'immeuble : les cinq lignes de l01, remplies au maximum."
}
```

```json
{
  "exerciseId": "m07-e07-the-edifice",
  "variantId": "stratified",
  "payload": {
    "lengthBars": 8,
    "basis": "l'hymne, + le moteur au corps",
    "rhythmPlans": 4,
    "planArticulations": [
      { "plan": "ciel + chant", "articulation": "legato" },
      { "plan": "coeur", "articulation": "tenu" },
      { "plan": "corps (altos au pattern de croches)", "articulation": "détaché" },
      { "plan": "socle", "articulation": "rondes" }
    ]
  },
  "authorNotes": "La masse qui bout en restant lisible : quatre plans à rythmes distincts, **chacun avec SON articulation unifiée** — c'est la condition de lisibilité, et elle est mesurée par plan, pas globalement. Les altos quittent les murs pour le pattern de croches : le moteur entre au corps, l'étage prévu pour lui. `rolePlan` croisé à la `densityMap` : chaque bande garde son emploi unique ✓. « Préparé (par s06), tenu, quitté » — le budget dépensé en conscience, ce que le rapport nomme en toutes lettres."
}
```

**s08 — Le peu** (témoin F-41)

```json
{
  "exerciseId": "m07-e08-the-few",
  "payload": {
    "lengthBars": 16,
    "structure": [
      { "bars": [1, 2], "content": "le tutti FOURNI (la fin de e07)", "note": "hors jugement — F-41" },
      { "bars": [3, 8], "content": "LA COUPURE → le solo nu", "solo": "clarinette chalumeau", "argument": "la vérité d'Elena n'est pas une annonce — le caméléon au registre du secret", "accompaniment": ["contrabasses en tenues rares"], "elements": 1 },
      { "bars": [9, 13], "content": "L'ENTRÉE DU TÉMOIN : alto seul", "recipe": "response", "note": "il parle dans les respirations de la clarinette" },
      { "bars": [14, 16], "content": "LA DISSOLUTION : l'alto se tait, la clarinette pose sa quinte, la Cb reste — puis rien" }
    ],
    "maxActiveParts": 4,
    "doubling": "aucune",
    "silenceRatio": 0.34
  },
  "authorNotes": "**Témoin F-41 — les contraintes s'évaluent hors fenêtres du `given`.** L'exercice interdit toute doublure, mais son donné EST un tutti de 2 mesures saturé de doublures : la solution échouait sur des notes qu'elle n'a pas écrites. Le pipeline marque désormais les ticks du given, qui n'est jugé que comme contexte (liaisons, préparations, raccords) — troisième grande règle de fenêtrage du produit, générique et rétroactive. Le reste tient par soustraction : ≤ 4 parts, zéro doublure, un seul élément d'accompagnement (le presque-rien, pas un petit tapis), soliste en zone expressive (chalumeau D3–F4, §25.1). Et le silence est mesuré : **« 34 % de ta scène est tue — l'espace organise »** — crédité, pas toléré."
}
```

**s09 — La traduction** (témoin F-42)

```json
{
  "exerciseId": "m07-e09-the-translation",
  "payload": {
    "lengthBars": 16,
    "passDeliverables": {
      "pass1_roles": { "hiddenRoleFound": "le contre-chant fondu dans la main gauche, exhumé", "credit": true },
      "pass2_sections": { "sectionMap": "A – A' – B – A''" },
      "pass3_stages": { "note": "le grave éclaté en octaves — « le piano serrait, l'orchestre éclate »" },
      "pass4_casting": {
        "MD chantante": "violins-1",
        "accords": "violins-2 + violas (arches dyn[])",
        "basse": "cellos + contrabasses",
        "rôle caché": "cor"
      },
      "pass5_life": { "note": "arches sur toutes les tenues > 2 temps — les « deux tenues sans arche » du contre-exemple évitées" },
      "pass6_trial": { "automatedByEngine": true }
    },
    "arpeggioTranslation": { "chosen": "tapis-tenu", "class": ["tapis-tenu", "arpège-réparti (vl2 div.)", "trémolo-mesuré"] }
  },
  "authorNotes": "**Témoin F-42 — la table d'équivalences de traduction.** Le rapport promis disait « choix valide — le moteur l'aurait accepté autrement » : cette phrase supposait une donnée qui n'existait pas. Désormais chaque piège déclare sa classe d'équivalence, le checker crédite tout membre de la classe et **le rapport nomme les alternatives non choisies** — la pédagogie du « plusieurs bonnes réponses », chiffrée. Ici : l'arpège de pédale devient un tapis tenu, et l'élève lit que l'arpège réparti et le trémolo mesuré l'étaient aussi. Règle au manuel : *on traduit des rôles, jamais des notes recopiées — la réduction EST la traduction.* La passe 6 est documentée en `authorNotes` : c'est celle qui fuit le plus souvent, et celle que le moteur automatise."
}
```

**s10 — « Elena, le cue »** (48 mesures, tri-parts, le rapport le plus complet du produit)

```json
{
  "exerciseId": "m07-e10-the-orchestrated-cue",
  "partId": "part1-architecture",
  "payload": {
    "sectionMap": [
      { "id": "S1", "name": "L'EXIL", "bars": [1, 10], "regime": "intime", "effectif": ["clarinette chalumeau", "contrabasses"], "content": "le thème VOILÉ (fragments)" },
      { "id": "S2", "name": "L'ESPOIR", "bars": [11, 24], "regime": "la crue", "effectif": "hautbois + fleuve → +5 parts", "plan": "crescendoPlan 5 leviers (architecture vague, s06-b)" },
      { "id": "S3", "name": "LE SOUVENIR DU DÉPART", "bars": [25, 32], "regime": "tutti", "content": "l'immeuble (s07-a), le thème PLEIN — s30-elena intégral, extension m9–14 comprise" },
      { "id": "S4", "name": "LA VÉRITÉ", "bars": [33, 40], "regime": "coupure", "effectif": ["clarinette", "alto témoin"], "sectionEffectiveDelta": 0.71 },
      { "id": "S5", "name": "CE QUI RESTE", "bars": [41, 48], "regime": "coda", "effectif": ["celli ténor seuls"], "content": "LE FLEUVE devenu thème — l'échange de e05, ultime" }
    ]
  },
  "authorNotes": "« La forme d'un cue se planifie en effectifs avant de se planifier en thèmes. » Cinq sections nommées, leurs effectifs déclarés, le rolePlan par section, le crescendoPlan assigné à S2. Le geste se chiffre : la coupure S3→S4 mesure **71 % de différentiel d'effectif** ≥ 60 % — une coupure déclarée qui ne se chiffre pas n'est pas une coupure, c'est une diminution. La coda est le retournement du module : le contrechant du fleuve, né en M4 comme accompagnement, **finit thème** — cinq modules de métier pour cette seule ligne."
}
```

```json
{
  "exerciseId": "m07-e10-the-orchestrated-cue",
  "partId": "part2-score",
  "payload": {
    "lengthBars": 48,
    "format": "Part[]",
    "pool": "medium",
    "maxSimultaneousParts": 8,
    "verified": {
      "rolePlan": "détectés ≈ déclarés (l01)",
      "alloys": "celli+cor en S3, chimie ✓",
      "carpetLife": "les trois vies, S2–S3",
      "unifiedArticulation": "le moteur de S2",
      "hierarchy": "le duo de S2, effectivePower via dyn[]",
      "fiveCurves": "la crue de S2",
      "edifice": "S3, croisé densityMap",
      "silenceRatio": "S4 : 0.29",
      "melody": "archFit 0.77 contre le gabarit elena",
      "counterpoint": "cpt.* sur le contrechant",
      "harmony": "harmony.* sur la grille — le iv voilé de S5, tagué"
    }
  },
  "authorNotes": "Le moteur déroule TOUT le module, et tous les registres sortent verts ensemble — c'est le rapport le plus complet du produit. Le détail qui referme la boucle du cursus : le thème est jugé par `melody.*` contre le gabarit **elena**, celui-là même qui a été calibré en M2 sur ce personnage. **Le gabarit juge son propre cue**, archFit 0,77. Huit parts au plus fort seulement : le pool Medium n'est pas dépensé, il est administré — S1 en tient deux, S5 une seule."
}
```

```json
{
  "exerciseId": "m07-e10-the-orchestrated-cue",
  "partId": "part3-reading",
  "payload": {
    "commentary": {
      "basculePrincipale": "S3→S4 : le tutti coupé au couteau — le geste est l'effectif, pas l'harmonie",
      "budget": "le double-octave gardé pour m29 ; jamais de ff avant S3",
      "soliste": "clarinette — la vérité se murmure",
      "passe6Corrections": "quatre tenues sans arche en S2, reprises",
      "retire": "déclaratif, consigné"
    },
    "concordance": {
      "basculePrincipale": "concorde — 71 % mesurés",
      "budget": "concorde",
      "soliste": "concorde avec le rapport de registre de S4",
      "passe6Corrections": "croisé aux dyn[]"
    }
  },
  "authorNotes": "Le produit ne juge pas la prose, il vérifie la concordance déclaré↔détecté — et les quatre croisements concordent. Le champ le plus instructif est le budget : « jamais de ff avant S3 » est une décision d'économie qui se mesure sur la courbe de dynamique, et c'est elle qui rend le sommet possible. XP 400, badge de module. **Le portfolio gagne sa troisième pièce maîtresse** : *« Elena » — un personnage, un cue, cinq modules de métier en 48 mesures.* Le fil m02→m04→m06→m07 est refermé."
}
```

---

**Comptage.** 15 fichiers : s01, s02, s03 ×2, s04, s05, s06 ×2, s07 ×2, s08, s09, s10 ×3 — déjà comptés en §73.3, le cumul ne bouge pas. Quatre transcriptions restent au niveau du plan là où la source l'était (s04 par crans, s07 par étages, s10-part2 par registres vérifiés) : les lots ont écrit la coupe d'immeuble et la carte des crans, pas les 48 mesures note à note — chiffrer davantage serait inventer.