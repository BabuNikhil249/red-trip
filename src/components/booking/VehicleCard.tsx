import React, { useState } from 'react';
import type { Vehicle } from '../../types';
import { useBookingContext } from '../../context/BookingContext';
import { Users, Wind, Star, ShieldCheck, Fuel, Gauge, Building2, CheckCircle2, Calendar, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelfDrive?: boolean;
  onSelect: (vehicle: Vehicle) => void;
  isSelected?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSelfDrive = false,
  onSelect,
  isSelected = false,
}) => {
  const { searchParams } = useBookingContext();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const totalDays = Math.max(1, searchParams.totalDays || 1);
  const distanceKm = Math.max(10, searchParams.distanceKm || 150);
  const travelDate = searchParams.travelDate || new Date().toISOString().split('T')[0];

  const formattedDate = new Date(travelDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate live price based on KM and Days
  const daysCost = (vehicle.pricePerDay || 2500) * totalDays;
  const kmCost = (vehicle.pricePerKm || 16) * distanceKm;
  const driverCost = isSelfDrive ? 0 : 500 * totalDays;
  const calculatedTotal = daysCost + kmCost + driverCost;

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group hover-lift ${
        isSelected
          ? 'border-red-600 ring-4 ring-red-600/20 shadow-2xl scale-[1.01]'
          : 'border-slate-200/90 hover:border-red-400 hover:shadow-xl'
      }`}
    >
      <div>
        {/* Card Header & Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-950">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          {/* Rating Pill */}
          <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 flex items-center gap-1.5 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{vehicle.rating}</span>
            <span className="text-slate-400 font-semibold text-[11px]">({vehicle.reviewsCount || 45})</span>
          </div>

          {/* Category / Mode Badge */}
          <div className="absolute top-3.5 right-3.5 flex flex-col items-end gap-1">
            <span className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border border-white/20">
              {vehicle.category}
            </span>
            {isSelfDrive ? (
              <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-sm">
                Self-Drive
              </span>
            ) : (
              <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-sm">
                With Chauffeur
              </span>
            )}
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
            <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-red-300 transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-xs text-slate-300 font-medium">{vehicle.model}</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* Availability Confirmation Pill */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available for <strong>{formattedDate}</strong></span>
            </div>
            <span className="text-[10px] uppercase font-black bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900">
              Verified ✓
            </span>
          </div>

          {/* Agency Tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-slate-400 text-[10px] uppercase font-bold">Partner:</span>
            <span className="text-slate-100 truncate">{vehicle.agencyName || 'M/S Apoorva Travels'}</span>
          </div>

          {/* Vehicle Feature Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {vehicle.capacity} Seater
            </span>

            {vehicle.ac && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                <Wind className="w-3.5 h-3.5 text-blue-500" />
                Dual AC
              </span>
            )}

            {isSelfDrive ? (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700">
                  <Gauge className="w-3.5 h-3.5 text-purple-500" />
                  {vehicle.transmission}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  {vehicle.fuelType}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Uniformed Chauffeur
              </span>
            )}
          </div>

          {/* Key Checklist Features */}
          <div className="border-t border-slate-100 pt-3">
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 font-medium">
              {(vehicle.features && vehicle.features.length > 0
                ? vehicle.features.slice(0, 4)
                : ['Sanitized Cabin', 'GPS Navigation', 'Music System', 'Spacious Boot']
              ).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Day + KM Tariff Box */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-red-600" /> Calculated for {totalDays}d • {distanceKm}km:
              </span>
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-[11px] font-black text-red-600 hover:text-red-700 flex items-center gap-0.5"
              >
                {showBreakdown ? 'Hide Details' : 'View Breakdown'}
                {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Collapsible Tariff Calculation Details */}
            {showBreakdown ? (
              <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Day Tariff (₹{vehicle.pricePerDay.toLocaleString()} × {totalDays}d):</span>
                  <span className="font-bold text-slate-900">₹{daysCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>KM Distance (₹{vehicle.pricePerKm}/km × {distanceKm}km):</span>
                  <span className="font-bold text-slate-900">₹{kmCost.toLocaleString()}</span>
                </div>
                {!isSelfDrive && (
                  <div className="flex justify-between">
                    <span>Driver Daily Batta (₹500 × {totalDays}d):</span>
                    <span className="font-bold text-slate-900">₹{driverCost.toLocaleString()}</span>
                  </div>
                )}
                {isSelfDrive && (
                  <div className="flex justify-between text-amber-800">
                    <span>Security Deposit (Refundable):</span>
                    <span className="font-bold">₹{(vehicle.securityDeposit || 4000).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>₹{vehicle.pricePerDay.toLocaleString()}/day + ₹{vehicle.pricePerKm}/km</span>
                <span className="text-emerald-700 font-bold">{isSelfDrive ? 'Zero Driver Charge' : '+ Driver Batta'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer & Price Callout */}
      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-4 mt-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total Estimated Fare
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-red-600">
              ₹{calculatedTotal.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">for {totalDays}d</span>
          </div>

          <span className="text-[10px] text-slate-500 font-semibold block">
            ₹{vehicle.pricePerKm}/km • ₹{vehicle.pricePerDay.toLocaleString()}/day
          </span>
        </div>

        <button
          onClick={() => onSelect(vehicle)}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-md flex items-center gap-1.5 ${
            isSelected
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-600/30 hover:scale-[1.02]'
          }`}
        >
          <span>{isSelected ? 'Selected ✓' : 'Book Vehicle'}</span>
        </button>
      </div>
    </div>
  );
};

