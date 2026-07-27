# SECTION 77 — LE GÉNÉRATEUR §4.3 ET LES ÉTALONS M11 (spec + 8 étalons + 2 findings) — MODULE 11 CLOS, BACKLOG SOLUTIONS SOLDÉ

## 77.0 Le dernier chantier moteur : le générateur spécifié

M11 annote des pièces **dont le produit possède l'intention** — il faut donc, en passant, spécifier le générateur promis en §4.3 :

```
GeneratorRecipe {
  seed,                       // déterminisme total : recette + seed = la même pièce, toujours
  lengthBars, tempo, system,  // functional | modal | nonfunctional (+ params : mode, collection…)
  form:   [{bars, label, fuzzyBoundary?}],          // les frontières, franches ou floues
  motif:  {cell, plan: [{bar, transform}]},          // les occurrences PLANTÉES
  tensionPlan (F-24), rolePlan, instrumentation,
  idioms: [{id, bar}], ambiguousZones: [{bars, why}]
} → Part[] + GenerationTruth (tout ce qui précède, résolu en ticks, + la tensionCurve calculée)
```

**Verrou CI n°5 (auto-cohérence du générateur)** : chaque pièce générée repasse ses propres détecteurs — la détection doit **contenir** la vérité plantée (`détection ⊇ vérité`), sinon la recette est rejetée. Décision actée dans la foulée : **la pièce-mystère de m01-e48 devient une pièce générée** (recette `G-M48`, seed figé) — l'asset « ~2 h au gabarit Départ » sort du backlog, remplacé par une recette versionnée.

## 77.1 Findings de calibrage

**F-50 — La concordance se juge contre l'union vérité ∪ détection (patch du juge ANALYSIS).**
Le générateur plante 5 occurrences du motif ; `findMotifs` en trouve 7 — deux répétitions **émergentes** (la musique en produit toujours). L'élève qui les marque serait « faux » contre la vérité plantée, et pourtant juste musicalement.
*Patch* : une annotation est correcte si elle appartient à la vérité **ou** à la détection ; seul le vrai faux-positif pénalise ; les zones `ambiguous` de la recette créditent la réponse « **indécidable** » comme LA bonne (e04, le diagnostic des mondes). Le rapport distingue « planté » / « émergent — bien vu » dans son commentaire. +6 fixtures.

**F-51 — La fiche de genre est un formulaire mappé (amendement e06, famille F-8).**
« Le moteur compile tes traits en contraintes » — impossible sur du texte libre.
*Amendement* : la fiche se remplit en **champs contraints mappés sur le registre de l'annexe C** (mode → `key/requireCollection`, intervalle-signature → `mustContainInterval`, trot → `syncopationTarget`+`prosodyPlan`, espace → contraintes d'ambitus/registre…) + un champ libre *non compilé* (la prose de la fiche). Le test des 8 mesures est jugé par les seules clés compilées — l'exercice méta devient mécanique. Le gabarit de fiche (annexe du manuel) liste les ~18 traits compilables.

## 77.2 Les huit étalons

**m11-s01** *(e01 — la première enquête, sur `G-M48`)* — passe 1 : « suspendu · voilé · patient » + LE moment (la bascule d'ambiguïté, mes. 19 — la zone `ambiguous` de la recette) ; passe 2 : `label-segments` = la forme plantée ✓, `draw-tension` = la courbe machine (corrélation 1.0 — l'étalon est le plafond ; le seuil élève ≥ 0.5) ; passe 3 : `name-chords` sur le moment + `mark-occurrences` (5 plantées + 2 émergentes, F-50) ✓.

