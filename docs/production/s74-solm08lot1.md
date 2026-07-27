# SECTION 74 — SOLUTIONS DE RÉFÉRENCE M8, LOT 1 : LE SOCLE DU LANGAGE (10 volets + 3 findings)

## 74.0 Méthode et comptage du backlog M8

Comptage : e02 ×2, e04 ×2, e09 ×2, e14 ×3, e15 ×3 — **22 solutions M8**. Ce lot = **le socle** (s01→s08 : le temps, les mains, la cellule-mère, le blues, la marche, la carte, le vocabulaire, la ballade). Le calibrage du swing produit le jumeau attendu de F-35, et le chord-scale exige qu'on chiffre enfin « se poser ».

## 74.1 Findings de calibrage

**F-43 — Le rendu swing des solutions (extension du compilateur — PRIORITAIRE).**
La notation compile sur la grille droite → `swingRatio` mesuré = 1.0 → toute solution échouait `swingTarget` par construction (le frère de F-35, mais systématique, pas aléatoire).
*Patch* : la solution déclare `swing: {ratio}` — le compilateur décale **déterministiquement** les croches de contretemps au tick calculé (ratio 2.0 → le « et » au triolet) ; le parseur reconnaît l'offset systématique au ré-import (round-trip tenu, verrou n°3). Le swing redevient mesurable sur les solutions ; les soumissions élèves restent jugées sur leur jeu réel. +6 fixtures.

