import { NextResponse } from 'next/server';

interface SleepSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
  metrics: {
    deepSleep: number; // percentage
    remSleep: number; // percentage
    interruptions: number;
    heartRate: {
      average: number;
      min: number;
      max: number;
    };
  };
}

// Mock database of sleep sessions
const mockSessions: SleepSession[] = [
  {
    id: '1',
    userId: '1',
    startTime: '2024-03-10T22:00:00Z',
    endTime: '2024-03-11T06:00:00Z',
    duration: 480,
    quality: 'good',
    notes: 'Slept well, felt rested',
    metrics: {
      deepSleep: 25,
      remSleep: 20,
      interruptions: 2,
      heartRate: {
        average: 60,
        min: 55,
        max: 65
      }
    }
  },
  {
    id: '2',
    userId: '1',
    startTime: '2024-03-11T22:30:00Z',
    endTime: '2024-03-12T05:30:00Z',
    duration: 420,
    quality: 'fair',
    notes: 'Woke up a few times',
    metrics: {
      deepSleep: 20,
      remSleep: 15,
      interruptions: 4,
      heartRate: {
        average: 65,
        min: 58,
        max: 70
      }
    }
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

    const userSessions = mockSessions.filter(session => session.userId === userId);
    return NextResponse.json(userSessions);
  } catch (error) {
    console.error('Error fetching sleep sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sleep sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, startTime, endTime, notes } = body;

    if (!userId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'User ID, start time, and end time are required' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    // In a real app, this would calculate actual metrics
    const newSession: SleepSession = {
      id: Date.now().toString(),
      userId,
      startTime,
      endTime,
      duration,
      quality: 'good', // This would be calculated based on metrics
      notes,
      metrics: {
        deepSleep: 25,
        remSleep: 20,
        interruptions: 2,
        heartRate: {
          average: 60,
          min: 55,
          max: 65
        }
      }
    };

    mockSessions.push(newSession);
    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Error creating sleep session:', error);
    return NextResponse.json(
      { error: 'Failed to create sleep session' },
      { status: 500 }
    );
  }
} 