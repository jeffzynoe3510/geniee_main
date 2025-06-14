import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  NutritionPlannerState,
  MealPlan,
  DietaryPreferences
} from '@/types/nutrition-planner';

export function useNutritionPlanner() {
  const { data: user } = useUser();
  const [state, setState] = useState<NutritionPlannerState>({
    loading: false,
    error: null,
    mealPlans: [],
    preferences: null,
    selectedMealPlan: null,
    isGenerating: false
  });

  // Load meal plans
  const loadMealPlans = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/nutrition-planner/meal-plans?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load meal plans');
      const mealPlans: MealPlan[] = await response.json();
      setState(prev => ({ ...prev, mealPlans }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load meal plans' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/nutrition-planner/preferences?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load preferences');
      const preferences: DietaryPreferences = await response.json();
      setState(prev => ({ ...prev, preferences }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load preferences' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Generate meal plan
  const generateMealPlan = useCallback(async () => {
    if (!user || !state.preferences) return;
    setState(prev => ({ ...prev, loading: true, error: null, isGenerating: true }));
    try {
      const response = await fetch('/api/nutrition-planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          preferences: state.preferences
        })
      });
      if (!response.ok) throw new Error('Failed to generate meal plan');
      const mealPlan: MealPlan = await response.json();
      setState(prev => ({ ...prev, mealPlans: [mealPlan, ...prev.mealPlans], isGenerating: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to generate meal plan', isGenerating: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, state.preferences]);

  return {
    state,
    setState,
    loadMealPlans,
    loadPreferences,
    generateMealPlan
  };
} 