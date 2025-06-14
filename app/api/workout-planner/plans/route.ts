import { NextResponse } from 'next/server';
import { WorkoutPlan } from '@/types/workout-planner';

const mockPlans: WorkoutPlan[] = [
  {
    id: '1',
    userId: '1',
    name: 'Full Body Strength',
    description: 'A comprehensive full-body workout focusing on strength and muscle building.',
    difficulty: 'intermediate',
    duration: 60,
    exercises: [
      {
        exercise: {
          id: '1',
          name: 'Barbell Squat',
          description: 'A compound exercise that targets the lower body.',
          muscleGroup: 'legs',
          difficulty: 'intermediate',
          equipment: ['barbell', 'squat rack'],
          instructions: [
            'Position the bar on your upper back',
            'Stand with feet shoulder-width apart',
            'Lower until thighs are parallel to ground',
            'Push through heels to return to start'
          ]
        },
        sets: 4,
        reps: 8,
        restTime: 90
      }
    ],
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z'
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockPlans);
} 