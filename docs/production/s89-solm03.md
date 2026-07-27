Voici les 31 fichiers, dans l'ordre du repo (`test/solutions/m03/`). Le contenu vient des lots §63–66 : rien n'est recomposé, tout est transcrit au format canonique — les notations recollées ligne à ligne, les plans déclarés (`pedalPlan`, `tensionPlan`) descendus dans `payload` puisque la spec les fait venir du payload, et les vérifications de §63–66 condensées en `authorNotes`.

**Une clé manque au schéma.** `{exerciseId, notation?, payload?, authorNotes}` ne sait pas dire à quelle variante ni à quelle part un fichier répond — or **22 des 31 fichiers M3** en sont (e05 ×3, e06 ×2, e07 ×2, e08 ×4, e12 ×2, e16 ×3, e17 ×3, e18 ×3). J'ai donc ajouté `variantId` / `partId` là où c'est nécessaire ; à formaliser en Zod (deux champs optionnels, exclusifs entre eux).

---

**e02 — le napolitain**

```json
{
  "exerciseId": "m03-e02-solemn-shadow",
  "notation": "[D3+A3+D4+F4]:w | [G2+Bb3+D4+G4]:w | [A2+A3+C#4+E4]:w | [D3+A3+D4+F4]:w | [D3+A3+F4+D5]:w | [G2+Bb3+G4+Eb5]:w | [A2+A3+E4+C#5]:w | [D3+A3+F4+D5]:w",
  "authorNotes": "« Une seule case change, et la lumière change. » Phrase-norme i–iv–V–i (mes. 1–4) puis sa reprise où le ♭II⁶ prend la place du iv (mes. 6). Conduite du napolitain : basse sur 4̂ (G2), doublure de la BASSE (G2+G4, jamais la ♭2̂), la couleur en voix de tête (soprano D5→E♭5 : 1̂→♭2̂), puis E♭5→C♯5 — la tierce diminuée au soprano, jugée en degrés (♭2̂→7̂), l'orthographe hors sujet (F-6). Cadence parfaite finale : V→i fondamentales, C♯5→D5, arrivée tenue (F-5) ; octave directe basse/soprano couverte par l'exception « soprano par degré ». VL : zéro parallèle, sensible mes. 3 à l'alto (C♯4→D4)."
}
```

**e03 — l'escalade des sixtes** (contient le cas F-15)

```json
{
  "exerciseId": "m03-e03-the-wedge",
  "notation": "[G2+Bb3+D4+G4]:w | [C3+C4+Eb4+G4]:w | [C3+C4+Eb4+Ab4]:w | [Eb3+Bb3+C#4+G4]:w | [D3+Bb3+D4+G4]:w | [D3+C4+D4+F#4]:w | [G2+Bb3+D4+G4]:w | [G2+Bb3+D4+G4]:w | [Eb2+Bb3+C#4+G4]:w | [D2+A3+D4+F#4]:w",
  "authorNotes": "L'escalade en gradation : iv (m2) → ♭II⁶ (m3 : la bascule minimale, C et E♭ tenus, G4→A♭4) → Ger⁶ (m4, l'alto E♭4→C♯4 plonge en tierce diminuée) → i6/4 (m5, LA TENAILLE : E♭3→D3 ET C♯4→D4, ♭6̂ et ♯4̂ tracées jusqu'à 5̂) → V7 sans quinte (m6, F-3) → i complet (m7, arrivée tenue). Puis la reprise de tête (m8) et le Ger⁶ DIRECT (m9) vers la demi-cadence monumentale : V tenu, non résolu. **F-15 en acte** — m9→10, basse/ténor : E♭2–B♭3 → D2–A3, les quintes de Mozart ; couvertes par le tag aug6, nommées en info. Les deux chemins de la sixte allemande sont donc dans la même pièce : le 6/4 (m4–5) et le direct (m9–10). F-16 empêche la lecture « subV→I en ré » de la fenêtre finale."
}
```

**e04 — le dim7 aux trois métiers**

```json
{
  "exerciseId": "m03-e04-four-faces",
  "notation": "[C3+G3+E4+C5]:w | [C#3+G3+E4+Bb4]:w | [D3+F3+F4+A4]:w | [B2+F3+D4+Ab4]:w | [C3+E3+E4+G4]:w | [A2+E3+C4+A4]:w | [D3+F3+B3+Ab4]:w | [Eb3+G3+Bb3+G4]:w | [Ab2+Ab3+Eb4+C5]:w | [Bb2+G3+Eb4+Bb4]:w | [Bb2+Ab3+Bb3+D5]:w | [Eb3+G3+Bb3+Eb5]:w",
  "authorNotes": "Les trois métiers dans une seule pièce. Le PASSANT (m2) : ♯i°7 {C♯,E,G,B♭}, l'escalier de basse C→C♯→D, chaque voix conjointe ou commune. L'INTENSIFICATEUR (m4) : vii°7 {B,D,F,A♭} → I, sensibles résolues (B2→C3, F3→E3, A♭4→G4), tierce doublée à l'arrivée — le standard après °7. Le PIVOT (m7) : **le même pitch-class set que la mes. 4**, atteint tout en degrés conjoints, TENU une ronde, puis la sortie m8 vers mi♭ : D3→E♭3 (la sensible de MI♭), B≡C♭→B♭, F→G, A♭→G — quatre demi-tons ou communs. Une gare, deux trains. Confirmation m9–12 : IV → I6/4 → V7 (7e préparée au ténor) → I, parfaite, soprano D5→E♭5."
}
```

**e05 — le passage secret** (trois portes, matériau constant)

```json
{
  "exerciseId": "m03-e05-secret-passage",
  "variantId": "ger6-v7",
  "notation": "[C3+E3+C4+G4]:w | [F2+A3+C4+A4]:w | [G2+G3+F4+B4]:w | [C3+G3+E4+C5]:w | [F2+A3+F4+C5]:w | [F2+A3+Eb4+C5]:w | [F2~+A3~+Eb4~+C5~]:w | [E2+G#3+E4+B4]:w | [E2+G#3+D4+B4]:w | [A2+E3+C#4+A4]:w | [A2+A3+C#4+E4]:w | [D3+B3+D4+F#4]:w | [E2+B3+E4+G#4]:w | [A2+C#4+E4+A4]:w",
  "authorNotes": "La porte du velours. Établissement m1–4 : I–IV–V7–I, parfaite en do, le soprano portant le thème T fourni (G–A–B–C). Le passage : m5 IV, m6 le E♭ entre (F7 — « on croit partir vers si♭ »), m7 TENU en ronde liée (l'oreille lâche le monde A), m8 la sortie — F7 relu **Ger⁶ de LA** : F→E, C→B, E♭≡D♯→E, A→G♯, quatre demi-tons. **F-15 en version enharmonique** : m7→8, voix extrêmes F2–C5 → E2–B4. Confirmation m9–10 : E7 → A, sensible frustrée au ténor (G♯3→E3 : la quinte du I complet, l'exception codée de M1), parfaite. Révélation m11–14 : soprano E–F♯–G♯–A = T transposé (F-17, intervalles identiques), harmonisé I–ii⁶–V7–I. Décision d'écriture : établissement et reprise sont IDENTIQUES dans les trois variantes — l'exercice est une comparaison A/B/C des trois passages."
}
```

