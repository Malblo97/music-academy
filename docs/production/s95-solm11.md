Les 8 fichiers, transcrits de §77.2. M11 est le seul module dont les étalons ne sont pas des compositions mais des **annotations** : le payload porte le jeu de référence, et la particularité tient en une phrase — un étalon d'analyse n'est pas « une bonne réponse », c'est **la vérité elle-même**, donc le plafond. Corrélation 1,0 sur les courbes, 100 % sur la reconstruction : les seuils élèves (`archFitMin: 0.5`, `melodyMinMatch: 0.9`) se calibrent contre ces deux bornes.

Le lot a livré en passant le générateur (`GeneratorRecipe` + `GenerationTruth`, verrou CI n°5 : `détection ⊇ vérité`) et **huit recettes versionnées** — dont `G-M48`, qui convertit la pièce-mystère de m01-e48 en recette à seed figé et sort un asset du backlog. J'ai gardé **8 fichiers et non 15** : la source compte 8 étalons, les parts vivent dans le payload.

---

**s01 — La première enquête** (sur `G-M48`)

```json
{
  "exerciseId": "m11-e01-first-inquiry",
  "payload": {
    "corpus": "G-M48 (la pièce-mystère de m01-e48, devenue recette à seed figé)",
    "pass1": {
      "emotionAdjectives": ["suspendu", "voilé", "patient"],
      "theMoment": { "bar": 19, "why": "la bascule d'ambiguïté — la zone `ambiguous` de la recette" }
    },
    "pass2": {
      "labelSegments": "la forme plantée, frontières à ±0",
      "drawTension": { "correlation": 1.0, "note": "l'étalon EST la courbe machine ; seuil élève ≥ 0,5" }
    },
    "pass3": {
      "zooms": ["name-chords sur le moment", "mark-occurrences"],
      "occurrences": { "planted": 5, "emergent": 2, "note": "F-50" }
    }
  },
  "authorNotes": "**Témoin F-50 — la concordance se juge contre l'union vérité ∪ détection.** La recette plante 5 occurrences du motif, `findMotifs` en trouve 7 : deux répétitions **émergentes**, que la musique produit toujours. L'élève qui les marque serait « faux » contre la vérité plantée et pourtant juste musicalement — désormais une annotation est correcte si elle appartient à la vérité **ou** à la détection, seul le vrai faux-positif pénalise, et le rapport distingue « planté » de « émergent — bien vu ». Le choix du moment tombe sur la zone ambiguë de la recette : c'est ce que l'exercice récompense (`zoomChoiceScored`), parce que l'analyse commence toujours par ce qui marche. Le rapport ne dit jamais « faux » : il dit *« ta courbe monte deux mesures avant la machine — tu entends la tension ARRIVER, c'est une qualité d'oreille. »*"
}
```

**s02 — La biographie d'Elena** (sur m07-s10)

```json
{
  "exerciseId": "m11-e02-elenas-biography",
  "payload": {
    "corpus": "m07-s10 — le cue Elena, 48 mesures, solution de référence",
    "identity": {
      "cell": "la tête du thème (3 notes survivantes au fredon)",
      "layers": {
        "intervallic-signature": "la quarte (l'appel) et la sixte mineure (l'élan douloureux)",
        "rhythmic-archetype": "l'anacrouse iambique",
        "anchoring": "la tonique atteinte par le bas"
      }
    },
    "occurrences": {
      "count": 11,
      "byType": { "exact": 3, "transposé": 2, "fragmenté": 3, "augmenté": "S3", "voilé": 2 }
    },
    "biographyTable": {
      "columns": ["occurrence", "transformation", "harmonie", "porteur", "scène"],
      "keyRow": "S5 — le fleuve devenu thème, celli"
    },
    "regimeDiagnosis": { "verdict": "theme-narrative", "argued": true }
  },
  "authorNotes": "« Tu analyses une œuvre dont le produit possède l'intention » — et c'est ce qui fait de cet exercice **l'analyse la plus vérifiable jamais construite** : les onze vies sont créditées par type contre `findMotifs`, les harmonies contre les tags, les porteurs contre le `rolePlan` de la solution. Les deux colonnes que les débutants oublient sont les deux transformations reines du cinéma, et l'étalon les met en évidence : la réharmonisation (même mélodie, autre monde — le détecteur d'état dramatique le plus fin) et le changement de porteur (**qui porte le thème = où en est le personnage**). La ligne-clé du tableau est le retournement du cue : en S5, le contrechant né en M4 comme accompagnement est devenu le thème, aux celli."
}
```

