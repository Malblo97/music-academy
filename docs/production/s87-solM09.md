# SECTION 87 — SOLUTIONS DE RÉFÉRENCE M9 : LES QUATRE GENRES (8 solutions + 5 findings)

## 87.0 Méthode et comptage du backlog M9

Protocole §26–28 inchangé : composition **contre le moteur tel que codé**, findings d'abord, `authorNotes` documentant chaque piège. Comptage du module : `m09-e01→e08`, aucune variante, aucun tri-parts — **8 solutions M9**, et le module se boucle en un seul lot.

Particularité du module : M9 ne crée pas de langage, il **assemble** (M1 harmonie + M2 ambiances + M5 fiches + M6 stacks + M7 `Part[]`). Conséquence attendue et vérifiée : **aucun finding de règle musicale** dans ce lot — les cinq findings sont tous des findings de *contrat de spec* et de *sémantique de clé déclarative*. C'est la signature d'un module de synthèse : le moteur sait jouer, ce sont les consignes qui doivent dire exactement ce qu'elles mesurent.

Deux d'entre eux sont **PRIORITAIRES** : sans F-54, deux specs du lot (e04, e08) sont littéralement auto-contradictoires et leurs solutions échouent par construction (famille F-35) ; sans F-55, la dérive de tempo d'e08 n'est pas exprimable en soumission déclarative.

Format : `payload` (F-33) pour les six exercices non mono-flux, `notation` seule pour s01 ; `Part[]` (F-33/F-39/F-40) pour les trois ARRANGEMENT ; `dyn[]` déclaré partout où la spec juge une dynamique.

---

## 87.1 Findings de calibrage (à traiter avant le merge du lot)

**F-52 — Le donné harmonique ne dit pas son mapping mesures↔accords (précision de spec, famille F-8).**
Deux cas dans le même lot. (1) e01 : `given.chords` porte 8 accords, `lengthBars` vaut 16 et l'`expositionPlan` exige une **cadence parfaite à la mes. 16** — mais la grille répétée telle quelle place un G7 à la mes. 16 : *l'accord d'arrivée n'existe pas*. La consigne est irréalisable à la lettre. (2) e02 : la grille fournie contient déjà le `Fm6`, alors que le prompt demande le IV clair à l'énoncé et le nuage **à la reprise seulement** — quelle version l'énoncé joue-t-il ?
*Patch* : le donné gagne un champ explicite `chordBars: [{bars:[a,b], chordIdx}]`, résolu au seed ; pour e01, une 9e entrée `{root:0, quality:"maj7"}` est ajoutée et la mes. 15 devient bi-accord (`Fadd9 → G7`, sur le modèle de la mes. 4) ; pour e02, `chordBars` est déclaré par section (`statement` → IV, `restatement` → iv emprunté), ce qui rend `restatementBorrowedIv` vérifiable *par différence* au lieu de par présence. +5 fixtures. *Sans ce patch, deux des huit solutions du lot ne peuvent pas exister.*

**F-53 — Le référentiel de `climaxWindow` sous `expositionPlan` (précision de checker).**
e01 demande le climax « vers les 2/3 de l'exposition » avec `climaxWindow: [0.6, 0.85]`. Mesurée sur la soumission entière (16 mes.), la fenêtre est [mes. 10,6 ; 13,6] ; mesurée sur l'exposition 2 (celle du don), elle est [mes. 12,8 ; 14,8]. Deux lectures, deux verdicts opposés sur la même note.
*Patch* : en présence d'un `expositionPlan`, la fenêtre se mesure **sur le segment portant `motifComplete: true`** — la seule lecture pédagogiquement juste (c'est *le don* qui a des tiers, pas la pièce). La règle vaut pour `climaxApproachLeap` et `climaxMinDuration`. +3 fixtures. *La solution de référence place son climax dans l'**intersection** des deux fenêtres (mes. 14 temps 1 : 0,81 du total, 0,63 de l'exposition) : elle passe avant et après le patch — c'est le témoin qui prouve que le patch ne casse rien.*

**F-54 — `ostinatoInvariant` contre les fenêtres de silence déclarées (patch de checker — PRIORITAIRE).**
e04 exige un ostinato qui **ne varie jamais** *et* « la coupure sèche d'UN temps avant le palier final » ; e08 exige un ostinato invariant *et* « une INTERRUPTION nette (l'apnée : 1 à 2 temps de rien) ». Le checker d'invariance compare chaque tour à la cellule de référence : la coupure et l'apnée sont détectées comme des variations. **Les deux specs se contredisent elles-mêmes** — les solutions échouent par construction, exactement comme dans la famille F-35.
*Patch* : `ostinatoInvariant` évalue l'invariance **hors fenêtres déclarées** (`requireSilenceBeforeBar`/`silenceBeats`, `requireOstinatoInterruption`/`interruptionBeats`, `endType: "cut"`) ; la troncature à l'entrée d'une fenêtre est légale, toute autre altération reste une variation. Corollaire acté au passage : `silenceBeats`/`interruptionBeats` se comptent dans **l'unité de la mesure déclarée** — en 7/8, un « temps » est une croche, pas une noire (sans quoi l'apnée d'e08 vaut 4 croches sur 7 et avale la moitié de la mesure). +7 fixtures (coupure légale, apnée légale, cellule altérée hors fenêtre → échec, unité 7/8, unité 4/4).

