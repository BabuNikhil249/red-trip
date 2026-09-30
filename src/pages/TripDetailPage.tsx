import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { AvailableTrip } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Car,
  Star,
  ArrowLeft,
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedTrip, selectedSeatsCount, setSelectedSeatsCount, setActiveBookingType } =
    useBookingContext();

  const [trip, setTrip] = useState<AvailableTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveBookingType('AVAILABLE_TRIP');
    if (id) {
      setLoading(true);
      bookingService
        .getTripById(id)
        .then((data) => {
          if (data) setTrip(data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading package details and itinerary..." />;

  if (!trip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Trip Package Not Found</h2>
        <button
          onClick={() => navigate('/available-trips')}
          className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold"
        >
          Back to All Packages
        </button>
      </div>
    );
  }

  const isKarnataka = trip.region === 'Karnataka';

  const handleContinue = () => {
    setSelectedTrip(trip);
    navigate('/booking/summary');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/available-trips')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Trip Packages
      </button>

      {/* Main Package Banner & Hero Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Cover Image & Header Overlay */}
        <div className="relative h-64 md:h-80 w-full bg-slate-950">
          <img
            src={
              trip.image ||
              'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80'
            }
            alt={trip.title || trip.from}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30"></div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg border backdrop-blur-md ${
                isKarnataka
                  ? 'bg-emerald-600 text-white border-emerald-400/40'
                  : 'bg-indigo-600 text-white border-indigo-400/40'
              }`}
            >
              {isKarnataka ? '🌴 Karnataka Package' : '🇮🇳 All Over India Package'}
            </span>

            <span className="bg-black/70 text-white px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
              <Clock className="w-4 h-4 text-red-400" />
              {trip.durationDaysNights || trip.estimatedDuration || 'Tour Package'}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            {trip.categoryTag && (
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 bg-red-950/70 px-3 py-1 rounded-full border border-red-500/30 inline-block backdrop-blur-md">
                {trip.categoryTag}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {trip.title || `${trip.from} to ${trip.to} Tour Package`}
            </h1>
          </div>
        </div>

        {/* Overview Bar */}
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-slate-700 font-extrabold text-lg">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>{trip.from}</span>
                <span className="text-slate-400">→</span>
                <span>{trip.to}</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold block mt-1">
                Departure Date: {trip.date} • {trip.departureTime}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">
                Price per person
              </span>
              <span className="text-3xl font-black text-red-600">₹{trip.pricePerPassenger}</span>
            </div>
          </div>

          {/* Highlights & Inclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highlights */}
            {trip.highlights && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Package Highlights
                </h3>
                <ul className="space-y-2">
                  {trip.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inclusions */}
            {trip.inclusions && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> What's Included
                </h3>
                <ul className="space-y-2">
                  {trip.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                      <div className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Day-by-Day Itinerary */}
          {trip.itinerary && trip.itinerary.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" /> Tour Itinerary Breakdown
              </h3>

              <div className="space-y-4">
                {trip.itinerary.map((dayPlan) => (
                  <div
                    key={dayPlan.day}
                    className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                      D{dayPlan.day}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{dayPlan.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {dayPlan.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle & Driver Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-bold">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Included Fleet
                </span>
                <h4 className="text-base font-bold text-slate-900">{trip.vehicleName}</h4>
                <p className="text-xs text-slate-500">{trip.vehicleType} • Air Conditioned</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <img
                src={trip.driverPhoto}
                alt={trip.driverName}
                className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
              />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Assigned Chauffeur
                </span>
                <h4 className="text-base font-bold text-slate-900">{trip.driverName}</h4>
                <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {trip.driverRating} Verified Tour Chauffeur
                </p>
              </div>
            </div>
          </div>

          {/* Quantity Selector & Booking Box */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold">Select Number of Passengers</h3>
                <p className="text-xs text-slate-400">
                  {trip.availableSeats} slots available for this departure
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Travelers:</span>
                <select
                  value={selectedSeatsCount}
                  onChange={(e) => setSelectedSeatsCount(parseInt(e.target.value))}
                  className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {Array.from({ length: trip.availableSeats }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Traveler' : 'Travelers'} (₹{trip.pricePerPassenger * n})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Total Package Amount</span>
                <span className="text-3xl font-black text-white">
                  ₹{trip.pricePerPassenger * selectedSeatsCount}
                </span>
              </div>

              <button
                onClick={handleContinue}
                className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 text-base"
              >
                Proceed to Book Package →
              </button>
            </div>
          </div>

          {/* Cancellation Info */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase tracking-wider">Cancellation & Refund Terms</span>
              <p className="text-blue-800">{trip.cancellationPolicy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
