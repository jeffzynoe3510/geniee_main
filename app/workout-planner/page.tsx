"use client";

import React, { useState, useEffect } from 'react';

interface WorkoutPlan {
  id: string;
  name: string;
  lastUpdated: string;
}

export default function WorkoutPlannerPage() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const response = await fetch('/api/workout-plans');
        if (!response.ok) {
          throw new Error('Failed to fetch workout plans');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setWorkoutPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Workout Planner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Workout Plan Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Plan</h2>
            <p className="text-gray-600 mb-4">Design your personalized workout routine</p>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Start Planning
            </button>
          </div>

          {/* Recent Plans Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Plans</h2>
            <div className="space-y-4">
              {workoutPlans.length > 0 ? (
                workoutPlans.map((plan) => (
                  <div key={plan.id} className="border-b pb-4">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">Last updated: {plan.lastUpdated}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No workout plans found</p>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Weekly Goal</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">70% completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 