**F-55 — `tempoPlan[]` : la Tempo Track déclarative (extension de schéma — PRIORITAIRE).**
e08 exige « +2 BPM toutes les 8 mesures sur la Tempo Track » (`tempoDriftBpmPer8Bars`) — mais une solution compilée depuis la notation a **un** tempo. Le jumeau exact de F-39 : la donnée ne savait pas dire l'enveloppe.
*Patch* : `payload.tempoPlan: [{bar, bpm, curve?}]` — la Tempo Track en donnée ; le checker de dérive lit indifféremment `tempoPlan` (déclaratif) ou la Tempo Track MIDI (M10, flux C). `tempoRange` s'évalue sur **l'enveloppe entière** (min et max), plus sur un scalaire. Zod + 5 fixtures. *M10 le consommera en retour, comme `dyn[]`.*

**F-56 — `maxActiveLayers` compte les rôles déclarés, pas les éléments (précision de sémantique).**
e06 plafonne à « 3 couches actives + 1 événement ». La fondation néo-noir canonique de l03 est *contrebasses pizz **+** drone sub* — deux sources, un rôle ; la nappe est *cordes con sord **+** vinyl crackle*. Compté en éléments, le stack minimal du genre dépasse déjà le plafond ; compté en rôles, il tient exactement.
*Patch* : le compte porte sur les **rôles du `rolePlan`** (fondation / nappe / voix / ponctuation / texture / tension) ; les éléments d'un rôle sont listés dans `Layer.elements[]` et jugés, eux, par `sd.*` (bandes, pyramide de niveaux, `sd.sub-conflict`). *Effet pédagogique : le plafond redevient ce que la leçon dit — une discipline de **rôles**, pas un quota de pistes.*

---

## 87.2 Romance — s01, s02

### m09-s01 *(e01 — le thème qui se retient ; do majeur, 16 mes., ♩=66 ; témoins F-52 et F-53)*

Grille réalisée (avec le mapping F-52) :
`E1 : Cmaj7 | Am7 | Fadd9 | G7sus4→G7 | Cmaj7 | Am7 | Fadd9 | G7`
`E2 : Cmaj7 | Am7 | Fadd9 | G7sus4→G7 | Cmaj7 | Am7 | Fadd9→G7 | Cmaj7`

```
E1 (la digue)
G4:q A4:q G4:h | E4:q G4:q A4:h | G4:q A4:q C5:h | C5:h B4:q A4:q |
G4:q A4:q G4:h | A4:q B4:q C5:h | C5:q D5:h C5:q | D5:h. r:q       |

E2 (le don)
G4:q A4:q G4:h | E4:q G4:q A4:h | A4:q C5:h B4:q | C5:h B4:q G4:q |
E4:q F4:q G4:h | E5:h. D5:q     | D5:q C5:q B4:h | C5:w
```

| Contrainte | Vérif |
|---|---|
| tête de phrase = motif, ≥ 2 occurrences | **T = `G4:q A4:q G4:h`** (5̂–6̂–5̂) aux mes. **1, 5, 9** — 3 occurrences exactes ✓ ; E2 reprend la tête *verbatim* sur deux mesures (mes. 9–10 ≡ mes. 1–2) puis divergence : « la même bouche, une autre phrase » |
| `expositionPlan` E1 : fin sur 2̂, demi-cadence, `motifComplete: false` | mes. 8 : **D5 pointée puis un silence de noire** — la phrase s'arrête *avant* sa résolution, sur la dominante ✓ ; le silence est la contrainte rendue audible (la digue n'est pas un accord, c'est un manque) |
| `expositionPlan` E2 : fin sur 1̂, parfaite, `motifComplete: true` | mes. 15 (Fadd9→G7, sensible B4) → mes. 16 **C5 ronde**, arrivée tenue ✓ (F-5) — la 9e entrée de grille (F-52) est *exactement* ce qui rend cette case cochable |
| climax : sixte ascendante, `climaxWindow [0.6,0.85]` | **G4 → E5, +9 dt (sixte majeure), mes. 14 temps 1** ✓ ; position 0,81 du total **et** 0,63 de l'exposition 2 — **l'intersection des deux lectures de F-53** ; note-climax tenue 3 temps (blanche pointée) ✓ |
| E1 n'a AUCUN saut ≥ 8 dt | vérifié : ambitus E1 = E4–D5, plus grand saut −7 dt (le retour de tête, mes. 8→9) ✓ — la sixte est *réservée*, c'est toute la loi du genre |
| `maxLeap 9` · `minConjunctRatio 0.6` · `noteRange [55,81]` | max = **9** (le climax, et lui seul) ✓ · conjoint **0,762** (32/42) ✓ · E4–E5 = 64–76 ✓ |
| `tempoRange [60,80]` · `dyn[]` | ♩=66 ✓ ; arche déclarée : E1 plafonnée à *mp* (52), E2 en crescendo continu jusqu'au climax (78) puis retrait immédiat (mes. 15–16 : 60) — la coda de l01 §5 anticipée dans la seule dynamique |
| Craft | sommets de phrase **croissants** (E1 : D5 → E2 : E5) ✓ `ascendingPhrasePeaks` crédité ; mes. 13 est une **extension de phrase** (la remontée E4–F4–G4 : la respiration qui prend appui) — le curseur « extension » de la fiche m02-l12 employé pour sa fonction dramatique, pas pour l'ornement |

*`authorNotes` :* « La seule note du morceau qui vaut 9 dt est celle du don. Tout le reste est écrit pour qu'elle soit *possible* : l'exposition 1 s'interdit la sixte, la mes. 13 descend pour pouvoir sauter, et la reprise commence *sous* le point où E1 s'est arrêtée (D5 → G4) — le thème redevient petit avant de devenir grand. »
**Verdict attendu :** *« Ton exposition 1 est incomplète, ta 2 est entière, et la sixte n'arrive qu'une fois. »* — la phrase de la spec, méritée.

