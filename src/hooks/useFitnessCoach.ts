import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  FitnessCoachState,
  Workout,
  WorkoutSession,
  FitnessGoal,
  FitnessRecommendation
} from '@/types/fitness-coach';

export function useFitnessCoach() {
  const { data: user } = useUser();
  const [state, setState] = useState<FitnessCoachState>({
    loading: false,
    error: null,
    workouts: [],
    sessions: [],
    goals: [],
    recommendations: [],
    selectedWorkout: null,
    selectedGoal: null,
    isTracking: false
  });

  // Load workouts
  const loadWorkouts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/fitness-coach/workouts');
      if (!response.ok) throw new Error('Failed to load workouts');
      const workouts: Workout[] = await response.json();
      setState(prev => ({ ...prev, workouts }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load workouts' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Load goals
  const loadGoals = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/fitness-coach/goals?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load goals');
      const goals: FitnessGoal[] = await response.json();
      setState(prev => ({ ...prev, goals }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load goals' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/fitness-coach/recommendations?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load recommendations');
      const recommendations: FitnessRecommendation[] = await response.json();
      setState(prev => ({ ...prev, recommendations }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load recommendations' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Track workout session
  const trackSession = useCallback(async (workoutId: string, notes?: string) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null, isTracking: true }));
    try {
      const response = await fetch('/api/fitness-coach/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId,
          userId: user.id,
          date: new Date().toISOString(),
          completed: true,
          notes
        })
      });
      if (!response.ok) throw new Error('Failed to track session');
      const session: WorkoutSession = await response.json();
      setState(prev => ({ ...prev, sessions: [session, ...prev.sessions], isTracking: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to track session', isTracking: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    state,
    setState,
    loadWorkouts,
    loadGoals,
    loadRecommendations,
    trackSession
  };
} 