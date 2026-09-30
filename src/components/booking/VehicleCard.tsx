import React from 'react';
import type { Vehicle } from '../../types';
import { Users, Wind, Star, ShieldCheck, Fuel, Gauge, Check, Building2 } from 'lucide-react';

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
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
        isSelected
          ? 'border-red-600 ring-2 ring-red-600/30 shadow-xl'
          : 'border-slate-200 hover:border-red-300 hover:shadow-lg'
      }`}
    >
      <div>
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{vehicle.rating}</span>
            <span className="text-slate-400 font-normal">({vehicle.reviewsCount})</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            {vehicle.category}
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-xl font-bold tracking-tight leading-tight">{vehicle.name}</h3>
            <p className="text-xs text-slate-300">{vehicle.model}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Travelling Agency Tag */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-slate-400 text-[10px] uppercase font-bold">Agency:</span>
            <span className="text-slate-100 truncate">{vehicle.agencyName || 'M/S Apoorva Travels'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {vehicle.capacity} Seater
            </span>

            {vehicle.ac && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium">
                <Wind className="w-3.5 h-3.5 text-blue-500" />
                Dual AC
              </span>
            )}

            {isSelfDrive ? (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-purple-500" />
                  {vehicle.transmission}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  {vehicle.fuelType}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Chauffeur Included
              </span>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
              {vehicle.features.slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-4 mt-2">
        <div>
          <span className="text-xs text-slate-400 block font-medium">
            {isSelfDrive ? 'Price per day' : 'Estimated Base Fare'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{isSelfDrive ? vehicle.pricePerDay.toLocaleString() : vehicle.basePrice.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">{isSelfDrive ? '/day' : 'base'}</span>
          </div>

          {isSelfDrive && vehicle.securityDeposit > 0 && (
            <span className="text-[11px] text-slate-500 block">
              Refundable Deposit: ₹{vehicle.securityDeposit.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={() => onSelect(vehicle)}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
          }`}
        >
          {isSelected ? 'Selected ✓' : 'Select Vehicle'}
        </button>
      </div>
    </div>
  );
};
