import { NextResponse } from 'next/server';
import { WorkoutSession } from '@/types/workout-planner';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId, startTime, endTime, notes } = body;

    // Mock workout session creation
    const session: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      planId,
      startTime,
      endTime,
      completedExercises: [
        {
          exerciseId: '1',
          sets: [
            { reps: 10, weight: 135, completed: true },
            { reps: 10, weight: 135, completed: true },
            { reps: 10, weight: 135, completed: true }
          ]
        },
        {
          exerciseId: '2',
          sets: [
            { reps: 10, weight: 135, completed: true },
            { reps: 10, weight: 135, completed: true },
            { reps: 10, weight: 135, completed: true }
          ]
        }
      ],
      notes
    };

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create workout session' },
      { status: 500 }
    );
  }
} 