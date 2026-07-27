# SECTION 35 — MODULE 6 : SOUND DESIGN HYBRIDE — OUVERTURE

## 35.1 Positionnement — et la décision de conception qui conditionne tout

Même exigence d'honnêteté qu'en §30.1 : **le produit n'analyse pas d'audio** (§1.6). Comment enseigner et corriger du sound design, alors ? Réponse : par le **modèle de couches déclaratif** — le Hybrid Sound Design Layering du brief (feature n° 5) devient un éditeur où l'élève décrit chaque couche par ses paramètres, et le moteur raisonne sur le modèle. Ce n'est pas un pis-aller : c'est la pédagogie elle-même — *le débutant échoue en sound design parce qu'il ne sait pas ce que chaque couche fait ni où elle vit ; le forcer à le déclarer EST la leçon*.

```typescript
// @ma/music-core — le modèle de couche (extension de types actée)
export interface Layer {
  id: string;
  role: "sub" | "body" | "top" | "texture" | "movement" | "fx" | "melodic";
  band: { low: number; high: number };      // Hz — la bande UTILE déclarée
  source: string;                            // "analog-pad", "granular", "rendered-brass"…
  envelope: { a: number; d: number; s: number; r: number };  // ms/ms/0-1/ms
  level: number;                             // dB relatif (0 = référence du stack)
  width: number;                             // 0 (mono) .. 1 (très large)
  pan: number;                               // -1..1
  sends: { reverb: number; delay: number };  // 0..1
  motion?: { type: "lfo"|"env"|"automation"; target: string; rateHz?: number };
  sidechainedBy?: string;                    // id d'une autre couche
  notes?: Note[];                            // si la couche est jouée (MIDI)
}
export interface LayerStack { layers: Layer[]; tempoBpm: number; key?: KeyContext }
```

Le kind `LAYERING` (§2.2) soumet un `LayerStack` ; les exercices contraignent rôles, bandes, mouvements. Et les **règles `sd.*`** promises en §7.9 entrent au registre :

| Règle | Sévérité | Détecte | Pédagogie (résumé) |
|---|---|---|---|
| `sd.sub-conflict` | error | ≥ 2 couches dont la bande utile descend sous 90 Hz | le sub veut être SEUL — deux graves = la boue en phase aléatoire (l'`orch.low-interval-limit` du monde synthétique) |
| `sd.sub-width` | error | couche à bande < 120 Hz avec `width > 0.2` | le grave large s'annule en mono et floute partout : le sub est MONO, toujours |
| `sd.band-void` / `sd.band-pileup` | suggestion / warning | une bande du spectre vide (le trou) ou > 3 couches empilées (la bouillie) | la `densityMap` fréquentielle : la puissance vient de la couverture, pas de l'empilement (m09-l02 §3, version Hz) |
| `sd.static-stack` | suggestion | aucune couche ne porte de `motion` sur ≥ 8 mesures | un stack sans mouvement est un accord d'orgue : le synthétique vit par la modulation (l02) |
| `sd.wash-out` | warning | `sends.reverb > 0.5` sur la couche `sub`/`body` principale | la fondation reste sèche — la règle de m09-l03 §5, généralisée |
| `sd.role-coverage` | suggestion | pas de `sub` ou pas de `top` déclaré | un trou de rôle n'est pas une faute, mais est signalé (jumeau d'`orch.role-coverage`) |

Prérequis : M1–M2 ; M10 l04/l10 recommandés (CC et Render — les deux ponts). Terrain : les leçons donnent les recettes en paramètres génériques (tout synthé les possède), les missions s'exécutent dans Cubase avec les instruments inclus ou les tiens.

## 35.2 Les 15 leçons du Module 6

