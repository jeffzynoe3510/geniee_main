import { useState, useCallback, useRef } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
  cacheTime?: number;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData = null,
    onSuccess,
    onError,
    retryCount: maxRetries = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    retryCount: 0
  });

  const cacheRef = useRef<{
    data: T | null;
    timestamp: number;
  }>({
    data: null,
    timestamp: 0
  });

  const execute = useCallback(async (force = false) => {
    // Check cache if not forcing refresh
    if (!force && cacheRef.current.data && Date.now() - cacheRef.current.timestamp < cacheTime) {
      setState(prev => ({ ...prev, data: cacheRef.current.data }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      
      // Update cache
      cacheRef.current = {
        data,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        retryCount: 0
      }));

      onSuccess?.(data);
    } catch (error) {
      const currentRetryCount = state.retryCount + 1;
      
      if (currentRetryCount < maxRetries) {
        // Retry after delay
        setTimeout(() => {
          setState(prev => ({ ...prev, retryCount: currentRetryCount }));
          execute(true);
        }, retryDelay * currentRetryCount);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error as Error,
          retryCount: 0
        }));
        onError?.(error as Error);
      }
    }
  }, [apiCall, maxRetries, retryDelay, cacheTime, onSuccess, onError, state.retryCount]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      retryCount: 0
    });
    cacheRef.current = {
      data: null,
      timestamp: 0
    };
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
    isCached: cacheRef.current.data !== null && Date.now() - cacheRef.current.timestamp < cacheTime
  };
}

export default useApi; 