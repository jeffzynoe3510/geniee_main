import { NextResponse } from 'next/server';
import { AssistantSettings } from '@/types/virtual-assistant';

const mockSettings: AssistantSettings = {
  userId: '1',
  language: 'en',
  notifications: true,
  theme: 'dark'
};

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockSettings);
} 