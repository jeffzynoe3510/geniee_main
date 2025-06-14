import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  WorkoutGeneratorState,
  WorkoutTemplate,
  UserPreferences,
  GeneratedWorkout
} from '@/types/workout-generator';

export function useWorkoutGenerator() {
  const { data: user } = useUser();
  const [state, setState] = useState<WorkoutGeneratorState>({
    loading: false,
    error: null,
    templates: [],
    preferences: null,
    generatedWorkouts: [],
    selectedTemplate: null,
    isGenerating: false
  });

  // Load templates
  const loadTemplates = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/workout-generator/templates');
      if (!response.ok) throw new Error('Failed to load templates');
      const templates: WorkoutTemplate[] = await response.json();
      setState(prev => ({ ...prev, templates }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load templates' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/workout-generator/preferences?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load preferences');
      const preferences: UserPreferences = await response.json();
      setState(prev => ({ ...prev, preferences }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load preferences' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Generate workout
  const generateWorkout = useCallback(async () => {
    if (!user || !state.preferences) return;
    setState(prev => ({ ...prev, loading: true, error: null, isGenerating: true }));
    try {
      const response = await fetch('/api/workout-generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          preferences: state.preferences
        })
      });
      if (!response.ok) throw new Error('Failed to generate workout');
      const workout: GeneratedWorkout = await response.json();
      setState(prev => ({ ...prev, generatedWorkouts: [workout, ...prev.generatedWorkouts], isGenerating: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to generate workout', isGenerating: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, state.preferences]);

  return {
    state,
    setState,
    loadTemplates,
    loadPreferences,
    generateWorkout
  };
} 