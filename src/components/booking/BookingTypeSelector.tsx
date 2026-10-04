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
      subtitle: 'Browse all fleet & tours',
      badge: 'Popular',
      icon: Sparkles,
    },
    {
      id: 'WITH_DRIVER' as SelectorCategory,
      title: 'Vehicle + Chauffeur',
      subtitle: 'Rent SUV/Sedan with driver',
      badge: 'Top Rated',
      icon: Car,
    },
    {
      id: 'SELF_DRIVE' as SelectorCategory,
      title: 'Self-Drive Rentals',
      subtitle: 'Drive yourself without driver',
      badge: 'Zero Deposit',
      icon: ShieldCheck,
    },
    {
      id: 'DRIVER_ONLY' as SelectorCategory,
      title: 'Hire Chauffeur',
      subtitle: 'Verified driver for your car',
      badge: 'Verified',
      icon: UserCheck,
    },
    {
      id: 'AVAILABLE_TRIP' as SelectorCategory,
      title: 'Tour Packages',
      subtitle: 'Karnataka & All India',
      badge: 'All-Inclusive',
      icon: Compass,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 bg-white/90 p-2.5 rounded-3xl backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = activeType === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-300 text-center group cursor-pointer overflow-hidden ${
              isSelected
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-[1.02] ring-2 ring-red-500 font-black'
                : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border border-slate-200/70 hover:border-slate-300'
            }`}
          >
            {/* Top Micro Badge */}
            <span
              className={`absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-all ${
                isSelected
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300 group-hover:text-slate-900'
              }`}
            >
              {opt.badge}
            </span>

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 ${
                isSelected
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'bg-red-50 text-red-600 group-hover:bg-red-100'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <span
              className={`text-xs md:text-sm font-black tracking-tight leading-tight block ${
                isSelected ? 'text-white' : 'text-slate-900'
              }`}
            >
              {opt.title}
            </span>
            <span
              className={`text-[11px] font-medium mt-0.5 line-clamp-1 transition-opacity ${
                isSelected ? 'text-rose-100' : 'text-slate-500 group-hover:text-slate-700'
              }`}
            >
              {opt.subtitle}
            </span>

            {isSelected && (
              <div className="absolute bottom-0 inset-x-4 h-0.5 bg-white rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};
