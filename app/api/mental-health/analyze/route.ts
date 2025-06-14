import { NextResponse } from 'next/server';
import { MentalHealthInsight } from '@/types/mental-health';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    // Mock insights generation
    const insights: MentalHealthInsight[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        timestamp: new Date().toISOString(),
        type: 'mood_trend',
        title: 'Mood Analysis',
        description: 'Your mood has been stable with a slight positive trend.',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: [3, 3, 4, 4, 4, 5, 5]
        }
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        timestamp: new Date().toISOString(),
        type: 'stress_pattern',
        title: 'Stress Analysis',
        description: 'Stress levels are highest during work hours.',
        data: {
          labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
          values: [2, 4, 3, 2]
        }
      }
    ];

    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 