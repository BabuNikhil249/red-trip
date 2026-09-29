import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { Driver } from '../types';
import { DriverCard } from '../components/booking/DriverCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { UserCheck } from 'lucide-react';

export const HireDriverPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchParams, setSelectedDriver, setSelectedVehicle, setActiveBookingType } =
    useBookingContext();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveBookingType('DRIVER_ONLY');
    setSelectedVehicle(null);
    setLoading(true);

    bookingService
      .getDrivers()
      .then((data) => setDrivers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setSelectedVehicle(null);
    navigate('/booking/summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-400/30">
            <UserCheck className="w-4 h-4" /> Professional Chauffeurs On-Demand
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Hire a Driver for Your Vehicle</h1>
          <p className="text-sm md:text-base text-slate-300">
            Need a driver for your own car? Hire background-verified, route-expert chauffeurs for local hourly errands or outstation highway trips.
          </p>
        </div>
      </div>

      {/* Driver List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Verified Drivers ({drivers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Showing available drivers in {searchParams.pickupLocation || 'Bangalore'}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Locating nearby verified drivers..." />
        ) : drivers.length === 0 ? (
          <EmptyState
            title="No Drivers Available"
            message="No verified drivers available for your selected date or location."
            actionText="Change Search"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((d) => (
              <DriverCard key={d.id} driver={d} onSelect={handleSelectDriver} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
