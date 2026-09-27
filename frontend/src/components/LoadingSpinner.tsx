import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading your requests...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div
        className={`${sizeClasses[size]} border-[#DCFCE7] border-t-[#16A34A] rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-sm font-medium text-[#6B756E]">{message}</p>
      )}
    </div>
  );
};
