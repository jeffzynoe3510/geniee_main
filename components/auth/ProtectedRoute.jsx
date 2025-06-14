'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, validateSession } from '@/utilities/session';

export default function ProtectedRoute({ 
  children, 
  requiredRole = null,
  fallback = '/auth/signin'
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = getSession();
        validateSession(session);

        // Check role if required
        if (requiredRole && session.user.role !== requiredRole) {
          throw new Error('Unauthorized: Insufficient permissions');
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole, fallback]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
} 