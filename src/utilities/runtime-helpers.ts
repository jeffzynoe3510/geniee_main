import { useState } from 'react';

interface UploadOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useUpload = (options: UploadOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return [upload, { loading, error }] as const;
}; 