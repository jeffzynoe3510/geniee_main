import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'black';
  className?: string;
  message?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const colorClasses = {
  primary: 'border-[#357AFF] border-t-transparent',
  white: 'border-white border-t-transparent',
  black: 'border-black border-t-transparent'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  message
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className={`mt-2 text-sm ${
          color === 'white' ? 'text-white' : 'text-gray-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 