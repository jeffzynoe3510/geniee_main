import { NextResponse } from 'next/server';
import { MoodLog } from '@/types/mental-health';

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

    // Mock mood log creation
    const log: MoodLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      timestamp: new Date().toISOString(),
      mood,
      energy,
      stress,
      anxiety,
      sleep,
      notes,
      activities,
      triggers
    };

    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create mood log' },
      { status: 500 }
    );
  }
} 