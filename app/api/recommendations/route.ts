import { NextResponse } from 'next/server';
import { mockRecommendations } from '@/lib/mockRecommendations';
import { Recommendation } from '@/types/recommendations';

export async function GET() {
  return NextResponse.json(mockRecommendations);
}

export async function POST(request: Request) {
  const recommendation = await request.json();
  const newRecommendation: Recommendation = {
    ...recommendation,
    id: `rec-${mockRecommendations.length + 1}`,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isRead: false,
    isCompleted: false
  };
  mockRecommendations.push(newRecommendation);
  return NextResponse.json(newRecommendation);
} 