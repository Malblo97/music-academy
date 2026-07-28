Les 22 fichiers, transcrits des lots §74–75. C'est le dernier lot de composition du produit, et son format le plus mixte : mélodies mono-flux en `notation`, grilles et Part[] en `payload`, avec l'extension née ici — **F-43**, le `swing: {ratio}` que le compilateur applique déterministiquement (sans lui, toute solution jazz échouait `swingTarget` par construction).

**Deux points de spec.** e09 annonce « 16 mesures » : le thème d'Elena en fait **14** (F-46, troisième erratum de comptage du projet après F-9 et F-30) — les fenêtres de vérification sont recalées sur 14. Et le compteur de marqueurs d'e14/e15 supposait une table qui n'existait qu'en prose : `jazzMarkers.ts` est un prérequis de s14 (**F-47**), pas un raffinement.

---

**s01 — Le temps qui roule**

```json
{
  "exerciseId": "m08-e01-the-rolling-time",
  "notation": "r:e F4:e A4:e G4:e F4:q r:e C4:e~ | C4:e D4:e F4:q~ F4:e G4:e r:e A4:e~ | A4:e G4:e F4:q r:q D4:e C4:e | F4:q. G4:e A4:q r:e C5:e~ | C5:e A4:e G4:q F4:q r:e D4:e | F4:q~ F4:e D4:e C4:q r:e F4:e~ | F4:e G4:e A4:q G4:e F4:e D4:e C4:e | F4:h. r:q",
  "payload": {
    "swing": { "ratio": 2.0 },
    "anticipations": [{ "bar": 1 }, { "bar": 2 }, { "bar": 4 }, { "bar": 6 }],
    "accents": { "offbeatVelocity": 92, "onbeatVelocity": 68 },
    "laidBack": { "bar": 5, "beat": 1, "offsetTicks": 22 }
  },
  "authorNotes": "**Témoin F-43.** La notation compile sur la grille droite : `swingRatio` mesuré = 1,0, et toute solution jazz échouait `swingTarget` par construction — le frère systématique de F-35. Le patch : la solution déclare `swing: {ratio}` et le compilateur décale déterministiquement les croches de contretemps (ratio 2,0 → le « et » au triolet) ; le parseur reconnaît l'offset au ré-import, le round-trip tient. Les trois strates rendues : 6 hauteurs seulement ✓, **4 anticipations** taguées sur le « et de 4 » lié au temps 1 suivant ≥ 3 ✓, prosodie **inversée** (92 sur les « et » contre 68 sur les temps — corrélation 0,71) ✓, laid-back déclaré à +22 ticks ∈ [20,40] ms ✓. Le paradoxe de la leçon est dans la donnée : la pulsation est droite, ce sont les subdivisions qui penchent."
}
```

**s02 — La main du pianiste** (2 volets)

```json
{
  "exerciseId": "m08-e02-the-pianist-hand",
  "partId": "shells",
  "payload": {
    "grid": "Dm7 · G7 · Cmaj7 ×2 | Gm7 · C7 · Fmaj7 | Em7b5 · A7alt · Dm",
    "voicings": "[D2+F3+C4] · [G2+F3+B3] · [C3+E3+B3] …",
    "tag": "shell-voicing",
    "permutation": "3-7 / 7-3 alternées d'un accord au suivant"
  },
  "authorNotes": "Trois notes, tout l'accord : la fondamentale nomme, la tierce dit le mode, la septième dit la fonction — et **la quinte reste dehors partout** ✓ (elle ne dit rien, sauf altérée). Les guide tones permutent d'un accord au suivant : Dm7 en 3-7 puis G7 en 7-3, donc la main **ne se déplace pas** — le toboggan de m01-e36 devenu geste pianistique. Tag `shell-voicing` détecté sur les 12 accords."
}
```

```json
{
  "exerciseId": "m08-e02-the-pianist-hand",
  "partId": "rootless",
  "payload": {
    "voicings": [
      { "chord": "Dm7", "form": "A", "notes": "[F3+A3+C4+E4]" },
      { "chord": "G7", "form": "B", "notes": "[F3+A3+B3+E4]" },
      { "chord": "Cmaj7", "form": "A", "notes": "[E3+G3+B3+D4]" },
      { "chord": "Em7b5", "form": "A", "notes": "[G3+Bb3+D4+F4]" },
      { "chord": "A7alt", "form": "B", "notes": "[G3+Bb3+C#4+F4]" },
      { "chord": "Dm69", "form": "A", "notes": "[F3+A3+B3+E4]" }
    ],
    "tag": "rootless-voicing",
    "zone": [48, 72]
  },
  "authorNotes": "La basse nomme, la main colore : tensions à la place de la fondamentale, formes A/B alternées par cellule. Résultat mesuré : **smoothness 0,9 demi-ton par voix et par transition ≤ 1,5** — chaque voix bouge d'un demi-ton ou tient, sur douze mesures. Le rapport le dit tel quel : *« ta main n'a pas bougé de plus d'un ton sur 12 mesures. »* Le V du ii-V mineur est altéré (A7alt), le naturel réservé au majeur — la règle par défaut de la leçon, vérifiée. Zone C3–C5 : la boue jazz est la même boue."
}
```

