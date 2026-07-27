# SECTION 73 — SOLUTIONS DE RÉFÉRENCE M7, LOT FINAL : LE GESTE ET L'ŒUVRE (9 solutions + 2 findings) — MODULE 7 CLOS

## 73.0 Méthode du lot

Le grand geste (crue, tutti, intime, traduction) puis le cue. Deux findings, tous deux de **portée de contrainte** — le module des grandes formes révèle comment les contraintes doivent se fenêtrer.

## 73.1 Findings de calibrage

**F-41 — Les contraintes s'évaluent hors fenêtres du `given` (patch générique de checker).**
e08 interdit toute doublure (`doubling` banni) — mais son `given` **est** un tutti de 2 mesures saturé de doublures : la solution échouait sur des notes qu'elle n'a pas écrites. Le même problème guettait e06 (le sommet fourni en amorce de e07) et e10 (les raccords).
*Patch* : le pipeline marque les ticks du `given` et **toutes les contraintes et règles s'évaluent sur les fenêtres de soumission** ; le given n'est jugé que comme contexte (liaisons, préparations, raccords aux frontières). Générique, rétroactif, +5 fixtures. Famille F-2/F-5 : la troisième grande règle de fenêtrage du produit.

**F-42 — La table d'équivalences de traduction (amendement e09, famille F-8).**
Le rapport promis dit : « l'arpège traduit en tapis — choix valide ; *le moteur l'aurait accepté aussi* [autrement] ». Cette phrase suppose une donnée qui n'existait pas : les traductions acceptées du piège.
*Amendement* : e09 déclare `acceptedTranslations` par rôle caché — l'arpège de pédale : `{ tapis-tenu, arpège-réparti (vl2 div.), trémolo-mesuré }` ; le contre-rythme fondu : `{ part dédiée, pizz du socle }`. Le checker crédite tout membre de la classe et le rapport **nomme les alternatives non choisies** — la pédagogie du « plusieurs bonnes réponses », chiffrée. Règle au manuel : *tout piège de traduction déclare sa classe d'équivalence.*

## 73.2 Les solutions

