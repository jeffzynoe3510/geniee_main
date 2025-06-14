'use client';

import { useState, useEffect } from "react";
import { User, UserProfile } from "@/types/user";

interface UseUserReturn {
  data: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export default function useUser(): UseUserReturn {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/user-profile");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch user profile");
      }

      const userData: UserProfile = await response.json();
      setData(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchUser,
  };
} 