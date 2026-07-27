Les 19 fichiers, transcrits des lots §70–71. Le format lui-même est né dans ce module : **F-33** (`payload` = le JSON du kind) a été ouvert précisément parce qu'un `LayerStack` ne tient pas dans un champ `notation` — les fichiers ci-dessous sont donc les premiers à l'utiliser pleinement, et `notation` ne réapparaît que là où des couches jouent vraiment (s07, s14).

**Trois errata de spec à réaligner** (les solutions sont composées contre les valeurs corrigées) : e10 porte encore `basculeTimecode: "1:08.0"` pour la bascule 2 — F-36 a tranché que 1'08" est **H1** et que B2 est à **1'02"** (barre 26 temps 1), et s10 est calée là ; le patch acté n'a jamais été appliqué au JSON publié, exactement comme pour m10-e12/e15. e06 déclare ses deux variantes **dans `given`** au lieu de la racine, où les conventions §24/§45B les attendent. e07 n'a **aucun `variants[]`** alors que ses deux briefs produisent deux solutions (a/b) et que le lot en a livré deux : à déclarer, sinon le verrou ne saura pas les adresser.

---

**s01 — Quatre existences dessinées à la main**

```json
{
  "exerciseId": "m06-e01-four-lives",
  "payload": {
    "layers": [
      { "id": "percussive", "source": "saw, cutoff 2200 Hz, résonance ponctuelle", "envelope": { "a": 2, "d": 180, "s": 0, "r": 120 }, "band": [200, 6000] },
      { "id": "sustained", "source": "carré, cutoff 900 Hz", "envelope": { "a": 40, "d": 0, "s": 0.9, "r": 300 }, "band": [150, 2000] },
      { "id": "pad", "source": "saw détuné, cutoff 1400 Hz", "envelope": { "a": 1200, "d": 0, "s": 0.8, "r": 2500 }, "band": [120, 4000] },
      { "id": "gesture", "source": "saw, cutoff en montée", "envelope": { "a": 3500, "d": 0, "s": 1.0, "r": 400 }, "band": [300, 8000] }
    ],
    "controlsUsed": ["waveform", "cutoff", "envelope"]
  },
  "authorNotes": "« La matière et le sculpteur d'abord » : aucun effet, trois contrôles. Les quatre gabarits d'`envelopeProfile` validés avec les tolérances larges de la spec — l'esprit compte plus que les millisecondes. Le point pédagogique documenté pour le feedback : **la nappe et le geste ne se distinguent QUE par le couple attack/release** (1200/2500 contre 3500/400) — même sustain, même forme d'onde, deux existences opposées. La frontière est là, et nulle part ailleurs."
}
```

**s02 — Trois vitesses de vie**

```json
{
  "exerciseId": "m06-e02-three-speeds-of-life",
  "payload": {
    "lengthBars": 16,
    "chord": "ré mineur, tenu",
    "layers": [
      { "id": "pad", "role": "body", "motion": { "type": "lfo", "src": "LFO 0.15 Hz", "dst": "cutoff", "amount": "30%" }, "note": "la respiration — le perpétuel" },
      { "id": "drone", "role": "body", "motion": { "type": "automation", "dst": "cutoff", "curve": "400 → 2600 → 700 Hz", "shape": "arch", "peakBar": 11 }, "note": "le dramatique" },
      { "id": "sparkle", "role": "top", "motion": { "type": "lfo-random", "rateHz": 4, "dst": "pan", "amount": "55%" }, "note": "l'organique" }
    ]
  },
  "authorNotes": "Trois motions, trois types distincts ✓, `sd.static-stack` muette ✓. Le geste central est le drone : **le gabarit `default` de `tensionCurve` appliqué à un paramètre** et non à des notes — la courbe déclarée corrèle au gabarit à **0,81**, sommet mesuré à la mesure 11 (fenêtre [0.6, 0.75] tenue). C'est la démonstration que l'arche de tension du produit est un objet abstrait : elle vaut pour un cutoff comme pour une mélodie."
}
```

**s03 — Le stack canonique** (témoin F-34, le champ `removed` inauguré)

