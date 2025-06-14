import { NextResponse } from 'next/server';
import { WorkoutSession } from '@/types/fitness-coach';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session: WorkoutSession = {
      id: Date.now().toString(),
      workoutId: body.workoutId,
      userId: body.userId,
      date: body.date,
      completed: body.completed,
      notes: body.notes,
      caloriesBurned: Math.floor(Math.random() * 400) + 100
    };
    // In a real app, save to DB
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to track session' }, { status: 500 });
  }
} 