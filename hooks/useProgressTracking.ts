import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  ProgressTrackingState,
  Goal,
  ProgressEntry,
  Achievement,
  GoalStatus,
  GoalCategory,
  GoalPriority
} from '@/types/progress-tracking';

const initialState: ProgressTrackingState = {
  loading: false,
  error: null,
  goals: [],
  progressEntries: [],
  achievements: [],
  selectedGoal: null,
  isAnalyzing: false
};

export function useProgressTracking() {
  const { data: user } = useUser();
  const [state, setState] = useState<ProgressTrackingState>(initialState);

  // Load goals
  const loadGoals = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/progress-tracking/goals?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load goals');
      const goals: Goal[] = await response.json();
      setState(prev => ({ ...prev, goals }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load goals' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load progress entries
  const loadProgressEntries = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/progress-tracking/entries?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load progress entries');
      const entries: ProgressEntry[] = await response.json();
      setState(prev => ({ ...prev, progressEntries: entries }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load progress entries' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load achievements
  const loadAchievements = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/progress-tracking/achievements?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load achievements');
      const achievements: Achievement[] = await response.json();
      setState(prev => ({ ...prev, achievements }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load achievements' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Create goal
  const createGoal = useCallback(async (
    title: string,
    description: string,
    category: GoalCategory,
    priority: GoalPriority,
    startDate: string,
    targetDate: string,
    milestones: { title: string; description: string; dueDate: string }[]
  ) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/progress-tracking/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title,
          description,
          category,
          priority,
          startDate,
          targetDate,
          milestones
        })
      });
      if (!response.ok) throw new Error('Failed to create goal');
      const goal: Goal = await response.json();
      setState(prev => ({ ...prev, goals: [goal, ...prev.goals] }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to create goal' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Update goal progress
  const updateGoalProgress = useCallback(async (
    goalId: string,
    progress: number,
    notes?: string,
    attachments?: string[]
  ) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/progress-tracking/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          goalId,
          progress,
          notes,
          attachments
        })
      });
      if (!response.ok) throw new Error('Failed to update goal progress');
      const entry: ProgressEntry = await response.json();
      setState(prev => ({
        ...prev,
        progressEntries: [entry, ...prev.progressEntries],
        goals: prev.goals.map(goal =>
          goal.id === goalId
            ? { ...goal, progress, updatedAt: new Date().toISOString() }
            : goal
        )
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to update goal progress' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Update goal status
  const updateGoalStatus = useCallback(async (goalId: string, status: GoalStatus) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/progress-tracking/goal/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update goal status');
      const updatedGoal: Goal = await response.json();
      setState(prev => ({
        ...prev,
        goals: prev.goals.map(goal =>
          goal.id === goalId ? updatedGoal : goal
        )
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to update goal status' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    state,
    setState,
    loadGoals,
    loadProgressEntries,
    loadAchievements,
    createGoal,
    updateGoalProgress,
    updateGoalStatus
  };
} 