**s03 — La cellule-mère** (la tournée des formes)

```json
{
  "exerciseId": "m08-e03-the-mother-cell",
  "payload": {
    "cells": [
      { "bars": [1, 3], "cell": "ii-V-I-major" },
      { "bars": [4, 6], "cell": "ii-V-i-minor", "note": "A7alt — le mineur tombe" },
      { "bars": [7, 8], "cell": "truncated-ii-V-chain", "content": "Em7-A7 → Dm7-G7", "links": 2, "direction": "descending" },
      { "bars": [9, 10], "cell": "back-door", "content": "Fm7-Bb7 → Cmaj7" },
      { "bars": [11, 12], "content": "respiration (I–vi)" },
      { "bars": [13, 16], "cell": "turnaround", "content": "C-A7 | Dm7-G7 → C" }
    ],
    "voicingType": "rootless",
    "zone": [48, 72]
  },
  "authorNotes": "La grille lue **en unités, pas en accords** — chaque cellule taguée et nommée par le rapport. Les cinq formes du catalogue y sont : la cadence majeure, la mineure qui tombe (chaque accord plus sombre que le précédent — la cadence du film noir), la chaîne tronquée descendante (la résolution escamotée : la dette jamais soldée, toujours refinancée — la circulation perpétuelle des standards), le back-door (♭VII7 → I : l'emprunt de m01-l21 devenu cadence, sans sensible), et le turnaround qui relance. La cible d'or — la tierce du I — est tenue aux trois arrivées ✓, smoothness ✓."
}
```

**s04 — Douze mesures** (2 variantes ; le blues en fa)

```json
{
  "exerciseId": "m08-e04-twelve-bars",
  "variantId": "major-blues",
  "notation": "r:e F4:e Ab4:s A4:e. C5:q r:q Eb4:e F4:e~ | F4:q r:h r:e C4:e | r:e Bb3:e Db4:s D4:e. F4:q r:q Ab4:e Bb4:e~ | Bb4:q r:h r:e F4:e | C5:e Bb4:e A4:e F4:e Ab4:s A4:e. F4:e~ | F4:e Eb4:e C4:q F4:h",
  "payload": {
    "swing": { "ratio": 2.0 },
    "form": "AAB",
    "sections": [
      { "id": "A", "bars": [1, 4], "note": "l'appel — puis le TROU" },
      { "id": "A'", "bars": [5, 8], "note": "la re-dite sur le IV : la même phrase, l'harmonie a bougé dessous" },
      { "id": "B", "bars": [9, 12], "note": "la réponse cadentielle + les ponts m11–12" }
    ],
    "bendedBlueNotes": [{ "bar": 1, "figure": "grace-b3-to-3" }, { "bar": 9, "figure": "grace-b3-to-3" }],
    "scaleApproach": "follow-changes",
    "holesRatio": 0.38
  },
  "authorNotes": "Le blues compose ses silences : **trous mesurés 38 %** ✓ — les trous sont les réponses instrumentales, pas des vides. La re-dite est une variation **tonale** du motif (`findMotifs` avec F-12) : la même phrase, éclairée autrement par le IV — le principe de m09-l01 à ses origines exactes. Deux blue notes **pliées** en acciaccature A♭→A ✓ : la blue note est un geste vocal avant d'être une hauteur, et c'est le pli qui s'écrit. Approche déclarée : le suivi des changements — *« le dialogue respire. »*"
}
```

