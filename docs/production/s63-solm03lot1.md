# SECTION 63 — SOLUTIONS DE RÉFÉRENCE M3, LOT 1 : LE SYSTÈME 1 (6 solutions + 4 findings)

## 63.0 Méthode et comptage du backlog M3

Protocole §26–28 inchangé : composition **contre le moteur tel que codé**, findings d'abord, `authorNotes` documentant chaque piège. Comptage du module (même arithmétique que F-9) : e01 est un quiz-classification (réponses dans la spec) ; les solutions à composer sont e02→e18 avec leurs variantes — e05 ×3, e06 ×2, e07 ×2, e08 ×4, e12 ×2, e16 ×3, e17 ×3, e18 ×3 parts — soit **31 solutions M3**. Ce lot couvre le **fonctionnel étendu** (l02–l07) : s02, s03, s04, s05 (variante `ger6-v7`), s06 (variante b), s07 (variante a) — 6 livrées, 25 au reste.

Le module tient sa réputation : **4 findings en 6 solutions** — dont un vieux fantôme de l'histoire de l'harmonie.

## 63.1 Findings de calibrage (à traiter avant le merge du lot)

**F-15 — Les quintes de Mozart (patch de règle + fixtures).**
La résolution directe **Ger⁶ → V** produit des quintes parallèles *canoniques* : ♭6̂→5̂ à la basse contre ♭3̂→2̂ dans une voix supérieure (s03, mes. 9→10 : E♭2–B♭3 → D2–A3 ; s05, mes. 7→8 en voix extrêmes). Trois siècles de répertoire les assument — elles portent le nom de Mozart — mais `vl.parallel-perfects` (poids 1.0 en `classical-common`) les flague en *error*.
*Patch* : quand le tag `aug6` (type allemand) couvre la paire ♭6̂→5̂ // ♭3̂→2̂, la règle rétrograde en `info` dédiée : « quintes de Mozart — idiomatiques dans la résolution de la sixte allemande ; pour les éviter : interposer le 6/4 (comme s03 mes. 4–5), ou employer la française ». +6 fixtures (2 Mozart légales, 2 évitements par 6/4, 2 quintes NON couvertes par le tag qui restent des erreurs). `engineVer` bump. *La pédagogie de l03 gagne un paragraphe : l'évitement par 6/4 est déjà dans la leçon, l'exception nomme l'autre chemin.*

**F-16 — Priorité des tags : `aug6` avant `subV` dans la classification cadentielle.**
En pitch-classes, Ger⁶ de sol mineur ≡ E♭7 ; sa résolution sur D (basse au demi-ton) est **exactement la signature du subV** (l20 M1). Sur s03, la fenêtre finale risquait la double lecture « subV→I en ré » — et `detectCadence` aurait pu enregistrer une arrivée parasite en ré majeur au lieu de la demi-cadence en sol.
*Patch* : ordre d'évaluation acté — dans une tonalité **établie** (fenêtre stable avant l'accord), le comportement ♭6̂-basse→5̂ + contenu {♭6̂,1̂,♭3̂,♯4̂} tague `aug6` en priorité ; `subV` n'est testé que hors contexte aug6. Le tag alimente ensuite `detectCadence` : Ger⁶→V = demi-cadence du monde courant, jamais « parfaite du monde d'à côté ». +4 fixtures (2 Ger⁶, 2 vrais subV).

**F-17 — `samePitchSequenceAsGiven` gagne le mode transposé (extension de checker).**
e05 exige la reprise du thème initial « transposé sur la fenêtre finale ». Le checker (§24.7) compare les hauteurs verbatim.
*Patch* : paramètre `{ transposed: true }` — comparaison des **suites d'intervalles** (directions comprises) sur la fenêtre désignée, hauteur de départ libre. ~8 lignes sur `leapProfile`. +3 fixtures (transposition exacte ✓, tonale ±1 ✗ ici — la reprise enharmonique de e05 est réelle, pas diatonique —, ordre altéré ✗).

