# MUSIC ACADEMY INTERACTIVE — CONSOLIDATION FINALE DE PRODUCTION (v1.1)

**Document de passation — 11 juillet 2026.**
Complète le Manuel Maître v1.0 (architecture, moteur, conventions, modules — inchangés). Ce document consolide **tout ce qui a été produit et décidé depuis** : le calibrage complet (findings F-15→F-51), les solutions/étalons des 9 modules, les 148 quiz, la spécification des assets. À verser au repo : `docs/CONSOLIDATION_v1.1.md`. En cas de conflit avec le Manuel v1.0, **ce document prime** (il en est l'amendement, §7.4).

---

## 1. ÉTAT GLOBAL DU PROJET

| Front | État | Volume |
|---|---|---|
| Curriculum (leçons) | ✅ clos (v1.0) | ≈152 leçons + ~30 pages REFERENCE (M12) |
| Specs d'exercices | ✅ clos, amendés par findings | ~179 specs, 12 amendements tracés |
| **Solutions / étalons** | ✅ **100 %** | **191** (M1 27, M2 29, M3 31, M4 25, M6 19, M7 15, M8 22, M10 15, M11 8) |
| **Findings de calibrage** | ✅ tous traités | **51** (F-1→F-14 : annexe E du Manuel v1.0 ; F-15→F-51 : §3 ci-dessous) |
| **Quiz** | ✅ **100 %** | **148 quiz · ~749 items**, charte 5/5, ~140 items jouables |
| Portfolio élève | ✅ 4/4 vérifié | « La Remise » (diptyque), « Trois palettes », « Elena » (cue 48 mes.), « le standard » (AABA) |
| Assets | spec ✅ / production à faire | ~385 clips M12 spécifiés (~22 h) + 2 briefs AV (« La Remise » vidéo, « fredon ») |
| Moteur | ✅ complet + calibré | 5 verrous CI (dont n°5 : auto-cohérence du générateur) ; générateur §4.3 spécifié + 8 recettes versionnées |
| Implémentation logicielle | à dérouler | roadmap Manuel §2.7 (S1–S32), inchangée |

**Verrous CI (récapitulatif)** : 1. complétude contraintes↔checkers · 2. résolubilité **polymorphe par kind** (F-48 : score ≥ 85 / checkers de preuve / lint de checklist / concordance d'annotations) · 3. round-trip notation (étendu : liaisons internes F-21, swing F-43) · 4. auto-cohérence des gabarits d'ambiance · 5. auto-cohérence du générateur (détection ⊇ vérité plantée).

---

## 2. INDEX DES SECTIONS DE PRODUCTION (63–86)

*(Les sections 1–62 — conception — sont indexées par le Manuel Maître v1.0.)*

| § | Contenu | Findings |
|---|---|---|
| 63 | Solutions M3 lot 1 — le système 1 (s02–s07a) | F-15→F-18 |
| 64 | M3 lot 2 — variantes S1 + le modal (s05×2, s06a, s07b, s08×4, s09, s10) | F-19, F-20 |
| 65 | M3 lot 3 — le système 3 (s11→s16, bi-plans) | F-21, F-22 |
| 66 | M3 lot final — arches s17×3 + capstone tri-palettes s18×3 · **M3 clos (31/31)** | F-23, F-24 |
| 67 | Solutions M4 lot 1 — le laboratoire des 5 espèces (11 volets) | F-25→F-27 |
| 68 | M4 lot 2 — libre, 3 voix, imitation, fugato (6 volets) | F-28→F-30 |
| 69 | M4 lot final — les 5 contrechants d'Elena + « la scène tissée » · **M4 clos (25/25)** | F-31, F-32 |
| 70 | Solutions M6 lot 1 — le bestiaire des couches (s01→s08) | F-33→F-35 |
| 71 | M6 lot final — FX, espace, tenue, hybride + « La Remise hybride » · **M6 clos (19/19)** | F-36→F-38 |
| 72 | Solutions M7 lot 1 — les outils (s01→s05, dyn/mute) | F-39, F-40 |
| 73 | M7 lot final — crue, tutti, intime, traduction + « Elena, le cue » · **M7 clos (15/15)** | F-41, F-42 |
| 74 | Solutions M8 lot 1 — le socle du langage (s01→s08, swing compilé) | F-43→F-45 |
| 75 | M8 lot final — réharm. d'Elena, big band, distances + « le standard » · **M8 clos (22/22), portfolio 4/4** | F-46, F-47 |
| 76 | Étalons M10 — les 15 missions (checklists lintées + MIDI-témoins) · **M10 clos** | F-48, F-49 |
| 77 | **Le générateur §4.3 spécifié** + étalons M11 · **M11 clos — backlog solutions soldé** | F-50, F-51 |
| 78–85 | Le lot quiz, 9 tranches : M3 (18) · M4 (12) · M6 (15) · M7+M8 (25) · M10+M11 (23) · M1 (17) · M2 (15) · M5 (11) · M9 (4) — **148 quiz** | — |
| 86 | Spécification des assets : sonothèque M12 (~385 clips, conventions, manifestes, 3 vagues) + briefs « La Remise » vidéo et « fredon du réal » | — |

---

## 3. REGISTRE DES FINDINGS F-15 → F-51

*(F-1→F-14 : Manuel v1.0, annexe E. Chaque finding : PR moteur/format AVANT les solutions dépendantes ; fixtures créées ; `engineVer` bumpé quand indiqué.)*

### 3.1 Moteur — analyseurs et règles

| ID | Objet | Résolution |
|---|---|---|
| **F-15** | Quintes de Mozart (Ger⁶→V) | sous tag `aug6` (type allemand), la paire ♭6̂→5̂ // ♭3̂→2̂ rétrogradée en `info` dédiée ; +6 fixtures ; `engineVer`↑ |
| **F-16** | Ger⁶ ≡ subV en pitch-classes | ordre de priorité : en tonalité établie, `aug6` tagué AVANT `subV` ; alimente detectCadence (jamais « parfaite du monde d'à côté ») |
| **F-19** | Modes ≡ collection majeure (Krumhansl aveugle) | ancrage de tonique par **insistance** (bourdon ≥ 50 %, première/dernière fondamentale, appuis) AVANT corrélation ; +6 fixtures ; `engineVer`↑ |
| **F-20** | Lydien ♭7 indétectable | `detectCollection` + famille **melodic-minor** (7 rotations) ; étiquetage du mode via F-19 |
| **F-23** | L'octatonique sature le terme dissonance | **normalisation intra-pièce** (z-score) des termes de `tensionCurve` — l'arche se lit relativement à la palette ; rétro-vérification MVP verte ; `engineVer`↑ |
| **F-25** | Musica ficta refusée | fenêtre de clausule (pénultième+finale) admet ♯7̂, tag `ficta` ; hors fenêtre = erreur |
| **F-26** | Contour de la voix grave | sous le CF : contour évalué **en miroir** (extremum = le creux, 40–75 %), remontée cadentielle hors comptage |
| **F-27** | Syncope ininterrompue (sp. 4/5) | ≤ 1 rupture admise, tag `syncope-break`, gratuite en clausule |
| **F-28** | Réponse tonale refusée | `imitation.entry { answer: real|tonal }` — mutation ±1/±2 dt limitée à la zone de tête, contour/rythme conservés |
| **F-29** | Retard invisible hors espèces | `suspensionCheck` généralisé (préparation→liaison→dissonance d'appui→résolution desc.) sur toute paire de voix ; `species4` en devient un cas |
| **F-34** | Bande vs fondamentale | cohérence par **source** : sinus/sub → note hors bande = erreur ; source riche → fondamentale sous band.low légale (high-pass assumé) |
| **F-41** | Le `given` jugé avec la soumission | fenêtrage générique : contraintes et règles évaluées **hors ticks du given** (contexte seulement) ; rétroactif |
| **F-44** | swingRatio sans croches / global | ratio `n/a` sans contretemps ; `swingTarget` scopable **par part** |
| **F-45** | « Se poser » non chiffré | posée = temps fort OU ≥ noire OU quittée par saut ; passante = faible+brève+degré ; `chordScaleCheck` l'applique |
| **F-50** | Vérité plantée < musique réelle | juge ANALYSIS : correct si ∈ **vérité ∪ détection** (l'émergent crédité) ; zones `ambiguous` ⇒ « indécidable » = bonne réponse |

### 3.2 Formats, parseur, compilateur, schémas

| ID | Objet | Résolution |
|---|---|---|
| **F-21** | Tenues internes inécrivables | liaison **par note** dans les accords (`[E4~+F4]:q`) ; round-trip garanti ; +8 fixtures ; `engineVer`↑ |
| **F-33** | Solutions non-notationnelles | fichier solution : `{exerciseId, notation?, payload?, authorNotes}` — payload par kind ; M4 migré (`voices[]`) ; **PRIORITAIRE dans l'ordre des PR M6+** |
| **F-35** | Contraintes de jeu vs solutions compilées | drapeau `performanceOnly: true` (sauté par le verrou n°2) + `humanize {seed, offsetRange}` déterministe au rendu |
| **F-38** | Source de sidechain muette | `Layer.trigger: true` — hors spectre/pyramide, référençable par `sidechainedBy` ; `trigger`+`band` = erreur |
| **F-39** | Dynamique des tenues en déclaratif | `Part.dyn: [{tick, value}]` — lu par ccCoverage/ccTensionCorrelation/effectivePower ; le pont M7↔M10 |
| **F-40** | Sourdines en prose seulement | `Part.mute` (con-sord/straight/cup) — modificateurs chiffrés dans instruments.ts, PR fiche+données commune |
| **F-43** | Swing incompilable | `swing: {ratio}` au rendu de solution — décalage déterministe des croches de contretemps ; parseur reconnaît l'offset (round-trip) ; **PRIORITAIRE M8** |
| **F-47** | Marqueurs jazz en prose | `jazzMarkers.ts` — détecteur + puissance (fort/moyen/faible) par marqueur, tracé à m08-l14 |
| **F-32** | Strette mono-motif | `strette { heads[] }` — timeline fusionnée des entrées de plusieurs têtes |
| **F-17** | Reprise transposée invérifiable | `samePitchSequenceAsGiven { transposed: true }` — comparaison d'intervalles, fenêtre désignée |
| **F-18** | Pédale lue comme accord | sous `pedalPlan`, `detectChord` évalue **hors note de pédale** ; la pédale jugée par le plan (compatible/frottée/contredite) ; règle d'écriture : tout bourdon se déclare |
| **F-24** | Retombées invérifiables | `tensionPlan` : `{bars, motors[], direction: rise|fall|hold}` — corrélation de pente par moteur |

### 3.3 Amendements de specs et de donnés (famille F-8)

| ID | Spec | Amendement |
|---|---|---|
| **F-22** | m03-e16 | boussoles évaluées sur mes. 1–8 ; la fin jugée par la variante (fusion/victoire/coexistence) |
| **F-30** | m04-e11 | donné épinglé = **mes. 1–8 de s30-elena** (l'extension 9–14 réservée à m07-e10) |
| **F-31** | m04-e12 | contrepoint double ancré au début commun, chevauchement = min des longueurs |
| **F-37** | règle générale | tout `given` citant un exercice antérieur pointe **sa solution de référence** ; livraison incluse : la solution m05-e08 (extrait 8 mes.) produite |
| **F-42** | m07-e09 | `acceptedTranslations` par rôle piège — classes d'équivalence déclarées, alternatives nommées au rapport |
| **F-46** | m08-e09 | erratum : le thème d'Elena fait **14 mesures** ; règle : tout donné chiffré cite l'ID source, le chiffre se déduit |
| **F-51** | m11-e06 | la fiche de genre = **formulaire mappé** sur le registre des contraintes (~18 traits compilables) + champ libre non compilé |

### 3.4 Assets, manifestes, CI

| ID | Objet | Résolution |
|---|---|---|
| **F-36** | Timecodes contradictoires « La Remise » | **manifeste unique** `assets/la-remise/manifest.json` : ♩=96.8, B1 0'31" / B2 1'02" (barre 26) / B3 1'22" / H1 1'08" / H2 1'34" ; specs par **IDs de marqueurs** ; erratum e10 (« bascule 2 » = B2) ; règle : tout asset partagé a un manifeste |
| **F-49** | Cible du fredon inexistante | `fredon-target` au manifeste (8 mes. ré mineur + brief de fausseté : 2 octaves fausses m3/m6, segment doublé m5, tempo ±8 %) |
| **F-48** | Verrou n°2 inapplicable aux missions | verrou **polymorphe par kind** : score ≥ 85 / checkers de preuve 100 % / lint de checklist (verifyHint non vides) / concordance d'annotations |

---

## 4. DÉCISIONS NOUVELLES (ajouts au registre §6 du Manuel)

| ID | Décision | Origine |
|---|---|---|
| D-T11 | Verrou CI n°5 : auto-cohérence du générateur (détection ⊇ vérité) | §77 |
| D-T12 | Générateur §4.3 : recettes versionnées, seed déterministe — 8 recettes livrées (G-M48, G-05, G-07, G-08, G-W1…5) | §77 |
| D-P15 | La pièce-mystère m01-e48 devient une pièce **générée** (G-M48) — l'asset manuel supprimé du backlog | §77 |
| D-P16 | Tout asset partagé a un manifeste ; les specs pointent des IDs de marqueurs, jamais des timecodes bruts | F-36 |
| D-P17 | Tout `given` inter-modules pointe une solution de référence | F-37 |
| D-P18 | Tout piège de traduction déclare sa classe d'équivalence | F-42 |
| D-P19 | Tout donné chiffré cite l'ID de sa source (le chiffre se déduit) | F-46 |
| D-P20 | Sonothèque M12 : chaque clip porte un manifeste (notation jouée obligatoire), −18 LUFS de référence, contrastes préservés par paires, PR clip+fiche commune | §86 |
| D-P21 | Étalons DAW : déclaratif = checklist lintée ; PROUVÉ = MIDI-témoin fabriqué depuis les solutions existantes | §76 |

---

## 5. INVENTAIRE DES LIVRABLES DE PRODUCTION

**Solutions/étalons (191)** — par module, avec pièces maîtresses :
- M1 (27) + M2 (29) : v1.0, inchangés (F-9 : comptage définitif).
- M3 (31) : dont « Trois palettes » (s18×3, portfolio).
- M4 (25) : dont les 5 contrechants d'Elena (s11) et « la scène tissée » (s12×3, le commentaire vérifié inauguré).
- M6 (19) : dont « La Remise hybride » (s15×3) et la solution m05-e08 livrée en passant (F-37).
- M7 (15) : dont « Elena, le cue » (s10×3, 48 mes. — le rapport le plus complet du produit).
- M8 (22) : dont les trois vies harmoniques d'Elena (s09×2) et « le standard » (s15×3, portfolio 4/4).
- M10 (15 étalons) : 5 checklists, 5 guidées, 5 MIDI-témoins (dont la maquette orchestrale de « La Remise », e15).
- M11 (8 étalons) : annotations contre vérités de génération ; le vol légal étalonné.

**Quiz (148 · ~749 items)** — 12 modules à 100 %, charte 5/5, distracteurs tracés aux tables d'erreurs, ~140 items ▶/capture, intégratives systématiques (le réseau du cursus, quizzé).

**Assets** — spec complète §86 : 385 clips en 3 vagues (~22 h), conventions de nommage/manifeste normatives ; briefs AV : « La Remise » (90 s, manifeste F-36 = cahier des charges) et « fredon du réal » (30 s, F-49 = partition + brief de fausseté).

---

## 6. ORDRE DE PR GLOBAL (pour l'équipe d'implémentation)

1. **Moteur/formats fondamentaux** : F-33 (payload) → F-21 (parseur) → F-41 (fenêtrage given) → F-23 (normalisation) → F-48 (verrous polymorphes) → F-39/F-40 (schéma Part) → F-43 (swing) — chacun avec fixtures, `engineVer` par lot.
2. **Analyseurs/règles** : F-15/16/19/20/25/26/27/28/29/34/44/45/50 + registres de données (F-38, F-47, mute-modifiers F-40).
3. **Amendements de specs** (F-17/18/22/24/30/31/32/35/37/42/46/49/51) + manifestes (F-36).
4. **Seed du contenu** : solutions/étalons par module (l'ordre des sections 63→77), puis quiz (78→85).
5. **Générateur** §4.3 + recettes + verrou n°5 ; régénération du corpus M11.
6. **Assets** : vague P1 clips + 2 AV (avant beta) ; P2/P3 avant V1.
7. **CI complète verte** = le critère de fin de Phase 1.

## 7. CE QUI RESTE (exhaustif)

1. **Implémentation logicielle** (roadmap Manuel §2.7) — tout le contenu et le calibrage sont prêts à seeder.
2. **Production des assets** (~22 h clips + 2 tournages/prises AV).
3. **Beta** : calibrage des seuils sur soumissions réelles (ENDURANCE_BUDGET, tolérances draw-tension, seuils de reconstruction) — les valeurs actuelles sont les hypothèses documentées.
4. Rien d'autre. La production éditoriale du produit est close.

---

*Fin de la consolidation v1.1 — versable au repo avec le Manuel Maître v1.0. Toute production future amende ce document selon §7.4 du Manuel.*

/*
La consolidation v1.1 est produite — le document de passation qui complète le Manuel Maître v1.0 et prime sur lui en cas de conflit. Il contient : l'état global chiffré (191 solutions/étalons, 148 quiz, 51 findings, portfolio 4/4, 5 verrous CI), l'index des sections 63–86, le registre complet des findings F-15→F-51 classés en quatre familles (analyseurs/règles, formats/schémas, amendements de specs, assets/CI), les 9 décisions nouvelles à verser au registre §6, l'inventaire des livrables, et surtout l'ordre de PR global en 7 étapes pour l'équipe d'implémentation, avec la liste exhaustive de ce qui reste (implémentation, ~22 h d'assets, calibrage beta — rien d'autre).
Le projet est éditorialement clos de bout en bout. Depuis la reprise : M3→M11 solutionnés (104 solutions et étalons produits, 37 findings traités), le générateur spécifié, les 140 quiz manquants rédigés, les assets intégralement spécifiés, et les deux documents de référence (Manuel v1.0 + Consolidation v1.1) prêts à verser dans docs/ du repo.
Pour la suite, tout passe côté exécution : l'implémentation logicielle suit la roadmap et l'ordre de PR du §6, la production sonore suit le plan de la section 86 fiche par fiche. Si un jour tu veux rouvrir la conception (un genre M9 supplémentaire via la méthode m11-l06, un module 13), les deux documents suffisent comme point de reprise — c'était leur raison d'être.
*/