import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    history: [
      { id: '1', date: '2024-06-01', result: 'Clear skin' },
      { id: '2', date: '2024-06-10', result: 'Mild acne' }
    ]
  });
} 