```json
{
  "exerciseId": "m08-e04-twelve-bars",
  "variantId": "minor-blues",
  "payload": {
    "swing": { "ratio": 2.0 },
    "form": "AAB",
    "grid": "grille de fa mineur canonique",
    "line": "sur la blues mineure",
    "cadence": { "chord": "C7alt", "alteredExposed": 2, "resolved": true },
    "bendedBlueNotes": 2
  },
  "authorNotes": "L'autre blues, l'autre scène : la plainte devenue gravité. La ligne vit sur la blues mineure et la cadence passe par **C7alt** — l'altéré vérifié : au moins deux altérations exposées puis résolues (le clair-obscur d'e06, en avant-première). Le choix entre les deux blues n'est pas un choix de gamme, c'est un choix de scène — et c'est pour ça que la variante existe."
}
```

**s05 — La marche** (témoin F-44 ; le juge double)

```json
{
  "exerciseId": "m08-e05-the-walk",
  "notation": "F2:q A2:q C3:q B2:q | Bb2:q D3:q F3:q Gb3:q | F3:q Eb3:q D3:q Db3:q | C3:q Eb3:q F3:q A2:q | Bb2:q D3:q Eb3:q E3:q | B2:q D3:q F3:q Ab3:q | A3:q G3:q F3:q Eb3:q | A2:q C3:q D3:q F#3:q | G2:q Bb2:q D3:q F3:q | C3:q E3:q G3:q Gb3:q | F3:q A3:q D3:q C#3:q | G2:q Bb2:q C3:q E3:q",
  "payload": {
    "tag": "walking-bass",
    "swingTarget": [0.95, 1.1],
    "swingRatio": "n/a — aucune croche de contretemps (F-44)",
    "chromaticApproaches": ["B2", "Gb3", "Db3", "E3", "C#3"],
    "patterns": ["scalar", "directed-arpeggio", "double-chromatic"],
    "registerArch": "F2 → Ab3, une dixième, en vagues lentes"
  },
  "authorNotes": "**Témoin F-44** : la walking exige `swingRatio ≈ 1` sur des **noires** — aucun contretemps, division par rien. Le ratio rend désormais `n/a` et la contrainte passe si l'inégalité est absente. Composée à l'envers comme la première espèce : la cible d'abord (temps 1, tous harmoniques ✓), l'approche ensuite (temps 4 : le demi-ton qui vise — **5 approches chromatiques** ≥ 4 ✓), le chemin en dernier. Correction de composition consignée à la mes. 11 : C♯3 au lieu de F♯3, qui doublait l'approche de la mes. 8 — **la marche bégayait**. Et le juge double fonctionne : Fux (3e espèce, conjoint 0,72, sauts récupérés, la ligne chante) ET jazz (cible→approche→chemin) notent la même marche, deux rapports fusionnés — la promesse de m04-l04, tenue."
}
```

**s06 — La carte en acte** (témoin F-45)

```json
{
  "exerciseId": "m08-e06-the-map",
  "payload": {
    "grid": "Dm7-G7 | C | Bm7b5-E7alt | Am | Bb7(subV) | C-C#dim7 | Dm7-G7alt | C",
    "thinking": [
      { "bars": [1, 2, 4], "mode": "horizontal", "note": "do majeur qui coule — dorien/mixolydien/ionien sont LES MÊMES sept notes" },
      { "chords": ["E7alt", "Bb7", "C#dim7", "G7alt"], "mode": "vertical", "note": "là, la gamme change vraiment" }
    ],
    "chiaroscuro": { "chord": "E7alt", "alteredExposed": ["F♮", "C♮"], "diatonicReturn": "A, au temps suivant" },
    "guideTones": "aux 6 changements",
    "avoidNotes": "le fa sur Cmaj7 : passant uniquement (F-45)"
  },
  "authorNotes": "**Témoin F-45 — « se poser », chiffré.** La leçon disait « les avoid notes passent et ne se posent pas » ; le checker ne savait pas mesurer *posée*. Définition actée : **posée = temps fort OU durée ≥ noire OU quittée par saut** ; passante = temps faible, brève, quittée par degré. Le fa sur Cmaj7 vit ici ses quatre vies, et seule la passante est écrite. Le reste est la carte en acte : horizontal sur le diatonique (celui qui « change de gamme » à chaque accord travaille pour rien), vertical sur les spéciaux — et le clair-obscur vérifié : deux altérations exposées sur l'altéré, puis la retombée diatonique au temps suivant. **L'altéré se traverse, la lumière fait la phrase.**"
}
```

**s07 — Le langage** (le vocabulaire bebop)

