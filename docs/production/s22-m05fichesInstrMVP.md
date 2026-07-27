# SECTION 22 — MODULE 5 : LES FICHES INSTRUMENTS DU MVP

Gabarit §5.2 (le cor) appliqué en format resserré — toutes les rubriques, densité maximale. Décision de découpage : **violons I et II partagent une fiche** (même instrument, deux métiers — la fiche traite les deux rôles), ce qui donne le lot MVP : 9 fiches nouvelles + cor existant = **10 fiches couvrant 12 pupitres** (violon I, violon II comptés séparément dans `instruments.ts`).

---

## 22.1 FICHE m05-l02 — « Les violons : la voix de l'orchestre »

```mdx
---
id: m05-l02-violins
module: module-05-orchestration
title: "Les violons : la voix de l'orchestre"
estMinutes: 30
skills: { orchestration: 1.0 }
---
```

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture praticable | `G3`–`B6` (au-delà : possible, risqué en section) |
| Sweet spot | `A3`–`E6` |
| Agilité | maximale (10/10) — tout est jouable, traits, sauts, trilles |
| Tenue | illimitée (archet alterné en section : le son infini) |
| Puissance | pp 2/10 → ff 7/10 par pupitre, mais LA SECTION multiplie |

### Pourquoi irremplaçable

La section de violons est la **voix chantée** de l'orchestre : le seul pupitre capable de porter une mélodie du murmure au cri, sur quatre octaves, sans jamais respirer. C'est aussi le plus *humain* des timbres orchestraux — le vibrato des cordes est câblé comme une voix qui tremble. Quand tu ne sais pas à qui confier ton thème : violons. Ce n'est pas de la paresse, c'est la norme dont tout le reste est l'écart expressif.

### Couleur par registre

```
G3 ────── D4 ─────────────── E6 ────── B6
│ GRAVE   │     MÉDIUM/AIGU   │ SURAIGU │
│ chaud,  │ le chant — toute  │ cristal,│
│ râpeux, │ l'expressivité    │ tendu,  │
│ voilé   │ humaine vit ici   │ irréel  │
│ (corde G: la couleur         (harmoniques,
│  « gitane », intense)          flageolets)
```

**Le grave** (corde de sol) : intensité sombre, presque rauque — le lyrisme viscéral. **Le médium-aigu** : 90 % de ton écriture mélodique. **Le suraigu** : au-dessus de E6, le son se désincarne — nappes célestes, tension glaciale (divisi pp) ou brillance de tutti ff.

### Violons I vs violons II : deux métiers

| | Violons I | Violons II |
|---|---|---|
| Rôle par défaut | mélodie, la ligne exposée | contrechant, harmonie, doublure à l'octave ou à la 3ce inférieure |
| Registre typique | plus aigu | médium |
| L'erreur classique | — | les traiter en « violons I bis » : ils sont l'alto aigu de l'harmonie, pas un écho |

Les II à la tierce/sixte sous les I = le lyrisme classique ; les II en ostinato sous les I chantants = l'énergie moderne ; I et II à l'octave = l'unisson large des grands thèmes.

### Rôles et techniques signatures

| Rôle/technique | Écriture | Effet |
|---|---|---|
| Cantabile (arco legato) | ligne conjointe, médium-aigu | le chant — rôle n° 1 |
| Tremolo | note répétée à l'archet, mesuré ou non | tension, frémissement (pp) ou fureur (ff) |
| Pizzicato | notes détachées, sèches | ponctuation, espièglerie, noir |
| Ostinato (spiccato/staccato) | croches/doubles détachées | le moteur rythmique de l'action moderne |
| Divisi | la section coupée en 2–4+ voix | nappes, accords éthérés — noter `div.` |
| Con sordino | sourdine | brume, intimité, distance (le néo-noir en vit) |
| Harmoniques | flageolets aigus | l'irréel, le froid |

### Associations

