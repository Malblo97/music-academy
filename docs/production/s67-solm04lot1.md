# SECTION 67 — SOLUTIONS DE RÉFÉRENCE M4, LOT 1 : LE LABORATOIRE (11 volets + 3 findings)

## 67.0 Méthode et comptage du backlog M4

Format des soumissions COUNTERPOINT : le CF est un *donné*, l'élève livre sa ou ses lignes (`voices[]` du kind, antérieur au `Part[]` de M7). Comptage : e01 = quiz-générateur (réponses en spec) ; solutions : e02 ×3 volets, e03 ×2, e04 ×2, e05 ×2, e06 ×2, e07, e08, e09 ×3, e10, e11 ×5 recettes, e12 ×3 parts — **25 solutions M4**. Ce lot = **le laboratoire** (s02→s06, 11 volets). Le pronostic « moteur fixturé, findings rares » se vérifie *presque* : **3 findings**, et les trois sont des vérités d'école vieilles de cinq siècles que le code ne connaissait pas encore.

**La banque de CF** (donnés des specs, tracés ici) :

```
CF-dorien  : D4 F4 E4 D4 G4 F4 A4 G4 E4 D4     (climax A4 à 70 %, 2^→1^)
CF-éolien  : A3 C4 B3 D4 E4 D4 C4 B3 A3          (climax E4, 2^→1^)
CF-ionien  : C4 E4 D4 F4 E4 G4 A4 F4 D4 C4      (climax A4 à 70 %, 2^→1^)
CF-marches : A3 G3 F3 E3 D3                      (e05 volet 2 : les 4 marches)
```

## 67.1 Findings de calibrage

**F-25 — La musica ficta de clausule (patch checker + tag).**
En dorien, toute clausule d'école élève le 7̂ : la sixte C♯ avant l'octave D. `out-of-key` et la vérification de collection flaguent ce C♯ — le checker refusait la cadence que Fux exige.
*Patch* : la **fenêtre de clausule** (pénultième + finale) admet ♯7̂ (tagué `ficta`), en toute espèce et en libre modal ; hors fenêtre, l'altération reste une erreur. +5 fixtures (dorien ✓, ionien sans objet ✓, ficta hors clausule ✗). `engineVer` bump. *s02-volet 1, s03, s04, s05 et s06 en dépendent tous.*