```json
{
  "exerciseId": "m06-e03-the-canonical-stack",
  "payload": {
    "lengthBars": 8,
    "harmony": "la boucle néo-noir fournie (Cm9 · Abmaj7#11 · Dm7b5 · G7b9), deux tours",
    "layers": [
      { "id": "body", "role": "body", "source": "saw-detuned", "band": [100, 2500], "notes": "les voicings de la boucle, dont le G2 grave (98 Hz) à fondamentale coupée par le high-pass" },
      { "id": "sub", "role": "sub", "source": "sine", "band": [30, 90], "mono": true, "notes": "les fondamentales seules (C1 · Ab1 · D1 · G1)" },
      { "id": "top", "role": "top", "source": "pluck d'octave filtré", "band": [2000, 8000] },
      { "id": "texture", "role": "texture", "source": "souffle granulaire", "band": [3000, 10000], "levelDb": -16 }
    ],
    "motion": { "layer": "body", "type": "lfo", "rateHz": 0.12, "dst": "cutoff" },
    "removed": "un pad choir doublant le body : muté — au test du mute, rien ne manquait et le 300–800 respirait ; le body suffisait"
  },
  "authorNotes": "**Témoin F-34.** Le body high-passé joue un sol grave dont la fondamentale (98 Hz) tombe SOUS sa bande déclarée : c'est exactement ce qu'un high-pass fait — la fondamentale coupée, les harmoniques portent. Le checker naïf notes↔bande refusait le geste le plus normal du sound design ; la cohérence dépend désormais de la **source** (sinus/rôle sub : la fondamentale EST le contenu, hors bande = erreur ; saw/wavetable : légal, affiché en information). Les six règles `sd.*` muettes ✓. Et le `removed` est livré tel quel : le rapport le cite mot pour mot — **la soustraction devient une donnée**, c'est ce qui sépare le pro de l'empileur."
}
```

**s04 — Cinq familles, trois briefs (et un piège)**

```json
{
  "exerciseId": "m06-e04-five-families",
  "payload": {
    "layers": [
      { "id": "brief-1", "brief": "la mémoire d'un été", "family": "analog", "role": "body", "band": [100, 3500], "motion": "détune lent", "why": "la chaleur — le détune est la nostalgie du réglage instable" },
      { "id": "brief-2", "brief": "la salle des serveurs", "family": "digital", "role": "body", "band": [100, 8000], "motion": "LFO sync 1/8", "why": "le froid — la wavetable ne respire pas, elle cycle" },
      { "id": "brief-3", "brief": "le monastère en ruine", "family": "choir", "role": "body", "band": [100, 5000], "motion": "wash ambient + formants", "why": "le sacré — les formants portent l'humain sans le mot" },
      { "id": "brief-4", "brief": "le héros se souvient", "family": "hybrid", "role": "body", "band": [100, 4000], "motion": "morph lent", "why": "le souvenir est un objet composite : l'acoustique déguisé" }
    ],
    "bandDiscipline": "high-pass 100 Hz sur les quatre — le pad n'est pas le monde"
  },
  "authorNotes": "« Tu ne cherches plus un pad : tu le choisis. » Les trois briefs univoques tombent sur la table de décision sans hésiter. Le quatrième est le piège, et il est traité comme tel : **hybrid déclaré, la défense analog argumentée dans le même champ** — le rapport crédite les deux et affiche les deux raisons, comme la spec le promet. Une motion par pad ✓, high-pass 100 partout ✓, `sd.band-pileup` et `sd.static-stack` muettes ✓."
}
```

**s05 — La scène invisible** (♩=60, 12 mes., ni pad ni mélodie)