| # | id | Titre | Couvre (brief) | min |
|---|---|---|---|---|
| 1 | m06-l01 | Le son fabriqué : oscillateurs, filtres, ADSR | synthèse de base, ADSR | 25 |
| 2 | m06-l02 | La modulation : ce qui bouge est vivant | LFO, enveloppes, modulation | 25 |
| 3 | m06-l03 | Le spectre et la place : penser en couches | layering, bandes, rôles | 25 |
| 4 | m06-l04 | Pads : les cinq familles | pads ambient/analog/digital/choir/hybrid | 30 |
| 5 | m06-l05 | Textures, atmosphères, drones | textures, drones | 25 |
| 6 | m06-l06 | Les basses : sub, hybrid — la loi du grave | basses sub/hybrid | 25 |
| 7 | m06-l07 | Keys : Rhodes, FM, lo-fi | keys | 20 |
| 8 | m06-l08 | Leads : mono, poly, supersaw | synth leads | 25 |
| 9 | m06-l09 | Plucks et arps : le mouvement écrit | pluck, arps | 25 |
| 10 | m06-l10 | FX cinéma I : risers, impacts, braams | FX | 30 |
| 11 | m06-l11 | FX cinéma II : reverse, granular — le son comme matière | reverse, granular | 25 |
| 12 | m06-l12 | L'espace : reverb, delay, largeur | reverb, delay, panoramique, stéréo | 25 |
| 13 | m06-l13 | La tenue du son : saturation, compression, sidechain | saturation, compression, sidechain | 25 |
| 14 | m06-l14 | L'hybride : marier le synthétique et l'orchestre | mélange avec orchestre | 30 |
| 15 | m06-l15 | Synthèse : la scène hybride complète | tout — capstone LAYERING | 35 |

Structure en trois actes : **l01–l03 les fondamentaux** (comment un son se fabrique, bouge, et trouve sa place), **l04–l11 le bestiaire** (chaque élément du brief : rôle, recette, mariage), **l12–l15 l'assemblage** (l'espace, la dynamique, l'hybride, le capstone).

---

## 35.3 LEÇON m06-l01 — « Le son fabriqué : oscillateurs, filtres, ADSR »

```mdx
---
id: m06-l01-synthese
module: module-06-sound-design
title: "Le son fabriqué : oscillateurs, filtres, ADSR"
estMinutes: 25
skills: { sound_design: 1.0 }
---
```

### Pourquoi apprendre la synthèse quand on a des presets

Parce qu'un preset est une réponse à la question de quelqu'un d'autre. Tant que tu ne sais pas *lire* un son — d'où vient sa matière, ce qui le sculpte, ce qui dessine son existence dans le temps — tu passes ta vie à chercher (la demi-heure des quarante pads, m10-l06). Trois notions suffisent à lire 90 % des synthés : la source, le sculpteur, l'enveloppe. Cette leçon les installe ; tout le bestiaire (l04–l11) parlera cette langue.

### 1. L'oscillateur : la matière première

L'oscillateur produit une onde répétée — la hauteur vient de sa vitesse, le **timbre de sa forme**. Les quatre formes canoniques, à écouter côte à côte (la mission le fait faire, une octave tenue chacune) :

| Forme | Contenu harmonique | Caractère | Territoire |
|---|---|---|---|
| **Sinus** | la fondamentale seule — rien d'autre | pur, rond, invisible | LE sub (l06), les cloches douces |
| **Triangle** | harmoniques impaires faibles | doux, flûté | subs avec un peu de présence, nappes discrètes |
| **Dent de scie (saw)** | TOUTES les harmoniques, fortes | riche, cuivré, plein | la matière universelle : pads, leads, cordes synthétiques |
| **Carré / pulse** | harmoniques impaires fortes | creux, boisé, « clarinette électrique » | basses qui grognent, leads rétro ; la largeur d'impulsion (PW) module le creux |

Deux oscillateurs légèrement **désaccordés** (detune ± quelques cents) créent le battement — l'épaisseur vivante qui fait le son « analogique ». Retiens l'équation : *saw + detune = 80 % des pads du cinéma* (l04 le déclinera).

### 2. Le filtre : le sculpteur

Le filtre retire des fréquences — c'est la soustraction qui fait le son (le parallèle avec l'EQ soustractif de m10-l08 n'est pas un hasard : même philosophie, ici en instrument). Le vocabulaire minimal :

```
TYPE :      low-pass (coupe le haut) = 90 % de l'usage — plus tu fermes,
            plus le son s'assombrit ; high-pass (coupe le bas) = nettoyer
            la place du sub (l03 !) ; band-pass = le son "téléphone/radio"
CUTOFF :    LA poignée la plus expressive de tout le synthétiseur —
            ouvrir/fermer le cutoff, c'est le crescendo TIMBRAL
            (le CC1 des cordes a son jumeau : beaucoup de patchs mappent
            le cutoff sur la molette — m10-l04 s'applique tel quel)
RÉSONANCE : le sifflement au bord de la coupe — un peu = de la présence,
            beaucoup = le "wow" acide, trop = l'auto-oscillation
```

