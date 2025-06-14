import { NextResponse } from 'next/server';
import { MentalHealthInsight } from '@/types/mental-health';

const mockInsights: MentalHealthInsight[] = [
  {
    id: '1',
    userId: '1',
    timestamp: '2024-06-10T00:00:00Z',
    type: 'mood_trend',
    title: 'Mood Improvement',
    description: 'Your mood has been trending positively over the past week.',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [3, 3, 4, 4, 4, 5, 5]
    }
  },
  {
    id: '2',
    userId: '1',
    timestamp: '2024-06-10T00:00:00Z',
    type: 'stress_pattern',
    title: 'Stress Levels',
    description: 'Stress levels tend to peak during work hours.',
    data: {
      labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
      values: [2, 4, 3, 2]
    }
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockInsights);
} 