```json
{
  "exerciseId": "m03-e05-secret-passage",
  "variantId": "dim7",
  "notation": "[C3+E3+C4+G4]:w | [F2+A3+C4+A4]:w | [G2+G3+F4+B4]:w | [C3+G3+E4+C5]:w | [A2+A3+E4+C5]:w | [G#2+B3+F4+D5]:w | [G#2~+B3~+F4~+D5~]:w | [A2+A3+E4+C#5]:w | [E3+G#3+D4+B4]:w | [A2+E3+C#4+A4]:w | [A2+A3+C#4+E4]:w | [D3+B3+D4+F#4]:w | [E2+B3+E4+G#4]:w | [A2+C#4+E4+A4]:w",
  "authorNotes": "La porte du frisson. m5 : vi (la préparation naturelle) ; m6 : G♯°7 = vii°7 du vi — l'oreille attend LA MINEUR ; m7 : tenu (le trémolo mental) ; m8 : la sortie en LA MAJEUR — G♯2→A2, F4→E4, **D5→C♯5 : le ré qui descend sur do dièse, le rayon**. La gare aux quatre sensibles, sortie par la porte inattendue (tag dim7-pivot). Suite commune aux trois variantes : E7 (m9, basse E3 = quinte d'approche en mouvement contraire) → A parfaite (sensible frustrée au ténor), puis T transposé m11–14 (F-17)."
}
```

```json
{
  "exerciseId": "m03-e05-secret-passage",
  "variantId": "augmented",
  "notation": "[C3+E3+C4+G4]:w | [F2+A3+C4+A4]:w | [G2+G3+F4+B4]:w | [C3+G3+E4+C5]:w | [C3+G3+E4+C5]:w | [C3+G#3+E4+C5]:w | [C3~+G#3~+E4~+C5~]:w | [C#3+A3+E4+A4]:w | [E2+G#3+D4+B4]:w | [A2+E3+C#4+A4]:w | [A2+A3+C#4+E4]:w | [D3+B3+D4+F#4]:w | [E2+B3+E4+G#4]:w | [A2+C#4+E4+A4]:w",
  "authorNotes": "La porte de l'étrange. m5→6 : I → I+ par line cliché (G3→G♯3 : la 5̂ qui monte, l22 M1 en germe) ; m7 : tenu — l'augmenté isolé ne dit plus son monde (4+4+4) ; m8 : C+ ≡ **E+ (V+ de LA)** — B♯(C3)→C♯3, G♯3→A3, E4 tenu, soprano C5→A4 en mouvement contraire : l'octave parallèle du glissement symétrique évitée (le piège documenté). Atterrissage sur A/C♯ : par la tierce, l'arrivée molle et flottante — l'étrange assumé. Tag augmented-pivot ; la collection tons-entiers effleurée, le pont vers l11 nommé au rapport."
}
```

**e06 — la table des huit mondes**

```json
{
  "exerciseId": "m03-e06-eight-worlds",
  "variantId": "traversee",
  "notation": "[C3+G3+E4+C5]:w | [E2+G#3+E4+B4]:w | [C3+G3+E4+C5]:w | [F2+A3+F4+C5]:w | [Ab2+C4+Eb4+C5]:w | [C3+Ab3+Eb4+C5]:w | [G2+B3+F4+D5]:w | [C3+G3+E4+C5]:w",
  "authorNotes": "Les médiantes comme ÉVÉNEMENTS, régime fonctionnel conservé. Deux médiantes déclarées et contrastées : **E majeur = la lumineuse** (m2, fil E4 tenu à l'alto, aller ET retour m2→m3) et **A♭ majeur = la sombre** (m5–6, fil C5 tenu au soprano, la couture locale IV→♭VI partageant le do). Fils stricts (F-7 : même voix, même octave). Retour cadencé : ♭VI → V7 (m7, la sortie d'emprunt classique de l21 M1 — A♭3→B3, trajet en pitch-classes) → I, sensible frustrée au ténor (B3→G3), soprano D5→C5, parfaite. L'exact contraire de la variante « boucle » : le rapport nomme les deux régimes côte à côte."
}
```

```json
{
  "exerciseId": "m03-e06-eight-worlds",
  "variantId": "boucle",
  "notation": "[C3+G3+E4+C5]:w | [E3+C4+G4+C5]:w | [C3+G3+E4+C5]:w | [E2+G#3+E4+B4]:w | [E2+B3+G#4+E5]:w | [E2+G#3+E4+B4]:w | [E2+B3+E4+G#4]:w | [Ab2+C4+Eb4+Ab4]:w | [C3+Ab3+Eb4+Ab4]:w | [Ab2+C4+Eb4+C5]:w | [Ab2+C4+Eb4+C5]:w | C5:w",
  "authorNotes": "Le cycle de tierces majeures, la fonction abolie : C (1–3) → E (4–7) → A♭ (8–11) → C (12), tout majeur, 4+4+4. **Le fil voyage de voix en voix** : m3→4 E4 tenu à l'alto (tierce de C devenue fondamentale de E) ; m7→8 G♯4≡A♭4 tenu au soprano (l'enharmonie, F-6) ; m11→12 C5 tenu au soprano. Aucun V→I nulle part (forbidFunctionalCadence) : les mondes basculent par médiante, vivent par renversements. L'atterrissage EST le fil resté seul — **C5 nu**, le retour à do réduit à ce qui n'a jamais bougé. Le rapport nomme chaque saut par sa ligne de table (C→E : la lumière chromatique ; E→A♭ ≡ C→A♭ vue du maillon : l'ombre solennelle)."
}
```

**e07 — le sol qui refuse de bouger** (déclenche F-18)

