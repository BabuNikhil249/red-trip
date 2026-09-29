import React from 'react';
import type { BookingStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let styleClasses = 'bg-gray-100 text-gray-700 border-gray-200';

  switch (status) {
    case 'Upcoming':
    case 'Scheduled':
      styleClasses = 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
      break;
    case 'Active':
    case 'In Transit':
      styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium animate-pulse';
      break;
    case 'Completed':
      styleClasses = 'bg-gray-100 text-gray-700 border-gray-300';
      break;
    case 'Cancelled':
      styleClasses = 'bg-red-50 text-red-700 border-red-200 font-medium';
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-4 py-1.5 text-sm font-semibold'
      : 'px-3 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${styleClasses} ${sizeClasses} gap-1.5 shadow-xs`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Active'
            ? 'bg-emerald-500'
            : status === 'Upcoming'
            ? 'bg-blue-500'
            : status === 'Cancelled'
            ? 'bg-red-500'
            : 'bg-gray-400'
        }`}
      />
      {status}
    </span>
  );
};