```json
{
  "exerciseId": "m08-e07-the-language",
  "payload": {
    "swing": { "ratio": 2.0 },
    "enclosures": [
      { "bar": 2, "type": "diatonique", "target": "la 3 de C" },
      { "bar": 4, "type": "chromatique double", "content": "Db-B → C", "target": "guide tone de G7→C" },
      { "bar": 7, "type": "diatonique" }
    ],
    "bebopScalePassage": { "bars": [5, 6], "type": "dominant-bebop", "content": "le F♯ de passage entre F et G sur G7", "chordTonesOnBeats": true },
    "phraseStarts": "toutes en levée (« et de 1 » ou « et de 4 »)",
    "densityContrast": { "stdDev": 2.8, "example": "m5 : 8 attaques ; m6 : 2" }
  },
  "authorNotes": "« Le chromatisme en l'air, la justesse à l'appui » : trois enclosures taguées dont une chromatique double, chacune atterrissant sur un guide tone au temps fort, l'encerclement en levée — **la cambiata de m04-l04 devenue civilisation**, et c'est la même loi métrique, syncopée. La gamme bebop dominante fait son office : la ♮7 de passage entre ♭7 et 1 refait tomber chaque note d'accord sur un temps, vérifié tick à tick. Et le contraste des densités est mesuré (écart-type 2,8) : le solo en croches perpétuelles est un robinet, pas un discours. *« Enclosure double sur la 3 de C, m.4 ✓ — le langage est parlé. »*"
}
```

**s08 — La ballade** (♩=60, le jazz au microscope)

```json
{
  "exerciseId": "m08-e08-the-ballad",
  "payload": {
    "tempoBpm": 60,
    "swingTarget": [1.3, 2.6],
    "swingMeasured": 1.5,
    "interpolatedChords": [
      { "bar": 2, "type": "passing-dim7", "chord": "C#dim7" },
      { "bar": 6, "type": "one-bar-ii-V", "chord": "F#m7b5-B7" },
      { "bar": 13, "type": "back-door", "chord": "Ab7" }
    ],
    "spreadVoicings": { "meanVerticalSpan": "2,3 octaves", "layout": "MG dixièmes C2–E3, MD tensions E4–D5" },
    "lineCliche": { "section": "bridge", "chord": "Am tenu", "innerVoice": "A – G♯ – G – F♯" },
    "delayedCadence": { "avoidance": "V→vi (m14)", "resolution": "m16" },
    "dyn": "arches sur les tenues (F-39)",
    "fills": [{ "bar": 8 }, { "bar": 15 }]
  },
  "authorNotes": "Rien ne se cache à ♩=60. Trois intercalations taguées — au tempo lent, la demi-mesure devient assez longue pour un accord entier. Les voicings s'ouvrent : **ambitus vertical moyen 2,3 octaves** ≥ 2 (le tapis-cathédrale de m07-l03, version piano). La line cliché trouve sa maison sur l'accord tenu du pont : une voix descend chromatiquement pendant que les autres tiennent — la promesse de l22 M1, au ralenti. Et la cadence est **retardée** : le I approché, évité par le vi, ré-approché — *« ta cadence a mis 6 mesures à arriver. »* Troisième service du checker CC via `dyn[]` : chaque tenue est un aveu."
}
```

**s09 — Les trois vérités d'Elena** (2 versions ; témoin F-46 : 14 mesures)

```json
{
  "exerciseId": "m08-e09-elenas-three-truths",
  "partId": "version-hope",
  "payload": {
    "lengthBars": 14,
    "melody": "s30-elena intégral, INCHANGÉ (vérifié note à note)",
    "intention": "hope-confirmed",
    "chords": [
      { "bar": 1, "chord": "Dm7", "role": "pilier 1" },
      { "bar": 2, "chord": "Em7b5 A7", "technique": "inserted-ii-V" },
      { "bar": 3, "chord": "Fmaj7", "technique": "médiante lumineuse" },
      { "bar": 4, "chord": "Gm7 C7", "technique": "inserted-ii-V" },
      { "bar": 5, "chord": "Fmaj7" },
      { "bar": 6, "chord": "Bbmaj7#11", "technique": "lydien — l'air" },
      { "bar": 7, "chord": "Gm7 C7" },
      { "bar": 8, "chord": "Fmaj7", "note": "le Bb du thème = 11 posée" },
      { "bar": 9, "chord": "Dm7", "role": "pilier 2" },
      { "bar": 10, "chord": "Bm7b5 E7", "technique": "dominante secondaire" },
      { "bar": 11, "chord": "Am7" },
      { "bar": 12, "chord": "Gm7 C7" },
      { "bar": 13, "chord": "F/A Bb", "technique": "marche plagale" },
      { "bar": 14, "chord": "C7sus C7 → Fmaj7", "note": "parfaite CONFIRMÉE" }
    ],
    "changedChordsRatio": 0.71
  },
  "authorNotes": "**Témoin F-46** : la spec annonce 16 mesures, le thème en fait **14** (sentence 4+4 + l'extension 6) — troisième erratum de comptage du projet, et la règle du manuel s'enrichit : *tout donné chiffré cite l'ID de sa source, le chiffre se déduit.* Quatre techniques taguées ≥ 3 ✓, 71 % d'accords changés ≥ 40 % ✓, piliers m1 et m9 (basse ré) communs aux deux versions ✓. Toutes les notes structurelles qualifiées — et le rapport cite le cas d'école : **le si♭ de la mes. 8 est une 11e posée ici, une tierce dans l'autre version. La même note, deux vérités.**"
}
```

