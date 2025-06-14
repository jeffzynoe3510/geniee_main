import { NextResponse } from 'next/server';
import { Goal, GoalStatus } from '@/types/progress-tracking';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;
    const goalId = params.id;

    // Mock goal status update
    const updatedGoal: Goal = {
      id: goalId,
      userId: '1', // In a real app, get from authenticated user
      title: 'Run 5K', // In a real app, get from database
      description: 'Complete a 5K run in under 30 minutes',
      category: 'fitness',
      priority: 'high',
      status: status as GoalStatus,
      startDate: '2024-06-01T00:00:00Z',
      targetDate: '2024-07-01T00:00:00Z',
      progress: 60,
      milestones: [
        {
          id: '1',
          goalId,
          title: 'Run 2K',
          description: 'Complete a 2K run without stopping',
          status: 'completed',
          dueDate: '2024-06-15T00:00:00Z',
          completedAt: '2024-06-14T00:00:00Z'
        },
        {
          id: '2',
          goalId,
          title: 'Run 4K',
          description: 'Complete a 4K run without stopping',
          status: 'in_progress',
          dueDate: '2024-06-30T00:00:00Z'
        }
      ],
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedGoal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update goal status' },
      { status: 500 }
    );
  }
} 