import { useState, useCallback } from 'react';
import { RecommendationsState, UserPreference, Recommendation, FeedbackType } from '@/types/recommendations';

const initialState: RecommendationsState = {
  loading: false,
  error: null,
  preferences: [],
  recommendations: [],
  selectedRecommendation: null,
  isCreating: false
};

export const useRecommendations = () => {
  const [state, setState] = useState<RecommendationsState>(initialState);

  const loadPreferences = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch('/api/recommendations/preferences');
      const data = await response.json();
      setState(prev => ({ ...prev, preferences: data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load preferences', loading: false }));
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      setState(prev => ({ ...prev, recommendations: data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load recommendations', loading: false }));
    }
  }, []);

  const updatePreference = useCallback(async (preference: Partial<UserPreference>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch(`/api/recommendations/preferences/${preference.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preference)
      });
      const data = await response.json();
      setState(prev => ({
        ...prev,
        preferences: prev.preferences.map(p => p.id === preference.id ? { ...p, ...data } : p),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to update preference', loading: false }));
    }
  }, []);

  const markRecommendationAsRead = useCallback(async (recommendationId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      await fetch(`/api/recommendations/${recommendationId}/read`, { method: 'POST' });
      setState(prev => ({
        ...prev,
        recommendations: prev.recommendations.map(r =>
          r.id === recommendationId ? { ...r, isRead: true } : r
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to mark recommendation as read', loading: false }));
    }
  }, []);

  const markRecommendationAsCompleted = useCallback(async (recommendationId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      await fetch(`/api/recommendations/${recommendationId}/complete`, { method: 'POST' });
      setState(prev => ({
        ...prev,
        recommendations: prev.recommendations.map(r =>
          r.id === recommendationId ? { ...r, isCompleted: true } : r
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to mark recommendation as completed', loading: false }));
    }
  }, []);

  const provideFeedback = useCallback(async (recommendationId: string, feedback: FeedbackType) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      await fetch(`/api/recommendations/${recommendationId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      setState(prev => ({
        ...prev,
        recommendations: prev.recommendations.map(r =>
          r.id === recommendationId ? { ...r, feedback } : r
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to provide feedback', loading: false }));
    }
  }, []);

  const selectRecommendation = useCallback((recommendation: Recommendation | null) => {
    setState(prev => ({ ...prev, selectedRecommendation: recommendation }));
  }, []);

  return {
    state,
    setState,
    loadPreferences,
    loadRecommendations,
    updatePreference,
    markRecommendationAsRead,
    markRecommendationAsCompleted,
    provideFeedback,
    selectRecommendation
  };
}; 