```json
{
  "exerciseId": "m03-e07-the-stubborn-ground",
  "variantId": "pedale-gagne",
  "notation": "[G2+D4+G4+B4]:w | [G2+E4+G4+C5]:w | [G2+E4+G4+B4]:w | [G2+D4+G4+B4]:w | [G2+Eb4+G4+Bb4]:w | [G2+Eb4+G4+C5]:w | [G2+F4+A4+C5]:w | [G2+Eb4+Ab4+C5]:w | [G2+D4+F#4+C5]:w | [G2+D4+F#4+C5]:w | [G2+D4+G4+B4]:w | [G2+D4+B4+G5]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 4], "state": "compatible" },
      { "bars": [5, 7], "state": "frottee" },
      { "bars": [8, 8], "state": "contredite" },
      { "bars": [9, 10], "state": "frottee" },
      { "bars": [11, 12], "state": "resolution" }
    ]
  },
  "authorNotes": "La pédale de TONIQUE gagne. Installation compatible (m1–4 : G · C/G · Em · G — la pédale est fondamentale, quinte ou tierce). Friction croissante : m5–6 les emprunts (♭VI, iv : G consonant mais le monde s'assombrit), m7 ♭VII (G = 9e étrangère, frottée), **m8 A♭ majeur — l'accord CONTREDIT** (G = septième majeure contre la fondamentale : la pédale niée). Sortie : m9–10 V7 sur pédale de tonique (la friction fonctionnelle tenue deux mesures — l'attente), m11 F♯4→G4 et C5→B4, l'harmonie revient cadencer SUR elle ; m12 l'élargissement conclusif (octave du soprano, geste assumé). **F-18 en acte** : sans le patch, m7 se lit « F9 » et m8 ne se lit pas — c'est pour produire ce constat que la solution est composée."
}
```

```json
{
  "exerciseId": "m03-e07-the-stubborn-ground",
  "variantId": "pedale-cede",
  "notation": "[G2+D4+G4+B4]:w | [G2+E4+G4+C5]:w | [G2+F4+G4+B4]:w | [G2+E4+G4+C5]:w | [G2+E4+A4+C5]:w | [G2+F4+A4+C5]:w | [G2+F4+A4+D5]:w | [G2+Eb4+Ab4+C5]:w | [G2+F4+B4+D5]:w | [G2+F4+B4+D5]:w | [C3+E4+G4+C5]:w | [C3+E4+G4+C5]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 4], "state": "compatible" },
      { "bars": [5, 7], "state": "frottee" },
      { "bars": [8, 8], "state": "contredite" },
      { "bars": [9, 10], "state": "compatible" },
      { "bars": [11, 12], "state": "resolution" }
    ]
  },
  "authorNotes": "La pédale de DOMINANTE cède. Gradation : compatible (V, I6/4, V7 — le balancement propre à la pédale de dominante) → frottée (Am/G, F/G, Dm/G : la pédale en 7e, 9e, 11e) → contredite (m8, A♭ contre sol) → **m9–10 : G7 pur, la tension fonctionnelle accumulée sur sa propre pédale, tenue deux mesures — l'état « compatible » final, c'est la pédale DEVENUE l'accord**. La sortie : m11, la basse bouge pour la première fois (G2→C3) et **ce mouvement EST la cadence** — F4→E4 (7e↓), B4→G4 (sensible frustrée en voix interne), D5→C5 (soprano 1̂) ; m12 l'arrivée qui respire (F-5). Le diptyque a/b enseigne une différence de NATURE, pas de technique."
}
```

**e08 — les quatre séjours modaux** (format commun : 12 mes., bourdon déclaré, boucle ≤ 4, cadence-signature ; F-19 ancre la tonique)

```json
{
  "exerciseId": "m03-e08-seven-worlds",
  "variantId": "dorien",
  "notation": "[D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w | [D2+G3+D4+B4]:w | [D2+A3+F4+A4]:w | [D2+B3+G4+B4]:w | [D2+A3+F4+A4]:w | [D2+C4+E4+G4]:w | [D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 7], "state": "compatible" },
      { "bars": [8, 8], "state": "frottee" },
      { "bars": [9, 12], "state": "compatible" }
    ]
  },
  "authorNotes": "Ré dorien, piliers i–IV. Boucle {Dm, G, C/D} = 3 accords. Le SI (6̂ majeure, la note qui décide du mode) exposé m2, m4 (soprano, ronde), m6 (doublé — légal : 6̂ n'est pas une sensible), m10–11 : pillarExposure ≥ 0.25. m8 : la subtonique C en éclaireuse (le « marteau doux » annoncé). **Cadence dorienne IV→i** (m11→12 : B3→A3, G4→F4 — la 6̂ majeure qui retombe sur la tierce mineure : LA couleur du mode en un geste). Aucun A(7) nulle part : l'interdit du mode tenu."
}
```

```json
{
  "exerciseId": "m03-e08-seven-worlds",
  "variantId": "phrygien",
  "notation": "[E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+G3+B3+E4]:w | [E2+C4+F4+A4]:w | [E2+B3+E4+G4]:w | [E2+A3+D4+F4]:w | [E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+A3+C4+F4]:w | [E2+G3+B3+E4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 1], "state": "compatible" },
      { "bars": [2, 2], "state": "frottee" },
      { "bars": [3, 3], "state": "compatible" },
      { "bars": [4, 4], "state": "frottee" },
      { "bars": [5, 5], "state": "compatible" },
      { "bars": [6, 6], "state": "frottee" },
      { "bars": [7, 7], "state": "compatible" },
      { "bars": [8, 8], "state": "frottee" },
      { "bars": [9, 9], "state": "compatible" },
      { "bars": [10, 11], "state": "frottee" },
      { "bars": [12, 12], "state": "compatible" }
    ]
  },
  "authorNotes": "Mi phrygien, piliers i–♭II. Boucle {Em, F, Dm/E}. Le F sur bourdon de mi produit une friction de septième majeure : elle est **déclarée frottée et assumée comme identité du mode** — c'est le style, le rapport le crédite. Le FA (♭2̂) exposé m2, m4, m6 (à l'aigu), m10, m11. **Cadence phrygienne ♭II→i** (m11→12 : F4→E4, C4→B3, A3→G3 — trois voix qui chutent par degré, la cadence-signature). Aucun B7, aucun ré♯ : l'interdit tenu."
}
```

```json
{
  "exerciseId": "m03-e08-seven-worlds",
  "variantId": "lydien",
  "notation": "[F2+C4+F4+A4]:w | [F2+B3+D4+G4]:w | [F2+C4+F4+A4]:w | [F2+B3+D4+B4]:w | [F2+A3+C4+F4]:w | [F2+B3+E4+G4]:w | [F2+C4+F4+A4]:w | [F2+B3+D4+G4]:w | [F2+A3+C4+A4]:w | [F2+B3+D4+B4]:w | [F2+B3+D4+G4]:w | [F2+C4+F4+A4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 1], "state": "compatible" },
      { "bars": [2, 2], "state": "frottee" },
      { "bars": [3, 3], "state": "compatible" },
      { "bars": [4, 4], "state": "frottee" },
      { "bars": [5, 5], "state": "compatible" },
      { "bars": [6, 6], "state": "frottee" },
      { "bars": [7, 7], "state": "compatible" },
      { "bars": [8, 8], "state": "frottee" },
      { "bars": [9, 9], "state": "compatible" },
      { "bars": [10, 11], "state": "frottee" },
      { "bars": [12, 12], "state": "compatible" }
    ]
  },
  "authorNotes": "Fa lydien, piliers I–II. Boucle {F, G, Em/F} — **do majeur (le V) est banni** : c'est l'interdit lydien, le seul accord qui rendrait la gravité fonctionnelle. Le SI (♯4̂) exposé m2, m4 (soprano), m6, m8, m10, m11. **Cadence lydienne II→I** (m11→12 : B3→C4, la ♯4̂ qui monte à la quinte ; D4→F4, G4→A4). Le bourdon de fa est déclaré même là où il est fondamentale (règle d'écriture du lot : tout bourdon se déclare, sinon F-18 ne s'applique pas)."
}
```

