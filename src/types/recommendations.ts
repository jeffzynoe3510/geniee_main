export type RecommendationType = 'workout' | 'nutrition' | 'sleep' | 'mental_health' | 'lifestyle';
export type RecommendationPriority = 'low' | 'medium' | 'high';
export type FeedbackType = 'positive' | 'negative' | 'neutral';

export interface UserPreference {
  id: string;
  userId: string;
  type: RecommendationType;
  preferences: {
    [key: string]: any; // Dynamic preferences based on type
  };
  lastUpdated: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  createdAt: string;
  expiresAt: string;
  isRead: boolean;
  isCompleted: boolean;
  feedback?: FeedbackType;
  metadata: {
    [key: string]: any; // Additional data based on recommendation type
  };
}

export interface WorkoutRecommendation extends Recommendation {
  type: 'workout';
  metadata: {
    duration: number; // in minutes
    intensity: 'low' | 'medium' | 'high';
    equipment: string[];
    targetMuscles: string[];
    caloriesBurned: number;
  };
}

export interface NutritionRecommendation extends Recommendation {
  type: 'nutrition';
  metadata: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    ingredients: string[];
    allergens?: string[];
  };
}

export interface SleepRecommendation extends Recommendation {
  type: 'sleep';
  metadata: {
    duration: number; // in hours
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    tips: string[];
  };
}

export interface MentalHealthRecommendation extends Recommendation {
  type: 'mental_health';
  metadata: {
    activityType: 'meditation' | 'journaling' | 'exercise' | 'social' | 'other';
    duration: number; // in minutes
    benefits: string[];
  };
}

export interface LifestyleRecommendation extends Recommendation {
  type: 'lifestyle';
  metadata: {
    category: 'productivity' | 'habits' | 'environment' | 'other';
    impact: 'low' | 'medium' | 'high';
    resources?: string[];
  };
}

export interface RecommendationsState {
  loading: boolean;
  error: string | null;
  preferences: UserPreference[];
  recommendations: Recommendation[];
  selectedRecommendation: Recommendation | null;
  isCreating: boolean;
} 