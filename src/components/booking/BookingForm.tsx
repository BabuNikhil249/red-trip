import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../../context/BookingContext';
import { LocationInput } from './LocationInput';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import type { TripTypeOption, VehicleCategory } from '../../types';

export const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { activeBookingType, searchParams, setSearchParams } = useBookingContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    switch (activeBookingType) {
      case 'WITH_DRIVER':
        navigate('/rent-with-driver');
        break;
      case 'SELF_DRIVE':
        navigate('/self-drive');
        break;
      case 'DRIVER_ONLY':
        navigate('/hire-driver');
        break;
      case 'AVAILABLE_TRIP':
        navigate('/available-trips');
        break;
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100/80 space-y-6"
    >
      {activeBookingType === 'WITH_DRIVER' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="Pickup Location"
              value={searchParams.pickupLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, pickupLocation: val }))}
              placeholder="Enter pickup city or landmark"
            />
            <LocationInput
              label="Drop Location"
              value={searchParams.dropLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, dropLocation: val }))}
              placeholder="Enter destination city"
              iconColor="text-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Travel Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="date"
                  value={searchParams.travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, travelDate: e.target.value }))}
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Time
              </label>
              <div className="relative flex items-center">
                <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={searchParams.pickupTime}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, pickupTime: e.target.value }))}
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="06:00 AM">06:00 AM</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Trip Type
              </label>
              <select
                value={searchParams.tripType}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, tripType: e.target.value as TripTypeOption }))
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              >
                <option value="One Way">One Way</option>
                <option value="Round Trip">Round Trip</option>
                <option value="Local">Local City Trip</option>
                <option value="Outstation">Outstation Outing</option>
                <option value="Multi-Day">Multi-Day Tour</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Passengers
              </label>
              <div className="relative flex items-center">
                <Users className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={searchParams.passengers}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, passengers: parseInt(e.target.value) }))
                  }
                  className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 12, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeBookingType === 'SELF_DRIVE' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="Pickup Location"
              value={searchParams.pickupLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, pickupLocation: val }))}
              placeholder="Pick up hub"
            />
            <LocationInput
              label="Return Location"
              value={searchParams.dropLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, dropLocation: val }))}
              placeholder="Return hub location"
              iconColor="text-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Date
              </label>
              <input
                type="date"
                value={searchParams.travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, travelDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Time
              </label>
              <select
                value={searchParams.pickupTime}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, pickupTime: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Return Date
              </label>
              <input
                type="date"
                value={searchParams.returnDate}
                min={searchParams.travelDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, returnDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vehicle Category
              </label>
              <select
                value={searchParams.vehicleCategory}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    vehicleCategory: e.target.value as VehicleCategory | 'All',
                  }))
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              >
                <option value="All">All Vehicles</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Premium">Premium Luxury</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeBookingType === 'DRIVER_ONLY' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="Pickup Address"
              value={searchParams.pickupLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, pickupLocation: val }))}
              placeholder="Your home / pickup address"
            />
            <LocationInput
              label="Destination / City"
              value={searchParams.dropLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, dropLocation: val }))}
              placeholder="Destination city / local area"
              iconColor="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={searchParams.travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, travelDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Required Duration
              </label>
              <select
                value={searchParams.durationHours}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, durationHours: parseInt(e.target.value) }))
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              >
                <option value={4}>4 Hours (Local)</option>
                <option value={8}>8 Hours (Full Day City)</option>
                <option value={12}>12 Hours (Outstation)</option>
                <option value={24}>Full 24 Hours / Multi-Day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Vehicle Model
              </label>
              <select
                value={searchParams.vehicleCategory}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    vehicleCategory: e.target.value as VehicleCategory | 'All',
                  }))
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              >
                <option value="Sedan">Hatchback / Sedan</option>
                <option value="SUV">SUV / MUV</option>
                <option value="Premium">Luxury / Automatic</option>
                <option value="Tempo Traveller">Commercial / Van</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeBookingType === 'AVAILABLE_TRIP' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="From City / Pickup"
              value={searchParams.pickupLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, pickupLocation: val }))}
              placeholder="Origin city (e.g. Bangalore, Delhi, Kochi)"
            />
            <LocationInput
              label="To Destination / Region"
              value={searchParams.dropLocation}
              onChange={(val) => setSearchParams((prev) => ({ ...prev, dropLocation: val }))}
              placeholder="Destination (e.g. Coorg, Mysore, Goa, Kashmir)"
              iconColor="text-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Travel Date
              </label>
              <input
                type="date"
                value={searchParams.travelDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, travelDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Travelers / Seats Needed
              </label>
              <select
                value={searchParams.passengers}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, passengers: parseInt(e.target.value) }))
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base md:text-lg rounded-2xl shadow-xl shadow-red-600/25 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99]"
        >
          <span>
            {activeBookingType === 'AVAILABLE_TRIP' ? 'Explore Trip Packages' : 'Book Now'}
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
};
