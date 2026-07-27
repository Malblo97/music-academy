# SECTION 29 — LA FIN DU FINI : m05-l01 + LE LOT DE QUIZ REPRÉSENTATIF

## 29.1 LEÇON m05-l01 — « L'orchestre comme palette : lire les fiches »

```mdx
---
id: m05-l01-palette
module: module-05-orchestration
title: "L'orchestre comme palette : comment lire les fiches"
estMinutes: 15
skills: { orchestration: 1.0 }
---
```

### Pourquoi ce module change ta façon de composer

Jusqu'ici tu as écrit des *notes* ; à partir de maintenant tu écris des notes **pour quelqu'un** — un instrument avec un corps, des limites, une couleur qui change selon l'altitude. L'orchestration n'est pas une décoration posée sur la composition : c'est le moment où ta musique acquiert un timbre, donc une chair. Ce module est une encyclopédie de fiches ; cette page t'apprend à les lire — et à penser en orchestrateur plutôt qu'en pianiste (la fiche piano, l10, t'expliquera pourquoi cette distinction est vitale).

### 1. Les familles : quatre métaux, quatre logiques

| Famille | Membres (MVP) | Le trait commun | Le super-pouvoir |
|---|---|---|---|
| **Cordes** | violons I/II, altos, violoncelles, contrebasses | sections homogènes, tenue infinie (archet alterné), toute dynamique | LE fondu : la pâte continue de l'orchestre |
| **Bois** | flûte, hautbois, clarinette (+ basson en V1) | des *individus* — chaque bois est un timbre-personnage, le souffle limite les phrases | la caractérisation : la voix qui parle |
| **Cuivres** | cor, trompette (+ trombone, tuba en V1) | puissance dominante, endurance des lèvres, attaque franche | l'autorité : de l'appel au mur |
| **Clavier** | piano | percussion ET lyrisme, aucune tenue vraie | l'esquisse — et l'instrument-solitude |

Une conséquence immédiate, que toutes les fiches déclinent : **les cordes se pensent en sections, les bois en solistes, les cuivres en pupitres groupés**. Confier une mélodie « aux bois » ne veut rien dire ; la confier « au hautbois » dit tout.

### 2. Anatomie d'une fiche (le mode d'emploi)

Chaque fiche suit le même squelette — et chaque rubrique correspond à une vérification du produit :

| Rubrique | Ce qu'elle te dit | Ce que le produit en fait |
|---|---|---|
| **Tessiture praticable** | les notes qui existent | `orch.range-violation` : hors limites = la note n'existe pas, point |
| **Sweet spot** | où l'instrument est *chez lui* | hors du spot : jamais pénalisé, toujours *décrit* (`orch.register-color` — la règle-mentor) |
| **Couleur par registre** | le même instrument = plusieurs timbres selon l'altitude | les descriptions des rapports viennent mot pour mot des fiches |
| **Puissance (pp→ff)** | le rapport de force | `orch.balance` : une mélodie 5/10 contre un tapis cumulé 27/10 est étouffée |
| **Agilité** | ce que les traits rapides coûtent | `orch.agility` |
| **Tenue** (souffle / lèvres / infinie / décroissance) | le budget physiologique | `orch.endurance` : en samples tu ne l'entends pas, en session tu le paies |
| **Rôles** | les métiers, par fréquence réelle | le vocabulaire des exercices ORCHESTRATE |
| **Associations / à éviter** | les mariages éprouvés et les pièges | suggestions et `orch.blend-risk` |

**La règle de lecture n° 1** : la colonne *couleur par registre* est la plus importante de chaque fiche. Un instrument n'est pas une étendue de notes, c'est un empilement de timbres — la flûte grave et la flûte aiguë sont presque deux instruments (l06 en fera la démonstration piège comprise).

### 3. Les trois questions de l'orchestrateur

Avant d'assigner quoi que ce soit, trois questions — elles structureront tous tes exercices du module, et le Module 7 (combinaisons) les systématisera :

```
1. QUEL RÔLE ?     mélodie, contrechant, harmonie, basse, texture, rythme
                   (les rôles de l'analyseur — un pupitre, un rôle à la fois)
2. QUEL REGISTRE ? où ce rôle doit-il vivre pour être entendu ?
                   (la mélodie gagne par le registre dégagé, pas par le volume)
3. QUELLE COULEUR ? parmi les instruments qui couvrent ce registre,
                   lequel a le TIMBRE de l'émotion visée ?
```

L'ordre est volontaire : rôle → registre → couleur. Les débutants commencent par la couleur (« je veux des cors ! ») et découvrent ensuite que le registre est pris et le rôle flou. Les fiches sont rangées pour répondre à la question 3 — mais les questions 1 et 2 se posent avant d'ouvrir le livre.

### 4. Comment travailler ce module

Les fiches ne se lisent pas d'affilée comme un roman : **lis-en une, puis écris pour l'instrument le jour même** (les exercices de fiche existent pour ça). Ordre conseillé : les cordes d'abord (l02–l05 — la pâte de base), puis le cor (l12 — le liant), puis les bois (l06–l08 — les personnages), la trompette (l09), et le piano en miroir final (l10 — ce que ton instrument d'esquisse te cache). Chaque fiche cite ses partenaires : suis les renvois, ils dessinent la carte des mariages.

