export type MoodLevel = 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad';
export type RatingLevel = 1 | 2 | 3 | 4 | 5;
export type RecommendationType = 'exercise' | 'meditation' | 'social' | 'professional' | 'lifestyle';
export type InsightType = 'mood_trend' | 'stress_pattern' | 'sleep_quality' | 'activity_correlation';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface MoodLog {
  id: string;
  userId: string;
  timestamp: string;
  mood: MoodLevel;
  energy: RatingLevel;
  stress: RatingLevel;
  anxiety: RatingLevel;
  sleep: RatingLevel;
  notes?: string;
  activities: string[];
  triggers?: string[];
}

export interface MentalHealthRecommendation {
  id: string;
  userId: string;
  timestamp: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: PriorityLevel;
  completed: boolean;
}

export interface MentalHealthInsight {
  id: string;
  userId: string;
  timestamp: string;
  type: InsightType;
  title: string;
  description: string;
  data: {
    labels: string[];
    values: number[];
  };
}

export interface MentalHealthState {
  loading: boolean;
  error: string | null;
  moodLogs: MoodLog[];
  recommendations: MentalHealthRecommendation[];
  insights: MentalHealthInsight[];
  selectedDate: string | null;
  isAnalyzing: boolean;
} 