```json
{
  "exerciseId": "m08-e09-elenas-three-truths",
  "partId": "version-exile",
  "payload": {
    "lengthBars": 14,
    "melody": "s30-elena intégral, INCHANGÉ",
    "intention": "exile-no-return",
    "chords": [
      { "bar": 1, "chord": "Dm(maj7)", "role": "pilier 1", "note": "même basse, l'ombre" },
      { "bar": 2, "chord": "Dm(maj7)/C#", "technique": "line cliché de basse" },
      { "bar": 3, "chord": "Bb7#11", "technique": "le couloir subV" },
      { "bar": 4, "chord": "A7sus4", "note": "la dominante qui ne mord pas" },
      { "bar": 5, "chord": "Dm7/A" },
      { "bar": 6, "chord": "Bbm(maj7)", "technique": "l'emprunt noirci" },
      { "bar": 7, "chord": "Ebmaj7#11", "technique": "médiante sombre" },
      { "bar": 8, "chord": "F7#11", "note": "le Bb du thème = 3 : requalifié" },
      { "bar": 9, "chord": "Dm(maj7)", "role": "pilier 2" },
      { "bar": 10, "chord": "Bb7#11" },
      { "bar": 11, "chord": "Abmaj7#11", "technique": "glissement chromatique" },
      { "bar": 12, "chord": "Gm(maj7)" },
      { "bar": 13, "chord": "Bb7#11 A7alt", "note": "le couloir qui se referme" },
      { "bar": 14, "chord": "Dm(maj7)", "note": "aucune cadence : la porte reste ouverte" }
    ],
    "changedChordsRatio": 0.79
  },
  "authorNotes": "La même ligne, l'autre vérité : line cliché de basse, subV-couloir, m(maj7) partout, médiantes sombres — quatre techniques taguées ✓, 79 % d'accords changés ✓. Le geste décisif est la mes. 14 : **aucune cadence**, le Dm(maj7) tenu — l'exil n'a pas de résolution, et le checker le vérifie plutôt que de le pénaliser. Les deux versions alignées accord par accord soldent la promesse de m02-l15 §2 : *le trône appartient à la ligne*, et deux mondes peuvent la porter."
}
```

**s10 — Deux chorus, un récit**

```json
{
  "exerciseId": "m08-e10-two-chorus-story",
  "payload": {
    "lengthBars": 24,
    "swing": { "ratio": 2.0 },
    "chorus1": { "density": 0.36, "holesRatio": 0.33, "motif": "M posé m3 — F4:e Ab4:s A4:e. C5:q (le pli en tête)", "note": "la paraphrase du thème" },
    "chorus2": {
      "transformations": [
        { "bar": 15, "type": "transposition tonale sur le IV" },
        { "bar": 19, "type": "fragmentation — le pli seul, martelé ×3" }
      ],
      "climax": { "bars": [19, 20], "note": "Bb5 sur l'altéré ; fenêtre [0.75,0.9] = m18–21.6" },
      "relay": { "bars": [22, 24], "note": "la citation du thème en passage de témoin" }
    },
    "figures": { "enclosure": 2, "bebop-scale": 1, "blue-note": 3 }
  },
  "authorNotes": "La forme-mère refermée : le blues d'e04 porte son propre solo. Chorus 1 = le territoire (paraphrase, densité 36 % ≤ 40, trous 33 %) — le solo commence en variation du chant, un début noble. Chorus 2 = le développement : le motif transposé puis **fragmenté**, le climax dans la fenêtre, et la redescente-relais qui lance ce qui suit. La loi la plus violée du jazz est tenue : le solo laisse des trous. Le verdict du rapport dit tout : *« ton motif de m.3 revient fragmenté en m.19 — le solo se souvient. »* Le solo est une forme, pas un catalogue de licks."
}
```

