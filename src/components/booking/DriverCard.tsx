import React from 'react';
import type { Driver } from '../../types';
import { useBookingContext } from '../../context/BookingContext';
import { Star, Award, Globe, ShieldCheck, Building2, Calendar, UserCheck } from 'lucide-react';

interface DriverCardProps {
  driver: Driver;
  onSelect: (driver: Driver) => void;
  isSelected?: boolean;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, onSelect, isSelected = false }) => {
  const { searchParams } = useBookingContext();

  const totalDays = Math.max(1, searchParams.totalDays || 1);
  const distanceKm = Math.max(10, searchParams.distanceKm || 150);
  const travelDate = searchParams.travelDate || new Date().toISOString().split('T')[0];

  const formattedDate = new Date(travelDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate dynamic driver fee
  const daysCost = (driver.dailyRate || 1200) * totalDays;
  const travelBatta = Math.round(distanceKm * 2); // ₹2/km driver allowance for outstation
  const totalCost = daysCost + travelBatta;

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between group hover-lift ${
        isSelected
          ? 'border-emerald-600 ring-4 ring-emerald-600/20 shadow-2xl scale-[1.01]'
          : 'border-slate-200/90 hover:border-emerald-400 hover:shadow-xl'
      }`}
    >
      <div className="space-y-4">
        {/* Availability Confirmation Pill */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Duty Slot: <strong>{formattedDate}</strong></span>
          </div>
          <span className="text-[10px] uppercase font-black bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900">
            Available ✓
          </span>
        </div>

        <div className="flex items-start gap-4">
          {/* Driver Photo with Gold/Verified Ring */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400 shadow-md">
            <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[9px] font-black uppercase text-center py-0.5 tracking-wider">
              Verified ✓
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                {driver.name}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-950 px-2.5 py-1 rounded-full text-xs font-black shrink-0 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{driver.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {driver.experienceYears} Years Chauffeur Experience
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                <Building2 className="w-3 h-3 text-red-600" />
                {driver.agencyName || 'M/S Apoorva Travels'}
              </span>
            </div>
          </div>
        </div>

        {/* Driver Trust Stats & Badges */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Completed</span>
              <span className="font-extrabold text-slate-900">{driver.completedTrips.toLocaleString()} Trips</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Background</span>
              <span className="font-extrabold text-emerald-800">Police Verified</span>
            </div>
          </div>
        </div>

        {/* Bio Quote */}
        <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
          "{driver.bio}"
        </p>

        {/* Languages Spoken */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 font-bold text-[11px] uppercase">Languages:</span>
          <div className="flex flex-wrap gap-1">
            {driver.languages.map((lang, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Tariff Breakdown pill */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-600 font-medium flex justify-between items-center">
          <span>₹{driver.dailyRate}/day × {totalDays}d + ₹{travelBatta} distance batta:</span>
          <span className="font-bold text-slate-900">₹{totalCost.toLocaleString()}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Chauffeur Fee</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-700">₹{totalCost.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-bold">for {totalDays}d</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">₹{driver.dailyRate}/day • ₹{driver.hourlyRate}/hr</span>
        </div>

        <button
          onClick={() => onSelect(driver)}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-md flex items-center gap-1.5 ${
            isSelected
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-slate-900/30 hover:scale-[1.02]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{isSelected ? 'Selected Driver ✓' : 'Hire Chauffeur'}</span>
        </button>
      </div>
    </div>
  );
};

