import { NextResponse } from 'next/server';
import { GeneratedWorkout } from '@/types/workout-generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const workout: GeneratedWorkout = {
      id: Date.now().toString(),
      userId: body.userId,
      templateId: '1', // Mock template ID
      date: new Date().toISOString(),
      completed: false,
      notes: 'Generated based on your preferences.',
      caloriesBurned: Math.floor(Math.random() * 400) + 100
    };
    // In a real app, save to DB
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to generate workout' }, { status: 500 });
  }
} 