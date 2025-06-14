import { NextResponse } from 'next/server';
import { Challenge } from '@/types/social-support';

// Mock data
const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    groupId: 'group-1',
    createdBy: 'user-1',
    title: '30-Day Running Challenge',
    description: 'Run at least 1 mile every day for 30 days.',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-01-31T00:00:00Z',
    participants: ['current-user-id', 'user-2', 'user-3'],
    type: 'fitness',
    rules: ['Track your runs', 'Share your progress', 'Support others'],
    rewards: ['Certificate of completion', 'Group recognition'],
    status: 'active'
  },
  {
    id: 'challenge-2',
    groupId: 'group-2',
    createdBy: 'user-2',
    title: 'Healthy Recipe Challenge',
    description: 'Share a new healthy recipe every week.',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-01-31T00:00:00Z',
    participants: ['user-2', 'user-3'],
    type: 'nutrition',
    rules: ['Include ingredients', 'Share photos', 'Be creative'],
    rewards: ['Recipe book compilation', 'Group recognition'],
    status: 'upcoming'
  }
];

export async function GET(request: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  const challenges = mockChallenges.filter(challenge => challenge.groupId === groupId);
  return NextResponse.json(challenges);
}

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  const challenge = await request.json();
  const newChallenge: Challenge = {
    ...challenge,
    id: `challenge-${mockChallenges.length + 1}`,
    groupId,
    participants: [challenge.createdBy],
    status: 'upcoming'
  };
  mockChallenges.push(newChallenge);
  return NextResponse.json(newChallenge);
} 