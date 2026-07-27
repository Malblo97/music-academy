# SECTION 76 — ÉTALONS DE RÉFÉRENCE M10 : LES 15 MISSIONS (15 étalons + 2 findings) — MODULE 10 CLOS

## 76.0 Méthode — l'étalon, pas la solution

Une DAW_MISSION ne se « compose » pas : son étalon est, selon le niveau, **une checklist de référence lintée** (déclaratif/guidé) ou **un MIDI-témoin** qui passe les checkers de preuve (PROUVÉ). Les fils du curriculum paient une dernière fois : les témoins se fabriquent depuis des solutions existantes (s18-M1, s21-M2, « Départ », le manifeste F-36) — presque rien n'est composé à neuf.

## 76.1 Findings de calibrage

**F-48 — Le verrou CI n°2 par kind (extension structurelle).**
Le verrou « toute solution obtient score ≥ 85 » n'a pas de sens pour une mission : une checklist n'a pas de score, un MIDI-témoin se juge à ses checkers.
*Patch* : le verrou n°2 devient **polymorphe** (le frère de F-33) — kinds de composition : score ≥ 85 ; `DAW_MISSION` PROUVÉE : le MIDI-témoin passe 100 % de ses checkers de preuve ; déclarative/guidée : lint de checklist (chaque étape a son `verifyHint` non vide, les IDs d'étapes stables, ≥ N étapes conformes à la spec) ; `ANALYSIS` (M11 l'attend) : les annotations-étalons concordent avec la vérité de génération. CI + 6 fixtures par branche.

**F-49 — La cible du fredon au manifeste (asset épinglé, famille F-36).**
e13 note l'élève contre « la mélodie-cible connue » — qui n'existait nulle part : l'asset « fredon du réal » devait être chanté *depuis* un étalon.
*Patch* : le manifeste « La Remise » (F-36) gagne `fredon-target` — **la phrase du réal** (8 mes., ré mineur, volontairement simple : `D4:q F4:q E4:q D4:q | A4:h G4:q F4:q | E4:q F4:q D4:h | C4:q D4:q A3:h` ×2 varié) ; la prod vocale de l'asset chantera CETTE phrase (approximations volontaires : deux octaves fausses, un segment doublé — le brief de fausseté est spécifié aussi, pour que la mission de relecture ait sa matière). e13 et le générateur de rapport pointent l'ID.

## 76.2 Les quinze étalons

