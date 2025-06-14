import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LoadingContextType {
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  loading: boolean;
  loadingMessage: string;
}

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = (message = '') => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
    setLoadingMessage('');
  };

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, loading, loadingMessage }}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
          <LoadingSpinner size="lg" />
          {loadingMessage && (
            <p className="mt-4 text-gray-600 text-center">{loadingMessage}</p>
          )}
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}; 