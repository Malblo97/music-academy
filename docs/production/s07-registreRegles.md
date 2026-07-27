# SECTION 7 — LE REGISTRE DES RÈGLES (référentiel `music-core/rules`)

C'est le document le plus important du produit après le code lui-même : il alimente **à la fois** le moteur (détection, scoring), le contenu (`<RuleCard id="…" />`) et le feedback. Une règle = une carte. Format :

```
`domaine.nom` · sévérité · niveau d'activation
Détecte : condition algorithmique exacte
Pourquoi / Comment corriger / Quand ça s'applique / Erreur type / Alternative légitime
```

## 7.0 Conventions

**Sévérités et pénalités de base** (avant pondération de style) : `error` = 12 pts, `warning` = 5 pts, `suggestion` = 0 pt (affichée, jamais pénalisée). Amortisseur de répétition ×0.4 dès la 2e occurrence (cf. §4.2).

**Poids de style** `ruleWeights[ruleId] ∈ [0, 2]` : `0` = règle désactivée, `1` = normale, `2` = doublée. Wildcards autorisées (`counterpoint.* : 0`). Le poids module la pénalité **et** peut basculer la sévérité affichée (poids ≤ 0.3 → l'issue est rétrogradée en `suggestion` avec texte adapté).

**Niveau d'activation** (`appliesTo`) : la règle n'évalue pas en dessous du niveau indiqué — un débutant n'est pas noté sur ce qu'on ne lui a pas enseigné.

## 7.1 Profils de style (les 8 du MVP+V1)

| id | En une phrase | Signature de pondération |
|---|---|---|
| `strict-counterpoint` | Palestrina/Fux : le laboratoire des règles | tout à 1–2, aucune tolérance chromatique |
| `classical-common` | écriture tonale commune (chorals, classicisme) | VL strict, harmonie fonctionnelle stricte |
| `romantic-film` | lyrisme, chaleur, drame (romance, drame) | VL souple (0.7), chromatisme expressif toléré |
| `epic-film` | puissance, trailer, héroïsme | parallèles ≈ 0.1, orchestration surpondérée |
| `neo-noir` | ambiguïté, jazz sombre, non-résolution | résolutions ≈ 0.3, fluidité VL ×1.5 |
| `thriller-tension` | ostinatos, tension entretenue | monotonie inversée (la répétition est l'outil) |
| `jazz` | voicings, extensions, swing | tensions libres, `vl.parallel-*` ≈ 0.2, basse active |
| `hybrid-sd` | sound design, layering | règles tonales minimales, `orch.*` fréquentiel dominant |

---

## 7.2 Domaine `melody.*` (12 règles)

**`melody.out-of-key`** · warning · niv. 1+
Détecte : note hors de l'échelle du `KeyContext` sans résolution par demi-ton dans les 2 notes suivantes, et non expliquée comme note d'un accord chromatique reconnu (V/x, subV, emprunt).
Pourquoi : un chromatisme non résolu sonne comme une erreur, pas comme une couleur — l'oreille attend le remboursement.
Comment : résous par demi-ton (le plus souvent en sens contraire de l'approche), ou remplace par le degré diatonique voisin.
Quand : strict en `classical-common` ; poids 0.7 en `romantic-film` ; presque libre en `jazz` (blue notes, approches chromatiques).
Erreur type : « note sensible d'un ton voisin » plaquée sans y aller (fa♯ en do majeur qui redescend sur mi… puis erre).
Alternative : le chromatisme *planant* volontaire (néo-noir, SF) — assumé par le style, pas par accident.

**`melody.leap-recovery`** · warning · niv. 1+
Détecte : saut ≥ 6te non suivi, dans les 2 notes, d'un mouvement contraire majoritairement conjoint.
Pourquoi : un grand saut est une dépense d'énergie ; sans retour, la ligne se disloque et devient inchantable.
Comment : après le saut, redescends (ou remonte) par degrés conjoints dans la direction opposée.
Quand : quasi universel ; poids 0.6 en `epic-film` (les sauts héroïques enchaînés sont un idiome).
Erreur type : octave ascendante suivie d'une quarte ascendante « pour faire grandiose » — ça fait surtout désarticulé.
Alternative : le saut non compensé comme *geste* isolé (cri, appel) — une fois par phrase, pas trois.

**`melody.consecutive-leaps`** · warning · niv. 2+
Détecte : deux sauts ≥ 4te consécutifs dans la même direction dont la somme excède une octave, hors arpège d'un accord identifié.
Pourquoi : la ligne devient un exercice d'arpèges, plus une mélodie ; la voix (réelle ou intérieure) décroche.
Comment : intercale un mouvement conjoint, ou transforme franchement en arpège assumé de l'accord courant.
Quand : partout sauf si les notes épellent l'accord (l'arpège est légal et détecté comme tel).
Erreur type : « escalier de quartes » involontaire en cherchant de l'ampleur.
Alternative : fanfares et appels de cuivres — arpèges assumés, souvent en `epic-film`.

**`melody.range-excess`** · warning · niv. 2+
Détecte : ambitus > 13e (ou > `constraints.noteRange` si plus étroit) pour une mélodie destinée à une voix/un instrument mélodique.
Pourquoi : au-delà, aucune voix ne la chante et la plupart des instruments changent de couleur en cours de phrase — le thème perd son identité.
Comment : replie les extrêmes à l'octave ; garde l'extension pour LE climax.
Quand : mélodie vocale ou thème principal ; non évalué en écriture instrumentale virtuose explicite.
Erreur type : composer au piano roll sans « chanter » — l'ambitus enfle sans qu'on s'en rende compte.
Alternative : passage du thème d'un instrument à l'autre (relais de registre) — c'est de l'orchestration, plus de la mélodie.

**`melody.monotony`** · warning · niv. 2+
Détecte : motif (n-gramme d'intervalles+rythme, longueur ≥ 3) répété ≥ 4× **strictement à l'identique** sans aucune variation (transposition, rythme, ornement) ni changement de contexte harmonique.
Pourquoi : la répétition crée l'attente ; l'attente sans évolution devient de l'usure.
Comment : à la 3e occurrence, varie : transpose à la 2de, augmente/diminue le rythme, change l'harmonie dessous.
Quand : **inversé en `thriller-tension`** (poids 0 + la répétition alimente le craft : l'ostinato est l'outil du genre) ; poids 0.5 en `hybrid-sd`.
Erreur type : boucle de 2 mesures copiée-collée 8× « parce que ça sonne bien » — oui, deux fois.
Alternative : la répétition hypnotique volontaire (minimalisme, transe) — alors c'est la *texture autour* qui doit évoluer.

**`melody.no-motif`** · suggestion · niv. 3+
Détecte : aucun n-gramme (exact ou transposé) répété sur ≥ 8 mesures.
Pourquoi : sans cellule récurrente, rien à mémoriser — l'auditeur sort de la salle sans le thème.
Comment : choisis tes 3–5 premières notes comme motif ; réutilise-les au moins 2× (dont 1 variée).
Quand : thèmes et mélodies principales ; non pertinent pour transitions et textures.
Erreur type : « improviser en continu » et appeler ça une mélodie.
Alternative : musique atmosphérique délibérément athématique (drones, ambient) — profil `hybrid-sd`.

**`melody.tension-placement`** · warning · niv. 2+
Détecte : degré instable fort (7̂, 4̂, chromatique) tenu > 1 temps sur temps fort sans résolution dans le temps suivant.
Pourquoi : cf. leçon m01-l14 — la dette forte exige un remboursement proche.
Comment : résous 7̂→1̂, 4̂→3̂ ; ou raccourcis la note ; ou déplace-la sur temps faible (elle devient broderie).
Quand : poids 0 en `neo-noir` et `thriller-tension` (la dette permanente est le langage).
Erreur type : finir une demi-phrase sur 4̂ tenu « pour le suspense » — c'est juste inachevé, pas suspendu (le suspense se finit sur 5̂ ou 2̂).
Alternative : l'appoggiature expressive longue (romantisme) — tension forte, mais résolution *garantie et entendue*.

**`melody.climax`** · suggestion · niv. 3+
Détecte : (a) note culminante dans le premier tiers ; (b) deux culminations de même hauteur ; (c) courbe de tension plate (écart-type < seuil) alors que le mood cible demande une arche.
Pourquoi : le sommet est le point de mire de la phrase ; mal placé ou dupliqué, la dramaturgie s'effondre.
Comment : réserve la note la plus haute pour ~2/3 de la phrase ; s'il y a deux sommets, hausse le second ou supprime-le.
Quand : évalué contre le gabarit du `targetMood` (berceuse ≠ héroïque) — c'est du craft, jamais une pénalité brute.
Erreur type : commencer par la meilleure idée trop haut, puis passer 6 mesures à redescendre.
Alternative : l'anticlimax volontaire (comédie, ironie) — déclaré via mood `comic`.

**`melody.ending-weak`** · warning · niv. 1+
Détecte : dernière note ni sur 1̂/3̂/5̂ (si conclusion demandée), ou durée < 1 temps, ou position sur partie faible du temps — alors que `requiredCadence`/`mustEndOnDegrees` l'exigent.
Pourquoi : une fin est un atterrissage : degré stable + durée + temps fort. Il manque un des trois → sensation d'inachevé involontaire.
Comment : pose la finale sur temps fort, allonge-la (≥ blanche), choisis 1̂ (ferme) ou 3̂/5̂ (suspendu doux).
Quand : uniquement si l'exercice demande une conclusion ; la demi-cadence volontaire est un autre exercice.
Erreur type : finir sur 2̂ croche en l'air parce que « la boucle va recommencer » — alors dis-le (contrainte `mustLoop`).
Alternative : fin ouverte assumée (`neo-noir` : retour amputé, cf. m09-l03).

**`melody.tritone-leap`** · warning · niv. 3+
Détecte : saut mélodique de triton non inscrit dans un accord de dominante/dim reconnu.
Pourquoi : intervalle difficile à chanter et à justifier hors contexte dominant ; il « déchire » la ligne.
Comment : remplace par 4te juste ou 5te, ou fais-en les notes 3–7 d'un V7 explicite.
Quand : strict en `strict-counterpoint` et `classical-common` ; poids 0.3 en `thriller`/`neo-noir` (couleur d'inquiétude) ; libre en `jazz`.
Erreur type : triton accidentel en visant une quarte depuis une note chromatique.
Alternative : le triton-signature (SF, danger) — geste délibéré, souvent répété pour être compris comme motif.

**`melody.phrase-breathing`** · suggestion · niv. 2+
Détecte : > 8 mesures sans silence ≥ 1 temps ni note ≥ 2 temps (aucune respiration).
Pourquoi : une phrase sans respiration ne peut être ni chantée ni *entendue comme phrase* — l'oreille segmente ce que tu ne segmentes pas, souvent au mauvais endroit.
Comment : insère un silence ou une longue à la fin de chaque idée (souvent toutes les 2 ou 4 mesures).
Quand : mélodies ; non évalué sur ostinatos et arpèges d'accompagnement.
Erreur type : remplir chaque croche par peur du vide — le vide est ton allié (c'est là que vivent contrechants et dialogues).
Alternative : le moto perpetuo (action, poursuite) — la respiration passe alors dans l'harmonie et l'orchestration.

**`melody.static`** · suggestion · niv. 3+
Détecte : ambitus ≤ 3 demi-tons ET entropie intervallique quasi nulle sur ≥ 4 mesures, hors mood `tension`/`hypnotic`.
Pourquoi : sans mouvement, pas de direction ; la « mélodie » est en réalité une pédale rythmée.
Comment : ouvre l'ambitus progressivement, ou requalifie l'élément comme ostinato (rôle `texture`) et écris une vraie mélodie au-dessus.
Quand : craft uniquement, jamais bloquant.
Erreur type : psalmodie involontaire en composant depuis un pattern rythmique.
Alternative : récitatif sur corde unique + harmonie mouvante — un classique du thriller, alors c'est voulu et le profil le protège.

## 7.3 Domaine `harmony.*` (9 règles)

**`harmony.no-cadence`** · error · niv. 1+
Détecte : `requiredCadence` de la spec absente de la fenêtre finale (2–3 derniers accords + position métrique).
Pourquoi : la cadence demandée est l'objectif pédagogique de l'exercice — c'est le geste de ponctuation à acquérir.
Comment : construis V (fondamentale à la basse) → I sur temps fort pour la parfaite ; …→V pour la demi-cadence ; V→vi pour la rompue.
Quand : uniquement quand la spec l'exige.
Erreur type : IV→I en croyant écrire V→I (confusion sous-dominante/dominante — renvoi automatique vers m01-l16).
Alternative : aucune dans le cadre de l'exercice ; hors exercice, tout est ouvert.

**`harmony.retrogression`** · warning · niv. 3+
Détecte : mouvement fonctionnel D→S (ex. V→IV, V→ii) en contexte fonctionnel déclaré, hors idiomes reconnus (blues V→IV, cadence plagale après V–I conclusif).
Pourquoi : la dominante promet la tonique ; revenir en arrière casse la promesse et affaiblit les deux accords.
Comment : réordonne T→S→D→T ; ou si tu veux V→IV, assume le langage modal/rock (change de profil).
Quand : `classical-common` strict ; poids 0.2 en `epic-film` (le ♭VII→IV→I modal y est roi) ; 0 en `hybrid-sd`.
Erreur type : progression écrite « à l'oreille de guitariste » évaluée en style choral.
Alternative : l'harmonie modale ou en mouvement de basse pur (par tierces, chromatique) — d'autres logiques, pas des fautes.

**`harmony.unresolved-seventh`** · warning · niv. 3+
Détecte : 7e d'accord qui ne descend pas conjointement à l'accord suivant (et n'est pas tenue comme note commune légale).
Pourquoi : la 7e est une dissonance directionnelle — non résolue, elle laisse une voix « en l'air » que l'oreille suit.
Comment : fais-la descendre d'un degré (7e de V7 → 3̂ de I), ou tiens-la si elle appartient à l'accord suivant.
Quand : `classical-common`/`romantic-film` ; poids 0.2 en `jazz` (les 7e sont des couleurs stables du langage) ; 0 en `neo-noir`.
Erreur type : 7e qui saute à la basse au changement d'accord — deux fautes pour le prix d'une.
Alternative : la 7e planante des nappes (`hybrid-sd`) — sans conduite de voix, il n'y a rien à résoudre.

**`harmony.static-bass`** · suggestion · niv. 3+
Détecte : basse identique > 4 mesures alors que l'harmonie change, hors pédale déclarée/reconnue (tonique ou dominante tenue avec harmonies fonctionnelles au-dessus).
Pourquoi : la basse est le moteur du mouvement harmonique ; immobile par oubli, tout semble flotter sans intention.
Comment : donne à la basse les fondamentales, ou une ligne (descente diatonique/chromatique), ou déclare la pédale (c'est alors un effet puissant).
Quand : craft ; la pédale volontaire est *détectée* et créditée, pas pénalisée.
Erreur type : écrire les accords en position fondamentale serrée main gauche immobile — réflexe de pianiste débutant.
Alternative : pédale de dominante avant une arrivée (le plus vieux truc de tension du monde, et il marche toujours).

**`harmony.poor-vocab`** · suggestion · niv. 4+
Détecte : 100 % de triades à l'état fondamental sur ≥ 8 mesures dans un style qui attend des enrichissements (`jazz`, `neo-noir`, `romantic-film`).
Pourquoi : dans ces langages, la triade nue sonne « démo MIDI » ; les extensions sont le vocabulaire de base, pas un luxe.
Comment : commence par add9 et maj7/m7 sur les fonctions T et S ; garde les triades pour les moments de clarté voulue.
Quand : jamais en `classical-common`/`strict-counterpoint` (la triade y est la norme).
Erreur type : plaquer des 9e partout d'un coup après cette remarque — l'enrichissement se dose (renvoi m03-l07).
Alternative : la triade pure comme *choix* de dépouillement (folk, pureté) — cohérence globale = pas d'issue levée.

**`harmony.overchromatic`** · warning · niv. 5+
Détecte : > 40 % d'accords hors diatonisme sans logique identifiable (ni dominantes secondaires en chaîne, ni séquence, ni basse chromatique) — mesuré par l'échec des heuristiques d'explication.
Pourquoi : le chromatisme sans fil conducteur détruit le centre tonal *par accident* ; l'auditeur ne sait plus où il est — et toi non plus.
Comment : choisis UN fil : basse chromatique, chaîne de V/x, ou médiantes — et tiens-le.
Quand : non évalué si l'exercice est explicitement atonal/modal libre.
Erreur type : « accords qui sonnent bien » enchaînés depuis des presets, sans parcours.
Alternative : le planing (accords parallèles chromatiques, Debussy→film) — logique de *mouvement*, détectée et acceptée.

**`harmony.tritone-sub-resolution`** · warning · niv. 6+
Détecte : subV7 dont la basse ne descend pas par demi-ton vers la cible (ex. D♭7 → autre chose que C).
Pourquoi : toute la valeur de la substitution tritonique EST la basse chromatique descendante ; sans elle, c'est juste un accord étranger.
Comment : subV7(♯11) → cible un demi-ton dessous, en gardant le triton commun (3–7) quasi immobile.
Quand : `jazz`, `neo-noir` — les seuls profils où la règle s'active.
Erreur type : placer D♭7 avant G7 « pour la couleur » (c'est l'inverse : il *remplace* G7).
Alternative : ♭II utilisé comme napolitain (autre fonction, autre règle) — l'analyseur distingue par le contexte.

**`harmony.loop-coherence`** · warning · niv. 4+
Détecte : sous `mustLoop`, dernier accord → premier accord formant soit une cadence parfaite interdite, soit une jonction sans aucune note commune ni mouvement conjoint de basse.
Pourquoi : une boucle est un cercle — la couture doit être aussi soignée que le reste, et invisible.
Comment : termine sur un accord qui *appelle doucement* le premier (note commune, basse conjointe, ou dominante faible du premier accord).
Quand : exercices à boucle (`neo-noir`, `thriller`, `hybrid-sd`).
Erreur type : boucle testée une fois du début à la fin, jamais *en boucle*.
Alternative : la couture-surprise volontaire (jump-cut harmonique) — rare, à réserver quand la scène coupe aussi.

**`harmony.suggestion-engine`** · suggestion · niv. 2+
Famille générative (cf. §4.1.3 : `sub.relative`, `sub.tritone`, `enrich.add9`, `sub.borrowed-iv`, `sub.secondary-dom`, `reharm.line-cliche`). Jamais pénalisante : propose, joue, explique. Chaque proposition porte sa propre carte pédagogique — elles vivent dans le même registre pour que `<RuleCard>` les affiche dans les leçons du Module 3.

## 7.4 Domaine `voiceLeading.*` (10 règles)

**`vl.parallel-fifths`** · error · niv. 3+
Détecte : 5te juste entre deux voix sur deux verticalités consécutives, mouvement parallèle (antiparallèles 5te→12te incluses en strict).
Pourquoi : les deux voix fusionnent acoustiquement — tu perds une voix d'indépendance, ce qui est le contraire du but de l'écriture à N voix.
Comment : mouvement contraire ou oblique de l'une des deux ; ou change le doublement de l'accord d'arrivée.
Quand : LA règle-signature du style : 1.5 en `strict-counterpoint`, 1.0 en `classical-common`, 0.7 `romantic-film`, **0.1 `epic-film`** (le son « puissance brute » les emploie), 0.2 `jazz`, 0.3 `neo-noir`.
Erreur type : soprano et basse en dixièmes… mais alto et ténor en quintes — vérifier TOUTES les paires.
Alternative : le planing de quintes assumé (organum moderne, trailer) — texte pédagogique surchargé par le profil (cf. §4.1.5).

**`vl.parallel-octaves`** · error · niv. 3+
Détecte : idem, octaves/unissons — en distinguant la **doublure d'orchestration** (deux parts déclarées en doublure ou colinéaires sur toute la durée) de la faute d'écriture (indépendance perdue ponctuellement).
Pourquoi : même fusion, plus radicale.
Comment : idem quintes ; ou déclare la doublure (rôle identique) — alors c'est de l'orchestration légitime.
Quand : partout en écriture à voix réelles ; jamais entre parts en doublure assumée.
Erreur type : croire que doubler la basse à l'octave « enrichit » un choral à 4 voix — non, il n'a plus que 3 voix.
Alternative : la doublure d'octaves orchestrale — le pain quotidien du métier, hors périmètre de la règle.

**`vl.hidden-fifths`** · warning · niv. 5+
Détecte : mouvement direct des voix extrêmes vers 5te/8ve avec soprano arrivant par saut.
Pourquoi : l'oreille « entend » la parallèle fantôme ; l'arrivée est brutale.
Comment : fais arriver le soprano par mouvement conjoint, ou casse le mouvement direct.
Quand : `strict-counterpoint` et `classical-common` seulement, voix extrêmes seulement.
Erreur type : cadence V–I avec soprano sautant 5̂→1̂ et basse 5̂→1̂ — l'exception historique (autorisée à la cadence) est reconnue par l'analyseur.
Alternative : hors style strict, personne ne s'en soucie — la règle dort.

**`vl.voice-crossing`** · warning · niv. 3+
Détecte : voix a sous voix b alors que a est déclarée supérieure, sur une verticalité.
Pourquoi : l'auditeur suit les lignes par registre ; le croisement brouille l'identité des voix.
Comment : réécris l'une des deux dans son couloir ; ou échange les notes entre voix.
Quand : strict à 4 voix vocales ; toléré ponctuellement en écriture instrumentale (poids 0.5) où les timbres différencient.
Erreur type : croisement alto/ténor invisible au piano roll (même couleur) — le roll colore par voix pour ça.
Alternative : le croisement-timbre volontaire (cor au-dessus des altos) — c'est de l'orchestration, déclaré par les rôles.

**`vl.overlap`** · warning · niv. 5+
Détecte : une voix dépasse la position *précédente* de sa voisine (chevauchement temporel).
Pourquoi : version diachronique du croisement — la ligne de qui est-ce, au juste ?
Comment : réduis le saut de la voix fautive ; l'espace entre voix doit rester lisible d'un accord à l'autre.
Quand : styles stricts uniquement.
Erreur type : basse qui saute une octave et « passe au travers » du ténor.
Alternative : néant en strict ; ailleurs, la règle dort.

**`vl.spacing`** · warning · niv. 3+
Détecte : > 8ve entre voix adjacentes supérieures (S–A, A–T) ; basse libre.
Pourquoi : le tissu se troue — l'harmonie sonne creuse au milieu.
Comment : resserre les voix supérieures ; la grande distance appartient à la basse.
Quand : écriture à 4 voix ; en voicings jazz, remplacée par les conventions drop 2/3 (écarts caractéristiques whitelistés).
Erreur type : main droite serrée aiguë + main gauche fondamentale grave, rien entre — le « trou de ténor ».
Alternative : le voicing ouvert délibéré (cordes divisi éthérées) — profil `hybrid-sd`/`romantic-film`, poids réduit.

**`vl.leading-tone-resolution`** · error · niv. 3+
Détecte : sensible dans une voix extrême non résolue à la tonique sur I (voix internes : tolérance « frustrée » descendant à 5̂ pour compléter l'accord, reconnue).
Pourquoi : l'attraction maximale du système (m01-l14) — la trahir dans une voix exposée, tout le monde l'entend.
Comment : 7̂→1̂ dans la même voix ; en voix interne, la frustration classique est acceptée.
Quand : partout où V→I existe ; 0.4 en `neo-noir` (où V→I lui-même est évité).
Erreur type : sensible au soprano qui saute à 5̂ « pour la belle note » — mets la belle note dans une autre voix.
Alternative : résolution transférée (la tonique arrive dans une autre voix, geste romantique) — détectée, rétrogradée en suggestion.

**`vl.augmented-second`** · warning · niv. 5+
Détecte : 2de augmentée mélodique (typiquement 6̂–7̂♯ en mineur harmonique) en style strict.
Pourquoi : intervalle jugé inchantable dans l'esthétique vocale classique — il « sent » l'accident de gamme.
Comment : passe par le mineur mélodique (6̂♯) en montant, ou contourne.
Quand : `strict-counterpoint`/`classical-common` uniquement — **poids 0 partout ailleurs** : c'est un intervalle-signature (musiques d'Europe de l'Est, orientalisantes, flamenco) précieux au cinéma.
Erreur type : l'éviter par réflexe scolaire dans un score « désert/orient » où il est exactement la couleur attendue.
Alternative : voir ci-dessus — la moitié des mondes de fantasy vit sur cet intervalle.

**`vl.doubled-leading-tone`** · error · niv. 4+
Détecte : sensible présente dans deux voix d'une même verticalité.
Pourquoi : deux voix devront résoudre au même endroit → octaves parallèles garanties ou résolution trahie.
Comment : double la fondamentale ou la quinte, jamais la sensible (ni la 7e).
Quand : écriture à voix ; sans objet en nappes/doublures orchestrales.
Erreur type : V en premier renversement avec sensible à la basse ET au soprano.
Alternative : aucune — c'est une des rares règles sans contre-usage en écriture à voix réelles.

**`vl.smoothness`** · métrique de craft · niv. 4+
Mesure (pas une violation) : somme des déplacements de toutes les voix entre verticalités. Alimente le craft, surpondérée ×1.5 en `neo-noir` et `jazz` (voicings lents et exposés) : chaque voix qui saute inutilement coûte.
Pédagogie : « le meilleur voice leading est celui qu'on ne remarque pas — notes communes tenues, le reste au plus court. »

## 7.5 Domaine `counterpoint.*` (6 règles paramétrées par espèce)

Activées uniquement par les exercices `COUNTERPOINT` (profil `strict-counterpoint`), paramètre `species: 1..5`.

**`cpt.dissonance-treatment`** · error
Détecte : dissonance verticale illégale pour l'espèce — 1re : toute dissonance ; 2e/3e : dissonance sur temps fort, ou sur temps faible non approchée/quittée conjointement ; 4e : dissonance non préparée-suspendue-résolue ; 5e : combinaison + plafond de densité.
Pédagogie : c'est LE cœur du contrepoint — la dissonance n'est jamais interdite, elle est *disciplinée* (préparée, passée, résolue). L'idiome **cambiata** est whitelisté en 3e espèce et signalé positivement quand détecté.

**`cpt.begin-end`** · error — départ et arrivée sur consonance parfaite (unisson/5te/8ve), arrivée par mouvement obligé (sensible ou sus-tonique selon la position du contrepoint).
**`cpt.climax-unique`** · warning — la voix ajoutée doit avoir un sommet unique, non répété, idéalement non simultané avec celui du cantus firmus (deux histoires, deux sommets).
**`cpt.contrary-ratio`** · warning — proportion de mouvement contraire+oblique < 50 % ⇒ les voix « marchent ensemble » au lieu de dialoguer.
**`cpt.melodic-legality`** · error — dans la voix ajoutée : sauts interdits en strict (7e, intervalles augmentés/diminués, > 8ve), et tout saut ≥ 5te compensé (durcissement local de `melody.leap-recovery`).
**`cpt.suspension-chain`** · suggestion (4e espèce) — crédite les chaînes 7-6/4-3 correctement enchaînées (craft positif : la syncope est le but de l'espèce).

Application moderne (Module 4, leçons « contrechant de film ») : les mêmes règles rechargées avec le profil du style courant — un contrechant `romantic-film` est évalué avec `cpt.dissonance-treatment` à 0.5 et `vl.smoothness` ×1.5. **Le contrepoint n'est pas un musée : c'est le moteur des contrechants**, et le registre le rend explicite.

## 7.6 Domaine `rhythm.*` (5 règles)

**`rhythm.meter-integrity`** · error · niv. 1+ — mesures incomplètes/excédentaires vs `meter`, notes chevauchant la barre sans liaison. Pédagogie : la mesure est le contrat de lecture ; on le rompt par la syncope (volontaire), pas par le débordement (accident).
**`rhythm.monotony`** · suggestion · niv. 2+ — entropie des durées quasi nulle sur ≥ 4 mesures hors ostinato déclaré/mood tension. Comment : introduis UNE valeur contrastante par phrase (une longue dans un flux de croches, ou l'inverse).
**`rhythm.syncopation-target`** · métrique de craft — taux de syncope comparé à la cible du style : `classical-common` bas, `jazz` élevé, `neo-noir` doux. Trop OU trop peu éloigne du langage ; jamais une « faute », toujours un écart mesuré au genre.
**`rhythm.density-tempo`** · warning · niv. 3+ — densité d'attaques incompatible avec le tempo (doubles-croches continues à ♩=180 : injouable/illisible). Comment : divise la densité par deux ou le tempo l'exige vraiment (alors instrumentation agile requise → croise `orch.agility`).
**`rhythm.ending-position`** · warning · niv. 2+ — conclusion demandée mais dernière attaque sur subdivision faible. Jumelle rythmique de `melody.ending-weak` (les deux se lèvent souvent ensemble → le FeedbackEngine les fusionne en une seule issue « ta fin n'atterrit pas »).

## 7.7 Domaine `orch.*` (10 règles)

**`orch.range-violation`** · error · niv. 1+ — note hors `range` praticable de l'instrument. Pas de débat : la note n'existe pas sur l'instrument. Comment : transpose le passage ou change d'instrument (le feedback propose les instruments du pool couvrant le registre).
**`orch.register-color`** · info · niv. 2+ — passage hors `sweetSpot` : jamais pénalisé, toujours *décrit* avec la couleur de zone (« ta flûte est dans le grave : velouté mais inaudible sous les cordes — exposé ou doublé ? »). C'est la règle la plus « mentor » du registre : elle enseigne la couleur, elle ne corrige pas.
**`orch.density-overload`** · warning · niv. 4+ — `densityMap` : puissance cumulée > seuil dans une bande registre×temps. Comment : retire, éclaircis, ou étage les registres — la puissance vient de l'espace, pas de l'empilement (leçon M7).
**`orch.masking`** · warning · niv. 4+ — deux parts de rôles différents, même bande, dynamiques proches (`dynamicPower` à ±2). Le feedback nomme les deux parts et propose : écarter d'une octave, différencier les dynamiques, ou décaler dans le temps.
**`orch.balance`** · warning · niv. 4+ — puissance cumulée de l'accompagnement > mélodie + marge. Erreur type : un hautbois solo « soutenu » par tutti cuivres mf. Comment : la mélodie gagne par le registre dégagé et la doublure, pas en montant son fader (il n'y a pas de fader dans un orchestre).
**`orch.role-coverage`** · suggestion · niv. 3+ — rôle requis absent (`requiredRoles`) ou trou fonctionnel (pas de basse). Jamais bloquant hors contrainte explicite : « pas de basse : l'orchestre flotte — voulu ? »
**`orch.endurance`** · warning · niv. 5+ — dépassement des limites physiologiques par instrument (cuivres aigus tenus, bois sans respiration > 8 mesures, cf. fiche cor). Pourquoi : en samples tu ne l'entends pas ; en session tu le paies — et le produit forme à l'écriture *réelle*.
**`orch.agility`** · warning · niv. 4+ — densité d'attaques > capacité `agility` de l'instrument (traits rapides au tuba, trilles de timbales chromatiques…). Propose les instruments du pool qui tiennent le trait.
**`orch.blend-risk`** · info · niv. 5+ — paire `avoidWith` détectée dans la configuration à risque (cor+trompette unisson ff). Info sourcée depuis la base d'instruments, avec la `reason`.
**`orch.low-interval-limit`** · warning · niv. 5+ — intervalles serrés (3ces, 2des, même 4tes) sous ~`C3` entre parts graves. Pourquoi : dans le grave, les harmoniques se brouillent — la « boue » orchestrale classique. Comment : écarte (8ves, 5tes) sous C3 ; garde les positions serrées pour le médium. Quand : universel, y compris en `hybrid-sd` (le sub veut être seul). Erreur type : plaquer au piano roll un voicing de main droite… deux octaves plus bas.

## 7.8 Matrice de pondération (extrait des règles discriminantes)

Défaut = 1.0 partout ; seules les valeurs ≠ 1.0 sont listées. `—` = 1.0.

| Règle | strict-cpt | classical | romantic | epic | neo-noir | thriller | jazz | hybrid-sd |
|---|---|---|---|---|---|---|---|---|
| vl.parallel-fifths | 1.5 | — | 0.7 | **0.1** | 0.3 | 0.5 | 0.2 | 0.1 |
| vl.parallel-octaves | 1.5 | — | 0.8 | 0.3¹ | 0.5 | 0.5 | 0.3 | 0.2 |
| vl.leading-tone-resolution | 1.5 | — | 0.8 | 0.6 | **0.4** | 0.5 | 0.3 | 0.2 |
| vl.augmented-second | 1.5 | 1.0 | **0** | **0** | **0** | **0** | **0** | **0** |
| vl.smoothness (craft ×) | — | — | 1.2 | 0.8 | **1.5** | 1.0 | **1.5** | 0.8 |
| melody.out-of-key | 1.5 | — | 0.7 | 0.8 | 0.5 | 0.6 | **0.3** | 0.4 |
| melody.monotony | — | — | — | 0.8 | 0.6 | **0**² | 0.8 | 0.5 |
| melody.tension-placement | 1.2 | — | — | 0.8 | **0** | **0** | 0.5 | 0.3 |
| melody.tritone-leap | 1.5 | — | 0.8 | 0.6 | 0.3 | 0.3 | **0.1** | 0.3 |
| harmony.retrogression | 1.2 | — | 0.7 | **0.2** | 0.4 | 0.5 | 0.5 | **0** |
| harmony.unresolved-seventh | 1.5 | — | 0.8 | 0.6 | **0** | 0.4 | **0.2** | **0** |
| harmony.poor-vocab | 0³ | 0³ | 0.8 | 0.5 | 1.2 | 0.7 | **1.5** | 0.5 |
| rhythm.syncopation-target (cible) | basse | basse | modérée | modérée | douce | forte | **forte** | libre |
| orch.density-overload | — | — | — | 1.5 | **1.8** | 1.2 | — | 1.5 |
| counterpoint.* | actives | 0.5 | 0 | 0 | 0 | 0 | 0 | 0 |

¹ hors doublures déclarées (toujours légales). ² la répétition devient un critère de craft *positif*. ³ la triade est la norme du style, la règle dort.

**Lecture pédagogique de la matrice** : elle EST le programme du produit. Un élève qui parcourt les colonnes comprend que la musique n'a pas *des règles*, mais *des langages* — chacun étant un jeu de pondérations cohérent. Cette matrice sera d'ailleurs rendue navigable dans le produit (leçon interactive du Module 9 : « choisis un style, vois ce qui compte »).

## 7.9 Gouvernance du registre

1. **Nommage** : `domaine.kebab-case`, jamais renommé — les IDs sont cités dans les leçons MDX et les rapports archivés. Dépréciation : `deprecated: true` + règle successeure, jamais de suppression.
2. **Toute nouvelle règle exige** : ≥ 5 fixtures positives + 5 négatives (dont 2 cas-limites), la carte pédagogique complète (les 5 champs), ses poids pour les 8 profils (décision explicite, pas de défaut silencieux), et une relecture par un musicien.
3. **Tout changement de sévérité, seuil ou poids** ⇒ bump de `engineVer` (les scores archivés restent explicables, cf. §2.2) + entrée changelog lisible par l'utilisateur (« la règle X est maintenant plus tolérante en style Y, voici pourquoi »).
4. **Faux positifs de la beta** (bouton « feedback injuste ») : triage hebdo → soit fixture négative + correction de seuil, soit amélioration du texte (souvent, la règle a raison mais s'explique mal — c'est un bug pédagogique, pas algorithmique).
5. **Volumétrie cible V1** : ~52 règles actives (les ~46 ci-dessus + sixtes augmentées, N6, planing détecté, modulations, et 3–4 règles `sd.*` pour le layering : conflit de sub, largeur stéréo du grave, saturation de bande).

---

**Point de confirmation.** Le référentiel est posé — c'est lui que le code de `music-core` implémente règle par règle et que les leçons citent. Suites possibles : **(b)** le squelette TypeScript réel de `music-core` (types, registre de règles en code, implémentations complètes de `keyDetect` et `detectChord`), ou **(c)** la rédaction en série des leçons du Module 1. Je pars sur quoi ?