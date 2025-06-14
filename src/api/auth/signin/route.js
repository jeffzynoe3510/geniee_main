import { getSession } from '../../../utilities/session';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with actual authentication logic
    // For now, we'll use a mock authentication
    if (email === 'test@example.com' && password === 'password') {
      const session = {
        user: {
          id: 'mock-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      // Store session in localStorage (in a real app, this would be handled by a proper auth system)
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockSession', JSON.stringify(session));
      }

      return Response.json({ success: true });
    }

    return Response.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return Response.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 