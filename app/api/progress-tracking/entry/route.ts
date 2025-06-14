import { NextResponse } from 'next/server';
import { ProgressEntry } from '@/types/progress-tracking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      goalId,
      progress,
      notes,
      attachments
    } = body;

    // Mock progress entry creation
    const entry: ProgressEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      goalId,
      timestamp: new Date().toISOString(),
      value: progress,
      notes,
      attachments
    };

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create progress entry' },
      { status: 500 }
    );
  }
} 