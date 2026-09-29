import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/booking/VehicleCard';
import { FilterPanel } from '../components/booking/FilterPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ShieldCheck } from 'lucide-react';

export const RentWithDriverPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, setSelectedVehicle, setSelectedDriver, setActiveBookingType } =
    useBookingContext();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveBookingType('WITH_DRIVER');
    setLoading(true);
    bookingService
      .getVehicles(searchParams.vehicleCategory)
      .then((data) => {
        const filtered = data.filter((v) => v.basePrice <= searchParams.priceMax);
        setVehicles(filtered);
      })
      .finally(() => setLoading(false));
  }, [searchParams.vehicleCategory, searchParams.priceMax]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    bookingService.getDrivers().then((drivers) => {
      if (drivers.length > 0) {
        setSelectedDriver(drivers[0]);
      }
      navigate('/booking/summary');
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
            <ShieldCheck className="w-4 h-4" /> Chauffeur Included
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Rent a Vehicle with Driver</h1>
          <p className="text-sm md:text-base text-slate-300">
            Professional verified chauffeurs, transparent base rates, and doorstep pickup for local & outstation journeys.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters + Vehicles */}
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
              Available Vehicles ({vehicles.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing vehicles for {searchParams.pickupLocation || 'Bangalore'}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner label="Fetching available vehicles..." />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="No Vehicles Available"
              message="No vehicles matched your selected category or price filter."
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
                  isSelfDrive={false}
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