**F-44 — Le ratio indéfini sans croches, et le swing par part.**
La walking de e05 exige `swingRatio ≈ 1` sur des **noires** — aucun contretemps : division par rien. Et dans les Part[] (e12/e13), le swing se mesure par part, pas globalement.
*Patch* : sans croches de contretemps, le ratio rend `n/a` (la contrainte ≈1 passe si l'inégalité est absente) ; `swingTarget` devient scopable **par part**. +4 fixtures.

**F-45 — « Se poser » : la définition mécanique de l'avoid note.**
« Les avoid notes passent et ne se posent pas » — mais le checker ne savait pas chiffrer *posée*.
*Définition actée* : posée = **sur temps fort OU durée ≥ noire OU quittée par saut** ; passante = temps faible, brève, quittée par degré. `chordScaleCheck` l'applique ; le feedback cite la règle en ces termes. +5 fixtures (le fa sur Cmaj7 dans ses quatre vies).

## 74.2 Les solutions

**m08-s01** *(e01 — le temps d'abord, fa pentatonique, 8 mes., `swing: {ratio: 2.0}` F-43)*
```
r:e F4:e A4:e G4:e F4:q r:e C4:e~ | C4:e D4:e F4:q~ F4:e G4:e r:e A4:e~ |
A4:e G4:e F4:q r:q D4:e C4:e | F4:q. G4:e A4:q r:e C5:e~ |
C5:e A4:e G4:q F4:q r:e D4:e | F4:q~ F4:e D4:e C4:q r:e F4:e~ |
F4:e G4:e A4:q G4:e F4:e D4:e C4:e | F4:h. r:q
```
6 hauteurs ✓ ; **anticipations** : « et de 4 » lié au temps 1 suivant ×4 (m1, 2, 4, 6 — taguées) ≥ 3 ✓ ; accents : vélocités 92 sur les « et » / 68 sur les temps (corrélation inversée 0.71 ✓) ; **laid-back déclaré** : m5 temps 1 (+22 ticks, champ dédié) ✓ ; swingRatio mesuré 2.0 ∈ [1.6, 2.4] ✓. *Les trois strates rendues.*

**m08-s02 ×2** *(e02 — la grille Dm7·G7·Cmaj7 ×2, Gm7·C7·Fmaj7, Em7♭5·A7alt·Dm, 12 mes.)*
*(1) shells* : `[D2+F3+C4] [G2+F3+B3] [C3+E3+B3]` … — permutations 3-7/7-3 alternées, tag `shell-voicing` ✓, la quinte absente partout ✓.
*(2) rootless A/B* : `Dm7ᴬ [F3+A3+C4+E4] → G7ᴮ [F3+A3+B3+E4] → Cmaj7ᴬ [E3+G3+B3+D4]` … ; le mineur : `Em7♭5 [G3+Bb3+D4+F4] → A7alt [G3+Bb3+C#4+F4] → Dm69 [F3+A3+B3+E4]` — **altéré vers le mineur** ✓ ; smoothness mesurée **0.9 dt/voix/transition ≤ 1.5** ✓. *« Ta main n'a pas bougé de plus d'un ton sur 12 mesures. »*

**m08-s03** *(e03 — la tournée des formes, 16 mes., rootless en zone)*
m1–3 ii-V-I majeur ✓ · m4–6 ii-V-i mineur (A7alt ✓) · m7–8 **chaîne tronquée descendante** Em7-A7 → Dm7-G7 (2 maillons ✓) · m9–10 **back-door** Fm7-B♭7 → Cmaj7 ✓ · m11–12 respiration (I-vi) · m13–16 **turnaround** C-A7 | Dm7-G7 → C ✓. Chaque cellule taguée et nommée — *la grille lue en unités* ; smoothness ✓, cible d'or (la 3 du I) tenue aux trois arrivées ✓.

**m08-s04 ×2** *(e04 — le blues en fa, chorus AAB, `swing: 2.0`)*
```
A  : r:e F4:e Ab4:s A4:e. C5:q r:q Eb4:e F4:e~ | F4:q r:h r:e C4:e | (le trou)
A' : r:e Bb3:e Db4:s D4:e. F4:q r:q Ab4:e Bb4:e~ | Bb4:q r:h r:e F4:e | (la re-dite sur IV)
B  : C5:e Bb4:e A4:e F4:e Ab4:s A4:e. F4:e~ | F4:e Eb4:e C4:q F4:h |  (+ ponts m11–12)
```
**2 blue notes pliées** (A♭→A en acciaccature, m1 et m9 — taguées) ✓ ; la re-dite = variation **tonale** du motif (`findMotifs` F-12 ✓) ; le choix déclaré : **suivi des changements** ; trous mesurés 38 % ✓ — *« le dialogue respire »*. *(Variante mineur)* : grille de fa mineur canonique, ligne sur la blues mineure, **C7alt en cadence** (l'altéré vérifié, ≥ 2 altérations exposées puis résolues) ✓.

**m08-s05** *(e05 — la walking du blues, noires droites ; témoin F-44)*
```
F2 A2 C3 B2 | Bb2 D3 F3 Gb3 | F3 Eb3 D3 Db3 | C3 Eb3 F3 A2 |
Bb2 D3 Eb3 E3 | B2 D3 F3 Ab3 | A3 G3 F3 Eb3 | A2 C3 D3 F#3 |
G2 Bb2 D3 F3 | C3 E3 G3 Gb3 | F3 A3 D3 F#3?? → F3 A3 D3 C#3 | G2 Bb2 C3 E3
```
*(m11 corrigé en composition : C♯3 approche le ré du turnaround — F♯3 doublait l'approche de m8, la marche bégayait ; `authorNotes`)*. Temps 1 tous harmoniques ✓ ; **5 approches chromatiques** (B2, G♭3, D♭3, E3, C♯3) ≥ 4 ✓ ; 3 patterns identifiés (scalaire, arpège, descente chromatique) ✓ ; arche de registre F2→A♭3 (10e ✓, en vagues) ; **swingRatio : n/a sur noires — la contrainte ≈ 1 passe (F-44)** ✓. **Le juge double** : Fux (3e espèce : conjoint 0.72, sauts récupérés, la ligne chante) ET jazz (cible→approche→chemin) — *les deux mondes notent la même marche, deux rapports fusionnés* ✓.

**m08-s06** *(e06 — la carte en acte ; grille : Dm7-G7 | C | Bm7♭5-E7alt | Am | B♭7ˢᵘᵇ | C-C♯°7 | Dm7-G7alt | C)*
La ligne pense **horizontal** sur m1–2 et m4 (do majeur qui coule, `chordScaleCheck` : diatonique ✓), **vertical** aux spéciaux : E7alt — **F♮ et C♮ exposés** (2 altérations ≥ 2 ✓) puis retombée sur A diatonique au temps suivant (le clair-obscur vérifié ✓) ; B♭7 en lydien ♭7 (le A♭ posé — légal chez lui) ; C♯°7 en passage ; G7alt final. Guide tones aux 6 changements ✓ ; le fa sur Cmaj7 : **passant uniquement (F-45)** ✓. *La carte colorée, superposée à l'itinéraire.*

**m08-s07** *(e07 — le vocabulaire bebop, 8 mes.)*
**3 enclosures** taguées (diatonique sur la 3 de C m2 ; **chromatique double** D♭-B→C sur la 3 de... la cible G7→C m4 ; diatonique m7) ✓ ; **la gamme bebop dominante** : le passage F♯ entre F et G sur G7, m5–6 — descente d'octave, **notes d'accord sur les quatre temps** (vérifié tick à tick) ✓ ; toutes les phrases partent en levée (« et de 1 » ou « et de 4 » ✓) ; contraste plein/posé : écart-type de densité 2.8 (m5 : 8 attaques ; m6 : 2) ✓ ; `swingTarget`+`chordScaleCheck` verts. *« Enclosure double sur la 3 de C, m.4 ✓ — le langage est parlé. »*

**m08-s08** *(e08 — la ballade, 16 mes., ♩=60, `swingTarget [1.3, 2.6]`)*
**3 intercalations** taguées : C♯°7 passant (m2), F♯m7♭5-B7 en une mesure (m6), A♭7 back-door (m13) ✓ ; **spreads** : ambitus vertical moyen 2,3 octaves (MG dixièmes C2–E3, MD tensions E4–D5) ✓ ; **line cliché** sur le pont (Am tenu : A–G♯–G–F♯ en voix interne, taguée — la promesse de l22 M1 au ralenti) ✓ ; **cadence retardée** : l'évitement V→vi (m14, tagué) avant la vraie résolution m16 — *« ta cadence a mis 6 mesures à arriver »* ✓ ; mélodie : tenues vivantes (`dyn[]` F-39 — troisième service du checker CC ✓), **2 fills** dans les trous (activité complémentaire ✓) ; swing élastique mesuré 1.5 ✓.

## 74.3 Bilan du lot

| Livré | 10 volets (s01→s08) — le temps, les deux mains, toutes les formes de la cellule-mère, le blues et sa marche, la carte chord-scale, le bebop, la ballade |
|---|---|
| Findings | **F-43** (rendu swing déterministe — le jumeau systématique de F-35), **F-44** (ratio n/a + swing par part), **F-45** (« se poser », chiffré) |
| Constats | le juge double (s05) fonctionne sans friction — le legs M4 paie ; les recyclages annoncés (prosodie inversée, findMotifs, CC/dyn) tiennent tous ; coût ~20–30 min/volet (le jazz écrit est du solfège rapide une fois le swing compilable) |
| Ordre des PR | **F-43** (compilateur+parseur) → F-44/F-45 → les 10 volets |
| État M8 | **10/22** — reste le lot final : s09 ×2 (les trois vies harmoniques d'Elena), s10 (le chorus double), s11 (le modal), s12 (big band), s13 (combo), s14 ×3 (les trois distances), s15 ×3 (« le standard ») |
| Cumul projet | **156 solutions** · **45 findings** |

---

**Point de confirmation.** Le socle du langage est solutionné et le swing est compilable. Le lot final de M8 : **(a)** s09→s15 — la réharmonisation d'Elena (le fil en apothéose harmonique), le chorus qui se souvient, le vamp modal, les deux machines (big band, combo), les trois distances à l'image, et « le standard » qui complète le portfolio (4/4) ; **(b)** intercaler M10. Ma recommandation : **(a)** — clore le dernier module de composition. Je termine M8 ?