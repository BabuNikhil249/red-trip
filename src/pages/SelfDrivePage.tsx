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

export const SelfDrivePage: React.FC = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, setSelectedVehicle, setActiveBookingType } =
    useBookingContext();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveBookingType('SELF_DRIVE');
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
    navigate('/booking/summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden border border-slate-200/90">
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-15 hidden md:block pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80')`,
          }}
        ></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Self-Drive Freedom
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Rent a Car Without Driver
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Drive yourself with complete freedom. Zero hidden fees, doorstep vehicle drop & pickup, comprehensive insurance, and unlimited kilometer options.
          </p>
        </div>
      </div>

      {/* Interactive Trip Date & Distance Estimator */}
      <TripEstimatorBar
        title="1. Select Rental Dates & Estimated Distance (KM)"
        subtitle="Pick your pickup date in the calendar and duration to verify fleet availability & calculate your exact self-drive tariff."
      />

      {/* Main Grid */}
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
                Self-Drive Fleet ({vehicles.length})
              </h2>
              <p className="text-xs text-slate-500">
                Cleaned, sanitized, and ready for your road trip
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Free Cancellation
            </span>
          </div>

          {loading ? (
            <LoadingSpinner label="Fetching self-drive cars..." />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="No Self-Drive Cars Found"
              message="No cars matched your current budget or category."
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
