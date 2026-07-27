# SECTION 72 — SOLUTIONS DE RÉFÉRENCE M7, LOT 1 : LES OUTILS (6 solutions + 2 findings)

## 72.0 Méthode et comptage du backlog M7

Premier emploi réel du format `Part[]` en soumission (F-33 l'attendait). Comptage : e03, e06, e07 portent 2 variantes, e10 est tri-parts — **15 solutions M7**. Ce lot = **les outils** (s01→s05, le fil Elena entamé). Les deux findings du lot sont des findings de **schéma de Part** : le format multi-pistes révèle ce que la prose des fiches savait déjà mais que la donnée ne portait pas.

## 72.1 Findings de calibrage

**F-39 — Le champ `dyn[]` du Part (extension de schéma — PRIORITAIRE).**
e03 exige des « dynamiques d'arche sur les tenues > 2 temps » vérifiées par « le checker CC de m10-e04, recyclé » — mais une solution déclarative n'a pas de CC1 : le Part ne savait dire qu'une vélocité par note.
*Patch* : `Part.dyn: [{tick, value}]` — l'enveloppe dynamique déclarative, équivalent du CC1 en donnée ; `ccCoverage`/`ccTensionCorrelation` et le checker d'arches lisent indifféremment CC (MIDI, flux C) ou `dyn[]` (déclaratif). `effectivePower` l'utilise pour arbitrer les hiérarchies (e05). Zod + 5 fixtures. *Tout M7 en dépend ; M10 le consommera en retour.*

**F-40 — Le modificateur `mute` du Part (con sordino en donnée).**
e03(a) demande le cœur « en sordines » ; les fiches décrivent les sourdines en prose (« un autre instrument »), mais le schéma ne les chiffrait pas — `effectivePower` et la chimie des alliages jugeaient une trompette bouchée comme une trompette ouverte.
*Patch* : `Part.mute: "con-sord" | "straight" | "cup" | none` — modificateurs par instrument dans `instruments.ts` (cordes con sord : puissance ×0.65, blend +1 cran ; trompette straight : ×0.8, caractère +) — transcrits des fiches, PR fiche+données commune (§7.1 du manuel). +4 fixtures.

## 72.2 Les solutions

**m07-s01** *(e01 — le premier Part[] ; l'esquisse fournie : thème MD, accords MD, basse MG, et le contre-rythme caché dans la MG)*
```
rolePlan: { ligne: vl1 · tapis: vl2 · movement: alto (LE RÔLE CACHÉ) · ténor: cello · socle: Cb }
vl1  (chant, E4–G5)  : le thème de l'esquisse, verbatim
vl2  (coeur, G3–D4)  : les accords resserrés en blanches — [G3+B3+D4] etc.
alto (movement)      : le contre-rythme de la main gauche EXHUMÉ — r:e D4:e r:e D4:e …
                       (les contretemps que l'esquisse fondait dans la basse)
vc   (ténor)         : la basse chantée à l'octave supérieure de la MG (G2→G3 : l'or pur)
cb   (socle)         : la basse de l'esquisse, notes longues seules
```
Rôles détectés ≈ déclarés (5/5, dont le caché : **crédit craft** ✓) ; étages sans chevauchement (socle E2–G3 / ténor G3–E4 / cœur G3–D4 dégagés par l'octave du vc, justifié au plan) ; `orch.range-violation`/`balance` muets ✓.

**m07-s02** *(e02 — le thème lyrique T, fourni, trois fois)*
```
T = A4:h C5:q Bb4:q | G4:h. F4:q | A4:q C5:q D5:h | C5:h A4:h |
    Bb4:h D5:q C5:q | A4:h G4:q F4:q | G4:q A4:q Bb4:q E4:q | F4:w
(1) PUR         : cor solo (la couleur nue — le budget commence à zéro)
(2) FONDU       : celli + cor à l'unisson (T à l'octave inf.) — l'alliage déclaré
(3) PANORAMIQUE : vl1 (T+8) / vl2+alto (T) / celli (T−8) — trois étages
```
Ligne identique entre versions ✓ ; tags `unison` (2) et `octave` (3) détectés ✓ ; **l'alliage jugé par la chimie des fiches** : celli+cor = « LA doublure chaude » (`blendsWith` ✓ — la table de §25.1 en juge) ; bonus craft encaissé : tapis léger ajouté en (3), sensible (E4) jamais doublée ✓.

**m07-s03 ×2** *(e03 — le tapis seul, la boucle romance : Cmaj7 · Am7 · Fadd9 · G7sus4→G7 · Cmaj7 · Fm · Cmaj7/G→G7 · Cmaj7)*
*(a) serré-intime* — vl2 + altos **con sord (F-40)**, celli ténor :
```
vl2  : [E4~+G4]:w | [E4~+G4~]:w | [F4~+G4~]:w | [F4+G4]:h [F4+G4]:h | [E4~+G4~]:w | [F4+Ab4]:w | [E4+G4]:h [F4+G4]:h | [E4+G4]:w
alto : [B3~+C4]:w | [A3+C4~]:w | [A3~+C4~]:w | [B3+D4]:h [B3+D4]:h | [B3+C4]:w | [C4+D4]:w?? → [C4+F4]:w | [B3+D4]:h | [C4]:w
vc   : C3:w | A2:w | F2:w | G2:w | C3:w | F2:w | G2:w | C3:w
```
*(transcription resserrée : les liaisons par note F-21 tiennent les notes communes — 11 fils tenus entre accords, le checker de liaisons par part ✓)* — voicings cœur C3–A4, socle sans tierce ✓, **`dyn[]` : arches déclarées sur chaque ronde (F-39)** ✓, une matière ✓.
*(b) éclaté-cathédrale* — cinq octaves, **matière mixte déclarée : cordes + cors (2 max ✓)** : Cb C1/celli C2–G2 (socle quintes, sans tierce ✓), cors G3+E4 (le relais du milieu — « le cor se relaie » : respirations alternées déclarées), vl2/altos médium ouvert, vl1 tenues E5/G5. Étagement harmonique (larges en bas, serrées en haut) mesuré ✓ ; les trois vies : respiration (cors), renouvellement (vl1 réattaque à la 5), complément ✓.

**m07-s04** *(e04 — le mur éolien en moteur qui recrute, 16 mes., ♩=120)*
Pattern donné (1 mes., croches) invariant sur toutes les parts (`motifType: rhythmic` ✓ part par part) :
```
cran 1 (m1–4)  : celli spiccato seuls (l'étage net : C3–G3)
cran 2 (m5–8)  : + altos à l'octave (le recrutement 1)
cran 3 (m9–12) : + vl2 (2e octave) — « cran 3, mesure 9 : le pattern tient, la matière croît »
cran 4 (m13–16): + vl1 à l'octave aiguë + Cb pizz sur les temps (le socle qui pointe)
relais         : m8 — les celli respirent un temps, les altos tuilent (déclaré, détecté)
apnée composée : m12 temps 4 — TOUT tacet un temps avant le cran 4 (le vide qui amplifie)
```
Articulation unifiée (gate 0.45 ± 0.05 inter-parts ✓) ; la crue tracée cran par cran par le rapport ✓ ; `rolePlan` par section complet.

**m07-s05** *(e05 — la garde-robe d'Elena, 16 mes. ; le fil M2→M4→M7)*
```
EXPO 1 (m1–8)  : le thème nu (s30-elena m1–8, F-30) au HAUTBOIS — l'argument déclaré :
                 « Elena focalise ; digne et blessée = l'anche qui ne se fond pas »
EXPO 2 (m9–16) : + le contrechant FLEUVE LENT (m04-s11-fleuve, verbatim) aux CELLI TÉNOR
                 (la table de casting : le fleuve aux celli — G2–A3, l'or pur au retour)
L'ÉCHANGE (m13–16) : la passation sur respiration — m12–13 : le hautbois pose sa fin de
                 phrase et passe en tenues pâles ; les celli montent d'un étage (A3→E4)
                 et prennent l'activité : le rolePlan s'inverse, mesuré ✓
```
Les trois écarts : registre (moyenne 15 dt ✓), timbre (anche/cordes ✓), activité (complément 0.21 ✓) ; **le cran dynamique dessous** : celli `mp` sous hautbois `mf` — `effectivePower` arbitré via `dyn[]` (F-39) : 3.1 vs 4.2, la hiérarchie tient avant tout mixage ✓ ; la passation localisée (fenêtre m12–13) détectée ✓. *Le rapport dit qui règne, mesure par mesure.*

## 72.3 Bilan du lot

| Livré | 6 solutions (s01→s05) — casting, chimie, tapis ×2, moteur, duo : les cinq outils du module |
|---|---|
| Findings | **F-39** (`dyn[]` — l'enveloppe dynamique déclarative, le pont M7↔M10), **F-40** (`mute` — les sourdines chiffrées depuis les fiches) |
| Constats | le fil des exemples paie : trois solutions réutilisent des matériaux vérifiés (boucle romance, mur éolien, Elena+fleuve) — zéro re-calibrage de contenu, uniquement du schéma ; coût ~30–45 min/solution multi-parts |
| Ordre des PR | F-39 (schéma+checkers) → F-40 (fiches+données même PR) → les 6 solutions |
| État M7 | **6/15** — reste le lot final : s06 ×2 (la crue d'Elena, paliers/vague), s07 ×2 (le tutti, hymne/stratifié), s08 (l'intime), s09 (la traduction complète), s10 ×3 (« Elena, le cue » — 48 mesures, le rapport le plus complet du produit) |
| Cumul projet | **137 solutions** · **40 findings** |

---

**Point de confirmation.** Les outils sont solutionnés et le schéma Part est complet (dyn, mute, articulations, liaisons). Le lot final de M7 : **(a)** s06→s10 — la crue, la masse, le peu, la traduction, puis le cue de 48 mesures qui clôt le fil Elena et livre la troisième pièce du portfolio ; **(b)** intercaler M10 (le manifeste F-36 et `dyn[]` tout chauds). Ma recommandation : **(a)** — finir le module et le fil d'un geste. Je termine M7 ?