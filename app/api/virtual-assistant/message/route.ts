import { NextResponse } from 'next/server';
import { Message } from '@/types/virtual-assistant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message: Message = {
      id: Date.now().toString(),
      userId: body.userId,
      content: body.content,
      timestamp: body.timestamp,
      isUser: body.isUser
    };
    // In a real app, save to DB
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
} 