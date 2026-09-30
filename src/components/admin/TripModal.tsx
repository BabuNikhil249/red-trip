import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { AvailableTrip, VehicleCategory } from '../../types';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Omit<AvailableTrip, 'id'>) => void;
}

export const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('Coorg Hill Station & Plantation Escape');
  const [region, setRegion] = useState<'Karnataka' | 'All India'>('Karnataka');
  const [categoryTag, setCategoryTag] = useState('Hill Station');
  const [durationDaysNights, setDurationDaysNights] = useState('3 Days / 2 Nights');
  const [from, setFrom] = useState('Bangalore');
  const [to, setTo] = useState('Coorg (Madikeri)');
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('06:30 AM');
  const [arrivalTime, setArrivalTime] = useState('11:45 AM');
  const [estimatedDuration, setEstimatedDuration] = useState('5 hrs 15 mins');
  const [vehicleName, setVehicleName] = useState('Toyota Innova Crysta');
  const [vehicleType, setVehicleType] = useState<VehicleCategory>('SUV');
  const [driverName, setDriverName] = useState('Ramesh Gowda');
  const [driverRating, setDriverRating] = useState(4.95);
  const [driverPhoto, setDriverPhoto] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80'
  );
  const [availableSeats, setAvailableSeats] = useState(4);
  const [totalSeats, setTotalSeats] = useState(6);
  const [pricePerPassenger, setPricePerPassenger] = useState(2499);
  const [pickupPoint, setPickupPoint] = useState('Indiranagar / Satellite Bus Stand');
  const [dropPoint, setDropPoint] = useState('Madikeri City Stand & Resort Drop');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      region,
      categoryTag,
      durationDaysNights,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      estimatedDuration,
      vehicleName,
      vehicleType,
      driverName,
      driverRating,
      driverPhoto,
      image,
      availableSeats,
      totalSeats,
      pricePerPassenger,
      pickupPoint,
      dropPoint,
      routeDescription: `Customized tour package from ${from} to ${to}.`,
      cancellationPolicy: 'Free cancellation up to 24 hours before trip.',
      status: 'Scheduled',
      highlights: ['Sightseeing Tour', 'Resort Stay Included', 'Dedicated Chauffeur'],
      inclusions: ['AC Vehicle', 'Chauffeur Allowance', 'Resort Stay with Breakfast', 'All Tolls & Permits'],
      itinerary: [
        { day: 1, title: `Travel from ${from} to ${to}`, details: 'Morning departure, scenic drive and resort check-in.' },
        { day: 2, title: 'Local Sightseeing & Attractions', details: 'Full day sightseeing tour with private vehicle and chauffeur.' },
        { day: 3, title: `Return journey to ${from}`, details: 'Morning breakfast and return drive.' }
      ]
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip Package" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Package Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coorg Hill Station & Coffee Plantation Tour"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Package Region *</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as 'Karnataka' | 'All India')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="Karnataka">🌴 Karnataka Package</option>
              <option value="All India">🇮🇳 All Over India Package</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Category Tag</label>
            <input
              type="text"
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              placeholder="e.g. Hill Station, Heritage, Beach"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Duration (Days / Nights)</label>
            <input
              type="text"
              value={durationDaysNights}
              onChange={(e) => setDurationDaysNights(e.target.value)}
              placeholder="e.g. 3 Days / 2 Nights"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">From Origin *</label>
            <input
              type="text"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">To Destination *</label>
            <input
              type="text"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Departure Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Departure Time</label>
            <input
              type="text"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Estimated Arrival Time</label>
            <input
              type="text"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Travel Duration</label>
            <input
              type="text"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Vehicle Category</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleCategory)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Premium">Premium</option>
              <option value="Tempo Traveller">Tempo Traveller</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Vehicle Model</label>
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Chauffeur</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chauffeur Rating</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={driverRating}
              onChange={(e) => setDriverRating(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Available Slots</label>
            <input
              type="number"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Total Package Slots</label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Package Rate per Person (₹)</label>
            <input
              type="number"
              value={pricePerPassenger}
              onChange={(e) => setPricePerPassenger(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chauffeur Photo URL</label>
            <input
              type="url"
              value={driverPhoto}
              onChange={(e) => setDriverPhoto(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Package Banner Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Boarding / Pickup Address</label>
            <input
              type="text"
              value={pickupPoint}
              onChange={(e) => setPickupPoint(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Drop / Destination Address</label>
            <input
              type="text"
              value={dropPoint}
              onChange={(e) => setDropPoint(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
          >
            Create Trip Package
          </button>
        </div>
      </form>
    </Modal>
  );
};
