# SECTION 81 — LOT QUIZ, TRANCHE 4 : MODULE 6 COMPLET, l01–l15 (15 quiz, 77 items)

## 81.0 Méthode

Charte inchangée. Spécificité M6 : les items ▶ sont des **diagnostics de son** (deux patchs joués, nommer la différence) et les intégratives recousent systématiquement vers le jumeau orchestral — c'est la thèse du module.

## 81.1 m06-l01-quiz — Les blocs de la synthèse (5)

1. **La chaîne soustractive :** oscillateur → filtre → ampli (VCA), pilotés par enveloppes ✓ · micro → EQ → reverb · sample → pitch → pan · MIDI → audio → master — *why : l01 §1 — on part du riche, on soustrait : le nom dit la méthode.*
2. **L'ADSR décrit…** l'existence temporelle du son (attaque, chute, tenue, extinction) ✓ · la hauteur · le timbre · le tempo — *why : l01 §2 : quatre poignées = les « quatre existences » de e01.*
3. ▶ **[A2ms/S0 puis A1200ms/S0.8] Quels profils ?** percussif puis nappe ✓ · nappe puis geste · deux percussifs · soutenu puis percussif — *why : attack + sustain suffisent à classer — la table de l01 §3.*
4. **Saw vs carré :** saw = toutes les harmoniques (le riche à sculpter) ; carré = impaires (le creux boisé) ✓ · l'inverse · identiques · saw = plus grave — *why : la matière première décide de ce que le filtre pourra retirer (table Erreurs : partir du pauvre).*
5. **[Intégrative] Le filtre joue le rôle de quelle décision d'orchestrateur (m05) ?** le choix de registre-couleur : ouvrir le cutoff = monter dans la zone brillante de l'instrument ✓ · le tempo · la doublure · l'articulation — *why : cutoff = « où vit le son » — la coupe de registre de M5, en hertz.*

## 81.2 m06-l02-quiz — La modulation, la vie (5)

1. **Un LFO est…** un oscillateur trop lent pour être entendu comme hauteur — il PILOTE au lieu de sonner ✓ · un filtre · une reverb · un métronome — *why : l02 §1 : sous ~20 Hz, l'onde devient un geste.*
2. **Les trois vitesses de vie (e02) :** la respiration (LFO lent), le trajet (automation), le scintillement (rapide/aléatoire) ✓ · piano, forte, sforzando · attaque, tenue, chute · lent, moyen, vif — *why : l02 §2 : trois échelles de temps = trois émotions de mouvement.*
3. ▶ **[pad figé vs même pad + LFO 0.15 Hz sur cutoff] Le second…** respire — le son vivant sans note nouvelle ✓ · est plus fort · est désaccordé · module la tonalité — *why : `sd.static-stack` : un son tenu sans motion est un décor mort (table Erreurs).*
4. **L'automation se distingue du LFO par…** sa trajectoire unique et dirigée (elle raconte), quand le LFO boucle ✓ · sa vitesse · son volume · rien — *why : l02 §3 — l'arche de e02 sur le cutoff suit un gabarit de tension : l'automation EST une dramaturgie.*
5. **[Intégrative] Le vibrato du violoniste (m05) correspond à…** un LFO sur la hauteur, avec delay — la vie humaine, modélisée ✓ · une automation · un filtre · un sidechain — *why : la fiche lead (l08) le codera : `vibrato {delay ≥ 200 ms}` — l'archet apprend au synthé.*

## 81.3 m06-l03-quiz — Le spectre : l'orchestration en hertz (6)

