import { NextResponse } from 'next/server';
import { SupportGroup } from '@/types/social-support';

// Mock data
const mockGroups: SupportGroup[] = [
  {
    id: 'group-1',
    name: 'Fitness Enthusiasts',
    description: 'A group for fitness lovers to share tips and motivate each other.',
    type: 'fitness',
    createdBy: 'user-1',
    createdAt: '2023-01-01T00:00:00Z',
    members: ['current-user-id', 'user-2', 'user-3'],
    moderators: ['user-1'],
    rules: ['Be respectful', 'No spam', 'Share your progress'],
    isPrivate: false,
    memberCount: 3
  },
  {
    id: 'group-2',
    name: 'Healthy Eating',
    description: 'Share recipes and nutrition tips for a healthier lifestyle.',
    type: 'nutrition',
    createdBy: 'user-2',
    createdAt: '2023-01-02T00:00:00Z',
    members: ['user-2', 'user-3'],
    moderators: ['user-2'],
    rules: ['No junk food promotion', 'Share recipes', 'Be supportive'],
    isPrivate: false,
    memberCount: 2
  }
];

export async function GET() {
  return NextResponse.json(mockGroups);
}

export async function POST(request: Request) {
  const group = await request.json();
  const newGroup: SupportGroup = {
    ...group,
    id: `group-${mockGroups.length + 1}`,
    createdAt: new Date().toISOString(),
    members: [group.createdBy],
    moderators: [group.createdBy],
    memberCount: 1
  };
  mockGroups.push(newGroup);
  return NextResponse.json(newGroup);
} 