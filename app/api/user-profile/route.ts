import { NextResponse } from 'next/server';
import { UserProfile } from '@/types/user';

export async function GET(request: Request) {
  return NextResponse.json({
    id: '1',
    name: 'Test User',
    mirror_settings: {
      calibration: true
    }
  });
} 