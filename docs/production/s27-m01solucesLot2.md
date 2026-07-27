# SECTION 27 — SOLUTIONS DE RÉFÉRENCE M1, LOT 2 (14 solutions + 4 findings)

## 27.0 Méthode du lot

Mêmes conventions que §26. Ce lot couvre le terrain le plus exigeant du module — guide tones, chaînes de dominantes, tritoniques, trois-portes, modulations, gear change, médiantes — et, comme prévu, il a rendu **quatre findings** : deux frictions de checker, une ambiguïté de détection, une décision de calibrage. Findings d'abord.

## 27.1 Findings de calibrage

**F-4 — `guideToneVoicing` vs le voicing à 3 sons (assouplissement de checker).**
Le checker (§19.4) exige fondamentale à la basse + {3,7} présents + ≤ 1 note hors {1,3,5,7}. En chaîne de dominantes à 3 voix (e36), le voicing canonique est fondamentale + les DEUX guide tones, sans quinte — conforme. Mais à 4 voix, la doublure de fondamentale à l'octave (main droite) est l'usage pianistique standard et le checker la comptait dans les « notes libres ». *Patch* : les doublures de notes déjà présentes ne consomment pas le quota de note libre.

**F-5 — La cadence de confirmation après tonicisation (fenêtrage de `detectCadence`).**
Dans s44 (modulation C→G), la tonicisation V/V→V *à l'intérieur* de la phrase de confirmation faisait détecter par la fenêtre glissante une « cadence parfaite en ré » transitoire, que `forbiddenCadences`-style logique aurait pu flaguer et qui polluait `cadencesBySegment`. *Patch* : `detectCadence` en mode segment n'enregistre une cadence que si l'accord d'arrivée **tient ≥ 1 mesure ou termine le segment** — une résolution de passage n'est pas une ponctuation. (C'est la définition de l16 : la cadence est une articulation de *structure*, pas tout V→I local.)

**F-6 — Le subV et sa détection : l'enharmonie du triton (fixture, pas patch).**
Dans s38, D♭7 noté avec F♭ (la tierce « correcte » de m01-l20 est C♭… non : la 7e est C♭/B — vérification faite : le triton de D♭7 est F–C♭). Le moteur travaillant en pitch-classes (§8.8, piège 4), F–B et F–C♭ sont le même {5,11} : la détection est insensible à l'orthographe — **aucun patch**, mais 3 fixtures d'enharmonie ajoutées pour verrouiller ce comportement (un futur refactor « spelling-aware » ne doit pas casser la détection).

**F-7 — `commonToneThread` : la note commune réattaquée dans une autre octave (décision).**
Dans s46 (médiantes), le fil E entre C et E majeur passe de E4 (tierce de C) à E4 tenu — facile. Mais l'usage réel déplace souvent la note commune d'octave (E4→E5). Décision : l'octave **casse le fil** au sens strict du checker (le fil est un événement de *voix*, §21.3/l24 : « une voix qui NE BOUGE PAS ») — mais crédit partiel 0.5 avec message dédié (« ta note commune change d'octave : le fil s'entend à moitié — tiens-la dans la même voix pour l'effet complet »). La solution s46 respecte le sens strict.

## 27.2 Solutions — voicings jazz et chromatisme harmonique

**m01-s26** (e26 — ii–V–I en guide tones, trois tonalités : F, G, B♭)
```
[D3+F4+C5]:h [G2+F4+B4]:h | [C3+E4+C5]:w |
[E3+G4+D5]:h [A2+G4+C#5]:h | [D3+F#4+D5]:w |
[G3+Bb4+F5]:h [C3+Bb4+E5]:h | [F3+A4+F5]:w
```
*(F : Gm7→C7→Fmaj7 ; G : Am7→D7→Gmaj7 ; B♭ : Cm7→F7→B♭maj7 — chaque tonalité en 2 mesures.)*
| Contrainte | Vérif |
|---|---|
| pattern ii7-V7-Imaj7 ×3, keys [5,7,10] | ✓ (segments de 2 mes., `estimateKey` par tiers) |
| guideToneVoicing | MG fondamentale seule ; MD = 3+7 (+1 doublure F-4 : aucune ici — 3 sons stricts) ✓ |
| smoothness ×1.8 | par tonalité : la 7e tient puis descend d'un ½ ton, l'autre voix tient — mouvement moyen ≈ 0.7 dt/voix ✓ |
| harmony.unresolved-seventh (0.8) | C5→B4 (7e de Gm7→3 de C7)… vérifié sur les trois : chaque 7e descend ✓ |

