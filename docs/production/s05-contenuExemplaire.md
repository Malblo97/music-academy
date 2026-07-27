# SECTION 5 — CONTENU PÉDAGOGIQUE EXEMPLAIRE

Trois leçons rédigées intégralement au format cible (MDX de `packages/content`), puis trois exercices JSON conformes à `ExerciseSpec`. Ces leçons servent de **gabarit éditorial** : toute leçon future doit respecter cette densité et la structure Pourquoi / Comment / Quand / Erreurs / Alternatives.

Convention de notation textuelle utilisée partout dans le produit :
- Notes : `C4` = do central (MIDI 60). Durées : `w` ronde, `h` blanche, `q` noire, `e` croche, `s` double.
- Séquences : `C4:q D4:q E4:h` ; silences : `r:q` ; degrés : `1̂ 2̂ 3̂…` ; chiffrages : `Cm7`, `G7(b9)`, `V/vi`.

---

## 5.1 LEÇON — Module 1, Leçon 14 : « Tension et résolution : le moteur de toute musique »

```mdx
---
id: m01-l14-tension-resolution
module: module-01-fondamentaux
title: "Tension et résolution : le moteur de toute musique"
estMinutes: 25
skills: { harmony: 0.6, melody: 0.4 }
---
```

### Pourquoi cette leçon existe

Toute musique qui « fonctionne » raconte une seule chose : **un déséquilibre qui cherche son équilibre**. Une note instable veut aller quelque part ; une note stable est un lieu d'arrivée. Si tu comprends ce mécanisme, tu comprends pourquoi une mélodie semble « finie » ou « suspendue », pourquoi un accord « appelle » le suivant, et pourquoi certaines musiques de film te tiennent en haleine pendant trois minutes sur deux accords.

Sans cette notion, composer revient à aligner des notes qui ne se doivent rien. Avec elle, chaque note a une **intention**.

### 1. La hiérarchie de stabilité des degrés

Dans une tonalité, les sept degrés ne sont pas égaux. Voici leur hiérarchie, à mémoriser comme tes tables de multiplication :

| Degré | Nom | Stabilité | Tendance naturelle |
|---|---|---|---|
| 1̂ | Tonique | ●●●● maximale | aucune — c'est la maison |
| 3̂ | Médiante | ●●● stable | colore (majeur/mineur), repos possible |
| 5̂ | Dominante (note) | ●●● stable | repos possible, mais « en l'air » |
| 2̂ | Sus-tonique | ●● instable | descend vers 1̂ ou monte vers 3̂ |
| 6̂ | Sus-dominante | ●● instable | descend vers 5̂ |
| 4̂ | Sous-dominante | ● très instable | **descend vers 3̂** (attraction forte) |
| 7̂ | **Sensible** | ○ instable maximale | **monte vers 1̂** (attraction maximale) |

Les deux attractions les plus fortes du système tonal : **7̂→1̂** (demi-ton ascendant) et **4̂→3̂** (demi-ton descendant). Retiens-les ensemble : elles forment le **triton** de l'accord de dominante 7e — on y revient au §3.

<MusicExample id="stable-vs-instable" title="Écoute la différence">
  A) C4:q E4:q G4:q C5:h        — degrés 1̂ 3̂ 5̂ 1̂ : tout est stable, rien ne « tire »
  B) C4:q F4:q B4:q C5:h        — 1̂ 4̂ 7̂ 1̂ : le F et le B créent une aimantation vers l'arrivée
</MusicExample>

Joue les deux sur ton clavier. Dans B, arrête-toi sur `B4` sans jouer le `C5` : l'inconfort que tu ressens **est** la tension. Ce n'est pas une métaphore, c'est le matériau de ton métier.

### 2. Comment doser la tension dans une mélodie

Quatre leviers, du plus doux au plus fort :

```
NIVEAU DE TENSION MÉLODIQUE
faible ──────────────────────────────────────────► forte

degrés stables      degrés instables     note étrangère      chromatisme
sur temps forts     sur temps forts      à l'accord           hors tonalité
(1̂ 3̂ 5̂)            (2̂ 4̂ 6̂ 7̂)           (appoggiature…)      (résolution requise)
```