Violons + flûte à l'octave = la lumière classique ; + hautbois à l'unisson = le chant renforcé et focalisé ; + violoncelles à l'octave (I en haut, celli en bas) = LE thème lyrique de film ; + cor à l'unisson = chaleur cuivrée (rare, superbe).

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Écrire sous G3 | `orch.range-violation` — la corde grave s'arrête là, sans exception |
| Mélodie pp noyée dans le suraigu sous un tutti | `orch.balance` — le suraigu pp est fragile |
| Divisi non déclaré (accords de 4 sons « pour violons ») | double stops ≠ divisi : au-delà de 2 sons, note `div.` |
| Tout confier aux I, les II en remplissage | `orch.role-coverage` — deux pupitres, deux métiers |

- [ ] Violons = la voix par défaut ; l'écart se justifie, pas la norme
- [ ] Corde de sol = intensité ; suraigu = désincarnation
- [ ] II = contrechant/harmonie, jamais « I bis »
- [ ] Divisi déclaré, jamais sous G3

<QuizBlock id="m05-l02-quiz" questions={5} />
<LessonFooter exercises={["m05-e01-violin-roles"]} />

---

## 22.2 FICHE m05-l03 — « L'alto : le cœur discret »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `C3`–`E6` (aigu praticable mais tendu au-delà de C6) |
| Sweet spot | `C3`–`D5` |
| Agilité | 8/10 |
| Tenue | illimitée (section) |
| Puissance | pp 2/10 → ff 6/10 — le moins puissant des pupitres de cordes |

### Pourquoi irremplaçable

L'alto occupe le registre où l'harmonie *vit* — entre le chant des violons et la basse des violoncelles — avec un timbre voilé, nasal, doux-amer, qu'aucun autre instrument n'a. Sans altos, le milieu de l'orchestre est un trou (le « trou de ténor » de l12 M1, version orchestrale). C'est l'instrument le plus sous-employé des débutants et le plus aimé des orchestrateurs : **il colle tout**.

### Couleur par registre

```
C3 ──────── G3 ──────────── D5 ────── E6
│ GRAVE     │    MÉDIUM      │  AIGU   │
│ sombre,   │ voilé, doux-   │ tendu,  │
│ boisé,    │ amer — LA      │ plaintif,│
│ grain     │ couleur alto   │ intense │
│ profond   │ (90 % du rôle) │ (voulu !)│
```

L'aigu d'alto n'est pas un violon raté : c'est une **tension timbrale** propre — la même note jouée par un violon (facile) et un alto (en haut de sa tessiture) n'a pas le même vécu. Confier une mélodie aiguë aux altos est un choix expressif d'intensité.

### Rôles

| Rôle | Écriture |
|---|---|
| Harmonie interne (n° 1) | tenues ou croches répétées, médium — le liant de la section |
| Contrechant | ligne médium sous la mélodie de violons — la réponse voilée |
| Doublure des violoncelles à l'octave | épaissit le chant grave sans l'alourdir |
| Mélodie exposée | rare donc marquante : la confession, l'intime, l'amer |
| Ostinato médium | avec ou sans violoncelles : le moteur sombre |

### Associations

Altos + violoncelles à l'unisson = le chant grave charnu (le « ténor » de l'orchestre) ; + bassons = fondu total du médium ; + cor anglais = la mélancolie au carré ; + clarinette = velours.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Sous C3 | `orch.range-violation` |
| L'oublier (harmonie confiée aux violons II seuls) | `orch.role-coverage` — le milieu se creuse |
| Le doubler systématiquement sans ligne propre | `orch.masking` version inverse : un pupitre entier gâché |
| ff exposé contre cuivres | `orch.balance` — 6/10 : le plus fragile des cordes |

- [ ] L'alto est le liant du milieu — le trou de ténor est son absence
- [ ] Sa couleur voilée est unique ; son aigu est une intensité, pas un pis-aller
- [ ] Altos + celli = le ténor de l'orchestre

<QuizBlock id="m05-l03-quiz" questions={5} />

---

## 22.3 FICHE m05-l04 — « Le violoncelle : le chant grave »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `C2`–`A5` (solistes : bien au-delà ; en section, prudence après E5) |
| Sweet spot | `C2`–`E4` ; le registre « ténor » `G3`–`E4` est l'or pur |
| Agilité | 8/10 |
| Tenue | illimitée (section) |
| Puissance | pp 2/10 → ff 7/10 |

### Pourquoi irremplaçable