```json
{
  "exerciseId": "m03-e08-seven-worlds",
  "variantId": "mixolydien",
  "notation": "[G2+D4+G4+B4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w | [G2+A3+C4+F4]:w | [G2+B3+D4+G4]:w | [G2+C4+E4+G4]:w | [G2+B3+D4+G4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w | [G2+A3+C4+F4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 1], "state": "compatible" },
      { "bars": [2, 2], "state": "frottee" },
      { "bars": [3, 3], "state": "compatible" },
      { "bars": [4, 4], "state": "frottee" },
      { "bars": [5, 7], "state": "compatible" },
      { "bars": [8, 8], "state": "frottee" },
      { "bars": [9, 9], "state": "compatible" },
      { "bars": [10, 11], "state": "frottee" },
      { "bars": [12, 12], "state": "compatible" }
    ]
  },
  "authorNotes": "Sol mixolydien, piliers I–♭VII — **solution-témoin F-19**. Boucle {G, F, C/G} ; le FA (♭7̂) exposé m2, m4 (soprano), m8, m10, m11. **Cadence mixolydienne ♭VII→I** (m11→12 : C4→D4, F4→G4 — l'atterrissage au ton entier —, A4→B4 : tout monte, aucune sensible). Sans l'ancrage par insistance, cette pièce se lisait « do majeur, demi-cadence IV→V » : elle existe pour verrouiller le patch — la collection de sol mixolydien EST celle de do majeur, seule l'insistance tranche."
}
```

**e09 — le monde et la flèche** (témoin F-20)

```json
{
  "exerciseId": "m03-e09-world-and-arrow",
  "notation": "[G2+F3+B3+D4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+C#4]:h~[G2+F3+B3+C#4]:h | [G2+F3+B3+D4]:h [G2+F3+B3+F4]:h | [G2+F3+B3+E4]:h [G2+F3+B3+D4]:h | [G2+F3+B3+C#4]:w | [G2+F3+B3+D4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+F4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+D4]:w | [G2+F3+B3+C#4]:w | [F#2+F#3+A#3+C#4]:w",
  "payload": {
    "pedalPlan": [{ "bars": [1, 9], "state": "compatible" }]
  },
  "authorNotes": "LE MONDE (m1–8) : G7♯11 bouclé sur pédale de sol déclarée ; la ligne de tête expose les deux piliers — ♯4̂ (do♯ : m2 tenue-liée, m5 ronde) et ♭7̂ (fa : m3, m7 à l'aigu). requireCollection melodic-minor (rotation de ré mineur mélodique — **F-20**) : toutes les hauteurs ∈ {D,E,F,G,A,B,C♯}. Huit mesures où cette sonorité de dominante N'EST PAS une dominante : elle est un lieu. LA FLÈCHE (m9–10) : la MÊME sonorité (m9 ≡ m2), puis la basse plonge d'un demi-ton (G2→F♯2), le triton se referme (F3→F♯3, B3→A♯3) et **le do♯ ne bouge pas** — ♯11 de G7 = quinte de F♯, la note qui appartient aux deux vérités. Le rapport met m5 et m9 côte à côte : le même son, le régime fait le sens."
}
```

**e10 — la lumière blanche**

```json
{
  "exerciseId": "m03-e10-white-light",
  "notation": "[G3+A3+B3+D4]:w | [G3+C4+D4+G4]:w | [A3+B3+E4+F#4]:w | [G3+A3+D4+E4]:w | [G3+B3+C4+D4]:w | [G3+C4+D4+A4]:w | [B3+C4+D4+E4]:w | [G2+D3+A3+E4]:w | [G2+D3+A3+B4]:w | [G2+D3+A3+D4]:w | [G2+D3+G3+D4]:w | [G2+G3]:w",
  "payload": { "declaredPole": 7 },
  "authorNotes": "Tout ∈ sol diatonique ; le fa♯ n'apparaît qu'en voix interne non cadentielle (m3) — forbidFunctionalCadence tenue. Le pôle par INSISTANCE : sol, déclaré — basses de m1–2, 4–6, 8–12, première ET dernière verticalité (F-19 confirme l'ancrage sans gravité fonctionnelle). Six empilements non tertiens tagués ≥ 4 : secondes G-A-B (m1), quartes-quintes (m2), m4, la seconde interne B-C (m5), le cluster diatonique conjoint B-C-D-E (m7), les quintes empilées (m8+). **L'événement d'espacement : m7→m8, ambitus 5 dt → 21 dt** — le resserré maximal qui éclate en quintes. Craft : les secondes vivent au médium, le grave ne porte que des quintes (orch.low-interval-limit silencieux). Fin par dissolution : m9–11 les quintes se vident une à une, m12 l'octave nue G2–G3 — le pôle resté seul, le geste-jumeau du fil seul de e06b."
}
```

**e11 — l'apesanteur** (témoin F-21)

```json
{
  "exerciseId": "m03-e11-weightless",
  "notation": "[C3+G3+E4+C5]:w | [F2+A3+F4+C5]:w | [G2+B3+F4+D5]:w | [C3+G3+E4+C5]:w | [G2+B3+F4+D#5]:w | [Db3~+F3~+A3~+B4]:h [Db3+F3+A3+A4]:h | [Eb3~+G3~+B3~+G4]:h [Eb3+G3+B3+F4]:h | [Db3~+F3~+A3~+A4]:h [Db3+F3+A3+B4]:h | [Eb3~+G3~+B3~+Db5]:h [Eb3+G3+B3+B4]:h | [Db3+F3+A3+Eb5]:w | [Eb3~+G3~+B3~+Db5]:h [Eb3+G3+B3+A4]:h | [Db3~+F3~+A3~+G4]:h [Db3+F3+A3+F4]:h | [Eb3+G3+B3+B4]:w | [G2+G3+B3+F4]:w | [C3+G3+C4+E4]:w",
  "authorNotes": "Trois états de gravité. LE SOL (m1–4) : do majeur fonctionnel, cadence parfaite — l'auditeur doit avoir un monde à perdre. LA PASSERELLE (m5) : G7♯5 par line cliché (D5→D♯5) — et le piège est là : ses quatre pitch-classes {G,B,D♯,F} appartiennent DÉJÀ à WT1, l'accord est amphibie, tagué. L'APESANTEUR (m6–13) : collection stricte WT1 {D♭,E♭,F,G,A,B}, le balancement des deux augmentés D♭+ ↔ E♭+ en tapis TENUS (liaisons par note, **F-21**), l'arabesque au-dessus, sommet E♭5 à m10 — de l'altitude sans gravité, aucun demi-ton nulle part. LA SORTIE : m14, G7 incomplet {G,B,F} — **encore ⊂ WT1** : la sortie est elle-même un mini passage secret ; m15, les premiers demi-tons (B3→C4, F4→E4) = l'événement détecté, cadence du retour, quinte du I livrée par le ténor tenu."
}
```

