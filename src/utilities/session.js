// Session management utility
// TODO: Replace with actual authentication system (e.g., NextAuth.js, Auth0, etc.)

class SessionError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SessionError';
    this.code = code;
  }
}

export function getSession() {
  try {
    // TODO: Replace with actual session retrieval logic
    // For now, we'll use a mock session stored in localStorage
    const mockSession = localStorage.getItem('mockSession');
    
    if (!mockSession) {
      // If no session exists, create a new mock session
      const newSession = {
        user: {
          id: 'mock-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
          createdAt: new Date().toISOString()
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };
      
      localStorage.setItem('mockSession', JSON.stringify(newSession));
      return newSession;
    }

    const session = JSON.parse(mockSession);
    
    // Validate session expiration
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem('mockSession');
      throw new SessionError('Session expired', 'SESSION_EXPIRED');
    }

    return session;
  } catch (error) {
    if (error instanceof SessionError) {
      throw error;
    }
    throw new SessionError('Failed to get session', 'SESSION_ERROR');
  }
}

export function validateSession(session) {
  if (!session) {
    throw new SessionError('No session found', 'NO_SESSION');
  }

  if (!session.user) {
    throw new SessionError('Invalid session: no user data', 'INVALID_SESSION');
  }

  if (!session.user.id) {
    throw new SessionError('Invalid session: no user ID', 'INVALID_SESSION');
  }

  if (new Date(session.expires) < new Date()) {
    throw new SessionError('Session expired', 'SESSION_EXPIRED');
  }

  return true;
}

export function clearSession() {
  try {
    localStorage.removeItem('mockSession');
    return true;
  } catch (error) {
    throw new SessionError('Failed to clear session', 'SESSION_ERROR');
  }
}

// Helper function to check if user has required role
export function hasRole(session, requiredRole) {
  try {
    validateSession(session);
    return session.user.role === requiredRole;
  } catch (error) {
    return false;
  }
} 