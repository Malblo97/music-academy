Les 26 fichiers (e09→e34). Comme pour M5, **ce lot est une production neuve** : §63–77 ne couvrent que les huit exercices du MVP. Les six pièces harmoniques sont composées et vérifiées ici ; les vingt autres sont des plans déclaratifs (LAYERING, ARRANGEMENT, Part[], DAW_MISSION), donc jugées sur leur structure.

**Cinq findings, dont deux bloquants.**

**F-66 — e13 : `forbidLeadingTone` interdit le cycle que la spec impose (contradiction, famille F-54).** Le cycle obligatoire est C → E → A♭ → C, tous majeurs. **Mi majeur contient un si** — la sensible de do, que `forbidLeadingTone: true` bannit. La solution est insoluble à la lettre. *Patch* : `forbidLeadingTone` s'évalue **en contexte fonctionnel** — un si qui n'est ni précédé d'une dominante ni résolu sur la tonique n'est pas une sensible, c'est la tierce d'un accord ; le drapeau devient `forbidLeadingToneResolution`. C'est d'ailleurs le point de la leçon : trois majeurs purs, aucun n'attire.

**F-67 — e11 : la médiante de seuil n'a pas de place dans la grille imposée.** `requiredProgressionPattern` fixe huit accords, `lengthBars` vaut 16, et `thresholdMediant.count: 1` exige un accord **que le pattern ne contient pas**. *Patch* : `chordBars` (F-52) mappe le pattern sur les mes. 1–8 et 11–16 ; les mes. 9–10 sont la fenêtre libre du seuil.

**F-68 — `notesPerMinuteMax` compte la texture entière (e15, e16).** 16 mesures à ♩=62 font 1,03 minute : le plafond de 60 autorise **61 notes**, et un choral de cinq voix en rondes en compte 80. Le drame échoue en écrivant exactement ce que la leçon demande. *Patch* : le compte porte sur la **couche mélodique**, pas sur les voix d'harmonie.

**F-69 — e31 : `signatureRecognizableInAll` contre deux variantes qui la déforment par contrat.** Le seuil `minSimilarity: 0.6` s'applique aux sept, mais « fragment » n'en garde que trois notes sur cinq (= 0,60 pile) et « distordu » altère les intervalles par définition. *Patch* : similarité scopée par variante — fragment jugé comme **sous-ensemble**, distordu sur **rythme + contour** seulement.

**F-70 — l'animatique d'e19 n'est pas chiffrée (famille F-58).** `hitMap` compare à 8 timecodes qui n'existent nulle part, et e20 en dépend par `sourceSubmission`. À produire avec l'asset, avant les deux solutions.

---

## Horreur

```json
{
  "exerciseId": "m09-e09-consonance-investment",
  "notation": "A4:h E5:h | C5:q B4:q A4:h | E4:h A4:h | C5:q B4:q A4:h | A4:h E5:h | C5:q D5:q E5:h | D5:q C5:q B4:h | A4:w | A4:h E5:h | C5:q B4:q A4:h | E4:h A4:h | A4:w",
  "payload": {
    "tempoBpm": 52,
    "layers": [
      { "id": "gouffre", "role": "sub", "band": [25, 45], "note": "sinus 31 Hz, mono, présent mes. 1–20 puis RETIRÉ" },
      { "id": "berceuse", "role": "melodic", "source": "boîte à musique", "bars": [1, 12], "note": "la mineur diatonique, naïve" },
      { "id": "rupture", "role": "fx", "type": "cluster", "bars": [13, 16], "note": "cordes divisi ppp → ff, seconde mineure qui enfle" }
    ],
    "consonanceInvestment": { "consonantBars": 12, "dissonanceContinuousBars": 4, "contrastRatio": 0.67 },
    "end": { "bars": [17, 24], "content": "la boîte à musique SEULE, deux phrases tronquées, puis le silence", "layersDelta": -1, "levelDelta": -8 }
  },
  "authorNotes": "« Tu dois écrire de la berceuse pour que le cluster existe. » Douze mesures d'investissement consonant ≥ 10 — c'est l'exercice, pas l'ornement : la dissonance permanente ne fait pas peur, l'oreille s'adapte à tout en trente secondes, et c'est le PASSAGE qui mord. La rupture ne dure que 4 mesures (le plafond) et le retour est plus vide que le début : la boîte à musique perd son gouffre, et **le retrait du sub sous 40 Hz est un soulagement physique** — on ne l'entendait pas, on le subissait. Deux couches actives au maximum : si la `densityMap` s'allume dans une scène d'horreur, on a écrit de l'action."
}
```

```json
{
  "exerciseId": "m09-e10-approach-and-rupture",
  "payload": {
    "durationSec": 120,
    "scene": "le grenier",
    "entries": [
      { "atSec": 0, "layer": "gouffre", "note": "orgue 32′ + sub, seuls" },
      { "atSec": 7, "layer": "peau", "technique": "divisi con sord ppp, sul ponticello" },
      { "atSec": 11, "layer": "le-faux", "note": "deux pupitres désaccordés d'un quart de ton, micro-glissandi" },
      { "atSec": 30, "layer": "l-objet", "note": "piano préparé — trois notes en 40 secondes" },
      { "atSec": 74, "layer": "l-humain-devoye", "note": "chœur chuchoté — le pire timbre du genre : le nôtre" }
    ],
    "entryIntervals": [7, 4, 19, 44],
    "stinger": { "atSec": 96, "silenceBeforeSec": 2, "count": 1 },
    "silenceAfterStinger": { "sec": 4, "total": true },
    "end": { "content": "le gouffre seul, une octave plus bas qu'au début, puis le retrait", "layersDelta": -1 },
    "pulse": "aucun — aucune attaque périodique détectable"
  },
  "authorNotes": "L'horreur **ne culmine pas, elle creuse**. Trois interdits vérifiés. Pas de pouls : le tempo est l'ennemi n°1, un pouls perceptible donne une prise à l'auditeur, il anticipe, il se protège. Les entrées à intervalles inégaux — 7 s, 4 s, 19 s, 44 s : l'irrégularité est la règle, et la variance mesurée le prouve. Un seul stinger, précédé de deux secondes de vide, jamais à intervalle prévisible : **le troisième stinger d'un film fait rire**. Et la couche la plus efficace du tableau est employée à plein : quatre secondes de rien après le coup — la peur n'est pas dans le coup, elle est dans ce qui le suit."
}
```

## Fantasy