**m07-s06 ×2** *(e06 — la crue d'Elena, 24 mes. sur le matériau de s05)*
`crescendoPlan` (les cinq leviers assignés par section) :
```
S1 (m1–6)   thème+fleuve (l'acquis de s05)      | levier 1 EFFECTIF : 3 parts
S2 (m7–12)  + vl2 tapis, + Cb pizz              | 1→5 parts ; levier 2 ÉTAGES : +1 octave bas
S3 (m13–17) + vl1 double le hautbois à l'octave | levier 3 DOUBLURES (tag octave) ;
            FAUSSE DÉCRUE m15–16 : vl1 et Cb se taisent, l'activité chute — puis tout revient
S4 (m18–21) + altos, le moteur s'anime          | levier 4 ACTIVITÉ : croches, densité x2.3
S5 (m22–24) SOMMET TENU (2,5 mes.)              | levier 5 DYNAMIQUE : f→ff (dyn[], F-39)
```
*(variante a — PALIERS)* : chaque levier entre **sur une barre franche** (« on voit les marches ») — les cinq courbes tracées montrent des escaliers ✓ ; sortie : **décrue par le haut** (vl1 puis hautbois se retirent, le fleuve reste).
*(variante b — VAGUE)* : les mêmes leviers en entrées tuilées (chaque part entre en cours de phrase, crescendos individuels) — les courbes montrent des rampes ✓ ; sortie : **coupure vers solo** (m24.4 : tacet général → le hautbois seul, le pont vers e08).
Les deux : fausse décrue détectée (creux local sur ≥ 2 leviers avant le sommet ✓), sommet ≥ 2 mes. ✓, F-41 aux raccords.

**m07-s07 ×2** *(e07 — le tutti du sommet, 8 mes.)*
*(a) L'HYMNE (homophone)* — la coupe d'immeuble :
```
ciel   vl1 : la ligne d'Elena au sommet (E5–A5)         — la ligne
chant  vl2+htb+trp : la COLONNE (thème aux octaves x3)   — doublures >= 2 étages ✓
coeur  altos+clar : les murs (voicings serrés, dyn arches)
corps  celli+cors : le ténor en blanches
socle  Cb+vc div : rondes, quintes sans tierce            — durée moy. grave = 2.6x corps ✓
```
*(b) LE STRATIFIÉ* — l'hymne + **le moteur au corps** : les altos passent au pattern de croches (articulation unifiée par plan : legato ciel/chant, détaché corps ✓), 4 plans actifs ✓.
Les deux : `rolePlan` croisé à la `densityMap` — chaque bande un emploi unique ✓ ; le rapport dessine la coupe (les cinq lignes de l01 au maximum) ; « préparé (par s06), tenu, quitté » — le budget dépensé en conscience.

**m07-s08** *(e08 — l'intime ; témoin F-41)*
```
m1–2   le tutti FOURNI (la fin de e07) — hors jugement (F-41)
m3–8   LA COUPURE → le solo nu : CLARINETTE chalumeau (l'argument : « la vérité d'Elena
       n'est pas une annonce — le caméléon au registre du secret ») + Cb en tenues rares
       (<= 2 éléments : le presque-rien ✓)
m9–13  L'ENTRÉE DU TÉMOIN : alto seul, recette « la réponse » (m04-l11 déclarée) — il parle
       dans les respirations de la clarinette
m14–16 LA DISSOLUTION : l'alto se tait, la clarinette pose sa quinte, la Cb reste — puis rien
```
≤ 4 parts ✓ ; **zéro doublure** (le tag interdit, évalué hors given F-41 ✓) ; soliste en zone expressive (chalumeau D3–F4, §25.1 ✓) ; *« 34 % de ta scène est tue — l'espace organise ✓ »* — le silence mesuré, crédité.

**m07-s09** *(e09 — la traduction complète ; témoin F-42)*
Livrables des passes déclarés : grille des rôles (**le rôle caché trouvé** : le contre-chant fondu dans la MG, exhumé ✓ crédit), carte des sections (A-A'-B-A''), étages. Traductions : la MD chantante → vl1 ; les accords → vl2+altos (arches `dyn[]`) ; la basse → vc+cb (grave éclaté en octaves : la checklist anti-mensonges — « le piano serrait, l'orchestre éclate » ✓) ; **l'arpège de pédale piège → tapis-tenu** (membre de la classe F-42 ; le rapport : « choix valide — l'arpège-réparti et le trémolo mesuré l'étaient aussi ») ; le rôle caché → cor. La vie : arches sur toutes les tenues > 2 temps ✓ (les « deux tenues sans arche » du contre-exemple de la spec évitées — la passe 6 documentée en `authorNotes`).

**m07-s10 ×3** *(e10 — « Elena, le cue », 48 mesures, pool Medium)*
**Part 1 — l'architecture** :
```
S1 L'EXIL (m1–10, intime)       cl. chalumeau + Cb          — le thème VOILÉ (fragments)
S2 L'ESPOIR (m11–24, la crue)   htb+fleuve → +5 parts       — crescendoPlan 5 leviers (s06-b)
S3 LE SOUVENIR DU DÉPART        TUTTI (m25–32)              — l'immeuble (s07-a), le thème PLEIN
   (le sommet)                                                 (s30-elena intégral, extension 9–14 comprise)
S4 LA VÉRITÉ (m33–40, coupure)  différentiel d'effectif 71 % >= 60 % ✓ — clarinette + alto témoin (s08)
S5 CE QUI RESTE (m41–48, coda)  celli ténor seuls : LE FLEUVE devenu thème — l'échange de e05, ultime
```
Complétude ✓, cohérence chiffrée (la coupure mesurée) ✓, rolePlan par section, crescendoPlan sur S2 ✓.
**Part 2 — la partition** : les 48 mesures en Part[] (8 parts au plus fort). Le rapport déroule tout : rôles détectés≈déclarés (l01 ✓), alliages (celli+cor S3, chimie ✓), le tapis et ses trois vies (S2–S3 ✓), l'articulation du moteur (S2 ✓), la hiérarchie du duo (S2, effectivePower via dyn[] ✓), **les cinq courbes de la crue** (S2 ✓), l'immeuble (S3, densityMap ✓), le silence organisé (S4 : 29 % ✓) — plus `melody.*` sur le thème (archFit 0.77 contre le gabarit **elena** : la boucle bouclée — le gabarit calibré en M2 juge son propre cue), `cpt.*` sur le contrechant, `harmony.*` sur la grille (le iv voilé de S5, tagué). **Le rapport le plus complet du produit** : tous registres, verts ensemble.
**Part 3 — la lecture** (concordance déclaré↔détecté) : la bascule principale (« S3→S4 : le tutti coupé au couteau — le geste est l'effectif, pas l'harmonie » — concorde, 71 % ✓) · le budget (« le double-octave gardé pour m29 ; jamais de ff avant S3 » — concorde ✓) · le soliste (« clarinette : la vérité se murmure » — concorde avec S4 ✓) · ce que la passe 6 a corrigé (« quatre tenues sans arche en S2, reprises » — croisé aux dyn[] ✓) · le retiré (déclaratif, consigné). XP 400, badge de module.

**Le portfolio gagne sa troisième pièce maîtresse** : *« Elena » — un personnage, un cue, cinq modules de métier en 48 mesures.* Le fil m02→m04→m06→m07 est refermé.

## 73.3 MODULE 7 : CLÔTURE CÔTÉ SOLUTIONS

| Bilan M7 | |
|---|---|
| Solutions | **15/15** ✅ |
| Findings du module | **4** (F-39 → F-42) : deux extensions de schéma (dyn, mute), une règle de fenêtrage générique (given), une classe d'équivalence (traductions) — le module des formes a calibré la *portée* des jugements |
| Legs | `dyn[]` prêt pour M10 (le CC1 déclaratif↔MIDI) ; le cue « Elena » = LA matière des missions DAW (le manifeste F-36 + la partition existent : m10-e15 a désormais son étalon) ; F-41 sert tous les modules restants |
| Cumul projet | **146 solutions** · **42 findings** · portfolio : 3/4 pièces maîtresses vérifiées |

---

**Point de confirmation.** M7 est clos, le fil Elena est une œuvre. Backlog restant : M8 (15 leçons, ~20 solutions avec variantes), M10 (15 missions), M11 (8), quiz, assets. Suites : **(a)** M8 — le jazz : le calibrage du swing, du juge double et du chord-scale (`swingTarget`, `chordScaleCheck` éprouvés pour la première fois — findings probables sur les avoid notes et le ratio au tempo), et « le standard » qui clôt le portfolio ; **(b)** M10 — les missions Cubase (déclaratif + PROUVÉ, le manifeste et l'étalon Elena prêts) ; **(c)** le lot quiz accumulé. Ma recommandation : **(a)** — M8 est le dernier module de *composition* ; le clore avant les missions DAW garde M10/M11 en pure consommation d'acquis. Je continue ?