**s03 — Le diagnostic** (4 extraits générés)

```json
{
  "exerciseId": "m11-e03-the-diagnosis",
  "payload": {
    "extract-1": {
      "system": "fonctionnel à emprunts",
      "annotations": ["QCM système", "name-functions aux charnières", "iv emprunté pointé", "subV pointé"],
      "notationLanguage": "roman-degrees"
    },
    "extract-2": {
      "system": "modal",
      "annotations": ["piliers", "cadence dorienne"],
      "notationLanguage": "pillars-and-mode"
    },
    "extract-3": {
      "system": "non-fonctionnel",
      "annotation": "collection : octatonique ; geste : rotation",
      "notationLanguage": "collection-and-gesture",
      "note": "requireCollection employé en sens inverse — le checker devenu détecteur"
    },
    "extract-4": {
      "system": "switching",
      "boundary": "pointée à ±0 mesure",
      "note": "la couture est dans la recette"
    }
  },
  "authorNotes": "L'erreur universelle est évitée par construction : **le système d'abord, le chiffrage ensuite** — chiffrer accord par accord produit une liste juste qui ne comprend rien. Les trois questions à l'oreille tranchent (la sensible tire-t-elle ? un centre sans aimant ? ni l'un ni l'autre ?), et le système dicte le LANGAGE : chiffrer du planing en degrés fonctionnels est un contresens, et `notationLanguageMatchesSystem` le pénalise — le respect d'objet vaut à l'analyse comme à la composition. L'extrait 4 est le vrai test : les frontières de système sont des **événements dramatiques**, et celle-ci est plantée dans la recette, donc vérifiable à la mesure près."
}
```

**s04 — La lecture d'effectifs** (le diptyque « La Remise » en corpus)

```json
{
  "exerciseId": "m11-e04-reading-the-forces",
  "payload": {
    "orchestral": {
      "corpus": "m10-e15 — solution de référence, 3 min",
      "timeline": "role-map des 5 sections = le rolePlan de la solution",
      "cuts": [
        { "atTimecode": "0:47.0", "note": "le creux — S4" },
        { "atTimecode": "2:12.0", "note": "le sommet — S3" }
      ],
      "cutDiscipline": { "socleFirst": true, "oneLinePerListen": true },
      "events": { "count": 4, "deviation": "±0", "types": ["net-entry", "thickening", "exit", "cut"] },
      "themeCarrierPerExposition": "vérifié contre le rolePlan"
    },
    "hybrid": {
      "corpus": "m06-e15 — solution de référence, 60 s",
      "worldDiagnosis": {
        "perLayer": true,
        "undecidable": ["le pad-fantôme", "le top granulaire"],
        "note": "2 « indécidable » CRÉDITÉS — la recette les justifie (F-50)"
      }
    }
  },
  "authorNotes": "Les cinq lignes se visitent, elles ne se lisent pas d'un coup : cinq écoutes du même instant, une ligne par écoute, **le socle en premier** (le grave conditionne tout et s'isole le plus facilement). Le cœur n'est jamais oublié dans l'étalon — les murs sont FAITS pour se fondre, donc ils sont là : le test est de couper mentalement le chant et d'écouter ce qui reste. L'épaississement compte comme un événement au même titre qu'une entrée (`thickeningCountsAsEntry`) : le son qui grossit sans qu'on sache pourquoi, c'est une doublure qui vient d'arriver. Et le volet hybride pose le principe que F-50 a rendu mesurable : **« indécidable » est un verdict, pas un échec** — l'hybride réussi est invisible, et noter où l'on ne peut pas trancher, c'est cartographier le savoir-faire du mixeur."
}
```

**s05 — L'autopsie du temps** (sur `G-05` + le spotting inversé)

