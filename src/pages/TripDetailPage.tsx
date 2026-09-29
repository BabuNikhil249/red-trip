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

  if (loading) return <LoadingSpinner label="Loading trip itinerary details..." />;

  if (!trip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Trip Not Found</h2>
        <button
          onClick={() => navigate('/available-trips')}
          className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold"
        >
          Back to Available Trips
        </button>
      </div>
    );
  }

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
        <ArrowLeft className="w-4 h-4" /> Back to All Trips
      </button>

      {/* Main Trip Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
              Scheduled Departure • Trip #{trip.id}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
              {trip.from} to {trip.to}
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Fare per passenger</span>
            <span className="text-3xl font-black text-red-600">₹{trip.pricePerPassenger}</span>
          </div>
        </div>

        {/* Route Itinerary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Boarding Info</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold text-xs">
                A
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Pickup Point</span>
                <p className="text-sm font-bold text-slate-900">{trip.pickupPoint}</p>
                <span className="text-xs text-red-600 font-semibold block mt-0.5">
                  Departure: {trip.departureTime} ({trip.date})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Drop Location</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                B
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Drop Point</span>
                <p className="text-sm font-bold text-slate-900">{trip.dropPoint}</p>
                <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
                  Est. Arrival: {trip.arrivalTime} ({trip.estimatedDuration})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Driver Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Vehicle */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-bold">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Vehicle Fleet
              </span>
              <h4 className="text-base font-bold text-slate-900">{trip.vehicleName}</h4>
              <p className="text-xs text-slate-500">{trip.vehicleType} • AC Air Suspended</p>
            </div>
          </div>

          {/* Driver */}
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
                {trip.driverRating} Verified Senior Driver
              </p>
            </div>
          </div>
        </div>

        {/* Seat Quantity Selector & Booking Box */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold">Select Number of Seats</h3>
              <p className="text-xs text-slate-400">
                {trip.availableSeats} seats remaining on this departure
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Quantity:</span>
              <select
                value={selectedSeatsCount}
                onChange={(e) => setSelectedSeatsCount(parseInt(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Array.from({ length: trip.availableSeats }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Seat' : 'Seats'} (₹{trip.pricePerPassenger * n})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total Ticket Price</span>
              <span className="text-3xl font-black text-white">
                ₹{trip.pricePerPassenger * selectedSeatsCount}
              </span>
            </div>

            <button
              onClick={handleContinue}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 text-base"
            >
              Continue Booking →
            </button>
          </div>
        </div>

        {/* Cancellation Information */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider">Cancellation Policy</span>
            <p className="text-blue-800">{trip.cancellationPolicy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
