# SECTION 45B — LES EXERCICES DU MODULE 3 (m03-e01 → e18, JSON complets)

## 45B.0 Conventions du lot

Mêmes défauts que §18.0/§24.0 (version 2, 4/4, rubrics standards, `isGenerated: false`). Ce lot consomme les extensions actées en §40.1 (`requireCollection`, `requireIdiom`, `forbidFunctionalCadence`, `pillarExposure`, profils `impressionist` et `modern-horror`) et formalise **cinq décisions de spec** :

1. **Plans déclarés** — `pedalPlan` et `tensionPlan` sont saisis par l'élève AVEC sa soumission (payload), pas fournis par la spec : *on compose contre son propre plan*. La spec contraint leur **forme** : `requiredPedalStates` (la séquence d'états qui doit apparaître, dans l'ordre), `declaredTensionPlan` (segments, moteurs autorisés, `direction: rise|fall|hold` — **F-24**). Règle d'écriture héritée de §64.1 : **tout bourdon se déclare en `pedalPlan`**, même intégralement compatible — sinon l'exclusion F-18 ne s'applique pas et le dictionnaire lit des accords fantômes ;
2. **`spec.parts[]` en mode `simultaneous`** (e16) — deux plans composés dans la MÊME soumission, registres disjoints, chacun évalué **dans sa boussole sur la fenêtre-tronc** (mes. 1–8), la fin jugée par la variante déclarée (**F-22**). C'est le troisième format multi-volets après `variants[]` et `submissionParts[]` (§24.0) — les trois sont mutuellement exclusifs à la racine ;
3. **Notation** : `~` est admis **par note à l'intérieur d'un accord** (`[E4~+F4]:q` = mi lié, fa attaqué — **F-21**) ; les grappes cumulatives et mélodies sur tapis tenus de e11/e13/e15 en dépendent ;
4. **Les idiomes se vérifient par comportement**, jamais par dictionnaire : pitch-classes + basse + résolution. Priorité de classification `aug6` > `subV` en tonalité établie (**F-16**) ; la résolution directe Ger⁶→V déclenche l'info « quintes de Mozart » au lieu de l'erreur `vl.parallel-perfects` quand le tag couvre la paire (**F-15**) ;
5. **`variants[]` peut porter `styleProfile`** — extension triviale du schéma §24 : les trois palettes de e17 ne se jugent pas au même étalon (et **F-23** garantit que `tensionCurve` se normalise dans la pièce, palette par palette).

*Erratum de comptage (famille §28.0) : la clôture §45.4 annonçait « 4 à variantes » — l'arithmétique des solutions (§63.0) fait foi : **6 à variantes** (e05 ×3, e06 ×2, e07 ×2, e08 ×4, e12 ×2, e17 ×3), plus e16 (bi-plans simultanés à trois fins) et e18 (tri-parts).*

---

## 45B.1 Bloc « la carte et le fonctionnel étendu » (l01–l07) — e01 → e07

```json
{ "id": "m03-e01-three-motors", "lessonId": "m03-l01-carte",
  "title": "Trois systèmes, une oreille", "kind": "THEORY_QUIZ",
  "difficulty": 4, "xpReward": 50, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "Le quiz-classification du module : écoute chaque passage et nomme son SYSTÈME (1 fonctionnel, 2 modal, 3 non-fonctionnel). L'objet ne suffit jamais — cherche le régime : y a-t-il un aimant, une gravité sans aimant, ou seulement la couleur ?",
    "quiz": { "interaction": "mc",
      "generator": { "systems": [1,2,3], "surfaceTraps": true, "rounds": 8 },
      "items": [
        { "q": "▶", "play": "[C3+E4+G4+C5]:h [F3+F4+A4+C5]:h | [G3+F4+G4+B4]:h [C3+E4+G4+C5]:h", "options": ["système 1","système 2","système 3"], "answer": "système 1", "why": "V7→I : l'aimant tire, la sensible monte — la grammaire de M1." },
        { "q": "▶", "play": "[D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w", "options": ["système 1","système 2","système 3"], "answer": "système 2", "why": "Boucle i↔IV sur bourdon : la gravité vient de l'insistance, aucun accord ne TIRE." },
        { "q": "▶", "play": "[A3+D4+G4]:q [B3+E4+A4]:q [C4+F4+Bb4]:q [D4+G4+C5]:q", "options": ["système 1","système 2","système 3"], "answer": "système 3", "why": "Des quartes qui glissent en bloc : la couleur est la seule loi — aucune fonction à raconter." },
        { "q": "Le même G7 peut appartenir aux trois systèmes :", "options": ["faux — G7 est une dominante","vrai — le régime fait le sens, pas l'objet","vrai, mais seulement en jazz"], "answer": "vrai — le régime fait le sens, pas l'objet", "why": "V7 qui résout (1), sonorité-monde bouclée (2), verticalité-couleur (3) : c'est TOUTE la carte de l01 — et la démonstration finale t'attend en l09." },
        { "q": "Ce qui définit le système d'une pièce :", "options": ["les accords qu'elle emploie","la gamme","ce qui lui donne sa gravité — ou son absence"], "answer": "ce qui lui donne sa gravité — ou son absence", "why": "Système 1 : l'aimant. Système 2 : l'insistance. Système 3 : rien — le trajet de matière remplace le trajet de fonctions." } ] } } }
```

```json
{ "id": "m03-e02-solemn-shadow", "lessonId": "m03-l02-napolitain",
  "title": "L'ombre solennelle", "kind": "HARMONY_PROGRESSION",
  "difficulty": 5, "xpReward": 90, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "8 mesures en ré mineur, 4 voix, une ronde par accord : la phrase-norme i–iv–V–i (mes. 1–4), puis SA REPRISE où le ♭II⁶ prend la place du iv (mes. 5–8). L'écart entre les deux passages EST la leçon : une seule case change, et la lumière change. Conduite vérifiée sans pitié : basse sur 4̂, doublure de la BASSE (jamais la ♭2̂), la couleur en voix de tête bienvenue, et le trajet ♭2̂→7̂ (la tierce diminuée — en degrés : l'orthographe est hors sujet, F-6) avant la parfaite finale.",
    "given": { "key": { "tonic": 2, "mode": "minor" } },
    "constraints": { "key": { "tonic": 2, "mode": "minor" }, "lengthBars": [8,8],
      "minVoices": 4, "maxVoices": 4,
      "requiredProgressionPattern": "i-iv-V-i | i-bII6-V-i",
      "requireIdiom": ["neapolitan"], "requiredCadence": "perfect" },
    "styleProfile": { "id": "classical-common",
      "ruleWeights": { "vl.parallel-perfects": 1.0, "vl.leading-tone-resolution": 1.2 } },
    "rubric": { "correctness": 35, "constraints": 35, "craft": 30 } } }
```