Le violoncelle a deux vies : **la basse chantante** (il porte l'harmonie en marchant, l12 M1 : la basse-mélodie incarnée) et **le ténor lyrique** (dans son registre aigu, c'est la voix humaine masculine — le thème de violoncelles en G3–E4 est l'émotion la plus directe de l'orchestre). Aucun instrument ne fait les deux.

### Couleur par registre

```
C2 ───────── G2 ─────── G3 ─────── E4 ────── A5
│ PROFOND    │  BASSE    │  TÉNOR    │  AIGU   │
│ assise,    │  ronde,   │  LE chant │ intense,│
│ gravité,   │  souple,  │  viril,   │ presque │
│ ombre      │  marche   │  chaleur  │ douloureux│
```

### Rôles

| Rôle | Écriture |
|---|---|
| Basse harmonique (avec ou sans contrebasses) | fondamentales, lignes de basse — le socle |
| Le chant ténor | mélodie en G3–E4, vibrato large : réservé aux grands moments |
| Contrechant grave | la réponse sombre au thème des violons |
| Ostinato | croches en C2–C3 : le pouls de l'action |
| Pizzicato de basse | la marche jazz/noir (le « pizz » de m09-l03) |

### Associations

Celli + cors à l'unisson = **la doublure la plus chaude de l'orchestre** (déjà dans la fiche cor — elle vaut d'être lue des deux côtés) ; + contrebasses à l'octave = la basse classique complète ; + bassons = le grave boisé ; celli divisés en accords = le chœur sombre (ouverture de drame).

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Sous C2 | `orch.range-violation` |
| Accords serrés dans le profond | `orch.low-interval-limit` — écarte sous C3, toujours (l12 M1 §4) |
| Le chant ténor en permanence | l'or pur se dévalue : garde-le pour LES moments |
| Basse ET ténor simultanés demandés au même pupitre | divise (`div.`) ou choisis — un pupitre, un rôle à la fois |

- [ ] Deux vies : basse chantante + ténor lyrique
- [ ] G3–E4 = l'or pur, à dépenser avec parcimonie
- [ ] Celli + cors : la doublure signature du film

<QuizBlock id="m05-l04-quiz" questions={5} />

---

## 22.4 FICHE m05-l05 — « La contrebasse : le sol sous les pieds »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `E1`–`G3` (écrite une octave au-dessus du réel — le produit gère la transposition) |
| Sweet spot | `E1`–`D3` |
| Agilité | 4/10 — les traits rapides s'empâtent |
| Tenue | illimitée |
| Puissance | pp 3/10 → ff 7/10 (et une présence *physique* : on la sent plus qu'on l'entend) |

### Pourquoi irremplaçable

La contrebasse n'est pas « un gros violoncelle » : c'est **le plancher**. Elle définit où est le sol harmonique — et son silence est aussi puissant que son jeu : retirer les contrebasses fait *flotter* l'orchestre (l'apesanteur avant la chute), les faire entrer fait *atterrir*. C'est un interrupteur de gravité.

### Couleur et usages

```
E1 ─────────── A2 ─────── G3
│ PROFOND      │  HAUT     │
│ le plancher, │ tendu,    │
│ l'assise,    │ grognant  │
│ la menace    │ (rare)    │
```

| Rôle | Écriture |
|---|---|
| Doublure des celli à l'octave | LE réglage par défaut de la basse orchestrale |
| Pédale grave | tenue sur tonique ou dominante : la gravité qui attend (l15 M1) |
| Pizzicato | le pouls jazz/noir ; en classique : la ponctuation sèche |
| Ligne indépendante | rare, moderne : la menace qui rôde seule |
| Le silence stratégique | l'apesanteur — l'outil le plus sous-coté de la fiche |

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Sous E1 (sans extension) | `orch.range-violation` |
| Tierces/accords en dessous de C2 | `orch.low-interval-limit` — la contrebasse joue des LIGNES, octaves ou quintes, jamais des positions serrées |
| Traits de doubles croches rapides | `orch.agility` — ça devient du bruit gris |
| Jamais de silence | l'interrupteur de gravité inutilisé : pense ses entrées/sorties comme des événements |

- [ ] Le plancher : son entrée/sortie est un événement dramatique
- [ ] Octave sous les celli = défaut ; pédale = attente ; silence = apesanteur
- [ ] Des lignes, jamais des accords

