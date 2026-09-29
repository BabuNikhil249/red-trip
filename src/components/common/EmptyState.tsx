import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Results Found',
  message = 'No options available matching your selected date or route.',
  actionText = 'Change Search',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white rounded-2xl border border-slate-200 shadow-sm my-6">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 max-w-md mb-6 leading-relaxed">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
