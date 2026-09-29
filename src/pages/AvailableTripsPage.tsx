import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { AvailableTrip } from '../types';
import { TripCard } from '../components/booking/TripCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { LocationInput } from '../components/booking/LocationInput';
import { Compass, Calendar } from 'lucide-react';

export const AvailableTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, setSelectedTrip, setActiveBookingType } = useBookingContext();

  const [trips, setTrips] = useState<AvailableTrip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = () => {
    setLoading(true);
    bookingService
      .getAvailableTrips({
        from: searchParams.pickupLocation,
        to: searchParams.dropLocation,
        date: searchParams.travelDate,
      })
      .then((data) => setTrips(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setActiveBookingType('AVAILABLE_TRIP');
    fetchTrips();
  }, [searchParams.pickupLocation, searchParams.dropLocation, searchParams.travelDate]);

  const handleBookSeat = (trip: AvailableTrip) => {
    setSelectedTrip(trip);
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
            <Compass className="w-4 h-4" /> Shared Scheduled Routes
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Browse & Book Available Trips</h1>
          <p className="text-sm md:text-base text-slate-300">
            Book individual seats on fixed departure luxury vehicles between top South Indian cities at affordable per-passenger rates.
          </p>
        </div>
      </div>

      {/* Filter Header Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LocationInput
            label="From City"
            value={searchParams.pickupLocation}
            onChange={(val) => setSearchParams((prev) => ({ ...prev, pickupLocation: val }))}
            placeholder="Filter origin city"
          />

          <LocationInput
            label="To Destination"
            value={searchParams.dropLocation}
            onChange={(val) => setSearchParams((prev) => ({ ...prev, dropLocation: val }))}
            placeholder="Filter destination city"
            iconColor="text-amber-600"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Travel Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="date"
                value={searchParams.travelDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, travelDate: e.target.value }))}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trips Listing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Scheduled Departure Trips ({trips.length})
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner label="Searching available scheduled trips..." />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No Scheduled Trips Found"
            message="No active departures matching your requested route or date."
            actionText="Clear Route Filter"
            onAction={() =>
              setSearchParams((prev) => ({
                ...prev,
                pickupLocation: '',
                dropLocation: '',
              }))
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onBookSeat={handleBookSeat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