```json
{ "id": "m03-e03-the-wedge", "lessonId": "m03-l03-sixtes-augmentees",
  "title": "Le coin qui force la porte", "kind": "HARMONY_PROGRESSION",
  "difficulty": 6, "xpReward": 110, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "10 mesures en sol mineur : L'ESCALADE — iv → ♭II⁶ → Ger⁶ → i6/4 → V → i (les trois ombres en gradation, chaque bascule au coût minimal de voix), cadence parfaite interne — puis la reprise de la tête et un Ger⁶ DIRECT vers la demi-cadence monumentale : V tenu, non résolu, fin de segment. Deux chemins pour la sixte allemande, les deux sont enseignés : interposer le 6/4 (la tenaille ♭6̂→5̂ ET ♯4̂→5̂), ou résoudre direct — et assumer les QUINTES DE MOZART, que l'analyseur nomme en info, pas en erreur (F-15). La sixte augmentée doit s'ouvrir en octave par mouvement contraire : c'est le coin.",
    "given": { "key": { "tonic": 7, "mode": "minor" } },
    "constraints": { "key": { "tonic": 7, "mode": "minor" }, "lengthBars": [10,10],
      "minVoices": 4, "maxVoices": 4,
      "requiredProgressionPattern": "…iv-bII6-Ger6-i64-V-i…Ger6-V",
      "requireIdiom": ["neapolitan","aug6"], "mustInclude": ["aug6>=2"],
      "requiredCadence": "half" },
    "styleProfile": { "id": "classical-common",
      "ruleWeights": { "vl.parallel-perfects": 1.0 } },
    "rubric": { "correctness": 35, "constraints": 35, "craft": 30 } } }
```

*(La priorité `aug6` > `subV` (F-16) protège la fin : Ger⁶→V est une demi-cadence du monde courant, jamais une « parfaite du monde d'à côté » — sans elle, la fenêtre finale de cet exercice s'enregistrait en ré majeur.)*

```json
{ "id": "m03-e04-four-faces", "lessonId": "m03-l04-dim7-pivot",
  "title": "L'accord aux quatre visages", "kind": "HARMONY_PROGRESSION",
  "difficulty": 7, "xpReward": 130, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "12 mesures, do majeur → mi♭ majeur : les TROIS MÉTIERS du dim7 dans une seule pièce. 1) Le passant : ♯i°7 dans l'escalier de basse C→C♯→D, chaque voix conjointe ou commune. 2) L'intensificateur : vii°7 → I, sensibles locales résolues, tierce doublée à l'arrivée (le standard après °7). 3) Le pivot : le MÊME pitch-class set que ton vii°7, atteint tout en degrés conjoints, TENU une ronde (l'oreille lâche le monde), puis la sortie vers MI♭ — quatre demi-tons ou notes communes : une gare, deux trains. Confirmation exigée : IV → I6/4 → V7 (7e préparée) → I, parfaite. C'est sa définition : l'accord n'a pas de maison, il en a quatre.",
    "given": { "key": { "tonic": 0, "mode": "major" } },
    "constraints": { "key": { "tonic": 0, "mode": "major" }, "lengthBars": [12,12],
      "minVoices": 4, "maxVoices": 4,
      "mustInclude": ["dim7-passing>=1","dim7-cadential>=1","dim7-pivot>=1"],
      "pivotSharesPitchClassSet": true,
      "modulation": { "to": { "tonic": 3, "mode": "major" }, "via": "dim7-pivot" },
      "requiredCadence": "perfect" },
    "styleProfile": { "id": "classical-common",
      "ruleWeights": { "vl.leading-tone-resolution": 1.3 } },
    "rubric": { "correctness": 35, "constraints": 35, "craft": 30 } } }
```

```json
{ "id": "m03-e05-secret-passage", "lessonId": "m03-l05-enharmonie",
  "title": "Le passage secret", "kind": "HARMONY_PROGRESSION",
  "difficulty": 8, "xpReward": 150, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "DO majeur → LA majeur, 14 mesures, la dramaturgie en quatre actes : ÉTABLIS (mes. 1–4 : cadence parfaite en do, le thème T fourni AU SOPRANO — c'est lui qu'on trahira) ; OUVRE LA PORTE (mes. 5–8 : l'accord à double lecture de ta variante, TENU une mesure — la ronde liée où l'oreille lâche prise — puis la sortie en demi-tons : le velours) ; CONFIRME (mes. 9–10 : parfaite en la) ; RÉVÈLE (mes. 11–14 : T TRANSPOSÉ au soprano, mêmes intervalles, harmonisé dans le nouveau monde — le même matériau, l'autre vérité). Choisis ta porte avant d'écrire.",
    "given": { "key": { "tonic": 0, "mode": "major" },
      "notation": "G4:w A4:w B4:w C5:w" },
    "variants": [
      { "id": "ger6-v7", "label": "Ger⁶ ↔ V7 — la porte du velours",
        "constraints": { "requireIdiom": ["ger6-v7"] } },
      { "id": "dim7", "label": "dim7 — la gare aux quatre sensibles",
        "constraints": { "requireIdiom": ["dim7-pivot"] } },
      { "id": "augmented", "label": "Augmenté — l'étrange (4+4+4)",
        "constraints": { "requireIdiom": ["augmented-pivot"] } } ],
    "constraints": { "lengthBars": [14,14], "minVoices": 4, "maxVoices": 4,
      "requireEstablishingCadence": { "barWindow": [1,4], "type": "perfect" },
      "givenInTopVoice": { "barWindow": [1,4] },
      "samePitchSequenceAsGiven": { "transposed": true, "barWindow": [11,14] },
      "modulation": { "to": { "tonic": 9, "mode": "major" }, "via": "enharmonic" },
      "requiredCadence": "perfect" },
    "styleProfile": { "id": "romantic-film", "targetMood": "revelation" },
    "rubric": { "correctness": 30, "constraints": 40, "craft": 30 } } }
```

