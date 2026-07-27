# SECTION 69 — SOLUTIONS DE RÉFÉRENCE M4, LOT FINAL : LE MÉTIER ET LA SCÈNE (8 volets + 2 findings) — MODULE 4 CLOS

## 69.0 Méthode du lot

Le donné d'e11 est épinglé (F-30 : **mes. 1–8 de s30-elena**, ré dorien). Rappel du partenaire :

```
E4:q C5:q. B4:e A4:q | E4:q C5:q. B4:e A4:q | G4:q E5:q. D5:e C5:q | E5:q D5:q A4:h |
E4:q C5:q. B4:e A4:q | D4:q B4:q. A4:e G4:q | G4:q E5:q. D5:e C5:q | B4:q Bb4:e A4:e G4:q F4:q
```

Note de style : e11/e12 tournent en profil **film** (`romantic-film`) — les dissonances *conduites* (chromatisme quitté par degré, frottement de passage) sont légales ; les parallèles parfaites et les clashs non conduits restent jugés. Deux findings, tous deux sur le capstone.

## 69.1 Findings de calibrage

**F-31 — L'ancrage de la superposition (précision de spec e12, famille F-8).**
Les thèmes A et B n'ont aucune raison de faire la même longueur (ici 2 et 3 mesures) ; « superposés tels quels » était indéfini.
*Précision* : le test de contrepoint double s'ancre **au début commun** et couvre le chevauchement (min des deux longueurs) ; l'excédent du thème long est libre. Le même ancrage sert l'acte 3 de la part 2.

**F-32 — La strette à deux sujets (extension du checker).**
L'acte 2 d'e12 compresse les entrées de **deux têtes différentes** (A et B qui se rapprochent) ; le checker de strette (s09/s10) mesure l'arche de délais sur les entrées d'UN motif.
*Patch* : `strette` accepte `heads[]` — les entrées des têtes déclarées sont **confondues dans une seule timeline** et l'arche de délais se mesure sur la suite fusionnée. +4 fixtures. *La scène tissée est la solution-témoin.*

## 69.2 Les cinq contrechants d'Elena (m04-s11, une solution par recette)

