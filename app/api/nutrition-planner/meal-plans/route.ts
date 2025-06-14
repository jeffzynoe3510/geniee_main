import { NextResponse } from 'next/server';
import { MealPlan } from '@/types/nutrition-planner';

const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-06-10',
    meals: [
      {
        id: '1',
        name: 'Breakfast',
        description: 'A healthy breakfast to start your day.',
        calories: 300,
        protein: 20,
        carbs: 30,
        fat: 10,
        ingredients: ['Oatmeal', 'Banana', 'Almonds'],
        instructions: ['Cook oatmeal', 'Slice banana', 'Top with almonds'],
        imageUrl: 'https://via.placeholder.com/300x200'
      }
    ],
    totalCalories: 300,
    totalProtein: 20,
    totalCarbs: 30,
    totalFat: 10
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockMealPlans);
} 