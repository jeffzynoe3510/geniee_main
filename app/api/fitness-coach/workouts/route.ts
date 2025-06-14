import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now
    const workouts = [
      {
        id: 1,
        name: 'Full Body Workout',
        duration: '45 minutes',
        difficulty: 'Intermediate',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 12 },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Plank', sets: 3, duration: '45 seconds' },
          { name: 'Lunges', sets: 3, reps: 10 }
        ]
      },
      {
        id: 2,
        name: 'Upper Body Focus',
        duration: '30 minutes',
        difficulty: 'Beginner',
        exercises: [
          { name: 'Dumbbell Curls', sets: 3, reps: 12 },
          { name: 'Tricep Dips', sets: 3, reps: 10 },
          { name: 'Shoulder Press', sets: 3, reps: 10 }
        ]
      }
    ];

    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
} 