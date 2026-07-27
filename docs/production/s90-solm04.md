Les 25 fichiers, transcrits des lots §67–69 au format canonique. Comme pour M3 : rien n'est recomposé — les lignes sont celles des solutions, les plans déclarés (`texturePlan`, recettes) descendus dans `payload`, les vérifications condensées en `authorNotes`. Les deux corrections de saisie notées dans la source (s09-strette b5, s12 m23) sont appliquées.

**Un erratum à consigner avant le merge (famille F-8/F-30).** Les donnés du JSON publié en §50 ont dérivé de ceux contre lesquels les solutions ont été composées (la banque tracée en §67–68 fait foi) : le CF dorien de §50 porte **11 rondes**, la banque et toutes les solutions en portent **10** (les listes d'intervalles le prouvent : 10 verticalités) ; le CF-marches d'e05 porte 4 notes contre 5 (`A3 G3 F3 E3 D3`) ; le motif d'e07 et la tête d'e09 diffèrent des donnés utilisés en §68 ; e11 déclare la mineur alors que le thème d'Elena est en ré dorien (F-30). Cinq specs à réaligner sur la banque — sans quoi `pitchSequence`/CF ne matcheront pas.

---

**s02 — première espèce (3 volets)**

```json
{
  "exerciseId": "m04-e02-first-species",
  "partId": "above-dorian",
  "notation": "A4:w | A4:w | C5:w | D5:w | E5:w | D5:w | C5:w | B4:w | C#5:w | D5:w",
  "payload": { "cf": "m04-cf-dorian-01", "cfPosition": "above" },
  "authorNotes": "Intervalles contre le CF : 5·3·6·8·6·6·3·3·6·8. Parfaites aux ancrages seulement — départ à la quinte, l'octave de m4 atteinte par mouvement contraire, clausule 6→8 contraire avec **C♯ de ficta** (F-25 : la fenêtre de clausule admet ♯7̂, taguée). Grappes d'imparfaites ≤ 2 ; climax E5 unique à 50 % ; une répétition (m1–2, la licence sp1 unique) ; la ligne chante seule — arche, sauts récupérés."
}
```

```json
{
  "exerciseId": "m04-e02-first-species",
  "partId": "below-aeolian",
  "notation": "A2:w | A2:w | G2:w | F2:w | C3:w | B2:w | A2:w | E3:w | A3:w",
  "payload": { "cf": "m04-cf-aeolian-01", "cfPosition": "below" },
  "authorNotes": "**Témoin F-26 — le miroir de la voix grave.** Intervalles : 8·10·10·6·10·10·10·5·unisson ; parallèles de dixièmes par grappes de 3 max. Le contour s'évalue INVERSÉ : le pôle expressif est **le creux F2 à 44 %** (fenêtre 40–75 %), et la remontée cadentielle est hors comptage. Pénultième = quinte atteinte par mouvement contraire, puis **la basse cadence 5̂→1̂ montante vers l'unisson final** — la clausule grave d'école, que `melody.climax` non patchée punissait."
}
```

```json
{
  "exerciseId": "m04-e02-first-species",
  "partId": "choice-ionian",
  "notation": "G4:w | C5:w | B4:w | A4:w | C5:w | E5:w | C5:w | D5:w | B4:w | C5:w",
  "payload": { "cf": "m04-cf-ionian-01", "cfPosition": "above" },
  "authorNotes": "Le choix : au-dessus de l'ionien. Intervalles 5·6·6·3·6·6·3·6·6·8. Climax E5 unique (60 %), zéro répétition, clausule 6→8 **sans ficta** — le si est naturel en ionien : le contraste pédagogique avec le volet dorien, voulu et nommé. La paire de volets 1/3 enseigne que la ficta n'est pas un ornement mais une nécessité modale."
}
```

**s03 — deuxième espèce (2 volets, CF-dorien)**

```json
{
  "exerciseId": "m04-e03-second-species",
  "partId": "above",
  "notation": "r:h A4:h | A4:h B4:h | C5:h B4:h | D5:h C5:h | B4:h C5:h | D5:h A4:h | C5:h D5:h | E5:h D5:h | B4:h C#5:h | D5:w",
  "payload": { "cf": "m04-cf-dorian-01", "cfPosition": "above" },
  "authorNotes": "La levée inaugurale (le demi-soupir : l'indépendance dès la première seconde). **4 dissonances de passage** — B4 (m2), C5 (m4), C5 (m5), D5 (m7) — chacune par degré, même direction, entre deux consonances (`species2.passing-count` ≥ 3 ✓). L'octave de m4 atteinte par mouvement contraire ; aucun parallèle d'appui à appui ; climax E5 à 80 % ; **ficta m9 sur temps faible** (F-25). Appuis : –·3·6·8·3·6·3·6·5·8."
}
```

```json
{
  "exerciseId": "m04-e03-second-species",
  "partId": "below",
  "notation": "r:h D3:h | D3:h A2:h | C3:h A2:h | D3:h C3:h | B2:h C3:h | D3:h E3:h | F3:h E3:h | D3:h C3:h | E3:h A2:h | D3:w",
  "payload": { "cf": "m04-cf-dorian-01", "cfPosition": "below" },
  "authorNotes": "3 passages dissonants (C3 m4, E3 m6, E3 m7) ✓ ; le contour inversé (F-26) avec son creux au bon endroit. Pénultième A2 : **la basse saute sa quinte 5̂→1̂** — l'ancêtre du geste de walking, annoncé au rapport. La comparaison avec le volet « above » sur le MÊME CF est le but de l'exercice : même partenaire, nouveau problème."
}
```

**s04 — troisième espèce (2 volets, CF-dorien)**

```json
{
  "exerciseId": "m04-e04-third-species",
  "partId": "above",
  "notation": "r:q F4:q G4:q A4:q | C5:q D5:q C5:q A4:q | B4:q C5:q D5:q C5:q | D5:q C5:q B4:q A4:q | B4:q C5:q D5:q E5:q | F5:q E5:q C5:q D5:q | E5:q D5:q C5:q A4:q | B4:q C5:q D5:q B4:q | G4:q A4:q B4:q C#5:q | D5:w",
  "payload": { "cf": "m04-cf-dorian-01", "cfPosition": "above" },
  "authorNotes": "Le catalogue complet, tagué au rapport : **6 passages** (G4 m1, C5 m4, C5 m5, D5 m7, C5 m8, A4 m9 — tous conjoints entre consonances) ≥ 2 ✓ ; **broderie** m3 temps 3 (D5, voisine supérieure dissonante encadrée) ✓ ; **cambiata m6 : F5–E5–C5–D5** (8-7-5-6, le dessin-manuel exact — l'à-peu-près est refusé) ✓, et F5 = climax unique à 60 %. Conjoint 0,83 ≥ 0,70. Clausule m9 : la montée G–A–B–**C♯** (ficta F-25) vers l'octave."
}
```

```json
{
  "exerciseId": "m04-e04-third-species",
  "partId": "below",
  "notation": "r:q D3:q E3:q F3:q | A3:q G3:q F3:q D3:q | C3:q D3:q E3:q C3:q | B2:q A2:q G2:q B2:q | C3:q D3:q E3:q G3:q | A3:q G3:q F3:q A3:q | D3:q E3:q F3:q D3:q | B2:q C3:q D3:q E3:q | E3:q D3:q C3:q A2:q | D3:w",
  "payload": { "cf": "m04-cf-dorian-01", "cfPosition": "below" },
  "authorNotes": "La basse fleurie — l'ancêtre de la walking bass, et le rapport le dit. Passages dissonants nombreux (E3 m1, G3 m2, D3 m3, A2 m4, D3 m5…), **zéro cambiata** (« elle se raréfie au grave » — conforme : la spec below n'en exige pas), le creux G2 à 40 % (F-26), fonder en bougeant : chaque temps 1 consonant, la quinte cadentielle A2→D3."
}
```

**s05 — quatrième espèce (2 volets)**

```json
{
  "exerciseId": "m04-e05-fourth-species",
  "partId": "catalog",
  "notation": "r:h A4:h~ | A4:h C5:h~ | C5:h E5:h~ | E5:h D5:h~ | D5:h E5:h~ | E5:h D5:h~ | D5:h C5:h~ | C5:h B4:h~ | B4:h C#5:h | D5:w",
  "payload": { "cf": "m04-cf-dorian-01", "cfPosition": "above" },
  "authorNotes": "≥ 4 retards, 3 types, chaque cellule au triple test préparation–suspension–résolution : **9-8** (m4 : E5 sur D4 → D5, prep octave m3, dissonance par inertie, un pas descendant) ; **7-6** (m6 : E5 sur F4 → D5 — et E5 = climax, tenu-souffrant : la suspension comme sommet) ; **4-3** (m7 : D5 sur A4 → C5) ; **4-3** (m8 : C5 sur G4 → B4 — deux 4-3 enchaînés). m9 : **syncope rompue** (C♯5 non liée) — la licence de clausule F-27, taguée `syncope-break`, gratuite en zone cadentielle ; ficta F-25. La résolution descend, TOUJOURS."
}
```

```json
{
  "exerciseId": "m04-e05-fourth-species",
  "partId": "chain",
  "notation": "r:h F4:h~ | F4:h E4:h~ | E4:h D4:h~ | D4:h C#4:h~ | D4:w",
  "payload": { "cf": "m04-cf-marches (A3:w G3:w F3:w E3:w D3:w)", "cfPosition": "above", "chainPattern": "7-6" },
  "authorNotes": "**7-6 · 7-6 · 7-6** sur les marches descendantes, ficta au dernier maillon — la voix descend l'escalier en retardant chaque marche. « Ton lamento est réglementaire » : la phrase de la spec, générée. Le rapport nomme la filiation : la chaîne = le moteur du lament (m02-l05, silhouette « chute »). Erratum consigné : le CF de la spec §50 porte 4 notes (F4 E4 D4 C4) ; la solution et la banque §67 en portent 5 — 3 maillons exigent 5 marches."
}
```

**s06 — cinquième espèce, le fleuri (2 volets)**

```json
{
  "exerciseId": "m04-e06-florid",
  "variantId": "cf-dorien",
  "notation": "r:h A4:q B4:q | C5:h D5:q C5:q | C5:q B4:q C5:h~ | C5:h B4:q A4:q | B4:q C5:q D5:q E5:q | F5:q E5:q C5:q D5:q | C5:h C5:h~ | C5:h B4:q D5:q~ | D5:h C#5:h | D5:w",
  "payload": {
    "cf": "m04-cf-dorian-01",
    "texturePlan": [
      { "bars": [1, 2], "texture": "blanches" },
      { "bars": [3, 4], "texture": "syncope" },
      { "bars": [5, 6], "texture": "noires" },
      { "bars": [7, 9], "texture": "syncope" },
      { "bars": [10, 10], "texture": "ronde" }
    ]
  },
  "authorNotes": "Le rapport attendu, mot pour mot : « 4 régimes ✓ (le plan concorde), retard 7-6 orné m4 ✓, retard 4-3 m8 ✓, **retard cadentiel 7-6 m9** ✓ (la cadence passe par la syncope), cambiata m6 ✓ (climax F5), passages ✓ — ton laboratoire est complet. » Chaque figure re-testée par le checker de son espèce d'origine : le fleuri n'assouplit rien, il juxtapose. La liaison de noire m8 (D5:q~) : l'idiome sp5 d'anticipation, couvert. Pas deux mesures consécutives dans la même espèce ✓."
}
```

```json
{
  "exerciseId": "m04-e06-florid",
  "variantId": "cf-ionien",
  "notation": "r:h G4:h | G4:h B4:q C5:q | B4:q C5:q D5:h~ | D5:h C5:q A4:q | B4:h C5:h~ | C5:h B4:q D5:q~ | D5:h C5:h | F5:q E5:q C5:q D5:q | A4:h B4:h | C5:w",
  "payload": {
    "cf": "m04-cf-ionian-02",
    "texturePlan": [
      { "bars": [1, 2], "texture": "blanches+noires" },
      { "bars": [3, 4], "texture": "mixte" },
      { "bars": [5, 7], "texture": "syncope" },
      { "bars": [8, 8], "texture": "noires" },
      { "bars": [9, 10], "texture": "clausule" }
    ]
  },
  "authorNotes": "Le second CF du capstone de laboratoire. Retards 4-3 (m6) et 4-3 (m7 : D5 sur la — la paire enchaînée) ✓, cambiata + climax m8 ✓, 4 régimes ✓, clausule **sans ficta** (ionien) en mouvement contraire ✓. XP majoré, badge « Laboratoire »."
}
```

**s07 — le libre à deux voix**

```json
{
  "exerciseId": "m04-e07-free-two-voices",
  "payload": {
    "voices": [
      { "id": "V1", "notation": "G4:q B4:e C5:e D5:q B4:q | C5:q A4:q G4:h | r:q E5:h D5:q | C5:h~ C5:q B4:q | D5:q F#5:e G5:e A5:q F#5:q | G5:q E5:q D5:h | r:q B4:q C5:h | D5:h. B4:q | G4:q B4:e C5:e D5:q~ D5:q | C5:q B4:q E5:q D5:q | C5:q B4:q A4:q B4:q | A4:q G4:h." },
      { "id": "V2", "notation": "G3:h A3:h | B3:h~ B3:q G3:q | G3:q B3:e C4:e D4:q B3:q | C4:q A3:q G3:h | B3:h A3:h | G3:h~ G3:q B3:q | D3:q F#3:e G3:e A3:q F#3:q | G3:q E3:q D3:h | r:q G3:q E3:h | B3:q G3:q D3:h | E3:q C3:q D3:h | D3:q G2:h." }
    ],
    "declaredAppoggiaturas": [{ "bar": 10, "beat": 3, "note": "E5" }]
  },
  "authorNotes": "Motif M = G4:q B4:e C5:e D5:q B4:q | C5:q A4:q G4:h (erratum : le donné de la spec §50 diffère — la banque §68 fait foi). Partage : V1 = M@G4 (m1–2) et M@D5 transposé (m5–6) ; V2 = M@G3 (m3–4) et M@D3 (m7–8) — 2 énoncés par voix, `findMotifs` par part ; m9 : la tête en écho étiré. Complément : attaques fortes simultanées **0,33 ≤ 0,40** (les entrées de M toujours sous tenue ou silence de l'autre). **L'appoggiature libre déclarée : m10 t.3, E5 sur D3** (9e), atteinte par SAUT (B4→E5, le sommet du geste), quittée par degré, non liée — le checker croise figure ET contour : posée froidement c'est une faute, au sommet d'un élan c'est le sanglot. Clausule complète : 2̂→1̂ sur 5̂→1̂, dixième→octave par mouvement contraire ; polarité contraire aux appuis 9/12 ; grappes de tierces ≤ 3."
}
```

**s08 — trois voix (témoin F-29)**

```json
{
  "exerciseId": "m04-e08-three-voices",
  "payload": {
    "voices": [
      { "id": "S", "notation": "C5:q E5:q G5:q. F5:e | E5:q D5:q C5:h | A4:q B4:q C5:h | B4:h. C5:q | r:h E5:q D5:q | r:q E5:q C5:h | r:q G4:q A4:q B4:q | C5:h. r:q | C5:q E5:q G5:q. F5:e | E5:q F5:q G5:h | A5:q G5:q F5:q E5:q | F5:h~ F5:h~ | F5:h E5:h | D5:h D5:h | C5:q C5:q D5:h | C5:w" },
      { "id": "M", "notation": "G4:h E4:h | G4:q F4:q E4:h | C4:h F4:h | G4:h. E4:q | G4:q B4:q D5:q. C5:e | B4:q A4:q G4:h | E4:h. D4:q | E4:h G4:h | E4:h G4:h | C5:h B4:h | C5:h~ C5:h | A4:h B4:h | G4:h~ G4:h | B4:h B4:h | A4:q A4:q B4:h | E4:w" },
      { "id": "B", "notation": "C3:h G2:h | C3:h G2:h | F2:h A2:h | C3:h G2:h | A2:h E3:h | G2:h E3:h | C3:q E3:q G3:q. F3:e | E3:q D3:q C3:h | A2:h E3:h | C3:h D3:h | F3:h C3:h | D3:w | C3:w | G2:w | F2:h G2:h | C3:w" }
    ],
    "texturePlan": [
      { "bars": [1, 4], "regime": "melodie-accompagnee" },
      { "bars": [5, 8], "regime": "imitatif" },
      { "bars": [9, 12], "regime": "polyphonie" },
      { "bars": [13, 14], "regime": "suspension" },
      { "bars": [15, 16], "regime": "homophone" }
    ]
  },
  "authorNotes": "**Témoin F-29 — le retard généralisé hors espèces.** Le motif aux trois voix : S@C5 (m1–2, repris m9), M@G4 (m5–6, en imitation à la quinte), B@C3 (m7–8). LE RETARD À TROIS : F5 préparée (m12, consonante sur ré m), **liée**, suspendue m13 sur l'accord de do (4e contre C3 ET G4 — la suspension contre deux voix, taguée), résolue E5 ; l'arrivée {C3+G4+E5} triade complète — invisible au checker `species4` couplé au CF en rondes, d'où le découplage de `suspensionCheck` (toute paire, toute valeur, tout style — servira M7/M8 tel quel). Triades complètes 12/16 appuis (75 % ≥ 70 %) ; les incomplets assumés : m1 et m16 (« la conduite prime sur la complétude »). **La médiane jugée comme mélodie autonome** : arche propre (creux D4 m7, sommet C5 m10–11 à 66 %), conjointe 0,81 — la voix qui sert, enfin nommée. 5 régimes détectés, concordants au plan."
}
```

**s09 — l'imitation (3 volets)**

```json
{
  "exerciseId": "m04-e09-imitation-machine",
  "partId": "free-imitation",
  "payload": {
    "voices": [
      { "id": "V1", "notation": "C4:e D4:e E4:q G4:h | A4:q G4:q E4:h | E4:q F4:q G4:h | A4:h G4:q F4:q | E4:q D4:q E4:h | F4:q E4:q E4:h | E4:q C4:q D4:h | C4:w" },
      { "id": "V2", "notation": "r:w | r:w | G4:e A4:e B4:q D5:h | E5:q C5:q B4:h | C5:q B4:q G4:h | A4:h G4:h~ | G4:q A4:q B4:h | C5:w" }
    ]
  },
  "authorNotes": "Tête T = C:e D:e E:q G:q (erratum : le motifHead de la spec §50 diffère — §68 fait foi). Entrée V2 = **T +7 exact (réponse réelle) au délai 2**, émancipation dès m4 (on imite l'identité, on répond librement ensuite). Tritons de passage (m3.2, m4.4) conduits par degré — légaux en libre. Clausule contraire D4→C4 / B4→C5."
}
```

```json
{
  "exerciseId": "m04-e09-imitation-machine",
  "partId": "canon",
  "payload": {
    "voices": [
      { "id": "V1", "notation": "C5:q B4:q C5:q D5:q | E5:q D5:q C5:q A4:q | G4:q F4:q E4:q C5:q | B4:q A4:q C5:q E5:q | D5:q C5:q E5:q C5:q | F4:q E4:q G4:q A4:q | A4:q G4:q F4:q G4:q | D5:h C5:h" },
      { "id": "V2", "notation": "r:w | C4:q B3:q C4:q D4:q | E4:q D4:q C4:q A3:q | G3:q F3:q E3:q C4:q | B3:q A3:q C4:q E4:q | D4:q C4:q E4:q C4:q | F3:q E3:q G3:q A3:q | B3:h C4:h" }
    ]
  },
  "authorNotes": "Canon à l'octave, délai 1 : identité V2 = V1 −12 décalée d'une mesure, m2→m7 **exacte** (`cpt.canon-identity`) ; **m8 libre** — 7̂→1̂ contre 2̂→1̂ du dux : la rupture cadentielle taguée, la machine s'arrête, les humains concluent. Composé avec canonShadow : chaque mesure écrite CONTRE soi-même — octaves et quintes atteintes par mouvement contraire seulement (m2.3, m5.3), grappes d'imparfaites ≤ 3. Le plongeon C5→F4 (m5→6) documenté : le prix d'une consonance à m6 — le canon négocie."
}
```

```json
{
  "exerciseId": "m04-e09-imitation-machine",
  "partId": "stretto",
  "payload": {
    "voices": [
      { "id": "V1", "notation": "C4:e D4:e E4:q G4:q r:q | A4:q G4:h F4:q | E4:h r:h | C5:e D5:e E5:q G5:q r:q | F5:q E5:q D5:q C5:q | D5:h~ D5:h | D5:h C5:h" },
      { "id": "V2", "notation": "r:w | r:w | G4:e A4:e B4:q D5:q r:q | r:h G3:e A3:e B3:q~ | D4:q E4:q F4:h | G4:h~ G4:q A4:q | G3:h C4:h" }
    ],
    "entryDelays": [2, 1, 0.5]
  },
  "authorNotes": "Quatre énoncés de la tête aux délais 2 → 1 → 0.5 : m1.1 (V1) / m3.1 (V2, Δ2) / m4.1 (V1, Δ1) / m4.3 (V2, Δ0.5 — l'énoncé 4 plonge au grave et CHEVAUCHE l'énoncé 3, G5/G3 en double octave au croisement, contraire). L'arche de délais taguée : la compression EST le moteur de tension. Correction de saisie appliquée (V2 m5 = D4:q E4:q F4:h — le B3 lié de m4 résout sur D4 au saut de tête, fin de l'énoncé 4). Cadence contraire finale."
}
```

**s10 — le fugato de poursuite (témoin F-28)**

```json
{
  "exerciseId": "m04-e10-the-chase-fugato",
  "payload": {
    "subject": "G3:q D4:e C4:e Bb3:q A3:q | Bb3:e C4:e D4:q G3:h",
    "tonalAnswer": "D4:q G4:e F4:e Eb4:q D4:q | Eb4:e F4:e G4:q D4:h",
    "counterSubject": "Bb3:h G3:q F3:q | G3:e A3:e Bb3:q Bb3:h",
    "texturePlan": [
      { "bars": [1, 6], "texture": "exposition" },
      { "bars": [7, 10], "texture": "episode" },
      { "bars": [11, 13], "texture": "strette-pedale" },
      { "bars": [14, 15], "texture": "homophone" }
    ],
    "score": [
      { "bars": [1, 2], "A": "Sj@G3 (seul)" },
      { "bars": [3, 4], "S": "réponse tonale @D4", "A": "CS" },
      { "bars": [5, 6], "B": "Sj@G2", "S": "CS +8va (l'inversion encaissée : 10-6-6-6 mesurés)", "A": "r" },
      { "bars": [7, 8], "S": "F4:q C5:e Bb4:e A4:q G4:q | Eb4:q Bb4:e Ab4:e G4:q F4:q", "A": "A3:h Bb3:h | C4:h Bb3:h", "B": "F3:h E3:h | Eb3:h D3:h" },
      { "bars": [9, 10], "S": "D5:q Bb4:q C5:h | Bb4:h A4:h", "A": "F4:h Eb4:h | D4:h C4:h", "B": "Bb2:h F3:h | Bb2:h D3:h" },
      { "bars": [11, 13], "B": "D2:w | D2:w | D2:w (pédale de dominante)", "entries": "tête@G3 (A, b11.1) · tête@D4 (S, b11.3 — Δ1/2) · tête@Bb3 (A, b12.1) · tête@F4 (S, b12.3)", "b13": "S: Eb4:q D4:q C4:q A3:q · A: F#3:w" },
      { "bars": [14, 15], "tutti": "[D3+A3+F#4]:h [D3+C4+F#4]:h | [G2+Bb3+D4]:w" }
    ]
  },
  "authorNotes": "**Témoin F-28 — la réponse tonale.** Le sujet (le mien) est AUTO-TESTÉ d'abord : Sj contre Sj décalé aux délais 2/1/0.5 — consonances aux appuis, zéro parallèle : la strette est solvable PAR CONSTRUCTION, le checker de casting l'exige. La réponse : tête 1̂→5̂ répondue **5̂→1̂** (+5 pour +7, mutation sur le premier intervalle SEULEMENT, suite exacte) — refusée avant patch, taguée `answer: tonal` après ; la restriction (mutation en zone de tête, contour identique, rythme conservé) empêche F-12 de tout avaler. CS **invertible à l'octave** : tierces/sixtes seulement, ZÉRO quinte — donc zéro quarte à l'inversion ; les deux positions mesurées consonantes (`fugato.invertible`). Épisode : la tête séquencée F→E♭ (2 marches ≤ 3), module au relatif (estimateKey b9–10 : Si♭). Strette : 4 têtes aux délais 1/2 sur D2 (pedalPlan, F-18) ; F♯3 (b13) prépare la sensible ; conclusion homophone V→i complète. Le rapport raconte : « exposition propre, épisode qui module au relatif, strette à délai 1/2 — le filet se resserre réglementairement. »"
}
```

**s11 — les cinq contrechants d'Elena** (donné F-30 : mes. 1–8 de s30-elena, ré dorien)

```json
{
  "exerciseId": "m04-e11-elenas-countermelody",
  "variantId": "response",
  "notation": "A2:w | A2:h F3:h | E3:h G3:h | A3:q F4:q. E4:e D4:q | A2:w | G3:h~ G3:h | E3:q C4:q. B3:e A3:q | D4:h C4:q D4:q",
  "payload": { "recipe": "response" },
  "authorNotes": "La réponse : le dialogue dans les respirations. Cellule propre — la tête d'Elena rendue à la quinte inférieure, sixte montante comprise. Elle parle dans les TROUS : m4 (Elena tient A4:h) et m7 (elle plane à l'aigu) — 2 occurrences, la seconde transposée réelle −5 ; ailleurs le contrechant s'assoit (rondes, blanches). Écart moyen 14 dt ≥ 12 ; attaques fortes simultanées **0,21 ≤ 0,35** ; la grappe de dixièmes de m7 taguée en suggestion, assumée : l'écho suit son maître."
}
```

```json
{
  "exerciseId": "m04-e11-elenas-countermelody",
  "variantId": "slow-river",
  "notation": "r:h A2:h~ | A2:w | r:h E3:h~ | E3:h A3:h~ | A3:w | D3:h G3:h~ | G3:h E3:h | D3:w",
  "payload": { "recipe": "slow-river" },
  "authorNotes": "Le fleuve lent : le gravitas. Cellule = **la quarte montante en tenues liées** (E3→A3 m3–4 ; D3→G3 m6, variante rythmique). Entrées aux temps 3 (une seule au temps fort) — le fleuve se glisse sous les TENUES d'Elena, jamais sous ses pas. Toutes les verticalités d'appui consonantes (la 11e de m8.3 est un passage conduit du thème, pas du contrechant). « Ton fleuve lent porte Elena sans jamais la couvrir » — la phrase de la spec, méritée. Ces métriques resservent telles quelles à l'acte 3 de s12."
}
```

```json
{
  "exerciseId": "m04-e11-elenas-countermelody",
  "variantId": "chromatic-line",
  "notation": "r:h D4:h~ | D4:q C#4:q C4:h~ | C4:q B3:q Bb3:h~ | Bb3:q A3:q A3:h | r:h A3:h~ | A3:q G#3:q G3:h~ | G3:q F#3:q F3:h~ | F3:q E3:q D3:h",
  "payload": { "recipe": "chromatic-line" },
  "authorNotes": "La plongée chromatique. Cellule = 5 demi-tons descendants (rythme q-q-h~) — occ. 1 @D4 (D→A, m1–4), occ. 2 @A3 élargie jusqu'à 1̂ (A→D, m5–8, variante rythmique). `chromaticResolutionRequired` : **10/10 chromatismes conduits** (chacun quitté par demi-ton). Le triton E5/B♭3 de m4.1 est LE frottement voulu — la ligne touche le thème à son sommet ; profil film : conduit, donc légal, et nommé au rapport. Écart moyen 12 dt."
}
```

```json
{
  "exerciseId": "m04-e11-elenas-countermelody",
  "variantId": "counter-rhythm",
  "notation": "r:q A3:e B3:e C4:e B3:e A3:q~ | A3:q D4:e E4:e F4:e E4:e D4:q~ | D4:q F4:e G4:e A4:e G4:e F4:q~ | F4:q E4:e D4:e C4:e B3:e A3:q~ | A3:q C4:e D4:e E4:e C4:e A3:q~ | A3:q G3:e A3:e B3:e C4:e B3:q~ | B3:q C4:e D4:e E4:e F4:e E4:q~ | E4:q D4:e C4:e B3:e C4:e D4:q",
  "payload": { "recipe": "counter-rhythm" },
  "authorNotes": "Le contre-rythme : bouger quand elle tient, se taire quand elle marche. Le gabarit : temps 1 **toujours lié** (jamais d'attaque), la vague de croches sous les tenues d'Elena, l'ancre au temps 4 liée au suivant — attaques fortes simultanées mesurées **0,06** : le complément PAR CONSTRUCTION. Cellule : la vague conjointe montée-retour (m1, m2, m3 transposées ; m4 inversée). Écart conforme à la borne propre de la recette (≥ 7 dt — il tresse, il ne fuit pas) ; zéro octave consécutive, vérifié aux croisements m6–7, corrigés à la composition."
}
```

```json
{
  "exerciseId": "m04-e11-elenas-countermelody",
  "variantId": "descant",
  "notation": "r:w | r:w | r:h G5:h~ | G5:h F5:h | E5:h~ E5:h | D5:h~ D5:h | G5:h~ G5:h | F5:h D5:h",
  "payload": { "recipe": "descant", "dyn": [{ "bar": 3, "value": 28, "note": "pp constant — la hiérarchie est dynamique" }] },
  "authorNotes": "Le descant : le ciel. Deux mesures de retenue (le thème d'abord — l'ancrage, toujours), puis la tenue qui glisse : cellule h~h + pas descendant (m3–4, m7–8 varié). Jamais sous le thème, même à son E5 (m3, m7 : la tierce AU-DESSUS du sommet). Velocity déclarée pp — la hiérarchie est dynamique, pas registrale : il plane, il ne rivalise pas. Fin D5, l'octave d'Elena. Attaques fortes simultanées 0,13."
}
```

**s12 — « la scène tissée » (tri-parts ; témoins F-31 et F-32)**

```json
{
  "exerciseId": "m04-e12-the-woven-scene",
  "partId": "part1-casting",
  "payload": {
    "themeA": "D4:e G4:q A4:e B4:q D5:q | E5:q B4:e A4:e G4:h",
    "themeB": "B3:h. A3:q | G3:h E3:h | D3:w"
  },
  "authorNotes": "Les deux personnages. Contrastes vérifiés : prosodie IAMBIQUE (anacrouse, brèves→longues) contre TROCHAÏQUE (longue→brève) — `prosodyPlan` en opposition ; contour ascension-arche contre chute — `contourShape`. **La preuve de compatibilité (F-31)** : les thèmes font 2 et 3 mesures — « superposés tels quels » était indéfini ; le test s'ancre au DÉBUT COMMUN et couvre le chevauchement (min des longueurs), l'excédent du long est libre. A sur B : m3, m6, 8, 11e conduite / 13e, 10e, 9e de passage, 10e — le contrepoint double encaisse : la scène 3 est jouable, et le checker ne laisse pas continuer avant."
}
```

```json
{
  "exerciseId": "m04-e12-the-woven-scene",
  "partId": "part2-scene",
  "payload": {
    "texturePlan": [
      { "bars": [1, 8], "acte": 1, "texture": "melodie+socle puis imitation lointaine" },
      { "bars": [9, 16], "acte": 2, "texture": "strette + suspension" },
      { "bars": [17, 20], "acte": 3, "texture": "superposition + fleuve" },
      { "bars": [21, 24], "acte": 3, "texture": "homophone" }
    ],
    "score": [
      { "bars": [1, 8], "V1": "A @D4 (m1–2) · r:h G4:h~ (m3) · G4:h A4:h (m4) · fragments de tête espacés (m5–8)", "V2": "r (m1–4) · B @B3 (m5–7 — l'entrée LOINTAINE : délai 4, l'autre registre) · A3:h~ A3:h (m8)", "V3": "G2:w | E2:w | C3:w | D3:w | G2:w | C3:w | A2:w | D3:w (le socle discret)" },
      { "bars": [9, 14], "entries": "tête-A @G4 (m9, V1) → tête-B @B3 (m11, V2 : Δ2) → tête-A @D5 (m12, V1 : Δ1) → tête-B @E4 (m12.5, V2 : Δ0.5 — ils se voient)", "b13-14": "convergence par mouvement contraire (V1 descend de D5, V2 monte de E4)" },
      { "bars": [15, 16], "V1": "C5:h~ tenue sur l'accord de sol (4e contre G3/V3 et B3/V2), résolue B4 (m15.3), puis B4:w", "V2": "G3:w (m16)", "V3": "G2:w (m16) — la respiration avant l'ensemble" },
      { "bars": [17, 20], "V1": "A @D4 tel quel", "V2": "B @B3 tel quel (la preuve de part 1 encaissée note à note)", "V3": "r:w | r:h G2:h~ | G2:h A2:h~ | A2:h D3:h (le fleuve lent dessous)", "b20": "V1: E5:q D5:q B4:h · V2: C4:h A3:h" },
      { "bars": [21, 24], "tutti": "[G2+B3+D5]:h [G2+C4+E5]:h | [C3+C4+E5]:h [D3+B3+D5]:h | [D3+A3+C5]:h [D3+C4+D5]:h | [G2+B3+G4]:w" }
    ]
  },
  "authorNotes": "**Témoin F-32 — la strette à deux sujets** : l'acte 2 compresse les entrées de DEUX têtes différentes (A et B qui se rapprochent) ; le checker fusionne les entrées des `heads[]` déclarées dans UNE timeline et mesure l'arche de délais sur la suite fusionnée — délais mesurés 2 → 1 → 0.5 ✓. LE RETARD DU REGARD (m15) : préparation consonante (m14) → liaison → 4e sur appui → résolution descendante (`suspensionCheck`, F-29) — climax de tissage à 62 %. La superposition (m17–19) = l'ancrage de part 1 vérifié À L'IDENTIQUE (F-31). Le fleuve de V3 : les métriques de la recette s11-fleuve (entrées décalées, jamais couvrir). Correction de composition appliquée à m23 : la sixte A3–C5 file vers la septième C4 sur D (V7) avant l'accord final — le choral cadence V→I ; l'ultime verticalité {G,B,G} assume sa quinte absente : 3 voix, la conduite prime. 4 régimes détectés aux frontières déclarées."
}
```

```json
{
  "exerciseId": "m04-e12-the-woven-scene",
  "partId": "part3-reading",
  "payload": {
    "commentary": {
      "moteurParActe": "acte 1 : l'imitation lointaine ; acte 2 : la strette des deux têtes + le retard ; acte 3 : la superposition sur fleuve",
      "climaxDeTissage": "m15, la suspension au point de rencontre",
      "recetteActe3": "fleuve lent",
      "ceQueJaiRetire": "V2 muette tout l'acte 1 ; le fleuve absent des actes 1–2 ; aucun contrechant sur la conclusion",
      "ecartAssume": "l'accord final sans quinte"
    }
  },
  "authorNotes": "Le commentaire vérifié — le produit ne juge pas la prose, il VÉRIFIE la concordance déclaré↔détecté : champ 1 concorde avec les tags ✓ ; champ 2 concorde (le pic de densité d'événements contrapuntiques mesuré : m15) ✓ ; champ 3 concorde (métriques l11 sur V3) ✓ ; champ 4 déclaratif (consigné, non jugé) ; champ 5 croisé avec l'authorNote de la part 2 ✓. Verdict : « trois descriptions de la même scène — plan, détecté, commentaire — convergentes. » La convergence est la note. XP 350, badge de module."
}
```

---

**Comptage.** 25 fichiers : s02 ×3 + s03 ×2 + s04 ×2 + s05 ×2 + s06 ×2 + s07 + s08 + s09 ×3 + s10 + s11 ×5 + s12 ×3 (e01 exclu : quiz, réponses en spec). Déjà comptés en §69.4 — le cumul ne bouge pas. Deux transcriptions structurelles plutôt que note à note (s10, s12-part2) : la source elle-même les donne en carte de mesures, et reconstruire les voix complètes aurait inventé des notes que les lots n'ont pas écrites — la carte est la donnée fidèle, le `score[]` la porte telle quelle.