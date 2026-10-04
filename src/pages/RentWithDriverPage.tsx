import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/booking/VehicleCard';
import { FilterPanel } from '../components/booking/FilterPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { TripEstimatorBar } from '../components/booking/TripEstimatorBar';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden border border-slate-200/90">
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-15 hidden md:block pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80')`,
          }}
        ></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest border border-red-200">
            <ShieldCheck className="w-4 h-4 text-red-600" /> Uniformed Chauffeur Included
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Rent Vehicle with Certified Driver
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Travel stress-free in sanitised luxury SUVs and Sedans. Experienced drivers, transparent distance rates, and doorstep pickup for local & outstation journeys.
          </p>
        </div>
      </div>

      {/* Interactive Trip Date & Distance Estimator */}
      <TripEstimatorBar
        title="1. Select Journey Date & Distance (KM) for Live Day + KM Price"
        subtitle="Select your travel date in the calendar below. All vehicle prices update in real-time according to daily tariff and distance (KM)."
      />

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
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Available Chauffeur Fleet ({vehicles.length})
              </h2>
              <p className="text-xs text-slate-500">
                Showing sanitized vehicles for {searchParams.pickupLocation || 'Bangalore'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant Dispatch
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
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
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
