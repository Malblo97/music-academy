# SECTION 64 — SOLUTIONS DE RÉFÉRENCE M3, LOT 2 : LE SYSTÈME 2 + LES PORTES RESTANTES (10 solutions + 2 findings)

## 64.0 Méthode du lot

Protocole inchangé. Ce lot solde d'abord les **variantes restantes du système 1** (s05 ×2, s06a, s07b), puis déroule le **modal** (s08 ×4, s09, s10) — le premier terrain d'épreuve de `pillarExposure`, `forbidFunctionalCadence` et `detectCollection`. Rendement : **2 findings / 10 solutions** — le taux baisse, et c'est la bonne nouvelle : le moteur mûrit (les patchs F-15→F-18 ont porté ; aucune friction de conduite des voix n'est réapparue).

## 64.1 Findings de calibrage

**F-19 — L'ancrage modal par insistance (correction d'ordre dans `estimateKey`).**
La collection de sol mixolydien EST la collection de do majeur. Sur s08-mixolydien, Krumhansl répond « do majeur, confiant » → la passe modale n'a rien à corriger (elle raffine une tonique, elle n'en change pas), `pillarExposure` s'évalue contre le mauvais 1̂, et la cadence modale ♭VII→I (F→G) se fait enregistrer comme **demi-cadence en do** (IV→V !).
*Patch* : en présence des marqueurs d'insistance (basse/bourdon dominant ≥ 50 % de la durée, première ET dernière fondamentale identiques, appuis métriques), la passe modale **ancre la tonique sur l'insistance AVANT la corrélation** — la corrélation ne départage plus que le mode au-dessus de cette tonique. +6 fixtures (les 4 séjours de s08 + 2 négatives : une vraie pièce en do qui pédale sur sol ne doit PAS devenir du mixolydien — le critère : l'insistance sans les piliers ne suffit pas). `engineVer` bump. *s08-mixolydien est la solution-témoin.*

**F-20 — `detectCollection` gagne la famille « mineur mélodique ».**
Le contrat §40.1 listait pentatonique, tons entiers, octatonique, chromatique, diatonique. Or e09 exige `requireCollection` sur **sol lydien ♭7** — une rotation de ré mineur mélodique, absente du détecteur.
*Patch* : ajout de la collection « melodic-minor » (les 7 rotations partagent le même ensemble de pitch-classes, comme la famille diatonique) ; l'étiquetage du mode précis (lydien ♭7 / altéré / locrien ♮2) passe par l'ancrage F-19. +4 fixtures. *s09 est la solution-témoin.*

**Note d'écriture (extension du champ de F-18, pas un finding)** : tout bourdon ou pédale d'une solution **se déclare en `pedalPlan`**, même intégralement « compatible » — sinon l'exclusion de F-18 ne s'applique pas et le dictionnaire lit des accords fantômes. Ajouté au README des solutions ; les six séjours modaux de ce lot le respectent.

## 64.2 Les variantes restantes du système 1

**m03-s05-dim7** *(e05, variante `dim7` — le frisson, DO → LA, 14 mes.)*
```
[C3+E3+C4+G4]:w | [F2+A3+C4+A4]:w | [G2+G3+F4+B4]:w | [C3+G3+E4+C5]:w |
[A2+A3+E4+C5]:w | [G#2+B3+F4+D5]:w | [G#2~+B3~+F4~+D5~]:w | [A2+A3+E4+C#5]:w |
[E3+G#3+D4+B4]:w | [A2+E3+C#4+A4]:w | [A2+A3+C#4+E4]:w | [D3+B3+D4+F#4]:w |
[E2+B3+E4+G#4]:w | [A2+C#4+E4+A4]:w
```
| Vérif | |
|---|---|
| Décision d'écriture | **l'établissement (m1–4) et la reprise (m11–14) sont identiques dans les trois variantes** — seule la porte change : l'exercice devient une comparaison A/B/C des trois passages, à matériau constant (`authorNotes` ; la beta pourra jouer les trois milieux en A/B) |
| Le passage | m5 : vi (la préparation naturelle) ; m6 : **G♯°7 = vii°7 du vi** — l'oreille attend la mineur ; m7 : tenu (ronde liée, le trémolo mental) ; m8 : la sortie — résolution en **LA MAJEUR** (G♯2→A2, F4→E4, D5→C♯5 : *le ré qui descend sur do dièse, le rayon*) : la gare aux quatre sensibles, sortie par la porte inattendue ✓ `dim7-pivot` |
| Confirmation + reprise | E7 (m9, basse E3 : quinte d'approche en mouvement contraire) → A parfaite (m10, sensible frustrée au ténor G♯3→E3 : la quinte du I complet, exception M1) ; reprise T transposé (F-17) sur I–ii⁶–V7–I ✓ |

**m03-s05-augmented** *(e05, variante `augmented` — l'étrange)*
```
[C3+E3+C4+G4]:w | [F2+A3+C4+A4]:w | [G2+G3+F4+B4]:w | [C3+G3+E4+C5]:w |
[C3+G3+E4+C5]:w | [C3+G#3+E4+C5]:w | [C3~+G#3~+E4~+C5~]:w | [C#3+A3+E4+A4]:w |
[E2+G#3+D4+B4]:w | [A2+E3+C#4+A4]:w | [A2+A3+C#4+E4]:w | [D3+B3+D4+F#4]:w |
[E2+B3+E4+G#4]:w | [A2+C#4+E4+A4]:w
```
| Vérif | |
|---|---|
| Le passage | m5→m6 : I → **I+** par line cliché (G3→G♯3 : la 5̂ qui monte, l22 M1 en germe) ; m7 : tenu — l'augmenté isolé ne dit plus son monde (4+4+4) ; m8 : la sortie — C+ ≡ **E+ (V+ de LA)** : B♯(C3)→C♯3, G♯3→A3, E4 tenu, soprano C5→A4 en mouvement contraire (l'octave parallèle du glissement symétrique évitée — le piège documenté en `authorNotes`) → **A/C♯**, l'atterrissage par la tierce : l'arrivée molle, flottante — l'étrange assumé |
| Suite | E7 (basse plongée E2, contraire) → A parfaite (frustration au ténor) → reprise identique ✓ ; tag `augmented-pivot`, collection tons-entiers effleurée (le pont vers l11 nommé dans le rapport) |

**m03-s06a** *(e06, variante a — « la traversée », do majeur, 8 mes.)*
```
[C3+G3+E4+C5]:w | [E2+G#3+E4+B4]:w | [C3+G3+E4+C5]:w | [F2+A3+F4+C5]:w |
[Ab2+C4+Eb4+C5]:w | [C3+Ab3+Eb4+C5]:w | [G2+B3+F4+D5]:w | [C3+G3+E4+C5]:w
```
| Vérif | |
|---|---|
| Deux médiantes déclarées | **E majeur = la lumineuse** (m2 : fil **E4 tenu à l'alto**, aller ET retour m2→m3) ; **A♭ majeur = la sombre** (m5–6 : fil **C5 tenu au soprano**, la couture locale IV→♭VI partage le do) — contrastées ✓, fils stricts ✓ (F-7 sans objet : même octave, même voix) |
| Retour cadencé | ♭VI → V7 (m7 : la sortie d'emprunt classique, l21 M1 — A♭3→B3 : le trajet en pitch-classes, l'orthographe hors sujet) → I, sensible frustrée au ténor (B3→G3 : la quinte du I), soprano D5→C5, **parfaite** ✓ |
| Régime | fonctionnel de bout en bout : les médiantes sont des *événements* dans une phrase qui garde sa gravité — l'exact contraire de s06b, et le rapport nomme les deux régimes côte à côte |

**m03-s07b** *(e07, variante b — « la pédale cède », pédale de SOL = dominante de do, 12 mes.)*
```
[G2+D4+G4+B4]:w | [G2+E4+G4+C5]:w | [G2+F4+G4+B4]:w | [G2+E4+G4+C5]:w |
[G2+E4+A4+C5]:w | [G2+F4+A4+C5]:w | [G2+F4+A4+D5]:w | [G2+Eb4+Ab4+C5]:w |
[G2+F4+B4+D5]:w | [G2+F4+B4+D5]:w | [C3+E4+G4+C5]:w | [C3+E4+G4+C5]:w
```
avec `pedalPlan: [{1–4 compatible}, {5–7 frottée}, {8 contredite (Ab)}, {9–10 compatible — G7 : la pédale devient l'accord}, {11–12 sortie b : la basse cède}]`

| Vérif | |
|---|---|
| La gradation | compatible (V, I6/4, V7 — le balancement de pédale de dominante) → frottée (Am/G, F/G, Dm/G : la pédale en 7e, 9e, 11e) → **contredite** (m8 : A♭ contre sol — la négation) → m9–10 : G7 pur, **la tension fonctionnelle accumulée sur sa propre pédale, tenue deux mesures** |
| La sortie (b) | m11 : **la basse bouge pour la première fois** — G2→C3 — et ce mouvement EST la cadence : F4→E4 (7e↓), B4→G4 (sensible frustrée en voix interne : la quinte du I), D5→C5 (soprano 1̂) : **parfaite** ✓ ; m12 : l'arrivée qui respire (F-5) |
| Le diptyque a/b | `authorNotes` : en (a) la pédale était *tonique* — elle gagne ; en (b) elle était *dominante* — son abdication est la résolution. Les deux solutions enseignent la différence de nature, pas de technique ; F-18 juge les mêmes verticalités dans les deux |

## 64.3 Les quatre séjours modaux (s08, variantes)

Format commun : 12 mesures, bourdon déclaré, boucle ≤ 4 accords, `forbidFunctionalCadence`, note caractéristique exposée (`pillarExposure ≥ 0.25`), cadence modale finale. F-19 ancre la tonique sur le bourdon dans les quatre cas.

**m03-s08-dorien** *(ré dorien — piliers i–IV, la 6̂ majeure (si) exposée)*
```
[D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w | [D2+G3+D4+B4]:w |
[D2+A3+F4+A4]:w | [D2+B3+G4+B4]:w | [D2+A3+F4+A4]:w | [D2+C4+E4+G4]:w |
[D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w
```
Boucle {Dm, G, C/D} = 3 ✓ · si exposé m2/4 (soprano, ronde)/6 (doublé — légal : 6̂ n'est pas une sensible)/10–11 ✓ · m8 : la subtonique C en éclaireuse (le « marteau doux » annoncé) · **cadence dorienne IV→i** (m11→12 : B3→A3, G4→F4 — la 6̂ majeure qui retombe sur la tierce mineure : LA couleur du mode en un geste) ✓ · aucun A(7) nulle part ✓.

**m03-s08-phrygien** *(mi phrygien — piliers i–♭II, la ♭2̂ (fa) exposée)*
```
[E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w |
[E2+G3+B3+E4]:w | [E2+C4+F4+A4]:w | [E2+B3+E4+G4]:w | [E2+A3+D4+F4]:w |
[E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+A3+C4+F4]:w | [E2+G3+B3+E4]:w
```
Boucle {Em, F, Dm/E} ✓ · le F sur bourdon de mi = la friction majeure-7e **assumée comme identité du mode** (pedalPlan la déclare « frottée » — c'est le style, le rapport le crédite) · fa exposé m2/4/6 (aigu)/10/11 ✓ · **cadence phrygienne ♭II→i** (m11→12 : F4→E4, C4→B3, A3→G3 — trois voix qui chutent par degré : la cadence-signature) ✓ · aucun B7, aucun ré♯ ✓.

**m03-s08-lydien** *(fa lydien — piliers I–II, la ♯4̂ (si) exposée)*
```
[F2+C4+F4+A4]:w | [F2+B3+D4+G4]:w | [F2+C4+F4+A4]:w | [F2+B3+D4+B4]:w |
[F2+A3+C4+F4]:w | [F2+B3+E4+G4]:w | [F2+C4+F4+A4]:w | [F2+B3+D4+G4]:w |
[F2+A3+C4+A4]:w | [F2+B3+D4+B4]:w | [F2+B3+D4+G4]:w | [F2+C4+F4+A4]:w
```
Boucle {F, G, Em/F} ✓ — **do majeur (le V) est banni** : c'est l'interdit lydien, le seul accord qui rendrait la gravité fonctionnelle · si exposé m2/4 (soprano)/6/8/10/11 ✓ · **cadence lydienne II→I** (m11→12 : **B3→C4 — la ♯4̂ qui monte à la quinte**, D4→F4, G4→A4) ✓.

**m03-s08-mixolydien** *(sol mixolydien — piliers I–♭VII, la ♭7̂ (fa) exposée ; solution-témoin F-19)*
```
[G2+D4+G4+B4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w | [G2+A3+C4+F4]:w |
[G2+B3+D4+G4]:w | [G2+C4+E4+G4]:w | [G2+B3+D4+G4]:w | [G2+C4+F4+A4]:w |
[G2+D4+G4+B4]:w | [G2+A3+C4+F4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w
```
Boucle {G, F, C/G} ✓ · fa exposé m2/4 (soprano)/8/10/11 ✓ · **cadence mixolydienne ♭VII→I** (m11→12 : C4→D4, **F4→G4 — l'atterrissage au ton entier**, A4→B4 : tout monte, aucune sensible) ✓ · sans F-19, cette pièce se lisait « do majeur, demi-cadence IV→V » — elle existe pour verrouiller l'ancrage.

## 64.4 La seconde galaxie et la dissolution

**m03-s09** *(e09 — le diptyque du lydien ♭7, 8 + 2 mes. ; solution-témoin F-20)*
```
[G2+F3+B3+D4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+C#4]:h~[G2+F3+B3+C#4]:h |
[G2+F3+B3+D4]:h [G2+F3+B3+F4]:h | [G2+F3+B3+E4]:h [G2+F3+B3+D4]:h |
[G2+F3+B3+C#4]:w | [G2+F3+B3+D4]:h [G2+F3+B3+E4]:h |
[G2+F3+B3+F4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+D4]:w |
[G2+F3+B3+C#4]:w | [F#2+F#3+A#3+C#4]:w
```
| Vérif | |
|---|---|
| Le monde (m1–8) | G7♯11 bouclé sur pédale de sol (déclarée) ; la ligne de tête expose **♯4̂ (do♯ : m2 tenue-liée, m5 ronde, m9)** et **♭7̂ (fa : m3, m7 à l'aigu)** ✓ ; `requireCollection: melodic-minor` (rotation de ré mineur mélodique — **F-20**) : toutes les hauteurs ∈ {D,E,F,G,A,B,C♯} ✓ |
| La flèche (m9–10) | **la MÊME sonorité** (m9 = m2) puis : basse **G2→F♯2 (le demi-ton)**, le triton se referme (F3→F♯3, B3→A♯3), **le do♯ ne bouge pas** (♯11 de G7 = quinte de F♯ — la note qui appartient aux deux vérités) → F♯ majeur ✓ `harmony.tritone-sub-resolution` crédite |
| Le rapport | met m5 et m9 côte à côte : *huit mesures de monde, une mesure de flèche — le même son, le régime fait le sens* : la démonstration finale de la carte de l01, exécutable en A/B |

**m03-s10** *(e10 — le pandiatonisme, sol, 12 mes.)*
```
[G3+A3+B3+D4]:w | [G3+C4+D4+G4]:w | [A3+B3+E4+F#4]:w | [G3+A3+D4+E4]:w |
[G3+B3+C4+D4]:w | [G3+C4+D4+A4]:w | [B3+C4+D4+E4]:w | [G2+D3+A3+E4]:w |
[G2+D3+A3+B4]:w | [G2+D3+A3+D4]:w | [G2+D3+G3+D4]:w | [G2+G3]:w
```
| Vérif | |
|---|---|
| Collection + interdit | tout ∈ sol diatonique ✓ `detectCollection` ; `forbidFunctionalCadence` : le fa♯ n'apparaît qu'en voix interne non cadentielle (m3) ✓ |
| Le pôle par insistance | **sol**, déclaré : basses de m1–2, 4–6, 8–12, première ET dernière verticalité — F-19 confirme l'ancrage sans gravité fonctionnelle |
| Empilements non tertiens | m1 (secondes G-A-B), m2 (quartes-quintes G-C-D), m4, m5 (la seconde interne B-C), m7 (**le cluster diatonique conjoint** B-C-D-E), m8+ (quintes empilées G-D-A) — 6 tagués ≥ 4 ✓ |
| L'événement d'espacement | **m7→m8 : ambitus 5 dt → 21 dt** — le resserré maximal qui éclate en quintes : mesuré, crédité ✓ ; craft : les secondes vivent au médium, le grave ne porte que des quintes (la friction bien registrée, `orch.low-interval-limit` silencieux) |
| La fin par dissolution | m9–11 : les quintes se vident une à une vers le pôle ; m12 : **l'octave nue G2–G3 — l'accord-pôle resté seul**, aucune cadence ✓ (le geste-jumeau du fil seul de s06b : les systèmes 2 et 3 concluent par la matière, pas par l'aimant) |

## 64.5 Bilan du lot 2

| Livré | 10 solutions — système 1 intégralement soldé (toutes variantes), système 2 complet (l07→l10) |
|---|---|
| Findings | **F-19** (ancrage modal par insistance — sans lui, trois des quatre séjours s08 et la cadence mixolydienne étaient illisibles), **F-20** (`detectCollection` + famille mineur mélodique) ; + règle d'écriture : tout bourdon déclaré en `pedalPlan` |
| Constat de méthode | les séjours modaux coûtent ~25 min/pièce (textures simples, vérification légère) contre ~55 pour le fonctionnel étendu — le re-chiffrage du backlog V1 s'affine : les modules ne pèsent pas uniformément |
| Ordre des PR | F-19/F-20 (moteur) → les 10 solutions → CI verte |
| État M3 | **16/31** — restent s11→s16 (le système 3 : tons entiers, octatonique, quartal, planing, clusters, polyaccords — avec variantes), s17 ×3 (la tension sans dominante), s18 ×3 (le capstone tri-palettes) |
| Cumul projet | 72 solutions · **20 findings** traités |

---

**Point de confirmation.** Le système 2 est solutionné et le moteur modal est calibré. La suite logique : **(a)** le lot 3 — le système 3 (s11→s16, ~8 solutions avec variantes : le premier vrai banc d'essai de l'octatonique, du `planingCheck` et du format bi-plans `simultaneous` de e16) ; **(b)** enchaîner directement synthèse + capstone (s17 ×3, s18 ×3) pour clore M3 en un seul mouvement avec le lot 3 (~14 solutions, gros lot) ; **(c)** intercaler un front léger (quiz M3 à la charte, pendant que les leçons sont fraîches). Ma recommandation : **(a)** — le système 3 d'abord, car e16 (`simultaneous: true`) et e17 (`tensionPlan`) introduisent chacun une extension de format qu'il vaut mieux éprouver isolément avant que le capstone ne les empile. Je continue ?