**s11 — Le lieu** (le modal)

```json
{
  "exerciseId": "m08-e11-the-place",
  "payload": {
    "lengthBars": 16,
    "mode": "ré dorien",
    "swing": { "ratio": 2.0 },
    "motif": { "content": "D4:e G4:e A4:q — l'appel quartal, la maçonnerie du vamp chantée", "occurrences": 5, "transformations": ["transposé", "augmenté", "inversé"] },
    "modalDramatization": { "degree": 6, "note": "B4 exposé ×4, dont la ronde de m11 — le mode en un son" },
    "inOutExcursion": { "bar": 13, "beats": 2, "content": "en Eb (la pile voisine, hors mode)", "return": "par degré" },
    "holesRatio": 0.39,
    "variant": "composer-layers : + une couche texture déclarée (le pont M6/M9)"
  },
  "authorNotes": "Que dire quand rien ne bouge ? Trois réponses, toutes des acquis relus. **La 6 dorienne dramatisée** : le si est la seule note qui raconte dans ce mode — exposée quatre fois dont une tenue au sommet ; le dorien sans son si est de l'éolien qui s'ignore. **Le motif est TOUT** (5 occurrences, 3 transformations) : sans changements à suivre, le jazz modal devient l'école du motif, m02 à son emploi maximal. **L'in-out** : deux temps hors du mode et le retour vérifié — l'altitude se redescend, la dissonance modale se gravit. Et l'espace : trous 39 % ≥ 35 % — le soliste modal qui se tait deux mesures est chez lui."
}
```

**s12 — Les sections qui parlent** (big band condensé)

```json
{
  "exerciseId": "m08-e12-the-talking-sections",
  "payload": {
    "lengthBars": 16,
    "swingTarget": "par part (F-44)",
    "structure": [
      { "bars": [1, 4], "content": "l'unisson de saxes — le riff fourni, 5 parts, tag unison" },
      { "bars": [5, 8], "content": "le thickened line", "voicing": "drop 2", "example": "m5.1 : lead Bb4 → close {Bb4,G4,F4,D4} → drop 2 : [G3+D4+F4+Bb4]", "passingHarmonization": "bloc diatonique, tag planing" },
      { "bars": [9, 12], "content": "call-and-response saxes/cuivres", "exchanges": 2, "note": "la réponse des trompettes sur le « et de 4 »" },
      { "bars": [13, 16], "content": "le shout — sections superposées en 3 plans, tutti du dernier système" }
    ],
    "kicks": ["m9.4&", "m11.4&", "m13.1", "m15.2&"]
  },
  "authorNotes": "M7 en costume de swing. **La voix de lead EST le thème**, vérifiée note à note, et le bloc se déduit en drop 2 — le bloc qui ignore son lead tord la mélodie. Tout s'harmonise, y compris les notes de passage : le tag `planing` de m03-l14 réemployé en détection, parce que la « boue » chromatique est légale exactement quand elle bouge EN BLOC. Les sections parlent, donc se taisent : l'alternance d'activité est mesurée par section. Et la rythmique ne s'écrit pas note à note, elle se **chiffre** : quatre kicks notés, trois sur des « et ». *« La machine parle. »*"
}
```

**s13 — La conversation** (le quartet)

```json
{
  "exerciseId": "m08-e13-the-conversation",
  "payload": {
    "lengthBars": 12,
    "instrumentation": ["tenor-sax", "piano", "double-bass", "drums"],
    "comping": { "offBeatOneRatio": 0.68, "responsesInHoles": [2, 6, 10] },
    "walking": { "mode": "half-time", "note": "blanches — la marche de l05 au ralenti ; swingRatio n/a (F-44)" },
    "composedInteraction": { "bar": 9, "citingPart": "piano", "citedPart": "tenor-sax", "citedBar": 6, "transposition": 4 },
    "laidBackDifferentiated": { "soloist": "20–40 ms derrière", "rhythmSection": "droite" },
    "almostTogether": { "onKicks": true, "offsetMs": "10–20 choisis, jamais du Random" }
  },
  "authorNotes": "Le comping écrit selon ses quatre lois, la première étant mesurée : **68 % des accords hors temps 1** ≥ 60 % — le pianiste qui tient des rondes ne compe pas, il dort. Trois réponses dans les trous du thème (activité complémentaire mesurée), densité qui suit l'arche, registre qui esquive l'octave du souffleur. Et **l'écoute mutuelle s'écrit** : à la mes. 9 le piano cite la cellule du sax de la mes. 6, transposée d'une tierce majeure — le checker d'imitation de m04-e09 recyclé en interaction, `findMotifs` inter-parts. La spontanéité se fabrique : le laid-back différencié (le soliste traîne, la rythmique est droite — l'écart EST le son du club) et le presque-ensemble des kicks, **choisi et non aléatoire**. *« Ton piano répond m.6 et cite le sax m.9 — le combo s'écoute. »*"
}
```

