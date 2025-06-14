import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'default' | 'danger' | 'warning';
  className?: string;
  showIcon?: boolean;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 border-gray-300',
  danger: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
};

const iconClasses = {
  default: 'text-gray-400',
  danger: 'text-red-400',
  warning: 'text-yellow-400'
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  variant = 'default',
  className = '',
  showIcon = true
}) => {
  return (
    <div
      className={`rounded-lg border p-4 flex items-start gap-3 ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      {showIcon && (
        <div className={`flex-shrink-0 ${iconClasses[variant]}`}>
          <i className="fas fa-exclamation-circle text-lg" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`mt-2 text-sm font-medium hover:underline ${
              variant === 'default' ? 'text-gray-600' :
              variant === 'danger' ? 'text-red-600' :
              'text-yellow-600'
            }`}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 