- [ ] Quatre familles, quatre logiques : sections / solistes / pupitres / l'esquisse
- [ ] Une fiche = tessiture, spot, couleurs, puissance, agilité, tenue, rôles, mariages
- [ ] Rôle → registre → couleur : dans cet ordre, toujours
- [ ] Une fiche lue = un exercice écrit le jour même

<QuizBlock id="m05-l01-quiz" questions={4} />
<LessonFooter exercises={[]} />

---

## 29.2 Le lot de quiz représentatif

**Périmètre et méthode.** Le backlog complet est ~180 items (58 leçons × 4–8 questions, specs §19.2 : `QuizSchema`, correction serveur §19.5, le `why` systématique). Produire les 180 ici serait du volume sans décision ; ce lot livre **8 quiz complets (46 items)** choisis pour couvrir *chaque type de difficulté d'écriture* — et il établit la **charte de rédaction des quiz** que le reste du backlog appliquera mécaniquement. C'est le même geste que les leçons-gabarits de §5 : l'échantillon qui fixe le standard.

### La charte (extraite de l'écriture de ce lot)

1. **Chaque question teste UN point de la leçon, cité par section** dans le `why` — le quiz est une table des matières déguisée ;
2. **Les distracteurs sont les erreurs fréquentes de la leçon** (la table « Erreurs » de chaque leçon EST le gisement de mauvaises réponses) — jamais de distracteurs absurdes ;
3. **≥ 1 question jouable (`play`) par quiz** quand le sujet s'entend — l'oreille avant le crayon, même en quiz ;
4. **La dernière question est intégrative** : elle croise la leçon avec une leçon antérieure (le quiz entretient le réseau, pas seulement le nœud) ;
5. **Le `why` enseigne même quand on a juste** — deux phrases max, la règle et son pourquoi.

### Quiz 1 — m01-l14 (tension/résolution) : le quiz de leçon-concept

