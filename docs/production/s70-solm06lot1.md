# SECTION 70 — SOLUTIONS DE RÉFÉRENCE M6, LOT 1 : LE BESTIAIRE (10 solutions + 3 findings)

## 70.0 Méthode et comptage du backlog M6

Comptage : e06 et e07 portent chacun 2 variantes, e15 est tri-parts — **19 solutions M6**. Ce lot = **le bestiaire des couches** (s01→s08). Format neuf : la solution n'est plus une notation mais un `LayerStack` — et cette évidence produit immédiatement le finding le plus structurel depuis F-21. Les trois findings du lot sont tous des findings **de format et de sémantique de règle** : le module déclaratif calibre sa grammaire, pas ses notes.

## 70.1 Findings de calibrage

**F-33 — Le champ `payload` des solutions (extension de format — PRIORITAIRE).**
Le fichier solution (`{exerciseId, notation, authorNotes}`) ne sait porter qu'une notation mono-flux. Les LayerStacks de M6 — et rétroactivement les `voices[]` de M4, demain les `Part[]` de M7 et les annotations de M11 — n'y tiennent pas.
*Patch* : le fichier devient `{exerciseId, notation?, payload?, authorNotes}` — `payload` = le JSON du kind ; le verrou CI n°2 compile **selon le kind** (notation pour le mono-flux, payload sinon ; les deux coexistent pour LAYERING+notes). Les 25 solutions M4 sont migrées mécaniquement (`payload.voices[]`). Zod + seed + CI. *Tout M6 en dépend.*

**F-34 — La bande se juge contre le contenu harmonique, pas la fondamentale (précision de `sd.band-note-coherence`).**
Sur s03, le body (saw, high-passé, `band.low: 100`) joue un sol grave dont la fondamentale (98 Hz) est **sous** sa bande : c'est exactement ce qu'un high-pass fait — la fondamentale coupée, les harmoniques portent. Le checker naïf notes↔bande refusait le geste le plus normal du sound design.
*Patch* : la cohérence dépend de la **source** — sources pures (`sine`, rôle sub : la fondamentale EST le contenu) : note hors bande = erreur ; sources riches (saw/square/wavetable) : fondamentale sous `band.low` légale (le high-pass assumé), le rapport l'affiche comme information. +6 fixtures.

**F-35 — Les contraintes de performance (`performanceOnly`) face aux solutions compilées.**
e07 exige un jeu « non quantisé dur » (`quantizeInfo`) — mais une solution compilée depuis la notation tombe sur la grille au tick près : la solution de référence échouait par construction.
*Patch* : les contraintes de *jeu* (quantize, vélocités humaines) portent le drapeau `performanceOnly: true` — exigées des soumissions, **sautées par le verrou CI n°2** ; en contrepartie la solution déclare `humanize: {seed, offsetRange}` appliqué au rendu ▶ (déterministe : le round-trip tient). Recensement : trois specs concernées (e07, e09 velocity, m10 en aura). Famille F-8, plus un patch CI.

## 70.2 Les solutions

**m06-s01** *(e01 — quatre existences, `envelopeProfile`)*
| Layer | Source/geste | ADSR (ms/niveau) | Bande | Verdict |
|---|---|---|---|---|
| percussif | saw, cutoff 2.2k, résonance ponctuelle | A2 · D180 · S0 · R120 | 200–6k | profil « percussif » ✓ |
| soutenu | carré, cutoff 900 | A40 · D0 · S0.9 · R300 | 150–2k | « soutenu » ✓ |
| nappe | saw détuné, cutoff 1.4k | A1200 · D0 · S0.8 · R2500 | 120–4k | « nappe » ✓ |
| geste | saw, cutoff en montée | A3500 · D0 · S1.0 · R400 | 300–8k | « geste » ✓ |

Quatre profils, tolérances larges, 4/4 ✓ — `authorNotes` : le geste et la nappe ne se distinguent QUE par le couple attack/release : la frontière documentée pour le feedback.

**m06-s02** *(e02 — trois vitesses de vie, `motionPlan`)*
Pad : `motion {type: lfo, src: LFO 0.15 Hz, dst: cutoff, amt: 30%}` (la respiration) · Drone : `motion {type: automation, dst: cutoff 400→2600→700 Hz, shape: arche, peak: mes. 11}` — **le gabarit `default` appliqué à un paramètre** : la courbe déclarée corrèle au gabarit (0.81) ✓ · Scintille : `motion {type: lfo-random, 4 Hz, dst: pan, amt: 55%}`. Trois types distincts ✓, `sd.static-stack` muette ✓.

**m06-s03** *(e03 — le stack canonique ; témoin F-34 ; le champ `removed` inauguré)*
```
body    saw détuné, HP prouvé (band 100–2500) — voicings de la boucle fournie,
        dont le sol grave à fondamentale coupée (F-34 : source riche, légal)
sub     sinus mono 30–90, les fondamentales seules
top     pluck d'octave filtré, 2k–8k
texture souffle granulaire, 3k–10k, level -16
motion  LFO 0.12 Hz → cutoff body
removed "un pad choir doublant le body : muté — au test du mute, rien ne
        manquait et le 300–800 respirait ; le body suffisait"
```
Six règles `sd.*` muettes ✓ ; la soustraction livrée et lisible — le rapport la cite telle quelle.