**F-18 — Sous `pedalPlan`, la pédale sort du dictionnaire (règle d'évaluation).**
Sur s07, mes. 7 : {G2 + F4 + A4 + C5}. `detectChord` lit… F9 — et le plan « frottée » devient invisible ; pire, la mesure « contredite » (A♭ sur pédale de sol) ne se nomme plus du tout.
*Patch* : quand `pedalPlan` est actif, `detectChord` évalue les verticalités **hors note de pédale** ; la pédale est jugée par le plan (compatible / frottée / contredite — l'intervalle pédale↔accord classé), pas par le dictionnaire. C'est le jumeau harmonique de la décision `removed` de M6 : le plan déclaré est le juge. +5 fixtures.

## 63.2 Les solutions

**m03-s02** *(e02 — le napolitain, ré mineur, 8 mes.)*
```
[D3+A3+D4+F4]:w | [G2+Bb3+D4+G4]:w | [A2+A3+C#4+E4]:w | [D3+A3+D4+F4]:w |
[D3+A3+F4+D5]:w | [G2+Bb3+G4+Eb5]:w | [A2+A3+E4+C#5]:w | [D3+A3+F4+D5]:w
```
| Contrainte | Vérif |
|---|---|
| phrase-norme i–iv–V–i puis reprise | mes. 1–4 ✓ / 5–8 : i–**♭II⁶**–V–i ✓ |
| ♭II⁶ conduit dans les règles | basse 4̂ (G2), **doublure de basse** (G2+G4), soprano D5→E♭5 (1̂→♭2̂ : la couleur en voix de tête), puis **E♭5→C♯5 : la tierce diminuée au soprano** ✓ — en MIDI c'est −2 dt ; le checker travaille en degrés (♭2̂→7̂), l'orthographe est hors sujet (F-6) |
| requireIdiom neapolitan | mes. 6, taguée (majeur sur ♭2̂, contexte S→D) ✓ |
| cadence parfaite finale | V→i fondamentales, C♯5→D5, soprano 1̂, arrivée tenue ✓ ; octave directe basse/soprano couverte par l'exception « soprano par degré » |
| VL voix à voix | zéro parallèle ; sensible mes. 3 en alto (C♯4→D4) ✓ ; quintes/octaves quittées ou atteintes par mouvement contraire partout |

**m03-s03** *(e03 — l'escalade des sixtes, sol mineur, 10 mes. ; contient le cas F-15)*
```
[G2+Bb3+D4+G4]:w | [C3+C4+Eb4+G4]:w | [C3+C4+Eb4+Ab4]:w | [Eb3+Bb3+C#4+G4]:w |
[D3+Bb3+D4+G4]:w | [D3+C4+D4+F#4]:w | [G2+Bb3+D4+G4]:w | [G2+Bb3+D4+G4]:w |
[Eb2+Bb3+C#4+G4]:w | [D2+A3+D4+F#4]:w
```
| Contrainte | Vérif |
|---|---|
| iv → ♭II⁶ → Ger⁶ → i6/4 → V → i | mes. 2 (iv) → 3 (♭II⁶ : la bascule minimale, C et E♭ tenus, G4→A♭4) → 4 (Ger⁶ {♭6̂,1̂,♭3̂,♯4̂} : l'alto E♭4→C♯4 plonge en tierce diminuée — l'écho de s02) → 5 (i6/4, **la tenaille** : E♭3→D3 ET C♯4→D4, ♭6̂ et ♯4̂ tracées jusqu'à 5̂ ✓) → 6 (V7 sans quinte, F-3) → 7 (i complet, parfaite interne, F-5 : arrivée tenue) ✓ |
| requireIdiom neapolitan+aug6 | mes. 3 et mes. 4/9 taguées ✓ |
| reprise → demi-cadence monumentale | mes. 8 (tête) → 9 (**Ger⁶ direct**) → 10 : V tenu, non résolu, fin de segment — `requiredCadence: "half"` ✓ (et F-16 : le tag aug6 empêche la lecture « subV→I en ré ») |
| **F-15 en acte** | mes. 9→10 : E♭2–B♭3 → D2–A3, les quintes de Mozart — la résolution basse/ténor canonique ; la solution existe pour les détecter, comme s24 existait pour F-1. L'aug6 mes. 4, elle, passe par le 6/4 : les deux chemins documentés dans `authorNotes` |
| VL | sixte augmentée E♭2–C♯4 → octave D2–D4 par mouvement contraire (la résolution-manuel) ✓ ; sensible F♯4→G4 ✓ |

**m03-s04** *(e04 — le dim7 aux trois métiers, do majeur → mi♭ majeur, 12 mes.)*
```
[C3+G3+E4+C5]:w | [C#3+G3+E4+Bb4]:w | [D3+F3+F4+A4]:w | [B2+F3+D4+Ab4]:w |
[C3+E3+E4+G4]:w | [A2+E3+C4+A4]:w | [D3+F3+B3+Ab4]:w | [Eb3+G3+Bb3+G4]:w |
[Ab2+Ab3+Eb4+C5]:w | [Bb2+G3+Eb4+Bb4]:w | [Bb2+Ab3+Bb3+D5]:w | [Eb3+G3+Bb3+Eb5]:w
```
| Contrainte | Vérif |
|---|---|
| le passant | mes. 2 : ♯i°7 {C♯,E,G,B♭}, **l'escalier de basse C→C♯→D**, chaque voix conjointe ou commune ✓ (`dim7-passing` tagué) |
| la cadence intensifiée | mes. 4 : vii°7 {B,D,F,A♭} → I (B2→C3, F3→E3, A♭4→G4 ✓ ; tierce doublée à l'arrivée — le standard après °7, `authorNotes`) |
| le pivot | mes. 7 : **le même pitch-class set {B,D,F,A♭}** que la mes. 4 — arrivé tout en degrés conjoints (F3→ approche par E3→F3, C4→B3, A4→A♭4), **tenu une ronde**, puis la sortie mes. 8 : D3→E♭3 (la sensible de MI♭), B(≡C♭)→B♭, F→G, A♭→G — quatre demi-tons/communs : « c'est sa définition ». Une gare, deux trains : la démonstration de l04 dans une seule pièce (`dim7-pivot` ✓, F-6 ✓) |
| modulationCheck C→E♭ | confirmation mes. 9–12 : IV → I6/4 → V7 (sans quinte, fondamentale doublée, 7e **préparée** au ténor) → I complet, soprano D5→E♭5, parfaite ✓ (F-5 : l'arrivée termine le segment) |
| VL | octave directe finale couverte (soprano par degré) ; zéro parallèle sur les 11 coutures — vérifié paire à paire |

**m03-s05** *(e05, variante `ger6-v7` — le passage secret, DO majeur → LA majeur, 14 mes. ; utilise F-15 et F-17)*
```
[C3+E3+C4+G4]:w | [F2+A3+C4+A4]:w | [G2+G3+F4+B4]:w | [C3+G3+E4+C5]:w |
[F2+A3+F4+C5]:w | [F2+A3+Eb4+C5]:w | [F2~+A3~+Eb4~+C5~]:w | [E2+G#3+E4+B4]:w |
[E2+G#3+D4+B4]:w | [A2+E3+C#4+A4]:w | [A2+A3+C#4+E4]:w | [D3+B3+D4+F#4]:w |
[E2+B3+E4+G#4]:w | [A2+C#4+E4+A4]:w
```
| Contrainte | Vérif |
|---|---|
| établissement A | mes. 1–4 : I–IV–V7–I, parfaite en do (soprano B4→C5) ✓ `requireEstablishingCadence` ; le soprano des mes. 1–4 = **le thème T : G–A–B–C** (le donné) |
| le passage | mes. 5 : IV ; mes. 6 : **le E♭ entre** — F7, « on croit partir vers si♭ » ; mes. 7 : **tenu** (ronde liée : l'oreille lâche le monde A) ; mes. 8 : la sortie — F7 lu **Ger⁶ de LA** : F→E, C→B, E♭≡D♯→E, A→G♯, quatre demi-tons, le velours ✓ (tag `ger6-v7`, F-16) |
| **F-15 en acte** | mes. 7→8, voix extrêmes : F2–C5 → E2–B4 — les quintes de Mozart en version enharmonique ; couvertes par le tag |
| confirmation B | mes. 9–10 : E7 → A, **sensible frustrée au ténor** (G♯3→E3, l'exception codée de M1) qui livre la quinte du I complet, soprano B4→A4 : parfaite en la ✓ |
| la reprise-révélation | mes. 11–14 : soprano **E–F♯–G♯–A = T transposé** (intervalles +2+2+1 identiques — `samePitchSequenceAsGiven { transposed: true }`, **F-17**), harmonisé I–ii⁶–V7(7e préparée à l'alto)–I, parfaite finale ✓ — le même matériau, l'autre vérité |
| modulationCheck enharmonic | fenêtre A stable (1–5), pivot à double lecture tagué (6–8), fenêtre B stable (9–14) ✓ |

**m03-s06** *(e06, variante b — « la boucle », cycle C→E→A♭→C, 12 mes. ; sens strict F-7)*
```
[C3+G3+E4+C5]:w | [E3+C4+G4+C5]:w | [C3+G3+E4+C5]:w | [E2+G#3+E4+B4]:w |
[E2+B3+G#4+E5]:w | [E2+G#3+E4+B4]:w | [E2+B3+E4+G#4]:w | [Ab2+C4+Eb4+Ab4]:w |
[C3+Ab3+Eb4+Ab4]:w | [Ab2+C4+Eb4+C5]:w | [Ab2+C4+Eb4+C5]:w | C5:w
```
| Contrainte | Vérif |
|---|---|
| le cycle de tierces majeures | C (1–3) → E (4–7) → A♭ (8–11) → C (12), tout majeur ✓ |
| les fils, voix à voix | mes. 3→4 : **E4 tenu à l'alto** (tierce de C devient fondamentale de E — strict ✓) ; mes. 7→8 : **G♯4≡A♭4 tenu au soprano** (tierce de E devient fondamentale de A♭ — strict, l'enharmonie F-6 ✓) ; mes. 11→12 : **C5 tenu au soprano** (tierce de A♭ redevient... do). « Le fil voyage de voix en voix » : alto, puis soprano — la symétrie 4+4+4 en personne |
| forbidFunctionalCadence | aucun V→I nulle part : les mondes basculent par médiante, vivent par renversements ✓ |
| l'atterrissage par le fil seul | mes. 12 : **C5 nu** — les voix se retirent, le fil EST l'arrivée : le retour à « do » réduit à sa note commune. `mustEnd` : sans objet ; le rapport nomme chaque saut par sa ligne de table (C→E : « la lumière chromatique », E→A♭ : ≡ C→A♭ « l'ombre solennelle », vues du maillon) |
| VL | toutes les coutures en demi-tons et notes communes (mes. 3→4 : C3→E2, G3→G♯3, E4 tenu, C5→B4) ; quintes/octaves : rien de consécutif — le planing n'est pas convoqué ici, c'est la médiante conduite |

**m03-s07** *(e07, variante a — « la pédale gagne », pédale de sol, 12 mes. ; la solution qui déclenche F-18)*
```
[G2+D4+G4+B4]:w | [G2+E4+G4+C5]:w | [G2+E4+G4+B4]:w | [G2+D4+G4+B4]:w |
[G2+Eb4+G4+Bb4]:w | [G2+Eb4+G4+C5]:w | [G2+F4+A4+C5]:w | [G2+Eb4+Ab4+C5]:w |
[G2+D4+F#4+C5]:w | [G2+D4+F#4+C5]:w | [G2+D4+G4+B4]:w | [G2+D4+B4+G5]:w
```
avec `pedalPlan: [{bars:[1,4], state:"compatible"}, {bars:[5,7], state:"frottee"}, {bars:[8,8], state:"contredite"}, {bars:[9,10], state:"frottee"}, {bars:[11,12], state:"resolution"}]`

| Contrainte | Vérif |
|---|---|
| installation compatible (4 mes.) | G · C/G · Em · G — la pédale est fondamentale, quinte ou tierce partout ✓ |
| friction croissante | mes. 5–6 : les emprunts (♭VI, iv — G consonant mais le monde s'assombrit) ; mes. 7 : ♭VII (G = 9e étrangère, **frottée**) ; mes. 8 : **A♭ majeur — l'accord contredit** (G = septième majeure contre la fondamentale : la pédale niée) — la gradation compatible→frottée→contredite du plan, exécutée ✓ |
| la sortie (a) : la pédale gagne | mes. 9–10 : V7 sur pédale de tonique (la friction *fonctionnelle*, tenue deux mesures — l'attente) ; mes. 11 : F♯4→G4, C5→B4 — l'harmonie **revient à sol**, cadence sur la pédale ✓ ; mes. 12 : l'élargissement conclusif |
| **F-18 en acte** | sans le patch, mes. 7 se lit « F9 », mes. 8 ne se lit pas : la pédale exclue, le dictionnaire retrouve F et A♭, et le plan juge la pédale — c'est pour produire ce constat que la solution est composée |
| VL supérieures | tout conjoint ou commun (E♭4→D4, A♭4→F♯4 : les retours au monde de sol par demi-tons) ; l'octave finale du soprano = le geste d'élargissement, `authorNotes` |

## 63.3 Bilan du lot — et point d'étape

| Livré | 6 solutions — le système 1 (l02–l07) intégralement couvert dans ses variantes principales |
|---|---|
| Findings | **F-15** (quintes de Mozart — patch `vl.parallel-perfects` + 6 fixtures), **F-16** (priorité aug6 > subV en classification), **F-17** (`samePitchSequenceAsGiven.transposed`), **F-18** (pédale hors dictionnaire sous `pedalPlan`) |
| Rendement | 4 findings / 6 solutions — M3 confirme son statut de module le plus exigeant en calibrage ; noter que F-15 est le premier finding *historique* du produit (la règle rencontrait trois siècles de pratique) |
| Coût constaté | ~55–65 min/solution (les réécritures de conduite sur s04 et s05 ont coûté — chaque impasse documentée en `authorNotes`, matière pédagogique comme en §27) |
| Ordre des PR | F-15/F-16/F-18 (moteur) + F-17 (checker) → puis les 6 solutions → CI verte attendue |
| Reste M3 | **25 solutions** : s05 ×2 (variantes `dim7`, `augmented`), s06a, s07b, s08 ×4 (les quatre modes), s09→s15, s16 ×3, s17 ×3, s18 ×3 (le capstone tri-palettes) |
| Cumul projet | 62/~176 solutions ; 18 findings traités |

---

**Point de confirmation.** Le lot 1 de M3 est prêt avec ses quatre corrections moteur. Suites possibles : **(a)** le lot 2 M3 — le système 2 (s05 variantes restantes, s06a, s07b, s08 ×4, s09, s10 : le modal, ~10 solutions) ; **(b)** sauter au système 3 (s11→s16 : collections et verticalités — le territoire où `detectCollection` sera éprouvé pour la première fois, findings probables) ; **(c)** changer de front : le lot quiz ou les assets M12. Ma recommandation : **(a)** — dérouler M3 dans l'ordre, le modal éprouvera `pillarExposure` et `forbidFunctionalCadence` avant que le capstone ne les combine. Je continue ?