```json
{ "id": "m01-l14-quiz", "interaction": "mc", "items": [
  { "q": "Les deux attractions les plus fortes du système tonal :",
    "options": ["1̂→5̂ et 3̂→1̂", "7̂→1̂ et 4̂→3̂", "2̂→1̂ et 6̂→5̂"],
    "answer": "7̂→1̂ et 4̂→3̂",
    "why": "Les deux demi-tons de la gamme (§1) — réunis, ils forment le triton de V7 (§3)." },
  { "q": "▶ Cette phrase s'arrête sur sa dernière note. Que ressens-tu ?",
    "play": "C4:q F4:q B4:h",
    "options": ["une conclusion", "une attente non résolue", "une modulation"],
    "answer": "une attente non résolue",
    "why": "B = 7̂ exposée sans son 1̂ : l'inconfort que tu ressens EST la tension (§1) — pas une métaphore, ton matériau." },
  { "q": "Une tension forte (7̂, appoggiature) doit être résolue :",
    "options": ["dans le temps ou le temps suivant", "avant la fin de la pièce", "jamais — c'est un style"],
    "answer": "dans le temps ou le temps suivant",
    "why": "Règle de dosage (§2) : plus la dette est forte, plus le remboursement est proche. L'évitement systématique existe — mais c'est un choix de style (thriller, §7), pas un défaut de gestion." },
  { "q": "Le climax d'une phrase se place idéalement :",
    "options": ["au début (l'idée forte d'abord)", "vers les 2/3", "sur la dernière note"],
    "answer": "vers les 2/3",
    "why": "Le gabarit de l'arche (§4) — c'est ce que mesure la courbe de tension de tes exercices." },
  { "q": "[intégrative] En 4/4, où une note instable pèse-t-elle le plus ?",
    "options": ["sur le 2e temps", "sur le 1er ou le 3e temps", "sur un contretemps"],
    "answer": "sur le 1er ou le 3e temps",
    "why": "La hiérarchie métrique (l08) : la tension se dose aussi par SA POSITION — instable + temps fort = l'investissement maximal." } ] }
```

### Quiz 2 — m01-l20 (substitutions) : le quiz de mécanisme

```json
{ "id": "m01-l20-quiz", "interaction": "mc", "items": [
  { "q": "Pourquoi D♭7 peut-il remplacer G7 ?",
    "options": ["même fondamentale", "même triton (les guide tones B–F)", "même quinte"],
    "answer": "même triton (les guide tones B–F)",
    "why": "F–C♭ = F–B : l'oreille conclut au triton qui se résout, pas à la fondamentale (§2)." },
  { "q": "Ce que la substitution tritonique CHANGE :",
    "options": ["la promesse de résolution", "la basse : quinte descendante → demi-ton descendant", "la tonalité"],
    "answer": "la basse : quinte descendante → demi-ton descendant",
    "why": "La porte devient couloir (§2) : G→C saute, D♭→C glisse. Tout le sens est là." },
  { "q": "▶ Compare les deux cadences. Laquelle contient la substitution ?",
    "play": "[D3+F4+C5]:h [G2+F4+B4]:h [C3+E4+C5]:w r:w [D3+F4+C5]:h [Db3+F4+B4]:h [C3+E4+C5]:w",
    "options": ["la première", "la seconde", "aucune"],
    "answer": "la seconde",
    "why": "Main droite identique (le triton travaille) — seule la basse trahit le couloir : D–D♭–C (§2, l'exemple même)." },
  { "q": "La règle d'or du subV :",
    "options": ["il précède toujours le V7", "sa basse descend d'un demi-ton vers la cible", "il est toujours ♯11"],
    "answer": "sa basse descend d'un demi-ton vers la cible",
    "why": "Sans ce mouvement, ce n'est qu'un accord étranger plaqué (§3) — et l'erreur classique est justement de le placer AVANT G7 au lieu de l'y substituer." },
  { "q": "Dans subV7♯11 (D♭7♯11 pour G7), la ♯11 est :",
    "options": ["une couleur décorative", "la fondamentale du G7 remplacé — son fantôme", "la sensible de C"],
    "answer": "la fondamentale du G7 remplacé — son fantôme",
    "why": "G naturel sur D♭7 : l'accord porte celui qu'il évince (§3) — l'épaisseur du son néo-noir." },
  { "q": "Toute substitution repose sur :",
    "options": ["un invariant préservé (fonction, triton, tension…)", "le hasard des notes communes", "la règle des quintes"],
    "answer": "un invariant préservé (fonction, triton, tension…)",
    "why": "Le principe au-dessus des cas (§4) : savoir ce qui ne doit PAS bouger — il te guidera quand tu inventeras les tiennes." },
  { "q": "[intégrative] vii° peut remplacer V7 parce que :",
    "options": ["il contient le même triton, sans la fondamentale", "il est diminué", "il est plus consonant"],
    "answer": "il contient le même triton, sans la fondamentale",
    "why": "Bdim = G7 décapité (l13 §2) : même promesse, moins de poids — la 3e ligne du panorama (§4)." } ] }
```