<QuizBlock id="m05-l05-quiz" questions={5} />

---

## 22.5 FICHE m05-l06 — « La flûte : l'air et la lumière »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `C4`–`C7` (piccolo : une octave au-dessus — mention en fin de fiche) |
| Sweet spot | `G4`–`G6` |
| Agilité | maximale (10/10) — traits, arpèges, trilles : tout |
| Tenue | limitée par le souffle : phrases de 4–8 mesures max selon tempo |
| Puissance | pp 2/10 → ff 5/10, TRÈS inégale selon le registre (voir ci-dessous) |

### Pourquoi irremplaçable

La flûte est la lumière et l'air : le seul timbre orchestral sans anche ni cuivre — du souffle pur. Elle dessine au-dessus de l'orchestre (l'oiseau, l'arabesque, le scintillement) et double les violons à l'octave pour leur donner du ciel.

### Couleur par registre — LE piège de la fiche

```
C4 ────────── G4 ─────────── G6 ────── C7
│ GRAVE       │   MÉDIUM/AIGU │ SURAIGU │
│ velouté,    │ clair, souple,│ brillant,│
│ SUPERBE et  │ le dessin —   │ perçant, │
│ INAUDIBLE   │ 90 % du rôle  │ dominant │
│ (2/10 !)    │               │ (6/10)   │
```

Le grave de flûte est la plus belle couleur *inutilisable en tutti* de l'orchestre : velours pur en solo exposé (avec accompagnement pp minimal), invisible sous quoi que ce soit d'autre. La puissance de la flûte **croît avec la hauteur** — l'inverse d'aucune intuition : c'est la première chose que `orch.register-color` te dira sur elle.

### Rôles

| Rôle | Écriture |
|---|---|
| Doublure des violons à l'octave sup. | LE réglage classique : la lumière ajoutée |
| Arabesques, traits, ornements | l'agilité maximale au service du scintillement |
| Solo lyrique | médium, exposé — la pureté, l'innocence |
| Solo grave | velours confidentiel, orchestre quasi muet |
| Trilles/trémolos aigus | le frisson lumineux (avec cordes tremolo : le classique du merveilleux) |

**Piccolo** (mention MVP) : la flûte +1 octave, perce TOUT en ff (le sommet du tutti), délicat et froid en pp. Jamais de piccolo « pour doubler discrètement » : il ne fait rien discrètement.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Grave sous accompagnement dense | `orch.masking` — la plus fréquente erreur de flûte du répertoire amateur |
| Phrases sans respiration | `orch.endurance` — un flûtiste respire ; ménage les silences |
| Compter sur elle pour la puissance médium | `orch.balance` — 5/10 et encore |

- [ ] La puissance croît avec la hauteur — le grave est un solo ou rien
- [ ] Flûte + violons 8va = la lumière classique
- [ ] Piccolo : le sommet du tutti, jamais discret

<QuizBlock id="m05-l06-quiz" questions={5} />

---

