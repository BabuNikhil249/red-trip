import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AvailableTrip } from '../../types';
import { Clock, MapPin, Star, CheckCircle2 } from 'lucide-react';

interface TripCardProps {
  trip: AvailableTrip;
  onBookSeat?: (trip: AvailableTrip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onBookSeat }) => {
  const navigate = useNavigate();

  const isKarnataka = trip.region === 'Karnataka';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-red-400 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Banner Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={
              trip.image ||
              'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80'
            }
            alt={trip.title || trip.from}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>

          {/* Top Region Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md backdrop-blur-md border ${
                isKarnataka
                  ? 'bg-emerald-600/90 text-white border-emerald-400/40'
                  : 'bg-indigo-600/90 text-white border-indigo-400/40'
              }`}
            >
              {isKarnataka ? '🌴 Karnataka Package' : '🇮🇳 All Over India'}
            </span>
          </div>

          {/* Duration Pill */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-400" />
              {trip.durationDaysNights || trip.estimatedDuration || 'Tour Package'}
            </span>
          </div>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            {trip.categoryTag && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-950/60 px-2 py-0.5 rounded backdrop-blur-xs mb-1 inline-block">
                {trip.categoryTag}
              </span>
            )}
            <h3 className="text-lg font-black leading-snug text-white line-clamp-1 group-hover:text-red-300 transition-colors">
              {trip.title || `${trip.from} to ${trip.to} Tour Package`}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Route details */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span className="truncate">{trip.from}</span>
              <span className="text-slate-400">→</span>
              <span className="truncate font-bold text-slate-900">{trip.to}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
              {trip.availableSeats} Spots Left
            </span>
          </div>

          {/* Key Highlights */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Package Highlights:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {trip.highlights.slice(0, 3).map((hl, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-red-50/80 text-red-700 border border-red-100 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="truncate max-w-[160px]">{hl}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chauffeur & Vehicle */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <img
                src={trip.driverPhoto}
                alt={trip.driverName}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div>
                <span className="font-bold text-slate-900 block leading-tight">{trip.driverName}</span>
                <span className="text-[10px] text-slate-500 font-medium">{trip.vehicleName}</span>
              </div>
            </div>

            <span className="flex items-center gap-1 text-amber-600 font-extrabold text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {trip.driverRating}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-5 pt-0 mt-2">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">₹{trip.pricePerPassenger}</span>
              <span className="text-[11px] text-slate-500 font-semibold">/ person</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => {
                if (onBookSeat) onBookSeat(trip);
                else navigate(`/trip/${trip.id}`);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-all shadow-md shadow-red-600/20 active:scale-95"
            >
              Book Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
