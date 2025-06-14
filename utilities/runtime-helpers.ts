'use client';

import { useState } from 'react';

export const useUpload = () => {
  const [loading, setLoading] = useState(false);

  const upload = async (file: File) => {
    setLoading(true);
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
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading };
}; 