import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  MentalHealthState,
  MoodLog,
  MentalHealthRecommendation,
  MentalHealthInsight,
  MoodLevel,
  RatingLevel
} from '@/types/mental-health';

const initialState: MentalHealthState = {
  loading: false,
  error: null,
  moodLogs: [],
  recommendations: [],
  insights: [],
  selectedDate: null,
  isAnalyzing: false
};

export function useMentalHealth() {
  const { data: user } = useUser();
  const [state, setState] = useState<MentalHealthState>(initialState);

  // Load mood logs
  const loadMoodLogs = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/mental-health/logs?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load mood logs');
      const logs: MoodLog[] = await response.json();
      setState(prev => ({ ...prev, moodLogs: logs }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load mood logs' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/mental-health/recommendations?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load recommendations');
      const recommendations: MentalHealthRecommendation[] = await response.json();
      setState(prev => ({ ...prev, recommendations }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load recommendations' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load insights
  const loadInsights = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/mental-health/insights?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load insights');
      const insights: MentalHealthInsight[] = await response.json();
      setState(prev => ({ ...prev, insights }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load insights' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Log mood
  const logMood = useCallback(async (
    mood: MoodLevel,
    energy: RatingLevel,
    stress: RatingLevel,
    anxiety: RatingLevel,
    sleep: RatingLevel,
    notes?: string,
    activities: string[] = [],
    triggers?: string[]
  ) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/mental-health/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          mood,
          energy,
          stress,
          anxiety,
          sleep,
          notes,
          activities,
          triggers
        })
      });
      if (!response.ok) throw new Error('Failed to log mood');
      const log: MoodLog = await response.json();
      setState(prev => ({ ...prev, moodLogs: [log, ...prev.moodLogs] }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to log mood' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Generate insights
  const generateInsights = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null, isAnalyzing: true }));
    try {
      const response = await fetch('/api/mental-health/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (!response.ok) throw new Error('Failed to generate insights');
      const insights: MentalHealthInsight[] = await response.json();
      setState(prev => ({ ...prev, insights, isAnalyzing: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to generate insights', isAnalyzing: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    state,
    setState,
    loadMoodLogs,
    loadRecommendations,
    loadInsights,
    logMood,
    generateInsights
  };
} 