*(`samePitchSequenceAsGiven.transposed` est l'extension F-17 : comparaison des suites d'intervalles sur la fenêtre désignée, hauteur de départ libre — la reprise de e05 est enharmonique, pas diatonique. Les trois variantes partagent établissement et reprise : l'exercice est une comparaison A/B/C des trois passages, à matériau constant.)*

```json
{ "id": "m03-e06-eight-worlds", "lessonId": "m03-l06-mediantes",
  "title": "La table des huit mondes", "kind": "HARMONY_PROGRESSION",
  "difficulty": 7, "xpReward": 130, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "Les médiantes chromatiques, dans les DEUX régimes — choisis ta pièce.",
    "given": { "key": { "tonic": 0, "mode": "major" } },
    "variants": [
      { "id": "traversee", "label": "La traversée — les médiantes comme ÉVÉNEMENTS (régime fonctionnel)",
        "constraints": { "key": { "tonic": 0, "mode": "major" }, "lengthBars": [8,8],
          "minVoices": 4, "maxVoices": 4,
          "mustInclude": ["chromaticMediant>=2"], "mediantContrast": true,
          "strictCommonTone": true, "requiredCadence": "perfect" } },
      { "id": "boucle", "label": "La boucle — le cycle de tierces majeures (la fonction abolie)",
        "constraints": { "lengthBars": [12,12], "minVoices": 4, "maxVoices": 4,
          "requiredProgressionPattern": "C(×3)-E(×4)-Ab(×4)-C",
          "strictCommonTone": true, "forbidFunctionalCadence": true,
          "endOnCommonToneAlone": true } } ],
    "spec_notes": "Traversée : deux médiantes DÉCLARÉES et contrastées (une lumineuse, une sombre — la table de l06 nomme les huit), chacune avec son fil strict aller ET retour, puis la sortie d'emprunt classique vers la parfaite. Boucle : C→E→A♭→C en 4+4+4, le fil (la note commune) voyage DE VOIX EN VOIX à chaque couture, aucun V→I nulle part — et l'atterrissage, c'est le fil resté SEUL : une note nue, le retour à do réduit à ce qui n'a jamais bougé.",
    "styleProfile": { "id": "romantic-film", "targetMood": "wonder" },
    "rubric": { "correctness": 30, "constraints": 40, "craft": 30 } } }
```

```json
{ "id": "m03-e07-the-stubborn-ground", "lessonId": "m03-l07-pedale",
  "title": "Le sol qui refuse de bouger", "kind": "HARMONY_PROGRESSION",
  "difficulty": 6, "xpReward": 110, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "12 mesures sur pédale de SOL, la gradation en trois états — compatible (la pédale appartient à l'accord), frottée (elle y est étrangère mais consonante : 7e, 9e, 11e), CONTREDITE (l'accord la nie) — puis ta sortie, selon la nature de ta pédale. Tu DÉCLARES ton plan avec ta soumission (états et fenêtres) : l'analyseur juge les verticalités HORS pédale (F-18) et vérifie que la friction mesurée suit la friction déclarée. Deux pédales, deux destins — choisis.",
    "variants": [
      { "id": "pedale-gagne", "label": "a — La pédale GAGNE (pédale de tonique)",
        "constraints": { "key": { "tonic": 7, "mode": "major" }, "lengthBars": [12,12],
          "minVoices": 4, "declaredPedalPlan": true, "pedalDegree": 1,
          "requiredPedalStates": ["compatible","frottee","contredite","frottee","resolution"],
          "pedalResolution": "harmony-returns" } },
      { "id": "pedale-cede", "label": "b — La pédale CÈDE (pédale de dominante)",
        "constraints": { "key": { "tonic": 0, "mode": "major" }, "lengthBars": [12,12],
          "minVoices": 4, "declaredPedalPlan": true, "pedalDegree": 5,
          "requiredPedalStates": ["compatible","frottee","contredite","compatible"],
          "pedalResolution": "bass-yields", "requiredCadence": "perfect" } } ],
    "spec_notes": "(a) la pédale est TONIQUE : l'harmonie s'égare puis revient cadencer SUR elle — elle gagne. (b) la pédale est DOMINANTE : la tension fonctionnelle s'accumule sur son propre sol (l'état « compatible » final, c'est V7 pur — la pédale devenue l'accord), et le PREMIER mouvement de basse EST la cadence — son abdication est la résolution. La différence est de nature, pas de technique.",
    "styleProfile": { "id": "romantic-film" },
    "rubric": { "correctness": 30, "constraints": 40, "craft": 30 } } }
```

## 45B.2 Bloc « le modal » (l08–l10) — e08 → e10

```json
{ "id": "m03-e08-seven-worlds", "lessonId": "m03-l08-modes-harmonises",
  "title": "Sept mondes, sept grammaires", "kind": "HARMONY_PROGRESSION",
  "difficulty": 6, "xpReward": 110, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "Le format du séjour modal : 12 mesures, BOURDON de tonique déclaré (pedalPlan — même intégralement compatible : règle d'écriture), une boucle de 4 accords MAXIMUM, la note caractéristique EXPOSÉE (temps forts, tenues, aigu — pillarExposure ≥ 0.25), AUCUNE cadence fonctionnelle nulle part, et la CADENCE-SIGNATURE du mode pour finir. Chaque mode a son interdit — l'accord qui rendrait la gravité fonctionnelle : le jouer une seule fois, c'est changer de système. Choisis ton monde.",
    "variants": [
      { "id": "dorien", "label": "Ré dorien — le rayon de lumière",
        "constraints": { "key": { "tonic": 2, "mode": "dorian" }, "lengthBars": [12,12],
          "minVoices": 3, "maxVoices": 4, "declaredPedalPlan": true,
          "maxLoopChords": 4, "pillarExposure": { "degree": 6, "min": 0.25 },
          "forbidFunctionalCadence": true, "forbidChords": ["V-with-leading-tone"],
          "requiredCadence": "modal:IV-i" } },
      { "id": "phrygien", "label": "Mi phrygien — la lame",
        "constraints": { "key": { "tonic": 4, "mode": "phrygian" }, "lengthBars": [12,12],
          "minVoices": 3, "maxVoices": 4, "declaredPedalPlan": true,
          "maxLoopChords": 4, "pillarExposure": { "degree": "b2", "min": 0.25 },
          "forbidFunctionalCadence": true, "forbidChords": ["V-with-leading-tone"],
          "requiredCadence": "modal:bII-i" } },
      { "id": "lydien", "label": "Fa lydien — la lévitation",
        "constraints": { "key": { "tonic": 5, "mode": "lydian" }, "lengthBars": [12,12],
          "minVoices": 3, "maxVoices": 4, "declaredPedalPlan": true,
          "maxLoopChords": 4, "pillarExposure": { "degree": "#4", "min": 0.25 },
          "forbidFunctionalCadence": true, "forbidChords": ["V"],
          "requiredCadence": "modal:II-I" } },
      { "id": "mixolydien", "label": "Sol mixolydien — le marteau doux",
        "constraints": { "key": { "tonic": 7, "mode": "mixolydian" }, "lengthBars": [12,12],
          "minVoices": 3, "maxVoices": 4, "declaredPedalPlan": true,
          "maxLoopChords": 4, "pillarExposure": { "degree": "b7", "min": 0.25 },
          "forbidFunctionalCadence": true, "forbidChords": ["V-with-leading-tone"],
          "requiredCadence": "modal:bVII-I" } } ],
    "styleProfile": { "id": "epic-film", "targetMood": "modal-world",
      "ruleWeights": { "harmony.retrogression": 0 } },
    "rubric": { "correctness": 30, "constraints": 45, "craft": 25 } } }
```

*(L'ancrage F-19 rend ces quatre pièces lisibles : en présence des marqueurs d'insistance — bourdon ≥ 50 % de la durée, première ET dernière fondamentale identiques, appuis métriques — la tonique s'ancre AVANT la corrélation de Krumhansl. Sans lui, le séjour mixolydien se lisait « do majeur, demi-cadence IV→V ».)*

```json
{ "id": "m03-e09-world-and-arrow", "lessonId": "m03-l09-mineur-melodique",
  "title": "Le monde et la flèche", "kind": "HARMONY_PROGRESSION",
  "difficulty": 7, "xpReward": 120, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "Le diptyque du lydien ♭7 — la démonstration finale de la carte de l01, en 8 + 2 mesures. LE MONDE (mes. 1–8) : G7♯11 bouclé sur pédale de sol (déclarée), la ligne de tête qui expose les DEUX piliers — ♯4̂ (do♯) et ♭7̂ (fa) — dans la collection stricte du mineur mélodique de ré (rotation IV : le lydien ♭7). Huit mesures où cette sonorité de dominante N'EST PAS une dominante : elle est un lieu. LA FLÈCHE (mes. 9–10) : la MÊME sonorité, note pour note — puis la basse plonge d'un demi-ton, le triton se referme, et le do♯ NE BOUGE PAS (il appartient aux deux vérités) : subV→I, l'accord redevient un geste. Huit mesures de monde, une mesure de flèche — le même son, le régime fait le sens.",
    "given": { "key": { "tonic": 7, "mode": "lydian-b7" } },
    "constraints": { "lengthBars": [10,10], "minVoices": 4,
      "requireCollection": { "collection": "melodic-minor", "barWindow": [1,8] },
      "declaredPedalPlan": true,
      "pillarExposure": [ { "degree": "#4", "min": 0.2 }, { "degree": "b7", "min": 0.2 } ],
      "forbidFunctionalCadence": { "barWindow": [1,8] },
      "arrowWindow": { "barWindow": [9,10], "resolution": "subV" } },
    "styleProfile": { "id": "hybrid-sd", "targetMood": "suspended-then-released",
      "ruleWeights": { "harmony.tritone-sub-resolution": 1.4 } },
    "rubric": { "correctness": 30, "constraints": 40, "craft": 30 } } }
```

*(`requireCollection: melodic-minor` est l'extension F-20 : les 7 rotations partagent le même ensemble de pitch-classes, comme la famille diatonique ; l'étiquetage du mode précis passe par l'ancrage F-19.)*

```json
{ "id": "m03-e10-white-light", "lessonId": "m03-l10-pandiatonisme",
  "title": "La lumière blanche", "kind": "HARMONY_PROGRESSION",
  "difficulty": 6, "xpReward": 110, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "12 mesures, tout en SOL DIATONIQUE, la fonction dissoute : ton pôle s'établit par INSISTANCE (basses, première et dernière verticalité — jamais par cadence), tes verticalités s'empilent LIBREMENT (secondes, quartes, quintes — au moins 4 empilements non tertiens, tagués), la sensible ne cadence jamais. Compose au moins UN événement d'ESPACEMENT : le resserré qui éclate (ou l'inverse) — l'ambitus vertical est ton paramètre dramatique, mesuré. Et la fin : pas de cadence — la DISSOLUTION : les voix se retirent une à une jusqu'au pôle resté seul. Le trajet de matière remplace le trajet de fonctions : c'est la porte du système 3.",
    "given": { "key": { "tonic": 7, "mode": "major" } },
    "constraints": { "lengthBars": [12,12], "minVoices": 2, "maxVoices": 7,
      "requireCollection": { "collection": "diatonic" },
      "forbidFunctionalCadence": true, "poleByInsistence": 7,
      "minNonTertianStacks": 4, "spacingEvent": { "minDeltaSemitones": 12 },
      "endByDissolution": true },
    "styleProfile": { "id": "impressionist", "targetMood": "white-light" },
    "rubric": { "correctness": 25, "constraints": 45, "craft": 30 } } }
```

## 45B.3 Bloc « le non-fonctionnel » (l11–l16) — e11 → e16

```json
{ "id": "m03-e11-weightless", "lessonId": "m03-l11-tons-entiers",
  "title": "L'apesanteur", "kind": "HARMONY_PROGRESSION",
  "difficulty": 7, "xpReward": 130, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "15 mesures en trois états de gravité. LE SOL (mes. 1–4) : do majeur fonctionnel, cadence parfaite — l'auditeur doit avoir un monde à perdre. LA PASSERELLE (mes. 5) : l'accord AMPHIBIE — V7♯5 par line cliché (la 5̂ qui monte) : ses quatre pitch-classes appartiennent DÉJÀ à la collection par tons. L'APESANTEUR (mes. 6–13) : collection STRICTE tons entiers — le balancement des deux accords augmentés en tapis TENUS (liaisons par note, F-21), l'arabesque au-dessus : de l'altitude sans gravité, aucun demi-ton nulle part. LA SORTIE (mes. 14–15) : un accord encore ⊂ tons entiers (la sortie est elle-même un mini passage secret), puis les PREMIERS DEMI-TONS — l'événement que l'analyseur guette — et la cadence du retour.",
    "given": { "key": { "tonic": 0, "mode": "major" } },
    "constraints": { "lengthBars": [15,15], "minVoices": 4,
      "requireEstablishingCadence": { "barWindow": [1,4], "type": "perfect" },
      "amphibiousBridge": { "bar": 5, "collections": ["diatonic","whole-tone"] },
      "requireCollection": { "collection": "whole-tone", "barWindow": [6,13] },
      "exitSemitoneEvent": { "barWindow": [14,15] },
      "requiredCadence": "perfect" },
    "styleProfile": { "id": "impressionist", "targetMood": "weightless" },
    "rubric": { "correctness": 30, "constraints": 40, "craft": 30 } } }
```

```json
{ "id": "m03-e12-the-lying-compass", "lessonId": "m03-l12-octatonique",
  "title": "La boussole qui ment", "kind": "HARMONY_PROGRESSION",
  "difficulty": 8, "xpReward": 140, "skills": { "HARMONY": 0.7, "MELODY": 0.3 },
  "spec": { "prompt": "L'octatonique de do, deux visages — choisis ta menace.",
    "variants": [
      { "id": "creature", "label": "a — La créature (l'octatonique natif)",
        "constraints": { "lengthBars": [12,12], "minVoices": 1,
          "requireCollection": { "collection": "octatonic" },
          "cellSpec": { "maxNotes": 3, "mustContainInterval": [6] },
          "syncopationTarget": [0.2, 0.5],
          "rotationPlan": { "nodes": [0,3,6,9], "accelerate": true },
          "finalVerticalBite": { "exposedSemitone": true, "held": true } } },
      { "id": "corruption", "label": "b — La corruption (le familier travesti)",
        "constraints": { "lengthBars": [8,8], "minVoices": 3, "maxVoices": 4,
          "requireCollection": { "collection": "octatonic" },
          "samePitchSequenceAsGiven": { "allowAlteredIndices": [8,9] },
          "allowedChordRoots": [0,3,6,9], "triadsOnly": true,
          "forbidChords": ["any-G-chord"], "forbidFunctionalCadence": true,
          "visitAllNodes": true } } ],
    "given": { "key": { "tonic": 7, "mode": "major" },
      "notation": "G4:h A4:h | C5:h A4:h | E4:h F#4:h | G4:w | A4:h D5:h | B4:h C5:h | A4:h F#4:h | G4:w" },
    "spec_notes": "(a) Compose la CRÉATURE : une cellule anguleuse de 3 notes (le triton en tête), rythme asymétrique, en ROTATION sur les quatre nœuds C→E♭→F♯→A — deux mesures par nœud, puis UNE (elle accélère) — et la morsure finale : la verticalité tenue où le demi-ton s'expose dans la masse. (b) Le donné est un thème innocent en sol majeur : altère EXACTEMENT deux notes (D5→D♭5, B4→B♭4 — il entre dans OCT(C)), puis harmonise-le EXCLUSIVEMENT en triades majeures/mineures sur les quatre nœuds. Interdit absolu : aucun accord de sol — le thème est en sol, sa boussole ment jusqu'à la dernière mesure.",
    "styleProfile": { "id": "modern-horror", "targetMood": "menace" },
    "rubric": { "correctness": 25, "constraints": 45, "craft": 30 } } }
```

*(Le diptyque partage sa collection : créature et corruption habitent la même maison OCT(C) — l'A/B est jouable à maison constante. `allowAlteredIndices` : seuls les indices listés du donné ont le droit de différer.)*

```json
{ "id": "m03-e13-change-the-brick", "lessonId": "m03-l13-quartal",
  "title": "Change la brique", "kind": "HARMONY_PROGRESSION",
  "difficulty": 7, "xpReward": 130, "skills": { "HARMONY": 0.8, "ORCHESTRATION": 0.2 },
  "spec": { "prompt": "La dorien, 8 + 4 mesures : la maçonnerie en QUARTES. Le séjour (mes. 1–8) : une boucle de DEUX piles quartales sur bourdon de la (déclaré), la mélodie au-dessus du tapis TENU (liaisons par note, F-21) — et les deux grammaires ENSEMBLE : la tierce mineure dorienne vit DANS la pile, le fa♯ (6̂) s'expose dans la ligne (pillarExposure ≥ 0.25). L'harmonie fait l'espace, la mélodie porte l'émotion — l'analyseur les juge séparément. LA BASCULE (mes. 9–12) : depuis ta pile la plus tendue (garde un triton en réserve), l'OUVERTURE tertienne — chaque voix glisse de 2 demi-tons maximum vers une triade étalée (le relâchement par changement de brique, tagué) — puis la sortie… par la cadence dorienne IV→i de e08 : le pont entre les systèmes 2 et 3, refermé sur lui-même.",
    "given": { "key": { "tonic": 9, "mode": "dorian" } },
    "constraints": { "lengthBars": [12,12], "minVoices": 4,
      "requireIdiom": ["quartal-voicing"], "maxLoopChords": 2,
      "declaredPedalPlan": true,
      "pillarExposure": { "degree": 6, "min": 0.25 },
      "tertianRelease": { "barWindow": [9,12], "maxVoiceGlide": 2 },
      "requiredCadence": "modal:IV-i" },
    "styleProfile": { "id": "impressionist", "targetMood": "modern-modal" },
    "rubric": { "correctness": 25, "constraints": 45, "craft": 30 } } }
```

```json
{ "id": "m03-e14-the-roller", "lessonId": "m03-l14-planing",
  "title": "Le rouleau", "kind": "HARMONY_PROGRESSION",
  "difficulty": 7, "xpReward": 130, "skills": { "HARMONY": 0.8, "ORCHESTRATION": 0.2 },
  "spec": { "prompt": "Mi éolien, 12 mesures = 3 volets de 4, LE MÊME dessin de tête roulé trois fois. Volet 1 — planing DIATONIQUE : des triades peintes sous ta ligne (arche, sommet dans la fenêtre), les qualités varient, le monde ondule. Volet 2 — planing RÉEL : le MÊME dessin de tête, triades majeures EXACTES — sol♯, ré♯, fa bécarre entrent, et `out-of-key` se tait sous le tag : la couleur constante prime la gamme. Volet 3 — le combo : quartes parallèles sur pédale de mi (l13 × l07, plan déclaré). Ici, les quintes et octaves parallèles ne sont pas tolérées : elles sont LA technique — trois siècles d'interdit et un style, deux faces du même fait perceptif. Le rapport les créditera en toutes lettres.",
    "given": { "key": { "tonic": 4, "mode": "minor" } },
    "constraints": { "lengthBars": [12,12], "segmentBars": 4, "minVoices": 3,
      "planingPlan": ["diatonic","real","quartal"],
      "sameTopLineAcrossSegments": [1,2],
      "climaxWindow": [0.45, 0.65],
      "declaredPedalPlan": { "segments": [3] } },
    "styleProfile": { "id": "impressionist", "targetMood": "the-roller" },
    "rubric": { "correctness": 25, "constraints": 45, "craft": 30 } } }
```

*(Sous les tags `planing-diatonic`/`planing-real`/`planing-quartal`, la fenêtre de désactivation des `vl.parallel-*` s'ouvre — et la dette de §7.4 se règle : la matrice impressionniste crédite ce que la matrice classique interdisait.)*

```json
{ "id": "m03-e15-the-veil-the-blade-the-mass", "lessonId": "m03-l15-clusters",
  "title": "Le voile, la lame, la masse", "kind": "HARMONY_PROGRESSION",
  "difficulty": 8, "xpReward": 140, "skills": { "HARMONY": 0.8, "ORCHESTRATION": 0.2 },
  "spec": { "prompt": "12 mesures, la densité comme couleur — les trois familles du cluster, chacune définie par sa BRIQUE, son REGISTRE et son ENVELOPPE. LE VOILE (mes. 1–4) : cluster PENTATONIQUE à l'aigu (brique = secondes majeures), déposé note à note sur un socle pandiatonique de sol (e10 recyclé en fondation) — la lumière poudrée. LA LAME (mes. 5–8) : la grappe CHROMATIQUE au médium — cumulative : UNE attaque par temps sur deux mesures, chaque note TENUE (F-21 : c'est exactement pour elle que la liaison par note existe), jusqu'à la quinte chromatique remplie, tenue. LA MASSE ET SA FIN (mes. 9–12) : l'effondrement — le bloc se resserre PAR LES BORDS, 6 notes, 3 notes… l'UNISSON : un seul son, tenu. La résolution de masse : densité ≠ volume — c'est le nombre de sons qui raconte.",
    "given": { "key": { "tonic": 7, "mode": "major" } },
    "constraints": { "lengthBars": [12,12], "minVoices": 1, "maxVoices": 8,
      "requireIdiom": ["cluster"],
      "clusterPlan": [
        { "barWindow": [1,4], "brick": "pentatonic", "register": "high", "envelope": "additive" },
        { "barWindow": [5,8], "brick": "chromatic", "register": "medium", "envelope": "cumulative" },
        { "barWindow": [9,12], "envelope": "collapse" } ],
      "cumulativeEnvelope": { "attacksPerBeat": 1, "eachNoteHeld": true },
      "endOnUnison": true },
    "styleProfile": { "id": "impressionist", "targetMood": "matter" },
    "rubric": { "correctness": 20, "constraints": 50, "craft": 30 } } }
```

```json
{ "id": "m03-e16-the-double-bottom", "lessonId": "m03-l16-polyaccords",
  "title": "Le double-fond", "kind": "HARMONY_PROGRESSION",
  "difficulty": 9, "xpReward": 180, "skills": { "HARMONY": 0.8, "ORCHESTRATION": 0.2 },
  "spec": { "prompt": "Deux mondes SUPERPOSÉS, 12 mesures, composés ENSEMBLE (les deux plans dans la même soumission — le premier exercice bi-plans du cursus). PLAN A, l'innocent : sol majeur, au-dessus de G3, une boucle-berceuse serrée (I↔IV, un V passager toléré). PLAN B, ce qui rôde : mi♭, sous C3 — la médiante sombre en duel avec le sol de A (le G partagé est leur fil : la table de l06 fournit la motivation). Dégagement de registre OBLIGATOIRE : la superposition ne se perçoit que si chaque monde a son étage. Mesures 1–8 : chaque plan DANS SA BOUSSOLE (évaluée sur cette fenêtre — F-22), leurs contacts verticaux tagués polychord. Mesures 9–12 : ta fin — choisis-la avant d'écrire.",
    "parts": { "mode": "simultaneous",
      "plans": [
        { "id": "A", "label": "L'innocent", "key": { "tonic": 7, "mode": "major" }, "noteRange": [55,84] },
        { "id": "B", "label": "Ce qui rôde", "key": { "tonic": 3, "mode": "major" }, "noteRange": [24,48] } ] },
    "variants": [
      { "id": "fusion", "label": "Fusion — les deux mondes deviennent UN objet",
        "constraints": { "endingWindow": [9,12], "endingCheck": "convergence" } },
      { "id": "victoire", "label": "Victoire — un plan capture puis éteint l'autre",
        "constraints": { "endingWindow": [9,12], "endingCheck": "extinction" } },
      { "id": "coexistence", "label": "Coexistence — personne ne cède",
        "constraints": { "endingWindow": [9,12], "endingCheck": "polychord-final" } } ],
    "constraints": { "lengthBars": [12,12],
      "eachPlanInItsKey": { "barWindow": [1,8] },
      "registerSeparation": true, "requireIdiom": ["polychord"] },
    "styleProfile": { "id": "modern-horror", "targetMood": "dread" },
    "rubric": { "correctness": 25, "constraints": 40, "craft": 35 } } }
```

*(F-22 chiffre les trois fins : fusion = convergence vers un objet commun nommé par `detectChord` inter-plans ; victoire = extinction MESURÉE d'un plan + plénitude de l'autre ; coexistence = deux boussoles stables + tag `polychord` sur la verticalité finale, tenue, non résolue.)*

## 45B.4 Bloc « synthèse et capstone » (l17–l18) — e17 → e18

```json
{ "id": "m03-e17-the-arch-without-the-magnet", "lessonId": "m03-l17-tension-sans-dominante",
  "title": "L'arche sans l'aimant", "kind": "HARMONY_PROGRESSION",
  "difficulty": 8, "xpReward": 150, "skills": { "HARMONY": 1.0 },
  "spec": { "prompt": "La synthèse méthodologique : recréer l'arche de tension de m01-l14 — montée, sommet, retombée — SANS UNE SEULE DOMINANTE. 10 mesures dans la palette de ta variante. Tu DÉCLARES ton tensionPlan avec ta soumission : 2 à 4 segments, chacun avec ses MOTEURS (registre, densité, rythme harmonique, dissonance-altitude, trajectoire) et sa DIRECTION (rise/fall/hold — F-24). L'analyseur corrèle ensuite la pente MESURÉE de chaque moteur au signe DÉCLARÉ, segment par segment — le rapport le plus « professeur » du produit : tu apprends si ta pièce fait ce que ton plan promet. Sommet dans la fenêtre 60–80 %, arche lisible (archFit ≥ 0.65 — normalisé DANS ta palette, F-23 : le cluster n'est pas un accord sale, sa tension se mesure chez lui).",
    "variants": [
      { "id": "dorien", "label": "Modal — ré dorien",
        "constraints": { "key": { "tonic": 2, "mode": "dorian" }, "lengthBars": [10,10],
          "minVoices": 3, "maxVoices": 7, "declaredPedalPlan": true,
          "pillarExposure": { "degree": 6, "min": 0.25 },
          "requiredCadence": "modal:IV-i" },
        "styleProfile": { "id": "epic-film" } },
      { "id": "pandiatonique", "label": "Pandiatonique — sol",
        "constraints": { "key": { "tonic": 7, "mode": "major" }, "lengthBars": [10,10],
          "minVoices": 2, "maxVoices": 7,
          "requireCollection": { "collection": "diatonic" },
          "poleByInsistence": 7, "endByDissolution": true },
        "styleProfile": { "id": "impressionist" } },
      { "id": "octatonique", "label": "Octatonique — OCT(C)",
        "constraints": { "lengthBars": [10,10], "minVoices": 2, "maxVoices": 7,
          "requireCollection": { "collection": "octatonic" },
          "rotationPlan": { "nodes": [0,3,6,9] } },
        "styleProfile": { "id": "modern-horror" } } ],
    "constraints": { "declaredTensionPlan": { "segments": [2,4],
        "motors": ["registre","densite","rythme-harmonique","dissonance-altitude","trajectoire"],
        "directionRequired": true },
      "forbidFunctionalCadence": true,
      "climaxWindow": [0.6, 0.8], "minArchFit": 0.65 },
    "rubric": { "correctness": 20, "constraints": 45, "craft": 35 } } }
```

*(Le plan déclaré accélère la composition — on écrit CONTRE son propre plan — et il inaugure la machinerie que M8/M9/M11 hériteront calibrée.)*

```json
{ "id": "m03-e18-three-palettes", "lessonId": "m03-l18-synthese",
  "title": "« L'attente » : trois palettes, trois pièces", "kind": "HARMONY_PROGRESSION",
  "difficulty": 9, "xpReward": 350, "skills": { "HARMONY": 0.8, "MELODY": 0.2 },
  "spec": { "prompt": "Le capstone : UNE émotion — l'attente — dite dans les TROIS grammaires du module, en trois soumissions successives de 16 mesures. Même fenêtre de sommet partout : à la fin, le rapport pose tes trois archFit côte à côte — la démonstration par tes propres pièces que l'arche est universelle et la grammaire un choix.",
    "submissionParts": [
      { "id": "fonctionnel-etendu",
        "prompt": "PART 1 — Le fonctionnel étendu, la mineur : l'attente EST la pédale (ouvre par la tonique tenue, la friction qui croît par vagues — plan déclaré) ; puis la basse se libère et le doute monte par les outils du système 1 (au moins DEUX tagués parmi napolitain, sixte augmentée, dim7) vers le sommet ; et la retombée SANS certitude : la dominante qui s'éteint sans résoudre — demi-cadence finale, la dette laissée ouverte. Si tu passes par Ger⁶→V : le 6/4 est le chemin propre, le direct porte les quintes de Mozart (info, pas erreur — F-15). Les deux s'enseignent.",
        "given": { "key": { "tonic": 9, "mode": "minor" } },
        "constraints": { "key": { "tonic": 9, "mode": "minor" }, "lengthBars": [16,16],
          "minVoices": 4, "declaredPedalPlan": true,
          "mustInclude": ["extendedFunctionalIdiom>=2"],
          "requireIdiom": ["neapolitan","aug6","dim7-pivot"],
          "climaxWindow": [0.6, 0.78], "requiredCadence": "half" },
        "styleProfile": { "id": "romantic-film", "targetMood": "the-wait" },
        "rubric": { "correctness": 25, "constraints": 40, "craft": 35 } },
      { "id": "modal",
        "prompt": "PART 2 — Le modal : la même dramaturgie, dite en système 2. Mode au choix (déclare-le), bourdon déclaré, boucle et pilier exposé, tensionPlan déclaré (l'insistance remplace la pédale-personnage, les moteurs remplacent l'aimant). Et la fin qui n'apaise pas : le dernier balancement INTERROMPU À MI-COURSE — la pièce finit sur l'autre pilier, jamais sur la tonique : la boucle jamais refermée.",
        "given": {},
        "constraints": { "lengthBars": [16,16], "minVoices": 3, "maxVoices": 7,
          "declaredMode": true, "declaredPedalPlan": true,
          "pillarExposure": { "min": 0.25 },
          "declaredTensionPlan": { "segments": [2,4], "directionRequired": true },
          "forbidFunctionalCadence": true,
          "climaxWindow": [0.6, 0.78], "finalAwayFromTonic": true },
        "styleProfile": { "id": "epic-film", "targetMood": "the-wait" },
        "rubric": { "correctness": 20, "constraints": 45, "craft": 35 } },
      { "id": "non-fonctionnel",
        "prompt": "PART 3 — Le non-fonctionnel : la même attente, dite en matière. Centre déclaré (l'insistance comme seul lieu — aucune boussole), au moins DEUX ressources du système 3 taguées (quartal, cluster, planing, tons entiers, octatonique, polyaccord), tensionPlan déclaré, sommet dans la fenêtre — et la fin par DISSOLUTION : la masse se retire par les bords jusqu'à l'intervalle nu. La fin qui ne tranche pas.",
        "given": {},
        "constraints": { "lengthBars": [16,16], "minVoices": 2, "maxVoices": 8,
          "mustInclude": ["system3Resource>=2"],
          "requireIdiom": ["quartal-voicing","cluster","planing","polychord"],
          "declaredTensionPlan": { "segments": [2,4], "directionRequired": true },
          "forbidFunctionalCadence": true,
          "climaxWindow": [0.6, 0.78], "endByDissolution": true },
        "styleProfile": { "id": "impressionist", "targetMood": "the-wait" },
        "rubric": { "correctness": 15, "constraints": 40, "craft": 45 } } ] } }
```

*(Le verdict transversal du rapport : trois archFit sur la même cible, trois plans de moteurs distincts pour une seule émotion. Le triptyque rejoint le portfolio ; badge de module.)*

---

## 45B.5 Bilan du lot

18 exercices : 1 quiz (e01, réponses dans la spec), **17 HARMONY_PROGRESSION** — le premier lot quasi mono-kind du cursus, et c'est cohérent : l'harmonie est le sujet, la mélodie n'y entre qu'en ligne de tête (e09, e12a, e13, e14). Formats spéciaux : 6 à variantes (e05 ×3, e06 ×2, e07 ×2, e08 ×4, e12 ×2, e17 ×3), 1 bi-plans `simultaneous` à trois fins (e16), 1 tri-parts (e18). Difficultés 4→9, XP total ≈ **2 460** (M1+M2+M3 ≈ 9 050 : le gating `minLevel: 8` du module et les seuils §2.5 restent cohérents — l'élève qui clôt M3 approche le niveau 13). Chaque leçon a exactement son exercice de footer (m03-e01→e18, §40–45), et chaque système sa progression interne : le fonctionnel étendu se juge à la conduite (correctness lourde), le modal aux contraintes de monde, le système 3 au respect d'objet (constraints/craft lourds, correctness allégée — la « justesse » tonale n'y est plus le sujet).

**Solutions de référence à produire** : e01 exclu (quiz) ; e02→e18 avec leurs variantes — e05 ×3, e06 ×2, e07 ×2, e08 ×4, e12 ×2, e16 ×3, e17 ×3, e18 ×3 parts — soit **31 solutions M3** (l'arithmétique reprise telle quelle en §63.0). Backlog CI mis à jour : 24 (M1) + 31 (M2) + 31 (M3).

## 45B.6 Nouvelles clés de contraintes (24) — mécanique de vérification

| Clé | Vérification (sur l'existant) |
|---|---|
| `requireCollection` (+ `barWindow`) | `detectCollection` : couverture stricte des pitch-classes de la collection sur la fenêtre — familles diatonic, pentatonic, whole-tone, octatonic, chromatic, **melodic-minor** (F-20 : les 7 rotations partagent l'ensemble ; l'étiquetage du mode précis passe par F-19) |
| `requireIdiom` | tags par **comportement** (pitch-classes + basse + résolution) : neapolitan, aug6/ger6-v7, dim7-passing/cadential/pivot, augmented-pivot, quartal-voicing, planing, cluster, polychord — priorité aug6 > subV en tonalité établie (F-16) |
| `forbidFunctionalCadence` (+ fenêtre) | `detectCadence` : aucune arrivée V(7)→I / vii°→I sur la fenêtre — l'inverse exact de `requiredCadence`, le garde-fou des systèmes 2–3 |
| `requiredCadence: "modal:X-Y"` | la cadence-signature du mode (IV→i dorienne, ♭II→i phrygienne, II→I lydienne, ♭VII→I mixolydienne) détectée sur la fenêtre finale, tonique ancrée par F-19 |
| `pillarExposure` | % de durée pondérée (temps forts ×2, tenues, position aiguë) de la note caractéristique ≥ seuil — actée §42.4 |
| `declaredPedalPlan` / `requiredPedalStates` / `pedalDegree` / `pedalResolution` | le plan vient du payload (règle §64.1 : tout bourdon se déclare) ; F-18 : verticalités évaluées HORS pédale, la pédale jugée par le plan — l'état de chaque fenêtre classé par l'intervalle pédale↔accord (compatible / frottée / contredite) et comparé à la séquence exigée ; résolution : `harmony-returns` (cadence sur la pédale) ou `bass-yields` (le premier mouvement de basse = la cadence) |
| `declaredTensionPlan` (F-24) | segments `{bars, motors[], direction}` du payload ; corrélation du signe de la pente MESURÉE (sur `tensionCurve` normalisée intra-pièce, F-23) au signe déclaré, moteur par moteur |
| `minArchFit` | `archFit` sur `tensionCurve` normalisée (F-23) ≥ seuil — l'arche se lit relativement à la palette choisie |
| `requireEstablishingCadence` | cadence du type demandé détectée dans la fenêtre d'établissement, AVANT le passage |
| `givenInTopVoice` | la voix supérieure de la fenêtre = la séquence du `given` (hauteurs verbatim) |
| `samePitchSequenceAsGiven.transposed` (F-17) | comparaison des suites d'intervalles (directions comprises) sur la fenêtre, hauteur de départ libre |
| `samePitchSequenceAsGiven.allowAlteredIndices` | seuls les indices listés du donné peuvent différer ; tout le reste verbatim (à l'octave près) |
| `modulation.via: "enharmonic" / "dim7-pivot"` | mode enharmonique de `modulationCheck` : fenêtre A stable, pivot à double lecture tagué, fenêtre B stable |
| `pivotSharesPitchClassSet` | le pc-set du pivot ≡ celui d'une occurrence antérieure taguée (« une gare, deux trains ») |
| `strictCommonTone` | à chaque couture de médiante, la note commune TENUE dans la même voix (F-7 strict) — repérée par voix, pas par pitch-class |
| `mediantContrast` | les deux médiantes de signes opposés dans la table des huit (une lumineuse, une sombre) — lignes de table nommées dans le rapport |
| `endOnCommonToneAlone` / `endOnUnison` / `endByDissolution` | profil de fin : soustraction monotone de voix jusqu'au fil / à l'unisson / au pôle, AUCUNE cadence détectée sur la fenêtre finale |
| `poleByInsistence` | marqueurs F-19 : basse/bourdon dominant, première ET dernière fondamentale identiques, appuis métriques — sans cadence |
| `maxLoopChords` | cardinal des verticalités distinctes (hors pédale, F-18) ≤ seuil |
| `minNonTertianStacks` / `spacingEvent` | verticalités non réductibles à un empilement de tierces, taguées ; Δ d'ambitus vertical entre verticalités adjacentes ≥ seuil, au moins une fois |
| `amphibiousBridge` / `exitSemitoneEvent` | l'accord-passerelle ⊂ les deux collections listées (tagué) ; premiers intervalles de 1 dt sur la fenêtre de sortie (`leapProfile`) |
| `rotationPlan` / `cellSpec` / `finalVerticalBite` / `visitAllNodes` / `allowedChordRoots` / `triadsOnly` | nœuds visités dans l'ordre (tag `octatonic-rotation`), resserrement mesuré si `accelerate` ; cellule ≤ N hauteurs contenant l'intervalle exigé ; verticalité finale tenue avec demi-ton exposé ; fondamentales ∈ ensemble ; qualités ∈ {maj, min} |
| `planingPlan` / `sameTopLineAcrossSegments` / `tertianRelease` | `planingCheck` par segment : diatonic (qualités variables), real (qualité constante — `out-of-key` suspendu sous tag), quartal ; fenêtre de désactivation des `vl.parallel-*` ; ligne de tête identique (intervalles) entre segments désignés ; glissement ≤ N dt/voix vers une verticalité tertienne taguée `quartal-release` |
| `parts.simultaneous` : `eachPlanInItsKey` / `registerSeparation` / `endingCheck` (F-22) | chaque plan évalué dans sa boussole sur la fenêtre-tronc ; registres disjoints ; fin par variante — convergence (`detectChord` inter-plans), extinction mesurée + plénitude, ou coexistence + tag `polychord` final |

Plus les décisions de spec du §45B.0 (plans déclarés, `parts.simultaneous`, `~` par note d'accord — F-21, `styleProfile` dans `variants[]`) — schéma Zod : champs optionnels, `variants`/`submissionParts`/`parts` mutuellement exclusifs à la racine, validés au seed. **Aucune clé n'exige d'analyse nouvelle** hors les extensions déjà actées à l'ouverture du module (§40.1) et les patchs F-15→F-24 : la promesse de §18.8 tient pour ce lot aussi — le plus chargé, mais le moteur avait été outillé AVANT d'écrire les exercices, et les solutions §63–66 l'ont éprouvé clé par clé.

---