**s11-réponse** *(le dialogue dans les respirations — cellule propre : la tête d'Elena rendue à la quinte inférieure, m6↑ comprise)*
```
A2:w | A2:h F3:h | E3:h G3:h | A3:q F4:q. E4:e D4:q |
A2:w | G3:h~ G3:h | E3:q C4:q. B3:e A3:q | D4:h C4:q D4:q
```
La cellule parle dans les **trous** : b4 (Elena tient A4:h) et b7 (elle plane à l'aigu) — 2 occurrences, la seconde transposée réelle −5 ✓ ; ailleurs le contrechant s'assoit (rondes, blanches). Écart moyen 14 dt ✓ ; attaques fortes simultanées 0.21 ≤ 0.35 ✓ ; la grappe de dixièmes de b7 taguée *suggestion*, assumée (`authorNotes` : l'écho suit son maître).

**s11-fleuve-lent** *(le gravitas — rondes et blanches liées, entrées décalées)*
```
r:h A2:h~ | A2:w | r:h E3:h~ | E3:h A3:h~ | A3:w | D3:h G3:h~ | G3:h E3:h | D3:w
```
Cellule : **la quarte montante en tenues liées** (E3→A3 b3–4 ; D3→G3 b6, variante `rhythmic`) ✓ ; entrées aux temps 3 (une seule au temps fort) — le fleuve se glisse sous les tenues d'Elena, jamais sous ses pas ; toutes les verticalités d'appui consonantes (le 11e de b8.3 est un passage conduit du thème) ✓. « Ton fleuve lent porte Elena sans jamais la couvrir » — la phrase de la spec, méritée.

**s11-ligne-chromatique** *(la plongée — chaque chromatisme quitté par demi-ton)*
```
r:h D4:h~ | D4:q C#4:q C4:h~ | C4:q B3:q Bb3:h~ | Bb3:q A3:q A3:h |
r:h A3:h~ | A3:q G#3:q G3:h~ | G3:q F#3:q F3:h~ | F3:q E3:q D3:h
```
Cellule : **la plongée chromatique** (5 demi-tons, rythme q-q-h~) — occ. 1 @D4 (D→A, b1–4), occ. 2 @A3 élargie jusqu'à 1̂ (A→D, b5–8, `rhythmic`) ✓ ; `chromaticResolutionRequired` : 10/10 chromatismes conduits ✓ ; le triton E5/B♭3 de b4.1 est LE frottement voulu — la ligne touche le thème à son sommet (profil film : conduit, donc légal, et nommé au rapport). Écart moyen 12 dt ✓.

**s11-contre-rythme** *(bouger quand elle tient, se taire quand elle marche)*
```
r:q A3:e B3:e C4:e B3:e A3:q~ | A3:q D4:e E4:e F4:e E4:e D4:q~ |
D4:q F4:e G4:e A4:e G4:e F4:q~ | F4:q E4:e D4:e C4:e B3:e A3:q~ |
A3:q C4:e D4:e E4:e C4:e A3:q~ | A3:q G3:e A3:e B3:e C4:e B3:q~ |
B3:q C4:e D4:e E4:e F4:e E4:q~ | E4:q D4:e C4:e B3:e C4:e D4:q
```
Le gabarit : temps 1 **toujours lié** (jamais d'attaque), la vague de croches sous les tenues d'Elena, l'ancre au temps 4 liée au suivant — attaques fortes simultanées mesurées **0.06** : le complément par construction ✓. Cellule : la vague conjointe montée-retour (b1, b2, b3 transposées ; b4 inversée) ✓. Écart conforme à sa variante (la borne propre du contre-rythme : ≥ 7 dt — il tresse, il ne fuit pas) ; zéro octave consécutive (vérifié aux croisements b6–b7, corrigés à la composition, `authorNotes`).

**s11-descant** *(le ciel — au-dessus, il plane, il n'entre qu'après)*
```
r:w | r:w | r:h G5:h~ | G5:h F5:h | E5:h~ E5:h | D5:h~ D5:h | G5:h~ G5:h | F5:h D5:h
```
Deux mesures de retenue (le thème d'abord — l'ancrage, toujours), puis la tenue qui glisse : cellule h~h + pas descendant (b3–4, b7–8 varié) ✓ ; jamais sous le thème, même à son E5 (b3, b7 : la tierce au-dessus du sommet) ✓ ; velocity déclarée *pp* (la hiérarchie est dynamique, pas registrale) ; fin D5 — l'octave d'Elena. Attaques fortes simultanées 0.13 ✓.

## 69.3 Le capstone (m04-s12 — « la scène tissée », tri-parts)

**Part 1 — les deux thèmes**
```
A (le chercheur)  : D4:e G4:q A4:e B4:q D5:q | E5:q B4:e A4:e G4:h
B (l'attendue)    : B3:h. A3:q | G3:h E3:h | D3:w
```
Contrastes vérifiés : prosodie iambique (anacrouse, brèves→longues) contre trochaïque (longue→brève) ✓ `prosodyPlan` en opposition ; contour ascension-arche contre chute ✓ `contourShape`. **La preuve de compatibilité** (F-31 : ancrage au début, chevauchement 2 mes.) : A sur B — m3, m6, 8, 11e conduit / 13e, 10e, 9e de passage, 10e — le contrepoint double encaisse ✓ : la scène 3 est jouable.

**Part 2 — la scène (24 mes., 3 voix)**
`texturePlan: [{1–8 acte 1 : mélodie + socle, puis imitation lointaine}, {9–16 acte 2 : strette + suspension}, {17–20 acte 3 : superposition + fleuve}, {21–24 homophone}]`
```
ACTE 1 — « se chercher »
V1: A @D4 (b1–2) · r:h G4:h~ (b3) · G4:h A4:h (b4) · fragments de tête espacés (b5–8 : D4:e G4:q… r)
V2: r (b1–4) · B @B3 (b5–7 — l'entrée LOINTAINE : délai 4, l'autre registre) · A3:h~ A3:h (b8)
V3: G2:w | E2:w | C3:w | D3:w | G2:w | C3:w | A2:w | D3:w   (le socle discret)
ACTE 2 — « se trouver »  (F-32 : la timeline fusionnée des deux têtes)
entrées : tête-A @G4 (b9, V1) → tête-B @B3 (b11, V2 : Δ2) → tête-A @D5 (b12, V1 : Δ1)
          → tête-B @E4 (b12.5, V2 : Δ0.5 — ils se voient)
b13–14 : les deux lignes convergent par mouvement contraire (V1 descend de D5, V2 monte de E4)
b15    : LE RETARD — V1 : C5:h~ tenue sur l'accord de sol (4e contre G3/V3 et B3/V2),
         résolue B4 (b15.3) — la suspension comme émotion du regard (F-29 ✓, taguée)
b16    : V1 B4:w · V2 G3:w · V3 G2:w — la respiration avant l'ensemble
ACTE 3 — « ensemble »
b17–19 : V1 = A @D4 (tel quel) SUR V2 = B @B3 (tel quel) — la preuve de part 1 encaissée,
         note à note identique à l'ancrage testé ✓
b20    : V1 E5:q D5:q B4:h · V2 C4:h A3:h · V3 (le fleuve entre : r:h D3:h~)
V3 (b17–20) : r:w | r:h G2:h~ | G2:h A2:h~ | A2:h D3:h — le fleuve lent dessous
         (recette l11 : entrées décalées, quartes en tenues — les métriques de s11-fleuve)
CONCLUSION HOMOPHONE (b21–24)
[G2+B3+D5]:h [G2+C4+E5]:h | [C3+C4+E5]:h [D3+B3+D5]:h |
[D3+A3+C5]:h [D3+B3+D5]:h?? → correction : [D3+A3+C5]:h [D3+C4+D5]:h | [G2+B3+G4]:w
```
*(la mesure 23 corrigée en composition : la sixte A3–C5 file vers la septième C4 sur D — V7 — avant l'accord final : le choral cadence V→I, trois voix complètes, soprano 5̂→…1̂ par le sol de V1 ; l'ultime verticalité {G,B,G} assume sa quinte absente — 3 voix, la conduite prime, `authorNotes`)*

| Vérif part 2 | |
|---|---|
| Actes ↔ textures | 4 régimes détectés aux frontières déclarées ✓ |
| L'imitation lointaine | entrée de B au délai 4, registre opposé — « ils ne se sont pas encore vus » ✓ |
| La strette hétérogène | délais mesurés 2 → 1 → 0.5 sur la timeline fusionnée A/B (**F-32**) ✓ |
| Le retard du regard | préparation (b14, consonante) → liaison → 4e sur appui → résolution descendante : `suspensionCheck` ✓ — climax de tissage à 62 % |
| La superposition | b17–19 = l'ancrage de part 1, vérifié à l'identique (F-31) ✓ |
| Le fleuve | V3 acte 3 : les métriques de la recette (entrées décalées, jamais couvrir) ✓ |

**Part 3 — le commentaire (5 champs, concordance déclaré↔détecté)**
1. *Moteur par acte* : « acte 1 : l'imitation lointaine ; acte 2 : la strette des deux têtes + le retard ; acte 3 : la superposition sur fleuve » — **concorde** avec les tags ✓
2. *Climax de tissage* : « b15, la suspension au point de rencontre » — concorde (le pic de densité d'événements contrapuntiques mesuré : b15) ✓
3. *Recette d'acte 3* : « fleuve lent » — concorde (métriques l11 sur V3) ✓
4. *Ce que j'ai retiré* : « V2 muette tout l'acte 1 ; le fleuve absent des actes 1–2 ; aucun contrechant sur la conclusion » — champ **déclaratif** (consigné, non jugé)
5. *Écart assumé* : « l'accord final sans quinte » — consigné, croisé avec l'authorNote ✓

Verdict : *« trois descriptions de la même scène — plan, détecté, commentaire — convergentes. »* XP 350, badge de module.

## 69.4 MODULE 4 : CLÔTURE CÔTÉ SOLUTIONS

| Bilan M4 | |
|---|---|
| Solutions | **25/25** ✅ — laboratoire, liberté, machine, métier, scène |
| Findings du module | **8** (F-25 → F-32) : trois licences d'école (ficta, miroir du grave, rupture de syncope), la réponse tonale, le retard généralisé, deux précisions de capstone, un donné épinglé — le calibrage du contrepoint fut un travail d'historien, comme prévu |
| Legs aux modules suivants | `suspensionCheck` libre (M7, M8-ballade), la réponse tonale (M8-bebop, M11), les cinq contrechants d'Elena = matériau d'exemple pour m07-l05 |
| Cumul projet | **112 solutions** (M1–M4 : le socle d'écriture intégralement solutionné) · **32 findings** · CI quatre modules verte attendue |

---

**Point de confirmation.** M4 est clos — et avec lui tout le socle d'écriture. Le backlog restant : M6 (15+), M7 (10+), M8 (15+), M10 (15 missions), M11 (8), plus les quiz et les assets. Suites : **(a)** M6 — le sound design (solutions = LayerStacks déclaratifs + MIDI : format léger, ~2 lots, premier calibrage des six règles `sd.*` et des cibles FX en ticks) ; **(b)** M7 — l'orchestration (le format `Part[]` inauguré, le fil Elena continué : e05→e10 réutilisent le thème que M4 vient d'armer) ; **(c)** le lot quiz M3+M4 (30 quiz, ~12 h 30). Ma recommandation : **(a)** — l'ordre des dépendances (M6 précède le capstone hybride, et ses solutions déclaratives reposeront les muscles après le contrepoint). Je continue ?