### 3. L'ADSR : le dessin de l'existence

L'enveloppe ADSR décrit comment le son naît, vit et meurt à chaque note — les quatre paramètres du modèle `Layer.envelope`, et le vocabulaire commun de tout le module :

```
niveau
  ▲    A         D
  │   ╱ ╲______S______
  │  ╱                 ╲ R
  └─┴──────────────────┴───► temps
   note ON            note OFF

A (attack)  : le temps de naissance — 0 ms = percussif, 2 s = la nappe
              qui se lève
D (decay)   : la retombée initiale vers…
S (sustain) : …le NIVEAU (pas un temps !) de la tenue
R (release) : le temps de mort après le relâcher — la traîne
```

**La grille de lecture** : l'ADSR *est* le rôle. Quatre profils couvrent le bestiaire entier :

| Profil | A / D / S / R | C'est… |
|---|---|---|
| Percussif | 0 / court / 0 / court | pluck, keys frappées (l07, l09) |
| Soutenu | court / — / haut / moyen | lead, basse (l06, l08) |
| Nappe | long / — / haut / long | pad, drone (l04, l05) |
| Geste | long / long / 0 / long | riser, swell — le son-crescendo (l10) |

Et le pont avec tout ce que tu sais : **l'ADSR fait au synthé ce que l'articulation fait à l'orchestre** (m10-l05) — le staccato est un profil percussif, le legato une nappe courte. Même pensée, autres poignées.

### 4. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Chercher le timbre dans les effets | 40 plugins sur un son mou | la forme d'onde et le filtre D'ABORD — l'effet habille, il ne crée pas |
| Sustain confondu avec un temps | des enveloppes incompréhensibles | S est un NIVEAU ; les trois autres sont des temps |
| Résonance à fond « pour le caractère » | le sifflement qui perce tout | un peu = présence ; le wow se dose comme un accent |
| Release infini partout | la bouillie entre les accords | la traîne se calibre sur le tempo (l09 chiffrera) |

### La mission (m06-e01, LAYERING minimal)

Dans un synthé de Cubase : fabrique quatre sons depuis l'init patch — un percussif, un soutenu, une nappe, un geste — en ne touchant QUE forme d'onde, cutoff, ADSR. Soumets les quatre en `Layer[]` (source, enveloppe, bande estimée) : le moteur vérifie que chaque enveloppe correspond au profil demandé (checker `envelopeProfile` — comparaison aux quatre gabarits, tolérances larges). *Ton premier stack : quatre existences dessinées à la main.*

- [ ] Sinus/triangle/saw/carré : la matière se choisit avant de se traiter
- [ ] Le cutoff est le CC1 du synthé ; la résonance s'accentue, ne s'installe pas
- [ ] A-D-R sont des temps, S est un niveau — et l'ADSR EST le rôle
- [ ] Quatre profils : percussif, soutenu, nappe, geste — tout le bestiaire en découle

<QuizBlock id="m06-l01-quiz" questions={5} />
<LessonFooter exercises={["m06-e01-four-lives"]} />

---

## 35.4 LEÇON m06-l02 — « La modulation : ce qui bouge est vivant »

```mdx
---
id: m06-l02-modulation
module: module-06-sound-design
title: "La modulation : ce qui bouge est vivant"
estMinutes: 25
skills: { sound_design: 1.0 }
---
```

### Pourquoi la modulation est la moitié du métier

