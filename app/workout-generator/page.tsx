'use client';

import { useWorkoutGenerator } from '@/hooks/useWorkoutGenerator';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutTemplate, GeneratedWorkout } from '@/types/workout-generator';

export default function WorkoutGeneratorPage() {
  const router = useRouter();
  const {
    state,
    setState,
    loadTemplates,
    loadPreferences,
    generateWorkout
  } = useWorkoutGenerator();

  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
    loadPreferences();
  }, [loadTemplates, loadPreferences]);

  const handleTemplateSelect = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
  };

  const handleGenerateWorkout = async () => {
    await generateWorkout();
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
        <h1 className="text-xl font-semibold text-white">Workout Generator</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Templates Panel */}
        <div className="w-1/2 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Workout Templates</h2>
          <div className="space-y-3">
            {state.templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'bg-[#357AFF] text-white'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{template.name}</span>
                  <span className="text-sm">{template.duration} min</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Workouts Panel */}
        <div className="w-1/2 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Generated Workouts</h2>
          <div className="space-y-3">
            {state.generatedWorkouts.map((workout) => (
              <div key={workout.id} className="bg-[#2A2A2A] text-white p-3 rounded-lg">
                <p>Workout ID: {workout.id}</p>
                <p className="text-sm text-gray-400 mt-1">{new Date(workout.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-[#1A1A1A] border-t border-[#333] p-4">
        <button
          onClick={handleGenerateWorkout}
          disabled={state.loading || state.isGenerating}
          className="w-full bg-[#357AFF] text-white py-3 rounded-lg hover:bg-[#2B5FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.loading || state.isGenerating ? 'Generating...' : 'Generate Workout'}
        </button>
      </div>
    </div>
  );
} 