```json
{
  "exerciseId": "m09-e11-threshold-mediant",
  "payload": {
    "key": "fa majeur",
    "meter": "6/8",
    "lengthBars": 16,
    "chordBars": [
      { "bars": [1, 2], "chord": "F(5)" },
      { "bars": [3, 4], "chord": "G(add9)", "note": "le II majeur — le lydien qui s'ouvre, le si♮ = ♯4̂" },
      { "bars": [5, 6], "chord": "F/A" },
      { "bars": [7, 8], "chord": "Eb", "note": "♭VII" },
      { "bars": [9, 10], "chord": "Db", "note": "LA MÉDIANTE DE SEUIL — fenêtre libre (F-67)" },
      { "bars": [11, 12], "chord": "Bb" },
      { "bars": [13, 13], "chord": "F/C" },
      { "bars": [14, 14], "chord": "Eb" },
      { "bars": [15, 16], "chord": "F" }
    ],
    "thresholdMediant": { "bar": 9, "from": "Eb", "to": "Db", "commonTone": "le fil : la♭ ≡ sol♯ tenu au ténor", "unprepared": true },
    "lydianArrival": { "bars": [3, 4], "consecutiveMax": 2 }
  },
  "authorNotes": "« Rien ne la prépare, rien ne l'explique. On était là, on est ailleurs. C'est tout le métier. » La médiante occupe la fenêtre libérée par F-67, aux mes. 9–10 — précédée du ♭VII, reliée par un seul fil de note commune, et **unique** : la rareté fait le seuil. Deux interdits tenus : aucun V7→I (la fantasy évite la dominante non par gravité comme l'épique, mais parce que V→I raconte une histoire humaine qui se RÉSOUT — un monde ne se résout pas, il continue) et **on n'habite pas le lydien** : deux mesures d'arrivée sur le II majeur, pas davantage, parce que l'émerveillement sans repos est écœurant. Conclusion plagale ♭VII→IV→I : le rituel, l'amen."
}
```

```json
{
  "exerciseId": "m09-e12-hameau-to-world",
  "payload": {
    "durationSec": 105,
    "meter": "6/8",
    "planPlan": [
      { "plan": "hameau", "sec": [0, 18], "parts": ["flûte solo"], "note": "6 mesures, UNE part — le motif des habitants, le plan que tout le monde oublie" },
      { "plan": "feerie", "sec": [18, 40], "gestures": [{ "atSec": 21, "harpe": "arpège montant" }, { "atSec": 29, "célesta": "trois notes" }, { "atSec": 37, "harpe": "glissando" }], "count": 3 },
      { "plan": "seuil", "atSec": 47, "silenceBeforeSec": 1, "content": "la médiante chromatique" },
      { "plan": "monde", "sec": [48, 92], "parts": ["cors ×4", "cordes chaudes en unisson large", "chœur"], "cadence": "♭VII→IV→I" },
      { "plan": "retrait", "sec": [92, 105], "parts": ["flûte solo"], "note": "seule, à nouveau" }
    ],
    "threeVersionsTest": ["flûte solo (le hameau)", "cors + cordes (le monde)", "chœur (le mythe)"],
    "theme": { "diatonic": true, "largeLeaps": 1, "conjunctRatio": 0.74 }
  },
  "authorNotes": "**L'ordre compte plus que tout : on part de l'échelle humaine.** C'est la petite flûte du début qui donne sa taille au tutti — sans elle, le grand orchestre n'est pas grand, il est juste fort. Le budget de féerie est tenu à trois gestes ponctuels : le célesta partout devient un papier peint. Le seuil est précédé d'une seconde de silence exacte, et le test des trois versions passe (`findMotifs` reconnaît le même thème dans les trois habits) — un thème de fantasy qui ne survit pas aux trois n'en est pas un. Il est diatonique, conjoint à 74 %, un seul grand saut : **un habitant du monde doit pouvoir le fredonner.** Et le retrait rend la flûte au silence : le monde continue sans nous."
}
```

## Science-fiction

```json
{
  "exerciseId": "m09-e13-weightless-mediants",
  "payload": {
    "durationSec": 90,
    "durationNotation": "secondes",
    "staticBass": "do, tenu 90 secondes",
    "cycle": [
      { "sec": [0, 22], "chord": "C", "voicing": "[C2+C3+G3+E4]" },
      { "sec": [22, 45], "chord": "E/C", "voicing": "[C2+B2+G#3+E4]", "commonTone": "mi tenu au soprano" },
      { "sec": [45, 68], "chord": "Ab/C", "voicing": "[C2+C3+Ab3+Eb4]", "commonTone": "sol♯ ≡ la♭ tenu à l'alto" },
      { "sec": [68, 90], "chord": "C", "voicing": "[C2+C3+G3+E4]", "commonTone": "do tenu à la basse et au ténor" }
    ],
    "optionalTools": ["quartal — deux quartes empilées au ciel, sec. 45–68"],
    "verified": { "parallels": 0, "crossings": 0, "cadences": 0 }
  },
  "authorNotes": "**Témoin F-66.** Le tour de magie central du genre — faire perdre la tonique en ne donnant QUE des consonances — est arithmétiquement incompatible avec `forbidLeadingTone` : **mi majeur contient un si**. Le patch requalifie le drapeau (un si non préparé et non résolu n'est pas une sensible, c'est une tierce), et c'est exactement le propos de la leçon : trois triades majeures pures à distance de tierce majeure, sur la même basse, **aucune plus légitime que l'autre** — le cycle se referme, il n'y a plus de hiérarchie. Le mot « progression » est déjà un contresens : on n'avance pas, on flotte. Zéro parallèle, zéro croisement, un fil de note commune à chaque bascule, aucune cadence. Et les durées sont écrites en **secondes**, comme le fait le métier."
}
```

```json
{
  "exerciseId": "m09-e14-one-human-voice",
  "payload": {
    "durationSec": 180,
    "states": [
      { "id": "le vide", "sec": [0, 26], "layers": ["drone"], "note": "le drone SEUL 26 s — le genre installe son échelle de temps" },
      { "id": "l'humain", "sec": [26, 62], "adds": ["cor solo"], "unaccompaniedBars": 6, "note": "UNE couche solo, jamais deux" },
      { "id": "la mécanique", "sec": [62, 118], "adds": ["séquenceur 1/8 régulier"], "note": "pulsation INHUMAINE — aucun backbeat, aucun swing : dès qu'on peut hocher la tête, on est dans l'action" },
      { "id": "l'immense", "sec": [118, 166], "adds": ["nappes", "chœur"], "note": "la seule couche autorisée à enfler" },
      { "id": "la coupure", "sec": [166, 180], "content": "tout tacet, le drone seul" }
    ],
    "transitions": "par transformation continue — un filtre qui s'ouvre, une nappe qui se substitue ; jamais par cadence",
    "drift": "chaque couche dérive : cutoff, détune, densité de grains",
    "braams": 0
  },
  "authorNotes": "« Cent pistes de synthé produisent du froid, et le froid n'émeut pas : il ennuie. » **Il faut un humain dans le cadre** — le cor solo est l'unité de mesure qui rend l'immensité perceptible, même principe que la petite flûte de la fantasy et le piano de e32. Les 26 secondes de drone seul ne sont pas du remplissage : un score de SF pressé n'est pas de la SF. La forme est **par états**, pas par sections : on y entre par transformation continue, jamais par cadence — et tout état dérive imperceptiblement, parce que le pad qui dure trois minutes sans bouger fait décrocher. Zéro braam : le cliché est refusé par contrat."
}
```

