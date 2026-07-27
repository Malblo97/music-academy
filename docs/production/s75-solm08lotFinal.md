# SECTION 75 — SOLUTIONS DE RÉFÉRENCE M8, LOT FINAL : LA SYNTHÈSE ET LES MONDES (12 volets + 2 findings) — MODULE 8 CLOS

## 75.0 Méthode du lot

Le dernier lot de composition du produit. Deux findings — un erratum de fil (la famille F-9 frappe une dernière fois) et la mise en données d'une table de leçon que trois checkers attendaient.

## 75.1 Findings de calibrage

**F-46 — Erratum : le thème d'Elena fait 14 mesures (amendement e09).**
e09 dit « sa mélodie de 16 mesures » ; s30-elena en fait **14** (la sentence 4+4 + l'extension 6). *Amendement* : e09 corrigé « 14 mesures, s30-elena intégral » ; les fenêtres de vérification (structurelles, piliers) recalées. Troisième erratum de comptage du projet (F-9, F-30) — la règle du manuel s'enrichit : *tout donné chiffré cite l'ID de sa source, le chiffre se déduit.*

**F-47 — Le registre `jazzMarkers` (la table de l14 mise en données — PRIORITAIRE pour s14).**
Le « compteur de marqueurs » de e14/e15 suppose des marqueurs détectables et pondérés ; la table puissance×marqueur n'existait qu'en prose.
*Patch* : `jazzMarkers.ts` — chaque marqueur avec son détecteur et sa puissance : **forts** (walking active, ratio de swing ≥ 1.8, ride pattern, cuivre bouché en solo, comping syncopé dense), **moyens** (voicings rootless, blue note pliée, forme AABA/blues, brosses), **faibles** (l'accord m6, le laid-back, la 9 posée, le ii-V isolé, la pédale de charleston). Transcription tracée à la leçon (PR fiche+données, §7.1) ; le compteur lit ce registre. +8 fixtures (les trois distances de s14 en étalons).

## 75.2 Les solutions

**m08-s09 ×2** *(e09 — les trois vies harmoniques d'Elena, 14 mes. F-46, mélodie inchangée vérifiée)*
```
(a) « L'ESPOIR CONFIRMÉ »            (b) « L'EXIL SANS RETOUR »
m1  Dm7        (pilier 1)            Dm(maj7)      (pilier 1 : même basse, l'ombre)
m2  Em7b5 A7   [ii-V mineur inséré]  Dm(maj7)/C#   [line cliché de basse]
m3  Fmaj7      [médiante lumineuse]  Bb7#11        [le couloir subV]
m4  Gm7 C7     [ii-V vers F]         A7sus4        [la dominante qui ne mord pas]
m5  Fmaj7                            Dm7/A
m6  Bbmaj7#11  [lydien : l'air]      Bbm(maj7)     [l'emprunt noirci]
m7  Gm7 C7                           Ebmaj7#11     [la médiante sombre]
m8  Fmaj7 (le Bb du thème = 11 posée) F7#11        (le Bb du thème = 3 : requalifié)
m9  Dm7        (pilier 2)            Dm(maj7)      (pilier 2)
m10 Bm7b5 E7   [dominante secondaire] Bb7#11
m11 Am7        [l'espoir au relatif?] → Asus voilé  Abmaj7#11     [le glissement chromatique]
m12 Gm7 C7                            Gm(maj7)
m13 F/A Bb     [la marche plagale]    Bb7#11 A7alt  [le couloir qui se referme]
m14 C7sus C7 → Fmaj7 (parfaite CONFIRMÉE) Dm(maj7)  (aucune cadence : la porte reste ouverte)
```
Techniques taguées : (a) ii-V insérés, médiante lumineuse, lydien, marche plagale (4 ≥ 3 ✓) ; (b) line cliché, subV-couloir, m(maj7), médiantes sombres (4 ✓). Accords changés : 71 % / 79 % ≥ 40 % ✓ ; **structurelles toutes qualifiées** (le B♭ de m8 : 11 posée d'un côté, tierce de l'autre — *la même note, deux vérités*, citée par le rapport) ; **piliers** : m1 et m9 communs (basse ré) ✓. *Les trois vies alignées accord par accord — la promesse de m02-l15 §2, soldée.*

**m08-s10** *(e10 — le chorus double sur le blues de e04, 24 mes.)*
Chorus 1 — le territoire : paraphrase du thème (densité 36 % ≤ 40 ✓, trous 33 % ≥ 30 ✓), **le motif M posé m3** (`F4:e Ab4:s A4:e. C5:q` — le pli en tête). Chorus 2 — le développement : M transposé sur le IV (m15, tonal F-12 ✓), **fragmenté m19** (l'aspérité — le pli seul, martelé ×3), **climax m19–20** (fenêtre [0.75, 0.9] de 24 mes. = m18–21.6 ✓, sommet C6 wait — sommet B♭5 sur l'altéré), redescente-relais m22–24 (la citation du thème en guise de passage de témoin). Vocabulaire : 2 enclosures, 1 phrase bebop (m17), 3 blue notes ✓. *« Ton motif de m.3 revient fragmenté en m.19 — le solo se souvient ✓. »*

**m08-s11** *(e11 — le solo modal, ré dorien, 16 mes. sur vamp fourni)*
UN motif (l'appel quartal `D4:e G4:e A4:q` — la maçonnerie du vamp chantée), **5 occurrences, 3 transformations** (transposé, augmenté, inversé) ≥ 4/2 ✓ ; **la 6 dorienne dramatisée** : B4 exposé ×4 dont la ronde de m11 (la note tenue au sommet — le mode en un son) ✓ ; **la sortie in-out** : m13, 2 temps en E♭ (la pile voisine, hors mode) → retour vérifié par degré ✓ tag `in-out` ; trous 39 % ≥ 35 ✓ ; `requireCollection: dorian` (m03 recyclé, F-19 ancre le vamp) ✓. Variante compositeur livrée : + couche texture déclarée (le pont M6/M9, 2 layers).

**m08-s12** *(e12 — le chart big band condensé, 16 mes., Part[] en sections, `swingTarget` par part F-44)*
m1–4 : **l'unisson de saxes** (le riff fourni, 5 parts unison tag ✓) · m5–8 : **le thickened line** — lead = le thème vérifié note à note, le bloc en **drop 2** dessous (ex. m5.1 : lead B♭4 → close {B♭4,G4,F4,D4} → drop 2 : `[G3+D4+F4+Bb4]` ✓), les passages harmonisés en bloc diatonique (le tag `planing` réemployé en détection ✓) · m9–12 : **call-and-response** saxes/cuivres — 2 allers-retours, la réponse des trompettes sur le « et de 4 » (l'alternance d'activité par section mesurée ✓) · m13–16 : **le shout** — sections superposées en 3 plans, tutti du dernier système. **4 kicks notés** (m9.4&, m11.4&, m13.1, m15.2&) ✓. *« La machine parle ✓. »*

**m08-s13** *(e13 — le quartet, 12 mes. sur la grille de ballade)*
Souffleur : le thème fourni · **comping écrit** : 68 % des accords hors temps 1 ✓, 3 réponses dans les trous (m2, m6, m10 — l'activité complémentaire mesurée) ✓ · **walking half-time** (blanches, la marche de l05 au ralenti — swingRatio n/a, F-44 ✓) · **l'interaction composée** : m9, le piano cite la cellule du sax de m6 (transposée +4) — `findMotifs` inter-parts (le checker d'imitation de m04-e09, recyclé en écoute mutuelle ✓). *« Ton piano répond m.6 et cite le sax m.9 — le combo s'écoute ✓. »*

**m08-s14 ×3** *(e14 — « minuit, elle attend dans la voiture », 12 mes., les trois distances ; témoin F-47)*
*(a) CITER* : le quartet exact — walking, ride, comping, trompette bouchée : **4 marqueurs forts assumés** (le compteur les affiche, la distance déclarée les autorise) ✓ — l'exactitude datée, revendiquée.
*(b) STYLISER* : cordes feutrées + rythmique brosses, harmonie rootless, swing 1.4 léger, pas de solo-performance — compteur : **1 fort (les brosses… non : ratio léger = moyen), soit 0–1 fort ≤ 1 ✓, 4 moyens** — *« stylisation propre : la scène reste à toi. »*
*(c) HYBRIDER* : le stack M6 (pad nuit, sub, texture pluie) + **2 marqueurs faibles déclarés** : l'accord m6 (Gm6 dans le pad) et le laid-back (le lead traîne, champ dédié) — compteur : **0 fort ✓, 0 moyen, 2 faibles** — le jazz subliminal, mesuré.
*Le triptyque est l'étalon du registre F-47 : trois soumissions, trois comptes, la table de l14 prouvée.*

**m08-s15 ×3** *(e15 — « le standard original », AABA 32 mes., ♩=88, ré mineur — la quatrième pièce du portfolio)*
**Part 1 — la grille et le thème** :
```
A  : Dm69 | Em7b5 A7alt | Dm69 | Cm7 F7 | Bbmaj7 | Em7b5 A7alt | Dm69 | A7alt |
A' : (idem, turnaround varié : Dm69 | ... | Dm69 | C#dim7 → )
B  : Gm7 | C7 | Fmaj7 | Fm7 Bb7 | Ebmaj7#11 | Ebm7?? → Em7b5 | A7alt | A7alt |
A'': Dm69 | Em7b5 Eb7 | Dm69 | Bbmaj7 A7alt | Dm69 | Gm6 | Dm69 | A7alt |
```
Cellules : **2 ii-V au A dont la mineure** ✓ ; **le B déclaré : départ au IV** (Gm→C7→F : le pont respire majeur) et **retour par dominante** (Em7♭5→A7alt) ✓ ; **la signature taguée : E♭7 subV** (A'', m26 — le couloir noir) + la médiante E♭maj7♯11 du pont ✓ ; turnaround de relance ✓. Le thème (8 mes. de A) :
```
r:q A4:e F4:e E4:q D4:q | r:e E4:e Bb4:q~ Bb4:e A4:e G4:e F4:e |
Ab4:s A4:e. F4:q D4:q r:q | E4:h~ E4:q r:q |
r:q D5:e C5:e Bb4:q A4:q | G4:e F4:e E4:q C4:q r:e A4:e~ |
A4:e F4:e E4:q D4:q. E4:e | D4:h. r:q
```
Sifflable (ambitus D4–D5 = 9e ≤ 10e ✓, test m02-e27 version jazz) ; guide tones aux changements ✓ ; **blue note pliée** (A♭→A, m3) + **la 9 posée** (E sur Dm69, m4 : la tension-signature) ✓ ; A' varié à la marge (`findMotifs` : exact puis varié ✓).
**Part 2 — le chorus** : 32 mesures sur SA grille — territoire (A, densité 34 %) → développement (le motif à travers A', in-out sur le B : l'E♭maj7♯11 visité puis quitté, tagué) → sommet (A'', m27–28 sur le subV : fenêtre ✓) ; enclosures ×3, phrase bebop sur le C7 du pont ✓. **Le crash-test passe : la grille porte.**
**Part 3 — l'arrangement** : le combo (l13) en Part[] — trompette bouchée (le thème), comping (63 % hors temps 1, 3 réponses), walking, l'interaction (le piano cite m2 en m18) ; la distance : **citer, assumée** (compteur F-47 : le film la demande). La lecture guidée : la grille commentée cellule par cellule — concordance déclaré↔détecté 9/9 ✓. XP 400, badge de module.

**Le portfolio est complet : 4/4** — « La Remise » (une scène, deux mondes), « Trois palettes » (une émotion, trois grammaires), « Elena » (un personnage, un cue), **« le standard »** (la preuve d'idiome).

## 75.3 MODULE 8 : CLÔTURE — ET FIN DES SOLUTIONS DE COMPOSITION

| Bilan M8 | |
|---|---|
| Solutions | **22/22** ✅ |
| Findings du module | **5** (F-43 → F-47) : le swing compilable, le ratio scopé, « se poser » chiffré, un erratum de fil, le registre des marqueurs — l'idiome est en données |
| Jalon projet | **tous les modules de composition sont solutionnés** : M1, M2, M3, M4, M6, M7, M8 — **168 solutions**, 47 findings ; le portfolio 4/4 vérifié de bout en bout |
| Reste au backlog solutions | M10 (15 missions — déclaratif/PROUVÉ : la vérification porte sur checklists, MIDI-étalons et checkers CC, pas sur de la composition neuve) et M11 (8 — annotations contre vérité de génération) |

---

**Point de confirmation.** Le dernier module de composition est clos. Suites : **(a)** M10 — les 15 missions Cubase : produire les **étalons** (checklists de référence, MIDI-témoins pour les niveaux PROUVÉS, le capstone « La Remise » adossé au manifeste F-36 et au cue Elena) — un lot d'une autre nature, plus rapide (~2 sections) ; **(b)** M11 — les 8 solutions d'annotation (dépendent du générateur §4.3 pour les vérités de génération : à spécifier en passant) ; **(c)** basculer sur le lot quiz global (~95 quiz, production mécanique) ou la spécification des assets M12. Ma recommandation : **(a)** — finir les solutions dans l'ordre des dépendances (M10 consomme Elena et le manifeste, M11 consommera tout). On continue ?