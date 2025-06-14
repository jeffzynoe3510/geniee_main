import { getSession } from '../../../utilities/session';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // TODO: Replace with actual registration logic
    // For now, we'll use a mock registration
    const session = {
      user: {
        id: 'mock-user-id',
        name: name || 'New User',
        email: email,
        role: 'user'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Store session in localStorage (in a real app, this would be handled by a proper auth system)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockSession', JSON.stringify(session));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Sign up error:', error);
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 