```json
{
  "exerciseId": "m06-e05-the-invisible-scene",
  "payload": {
    "lengthBars": 12,
    "tempoBpm": 60,
    "layers": [
      { "id": "drone-sub", "role": "sub", "source": "sine", "pitch": "la 55 Hz", "band": [40, 90], "mono": true, "dry": true, "levelDb": -8 },
      { "id": "drone-body", "role": "body", "band": [90, 400], "motion": { "type": "automation", "dst": "cutoff", "shape": "opening", "bars": [1, 9] }, "levelDb": -8 },
      { "id": "texture", "role": "texture", "source": "grain d'électricité statique", "band": [4000, 12000], "levelDb": -18 },
      { "id": "atmosphere", "role": "texture", "levelDb": -14, "reference": "le ventilateur du néon", "musicalization": "bande étroite autour de 660 Hz, accordée : la quinte du drone — le lieu devient un intervalle" }
    ]
  },
  "authorNotes": "Tenir une scène avec l'invisible seul : ni pad, ni mélodie (`forbiddenRoles` respecté). Pyramide des niveaux stricte : **−18 < −14 < −8** ✓ — chaque couche inaudible comme objet, évidente comme absence. `sd.sub-conflict` muette (un seul roi sous 90 Hz) ✓, deux motions ✓. Le champ le plus important est la musicalisation de l'atmosphère : le ventilateur n'est pas un bruitage, il est **accordé à la quinte du drone** — c'est là que le sound design devient de la composition, et le champ libre de la spec existe pour permettre de le dire."
}
```

