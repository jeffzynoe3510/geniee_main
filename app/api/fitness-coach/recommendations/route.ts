import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now
    const recommendations = [
      {
        id: 1,
        title: 'Beginner Workout Plan',
        description: 'Perfect for those just starting their fitness journey',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 10 },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Plank', sets: 3, duration: '30 seconds' }
        ]
      },
      {
        id: 2,
        title: 'Intermediate Strength Training',
        description: 'Build muscle and increase strength',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8 },
          { name: 'Deadlifts', sets: 4, reps: 6 },
          { name: 'Pull-ups', sets: 3, reps: 8 }
        ]
      }
    ];

    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
} 