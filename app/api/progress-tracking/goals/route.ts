import { NextResponse } from 'next/server';
import { Goal } from '@/types/progress-tracking';

const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    title: 'Run 5K',
    description: 'Complete a 5K run in under 30 minutes',
    category: 'fitness',
    priority: 'high',
    status: 'in_progress',
    startDate: '2024-06-01T00:00:00Z',
    targetDate: '2024-07-01T00:00:00Z',
    progress: 60,
    milestones: [
      {
        id: '1',
        goalId: '1',
        title: 'Run 2K',
        description: 'Complete a 2K run without stopping',
        status: 'completed',
        dueDate: '2024-06-15T00:00:00Z',
        completedAt: '2024-06-14T00:00:00Z'
      },
      {
        id: '2',
        goalId: '1',
        title: 'Run 4K',
        description: 'Complete a 4K run without stopping',
        status: 'in_progress',
        dueDate: '2024-06-30T00:00:00Z'
      }
    ],
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-14T00:00:00Z'
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockGoals);
} 