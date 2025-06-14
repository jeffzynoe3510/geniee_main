import { NextResponse } from 'next/server';

type MoodLevel = 'very_low' | 'low' | 'neutral' | 'good' | 'very_good';
type RatingLevel = 1 | 2 | 3 | 4 | 5;

interface MoodLog {
  id: string;
  userId: string;
  timestamp: string;
  mood: MoodLevel;
  energy: RatingLevel;
  stress: RatingLevel;
  anxiety: RatingLevel;
  sleep: RatingLevel;
  notes?: string;
  activities: string[];
  triggers: string[];
}

// Mock database of mood logs
const mockLogs: MoodLog[] = [
  {
    id: '1',
    userId: '1',
    timestamp: '2024-03-12T08:00:00Z',
    mood: 'good',
    energy: 4,
    stress: 2,
    anxiety: 2,
    sleep: 4,
    notes: 'Feeling productive today',
    activities: ['exercise', 'meditation'],
    triggers: []
  },
  {
    id: '2',
    userId: '1',
    timestamp: '2024-03-11T08:00:00Z',
    mood: 'neutral',
    energy: 3,
    stress: 3,
    anxiety: 3,
    sleep: 3,
    notes: 'Regular day',
    activities: ['work', 'reading'],
    triggers: ['work deadline']
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let userLogs = mockLogs.filter(log => log.userId === userId);

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      userLogs = userLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });
    }

    return NextResponse.json(userLogs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      mood,
      energy,
      stress,
      anxiety,
      sleep,
      notes,
      activities,
      triggers
    } = body;

    if (!userId || !mood || !energy || !stress || !anxiety || !sleep) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newLog: MoodLog = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      mood,
      energy,
      stress,
      anxiety,
      sleep,
      notes,
      activities: activities || [],
      triggers: triggers || []
    };

    mockLogs.push(newLog);
    return NextResponse.json(newLog);
  } catch (error) {
    console.error('Error creating mood log:', error);
    return NextResponse.json(
      { error: 'Failed to create mood log' },
      { status: 500 }
    );
  }
} 