**e12 — la boussole qui ment** (le diptyque partage sa maison : OCT(C) des deux côtés)

```json
{
  "exerciseId": "m03-e12-the-lying-compass",
  "variantId": "creature",
  "notation": "C3:q. F#3:q. Eb3:q | C3:q. F#3:q. Eb3:q | Eb3:q. A3:q. F#3:q | Eb3:q. A3:q. F#3:q | F#3:q. C4:q. A3:q | F#3:q. C4:q. A3:q | A3:q. Eb4:q. C4:q | A3:q. Eb4:q. C4:q | C3:q. F#3:q. Eb3:q | Eb3:q. A3:q. F#3:q | F#3:q. C4:q. A3:q | [A2+C3+Eb4+E4+F#4]:w",
  "authorNotes": "La cellule : 3 notes, anguleuse (+6/−3, le triton en tête), rythme **3+3+2** — syncopationTarget tenu. La rotation C→E♭→F♯→A à deux mesures par nœud (m1–8), puis **resserrée à une mesure** (m9–11) : la créature accélère, rotation complète taguée ×2. Tout ∈ OCT(C) {C,D♭,E♭,E,F♯,G,A,B♭}. m12 : la MORSURE verticale [A+C+E♭+E+F♯] — le demi-ton E♭–E exposé dans la masse, tenu."
}
```

```json
{
  "exerciseId": "m03-e12-the-lying-compass",
  "variantId": "corruption",
  "notation": "[Eb3+Bb3+G4]:h [F#3+Db4+A4]:h | [A3+E4+C5]:h [F#3+Db4+A4]:h | [C3+G3+E4]:h [Eb3+Bb3+F#4]:h | [C3+G3+Eb4+G4]:w | [Db4+E4+A4]:h [A3+E4+Db5]:h | [Eb3+G3+Bb4]:h [C3+G3+Eb4+C5]:h | [F#3+Db4+A4]:h [F#3+Bb3+Db4+F#4]:h | [Eb2+Bb3+G4]:w",
  "authorNotes": "Le donné (thème innocent en sol majeur) est inchangé à l'octave près **sauf les deux notes listées** — D♭5 (m5) et B♭4 (m6) : samePitchSequenceAsGiven { allowAlteredIndices }. Le thème entre alors dans OCT(C) : la même maison que la variante « créature », l'A/B est jouable à collection constante. Harmonisation exclusivement en triades majeures/mineures sur les quatre nœuds C/Cm, E♭/E♭m, F♯/F♯m, A/Am — **aucun accord de sol n'existe** : le thème est en sol, sa boussole ment jusqu'à la dernière mesure (G4 final posé sur mi♭ majeur). Aucun V→I ; les quatre nœuds visités, chacun nommé par le rapport."
}
```

**e13 — change la brique** (témoin F-21)

```json
{
  "exerciseId": "m03-e13-change-the-brick",
  "notation": "[A2~+D3~+G3~+C4~+E4]:h [A2+D3+G3+C4+F#4]:h | [A2~+E3~+A3~+D4~+G4]:h [A2+E3+A3+D4+E4]:h | [A2~+D3~+G3~+C4~+F#4]:h [A2+D3+G3+C4+A4]:h | [A2~+E3~+A3~+D4~+G4]:h [A2+E3+A3+D4+F#4]:h | [A2~+D3~+G3~+C4~+E4]:h [A2+D3+G3+C4+D4]:h | [A2~+E3~+A3~+D4~+F#4]:h [A2+E3+A3+D4+E4]:h | [A2~+D3~+G3~+C4~+E4]:h [A2+D3+G3+C4+D4]:h | [A2+E3+A3+D4+E4]:w | [A2+D3+G3+C4+F#4]:w | [D2+A2+F#3+A3+D4+F#4]:w | [A2+E3+A3+C4+E4]:w | [A2+E3+A3+C4+E4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 9], "state": "compatible" },
      { "bars": [11, 12], "state": "compatible" }
    ]
  },
  "authorNotes": "Le séjour (m1–8) : boucle de DEUX piles quartales {D-G-C sur A} et {E-A-D sur A}, bourdon déclaré ; la pile D-G-C porte le do — **la tierce mineure dorienne vit DANS la maçonnerie**. Les deux grammaires ensemble : le fa♯ (6̂ dorienne) exposé m1/3/4/6/9 ≥ 0.25 pendant que la mélodie plane sur le tapis TENU (F-21) — l'harmonie fait l'espace, la mélodie porte l'émotion, l'analyseur les juge séparément. LA BASCULE (m9–12) : depuis la pile la plus tendue (C–F♯, le triton en réserve), l'ouverture tertienne — ré MAJEUR étalé, chaque note glissant ≤ 2 dt, F♯ tenu (tag quartal-release) — puis Am, et la sortie est **la cadence dorienne IV→i de e08** : le pont entre systèmes 2 et 3, refermé sur lui-même."
}
```

**e14 — le rouleau** (la dette de §7.4 réglée)

```json
{
  "exerciseId": "m03-e14-the-roller",
  "notation": "[A3+C4+E4]:q [B3+D4+F#4]:q [C4+E4+G4]:q [D4+F#4+A4]:q | [C4+E4+G4]:q [D4+F#4+A4]:q [E4+G4+B4]:q [F#4+A4+C5]:q | [G4+B4+D5]:q [E4+G4+B4]:q [D4+F#4+A4]:q [C4+E4+G4]:q | [B3+D4+F#4]:h [A3+C4+E4]:h | [A3+C#4+E4]:q [B3+D#4+F#4]:q [C4+E4+G4]:q [D4+F#4+A4]:q | [C4+E4+G4]:q [D4+F#4+A4]:q [E4+G#4+B4]:q [F4+A4+C5]:q | [G4+B4+D5]:q [E4+G#4+B4]:q [D4+F#4+A4]:q [C4+E4+G4]:q | [B3+D#4+F#4]:h [A3+C#4+E4]:h | [E2~+A3+D4+G4]:h [E2+B3+E4+A4]:h | [E2~+D4+G4+C5]:h [E2+B3+E4+A4]:h | [E2~+A3+D4+G4]:h [E2+G3+C4+F4]:h | [E2+A3+D4+G4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [9, 10], "state": "compatible" },
      { "bars": [11, 11], "state": "frottee" },
      { "bars": [12, 12], "state": "compatible" }
    ]
  },
  "authorNotes": "Le même dessin de tête roulé trois fois. VOLET 1 — planing diatonique : triades de mi éolien peintes sous la ligne E–F♯–G–A / G–A–B–C / D5–B–A–G / F♯–E, arche, sommet à 56 % (climaxWindow) ; la ligne jugée par les règles mélodiques, les qualités varient, le monde ondule. VOLET 2 — planing RÉEL : le même dessin, majeures exactes — sol♯, ré♯, fa bécarre entrent, `out-of-key` silencieux sous le tag ; l'A/B des deux volets EST la leçon rendue audible. VOLET 3 — le combo : quartes parallèles sur pédale de mi déclarée (l13 × l07). **La dette de §7.4** : trois volets entièrement construits en quintes et octaves parallèles, et le rapport les crédite en toutes lettres pour la première fois du cursus — solution-témoin de la matrice impressionniste."
}
```

