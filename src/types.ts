export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  durationSec?: number;
}

export type WorkoutLevel = 'POCZĄTKUJĄCY' | 'ŚREDNI' | 'ZAAWANSOWANY';

export interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  level: WorkoutLevel;
  image: string;
  weeks?: string;
  category: string;
  exercises: Exercise[];
}

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  workoutTitle: string;
  date: string;
  duration: number;
  kcalBurned: number;
}

export interface WeightEntry {
  date: string;
  value: number;
}

export interface UserStats {
  membershipExpiry: string; // "Czerwiec 2026" or customizable
  isPremium: boolean;
  kcalBurnedToday: number;
  kcalTarget: number;
  waterConsumedToday: number; // in liters
  waterTarget: number; // in liters
  weight: number;
  weightGoal: number;
  weightHistory: WeightEntry[];
  completedWorkouts: CompletedWorkout[];
}

export interface FoodEntry {
  id: string;
  name: string;
  kcal: number;
  time: string;
}
