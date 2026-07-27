# SECTION 86 — SPÉCIFICATION DES ASSETS M12 : LE PLAN DE LA SONOTHÈQUE (~385 clips) + LES DEUX ASSETS AUDIOVISUELS

## 86.0 Principes

La sonothèque n'est pas un chantier libre : **chaque clip est spécifié par une fiche** (le clip est la preuve sonore d'une phrase de fiche), produit **en interne** (bibliothèques orchestrales du studio + synthés — zéro droits tiers, la charte du produit), et **tagué pour le lexique** (registre × rôle × émotion : la recherche « un porteur de mélancolie au ténor » doit le sortir). Le « défi de la palette » (le generator M12) consomme ces tags.

## 86.1 Conventions (normatives)

| Convention | Règle |
|---|---|
| Format | WAV 48 kHz/24 bit · 5–15 s · mono (source seule) ou stéréo (contexte/espace) · normalisation **−18 LUFS** de référence (les contrastes de puissance pp/ff sont PRÉSERVÉS à l'intérieur d'une paire : la paire partage un gain, pas chaque clip) |
| Nommage | `m12-{cat}-{ficheId}-{type}-{variante}.wav` — ex. `m12-inst-cello-register-tenor.wav`, `m12-alloy-cello-horn-blend.wav` |
| Manifeste | un JSON par clip : `{id, ficheId, lessonRefs[], type, params{register, dynamic, articulation…}, notation, durationSec, tags{register, role, emotions[]}}` — **la notation de ce qui est joué est obligatoire** (le clip est vérifiable et re-produisible) |
| Gabarit de prise | tempo ♩=90 sauf mention · phrase-étalon commune par famille (la même phrase de 2 mes. traverse les registres d'une fiche : la comparaison est le produit) · tonalités idiomatiques par instrument (la fiche décide) · pas d'espace ajouté sauf catégorie « espace » |
| Gouvernance | le manifeste de clip vit dans la même PR que la fiche qui le cite (règle §7.1) ; IDs immuables ; tout clip re-pris = variante `-v2`, jamais d'écrasement |

## 86.2 Le catalogue chiffré

**A — Les instruments (19 fiches × gabarit de 12 = 228 clips).** Gabarit standard par fiche :

```
4 clips REGISTRES   la phrase-étalon dans chaque zone de la coupe (dont la zone exposedRisk,
                    nommée : le « grave fragile » de la flûte, la « gorge » de la clarinette)
2 clips DYNAMIQUES  la même note tenue pp puis ff (la preuve de dynamicPower : le 1/6
                    de la clarinette contre le 3/10 de la trompette S'ENTEND)
3 clips ARTICULATIONS  les techniques signatures de la fiche (pizz/trem/sourdines/flatterzunge…)
1 clip  SWEET SPOT  la phrase lyrique dans la zone d'or (l'« or pur » G3–E4 du violoncelle)
1 clip  RISQUE      le même geste dans la zone périlleuse (l'A/B pédagogique intra-fiche)
1 clip  EN CONTEXTE le rôle-type dans un mini-tutti (le hautbois qui perce, le cor qui lie)
```
Couvre : les 11 fiches MVP + les 8 pupitres V1 (trombone, tuba, basson, timbales/percussions — gabarit adapté : 6 timbres au lieu de 4 registres —, harpe, chœur, cor anglais, clarinette basse).

**B — Alliages et doublures (36 clips).** Les 10 alliages du catalogue m07-l02 en triptyques *voix A seule / voix B seule / alliage* (30) — l'oreille entend le « troisième timbre » naître ; + les 3 distances de doublure × 2 exemples (6).

**C — La synthèse (40 clips).** Les 4 existences ADSR (4) · les 3 vitesses de vie (3) · les 5 familles de pads (5) · l'attelage de basse (sub seul / growl seul / attelage / l'ouverture de filtre : 4) · keys (Rhodes, lo-fi : 2) · leads (mono+glide, poly, vibrato delay A/B : 3) · pluck calibré + arp 3-contre-4 (2) · textures/drones (4) · FX (riser 4-automations, impact tri-couche décomposé 3+1, braam, reverse, granulaire drone/geste : 8) · espace (le même stack studio/cathédrale : 2) · sidechain A/B (2).

