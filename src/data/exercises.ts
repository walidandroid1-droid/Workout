import { Exercise, WarmupExercise, CooldownExercise, WeekSettings } from '../types';

export const WARMUP_EXERCISES: WarmupExercise[] = [
  {
    id: 1,
    name: "Jumping Jacks",
    duration: 30,
    description: "Sauts avec écartement des bras et des jambes à un rythme régulier."
  },
  {
    id: 2,
    name: "Rotations des bras",
    duration: 30,
    description: "Petits cercles avec les bras tendus à l'horizontale, puis cercles plus grands."
  },
  {
    id: 3,
    name: "Montées de genoux",
    duration: 30,
    description: "Amenez alternativement vos genoux à la hauteur des hanches de manière dynamique."
  },
  {
    id: 4,
    name: "Talons-fesses",
    duration: 30,
    description: "Amenez alternativement vos talons vers les fessiers à un rythme cardio soutenu."
  },
  {
    id: 5,
    name: "Squats légers",
    duration: 30,
    description: "Fléchissez les genoux modérément pour réchauffer les cuisses et articulations du bas."
  },
  {
    id: 6,
    name: "Planche active",
    duration: 30,
    description: "Position de gainage abdominal modéré sur les avant-bras ou les mains."
  }
];

export const MAIN_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: "POMPES",
    baseReps: "10-20 RÉP",
    isTimeBased: false,
    minReps: 10,
    maxReps: 20,
    description: "Pompes militaires classiques au sol, corps bien aligné et coudes le long du corps.",
    tips: "Gardez le gainage abdominal constant et amenez la poitrine près du sol."
  },
  {
    id: 2,
    name: "SQUATS",
    baseReps: "15-25 RÉP",
    isTimeBased: false,
    minReps: 15,
    maxReps: 25,
    description: "Position debout, descente des fesses sous l'horizontale, genoux alignés avec les orteils.",
    tips: "Poussez sur les talons et maintenez le dos bien droit pendant toute la descente."
  },
  {
    id: 3,
    name: "MOUNTAIN CLIMBERS",
    baseReps: "20-40 SEC",
    baseDuration: 30,
    isTimeBased: true,
    minReps: 20,
    maxReps: 40,
    description: "Position pompe, engagez les genoux alternativement vers la poitrine à haute vitesse.",
    tips: "Gardez les fesses basses et alignées. Ne suspendez pas vos hanches trop haut."
  },
  {
    id: 4,
    name: "FENTES ALTERNÉES",
    subName: "(OU SUR SANS CHAISE)",
    baseReps: "12-20 RÉP / JAMBE",
    isTimeBased: false,
    minReps: 12,
    maxReps: 20,
    description: "Pas en avant, flexion des deux genoux à 90°, puis retour explosif à la position de départ.",
    tips: "Le genou avant ne doit jamais dépasser la pointe de votre pied."
  },
  {
    id: 5,
    name: "BURPEES",
    baseReps: "8-15 RÉP",
    isTimeBased: false,
    minReps: 8,
    maxReps: 15,
    description: "Enchaînement squat, planche (avec pompe si possible), ramenez les pieds et sautez haut.",
    tips: "Amortissez la descente et gardez le contrôle lors du saut en extension."
  },
  {
    id: 6,
    name: "DIPS",
    subName: "(OU SUR BANC/CHAISE)",
    baseReps: "10-20 RÉP",
    isTimeBased: false,
    minReps: 10,
    maxReps: 20,
    description: "Mains appuyées sur un banc ou une chaise derrière vous, fléchissez puis tendez les bras.",
    tips: "Gardez les omoplates resserrées et frôlez le bord du banc en descendant."
  },
  {
    id: 7,
    name: "PLANCHE",
    baseReps: "30-60 SEC",
    baseDuration: 45,
    isTimeBased: true,
    minReps: 30,
    maxReps: 60,
    description: "Gainage horizontal statique sur les coudes et la pointe des pieds, bassin rétro-versé.",
    tips: "Serrez les fessiers et rentrez le nombril vers la colonne vertébrale, respirez régulièrement."
  },
  {
    id: 8,
    name: "RUSSIAN TWIST",
    baseReps: "20-30 RÉP",
    isTimeBased: false,
    minReps: 20,
    maxReps: 30,
    description: "Assis au sol, jambes fléchies soulevées, effectuez des rotations du buste en touchant le sol à gauche et à droite.",
    tips: "Suivez vos mains du regard pour engager l'entièreté des abdominaux obliques."
  },
  {
    id: 9,
    name: "SAUTS GROUPÉS",
    subName: "(JUMP SQUATS)",
    baseReps: "15-25 RÉP",
    isTimeBased: false,
    minReps: 15,
    maxReps: 25,
    description: "Faites un squat, puis détendez-vous vers le haut en ramenant si possible les genoux vers la poitrine.",
    tips: "Réceptionnez-vous en souplesse sur l'avant du pied, en fléchissant immédiatement les genoux."
  }
];

export const COOLDOWN_EXERCISES: CooldownExercise[] = [
  {
    id: 1,
    name: "Respiration profonde",
    duration: 40,
    description: "Inspiration lente et profonde par le nez en gonflant le ventre, puis expiration contrôlée par la bouche."
  },
  {
    id: 2,
    name: "Étirements légers",
    duration: 40,
    description: "Étirez doucement les quadriceps, les bras et le dos sans douleur ni secousse."
  },
  {
    id: 3,
    name: "Détente musculaire & Relâchement",
    duration: 40,
    description: "Secouez doucement vos membres, relâchez toutes les tensions et savourez l'effort accompli."
  }
];

export const WEEK_PLAN_SETTINGS: WeekSettings[] = [
  {
    label: "Semaines 1-2",
    title: "ADAPTATION",
    objective: "Habituer le corps à l'effort",
    defaultRounds: 2,
    restBetweenExos: 35, // average of 30-45s
    intensity: "Moins élevé",
    focus: "TECHNIQUE"
  },
  {
    label: "Semaines 3-4",
    title: "VOLUME",
    objective: "Augmenter le volume et l'endurance",
    defaultRounds: 3,
    restBetweenExos: 35, // average of 30-45s
    intensity: "Modéré",
    focus: "ENDURANCE"
  },
  {
    label: "Semaines 5-6",
    title: "INTENSITÉ",
    objective: "Booster l'intensité et brûler plus",
    defaultRounds: 3,
    restBetweenExos: 25, // average of 20-30s
    intensity: "Élevé",
    focus: "BRÛLER"
  },
  {
    label: "Semaine 7",
    title: "CHALLENGE",
    objective: "Repousser tes limites",
    defaultRounds: 4,
    restBetweenExos: 25, // average of 20-30s
    intensity: "Élevé",
    focus: "PERFORMANCE"
  },
  {
    label: "Semaine 8",
    title: "DÉPASSEMENT",
    objective: "Semaine ultime - Transformation",
    defaultRounds: 4,
    restBetweenExos: 15, // average of 15-20s
    intensity: "Maximale",
    focus: "RÉSULTATS"
  }
];
