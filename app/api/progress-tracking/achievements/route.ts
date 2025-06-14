import { NextResponse } from 'next/server';
import { Achievement } from '@/types/progress-tracking';

const mockAchievements: Achievement[] = [
  {
    id: '1',
    userId: '1',
    title: 'First Milestone',
    description: 'Completed your first goal milestone',
    category: 'fitness',
    unlockedAt: '2024-06-14T00:00:00Z',
    icon: 'https://example.com/first-milestone.png'
  },
  {
    id: '2',
    userId: '1',
    title: 'Consistent Progress',
    description: 'Logged progress for 7 consecutive days',
    category: 'fitness',
    unlockedAt: '2024-06-10T00:00:00Z',
    icon: 'https://example.com/consistent-progress.png'
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockAchievements);
} 