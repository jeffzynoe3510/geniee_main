import { Recommendation } from '@/types/recommendations';

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    userId: 'current-user-id',
    type: 'workout',
    title: 'Upper Body Strength Workout',
    description: 'A 30-minute workout focusing on chest, shoulders, and arms using dumbbells.',
    priority: 'high',
    createdAt: '2023-01-01T00:00:00Z',
    expiresAt: '2023-01-08T00:00:00Z',
    isRead: false,
    isCompleted: false,
    metadata: {
      duration: 30,
      intensity: 'medium',
      equipment: ['dumbbells'],
      targetMuscles: ['chest', 'shoulders', 'arms'],
      caloriesBurned: 250
    }
  },
  {
    id: 'rec-2',
    userId: 'current-user-id',
    type: 'nutrition',
    title: 'High-Protein Vegetarian Lunch',
    description: 'A balanced vegetarian lunch rich in protein and essential nutrients.',
    priority: 'medium',
    createdAt: '2023-01-02T00:00:00Z',
    expiresAt: '2023-01-09T00:00:00Z',
    isRead: false,
    isCompleted: false,
    metadata: {
      mealType: 'lunch',
      calories: 450,
      macros: {
        protein: 30,
        carbs: 45,
        fat: 15
      },
      ingredients: ['quinoa', 'chickpeas', 'spinach', 'avocado', 'olive oil']
    }
  }
]; 