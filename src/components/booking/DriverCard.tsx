import React from 'react';
import type { Driver } from '../../types';
import { Star, Award, Globe, ShieldCheck, Building2 } from 'lucide-react';

interface DriverCardProps {
  driver: Driver;
  onSelect: (driver: Driver) => void;
  isSelected?: boolean;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, onSelect, isSelected = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between group ${
        isSelected
          ? 'border-red-600 ring-2 ring-red-600/30 shadow-xl'
          : 'border-slate-200 hover:border-red-300 hover:shadow-lg'
      }`}
    >
      <div>
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm">
            <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[9px] font-black uppercase text-center py-0.5">
              Verified
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 truncate">{driver.name}</h3>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{driver.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {driver.experienceYears} Years Chauffeur Experience
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                <Building2 className="w-3 h-3 text-red-600" />
                {driver.agencyName || 'M/S Apoorva Travels'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-red-500" />
                {driver.completedTrips.toLocaleString()} Trips
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Background Checked
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
            "{driver.bio}"
          </p>

          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">Languages:</span>
            <div className="flex flex-wrap gap-1">
              {driver.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Hourly / Daily Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">₹{driver.dailyRate}</span>
            <span className="text-xs text-slate-500">/day</span>
          </div>
          <span className="text-[11px] text-slate-500 block">or ₹{driver.hourlyRate}/hr</span>
        </div>

        <button
          onClick={() => onSelect(driver)}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
          }`}
        >
          {isSelected ? 'Selected Driver ✓' : 'Hire Driver'}
        </button>
      </div>
    </div>
  );
};