## Drame

```json
{
  "exerciseId": "m09-e15-subtext-not-emotion",
  "payload": {
    "tempoBpm": 62,
    "lengthBars": 16,
    "harmonicRhythm": "un accord toutes les 2 mesures",
    "chordBars": [
      { "bars": [1, 2], "chord": "Am7", "pedal": "la" },
      { "bars": [3, 4], "chord": "Fmaj7/A" },
      { "bars": [5, 6], "chord": "C/A", "note": "sans tierce affirmée" },
      { "bars": [7, 8], "chord": "G7sus4/A", "note": "le iv approché" },
      { "bars": [9, 10], "chord": "Am7" },
      { "bars": [11, 12], "chord": "Fm(add9)/A", "note": "LE iv EMPRUNTÉ — non récompensé" },
      { "bars": [13, 14], "chord": "C/A", "note": "la phrase retombe : le nuage ne se dissipe pas" },
      { "bars": [15, 16], "chord": "C(5)", "note": "sans tierce — on refuse de dire si c'est triste" }
    ],
    "imprint": { "notes": "E4 – D4 – E4", "occurrences": 5, "note": "une empreinte, pas une phrase" },
    "tonicPedal": { "bars": [1, 16], "note": "la, immobile" },
    "minimalVoiceMovement": { "maxChangedNotes": 2, "ratio": 0.63 },
    "dynamicsMax": "mp",
    "climax": null
  },
  "authorNotes": "**Témoin F-68.** Le plafond `notesPerMinuteMax: 60` compté sur la texture entière rend l'exercice insoluble : 16 mesures à ♩=62 font 1,03 minute, donc 61 notes autorisées — et un choral de cinq voix en rondes en compte 80. Le patch scope le compte à la couche mélodique. Le reste est la loi du genre : **la musique ne dit pas ce que le personnage ressent, elle dit ce qu'il NE DIT PAS.** Si l'acteur pleure et que la musique pleure, les deux s'annulent — le pléonasme émotionnel est l'erreur la plus coûteuse du drame, et on compose un cran en dessous. Le iv arrive mes. 11 et **n'est pas récompensé** : la phrase suivante retombe. Deux accords sans tierce, une pédale de tonique sur seize mesures, deux notes changées par transition au maximum, et **aucun climax** — l'arche de M2 est délibérément refusée. La mélodie n'est pas une phrase : c'est une empreinte de trois notes, répétée cinq fois. Ici la répétition est l'usure du quotidien, pas la tension du thriller."
}
```

```json
{
  "exerciseId": "m09-e16-one-peak-per-film",
  "payload": {
    "sharedCell": "l'empreinte E4–D4–E4 de e15",
    "cues": [
      { "id": "cue-1", "act": "le début", "layers": 2, "parameter": "la cellule quasi nue — piano + une tenue d'alto", "dynamicsMax": "p" },
      { "id": "cue-2", "act": "le milieu", "layers": 3, "parameter": "+ le violoncelle — UN paramètre de plus, toujours retenu", "dynamicsMax": "mp" },
      { "id": "cue-3", "act": "le sommet", "layers": 4, "parameter": "+ les cordes en unisson et UN cor", "peak": { "bars": [9, 11], "unaccompanied": true, "maxBars": 3 }, "note": "puis plus rien" }
    ],
    "musicSceneOffset": { "cue": "cue-2", "type": "stops-before-scene-end" },
    "forbidden": ["trumpet", "percussion", "brass-tutti"]
  },
  "authorNotes": "« Le budget émotionnel du drame se gère à l'échelle du FILM, pas de la scène. » Un paramètre par cue, et un seul — **c'est la vis du thriller désarmée** : la même mécanique de transformation graduelle, employée pour dire l'usure au lieu de la peur. Le sommet unique tombe dans le cue 3, dure trois mesures, et il est **sans accompagnement** : la seule fois du film où ça déborde. Puis plus rien. Le geste caractéristique est placé au cue 2 : la musique s'arrête avant la fin de la scène — **le décalage musique/scène indique au spectateur que ce qu'il voit n'est pas ce qui compte.**"
}
```

## Comédie

```json
{
  "exerciseId": "m09-e17-the-deadpan-loop",
  "payload": {
    "durationSec": 90,
    "tempoBpm": 132,
    "tempoStability": 0.96,
    "pool": "chamber",
    "parts": ["cordes pizz", "basson staccato", "clarinette", "woodblock"],
    "structure": [
      { "sec": [0, 34], "content": "le trot pizzicato — ré majeur franc, cadences nettes, un accord par mesure" },
      { "sec": [34, 42], "content": "LA CATASTROPHE — la musique continue à l'identique, aucun commentaire" },
      { "sec": [42, 90], "content": "reprise de la boucle, similarité 0,97" }
    ],
    "voiceBandClear": { "band": [200, 2000], "energyRatio": 0.19 },
    "syncPoints": 0
  },
  "authorNotes": "La troisième manœuvre du genre, souvent la plus efficace : **refuser de commenter**. Le trot s'installe, élégant et parfaitement sérieux, la catastrophe arrive, et la musique continue comme si de rien n'était — similarité mesurée 0,97 après l'événement. La loi qui gouverne tout : **ne ris pas à la place du spectateur** — une musique qui souligne la blague la tue, parce qu'elle révèle que quelqu'un a écrit la blague. Deux contraintes structurelles : la régularité (le contre-pied n'existe que sur fond de métronome) et le petit effectif, qui est un principe et non un budget — un grand orchestre n'est pas drôle, il est imposant, et on doit entendre chaque instrument comme un personnage. Le médium reste libre à 0,19 : **la comédie repose sur le dialogue, et un score qui masque une réplique a détruit la scène.**"
}
```

