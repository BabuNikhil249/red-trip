import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { BookingTypeSelector, type SelectorCategory } from '../components/booking/BookingTypeSelector';
import { VehicleCard } from '../components/booking/VehicleCard';
import { DriverCard } from '../components/booking/DriverCard';
import { TripCard } from '../components/booking/TripCard';
import { bookingService } from '../services/bookingService';
import type { Vehicle, Driver, AvailableTrip } from '../types';
import { POPULAR_ROUTES } from '../data/mockData';
import {
  ShieldCheck,
  UserCheck,
  Zap,
  Tag,
  ArrowRight,
  Clock,
  Sparkles,
  Car,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setActiveBookingType,
    setSelectedVehicle,
    setSelectedDriver,
    setSelectedTrip,
  } = useBookingContext();

  const [activeCategory, setActiveCategory] = useState<SelectorCategory>('ALL');

  const [withDriverVehicles, setWithDriverVehicles] = useState<Vehicle[]>([]);
  const [selfDriveVehicles, setSelfDriveVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [tripPackages, setTripPackages] = useState<AvailableTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      bookingService.getVehicles(),
      bookingService.getSelfDriveVehicles(),
      bookingService.getDrivers(),
      bookingService.getAvailableTrips(),
    ])
      .then(([vWithDriver, vSelf, driverList, packages]) => {
        setWithDriverVehicles(vWithDriver);
        setSelfDriveVehicles(vSelf);
        setDrivers(driverList);
        setTripPackages(packages);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectVehicleWithDriver = (v: Vehicle) => {
    setSelectedVehicle(v);
    setActiveBookingType('WITH_DRIVER');
    navigate('/booking/summary');
  };

  const handleSelectSelfDrive = (v: Vehicle) => {
    setSelectedVehicle(v);
    setActiveBookingType('SELF_DRIVE');
    navigate('/booking/summary');
  };

  const handleSelectDriver = (d: Driver) => {
    setSelectedDriver(d);
    setActiveBookingType('DRIVER_ONLY');
    navigate('/booking/summary');
  };

  const handleSelectTrip = (t: AvailableTrip) => {
    setSelectedTrip(t);
    setActiveBookingType('AVAILABLE_TRIP');
    navigate(`/trip/${t.id}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden rounded-b-3xl bg-slate-950 text-white border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-600/30 via-slate-950/90 to-slate-950 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> India's Premier Travel & Rental Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Your Journey. <span className="text-red-500">Your Choice.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              Select any category below to view all available cars, chauffeurs, and tour packages across Karnataka and India.
            </p>
          </div>

          {/* 5 CATEGORY SELECTOR TABS */}
          <div className="max-w-5xl mx-auto">
            <BookingTypeSelector
              activeType={activeCategory}
              onSelect={(type) => setActiveCategory(type)}
            />
          </div>

          {/* LIVE OFFERINGS DISPLAY CONTAINER */}
          <div className="max-w-7xl mx-auto pt-6">
            {loading ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Loading available travel offerings...
                </p>
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-300">
                {/* 1. ALL SERVICES (DEFAULT DISPLAY ALL) */}
                {activeCategory === 'ALL' && (
                  <div className="space-y-12">
                    {/* Featured Trip Packages */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          <Compass className="w-5 h-5 text-red-500" />
                          Trip Packages (Karnataka & All India)
                        </h3>
                        <button
                          onClick={() => navigate('/available-trips')}
                          className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          View All Packages →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tripPackages.slice(0, 3).map((pkg) => (
                          <TripCard
                            key={pkg.id}
                            trip={pkg}
                            onBookSeat={handleSelectTrip}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Vehicles + Chauffeur */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          <Car className="w-5 h-5 text-red-500" />
                          Rent Vehicle + Chauffeur
                        </h3>
                        <button
                          onClick={() => navigate('/rent-with-driver')}
                          className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          View All Fleet →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {withDriverVehicles.slice(0, 3).map((vehicle) => (
                          <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onSelect={handleSelectVehicleWithDriver}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Self Drive Cars */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-blue-400" />
                          Self Drive Rentals (Without Driver)
                        </h3>
                        <button
                          onClick={() => navigate('/self-drive')}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          View All Cars →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selfDriveVehicles.slice(0, 3).map((vehicle) => (
                          <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            isSelfDrive={true}
                            onSelect={handleSelectSelfDrive}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Verified Chauffeurs */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-emerald-400" />
                          Hire Professional Chauffeur
                        </h3>
                        <button
                          onClick={() => navigate('/hire-driver')}
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          View All Drivers →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {drivers.slice(0, 3).map((driver) => (
                          <DriverCard
                            key={driver.id}
                            driver={driver}
                            onSelect={handleSelectDriver}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VEHICLE + DRIVER TAB */}
                {activeCategory === 'WITH_DRIVER' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <Car className="w-6 h-6 text-red-500" />
                        Available Vehicles with Professional Chauffeur ({withDriverVehicles.length})
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {withDriverVehicles.map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          onSelect={handleSelectVehicleWithDriver}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. SELF DRIVE TAB */}
                {activeCategory === 'SELF_DRIVE' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-blue-400" />
                        Self-Drive Rentals (Without Driver) ({selfDriveVehicles.length})
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {selfDriveVehicles.map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          isSelfDrive={true}
                          onSelect={handleSelectSelfDrive}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. HIRE DRIVER TAB */}
                {activeCategory === 'DRIVER_ONLY' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <UserCheck className="w-6 h-6 text-emerald-400" />
                        Hire Professional Chauffeur for Your Car ({drivers.length})
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {drivers.map((driver) => (
                        <DriverCard
                          key={driver.id}
                          driver={driver}
                          onSelect={handleSelectDriver}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. TRIP PACKAGES TAB */}
                {activeCategory === 'AVAILABLE_TRIP' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <Compass className="w-6 h-6 text-red-500" />
                        Karnataka & All Over India Trip Packages ({tripPackages.length})
                      </h2>
                      <button
                        onClick={() => navigate('/available-trips')}
                        className="text-xs font-bold text-red-400 hover:text-red-300"
                      >
                        Explore Packages Page →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {tripPackages.map((pkg) => (
                        <TripCard
                          key={pkg.id}
                          trip={pkg}
                          onBookSeat={handleSelectTrip}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE RED TRIP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
            The RED TRIP Edge
          </span>
          <h2 className="text-3xl font-black text-slate-900">Why Choose RED TRIP</h2>
          <p className="text-slate-600 text-sm">
            Experience uncompromised safety, transparent pricing, and instant booking flexibility across all South Indian routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 space-y-3 group text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Easy Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Book your car, chauffeur, or seat in under 2 minutes with instant digital confirmation tickets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 space-y-3 group text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verified Vehicles</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fully insured, deep-cleaned, and 100+ point safety checked fleet before every single trip.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 space-y-3 group text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Professional Drivers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Police verified, route-expert chauffeurs with minimum 6+ years accident-free driving record.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 space-y-3 group text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Flexible Travel</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              One-way, round-trip, local hourly driver hire, or self-drive rentals—tailored to your plan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 space-y-3 group text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Transparent Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero hidden charges or surge pricing. Itemized fare breakdowns with toll and tax breakdowns.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
            Trending Routes
          </span>
          <h2 className="text-3xl font-black text-slate-900">Popular Outstation Routes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveBookingType('WITH_DRIVER');
                navigate('/rent-with-driver');
              }}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-red-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <span>{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                  <span>{route.to}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{route.distance}</span>
                  <span>•</span>
                  <span>{route.duration}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">From</span>
                <span className="text-base font-extrabold text-red-600">{route.startingPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