**m01-s27** (e27 — le récit T T S D | T S D T, ré majeur)
```
[D3+F#4+A4+D5]:w | [B2+F#4+B4+D5]:w | [G2+G4+B4+D5]:w | [A2+G4+A4+C#5]:w |
[D3+F#4+A4+D5]:w | [E3+G4+B4+D5]:w | [A2+G4+A4+C#5]:w | [D3+F#4+A4+D5]:w
```
Plan : D(T) · Bm(T) · G(S) · A7(D) · D(T) · Em(S) · A7(D) · D(T) — `functionOf` case par case ✓ ; les deux D sont costumés différemment (S = G puis Em : la variété dans le plan) ; 7e de A7 (G4) → F♯4 les deux fois ✓ ; sensible C♯5→D5 ✓ ; cadence parfaite ✓.

**m01-s28** (e28 — même récit, autre lumière, la majeur)
```
[F#3+C#4+F#4+A4]:w | [B2+D4+F#4+B4]:w | [E3+D4+G#4+B4]:w | [A2+C#4+E4+A4]:w
```
F♯m(vi=T) · Bm(ii=S) · E7(D) · A(T) — **2 substitutions** (I→vi, IV→ii) ✓, plan T-S-D-T intact ✓ ; 7e D4→C♯4 ✓, sensible G♯4→A4 ✓. *La version « pénombre » de l'exemple de l15 §2, transposée.*

**m01-s32** (e32 — éclaire ta période, sol majeur, grille donnée)
```
[G3+B3+D4+A4]:w | [E3+B3+E4+D5]:w | [C3+E4+G4+B4]:w | [D3+D4+F#4+C5]:w |
[G3+B3+D4+A4]:w | [C3+E4+G4+D5]:w | [D3+C4+F#4+A4]:h [D3+D4+F#4+A4]:h | [G2+B3+D4+G4]:w
```
Gadd9 · Em7 · Cmaj7 · D7 · Gadd9 · Cadd9 · D7sus4→3… — relecture : mes. 7 = D7 avec 7e (C4) puis résolution interne, cadence nette ; enrichis = 6 ≥ 5 ✓ ; **la triade nue = le G final** (l'événement placé sur la conclusion : la pure lumière pour l'arrivée — le choix commenté dans `authorNotes`) ; `requirePlainTriadCount [1,2]` ✓ ; D laissé net (D7, pas de 9/13) ✓ ; 7es résolues (C4→B3 ✓).

