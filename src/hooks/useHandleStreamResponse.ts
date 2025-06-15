'use client';

import { useCallback } from 'react';

export interface StreamResponse {
  onChunk: (chunk: string) => void;
  onFinish: (message: string) => void;
  onError?: (error: Error) => void;
}

export const useHandleStreamResponse = (callbacks: StreamResponse) => {
  const handleStreamResponse = useCallback((chunk: string) => {
    try {
      // Check if the chunk is a complete JSON object
      if (chunk.trim().startsWith('{') && chunk.trim().endsWith('}')) {
        callbacks.onFinish(chunk);
      } else {
        callbacks.onChunk(chunk);
      }
    } catch (error) {
      if (callbacks.onError && error instanceof Error) {
        callbacks.onError(error);
      } else if (callbacks.onError) {
        callbacks.onError(new Error('An unknown error occurred while processing the stream'));
      }
    }
  }, [callbacks]);

  return handleStreamResponse;
}; 