## 22.6 FICHE m05-l07 — « Le hautbois : la voix qui focalise »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `Bb3`–`A6` (extrêmes délicats : praticable serein `C4`–`E6`) |
| Sweet spot | `C4`–`A5` |
| Agilité | 7/10 — agile, mais moins volubile que flûte/clarinette |
| Tenue | excellente (très peu d'air consommé — paradoxe : c'est l'expiration qui fatigue) |
| Puissance | pp 3/10 → ff 5/10 — mais une *pénétrance* hors norme : il traverse tout |

### Pourquoi irremplaçable

Le hautbois ne se fond pas : il **focalise**. Son timbre pincé, nasal, pastoral porte une qualité unique — la mélodie au hautbois est *quelqu'un qui parle*, là où la même aux violons est *un sentiment qui chante*. C'est l'instrument du solo narratif : le souvenir, la plainte digne, la bergère, l'enfance. Une note de hautbois dans un tutti s'entend toujours : c'est sa force et son danger.

### Couleur par registre

```
Bb3 ────── C4 ─────────── A5 ────── A6
│ GRAVE    │    MÉDIUM     │  AIGU   │
│ épais,   │ LE hautbois : │ fin,    │
│ canard   │ pastoral,     │ pâle,   │
│ (risqué) │ poignant      │ fragile │
```

### Rôles

| Rôle | Écriture |
|---|---|
| Solo narratif (n° 1) | mélodie médium exposée, phrasés vocaux |
| Doublure des violons à l'unisson | focalise le chant — le rend « parlé » |
| Duo avec flûte | tierce/sixte : le pastoral classique |
| Tenues d'harmonie dans les bois | son manque de fondu le rend audible : à doser |

**Cor anglais** (mention MVP, fiche complète en V1) : le hautbois alto (une quinte plus bas), la mélancolie incarnée — le solo du souvenir et de l'exil. Ce que tu voulais dire de nostalgique au hautbois et qui était trop clair : cor anglais.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Le noyer dans l'harmonie des bois | il ne se fond pas : chaque note de tenue s'entendra (`orch.blend-risk` : hautbois marqué « fondu faible ») |
| Grave exposé pp | `orch.register-color` — le canard guette |
| Deux solos focalisants simultanés (hautbois + trompette) | `orch.masking` par rivalité : deux voix qui parlent en même temps |
| Phrases sans expiration | `orch.endurance` — il faut VIDER l'air : silences obligatoires |

- [ ] Le hautbois parle, il ne chante pas : solo narratif avant tout
- [ ] Il ne se fond jamais — chaque note compte
- [ ] Nostalgie trop claire ? Cor anglais.

<QuizBlock id="m05-l07-quiz" questions={5} />

---

## 22.7 FICHE m05-l08 — « La clarinette : le caméléon »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `D3`–`Bb6` (en ut réel ; instrument transpositeur en si♭ — le produit gère) |
| Sweet spot | `D3`–`C6` — le plus large des bois |
| Agilité | 9/10 — arpèges immenses, legato de rêve |
| Tenue | excellente ; la SEULE à faire un vrai pianissimo subtone quasi inaudible |
| Puissance | ppp 1/10 (!) → ff 6/10 — la plus grande amplitude dynamique des bois |

### Pourquoi irremplaçable

La clarinette a **trois instruments en elle** (ses registres sont des timbres distincts) et le plus beau pianissimo de l'orchestre : elle peut entrer et sortir d'une texture sans couture — le caméléon. Elle se fond avec tout : cordes, cors, bois, voix. Là où le hautbois focalise, la clarinette **enveloppe**.

### Couleur par registre — trois instruments

```
D3 ─────────── F4 ──── Bb4 ─────────── C6 ────── Bb6
│  CHALUMEAU   │ GORGE  │   CLAIRON     │ SURAIGU │
│ sombre,      │ pâle,  │ clair, chantant│ perçant,│
│ boisé,       │ terne  │ souple — le    │ criard  │
│ mystérieux — │ (à     │ « soprano » de │ (effet) │
│ LE registre  │ éviter │ la famille     │         │
│ noir/jazz    │ exposé)│                │         │
```

Le **chalumeau** est un trésor : la couleur nocturne, feutrée, légèrement inquiète — le registre du jazz, du néo-noir, du conte qui commence. La **gorge** (F4–B♭4) est le péage entre les deux mondes : timbre pâle, à traverser vite, pas à exposer.

### Rôles

| Rôle | Écriture |
|---|---|
| Chant fondu | mélodie clairon, liée : la douceur qui n'accroche pas |
| Le nocturne | chalumeau exposé, pp : mystère, jazz, confidence |
| Arpèges-liant | ses grands arpèges legato cousent les textures (l'accompagnement classique) |
| Entrées invisibles | commencer une tenue ppp DANS un accord déjà sonnant : personne ne l'entend arriver |
| Doublure universelle | + altos, + cors, + flûte : elle épouse |

**Clarinette basse** (mention MVP) : le chalumeau prolongé vers l'abîme — la menace feutrée, le grave qui rôde sans le poids des bassons.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Exposer la gorge | `orch.register-color` — traverse, n'habite pas |
| L'utiliser comme un hautbois (solo focalisant) | elle enveloppe : pour percer, choisis l'autre |
| Ignorer le subtone | son ppp est un outil unique : les entrées invisibles |
| Sous D3 | `orch.range-violation` (c'est le territoire de la basse) |

- [ ] Trois registres = trois instruments ; la gorge se traverse
- [ ] Chalumeau = le nocturne ; clairon = le chant fondu
- [ ] Le caméléon : entrées invisibles, doublures universelles

<QuizBlock id="m05-l08-quiz" questions={5} />

---

## 22.8 FICHE m05-l09 — « La trompette : l'éclat et l'annonce »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `E3`–`C6` (au-delà : lead de big band, pas d'orchestre) |
| Sweet spot | `G3`–`G5` |
| Agilité | 7/10 — brillante en traits courts, fatigante en continu |
| Tenue | bonne, mais endurance limitée (lèvres : comme le cor, gérer les repos) |
| Puissance | pp 3/10 → **ff 10/10** — le sommet de l'orchestre |

### Pourquoi irremplaçable

La trompette est **l'annonce** : l'instrument du signal depuis trois millénaires. Son attaque est la plus nette de l'orchestre, son ff domine tout — quand la trompette parle, tout le monde écoute. Corollaire : elle ne sait pas être anonyme (sa discrétion s'appelle la sourdine, et c'est un AUTRE instrument — voir §4).

### Couleur par registre

```
E3 ────── G3 ─────────── G5 ────── C6
│ GRAVE   │    MÉDIUM     │  AIGU   │
│ cuivré  │ franc, noble, │ éclatant,│
│ sombre, │ héroïque —    │ triomphal,│
│ voilé   │ le signal     │ COÛTEUX │
│ (rare)  │               │ (endurance)│
```

### Rôles

| Rôle | Écriture |
|---|---|
| Fanfare/signal | quartes-quintes, rythmes pointés : l'annonce (l'archétype « appel », m02-l02) |
| Mélodie héroïque | médium f — souvent 2–3 trompettes à l'unisson pour la largeur |
| Le sommet du tutti | l'aigu ff : à préparer et à payer (repos) — même économie que le cor |
| Ponctuations | accents, rips : l'exclamation |

### La sourdine : l'autre trompette

| Sourdine | Couleur | Territoire |
|---|---|---|
| Straight (bouchée) | pincé, métallique, distant | LE néo-noir (m09-l03), l'ironie, le lointain |
| Cup | doux, voilé | jazz doux, nostalgie urbaine |
| Harmon | nasillard, électrique | le noir absolu, Miles — la solitude au néon |

La trompette bouchée pp est aussi *intime* que la trompette ouverte ff est *publique* : deux instruments dans un étui.

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Aigu tenu longuement | `orch.endurance` — plus coûteux encore que le cor |
| L'employer en « remplissage » d'harmonie | elle ne remplit pas, elle domine : les tenues de trompettes s'entendent TOUJOURS (`orch.balance`) |
| Unisson ff avec le cor | `orch.blend-risk` — la trompette l'avale (fiche cor, confirmé côté prédateur) |
| Oublier le changement de sourdine | il faut 2–4 mesures de silence pour la poser/l'ôter : écris-les |

- [ ] L'annonce : attaque la plus nette, ff le plus haut
- [ ] Elle ne sait pas être anonyme — la discrétion, c'est la sourdine
- [ ] Aigu = préparé, bref, remboursé en repos

<QuizBlock id="m05-l09-quiz" questions={5} />

---

## 22.9 FICHE m05-l10 — « Le piano : l'orchestre de poche et le percussionniste lyrique »

### Carte d'identité

| Propriété | Valeur |
|---|---|
| Tessiture | `A0`–`C8` — tout le spectre utile |
| Agilité | maximale, polyphonie illimitée |
| Tenue | AUCUNE tenue vraie : le son décroît dès l'attaque (la pédale prolonge, ne soutient pas) |
| Puissance | ppp → fff, attaque percussive |

### Pourquoi une fiche piano dans un cours d'orchestration

Trois raisons. **1)** C'est ton instrument d'esquisse : tout ce que tu composes naît probablement là — savoir ce que le piano *ment* sur l'orchestre est vital. **2)** C'est un instrument d'orchestre à part entière au cinéma : la note isolée dans la reverb (la goutte du néo-noir, m09-l03), l'ostinato minimaliste, le concerto intime. **3)** Sa dualité — percussion ET lyrisme — en fait un cas d'école du rôle.

