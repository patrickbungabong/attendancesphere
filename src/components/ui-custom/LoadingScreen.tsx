
import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-primary opacity-30"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-primary">Loading...</p>
      </div>
    </div>
  );
};