**Règle de dosage** (celle que vérifie l'analyseur, `melody.tension-placement`) : une note instable est un *investissement* — elle doit être *remboursée* par une résolution. Plus la tension est forte, plus la résolution doit être proche et claire.

- Tension faible (2̂, 6̂) : peut flotter plusieurs temps avant résolution.
- Tension forte (7̂, 4̂, appoggiature) : résolution attendue dans le temps ou le temps suivant.
- Chromatisme : résolution **immédiate** par demi-ton, sauf effet volontaire (voir Alternatives).

<MusicExample id="dette-remboursee" title="Une dette bien remboursée">
  Sol majeur : D5:q C5:e B4:e A4:q G4:q  |  F#4:h G4:h
  La phrase descend (détente), puis F#4 (7̂, tension maximale) → G4 (1̂) : conclusion parfaite.
</MusicExample>

### 3. La tension harmonique : le triton et sa résolution

L'accord `G7` en do majeur contient `G B D F`. Isole `B` (7̂) et `F` (4̂) : un **triton**, l'intervalle le plus instable du système. Sa résolution est doublement aimantée :

```
F4 ──── demi-ton descendant ────► E4   (4̂ → 3̂)
B3 ──── demi-ton ascendant  ────► C4   (7̂ → 1̂)

G7 ────────────────────────────► C     la cadence parfaite n'est pas une
                                        convention : c'est de la physique
                                        des attractions
```

**Quand tu écris `V7 → I`, ces deux résolutions sont ta priorité absolue de voice leading.** Tout le reste (doubler la quinte, omettre la quinte de V7…) se négocie ; le triton, non — en style classique du moins.

### 4. La courbe de tension d'une phrase : penser en arche

Une phrase réussie ressemble rarement à une ligne plate. Le gabarit le plus robuste depuis quatre siècles :

```
tension
  ▲
  │            ╭──── climax (souvent aux 2/3 de la phrase)
  │        ╭───╯    ╲
  │    ╭───╯          ╲
  │╭───╯                ╲──╮
  └┴───────────────────────┴──► temps
   départ                 résolution
   stable                 stable
```

C'est exactement ce que mesure `tensionCurve()` dans tes exercices : la corrélation entre ta courbe et le gabarit du *mood* demandé. Un thème héroïque a un climax haut et tardif ; une berceuse, une arche presque plate ; un thriller, des pics répétés **jamais totalement résolus**.

### 5. Quand utiliser quoi (arbre de décision)

<DecisionTree id="tension-usage">
Quel effet cherches-tu ?
├─ Conclusion ferme (fin de thème, fin de scène)
│    → phrase finissant 7̂→1̂ ou 2̂→1̂, harmonie V7→I, temps fort
├─ Suspension (la scène continue, question sans réponse)
│    → finir sur 5̂ ou 2̂ mélodique, harmonie en demi-cadence (…→V)
├─ Fausse détente (le danger n'est pas parti)
│    → préparer V7 puis résoudre sur vi (cadence rompue)
└─ Tension permanente (thriller, drone)
     → ostinato sur degrés instables, résolutions systématiquement évitées,
       pédale de dominante sous harmonies changeantes
</DecisionTree>

### 6. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Tout stable | mélodie « jolie mais plate », rien ne se passe | place 4̂ ou 7̂ sur un temps fort avant ta cadence |
| Tout instable | fatigue de l'auditeur, aucun repère | ancre chaque phrase sur 1̂/3̂/5̂ au départ et à l'arrivée |
| Tension non remboursée | sensation de « faute » sans savoir pourquoi | toute 7̂ exposée doit atteindre 1̂ (même après détour) |
| Climax au début | la phrase s'essouffle | garde ta note la plus haute/tendue pour les 2/3 |
| Double climax égal | la phrase hésite | un seul sommet ; le second doit être plus haut ou supprimé |

### 7. Alternatives et styles : quand enfreindre

- **Jazz** : les tensions (9, 11, 13) sont des couleurs *habitables* — on ne les « résout » pas systématiquement. La dette devient un mode de vie.
- **Musique modale de film** (fantasy, folk) : sans sensible (mode dorien, éolien sans 7̂ haussée), l'attraction 7̂→1̂ disparaît ; la gravité vient alors du **mouvement de basse** et des pédales.
- **Thriller / horreur** : la non-résolution est le langage. Tu dois d'abord maîtriser la résolution pour que son évitement soit un choix, pas un accident.

### Récapitulatif

- [ ] Je connais la hiérarchie de stabilité des 7 degrés
- [ ] Je sais que 7̂→1̂ et 4̂→3̂ sont les deux attractions maîtresses (triton de V7)
- [ ] Je pense chaque phrase comme une arche : stable → climax ≈ 2/3 → stable
- [ ] Toute tension forte a une résolution planifiée — ou son évitement est un choix stylistique conscient

<QuizBlock id="m01-l14-quiz" questions={5} />
<LessonFooter exercises={["m01-e22-tension-arch", "m01-e23-cadence-lab"]} />

---

## 5.2 LEÇON — Module 5, Fiche 12 : « Le cor : l'âme de l'orchestre »

```mdx
---
id: m05-l12-french-horn
module: module-05-orchestration
title: "Le cor : l'âme de l'orchestre"
estMinutes: 30
skills: { orchestration: 1.0 }
---
```

### Carte d'identité

<InstrumentSheet id="french-horn" />
*(le composant rend la tessiture visuelle depuis la base music-core — les valeurs ci-dessous sont la source)*

| Propriété | Valeur |
|---|---|
| Famille | Cuivres (mais l'hybride officiel : il siège aussi avec les bois — quintette à vent) |
| Tessiture praticable | `B1`–`F5` (sons écrits en Fa : transposition à la quinte supérieure) |
| Registre expressif (sweet spot) | `C3`–`C5` |
| Agilité | modérée (4/10) — pas un instrument de traits rapides |
| Tenue | excellente — le roi des notes longues et des pédales |
| Puissance | pp très doux (2/10) → ff héroïque (9/10) : l'amplitude dynamique la plus large des cuivres |

### Pourquoi le cor est irremplaçable

Le cor est le **liant** de l'orchestre. Sa sonorité — cuivrée mais ronde, puissante mais fondue — lui permet de coller aux cordes, aux bois ET aux cuivres. Aucun autre instrument ne fait ça. C'est pour cela qu'on écrit presque toujours pour 4 cors quand 2 trompettes suffisent : ils remplissent le milieu du spectre orchestral, là où l'harmonie vit.

Émotionnellement, le cor porte trois archétypes profondément câblés chez l'auditeur :
1. **La noblesse / l'héroïsme** (registre médium-aigu, f, intervalles de 4te/5te ascendantes)
2. **L'appel / le lointain** (héritage du cor de chasse : sonneries, espace, nature)
3. **La chaleur mélancolique** (registre médium, p, lignes conjointes — la nostalgie orchestrale par excellence)

### Couleur par registre

```
B1 ─────── C3 ─────────────── C5 ────── F5
│  GRAVE   │      MÉDIUM       │  AIGU   │
│ sombre,  │ noble, chaud,     │ brillant,│
│ pédales, │ fondu — 90% de    │ tendu,  │
│ instable │ ton écriture      │ héroïque│
│ en pp    │ vit ici           │ FATIGANT│
```

**Le grave** (`B1`–`B2`) : couleur de menace sourde, superbe en pédale sous des cordes graves. Risqué en pp (justesse difficile), lent à parler.
**Le médium** (`C3`–`C5`) : tout est possible — mélodie, contrechant, tenues d'harmonie, tapis.
**L'aigu** (`C5`–`F5`) : éclatant et périlleux. Physiologiquement épuisant : ne jamais y maintenir un corniste plus de quelques mesures, et jamais après un long passage déjà aigu. Un aigu de cor doit être **préparé** (approche mélodique) et **récompensé** (repos après).

### Rôles typiques (par ordre de fréquence réelle en musique de film)

| Rôle | Comment l'écrire | Exemple textuel |
|---|---|---|
| **Tapis harmonique** | 2–4 cors, tenues en position serrée, médium, p–mp | `[C3+E3+G3+C4]:w` sous des cordes |
| **Contrechant** | 1–2 cors à l'unisson, ligne conjointe médium, mf | répond à la mélodie de violons dans les creux |
| **Mélodie héroïque** | 2–4 cors à l'unisson (jamais 1 seul en ff : trop fragile), f | `C4:q F4:q G4:q C5:h.` — 4te et 5te ascendantes |
| **Appels / signaux** | quintes et octaves, rythme pointé | `G3:e. G3:s G3:e G3:e C4:h` |
| **Pédale de tension** | grave, tenue, cresc. possible | `F2:w~F2:w~F2:w` sous harmonie mouvante |
| **Rip / glissando** | montée rapide vers note cible, ff — effet « décollage » | signalé `rip→C5` |

### Associations : avec qui le marier

| Combinaison | Résultat | Usage |
|---|---|---|
| Cors + violoncelles (unisson) | LA doublure la plus chaude de l'orchestre | thèmes lyriques, romance, noblesse |
| Cors + bassons | fondu total, renforce le médium-grave | tapis discrets |
| Cors + trombones | mur de cuivres nobles | chorals, puissance solennelle |
| Cors (tapis) + bois (mélodie) | le classique viennois | équilibre naturel, le cor ne couvre pas |
| Cors + trompettes à l'unisson **ff** | ⚠️ la trompette avale le cor | préférer octaves ou registres séparés |

### Quand l'utiliser / quand l'éviter

**Utilise le cor quand** : tu as besoin de chaleur dans le médium ; ta mélodie évoque noblesse, nature, nostalgie ; il faut lier cordes et cuivres ; tu veux un crescendo long sur une tenue (personne ne le fait mieux).

**Évite le cor quand** : il te faut de l'agilité (traits rapides → bois ou trompettes) ; une attaque percussive et précise (l'attaque du cor est légèrement « ronde », il parle avec ~30 ms de flou — c'est sa beauté et sa limite) ; un aigu prolongé ; du pianissimo dans l'extrême grave exposé.

### Erreurs fréquentes du compositeur (celles que détecte l'analyseur)

| Erreur | Règle | Pourquoi c'est un problème |
|---|---|---|
| Traits en doubles croches rapides | `orch.horn-agility` | injouable proprement ; l'attaque ronde du cor floute tout |
| Aigu tenu > 4 mesures | `orch.horn-endurance` | fatigue réelle de l'instrumentiste ; en samples tu ne l'entends pas, en session tu le paies |
| 1 seul cor mélodie en ff contre tutti | `orch.balance` | puissance 9/10 mais un seul contre trente : noyé |
| Cor grave pp exposé | `orch.register-color` | justesse hasardeuse, timbre instable |
| Oublier la transposition en Fa (partition papier) | — | à l'export partition (V1), le produit transposera automatiquement |

### Alternatives

Pas de cor sous la main (banque limitée) ? Approximations par rôle : tapis médium → altos + bassons ; héroïsme → trombones (plus droit, moins « âme ») ; appel lointain → trompette bouchée + reverb longue (couleur différente mais fonction voisine). Aucune n'a le fondu du cor — c'est précisément pourquoi il existe.

### Récapitulatif express

- [ ] Médium `C3`–`C5` = 90 % de mon écriture de cor
- [ ] Mélodie ff = cors **à l'unisson par 2 ou 4**, jamais seul
- [ ] Aigu = préparé, bref, suivi de repos
- [ ] Doublure magique : cors + violoncelles
- [ ] Le cor lie les familles — c'est son super-pouvoir

<QuizBlock id="m05-l12-quiz" questions={6} />
<LessonFooter exercises={["m05-e08-horn-roles"]} />

---

## 5.3 LEÇON — Module 9, Leçon 3 : « Néo-noir : composer l'ambiguïté »

```mdx
---
id: m09-l03-neo-noir
module: module-09-film-genres
title: "Néo-noir : composer l'ambiguïté"
estMinutes: 35
skills: { harmony: 0.4, sound_design: 0.3, orchestration: 0.3 }
---
```

*Conformément à la charte du produit : analyse de principes uniquement — aucune partition ni extrait d'œuvre protégée n'est reproduit.*

### Pourquoi le néo-noir a son propre langage

Le film noir raconte des personnages moralement ambigus dans des villes nocturnes. Sa musique doit donc dire deux choses à la fois : *séduction* et *menace*. Le langage qui fait ça naturellement existe déjà : **l'harmonie de jazz déplacée dans un contexte orchestral et électronique sombre**. Le néo-noir moderne y ajoute les synthés analogiques, les drones et l'espace (reverbs longues).

Principe cardinal du genre : **ne jamais résoudre complètement**. La leçon 5.1 t'a appris à rembourser tes dettes de tension ; ici, tu apprends à les *refinancer indéfiniment*.

### 1. Le vocabulaire harmonique

| Outil | Construction | Effet |
|---|---|---|
| Accords mineurs enrichis | `m9`, `m11`, `m(maj7)` | tristesse sophistiquée ; le m(maj7) = l'ambiguïté incarnée (mineur + sensible) |
| Mouvement chromatique de basse | basse descend par ½ tons sous harmonies changeantes | glissement inexorable, fatalité |
| Substitution tritonique | `subV7(#11)` au lieu de V7 | la cadence devient un couloir sombre au lieu d'une porte |
| Accords à quartes | empilement `C-F-Bb-Eb` | ni majeur ni mineur : suspension morale |
| Emprunts sans confirmation | ♭VI, ♭II passés sans cadence | le sol se dérobe |
| Pédale + harmonie flottante | basse fixe, accords qui dérivent au-dessus | obsession, surveillance |

Progression-type du genre (à jouer, puis à varier) :

```
| Cm9        | Ab maj7#11  | Dm7b5      | G7b9→ Db7#11 |
| Cm9        | ...          la substitution tritonique remplace
                            la résolution attendue : on retombe sur Cm9
                            comme on retombe dans la nuit.
```

Note la boucle : la progression **revient** au lieu d'aboutir. C'est la structure émotionnelle du genre — l'enquête qui tourne en rond.

### 2. Instrumentation typique

```
COUCHE            INSTRUMENTS                      RÔLE
─────────────────────────────────────────────────────────────────
Fondation         contrebasses pizz OU sub synth   pouls lent, chaleur sombre
Nappe             cordes con sordino, divisi       brume harmonique
                  + pad analogique sombre          (layering leçon M6)
Voix principale   trompette bouchée, sax ténor,    la solitude qui parle
                  OU violoncelle solo              (UNE voix, jamais un tutti)
Ponctuation       piano feutré, notes isolées      gouttes dans la nuit
                  vibraphone, harpe grave
Texture           drone grave, vinyl crackle,      le temps qui s'épaissit
                  reverb longue (4–8 s)
Tension           cluster de cordes ppp cresc.,    la menace sous la surface
                  braam étouffé (rare, dosé)
```

**Règle d'or d'orchestration du genre** : *de l'espace*. Le néo-noir est une musique de **soustraction** — chaque élément doit être entouré de silence ou de brume. Si ta `densityMap` s'allume, tu as déjà perdu le genre.

### 3. Tempo, rythme, forme

- Tempo : 50–75 BPM, souvent rubato ou pouls à peine perceptible.
- Rythme : le swing fantôme — croches légèrement inégales même hors jazz ; syncopes douces ; **jamais** de grille rythmique affirmée (dès que ça « groove », on bascule dans le polar d'action).
- Forme : boucles harmoniques de 4–8 mesures qui reviennent, variées par la texture plus que par l'harmonie. Le développement est **timbral** (on ajoute/retire des couches) plus que thématique.

### 4. Construction émotionnelle d'une scène type

```
   scène : filature nocturne, 2 min
   tension
     ▲                                    ╭─ braam étouffé, cluster
     │                          ╭─────────╯   (le danger se montre)
     │        ╭─ +trompette ────╯
     │  ╭─────╯  bouchée (la voix)          ╭─ retour boucle initiale,
     │──╯ drone + pizz                      │  MOINS la trompette :
     │  (la ville)                          ╰─ non-résolution = fin
     └──────────────────────────────────────────► temps
```

L'arche de la leçon 5.1 existe toujours — mais son sommet est un *événement de texture*, et sa « résolution » est un **retour amputé** : on finit plus vide qu'on a commencé. C'est le gabarit `neo-noir` que `tensionCurve()` utilise pour le craft de tes exercices.

### 5. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Résoudre V→i franchement | ça devient une ballade triste | subV, ou retour direct au i sans dominante |
| Trop de couches | brume → boue | max 3 couches actives + 1 événement ; coupe |
| Mélodie trop chantante | on quitte l'ambiguïté | fragments courts, phrases inachevées, silences |
| Reverb sur tout | perte totale de lisibilité | la fondation (basse) reste sèche ; la reverb est pour les voix et textures |
| Swing appuyé | pastiche jazz-club | l'inégalité rythmique doit rester subliminale |

### 6. Alternatives à l'intérieur du genre

- **Néo-noir électronique** : remplacer cordes par pads analogiques, trompette par lead mono filtré — mêmes fonctions, autre époque.
- **Néo-noir orchestral** : sans synthés — la brume vient des cordes divisi con sordino et des bois graves.
- Frontières voisines : + tempo et grille rythmique → thriller ; + résolutions et chaleur → drame ; + dissonance non-fonctionnelle → horreur psychologique. Savoir où est la frontière te permet de la franchir *exprès*.

<QuizBlock id="m09-l03-quiz" questions={5} />
<LessonFooter exercises={["m09-e05-noir-progression", "m09-e06-noir-scene"]} />

---

## 5.4 EXERCICES AU FORMAT JSON (`ExerciseSpec` v1)

### Exercice A — Mélodie triste en mineur (Module 2, débutant)

```json
{
  "id": "m02-e04-sad-melody-minor",
  "title": "Compose une mélodie triste en la mineur",
  "kind": "MELODY_COMPOSE",
  "difficulty": 2,
  "xpReward": 60,
  "skills": { "MELODY": 0.8, "HARMONY": 0.2 },
  "spec": {
    "version": 1,
    "prompt": "Compose une mélodie de 8 mesures en la mineur, à 4/4, tempo 66. Objectif : tristesse retenue, pas mélodrame. Consignes : privilégie le mouvement conjoint et les lignes descendantes ; place ton point culminant vers la mesure 5 ou 6 ; termine sur la tonique (A) avec une vraie conclusion. Joue-la d'abord sur ton clavier avant de la saisir.",
    "given": {
      "key": { "tonic": 9, "mode": "minor" }
    },
    "constraints": {
      "key": { "tonic": 9, "mode": "minor" },
      "meter": "4/4",
      "lengthBars": [8, 8],
      "noteRange": [55, 79],
      "maxLeap": 7,
      "requiredCadence": "perfect",
      "mustEndOnDegrees": [1],
      "minConjunctRatio": 0.6
    },
    "styleProfile": {
      "id": "romantic-film",
      "targetMood": "sad",
      "ruleWeights": {
        "melody.leap-recovery": 1.0,
        "melody.out-of-key": 0.7,
        "melody.monotony": 0.8,
        "melody.tension-placement": 1.0,
        "counterpoint.*": 0.0
      }
    },
    "rubric": { "correctness": 40, "constraints": 30, "craft": 30 }
  }
}
```

*(`melody.out-of-key` à 0.7 et non 1.0 : un chromatisme expressif bien résolu est légitime dans ce style — la règle avertit sans matraquer.)*

### Exercice B — Harmonisation néo-noir (Module 9, intermédiaire)

```json
{
  "id": "m09-e05-noir-progression",
  "title": "Réharmonise cette boucle en néo-noir",
  "kind": "HARMONY_PROGRESSION",
  "difficulty": 6,
  "xpReward": 110,
  "skills": { "HARMONY": 0.9, "SOUND_DESIGN": 0.1 },
  "spec": {
    "version": 1,
    "prompt": "Voici une boucle de 4 accords banale : Am – F – C – G. Transforme-la en boucle néo-noir de 8 accords (2 par mesure ou 1 par mesure, à toi de choisir) : enrichis chaque accord (m9, maj7#11, 7b9...), introduis au moins une substitution tritonique OU un mouvement chromatique de basse, et fais en sorte que la boucle REVIENNE sur son premier accord sans cadence V–i franche. Écris des voicings complets à 4 ou 5 voix, main gauche + main droite.",
    "given": {
      "chords": [
        { "root": 9, "quality": "min", "start": 0, "duration": 1920 },
        { "root": 5, "quality": "maj", "start": 1920, "duration": 1920 },
        { "root": 0, "quality": "maj", "start": 3840, "duration": 1920 },
        { "root": 7, "quality": "maj", "start": 5760, "duration": 1920 }
      ],
      "key": { "tonic": 9, "mode": "minor" }
    },
    "constraints": {
      "meter": "4/4",
      "lengthBars": [4, 8],
      "minVoices": 4,
      "maxVoices": 5,
      "mustInclude": ["extendedChord>=4", "tritoneSubOrChromaticBass"],
      "forbiddenCadences": ["perfect"],
      "mustLoop": true
    },
    "styleProfile": {
      "id": "neo-noir",
      "targetMood": "ambiguous-dark",
      "ruleWeights": {
        "voiceLeading.parallel-fifths": 0.3,
        "voiceLeading.spacing": 1.0,
        "voiceLeading.resolution": 0.4,
        "harmony.unresolved-tension": 0.0,
        "harmony.voice-leading-smoothness": 1.5
      }
    },
    "rubric": { "correctness": 30, "constraints": 40, "craft": 30 }
  }
}
```

*(Noter l'inversion des valeurs par rapport au conservatoire : `resolution` presque désactivée, `unresolved-tension` à 0 — la non-résolution est le but — et la fluidité du voice leading surpondérée à 1.5 : dans ce style lent et exposé, chaque voix qui saute s'entend.)*

### Exercice C — Orchestration d'un thème héroïque (Module 5/7, avancé)

```json
{
  "id": "m05-e08-horn-roles",
  "title": "Orchestre ce thème héroïque : 3 plans, zéro surcharge",
  "kind": "ORCHESTRATE",
  "difficulty": 7,
  "xpReward": 140,
  "skills": { "ORCHESTRATION": 1.0 },
  "spec": {
    "version": 1,
    "prompt": "Voici un thème héroïque de 8 mesures (fourni en Fa majeur, export MIDI disponible). Orchestre-le en 3 plans distincts : (1) mélodie confiée aux cors — décide combien et pourquoi ; (2) un tapis harmonique qui ne masque pas la mélodie ; (3) une basse claire. Optionnel : un contrechant dans les respirations du thème. Contrainte de sobriété : 6 parties instrumentales maximum. L'analyseur vérifiera registres, équilibre des puissances et masquage.",
    "given": {
      "notesRef": "assets/m05-e08-theme.json",
      "key": { "tonic": 5, "mode": "major" }
    },
    "constraints": {
      "meter": "4/4",
      "lengthBars": [8, 8],
      "instrumentPool": [
        "french-horn", "trumpet", "trombone", "tuba",
        "violin-1", "violin-2", "viola", "cello", "double-bass",
        "flute", "oboe", "clarinet", "bassoon", "timpani"
      ],
      "maxSimultaneousParts": 6,
      "requiredRoles": ["melody", "harmony", "bass"],
      "melodyInstrumentFamily": "brass"
    },
    "styleProfile": {
      "id": "epic-film",
      "targetMood": "heroic",
      "ruleWeights": {
        "orch.range-violation": 2.0,
        "orch.balance": 1.5,
        "orch.masking": 1.5,
        "orch.horn-endurance": 1.0,
        "orch.density-overload": 1.5,
        "voiceLeading.parallel-fifths": 0.1
      }
    },
    "rubric": { "correctness": 45, "constraints": 25, "craft": 30 }
  }
}
```

---

## 5.5 Ce que ces exemples établissent (charte éditoriale)

| Standard | Vérifié dans les 3 leçons |
|---|---|
| Pourquoi / Comment / Quand / Erreurs / Alternatives | structure explicite de chaque leçon |
| Tout exemple est jouable | `MusicExample` = notes + ▶ ; jamais de théorie sans son |
| Le cours cite le moteur | règles nommées (`melody.tension-placement`, `orch.horn-endurance`) = les mêmes IDs que le feedback |
| Tableaux + arbres + schémas ASCII | présents, conformes au brief |
| Zéro reproduction protégée | Module 9 : principes, jamais d'extraits |
| Les specs JSON prouvent le `styleProfile` | mêmes règles, trois pondérations radicalement différentes selon le style |

Volumétrie cible pour le contenu complet (estimation d'équipe) : **~180 leçons** sur les 12 modules (M1 : 25, M2 : 15, M3 : 18, M4 : 12, M5 : 35 fiches, M6 : 15, M7 : 10, M8 : 15, M9 : 14, M10 : 15, M11 : 8, M12 : transversal), **~400 exercices** dont ~140 rédigés à la main et le reste généré par templates validés.

---

**Point de confirmation.** Dernière section au programme : la **Roadmap MVP → V1** (jalons, découpage des sprints, périmètre exact du MVP, critères de sortie, risques et ordre de construction recommandé — par quoi commencer concrètement dès la semaine 1). Je conclus avec ça ?