### Quiz 3 — m01-l05 (cycle des quintes) : le quiz de drill (generator dominant)

```json
{ "id": "m01-l05-quiz", "interaction": "mc",
  "generator": { "families": ["signature-to-key", "key-to-signature", "new-accidental", "distance"], "range": "0-6", "rounds": 7 },
  "items": [
    { "q": "4 dièses : quelle majeure ?", "options": ["E", "A", "B"], "answer": "E",
      "why": "Dernier dièse D♯ + ½ ton = E (§2, l'astuce studio)." },
    { "q": "Le nouveau bémol en passant de B♭ à E♭ majeur :", "options": ["A♭", "E♭", "D♭"], "answer": "A♭",
      "why": "Le nouveau bémol est toujours la sous-dominante de la nouvelle tonalité (4̂ de E♭ = A♭)." },
    { "q": "D majeur et B♭ majeur partagent :", "options": ["3 notes", "4 notes", "5 notes"], "answer": "4 notes",
      "why": "2♯ et 2♭ = 4 pas d'écart sur le cycle... — non : compte les altérations DIFFÉRENTES : F♯,C♯ vs B♭,E♭ = 4 conflits sur 7 → 3 notes communes ? Vérifie : D-E-F♯-G-A-B-C♯ ∩ B♭-C-D-E♭-F-G-A = {D, E?non(E♭), G, A} = 4. Réponse : 4 — et la méthode est le comptage d'altérations conflictuelles." },
    { "q": "[intégrative] Pour moduler en douceur depuis A majeur, la cible la plus riche en pivots :", "options": ["E ou D", "C", "E♭"], "answer": "E ou D",
      "why": "Les voisines du cycle (±1 pas) partagent 6 notes sur 7 (§3) — c'est la carte des parentés que la l23 exploitera." } ] }
```

