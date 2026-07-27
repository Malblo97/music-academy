# SECTION 71 — SOLUTIONS DE RÉFÉRENCE M6, LOT FINAL : LE CINÉMA ET L'HYBRIDE (9 solutions + 3 findings) — MODULE 6 CLOS

## 71.0 Méthode du lot

Les sept dernières solutions, dont les deux soumissions historiques (s14 : premier jugement bi-registres `sd.*`+`orch.*` ; s15 : le plus large rapport du produit avec m10-e15). Trois findings — deux de **chaîne de production** (la timeline d'un asset, une dépendance inter-modules) et un de schéma : exactement le genre de choses que seule la composition des solutions fait remonter.

## 71.1 Findings de calibrage

**F-36 — Le manifeste de « La Remise » (asset épinglé + erratum e10).**
e10 vise « la bascule 2, 1'08" » ; e15 liste des gestes à 0'31", 1'02" **et** 1'08" ; la spec d'asset dit « 3 bascules, 2 hits ». Trois documents, trois lectures — la collision classique d'un asset partagé.
*Patch* : un **manifeste unique** (`assets/la-remise/manifest.json`) fixe le canon : tempo du spotting **♩=96.8** (choisi en m10-e12 pour poser les événements sur la grille — la leçon tempo×timecode en acte), marqueurs `B1 0'31"` (bascule de lieu), `B2 1'02"` (bascule de ponctuation, **barre 26 temps 1**), `B3 1'22"` (bascule finale), `H1 1'08"`, `H2 1'34"` (hits). Les specs référencent désormais des **IDs de marqueurs, jamais des timecodes bruts** ; erratum e10 : « la bascule 2 » = **B2 (1'02")**, le 1'08" était H1. m10-e12/e15 et m06-e10/e15 réindexés. Règle au manuel : *tout asset partagé a un manifeste, les specs pointent ses IDs.*

**F-37 — Les donnés inter-modules s'épinglent sur des solutions de référence (règle de production + livraison).**
e14 exige « ton orchestration de m05-e08 » — or la pièce héroïque de m05-e08 dormait au backlog assets : la solution s14 était incomposable.
*Résolution* : (1) règle générale — tout `given` qui cite un exercice antérieur pointe **la solution de référence** de cet exercice (comme e11↔s30-elena, F-30) ; (2) livraison — **la solution m05-e08 est produite dans ce lot** (§71.2, l'extrait de 8 mesures qui débloque e14 ; la version longue de l'asset reste au backlog, réduite d'autant).

**F-38 — La couche-déclencheur silencieuse (`trigger: true`).**
Le « kick fantôme » de e13 est une source de sidechain **sans audio** — le schéma ne savait pas la dire : une couche muette violait la pyramide des niveaux et polluait la carte spectrale.
*Patch* : `Layer.trigger: true` — la couche est un métronome de sidechain : exclue des règles `sd.*` de spectre et de niveaux, référençable par `sidechainedBy`, ses `notes` définissent le rythme de pompage. +4 fixtures (dont : `trigger` avec `band` déclarée = erreur).

## 71.2 Les solutions

**m06-s09** *(e09 — l'arp de filature, 16 mes., ♩=110)*
Pattern **3 notes sur grille 1/16** : {E4, G4, B4} constant (`motifType: rhythmic` recyclé ✓ — le 3-contre-4 retombe sur ses pieds chaque 3 temps) ; velocities hiérarchisées 98/70/58 corrélées au poids métrique (checker `prosodyPlan` recyclé, corrélation 0.74 ✓ ; `performanceOnly`+`humanize {seed 7, ±12}` F-35) ; **la dérive** : `motion {automation, cutoff 480→2300 Hz, montée continue}` (la logique `requireChromaticDrift` portée au paramètre : ≥ un cran mesuré toutes les 4 mesures ✓) ; pluck de ponctuation : release **déclaré avec son calcul** — pas 1/16 = 60000/110/4 ≈ **136 ms → R 140 ms** (±30 % ✓) ; sub discret (−14) ; **l'apnée : mesure 13, temps 1 muet** ✓ (le silence détecté, la bombe posée).

**m06-s10** *(e10 amendé F-36 — la phrase de bascule sur B2)*
Riser 4 mesures (barres 22–25) : les **quatre automations** en `motion` (cutoff↑, pitch +12 continu, width 20→85 %, send reverb↑) — fin calée **barre 26 temps 1 = B2** (écart mesuré : 0 tick ≤ ±1 temps ✓, croisement tempo×timecode du manifeste) ; **l'apnée** : le temps 4 de la barre 25, tout tacet ✓ ; **l'impact tri-couche** : sub-boom 30–85 / corps 90–1 900 / débris 2 100–12 000 — chevauchements 0 %, ≤ 30 % ✓ ; **la queue** : la traîne de l'impact déclarée `→ drone` (elle accouche du centre de la scène suivante, champ dédié) ✓. *La cadence de production, prouvée.*

**m06-s11** *(e11 — récolte et sculpture, sources tracées)*
Deux rendus déclarés : `source: "m10-e09-render:string-swell"` et `source: "m10-e13-render:fredon-tenu"` (la traçabilité du curriculum en donnée ✓). **Reverse-riser** : le swell inversé, fin calée sur cible (barre 8 temps 1, ±0 ✓). **Élément granulaire — drone** : les quatre poignées déclarées — `position 0.42 figée · taille 90 ms · densité 26 g/s · pitch 0` → cohérence poignées↔rôle ✓ (position figée = drone ; le rapport cite la table de l11). Mini-stack de bascule 8 mes. réglementaire (`sd.*` muettes) ✓.

**m06-s12** *(e12 — les deux mises en scène du stack s03)*
Version **A « le studio »** : room 0.9 s, pre-delay 12 ms, widths body 30/top 55/texture 60, pans sages · Version **B « la cathédrale du rêve »** : hall **3.7 s** (le decay au tempo : 4 temps à ♩=65 de la scène), pre-delay 85 ms, widths 70/95/100. **Invariance vérifiée** : couches et notes strictement identiques A↔B (seuls `sends/width/pan` diffèrent) ✓ ; **le sub sec et mono dans les DEUX** ✓ ; budgets de largeur contrastés (0.42 vs 0.86) ✓ ; **la bascule** : 2 mesures d'automations d'espace en `motion` (sends et widths interpolés) ✓. *L'expérience contrôlée : l'espace comme paramètre, rien d'autre n'a bougé.*

**m06-s13** *(e13 — chair, glue, souffle ; témoin F-38)*
Growl saturé : dose 35 %, **bande élargie honnêtement** 100–2400 → 100–**4800** (`band.high ≥ 800` ✓, et le low tenu à 100 : « le growl ne redescend pas sous 90 » ✓ `sd.sub-conflict` muette) ; sub **pur** (non saturé, déclaré) ; `bus.glue: {dose: légère}` (champ de stack) ; **deux sidechains** : `sub → pad, 3 dB` (le nettoyage) et `ghost-kick (trigger: true, noires) → body, release 480 ms` — le calcul déclaré : pouls = 500 ms à ♩=120, 480 ∈ ±30 % ✓ ; liens non circulaires ✓.

**m06-s14** *(e14 — l'orchestre habillé ; F-37 : le donné produit ici)*
**La solution m05-e08 (l'extrait de référence, 8 mes., ut majeur)** :
```
Thème (trompette) : G4:q. C5:e C5:q D5:q | E5:h C5:h | F5:q. E5:e D5:q C5:q | D5:h G4:h |
                    G4:q. C5:e C5:q D5:q | E5:h G5:h | A5:q G5:q F5:q D5:q | C5:w
Cordes : C | C | F→G | G | C | C→Em | F→G | C  (voicings série harmonique,
         vl./alt./vc. ; Cb : C2→…→E1 aux barres 7–8 — la descente donnée)
```
**L'habillage** : sub-relais sinus **30–40 Hz** (il ne prend que sous le E1 des Cb : bandes sans chevauchement ✓, le relais entre à la barre 7) · **pad fantôme** : notes ⊆ notes des cordes (pitch-class sets par fenêtre : 8/8 ✓), −7 dB, HP 150 ✓ · texture d'air · **protocole de fusion déclaré : le relais d'enveloppe au climax** (barres 7–8 : les cordes attaquent, le pad porte la tenue — champ dédié) ✓. Verdict : **`sd.*` et `orch.*` muets ensemble** — la première soumission bi-registres passe ✓.

**m06-s15 ×3** *(e15 — « La Remise hybride », le capstone)*
**Part 1 — la distribution** : les 7 rôles pourvus et argumentés (sub : sinus-relais « la gravité sans archet » · body : pad hybrid « l'acoustique déguisé, la scène est un souvenir » · top : scintillement granulaire tracé · texture : le grain du lieu · movement : l'arp de s09 recyclé ralenti · fx : la phrase de s10 · melodic : keys lo-fi, « le thème en mémoire ») ; **le plan des bascules par IDs du manifeste (F-36)** : B1 = le lieu (l'espace s'ouvre, geste s12) · B2 = la ponctuation (riser→impact, s10 resservie) · H1 = le témoin (impact sec + apnée) ✓ complétude, `sd.role-coverage` muette en amont.
**Part 2 — le stack complet** : **11 couches** sur 90 s — croisière (drone, sub, pad, texture), jouées (keys : la progression du cue re-jugée par M1 ✓ ; lead-mémoire : la ligne re-jugée par M2, arche ✓ ; arp), FX calés (B2 : ±0 tick ; H1 : impact tri-couche ✓), sidechains (sub→pad 3 dB ; ghost-trigger→body, F-38), les trois coordonnées de chaque couche, pyramide et budget stéréo ✓ — le moteur déroule tout, rapport vert.
**Part 3 — la soustraction** : `removed` ×2 argumentés — *« le supersaw du climax : coupé, il rivalisait avec le thème-mémoire (band-pileup 1–4 k mesuré au mute) »* ; *« le second drone à l'octave : coupé, un seul roi sous 90 — et l'apnée de H1 respirait mieux sans lui »* ✓ — l'économie notée en craft.
XP 400, badge de module. **Le diptyque « La Remise » est complet au portfolio** : la même scène, deux mondes, une seule dramaturgie.

## 71.3 MODULE 6 : CLÔTURE CÔTÉ SOLUTIONS

| Bilan M6 | |
|---|---|
| Solutions | **19/19** ✅ |
| Findings du module | **6** (F-33 → F-38) : un format structurel (payload), deux sémantiques de règle (bande/fondamentale, trigger), un régime de contraintes (performanceOnly), un manifeste d'asset, une règle de dépendance inter-modules — le module déclaratif a calibré sa *grammaire*, comme prévu |
| Bonus de production | la solution m05-e08 (extrait) livrée — le backlog assets s'allège d'autant ; le manifeste « La Remise » servira tel quel aux solutions M10 |
| Cumul projet | **131 solutions** · **38 findings** |

---

**Point de confirmation.** M6 est clos et le diptyque de portfolio existe des deux côtés. Backlog restant : M7 (10+), M8 (15+), M10 (15 missions), M11 (8), quiz, assets. Suites : **(a)** M7 — l'orchestration avancée : le format `Part[]` inauguré en soumission réelle (F-33 l'attend), le fil Elena de e05→e10 (le thème que M4 a armé et que M6 a électrifié reçoit son orchestre), et le cue de 48 mesures en capstone ; **(b)** M10 — les missions Cubase (beaucoup de déclaratif, le manifeste F-36 tout chaud) ; **(c)** le lot quiz accumulé (M3+M4+M6, ~45 quiz). Ma recommandation : **(a)** — M7 est le cœur du métier et ses solutions nourrissent M10 (le cue orchestral EST la matière des missions DAW). Je continue ?