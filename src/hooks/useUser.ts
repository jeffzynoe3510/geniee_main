'use client';

import { useAuth } from '@/context/AuthContext';

interface UseUserResult {
  data: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
  loading: boolean;
  error: Error | null;
  session: any | null;
}

export default function useUser(): UseUserResult {
  try {
    const auth = useAuth();
    if (!auth) {
      return {
        data: null,
        loading: true,
        error: new Error('Auth context not available'),
        session: null
      };
    }

    const { user, loading } = auth;
    return {
      data: user,
      loading,
      error: null,
      session: null
    };
  } catch (err) {
    return {
      data: null,
      loading: false,
      error: err instanceof Error ? err : new Error('Failed to load user data'),
      session: null
    };
  }
}