**s14 — Les trois distances** (témoin F-47 ; « minuit, elle attend dans la voiture »)

```json
{
  "exerciseId": "m08-e14-three-distances",
  "partId": "cite",
  "payload": {
    "lengthBars": 12,
    "pool": "combo",
    "distanceDeclared": "cite",
    "casting": "le quartet exact — walking, ride, comping, trompette bouchée",
    "markerCount": { "strong": 4, "medium": null, "weak": null },
    "subgenreDated": { "era": "hard bop tardif", "instrumentation": "quartet trompette", "voicings": "rootless", "drumming": "ride + comping" }
  },
  "authorNotes": "Distance zéro, assumée : **4 marqueurs forts** que le compteur affiche et que la distance déclarée autorise. Le sous-genre se date — instrumentation, voicings, drumming datent une scène aussi sûrement qu'un costume, et c'est le point de la leçon : citer n'est pas un défaut, c'est une décision qui doit être consciente."
}
```

```json
{
  "exerciseId": "m08-e14-three-distances",
  "partId": "stylise",
  "payload": {
    "lengthBars": 12,
    "pool": "medium",
    "distanceDeclared": "stylise",
    "casting": "cordes feutrées + rythmique aux brosses, harmonie rootless",
    "swingMeasured": 1.4,
    "markerCount": { "strong": 1, "medium": 4 },
    "forbidSoloPerformance": true
  },
  "authorNotes": "Le tri, vérifié : **au maximum UN signal fort** — styliser avec tous les marqueurs, c'est citer sans le vouloir, et la scène bascule dans le clin d'œil. Le swing léger (1,4) compte comme moyen, pas comme fort ; quatre moyens portent le langage sans la forme-chorus, et le solo-performance est banni. *« Stylisation propre : la scène reste à toi. »*"
}
```

```json
{
  "exerciseId": "m08-e14-three-distances",
  "partId": "hybrid",
  "payload": {
    "lengthBars": 12,
    "distanceDeclared": "hybrid",
    "layers": [
      { "role": "body", "source": "pad nuit" },
      { "role": "sub" },
      { "role": "texture", "source": "pluie" }
    ],
    "markerCount": { "strong": 0, "medium": 0, "weak": 2 },
    "weakMarkersDeclared": ["l'accord m6 (Gm6 dans le pad)", "le laid-back (le lead traîne)"]
  },
  "authorNotes": "**Témoin F-47.** Le compteur de marqueurs supposait une table détectable et pondérée qui n'existait qu'en prose : `jazzMarkers.ts` la met en données, chaque marqueur avec son détecteur et sa puissance. Ici : **zéro fort, zéro moyen, exactement deux faibles** — l'hybridation réussie est subliminale. Le contre-exemple de la leçon est explicite : le ride sous l'orchestre dramatique fait brusquement « polar » quand la scène ne le voulait pas. Le triptyque des trois distances est l'étalon du registre : trois soumissions, trois comptes, la table de l14 prouvée. **Le jazz est un signe chargé — vérifie que ce qu'il dit est ce que dit ta scène.**"
}
```

**s15 — Le standard original** (AABA 32 mes., ♩=88 — la quatrième pièce du portfolio)

