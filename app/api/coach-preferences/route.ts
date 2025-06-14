import { NextResponse } from 'next/server';

interface CoachPreferences {
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced';
  preferredDurationMinutes: number;
  preferredCategories: string[];
  equipmentAvailable: string[];
  healthConditions: string[];
  workoutFrequency: number;
  preferredMuscleGroups: string[];
  notificationPreferences: {
    reminders: boolean;
    progressUpdates: boolean;
  };
}

// Mock database of user preferences
const mockPreferences: Record<string, CoachPreferences> = {
  '1': {
    difficultyPreference: 'beginner',
    preferredDurationMinutes: 30,
    preferredCategories: ['strength', 'cardio'],
    equipmentAvailable: ['dumbbells', 'resistance bands'],
    healthConditions: [],
    workoutFrequency: 3,
    preferredMuscleGroups: ['full body'],
    notificationPreferences: {
      reminders: true,
      progressUpdates: true
    }
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const preferences = mockPreferences[userId] || {
      difficultyPreference: 'beginner',
      preferredDurationMinutes: 30,
      preferredCategories: [],
      equipmentAvailable: [],
      healthConditions: [],
      workoutFrequency: 3,
      preferredMuscleGroups: [],
      notificationPreferences: {
        reminders: true,
        progressUpdates: true
      }
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching coach preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId || !preferences) {
      return NextResponse.json(
        { error: 'User ID and preferences are required' },
        { status: 400 }
      );
    }

    // In a real app, this would save to a database
    mockPreferences[userId] = preferences;

    return NextResponse.json({ 
      message: 'Preferences saved successfully',
      preferences 
    });
  } catch (error) {
    console.error('Error saving coach preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
} 