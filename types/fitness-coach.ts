export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'cardio' | 'strength' | 'flexibility' | 'balance';
  equipment?: string[];
  imageUrl?: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  date: string;
  completed: boolean;
  notes?: string;
  caloriesBurned?: number;
}

export interface FitnessGoal {
  id: string;
  userId: string;
  goalType: 'weightLoss' | 'muscleGain' | 'endurance' | 'flexibility';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate?: string;
}

export interface FitnessRecommendation {
  id: string;
  userId: string;
  message: string;
  date: string;
}

export interface FitnessCoachState {
  loading: boolean;
  error: string | null;
  workouts: Workout[];
  sessions: WorkoutSession[];
  goals: FitnessGoal[];
  recommendations: FitnessRecommendation[];
  selectedWorkout: Workout | null;
  selectedGoal: FitnessGoal | null;
  isTracking: boolean;
} 