### m09-s02 *(e02 — la digue qui cède ; do majeur, 18 mes., 3 → 5 → 3 voix ; témoin F-52)*

```
A  (mes. 1–8, la retenue — 3 voix, piano seul, vel. 48)
[C3+B3+E4]:w | [A2+C4+G4]:w | [F2+A3+G4]:w | [G2+C4+F4]:h [G2+B3+F4]:h |
[C3+B3+E4]:w | [A2+C4+G4]:w | [F2+A3+G4]:w | [C3+G3+E4]:w              |

A' (mes. 9–16, le don — 5 voix, cordes + piano, vel. 60)
[C2+G3+B3+E4+E5]:w | [A2+G3+C4+E4+E5]:w | [F2+A3+C4+G4+F5]:w |
[G2+G3+C4+F4+F5]:h [G2+G3+B3+F4+D5]:h                        |
[C2+G3+B3+E4+E5]:w | [A2+G3+C4+A4+E5]:w | [F2+C4+D4+Ab4+F5]:w | [C3+C4+E4+G4+E5]:w |

CODA (mes. 17–18 — 3 voix, vel. 42)
[F2+C4+Ab4]:w | [C3+E4+G4]:w
```

| Contrainte | Vérif |
|---|---|
| `structure: statement-restatement-coda` | A = mes. 1–8 (grille au IV clair) · A' = mes. 9–16 (**même grille, `Fm6` mes. 15**) · CODA = 17–18 ✓ — mapping déclaré par section (F-52) |
| `restatementBorrowedIv` | mes. 15 : **{F, A♭, C, D} = Fm6** exactement là où la mes. 7 jouait Fadd9 ✓ — vérifié *par différence de sections*, pas par présence |
| `innerChromaticLine [9,8,7]` | la 4e voix (mezzo, sous le soprano) : **A4 (mes. 14) → A♭4 (mes. 15) → G4 (mes. 16)** — 6̂→♭6̂→5̂ dans UNE voix, tenue en rondes, dégagée par le E5 au-dessus ✓ audible par construction |
| `restatementMinVoicesDelta 1` · `restatementVelocityDelta 12` | 3 → **5** voix (delta +2) ✓ · 48 → **60** (delta exactement 12) ✓ · octave supérieure prise (E4 → E5) ✓ |
| `codaBars 2` · `codaMaxVoices 3` · `codaVelocityDelta −18` | 2 mes. ✓ · 3 voix ✓ · 60 → **42** ✓ |
| `finalCadence: plagal-borrowed` | mes. 17 **Fm (iv)** → mes. 18 **C (I)** ✓ ; et la coda **re-dit la ligne en miniature** : G4 (mes. 16) → A♭4 (17) → G4 (18) — ♭6̂ revient une dernière fois pour se résoudre. La signature du genre citée deux fois, à deux échelles |
| on ne finit jamais sur le fortissimo | sommet dynamique mes. 14–15 (le nuage), puis −18 : la courbe **redescend d'un étage** ✓ ; effectif final = celui du début |
| VL 3 et 5 voix | **zéro parallèle parfaite** sur les 20 attaques (vérifié voix à voix, toutes paires, coda comprise) · zéro croisement · zéro empilement serré sous C3 · notes communes tenues : **11 fils** dans A' (G3 tenu 3 mesures, E5 tenu 5) — les liaisons par note (F-21) portent l'intimité |
| Accords ↔ grille | Cmaj7 (sans 5te), Am7 (sans 5te), Fadd9, G7sus4 → G7, Fm6, C : les 6 qualités du donné détectées ✓ (les omissions de quinte couvertes par F-3/F-4) |
| `harmony.overchromatic: 0.6` | 2 chromatismes seulement (A♭ mes. 15, A♭ mes. 17) — le budget est presque intact : le nuage se voit parce qu'il est **seul** |

*`authorNotes` :* « A tient sur trois voix qui ne montent jamais au-dessus de B4 — c'est un plafond volontaire : A' n'a rien à conquérir si A a déjà tout occupé. La mes. 16 pose déjà la basse à C3 (et non C2) : la redescente commence *avant* la coda, sinon la coda serait une chute, pas un retrait. » *Écart assumé* : la basse quitte l'octave grave à la mes. 16 — consigné, croisé au rapport.

---

## 87.3 Épique — s03, s04

### m09-s03 *(e03 — le mur éolien ; ré mineur (éolien), 12 mes., 4 → 5 voix)*

```
| [D2+D3+A3+F4]:w    | [Bb1+Bb2+F3+D4]:w    | [F2+F3+C4+A4]:w      | [C2+C3+G3+E4]:w      |
| [D2+D3+A3+F4+A4]:w | [Bb1+Bb2+F3+D4+F4]:w | [F2+F3+C4+A4+C5]:w   | [C2+C3+G3+E4+G4]:w   |
| [D2+D3+A3+F4+A4]:w | [Bb1+Bb2+F3+D4+F4]:w | [C2+C3+G3+E4+G4]:w   | [D2+D3+A3+F4+A4]:w   |
    i                    ♭VI                    (♭VII)                 i — le marteau
```

