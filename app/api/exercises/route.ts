import { NextResponse } from 'next/server';

interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number; // in minutes
  calories: number;
  equipment: string[];
  muscleGroups: string[];
  videoUrl?: string;
  imageUrl?: string;
}

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    difficulty: 'beginner',
    category: 'strength',
    duration: 10,
    calories: 100,
    equipment: [],
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    imageUrl: 'https://example.com/pushup.jpg'
  },
  {
    id: '2',
    name: 'Squats',
    description: 'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.',
    difficulty: 'beginner',
    category: 'strength',
    duration: 15,
    calories: 150,
    equipment: [],
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
    imageUrl: 'https://example.com/squat.jpg'
  },
  {
    id: '3',
    name: 'Plank',
    description: 'An isometric core exercise that improves stability and posture.',
    difficulty: 'beginner',
    category: 'core',
    duration: 5,
    calories: 50,
    equipment: [],
    muscleGroups: ['core', 'shoulders'],
    imageUrl: 'https://example.com/plank.jpg'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { difficulty } = body;

    // Filter exercises based on difficulty if provided
    const filteredExercises = difficulty 
      ? mockExercises.filter(ex => ex.difficulty === difficulty)
      : mockExercises;

    return NextResponse.json({ exercises: filteredExercises });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
} 