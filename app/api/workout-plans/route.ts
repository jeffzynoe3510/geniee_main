import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now - replace with actual database call
    const workoutPlans = [
      {
        id: '1',
        name: 'Full Body Workout',
        lastUpdated: '2 days ago'
      },
      {
        id: '2',
        name: 'Upper Body Focus',
        lastUpdated: '1 week ago'
      }
    ];

    return NextResponse.json(workoutPlans);
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout plans' },
      { status: 500 }
    );
  }
} 