1. **Les 7 rôles :** sub, body, top, texture, movement, fx, melodic ✓ · basse, ténor, alto, soprano · grave, médium, aigu · lead, pad, drum — *why : l03 §1 : le spectre se distribue comme un orchestre — chaque bande, un emploi.*
2. **L'ordre de construction :** body → sub → top → vie → SOUSTRACTION ✓ · sub d'abord toujours · top d'abord · tout ensemble — *why : l03 §2 : on fonde le corps, on encadre, on anime — puis on RETIRE (le champ `removed`).*
3. **Le champ `removed` déclare…** ce qu'on a coupé et pourquoi — la soustraction est une écriture ✓ · les erreurs · les pistes mutées par accident · le volume — *why : l03 §3 : le test du mute — si rien ne manque, la couche mentait.*
4. ▶ **[deux pads ensemble : masquage 300–800 Hz, puis l'un coupé] Qu'entend-on ?** le médium respire — rien ne manque : le second était redondant ✓ · un trou · une fausse note · moins de graves — *why : `sd.masking` : deux occupants d'une bande = zéro lisible (le jumeau de `orch.masking`).*
5. **Une fondamentale sous `band.low` est légale si…** la source est riche (le high-pass assumé : les harmoniques portent) — jamais pour un sub sinus ✓ · toujours · jamais · seulement au lead — *why : F-34 : la bande juge le contenu harmonique, pas la fondamentale.*
6. **[Intégrative] `sd.sub-conflict` est le jumeau de…** `orch.low-interval-limit` + la règle « l'entrée des contrebasses est un événement » : un seul roi sous 90 Hz ✓ · `melody.climax` · `vl.spacing` · aucun — *why : le grave est un trône, dans les deux mondes (m05-contrebasse, m06-l03).*

## 81.4 m06-l04-quiz — Les pads (5)

1. **Les cinq familles :** analog, digital, choir, ambient, hybrid ✓ · court, long, fort, doux, moyen · majeur, mineur, modal, libre, mixte · cordes, cuivres, bois, percussions, claviers — *why : l04 §1 : cinq caractères, mappés aux briefs (e04).*
2. **« La mémoire d'un été » appelle…** l'analog — détune lent, chaleur ✓ · le digital · le choir · rien — *why : la table brief→famille de l04 §2 : la nostalgie est analogique (culturellement codée).*
3. ▶ **[wavetable froide LFO sync vs saw détuné chaud] La salle des serveurs, c'est…** la première ✓ · la seconde · les deux · aucune — *why : le digital assume la grille et le froid — le caractère est dans la matière (l04 §2).*
4. **Un pad se discipline par…** HP autour de 100 Hz + une bande déclarée + UNE motion ✓ · plus de volume · deux LFO minimum · un sub intégré — *why : table Erreurs : le pad qui mange tout le spectre est le masquage incarné.*
5. **[Intégrative] Le pad tient quel rôle de m07-l03 ?** le tapis — mêmes trois vies (respiration, renouvellement, complément) ✓ · le socle · la ligne · le moteur — *why : le tapis orchestral et le pad sont un seul métier, deux lutheries.*

## 81.5 m06-l05-quiz — Textures et drones : l'invisible (5)

1. **Le drone diffère du pad par…** l'absence d'harmonie mobile — une hauteur-lieu, pas un accord-discours ✓ · le volume · le registre · la reverb — *why : l05 §1 : le drone est un SOL, on marche dessus.*
2. **La texture se place…** sous le seuil d'attention (niveau bas, bande étroite) — on la remarque quand elle s'arrête ✓ · au premier plan · dans le sub · au lead — *why : l05 §2 : l'invisible se mesure à son retrait (la pyramide de e05 : −18).*
3. ▶ **[la scène avec puis sans le grain d'électricité] Sans lui…** le lieu meurt — l'espace devient studio ✓ · rien ne change · c'est plus propre donc mieux · le tempo change — *why : le test du mute à l'envers : l'invisible prouvé par son absence.*
4. **L'atmosphère « musicalisée » :** un son de lieu accordé sur le drone (le néon calé sur la quinte) ✓ · un field recording brut · une mélodie douce · un écho — *why : l05 §3 : le décor entre dans l'harmonie — la frontière son/musique, franchie en conscience.*
5. **[Intégrative] Le drone + bourdon modal de m03-l08 :** même geste — l'insistance qui fait pôle (F-19 les ancre pareil) ✓ · aucun rapport · opposés · le drone est tonal — *why : la pédale, le bourdon, le drone : trois noms d'un seul principe selon le monde.*

## 81.6 m06-l06-quiz — Les basses (5)

1. **Le duo sub + growl :** le sinus porte la fondation, la couche riche porte le caractère — mêmes notes, solidaires ✓ · deux basses indépendantes · sub aigu, growl grave · un seul son suffit toujours — *why : l06 §1 : la basse moderne est un ATTELAGE — la solidarité se vérifie (±ticks).*
2. **Le sub reste…** mono, sec, sinus — la gravité ne se décore pas ✓ · large et réverbéré · saturé · vibré — *why : table Erreurs : le sub stéréo/mouillé = la boue (le jumeau du low-interval-limit).*
3. ▶ **[growl filtré 250 Hz puis l'ouverture mes. 7] L'effet ?** la charge — le même matériau qui montre les dents : le crescendo par cutoff ✓ · une nouvelle note · un autre accord · un bug — *why : l06 §2 : l'ouverture de filtre est le crescendo du synthé (le levier 5 de m07-l06, en hertz).*
4. **Si des contrebasses tiennent déjà le grave :** le sub abdique (tacet) ou le growl se high-passe — un seul roi sous 90 ✓ · on empile · on baisse tout de 3 dB · on mute les Cb — *why : la variante piège de e06 : l'arbitrage acoustique/synthé est une décision, pas un mix.*
5. **[Intégrative] La solidarité sub/growl reprend quelle idée de m07-l02 ?** la doublure à l'unisson — l'alliage : deux timbres, une ligne ✓ · le tutti · le contrechant · la strette — *why : « la doublure se mérite » vaut en hertz : l'attelage est un alliage synthétique.*

## 81.7 m06-l07-quiz — Les keys (5)

1. **Rhodes vs lo-fi :** la nuit chaude (trémolo) vs le souvenir qui s'efface (wow/flutter, bande plafonnée) ✓ · fort vs doux · grave vs aigu · identiques — *why : l07 §1 : deux familles d'intimité — le brief choisit (e07).*
2. **Les voicings de keys vivent…** au-dessus de C3, tensions à la main droite, le grave délégué au sub ✓ · dans le grave · en octaves parallèles · sans tierces — *why : l07 §2 : les keys ne sont pas une basse — la répartition des registres est le contrat (table Erreurs).*
3. ▶ **[la même progression quantisée dure puis jouée souple] La version keys « juste »…** est la souple — l'intimité vit dans le non-quantisé ✓ · la dure · les deux · aucune — *why : `quantizeInfo` en contrainte de style (F-35 : performanceOnly) — la machine exige de l'humain.*
4. **Le iv voilé (A♭ sur C) aux keys :** la porte 3 de M1, en couleur d'accord étendu ✓ · une faute · une modulation · un cluster — *why : l07 §3 : les emprunts de M1 deviennent des couleurs de voicing — même harmonie, autre lutherie.*
5. **[Intégrative] `guideToneVoicing` (m01-l14) s'assouplit ici comment ?** les doublures d'octave pianistiques ne consomment pas le quota (F-4) ✓ · il disparaît · il durcit · il ne s'applique qu'au sub — *why : le geste clavier a ses idiomes — le checker les connaît depuis le calibrage M1.*

## 81.8 m06-l08-quiz — Les leads (5)

1. **Mono vs poly pour un lead :** mono = le soliste (glide possible) ; poly = le chœur de leads ✓ · mono = plus fort · poly = plus juste · aucune différence — *why : l08 §1 : la morphologie EST un choix de personnage.*
2. **Le glide (portamento) s'emploie…** sélectivement, sur les enjambements déclarés ✓ · partout · jamais · sur chaque note — *why : table Erreurs : le glide permanent transforme le thème en sirène.*
3. ▶ **[vibrato immédiat vs delay 250 ms] Le second sonne…** humain — la note se pose puis vit (l'archet, le souffle) ✓ · faux · plus fort · désaccordé — *why : l08 §2 : `vibrato.delay ≥ 200 ms` — la règle du vivant, chiffrée.*
4. **La bande réservée du lead :** sa zone de présence — les autres couches s'en écartent ✓ · tout le spectre · le grave · une octave exacte — *why : l08 §3 : le soliste a droit à sa lumière (le jumeau : « ne jamais couvrir », m04-l11).*
5. **[Intégrative] Bruma au lead (e08) prouve quoi ?** la ligne vérifiée par M2 reste elle-même — la lutherie change, `findMotifs` la reconnaît ✓ · qu'il faut recomposer · que le synthé fausse · rien — *why : le personnage a une voix électrique : le contenu et le vêtement sont deux couches du produit.*

## 81.9 m06-l09-quiz — Plucks et arpèges (5)

1. **Le pluck se calibre par…** son release, calculé sur le pas de grille (±30 % du temps de 1/16) ✓ · son attaque lente · sa reverb · sa hauteur — *why : l09 §1 : le pluck doit finir AVANT le suivant — le calcul se déclare (s09 : 136→140 ms).*
2. **Le pattern 3 notes sur grille 1/16 crée…** le 3-contre-4 — la boucle qui tourne sans se répéter à l'identique ✓ · un triolet · une erreur de mesure · un swing — *why : l09 §2 : l'asymétrie 3+3+2 de m01-l08, motorisée.*
3. ▶ **[l'arp avec puis sans la dérive de cutoff] Sans elle…** la filature devient papier peint — 16 mesures identiques ✓ · c'est mieux · plus de tension · un autre accord — *why : la dérive est la vie du motorique (le cousin de `requireChromaticDrift`, porté au paramètre).*
4. **L'apnée (l'arp qui se tait un temps) :** la bombe — le silence rend le retour énorme ✓ · une erreur de séquenceur · une cadence · un decrescendo — *why : l09 §3 : le vide amplifie (m07-s04 fait pareil à l'orchestre : l'apnée composée).*
5. **[Intégrative] La hiérarchie de vélocités de l'arp applique…** la prosodie de m02-l09 — poids métrique × accent, mesuré par corrélation ✓ · rien · le swing · la dynamique de masse — *why : même le motorique parle avec des appuis : le checker de prosodie ressert tel quel.*

## 81.10 m06-l10-quiz — FX I : riser, impact, braam (5)

1. **Le riser se compose…** depuis sa CIBLE : la fin d'abord (le tick de bascule), la longueur ensuite ✓ · depuis son début · sans cible · à l'oreille seule — *why : l10 §1 : source-first pour la matière, target-first pour le temps — la cible se vérifie (±1 temps).*
2. **L'impact tri-couche :** boom sub / corps / débris — trois bandes étagées, chevauchement ≤ 30 % ✓ · trois impacts successifs · trois volumes · un sample unique — *why : l10 §2 : l'impact est un accord de bruit — orchestré comme un tutti d'une croche.*
3. ▶ **[bascule avec puis sans l'apnée avant l'impact] Avec l'apnée…** l'impact double de taille — le vide est le vrai amplificateur ✓ · plus faible · identique · en retard — *why : la respiration avant le hit : le geste-signature de la phrase de bascule (s10).*
4. **Le braam s'emploie…** au premier degré et rarement — l'exclamation, pas la ponctuation courante ✓ · à chaque mesure · en croisière · comme basse — *why : table Erreurs : le braam banalisé est le cliché qui tue la scène.*
5. **[Intégrative] La « queue qui accouche du drone » relie FX et…** la couture de forme : la traîne de l'impact DEVIENT le centre de la scène suivante (la modulation par timbre) ✓ · rien · le tempo · le mix — *why : l10 §3 : la transition n'est pas un objet posé, c'est un passage de matière (m03-l05 en hertz).*

## 81.11 m06-l11-quiz — FX II : reverse et granulaire (5)

1. **Le reverse-riser :** un rendu inversé dont la FIN tombe sur la cible ✓ · un riser joué à l'envers au hasard · un écho · un delay — *why : l11 §1 : la montée gratuite — mais la cible reste un tick (source-first, target-locked).*
2. **Les quatre poignées granulaires :** position, taille, densité, pitch ✓ · ADSR · EQ 4 bandes · pan, volume, send, mute — *why : l11 §2 : quatre nombres décrivent tout nuage — et le rôle se déduit d'eux.*
3. ▶ **[position figée vs position balayée] Le rôle change de…** drone → geste : le nuage immobile est un lieu, le nuage qui voyage raconte ✓ · rien · hauteur · volume — *why : la cohérence poignées↔rôle est vérifiée (s11 : position 0.42 figée = drone ✓).*
4. **La règle « source-first » :** on récolte ses PROPRES rendus (traçables) avant de sculpter ✓ · on télécharge des packs · on enregistre la radio · on part du sinus — *why : l11 §3 : la sculpture commence à la récolte — et la traçabilité est une clause du produit (zéro droits tiers).*
5. **[Intégrative] `source: "m10-e09-render"` illustre quelle doctrine de M10 ?** « MIDI pour composer et prouver, audio pour livrer et durer » — le Render devient matière première ✓ · le freeze · le template · le spotting — *why : la chaîne interne se referme : ce que l10-M10 a imprimé, l11-M6 le sculpte.*

## 81.12 m06-l12-quiz — L'espace (5)

1. **Reverb : les deux poignées premières :** decay (la taille) et pre-delay (la distance du mur) ✓ · volume et pan · attack et release · EQ et gate — *why : l12 §1 : le lieu se règle en secondes et millisecondes.*
2. **Le decay « au tempo » :** la traîne calée sur une valeur musicale (4 temps) — l'espace respire avec la pièce ✓ · le plus long possible · fixe à 2 s · aléatoire — *why : l12 §2 : la reverb est un instrument rythmique qui s'ignore (s12-b : 3.7 s à ♩=65).*
3. ▶ **[le même stack : studio sec vs cathédrale] Ce qui n'a PAS bougé :** les couches et les notes — l'espace est un paramètre, l'invariance est la preuve ✓ · tout a changé · les accords · le tempo — *why : e12 est une expérience contrôlée : la mise en scène, isolée.*
4. **Le budget stéréo :** la largeur se distribue (sub mono, body modéré, top large) — tout large = rien de large ✓ · tout à 100 % · tout mono · au hasard — *why : `sd.stereo-budget` : la largeur est une ressource rare, comme le ff de m01-l09.*
5. **[Intégrative] La scène 3D (profondeur) traduit quel geste de m10-l08 ?** le seating : proche/loin par pre-delay, sends et coupe-haut — le placement d'orchestre, en plugins ✓ · le limiteur · le routing · les stems — *why : les trois gestes de profondeur du mix compositeur, réécrits côté sound design.*

## 81.13 m06-l13-quiz — La tenue : saturation, glue, sidechain (5)

1. **La saturation « élargit la bande » signifie…** des harmoniques nouvelles apparaissent — la déclaration doit suivre (band.high ↑) ✓ · le son est plus fort · le grave descend · rien — *why : l13 §1 : saturer, c'est réorchestrer le spectre — l'honnêteté de la bande est vérifiée (s13 : 2400→4800).*
2. **Le sub se sature-t-il ?** non — la pureté du sinus est sa fonction ✓ · oui, toujours · seulement en live · seulement en mineur — *why : table Erreurs : le sub sale = la gravité qui bave (le trône se garde propre).*
3. ▶ **[le pad qui pompe sous un kick fantôme] Le sidechain fait…** respirer la tenue au pouls du morceau — c'est de l'ÉCRITURE rythmique ✓ · baisser le volume global · un écho · un trémolo — *why : l13 §2 : le release se calcule sur le pouls (480 ms à ♩=120 — le calcul se déclare).*
4. **La couche `trigger: true` :** un déclencheur silencieux — hors spectre, hors pyramide, source de sidechain ✓ · une piste mutée par erreur · un métronome audible · un bug — *why : F-38 : le kick fantôme est un chef d'orchestre inaudible.*
5. **[Intégrative] Le sidechain sub→pad reprend quelle politesse orchestrale ?** « ne jamais couvrir » (m04-l11) : la fondation parle, le tapis s'incline — automatiquement ✓ · le tutti · la strette · le legato — *why : la hiérarchie des rôles, câblée dans le routing.*

## 81.14 m06-l14-quiz — L'hybride : un rôle, un monde (5)

1. **La loi première de l'hybride :** un rôle = un monde (l'acoustique OU le synthé le tient — jamais deux prétendants par bande) ✓ · tout doubler · le synthé dessous toujours · l'acoustique d'abord — *why : l14 §1 : l'hybride réussi est une distribution, pas une superposition.*
2. **Les trois protocoles de fusion :** doublure fantôme, fantôme granulaire, relais d'enveloppe ✓ · EQ, compression, reverb · unisson, octave, tierce · fade, cut, crossfade — *why : l14 §2 : trois manières de marier sans que la couture se voie.*
3. **La doublure fantôme exige…** notes ⊆ notes de l'acoustique, −6 dB min, high-passée ✓ · le même volume · des notes libres · le premier plan — *why : le fantôme épaissit sans exister — vérifiable en pitch-classes par fenêtre (s14 : 8/8).*
4. ▶ **[cordes seules puis + relais d'enveloppe au climax] Le pad fait quoi ?** il prend la TENUE quand les cordes attaquent — chacun son temps du son ✓ · il double tout · il joue plus fort · il module — *why : l14 §2 : le relais d'enveloppe partage la note dans le temps : attaque acoustique, sustain synthétique.*
5. **[Intégrative] e14 est historique car…** `sd.*` et `orch.*` jugent ENSEMBLE une même soumission — les jumeaux réunis ✓ · c'est le plus long · il y a une vidéo · c'est noté double — *why : la thèse du module (l'orchestration en hertz) devient un fait de moteur.*

## 81.15 m06-l15-quiz — Synthèse : La Remise hybride (7)

1. **L'ordre du capstone :** distribution (rôles + plan des bascules) → stack complet → soustraction ✓ · stack d'abord · mix d'abord · libre — *why : l15 §1 : on caste, on réalise, on retire — la passe 3 est obligatoire.*
2. **Le plan des bascules référence…** les IDs du manifeste (B1/B2/H1…), jamais des timecodes bruts ✓ · des minutes approximatives · les mesures seules · rien — *why : F-36 : l'asset partagé a un canon — les specs pointent ses marqueurs.*
3. **Dans la part 2, la grille harmonique est jugée par…** M1 (les règles d'harmonie, inchangées sous les synthés) ✓ · personne · sd.\* seulement · le volume — *why : l15 §2 : la lutherie ne suspend pas le solfège — keys et pads portent des accords réels.*
4. ▶ **[le stack avec puis sans le supersaw retiré en part 3] La leçon ?** rien ne manque, et le thème respire — la couche mentait ✓ · il manque un son · c'est plus faible · le sub a disparu — *why : le `removed` argumenté au test du mute : l'économie est notée en craft.*
5. **Le diptyque « La Remise » prouve…** la même dramaturgie dans deux mondes sonores — la scène est invariante, la palette est un choix ✓ · que l'hybride est meilleur · que l'orchestre est meilleur · rien — *why : le frère du triptyque M3 : là c'était l'harmonie, ici la lutherie.*
6. **La phrase de bascule (s10) ressert au capstone comme…** un objet de production réutilisable calé sur B2 — la « cadence » du sound design ✓ · un souvenir · un sample interdit · un bug — *why : l15 §3 : on capitalise ses gestes — la bibliothèque personnelle commence ici (M12 l'indexera).*
7. **[Intégrative] Après M6, `sd.role-coverage` et m07-l01 (le casting) disent ensemble :** toute scène commence par une distribution — quels rôles, quels titulaires, quel monde ✓ · rien de commun · le mix d'abord · le thème d'abord — *why : le réflexe unique du compositeur hybride : caster avant d'écrire, dans les deux lutheries.*

## 81.16 Bilan de tranche — MODULE 6 : QUIZ COMPLETS

| Livré | 15 quiz · 77 items — **M6 : 15/15** ✅ |
|---|---|
| Conformité charte | 5/5 partout ; 15 items ▶ (diagnostics de son) ; intégratives : chaque leçon recousue à son jumeau orchestral + M1/M2/M3/M10 |
| Cumul quiz | **53 rédigés** / ~151 · reste : M7 (10), M8 (15), M10 (15), M11 (8), MVP M1/M2 (~50) |

---

**Point de confirmation.** M6 est quizzé — le rythme tient (~15 quiz/tranche). **(a)** tranche 5 : M7 (10) + M8 entamé, ou M7+M8 complets si tu veux une grosse tranche (25 quiz) ; **(b)** M10+M11 (23 — les quiz de missions sont plus courts, 4–6 items) ; **(c)** le stock MVP M1/M2. Je continue en (a) avec M7 complet + M8 complet ?