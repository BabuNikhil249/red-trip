import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { Driver } from '../types';
import { DriverCard } from '../components/booking/DriverCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { TripEstimatorBar } from '../components/booking/TripEstimatorBar';
import { UserCheck, Clock, CheckCircle2 } from 'lucide-react';

export const HireDriverPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, setSelectedDriver, setSelectedVehicle, setActiveBookingType } =
    useBookingContext();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHours, setSelectedHours] = useState<number>(searchParams.durationHours || 8);

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
    setSearchParams((prev) => ({ ...prev, durationHours: selectedHours }));
    navigate('/booking/summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden border border-slate-200/90">
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-15 hidden md:block pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80')`,
          }}
        ></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-200">
            <UserCheck className="w-4 h-4 text-emerald-600" /> Police Verified Chauffeurs
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Hire Professional Chauffeur for Your Car
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Need a driver for your own car? Book background-verified, route-expert chauffeurs on an hourly or daily rate for local errands, night drives, or outstation tours.
          </p>
        </div>
      </div>

      {/* Interactive Trip Date & Distance Estimator */}
      <TripEstimatorBar
        isDriverOnly={true}
        title="1. Select Duty Date & Estimated Distance (KM)"
        subtitle="Choose the service date in the calendar and expected kilometers to calculate daily driver tariff + travel allowance."
      />

      {/* Hourly / Duration Selector Strip */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Select Duty Duration:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[4, 8, 12, 24].map((hrs) => (
            <button
              key={hrs}
              type="button"
              onClick={() => setSelectedHours(hrs)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedHours === hrs
                  ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {hrs} Hours Duty ({hrs >= 12 ? 'Full Day' : 'Hourly'})
            </button>
          ))}
        </div>
      </div>

      {/* Driver List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Verified Drivers Available ({drivers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Showing background-checked chauffeurs in {searchParams.pickupLocation || 'Bangalore'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Uniformed & Punctual
          </span>
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
