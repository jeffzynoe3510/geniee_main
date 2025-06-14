import { NextResponse } from 'next/server';
import { mockRecommendations } from '@/lib/mockRecommendations';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const recommendation = mockRecommendations.find(r => r.id === id);
  if (recommendation) {
    recommendation.isRead = true;
    return NextResponse.json(recommendation);
  }
  return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
} 