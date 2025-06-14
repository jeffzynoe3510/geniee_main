'use client';

import { useSleepAnalysis } from '@/hooks/useSleepAnalysis';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SleepSession } from '@/types/sleep-analysis';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

function SleepAnalysisContent() {
  const router = useRouter();
  const {
    state,
    setState,
    loadSessions,
    loadRecommendations,
    trackSession
  } = useSleepAnalysis();

  const [selectedSession, setSelectedSession] = useState<SleepSession | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSessions();
    loadRecommendations();
  }, [loadSessions, loadRecommendations]);

  const handleSessionSelect = (session: SleepSession) => {
    setSelectedSession(session);
  };

  const handleTrackSession = async () => {
    if (!startTime || !endTime) return;
    await trackSession(startTime, endTime, notes);
    setIsTracking(false);
    setStartTime('');
    setEndTime('');
    setNotes('');
  };

  if (state.loading && !state.sessions.length && !state.recommendations.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner size="lg" color="primary" message="Loading sleep analysis..." />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-4 bg-black min-h-screen">
        <ErrorMessage
          message={state.error}
          onRetry={() => {
            setState(prev => ({ ...prev, error: null }));
            loadSessions();
            loadRecommendations();
          }}
          variant="danger"
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-[#333]">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-white hover:text-[#357AFF] transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          <span>Back to Home</span>
        </button>
        <h1 className="text-xl font-semibold text-white">Sleep Analysis</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sleep Sessions Panel */}
        <div className="w-1/2 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Sleep Sessions</h2>
            <button
              onClick={() => setIsTracking(true)}
              className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors"
            >
              Track New Session
            </button>
          </div>

          {isTracking ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
              <h3 className="text-white font-semibold mb-2">Track Sleep Session</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsTracking(false)}
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTrackSession}
                    disabled={state.loading || state.isAnalyzing}
                    className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.loading || state.isAnalyzing ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        Saving...
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {state.loading && !state.sessions.length ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : (
            <div className="space-y-3">
              {state.sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSessionSelect(session)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSession?.id === session.id
                      ? 'bg-[#357AFF] text-white'
                      : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{new Date(session.startTime).toLocaleDateString()}</span>
                    <span className="text-sm">{session.duration} min</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Quality: {session.quality}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Session & Recommendations Panel */}
        <div className="w-1/2 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Session Details & Recommendations</h2>
          
          {state.loading && !state.recommendations.length ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : selectedSession ? (
            <div className="space-y-4">
              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Sleep Details</h3>
                <div className="space-y-2">
                  <p>Duration: {selectedSession.duration} minutes</p>
                  <p>Quality: {selectedSession.quality}</p>
                  <p>Deep Sleep: {selectedSession.deepSleep} minutes</p>
                  <p>Light Sleep: {selectedSession.lightSleep} minutes</p>
                  <p>REM Sleep: {selectedSession.remSleep} minutes</p>
                  <p>Interruptions: {selectedSession.interruptions}</p>
                  {selectedSession.notes && (
                    <p className="text-gray-400 mt-2">Notes: {selectedSession.notes}</p>
                  )}
                </div>
              </div>

              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <div className="space-y-2">
                  {state.recommendations.map((rec) => (
                    <div key={rec.id} className="text-gray-400">
                      {rec.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a sleep session to view details and recommendations.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SleepAnalysisPage() {
  return (
    <ErrorBoundary>
      <SleepAnalysisContent />
    </ErrorBoundary>
  );
} 