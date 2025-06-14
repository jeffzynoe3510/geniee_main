import { NextResponse } from 'next/server';
import { MentalHealthRecommendation } from '@/types/mental-health';

const mockRecommendations: MentalHealthRecommendation[] = [
  {
    id: '1',
    userId: '1',
    timestamp: '2024-06-10T00:00:00Z',
    type: 'meditation',
    title: 'Daily Mindfulness Practice',
    description: 'Try a 10-minute guided meditation session to reduce stress and improve focus.',
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    userId: '1',
    timestamp: '2024-06-10T00:00:00Z',
    type: 'exercise',
    title: 'Light Exercise',
    description: 'Take a 20-minute walk to boost your mood and energy levels.',
    priority: 'medium',
    completed: false
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockRecommendations);
} 