*(Note de production : l'item 3 conserve volontairement son `why` en forme de vérification pas-à-pas — les drills du generator doivent enseigner LA MÉTHODE de calcul, pas la réponse.)*

### Quiz 4 — m02-l02 (le motif) : le quiz de leçon-métier

```json
{ "id": "m02-l02-quiz", "interaction": "mc", "items": [
  { "q": "Les trois couches d'un motif :",
    "options": ["hauteur, durée, vélocité", "forme intervallique, forme rythmique, point d'ancrage", "tête, corps, queue"],
    "answer": "forme intervallique, forme rythmique, point d'ancrage",
    "why": "Et elles sont SÉPARABLES (§1) : c'est ce qui rend le développement possible." },
  { "q": "▶ Quel archétype entends-tu ?",
    "play": "F4:e Bb4:q. r:e F4:e Bb4:q.",
    "options": ["le pas", "l'appel", "le soupir"],
    "answer": "l'appel",
    "why": "Saut ascendant (P4) + note tenue (§2) : l'héroïsme en germe — deux notes suffisent." },
  { "q": "Un motif de 10 notes est :",
    "options": ["un motif riche", "déjà une phrase — rien à développer, tout à répéter", "un thème"],
    "answer": "déjà une phrase — rien à développer, tout à répéter",
    "why": "Le motif est ce qui reste quand tu ne peux plus rien enlever (§erreurs) : un geste, une respiration." },
  { "q": "Le test le plus discriminant de la développabilité :",
    "options": ["le transposer", "garder son RYTHME en changeant les hauteurs : le reconnaît-on ?", "le jouer fort"],
    "answer": "garder son RYTHME en changeant les hauteurs : le reconnaît-on ?",
    "why": "Si l'identité est toute dans les hauteurs, le rythme est trop générique — le motif n'a qu'une jambe (§3)." },
  { "q": "Une cellule qui finit sur 1̂, temps fort, note longue :",
    "options": ["est parfaite", "est une mélodie finie de trois notes — nulle part où aller", "doit être transposée"],
    "answer": "est une mélodie finie de trois notes — nulle part où aller",
    "why": "La fin OUVERTE (degré instable, rythme suspendu) fait que la cellule APPELLE sa suite (§3)." },
  { "q": "[intégrative] Le brief dit « élan douloureux ». L'intervalle-signature candidat :",
    "options": ["la quinte juste", "la sixte mineure ascendante", "la seconde majeure"],
    "answer": "la sixte mineure ascendante",
    "why": "La table des caractères (l02 M1 §6) devenue outil de conception (§4) : brief → intervalle → archétype → cellule." } ] }
```

### Quiz 5 — m05-l08 (clarinette) : le quiz de fiche

```json
{ "id": "m05-l08-quiz", "interaction": "mc", "items": [
  { "q": "Les trois registres de la clarinette :",
    "options": ["grave, médium, aigu", "chalumeau, gorge, clairon", "sombre, neutre, brillant"],
    "answer": "chalumeau, gorge, clairon",
    "why": "Trois instruments en un (§couleurs) — et la gorge (F4–B♭4) se TRAVERSE, ne s'expose pas." },
  { "q": "Le registre du nocturne, du jazz, du conte qui commence :",
    "options": ["le clairon", "le chalumeau", "le suraigu"],
    "answer": "le chalumeau",
    "why": "Sombre, boisé, mystérieux — le trésor de la fiche (et Bruma, la contrebandière de m02-e30, y vit)." },
  { "q": "Le super-pouvoir dynamique de la clarinette :",
    "options": ["le ff le plus puissant des bois", "le ppp quasi inaudible (subtone) → les entrées invisibles", "le crescendo infini"],
    "answer": "le ppp quasi inaudible (subtone) → les entrées invisibles",
    "why": "pp 1/10 : commencer une tenue DANS un accord déjà sonnant sans qu'on l'entende arriver — le caméléon." },
  { "q": "Clarinette ou hautbois : pour un solo qui doit PERCER un tutti ?",
    "options": ["clarinette", "hautbois", "égalité"],
    "answer": "hautbois",
    "why": "La clarinette ENVELOPPE (fondu universel), le hautbois FOCALISE (pénétrance) — deux métiers opposés (l07 vs l08)." },
  { "q": "[intégrative] Pour doubler un chant d'altos sans changer leur couleur :",
    "options": ["trompette", "clarinette", "piccolo"],
    "answer": "clarinette",
    "why": "Le velours (l03 : altos + clarinette) — le caméléon épouse, il ne signe pas." } ] }
```

### Quiz 6 — m09-l04 (thriller) : le quiz de genre

```json
{ "id": "m09-l04-quiz", "interaction": "mc", "items": [
  { "q": "Le principe unificateur du thriller :",
    "options": ["la dissonance maximale", "installer un pattern parfait et refuser son aboutissement", "le tempo rapide"],
    "answer": "installer un pattern parfait et refuser son aboutissement",
    "why": "La mécanique fiable + l'issue refusée = l'étau (§1). La répétition est la tension, la résolution est l'ennemi." },
  { "q": "▶ Quel outil du genre entends-tu ?",
    "play": "E3:e E3:e F3:e E3:q. E3:e r:e E3:e E3:e F3:e E3:q. E3:e r:e E3:e E3:e F#3:e E3:q. E3:e r:e",
    "options": ["la fragmentation", "l'étau chromatique (la dérive du signal)", "une modulation"],
    "answer": "l'étau chromatique (la dérive du signal)",
    "why": "Le F devient F♯ : le pattern ne varie pas, il DÉRIVE (§2) — un demi-ton qui serre la vis." },
  { "q": "L'ostinato du thriller qui s'arrête net :",
    "options": ["est une erreur de montage", "est plus effrayant que sa continuation — l'apnée", "signale la fin de la scène"],
    "answer": "est plus effrayant que sa continuation — l'apnée",
    "why": "Le tic-tac qui se tait : la bombe est là (§2). Le silence du thriller n'est pas une respiration." },
  { "q": "Thriller et néo-noir partagent leurs couches sombres. Ce qui les distingue :",
    "options": ["le mode", "l'acoustique : le noir met la reverb (solitude), le thriller assèche (mécanique)", "le tempo"],
    "answer": "l'acoustique : le noir met la reverb (solitude), le thriller assèche (mécanique)",
    "why": "Même famille, deux espaces (§3) — la reverb partout te fait changer de genre sans le savoir." },
  { "q": "[intégrative] Pourquoi `melody.monotony` est-elle à 0 dans ce style ?",
    "options": ["par erreur", "parce que la répétition y est l'outil, créditée en craft", "parce que le style est atonal"],
    "answer": "parce que la répétition y est l'outil, créditée en craft",
    "why": "La matrice des styles (l25 M1 en a posé le principe) : une « faute » dans une grammaire est la norme d'une autre." } ] }
```

### Quiz 7 — m01-l01 (notes/clavier) : le quiz d'entrée (keyboard-pick dominant)

```json
{ "id": "m01-l01-quiz", "interaction": "mc",
  "generator": { "families": ["find-pc", "midi-anchor", "half-steps"], "rounds": 5 },
  "items": [
    { "q": "Clique le do central", "interaction": "keyboard-pick", "answer": ["C4"],
      "why": "C4 = MIDI 60 : la boussole de tout ton travail en DAW (§1)." },
    { "q": "Les deux couples de touches blanches SANS noire entre elles :",
      "options": ["C–D et F–G", "E–F et B–C", "A–B et D–E"], "answer": "E–F et B–C",
      "why": "Les deux demi-tons naturels (§3) — toute la construction des gammes repose sur cette asymétrie." },
    { "q": "C♯ et D♭ sont :",
      "options": ["deux touches voisines", "la même touche, deux orthographes selon le contexte", "un ton d'écart"],
      "answer": "la même touche, deux orthographes selon le contexte",
      "why": "L'enharmonie (§4) : le nom dit d'où l'on vient et où l'on va — l'orthographe est un choix de sens." },
    { "q": "`r:e` dans la notation du produit :",
      "options": ["un mi", "un demi-temps de silence", "une répétition"], "answer": "un demi-temps de silence",
      "why": "Le silence est une note à part entière (§5) — tu l'apprendras à tes dépens si tu l'oublies." },
    { "q": "[intégrative] Combien de classes de hauteur le système compte-t-il ?",
      "options": ["7", "12", "88"], "answer": "12",
      "why": "7 est le piège (les touches blanches) : compte les demi-tons, pas les noms (§erreurs) — les 12 reviendront à chaque gamme, chaque accord, chaque analyse." } ] }
```

### Quiz 8 — m01-l25 (synthèse) : le quiz intégratif pur (10 items — extrait de 5, le solde suit la même mécanique sur « Départ »)

```json
{ "id": "m01-l25-quiz", "interaction": "mc", "items": [
  { "q": "L'ordre du protocole d'analyse :",
    "options": ["fonctions → tonalité → mélodie", "jouer → tonalité/structure → fonctions → chromatismes → mélodie → rythme → absences", "chromatismes d'abord (le plus dur)"],
    "answer": "jouer → tonalité/structure → fonctions → chromatismes → mélodie → rythme → absences",
    "why": "L'oreille avant le crayon, le cadre avant le détail (§4) — et c'est l'ordre exact du pipeline de l'analyseur." },
  { "q": "Pourquoi noter ce qui est ABSENT d'une pièce ?",
    "options": ["pour la critiquer", "parce que la maîtrise est la nécessité, pas la densité d'outils", "pour remplir la fiche"],
    "answer": "parce que la maîtrise est la nécessité, pas la densité d'outils",
    "why": "« Départ » n'a ni tritonique ni modulation — et c'est juste (§3). L'absence choisie est une décision de composition." },
  { "q": "Dans « Départ », le Fm6 de la mesure 7 exige de la mélodie :",
    "options": ["rien", "qu'elle consente : A4 devient A♭4", "qu'elle module"],
    "answer": "qu'elle consente : A4 devient A♭4",
    "why": "La loi du consentement (l21 §3) : l'emprunt harmonique et la ligne se coordonnent — sinon le frottement est une faute, pas une couleur." },
  { "q": "Le C/G de la mesure 15 est légal parce que :",
    "options": ["tout renversement est légal", "c'est le 64 CADENTIEL : I64→V→I sur temps fort", "le sol est à la basse par hasard"],
    "answer": "c'est le 64 CADENTIEL : I64→V→I sur temps fort",
    "why": "Le 2e renversement a trois emplois encadrés (l12 §3) — ici le « moment cérémonie » avant la parfaite finale." },
  { "q": "D7 (m.10) est une tonicisation et non une modulation parce que :",
    "options": ["il est trop court", "aucune cadence ne CONFIRME sol, et la suite vit ailleurs", "D7 n'existe pas en do"],
    "answer": "aucune cadence ne CONFIRME sol, et la suite vit ailleurs",
    "why": "Le continuum de l23 §4 : visite ou installation — la frontière est la cadence confirmante + la vie dans le nouveau monde." } ] }
```

## 29.3 Le backlog restant, chiffré et outillé

| Fait | 8 quiz complets, 46 items — un par type d'écriture : concept, mécanisme, drill, métier, fiche, genre, entrée, synthèse |
|---|---|
| Charte | 5 règles extraites — les distracteurs viennent des tables d'erreurs, le `why` cite sa section, ≥ 1 `play`, la dernière question intègre |
| Reste | ~50 quiz (~135 items) — production mécanique à la charte : les tables « Erreurs fréquentes » et « Récapitulatif » de chaque leçon contiennent déjà questions et distracteurs. Chiffrage : ~25 min/quiz ≈ **21 h**, à lisser en parallèle des sprints S13–S16 (le Course Reader les consomme) |
| Assets restants du MVP | 2 pièces musicales (e48 « mystère », e08-M5 thème héroïque) — 2 h au gabarit de « Départ » |

**État final du chantier contenu MVP** : 59 leçons ✅ · 79 specs ✅ · 56 solutions ✅ · 14 findings traités ✅ · charte quiz + 8/58 ✅ · il ne reste que du volume à charte fixée. Le produit peut entrer en Phase 0–1 (roadmap §6.4) avec un contenu intégralement spécifié — ce qui était le risque n° 2 du registre §6.7, désormais neutralisé.

---

**Point de confirmation.** Le MVP est clos côté conception et contenu. Les fronts ouverts sont tous V1 : **(a)** Module 10 — Cubase Pro 13, le Real-World Workflow (15 leçons : templates, Expression Maps, éditeurs, mixage, export — le module le plus différenciant) ; **(b)** Module 6 — sound design hybride (15 leçons + les règles `sd.*` + le Layering) ; **(c)** Module 3 ou 4 (harmonie avancée / contrepoint — la profondeur théorique V1). Ma recommandation : **(a)**, car il matérialise la promesse fondatrice du brief (« un compagnon de composition réel, utilisable en parallèle de Cubase »). On ouvre ?