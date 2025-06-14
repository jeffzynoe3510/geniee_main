import { NextResponse } from 'next/server';
import { mockRecommendations } from '@/lib/mockRecommendations';
import { FeedbackType } from '@/types/recommendations';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { feedback } = await request.json() as { feedback: FeedbackType };
  const recommendation = mockRecommendations.find(r => r.id === id);
  if (recommendation) {
    recommendation.feedback = feedback;
    return NextResponse.json(recommendation);
  }
  return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
} 