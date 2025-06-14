import { NextResponse } from 'next/server';
import { Goal } from '@/types/progress-tracking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      description,
      category,
      priority,
      startDate,
      targetDate,
      milestones
    } = body;

    // Mock goal creation
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      description,
      category,
      priority,
      status: 'not_started',
      startDate,
      targetDate,
      progress: 0,
      milestones: milestones.map((m: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        goalId: '', // Will be set after goal creation
        title: m.title,
        description: m.description,
        status: 'not_started',
        dueDate: m.dueDate
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set goalId for milestones
    goal.milestones = goal.milestones.map(m => ({
      ...m,
      goalId: goal.id
    }));

    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
} 