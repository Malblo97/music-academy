# Extraction module-05-instrumentation — Instrumentation

Table de suivi d'extraction (Phase 0, §2.1 du tutoriel) — reconstruite a posteriori le 2026-08-01 : l'extraction de ce module est déjà complète (`pnpm content:count` vert), cette table restaure la traçabilité promise, elle ne pilote plus un travail en cours.

**2026-08-01 — renumérotation.** Le module est rangé par famille d'instrument (cordes → bois → cuivres → claviers → percussions). Les 11 fiches MVP ont gardé leur contenu ; seul leur numéro `lXX` a changé là où l'insertion d'un instrument le décalait (flûte l06→l07, hautbois l07→l10, clarinette l08→l12, trompette l09→l16, cor l12→l17, piano l10→l21). Toutes les références croisées (intra-module et inter-modules M4/M6/M7/M8/M10) ont été mises à jour.

**2026-08-02 — extraction du lot V1.** Les **15 fiches** de `docs/production/s96-m05Fiches.md` sont extraites (découpage scripté, round-trip vérifié identique à la source). La source **regroupe les percussions** en deux fiches (`l25-claviers-de-percussion` couvre glockenspiel/xylophone/vibraphone/marimba ; `l26-percussions-orchestrales` couvre caisse claire, grosse caisse, cymbales, triangle, tam-tam, tambourin, woodblocks, castagnettes, claves) : le module compte donc **26 leçons**, non 37 comme le supposait le jeu de scaffolds provisoire. Voir décision n°27.

| Leçon | Instrument | Specs | Solutions | Quiz |
|---|---|---|---|---|
| m05-l01-palette | — (mode d'emploi) | — | — | ✓ |
| m05-l02-violins | Violons | ✓ 1 | ✓ 3 | ✓ |
| m05-l03-alto | Alto | — | — | ✓ |
| m05-l04-violoncelle | Violoncelle | — | — | ✓ |
| m05-l05-contrebasse | Contrebasse | — | — | ✓ |
| m05-l06-harpe | Harpe | — | — | ✓ |
| m05-l07-flute | Flûte | — | — | ✓ |
| m05-l08-piccolo | Piccolo | — | — | ✓ |
| m05-l09-flute-alto | Flûte alto | — | — | ✓ |
| m05-l10-hautbois | Hautbois | — | — | ✓ |
| m05-l11-cor-anglais | Cor anglais | — | — | ✓ |
| m05-l12-clarinette | Clarinette | — | — | ✓ |
| m05-l13-clarinette-basse | Clarinette basse | — | — | ✓ |
| m05-l14-basson | Basson | — | — | ✓ |
| m05-l15-contrebasson | Contrebasson | — | — | ✓ |
| m05-l16-trompette | Trompette | — | — | ✓ |
| m05-l17-french-horn | Cor (French Horn) | ✓ 1 | ✓ 3 | ✓ |
| m05-l18-trombone-tenor | Trombone ténor | — | — | ✓ |
| m05-l19-trombone-basse | Trombone basse | — | — | ✓ |
| m05-l20-tuba | Tuba | — | — | ✓ |
| m05-l21-piano | Piano | — | — | ✓ |
| m05-l22-celesta | Célesta | — | — | ✓ |
| m05-l23-orgue | Orgue | — | — | ✓ |
| m05-l24-timbales | Timbales | — | — | ✓ |
| m05-l25-claviers-de-percussion | Glockenspiel · xylophone · vibraphone · marimba | — | — | ✓ |
| m05-l26-percussions-orchestrales | Caisse claire · grosse caisse · cymbales · triangle · tam-tam · tambourin · woodblocks · castagnettes · claves | — | — | ✓ |

**Total** : 26 leçons (11 MVP + 15 V1) · 2 specs · 6 solutions · **26/26 quiz**.

**2026-08-02 — extraction des quiz.** Les 15 quiz manquants (75 items) sont extraits de `docs/production/s29.5-m05Quizzes.md` : JSON validé bloc par bloc (parsing strict, `why` présent partout, `answer` toujours incluse dans ses `options`), aucune collision — les 15 cibles étaient libres, le remapping d'IDs que §29.5 exigeait en tête ayant déjà été fait la veille. Cible `count.ts` portée de 11 à 26 ; les 26 `QuizBlock` du module résolvent tous.

**Reste ouvert : 14 assets référencés, aucun produit.** Les items `▶` du lot pointent `asset:m05-lXX-…` (4 `capture` de partition, 10 `playAsset` d'A/B de timbre) qui n'existent pas — `packages/content/assets/` ne contient que `la-remise`. Même statut que les 41 items de `quiz-todo.md` §1 ; à rapprocher de la sonothèque M12 (`s86-specifAssets.md`).

## Règles `orch.*` introduites par le lot V1

Les fiches V1 déclarent 8 règles absentes du registre `docs/production/s07-registreRegles.md` (qui n'en liste que 10, génériques) :

`orch.harp-pedal` · `orch.harp-hand` · `orch.timp-tuning` · `orch.mallet-choice` · `orch.perc-player-count` · `orch.organ-dynamics` · `orch.organ-acoustics` · `orch.trombone-slide`

Ce n'est pas une anomalie d'extraction : le dépôt connaissait déjà le précédent (`orch.horn-agility` et `orch.horn-endurance`, déclarées par la fiche cor `m05-l17`, sont elles aussi hors registre). Ces règles sont **spécifiques à un instrument** et n'ont pas encore d'implémentation — `packages/music-core/src/analyzers/orchestration.ts` et `packages/music-core/src/data/instruments.ts` sont vides à ce jour. À arbitrer en Phase 1 : étendre le registre §7 ou traiter ces identifiants comme une famille locale aux fiches.
