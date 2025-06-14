import { NextResponse } from 'next/server';
import { SleepSession } from '@/types/sleep-analysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, startTime, endTime, notes } = body;

    // Mock sleep session creation
    const session: SleepSession = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      startTime,
      endTime,
      duration: Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)),
      quality: 'good',
      deepSleep: Math.floor(Math.random() * 120),
      lightSleep: Math.floor(Math.random() * 240),
      remSleep: Math.floor(Math.random() * 120),
      interruptions: Math.floor(Math.random() * 5),
      notes
    };

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create sleep session' },
      { status: 500 }
    );
  }
} 