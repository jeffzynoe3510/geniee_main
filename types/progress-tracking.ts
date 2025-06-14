export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';
export type GoalCategory = 'fitness' | 'nutrition' | 'sleep' | 'mental_health' | 'lifestyle';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  status: GoalStatus;
  dueDate: string;
  completedAt?: string;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  goalId: string;
  timestamp: string;
  value: number;
  notes?: string;
  attachments?: string[]; // URLs to images/files
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  unlockedAt: string;
  icon?: string; // URL to achievement icon
}

export interface ProgressTrackingState {
  loading: boolean;
  error: string | null;
  goals: Goal[];
  progressEntries: ProgressEntry[];
  achievements: Achievement[];
  selectedGoal: Goal | null;
  isAnalyzing: boolean;
} 