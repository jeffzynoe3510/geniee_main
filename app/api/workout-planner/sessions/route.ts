import { NextResponse } from 'next/server';
import { WorkoutSession } from '@/types/workout-planner';

const mockSessions: WorkoutSession[] = [
  {
    id: '1',
    userId: '1',
    planId: '1',
    startTime: '2024-06-10T10:00:00Z',
    endTime: '2024-06-10T11:00:00Z',
    completedExercises: [
      {
        exerciseId: '1',
        sets: [
          { reps: 8, weight: 135, completed: true },
          { reps: 8, weight: 135, completed: true },
          { reps: 8, weight: 135, completed: true },
          { reps: 8, weight: 135, completed: true }
        ]
      }
    ],
    notes: 'Felt strong today!'
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockSessions);
} 