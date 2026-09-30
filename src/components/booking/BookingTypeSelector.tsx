import React from 'react';
import type { BookingType } from '../../types';
import { Car, ShieldCheck, UserCheck, Compass, Sparkles } from 'lucide-react';

export type SelectorCategory = 'ALL' | BookingType;

interface BookingTypeSelectorProps {
  activeType: SelectorCategory;
  onSelect: (type: SelectorCategory) => void;
}

export const BookingTypeSelector: React.FC<BookingTypeSelectorProps> = ({ activeType, onSelect }) => {
  const options = [
    {
      id: 'ALL' as SelectorCategory,
      title: 'All Services',
      subtitle: 'Display all options',
      icon: Sparkles,
    },
    {
      id: 'WITH_DRIVER' as SelectorCategory,
      title: 'Vehicle + Driver',
      subtitle: 'Rent with chauffeur',
      icon: Car,
    },
    {
      id: 'SELF_DRIVE' as SelectorCategory,
      title: 'Self Drive',
      subtitle: 'Rent without driver',
      icon: ShieldCheck,
    },
    {
      id: 'DRIVER_ONLY' as SelectorCategory,
      title: 'Hire Driver',
      subtitle: 'Chauffeur for your car',
      icon: UserCheck,
    },
    {
      id: 'AVAILABLE_TRIP' as SelectorCategory,
      title: 'Trip Packages',
      subtitle: 'Karnataka & All India',
      icon: Compass,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-slate-900/40 p-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = activeType === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`flex flex-col items-center justify-center p-3 md:p-3.5 rounded-xl transition-all duration-200 text-center group cursor-pointer ${
              isSelected
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 hover:text-white'
            }`}
          >
            <Icon
              className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                isSelected ? 'text-white' : 'text-red-400'
              }`}
            />
            <span className="text-xs md:text-sm font-bold tracking-tight">{opt.title}</span>
            <span className="text-[10px] text-slate-300 opacity-90 mt-0.5 line-clamp-1">
              {opt.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
};
