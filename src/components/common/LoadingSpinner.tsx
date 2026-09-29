import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-red-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
};
