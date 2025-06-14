'use client';

import { useFitnessCoach } from '@/hooks/useFitnessCoach';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Workout, FitnessGoal, FitnessRecommendation } from '@/types/fitness-coach';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

function FitnessCoachContent() {
  const router = useRouter();
  const {
    state,
    setState,
    loadWorkouts,
    loadGoals,
    loadRecommendations,
    trackSession
  } = useFitnessCoach();

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadWorkouts();
    loadGoals();
    loadRecommendations();
  }, [loadWorkouts, loadGoals, loadRecommendations]);

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleGoalSelect = (goal: FitnessGoal) => {
    setSelectedGoal(goal);
  };

  const handleTrackSession = async () => {
    if (selectedWorkout) {
      await trackSession(selectedWorkout.id, notes);
      setNotes('');
    }
  };

  if (state.loading && !state.workouts.length && !state.goals.length && !state.recommendations.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner size="lg" color="primary" message="Loading fitness coach..." />
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
            loadWorkouts();
            loadGoals();
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
        <h1 className="text-xl font-semibold text-white">Fitness Coach</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Workouts Panel */}
        <div className="w-1/3 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Workouts</h2>
          {state.loading && !state.workouts.length ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : (
            <div className="space-y-3">
              {state.workouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => handleWorkoutSelect(workout)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedWorkout?.id === workout.id
                      ? 'bg-[#357AFF] text-white'
                      : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{workout.name}</span>
                    <span className="text-sm">{workout.duration} min</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Goals Panel */}
        <div className="w-1/3 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Goals</h2>
          {state.loading && !state.goals.length ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : (
            <div className="space-y-3">
              {state.goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedGoal?.id === goal.id
                      ? 'bg-[#357AFF] text-white'
                      : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{goal.goalType}</span>
                    <span className="text-sm">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations Panel */}
        <div className="w-1/3 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>
          {state.loading && !state.recommendations.length ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : (
            <div className="space-y-3">
              {state.recommendations.map((rec) => (
                <div key={rec.id} className="bg-[#2A2A2A] text-white p-3 rounded-lg">
                  <p>{rec.message}</p>
                  <p className="text-sm text-gray-400 mt-1">{rec.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tracking Panel */}
      {selectedWorkout && (
        <div className="bg-[#1A1A1A] border-t border-[#333] p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Track Workout</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="flex-1 bg-[#2A2A2A] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#357AFF]"
            />
            <button
              onClick={handleTrackSession}
              disabled={state.loading || state.isTracking}
              className="bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2B5FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading || state.isTracking ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Tracking...
                </div>
              ) : (
                'Track Session'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FitnessCoachPage() {
  return (
    <ErrorBoundary>
      <FitnessCoachContent />
    </ErrorBoundary>
  );
} 