```json
{
  "exerciseId": "m09-e18-silence-as-punchline",
  "payload": {
    "durationSec": 60,
    "tempoBpm": 126,
    "pool": "chamber",
    "gestures": [
      { "step": 1, "sec": [0, 22], "content": "l'attente — sol majeur sérieux et compétent, qui PROMET quelque chose", "bars": 12 },
      { "step": 2, "sec": [22, 38], "content": "l'accelerando de panique", "bpm": "126 → 152", "overBars": 6 },
      { "step": 3, "atSec": 38, "content": "LE SILENCE — 2 secondes, écrites, sur la chute", "total": true },
      { "step": 4, "atSec": 40, "content": "LA REMISE", "placement": "too-late", "offsetBeats": 2, "note": "la gêne — le décalage EST la blague" }
    ],
    "gagCadence": { "atSec": 21, "type": "V-silence", "note": "la porte qu'on n'ouvre pas" },
    "voiceBandClear": { "energyRatio": 0.22 }
  },
  "authorNotes": "Le plus grand outil comique de l'orchestre est **le silence** : couper la musique net crée un vide dans lequel le rire peut tomber — une musique continue ne laisse pas de place, parce que le public n'ose pas couvrir le score. Les quatre gestes sont chiffrés : l'attente sérieuse (douze mesures de promesse), l'accelerando de panique (+26 BPM sur six mesures — le seul procédé du corpus qui produit du rire par accumulation pure), les deux secondes de rien, et la remise **trop tard** : la gêne plutôt que l'insolence, déclarée comme telle. La cadence-gag est un V→silence : on prépare la porte et on ne l'ouvre pas."
}
```

## Animation

```json
{
  "exerciseId": "m09-e19-hit-map",
  "payload": {
    "mode": "guided+proof",
    "asset": "m09-e19-animatic-30s — 8 hits (F-70 : timecodes à chiffrer avec l'asset)",
    "checklist": [
      { "id": "e19-s1", "expect": "animatique importée · frame rate et timecode de départ vérifiés" },
      { "id": "e19-s2", "expect": "les 8 hits en markers, timecodes exacts" },
      { "id": "e19-s3", "expect": "tempo de base posé ; les positions injouables notées" },
      { "id": "e19-s4", "expect": "tempo map : rampes entre points d'ancrage" },
      { "id": "e19-s5", "expect": "aucune transition > 6 BPM" },
      { "id": "e19-s6", "expect": "click activé, repères posés pour le chef" },
      { "id": "e19-s7", "expect": "points de flexibilité identifiés" }
    ],
    "tempoPlan": [
      { "bar": 1, "bpm": 120 },
      { "bar": 5, "bpm": 124, "delta": 4 },
      { "bar": 9, "bpm": 119, "delta": -5 },
      { "bar": 13, "bpm": 123, "delta": 4 }
    ],
    "hitPositions": "8/8 sur temps fort ou croche de contretemps, écart ≤ 20 ticks"
  },
  "authorNotes": "**Témoin F-70** : `hitMap` compare à huit timecodes qui n'existent nulle part — l'asset doit être chiffré avant la solution, et e20 en dépend par `sourceSubmission`. Le métier tient en une phrase : trouver le tempo — ou la suite de tempos — pour lequel les hits tombent sur des positions **jouables naturellement** ; un hit sur la double-croche 3 du temps 2 ne l'est pas. Entre deux points fixes on rampe de quelques BPM : aucune transition ne dépasse 6, donc rien ne s'entend. C'est le seul genre du corpus où musique et image partagent la même grille temporelle, et la vérification signature est celle de « La Remise » : le croisement tempo×timecode."
}
```

```json
{
  "exerciseId": "m09-e20-three-gestures",
  "payload": {
    "durationSec": 30,
    "sourceSubmission": "m09-e19-hit-map",
    "syncedHits": [
      { "hit": 2, "gesture": "fall-glissando", "instruments": ["harpe", "trombone"] },
      { "hit": 5, "gesture": "surprise-dim7", "instruments": ["tutti sec", "cymbale étouffée"] },
      { "hit": 7, "gesture": "bounce-pizz", "instruments": ["pizz", "xylophone"] }
    ],
    "unmarkedHits": [1, 3, 4, 6, 8],
    "leitmotiv": { "occurrences": 3, "note": "dans le chaos formel, seul le thème donne de la continuité" },
    "articulationLayer": ["xylophone", "woodblock", "pizzicato"],
    "sfxBands": "3–8 kHz dégagés pour le bruitage",
    "welding": { "type": "hit-as-hinge", "atHit": 5 }
  },
  "authorNotes": "« Le lexique n'a de valeur que par sa rareté relative : trois gestes par séquence de trente secondes se lisent, quinze deviennent un bruit. » Trois hits sur huit reçoivent leur geste ; sur les cinq autres, **le score coule par-dessus sans les souligner** — c'est la pratique réelle du métier : score dramatique par défaut, mickey-mousing par salves. Le leitmotiv est obligatoire parce que l'animation est un des derniers bastions du système de thèmes récurrents. Et le dégagement de bandes n'est pas de l'orchestration solitaire : le bruitage d'animation est dense et souvent musical lui-même — **c'est une conversation avec le monteur son.**"
}
```

## Western

```json
{
  "exerciseId": "m09-e21-open-fifth-landscape",
  "payload": {
    "key": "mi mixolydien",
    "tempoBpm": 58,
    "lengthBars": 16,
    "progression": [
      { "bars": [1, 4], "chord": "E5", "voicing": "[E2+E3+B3+E4]" },
      { "bars": [5, 8], "chord": "D", "voicing": "[D2+D3+A3+D4]", "note": "♭VII" },
      { "bars": [9, 12], "chord": "A", "voicing": "[A2+A3+E4+A4]", "note": "IV" },
      { "bars": [13, 16], "chord": "E5", "voicing": "[E2+E3+B3+E4]" }
    ],
    "openFifthRatio": 1.0,
    "tonicPedal": { "bars": [1, 16], "note": "mi, très longue" },
    "groundElements": ["quinte de cordes", "guitare", "trompette lointaine"],
    "parallels": "15 quintes et octaves — la grammaire du genre, créditées"
  },
  "authorNotes": "Le vide organisé : trois accords, aucun demi-ton conducteur, aucune dominante — **le western n'attire pas vers la tonique, il y reste et laisse le paysage passer devant.** Les quatre verticalités sont sans tierce (ratio 1,00 ≥ 0,60) : l'espace littéral, aucune émotion assignée, l'auditeur remplit. Les quinze parallèles parfaites mesurées sont **la grammaire, pas la faute** (`vl.parallel-fifths` à 0,1 dans le profil western) — le planing de quintes à vide est le genre lui-même. Trois éléments simultanés : avec l'horreur, le western est le genre où l'on écrit le moins de notes, et **chaque instrument ajouté RÉDUIT le paysage.** Cadence plagale : un V7→I, et c'est une chanson de variété."
}
```