```json
{
  "exerciseId": "m11-e05-time-autopsy",
  "payload": {
    "volet1": {
      "corpus": "G-05 — 2'30\", 3 moteurs, une frontière floue plantée",
      "labelSegments": { "note": "la frontière floue QUALIFIÉE comme floue, pas tranchée" },
      "drawTension": { "correlation": 1.0 },
      "engineChecklist": {
        "S2": ["effectif", "activité"],
        "S3": ["effectif", "activité", "dynamique"],
        "note": "= le tensionPlan de la recette",
        "verdictSentence": "requise"
      }
    },
    "volet2": {
      "corpus": "m10-e15 + la vidéo « La Remise »",
      "spottingInverse": {
        "servie": ["B1", "B2"],
        "traversee": ["B3 — le cue la traverse exprès (legato d'image)"],
        "refusee": [],
        "mickeyMousing": "absent",
        "musicInOut": "vérifié contre le spotting F-36"
      }
    }
  },
  "authorNotes": "La compétence-signature de l'analyste-compositeur : **le spectateur sent que ça monte, toi tu sais avec quoi.** La check-list des moteurs par segment se compare au `tensionPlan` de la recette, moteur par moteur — et le crescendo pauvre (le volume seul) doit être nommé quand il apparaît : `poorCrescendoMustBeNamed`, parce que l'indulgence d'oreille est l'ennemie. La frontière floue est l'autre leçon : **l'ambiguïté de couture est un choix de compositeur, donc une information d'analyse** — la qualifier vaut mieux que la trancher. Et le spotting inversé pose la question reine, la plus dramaturgique et la moins analysée : où la musique commence-t-elle, et où s'arrête-t-elle ?"
}
```

**s06 — La fiche western** (corpus `G-W1…5` ; témoin F-51)

```json
{
  "exerciseId": "m11-e06-the-western-file",
  "payload": {
    "part1-distillation": {
      "shortGrids": 5,
      "recurrenceTable": {
        "keyVerdict": "la pièce 4 viole le trot et reste western",
        "counterExample": { "piece": "w4", "violatedTrait": "dotted-trot" },
        "note": "le trait « trot » descend à 4/5, reste ≥ 4 avec pondération"
      }
    },
    "part2-file": {
      "traits": 8,
      "compiled": [
        { "trait": "mixolydien", "key": "requireCollection" },
        { "trait": "quintes à vide", "key": "mustContainInterval [P5, P4]" },
        { "trait": "trot pointé", "key": "prosodyPlan + syncopationTarget" },
        { "trait": "espace", "key": "contraintes d'ambitus / registre" },
        { "trait": "sommet modeste", "key": "climaxWindow" }
      ],
      "freeText": "la prose de la fiche — non compilée",
      "template": "le gabarit western de l'annexe D"
    },
    "part3-test": { "lengthBars": 8, "judgedAgainstOwnFile": true, "score": 91 }
  },
  "authorNotes": "**Témoin F-51.** « Le moteur compile tes traits en contraintes » était impossible sur du texte libre : la fiche devient un **formulaire à champs mappés** sur le registre de l'annexe C, plus un champ libre non compilé. Les 8 mesures ne sont alors jugées que par les clés compilées — l'exercice le plus méta du produit devient mécanique. Le contre-exemple est le cœur pédagogique : **il viole un trait présumé et reste western**, ce qui sépare le trait du cliché. Et la distillation vit de la LARGEUR : 20 minutes par pièce, pas deux heures — une fiche de 30 lignes est un inventaire, pas un outil. *La fiche que personne n'a écrite, testée en composant.*"
}
```

**s07 — La reconstruction** (sur `G-07`)

