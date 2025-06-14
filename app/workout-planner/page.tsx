"use client";

import React from 'react';

export default function WorkoutPlannerPage() {
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
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">Full Body Workout</h3>
                <p className="text-sm text-gray-600">Last updated: 2 days ago</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">Upper Body Focus</h3>
                <p className="text-sm text-gray-600">Last updated: 1 week ago</p>
              </div>
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