import React from 'react';
import type { BookingType } from '../../types';
import { Car, ShieldCheck, UserCheck, Compass } from 'lucide-react';

interface BookingTypeSelectorProps {
  activeType: BookingType;
  onSelect: (type: BookingType) => void;
}

export const BookingTypeSelector: React.FC<BookingTypeSelectorProps> = ({ activeType, onSelect }) => {
  const options = [
    {
      id: 'WITH_DRIVER' as BookingType,
      title: 'Vehicle + Driver',
      subtitle: 'Rent vehicle with driver',
      icon: Car,
    },
    {
      id: 'SELF_DRIVE' as BookingType,
      title: 'Self Drive',
      subtitle: 'Rent without driver',
      icon: ShieldCheck,
    },
    {
      id: 'DRIVER_ONLY' as BookingType,
      title: 'Hire Driver',
      subtitle: 'Driver for your vehicle',
      icon: UserCheck,
    },
    {
      id: 'AVAILABLE_TRIP' as BookingType,
      title: 'Available Trips',
      subtitle: 'Book individual seat',
      icon: Compass,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/40 p-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = activeType === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`flex flex-col items-center justify-center p-3.5 md:p-4 rounded-xl transition-all duration-200 text-center group ${
              isSelected
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 hover:text-white'
            }`}
          >
            <Icon
              className={`w-6 h-6 mb-1.5 transition-transform group-hover:scale-110 ${
                isSelected ? 'text-white' : 'text-red-400'
              }`}
            />
            <span className="text-xs md:text-sm font-bold tracking-tight">{opt.title}</span>
            <span className="text-[10px] md:text-xs text-slate-300 opacity-90 mt-0.5 line-clamp-1">
              {opt.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
};