### Ce que le piano ment sur l'orchestre (la section la plus importante)

| Le piano fait croire que… | La vérité orchestrale |
|---|---|
| tout son se décroît | cordes, vents, cuivres TIENNENT et enflent (CC1, l10 M1) : ta maquette piano sous-estime toutes les tenues |
| dix notes simultanées = normal | chaque note orchestrale est un musicien avec un rôle : ton accord de 10 sons devra devenir 3–4 rôles (M7) |
| le voicing serré grave passe | au piano la pédale floute et flatte ; à l'orchestre c'est la boue (`orch.low-interval-limit`) |
| la vélocité = la dynamique | à l'orchestre, dynamique = timbre différent (le ff d'un cor n'est pas son mf plus fort : c'est un autre son) |

**Protocole d'esquisse honnête** : esquisse au piano, puis rejoue chaque ligne EN PENSANT l'instrument cible (sa respiration, sa tenue, son registre) — c'est exactement la marche exercice → orchestration que le produit organise (m05-e08 et le Module 7).

### Rôles du piano-instrument

| Rôle | Écriture |
|---|---|
| La goutte | notes isolées, registre extrême, reverb : la solitude (néo-noir, drame) |
| L'ostinato minimaliste | cellules répétées médium : le temps qui passe (le drame contemporain en vit) |
| Le lyrisme intime | mélodie + accompagnement : la scène « à nu » avant/après le tutti |
| La percussion claire | clusters, graves martelés, attaques sèches dans le tutti moderne |
| Le liant hybride | avec pads et textures (M6) : le piano feutré est l'humain dans l'électronique |

