import { NextResponse } from 'next/server';

interface SleepRecommendation {
  id: string;
  userId: string;
  type: 'sleep_hygiene' | 'schedule' | 'environment' | 'lifestyle';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isRead: boolean;
  isCompleted: boolean;
}

// Mock database of sleep recommendations
const mockRecommendations: SleepRecommendation[] = [
  {
    id: '1',
    userId: '1',
    type: 'sleep_hygiene',
    title: 'Maintain Consistent Sleep Schedule',
    description: 'Try to go to bed and wake up at the same time every day, even on weekends. This helps regulate your body\'s internal clock.',
    priority: 'high',
    createdAt: '2024-03-12T10:00:00Z',
    isRead: false,
    isCompleted: false
  },
  {
    id: '2',
    userId: '1',
    type: 'environment',
    title: 'Optimize Your Sleep Environment',
    description: 'Keep your bedroom cool, dark, and quiet. Consider using blackout curtains and a white noise machine.',
    priority: 'medium',
    createdAt: '2024-03-12T10:00:00Z',
    isRead: false,
    isCompleted: false
  },
  {
    id: '3',
    userId: '1',
    type: 'lifestyle',
    title: 'Limit Caffeine Intake',
    description: 'Avoid consuming caffeine after 2 PM as it can interfere with your sleep quality.',
    priority: 'medium',
    createdAt: '2024-03-12T10:00:00Z',
    isRead: false,
    isCompleted: false
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userRecommendations = mockRecommendations.filter(
      rec => rec.userId === userId
    );

    return NextResponse.json(userRecommendations);
  } catch (error) {
    console.error('Error fetching sleep recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, recommendationId, action } = body;

    if (!userId || !recommendationId || !action) {
      return NextResponse.json(
        { error: 'User ID, recommendation ID, and action are required' },
        { status: 400 }
      );
    }

    const recommendation = mockRecommendations.find(
      rec => rec.id === recommendationId && rec.userId === userId
    );

    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    if (action === 'mark_read') {
      recommendation.isRead = true;
    } else if (action === 'mark_completed') {
      recommendation.isCompleted = true;
    }

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Error updating sleep recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
} 