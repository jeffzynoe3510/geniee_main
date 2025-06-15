'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';

interface UseUserResult {
  data: User | null;
  loading: boolean;
  error: Error | null;
  session: any | null;
}

export function useUser(): UseUserResult {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        if (session?.user?.email) {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            throw new Error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch user data'));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'loading') {
      setLoading(true);
    } else {
      fetchUser();
    }
  }, [session, status]);

  return {
    data: user,
    loading,
    error,
    session
  };
}