**m11-s02** *(e02 — la biographie d'Elena, sur m07-s10)* — `mark-occurrences` : les 11 vies du thème créditées par type (exact ×3, transposé ×2, fragmenté ×3, augmenté S3, voilé S1 ×2) ; **le tableau des vies** (occurrence/transformation/harmonie/porteur) vérifié contre les tags et le rolePlan de la solution — dont la ligne-clé : *S5, le fleuve devenu thème, celli* ; diagnostic de régime : **thème-récit** argumenté ✓. *L'exercice d'analyse le plus vérifiable jamais construit — parce que l'intention existe.*

**m11-s03** *(e03 — le diagnostic de système, 3 extraits + bonus)* — extrait 1 (fonctionnel à emprunts) : QCM + `name-functions` + le iv et le subV pointés ✓ ; extrait 2 (modal) : piliers + cadence dorienne ✓ ; extrait 3 : « collection : octatonique ; geste : rotation » (`requireCollection` en sens inverse ✓) ; **bonus** : la frontière de bascule pointée à ±0 mesure (la couture est dans la recette) ✓.

**m11-s04** *(e04 — la lecture d'effectifs, le diptyque en corpus)* — la timeline `role-map` des 5 sections = le rolePlan de m10-e15 ✓ ; les cinq lignes aux deux instants (le creux S4, le sommet S3) = la `densityMap` ✓ ; 4 événements pointés ±0 ; garde-robe par exposition ✓ ; **le jumeau hybride** : diagnostic des mondes par couche — dont **2 « indécidable » crédités** (le pad-fantôme et le top granulaire : la recette les justifie, F-50) ✓.

**m11-s05** *(e05 — le temps, sur `G-05` (2'30", 3 moteurs, frontière floue) + le spotting inversé)* — volet 1 : segments (la floue **qualifiée**, pas tranchée ✓), draw-tension, **l'autopsie** : la check-list des moteurs par segment = le `tensionPlan` de la recette (effectif+activité S2, +dynamique S3 ✓) ; volet 2 : bascules servies (B1, B2), traversée assumée (B3 — le cue de la solution la traverse exprès), refusée : aucune ; entrées/sorties contre le spotting F-36 ✓.

**m11-s06** *(e06 — la distillation western, corpus `G-W1…5` + le test ; témoin F-51)* — les 5 grilles courtes ✓ ; **la table des récurrences** avec le verdict-clé : *la pièce 4 viole le trot et reste western* (le contre-exemple identifié — le trait « trot » descend à 4/5, reste ≥ 4/6 avec pondération) ✓ ; **la fiche : 8 traits ≤ 10**, tous en champs compilables (mixolydien, quintes à vide, `mustContainInterval` [P5, P4], trot pointé en `prosodyPlan`, sommet modeste — le gabarit `western` de l'annexe D cité) ; **le test** : 8 mesures composées, jugées par les contraintes que la fiche déclare — score 91 ✓. *La fiche que personne n'a écrite, testée en composant.*

**m11-s07** *(e07 — la reconstruction, sur `G-07` (16 mes., 4 couches))* — l'analyse préalable soumise AVANT l'éditeur (grille + role-map ✓) ; la maquette-étalon = **le MIDI de référence lui-même** (différentiel 100 % — le plafond ; seuils élève : mélodie ≥ 90 %, voix internes par proximité) ; la carte des écarts de l'étalon : vide — le gabarit de rapport calibré sur les deux bornes (0 % et 100 %) ✓.

**m11-s08** *(e08 — « l'enquête en autonomie », sur `G-08` : 3 min, 4 sections, bascule de système, thème à 3 vies, crescendo multi-moteurs)* — part 1 : l'enquête libre (les zooms de l'étalon tombent sur LE moment et les deux charnières — le choix des zooms noté ✓) ; part 2 : **la synthèse d'une page** au gabarit (l'œuvre en 3 phrases · forme · système et bascule · vies du thème · fabrication du sommet · 2 procédés à voler · 1 absence signifiante), concordance champ par champ ✓ ; part 3 : **le vol légal** — le procédé transplanté : *la fausse décrue* (identifiée en part 2) posée dans 8 mesures neuves (tonalité, tempo, effectif différentiels ✓), le procédé tagué présent ✓, **`findMotifs` contre la source : zéro occurrence** ✓. XP 350, badge — et le diagnostic de sortie consolidé (e01→e08).

## 77.3 MODULE 11 CLOS — LE BACKLOG SOLUTIONS EST INTÉGRALEMENT SOLDÉ

| Jalon | |
|---|---|
| M11 | **8/8 étalons** ✅ + le générateur spécifié (verrou CI n°5) + 8 recettes versionnées (G-M48, G-05, G-07, G-08, G-W1…5 — l'asset e48 converti) |
| Findings du lot | **F-50** (union vérité∪détection + l'indécidable crédité), **F-51** (la fiche-formulaire compilable) |
| **BACKLOG SOLUTIONS : 100 %** | M1 · M2 · M3 · M4 · M6 · M7 · M8 · M10 · M11 — **191 solutions/étalons**, **51 findings** traités, 5 verrous CI, le portfolio 4/4 vérifié |
| Ce que les findings ont acheté | 51 corrections dont : 4 formats (payload, Part.dyn/mute, liaisons internes, swing compilé), 6 règles de fenêtrage/portée, 3 licences d'école, 5 registres mis en données, 2 manifestes d'assets, 9 amendements de specs — *le moteur qui sortira en beta n'est pas celui qui est entré en production* |

---

**Point de confirmation.** Il ne reste que de la production sérielle et des fronts : **(a)** le lot quiz (~95 quiz, ~40 h à la charte — découpable par tranches de ~15 quiz : je peux dérouler M3 en premier) ; **(b)** la spécification des assets M12 (le plan des ~400 clips, spécifiés depuis les fiches) et des 2 assets audio-vidéo restants (« La Remise » vidéo, « fredon » — leurs manifestes existent déjà) ; **(c)** la consolidation finale (le registre des 51 findings et des décisions accumulées depuis la v1.0, prêt à verser au repo). Ma recommandation : **(a)** — les quiz dans l'ordre des modules, pendant que tout est frais. On attaque ?