**D — Les idiomes jazz (20 clips).** Le swing à 3 ratios (3) · shells vs rootless (2) · walking 2 mes. (1) · comping troué (1) · les 4 sections big band (4) · close vs drop 2 (2) · les 3 distances sur la même scène (3) · blue note pliée, enclosure, laid-back, spread (4).

**E — Les contrastes pédagogiques (30 clips = 15 paires A/B).** Le rayon « erreurs entendues », adossé aux tables des leçons : masquage 300–800 / résolu · le tas / l'immeuble · la boue sous C3 / l'éclaté · sub stéréo / mono · pad statique / motion · crescendo-fader / crescendo-leviers · thème couvert / duo réglé · quintes parallèles fautives / planing assumé · cadence de passage / arrivée tenue · quantize dur / Iterative 60 % · CC plat / arche · tutti-tas / étagé · glide permanent / sélectif · avoid posée / passante · doublure gratuite / méritée.

**F — Les ambiances (15 clips).** Les 15 MOOD_TEMPLATES joués en démos de 8 mesures (la courbe entendue — reprises des solutions M2 existantes : coût quasi nul).

**G — Les lexiques de genre (16 clips).** 4 par genre M9 : la progression-type, le geste mélodique, la couche d'instrumentation signature, l'anti-modèle.

**Total : 385 clips** (+ marge de re-prises ≈ 400, le chiffre du backlog tenu).

## 86.3 Priorités et coûts

| Vague | Contenu | Volume | Coût estimé |
|---|---|---|---|
| P1 (avec M5/M12 ouverture) | 11 fiches MVP (132) + alliages cités par les fiches (18) + contrastes cœur (10) | 160 | ~3,5 min/clip (prise+édition+manifeste) → **~9 h 30** |
| P2 (V1) | pupitres V1 (96) + synthèse (40) + jazz (20) | 156 | ~9 h |
| P3 (confort) | contrastes restants, ambiances, genres, marge | ~70 | ~3 h 30 (beaucoup de reprises de solutions) |
| **Total** | | **~385** | **~22 h** de production sonore, découpables par fiche |

## 86.4 Les deux assets audiovisuels (briefs de production)

**« La Remise » (vidéo, 90 s)** — le manifeste F-36 est le cahier des charges temporel : muette, un personnage, une remise, une découverte ; **B1 0'31"** (le lieu change — entrée dans la remise), **B2 1'02"** (la bascule de ponctuation — l'objet trouvé), **B3 1'22"** (la compréhension), **H1 1'08"** (la porte claque), **H2 1'34"** (le regard caméra final) ; cadrage : lumière praticable pour un montage simple, aucun visage reconnaissable nécessaire, production interne ou banque libre de droits **avec cession écrite** (la charte) ; livrable 1080p/24 + timecode incrusté pour la version-mission.

**« Le fredon du réal » (audio, 30 s)** — F-49 est la partition : la voix (n'importe laquelle, timbre parlé-chanté) fredonne `fredon-target` **avec les défauts spécifiés** : 2 octaves fausses (aux mesures 3 et 6), 1 segment doublé (mes. 5), tempo flottant ±8 % ; prise sèche, mono, bruit de pièce léger admis (c'est le réalisme de l'exercice VariAudio).

---

**Point de confirmation.** Les assets sont intégralement spécifiés : la sonothèque est un plan de production exécutable fiche par fiche, les deux assets AV ont leurs briefs, et tout est adossé aux manifestes existants. Reste **(b)** : la **consolidation finale** — le registre des findings F-15→F-51, des décisions et de l'état complet du projet, en un document de passation versable au repo (l'équivalent v1.1 du document d'état, sections 63–86 indexées). Je le produis ?