### Erreurs fréquentes (détectées)

| Erreur | Règle |
|---|---|
| Orchestrer littéralement une texture pianistique | les arpèges de pédale ne sont PAS des tenues de cordes : traduis les rôles, pas les notes |
| Serré sous C3 | `orch.low-interval-limit` — au piano aussi, la pédale n'excuse rien |
| Ignorer la décroissance | une « tenue » de piano de 4 mesures est un silence à la mesure 3 : réattaque ou confie à un autre |

- [ ] Le piano ment sur les tenues, la densité, le grave et la dynamique
- [ ] Esquisse au piano, traduis en rôles
- [ ] Piano-instrument : la goutte, l'ostinato, l'intime

<QuizBlock id="m05-l10-quiz" questions={5} />

---

## 22.10 État de production du Module 5 (périmètre MVP)

| Fiche | Statut |
|---|---|
| m05-l01 — intro « L'orchestre comme palette » | à rédiger (courte : familles, dynamicPower, la logique registre/rôle — 15 min) |
| m05-l02 violons · l03 alto · l04 violoncelle · l05 contrebasse | ✅ |
| m05-l06 flûte (+piccolo) · l07 hautbois (+cor anglais) · l08 clarinette (+basse) | ✅ |
| m05-l09 trompette · l10 piano | ✅ |
| m05-l12 cor | ✅ (§5.2) |
| Couverture pupitres | 12 pupitres + 4 mentions (piccolo, cor anglais, clarinette basse, sourdines) |
| `instruments.ts` | les cartes d'identité ci-dessus SONT les données : ranges, sweetSpots, registerZones, dynamicPower, agility, blendsWith/avoidWith — transcription directe (le `avoidWith` cor↔trompette est désormais documenté des deux côtés) |
| Exercices | m05-e01 (rôles violons) référencé ; m05-e08 (orchestration du thème héroïque) existait (§5.4 C) — banque à compléter en V1 |

Cohérences verrouillées : chaque fiche cite les règles `orch.*` qu'elle légitime ; les associations croisées sont symétriques (cor↔celli, cor↔trompette) ; la fiche piano fait le pont esquisse→orchestration qui justifie le Real-World Workflow Mode ; les instruments transpositeurs (clarinette, contrebasse) notent que le produit gère la transposition (promesse V1, fiche cor §erreurs).

---

**Point de confirmation.** Reste du MVP contenu : **(a)** les 3 leçons de genre M9 (romance, épique, thriller — au gabarit néo-noir §5.3) — le dernier lot rédactionnel du MVP ; **(b)** les 30 specs JSON M2 ; **(c)** m05-l01 intro + `instruments.ts` en code. Je recommande **(a)** pour clore la rédaction MVP d'un trait. Je continue ?