```json
{
  "exerciseId": "m09-e22-the-call",
  "payload": {
    "durationSec": 180,
    "scene": "le duel",
    "callMotif": { "notation": "E4:h. A4:h. B4:w", "intervals": [5, 2], "direction": "ascending", "instrument": "trompette lointaine" },
    "plan": [
      { "sec": [0, 45], "content": "quinte tenue + la trompette lointaine" },
      { "sec": [45, 95], "adds": ["guitare tremolo"] },
      { "sec": [95, 150], "adds": ["cordes", "percussion sèche"] },
      { "sec": [150, 153], "content": "SILENCE TOTAL — 3 secondes : la détonation est le seul événement" },
      { "sec": [153, 180], "content": "la plagale aux cordes seules" }
    ],
    "reverb": { "dry": ["guitare", "percussion"], "space": ["trompette"] },
    "groundElements": { "maxSimultaneous": 3 }
  },
  "authorNotes": "Le mécanisme d'un thriller avec l'esthétique **inverse** : là où le thriller assèche et mécanise, le western étire et laisse résonner. Même courbe, autre acoustique — et la solution le déclare au réglage : guitare et percussions **sèches** (le western moderne n'est pas du néo-noir), seule la voix nue reçoit de l'espace. L'appel est l'archétype « signal » dans son emploi le plus pur : trois notes de quarte et de seconde montantes, un timbre nu, et **ça porte à un kilomètre**. Trois secondes de silence total avant la fin : la musique laisse la place à la détonation, qui est le seul événement de la scène."
}
```

## Film historique

```json
{
  "exerciseId": "m09-e23-passacaglia-of-time",
  "payload": {
    "key": "ré mineur",
    "meter": "3/4",
    "tempoBpm": 60,
    "ground": "D3:h. A3:h. | Bb3:h. F3:h. | G3:h. D3:h. | Eb3:h. A2:h.",
    "arithmetic": "4 groupes × 6 temps = 24 temps = 8 mesures de 3/4 par cycle ; 5 cycles = 40 mesures ✓",
    "cycles": [
      { "n": 1, "bars": [1, 8], "layers": ["basse obstinée", "tambour"] },
      { "n": 2, "bars": [9, 16], "adds": ["le cantus — une voix"] },
      { "n": 3, "bars": [17, 24], "adds": ["cordes à 3 voix"] },
      { "n": 4, "bars": [25, 32], "adds": ["cuivres"] },
      { "n": 5, "bars": [33, 40], "adds": ["chœur — le thème modal"], "note": "tutti, la basse INTACTE" }
    ],
    "groundContinuesAfterAll": { "bars": [41, 43], "note": "la basse seule, après tout le monde" },
    "suspensions": 4
  },
  "authorNotes": "« Le temps passe, la structure demeure, les gens changent » — le meilleur gabarit formel du genre dit exactement ce qu'un film historique veut dire. La basse **ne varie jamais**, ni rythme ni hauteurs : c'est le sol de la pièce, et l'accumulation au-dessus est monotone croissante. Le contrepoint est réel — les checkers de M4 s'appliquent, quatre suspensions à résolution lente : **c'est du contrepoint, pas de l'accompagnement.** Et la signature du genre est dans la dernière image : la basse continue après tout le monde. Ce qui reste n'est pas le personnage, c'est la structure — l'Histoire. Le contrepoint, contrairement au clavecin, ne se démode pas : il évoque l'ancien sans citer une décoration."
}
```

```json
{
  "exerciseId": "m09-e24-one-marker",
  "payload": {
    "scene": "l'arrivée au château",
    "lengthBars": 12,
    "variants": [
      { "era": "medieval", "marker": "vielle (1)", "gesture": "monodie modale sur bourdon de quinte", "grammar": "cordes contemporaines senza vibrato" },
      { "era": "baroque", "marker": "clavecin (1)", "gesture": "basse obstinée de 4 mesures", "grammar": "cordes contemporaines, harmonie modale non fonctionnelle" },
      { "era": "xix", "marker": "harpe (1)", "gesture": "une valse à trois temps", "grammar": "cordes contemporaines, chromatisme retenu" }
    ],
    "periodInstrumentsRatio": 0.17,
    "choir": "absent — le réflexe sacré évité",
    "diegeticVariant": { "declared": true, "note": "la vielle seule, en source : ici l'authenticité rigoureuse est permise, le contexte l'explique" }
  },
  "authorNotes": "« Le film historique ne demande pas de la musique d'époque, il demande une musique qui ÉVOQUE l'époque pour une oreille de 2026. » L'authenticité stricte produit un effet de documentaire : juste, savant, émotionnellement inerte. **Le marqueur est un adjectif, pas la phrase** — un clavecin dans un score de cordes modernes dit « XVIIIᵉ » en trois secondes ; un score entièrement baroque dit « musicologie ». Un seul marqueur par variante, ratio d'instruments d'époque à 0,17. Les cordes portent la scène **sans vibrato** : le pont le plus discret entre les époques — elles sonnent anciennes sans être pittoresques. Deux pièges évités : le chœur sacré réflexe (tout ce qui est ancien n'est pas religieux — le peuple, la danse, le tambour existent aussi) et l'équivalence pays=instrument. La variante diégétique est le seul endroit où l'on peut enfin être rigoureux."
}
```

## Action / espionnage

```json
{
  "exerciseId": "m09-e25-riff-and-relaunch",
  "notation": "E2:e E2:e G2:e E2:q Bb2:e A2:q | E2:e E2:e G2:e E2:q D3:e B2:q",
  "payload": {
    "key": "mi mineur",
    "tempoBpm": 148,
    "lengthBars": 24,
    "riff": { "bars": 2, "notes": 7, "occurrences": 8, "invariantPitches": true, "whistleTest": true },
    "relaunchLadder": [
      { "step": 1, "bar": 7, "type": "new-layer", "content": "+ cuivres en accents" },
      { "step": 2, "bar": 13, "type": "double-time", "content": "la même harmonie, valeurs deux fois plus rapides" },
      { "step": 3, "bar": 17, "type": "ascending-modulation", "content": "mi → sol mineur" },
      { "step": 4, "bar": 21, "type": "dim7-transition", "content": "le virage — on change de rue sans ralentir" }
    ],
    "cutBeforePalier": { "bar": 16, "beat": 4 },
    "percussionLayers": ["pouls", "impact"],
    "voiceBandClear": { "band": [300, 3000], "energyRatio": 0.31 }
  },
  "authorNotes": "**L'action est l'inverse exact du thriller** : là-bas la vis se serre et ne libère jamais ; ici on délivre — le pouls est corporel (on doit pouvoir le suivre), la résolution est permise et fréquente parce qu'elle relance. Et l'action est **horizontale** quand l'épique est vertical : on enchaîne des blocs pour produire de la vitesse, on n'empile pas des étages pour produire de la masse — un score d'action qui s'empile devient un épique lourd et lent. Le riff est le cœur : sept notes, mémorisable, invariant sur huit occurrences — **l'action est le seul genre rapide qui exige un thème sifflable**, et sans riff on a de l'énergie sans identité, donc une scène qu'on oublie. Deux couches de percussion, pas six, et le médium tenu à 0,31 : l'action se mixe avec le son, pas contre lui."
}
```

