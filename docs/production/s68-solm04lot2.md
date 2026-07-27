# SECTION 68 — SOLUTIONS DE RÉFÉRENCE M4, LOT 2 : LA LIBERTÉ ARMÉE ET LA MACHINE (6 volets + 3 findings)

## 68.0 Méthode — et un rechiffrage honnête

Le lot « s07→s12 d'un geste » ne tient pas dans un wagon : le fugato et la scène tissée pèsent chacun comme quatre solutions d'espèce. Ce lot livre **la liberté armée (s07–s08) et la machine à conversation (s09–s10)** — 6 volets ; le lot final (s11 ×5 + s12 ×3, le métier et le capstone) suit. Trois findings, dont un sur le donné du lot suivant, attrapé en préparant les partitions.

## 68.1 Findings de calibrage

**F-28 — La réponse tonale (extension du checker d'imitation).**
Le checker d'entrée vérifie la tête « à la quinte » par transposition exacte. Or la réponse d'école est souvent **tonale** : le sujet ouvre 1̂→5̂, la réponse répond 5̂→1̂ — le premier intervalle mute (+7 devient +5), le reste est exact. Sur s10, la réponse réglementaire était refusée.
*Patch* : `imitation.entry` gagne `answer: "real" | "tonal"` — en mode tonal, la tolérance ±1/±2 dt est admise **sur la zone de mutation seulement** (le premier ou le deuxième intervalle de la tête), contour identique, rythme conservé (la restriction qui empêche F-12 de tout avaler). +5 fixtures (réelle ✓, tonale ✓, mutation en milieu de tête ✗). *s10 est la solution-témoin.*

**F-29 — Le retard généralisé hors espèces (extension de checker).**
e08 exige « ≥ 1 retard à trois » en style **libre** — mais `species4` est couplé au CF en rondes et à l'alignement de barre. La suspension de s08 (mes. 12–13) était invisible au seul checker capable de la nommer.
*Patch* : `suspensionCheck` découplé — détection du motif préparation (consonance) → liaison → dissonance sur appui → résolution descendante par degré, **sur toute paire de voix, toute valeur, tout style** ; `species4` en devient un cas particulier. +6 fixtures. Servira tel quel à M7 (les retards orchestraux) et M8 (la ballade).

**F-30 — e11 épingle son donné (amendement de spec, famille F-8).**
Le thème d'Elena (s30-elena) fait **14 mesures** ; e11 dit « exposé nu 8 mesures ». *Amendement* : le donné = **mes. 1–8 de s30-elena** (la sentence 4+4, surprise B♭ incluse) ; l'extension 9–14 reste réservée au cue de M7 (m07-e10). Constaté en préparant le lot 3.

## 68.2 Les solutions

**m04-s07** *(e07 — deux voix libres, sol majeur, 12 mes. ; motif donné M = `G4:q B4:e C5:e D5:q B4:q | C5:q A4:q G4:h`)*
```
V1: G4:q B4:e C5:e D5:q B4:q | C5:q A4:q G4:h | r:q E5:h D5:q | C5:h~ C5:q B4:q |
    D5:q F#5:e G5:e A5:q F#5:q | G5:q E5:q D5:h | r:q B4:q C5:h | D5:h. B4:q |
    G4:q B4:e C5:e D5:q~ D5:q | C5:q B4:q E5:q D5:q | C5:q B4:q A4:q B4:q | A4:q G4:h.
V2: G3:h A3:h | B3:h~ B3:q G3:q | G3:q B3:e C4:e D4:q B3:q | C4:q A3:q G3:h |
    B3:h A3:h | G3:h~ G3:q B3:q | D3:q F#3:e G3:e A3:q F#3:q | G3:q E3:q D3:h |
    r:q G3:q E3:h | B3:q G3:q D3:h | E3:q C3:q D3:h | D3:q G2:h.
```
| Vérif | |
|---|---|
| Motif partagé | V1 : M@G4 (b1–2), M@D5 transposé (b5–6) ; V2 : M@G3 (b3–4), M@D3 (b7–8) — **2 énoncés par voix** ✓ `findMotifs` par part ; b9 : la tête en écho étiré (dialogue) |
| Complément | attaques fortes simultanées mesurées **0.33 ≤ 0.40** ✓ (les entrées de M toujours sous tenue ou silence de l'autre) |
| Appoggiature libre | **b10 temps 3 : E5 sur D3** (9e), atteinte par saut (B4→E5, le sommet du geste), quittée par degré (→D5), non liée ✓ — le checker croise figure et contour |
| Clausule complète | 2̂→1̂ (A4→G4) sur 5̂→1̂ (D3→G2), dixième→octave par mouvement contraire ✓ |
| Polarité | soprano-basse contraires aux appuis 9/12 ; grappes de tierces/dixièmes ≤ 3 ✓ |

**m04-s08** *(e08 — trois voix, do majeur, 16 mes. ; témoin F-29)*
`texturePlan: [{1–4 mélodie accompagnée}, {5–8 imitatif}, {9–12 polyphonie}, {13–14 suspension}, {15–16 homophone}]`
```
S:  C5:q E5:q G5:q. F5:e | E5:q D5:q C5:h | A4:q B4:q C5:h | B4:h. C5:q |
    r:h E5:q D5:q | r:q E5:q C5:h | r:q G4:q A4:q B4:q | C5:h. r:q |
    C5:q E5:q G5:q. F5:e | E5:q F5:q G5:h | A5:q G5:q F5:q E5:q | F5:h~ F5:h~ |
    F5:h E5:h | D5:h D5:h | C5:q C5:q D5:h | C5:w
M:  G4:h E4:h | G4:q F4:q E4:h | C4:h F4:h | G4:h. E4:q |
    G4:q B4:q D5:q. C5:e | B4:q A4:q G4:h | E4:h. D4:q | E4:h G4:h |
    E4:h G4:h | C5:h B4:h | C5:h~ C5:h | A4:h B4:h |
    G4:h~ G4:h | B4:h B4:h | A4:q A4:q B4:h | E4:w
B:  C3:h G2:h | C3:h G2:h | F2:h A2:h | C3:h G2:h |
    A2:h E3:h | G2:h E3:h | C3:q E3:q G3:q. F3:e | E3:q D3:q C3:h |
    A2:h E3:h | C3:h D3:h | F3:h C3:h | D3:w |
    C3:w | G2:w | F2:h G2:h | C3:w
```
| Vérif | |
|---|---|
| Motif aux trois voix | S@C5 (b1–2, repris b9), **M@G4 (b5–6, en imitation à la quinte)**, B@C3 (b7–8) ✓ |
| Le retard à trois (F-29) | F5 préparée (b12, consonante sur ré m), **liée**, suspendue b13 sur l'accord de do (4e contre C3 ET G4 — la suspension contre deux voix, taguée), résolue E5 : l'arrivée {C3+G4+E5} **triade complète** ✓ |
| Triades complètes | 12/16 appuis (75 % ≥ 70 %) — les incomplets assumés : b1 et b16 (S et B sur do : la 3e voix ne peut fournir tierce ET quinte — « la conduite prime sur la complétude », l08, `authorNotes`) |
| La médiane jugée | `melody.*` sur M seule : arche propre (creux D4 b7, sommet C5 b10–11 à 66 %), conjointe 0.81, chante seule ✓ — la voix qui sert, enfin nommée |
| Textures | 5 régimes détectés, concordants au plan ✓ |

**m04-s09 — l'imitation (3 volets ; tête donnée T = `C:e D:e E:q G:q`)**

*Volet 1 — imitation libre (8 mes., entrée à la quinte, délai 2)* :
```
V1: C4:e D4:e E4:q G4:h | A4:q G4:q E4:h | E4:q F4:q G4:h | A4:h G4:q F4:q |
    E4:q D4:q E4:h | F4:q E4:q E4:h | E4:q C4:q D4:h | C4:w
V2: r:w | r:w | G4:e A4:e B4:q D5:h | E5:q C5:q B4:h |
    C5:q B4:q G4:h | A4:h G4:h~ | G4:q A4:q B4:h | C5:w
```
Entrée V2 = T +7 exact (réelle) au délai 2 ✓, émancipation dès b4 ✓ ; tritons de passage (b3.2, b4.4) conduits par degré — légaux en libre ✓ ; clausule contraire D4→C4 / B4→C5 ✓.

*Volet 2 — canon à l'octave (délai 1, rupture cadentielle)* :
```
V1: C5:q B4:q C5:q D5:q | E5:q D5:q C5:q A4:q | G4:q F4:q E4:q C5:q | B4:q A4:q C5:q E5:q |
    D5:q C5:q E5:q C5:q | F4:q E4:q G4:q A4:q | A4:q G4:q F4:q G4:q | D5:h C5:h
V2: r:w | C4:q B3:q C4:q D4:q | E4:q D4:q C4:q A3:q | G3:q F3:q E3:q C4:q |
    B3:q A3:q C4:q E4:q | D4:q C4:q E4:q C4:q | F3:q E3:q G3:q A3:q | B3:h C4:h
```
Identité V2 = V1 −12 décalée d'une mesure, b2→b7 **exacte** ✓ ; **b8 libre** (7̂→1̂ contre 2̂→1̂ du dux : la rupture cadentielle taguée) ✓ ; chaque mesure composée *contre soi-même* — octaves et quintes atteintes par mouvement contraire seulement (b2.3, b5.3), grappes d'imparfaites ≤ 3 ✓ ; le plongeon C5→F4 (b5→b6) documenté (`authorNotes` : le prix d'une consonance b6 — le canon négocie).

*Volet 3 — la strette (4 énoncés, délais 2 → 1 → 0.5)* :
```
V1: C4:e D4:e E4:q G4:q r:q | A4:q G4:h F4:q | E4:h r:h | C5:e D5:e E5:q G5:q r:q |
    F5:q E5:q D5:q C5:q | D5:h~ D5:h | D5:h C5:h
V2: r:w | r:w | G4:e A4:e B4:q D5:q r:q | r:h G3:e A3:e B3:q~ |
    B3:q?? → D4:q E4:q F4:h | G4:h~ G4:q A4:q | G3:h C4:h
```
*(correction de saisie : V2 b5 = `D4:q E4:q F4:h` — le B3 lié de b4 résout sur D4 au saut de tête, c'est la fin de l'énoncé 4)* — entrées b1.1 / b3.1 (Δ2) / b4.1 (Δ1) / b4.3 (Δ0.5 : l'énoncé 4 plonge au grave et **chevauche** l'énoncé 3 — G5/G3 en double octave au croisement, contraire ✓) : l'arche de délais taguée, la compression = le moteur ✓ ; cadence contraire finale ✓.

**m04-s10** *(e10 — le fugato de poursuite, sol mineur, 15 mes. ; solution-témoin F-28)*
Sujet (le mien, **testé contre lui-même** aux délais 2/1/0.5 avant tout — le checker l'exige) :
`Sj = G3:q D4:e C4:e Bb3:q A3:q | Bb3:e C4:e D4:q G3:h` · Contre-sujet **invertible à l'octave** (tierces/sixtes seulement, zéro quinte) : `CS = Bb3:h G3:q F3:q | G3:e A3:e Bb3:q Bb3:h`
`texturePlan: [{1–6 exposition}, {7–10 épisode}, {11–13 strette/pédale}, {14–15 homophone}]`
```
b1–2   A: Sj@G3 (seul)
b3–4   S: RÉPONSE TONALE @D4 — D4:q G4:e F4:e Eb4:q D4:q | Eb4:e F4:e G4:q D4:h
       A: CS
b5–6   B: Sj@G2 (le retour) · S: CS +8va (l'inversion ENCAISSÉE : 10-6-6-6 mesurés) · A: r
b7–8   ÉPISODE (séquence sur la tête, vers Sib) :
       S: F4:q C5:e Bb4:e A4:q G4:q | Eb4:q Bb4:e Ab4:e G4:q F4:q
       A: A3:h Bb3:h | C4:h Bb3:h        B: F3:h E3:h | Eb3:h D3:h
b9–10  l'arrivée au relatif : S: D5:q Bb4:q C5:h | Bb4:h A4:h
       A: F4:h Eb4:h | D4:h C4:h          B: Bb2:h F3:h | Bb2:h D3:h
b11–13 STRETTE sur pédale de dominante (B: D2:w x3) :
       A: Sj-tête@G3 (b11.1) · S: Sj-tête@D4 (b11.3 — délai 1/2) ·
       A: tête@Bb3 (b12.1) · S: tête@F4 (b12.3) · b13: S: Eb4:q D4:q C4:q A3:q  A: F#3:w
b14–15 HOMOPHONE : [D3+A3+F#4]:h [D3+C4+F#4]:h | [G2+Bb3+D4]:w
```
| Vérif | |
|---|---|
| Le sujet auto-testé | Sj contre Sj décalé (2/1/0.5) : consonances aux appuis, zéro parallèle — le checker l'accepte, la strette est solvable *par construction* |
| **F-28 en acte** | la réponse : tête 1̂→5̂ répondue **5̂→1̂** (+5 pour +7, mutation sur le premier intervalle seulement, suite exacte +5) — refusée avant patch, taguée `answer: tonal` après ✓ |
| CS invertible | b3–4 (dessous) et b5–6 (dessus) : les deux positions mesurées consonantes (`fugato.invertible` ✓) — zéro quinte dans le CS, donc zéro quarte à l'inversion |
| Épisode | la tête séquencée F→E♭ (2 marches, « 3 max » respecté), module au relatif (estimateKey fenêtre b9–10 : Si♭ ✓) |
| Strette + pédale | 4 têtes aux délais 1/2 sur D2 (pedalPlan, F-18) ; F♯3 (b13) prépare la sensible ; **conclusion homophone V→i** complète à 3 voix ✓ |
| Le rapport raconte | « exposition propre, épisode qui module vers le relatif, strette à délai 1/2 — le filet se resserre réglementairement » — la phrase promise par la spec, générée depuis les tags |

## 68.3 Bilan du lot

| Livré | 6 volets (s07→s10) — la sortie du laboratoire, les trois voix, la machine à imiter, le fugato |
|---|---|
| Findings | **F-28** (réponse tonale), **F-29** (retard généralisé — un cadeau direct à M7/M8), **F-30** (donné d'e11 épinglé) |
| Constat | le canon et le fugato coûtent ~70–80 min pièce (composer contre soi-même se paie) ; l'imitation libre ~25 |
| État M4 | **17/25** — reste le lot final : s11 ×5 (les cinq recettes du contrechant d'Elena — F-29 et F-30 en service) et s12 ×3 (« la scène tissée », le commentaire vérifié inauguré) |
| Cumul projet | **104 solutions** · **30 findings** |

---

**Point de confirmation.** La machine à conversation est solutionnée et la réponse tonale est codée. Le lot final de M4 : **(a)** s11 ×5 + s12 ×3 — les cinq contrechants sur le thème d'Elena (mes. 1–8, F-30) puis le capstone « le rendez-vous » avec sa part 3 en commentaire vérifié — la clôture du module et de tout le socle d'écriture (M1→M4 solutionnés) ; **(b)** intercaler les quiz M3+M4 (30 quiz, ~12 h 30). Ma recommandation : **(a)**. Je termine M4 ?