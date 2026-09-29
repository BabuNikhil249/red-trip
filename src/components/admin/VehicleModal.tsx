import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Vehicle, VehicleCategory, FuelType, TransmissionType } from '../../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
  initialVehicle?: Vehicle | null;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVehicle,
}) => {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('SUV');
  const [capacity, setCapacity] = useState(7);
  const [ac, setAc] = useState(true);
  const [fuelType, setFuelType] = useState<FuelType>('Diesel');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [pricePerDay, setPricePerDay] = useState(3000);
  const [pricePerKm, setPricePerKm] = useState(18);
  const [basePrice, setBasePrice] = useState(2500);
  const [securityDeposit, setSecurityDeposit] = useState(5000);
  const [driverIncluded, setDriverIncluded] = useState(true);
  const [isSelfDriveAvailable, setIsSelfDriveAvailable] = useState(true);
  const [image, setImage] = useState('');
  const [featuresInput, setFeaturesInput] = useState('Captain Seats, Dual AC, Sunroof');

  useEffect(() => {
    if (initialVehicle) {
      setName(initialVehicle.name);
      setModel(initialVehicle.model);
      setCategory(initialVehicle.category);
      setCapacity(initialVehicle.capacity);
      setAc(initialVehicle.ac);
      setFuelType(initialVehicle.fuelType);
      setTransmission(initialVehicle.transmission);
      setPricePerDay(initialVehicle.pricePerDay);
      setPricePerKm(initialVehicle.pricePerKm);
      setBasePrice(initialVehicle.basePrice);
      setSecurityDeposit(initialVehicle.securityDeposit);
      setDriverIncluded(initialVehicle.driverIncluded);
      setIsSelfDriveAvailable(initialVehicle.isSelfDriveAvailable);
      setImage(initialVehicle.image);
      setFeaturesInput(initialVehicle.features.join(', '));
    } else {
      setName('');
      setModel('');
      setCategory('SUV');
      setCapacity(7);
      setAc(true);
      setFuelType('Diesel');
      setTransmission('Automatic');
      setPricePerDay(3000);
      setPricePerKm(18);
      setBasePrice(2500);
      setSecurityDeposit(5000);
      setDriverIncluded(true);
      setIsSelfDriveAvailable(true);
      setImage(
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
      );
      setFeaturesInput('Captain Seats, Dual AC, Leather Interiors');
    }
  }, [initialVehicle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresInput.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      name,
      model,
      category,
      capacity,
      ac,
      fuelType,
      transmission,
      pricePerDay,
      pricePerKm,
      basePrice,
      securityDeposit,
      driverIncluded,
      isSelfDriveAvailable,
      rating: initialVehicle ? initialVehicle.rating : 4.9,
      reviewsCount: initialVehicle ? initialVehicle.reviewsCount : 10,
      image: image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      features,
      available: true,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialVehicle ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Vehicle Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mahindra XUV700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Model Variant *</label>
            <input
              type="text"
              required
              placeholder="e.g. AX7 Luxury (2024)"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VehicleCategory)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Premium">Premium Luxury</option>
              <option value="Tempo Traveller">Tempo Traveller</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Seating Capacity</label>
            <input
              type="number"
              min={2}
              max={50}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value as TransmissionType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="EV">Electric (EV)</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Price per Day (₹)</label>
            <input
              type="number"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
            <input
              type="number"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Features (Comma separated)</label>
            <input
              type="text"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="flex items-center gap-6 pt-2 sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={ac}
                onChange={(e) => setAc(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              Air Conditioned (AC)
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={driverIncluded}
                onChange={(e) => setDriverIncluded(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              Driver Included Rental
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isSelfDriveAvailable}
                onChange={(e) => setIsSelfDriveAvailable(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              Available for Self-Drive
            </label>
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
            Save Vehicle
          </button>
        </div>
      </form>
    </Modal>
  );
};
