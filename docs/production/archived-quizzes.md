# Quiz archivés — variantes alternatives (décision n°6)

Reconstruit le 2026-08-01 : ce fichier est référencé comme existant par la décision n°6 de
`DECISIONS_LOCALES.md` (2026-07-XX) mais n'avait jamais été créé. Contenu : les deux quiz écrits dans
§29 (`docs/production/s29-m05l01LotQuiz.md`, section 29.2, « le lot de quiz représentatif ») pour les leçons
que le lot systématique §84 (`docs/production/s84-lotQuiz7.md`) a réécrites indépendamment sous les mêmes
sujets — collision d'ID que la décision n°6 tranche en faveur de §84.

## ⚠ Écart constaté en reconstruisant ce fichier

La décision n°6 dit explicitement « le §84 gagne » pour ces deux quiz. Or les fichiers actuellement commis
— `packages/content/modules/module-01-fondamentaux/quizzes/m01-l14-quiz.json` et `m01-l20-quiz.json` —
contiennent le texte **§29** ci-dessous, **verbatim**, pas la version §84. Autrement dit : la moitié de la
décision n°6 qui a été exécutée est l'archivage documenté ici (a posteriori) ; la moitié qui ne l'a pas été
est le remplacement du contenu vivant par la version §84. Voir la décision n°24 dans `DECISIONS_LOCALES.md`
pour la suite à donner (retranscrire §84 en JSON et remplacer, ou ratifier §29 comme version définitive) —
non tranché ici, cette page ne fait que consigner l'archive promise.

---

## m01-l14-quiz — version §29 (« tension/résolution »), archivée

*Source : §29.2, Quiz 1. Coexistait avec §84 §m01-l13 (« Tension et résolution : la dette »,
`s84-lotQuiz7.md` lignes 35–41) sous le même ID final `m01-l14-quiz` — la décision n°6 attribue le sujet à
la leçon m01-l14 (numérotation actuelle : `m01-l14-tension-resolution.mdx`).*

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

## m01-l20-quiz — version §29 (« substitutions »), archivée

*Source : §29.2, Quiz 2. Coexistait avec §84 §m01-l19 (« Le subV tritonique », `s84-lotQuiz7.md` lignes
78–83) sous le même ID final `m01-l20-quiz` — la décision n°6 attribue le sujet à la leçon m01-l20
(numérotation actuelle : `m01-l20-substitutions.mdx`).*

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
