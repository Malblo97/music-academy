Plan de chaînage retenu, dans l'ordre des dépendances : **(e)** d'abord — les `styleProfiles.ts` sont courts et verrouillent la matrice §7.8 en code ; puis **(d)** — le deuxième étage du moteur (`findMotifs`, `tensionCurve`, pipeline voice leading), car les leçons y font référence ; enfin **(c)** — lancement de la série Module 1 avec le sommaire complet des 25 leçons + les 2 premières rédigées intégralement. C'est l'ordre qui fait que chaque livrable s'appuie sur le précédent.

---

# SECTION 9 — `rules/styleProfiles.ts` (la matrice §7.8 en code)

```typescript
import type { Pedagogy } from "./types";

export interface StyleProfile {
  id: string;
  label: string;
  description: string;                       // affiché dans l'UI de l'Exercise Runner
  ruleWeights: Record<string, number>;       // wildcards "domaine.*" autorisées
  craftMultipliers?: Record<string, number>; // vl.smoothness ×1.5, etc.
  craftTargets?: {
    syncopation?: [number, number];          // fenêtre cible [min, max] 0..1
    repetitionIsPositive?: boolean;          // thriller : ostinato = craft +
  };
}

/** Résolution des poids : exact > wildcard > défaut 1.0. Appelée UNE fois
 *  par analyse (l'engine reçoit des poids déjà expansés, cf. §8.3). */
export function resolveWeights(
  profile: StyleProfile,
  ruleIds: readonly string[],
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of ruleIds) {
    if (id in profile.ruleWeights) { out[id] = profile.ruleWeights[id]; continue; }
    const domain = id.split(".")[0] + ".*";
    out[id] = profile.ruleWeights[domain] ?? 1.0;
  }
  return out;
}

export const STYLE_PROFILES: Record<string, StyleProfile> = {
  "strict-counterpoint": {
    id: "strict-counterpoint",
    label: "Contrepoint strict",
    description: "Le laboratoire des règles : aucune tolérance, c'est le but.",
    ruleWeights: {
      "vl.parallel-fifths": 1.5, "vl.parallel-octaves": 1.5,
      "vl.leading-tone-resolution": 1.5, "vl.augmented-second": 1.5,
      "vl.hidden-fifths": 1.0, "vl.overlap": 1.0,
      "melody.out-of-key": 1.5, "melody.tension-placement": 1.2,
      "melody.tritone-leap": 1.5,
      "harmony.retrogression": 1.2, "harmony.unresolved-seventh": 1.5,
      "harmony.poor-vocab": 0,
      "counterpoint.*": 1.0,
      "rhythm.syncopation-target": 1.0,
    },
    craftTargets: { syncopation: [0, 0.15] },
  },

  "classical-common": {
    id: "classical-common",
    label: "Écriture classique commune",
    description: "Chorals et style tonal commun : la référence.",
    ruleWeights: {
      "harmony.poor-vocab": 0,
      "counterpoint.*": 0.5,
    },
    craftTargets: { syncopation: [0, 0.2] },
  },

  "romantic-film": {
    id: "romantic-film",
    label: "Lyrisme romantique / drame",
    description: "Chaleur, chromatisme expressif, voice leading souple.",
    ruleWeights: {
      "vl.parallel-fifths": 0.7, "vl.parallel-octaves": 0.8,
      "vl.leading-tone-resolution": 0.8, "vl.augmented-second": 0,
      "vl.hidden-fifths": 0,
      "melody.out-of-key": 0.7, "melody.tritone-leap": 0.8,
      "harmony.retrogression": 0.7, "harmony.unresolved-seventh": 0.8,
      "harmony.poor-vocab": 0.8,
      "counterpoint.*": 0,
    },
    craftMultipliers: { "vl.smoothness": 1.2 },
    craftTargets: { syncopation: [0.1, 0.35] },
  },

  "epic-film": {
    id: "epic-film",
    label: "Épique / trailer",
    description: "Puissance brute : les parallèles sont une couleur, l'orchestration est reine.",
    ruleWeights: {
      "vl.parallel-fifths": 0.1, "vl.parallel-octaves": 0.3,
      "vl.leading-tone-resolution": 0.6, "vl.augmented-second": 0,
      "vl.hidden-fifths": 0,
      "melody.out-of-key": 0.8, "melody.leap-recovery": 0.6,
      "melody.monotony": 0.8, "melody.tension-placement": 0.8,
      "melody.tritone-leap": 0.6,
      "harmony.retrogression": 0.2, "harmony.unresolved-seventh": 0.6,
      "harmony.poor-vocab": 0.5,
      "orch.density-overload": 1.5, "orch.balance": 1.5, "orch.masking": 1.5,
      "counterpoint.*": 0,
    },
    craftMultipliers: { "vl.smoothness": 0.8 },
    craftTargets: { syncopation: [0.1, 0.35] },
  },

  "neo-noir": {
    id: "neo-noir",
    label: "Néo-noir",
    description: "Ambiguïté, non-résolution, espace : la dette de tension est un mode de vie.",
    ruleWeights: {
      "vl.parallel-fifths": 0.3, "vl.parallel-octaves": 0.5,
      "vl.leading-tone-resolution": 0.4, "vl.augmented-second": 0,
      "vl.hidden-fifths": 0,
      "melody.out-of-key": 0.5, "melody.monotony": 0.6,
      "melody.tension-placement": 0, "melody.tritone-leap": 0.3,
      "harmony.retrogression": 0.4, "harmony.unresolved-seventh": 0,
      "harmony.unresolved-tension": 0, "harmony.poor-vocab": 1.2,
      "harmony.tritone-sub-resolution": 1.0, "harmony.loop-coherence": 1.0,
      "orch.density-overload": 1.8,
      "counterpoint.*": 0,
    },
    craftMultipliers: { "vl.smoothness": 1.5 },
    craftTargets: { syncopation: [0.1, 0.3] },
  },

  "thriller-tension": {
    id: "thriller-tension",
    label: "Thriller / tension",
    description: "Ostinatos, tension entretenue : la répétition est l'outil, pas le défaut.",
    ruleWeights: {
      "vl.parallel-fifths": 0.5, "vl.parallel-octaves": 0.5,
      "vl.leading-tone-resolution": 0.5, "vl.augmented-second": 0,
      "vl.hidden-fifths": 0,
      "melody.monotony": 0, "melody.tension-placement": 0,
      "melody.out-of-key": 0.6, "melody.tritone-leap": 0.3,
      "harmony.retrogression": 0.5, "harmony.unresolved-seventh": 0.4,
      "harmony.poor-vocab": 0.7, "harmony.loop-coherence": 1.0,
      "orch.density-overload": 1.2,
      "counterpoint.*": 0,
    },
    craftTargets: { syncopation: [0.25, 0.6], repetitionIsPositive: true },
  },

  "jazz": {
    id: "jazz",
    label: "Jazz",
    description: "Les tensions sont des couleurs habitables ; la basse et le voicing font la loi.",
    ruleWeights: {
      "vl.parallel-fifths": 0.2, "vl.parallel-octaves": 0.3,
      "vl.leading-tone-resolution": 0.3, "vl.augmented-second": 0,
      "vl.hidden-fifths": 0, "vl.spacing": 0.3,   // remplacé par conventions drop 2/3
      "melody.out-of-key": 0.3, "melody.monotony": 0.8,
      "melody.tension-placement": 0.5, "melody.tritone-leap": 0.1,
      "harmony.retrogression": 0.5, "harmony.unresolved-seventh": 0.2,
      "harmony.poor-vocab": 1.5, "harmony.tritone-sub-resolution": 1.0,
      "counterpoint.*": 0,
    },
    craftMultipliers: { "vl.smoothness": 1.5 },
    craftTargets: { syncopation: [0.35, 0.7] },
  },

  "hybrid-sd": {
    id: "hybrid-sd",
    label: "Hybride / sound design",
    description: "Règles tonales minimales ; le fréquentiel et l'espace dominent.",
    ruleWeights: {
      "vl.parallel-fifths": 0.1, "vl.parallel-octaves": 0.2,
      "vl.leading-tone-resolution": 0.2, "vl.augmented-second": 0,
      "vl.hidden-fifths": 0, "vl.spacing": 0.5,
      "melody.out-of-key": 0.4, "melody.monotony": 0.5,
      "melody.tension-placement": 0.3, "melody.no-motif": 0,
      "harmony.retrogression": 0, "harmony.unresolved-seventh": 0,
      "harmony.poor-vocab": 0.5,
      "orch.density-overload": 1.5, "orch.low-interval-limit": 1.0,
      "counterpoint.*": 0,
    },
    craftMultipliers: { "vl.smoothness": 0.8 },
    craftTargets: { syncopation: [0, 1] },   // libre
  },
};
```

Test de cohérence ajouté à la CI : chaque profil est passé sur les fixtures des exercices A/B/C (§5.4) — l'exercice B (`neo-noir`) doit produire **zéro** pénalité `harmony.unresolved-seventh`, et l'exercice C (`epic-film`) doit rétrograder `vl.parallel-fifths` en suggestion. Si un refactor casse ça, la matrice a divergé du code.