**e15 — le voile, la lame, la masse** (témoin F-21)

```json
{
  "exerciseId": "m03-e15-the-veil-the-blade-the-mass",
  "notation": "[G2+D3+G3+D5+E5+G5]:w | [G2+D3+G3+D5+E5+G5+A5]:w | [G2+D3+G3+E5+G5+A5+B5]:w | [G2+D3+G3+D5+E5+G5+A5+B5]:w | [E4~]:q [E4~+F4~]:q [E4~+F4~+F#4~]:q [E4~+F4~+F#4~+G4~]:q | [E4~+F4~+F#4~+G4~+Ab4~]:q [E4~+F4~+F#4~+G4~+Ab4~+A4~]:q [E4~+F4~+F#4~+G4~+Ab4~+A4~+Bb4~]:q [E4~+F4~+F#4~+G4~+Ab4~+A4~+Bb4~+B4~]:q | [E4~+F4~+F#4~+G4~+Ab4~+A4~+Bb4~+B4~]:w | [E4+F4+F#4+G4+Ab4+A4+Bb4+B4]:w | [F4+F#4+G4+Ab4+A4+Bb4]:w | [G4+Ab4+A4]:w | [Ab4~]:w | Ab4:w",
  "authorNotes": "LE VOILE (m1–4) : cluster PENTATONIQUE aigu {D5–B5} déposé note à note sur le pôle pandiatonique de sol (e10 recyclé en socle) — brique = secondes majeures, registre aigu, enveloppe additive. LA LAME (m5–8) : la grappe CHROMATIQUE au médium, cumulative — **8 attaques, une par temps sur deux mesures, chaque note tenue** (F-21 : c'est exactement pour elle que la liaison par note existe) ; largeur finale = la quinte chromatique remplie, tenue deux mesures. LA MASSE (m9–12) : l'effondrement par les bords — 6 sons, 3 sons, puis **l'unisson : UN son, tenu**. La résolution de masse : densité ≠ volume, c'est le nombre de sons qui raconte. Les trois familles taguées avec briques et largeurs."
}
```

**e16 — le double-fond** (bi-plans `simultaneous`, tronc commun m1–8, trois fins ; F-22)

```json
{
  "exerciseId": "m03-e16-the-double-bottom",
  "variantId": "fusion",
  "payload": {
    "parts": {
      "mode": "simultaneous",
      "plans": [
        {
          "id": "A",
          "notation": "[G3+B3+D4]:w | [G3+C4+E4]:w | [G3+B3+D4]:w | [G3+C4+E4]:w | [B3+D4+G4]:w | [C4+E4+G4]:w | [A3+D4+F#4]:w | [G3+B3+D4]:w | [G3+B3+D4]:w | [G3+C4+Eb4]:w | [G3+Bb3+D4]:w | [G3+Bb3+D4]:w"
        },
        {
          "id": "B",
          "notation": "r:w | Eb2:w | G2:h Bb2:h | Eb2:w | Ab2:h G2:h | Eb2:w | Bb1:w | Eb2:w | Eb2:w | Eb2:h Bb2:h | Bb2:w | [Eb2+Bb2]:w"
        }
      ]
    }
  },
  "authorNotes": "Tronc m1–8 : plan A l'innocent (sol majeur ≥ G3, boucle-berceuse I↔IV + un V passager m7, position serrée médium) ; plan B ce qui rôde (≤ C3, la ligne de mi♭). Dégagement de registre tenu, contacts verticaux tagués polychord, et le rapport nomme la motivation : ton sol et ton mi♭, **la médiante sombre en duel** — le G partagé est leur fil (table de l06). FIN « fusion » (m9–12) : A plie note à note (E→E♭ m10, B→B♭ m11) pendant que B monte à la quinte ; objet final inter-plans **{E♭,B♭,G,B♭,D} = E♭maj7** — chaque plan garde ses notes, l'objet est UN accord. Boussoles évaluées sur m1–8 seulement (**F-22**) ; convergence nommée par detectChord inter-plans."
}
```

```json
{
  "exerciseId": "m03-e16-the-double-bottom",
  "variantId": "victoire",
  "payload": {
    "parts": {
      "mode": "simultaneous",
      "plans": [
        {
          "id": "A",
          "notation": "[G3+B3+D4]:w | [G3+C4+E4]:w | [G3+B3+D4]:w | [G3+C4+E4]:w | [B3+D4+G4]:w | [C4+E4+G4]:w | [A3+D4+F#4]:w | [G3+B3+D4]:w | [G3+B3+D4]:w | [G3+Bb3+Eb4]:w | [G3+Eb4]:h r:h | r:w"
        },
        {
          "id": "B",
          "notation": "r:w | Eb2:w | G2:h Bb2:h | Eb2:w | Ab2:h G2:h | Eb2:w | Bb1:w | Eb2:w | Eb2:w | [Eb2+Bb2]:w | [Eb2+Bb2]:w | [Eb1+Eb2+Bb2]:w"
        }
      ]
    }
  },
  "authorNotes": "Même tronc m1–8. FIN « victoire » : A est CAPTURÉ (m10 — il joue du mi♭ sans le savoir), puis s'amenuise (m11, demi-mesure) et se tait (m12) ; B conclut plein — [E♭1+E♭2+B♭2], **la tierce laissée hors du grave** (low-interval-limit respecté, geste documenté). Verdict F-22 : extinction mesurée d'un plan + plénitude de l'autre. La fin la plus littérale du triptyque : un monde éteint l'autre sans jamais le contredire — il l'a d'abord contaminé."
}
```