```json
{
  "exerciseId": "m09-e26-the-breath-action",
  "variantId": "action",
  "payload": {
    "durationSec": 165,
    "tempoBpm": 148,
    "chaseForm": [
      { "step": "depart", "sec": [0, 20], "content": "le riff seul, une couche" },
      { "step": "recruitment", "sec": [20, 60], "content": "une couche tous les 8 à 16 temps" },
      { "step": "hit", "atSec": 62, "cutBeats": 1 },
      { "step": "palier", "sec": [63, 100], "content": "modulation ascendante + double-time" },
      { "step": "breath", "sec": [100, 118], "bars": 6, "densityDrop": 0.62, "partsDrop": 0.57, "position": 0.66 },
      { "step": "reprise-conclusion", "sec": [118, 165], "content": "le riff en tutti, accelerando +12 BPM, cadence de frappe ♭VII→i sur l'impact" }
    ]
  },
  "authorNotes": "L'étape 5 est ce qui distingue un professionnel d'un amateur, et c'est l'objet de l'exercice : **une intensité constante est perçue comme une intensité faible.** L'auditeur ne peut pas rester au maximum trois minutes. La respiration mesure six mesures, chute de 62 % en densité et de 57 % en effectif, et se place à 66 % de la cue — dans la fenêtre exigée. **C'est elle qui rend la reprise puissante** : sans elle, la conclusion n'est pas un sommet, c'est la suite. La forme est la plus codifiée du corpus, et il faut la connaître pour pouvoir la casser."
}
```

```json
{
  "exerciseId": "m09-e26-the-breath-espionnage",
  "variantId": "espionnage",
  "payload": {
    "durationSec": 165,
    "vein": "spy",
    "instrumentation": ["walking-bass", "brosses", "cuivres bouchés en stabs", "vibraphone", "guitare twang"],
    "chaseForm": "identique — les six étapes, mêmes proportions",
    "breath": { "bars": 6, "content": "walking seule + vibraphone", "densityDrop": 0.6 },
    "veinPurity": { "swingInActionVein": false, "declared": "spy" }
  },
  "authorNotes": "La même forme, l'autre vocabulaire : **l'énergie y est une posture, pas une urgence.** La walking remplace le riff comme moteur, les stabs de cuivres bouchés remplacent les accents tutti, et la respiration devient un moment de nonchalance plutôt qu'un allègement. La contrainte de pureté est le point pédagogique : `veinPurity` interdit le swing dans la veine action et exige la déclaration — **le groove et la force ne se cumulent pas bien**, et le score qui tente les deux n'a ni l'un ni l'autre."
}
```

## Aventure

```json
{
  "exerciseId": "m09-e27-whistleable-theme-theme-a",
  "partId": "theme-a",
  "notation": "r:h. F4:e G4:e | Bb4:q. Bb4:e D5:q Bb4:q | F5:q. Eb5:e D5:q C5:q | D5:h. Bb4:q | Eb5:q. Eb5:e G5:q Eb5:q | F5:q. F5:e A5:q F5:q | G5:q F5:q Eb5:q D5:q | Bb4:h. r:q",
  "payload": {
    "key": "si♭ majeur",
    "anacrusis": true,
    "openingLeap": { "notes": [2, 3], "interval": 7, "direction": "up", "note": "sol4 → si♭4… puis la quinte si♭4 → fa5 à la mes. 3" },
    "rhythmCell": "q. e q q — reconnaissable frappée sur une table",
    "climax": { "bar": 6, "note": "A5, unique" },
    "cadence": "parfaite, avec panache",
    "ambitus": "F4–A5, 16 demi-tons",
    "secondaryDominants": 2,
    "ascendingSequences": { "count": 1, "transpositions": 2, "bars": [5, 6] }
  },
  "authorNotes": "Le cahier des charges coché intégralement : anacrouse (le thème pousse avant de commencer — l'élan est écrit dans la levée), saut ascendant dans les trois premières notes, cellule rythmique pointée reconnaissable **sans les hauteurs**, arche large à sommet unique, conclusion franche. Ambitus 16 demi-tons ≤ 17 : **sifflable**, et c'est le test absolu — si on ne peut pas le siffler en sortant, ce n'est pas un thème d'aventure ; s'il faut l'harmonie pour qu'il fonctionne, on recommence. Ici l'harmonie fonctionnelle est le STYLE, pas une naïveté : deux dominantes secondaires, une séquence montante à deux transpositions. **Ne pas fuir la dominante par réflexe moderne** — le score perdrait son élan."
}
```

```json
{
  "exerciseId": "m09-e27-whistleable-theme-theme-b",
  "partId": "theme-b",
  "notation": "r:q D5:q | C5:h. Bb4:q | A4:h G4:h | Bb4:q A4:q G4:h | F4:h. D5:q | C5:h Bb4:q A4:q | G4:q A4:q Bb4:h | F4:w",
  "payload": {
    "key": "si♭ majeur",
    "character": "lyrique — l'amour, le rêve, l'objet de la quête",
    "conjunctRatio": 0.79,
    "contrast": { "prosody": "trochaïque contre l'iambique de A", "contour": "descente contre l'arche de A", "rhythm": "valeurs longues contre le pointé de A" }
  },
  "authorNotes": "L'exigence structurelle du genre : **il faut un second thème.** Le thème A porte l'élan et le héros ; sans son pendant lyrique, un score d'aventure monothématique s'épuise en vingt minutes. Les trois contrastes sont vérifiés séparément — prosodie, contour, rythme — parce qu'un « second thème » qui ne diffère que de hauteur est une variante, pas un personnage. Conjoint à 79 % : B chante là où A bondit."
}
```

```json
{
  "exerciseId": "m09-e28-four-bars-of-lyric",
  "payload": {
    "durationSec": 120,
    "meter": "6/8",
    "tempoBpm": 126,
    "form": [
      { "section": "A", "sec": [0, 48], "content": "le thème A aux cors, séquences montantes" },
      { "section": "B", "sec": [48, 60], "bars": 4, "content": "LE LYRISME — B aux cordes : le regard" },
      { "section": "pédale", "sec": [60, 72], "content": "pédale de dominante — la préparation triomphale" },
      { "section": "A-tutti", "sec": [72, 120], "content": "A en tutti, une octave plus haut, cadence parfaite + cymbale" }
    ],
    "counterMelody": { "instrument": "violoncelles", "registerSeparation": 14, "simultaneousStrongAttacks": 0.33 },
    "tuttiRatio": 0.34,
    "synthetic": false
  },
  "authorNotes": "**Le geste distinctif du genre** : au milieu d'une scène d'action, l'aventure trouve toujours quatre secondes pour être lyrique — c'est exactement ce qui la sépare de l'action, qui ne s'arrête jamais. Quatre mesures de B aux cordes, en plein milieu de la poursuite. La signature d'écriture est obligatoire ici : **le contrechant** aux violoncelles, séparé de 14 demi-tons et complémentaire à 0,33 — la texture de l'aventure est contrapuntique, pas verticale, et des accords sans lignes rendent le score plat. Deux interdits tenus : rien de synthétique (l'aventure est acoustique par définition — la virtuosité de l'orchestre fait partie du plaisir offert au spectateur) et pas de tutti permanent, 34 % : les traits de bois et les cordes seules font la légèreté."
}
```

