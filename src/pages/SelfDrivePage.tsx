import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/booking/VehicleCard';
import { FilterPanel } from '../components/booking/FilterPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Key, ShieldAlert } from 'lucide-react';

export const SelfDrivePage: React.FC = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, setSelectedVehicle, setSelectedDriver, setActiveBookingType } =
    useBookingContext();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveBookingType('SELF_DRIVE');
    setSelectedDriver(null);
    setLoading(true);

    bookingService
      .getSelfDriveVehicles(searchParams.vehicleCategory)
      .then((data) => {
        const filtered = data.filter((v) => v.pricePerDay <= searchParams.priceMax);
        setVehicles(filtered);
      })
      .finally(() => setLoading(false));
  }, [searchParams.vehicleCategory, searchParams.priceMax]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedDriver(null);
    navigate('/booking/summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
            <Key className="w-4 h-4" /> Self Drive Fleet
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Rent a Vehicle Without Driver</h1>
          <p className="text-sm md:text-base text-slate-300">
            Drive at your own pace with unlimited kilometers, 24/7 roadside breakdown protection, and clean sanitized cars.
          </p>
        </div>
      </div>

      {/* License & Document Requirement Notice */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/80 flex items-start gap-4 text-amber-900 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold uppercase tracking-wider">Important Notice for Renters</h4>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            Valid original Driving License (DL) and Government ID (Aadhaar / Passport) may be required before vehicle handover. Security deposit is 100% refundable upon vehicle return.
          </p>
        </div>
      </div>

      {/* Main Listing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <FilterPanel
            selectedCategory={searchParams.vehicleCategory}
            onCategoryChange={(cat) =>
              setSearchParams((prev) => ({ ...prev, vehicleCategory: cat }))
            }
            priceMax={searchParams.priceMax}
            onPriceChange={(price) =>
              setSearchParams((prev) => ({ ...prev, priceMax: price }))
            }
            onReset={() =>
              setSearchParams((prev) => ({
                ...prev,
                vehicleCategory: 'All',
                priceMax: 20000,
              }))
            }
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Self Drive Cars Available ({vehicles.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing vehicles for {searchParams.pickupLocation || 'Bangalore'}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading self-drive cars..." />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="No Vehicles Available"
              message="No self-drive vehicles found for your current price filter."
              actionText="Reset Filters"
              onAction={() =>
                setSearchParams((prev) => ({
                  ...prev,
                  vehicleCategory: 'All',
                  priceMax: 20000,
                }))
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  isSelfDrive={true}
                  onSelect={handleSelectVehicle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
