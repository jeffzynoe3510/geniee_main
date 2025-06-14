'use client';

import { useNutritionPlanner } from '@/hooks/useNutritionPlanner';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MealPlan } from '@/types/nutrition-planner';

export default function NutritionPlannerPage() {
  const router = useRouter();
  const {
    state,
    setState,
    loadMealPlans,
    loadPreferences,
    generateMealPlan
  } = useNutritionPlanner();

  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    loadMealPlans();
    loadPreferences();
  }, [loadMealPlans, loadPreferences]);

  const handleMealPlanSelect = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
  };

  const handleGenerateMealPlan = async () => {
    await generateMealPlan();
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
        <h1 className="text-xl font-semibold text-white">Nutrition Planner</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Meal Plans Panel */}
        <div className="w-1/2 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Meal Plans</h2>
          <div className="space-y-3">
            {state.mealPlans.map((mealPlan) => (
              <button
                key={mealPlan.id}
                onClick={() => handleMealPlanSelect(mealPlan)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedMealPlan?.id === mealPlan.id
                    ? 'bg-[#357AFF] text-white'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{new Date(mealPlan.date).toLocaleDateString()}</span>
                  <span className="text-sm">{mealPlan.totalCalories} cal</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Meal Plan Panel */}
        <div className="w-1/2 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Selected Meal Plan</h2>
          {selectedMealPlan ? (
            <div className="space-y-4">
              {selectedMealPlan.meals.map((meal) => (
                <div key={meal.id} className="bg-[#2A2A2A] text-white p-3 rounded-lg">
                  <h3 className="font-semibold">{meal.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{meal.description}</p>
                  <p className="text-sm text-gray-400 mt-1">{meal.calories} calories</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Select a meal plan to view details.</p>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-[#1A1A1A] border-t border-[#333] p-4">
        <button
          onClick={handleGenerateMealPlan}
          disabled={state.loading || state.isGenerating}
          className="w-full bg-[#357AFF] text-white py-3 rounded-lg hover:bg-[#2B5FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.loading || state.isGenerating ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </div>
    </div>
  );
} 