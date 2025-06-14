import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  SleepAnalysisState,
  SleepSession,
  SleepRecommendation
} from '@/types/sleep-analysis';

export function useSleepAnalysis() {
  const { data: user } = useUser();
  const [state, setState] = useState<SleepAnalysisState>({
    loading: false,
    error: null,
    sessions: [],
    recommendations: [],
    selectedSession: null,
    isAnalyzing: false
  });

  // Load sleep sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/sleep-analysis/sessions?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load sleep sessions');
      const sessions: SleepSession[] = await response.json();
      setState(prev => ({ ...prev, sessions }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load sleep sessions' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/sleep-analysis/recommendations?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load recommendations');
      const recommendations: SleepRecommendation[] = await response.json();
      setState(prev => ({ ...prev, recommendations }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load recommendations' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Track sleep session
  const trackSession = useCallback(async (startTime: string, endTime: string, notes?: string) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null, isAnalyzing: true }));
    try {
      const response = await fetch('/api/sleep-analysis/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          startTime,
          endTime,
          notes
        })
      });
      if (!response.ok) throw new Error('Failed to track sleep session');
      const session: SleepSession = await response.json();
      setState(prev => ({ ...prev, sessions: [session, ...prev.sessions], isAnalyzing: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to track sleep session', isAnalyzing: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    state,
    setState,
    loadSessions,
    loadRecommendations,
    trackSession
  };
} 