## Guerre

```json
{
  "exerciseId": "m09-e29-descending-lament",
  "payload": {
    "key": "ré éolien",
    "tempoBpm": 54,
    "lengthBars": 16,
    "lamentBass": { "notes": "D – C – Bb – A", "motion": "stepwise descending", "cycles": 4, "barsPerCycle": 4 },
    "chorale": [
      { "bass": "D2", "voicing": "[D2+A3+D4+F4]" },
      { "bass": "C3", "voicing": "[C3+G3+C4+F4]" },
      { "bass": "Bb2", "voicing": "[Bb2+G3+D4+F4]", "note": "le fa tenu au soprano trois accords durant" },
      { "bass": "A2", "voicing": "[A2+A3+C4+F4]", "note": "aucune sensible : le do reste naturel" }
    ],
    "suspensions": 4,
    "picardy": { "cycle": 3, "note": "un ré MAJEUR incongru — la beauté au mauvais endroit" },
    "immobilePedal": { "cycle": 4, "bars": 4 },
    "end": "sur le ♭VII, sans cadence",
    "dynamicsMax": "mf",
    "verified": { "parallels": 0, "crossings": 0 }
  },
  "authorNotes": "La plainte codifiée depuis quatre siècles, et elle fonctionne encore. Le choral tient à quatre voix sans une seule parallèle — la version initiale en portait une (si♭–fa → la–mi, quinte parallèle entre basse et soprano) : **corrigée en tenant le fa au soprano**, ce qui donne au passage la suspension la plus longue de la pièce. Deux couleurs placées : la tierce picarde incongrue (l'ironie douloureuse) et la pédale immobile (l'enlisement — rien n'avance, personne ne gagne). Et les deux interdits qui définissent **le contrat moral du genre** : pas de cadence finale, parce qu'on ne clôt pas ce qui n'est pas réglé ; pas de fanfare, parce que **la musique de guerre ne vainc pas, elle témoigne** — une musique qui glorifie ce que l'image dénonce commet une faute morale autant qu'esthétique. Le choral de cuivres est autorisé, tenu, plafonné à mf."
}
```

```json
{
  "exerciseId": "m09-e30-late-in-early-out",
  "payload": {
    "durationSec": 150,
    "scene": "après l'assaut",
    "plan": [
      { "sec": [0, 62], "content": "LA CAISSE CLAIRE SEULE — aucune harmonie" },
      { "sec": [62, 92], "adds": ["le lamento aux celli"] },
      { "sec": [92, 118], "adds": ["les cordes"] },
      { "sec": [118, 131], "content": "le tutti — choral de cuivres + chœur, f maximum", "summit": "une PERTE : il tombe sur le moment où quelque chose est détruit" },
      { "sec": [131, 150], "content": "le retrait : cordes → violon seul → basse du lamento → rien" }
    ],
    "pointOfView": { "declared": "with-the-victims" },
    "snareUses": 2,
    "cadence": null
  },
  "authorNotes": "**Entrer tard, sortir tôt** : la musique de guerre arrive APRÈS l'événement, sur les visages. Soixante-deux secondes sans harmonie — ce n'est pas de la timidité, c'est le genre qui refuse d'interpréter avant que le spectateur ait vu. Et le choix de la caisse claire est raisonné : timbre militaire, mécanique et **indifférent** — elle ne prend pas parti, elle scande ; un roulement sous une image de morts dit exactement ce que le genre veut dire, que la machine continue. Deux emplois par film, pas davantage : c'est un symbole puissant, pas un réflexe. Le sommet est une perte, pas une victoire, et le retrait va jusqu'au rien. Enfin la décision que personne ne prend jamais est prise et déclarée : **de quel côté est la musique** — ici, avec les victimes."
}
```

## Super-héros

```json
{
  "exerciseId": "m09-e31-emblem-kit",
  "payload": {
    "key": "mi♭ majeur",
    "signature": { "notation": "Bb3:q. Eb4:e G4:h", "notes": 3, "characteristicInterval": 5, "rhythmCell": "q. e h — survit frappée sur une table", "harmonizations": 3 },
    "variants": [
      { "id": "fanfare", "bars": 4, "content": "cors + trompettes ff, rythme pointé — l'apparition" },
      { "id": "fragment", "bars": 4, "content": "Bb3 – Eb4 seulement — les 60 premières minutes du film" },
      { "id": "minor-slow", "bars": 8, "content": "mi♭ éolien, tempo ×0,5 — le doute, la perte" },
      { "id": "lullaby", "bars": 8, "content": "célesta, harmonisation douce — l'origine, l'enfance" },
      { "id": "funeral-march", "bars": 8, "content": "cuivres graves + caisse claire — le sacrifice" },
      { "id": "distorted", "bars": 4, "content": "la quarte devient triton, timbres sales — le héros corrompu" },
      { "id": "naked", "bars": 4, "content": "une voix, sans accompagnement — quand le masque tombe" }
    ],
    "similarity": { "fanfare": 1.0, "minor-slow": 0.82, "lullaby": 0.88, "funeral-march": 0.79, "naked": 1.0, "fragment": "sous-ensemble (F-69)", "distorted": "rythme + contour (F-69)" }
  },
  "authorNotes": "**Témoin F-69.** Le seuil unique `minSimilarity: 0.6` appliqué aux sept variantes est incohérent avec deux d'entre elles : « fragment » ne garde que deux notes sur trois (jugement par **sous-ensemble**, pas par similarité) et « distordu » altère les intervalles **par contrat** (jugement sur rythme + contour). Le patch scope la mesure par variante. Le reste est la thèse du genre : un thème de super-héros n'est pas une mélodie, c'est **un objet transformable** — simple au point d'être un logo, riche au point de supporter dix variations. Le jeu complet s'écrit AVANT les cues, parce qu'un emblème qui ne survit ni au mineur ni au piano seul n'est pas un emblème."
}
```

