import { NextResponse } from 'next/server';
import { UserPreference } from '@/types/recommendations';

// Mock data
const mockPreferences: UserPreference[] = [
  {
    id: 'pref-1',
    userId: 'current-user-id',
    type: 'workout',
    preferences: {
      preferredDuration: 30, // minutes
      preferredIntensity: 'medium',
      preferredEquipment: ['dumbbells', 'resistance bands'],
      targetMuscles: ['chest', 'shoulders', 'arms']
    },
    lastUpdated: '2023-01-01T00:00:00Z'
  },
  {
    id: 'pref-2',
    userId: 'current-user-id',
    type: 'nutrition',
    preferences: {
      dietaryRestrictions: ['vegetarian'],
      preferredMealTypes: ['breakfast', 'lunch', 'dinner'],
      calorieGoal: 2000,
      macroGoals: {
        protein: 150,
        carbs: 200,
        fat: 70
      }
    },
    lastUpdated: '2023-01-02T00:00:00Z'
  }
];

export async function GET() {
  return NextResponse.json(mockPreferences);
}

export async function PATCH(request: Request) {
  const preference = await request.json();
  const index = mockPreferences.findIndex(p => p.id === preference.id);
  if (index !== -1) {
    mockPreferences[index] = { ...mockPreferences[index], ...preference };
    return NextResponse.json(mockPreferences[index]);
  }
  return NextResponse.json({ error: 'Preference not found' }, { status: 404 });
} 