export type LevelType = 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';

export type WorkoutPhase = 
  | 'SETUP' 
  | 'WARMUP' 
  | 'ACTIVE_EXERCISE' 
  | 'ACTIVE_REST' 
  | 'ROUND_REST' 
  | 'COOLDOWN' 
  | 'COMPLETED';

export interface Exercise {
  id: number;
  name: string;
  subName?: string;
  baseReps: string; // e.g. "10-20 RÉP"
  baseDuration?: number; // in seconds, if time-based (like Plank: 30-60)
  isTimeBased: boolean;
  minReps: number;
  maxReps: number;
  description: string;
  tips: string;
}

export interface WarmupExercise {
  id: number;
  name: string;
  duration: number; // usually 30s
  description: string;
}

export interface CooldownExercise {
  id: number;
  name: string;
  duration: number;
  description: string;
}

export interface WorkoutHistoryEntry {
  id: string;
  date: string;
  level: LevelType;
  roundsCount: number;
  completedExercisesCount: number;
  totalDurationSeconds: number;
  weekRange: string;
}

export interface WeekSettings {
  label: string;
  title: string;
  objective: string;
  defaultRounds: number;
  restBetweenExos: number; // in seconds
  intensity: 'Moins élevé' | 'Modéré' | 'Élevé' | 'Maximale';
  focus: string;
}