Tiens un accord de pad trente secondes : si rien ne bouge, c'est un orgue — et l'oreille décroche en cinq. Le son acoustique vit *par nature* (l'archet tremble, le souffle fluctue) ; le son synthétique doit **fabriquer sa vie**. L'outil : la modulation — un signal invisible qui pilote un paramètre audible. C'est la règle `sd.static-stack` en positif : tout stack tenu porte au moins un mouvement.

### 1. La grammaire : source → cible → quantité

Toute modulation se lit en trois mots — la matrice de modulation de n'importe quel synthé n'est que ce tableau :

```
SOURCE (ce qui bouge)      CIBLE (ce qui est bougé)     QUANTITÉ
LFO                        cutoff, pitch, volume, pan    ± combien
enveloppe (une 2e ADSR)    cutoff surtout                
molette / CC1              cutoff, vibrato               (m10-l04 : le même geste)
velocity                   cutoff, attack                
aftertouch                 vibrato, brillance            
```

### 2. Le LFO : l'oscillateur trop lent pour s'entendre

Le LFO est un oscillateur sous ~20 Hz : on ne l'entend pas, on entend **ce qu'il remue**. Ses deux paramètres décisifs :

| Paramètre | Lecture |
|---|---|
| **Forme** | sinus = la houle (naturel) ; triangle = va-et-vient franc ; carré = l'alternance (trémolo dur, pan qui saute) ; **random/S&H** = le scintillement imprévisible (les textures de l05 en vivent) |
| **Vitesse** | LA décision : < 1 Hz = la respiration (imperceptible comme mouvement, perceptible comme vie) ; 1–8 Hz = le vibrato/trémolo (un geste entendu) ; **synchronisée au tempo** (1/4, 1/8, 1/16) = le rythme (le pad qui pulse, le sidechain du pauvre — l13 fera le riche) |

Les quatre mariages source×cible qui couvrent 90 % des usages — les recettes du bestiaire les déclineront :

```
LFO lent (0.1–0.5 Hz) → cutoff (± léger)   la respiration du pad     [l04]
LFO sync 1/8–1/16 → volume ou cutoff        la pulsation rythmique    [l09]
LFO 5–6 Hz → pitch (± 5–15 cents)           le vibrato                [l08]
LFO random lent → pan / pitch fin           le scintillement organique [l05]
```

### 3. L'enveloppe de modulation : le geste par note

Le LFO tourne en boucle ; l'**enveloppe de modulation** (une seconde ADSR, routée vers le cutoff le plus souvent) fait un geste *à chaque note* : l'attaque qui s'ouvre puis se referme (le « wah » du pluck, la morsure du lead), la nappe dont la brillance se lève après le volume. Règle de lecture : **volume-ADSR dessine l'existence, filtre-ADSR dessine le caractère** — les deux enveloppes d'un même son racontent deux choses, et les décaler (la brillance qui arrive après le niveau) est le secret des pads qui « fleurissent » (l04).

### 4. L'automation : la modulation composée

Troisième étage, tu le connais déjà : l'**automation** (m10-l04 — les lanes de CC et de paramètres) est de la modulation *écrite dans le temps du morceau* plutôt que bouclée ou par note. Le partage des rôles, définitif :

```
LFO         = le mouvement PERPÉTUEL (la vie de fond)
Enveloppe   = le mouvement PAR NOTE (le geste)
Automation  = le mouvement DRAMATIQUE (la forme du morceau : le pad qui
              s'ouvre sur 16 mesures vers la bascule — la tensionCurve
              de l14 M1, jouée au cutoff)
```

Le champ `Layer.motion` du modèle déclare lequel des trois porte la vie de chaque couche — et `sd.static-stack` vérifie qu'au moins une couche en porte une. Un stack professionnel typique : le pad respire (LFO), le pluck mord (enveloppe), le drone s'ouvre vers le climax (automation) — trois vitesses de vie superposées, comme les trois couches de l'épique (m09-l02 §2 : la division du travail, version mouvement).

### 5. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Tout moduler partout | le son-gélatine, aucune assise | UNE vie principale par couche (le champ motion est singulier à dessein) |
| Vibrato dès l'attaque | le synthé-chèvre | délai de LFO : le vibrato arrive APRÈS la pose (comme un corniste, §5.2) |
| LFO libre sur un élément rythmique | la pulsation qui dérive contre le tempo | sync au tempo dès que le mouvement est rythmique |
| La respiration trop ample | le pad qui fait le yoyo | ± léger : la vie s'entend comme présence, pas comme geste |

### La mission (m06-e02, LAYERING)

Trois couches tenues 16 mesures (le même accord) : un pad qui **respire** (LFO lent→cutoff), un drone qui **s'ouvre** (automation de cutoff sur toute la durée, en arche vers la mesure 11 — le gabarit `default` de tensionCurve appliqué à un paramètre !), une couche haute qui **scintille** (LFO random→pan). Soumission `LayerStack` : le moteur vérifie les trois `motion` déclarés et leurs types distincts, et `sd.static-stack` reste muette. *(Checker `motionPlan` : le plan de mouvements par couche.)*

- [ ] Source → cible → quantité : toute matrice se lit en trois mots
- [ ] LFO = perpétuel, enveloppe = par note, automation = dramatique
- [ ] La vitesse du LFO EST le sens : respiration / geste / rythme (sync !)
- [ ] Une vie principale par couche ; trois vitesses de vie par stack

<QuizBlock id="m06-l02-quiz" questions={5} />
<LessonFooter exercises={["m06-e02-three-speeds-of-life"]} />

---

## 35.5 LEÇON m06-l03 — « Le spectre et la place : penser en couches »

```mdx
---
id: m06-l03-spectre
module: module-06-sound-design
title: "Le spectre et la place : penser en couches"
estMinutes: 25
skills: { sound_design: 0.8, orchestration: 0.2 }
---
```

### Pourquoi c'est la leçon-clé du module

Le Module 5 t'a appris que l'orchestre s'étage en registres et en rôles ; le monde synthétique obéit à la même loi, exprimée en hertz : **un son n'existe que s'il a une place**. Cette leçon installe la carte du spectre, les sept rôles de couche, et la méthode d'assemblage — c'est le mode d'emploi du modèle `Layer` (§35.1), donc de tous les exercices LAYERING à venir.

### 1. La carte du spectre (à connaître comme le cycle des quintes)

```
20 ─── 60 ──── 120 ─────── 350 ─────── 2k ─────── 8k ─────── 20k Hz
│ INFRA │  SUB  │  BAS-MÉDIUM │  MÉDIUM   │  PRÉSENCE │   AIR    │
│ senti,│ LE    │ la chaleur   │ la parole,│ l'attaque,│ le       │
│ pas   │ sub — │ ET la boue   │ le corps  │ la clarté │ souffle, │
│ entendu│ SEUL │ (la zone     │ des sons  │           │ le       │
│       │ et    │ critique :   │           │           │ scintill.│
│       │ MONO  │ tout veut    │           │           │          │
│       │       │ y vivre)     │           │           │          │
```

Trois lois de la carte, qui sont trois règles du moteur :

1. **Le sub est un royaume à occupant unique** (`sd.sub-conflict`) : sous ~90 Hz, deux sources se battent en phase et produisent du chaos — UNE couche y règne (et l'orchestre compte : contrebasses + sub synthétique = déjà deux prétendants, l14 arbitrera) ;
2. **le grave est mono** (`sd.sub-width`) : la largeur stéréo sous 120 Hz s'annule en mono et floute l'assise — le sub au centre, toujours, la largeur commence au médium ;
3. **le bas-médium (120–350 Hz) est la zone critique** : la chaleur de tout y habite (pads, basses, cordes, cors) — c'est là que `sd.band-pileup` veille, et c'est là que le high-pass de l01 travaille (nettoyer le bas des couches qui n'ont rien à y faire : le pad qui commence à 200 Hz laisse la place à la basse).

### 2. Les sept rôles (le vocabulaire du modèle Layer)

| Rôle | Bande typique | Métier | L'analogie orchestrale |
|---|---|---|---|
| **sub** | 30–90 Hz | l'assise physique — sentie autant qu'entendue | la contrebasse (l05 M5 : l'interrupteur de gravité) |
| **body** | 90–500 Hz | le corps harmonique : l'accord, la chaleur | celli + cors (le tapis) |
| **top** | 2k–12k | la définition : l'attaque, la brillance | violons aigus + flûtes (la voûte) |
| **texture** | large, faible | le grain du temps : vinyl, air, granulaire | les tremolos ppp (la brume) |
| **movement** | variable | ce qui pulse : arps, gates, LFO sync | l'ostinato (m09-l02 : le moteur) |
| **fx** | événementiel | risers, impacts, braams — la ponctuation | les percussions et les rips |
| **melodic** | selon la ligne | le lead, la voix — porte des `notes` | la mélodie, tout simplement |

La grande révélation du module tient dans la colonne de droite : **le layering EST de l'orchestration** — mêmes questions (rôle → registre → couleur, m05-l01 §3), autres instruments. Un élève qui a fait le Module 5 sait déjà layerer ; il lui manquait la carte en hertz.

### 3. La méthode d'assemblage (l'ordre qui évite la boue)

```
1. LE BODY d'abord : le corps harmonique, seul, au niveau de référence
   (0 dB du stack) — c'est lui qu'on habille
2. LE SUB ensuite : mono, sinus/triangle, SOUS le body (high-pass du
   body à ~100 Hz pour lui céder la place) — et le test : coupe le
   sub → le stack doit maigrir, pas s'effondrer (le sub soutient,
   il ne porte pas)
3. LE TOP : la définition — souvent une couche fine (le même accord
   une octave plus haut, filtré high-pass, OU juste l'attaque d'un
   pluck) : +2 dB de top remplacent +6 dB de volume
4. LA VIE : les motions de l02 (qui respire, qui pulse, qui s'ouvre)
5. LA SOUSTRACTION : mute chaque couche une par une — celle dont
   l'absence ne s'entend pas DÉGAGE (la règle du néo-noir m09-l03 §5,
   érigée en méthode : max 3–4 couches actives + les événements)
```

L'étape 5 est la discipline qui sépare le stack pro de l'empilement d'amateur : **on assemble par addition, on finit par soustraction**. Le rapport de tes exercices LAYERING la vérifie à sa façon (`sd.band-pileup`, et le craft crédite les stacks économes).

### 4. Erreurs fréquentes

| Erreur | Symptôme | Correction |
|---|---|---|
| Deux subs (le pad qui descend + la basse) | la boue qui pompe | `sd.sub-conflict` : high-pass du pad, le royaume a un roi |
| Le sub stéréo « pour l'ampleur » | l'assise qui disparaît en mono | mono sous 120 Hz, la largeur au-dessus |
| Cinq couches dans le bas-médium | la chaleur devenue marécage | high-pass discipliné, `sd.band-pileup` |
| Monter le volume au lieu d'ajouter du top | le stack fort ET terne | +2 dB à 5 kHz > +6 dB partout |
| Ne jamais soustraire | le mur de son indifférencié | le test du mute, couche par couche, avant de valider |

### La mission (m06-e03, LAYERING — le premier stack complet)

Le stack canonique : body (saw detuné, high-passé à 100 Hz) + sub (sinus, mono) + top (attaque de pluck ou octave filtrée) + une texture — sur la progression fournie (4 accords, la boucle néo-noir de m09-e05 revisitée). Soumission `LayerStack` complet : bandes déclarées, high-pass du body prouvé par sa bande (`low ≥ 90`), sub mono, une motion, ET la déclaration de ce que tu as **soustrait** (champ libre `removed` : qu'as-tu essayé puis muté, et pourquoi — la soustraction devient un livrable). Les six règles `sd.*` jugent leur premier stack réel.

- [ ] La carte : infra/sub/bas-médium/médium/présence/air — et ses trois lois
- [ ] Sept rôles = l'orchestration en hertz (rôle → bande → source)
- [ ] L'ordre : body → sub → top → vie → SOUSTRACTION
- [ ] Le test du mute : ce qui ne manque pas dégage

<QuizBlock id="m06-l03-quiz" questions={5} />
<LessonFooter exercises={["m06-e03-the-canonical-stack"]} />

---

## 35.6 État d'ouverture du module

| Module 6 | Statut |
|---|---|
| Fondations | modèle `Layer`/`LayerStack` acté, 6 règles `sd.*` au registre (avec leurs jumeaux orchestraux explicités), kind LAYERING opérationnel, checkers `envelopeProfile` et `motionPlan` spécifiés |
| l01–l03 | ✅ **3/15** — l'acte « fondamentaux » complet : la fabrication, la vie, la place |
| Fil rouge | chaque notion synthétique est ancrée à son jumeau connu : cutoff↔CC1, ADSR↔articulations, layering↔orchestration, automation↔tensionCurve — le module hybride est hybride jusque dans sa pédagogie |
| Prochain lot | l04–l06 : le bestiaire commence — les cinq familles de pads, les textures/drones, et les basses (où `sd.sub-conflict` trouve sa leçon-mère) |

---

**Point de confirmation.** Le Module 6 est ouvert : modèle déclaratif, règles, et les trois leçons de fondation. Je poursuis avec le **lot l04–l06** (les pads en cinq familles — la fiche la plus demandée du brief ; textures, atmosphères et drones ; puis les basses sub et hybrides, la leçon de la loi du grave) ?