| Contrainte | Vérif |
|---|---|
| `requiredProgressionPattern` | mes. 1–4 `i–♭VI–♭III–♭VII` · 5–8 idem · 9–12 `i–♭VI–♭VII–i` ✓ — les trois passes exactes |
| `forbidLeadingTone` | **aucun C♯ dans les 56 hauteurs** de la pièce (vérifié en pitch-classes) ✓ ; ♭VII est un **C majeur**, jamais un V |
| `forbidChordQualitiesOnDegrees {5: [7, maj]}` | le degré 5 (A) n'apparaît **dans aucune fondamentale** ✓ — l'épique évite la sensible *et* son accord |
| `finalMove: bVII-i` | mes. 11 → 12 : basse **C2 → D2, un ton entier montant**, blocs déplacés en parallèle ✓ « la conclusion au marteau » |
| `voicingSpread: wide` · `lowIntervalLimitPc 48` | template *fondamentale + octave + quinte + tierce (+ quinte aiguë)* : sous C3, **uniquement des octaves et des quintes** (D2–D3 = 12, B♭1–B♭2 = 12, B♭2–F3 = 7, C2–C3 = 12) — **zéro violation** ✓ ; l'écart resserre en montant (tierces au sommet) : l'étagement harmonique du manuel |
| `bassIntervalPreference [7,12]` | **la solution passe sous les deux lectures** : (a) *verticale* — l'étage grave est intégralement en quintes/octaves ✓ ; (b) *mélodique* — 2 des 4 mouvements de basse de la boucle sont des quintes justes (B♭1→F2, F2→C2) ✓. Aucun finding n'a donc été ouvert ; la lecture retenue (verticale, celle de la leçon) est consignée en `authorNotes` |
| quintes parallèles = grammaire | **54 parallèles parfaites** détectées (quintes et octaves), **toutes créditées** (`vl.parallel-fifths`/`-octaves` à 0,1 dans `epic-film`) — le rapport les affiche en information nommée : « planing assumé » ✓. C'est le contexte complet promis au poids 0.1 de la matrice §7.8 |
| `minVoices 4` / `maxVoices 5` | passe 1 à **4** voix, passes 2–3 à **5** : le mur *recrute* avant même que l'ostinato existe — la loi du genre appliquée à l'harmonie seule ✓ |
| `harmony.retrogression: 0` · `vl.leading-tone-resolution: 0` | ♭III→♭VII et ♭VI→♭III muettes ✓ — « harmonie de tectonique, pas d'attraction » |

*`authorNotes` :* « Aucune tierce n'est doublée sous C3 et aucun accord n'a de tierce à moins d'une dixième de la basse : c'est ce qui fait que quatre accords majeurs sonnent *sombres* — l'ombre vient du mode et du registre, jamais d'une altération. Le B♭1 est tenu par contrebasses + tuba (fiche V1) : à quatre voix il serait maigre, à cinq il est un continent. »
**Fil de continuité :** le mur de s03 est **le donné harmonique de s04** (mes. 5–16) — même pièce, deux exercices : l'harmonie d'abord, l'assemblage ensuite. Le fil est épinglé au contenu, comme `s30-yours`.

### m09-s04 *(e04 — recrute les étages ; ré mineur, 16 mes., 4/4, ♩=92 ; témoin F-54)*

`payload.Part[]` — cinq étages, une bande de registre chacun :

| Étage | Instruments (M5) | Bande | Entrée | Matière |
|---|---|---|---|---|
| fondation | contrebasses + tuba¹ + timbales¹ | ≤ 48 | mes. 1 | pédale D2 (mes. 1–4) puis les fondamentales du mur ; timbales sur D2/A1 |
| moteur | celli/altos **spiccato** | 48–60 | mes. 1 | la cellule 3+3+2, invariante |
| murs | cors ×4 + trombones¹, position large | 48–72 | mes. 5 | blocs de 4 sons, une par mesure |
| proclamation | trompettes + cors à l'unisson | 60–72 | mes. 9 | la psalmodie |
| voûte | violons aigus + flûtes/piccolo 8va | ≥ 72 | mes. 13 | tenues suraiguës |

```
MOTEUR — la cellule (1 mes., répétée 16 fois, JAMAIS variée) :
   D3:e r:q D3:e r:q A3:e r:e          ← attaques aux croches 1 · 4 · 6+  (3+3+2)
   mes. 12 uniquement :  D3:e r:q D3:e r:q r:q      ← tronquée à l'entrée de la coupure (F-54)

MURS (mes. 5–16, une ronde par mesure) :
[D3+A3+D4+F4] | [D3+F3+Bb3+D4] | [F3+A3+C4+F4] | [C3+G3+C4+E4] |
[D3+A3+D4+F4] | [D3+F3+Bb3+D4] | [F3+A3+C4+F4] | [C3+G3+C4+E4]:h. r:q |
[D3+A3+D4+F4] | [D3+F3+Bb3+D4] | [C3+G3+C4+E4] | [D3+A3+D4+F4] |

PROCLAMATION (mes. 9–16) :
D4:h F4:h | D4:w | F4:h A4:h | G4:h. r:q | A4:h F4:h | D4:h F4:h | E4:h G4:h | A4:w

VOÛTE (mes. 13–16) :
[D5+A5]:w | [D5+F5]:w | [E5+G5]:w | [D5+A5]:w
```

