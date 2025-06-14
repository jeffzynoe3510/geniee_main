import { NextResponse } from 'next/server';
import { UserPreferences } from '@/types/workout-generator';

const mockPreferences: UserPreferences = {
  userId: '1',
  preferredDuration: 30,
  preferredDifficulty: 'intermediate',
  preferredTypes: ['cardio', 'strength'],
  availableEquipment: ['Dumbbells', 'Yoga Mat'],
  goals: ['weightLoss', 'endurance']
};

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockPreferences);
} 