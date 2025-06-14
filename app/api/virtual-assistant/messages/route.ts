import { NextResponse } from 'next/server';
import { Message } from '@/types/virtual-assistant';

const mockMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    content: 'Hello, how can you help me today?',
    timestamp: '2024-06-10T10:00:00Z',
    isUser: true
  },
  {
    id: '2',
    userId: '1',
    content: 'I can help you with fitness, skin analysis, and more!',
    timestamp: '2024-06-10T10:01:00Z',
    isUser: false
  }
];

export async function GET(request: Request) {
  // In a real app, filter by userId
  return NextResponse.json(mockMessages);
} 