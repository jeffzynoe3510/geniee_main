import { clearSession } from '../../../utilities/session';

export async function POST() {
  try {
    // Clear the session
    clearSession();
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return Response.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
} 