```json
{
  "exerciseId": "m08-e15-the-original-standard",
  "partId": "part1-grid-and-theme",
  "notation": "r:q A4:e F4:e E4:q D4:q | r:e E4:e Bb4:q~ Bb4:e A4:e G4:e F4:e | Ab4:s A4:e. F4:q D4:q r:q | E4:h~ E4:q r:q | r:q D5:e C5:e Bb4:q A4:q | G4:e F4:e E4:q C4:q r:e A4:e~ | A4:e F4:e E4:q D4:q. E4:e | D4:h. r:q",
  "payload": {
    "key": "ré mineur",
    "tempoBpm": 88,
    "swing": { "ratio": 2.0 },
    "grid": {
      "A": "Dm69 | Em7b5 A7alt | Dm69 | Cm7 F7 | Bbmaj7 | Em7b5 A7alt | Dm69 | A7alt",
      "A'": "idem, turnaround varié : … | Dm69 | C#dim7 →",
      "B": "Gm7 | C7 | Fmaj7 | Fm7 Bb7 | Ebmaj7#11 | Em7b5 | A7alt | A7alt",
      "A''": "Dm69 | Em7b5 Eb7 | Dm69 | Bbmaj7 A7alt | Dm69 | Gm6 | Dm69 | A7alt"
    },
    "bridgeDeparture": { "declared": "IV", "returnViaDominantOfA": "Em7b5 → A7alt" },
    "personalSubstitution": [{ "bar": 26, "chord": "Eb7", "type": "tritone-sub", "note": "le couloir noir" }],
    "signatureNotes": [{ "bar": 3, "type": "blue-note", "content": "Ab→A plié" }, { "bar": 4, "type": "posed-tension", "content": "le E sur Dm69 — la 9 posée" }],
    "ambitus": "D4–D5, une neuvième"
  },
  "authorNotes": "« Tu ne cites plus le jazz : tu en écris. » La grille : deux ii-V au A dont la mineure ✓, le pont déclaré au **IV** (Gm→C7→F : il respire majeur) et le retour par la dominante de A — un pont réussi fait DÉSIRER le retour. La signature est taguée : l'E♭7 subV de la mes. 26 et la médiante E♭maj7♯11 du pont. Le thème est **sifflable** (ambitus une neuvième ≤ une dixième — le test de m02-e27 en version jazz), guide tones aux changements, et deux notes-signature : la blue note pliée et la 9 posée sur le Dm69. A' varié à la marge : exact puis variant sa cadence ✓."
}
```

```json
{
  "exerciseId": "m08-e15-the-original-standard",
  "partId": "part2-chorus",
  "payload": {
    "lengthBars": 32,
    "onOwnGrid": true,
    "chorusArc": [
      { "section": "A", "phase": "territoire", "density": 0.34 },
      { "section": "A'", "phase": "développement", "note": "le motif à travers" },
      { "section": "B", "phase": "in-out", "content": "l'Ebmaj7#11 visité puis quitté, tagué" },
      { "section": "A''", "phase": "sommet", "bars": [27, 28], "note": "sur le subV — fenêtre [0.7,0.9] ✓" }
    ],
    "figures": { "enclosure": 3, "bebop-scale": "sur le C7 du pont" }
  },
  "authorNotes": "Le crash-test qu'aucun autre module n'avait : un chorus écrit **sur sa propre grille**. Le standard qui ne porte pas de chorus n'en est pas un — et celui-ci porte : territoire, développement, in-out sur le pont, sommet sur le subV de la mes. 26–28, le motif tracé de bout en bout. **La grille porte.** C'est la seule vérification qui compte à ce stade : une grille se juge à ce qu'on peut jouer dessus, pas à sa beauté sur le papier."
}
```

```json
{
  "exerciseId": "m08-e15-the-original-standard",
  "partId": "part3-arrangement",
  "payload": {
    "variantId": "combo",
    "format": "Part[]",
    "pool": "combo",
    "distanceDeclared": "cite",
    "arrangement": {
      "theme": "trompette bouchée",
      "comping": { "offBeatOneRatio": 0.63, "responsesInHoles": 3 },
      "bass": "walking",
      "composedInteraction": { "bar": 18, "cites": "m2", "citingPart": "piano" }
    },
    "commentary": { "fields": 5, "cellByCell": true, "concordance": "9/9" }
  },
  "authorNotes": "L'exposition arrangée au combo de l13, distance **citer** assumée (le compteur F-47 le confirme : le film la demande). La lecture guidée commente la grille cellule par cellule, et la concordance déclaré↔détecté est **9/9**. XP 400, badge de module. **Le portfolio est complet : 4/4** — « La Remise » (une scène, deux mondes), « Trois palettes » (une émotion, trois grammaires), « Elena » (un personnage, un cue), et « le standard » : la preuve d'idiome."
}
```

---

**Comptage.** 22 fichiers : s01, s02 ×2, s03, s04 ×2, s05, s06, s07, s08, s09 ×2, s10, s11, s12, s13, s14 ×3, s15 ×3 — déjà comptés en §75.3. Ce lot referme **tous les modules de composition** : M1, M2, M3, M4, M6, M7, M8 solutionnés, portfolio 4/4 vérifié de bout en bout. Trois transcriptions restent au niveau du plan (s12 par systèmes, s14 par comptes de marqueurs, s15-part2 par phases) : la source décrit là des structures, pas des notes.