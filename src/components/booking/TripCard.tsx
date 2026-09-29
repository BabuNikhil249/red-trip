import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AvailableTrip } from '../../types';
import { Calendar, ArrowRight, Car, Star } from 'lucide-react';

interface TripCardProps {
  trip: AvailableTrip;
  onBookSeat?: (trip: AvailableTrip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onBookSeat }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">
            Trip ID: {trip.id}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              trip.availableSeats <= 2
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {trip.availableSeats} {trip.availableSeats === 1 ? 'Seat' : 'Seats'} Left
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 my-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">From</span>
            <h4 className="text-base font-extrabold text-slate-900 truncate">{trip.from}</h4>
            <span className="text-xs font-semibold text-red-600 block mt-0.5">{trip.departureTime}</span>
          </div>

          <div className="flex flex-col items-center shrink-0 px-2">
            <span className="text-[10px] font-bold text-slate-400 mb-1">{trip.estimatedDuration}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <div className="w-12 h-0.5 bg-slate-300 relative">
                <ArrowRight className="w-3 h-3 text-red-600 absolute -top-1.5 left-1/2 -translate-x-1/2" />
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">Direct</span>
          </div>

          <div className="flex-1 text-right">
            <span className="text-xs text-slate-400 font-medium block">To</span>
            <h4 className="text-base font-extrabold text-slate-900 truncate">{trip.to}</h4>
            <span className="text-xs font-semibold text-slate-600 block mt-0.5">{trip.arrivalTime}</span>
          </div>
        </div>

        <div className="space-y-2 mt-4 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-red-500" />
              {trip.date}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Car className="w-4 h-4 text-slate-400" />
              {trip.vehicleName} ({trip.vehicleType})
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <img
                src={trip.driverPhoto}
                alt={trip.driverName}
                className="w-6 h-6 rounded-full object-cover border"
              />
              <span className="font-semibold text-slate-800">{trip.driverName}</span>
              <span className="flex items-center gap-0.5 text-amber-600 font-bold text-[11px]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {trip.driverRating}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Price per seat</span>
          <span className="text-2xl font-black text-slate-900">₹{trip.pricePerPassenger}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => {
              if (onBookSeat) onBookSeat(trip);
              else navigate(`/trip/${trip.id}`);
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            Book Seat
          </button>
        </div>
      </div>
    </div>
  );
};
