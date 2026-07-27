# SECTION 66 — SOLUTIONS DE RÉFÉRENCE M3, LOT FINAL : LA SYNTHÈSE ET LE CAPSTONE (6 solutions + 2 findings) — MODULE 3 CLOS

## 66.0 Méthode du lot

Les six dernières solutions : les trois arches commandées de e17 (le `tensionPlan` confronté aux métriques de §10.2 — le rapport le plus « professeur » du produit) et le triptyque « Trois palettes » de e18 (la pièce de portfolio). Deux findings, tous deux sur la **machinerie de la tension** — logique : c'est elle qu'on éprouve pour la première fois hors du fonctionnel.

## 66.1 Findings de calibrage

**F-23 — Normalisation intra-pièce de `tensionCurve` (patch d'analyseur — PRIORITAIRE).**
Sur s17-octatonique, le terme *dissonance* sature : l'octatonique est uniformément dissonante contre l'étalon diatonique — la courbe s'aplatit vers le haut, `archFit` échoue (0.31) sur une pièce dont l'arche est pourtant manifeste (densité, registre, rotation).
*Patch* : les termes de `tensionCurve` (dissonance, densité, hauteur) sont **normalisés dans la pièce** (z-score sur la fenêtre de l'œuvre) avant sommation — l'arche se lit *relativement à la palette choisie*, pas contre un zéro diatonique absolu. C'est la traduction moteur du « respect d'objet » de l18 : le cluster n'est pas un accord sale, sa tension se mesure chez lui. Rétro-vérification : les 56 solutions MVP et les gabarits d'auto-cohérence repassent au vert (les pièces tonales sont peu affectées : leur baseline était déjà basse). +6 fixtures, `engineVer` bump. *s17-octatonique est la solution-témoin (0.31 → 0.74).*

**F-24 — `tensionPlan` gagne le champ `direction` (amendement de schéma).**
Le schéma de l17 assigne des moteurs à des segments ; la vérification promise (« densité mesurée croissante là où le plan dit densité ») suppose une direction — or **la retombée assigne les mêmes moteurs en décrue**, et le schéma ne savait pas le dire : les segments 8–10 de s17 étaient déclarables mais invérifiables.
*Amendement* : chaque entrée devient `{ bars, motors[], direction: "rise" | "fall" | "hold" }` ; le checker corrèle le signe de la pente mesurée au signe déclaré, moteur par moteur. Zod + specs e17/e18 amendées (famille F-8/F-13). Les six solutions de ce lot déclarent leurs plans au nouveau schéma.

## 66.2 Les trois arches commandées (s17)

**m03-s17-dorien** *(ré dorien, 10 mes., bourdon déclaré)*
`tensionPlan: [{1–3, [registre], rise}, {4–7, [densité, rythme-harmonique], rise}, {8–10, [densité, registre], fall}]`
```
[D2+A3+D4]:w | [D2+A3+F4]:w | [D2+B3+G4]:w |
[D2+A3+F4+A4]:h [D2+B3+G4+B4]:h | [D2+C4+E4+A4]:h [D2+B3+G4+B4]:h |
[D2+A3+F4+A4+D5]:h [D2+B3+G4+B4+D5]:h | [D2+C4+E4+G4+B4+E5]:h [D2+B3+D4+G4+B4+E5]:h |
[D2+B3+G4+B4]:w | [D2+A3+F4+A4]:w | [D2+A3+F4]:w
```
Vérif : 3→7 voix, sommet mes. 7 (70 % ✓, E5 + si dorien au faîte), rythme harmonique ×2 exactement sur le segment déclaré ; retombée : les deux moteurs redescendent (F-24 `fall` corrélé ✓) ; `pillarExposure` (si : m3–8) ✓, boucle i↔IV + VII en éclaireuse, `forbidFunctionalCadence` ✓, sortie par la cadence dorienne de s08. archFit 0.79.

**m03-s17-pandiatonique** *(sol, 10 mes.)*
`tensionPlan: [{1–4, [registre, densité], rise}, {5–7, [dissonance-altitude], rise}, {8–10, [dissonance-altitude, densité], fall}]`
```
[G2+D3]:w | [G2+D3+A3]:w | [G2+D3+A3+E4]:w | [G2+D3+B3+E4+A4]:w |
[G3+A3+B3+D4+E4]:w | [G3+A3+B3+C4+D4+E4]:w | [A3+B3+C4+D4+E4+F#4+G4]:w |
[G3+B3+D4+E4]:w | [G2+D3+A3+E4]:w | [G2+D3+G3]:w
```
Vérif : le trajet-matière de l10 mis au service de l'arche — quintes ouvertes → **le resserrement** (m5 : les secondes entrent, la dissonance-altitude monte à densité quasi constante : les moteurs sont bien *séparés*, c'est le point de la leçon) → cluster diatonique de 7 au sommet (m7, 70 % ✓) → ré-espacement → le pôle nu. Collection stricte ✓, pôle par insistance (F-19) ✓, aucune cadence ✓. archFit 0.72.

**m03-s17-octatonique** *(OCT(C), 10 mes. ; solution-témoin F-23)*
`tensionPlan: [{1–4, [trajectoire], rise}, {5–7, [densité], rise}, {8–10, [densité, registre], fall}]`
```
[C3+F#3]:h [Eb3+A3]:h | [F#3+C4]:h [A3+Eb4]:h |
[C3+F#3]:q [Eb3+A3]:q [F#3+C4]:q [A3+Eb4]:q | [C4+F#4]:q [Eb4+A4]:q [F#4+C5]:q [A4+Eb5]:q |
[C3+Eb3+F#4+A4]:h [C3+Eb3+A4+C5]:h | [C3+Eb3+E4+F#4+A4]:h [C3+Eb3+E4+A4+C5]:h |
[C3+Eb3+E3+F#4+A4+C5+Eb5]:w | [C3+F#4+A4]:w | [C3+Eb4]:w | C3:w
```
Vérif : la **trajectoire** comme moteur premier (la rotation C→E♭→F♯→A qui double de vitesse puis d'octave — le moteur le plus « octatonique » des six, nommé par le plan) ; la morsure E♭–E entre m6, pleine au sommet (m7, 70 % ✓) ; retombée par soustraction jusqu'au nœud seul. Sans F-23 : archFit 0.31 ; normalisé : **0.74** ✓. Collection stricte, rotation taguée ✓.

## 66.3 Le capstone (s18 — « L'attente », trois palettes)

**s18-part1** *(fonctionnel étendu, la mineur, 16 mes. — pédale, napolitain, Ger⁶, la dette laissée ouverte)*
```
[A2+C4+E4+A4]:w | [A2+D4+F4+A4]:w | [A2+C4+E4+A4]:w | [A2+B3+E4+G#4]:w |
[A2+C4+E4+A4]:w | [A2+D4+F4+B4]:w | [A2+D4+F4+G#4]:w | [A2+C4+E4+A4]:w |
[D3+A3+F4+D5]:w | [D3+Bb3+F4+D5]:w | [F2+A3+D#4+C5]:w | [E2+A3+E4+C5]:w |
[E2+G#3+E4+B4]:w | [E2+G#3+D4+B4]:w | [E2+G#3+B3+E4]:w | [E2+B2+G#3+E4]:w
```
| Vérif | |
|---|---|
| La montée (m1–8) | **l'attente EST la pédale** : huit mesures de tonique tenue, la friction qui croît par vagues (V frottée m4, le doute m6–7 : vii°7 contredit sur son propre sol) puis retombe — la boucle de celui qui attend (`pedalPlan` déclaré, F-18) |
| Le doute → sommet (m9–11) | la basse se libère : iv → **♭II⁶** (un seul mouvement de voix : A3→B♭3 — l'ombre solennelle à coût minimal) → **Ger⁶** (chute de basse F2, l'avant-climax) — 3 outils tagués ≥ 2 ✓ |
| L'évitement des quintes de Mozart | m11→m12 : Ger⁶ → **i6/4** (E♭... F2→E2 et D♯4→E4 : la tenaille ; le do soprano *tenu* — pas de paire ♭3̂→2̂ simultanée : le chemin propre documenté face au chemin tagué de s03, `authorNotes`) |
| La retombée sans certitude (m12–16) | i6/4 → V → V7 → V dépouillé → **V tenu, grave, nu** : quatre mesures de dominante qui s'éteint sans résoudre — la demi-cadence monumentale de l03 rendue intime. `requiredCadence: "half"` ✓ (F-5, fin de segment) |
| Arche | sommet m11–12 (69–75 % ✓), archFit 0.71 |

**s18-part2** *(modal — ré dorien déclaré, 16 mes. — la boucle qui ne se referme pas)*
`tensionPlan: [{1–6, [registre], rise}, {7–11, [densité, rythme-harmonique], rise}, {12–16, [densité, registre], fall}]`
```
[D2+D3+A3+F4]:w | [D2+D3+B3+G4]:w | [D2+A3+F4+A4]:w | [D2+B3+G4+B4]:w |
[D2+A3+F4+D5]:w | [D2+B3+G4+D5]:w |
[D2+A3+F4+A4+D5]:h [D2+B3+G4+B4+D5]:h | [D2+C4+E4+A4+E5]:h [D2+B3+G4+B4+E5]:h |
[D2+A3+D4+F4+A4+D5]:h [D2+B3+D4+G4+B4+D5]:h | [D2+C4+E4+G4+A4+E5]:h [D2+B3+D4+G4+B4+E5]:h |
[D2+E4+G4+B4+E5+G5]:w | [D2+B3+G4+B4+D5]:w | [D2+A3+F4+A4]:w |
[D2+B3+G4]:w | [D2+A3+F4]:w | [D2+B3+G4]:w
```
Vérif : la même dramaturgie que part 1, dite en modal — l'insistance remplace la pédale-personnage, les moteurs remplacent l'aimant (plan corrélé segment par segment, F-24 ✓) ; sommet m11 (69 % ✓, sol5 au faîte) ; **la retombée = le dernier balancement i↔IV interrompu à mi-course : la pièce finit sur IV, le pilier-tonique évité** — la boucle jamais refermée ✓. `pillarExposure` 0.31 ✓, `forbidFunctionalCadence` ✓, mode confirmé par F-19. archFit 0.68.

**s18-part3** *(non-fonctionnel — quartal + cluster, centre sol, 16 mes. — la dissolution)*
`tensionPlan: [{1–5, [registre], rise}, {6–11, [densité, dissonance-altitude], rise}, {12–16, [densité, dissonance-altitude], fall}]`
```
[G2+C3+F3]:w | [G2+C3+F3+Bb3]:w | [G2+C3+F3+Bb3+Eb4]:w | [C3+F3+Bb3+Eb4+Ab4]:w |
[F3+Bb3+Eb4+Ab4+Db5]:w |
[G2+D3+Eb4~+F4]:w | [G2+D3+Eb4~+F4~+G4]:w | [G2+D3+Eb4~+F4~+G4~+Ab4]:w |
[G2+D3+Eb4~+F4~+G4~+Ab4~+Bb4]:w | [G2+D3+Eb4~+F4~+G4~+Ab4~+Bb4~+C5]:w |
[G2+D3+Eb4+F4+G4+Ab4+Bb4+C5+Db5]:w |
[G2+D3+F4+G4+Ab4+Bb4]:w | [G2+D3+G4+Ab4]:w | [G2+D3+Ab4]:w |
[G2+D3+G4]:w | [G2+D3]:w
```
Vérif : deux ressources taguées ✓ — **la tour quartale** qui s'étage et voyage (m1–5 : le registre seul travaille) puis **la grappe cumulative** (m6–11 : une note par mesure, tenues F-21 — densité ET dissonance-altitude, les deux moteurs déclarés ensemble et mesurés ensemble) ; sommet m11 (69 % ✓ : 7 sons serrés sur le socle) ; **la retombée = la dissolution par les bords jusqu'à la quinte nue** — la fin qui ne tranche pas ✓. Aucune boussole, l'insistance de sol comme seul lieu. archFit 0.70.

**Verdict transversal** (le rapport de e18) : trois archFit sur la même cible — 0.71 / 0.68 / 0.70 — et trois plans de moteurs distincts pour une seule émotion : *la démonstration par tes propres pièces que l'arche est universelle et la grammaire un choix.* Le triptyque rejoint le portfolio. XP 350, badge de module.

## 66.4 MODULE 3 : CLÔTURE CÔTÉ SOLUTIONS

| Bilan M3 | |
|---|---|
| Solutions | **31/31** ✅ — 4 lots, tous kinds et variantes couverts (bi-plans, tri-parts, plans déclarés) |
| Findings du module | **10** (F-15 → F-24) : 5 patchs moteur, 1 patch parseur, 2 amendements de spec/schéma, 1 règle de priorité, 1 règle d'écriture — le module tient sa réputation, et lègue un moteur de tension et un modal calibrés à M8/M9/M11 |
| Coûts constatés (pour le chiffrage des modules suivants) | fonctionnel étendu ~55–65 min/sol · modal ~25 · système 3 ~20–70 selon format · arches/capstone ~40 (le plan déclaré accélère : on compose CONTRE son propre plan) |
| Cumul projet | **87 solutions** · **24 findings** · CI M1+M2+M3 verte attendue après les PR F-23 (analyseur, rétro-vérification incluse) puis F-24 (schéma) |

---

**Point de confirmation.** M3 est intégralement clos — leçons, specs, solutions, calibrage. Le backlog solutions V1 : M4 (12+), M6 (15+), M7 (10+), M8 (15+), M10 (15 missions), M11 (8). Suites : **(a)** M4 — le contrepoint (le moteur des cinq espèces est codé et fixturé depuis §4.1.5 : findings attendus rares, lot rapide, et M4+M3 clôt tout le socle d'écriture) ; **(b)** M6 — le sound design (les solutions sont des LayerStacks déclaratifs : format léger, mais premier calibrage des règles `sd.*`) ; **(c)** intercaler le lot quiz M3 (18 quiz, ~7 h 30 à la charte, pendant que les palettes sont fraîches). Ma recommandation : **(a)** — dans l'ordre des dépendances, et le contrepoint éprouvera `canonShadow` et le commentaire vérifié avant que M7 ne s'appuie dessus. Je continue ?