| Contrainte | Vérif |
|---|---|
| `layerPlan` : un étage toutes les 4 mesures | fondation+moteur mes. 1 · murs mes. 5 · proclamation mes. 9 · voûte mes. 13 ✓ — quatre paliers, quatre recrutements |
| bandes de registre disjointes par plan | fondation 34–41 · moteur 50–57 · murs 50–65 · proclamation 62–69 · voûte 74–81 ✓ ; `densityMapCheck` : aucune zone locale surchargée — **la puissance vient de la couverture** (l'immeuble, pas le tas) |
| `ostinatoRequired` · `ostinatoBarsLength [1,2]` · `ostinatoInvariant` | cellule d'**1 mesure**, 3 attaques asymétriques, identique aux 16 tours ✓ — **sauf la troncature de la mes. 12, légale par F-54** : c'est la solution-témoin du patch |
| `requireSilenceBeforeBar 13` · `silenceBeats 1` | mes. 12, temps 4 : **silence général** (moteur tronqué, murs en blanche pointée, psalmodie en blanche pointée, fondation muette) ✓ — un temps de vide, puis le tutti |
| `melodyMaxDistinctPitches 5` · `melodyMinAvgDuration "h"` | psalmodie sur **5 hauteurs** (D4 E4 F4 G4 A4), 13 notes, durée moyenne **2,38 temps** ✓ — deux vitesses simultanées : blanches sur croches |
| l'ostinato *recrute*, il ne varie pas | zéro variation de cellule ; ce qui change est l'**effectif** : celli seuls → +altos 8ve (mes. 5) → +basses spiccato (mes. 9) → +percussion mate (mes. 13). `dyn[]` : quatre paliers de vélocité (58 · 72 · 88 · 104), jamais de rampe continue |
| `melody.monotony: 0` · `orch.density-overload: 1.4` | monotonie muette (la répétition est le genre) ✓ ; surcharge muette malgré 14 pupitres à la mes. 13 — parce que chaque pupitre est **seul dans sa bande** ✓ |
| jamais jugé au piano seul | la solution est déclarée et écoutée **fondation + moteur** d'abord (l10 M5 : le piano mentirait ici plus qu'ailleurs) — `authorNotes` |
| `removed` | *« un contrechant de cors en tierces sous la proclamation : coupé — il rendait la psalmodie mélodique, donc petite. Le monde doit faire la mélodie, pas la mélodie faire le monde. »* |

*Écart assumé :* la médiante-bascule finale du schéma de l02 §5 (C→A♭) n'est **pas** employée — elle n'est pas dans les contraintes et elle contredirait le `finalMove: ♭VII→i` du fil s03. Consigné : le palier 4 conclut au marteau, pas par bascule.

---

## 87.4 Néo-noir — s05, s06

### m09-s05 *(e05 — la nuit qui revient ; do mineur, 8 mes. = 2 tours de 4, 5 voix)*

```
| [C2+Bb3+D4+Eb4+G4]:w  | [F2+Bb3+C4+Eb4+Ab4]:w | [D2+Ab3+C4+D4+F4]:w  | [Db2+Ab3+B3+F4+G4]:w |
      Cm9                       Fm11                    Dm7♭5                  D♭7♯11
| [C2+Bb3+D4+Eb4+G4]:w  | [F2+Bb3+C4+Eb4+Ab4]:w | [D2+Ab3+C4+F4+Ab4]:w | [Db2+Ab3+B3+F4+G4]:w |
      Cm9                       Fm11                    Dm7♭5                  D♭7♯11 → (Cm9)
```