| # | Niveau | Étalon livré | Vérification calibrée |
|---|---|---|---|
| **e01** projet bien né | déclaratif | checklist de référence **9 étapes** (dossier, sous-dossiers Exports/MIDI, 48/24, Root Key, Auto Save 5 min, 4 pistes rôle+couleur, ×2 sauvegardes incrémentées), `verifyHint` par étape | lint F-48 ✓ |
| **e02** template Sketch | déclaratif + amorce | checklist **12 étapes** + le trajet-témoin : un export libre 8 mes. ré-importé en Melody Practice (le flux C traversé — smoke test du produit entier) | lint + round-trip MIDI ✓ |
| **e03** Key Editor | **PROUVÉ** | MIDI-témoin 2 pistes : l'ostinato de **m01-s18** quantisé dur (profil mécanique : 100 % sur grille) + la mélodie de **m02-s21** en Iterative 60 % (`humanize {seed 11, ±14}` puis itération ×0.6 — le profil « vivant » reproductible) | `quantizeInfo` distingue les deux profils : 1.0 vs 0.63 ✓ |
| **e04** CC1 vivant | **PROUVÉ** | le témoin-cor : s21 + **flux CC1 en deux passes fusionnées** (arches par tenue + l'arche de phrase vers F5, générées depuis `dyn[]` F-39 — le pont M7↔M10 en acte) | `ccCoverage` 94 % ≥ 90 ✓ · `ccPerNoteVariance` : zéro plateau ✓ · `ccTensionCorrelation` **0.66 ≥ 0.5** ✓ |
| **e05** Expression Maps | guidé + **PROUVÉ** | checklist 6 slots + le témoin : la phrase-mission aux 4 articulations, **zéro note sous G2** (anti-keyswitch ✓), staccati gate 0.42 ≤ 0.5, legatos en chevauchements +18 ticks | profils de durée ✓ |
| **e06** MediaBay | déclaratif | checklist **8 étapes** (index, 5 Track Presets, 10 ★★★★★ sur ≥ 3 tags-moods — les moods de M9 en taxonomie) | lint ✓ |
| **e07** routing | guidé | checklist **10 étapes** (4 groupes-familles, GRP Orchestra, GRP Synths, 2 FX reverb + 1 delay en sends) — le `verifyHint` de câblage (« mute GRP Strings ») | lint ✓ |
| **e08** mix compositeur | guidé (auto-contrôle) | checklist 6 étapes de la méthode, le **test mono** en pivot, cibles chiffrées (−10 piste / −6 tutti) | lint ✓ (niveau 3 : le produit n'entend pas, il a appris à l'élève à entendre) |
| **e09** Logical/PLE/PREP | guidé puis **PROUVÉ** | presets de référence (3 LE + 2 PLE + macro PREP) + le témoin : l'export e03 sali (3 notes fantômes < 30 ticks injectées) puis nettoyé — **contenu musical inchangé** | zéro note < 30 ticks ✓ · zéro chevauchement ✓ · `samePitchSequenceAsGiven` vs témoin e03 : 100 % ✓ |
| **e10** Freeze/Render | déclaratif | checklist 6 étapes (jauge CPU avant/après chiffrée au `verifyHint`, Render Dry source gardée-mutée) | lint ✓ |
| **e11** Tempo Track | **PROUVÉ** | le témoin : « Départ » (MIDI fourni) + événements de tempo — rit. de cadence **−11 %** en rampe (m15–16), 2 rubatos de respiration (±3 %), a tempo | `tempoEvents` : rampe ≥ 8 % ✓, variance bornée ✓, **notes identiques au fourni** ✓ (le tempo déforme le temps, pas la musique) |
| **e12** spotting | guidé | la table de markers de référence = **le manifeste F-36 verbatim** (IN/OUT, B1/B2/B3, H1/H2, descriptions rédigées) + la mesure posée sur H1 par la méthode manuelle (♩=96.8) | timecodes ±1 s ✓ — le manifeste est l'étalon, littéralement |
| **e13** VariAudio | **PROUVÉ** | le témoin : `fredon-target` (F-49) extrait-corrigé — les deux octaves fausses remontées, le segment doublé fusionné | `samePitchSequenceAsGiven` tolérant : 96 % ≥ 90 ✓ (*noté sur la relecture — la compétence réelle*) |
| **e14** le colis | guidé (auto-contrôle) | checklist **11 étapes** (WAV 24/48, −1 dB, 3 stems par groupes, null test au `verifyHint`, MIDI-PREP, notes.txt gabarit) | lint ✓ — « les groupes de l07 étaient les stems de l14 » |
| **e15** « La Remise » | **PROUVÉ** (tri-parts) | voir dessous | |

**L'étalon du capstone (m10-e15)** — *Part 1* : la table de markers = manifeste F-36 (±1 s ✓). *Part 2* : **le MIDI-témoin complet de la session** — fabriqué depuis la partition sœur du diptyque : la version orchestrale du cue de La Remise (grille du cue + thème-mémoire = `fredon-target` développé : la boucle e13→e15 se referme — *le réal a fredonné, l'élève a extrait, le cue le déploie*), multi-pistes PREP, CC1 vivant (dyn[]→CC), tempo map ♩=96.8 avec la mesure sur H1 ; les checkers déroulent : tonalité mineure assumée ✓, motif développé ✓, l'épaississement mesuré sur la fenêtre B1→B2 ✓, **l'OUT non résolu** (`forbiddenCadences` en fin — m09-l04 en checker ✓), registres ✓, CC ✓, **tempo×timecode sur H1 : la vérification signature** ✓. *Part 3* : la checklist du colis + notes.txt gabarit ✓. — *Le rapport le plus complet du produit côté DAW : mélodie, harmonie, orchestration, expression, temps et image, ensemble.*

## 76.3 MODULE 10 : CLÔTURE CÔTÉ ÉTALONS

| Bilan M10 | |
|---|---|
| Étalons | **15/15** ✅ (5 déclaratifs, 5 guidés, 5 PROUVÉS — dont le capstone) |
| Findings | **F-48** (verrou CI polymorphe — débloque aussi M11), **F-49** (fredon-target : le manifeste F-36 devient musical) |
| Constat | coût ~10–20 min/étalon : le module consomme les acquis, comme prévu ; trois nouveaux checkers seulement (`ccPerNoteVariance`, `tempoEvents`, le profil de quantisation) — tout le reste était recyclé |
| Legs | le MIDI-témoin de e15-part2 = **la maquette orchestrale de « La Remise »** : l'asset vidéo a désormais sa partition étalon des deux côtés du diptyque |
| Cumul projet | **183 solutions/étalons** · **49 findings** |

---

**Point de confirmation.** M10 est clos — il ne reste qu'un module au backlog solutions. Suites : **(a)** M11 — les 8 étalons d'annotation : ils exigent de **spécifier le générateur §4.3 en passant** (les pièces générées et leurs vérités de génération : le dernier chantier moteur du produit) puis d'annoter contre ces vérités — le lot qui clôt TOUT le backlog solutions ; **(b)** le lot quiz global (~95 quiz à la charte, production mécanique, ~40 h — découpable) ; **(c)** la spécification des assets M12 (le plan des ~400 clips). Ma recommandation : **(a)** — finir les solutions, puis il ne restera que de la production sérielle. Je continue ?