```json
{
  "exerciseId": "m09-e32-withheld-fanfare",
  "payload": {
    "cues": [
      { "id": "cue-1", "act": 1, "scene": "l'ordinaire", "bars": 8, "variants": ["fragment"], "humanLayer": "piano", "fullTheme": false },
      { "id": "cue-2", "act": 2, "scene": "le doute", "bars": 8, "variants": ["minor-slow", "naked"], "humanLayer": "violoncelle", "fullTheme": false },
      { "id": "cue-3", "act": 3, "scene": "il enfile le costume", "durationSec": 75, "fullTheme": true }
    ],
    "cue3Plan": [
      { "sec": [0, 18], "content": "la pédale et presque rien" },
      { "sec": [18, 34], "content": "LE FRAGMENT AU PIANO SEUL — la version nue" },
      { "sec": [34, 58], "content": "l'ostinato et les percussions montent" },
      { "atSec": 58, "content": "UN TEMPS DE SILENCE" },
      { "sec": [59, 75], "content": "LE THÈME aux cuivres, ♭VI–♭VII–I majeur, tutti + chœur, hit sur l'image" }
    ],
    "fragmentsBefore": 5,
    "fullStatements": 1
  },
  "authorNotes": "La mécanique de la romance appliquée à l'héroïsme : **le thème complet, en fanfare, ne doit pas arriver au début.** On le retient — fragments, allusions, versions mineures — et on le donne entier au moment où le personnage devient ce qu'il est ; un emblème donné à la scène 3 n'a plus rien à offrir à la scène 90. Cinq fragments avant, un seul énoncé complet, dans le cue 3. La préparation est ordonnée et vérifiée : pédale → fragment nu → ostinato → **un temps de silence** → le thème. Et le fragment au piano du début est précisément ce qui rend la fanfare finale émouvante plutôt que bruyante : **il faut une échelle humaine pour que le surhumain se mesure** — le même principe que la flûte de la fantasy et le cor de la SF. La couche « l'homme » est présente dans les trois cues : c'est celle que les mauvais scores oublient."
}
```

## Documentaire / minimalisme

```json
{
  "exerciseId": "m09-e33-additive-process",
  "payload": {
    "key": "fa majeur",
    "tempoBpm": 88,
    "lengthBars": 32,
    "cell": { "notation": "F4:e A4:e C5:e A4:e", "notes": 4, "invariantPitches": true },
    "additiveProcess": [
      { "cycle": 1, "bars": [1, 4], "content": "la cellule à 4 notes" },
      { "cycle": 2, "bars": [5, 8], "content": "+ une note (G4)" },
      { "cycle": 3, "bars": [9, 12], "content": "+ une valeur (la dernière allongée)" },
      { "cycle": 4, "bars": [13, 16], "content": "+ une note (D5)" },
      { "note": "un ajout tous les 4 cycles jusqu'à la mes. 32 — monotone, jamais soustractif" }
    ],
    "chords": [
      { "bars": [1, 4], "chord": "Fmaj7/A" },
      { "bars": [5, 8], "chord": "Gsus2/A" },
      { "bars": [9, 12], "chord": "Am7" },
      { "bars": [13, 16], "chord": "Fmaj7/C" }
    ],
    "rootPositionRatio": 0.25,
    "chordsWithoutAssertedThird": 2,
    "climax": null
  },
  "authorNotes": "Écrire **un processus, pas des événements** — le contrepoids pédagogique de tout le module. La ligne de crête est étroite et c'est tout l'exercice : la boucle strictement immobile fait décrocher en 40 secondes, la boucle qui bouge trop attire l'attention sur elle-même. **Le changement doit être audible sans être remarquable** — un ajout par cycle, perceptibilité mesurée dans la fenêtre [0,15 ; 0,50]. L'harmonie est faite de renversements plutôt que de fondamentales (25 % en position fondamentale) : la basse mobile sous des accords stables évite toute sensation de cadence, et deux accords sans tierce affirmée ne disent pas si la scène est heureuse ou triste — **ce qui est exactement le cahier des charges : ne juge pas le sujet.** Une musique triste sur un témoignage transforme le témoin en victime. Et le paramètre expressif principal n'est pas la mélodie, c'est le rythme harmonique : un accord toutes les quatre mesures ici ; accélère-le et le film devient tendu, ralentis-le et il devient contemplatif."
}
```

```json
{
  "exerciseId": "m09-e34-cut-points",
  "payload": {
    "durationSec": 240,
    "tempoBpm": 88,
    "lengthBars": 88,
    "cutPoints": { "everyBars": 8, "count": 11, "types": ["note tenue", "accord concluable"], "note": "mesure = 2,73 s ; 240 s = 88 mesures" },
    "foundationLayer": "marimba",
    "stems": ["cellule", "lit", "ligne", "pouls"],
    "voiceBandClear": { "band": [200, 2000], "energyRatio": 0.16 },
    "curve": "symétrique, plateau plat, aucun sommet",
    "parts": 5,
    "additiveProcessContinues": true
  },
  "authorNotes": "« La partie que personne n'enseigne — et le genre que tu écriras le plus souvent. » Quatre exigences professionnelles, toutes chiffrées. **Les points de sortie** : onze sorties propres, une toutes les huit mesures — le monteur va couper la cue, sans toi, et probablement pas là où tu l'imaginais ; *une cue qui ne peut être coupée qu'à la fin sera coupée n'importe où.* **Le médium** : 0,16 sur la bande de la voix off — c'est la première cause de rejet d'une musique de documentaire. **La modularité** : quatre stems livrés, le monteur ajuste l'intensité sans rappeler — et c'est le service qui fait qu'on te rappelle, justement. **La courbe** : symétrique, sans sommet ; le documentaire n'a pas de climax, il a une présence continue et modulable. Enfin la couche fondatrice évite le cliché : marimba, pas le piano mélancolique par défaut. Et on écrit LONG — une cue de quatre minutes qui tourne bien vaut mieux que trois cues de 90 secondes."
}
```

---

**Comptage.** 26 volets neufs (e09→e34), dont trois exercices à deux variantes rendus en un fichier chacun sauf e26 et e27, livrés en deux. Cumul : **197 → 223 solutions/étalons**, findings **65 → 70**. Ordre des PR : **F-66 et F-70 d'abord** (e13 est insoluble et e19/e20 sans matériau), puis F-67, F-68, F-69, puis les 13 profils de genre dans `styleProfiles.ts` — sans eux, aucun de ces 26 fichiers ne s'exécute.

Un constat qui traverse le lot : les six lois transversales du module se vérifient toutes, et **quatre d'entre elles sont des lois de retenue** (l'échelle humaine, le sommet unique, le silence, la respiration). Les genres ne se distinguent pas par ce qu'ils ajoutent, mais par ce qu'ils refusent — et c'est ce que les checkers mesurent.