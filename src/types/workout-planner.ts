export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: number;
    restTime: number; // in seconds
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId: string;
  startTime: string;
  endTime: string;
  completedExercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight?: number;
      completed: boolean;
    }[];
  }[];
  notes?: string;
}

export interface WorkoutPlannerState {
  loading: boolean;
  error: string | null;
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  selectedPlan: WorkoutPlan | null;
  isGenerating: boolean;
} 