| Contrainte | Vérif |
|---|---|
| `loopTours 2` · `loopReturnChord Cm9` | deux tours de 4 ; mes. 5 **et** le bouclage de la mes. 8 retombent sur **Cm9**, dans le **même voicing** ✓ |
| couture invisible (`harmony.loop-coherence: 1.5`) | la couture mes. 8→1 est **la copie exacte** de la couture mes. 4→5 : basse −1, deux voix −1, une −3, une tenue. Le tour ne se recolle pas : il *retombe*, deux fois de la même façon ✓ |
| `mustInclude tritoneSub ≥ 1` | **D♭7♯11 = subV7/i**, mes. 4 et 8, exactement là où le G7 était attendu ✓ ×2 ; résolution par demi-ton descendant à la basse ✓ (`harmony.tritone-sub-resolution` satisfaite) |
| `forbiddenCadences [perfect]` | aucun V→i dans la pièce : la dominante n'existe pas, seul son couloir ✓ |
| `minEnrichedChords 6` | **8/8** enrichis : Cm9 ×2, Fm11 ×2, Dm7♭5 ×2, D♭7♯11 ×2 ✓ — la 11 posée sur le Fm (B♭ tenu, l18 §2 : la 11 est libre sur m7) |
| `allowedColors` | m9 · m11 · m7♭5 · 7♯11 — quatre couleurs de la liste, aucune hors liste ✓ (le D♭7 porte **3, ♯11, 5, ♭7** : c'est un 7♯11 complet, pas un 7 nu) |
| mouvement chromatique de basse | **C2 · F2 · D2 · D♭2** puis retour C2 : la descente **D → D♭ → C** est jouée deux fois — la fatalité en trois demi-tons ✓ |
| VL 5 voix | **zéro parallèle parfaite**, zéro croisement (vérifié sur les 9 attaques, bouclage compris) ; A♭3 est **tenu 4 mesures** aux mes. 5–8, B♭3 tenu 2 : la brume est faite de fils, pas d'accords |
| `harmony.unresolved-seventh: 0.2` | 6 septièmes non résolues, muettes par matrice ✓ — la dette est *refinancée*, pas remboursée |
| Craft — la seule différence entre les tours | mes. 7 : la ♭5 (A♭4) monte au sommet du voicing au lieu de la ♭3 (F4). **Un mot changé sur huit mesures** : le développement est timbral, l'harmonie ne bouge pas ✓ |

*`authorNotes` :* « La boucle ne contient aucune note qui ne soit atteinte par demi-ton, ton ou tenue, sauf une (F4→A♭4, mes. 7 du second tour) : c'est l'unique geste qui *avoue* que le tour n'est pas le premier. »

### m09-s06 *(e06 — filature nocturne ; do mineur, 28 mes., ♩=58 ; témoin F-56)*

`rolePlan` — **3 rôles actifs + 1 événement** (F-56 : les éléments sont comptés dans leur rôle) :

| Rôle | Éléments | Espace | Vie |
|---|---|---|---|
| fondation | contrebasses **pizz** sur les fondamentales · drone sub sinus **G1** (−18 dB, mono) | **sec, reverb 0** | mes. 1 → 28 |
| nappe | cordes divisi **con sord** (les 4 voix supérieures de la boucle s05) · vinyl crackle (−22 dB) | reverb 6 s | mes. 5 → 26 |
| voix | **trompette bouchée** (`mute: "straight"`, F-40) — UNE voix, jamais un tutti | reverb 6 s, pré-delay 40 ms | mes. 9 → 20 |
| *événement* | cluster de cordes con sord **ppp → mf** (seconde mineure E♭/D qui enfle) | — | mes. 17 → 19 |

```
LA VOIX (trompette bouchée — fragments, jamais une phrase)
m9  r:h G4:q Bb4:e C5:e   | m10 Eb5:h. r:q      | m11 r:w             | m12 r:h G4:h
m13 r:q C5:e Eb5:e G5:h   | m14 G5:q F5:h Eb5:q | m15 r:h Ab4:h       | m16 r:w
m17 r:w                   | m18 r:w             | m19 r:q Eb5:e D5:e C5:h | m20 r:h G4:h
                                                                            ↑ la même note
                                                                              qu'à la mes. 12 :
                                                                              le ♯11 du couloir,
                                                                              dernier mot, non résolu
FONDATION (pizz, une attaque par mesure ; mes. 9–16 : + une contretemps sur 2,5)
C2 | F2 | D2 | Db2  ×7 tours          (mes. 28 : drone seul, aucun pizz)
```

| Contrainte | Vérif |
|---|---|
| `structure: loop-voice-event-amputated-return` | la ville (mes. 1–8 : fondation, nappe à la mes. 5) → la voix (9–16) → l'événement (17–20) → **le retour amputé** (21–28 : la boucle initiale MOINS la trompette) ✓ |
| `maxActiveLayers 3` · `maxTextureEvents 1` | 3 rôles simultanés au maximum (mes. 9–20) ✓ · **un seul** événement de texture ✓ — compté par rôles (F-56) ; les 5 éléments passent la pyramide de niveaux et `sd.sub-conflict` (un seul roi sous 90 Hz : le G1) |
| `singleLeadVoice` | une seule voix principale sur toute la pièce, jamais doublée, jamais en tutti ✓ |
| `finalTextureDelta −1` · `endWithoutResolution` | mes. 21 : la voix disparaît (−1) ; mes. 27 : la nappe se retire ; **mes. 28 : le drone seul, sur le D♭7♯11 — on finit plus vide qu'on a commencé** ✓ ; aucune cadence, aucun retour au i final ✓ |
| `forbiddenCadences [perfect, plagal]` | aucune ✓ — la boucle s'arrête sur son couloir |
| `tempoRange [50,75]` · `syncopationTarget [0.05,0.2]` | ♩=**58** ✓ · syncopation mesurée **0,15** (les contretemps de pizz des mes. 9–16 + trois croches d'appui de la trompette) ✓ — « le swing fantôme » reste subliminal, aucune grille affirmée |
| règle d'or : de l'espace | `densityMapCheck` muet : la fondation est **sèche** (le pizz et le sub sans reverb — la lisibilité du grave), la reverb longue est réservée à la voix et aux textures ✓ ; la trompette **ne joue que 9 fragments sur 28 mesures** : elle se taît plus qu'elle ne parle |
| développement timbral, non thématique | l'harmonie est celle de s05, **inchangée sur 7 tours** ; ce qui se développe : entrée de la nappe, entrée/sortie de la voix, cluster, retrait. `melody.monotony: 0.2` muette ✓ |
| `dyn[]` | fondation plate (48) ; nappe en arche lente (32 → 58 → 30) ; cluster **ppp → mf** sur 3 mesures (18 → 76) puis coupé net à la mes. 20 : le sommet est **un événement de texture**, pas une note aiguë |
| `removed` | *« un vibraphone de ponctuation (les gouttes de l03 §2) : coupé — quatre couches, et la nuit devenait meublée. Trois rôles, c'était déjà le plafond ; le silence est la quatrième couche. »* |

---

## 87.5 Thriller — s07, s08

### m09-s07 *(e07 — la vis ; mi mineur, 16 mes. = 4 tours de 4, 5 voix)*

```
tour 1 (vis = B3)  | [E2+E3+G3+B3+E4]:w  | [E2+F3+A3+B3+E4]:w  | (×2)
tour 2 (vis = C4)  | [E2+E3+G3+C4+E4]:w  | [E2+F3+A3+C4+E4]:w  | (×2)
tour 3 (vis = C♯4) | [E2+E3+G3+C#4+E4]:w | [E2+F3+A3+C#4+E4]:w | (×2)
tour 4 (vis = D4)  | [E2+E3+G3+D4+E4]:w  | [E2+F3+A3+D4+E4]:h r:h
                                                            ↑ mes. 16 : LA COUPURE
```

| Contrainte | Vérif |
|---|---|
| `staticRootBars [1,16]` · `staticRootPc 4` | **E2 tenu aux 16 mesures**, sans une seule interruption ✓ — le sol qui ment |
| `maxDistinctChordsPerTour 2` | deux verticalités par tour, alternées : **i ↔ ♭II sur pédale** (Em ↔ F/E) ✓ — le balancement ♭2̂ de l07 M1, deux accords pour une scène |
| `screwVoice {ascentSemitonesPerTour: 1, sameVoiceThroughout: true}` | la **4e voix**, interne, tenue pendant tout son tour : **B3 → C4 → C♯4 → D4** ✓ — un demi-ton par tour, jamais deux, jamais ailleurs. C'est *elle* que l'analyseur suit, et c'est le seul paramètre qui bouge |
| harmonie fixe sous la vis | les voix 2 et 3 rejouent exactement le même balancement (E3↔F3, G3↔A3) aux 4 tours ; la voix 5 (E4, l'aiguille) est **immobile 16 mesures** ✓ — la mécanique est parfaite, seule la vis tourne |
| `forbiddenCadences [perfect, plagal, imperfect]` | zéro cadence : aucune dominante n'existe (la sensible D♯ n'apparaît jamais), le ♭II ne résout pas ✓ |
| `endType [onDominant, cut]` | **coupure** : mes. 16, le ♭II sonne deux temps puis rien — pas de fin, un arrêt ✓ |
| `loop-coherence 1.5` | la couture de tour est identique aux quatre tours (F3→E3, A3→G3, vis +1) : la vis **tourne sans à-coup** ✓ — l'hypnose ne casse pas |
| VL 5 voix | zéro parallèle parfaite, zéro croisement (la vis passe *sous* E4 jusqu'à D4 = 62 < 64) ✓ ; ce que la vis produit en montant : quinte → sixte mineure → sixte majeure → septième au-dessus de G3 — le serrage **s'entend** et se mesure |
| `melody.tension-placement: 0` · `melody.monotony: 0` · `harmony.unresolved-seventh: 0` | les trois muettes par matrice ✓ — « le style réécrit les lois » (m02-l13) |

*`authorNotes` :* « Le tour 3 est le moment où la vis devient un mensonge harmonique : {E, G, C♯} n'a plus de nom simple, et {F, A, C♯, E} non plus. C'est voulu — la pédale tient pendant que le monde se déforme (l15/l24 M1). La réalisation rythmique de cette boucle n'appartient pas à cet exercice : elle est le sujet d'e08. »

### m09-s08 *(e08 — le tic-tac et la coupure ; mi mineur, 7/8, 32 mes., ♩=63→69 ; témoins F-54 et F-55)*

```
LA CELLULE (1 mes. de 7/8, une seule hauteur, grave, SEC — 3+2+2)
   E2:e r:e r:e E2:e r:e E2:e r:e         ← attaques aux croches 1 · 4 · 6
   mes. 24 : E2:e r:e r:e E2:e r:e r:q    ← L'APNÉE : 2 croches de rien (F-54)
   mes. 32 : E2:e r:e r:e                 ← LA COUPURE : le tic-tac s'arrête, rien après
```

`payload.tempoPlan` (F-55) : `[{bar 1, 63}, {bar 9, 65}, {bar 17, 67}, {bar 25, 69}]` — **+2 BPM toutes les 8 mesures**, l'urgence qu'on ne peut pas nommer.

| Tour | Mes. | Ce qui se serre (UN paramètre par tour) |
|---|---|---|
| 1 | 1–4 | le tic-tac seul (celli spiccato, reverb 0) |
| 2 | 5–8 | + le sol qui ment : pédale de contrebasses **E1**, tenues |
| 3 | 9–12 | + l'étau chromatique : altos con sord **B3** tenu · **♩=65** |
| 4 | 13–16 | + le cluster : cordes con sord **E4/F4** ppp cresc. · étau **C4** |
| 5 | 17–20 | + l'aiguille : violons suraigus **B5** tenus, harmoniques · étau **C♯4** · **♩=67** |
| 6 | 21–24 | l'étau **D4** ; rien d'ajouté — puis **l'APNÉE** (mes. 24, 2 croches) |
| 7 | 25–28 | **LE COUP** (mes. 25, croches 1–3 : tutti bref + col legno¹ + timbales, ff) — puis le tic-tac **reprend dans la même mesure**, doublé piano grave sec · étau **E♭4** · **♩=69** |
| 8 | 29–32 | rien de neuf, tout plus serré — mes. 32 : **COUPURE** |

| Contrainte | Vérif |
|---|---|
| `ostinatoRequired` · `ostinatoInvariant` · `ostinatoMaxDistinctPitches 1` | **une seule hauteur (E2)** sur 32 mesures ; cellule identique à chaque tour ✓ — les deux seules altérations sont l'apnée (mes. 24) et la coupure (mes. 32), **légales par F-54** : la solution est le témoin du patch |
| `ostinatoRegisterMax 55` | E2 = **40** ✓ ; le doublage post-coup est un piano grave sec (E2 également) — la mécanique reste sous C3 |
| `meter 7/8` · `rhythm.meter-integrity: 1.2` | 3+2+2 tenu aux 32 mesures, accents aux croches 1·4·6 ✓ — le pas qui boite : l'auditeur ne peut pas s'installer |
| `tempoDriftBpmPer8Bars [1,3]` · `tempoRange [60,75]` | +2 exactement à chaque palier (63 → 69) ✓ ; enveloppe entière dans la fourchette ✓ (F-55 : `tempoRange` s'évalue sur min/max du `tempoPlan`) |
| `requireOstinatoInterruption` · `interruptionBeats [1,2]` | **2 croches** de silence général à la fin de la mes. 24 — juste avant le coup : l'apnée placée là où elle fait le plus peur ✓ (unité = la croche, F-54) |
| `maxTextureEvents 1` · `eventMaxBars 1` | **un seul** coup, mes. 25, **3 croches** (moins d'une mesure) ✓ — et il ne libère rien : le tic-tac reprend *dans la même mesure* |
| `postEventTightening` | après le coup : +1 élément (piano grave), +1 demi-ton d'étau (E♭4), +2 BPM ✓ — la vis reprend un cran plus serré |
| `endType [cut]` · `forbiddenCadences` (les quatre) | mes. 32 : trois croches, puis rien. Aucune cadence, aucune arrivée, aucun accord final ✓ — **la résolution appartient à l'image** |
| le thriller est SEC | reverb déclarée : tic-tac **0**, pédale 0, cluster 1,2 s, aiguille 1,8 s — aucune nappe résonante sur la mécanique ✓ ; `orch.density-overload: 1.2` muette (5 éléments maximum, bandes disjointes) |
| `dyn[]` | tic-tac **plat à 64 sur 32 mesures** (le pattern est inhumain : ni crescendo, ni humanisation) ; tout le mouvement dynamique est dans les couches ajoutées : cluster 16→72, aiguille 24→60, coup 118 |
| `humanize` | **absent volontairement** — déclaré : `humanize: null`, `authorNotes` : « le tic-tac quantisé au tick est le seul endroit du corpus où la machine est le bon interprète » (contre-emploi assumé de F-35) |
| `removed` | *« un second ostinato en contretemps aux bois : coupé — deux mécaniques font un groove, et le groove fait de l'action, pas de la peur. »* |

¹ mentions V1 : col legno = le bois de l'archet, squelettique ; cor bouché = métallique menaçant.

---

## 87.6 Bilan du lot — MODULE 9 CLOS

| Livré | **8 solutions** (s01→s08) — romance, épique, néo-noir, thriller : deux exercices par genre, un d'écriture, un d'assemblage |
|---|---|
| Findings | **F-52** (mapping `given.chords` ↔ mesures — sans lui e01 est insoluble), **F-53** (référentiel de `climaxWindow`), **F-54** (invariance d'ostinato vs. silences déclarés + unité de temps en mesure asymétrique — **PRIORITAIRE**, deux specs auto-contradictoires), **F-55** (`tempoPlan[]`, la Tempo Track déclarative — **PRIORITAIRE**), **F-56** (`maxActiveLayers` = rôles, pas éléments) |
| Ordre des PR | **F-54 + F-55 d'abord** (checker + schéma : sans eux, s04, s06 et s08 échouent par construction), puis F-52/F-53/F-56 (contenu + fixtures), puis les 8 solutions |
| Constat de méthode | ~25–35 min/solution. Le module de synthèse est **le moins coûteux musicalement** (tout le vocabulaire existe déjà : s03 est le mur de l02, s05 la boucle de l03) et **le plus coûteux en contrat** : 5 findings pour 0 patch de règle musicale — les genres ne demandent pas de nouvelles lois, ils demandent que les consignes disent ce qu'elles mesurent |
| Fils de continuité | le mur éolien de **s03 devient le donné de s04** (mes. 5–16) ; la boucle de **s05 devient le socle harmonique de s06** ; la vis de **s07 devient la matière de s08** — dans chaque genre, l'exercice d'écriture *nourrit* l'exercice de scène. Les quatre genres sont ainsi quatre pièces jouables, pas huit fragments |
| Legs aux autres modules | `tempoPlan[]` (F-55) → M10 (VariAudio/Tempo Track) et M2 (les gabarits à tempo mobile) ; l'exemption de fenêtre de silence (F-54) → tout exercice à ostinato ; les 8 solutions alimentent les **16 clips « lexiques de genre »** du catalogue M12 §86.2-G (progression-type, geste mélodique, couche signature, anti-modèle : les quatre par genre sont déjà écrits ici — coût de production quasi nul) |
| État M9 | **8/8 ✅** — quatre leçons, huit exercices, huit solutions, quatre quiz : le module est intégralement solutionné |
| Cumul projet | **191 solutions/étalons** · **56 findings** |

**Ce que le lot prouve, au-delà du CI :** les quatre genres du MVP sont réalisables *avec le seul vocabulaire des modules 1–8*, sans une règle de plus. La romance est une période avec un iv emprunté ; l'épique un mode éolien étagé ; le néo-noir une boucle qui refuse la dominante ; le thriller une pédale et un demi-ton par tour. Le module 9 n'enseigne pas de nouvelles notes — il enseigne **où mettre celles qu'on a**. Les huit solutions sont la démonstration que la promesse tient.

---

### Annexe — protocole de vérification employé

Chaque solution harmonique (s02, s03, s05, s07) a été passée à un vérificateur écrit pour ce lot, sur les hauteurs MIDI compilées : parallèles parfaites (toutes paires de voix, direction comprise), croisements, limite d'intervalle grave (`lowIntervalLimitPc`), et jeu de pitch-classes par attaque comparé au donné. Résultats consignés dans les tables : **0 parallèle** pour s02, s05, s07 ; **54 parallèles créditées** pour s03 (la grammaire du genre) ; 0 croisement et 0 violation d'espacement partout. La mélodie de s01 a été mesurée de la même façon (ratio conjoint 0,762 · saut max 9 dt · fenêtre de climax 0,81/0,63 · 3 occurrences de motif), et les cellules d'ostinato de s04/s08 contrôlées à la croche (4,0 temps en 4/4 ; 3,5 en 7/8).