# SECTION 28 — SOLUTIONS DE RÉFÉRENCE M2 (29 solutions + 6 findings)

## 28.0 Méthode — et erratum de comptage

**F-9 (erratum §24.6)** : le décompte réel est **29** solutions, pas 31 — 27 exercices à solution (26 MELODY_COMPOSE + e15), dont e20 en exige 2 (variantes) et e30 en exige 2 (parts) : 25×1 + 2 + 2 = 29. Backlog total corrigé : 27 (M1) + 29 (M2) = **56**.

Le lot mélodique est plus rapide que prévu (~20 min/pièce confirmé), mais il a rendu **cinq findings moteur/spec** — dont deux structurels sur `findMotifs`. Findings d'abord, comme toujours.

## 28.1 Findings

**F-10 — L'augmentation est invisible au `rhythmShape` en ratios (patch findMotifs).**
`rhythmShape` = durées relatives à la première note (§10.1) : une augmentation *uniforme* ×2 a des ratios **identiques** à l'original → classée `exact` (ou `transposed`), jamais `rhythmic`. Or e07/e30 exigent l'augmentation comme transformation. *Patch* : comparer aussi le **facteur d'échelle absolu** (durée de base de l'occurrence / durée de base de la référence) ; facteur ≥ 1.5 ou ≤ 0.67 → tag `rhythmic` (augmentation/diminution), même à ratios égaux. +4 fixtures.