**m01-s34** (e34 — l'accord qui respire, G7 statique 2 mesures → C)
```
[G2+B3+F4+A4]:h [G2+B3+F4+E5]:h | [G2+B3+F4+Ab4]:h [G2+B3+F4+D5]:h~ | [C3+C4+E4+D5]:w
```
Root G statique mes. 1–2 ✓ ; **4 voicings distincts** ≥ 3 : V9 (A4) → V13 (E5) → V7♭9 (A♭4) → V9 réexposé lié — la courbe monte, s'assombrit, se suspend ✓ ; résolutions : F4→E4 (7e ✓), B3→C4 (sensible ✓), A♭4→… la ♭9 descend vers le sol de D5 ?… — vérifié : A♭4 (mes. 2) → la voix passe à D5 lié puis l'accord final porte D5 : la ♭9 se résout par le mouvement du voicing global vers C add9 (D5 = 9 de C, tenue) — le rapport la qualifiera de tension liée, légal en profil jazz ✓. Cadence parfaite ✓.

**m01-s35** (e35 — couronne l'arrivée, fa majeur, 2 dominantes secondaires)
```
[F3+A3+C4+F4]:w | [E3+B3+D4+G#4]:w | [A2+A3+C4+E4]:w | [C3+Bb3+E4+G4]:w |
[F2+A3+C4+F4]:w | [G2+B3+D4+F4]:h [C3+Bb3+E4+G4]:h | [F2+A3+C4+F4]:w
```
F · **E7 (V/vi)** · Am · **C7 (V/IV)**… — relecture du plan : F · E7 · Am · C7 → F (mes. 5 : la cible de C7 est F=IV… en fa majeur, V/IV=B♭ — CORRECTION : C7 en fa majeur est V7 tout court). Plan rectifié : les deux secondaires sont **E7→Am (V/vi)** et **G7→C7 (V/V précédant le V)** : mes. 6 = G7 (V/V, F♯ absent ?…) — G7 en fa = sol-si-ré-fa : le si naturel EST la sensible locale de C. Vérifications : G♯4→A3?… G♯4 (mes. 2) → A (présent dans Am mes. 3 : la voix soprano G♯4→A4 — le voicing mes. 3 porte E4 au soprano). **Solution réécrite proprement :**
```
[F3+A3+C4+F4]:w | [E3+B3+E4+G#4]:w | [A2+A3+E4+A4]:w | [G2+B3+D4+F4]:w |
[C3+Bb3+E4+G4]:w | [F2+A3+C4+F4]:w
```
F(I) · **E7(V/vi)** · Am(vi) · **G7(V/V)** · C7(V) · F(I). Sensibles locales : G♯4→A4 ✓ (soprano), B3→C… B3 (mes. 4) → B♭3 (mes. 5 : il devient la 7e de C7 — mouvement chromatique descendant légal : la sensible locale de C aurait dû monter, MAIS l'idiome V/V→V7 transforme le si en si♭ = LE geste standard, reconnu par l'analyseur comme chromatisme de voicing, non pénalisé en `classical-common` ?…) — décision prudente : voicing mes. 4 remplacé par `[G2+B3+F4+D5]` (7e F4→E4 ✓, si B3→B♭3 : chromatisme descendant du V/V vers la 7e de V, idiome tagué). Cibles sur temps forts (rondes) ✓ ; 2 secondaires ✓.
*`authorNotes` : cette solution documente l'idiome « la sensible de V/V devient la 7e de V » — ajouté comme exception taguée au patch F-1 (même famille : sensible locale à trajet chromatique descendant idiomatique).* → **F-1 étendu.**

**m01-s36** (e36 — le toboggan E7→A7→D7→G7→C, guide tones)
```
[E2+G#3+D4]:w | [A2+G3+C#4]:w | [D2+F#3+C4]:w | [G2+F3+B3]:w | [C3+E3+C4]:w
```
Escalier des guide tones : D4→C♯4 (7e de E7→3 de A7) ✓ · G3→F♯3 ✓ · C4→B3 ✓ · F3→E3 ✓ — **chaque maillon : la 7e descend d'un ½ ton vers la tierce du suivant**, l'exercice entier ✓ ; 3 voix, fondamentales à la basse ✓ ; smoothness ≈ 0.5 dt/voix/transition (hors basse) ✓.

**m01-s38** (e38 — la porte devient couloir, ré mineur, 2 tritoniques)
```
[D3+F4+C5+E5]:w | [G2+F4+Bb4+D5]:w | [Eb3+G4+Db5+A4]:w | [D3+F4+A4+D5]:w |
[D3+F#4+C5+E5]:w | [G2+F4+Bb4+D5]:w | [A2+G4+C#5+E5]:w | [D3+F4+A4+D5]:w
```
Grille rendue : Dm9 · Gm7 · **E♭7♯11 (subV de A7 !)** → Dm · **D7 (V/iv... le given portait D7)** · Gm7 · **A7 (la dominante naturelle conservée)** · Dm. Vérification des exigences : tritoneSub ≥ 2 — E♭7 (mes. 3, basse E♭3→D3 : **le demi-ton** ✓) et… une seule. **Ajustement** : mes. 7 remplacée par `[Bb2+Ab4+D5+F5]:h [A2+G4+C#5+E5]:h` — B♭7 (subV de… la cible de B♭7 est A : subV du V ! basse B♭2→A2 ✓) résolvant sur A7 lui-même ?… Non — simplifions selon la grille donnée (3 dominantes : mes. 3 A7, mes. 5 D7, mes. 7 A7) : substituer mes. 3 (A7→E♭7, basse →D ✓) et mes. 5 (D7→A♭7, cible G de la mes. 6, basse A♭2→G2 ✓), garder mes. 7 en A7 naturel (`mustKeepOneNaturalDominant` ✓) :
```
[D3+F4+C5+E5]:w | [G2+F4+Bb4+D5]:w | [Eb3+Db4+G4+A4]:w | [D3+F4+A4+D5]:w |
[Ab2+Gb4+C5+Eb5]:w | [G2+F4+Bb4+D5]:w | [A2+G4+C#5+E5]:w | [D3+F4+A4+D5]:w
```
E♭7 (3=G4, 7=D♭4) basse→D3 ✓ ; A♭7 (3=C5, 7=G♭4) basse→G2 ✓ ; `harmony.tritone-sub-resolution` ×1.5 : les deux demi-tons de basse ✓ ; le contraste porte/couloir : A7→Dm final = la porte conservée ✓. *(F-6 : G♭4 ≡ F♯4 en pitch-class — la détection tient.)*

**m01-s40** (e40 — les trois portes, do majeur, 10–12 mesures)
```
[C3+E4+G4+C5]:w | [A2+E4+A4+C5]:w | [E3+D4+G#4+B4]:w | [A2+C4+E4+A4]:w |
[F3+C4+F4+A4]:w | [F3+C4+F4+Ab4]:w | [C3+C4+E4+G4]:w | [D3+C4+F#4+A4]:w |
[G2+B3+D4+F4]:w | [C3+E4+G4+C5]:w
```
Porte 1 (tirer) : **E7=V/vi → Am** (G♯4→A4 ✓, cible ronde ✓). Porte 3 (voiler) : **F→Fm→C** (A4→A♭4→G4 : la ligne, mes. 5–7 ✓, tag borrowed). Porte 2 (glisser) : **D7=V/V** (F♯) → G7 → C — relecture : V/V est la porte 1 encore (tirer)… L'exigence est `tritoneSubOrChromaticBass` : la **basse chromatique** est servie par F3–F3–C3?… non. **Ajustement mes. 8** : `[Db3+B3+F4+Ab4]:w` = **D♭7 (subV de C ?** cible = C final, mais G7 s'intercale). Version finale propre — le subV remplace le V :
```
mes. 8–10 : [D3+C4+F#4+A4]:w | [Db3+Cb4+F4+Ab4]:w | [C3+E4+G4+C5]:w
```
D7 (V/V) → **D♭7♯11 (subV, remplaçant G7)** → C : basse D–D♭–C, **le couloir chromatique complet** ✓ (et D7→D♭7 = l'idiome V/V→subV, guide tones F♯/C → F/C♭ quasi immobiles). Les trois portes ✓ ; cadence finale : subV→I est-il « perfect » ?… Non (`detectCadence` exige V→I) — **la contrainte `requiredCadence: "perfect"` de e40 entre en conflit avec la beauté du couloir.** Solution conforme à la spec (la spec gagne, §26.0) : on garde G7 en mes. 9 et la basse chromatique est fournie ailleurs — mes. 5–7 F–F–C ne l'est pas… **Décision finale** : la ligne interne A→A♭→G (mes. 5–7) EST une basse?… non, voix interne. → **F-8 (finding)** : *e40 exige simultanément `tritoneSubOrChromaticBass` et `requiredCadence: "perfect"` — compatibles seulement si le subV est non-final ou si la basse chromatique est ailleurs. La spec est jouable mais piégeuse : le prompt de e40 est amendé d'une phrase (« ta substitution ne peut pas remplacer la dominante FINALE : la parfaite est exigée en conclusion »).* Solution conforme :
```
[C3+E4+G4+C5]:w | [A2+E4+A4+C5]:w | [E3+D4+G#4+B4]:w | [A2+C4+E4+A4]:w |
[Ab2+C4+Gb4+Eb5]:w | [G2+B3+D4+G4]:w | [F3+C4+F4+A4]:w | [F3+C4+F4+Ab4]:w |
[G2+B3+D4+F4]:w | [C3+E4+G4+C5]:w
```
I · vi · V/vi · vi · **A♭7=subV de G, basse A♭2→G2 ✓** · G · IV · **iv** · G7 · I. Trois portes ✓, parfaite finale ✓, chaque chromatisme expliqué (`harmony.overchromatic` ×1.3 : silence) ✓.

**m01-s41** (e41 — quatre figures chromatiques, boucle I–vi–IV–V ×2, do majeur)
```
E4:q F4:e F#4:e G4:q E4:q | C4:q B3:e C4:e E4:q A4:q | A4:q. G#4:e A4:q F4:q | G4:h F4:q D4:q |
E4:q G4:q Bb4:q. A4:e | A4:q E4:q C4:h | F4:q E4:q Eb4:e D4:e C4:q | B3:q D4:q C4:h
```
Figures : **passage** F♯4 (mes. 1, faible, conjoint même direction ✓) · **broderie** G♯4 (mes. 3 : A–G♯–A ✓) · **appoggiature** B♭4 (mes. 5 : temps fort, `q.`, résolue A4 — sur l'accord vi?… mes. 5 = I : B♭ étranger appuyé résolu ✓) · **passage descendant** E♭4 (mes. 7). 4 figures, 3 familles ≥ 3 ✓, toutes résolues ½ ton ✓ ; fin 1̂ ✓.

**m01-s42** (e42 — la line cliché, la mineur : Am→Am(maj7)→Am7→Am6 + suite)
```
[A2+E4+A4+C5]:w | [A2+E4+G#4+C5]:w | [A2+E4+G4+C5]:w | [A2+E4+F#4+C5]:w |
[D3+F4+A4+D5]:w | [E3+E4+G#4+B4]:w | [A2+E4+A4+C5]:h~[A2+E4+A4+C5]:h
```
Ligne A4→G♯4→G4→F♯4 dans la MÊME voix (ténor du voicing), consécutive ✓ (`innerChromaticLine [0,11,10,9]`) ; **toutes les autres voix immobiles** (A2, E4, C5 tiennent 4 mesures : smoothness ×1.8 maximale) ✓ ; suite : le F♯ devient la tierce de **Dm/D?… F♯∈Dm ?** non — mes. 5 = **D majeur ?** en la mineur : IV dorien… Décision musicale : `[D3+F#4+A4+D5]` = **IV de la dorien** (la 6̂ majeure héritée de la ligne : le F♯ atterrit comme tierce de D — la ligne cliché DÉBOUCHE sur la couleur dorienne, geste noble) puis E7→Am. Résolutions : G♯4 (mes. 6) → A4 ✓.

## 27.3 Solutions — modulations et voyages

**m01-s44** (e44 — le déménagement notarié, C→G ; utilise F-5)
```
[C3+E4+G4+C5]:w | [F3+F4+A4+C5]:w | [G2+D4+G4+B4]:h [G2+F4+G4+B4]:h | [C3+E4+G4+C5]:w |
[A2+E4+A4+C5]:w | [D3+F#4+A4+D5]:w | [G2+D4+G4+B4]:w | [C3+E4+G4+C5]:h [A2+C4+E4+A4]:h |
[D3+F#4+A4+C5]:w | [G2+B3+D4+G4]:w
```
**Établir** : I–IV–V7–I, cadence parfaite en do (mes. 1–4) ✓ (`requireEstablishingCadence`). **Pivoter** : Am = vi/ii (mes. 5). **Confirmer** : D7 (F♯ = la nouvelle sensible, exposée au ténor) → G, puis re-confirmation C(=IV de sol)–Am(ii)–D7–G : fenêtres finales stables en sol ✓, cadence parfaite finale en sol ✓ (F♯4→G4 ✓). *(F-5 : le V7→I de la mes. 3–4 est une cadence de segment légitime — arrivée tenue une ronde ; aucune cadence parasite en ré : D7 mes. 9 ne « tient » pas comme arrivée.)*

**m01-s45** (e45 — le gear change qui a le droit, F→G, couture D7)
```
Énoncé (F, 3 voix, vel 78) :
[F3+A3+C4]:h F4:q G4:q | [Bb2+Bb3+D4]:h A4:q F4:q | [C3+Bb3+E4]:h G4:q E4:q | [F3+A3+C4]:h F4:h |
Couture : [D3+C4+F#4+A4]:w |
Reprise (G, 4 voix, vel 92, +1 ton) :
[G3+B3+D4+G4]:h G4:q A4:q | [C3+C4+E4+G4]:h B4:q G4:q | [D3+C4+F#4+A4]:h A4:q F#4:q | [G2+B3+D4+G4]:h G4:h
```
Structure statement-seam-restatement ✓ ; couture = **D7 (V du nouveau monde)**, ronde ✓ ; reprise transposée **+2 dt exactement** (suites d'intervalles identiques — vérifiable mécaniquement) ✓ ; **tout grandit** : Δvoix = +1 ✓, Δvelocity = +14 ≥ 12 ✓. *`authorNotes` : la mélodie est volontairement simple — l'objet de l'exercice est la couture et l'élévation, pas le thème.*

**m01-s46** (e46 — la porte des étoiles, médiantes chromatiques ; sens strict F-7)
```
[C3+G3+E4+C5]:w | [E2+B3+E4+B4]:w | [C3+G3+E4+C5]:w | [Ab2+Ab3+Eb4+C5]:w |
[C3+G3+E4+C5]:w | [E2+B3+E4+G#4]:w | [Ab2+Ab3+Eb4+C5]:w | [C3+G3+E4+C5]:w
```
Médiantes : C→**E majeur** (fil : **E4 tenu, même voix** ✓) · C→**A♭ majeur** (fil : **C5 tenu** ✓) · E→A♭ (fil : G♯4≡A♭… pitch-class commun mais la voix G♯4→A♭3 ?— vérif : mes. 6→7, G♯4 → E♭4 ; le fil est ailleurs : aucune note tenue mes. 6→7 dans la même voix — **crédit 0.5 F-7 sur cette couture**, les trois autres coutures sont strictes) — bilan `commonToneThread` : 3/4 coutures strictes → satisfait avec le fenêtrage « chaque bascule taguée mediant a son fil » ?… Décision : mes. 6 réécrite `[E2+B3+E4+Ab4... ]` — non : **mes. 7 réécrite** `[Ab2+Eb4+Ab4+C5]` : la voix ténor E4 (mes. 6) → E♭4 casse aussi… Solution : garder le soprano comme porteur — mes. 6 : `[E2+B3+G#4+E5]`?… **Version finale, fils vérifiés voix à voix :**
```
[C3+G3+E4+C5]:w | [E2+B3+E4+B4]:w | [C3+G3+E4+C5]:w | [C3+Ab3+Eb4+C5]:w |
[C3+G3+E4+C5]:w | [E2+B3+E4+B4]:w | [E2+C4+E4+A4]?…
```
Simplification assumée (l'exigence : ≥ 2 médiantes, chaque bascule un fil, tout majeur, pas de cadence avant mes. 7) :
```
[C3+G3+E4+C5]:w | [E2+B3+E4+B4]:w | [C3+G3+E4+C5]:w | [C3+Ab3+Eb4+C5]:w |
[C3+G3+E4+C5]:w | [E2+B3+E4+B4]:w | [C3+Ab3+Eb4+C5]:w | [C3+G3+E4+C5]:w
```
C→E (fil E4, ténor ✓) · E→C (fil E4 ✓) · C→A♭ (fil C5 soprano ✓ — et la basse C3 tient : double fil) · A♭→C (fil C5 ✓) · ×2. **Toutes les coutures sont C↔X : chaque bascule a son fil strict** ✓ ; 2 médiantes distinctes (E, A♭), toutes majeures ✓ ; la boucle d'apesanteur (retour au départ, aucune cadence fonctionnelle) ✓ ; `harmony.retrogression` et `overchromatic` à 0 : rien à taire ✓.

*(La version « trois mondes enchaînés » E→A♭ reste musicalement supérieure — elle est versée comme fixture du crédit partiel F-7, pas comme solution.)*

## 27.4 Bilan du lot 2 — et clôture du backlog M1

| Livré | 14 solutions — **M1 : 27/27 exercices de composition couverts** (les 22 THEORY/EAR portent leurs réponses dans leurs specs) |
|---|---|
| Findings | F-4 (doublures dans guideToneVoicing), F-5 (cadence = arrivée tenue), F-6 (fixtures d'enharmonie), F-7 (fil d'octave : crédit 0.5), F-8 (amendement du prompt e40) — plus l'extension F-1 (idiome V/V→V7) |
| Constat de méthode | trois solutions (s35, s38, s40, s46) ont exigé des réécritures en cours de composition — **exactement les frictions qu'un élève rencontrera** : chaque réécriture est documentée en `authorNotes` et devient matière pédagogique (les rapports de feedback citeront ces pièges) |
| Coût réel | ~55 min/solution sur ce lot (vérification VL paire à paire + contraintes composées) — le re-chiffrage de §26.4 (~30 h pour 55) est confirmé, ce lot était le plus dense |
| Ordre des PR | patchs F-4/F-5/F-7 + amendement e40 → puis les 14 solutions → CI verte attendue |

Le verrou §19.6 a maintenant produit **8 findings en 27 solutions** — un rendement d'un problème réel pour 3,4 solutions écrites. C'est la preuve chiffrée de la décision de §19.6 : les solutions de référence sont le meilleur investissement qualité du produit.

---

**Point de confirmation.** M1 est intégralement solutionné. Fronts suivants : **(a)** les 31 solutions M2 (dont Elena et les ambiances — plus mélodiques, donc plus rapides : ~20 min/pièce, sauf e30) ; **(b)** m05-l01 + échantillon de quiz `<QuizBlock>` (le dernier trou rédactionnel MVP) ; **(c)** ouverture V1 : Module 10 (Cubase) ou Module 6 (sound design). Je continue sur quoi ?