```json
{
  "exerciseId": "m03-e16-the-double-bottom",
  "variantId": "coexistence",
  "payload": {
    "parts": {
      "mode": "simultaneous",
      "plans": [
        {
          "id": "A",
          "notation": "[G3+B3+D4]:w | [G3+C4+E4]:w | [G3+B3+D4]:w | [G3+C4+E4]:w | [B3+D4+G4]:w | [C4+E4+G4]:w | [A3+D4+F#4]:w | [G3+B3+D4]:w | [B3+D4+G4]:w | [C4+E4+G4]:w | [B3+D4+G4]:w | [G3+B3+D4]:w"
        },
        {
          "id": "B",
          "notation": "r:w | Eb2:w | G2:h Bb2:h | Eb2:w | Ab2:h G2:h | Eb2:w | Bb1:w | Eb2:w | Eb2:w | Ab2:h G2:h | Bb1:w | Eb2:w"
        }
      ]
    }
  },
  "authorNotes": "Même tronc m1–8. FIN « coexistence » : A répète sa boucle inchangée, B rôde inchangé — personne ne cède. Verticalité finale **sol majeur sur mi♭ = {E♭,G,B,D}**, tenue, non résolue. Verdict F-22 : deux boussoles stables sur m1–8 + tag polychord sur la verticalité finale. Des trois fins, c'est celle qui laisse le spectateur dans la scène : le double-fond n'a pas été ouvert."
}
```

**e17 — l'arche sans l'aimant** (plans déclarés, F-23 et F-24)

```json
{
  "exerciseId": "m03-e17-the-arch-without-the-magnet",
  "variantId": "dorien",
  "notation": "[D2+A3+D4]:w | [D2+A3+F4]:w | [D2+B3+G4]:w | [D2+A3+F4+A4]:h [D2+B3+G4+B4]:h | [D2+C4+E4+A4]:h [D2+B3+G4+B4]:h | [D2+A3+F4+A4+D5]:h [D2+B3+G4+B4+D5]:h | [D2+C4+E4+G4+B4+E5]:h [D2+B3+D4+G4+B4+E5]:h | [D2+B3+G4+B4]:w | [D2+A3+F4+A4]:w | [D2+A3+F4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 4], "state": "compatible" },
      { "bars": [5, 5], "state": "frottee" },
      { "bars": [6, 6], "state": "compatible" },
      { "bars": [7, 7], "state": "frottee" },
      { "bars": [8, 10], "state": "compatible" }
    ],
    "tensionPlan": [
      { "bars": [1, 3], "motors": ["registre"], "direction": "rise" },
      { "bars": [4, 7], "motors": ["densite", "rythme-harmonique"], "direction": "rise" },
      { "bars": [8, 10], "motors": ["densite", "registre"], "direction": "fall" }
    ]
  },
  "authorNotes": "L'arche de m01-l14 recréée sans une seule dominante. 3 → 7 voix ; sommet mes. 7 (70 %, E5 et le si dorien au faîte) ; rythme harmonique ×2 exactement sur le segment déclaré ; retombée : les deux moteurs redescendent, `fall` corrélé (**F-24**). pillarExposure (si, m3–8) tenu, boucle i↔IV avec le VII en éclaireuse, forbidFunctionalCadence, sortie par la cadence dorienne de e08. **archFit 0.79**."
}
```

```json
{
  "exerciseId": "m03-e17-the-arch-without-the-magnet",
  "variantId": "pandiatonique",
  "notation": "[G2+D3]:w | [G2+D3+A3]:w | [G2+D3+A3+E4]:w | [G2+D3+B3+E4+A4]:w | [G3+A3+B3+D4+E4]:w | [G3+A3+B3+C4+D4+E4]:w | [A3+B3+C4+D4+E4+F#4+G4]:w | [G3+B3+D4+E4]:w | [G2+D3+A3+E4]:w | [G2+D3+G3]:w",
  "payload": {
    "declaredPole": 7,
    "tensionPlan": [
      { "bars": [1, 4], "motors": ["registre", "densite"], "direction": "rise" },
      { "bars": [5, 7], "motors": ["dissonance-altitude"], "direction": "rise" },
      { "bars": [8, 10], "motors": ["dissonance-altitude", "densite"], "direction": "fall" }
    ]
  },
  "authorNotes": "Le trajet-matière de l10 mis au service de l'arche : quintes ouvertes → **le resserrement** (m5 : les secondes entrent, la dissonance-altitude monte à densité quasi constante — les moteurs sont bien SÉPARÉS, c'est le point de la leçon) → cluster diatonique de 7 sons au sommet (m7, 70 %) → ré-espacement → le pôle nu. Collection stricte, pôle par insistance (F-19), aucune cadence. **archFit 0.72**."
}
```

```json
{
  "exerciseId": "m03-e17-the-arch-without-the-magnet",
  "variantId": "octatonique",
  "notation": "[C3+F#3]:h [Eb3+A3]:h | [F#3+C4]:h [A3+Eb4]:h | [C3+F#3]:q [Eb3+A3]:q [F#3+C4]:q [A3+Eb4]:q | [C4+F#4]:q [Eb4+A4]:q [F#4+C5]:q [A4+Eb5]:q | [C3+Eb3+F#4+A4]:h [C3+Eb3+A4+C5]:h | [C3+Eb3+E4+F#4+A4]:h [C3+Eb3+E4+A4+C5]:h | [C3+Eb3+E3+F#4+A4+C5+Eb5]:w | [C3+F#4+A4]:w | [C3+Eb4]:w | C3:w",
  "payload": {
    "tensionPlan": [
      { "bars": [1, 4], "motors": ["trajectoire"], "direction": "rise" },
      { "bars": [5, 7], "motors": ["densite"], "direction": "rise" },
      { "bars": [8, 10], "motors": ["densite", "registre"], "direction": "fall" }
    ]
  },
  "authorNotes": "**Solution-témoin F-23.** La TRAJECTOIRE comme moteur premier : la rotation C→E♭→F♯→A qui double de vitesse (m3) puis d'octave (m4) — le moteur le plus « octatonique » des six arches, nommé par le plan. La morsure E♭–E entre à m6, pleine au sommet (m7, 70 %) ; retombée par soustraction jusqu'au nœud seul. Sans normalisation intra-pièce, la dissonance sature contre l'étalon diatonique et l'arche s'aplatit : **archFit 0.31 → 0.74** après patch. Le cluster n'est pas un accord sale — sa tension se mesure chez lui."
}
```

**e18 — « L'attente », trois palettes** (le capstone)

