export interface SleepSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep: number; // in minutes
  lightSleep: number; // in minutes
  remSleep: number; // in minutes
  interruptions: number;
  notes?: string;
}

export interface SleepRecommendation {
  id: string;
  userId: string;
  message: string;
  date: string;
}

export interface SleepAnalysisState {
  loading: boolean;
  error: string | null;
  sessions: SleepSession[];
  recommendations: SleepRecommendation[];
  selectedSession: SleepSession | null;
  isAnalyzing: boolean;
} 