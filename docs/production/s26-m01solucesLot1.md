# SECTION 26 — SOLUTIONS DE RÉFÉRENCE M1, LOT 1 (13 solutions + 3 findings de calibrage)

## 26.0 Format et méthode

Chaque solution vit dans `test/solutions/m01/<exerciseId>.json` : `{ exerciseId, notation, authorNotes }`, compilée par le parseur §19.3 et soumise au pipeline complet par le verrou CI n° 2 (§19.6 : score ≥ 85, toutes contraintes satisfaites). La composition s'est faite **contre les règles telles que codées** (§8, §10) — et c'est exactement ce que ce verrou promettait : trois solutions ont mis au jour des frictions moteur/pratique musicale. **Les findings d'abord** — c'est la moitié de la valeur du lot.

## 26.1 Findings de calibrage (à traiter avant le merge du lot)

**F-1 — La sensible de passage à la basse (faux positif confirmé).**
La ligne de basse descendante G–F♯–E harmonisée G → D/F♯ → Em est un idiome universel (classique et pop). Or `vl.leading-tone-resolution` telle que codée (§10.3) flague F♯3→E3 : sensible en voix extrême non résolue → *error* 12 pts. Musicalement, ce F♯ est un **passage mélodique**, pas une sensible cadentielle.
*Patch* : exception « sensible de passage » — si la note-sensible est approchée par degré supérieur ET quittée par degré inférieur (x+1 → LT → x−1) dans une ligne conjointe de ≥ 3 notes, ET que la verticalité n'est pas cadentielle (pas de V→I dans les 2 accords), rétrograder en `suggestion` avec texte dédié (« sensible de passage : légal en ligne descendante ; en position cadentielle elle devrait monter »). +5 fixtures (3 passages légaux, 2 abandons cadentiels qui doivent rester des erreurs). `engineVer` bump (§7.9).

**F-2 — `requiredCadence` sur soumission monophonique (trou de spec).**
e49 exige une cadence parfaite… sur une mélodie seule : `detectProgression` ne produit aucun accord → cadence `null` → contrainte inéchouable. *Patch* : fallback monophonique du checker — quand l'entrée est monophonique, `requiredCadence: "perfect"` ⇔ formule mélodique cadentielle : pénultième ∈ {7̂, 2̂} + finale 1̂, longue, temps fort (c'est la définition de l16 §2 côté mélodie, et la fusion déjà prévue avec `melody.ending-weak`, §7.6). Idem `half` ⇔ finale ∈ {5̂, 2̂} suspendue.

