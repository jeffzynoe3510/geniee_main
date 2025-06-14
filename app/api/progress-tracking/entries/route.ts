import { NextResponse } from 'next/server';
import { ProgressEntry } from '@/types/progress-tracking';

const mockEntries: ProgressEntry[] = [
  {
    id: '1',
    userId: '1',
    goalId: '1',
    timestamp: '2024-06-14T10:00:00Z',
    value: 60,
    notes: 'Completed 3K run in 18 minutes',
    attachments: ['https://example.com/run-photo.jpg']
  },
  {
    id: '2',
    userId: '1',
    goalId: '1',
    timestamp: '2024-06-07T10:00:00Z',
    value: 40,
    notes: 'Completed 2K run in 12 minutes',
    attachments: []
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockEntries);
} 