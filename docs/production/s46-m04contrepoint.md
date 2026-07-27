# SECTION 46 — MODULE 4 : CONTREPOINT — OUVERTURE

## 46.1 Positionnement — et pourquoi un compositeur à l'image apprend Fux

Le contrepoint a une réputation : la discipline-musée, l'exercice de conservatoire sans rapport avec un cue de thriller. Ce module la répudie dès sa première ligne : **le contrepoint est l'art de faire vivre plusieurs lignes en même temps** — et un score de film en superpose en permanence (le thème, le contrechant, la basse, l'ostinato : quatre lignes, m09-l02). La différence entre l'arrangeur qui empile et le compositeur qui tisse est exactement la compétence de ce module. Trois arguments d'utilité, pour solde de tout compte :

```
1. LE CONTRECHANT : la deuxième voix qui rend la première inoubliable
   (le cor sous les violons, m09-l01) est un geste de contrepoint —
   le Module 7 en vivra, ce module l'enseigne
2. LA CONDUITE : tout vl.* de ton registre (§7.4) descend du contrepoint —
   tu appliques ses lois depuis M1 sans les avoir apprises à la source
3. LA PENSÉE POLYPHONIQUE : entendre deux lignes À LA FOIS est un muscle —
   le contrepoint est sa salle de sport, et l'orchestrateur sans ce
   muscle ne fait que du vertical
```

**Le contrat pédagogique** : les cinq espèces (l02–l06) sont un *laboratoire* — des contraintes artificielles assumées (comme les gammes d'un instrumentiste) qui isolent chaque difficulté ; puis le module sort du laboratoire (l07–l11) vers l'écriture libre et le métier de film. Le moteur est déjà prêt : les checkers d'espèces de §4.1.5 (paramétrés `species: 1..5`) et les règles `cpt.*` du registre (§7.9) attendent leurs leçons depuis la Section 4 — c'est le seul module dont le code a précédé le contenu.

Prérequis : M1 (niveau ≥ 6) ; M2 recommandé. Profil moteur : `strict-counterpoint` (§7.8 — les poids maximaux, enfin dans leur habitat naturel). Les 12 leçons :

| # | Titre | min |
|---|---|---|
| 1 | Deux lignes, un art : les lois du dialogue | 20 |
| 2 | Le cantus firmus et la première espèce : note contre note | 30 |
| 3 | La deuxième espèce : le mouvement contre la tenue | 25 |
| 4 | La troisième espèce : la ligne fleurie contre le socle | 25 |
| 5 | La quatrième espèce : la syncope et le retard — la tension liée | 30 |
| 6 | La cinquième espèce : le contrepoint fleuri | 25 |
| 7 | Sortir du laboratoire : le contrepoint libre à deux voix | 25 |
| 8 | Trois voix : le tissage complet | 25 |
| 9 | L'imitation : le canon et la conversation | 30 |
| 10 | Le fugato : la fugue au cinéma | 25 |
| 11 | Le contrechant de film : la countermelody en pratique | 30 |
| 12 | Synthèse : la scène tissée | 35 |

---

## 46.2 LEÇON m04-l01 — « Deux lignes, un art : les lois du dialogue »

```mdx
---
id: m04-l01-dialogue
module: module-04-contrepoint
title: "Deux lignes, un art : les lois du dialogue"
estMinutes: 20
skills: { counterpoint: 1.0 }
---
```

### Pourquoi « point contre point »

*Punctus contra punctum* : note contre note. Le contrepoint pense la musique **horizontalement** — non pas « quel accord ici ? » (la question de M1) mais « que fait chaque voix, et que font-elles ENSEMBLE ? ». Les deux pensées décrivent la même musique sous deux angles (une harmonie EST la coupe verticale de voix qui bougent ; des voix SONT le déroulé horizontal d'accords) — mais l'angle change tout : le compositeur vertical remplit des accords ; le compositeur horizontal fait *parler* des personnages. Ce module t'installe le second angle.

### 1. L'objectif unique : l'indépendance dans l'union

Deux lignes réussies satisfont deux exigences contradictoires — tout le contrepoint est la gestion de ce paradoxe :

| Exigence | Ce qui la sert | Ce qui la tue |
|---|---|---|
| **INDÉPENDANCE** : chaque voix est une mélodie qui vaudrait seule (chante chacune : le test) | contours différents, rythmes différents, directions contraires | les parallèles (deux voix en quintes/octaves fusionnent en UNE — le pourquoi profond de `vl.parallel-fifths`, enfin énoncé à la source : ce n'était jamais une superstition, c'était la défense de l'indépendance) |
| **UNION** : ensemble, elles sonnent — les verticalités sont contrôlées | les consonances aux points d'appui, les dissonances *conduites* | la dissonance sauvage (non préparée, non résolue), les frottements accidentels |

### 2. Les quatre mouvements (le vocabulaire de base)

Entre deux voix, à chaque pas, quatre relations possibles :

```
CONTRAIRE   ↑↓  les voix s'écartent ou se croisent en sens inverse
            → l'INDÉPENDANCE maximale : le mouvement-roi du contrepoint
OBLIQUE     ↑─  une voix bouge, l'autre tient
            → l'indépendance douce (et le germe de la 4e espèce, l05)
DIRECT      ↑↑  même direction, intervalles différents
            → l'union en marche : légal, à doser (trop = la fusion rampante)
PARALLÈLE   ↑↑  même direction, MÊME intervalle
            → tierces/sixtes : le velours (légal, délicieux, à doser aussi —
              trois de suite maximum en style strict : au-delà, une voix
              devient l'ombre de l'autre) ; quintes/octaves : l'interdit
              fondateur (§1)
```

La hiérarchie d'usage : **le contraire d'abord, l'oblique ensuite, le direct avec soin, le parallèle consonant par grappes de deux-trois**. Ce n'est pas une esthétique : c'est la recette mécanique de l'indépendance — et `cpt.contrary-preference` (§7.9) la mesure littéralement (le ratio de mouvement contraire+oblique, cible ≥ 0.5 en strict).

### 3. Consonance et dissonance : le classement du laboratoire

Le contrepoint d'école classe les intervalles avec une sévérité que M1 n'avait pas — parce que le laboratoire isole deux voix nues (aucun accord pour « couvrir ») :

| Classe | Intervalles | Statut |
|---|---|---|
| Consonances parfaites | unisson, quinte, octave | stables mais CREUSES (m02-l13 le savait) : les points d'ancrage — début, fin — pas la chair |
| Consonances imparfaites | tierces, sixtes | LA chair du contrepoint : pleines, chaudes, directionnelles |
| Dissonances | secondes, septièmes, **la quarte** (oui : à deux voix, la quarte est dissonante — elle « tombe » vers la tierce ; l'histoire de sus4, m01-l17, commence ici), le triton | jamais libres : conduites (passage, broderie, retard — la table de m02-l08 §3 est née dans ce laboratoire) |

### 4. Le laboratoire et ses règles (le contrat des cinq espèces)

Les espèces (l02–l06) travaillent sur un **cantus firmus** — un chant donné en rondes, immuable — contre lequel tu écris une voix selon des règles strictes. Pourquoi accepter des contraintes que la musique réelle assouplit ? La réponse d'atelier : *chaque espèce isole UN problème* (les verticalités pures, puis le temps faible, puis l'ornement, puis la dissonance liée, puis tout ensemble) — c'est une gamme de compositeur : personne ne joue des gammes en concert, personne ne compose sans les avoir jouées. Et le produit t'accompagne exactement là-dessus : le profil `strict-counterpoint` applique les poids maximaux DANS le laboratoire, et les relâche dès l07 (la matrice §7.8 a été construite pour ce module autant que pour les styles de film — la boucle architecture↔pédagogie se referme).

### Erreurs fréquentes

| Erreur | Correction |
|---|---|
| Penser les deux voix comme mélodie + accompagnement | deux MÉLODIES : le test du chant (chaque voix, seule, doit valoir) |
| Les parallèles vus comme un tabou arbitraire | c'est la défense de l'indépendance : deux voix parallèles = une voix épaisse (et le planing de m03-l14 le VEUT — les deux faces, tu les connais) |
| La quarte traitée en consonance « comme dans les accords » | à deux voix nues, elle tombe : le laboratoire a ses lois, et elles t'expliquent sus4 |
| Vouloir sauter le laboratoire | les espèces sont les gammes : l07–l11 s'écroulent sans elles |

### La mission (m04-e01, THEORY_QUIZ + EAR)

Le diagnostic d'entrée : identifier les quatre mouvements à l'oreille et au roll (generator : paires de voix, 8 rounds), classer des verticalités à deux voix, et le test du chant — trois extraits à deux voix dont un seul a deux vraies mélodies : lequel ? (le `why` explique par les mouvements et les contours).

- [ ] Horizontal : que fait chaque voix, et que font-elles ensemble
- [ ] L'indépendance dans l'union — le paradoxe fondateur
- [ ] Contraire > oblique > direct > parallèle (consonant, par grappes)
- [ ] Le laboratoire est une gamme de compositeur : cinq espèces, cinq problèmes isolés

<QuizBlock id="m04-l01-quiz" questions={5} />
<LessonFooter exercises={["m04-e01-four-motions"]} />

---

## 46.3 LEÇON m04-l02 — « Le cantus firmus et la première espèce : note contre note »

```mdx
---
id: m04-l02-premiere-espece
module: module-04-contrepoint
title: "Le cantus firmus et la première espèce : note contre note"
estMinutes: 30
skills: { counterpoint: 1.0 }
---
```

### Pourquoi commencer par des rondes

La première espèce est le contrepoint réduit à son os : une ronde contre une ronde — **aucun rythme, aucun ornement, aucune dissonance** : rien que des verticalités consonantes et des mouvements. C'est le problème n° 1 isolé à l'état pur : *choisir, pour chaque note du chant donné, LA note qui fait une belle verticalité ET une belle ligne*. Douze notes, douze décisions — et chaque décision engage les deux exigences de l01.

### 1. Le cantus firmus : le partenaire immuable

Le CF est une mélodie modèle : des rondes, du conjoint dominant, une arche simple, un ambitus sage — le partenaire idéal parce qu'il est *sain* (tout ce que m02 t'a appris, en version minérale). Le produit en fournit une banque (générés et validés par le moteur : conjoint ≥ 0.75, un seul climax, départ/arrivée sur la finale — le générateur §4.3 a son premier emploi contrapuntique) ; en voici un, le compagnon des trois prochaines leçons :

```
CF (ré dorien — le laboratoire aime les modes de l08 M3 : pas de
sensible qui aimante, la ligne respire) :
D4:w F4:w E4:w D4:w G4:w F4:w A4:w G4:w F4:w E4:w D4:w
```

### 2. Les règles de la première espèce (la table de référence)

Au-dessus (ou au-dessous) du CF, une ronde par ronde :

| Règle | Détail | Le checker (§4.1.5) |
|---|---|---|
| **Verticalités** : consonances seulement | imparfaites (3, 6) en majorité ; parfaites (5, 8) aux ancrages | `species1.verticalities` |
| **Début** : parfaite | unisson, quinte ou octave (au-dessus) — le monde s'ouvre stable | `species1.opening` |
| **Fin** : octave ou unisson, approchée par mouvement contraire | la cadence du laboratoire : 2̂→1̂ contre 7̂→1̂ (ou l'inverse) — la formule clausulaire | `species1.cadence` |
| **Parallèles** : quintes et octaves interdites | ET les directes vers parfaite en mouvement direct (la « quinte cachée ») quand le soprano saute | `vl.parallel-*` + `cpt.hidden-fifths` |
| **Mouvement** : contraire dominant | ≥ 50 % contraire+oblique | `cpt.contrary-preference` |
| **La ligne elle-même** : une mélodie saine | conjoint dominant, les sauts récupérés (melody.leap-recovery — chez lui ici, poids 1.5), UN climax, pas de répétition immédiate | tout `melody.*` en profil strict |
| **Unisson** : interdit sauf début/fin | deux voix sur la même note = zéro indépendance | `species1.unison` |

<MusicExample id="premiere-espece" title="Première espèce sur le CF (contrepoint au-dessus)">
  CP : A4:w A4:w?  — non, répétition. Version travaillée :
  CP : A4:w D5:w C5:w B4:w B4:w? — non : B4 contre G4 = tierce ✓ mais
       répétition encore. La version FINALE, vérifiée verticalité par
       verticalité :
  CP : A4:w D5:w C5:w B4:w D5:w A4:w C5:w B4:w A4:w G4:w D5:w?
       — fin sur D5 contre D4 : octave ✓ mais approchée par saut direct.
       Dernière correction (la clausule) :
  CP : A4:w D5:w C5:w B4:w D5:w A4:w C5:w B4:w A4:w C#5:w D5:w
  Verticalités : 5-6-6-6-5-3-3-3-3-6-8 — imparfaites dominantes ✓,
  parfaites aux ancrages ✓. La clausule : C#5→D5 contre E4→D4 —
  le mouvement contraire vers l'octave, la sensible dorienne HAUSSÉE
  en cadence (la musica ficta : le laboratoire l'admet à la clausule,
  et c'est l'ancêtre direct de ta sensible de m01-l06). Le climax : D5,
  atteint trois fois ? — deux fois en route, la troisième conclut :
  acceptable en dorien, perfectible ; le rapport du produit te le
  dirait avec le même mot.
</MusicExample>

*(Le brouillon corrigé en direct ci-dessus est volontaire : la première espèce s'écrit ainsi — on pose, on vérifie, on répare. La mission te fera vivre exactement cette boucle, avec le LiveFeedback en juge de paix.)*

### 3. La méthode d'écriture (l'ordre des décisions)

```
1. LA FIN d'abord : la clausule est imposée (contraire vers 8/1) —
   écris les deux dernières notes avant tout
2. LE DÉBUT : la parfaite d'ouverture
3. LE CLIMAX : choisis SA position (les 2/3 — l'arche de m02-l05
   vaut pour une ligne de rondes) et SA note (souvent la plus haute
   consonance disponible contre le sommet du CF... ou contre son creux :
   le contraire, toujours)
4. RELIE : entre ces trois piliers, note à note — à chaque pas, liste
   les consonances possibles, élimine celles qui créent parallèles ou
   directes, choisis celle qui sert le contour (le contraire d'abord)
5. CHANTE les deux voix séparément (le test de l01) puis ensemble
```

C'est un puzzle à contraintes — et c'est exactement pour cela que le produit excelle à l'accompagner : le LiveFeedback (Flux A, §1.5) colore chaque verticalité en temps réel (consonance/dissonance, parallèle détecté au moment où tu poses la note) : la première espèce dans le piano roll du produit est peut-être la meilleure rencontre outil-pédagogie de tout le cursus.

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Écrire de gauche à droite sans plan | la fin impossible à cadencer | la clausule d'abord, le climax ensuite, relier enfin |
| Tout en tierces | le velours qui devient ombre (l01 §2) | trois parallèles consonantes max — le contraire reprend |
| La belle verticalité, la ligne laide | des sauts non récupérés pour attraper la « bonne note » | la ligne est une mélodie : melody.* juge aussi |
| Deux climax | l'arche indécise | UN sommet — comme toujours depuis m02-l05 |

### La mission (m04-e02, COUNTERPOINT — species 1)

Trois cantus firmi de la banque (dorien, éolien, ionien) : écris la première espèce au-dessus du premier, au-dessous du deuxième (les règles s'inversent en miroir — la basse cadence 5̂→1̂), au choix pour le troisième. Le checker species 1 au complet, profil `strict-counterpoint`, LiveFeedback actif. XP majoré : c'est l'exercice-fondation du module.

- [ ] Une ronde contre une ronde : le problème des verticalités à l'état pur
- [ ] Imparfaites en chair, parfaites aux ancrages, clausule en contraire
- [ ] La méthode : la fin, le début, le climax, puis relier
- [ ] Chaque voix chante seule — le juge final

<QuizBlock id="m04-l02-quiz" questions={5} />
<LessonFooter exercises={["m04-e02-first-species"]} />

---

## 46.4 LEÇON m04-l03 — « La deuxième espèce : le mouvement contre la tenue »

```mdx
---
id: m04-l03-deuxieme-espece
module: module-04-contrepoint
title: "La deuxième espèce : le mouvement contre la tenue"
estMinutes: 25
skills: { counterpoint: 1.0 }
---
```

### Pourquoi deux notes changent tout

Deux blanches contre chaque ronde du CF : le temps vient de naître. Avec lui, LA distinction qui gouverne tout le reste du module (et que tu pratiques depuis m01-l08 sans la nommer ainsi) : **le temps fort et le temps faible n'ont pas les mêmes lois**. La deuxième espèce isole ce problème unique : que peut-on se permettre quand on passe *entre* deux appuis ?

### 1. Les règles nouvelles (tout le reste hérite de l02)

| Position | Loi | Le sens |
|---|---|---|
| **Temps fort** (la 1re blanche, contre l'attaque du CF) | consonance obligatoire — les lois de la première espèce s'y appliquent intégralement | l'appui reste pur : la charpente |
| **Temps faible** (la 2e blanche) | consonance libre, OU **dissonance de passage** : approchée ET quittée par degré conjoint, même direction | la première dissonance légale de ton laboratoire — et c'est exactement la « note de passage » de m02-l08 §3 : sa définition est NÉE ici, dans cette espèce, il y a cinq siècles |
| Les parallèles | interdits de temps fort à temps fort AUSSI (la quinte « cachée par » le temps faible s'entend quand même : l'oreille relie les appuis) | `species2.strong-beat-parallels` — le checker qui saute une note |
| L'unisson | permis au temps faible (en passant) | le passage excuse presque tout |

<MusicExample id="deuxieme-espece" title="Deuxième espèce sur le même CF (extrait, mesures 1–5)">
  CF : D4:w        F4:w        E4:w        D4:w        G4:w
  CP : r:h A4:h  | D5:h C5:h | B4:h C5:h | D5:h A4:h | B4:h D5:h
  La levée d'un demi-temps (le départ en blanche après un demi-soupir :
  l'usage d'école — et l'anacrouse de m02-l09 a son ancêtre). Mesure 2 :
  C5 au temps faible contre F4 = quinte ✓ consonance libre. Mesure 3 :
  C5 contre E4 = sixte ✓. Cherche la dissonance de passage : il n'y en a
  pas encore — ajoutons-en une, mesure 4 réécrite :
  CP m.4 : D5:h C5:h → le C5 contre D4 = septième ✗ … non : conduite ?
  approché de D5 par degré ✓, quitté vers B4 par degré même direction ✓,
  temps faible ✓ — LA dissonance de passage légale : elle FILE entre
  deux consonances, elle ne s'installe pas.
</MusicExample>

### 2. Ce que l'espèce enseigne vraiment (les trois acquis)

1. **La hiérarchie métrique est une loi d'harmonie** : ce qui sonne à l'appui définit ce qu'on entend ; ce qui passe au faible colore — c'est le fondement de `strongBeatDegrees` (§19.4), de la friction de m02-l08, et de toute l'analyse que `detectChord` fait en pondérant par position (§8.5 : les poids métriques du moteur descendent de cette espèce en droite ligne) ;
2. **la dissonance est un mouvement, pas un état** : la passage n'existe que conduite — arrivée, direction, sortie (les trois colonnes de la table de m02-l08, qui est littéralement le tableau de bord de ce module) ;
3. **le contrepoint respire en levée** : le demi-soupir initial n'est pas une coquetterie — il désolidarise les deux voix dès la première seconde (l'oblique inaugural : l'indépendance affichée d'entrée).

### Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| La dissonance au temps fort | l'appui souillé — le checker species2 est sans appel | la dissonance PASSE au faible ; l'appui est de la première espèce |
| Le passage qui rebrousse | approché par degré, quitté par saut ou demi-tour : ce n'est plus un passage (c'est une broderie ratée — elle arrive en 3e espèce) | même direction, toujours |
| Les parallèles « cachés » par le temps faible | quintes d'appui à appui | le checker saute une note : fais pareil en vérifiant |
| Deux blanches = deux idées | la ligne qui zigzague au double de vitesse | la ligne reste UNE mélodie (arche unique) — elle a juste deux pas par enjambée |

### La mission (m04-e03, COUNTERPOINT — species 2)

Le même CF dorien qu'en l02 (la comparaison est le but : même partenaire, nouveau problème), deuxième espèce au-dessus puis au-dessous, **≥ 3 dissonances de passage** exigées et vérifiées une à une (`species2.passing-count` — la contrainte positive : l'espèce ne s'apprend pas en évitant la dissonance mais en la conduisant). Le rapport te montre tes passages sur le roll, colorés : la dissonance domestiquée, visible.

- [ ] Temps fort = première espèce ; temps faible = la liberté conduite
- [ ] La dissonance de passage : par degré, même direction, entre deux consonances — l'ancêtre de toute la table des étrangères
- [ ] Les parallèles se vérifient d'appui à appui
- [ ] La levée inaugurale : l'indépendance dès la première seconde

<QuizBlock id="m04-l03-quiz" questions={5} />
<LessonFooter exercises={["m04-e03-second-species"]} />

---

## 46.5 État d'ouverture du module

| Module 4 | Statut |
|---|---|
| Fondations | le contrat laboratoire→métier posé (l01), le profil `strict-counterpoint` dans son habitat, les checkers §4.1.5 enfin consommés — le seul module dont le moteur a précédé le contenu |
| l01–l03 | ✅ **3/12** — le dialogue, la première espèce (le puzzle des verticalités), la deuxième (la naissance du temps et de la dissonance conduite) |
| Fil rouge | chaque loi du laboratoire reliée à sa descendance moderne (parallèles→indépendance→planing ; passage→table des étrangères ; hiérarchie métrique→poids du moteur) : le musée est un atelier d'origines |
| Prochain lot | l04–l06 : la troisième espèce (quatre notes — la broderie et la cambiata rejoignent le passage), la quatrième (la syncope : le retard, l'espèce-reine — et l'ancêtre du sus4 bouclé), la cinquième (le fleuri : tout ensemble, le laboratoire au complet) |

---

**Point de confirmation.** Le laboratoire est ouvert, deux espèces sur cinq. Je poursuis avec le **lot l04–l06** — la troisième espèce (le mouvement fleuri : broderie, double broderie, cambiata — le catalogue des ornements naît ici), la quatrième (la syncope et le retard : la dissonance qui s'installe ENFIN sur le temps fort, préparée et résolue — l'espèce préférée de tous les professeurs, et l'origine du sus4 de m01-l17), et la cinquième (le contrepoint fleuri : la synthèse des quatre, la première « vraie musique » du laboratoire) ?