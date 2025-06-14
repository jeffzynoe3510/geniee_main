import { NextResponse } from 'next/server';
import { FitnessGoal } from '@/types/fitness-coach';

const mockGoals: FitnessGoal[] = [
  {
    id: '1',
    userId: '1',
    goalType: 'weightLoss',
    targetValue: 70,
    currentValue: 75,
    unit: 'kg',
    startDate: '2024-06-01',
    endDate: '2024-08-01'
  },
  {
    id: '2',
    userId: '1',
    goalType: 'endurance',
    targetValue: 10,
    currentValue: 5,
    unit: 'km',
    startDate: '2024-06-01'
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockGoals);
} 