```json
{
  "exerciseId": "m03-e18-three-palettes",
  "partId": "fonctionnel-etendu",
  "notation": "[A2+C4+E4+A4]:w | [A2+D4+F4+A4]:w | [A2+C4+E4+A4]:w | [A2+B3+E4+G#4]:w | [A2+C4+E4+A4]:w | [A2+D4+F4+B4]:w | [A2+D4+F4+G#4]:w | [A2+C4+E4+A4]:w | [D3+A3+F4+D5]:w | [D3+Bb3+F4+D5]:w | [F2+A3+D#4+C5]:w | [E2+A3+E4+C5]:w | [E2+G#3+E4+B4]:w | [E2+G#3+D4+B4]:w | [E2+G#3+B3+E4]:w | [E2+B2+G#3+E4]:w",
  "payload": {
    "pedalPlan": [
      { "bars": [1, 3], "state": "compatible" },
      { "bars": [4, 4], "state": "frottee" },
      { "bars": [5, 5], "state": "compatible" },
      { "bars": [6, 7], "state": "contredite" },
      { "bars": [8, 8], "state": "resolution" }
    ]
  },
  "authorNotes": "LA MONTÉE (m1–8) : **l'attente EST la pédale** — huit mesures de tonique tenue, la friction qui croît par vagues (V frottée m4, le doute m6–7 : vii°7 contredit sur son propre sol) puis retombe : la boucle de celui qui attend. LE DOUTE (m9–11) : la basse se libère — iv → ♭II⁶ (un seul mouvement de voix, A3→B♭3 : l'ombre solennelle à coût minimal) → Ger⁶ (chute de basse F2, l'avant-climax) : trois outils tagués ≥ 2. m11→12 : Ger⁶ → i6/4, F2→E2 et D♯4→E4 (la tenaille), le do soprano TENU — pas de paire ♭3̂→2̂ simultanée : **le chemin propre, documenté face au chemin tagué de e03**. LA RETOMBÉE (m12–16) : i6/4 → V → V7 → V dépouillé → V tenu, grave, nu — quatre mesures de dominante qui s'éteint sans résoudre, la dette laissée ouverte. Sommet m11–12 (69–75 %), **archFit 0.71**."
}
```

```json
{
  "exerciseId": "m03-e18-three-palettes",
  "partId": "modal",
  "notation": "[D2+D3+A3+F4]:w | [D2+D3+B3+G4]:w | [D2+A3+F4+A4]:w | [D2+B3+G4+B4]:w | [D2+A3+F4+D5]:w | [D2+B3+G4+D5]:w | [D2+A3+F4+A4+D5]:h [D2+B3+G4+B4+D5]:h | [D2+C4+E4+A4+E5]:h [D2+B3+G4+B4+E5]:h | [D2+A3+D4+F4+A4+D5]:h [D2+B3+D4+G4+B4+D5]:h | [D2+C4+E4+G4+A4+E5]:h [D2+B3+D4+G4+B4+E5]:h | [D2+E4+G4+B4+E5+G5]:w | [D2+B3+G4+B4+D5]:w | [D2+A3+F4+A4]:w | [D2+B3+G4]:w | [D2+A3+F4]:w | [D2+B3+G4]:w",
  "payload": {
    "declaredMode": { "tonic": 2, "mode": "dorian" },
    "pedalPlan": [
      { "bars": [1, 7], "state": "compatible" },
      { "bars": [8, 8], "state": "frottee" },
      { "bars": [9, 9], "state": "compatible" },
      { "bars": [10, 11], "state": "frottee" },
      { "bars": [12, 16], "state": "compatible" }
    ],
    "tensionPlan": [
      { "bars": [1, 6], "motors": ["registre"], "direction": "rise" },
      { "bars": [7, 11], "motors": ["densite", "rythme-harmonique"], "direction": "rise" },
      { "bars": [12, 16], "motors": ["densite", "registre"], "direction": "fall" }
    ]
  },
  "authorNotes": "La même dramaturgie que la part 1, dite en système 2 : **l'insistance remplace la pédale-personnage, les moteurs remplacent l'aimant** (plan corrélé segment par segment, F-24). Sommet m11 (69 %, sol5 au faîte). Et la fin qui n'apaise pas : **le dernier balancement i↔IV interrompu à mi-course — la pièce finit sur IV, le pilier-tonique évité**, la boucle jamais refermée. pillarExposure 0.31, forbidFunctionalCadence, mode confirmé par l'ancrage F-19. **archFit 0.68**."
}
```

```json
{
  "exerciseId": "m03-e18-three-palettes",
  "partId": "non-fonctionnel",
  "notation": "[G2+C3+F3]:w | [G2+C3+F3+Bb3]:w | [G2+C3+F3+Bb3+Eb4]:w | [C3+F3+Bb3+Eb4+Ab4]:w | [F3+Bb3+Eb4+Ab4+Db5]:w | [G2+D3+Eb4~+F4]:w | [G2+D3+Eb4~+F4~+G4]:w | [G2+D3+Eb4~+F4~+G4~+Ab4]:w | [G2+D3+Eb4~+F4~+G4~+Ab4~+Bb4]:w | [G2+D3+Eb4~+F4~+G4~+Ab4~+Bb4~+C5]:w | [G2+D3+Eb4+F4+G4+Ab4+Bb4+C5+Db5]:w | [G2+D3+F4+G4+Ab4+Bb4]:w | [G2+D3+G4+Ab4]:w | [G2+D3+Ab4]:w | [G2+D3+G4]:w | [G2+D3]:w",
  "payload": {
    "declaredCenter": 7,
    "tensionPlan": [
      { "bars": [1, 5], "motors": ["registre"], "direction": "rise" },
      { "bars": [6, 11], "motors": ["densite", "dissonance-altitude"], "direction": "rise" },
      { "bars": [12, 16], "motors": ["densite", "dissonance-altitude"], "direction": "fall" }
    ]
  },
  "authorNotes": "La même attente, dite en matière. Deux ressources taguées : **la tour quartale** qui s'étage et voyage (m1–5, le registre seul travaille) puis **la grappe cumulative** (m6–11, une note par mesure, tenues F-21 — densité ET dissonance-altitude, les deux moteurs déclarés ensemble et mesurés ensemble). Sommet m11 (69 %, 7 sons serrés sur le socle) ; la retombée est **la dissolution par les bords jusqu'à la quinte nue** — la fin qui ne tranche pas. Aucune boussole, l'insistance de sol comme seul lieu. **archFit 0.70**. Verdict transversal du capstone : 0.71 / 0.68 / 0.70 sur la même cible, trois plans de moteurs distincts pour une seule émotion — la démonstration par ses propres pièces que l'arche est universelle et la grammaire un choix."
}
```

---

**Comptage.** 31 fichiers (e01 exclu : quiz, réponses dans la spec) — 9 fichiers simples, 22 adressés par `variantId` ou `partId`. Le cumul projet ne bouge pas : les 31 solutions sont déjà comptées en §66.4, ce lot les met en données. Les trois plans déclarés qui n'existaient qu'en prose dans §63–66 (les bourdons de e08 lydien/phrygien/mixolydien, détaillés état par état ici) sont les seuls endroits où j'ai dû chiffrer ce que le texte décrivait — tout le reste est transcription.