import { NextResponse } from 'next/server';
import { WorkoutTemplate } from '@/types/workout-generator';

const mockTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Quick Cardio',
    description: 'A fast-paced cardio workout to boost your energy.',
    duration: 15,
    difficulty: 'beginner',
    type: 'cardio',
    equipment: ['Running Shoes'],
    imageUrl: 'https://via.placeholder.com/300x200'
  },
  {
    id: '2',
    name: 'Full Body Strength',
    description: 'Strength workout for all major muscle groups.',
    duration: 45,
    difficulty: 'intermediate',
    type: 'strength',
    equipment: ['Dumbbells'],
    imageUrl: 'https://via.placeholder.com/300x200'
  },
  {
    id: '3',
    name: 'Yoga Flexibility',
    description: 'Improve flexibility and balance with yoga.',
    duration: 30,
    difficulty: 'beginner',
    type: 'flexibility',
    equipment: ['Yoga Mat'],
    imageUrl: 'https://via.placeholder.com/300x200'
  }
];

export async function GET() {
  return NextResponse.json(mockTemplates);
} 