**F-3 — Triades incomplètes indétectables (règle d'écriture des solutions).**
Le dictionnaire §8.5 exige les trois sons d'une triade (seuls les accords de 7e ont une quinte `optional`). Un accord final `G–B–G` (quinte omise) échoue la détection → la cadence échoue. Plutôt que d'assouplir le dictionnaire (C–E seul est trop ambigu), on l'acte en **règle d'écriture** : *toute verticalité porteuse de fonction dans une solution (et dans les `given`) voice la triade complète* ; l'omission de quinte reste réservée aux accords de 7e. Documenté dans le README des solutions ; à réévaluer si la beta montre des soumissions d'élèves légitimes pénalisées.

## 26.2 Solutions mélodiques

**m01-s07** (e07 — charpente/habillage, sol majeur)
```
G4:q A4:q B4:q C5:q | D5:q C5:q B4:q A4:q | B4:q C5:q D5:q C5:q | B4:q A4:q G4:h
```
| Contrainte | Vérif |
|---|---|
| strongBeatDegrees [1,3,5] | temps 1/3 : G-B \| D-B \| B-D \| B-G — tous charpente ✓ |
| penultimate [7,2] / fin 1̂ | A4 (2̂) → G4 (1̂), blanche, temps 3 ✓ |
| maxLeap 5 / conjunct ≥ .65 | 100 % conjoint ✓ |

*Craft : arche simple, sommet D5 unique — la version « manuel » assumée.*

**m01-s12** (e12 — mélodie mineure, les deux mondes, la mineur)
```
A4:q B4:q C5:h | B4:q A4:q G4:h | A4:q C5:q D5:q E5:q | E5:q D5:q C5:h |
D5:q C5:q B4:q A4:q | G4:q F4:q E4:h | E4:q F#4:q G#4:q A4:q | B4:q G#4:q A4:h
```
Descentes par le **naturel** (G, F — mes. 2, 5–6), montée conclusive par le **mélodique** (F♯–G♯, mes. 7 : pas de seconde augmentée), `requireLeadingToneBeforeFinal` : G♯4→A4 ✓. Conjoint ≈ 0.90, ambitus E4–E5 ✓.

**m01-s13** (e13 — ré dorien, la note-signature exposée)
```
D4:q F4:q A4:q B4:q | B4:h A4:h | D4:q E4:q F4:q G4:q | A4:q G4:q F4:q E4:q |
F4:q A4:q B4:h | C5:q B4:q A4:q G4:q | A4:q G4:q F4:q E4:q | E4:q C4:q D4:h
```
Expositions du B (6̂ majeure) : mes. 2 (temps fort + blanche) et mes. 5 (blanche sur temps 3) — `minExposureCount 2` ✓. Tonique établie (départ/arrivée D, 100 % dorien). *Test de vérité de l07 : remplace les B par B♭ — tout bascule en éolien.*

**m01-s16** (e16 — le pouvoir du silence, do majeur)
```
E4:q G4:q C5:q G4:q | A4:q G4:q E4:q r:q | r:q E4:q F4:q D4:q | E4:q D4:q C4:h
```
Respiration fin de mes. 2 ✓ ; **temps fort silencieux** : mes. 3 temps 1 (rien ne sonne à travers) ✓ ; fin sur 1̂ ✓. *Le vide du temps 1 de la mesure 3 pèse plus que n'importe quelle note — c'est le point de la leçon.*

**m01-s17** (e17 — la phrase penchée, mêmes hauteurs)
```
C4:q. E4:e~E4:e G4:e E4:q | A4:e~A4:q G4:e~G4:e E4:e D4:q |
C4:e E4:q. G4:q A4:q~ | A4:e G4:e~G4:e C4:h.
```
Séquence de hauteurs = le donné (14 attaques, ordre identique) ✓. Syncopes : E (2.5→3.5), G (2.5→3.5), E (1.5→3), **A tenu à travers la barre** (4→4.5), G (1.5→2.5) ; attaques hors-temps 6/14 ≈ 0.43 ∈ [0.25, 0.5] ✓. La grille reste audible (temps 1 attaqués aux mes. 1–3).

**m01-s18** (e18 — le rythme d'abord, la mineur, profil thriller)
```
A3:q. A3:e C4:e A3:e E4:q | A3:q. A3:e C4:e A3:e D4:q | A3:q. A3:e B3:e A3:e E4:q |
A3:h. E3:q | A3:q. A3:e C4:e A3:e F4:q | A3:q. A3:e C4:e A3:e E4:q |
A3:q. A3:e C4:e E4:e~E4:q | C4:q B3:q A3:h
```
Cellule rythmique `q.-e-e-e-q` : 5 occurrences exactes (hauteurs variées : motifType *rhythmic*) + 2 variations (mes. 4 : tête augmentée `h.-q` ; mes. 7 : fin liée) ✓ ≥ 4 avec variation ✓. Fin 1̂ ✓. *Le pattern ne varie pas, il dévie — la grammaire de m09-l04 déjà en germe.*

**m01-s49** (e49 — l'arche de tension, fa majeur ; utilise le fallback F-2)
```
F4:q G4:q A4:h | A4:q Bb4:q C5:h | A4:q C5:q D5:q C5:q | Bb4:q A4:q G4:h |
A4:q C5:q D5:q E5:q | F5:h. D5:q | C5:q Bb4:q A4:q G4:q | G4:q E4:q F4:h
```
Climax F5 : première atteinte à 62,5 % ∈ [0.55, 0.8] ✓, tenu (h.) ; montée par vagues (creux mes. 4), descente, cadence mélodique parfaite : E4 (7̂) → F4 (1̂), blanche, temps 3 ✓ (F-2). Sauts tous ≤ 4 dt ≤ 9 ✓.

## 26.3 Solutions harmoniques

Toutes vérifiées paire par paire contre `parallelPerfects`, `leadingToneResolutions` (+ exceptions codées : sensible frustrée en voix interne → 5̂ ; octave/quinte cadentielle au soprano par degré), `vl.spacing`, `vl.doubled-leading-tone`, et résolution des septièmes.

**m01-s23** (e23 — la basse qui marche, I–vi–IV–V–I)
```
[C3+E4+G4+C5]:w | [C3+E4+A4+C5]:w | [A2+F4+A4+C5]:w | [B2+D4+G4+D5]:w | [C3+E4+G4+C5]:w
```
| Contrainte | Vérif |
|---|---|
| fonctions conservées | C · Am/C · F/A · G/B · C — mêmes accords, renversés ✓ |
| basse conjointe ≥ .6, maxLeap 4 | C–C–A–B–C : 0/−3/+2/+1 → 0.75, max 3 ✓ |
| voix supérieures | notes communes tenues partout (C5 tient 4 mesures) — la démonstration de l12 §2 |
| VL | quinte T-S de la mes. 4 quittée par mouvement **contraire** ; sensible B2→C3 ✓ ; aucun parallèle |

**m01-s24** (e24 — la basse descendante, sol majeur ; contient le cas F-1)
```
[G3+B3+D4+G4]:h [F#3+A3+D4+A4]:h | [E3+B3+E4+G4]:h [D3+B3+G4+B4]:h |
[C3+E4+G4+C5]:h [D3+C4+F#4+A4]:h | [G2+B3+D4+G4]:w
```
Basse G3–F♯3–E3–D3–C3–D3–G2 : descente nette, conjoint 5/6 = 0.83 ≥ 0.7 ✓ ; G/D = **64 de passage** textbook (basse E–D–C) ; D7 avec 7e (C4) résolue → B3 ✓ ; sensible finale F♯4 → D4 (voix interne frustrée, exception codée) ✓ ; cadence parfaite complète (V7 fond. → I fond., soprano A4→G4, temps fort) ✓. **F♯3→E3 mes. 1–2 = la sensible de passage (F-1)** — légale après patch, et c'est précisément pour la détecter que cette solution existe.

**m01-s29** (e29 — la première période, sur la grille donnée)
```
B4:q. A4:e G4:q B4:q | C5:q. B4:e A4:q G4:q | A4:q. B4:e C5:q E5:q | D5:h A4:h |
B4:q. A4:e G4:q B4:q | C5:q. B4:e A4:q C5:q | D5:q C5:q B4:q A4:q | G4:w
```
Antécédent → **demi-cadence** : arrêt sur A4 (2̂) sur D7, blanches = respiration ✓ ; conséquent reprend la tête (motif `q.-e-q` descendant : mes. 1 = mes. 5 exactes, mes. 2/6 transposées) ✓ ; conclusion 2̂→1̂, ronde, parfaite sur D7→G ✓. Sommet E5 unique (mes. 3).

**m01-s30** (e30 — le laboratoire des ponctuations, do majeur, 4 segments)
```
[C3+E4+G4+C5]:h [F3+F4+A4+C5]:h | [G3+D4+G4+B4]:h [C3+E4+G4+C5]:h |
[C3+E4+G4+C5]:h [F3+F4+A4+C5]:h | [G3+D4+G4+B4]:h [E3+E4+G4+C5]:h |
[C3+E4+G4+C5]:h [F3+F4+A4+C5]:h | [G3+D4+G4+B4]:w |
[C3+E4+G4+C5]:h [F3+F4+A4+C5]:h | [G3+D4+G4+B4]:h [A3+C4+E4+C5]:h
```
Même ouverture I–IV ×4 ✓ ; fins : **parfaite** (fond./fond., soprano 1̂) · **imparfaite** (I⁶ : la case « renversement » décochée — c'est la réponse à « dis-toi laquelle ») · **demi** (arrêt sur V, ronde) · **rompue** (V→vi, **tierce doublée** dans le vi : l'évitement classique des octaves parallèles — le piège canonique de la rompue, contourné comme il se doit). Sensible B4→C5 à chaque résolution ✓.

**m01-s31** (e31 — colorer sans transformer)
```
[C3+G3+E4+D5]:w | [A2+A3+E4+C5]:w | [F2+A3+E4+C5]:w |
[G2+D4+G4+C5]:h [G2+D4+G4+B4]:h | [C3+E4+G4+C5]:w
```
Enrichis : **Cadd9** (D5, pas de 7e — la frontière l17/l18), **Fmaj7**, **Gsus4→3** (C5 préparée par le Fmaj7, résolue C5→B4 : le lift de cadence, seul ornement permis sur V) = 3 ✓ ; vi laissé en triade (le contraste) ; fonctions intactes T-T'-S-D-T ✓ ; aucun ♭7 clandestin ✓.

**m01-s39** (e39 — le nuage, mi♭ majeur, ligne interne au ténor)
```
[Eb3+Bb3+Eb4+G4]:w | [Ab2+C4+Eb4+Ab4]:w | [Eb3+Bb3+Eb4+G4]:w |
[Bb2+D4+F4+Ab4]:w | [Eb3+Bb3+Eb4+G4]:w | [Ab2+C4+Eb4+Ab4]:w |
[Ab2+B3+Eb4+Ab4]:w | [Eb3+Bb3+Eb4+G4]:w
```
IV→iv→I en position finale (la **plagale mineure voilée** — le sens choisi et assumé, comme demandé) ; ligne interne **C4 → C♭4 → B♭3 au ténor**, consécutive, tout le reste immobile (`innerChromaticLine [9,8,7]` ✓) ; 1 seul accord emprunté ≤ 2 ✓ ; B♭7 : 7e au soprano (A♭4) résolue → G4 ✓, sensible D4 → B♭3 (interne frustrée) ✓. *Rejoue les mesures 6–8 sans la mesure 7 : la phrase est jolie. Avec : elle se souvient.*

## 26.4 Bilan et branchement CI

| Livré | 13 solutions (7 mélodiques, 6 harmoniques) — les exercices des leçons 1–17 couverts |
|---|---|
| Findings | F-1 (patch de règle + 5 fixtures), F-2 (fallback de checker), F-3 (règle d'écriture) — **le verrou §19.6 a fait exactement son travail dès le premier lot** |
| Constat de coût | ~45 min/solution harmonique vérifiée paire à paire (vs ~20 min estimées §19.6) : le backlog de 55 solutions se re-chiffre à ~30 h — à lisser sur la phase 1, prioritairement les exercices de la beta |
| Reste M1 (lot 2) | s26, s27, s28, s32, s34, s35, s36, s38, s40, s41, s42, s44, s45, s46 (14) — les plus lourds (modulations, trois-portes, médiantes) |
| CI | `test.each(loadSolutions())` actif dès merge ; F-1/F-2 mergés AVANT (sinon s24 et s49 échouent — l'ordre des PR est : patchs moteur → solutions) |

---

**Point de confirmation.** Le lot 1 est prêt, avec ses trois corrections moteur — la boucle contenu→solution→calibrage fonctionne. Suites possibles : **(a)** le lot 2 des solutions M1 (les 14 restantes, dont les modulations et médiantes — les plus délicates à vérifier) ; **(b)** basculer sur les solutions M2 (31, dont Elena) ; **(c)** changer de front : m05-l01 + un échantillon de quiz, ou l'ouverture V1 (Module 10 Cubase / Module 6 sound design). Je continue sur quoi ?