**s06 — La loi du grave** (2 variantes ; l'ostinato de m09-e03)

```json
{
  "exerciseId": "m06-e06-the-law-of-the-low",
  "variantId": "solo",
  "payload": {
    "lengthBars": 8,
    "layers": [
      { "id": "sub", "role": "sub", "source": "sine", "band": [30, 90], "mono": true, "detune": 0, "notes": "l'ostinato du mur éolien, E1–G1" },
      { "id": "growl", "role": "body", "band": [100, 2400], "material": "saw + FM", "filterSetting": "250 Hz — fermé, poli", "notes": "les MÊMES notes que le sub, attaques à ±4 ticks" }
    ],
    "motion": { "layer": "growl", "type": "automation", "dst": "cutoff", "curve": "250 → 1400 Hz", "bars": [7, 8], "note": "la charge" },
    "humanize": { "seed": 11, "offsetTicks": 4 }
  },
  "authorNotes": "« Deux haut-parleurs d'un seul instrument. » Solidarité vérifiée : notes identiques, attaques à ±4 ticks ≤ 10 ✓ ; sub mono, détune ZÉRO (l'épaisseur vit ailleurs — dans le growl) ✓ ; bandes 30–90 / 100–2400 sans chevauchement ✓. L'automation d'ouverture est datée aux mesures 7–8, là où le mur éolien atteint son ♭VII : la charge est harmonique avant d'être spectrale."
}
```

```json
{
  "exerciseId": "m06-e06-the-law-of-the-low",
  "variantId": "cohabitation",
  "payload": {
    "lengthBars": 8,
    "contrabassesActive": true,
    "layers": [
      { "id": "growl", "role": "body", "band": [120, 2400], "material": "saw + FM", "filterSetting": "300 Hz — ouvert à la charge", "notes": "l'ostinato, high-passé à 120 : la chair au-dessus des Cb" }
    ],
    "removed": "le sub : TACET — un seul roi sous 90 Hz, les contrebasses régnaient ; le sub abdique",
    "motion": { "layer": "growl", "type": "automation", "dst": "cutoff", "bars": [7, 8] }
  },
  "authorNotes": "La variante-piège, arbitrée en acte : quand les contrebasses sont actives dans le donné, la bonne réponse n'est pas de high-passer le sub, c'est de **le supprimer**. Le growl remonte à 120 Hz et se réduit à son vrai rôle — la chair au-dessus de l'archet. `sd.sub-conflict` muette dans les DEUX mondes : la cohabitation n'est pas un réglage, c'est une décision de distribution, et elle se déclare dans `removed`."
}
```

**s07 — L'intimité électrique** (2 variantes ; témoin F-35)

```json
{
  "exerciseId": "m06-e07-electric-intimacy",
  "variantId": "confidence-tard-le-soir",
  "notation": "[E4+G4+B4+D5]:w | [G4+A4+C5+E5]:w | [A4+C5+E5+G5]:w | [F4+A4+C5+D5]:h [F4+G4+B4+D5]:h | [F4+Ab4+C5+D5]:w",
  "payload": {
    "family": "rhodes",
    "brief": "la confidence tard le soir",
    "layers": [
      { "id": "keys", "role": "body", "band": [100, 6000], "hasNotes": true, "note": "main droite, rien sous C3" },
      { "id": "sub", "role": "sub", "band": [30, 90], "mono": true, "notation": "C2:w | A1:w | F1:w | G1:w | F1:w" }
    ],
    "motion": { "layer": "keys", "type": "tremolo-pan", "rateHz": 5.5, "note": "la motion signature du Rhodes" },
    "performanceOnly": ["quantizeInfo"],
    "humanize": { "seed": 42, "offsetTicks": 18 }
  },
  "authorNotes": "**Témoin F-35.** La spec exige un jeu non quantisé dur — mais une solution compilée depuis la notation tombe sur la grille au tick près : la référence échouait PAR CONSTRUCTION. D'où le drapeau `performanceOnly` (exigé des soumissions, sauté par le verrou CI n°2) et, en contrepartie, `humanize {seed 42, ±18 ticks}` appliqué au rendu ▶ — déterministe, donc le round-trip tient. Tensions : add9, 11, add9, sus4→7 et **le iv voilé (la♭)** — la porte 3 de M1, aux keys : 4 accords à tensions ≥ 3 ✓, `guideToneVoicing` assoupli (F-4) ✓. La notation est l'extrait chiffré en §70.2 (mes. 1–4 + le nuage) ; la reprise reprend les mes. 1–2 et la mes. 8 pose la tonique."
}
```

```json
{
  "exerciseId": "m06-e07-electric-intimacy",
  "variantId": "souvenir-qui-s-efface",
  "notation": "[E4+G4+B4+D5]:w | [G4+A4+C5+E5]:w | [A4+C5+E5+G5]:w | [F4+A4+C5+D5]:h [F4+G4+B4+D5]:h | [F4+Ab4+C5+D5]:w",
  "payload": {
    "family": "lofi",
    "brief": "le souvenir qui s'efface",
    "layers": [
      { "id": "keys", "role": "body", "band": [100, 6000], "hasNotes": true, "note": "bande plafonnée à 6 kHz — la mémoire filtrée" },
      { "id": "sub", "role": "sub", "band": [30, 90], "mono": true, "notation": "C2:w | A1:w | F1:w | G1:w | F1:w" }
    ],
    "motion": { "layer": "keys", "type": "wow-flutter", "wowRateHz": 0.4, "note": "la motion signature lo-fi" },
    "performanceOnly": ["quantizeInfo"],
    "humanize": { "seed": 42, "offsetTicks": 18 }
  },
  "authorNotes": "L'expérience A/B à matériau strictement constant : **mêmes notes, même sub, même humanize** — seules la famille et la motion signature changent. Le Rhodes fait la nuit chaude, le lo-fi fait la mémoire dégradée, et le plafond à 6 kHz est l'argument audible du second brief. C'est le protocole de m06-e12 en miniature, un module plus tôt : quand une seule variable bouge, l'oreille apprend."
}
```

**s08 — Ton personnage a une voix électrique**

```json
{
  "exerciseId": "m06-e08-your-character-sings",
  "payload": {
    "themeSource": "s30-yours verbatim (sol mineur, 12 mesures) — le capstone M2",
    "layers": [
      { "id": "lead", "role": "melodic", "morphology": "mono", "band": [300, 5000], "hasNotes": true, "briefArgument": "Bruma est une soliste ironique : une seule voix, qui commente", "glide": "sélectif, déclaré sur les deux enjambements (mes. 3, 6), 30–80 ms", "vibrato": { "delayMs": 260, "depth": "léger" }, "filterMapping": "cutoff suit la vélocité" },
      { "id": "body", "role": "body", "band": [100, 280] },
      { "id": "sub", "role": "sub", "band": [30, 90], "mono": true }
    ]
  },
  "authorNotes": "« Un lead ne rachète jamais une mélodie faible ; la tienne a déjà fait ses preuves. » Les notes sont celles du capstone M2 **verbatim** : `findMotifs` re-reconnaît la ligne — la continuité du curriculum vérifiée par un checker, pas par une promesse. Vibrato retardé à **260 ms > 200** ✓ (la loi du mono : le vibrato arrive après la note, sinon c'est un synthé qui chante à la place du personnage). Le lead déclare 300–5000 Hz alors que ses fondamentales G3–F4 sont sous 300 : légal par F-34 (source riche), et la bande déclarée est celle de sa PRÉSENCE. Le body est confiné à 100–280 — hors de la bande réservée du lead ✓ `sd.band-pileup` muette."
}
```

**s09 — L'arp qui se resserre**

```json
{
  "exerciseId": "m06-e09-the-tightening-arp",
  "payload": {
    "lengthBars": 16,
    "tempoBpm": 110,
    "layers": [
      { "id": "arp", "role": "movement", "hasNotes": true, "pattern": { "notes": ["E4", "G4", "B4"], "grid": "1/16", "invariant": true }, "velocities": [98, 70, 58] },
      { "id": "pluck", "role": "top", "hasNotes": true, "releaseCalculation": "un pas 1/16 = 60000/110/4 ≈ 136 ms → release 140 ms (±30 % ✓)" },
      { "id": "sub", "role": "sub", "band": [30, 90], "mono": true, "levelDb": -14 }
    ],
    "drift": { "layer": "arp", "type": "automation", "dst": "cutoff", "curve": "480 → 2300 Hz", "monotonic": true, "note": "au moins un cran mesuré toutes les 4 mesures" },
    "silence": { "layer": "arp", "bar": 13, "beats": 1 },
    "performanceOnly": ["velocityMetricCorrelation"],
    "humanize": { "seed": 7, "offsetTicks": 12 }
  },
  "authorNotes": "« L'arpégiateur explore, le Key Editor possède. » Pattern de 3 notes sur grille 1/16 : le **3-contre-4** retombe sur ses pieds tous les 3 temps — l'asymétrie qui boite, écrite à la main (`motifType: rhythmic` recyclé). Velocities 98/70/58 corrélées au poids métrique : **0,74 ≥ 0,40** ✓ (`prosodyPlan` recyclé — la boîte à rythme triste est interdite). La dérive est `requireChromaticDrift` porté au paramètre : la vis, version filtre. Le release du pluck est déclaré AVEC son calcul, comme la table de l09 l'exige. Et l'apnée : **mesure 13, temps 1 muet** — le silence de la bombe, détecté."
}
```

**s10 — La phrase de bascule** (amendée F-36 : calée sur B2, pas sur 1'08")

```json
{
  "exerciseId": "m06-e10-the-punctuation",
  "payload": {
    "target": { "markerRef": "B2", "timecode": "1:02.0", "bar": 26, "beat": 1 },
    "tempoBpm": 72,
    "layers": [
      { "id": "riser", "role": "fx", "bars": [22, 25], "motions": [{ "dst": "cutoff", "shape": "rise" }, { "dst": "pitch", "curve": "+12 continu" }, { "dst": "width", "curve": "20 → 85 %" }, { "dst": "send-reverb", "shape": "rise" }] },
      { "id": "impact-sub", "role": "fx", "band": [30, 85] },
      { "id": "impact-body", "role": "fx", "band": [90, 1900] },
      { "id": "impact-debris", "role": "fx", "band": [2100, 12000] },
      { "id": "tail-drone", "role": "body", "birthFromImpact": "la traîne de l'impact devient le centre de la scène suivante" }
    ],
    "silenceBeforeImpact": { "bar": 25, "beat": 4, "beats": 1 }
  },
  "authorNotes": "**La cadence de production, prouvée.** Les quatre automations déclarées en motion — tout monte vers LA cible — et la fin du riser tombe **barre 26 temps 1 = B2, écart 0 tick** (croisement tempo×timecode du manifeste F-36 : 25 × 2,4793 s = 61,98 s). L'apnée : temps 4 de la barre 25, tout tacet — le vide amplifie. L'impact tri-couche a ses bandes **étagées à 0 % de chevauchement** (≤ 30 % exigé) : la poitrine, le corps, le débris. Erratum de spec : le donné porte encore `1:08.0`, qui est H1 (la porte) et non B2 — F-36 l'a tranché, la solution suit le manifeste."
}
```

**s11 — La récolte et la sculpture**

```json
{
  "exerciseId": "m06-e11-harvest-and-sculpt",
  "payload": {
    "lengthBars": 8,
    "tempoBpm": 72,
    "layers": [
      { "id": "reverse-riser", "role": "fx", "source": "m10-e09-render:string-swell", "treatment": "région coupée, retournée, fin calée sur cible", "target": { "bar": 8, "beat": 1, "deviationTicks": 0 } },
      { "id": "granular", "role": "body", "source": "m10-e13-render:fredon-tenu", "granularHandles": { "position": "0.42 figée", "size": "90 ms", "density": "26 grains/s", "pitch": 0 } }
    ]
  },
  "authorNotes": "Source-first : deux rendus de missions M10 déclarés par leur id — **la traçabilité du curriculum en donnée**, pas en commentaire. « Le cor vivant donne un nuage riche ; un bip donne de la poussière de bip » : le choix de source EST le travail. Les quatre poignées granulaires sont déclarées et cohérentes avec le rôle : **position figée ⇒ drone** (le rapport cite la table de l11) — un scintillement aurait exigé des grains clairsemés, pitch +12, pan random. Le reverse-riser respecte la grammaire de l10 en ticks : fin sur la cible, ±0. Mini-stack réglementaire, `sd.*` muettes ✓."
}
```

**s12 — Deux mises en scène** (l'expérience contrôlée sur le stack de s03)

```json
{
  "exerciseId": "m06-e12-two-stagings",
  "payload": {
    "sourceStack": "m06-e03-the-canonical-stack",
    "stagings": [
      { "id": "A-studio", "reverb": { "type": "room", "decayS": 0.9, "preDelayMs": 12 }, "widths": { "body": 0.3, "top": 0.55, "texture": 0.6 }, "widthBudget": 0.42, "pans": "sages" },
      { "id": "B-cathedral", "reverb": { "type": "hall", "decayS": 3.7, "preDelayMs": 85 }, "widths": { "body": 0.7, "top": 0.95, "texture": 1.0 }, "widthBudget": 0.86 }
    ],
    "sub": { "dry": true, "mono": true, "inBothStagings": true },
    "bascule": { "lengthBars": 2, "motions": "sends et widths interpolés — changer de lieu EST une bascule" }
  },
  "authorNotes": "L'espace comme paramètre de composition, prouvé par l'expérience contrôlée : **couches et notes strictement identiques A↔B**, seuls `sends`, `width` et `pan` diffèrent — l'invariance est vérifiée note à note, sinon la démonstration ne vaut rien. Contrastes mesurés : budget de largeur 0,42 vs 0,86 (Δ ≥ 0,3 ✓), wet Δ ≥ 0,25 ✓. Le decay du hall est calé musicalement : **3,7 s = quatre temps à ♩=65**, le tempo de la scène — une réverbération se compose, elle ne se choisit pas dans une liste. Et dans les deux mondes, le sub reste sec et mono : le hors-lieu ne se négocie pas."
}
```

**s13 — La chair, le liant, la respiration** (témoin F-38)

```json
{
  "exerciseId": "m06-e13-flesh-glue-breath",
  "payload": {
    "sourceStack": "m06-e06-the-law-of-the-low",
    "tempoBpm": 100,
    "layers": [
      { "id": "sub", "role": "sub", "band": [30, 90], "mono": true, "saturation": "aucune — déclaré pur" },
      { "id": "growl", "role": "body", "saturation": { "dose": "35 %" }, "band": [100, 4800], "bandBefore": [100, 2400], "note": "bande élargie honnêtement : saturer crée des harmoniques" },
      { "id": "pad", "role": "body" },
      { "id": "ghost-kick", "role": "movement", "trigger": true, "notes": "noires", "note": "métronome de sidechain, aucun audio" }
    ],
    "busGlue": { "ratio": "2:1", "reductionDb": "1–2", "attackMs": 30, "dose": "légère" },
    "sidechainPlan": {
      "links": [
        { "source": "sub", "target": "pad", "depthDb": 3, "note": "le nettoyage" },
        { "source": "ghost-kick", "target": "growl-and-pad", "releaseMs": 480, "calculation": "pouls = 500 ms à ♩=120 ; 480 ∈ ±30 % ✓" }
      ],
      "nonCircular": true
    }
  },
  "authorNotes": "**Témoin F-38 — la couche-déclencheur silencieuse.** Le kick fantôme est une source de sidechain SANS audio : le schéma ne savait pas le dire, et une couche muette violait la pyramide des niveaux tout en polluant la carte spectrale. `Layer.trigger: true` la sort des règles `sd.*` de spectre et de niveaux ; ses notes ne définissent qu'un rythme de pompage. Les trois gestes : la chair (35 % de saturation, et la bande déclarée le DIT — 2400 → 4800, avec un low tenu à 100 : le growl ne redescend jamais sous 90, `sd.sub-conflict` muette), le liant (glue de bus, 1–2 dB, attaque 30 ms : cimenter sans écraser), la respiration (deux liens non circulaires). Le rapport lira les liens comme des relations : « ton pad respire sur ton sub » est une phrase d'analyse."
}
```

**s14 — L'orchestre habillé** (F-37 : le donné de m05-e08 produit ici ; première soumission bi-registres)

```json
{
  "exerciseId": "m06-e14-the-dressed-orchestra",
  "notation": "G4:q. C5:e C5:q D5:q | E5:h C5:h | F5:q. E5:e D5:q C5:q | D5:h G4:h | G4:q. C5:e C5:q D5:q | E5:h G5:h | A5:q G5:q F5:q D5:q | C5:w",
  "payload": {
    "given": {
      "note": "l'extrait de référence de m05-e08 produit dans ce lot (F-37) — 8 mesures, ut majeur",
      "themeInstrument": "trompette",
      "strings": "C | C | F→G | G | C | C→Em | F→G | C (voicings en série harmonique, vl./alt./vc.)",
      "contrabasses": "C2 → … → E1 aux barres 7–8 — la descente donnée"
    },
    "layers": [
      { "id": "sub-relay", "role": "sub", "source": "sine", "band": [30, 40], "entersBar": 7, "note": "il ne prend que SOUS le E1 des Cb — relais, pas doublure" },
      { "id": "phantom-pad", "role": "body", "band": [150, 5000], "levelDbRelative": -7, "hasNotes": true, "notes": "⊆ notes des cordes (pitch-class sets par fenêtre : 8/8)" },
      { "id": "texture", "role": "texture", "source": "air" }
    ],
    "bandHandoff": { "acoustic": "contrabasses", "synthetic": "sub-relay", "overlapHz": 0 },
    "fusionProtocol": { "type": "envelope-relay", "bars": [7, 8], "note": "les cordes attaquent, le pad porte la tenue" }
  },
  "authorNotes": "**Témoin F-37 et première soumission jugée par les DEUX registres.** La règle générale née ici : tout `given` qui cite un exercice antérieur pointe **la solution de référence** de cet exercice — et comme la pièce héroïque de m05-e08 dormait au backlog assets, la solution s14 était incomposable : l'extrait de 8 mesures est donc produit dans ce lot (le backlog s'allège d'autant). L'habillage est invisible par construction : le sub-relais entre à la barre 7, **exactement où les contrebasses s'arrêtent** (chevauchement 0 Hz — un relais, pas un renfort) ; le pad fantôme joue un sous-ensemble strict des notes des cordes (8/8 fenêtres) à −7 dB sous elles, high-passé à 150 : l'oreille fusionne les timbres qui bougent ensemble, et le pad devient la résonance des cordes. Le protocole déclaré est le relais d'enveloppe au climax. Verdict : **`sd.*` et `orch.*` muets ensemble** — l'hybride invisible, 70 % du métier."
}
```

**s15 — « La Remise » hybride** (le capstone, tri-parts)

```json
{
  "exerciseId": "m06-e15-la-remise-hybrid",
  "partId": "part1-distribution",
  "payload": {
    "worldDistribution": [
      { "role": "sub", "titular": "sinus-relais", "why": "la gravité sans archet" },
      { "role": "body", "titular": "pad hybrid", "why": "l'acoustique déguisé — la scène est un souvenir" },
      { "role": "top", "titular": "scintillement granulaire tracé", "why": "la lumière vient d'une matière du curriculum, pas d'un preset" },
      { "role": "texture", "titular": "le grain du lieu", "why": "la remise a un bruit de fond, et il est accordé" },
      { "role": "movement", "titular": "l'arp de s09 ralenti", "why": "la filature devient attente" },
      { "role": "fx", "titular": "la phrase de s10", "why": "la ponctuation est déjà écrite et prouvée" },
      { "role": "melodic", "titular": "keys lo-fi", "why": "le thème en mémoire" }
    ],
    "basculePlan": [
      { "markerRef": "B1", "timecode": "0:31.0", "gesture": "place-change", "note": "l'espace s'ouvre — le geste de s12" },
      { "markerRef": "B2", "timecode": "1:02.0", "gesture": "punctuation-phrase", "note": "riser → impact, s10 resservie" },
      { "markerRef": "H1", "timecode": "1:08.0", "gesture": "world-handoff", "note": "le témoin — impact sec + apnée" }
    ]
  },
  "authorNotes": "« La décision la plus structurante de la scène se prend sans toucher un synthé. » Les 7 rôles pourvus et argumentés, `sd.role-coverage` muette **en amont** — avant la première note. Les bascules sont désignées par **IDs de marqueurs du manifeste** (F-36) et non par timecodes bruts : B1 le lieu, B2 la ponctuation, H1 le passage de témoin. Quatre des sept titulaires sont du matériau déjà produit et jugé (s09, s10, s12, le thème) — le capstone n'invente pas un monde, il en distribue un."
}
```

```json
{
  "exerciseId": "m06-e15-la-remise-hybrid",
  "partId": "part2-stack",
  "payload": {
    "layersCount": 11,
    "durationSec": 90,
    "tempoBpm": 72,
    "cruise": ["drone", "sub", "pad", "texture"],
    "played": [
      { "id": "keys", "role": "melodic", "judgedBy": "M1 — la progression du cue" },
      { "id": "lead-memoire", "role": "melodic", "judgedBy": "M2 — la ligne, arche vérifiée" },
      { "id": "arp", "role": "movement" }
    ],
    "fxTargets": [
      { "markerRef": "B2", "deviationTicks": 0 },
      { "markerRef": "H1", "type": "impact tri-couche, bandes étagées" }
    ],
    "sidechains": [
      { "source": "sub", "target": "pad", "depthDb": 3 },
      { "source": "ghost-trigger", "target": "body", "note": "F-38" }
    ],
    "threeCoordinates": "bande × sends × width/pan déclarés pour les 11 couches",
    "subMono": true
  },
  "authorNotes": "Le rapport le plus large du produit avec m10-e15 : le moteur déroule tout et sort vert. Onze couches sur 90 secondes, mais **quatre seulement en croisière** — la densité est un événement, pas un état. Les couches jouées sont re-jugées par les registres de leur discipline (l'harmonie par M1, la ligne par M2) : dans ce module, une couche qui joue reste de la musique. Les FX sont calés en ticks × timecode (B2 : ±0 tick), les sidechains déclarés et non circulaires, les trois coordonnées — fréquence × profondeur × largeur — renseignées couche par couche : la `densityMap` en trois dimensions. Pyramide et budget stéréo tenus ✓."
}
```

```json
{
  "exerciseId": "m06-e15-la-remise-hybrid",
  "partId": "part3-subtraction",
  "payload": {
    "removed": [
      "le supersaw du climax : coupé — il rivalisait avec le thème-mémoire (band-pileup 1–4 kHz mesuré au mute)",
      "le second drone à l'octave : coupé — un seul roi sous 90 Hz, et l'apnée de H1 respirait mieux sans lui"
    ]
  },
  "authorNotes": "« On assemble par addition, on finit par soustraction. » Deux couches essayées puis coupées, chacune avec sa raison MESURÉE — pas un goût : le pileup 1–4 kHz constaté au test du mute, et le conflit sous 90 Hz qui étouffait l'apnée. C'est le seul livrable du produit où l'on est noté sur ce qu'on a su enlever, et il vaut ses 35 points de craft. XP 400, badge de module — et le diptyque « La Remise » est complet au portfolio : la même scène, deux mondes, une seule dramaturgie. **La preuve que la composition précède l'instrumentarium.**"
}
```

---

**Comptage.** 19 fichiers : s01–s05, s06 ×2, s07 ×2, s08–s14, s15 ×3 — déjà comptés en §71.3, le cumul projet ne bouge pas (197 solutions/étalons · 65 findings, après le lot M5 neuf). Trois transcriptions restent descriptives là où la source l'était (s03 pour les voicings du body, s15-part2 pour le détail des 11 couches) : chiffrer davantage aurait inventé des valeurs que les lots n'ont pas écrites.