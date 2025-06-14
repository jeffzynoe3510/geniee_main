'use client';

import { useRecommendations } from '@/hooks/useRecommendations';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recommendation, UserPreference } from '@/types/recommendations';

export default function RecommendationsPage() {
  const router = useRouter();
  const {
    state,
    setState,
    loadPreferences,
    loadRecommendations,
    updatePreference,
    markRecommendationAsRead,
    markRecommendationAsCompleted,
    provideFeedback,
    selectRecommendation
  } = useRecommendations();

  const [isEditingPreference, setIsEditingPreference] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState<UserPreference | null>(null);
  const [editedPreferences, setEditedPreferences] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    loadPreferences();
    loadRecommendations();
  }, [loadPreferences, loadRecommendations]);

  const handlePreferenceSelect = (preference: UserPreference) => {
    setSelectedPreference(preference);
    setEditedPreferences(preference.preferences);
    setIsEditingPreference(true);
  };

  const handlePreferenceUpdate = async () => {
    if (!selectedPreference) return;
    await updatePreference({
      id: selectedPreference.id,
      preferences: editedPreferences
    });
    setIsEditingPreference(false);
    setSelectedPreference(null);
    setEditedPreferences({});
  };

  const handleRecommendationSelect = (recommendation: Recommendation) => {
    selectRecommendation(recommendation);
    if (!recommendation.isRead) {
      markRecommendationAsRead(recommendation.id);
    }
  };

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
        <h1 className="text-xl font-semibold text-white">AI Recommendations</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Preferences Panel */}
        <div className="w-1/3 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Your Preferences</h2>
          
          {isEditingPreference ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
              <h3 className="text-white font-semibold mb-2">Edit Preferences</h3>
              <div className="space-y-3">
                {selectedPreference?.type === 'workout' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Preferred Duration (minutes)</label>
                      <input
                        type="number"
                        value={editedPreferences.preferredDuration}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          preferredDuration: Number(e.target.value)
                        }))}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Preferred Intensity</label>
                      <select
                        value={editedPreferences.preferredIntensity}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          preferredIntensity: e.target.value
                        }))}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </>
                )}
                {selectedPreference?.type === 'nutrition' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Calorie Goal</label>
                      <input
                        type="number"
                        value={editedPreferences.calorieGoal}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          calorieGoal: Number(e.target.value)
                        }))}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Dietary Restrictions</label>
                      <input
                        type="text"
                        value={editedPreferences.dietaryRestrictions?.join(', ')}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          dietaryRestrictions: e.target.value.split(',').map(s => s.trim())
                        }))}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditingPreference(false)}
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePreferenceUpdate}
                    className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {state.preferences.map((preference) => (
              <button
                key={preference.id}
                onClick={() => handlePreferenceSelect(preference)}
                className="w-full text-left p-3 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#333] transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span>{preference.type}</span>
                  <span className="text-sm text-gray-400">
                    Last updated: {new Date(preference.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Panel */}
        <div className="w-2/3 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Your Recommendations</h2>
          
          <div className="space-y-4">
            {state.recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className={`bg-[#2A2A2A] text-white p-4 rounded-lg cursor-pointer transition-colors ${
                  state.selectedRecommendation?.id === recommendation.id
                    ? 'border-2 border-[#357AFF]'
                    : 'hover:bg-[#333]'
                }`}
                onClick={() => handleRecommendationSelect(recommendation)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{recommendation.title}</span>
                  <span className={`text-sm ${
                    recommendation.priority === 'high'
                      ? 'text-red-500'
                      : recommendation.priority === 'medium'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}>
                    {recommendation.priority} priority
                  </span>
                </div>
                <p className="text-gray-400 mb-2">{recommendation.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Type: {recommendation.type}</span>
                  <span>Created: {new Date(recommendation.createdAt).toLocaleDateString()}</span>
                  <span>Expires: {new Date(recommendation.expiresAt).toLocaleDateString()}</span>
                </div>
                {recommendation.isCompleted && (
                  <div className="mt-2 text-sm text-green-500">
                    <i className="fas fa-check-circle mr-1"></i>
                    Completed
                  </div>
                )}
                {recommendation.feedback && (
                  <div className="mt-2 text-sm text-gray-400">
                    Feedback: {recommendation.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>

          {state.selectedRecommendation && (
            <div className="mt-8 bg-[#2A2A2A] text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Recommendation Details</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Metadata</h4>
                  <pre className="bg-[#333] p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(state.selectedRecommendation.metadata, null, 2)}
                  </pre>
                </div>
                <div className="flex space-x-2">
                  {!state.selectedRecommendation.isCompleted && (
                    <button
                      onClick={() => markRecommendationAsCompleted(state.selectedRecommendation!.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => provideFeedback(state.selectedRecommendation!.id, 'positive')}
                      className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                    >
                      Positive
                    </button>
                    <button
                      onClick={() => provideFeedback(state.selectedRecommendation!.id, 'neutral')}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Neutral
                    </button>
                    <button
                      onClick={() => provideFeedback(state.selectedRecommendation!.id, 'negative')}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      Negative
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 