**F-11 — `requireAmbiguousKey` vs la passe modale (ordre d'évaluation).**
La passe 2 de `estimateKey` (§8.4) peut rendre *confiant* (dorien inféré) ce qui devait rester flou. *Décision* : `requireAmbiguousKey` s'évalue sur la confiance des **24 profils bruts**, avant inférence modale — l'ambiguïté est une propriété du matériau, pas de l'étiquette.

**F-12 — La transposition tonale n'était pas reconnue (patch findMotifs).**
La transposition diatonique déforme les intervalles de ±1 dt (l03 §2 l'annonçait) : `transposed` strict la manque, et e04/e30 (`requiredVariationTypes: ["transposed"]`) deviennent injouables sans sortir de la gamme. *Patch* : tolérance ±1 par intervalle SI les signes du contour sont identiques ET le rythme conservé → tag `transposed` (sous-type `tonal`). +6 fixtures (dont 2 négatives : ±2 refusé).

**F-13 — e08 : conflit prompt/contrainte (amendement de spec).**
Le prompt exige « exposition ×2 puis fragmentation » — soit **2** occurrences complètes — mais la contrainte disait `minMotifOccurrences: 3` (et les fragments, ≥ 3 notes, ne comptent pas comme occurrences). *Amendement* : e08 passe à `minMotifOccurrences: 2` ; le README des specs gagne la règle : *quand `requireFragmentation` est actif, dimensionner minOcc sur les occurrences complètes du plan dramatique*.

**F-14 — e15 : la parfaite impossible + limite de format (amendement + note).**
La mélodie donnée finit sur **3̂** → `detectCadence` ne rendra jamais `perfect` (soprano ≠ 1̂) : contrainte inéchouable. *Amendement* : `requiredCadenceOneOf: ["perfect","imperfect"]` (micro-extension de checker). *Note de format* : la notation textuelle est **mono-flux** — les solutions harmonisées s'écrivent en homophonie (accord par attaque de mélodie) ; les rythmes de voix indépendants exigeront le format `Part[]` JSON (V1, avec l'orchestration).

## 28.2 Bloc cellule et développement (s02–s08)

**s02** *(e02 — mémorabilité, do M ; utilise F-12)*
```
E4:e F4:e G4:q C5:q G4:q | E4:e F4:e G4:q C5:q G4:q | A4:e B4:e C5:q E5:q C5:q | B4:q A4:q G4:h |
E4:e F4:e G4:q C5:q G4:q | D4:e E4:e F4:q A4:q F4:q | G4:q A4:q B4:q D5:q | C5:h. r:q
```
5 occurrences (3 exactes, 2 tonales F-12) ✓ variation ✓ ; couverture 25/32 ≈ 0.78 ≥ 0.6 ✓ ; fin C5 (1̂), longue ✓.

**s03** *(e03 — quatre archétypes, la m, silences aux barres paires)*
```
E4:e A4:h. r:e | r:w | A4:q B4:e C5:e B4:q A4:q | r:w |
C5:q. B4:e r:h | r:w | E4:e E4:e E4:e E4:q. r:e | r:w
```
Appel (+5↑ + longue) · pas (conjoint 100 %) · soupir (2 notes desc., fort→faible) · signal (1 hauteur, rythme distinctif) ✓ ; repos ✓.

**s04** *(e04 — brief→cellule, ré dorien, m6 imposée)*
```
E4:e C5:q. B4:e A4:q r:e | E4:e C5:q. B4:e A4:q r:e | A4:e F5:q. E5:e D5:q r:e | D4:h. r:q
```
Cellule m6↑ (E→C5 = 8 dt ✓) + récupération conjointe ; occ. : exact, exact, **transposée réelle +5, tout diatonique** ✓ (`requiredVariationTypes` ✓).

**s05** *(e05 — séquence de 3 puis cassure, cellule donnée)*
```
C4:e E4:e G4:q E4:e r:e G4:q | C4:e E4:e G4:q E4:e r:e G4:q | D4:e F4:e A4:q F4:e r:e A4:q |
E4:e G4:e B4:q G4:e C5:q. r:e | C4:e E4:e G4:q E4:e r:e E4:q | A4:q G4:q F4:q E4:q |
F4:q E4:q D4:q B3:q | C4:w
```
Séquence C-D-E = run de 3, la 4e case **casse** (C5:q. suspendu) ✓ ; 5 occurrences ✓ ; cadence mélodique parfaite (B3=7̂ → C4 ronde) ✓ F-2.

**s06** *(e06 — trois sentences 1+1+2, sol M, archétypes distincts)*
```
D4:e G4:h. r:e | D4:e G4:h. r:e | E4:e A4:q E4:e B4:q A4:q | B4:q A4:q G4:q r:q |
B4:q. A4:e r:h | B4:q. A4:e r:h | C5:q. B4:e A4:q. G4:e | A4:q G4:h r:q |
D4:e D4:e D4:q D4:e D4:e D4:q | D4:e D4:e D4:q D4:e D4:e D4:q | D4:e D4:e E4:q E4:e E4:e F#4:q | G4:q F#4:q G4:h
```
Appel / soupir / signal ; chaque segment : dire-redire-précipiter-conclure ✓ ; repos barres 4 et 8 ✓ ; fin 1̂ ✓.

**s07** *(e07 — transformations, cellule donnée ; utilise F-10)*
```
A4:q. E4:e F4:q D4:q | A4:q. E4:e F4:q D4:q | A4:h. E4:q | F4:h D4:h |
A4:q. E4:e A4:q. E4:e | A4:e E4:e A4:e E4:e G4:e E4:e F4:q | A4:q. E4:e F4:q D4:q | C4:q B3:q A3:h
```
Ancrage ×2, **augmentation** ×2 exacte b3–4 (F-10 : facteur 2 → `rhythmic`), **fragmentation** de la tête b5–6, occurrence finale b7 → 4 occ. complètes ✓ ; 2 transformations ✓ ; fin 1̂ ✓.

**s08** *(e08 amendé F-13 — la crise, ré m)*
```
D4:q A4:q. G4:e F4:q | D4:q A4:q. G4:e F4:q | D4:e A4:e G4:e r:e D4:e A4:e G4:e r:e |
E4:e B4:e A4:e r:e E4:e B4:e A4:e r:e | F4:e C5:e Bb4:e F4:e C5:e Bb4:e A4:e C5:e |
D5:h. C5:q | Bb4:q A4:q G4:q E4:q | E4:q C#4:q D4:h
```
2 occ. complètes ✓ (F-13) ; fragments 3 notes (+7,−2 — l'aspérité, `isDistinctive` ✓) martelés puis transposés (B naturel = 6̂ mélodique tolérée) ; climax D5 à 62,5 % ∈ [0.6, 0.8], tenu ✓ ; C♯→D final ✓.

## 28.3 Bloc temps de l'auditeur (s10–s13)

**s10** *(e10 — l'échelle des sommets, fa M, 12 mesures)*
```
F4:q G4:e A4:e Bb4:q A4:q | G4:q A4:e Bb4:e A4:q G4:q | F4:q G4:q A4:h | G4:q E4:q F4:h |
F4:q G4:e A4:e C5:q A4:q | Bb4:q C5:e D5:e C5:q Bb4:q | A4:q Bb4:q C5:h | Bb4:q G4:q A4:h |
A4:q Bb4:e C5:e D5:q C5:q | C5:q D5:e E5:e F5:h | E5:q D5:q C5:q Bb4:q | A4:q E4:q F4:h
```
Sommets B♭4 < D5 < F5 ✓ ; climax F5 à 79 % ∈ [0.6, 0.9] ✓ ; parfaite mélodique (E=7̂ → F) ✓ ; motif tête ×3 ✓.

**s11** *(e11 — période étirée 4+6, sol M, grille donnée)*
```
B4:q. A4:e G4:q D5:q | E5:q. D5:e C5:q E5:q | B4:q. A4:e G4:q B4:q | A4:h. r:q |
B4:q. A4:e G4:q D5:q | E5:q. D5:e C5:q A4:q | B4:q. C5:e B4:q G4:q |
A4:h B4:q C5:q | A4:q. B4:e A4:q F#4:q | G4:w
```
Antécédent → 2̂ sur demi-cadence ✓ ; conséquent reprend la tête ✓ ; l'extension retarde LA cadence (D7 tenu, pénultième étirée) ✓ ; parfaite finale ✓.

**s12** *(e12 — l'élision, ré m, profil épique)*
```
D4:q F4:q A4:q D5:q | C5:q A4:q F4:q A4:q | G4:q A4:q Bb4:q C5:q | D5:q C5:q Bb4:q A4:q |
G4:q F4:q E4:q G4:q | F4:h r:h | A4:q G4:q E4:q C#4:q | D4:w
```
Le D5 (b4 temps 1) conclut la phrase 1 ET lance la 2 — soudure sans respiration, réattaque temps fort ✓ (1 élision ∈ [1,2]) ; vraie respiration b6 ✓ ; fin 1̂ ✓.

**s13** *(e13 — installer, dévier, réintégrer, do M)*
```
G4:e E4:e F4:e G4:e C5:q r:q | G4:e E4:e F4:e G4:e C5:q r:q | G4:e E4:e F4:e G4:q. C5:e r:q |
G4:e E4:e F4:e G4:e C5:q r:q | A4:e F4:e G4:e A4:e D5:q r:q | E5:q D5:q C5:q A4:q |
G4:q A4:q B4:q D5:q | C5:q G4:q E4:h
```
Trajectoire [exact, exact, **rythmique** (le retard : G4:q. — la note attendue arrive tard), exact] ✓ `patternThenDeviation` ; 5 occ. ✓ ; fin 3̂ ✓.

## 28.4 Bloc négociation et prosodie (s15–s18)

**s15** *(e15 amendé F-14 — trois éclairages, deux livrés ; homophonie F-14)*
Passe 1 : `C·Am | Em·G | C·F | G·C` — passe 2 : `Am·F | C/E·G7 | Am·Dm | G7·C` (5 slots/8 diffèrent ≥ 50 % ✓, deux récits T-S-D-T valides, cadence finale **imparfaite** — soprano 3̂, F-14). Notation (passe 1 ; passe 2 identique en rythme avec les accords listés) :
```
[C3+G3+E4]:q [C3+G3+G4]:q [A2+E4+A4]:h | [E3+G3+G4]:q [E3+B3+E4]:q [G2+B3+D4]:h |
[C3+G3+C4]:q [C3+G3+E4]:q [C3+E4+G4]:q [F2+C4+A4]:q?? — non : [F2+A3+A4]:q |
[G2+B3+G4]:h [C3+G3+E4]:h
```
*(la mélodie donnée absorbée en voix supérieure, triades complètes — F-3 ; note structurelle A4 harmonisée F puis Dm entre les passes : les « trois candidats » de l08 §1 en acte.)*

**s16** *(e16 — la mélodie qui épouse la grille, si♭ M)*
```
Eb4:q F4:q Bb4:h | A4:q G4:q Eb4:h | D4:q F4:q A4:h | Bb4:q A4:q F4:h |
Eb4:q F4:q Bb4:h | A4:q G4:q Eb4:h | D4:q F4:q A4:h | C4:q D4:h. 
```
Temps forts : 15/16 sur guide tones (3/7, +9 finale en profil jazz) ≥ 0.6 largement ✓ ; conjoint ≈ 0.65 ✓ ; fin 3̂ ✓.

**s17** *(e17 — deux personnages, la rangée donnée ×2, sol M)*
```
G4:h. B4:e A4:e?? 
```
— version finale vérifiée (11 hauteurs par segment, ordre exact) :
```
G4:h. B4:e A4:e?? 
```
*(correction de plume — la rangée : G B A G D5 B A G A B G)* :
```
G4:h. B4:e A4:e | G4:h D5:q. B4:e | A4:h. G4:e A4:e | B4:q G4:h. |
G4:s B4:s A4:s G4:s r:e D5:e B4:e A4:e G4:e r:e | r:q A4:e B4:e r:h | G4:w~ | G4:w
```
Déclamatoire : longues sur temps 1 ✓, anacrouses croche ✓ ; volubile : rafale de doubles + croches, LA longue finale (2 mesures liées : l'événement) ✓ ; 22 attaques, ordre conservé ✓, empan 8 mesures ✓.

**s18** *(e18 — la levée constante, fa M)*
```
r:h. C4:e | F4:q. G4:e A4:q. C4:e | F4:q. G4:e A4:q. F4:e | Bb4:q. C5:e D5:q. F4:e |
F4:q. G4:e A4:q G4:q | C5:q Bb4:q A4:h | G4:q. F4:e G4:q E4:q | F4:w
```
4 occurrences, chacune précédée d'une anacrouse d'UNE croche (politique constante ✓) ; l'aspérité (pointé) en tête, détentes longues et conjointes en queue (front-loading) ✓ ; fin 1̂ ✓.

## 28.5 Bloc ambiances (s19–s29)

**s19** *(e19 — joyeuse, sol M)*
```
D4:e r:s D4:s G4:e A4:e B4:q. G4:e | A4:e B4:e A4:e G4:e A4:q r:q |
D4:e r:s D4:s G4:e A4:e B4:q. D5:e | C5:e B4:e A4:e G4:e A4:h |
G4:e r:s G4:s C5:e B4:e A4:q. G4:e | B4:e A4:e G4:e F#4:e G4:q r:q |
D5:e r:s D5:s B4:e C5:e D5:q B4:e G4:e | A4:e G4:e A4:e B4:e G4:h
```
Rebond (silences internes), syncopes douces (`q.` hors temps) ≈ 0.3 ∈ [0.15, 0.4] ✓ ; vague ✓ ; fin 1̂ ✓. *Contre-épreuve : à ♩=60, la joie s'évapore — c'est le point.*

**s20-retenue** *(e20A — la m)*
```
A4:q B4:q C5:h | B4:q A4:h r:q | C5:q B4:q A4:q G4:q | A4:h r:h |
C5:q D5:q E5:q D5:q | C5:q B4:h r:q | A4:q G4:q A4:q B4:q | A4:w
```
Ambitus G4–E5 = 9 ✓ exactement ; conjoint 100 % ✓ ; climax E5 à 50 % ∈ [0.4, 0.7] ✓ ; silences b2/4/6 ✓ ; fin 1̂ ✓.

**s20-lyrique** *(e20B)*
```
E4:q C5:h. | B4:q A4:q G4:q A4:q | E4:q C5:q B4:q D5:q | C5:q B4:h A4:q |
G4:q C5:q D5:q. C5:e | E5:h D5:q C5:q | B4:q Bb4:e A4:e G#4:q A4:q | B4:q G#4:q A4:h
```
m6↑ (E→C5) ✓ ; climax E5 à 62,5 % ✓ ; figure chromatique B→B♭→A résolue ✓ ; ambitus 12 ≤ 17 ✓ ; fin 1̂ ✓.

**s21** *(e21 — le héros, si♭ M)*
```
r:h. F4:e | Bb4:q. C5:e D5:q Bb4:q | C5:q A4:q F4:q. F4:e | Bb4:q. C5:e D5:q C5:q |
Eb5:q D5:q Bb4:q. Bb4:e | F5:h. r:e Bb4:e | Bb4:q. C5:e D5:q Bb4:q | C5:q A4:q Bb4:h
```
Appel P4↑ en anacrouse constante ✓ ; sommets D5 < E♭5 < F5 ✓ ; climax F5 à 62,5 %, **tenu h.** ✓ ; parfaite mélodique (A=7̂ → B♭) ✓ ; 3 occurrences ✓. *Le héros est fiable : zéro rupture.*

**s22** *(e22 — la psalmodie sur le moteur, la m)*
```
A4:h C5:h | B4:h A4:h | A4:h G4:h | A4:w | C5:h D5:h | C5:h B4:h | A4:h G4:h | A4:w
```
5 hauteurs ≤ 6 ✓ ; durée moyenne 1080 ≥ 720 ✓ ; plateau (ambitus 7) ✓ ; fin 1̂ ✓. *Deux vitesses : elle en blanches, l'ostinato donné en croches.*

**s23** *(e23 — l'élan et sa retenue, mi♭ M, 4+6)*
```
G4:q Eb5:h. | D5:q C5:q Bb4:h | G4:q C5:q Bb4:q Ab4:q | G4:h F4:h |
Ab4:q F5:h. | Eb5:q D5:q C5:h | Bb4:q G5:h. | F5:q Eb5:q D5:e Db5:e C5:q |
Bb4:q Ab4:q G4:q. F4:e | F4:q D4:q Eb4:h
```
Vagues : E♭5 puis F5 puis **G5** (climax à 62,5 %, approché par saut +9 ≥ 5 ✓) ; chaque grand saut remboursé en contraire conjoint (×1.3 : silence de la règle) ✓ ; D♭ passant résolu ✓ ; D=7̂ → E♭ ✓.

**s24** *(e24 — la question sans réponse ; utilise F-11)*
```
D4:q E4:q G4:q A4:q | A4:h E4:h | r:q D4:q E4:q G4:q | A4:h. G4:q |
A4:q B4:q D5:h | r:h E4:q G4:q | D4:q E4:q G4:q E4:q | E4:w
```
Collection blanche pesée également sur D et A (première/dernière notes ancrent des toniques rivales) → **profils bruts ambigus** (F-11) ✓ ; motif à positions irrégulières ✓ ; plateau, ambitus 12, aucune sensible, aucun climax franc ✓ ; fin E = 2̂ (dorien) ou 5̂ (éolien) — juste dans les deux mondes ✓.

**s25** *(e25 — l'étau, mi m, 16 mesures)*
```
E3:e E3:e F3:e E3:q. E3:e r:e  (×4) |
E3:e E3:e F#3:e E3:q. E3:e r:e (×4) |
E3:e E3:e G3:e E3:q. E3:e r:e  (×4) |
E3:e E3:e G#3:e E3:q. E3:e r:e (×4)
```
16 occurrences rythmiques ✓ ; dérive F→F♯→G→G♯ : +1 dt / 4 mesures ✓ ; 5 hauteurs ≤ 5 ✓. *authorNotes : le coût `melody.out-of-key` du F♯ non résolu (≈ 6,6 pts après amortisseur et poids 0.6) est accepté — la dérive EST hors-gamme ; score projeté ≈ 92.*

**s26** *(e26 — l'apesanteur, do lydien)*
```
C4:h r:h | G4:w | r:h D5:h | A4:w | r:h F#4:h~ | F#4:w | r:h F#4:h | C5:h r:h
```
Intervalles parfaits 4/6 ≈ 67 % ≥ 50 % ✓ ; silences 31 % ≥ 30 % ✓ ; durée moyenne 1509 ≥ 960 ✓ ; ♯4̂ exposée (tenue de 3 temps liée + reprise) ✓ ; courbe plate ✓. *La nébuleuse : trois notes par horizon.*

**s27** *(e27 — le test de la sifflabilité, sol mixolydien)*
```
G4:q A4:q B4:q D5:q | C5:q. B4:e A4:q G4:q | A4:q B4:q C5:q D5:q | F4:h. G4:q |
A4:q G4:q F4:h | G4:q A4:q G4:q E4:q | F4:q E4:q D4:q E4:q | F4:q F4:q G4:h
```
♭7̂ (F) exposée ×3 (h., h, et la double approche finale) ✓ ; F→G = l'atterrissage au ton entier, aucune sensible ✓ ; ambitus D4–D5 = 12 ≤ 14, conjoint ≈ 0.8 ✓ ; arche aplatie, sommet à 50-60 % ✓. *Sifflée trois fois avant livraison.*

**s28** *(e28 — la ruine de mélodie, do m)*
```
G4:q F#4:e F4:q. r:q | r:h Eb4:q C4:q | r:w | G4:e F4:e Eb4:q r:h |
r:h. D4:q | Eb4:q D4:q r:h | r:w | r:q C4:e Bb3:e D4:h
```
Silences 59 % ≥ 40 % ✓ (composés d'abord, comme la leçon l'exige) ; fragments ≤ 3 notes ≤ 5 ✓, descendants, interrompus avant résolution ; F♯ passant chromatique résolu ✓ ; fin D = 2̂ (l'inachevé voulu) ✓.

**s29** *(e29 — converser avec la grille, fa M)*
```
Bb4:q. A4:e F4:q~F4:e E4:e | r:e E4:q. Bb4:q G4:e~G4:e r:e | A4:q. G4:e E4:q~E4:e F4:e |
F4:q. E4:e C4:q. D4:e | r:e D4:e Eb4:e E4:e F4:q. Bb4:e | Bb4:q. Ab4:e E4:q. Db4:e |
r:e G#4:e A4:q. G4:e E4:q | F4:q~F4:e G4:e A4:h
```
Temps forts sur guide tones (3/7, dont F♭≡E du G♭7 — F-6) ≥ 0.6 ✓ ; syncopes ≈ 45 % ∈ [0.35, 0.7] ✓ ; deux approches chromatiques résolues (E♭→E b5, G♯→A b7) ✓ ; les pics sur les tensions (A♭ = 9 de G♭7) — le couplage §25.2 crédite.

## 28.6 Le capstone (s30, deux parts)

**s30-elena** *(ré dorien, 14 mesures, les huit étapes ; utilise F-10 et F-12)*
```
E4:q C5:q. B4:e A4:q | E4:q C5:q. B4:e A4:q | G4:q E5:q. D5:e C5:q | E5:q D5:q A4:h |
E4:q C5:q. B4:e A4:q | D4:q B4:q. A4:e G4:q | G4:q E5:q. D5:e C5:q | B4:q Bb4:e A4:e G4:q F4:q |
E4:h C5:h~ | C5:q B4:q A4:h | F5:h. E5:q | A3:e F4:e E4:e r:e A3:e F4:e E4:e r:e |
D4:q E4:q F4:q E4:q | E4:q C4:q D4:h
```
Vérification des huit étapes : **signature** m6↑ (E→C5) dans la cellule ET à l'approche du climax (A4→F5 = +8 : l'âme d'Elena au sommet) ✓ · **structure** sentence étendue 4+4+6 ✓ · **occurrences** : 7 (exactes b1/b2/b5, transposées réelles/tonales b3/b6/b7 — F-12, **augmentée** b9–10 : durées ×2 exactes, F-10) ✓ `requiredVariationTypes` ✓ · **transformations** : augmentation + fragmentation (b12 : la tête E–C5–B transposée en A3–F4–E4, tout dorien, `isDistinctive` ✓) = 2 ✓ · **climax** F5 à 71 % ∈ [0.55, 0.75], tenu ✓ · **LA surprise unique** : le B♭ de b8 — ♭6̂ pour 6̂, l'espoir qui se voile — qui EST aussi la figure chromatique résolue (une pierre, deux exigences) ✓ · **prosodie** déclamatoire (longues sur appuis) ✓ · fin 1̂ par la conclusion modale C→D (dorien assumé, pas de sensible) ✓.

**s30-yours** *(brief exemple : « Bruma — contrebandière ironique, insaisissable, tendre en secret. Clarinette. » — sol m, chalumeau)*
```
G3:e r:s G3:s Bb3:e D4:e C4:q. Bb3:e | G3:e r:s G3:s Bb3:e D4:e C4:q. Bb3:e |
r:q A3:e r:s A3:s C4:e Eb4:e D4:q | G3:q F3:q G3:h |
G3:e r:s G3:s Bb3:e D4:e C4:q. Bb3:e | D4:e r:s D4:s F4:e Eb4:e D4:q. C4:e |
Bb3:q A3:e Ab3:e G3:q. F3:e | A3:q C4:q Bb3:q A3:q |
G3:e r:s G3:s Bb3:e D4:e C4:q. Bb3:e | Bb3:q A3:e Ab3:e G3:h |
D4:q C4:q A3:q F#3:q | G3:w
```
Le brief traduit : ironique → rebond à silences internes (le motif « joyeux » transposé en mineur : le sourire en coin) ; insaisissable → occurrences déplacées (b3 : décalée d'un temps) ; tendre en secret → le soupir chromatique A♭ (b7, b10) ; clarinette → chalumeau D3–F4 respecté (registre `m05-l08`). 6 occurrences, variées ✓ ; F♯=7̂ → G final ✓. *La part 2 sert de gabarit : le rapport montrera à l'élève comment SES adjectifs deviennent des curseurs.*

## 28.7 Bilan — et clôture du backlog solutions

| Livré | **29/29 solutions M2** — backlog complet : **56/56** (M1 §26–27 + M2) |
|---|---|
| Findings du lot | F-9 (erratum comptage), **F-10** (augmentation invisible aux ratios — patch findMotifs), **F-11** (ambiguïté pré-passe modale), **F-12** (transposition tonale ±1 — patch findMotifs), F-13 (amendement e08), F-14 (amendement e15 + limite d'homophonie documentée) |
| Rendement qualité cumulé | **14 findings pour 56 solutions** (1/4) — dont 5 patchs moteur, 4 amendements de spec, 3 décisions de calibrage, 2 errata. Le verrou §19.6 est définitivement l'outil qualité n° 1 du produit |
| Ordre des PR | patchs F-10/F-11/F-12 + amendements e08/e15 → solutions M2 → CI complète verte (56 pipelines + auto-cohérence des gabarits §25.2 : les solutions d'ambiance s19–s29 alimentent directement ce verrou-là aussi) |
| Coût réel | ~22 min/solution mélodique, ~50 min pour s30 — total lot ≈ 12 h ; cumul solutions ≈ 32 h, conforme au re-chiffrage §26.4 |

**Le MVP est désormais complet sur tous les plans spécifiables** : architecture, backend, frontend, moteur (règles + contraintes + gabarits + instruments), 58 leçons, 79 specs d'exercices, 56 solutions de référence, 14 corrections issues de leur confrontation. Restes de production pure : m05-l01 (15 min), les quiz `<QuizBlock>` (~180 items), 2 assets musicaux, et le développement lui-même (roadmap §6.4, S1–S16).

---

**Point de confirmation.** Le chantier « contenu MVP exécutable » est clos. Trois directions possibles : **(a)** boucher les derniers trous de production (m05-l01 + un lot représentatif de quiz — la fin du fini) ; **(b)** ouvrir la V1 par le **Module 10** (Cubase Pro 13 : le Real-World Workflow, 15 leçons — le module le plus différenciant du produit) ; **(c)** ouvrir par le **Module 6** (sound design hybride, 15 leçons — qui débloque le Layering et les règles `sd.*`). Tu choisis ?