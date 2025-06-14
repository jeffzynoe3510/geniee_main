import { NextResponse } from 'next/server';
import { UserConnection } from '@/types/social-support';

// Mock data
const mockConnections: UserConnection[] = [
  {
    id: '1',
    userId: 'current-user-id',
    connectedUserId: 'user-2',
    status: 'connected',
    connectedAt: '2023-01-01T00:00:00Z',
    lastInteractionAt: '2023-01-02T00:00:00Z',
    sharedGoals: ['goal-1', 'goal-2'],
    mutualGroups: ['group-1']
  },
  {
    id: '2',
    userId: 'current-user-id',
    connectedUserId: 'user-3',
    status: 'pending',
    connectedAt: '2023-01-03T00:00:00Z',
    lastInteractionAt: '2023-01-03T00:00:00Z',
    sharedGoals: [],
    mutualGroups: []
  }
];

export async function GET() {
  return NextResponse.json(mockConnections);
} 