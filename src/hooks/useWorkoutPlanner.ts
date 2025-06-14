import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  WorkoutPlannerState,
  WorkoutPlan,
  WorkoutSession
} from '@/types/workout-planner';

export function useWorkoutPlanner() {
  const { data: user } = useUser();
  const [state, setState] = useState<WorkoutPlannerState>({
    loading: false,
    error: null,
    plans: [],
    sessions: [],
    selectedPlan: null,
    isGenerating: false
  });

  // Load workout plans
  const loadPlans = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/workout-planner/plans?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load workout plans');
      const plans: WorkoutPlan[] = await response.json();
      setState(prev => ({ ...prev, plans }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load workout plans' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load workout sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/workout-planner/sessions?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load workout sessions');
      const sessions: WorkoutSession[] = await response.json();
      setState(prev => ({ ...prev, sessions }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load workout sessions' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Generate workout plan
  const generatePlan = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null, isGenerating: true }));
    try {
      const response = await fetch('/api/workout-planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (!response.ok) throw new Error('Failed to generate workout plan');
      const plan: WorkoutPlan = await response.json();
      setState(prev => ({ ...prev, plans: [plan, ...prev.plans], isGenerating: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to generate workout plan', isGenerating: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Track workout session
  const trackSession = useCallback(async (planId: string, startTime: string, endTime: string, notes?: string) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/workout-planner/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planId,
          startTime,
          endTime,
          notes
        })
      });
      if (!response.ok) throw new Error('Failed to track workout session');
      const session: WorkoutSession = await response.json();
      setState(prev => ({ ...prev, sessions: [session, ...prev.sessions] }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to track workout session' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    state,
    setState,
    loadPlans,
    loadSessions,
    generatePlan,
    trackSession
  };
} 