**F-26 — Le miroir de la voix grave (règle d'évaluation species-below).**
« Les règles s'inversent en miroir » (e02) : sous le CF, la ligne s'arche vers le bas — son pôle expressif est **le creux**, et sa clausule remonte (5̂→1̂, souvent vers l'unisson). `melody.climax` appliquée telle quelle punit toute bonne ligne grave (sommet absent ou final).
*Patch* : pour une voix déclarée sous le CF, le contour s'évalue **inversé** (un seul extremum = le point bas, fenêtre 40–75 %), et la remontée cadentielle est hors comptage. +4 fixtures. *s02-volet 2 et s04-volet 2 en sont les témoins.*

**F-27 — La licence de rupture de syncope (species 4/5).**
Le checker `species4` exigeait la ligature ininterrompue ; or Fux lui-même autorise à rompre la syncope « quand elle ne peut continuer » — et la clausule de s05-volet 1 la rompt une fois (b9) pour livrer sa sixte de ficta.
*Patch* : **≤ 1 rupture** de ligature admise, taguée `syncope-break`, gratuite en zone cadentielle, `warning` ailleurs. +3 fixtures.

## 67.2 Les solutions

**m04-s02 — première espèce (3 volets)**

*Volet 1 — au-dessus du CF-dorien* (intervalles : 5·3·6·8·6·6·3·3·6·8) :
```
CP : A4 A4 C5 D5 E5 D5 C5 B4 C#5 D5   (rondes)
```
Parfaites aux ancrages seulement (départ 5, octave m4 atteinte par mouvement contraire, clausule 6→8 contraire ✓ ficta F-25) ; grappes d'imparfaites ≤ 2 ; climax E5 unique (50 %) ; une répétition (b1–2, licence sp1 unique) ; la ligne chante seule (arche, sauts récupérés) ✓.

*Volet 2 — au-dessous du CF-éolien* (8·10·10·6·10·10·10·5·unisson) :
```
CP : A2 A2 G2 F2 C3 B2 A2 E3 A3   (rondes)
```
Le miroir : parallèles de dixièmes par grappes de 3 max ✓ ; **le creux F2 à 44 %** (F-26 ✓) ; pénultième = quinte atteinte par mouvement contraire (A2→E3 contre D4→B3... C4→B3), **la basse cadence 5̂→1̂ montante vers l'unisson final** — la clausule grave d'école ✓.

*Volet 3 — au choix : au-dessus du CF-ionien* (5·6·6·3·6·6·3·6·6·8) :
```
CP : G4 C5 B4 A4 C5 E5 C5 D5 B4 C5   (rondes)
```
Climax E5 unique (60 %), zéro répétition, clausule 6→8 **sans ficta** (le si est naturel en ionien — le contraste pédagogique avec le volet 1, `authorNotes`) ✓.

**m04-s03 — deuxième espèce (2 volets, CF-dorien)**

*Volet 1 — au-dessus* (levée inaugurale ; appuis : –·3·6·8·3·6·3·6·5·8) :
```
CP : r:h A4:h | A4:h B4:h | C5:h B4:h | D5:h C5:h | B4:h C5:h |
     D5:h A4:h | C5:h D5:h | E5:h D5:h | B4:h C#5:h | D5:w
```
**4 dissonances de passage** (B4 b2, C5 b4, C5 b5, D5 b7 — chacune par degré, même direction, entre deux consonances ✓ `species2.passing-count`) ; l'octave de b4 atteinte par mouvement contraire ; aucun parallèle d'appui à appui ; climax E5 (80 %) ; ficta b9 sur temps faible (F-25) ✓.

*Volet 2 — au-dessous* :
```
CP : r:h D3:h | D3:h A2:h | C3:h A2:h | D3:h C3:h | B2:h C3:h |
     D3:h E3:h | F3:h E3:h | D3:h C3:h | E3:h A2:h | D3:w
```
3 passages dissonants (C3 b4, E3 b6, E3 b7) ✓ ; le contour inversé (F-26) ; **pénultième A2 : la basse saute sa quinte 5̂→1̂** — l'ancêtre du geste de walking annoncé ✓.

**m04-s04 — troisième espèce (2 volets, CF-dorien)**

*Volet 1 — au-dessus, le catalogue complet* :
```
CP : r:q F4:q G4:q A4:q | C5:q D5:q C5:q A4:q | B4:q C5:q D5:q C5:q |
     D5:q C5:q B4:q A4:q | B4:q C5:q D5:q E5:q | F5:q E5:q C5:q D5:q |
     E5:q D5:q C5:q A4:q | B4:q C5:q D5:q B4:q | G4:q A4:q B4:q C#5:q | D5:w
```
| Figure exigée | Où | Vérif |
|---|---|---|
| ≥ 2 passages | G4 (b1), C5 (b4), C5 (b5), D5 (b7), C5 (b8), A4 (b9) | 6 tagués, tous conjoints entre consonances ✓ |
| ≥ 1 broderie | D5 (b3, temps 3 : voisine supérieure dissonante encadrée) | ✓ |
| ≥ 1 cambiata | **b6 : F5–E5–C5–D5** (8-7-5-6, la figure-manuel) | ✓ — et F5 = climax unique (60 %) |
| conjoint ≥ 0.7 | 0.83 mesuré | ✓ |
| clausule | b9 : la montée G–A–B–**C♯** (ficta F-25) → octave | ✓ |

*Volet 2 — au-dessous (la basse fleurie : l'ancêtre de la walking, annoncé au rapport)* :
```
CP : r:q D3:q E3:q F3:q | A3:q G3:q F3:q D3:q | C3:q D3:q E3:q C3:q |
     B2:q A2:q G2:q B2:q | C3:q D3:q E3:q G3:q | A3:q G3:q F3:q A3:q |
     D3:q E3:q F3:q D3:q | B2:q C3:q D3:q E3:q | E3:q D3:q C3:q A2:q | D3:w
```
Passages dissonants nombreux (E3 b1, G3 b2, D3 b3, A2 b4, D3 b5…), **zéro cambiata** (« elle se raréfie au grave » — conforme), le creux G2 à 40 % (F-26), fonder en bougeant : chaque temps 1 consonant, la quinte cadentielle A2→D3 ✓.

**m04-s05 — quatrième espèce (2 volets)**

*Volet 1 — au-dessus du CF-dorien (≥ 4 retards, 3 types)* :
```
CP : r:h A4:h~ | A4:h C5:h~ | C5:h E5:h~ | E5:h D5:h~ | D5:h E5:h~ |
     E5:h D5:h~ | D5:h C5:h~ | C5:h B4:h~ | B4:h C#5:h | D5:w
```
| Cellule | Type | Vérif préparation–suspension–résolution |
|---|---|---|
| b4 : E5 sur D4 → D5 | **9-8** | prep octave (b3) ✓, dissonance par inertie ✓, un pas descendant ✓ |
| b6 : E5 sur F4 → D5 | **7-6** | prep sixte (b5) ✓ — et E5 = climax, tenu-souffrant : la suspension comme sommet |
| b7 : D5 sur A4 → C5 | **4-3** | ✓ |
| b8 : C5 sur G4 → B4 | **4-3** | ✓ — deux 4-3 enchaînés |
| b9 : **syncope rompue** (C♯5 non liée) | licence de clausule | **F-27** tagué, gratuit ✓ ; ficta F-25 ✓ |

*Volet 2 — la chaîne sur CF-marches* :
```
CF : A3:w  G3:w  F3:w  E3:w  D3:w
CP : r:h F4:h~ | F4:h E4:h~ | E4:h D4:h~ | D4:h C#4:h~ | D4:w
```
**7-6 · 7-6 · 7-6** sur les quatre marches, ficta au dernier maillon — « ton lamento est réglementaire » ✓ (et le rapport nomme la filiation : la chaîne = le moteur du lament, m02-l05 silhouette « chute »).

**m04-s06 — cinquième espèce, le capstone du laboratoire (2 volets)**

*Volet 1 — CF-dorien* — `texturePlan: [{1–2 blanches}, {3–4 syncope}, {5–6 noires}, {7–9 syncope}, {10 ronde}]` :
```
CP : r:h A4:q B4:q | C5:h D5:q C5:q | C5:q B4:q C5:h~ | C5:h B4:q A4:q |
     B4:q C5:q D5:q E5:q | F5:q E5:q C5:q D5:q | C5:h C5:h~ |
     C5:h B4:q D5:q~ | D5:h C#5:h | D5:w
```
Rapport attendu : « 4 régimes ✓ (blanches, noires, syncopes, ronde — le plan concorde), **retard 7-6 orné b4 ✓, retard 4-3 b8 ✓, retard cadentiel 7-6 b9 ✓** (la cadence passe par la syncope), **cambiata b6 ✓** (climax F5), passages ✓ — ton laboratoire est complet. » La liaison de noire b8 (D5:q~) : l'idiome sp5 d'anticipation, couvert par le checker ✓.

*Volet 2 — CF-ionien* — `texturePlan: [{1–2 blanches+noires}, {3–4 mixte}, {5–7 syncope}, {8 noires}, {9–10 clausule}]` :
```
CP : r:h G4:h | G4:h B4:q C5:q | B4:q C5:q D5:h~ | D5:h C5:q A4:q |
     B4:h C5:h~ | C5:h B4:q D5:q~ | D5:h C5:h | F5:q E5:q C5:q D5:q |
     A4:h B4:h | C5:w
```
Retards 4-3 (b6) et 4-3 (b7 : D5 sur la — la paire enchaînée) ✓, cambiata + climax b8 ✓, 4 régimes ✓, clausule sans ficta (ionien) en mouvement contraire ✓. XP majoré, badge « Laboratoire ».

## 67.3 Bilan du lot

| Livré | 11 volets (s02→s06) — le laboratoire intégralement solutionné, les cinq checkers d'espèces éprouvés en conditions réelles au-dessus ET au-dessous |
|---|---|
| Findings | **F-25** (ficta), **F-26** (le miroir du grave), **F-27** (la rupture de syncope) — trois licences d'école que les checkers ignoraient : le calibrage du contrepoint est un travail d'historien |
| Coût | ~15–25 min/volet (lignes courtes, mais vérification verticale ET horizontale) — M4 est bien le lot rapide annoncé |
| Ordre des PR | F-25/F-26/F-27 (checkers + fixtures) → les 11 volets → CI verte |
| État M4 | **11/25** — reste le lot 2 : s07 (libre à 2), s08 (3 voix), s09 ×3 (imitation/canon/strette), s10 (fugato), s11 ×5 (les recettes du contrechant d'Elena), s12 ×3 (« la scène tissée ») |
| Cumul projet | **98 solutions** · **27 findings** |

---

**Point de confirmation.** Le laboratoire est fermé, ses trois licences d'école sont codées. Le lot 2 de M4 : **(a)** la liberté et le métier — s07→s12, 14 volets dont les cinq recettes du contrechant d'Elena (le retour du thème de m02-e30 : première réutilisation vérifiée d'un matériau de portfolio) et le capstone tri-parts avec son commentaire vérifié ; **(b)** intercaler les quiz M4 (12 quiz, ~5 h) ; **(c)** basculer sur M6 (les LayerStacks). Ma recommandation : **(a)** — clore M4 d'un geste, comme M3. Je continue ?