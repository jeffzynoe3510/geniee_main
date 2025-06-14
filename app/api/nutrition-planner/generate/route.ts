import { NextResponse } from 'next/server';
import { MealPlan } from '@/types/nutrition-planner';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mealPlan: MealPlan = {
      id: Date.now().toString(),
      userId: body.userId,
      date: new Date().toISOString(),
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
    };
    // In a real app, save to DB
    return NextResponse.json(mealPlan);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to generate meal plan' }, { status: 500 });
  }
} 