```json
{
  "exerciseId": "m11-e07-the-reconstruction",
  "payload": {
    "corpus": "G-07 — 16 mesures, 4 couches (thème, contrechant, tapis, basse), niveau maquette",
    "part1-preliminary-analysis": {
      "submittedBeforeEditor": true,
      "annotations": ["name-chords", "role-map"],
      "note": "lockEditorUntilSubmitted — l'hypothèse verrouillée"
    },
    "part2-reconstruction": {
      "reference": "le MIDI de référence lui-même",
      "reconstructionDelta": { "global": 1.0, "note": "le plafond ; seuils élève : mélodie ≥ 0,9, basse ≥ 0,8, voix internes par proximité" },
      "buildOrder": ["tempo", "grid", "bass", "harmony", "melody", "countermelody", "manner"]
    },
    "errorMap": { "content": "vide — le gabarit de rapport calibré sur les deux bornes (0 % et 100 %)" }
  },
  "authorNotes": "« L'analyse écrite peut mentir — on croit avoir compris, on a décrit. **La reconstruction ne mente pas.** » L'étalon est ici tautologique et c'est voulu : la maquette de référence EST la cible, différentiel 100 % — sa fonction n'est pas de montrer une bonne réponse mais de **calibrer le gabarit de rapport sur ses deux bornes**, la carte des écarts vide d'un côté, saturée de l'autre. Deux mécaniques méritent leur mention : l'éditeur verrouillé jusqu'à soumission de l'hypothèse (la reconstruction EXÉCUTE une analyse, elle ne la remplace pas) et la passe « manière » — articulations, dynamiques, espace : souvent 50 % de l'écart restant, et ce qui sépare « les bonnes notes » de « le même son ». Rappel éthique porté par la spec : le reverse-engineering est un outil d'apprentissage **privé** — c'est pourquoi on ne reconstruit que le corpus interne."
}
```

**s08 — L'enquête en autonomie** (sur `G-08` — le capstone)

```json
{
  "exerciseId": "m11-e08-the-inquiry",
  "payload": {
    "corpus": "G-08 — 3 min, 4 sections, bascule de système, thème à 3 vies, crescendo multi-moteurs",
    "part1-free-inquiry": {
      "zooms": ["LE moment", "charnière 1", "charnière 2"],
      "note": "le choix des zooms est noté — ils tombent sur le moment et les deux charnières",
      "annotations": "≥ 6, choix libre dans le kit, vérifiées contre generationTruth"
    },
    "part2-one-page": {
      "fields": ["l'œuvre en 3 phrases", "la forme", "le système et ses bascules", "le thème et ses vies", "la fabrication du sommet", "2 procédés à voler", "1 absence signifiante"],
      "concordance": "champ par champ ✓"
    },
    "part3-legal-theft": {
      "procedure": "la fausse décrue (identifiée en part 2)",
      "lengthBars": 8,
      "contextDelta": { "keyChanged": true, "tempoChanged": true, "instrumentationChanged": true },
      "procedurePresent": "tagué ✓",
      "sourceMaterialAbsent": "findMotifs contre la source : zéro occurrence ✓"
    },
    "exitDiagnosis": { "consolidatesFrom": "e01 → e08", "outputs": ["strong-families", "recurrent-gaps", "modules-to-revisit"] }
  },
  "authorNotes": "La liberté est le test : tout le kit est disponible, et **le choix des zooms est noté** — zoomer sur LE moment et les charnières, c'est la méthode ; zoomer au hasard, c'est la leçon 1 à revoir. La synthèse d'une page est le format professionnel, celui qu'on rend à un réalisateur ou qu'on garde en cahier : sept champs, dont le plus révélateur est **l'absence signifiante** — ce qui n'est pas là et qui compte. Et le vol légal clôt le module en une vérification double : le procédé PRÉSENT par les tags, le matériau original ABSENT par `findMotifs` à zéro occurrence. **On vole des procédés, jamais des notes.** XP 350, badge, et le diagnostic de sortie consolide les sept exercices précédents en trois sorties : ce qui est solide, ce qui manque, ce qu'il faut revisiter."
}
```

---

**Comptage.** 8 fichiers — déjà comptés en §77.3, où ils soldent le backlog : **M1 · M2 · M3 · M4 · M6 · M7 · M8 · M10 · M11 = 191 solutions/étalons, 51 findings** au moment de la clôture (65 après les lots M9 et M5 produits depuis). Ces étalons sont les seuls du projet à ne contenir aucune note : leur matière est la vérité de génération, et c'est précisément ce qui rend M11 corrigeable automatiquement — le produit ne fait analyser que ce dont il possède l'intention.