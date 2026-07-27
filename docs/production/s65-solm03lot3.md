# SECTION 65 — SOLUTIONS DE RÉFÉRENCE M3, LOT 3 : LE SYSTÈME 3 (9 solutions + 2 findings)

## 65.0 Méthode du lot

Le territoire non-fonctionnel : premier banc d'essai réel de `detectCollection` (tons entiers, octatonique), du `planingCheck`, des clusters et du format bi-plans `simultaneous` de e16. Deux findings — dont un qui touche **la notation elle-même** : à traiter en tête de file, trois solutions du lot en dépendent.

## 65.1 Findings de calibrage

**F-21 — La liaison par note dans les accords (extension du parseur — PRIORITAIRE).**
La grappe cumulative de e15 (« une note par temps, chaque note *tenue* ») et toute mélodie sur tapis tenu (e11, e13) sont inécrivables en mono-flux : la ré-attaque d'accord détruit l'enveloppe, et le vrai polyrythme de voix est réservé à `Part[]` (F-14).
*Patch* : la notation textuelle admet `~` **par note à l'intérieur d'un accord** — `[E4~+F4]:q` = mi lié à l'événement suivant, fa attaqué. Zone grise entre l'homophonie et `Part[]` : couvre les tenues internes sans ouvrir le multi-pistes. Parseur + round-trip (verrou CI n°3) + annexe A du manuel amendée. +8 fixtures (dont 2 négatives : `~` vers une hauteur absente de l'événement suivant = erreur de compilation). `engineVer` bump. *s11, s13 et s15 sont les solutions-témoins.*

**F-22 — Le fenêtrage des boussoles en bi-plans (amendement de spec e16).**
En variante « fusion » ou « victoire », le plan A cesse d'être en sol majeur à partir de la mes. 9 (il plie, ou il meurt) : `estimateKey` évalué sur le plan entier échoue — la solution correcte serait rejetée.
*Amendement* : « chaque plan dans sa boussole » s'évalue sur **mes. 1–8** ; la fenêtre 9–12 est jugée par la variante déclarée (fusion : convergence vers un objet commun nommé par `detectChord` inter-plans ; victoire : extinction mesurée d'un plan + plénitude de l'autre ; coexistence : deux boussoles stables + tag `polychord` sur la verticalité finale). Même famille que F-8/F-13 : le prompt promettait déjà ce sens, la spec le chiffre.

## 65.2 Les solutions

**m03-s11** *(e11 — l'apesanteur, 15 mes. : 4 tonales + passerelle + 8 tons entiers + sortie)*
```
[C3+G3+E4+C5]:w | [F2+A3+F4+C5]:w | [G2+B3+F4+D5]:w | [C3+G3+E4+C5]:w |
[G2+B3+F4+D#5]:w |
[Db3~+F3~+A3~+B4]:h [Db3+F3+A3+A4]:h | [Eb3~+G3~+B3~+G4]:h [Eb3+G3+B3+F4]:h |
[Db3~+F3~+A3~+A4]:h [Db3+F3+A3+B4]:h | [Eb3~+G3~+B3~+Db5]:h [Eb3+G3+B3+B4]:h |
[Db3+F3+A3+Eb5]:w | [Eb3~+G3~+B3~+Db5]:h [Eb3+G3+B3+A4]:h |
[Db3~+F3~+A3~+G4]:h [Db3+F3+A3+F4]:h | [Eb3+G3+B3+B4]:w |
[G2+G3+B3+F4]:w | [C3+G3+C4+E4]:w
```
| Vérif | |
|---|---|
| Passerelle | mes. 5 : **G7♯5** par line cliché (D5→D♯5) — et le piège révélé en `authorNotes` : ses quatre pitch-classes {G,B,D♯,F} appartiennent DÉJÀ à WT1 — la passerelle est un accord amphibie, tagué |
| Fenêtre (m6–13) | collection stricte WT1 {D♭,E♭,F,G,A,B} ✓ ; **le balancement des deux augmentés** D♭+ ↔ E♭+ en tapis tenus (F-21), l'arabesque au-dessus (sommet E♭5 m10 : l'altitude sans gravité) ✓ |
| La sortie | mes. 14 : G7 incomplet {G,B,F} — **encore ⊂ WT1** : la sortie est elle-même un mini passage secret ; mes. 15 : **les premiers demi-tons** (B3→C4, F4→E4) = l'événement détecté (checker `leapProfile`), cadence du retour, quinte du I livrée par le ténor tenu ✓ |

**m03-s12a** *(e12a — la créature, octatonique de do, 12 mes.)*
```
C3:q. F#3:q. Eb3:q | C3:q. F#3:q. Eb3:q | Eb3:q. A3:q. F#3:q | Eb3:q. A3:q. F#3:q |
F#3:q. C4:q. A3:q | F#3:q. C4:q. A3:q | A3:q. Eb4:q. C4:q | A3:q. Eb4:q. C4:q |
C3:q. F#3:q. Eb3:q | Eb3:q. A3:q. F#3:q | F#3:q. C4:q. A3:q | [A2+C3+Eb4+E4+F#4]:w
```
| Vérif | |
|---|---|
| La cellule | 3 notes, anguleuse (+6/−3 : le triton en tête), **asymétrie 3+3+2** ✓ `syncopationTarget` |
| La rotation | C→E♭→F♯→A à deux mesures par nœud (m1–8), puis **resserrée à une mesure** (m9–11 : la créature accélère) — rotation complète taguée ×2 ✓ |
| Collection + morsure | tout ∈ OCT(C) {C,D♭,E♭,E,F♯,G,A,B♭} ✓ ; mes. 12 : **la morsure verticale** [A+C+E♭+E+F♯] — le demi-ton E♭–E exposé dans la masse, tenue ✓ |

**m03-s12b** *(e12b — la corruption ; le donné : 8 mes. en sol majeur, la spec liste D5→D♭5 et B4→B♭4)*
```
[Eb3+Bb3+G4]:h [F#3+Db4+A4]:h | [A3+E4+C5]:h [F#3+Db4+A4]:h |
[C3+G3+E4]:h [Eb3+Bb3+F#4]:h | [C3+G3+Eb4+G4]:w |
[Db4+E4+A4]:h [A3+E4+Db5]:h | [Eb3+G3+Bb4]:h [C3+G3+Eb4+C5]:h |
[F#3+Db4+A4]:h [F#3+Bb3+Db4+F#4]:h | [Eb2+Bb3+G4]:w
```
| Vérif | |
|---|---|
| Le thème | inchangé à l'octave près, **sauf les 2 notes listées** (D♭5 m5, B♭4 m6) : `samePitchSequenceAsGiven { allowAlteredIndices }` ✓ — et tout ∈ OCT(C) : **la même maison que s12a** (le diptyque partage sa collection, `authorNotes`) |
| Les triades aux nœuds | C/Cm, E♭/E♭m, F♯/F♯m, A/Am — exclusivement ; **le thème est en sol, aucun accord de sol n'existe** : la boussole ment jusqu'à la dernière mesure (G4 final sur E♭ majeur) ✓ |
| forbidFunctionalCadence + rotation | aucun V→I ; les quatre nœuds visités, chacun nommé par le rapport ✓ |

**m03-s13** *(e13 — le diptyque quartal, la dorien, 8 + 4 mes. ; F-21)*
```
[A2~+D3~+G3~+C4~+E4]:h [A2+D3+G3+C4+F#4]:h | [A2~+E3~+A3~+D4~+G4]:h [A2+E3+A3+D4+E4]:h |
[A2~+D3~+G3~+C4~+F#4]:h [A2+D3+G3+C4+A4]:h | [A2~+E3~+A3~+D4~+G4]:h [A2+E3+A3+D4+F#4]:h |
[A2~+D3~+G3~+C4~+E4]:h [A2+D3+G3+C4+D4]:h | [A2~+E3~+A3~+D4~+F#4]:h [A2+E3+A3+D4+E4]:h |
[A2~+D3~+G3~+C4~+E4]:h [A2+D3+G3+C4+D4]:h | [A2+E3+A3+D4+E4]:w |
[A2+D3+G3+C4+F#4]:w | [D2+A2+F#3+A3+D4+F#4]:w | [A2+E3+A3+C4+E4]:w | [A2+E3+A3+C4+E4]:w
```
| Vérif | |
|---|---|
| Le quartal modal | boucle de **2 piles** {D-G-C sur A / E-A-D sur A}, bourdon déclaré (`pedalPlan`, F-18) ; la pile D-G-C porte le do — la tierce mineure dorienne vit DANS la maçonnerie ✓ `requireIdiom: quartal` |
| Les deux grammaires ensemble | `pillarExposure` : le fa♯ (6̂ dorienne) exposé m1/3/4/6/9 ≥ 0.25 ✓ ; la mélodie au-dessus porte l'émotion, l'harmonie fait l'espace — le rapport les sépare ✓ |
| La bascule (m9–12) | la pile la plus tendue (C–F♯ : le triton en réserve) → **l'ouverture tertienne** : ré MAJEUR étalé (chaque note glisse ≤ 2 dt, F♯ tenu) tagué `quartal-release` → Am — et la sortie est… **la cadence dorienne IV→i de s08** : le pont 2↔3 refermé sur lui-même (`authorNotes`) ✓ |

**m03-s14** *(e14 — le rouleau, mi éolien, 4+4+4 mes.)*
```
[A3+C4+E4]:q [B3+D4+F#4]:q [C4+E4+G4]:q [D4+F#4+A4]:q |
[C4+E4+G4]:q [D4+F#4+A4]:q [E4+G4+B4]:q [F#4+A4+C5]:q |
[G4+B4+D5]:q [E4+G4+B4]:q [D4+F#4+A4]:q [C4+E4+G4]:q |
[B3+D4+F#4]:h [A3+C4+E4]:h |
[A3+C#4+E4]:q [B3+D#4+F#4]:q [C4+E4+G4]:q [D4+F#4+A4]:q |
[C4+E4+G4]:q [D4+F#4+A4]:q [E4+G#4+B4]:q [F4+A4+C5]:q |
[G4+B4+D5]:q [E4+G#4+B4]:q [D4+F#4+A4]:q [C4+E4+G4]:q |
[B3+D#4+F#4]:h [A3+C#4+E4]:h |
[E2~+A3+D4+G4]:h [E2+B3+E4+A4]:h | [E2~+D4+G4+C5]:h [E2+B3+E4+A4]:h |
[E2~+A3+D4+G4]:h [E2+G3+C4+F4]:h | [E2+A3+D4+G4]:w
```
| Vérif | |
|---|---|
| Part 1 — diatonique | triades de mi éolien peintes sous la ligne de tête E–F♯–G–A / G–A–B–C / **D5**–B–A–G / F♯–E : arche, sommet à 56 % (fenêtre `climaxWindow` ✓) — la ligne jugée par les règles mélodiques, les qualités d'accords varient : le monde qui ondule ✓ `planing-diatonic` |
| Part 2 — réel | **le même dessin de tête**, majeures exactes (`planing-real`) : sol♯, ré♯, fa bécarre entrent — `out-of-key` silencieux sous le tag ; l'A/B des deux parts est la leçon rendue audible ✓ |
| Part 3 — le combo | quartes parallèles sur pédale de mi (l13 × l07, `pedalPlan` déclaré) ✓ `planing-quartal` |
| **La dette de §7.4** | trois parts entièrement construites en quintes/octaves parallèles — et le rapport les **crédite en toutes lettres** pour la première fois du cursus : la solution-témoin de la matrice impressionniste |

**m03-s15** *(e15 — le voile, la lame, la masse, 12 mes. ; solution-témoin F-21)*
```
[G2+D3+G3+D5+E5+G5]:w | [G2+D3+G3+D5+E5+G5+A5]:w |
[G2+D3+G3+E5+G5+A5+B5]:w | [G2+D3+G3+D5+E5+G5+A5+B5]:w |
[E4~]:q [E4~+F4~]:q [E4~+F4~+F#4~]:q [E4~+F4~+F#4~+G4~]:q |
[E4~+F4~+F#4~+G4~+Ab4~]:q [E4~+F4~+F#4~+G4~+Ab4~+A4~]:q [E4~+F4~+F#4~+G4~+Ab4~+A4~+Bb4~]:q [E4~+F4~+F#4~+G4~+Ab4~+A4~+Bb4~+B4~]:q |
[E4~+F4~+F#4~+G4~+Ab4~+A4~+Bb4~+B4~]:w | [E4+F4+F#4+G4+Ab4+A4+Bb4+B4]:w |
[F4+F#4+G4+Ab4+A4+Bb4]:w | [G4+Ab4+A4]:w | [Ab4~]:w | Ab4:w
```
| Vérif | |
|---|---|
| Le voile (m1–4) | cluster **pentatonique** aigu {D5–B5} déposé note à note sur le pôle pandiatonique de sol (s10 recyclé en socle) — brique = secondes majeures, registre aigu, enveloppe additive douce ✓ |
| La grappe (m5–8) | cumulatif **chromatique** au médium : **8 attaques, une par temps sur 2 mesures**, chaque note tenue (F-21) — « ta grappe pousse en 8 attaques » : l'enveloppe lue par les attaques échelonnées ✓ ; largeur finale = la quinte chromatique remplie, tenue 2 mes. |
| L'effondrement (m9–12) | la masse se resserre par les bords (6 → 3 notes) puis **l'unisson : UN son, tenu** — la résolution de masse, densité ≠ volume ✓ ; les trois familles (voile/lame — la grappe médium en est une —/masse) taguées avec briques et largeurs |

**m03-s16 ×3** *(e16 — le double-fond, 12 mes., bi-plans `simultaneous` ; utilise F-22)*
Tronc commun m1–8 — **Plan A** (l'innocent, sol majeur, ≥ G3) : boucle berceuse I↔IV (+ un V passager m7) en position serrée médium ; **Plan B** (≤ C3) : la ligne qui rôde — `r:w | Eb2:w | G2:h Bb2:h | Eb2:w | Ab2:h G2:h | Eb2:w | Bb1:w | Eb2:w`. Dégagement de registre ✓ ; contacts verticaux tagués `polychord` ; le rapport nomme : « ton sol et ton mi♭ : **la médiante sombre en duel** » (le G partagé = le fil de la table l06, motivation déclarée).

| Variante (m9–12) | Réalisation | Verdict F-22 |
|---|---|---|
| **fusion** | A plie note à note (E→E♭ m10, B→B♭ m11) pendant que B monte à la quinte — objet final inter-plans : **{E♭,B♭,G,B♭,D} = E♭maj7** : chaque plan garde ses notes, l'objet est UN accord | convergence nommée par `detectChord` inter-plans ✓ |
| **victoire** | A est capturé (m10 : il joue du mi♭ sans le savoir) puis s'amenuise et se tait (m11 demi-mesure, m12 silence) ; B conclut plein — [E♭1+E♭2+B♭2], la tierce laissée hors du grave (`low-interval-limit`, `authorNotes`) | extinction mesurée de A + plénitude de B ✓ |
| **coexistence** | A répète sa boucle inchangée, B rôde inchangé ; verticalité finale **sol majeur sur mi♭ = {E♭,G,B,D}** tenue, non résolue — personne ne cède | deux boussoles stables (m1–8) + tag `polychord` final ✓ |

## 65.3 Bilan du lot 3

| Livré | 9 solutions — le système 3 matériellement complet (l11–l16, toutes variantes) |
|---|---|
| Findings | **F-21** (liaison par note dans les accords — un finding de *notation*, le premier ; débloque s11/s13/s15 et servira les tenues internes jusqu'en M7), **F-22** (fenêtrage des boussoles bi-plans — amendement de spec e16) |
| Constats de méthode | le diptyque octatonique partage sa collection (s12a/s12b : OCT(C) des deux côtés — l'A/B « créature/corruption » devient jouable à maison constante) ; s14 est la solution la moins chère du module (~20 min : le planing s'écrit vite quand la règle ne mord plus) — s16 la plus chère (~70 min : trois fins, deux boussoles) |
| Ordre des PR | **F-21 (parseur + round-trip) en premier**, F-22 (spec) → les 9 solutions → CI verte |
| État M3 | **25/31** — reste le lot final : s17 ×3 (la tension sans dominante : `tensionPlan` éprouvé) et s18 ×3 (le capstone tri-palettes) |
| Cumul projet | 81 solutions · **22 findings** traités |

---

**Point de confirmation.** Le système 3 est solutionné ; toutes les briques du non-fonctionnel ont leur témoin, et les deux extensions de format (bi-plans, liaisons internes) sont éprouvées isolément — comme prévu. Le lot final de M3 : **(a)** s17 ×3 + s18 ×3 — les arches commandées avec `tensionPlan` (la confrontation plan↔métriques de §10.2, le rapport le plus « professeur » du produit) puis le capstone tri-palettes qui clôt le module ; **(b)** suspendre M3 à 25/31 et basculer sur les quiz M3 pendant que les palettes sont fraîches. Ma recommandation : **(a)** — finir le module d'un geste ; un module clos, c'est une CI verte qu'on n'a plus à rouvrir. Je termine M3 ?