**m06-s04** *(e04 — les familles au brief)*
« la mémoire d'un été » → **analog** (détune lent, chaleur) ✓ · « la salle des serveurs » → **digital** (wavetable froide, LFO sync 1/8) ✓ · « le monastère en ruine » → **choir** (formants + wash ambient en motion) ✓ · le piège « le héros se souvient » → **hybrid** déclaré, `authorNotes` argumentant aussi la défense analog — le rapport crédite les deux, comme promis ✓. Bandes disciplinées (HP 100 partout), une motion par pad ✓.

**m06-s05** *(e05 — l'invisible seul, ♩=60, 12 mes.)*
Drone 2 couches (sub sinus **la 55 Hz**, mono, sec + body 90–400, automation d'ouverture mes. 1→9) · texture « grain d'électricité statique » (4k–12k, level −18) · atmosphère musicalisée : *« le ventilateur du néon — bande étroite autour de 660 Hz, accordée : la quinte du drone ; le lieu devient un intervalle »* (champ libre ✓, level −14). Pyramide des niveaux −18 < −14 < −8 ✓, `sd.sub-conflict` muette (un seul roi sous 90) ✓, ni pad ni mélodie ✓.

**m06-s06 ×2** *(e06 — la basse hybride sur l'ostinato fourni)*
*(a)* sub sinus mono (notes = l'ostinato, E1–G1) + growl (mêmes notes, attaques à ±4 ticks — solidarité ✓, `humanize` F-35), saw+FM, filtre 250 Hz, `motion`: ouverture 250→1400 mes. 7–8 (la charge) ✓ ; bandes 30–90 / 100–2400 ✓.
*(b — la variante piège, contrebasses actives au `given`)* : **le sub TACET** (`removed`: « un seul roi sous 90 : les Cb régnaient — le sub abdique ») et le growl high-passé à 120, réduit au rôle de chair au-dessus des Cb ✓ — la cohabitation arbitrée en acte, `sd.sub-conflict` muette dans les deux mondes.

**m06-s07 ×2** *(e07 — les keys de l'intimité ; témoins F-35)*
Progression réalisée (main droite, sub séparé) :
```
MD: [E4+G4+B4+D5]:w | [G4+A4+C5+E5]:w | [A4+C5+E5+G5]:w | [F4+A4+C5+D5]:h [F4+G4+B4+D5]:h | [F4+Ab4+C5+D5]:w
SUB: C2:w | A1:w | F1:w | G1:w | F1:w
```
*(a « la confidence tard le soir »)* : **Rhodes**, `motion`: trémolo 5.5 Hz ; *(b « le souvenir qui s'efface »)* : **lo-fi**, `motion`: wow 0.4 Hz + flutter, bande plafonnée à 6k (la mémoire filtrée). Tensions : add9, 11, add9, sus4→7, **le iv voilé** (A♭ : la porte 3 de M1, aux keys) — 4 accords à tensions ≥ 3 ✓ ; `guideToneVoicing` assoupli (F-4) ✓ ; keys ≥ C3 ✓, sub mono ✓ ; `quantizeInfo` = `performanceOnly` + `humanize {seed: 42, ±18 ticks}` (**F-35**) ✓.

**m06-s08** *(e08 — Bruma au lead ; la continuité en checker)*
Notes = **s30-yours verbatim** (sol mineur, 12 mes.) — `findMotifs` re-reconnaît le capstone M2 ✓. Morphologie : **mono** (Bruma est une soliste ironique — argument au brief) ; `glide`: sélectif, déclaré sur les deux enjambements (mes. 3, 6) ; `vibrato`: delay **260 ms** > 200 ✓, depth léger ; lead `band 300–5000` (fondamentales G3–F4 sous 300 : source riche, F-34 légal, l'énergie déclarée est la présence) ; stack minimal : body HP (100–280 — hors de la bande du lead ✓), sub 30–90 ✓. `sd.*` muettes ✓. *« Ton personnage a maintenant une voix électrique. »*

## 70.3 Bilan du lot

| Livré | 10 solutions (s01→s08, variantes comprises) — synthèse, vie, spectre, pads, invisible, basses, keys, lead |
|---|---|
| Findings | **F-33** (payload — structurel, migre M4 et ouvre M7/M11), **F-34** (bande vs fondamentale par source), **F-35** (contraintes `performanceOnly` + humanize) |
| Constat de méthode | ~12–18 min/solution : le déclaratif est bon marché — mais chaque solution a exigé d'*écouter mentalement* le stack (le test du mute est réel même sur le papier) ; les deux fils de continuité (m09-e03, s30-yours) fonctionnent sans friction grâce aux formats épinglés en amont |
| Ordre des PR | **F-33 d'abord** (format + migration M4 + CI), F-34/F-35 → les 10 solutions |
| État M6 | **10/19** — reste le lot 2 : s09 (l'arp), s10 (la ponctuation), s11 (récolte/sculpture), s12 (les deux mises en scène), s13 (chair/glue/souffle), s14 (l'orchestre habillé — la première soumission bi-registres), s15 ×3 (« La Remise hybride ») |
| Cumul projet | **122 solutions** · **35 findings** |

---

**Point de confirmation.** Le bestiaire est solutionné et la grammaire déclarative est calibrée (format, bandes, performance). Le lot final de M6 : **(a)** s09→s15 — le cinéma (FX, espace, tenue) puis les deux soumissions historiques : s14 (`sd.*` + `orch.*` jugent ensemble pour la première fois) et le capstone tri-parts « La Remise hybride » — la clôture du module et la seconde pièce du diptyque de portfolio ; **(b)** intercaler les quiz (M3+M4+M6 lot 1). Ma recommandation : **(a)**. Je termine M6 ?