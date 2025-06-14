import { NextResponse } from 'next/server';
import { DietaryPreferences } from '@/types/nutrition-planner';

const mockPreferences: DietaryPreferences = {
  userId: '1',
  dietaryRestrictions: ['Vegetarian'],
  allergies: ['Nuts'],
  preferredCuisines: ['Mediterranean', 'Asian'],
  mealCount: 3,
  calorieGoal: 2000,
  proteinGoal: 150,
  carbGoal: 200,
  fatGoal: 70
};

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockPreferences);
} 