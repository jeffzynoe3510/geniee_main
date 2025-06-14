export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'cardio' | 'strength' | 'flexibility' | 'balance';
  equipment?: string[];
  imageUrl?: string;
}

export interface UserPreferences {
  userId: string;
  preferredDuration: number; // in minutes
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  preferredTypes: ('cardio' | 'strength' | 'flexibility' | 'balance')[];
  availableEquipment?: string[];
  goals?: string[];
}

export interface GeneratedWorkout {
  id: string;
  userId: string;
  templateId: string;
  date: string;
  completed: boolean;
  notes?: string;
  caloriesBurned?: number;
}

export interface WorkoutGeneratorState {
  loading: boolean;
  error: string | null;
  templates: WorkoutTemplate[];
  preferences: UserPreferences | null;
  generatedWorkouts: GeneratedWorkout[];
  selectedTemplate: WorkoutTemplate | null;
  isGenerating: boolean;
} 