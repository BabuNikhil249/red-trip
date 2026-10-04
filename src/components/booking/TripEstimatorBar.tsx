import React from 'react';
import { Calendar, Navigation, Clock, CheckCircle2, Calculator, ShieldCheck } from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';

interface TripEstimatorBarProps {
  title?: string;
  subtitle?: string;
  isDriverOnly?: boolean;
}

export const TripEstimatorBar: React.FC<TripEstimatorBarProps> = ({
  title = 'Select Date & Distance for Live KM + Day Price',
  subtitle = 'Choose your travel date in the calendar to verify availability and calculate your exact fare based on daily tariff and kilometers.',
  isDriverOnly = false,
}) => {
  const { searchParams, setSearchParams } = useBookingContext();

  const travelDate = searchParams.travelDate || new Date().toISOString().split('T')[0];
  const returnDate = searchParams.returnDate || '';
  const totalDays = Math.max(1, searchParams.totalDays || 1);
  const distanceKm = Math.max(10, searchParams.distanceKm || 150);

  const handleDateChange = (newDate: string) => {
    setSearchParams((prev) => {
      let updatedReturn = prev.returnDate;
      if (updatedReturn && new Date(updatedReturn) < new Date(newDate)) {
        updatedReturn = newDate;
      }
      return {
        ...prev,
        travelDate: newDate,
        returnDate: updatedReturn,
      };
    });
  };

  const handleDaysChange = (days: number) => {
    const start = new Date(travelDate);
    const end = new Date(start.getTime() + (days - 1) * 86400000);
    const endFormatted = end.toISOString().split('T')[0];

    setSearchParams((prev) => ({
      ...prev,
      totalDays: days,
      returnDate: endFormatted,
    }));
  };

  const handleReturnDateChange = (retDate: string) => {
    const start = new Date(travelDate);
    const end = new Date(retDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    setSearchParams((prev) => ({
      ...prev,
      returnDate: retDate,
      totalDays: diffDays,
    }));
  };

  const handleKmChange = (km: number) => {
    setSearchParams((prev) => ({
      ...prev,
      distanceKm: Math.max(10, km),
    }));
  };

  // Format readable travel date
  const formattedDate = new Date(travelDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 border-2 border-red-200/90 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background soft ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/70 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider border border-red-200">
              <Calculator className="w-3.5 h-3.5 text-red-600" /> Step 1: KM & Day Tariff Engine
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fleet Available on {formattedDate}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 max-w-3xl">{subtitle}</p>
        </div>

        {/* Live Calculation Summary Pill */}
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0 shadow-md">
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">
              Active Parameters
            </span>
            <span className="text-sm font-black text-white">
              {totalDays} {totalDays === 1 ? 'Day' : 'Days'} • {distanceKm} KM
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Form Fields: Date Calendar + Days + Distance KM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 relative z-10">
        {/* 1. Travel Date Calendar Picker */}
        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-600" /> 1. Select Journey Date *
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              Calendar Picker
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={travelDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 hover:bg-white border-2 border-slate-200 focus:border-red-500 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-red-100 transition-all cursor-pointer shadow-xs"
            />
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Departure scheduled for <span className="text-slate-900 font-bold">{formattedDate}</span>
          </p>
        </div>

        {/* 2. Number of Days / Return Date */}
        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600" /> 2. Trip Duration (Days) *
            </span>
            <span className="text-[10px] text-red-600 font-black bg-red-50 px-2 py-0.5 rounded-md">
              {totalDays} {totalDays === 1 ? 'Day' : 'Days'} Tariff
            </span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 5, 7].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDaysChange(d)}
                className={`py-2.5 rounded-xl text-xs font-black transition-all text-center ${
                  totalDays === d
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105 ring-2 ring-red-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {d} {d === 1 ? 'Day' : 'Days'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Or Pick Return Date:</span>
            <input
              type="date"
              min={travelDate}
              value={returnDate}
              onChange={(e) => handleReturnDateChange(e.target.value)}
              className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold cursor-pointer hover:bg-white"
            />
          </div>
        </div>

        {/* 3. Estimated Distance in KM */}
        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-red-600" /> 3. Estimated Distance (KM) *
            </span>
            <span className="text-xs font-black text-white bg-red-600 px-2.5 py-0.5 rounded-md shadow-xs">
              {distanceKm} KM
            </span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={20}
              max={1500}
              step={10}
              value={distanceKm}
              onChange={(e) => handleKmChange(parseInt(e.target.value) || 50)}
              className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="relative w-24 shrink-0">
              <input
                type="number"
                min={10}
                max={5000}
                value={distanceKm}
                onChange={(e) => handleKmChange(parseInt(e.target.value) || 50)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border-2 border-slate-200 focus:border-red-500 rounded-xl font-mono font-bold text-xs text-slate-900 text-center"
              />
              <span className="absolute right-2 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">
                KM
              </span>
            </div>
          </div>

          {/* Quick KM Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: '50 km (City)', km: 50 },
              { label: '150 km (Local)', km: 150 },
              { label: '300 km (Outstation)', km: 300 },
              { label: '600 km (Interstate)', km: 600 },
            ].map((p) => (
              <button
                key={p.km}
                type="button"
                onClick={() => handleKmChange(p.km)}
                className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all ${
                  distanceKm === p.km
                    ? 'bg-slate-900 text-white font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transparent Pricing Explanation Strip */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span>
            <strong>Pricing Formula:</strong> (Daily Base Tariff × {totalDays} Day{totalDays > 1 ? 's' : ''}) + (Rate Per KM × {distanceKm} KM) {isDriverOnly ? '+ Daily Chauffeur Fee' : '+ Driver Daily Batta'}
          </span>
        </div>
        <span className="text-[11px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 shrink-0">
          ✓ Zero Hidden Charges • Instant Live Calculation
        </span>
      </div>
    </div>
  );
};
