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
  ArrowRight,
  Sparkles,
  Car,
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Star,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setActiveBookingType,
    setSelectedVehicle,
    setSelectedDriver,
    setSelectedTrip,
    setSearchParams,
  } = useBookingContext();

  const [activeCategory, setActiveCategory] = useState<SelectorCategory>('ALL');

  // Search Engine State
  const [fromCity, setFromCity] = useState('Bangalore');
  const [toCity, setToCity] = useState('Mysore');
  const [travelDate, setTravelDate] = useState('2026-10-15');
  const [passengersCount, setPassengersCount] = useState(2);
  const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Hourly'>('One Way');

  const [withDriverVehicles, setWithDriverVehicles] = useState<Vehicle[]>([]);
  const [selfDriveVehicles, setSelfDriveVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [tripPackages, setTripPackages] = useState<AvailableTrip[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => ({
      ...prev,
      pickupLocation: fromCity,
      dropLocation: toCity,
      travelDate: travelDate,
      passengers: passengersCount,
    }));

    if (activeCategory === 'SELF_DRIVE') {
      navigate('/self-drive');
    } else if (activeCategory === 'DRIVER_ONLY') {
      navigate('/hire-driver');
    } else if (activeCategory === 'AVAILABLE_TRIP') {
      navigate('/available-trips');
    } else {
      navigate('/rent-with-driver');
    }
  };

  const faqs = [
    {
      q: 'How does RED TRIP vehicle and chauffeur rental work?',
      a: 'You can choose between renting a vehicle with a professional chauffeur, self-drive rentals without driver, hiring a certified driver for your own car, or booking individual seats on curated tour packages. All bookings receive instant digital confirmation tickets.',
    },
    {
      q: 'Are all drivers police verified and experienced?',
      a: 'Yes! Every chauffeur undergoes rigorous 100+ point background checks, route familiarity testing, police verification, and has a minimum of 6+ years accident-free driving record across South Indian expressways and ghats.',
    },
    {
      q: 'What is included in the tour packages for Karnataka and All India?',
      a: 'Our tour packages include dedicated AC vehicle transport, experienced tour driver, all highway tolls and state taxes, hotel/resort stays with breakfast, and key sight-seeing passes.',
    },
    {
      q: 'Can corporate travel agencies book multi-pickup trips and track drivers?',
      a: 'Yes! Our Agency Operations Control Center enables travel agencies to dynamically add multiple pickup stops (with individual passenger contact details, flight numbers, and 4-digit OTPs), track chauffeur GPS location in real-time on Google Maps, and generate automated Duty Slip bill reports.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Most bookings enjoy 100% free cancellation up to 6-12 hours prior to scheduled departure time. Refunds are processed instantly back to your original payment method.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION WITH SCENIC ROAD TRIP PHOTO & LIGHT PREMIUM THEME */}
      <section className="relative pt-10 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200/90 shadow-xs">
        {/* Background Scenic Road Trip Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80')`,
          }}
        ></div>

        {/* Light Glassmorphic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-white/85 to-slate-50/95 pointer-events-none"></div>

        {/* Subtle Ambient Glow Lights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Top Hero Text */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-black uppercase tracking-widest shadow-xs">
              <Sparkles className="w-4 h-4 text-red-600" /> India's Premier Mobility & Travel Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Experience Premium Travel,{' '}
              <span className="text-red-600 underline decoration-red-400/40 decoration-wavy decoration-2">
                Your Way.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-semibold max-w-2xl mx-auto">
              Chauffeur Rentals • Self-Drive Cars • Verified Drivers-on-Demand • Curated Tour Packages across Karnataka & All India.
            </p>
          </div>

          {/* 5 CATEGORY SELECTOR TABS (LIGHT ELEGANT PILLS) */}
          <div className="max-w-5xl mx-auto">
            <BookingTypeSelector
              activeType={activeCategory}
              onSelect={(type) => setActiveCategory(type)}
            />
          </div>

          {/* QUICK SEARCH ENGINE BOX (ELEVATED CRISP WHITE BOX) */}
          <div className="max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-300/60 border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-red-600" /> Search & Instant Quote:
                </span>
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['One Way', 'Round Trip', 'Hourly'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripType(t)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        tripType === t
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation
                </span>
                <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero Hidden Charges
                </span>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Pickup Location
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-red-600 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Bangalore Central"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Drop / Destination
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="e.g. Mysore / Coorg / Goa"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Travel Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Passengers
                </label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3" />
                  <select
                    value={passengersCount}
                    onChange={(e) => setPassengersCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={4}>4 Passengers (Sedan/SUV)</option>
                    <option value={7}>6-7 Passengers (SUV/Innova)</option>
                    <option value={12}>12+ Passengers (Tempo)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Search Rides
                </button>
              </div>
            </form>

            {/* Quick Popular Route Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-bold text-slate-400 text-[11px] uppercase">Popular:</span>
              {[
                { from: 'Bangalore', to: 'Mysore' },
                { from: 'Bangalore', to: 'Coorg' },
                { from: 'Bangalore', to: 'Chikmagalur' },
                { from: 'Bangalore', to: 'Ooty' },
                { from: 'Bangalore', to: 'Goa' },
              ].map((rt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFromCity(rt.from);
                    setToCity(rt.to);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200 rounded-lg font-bold text-slate-700 text-[11px] transition-colors"
                >
                  {rt.from} → {rt.to}
                </button>
              ))}
            </div>
          </div>

          {/* VISUAL TRAVEL PICTURES & STATS SHOWCASE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">50,000+</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed Journeys</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 block flex items-center justify-center gap-1">
                4.95 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Chauffeur Rating</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">100%</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified & Insured Fleet</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-red-600 block">24/7</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Live GPS & Roadside Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC LIVE OFFERINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Live Fleet & Packages
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Explore Featured Travel Services
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Realtime pricing with verified travel agencies
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Loading available vehicles & tours...
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* ALL SERVICES TAB (CURATED SHOWCASE) */}
            {(activeCategory === 'ALL' || activeCategory === 'AVAILABLE_TRIP') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-red-600" />
                      Scheduled Tour Packages (Karnataka & All India)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">All-inclusive tours with hotel stay, vehicle, and chauffeur</p>
                  </div>

                  <button
                    onClick={() => navigate('/available-trips')}
                    className="text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors border border-red-100"
                  >
                    View All {tripPackages.length} Packages <ChevronRight className="w-4 h-4" />
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
            )}

            {(activeCategory === 'ALL' || activeCategory === 'WITH_DRIVER') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Car className="w-5 h-5 text-red-600" />
                      Rent Vehicle + Certified Chauffeur
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">SUVs, Sedans, Luxury Limousines, & Tempo Travellers with driver</p>
                  </div>

                  <button
                    onClick={() => navigate('/rent-with-driver')}
                    className="text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors border border-red-100"
                  >
                    View All {withDriverVehicles.length} Vehicles <ChevronRight className="w-4 h-4" />
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
            )}

            {(activeCategory === 'ALL' || activeCategory === 'SELF_DRIVE') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      Self-Drive Rentals (Without Driver)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Freedom to drive anywhere with zero deposit options</p>
                  </div>

                  <button
                    onClick={() => navigate('/self-drive')}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors border border-blue-100"
                  >
                    View All {selfDriveVehicles.length} Self-Drive Cars <ChevronRight className="w-4 h-4" />
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
            )}

            {(activeCategory === 'ALL' || activeCategory === 'DRIVER_ONLY') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                      Hire Professional Chauffeur for Your Car
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Verified hourly and daily driver on-demand service</p>
                  </div>

                  <button
                    onClick={() => navigate('/hire-driver')}
                    className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors border border-emerald-100"
                  >
                    View All {drivers.length} Drivers <ChevronRight className="w-4 h-4" />
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
            )}
          </div>
        )}
      </section>

      {/* 3. 4-PILLAR SERVICE ARCHITECTURE HUB (BRIGHT, FRESH, LUXURIOUS PEARL THEME) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-50 rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200">
              One Platform. All Mobility.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">How Would You Like to Travel?</h2>
            <p className="text-sm text-slate-600 font-medium">
              Choose the exact service model tailored to your family vacation, corporate duty, or weekend road trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Car + Chauffeur with Travel Picture */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-red-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                  alt="Car with Chauffeur"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-red-600 shadow-xs">
                  Chauffeur Drive
                </div>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">Car + Chauffeur</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Relax in comfort with our premium SUVs and Sedans driven by certified chauffeurs.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/rent-with-driver')}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20"
                >
                  Book Chauffeur Car <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Self-Drive with Travel Picture */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                  alt="Self-Drive Car"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-blue-600 shadow-xs">
                  Self Drive
                </div>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">Self-Drive Cars</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Pure driving pleasure. Sanitized, fuel-efficient SUVs with doorstep delivery.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/self-drive')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  Explore Self-Drive <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 3: Hire Driver with Travel Picture */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80"
                  alt="Hire Driver"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-emerald-600 shadow-xs">
                  Chauffeur on Demand
                </div>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">Hire Driver Only</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Have your own car? Book a police-verified professional driver hourly or daily.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/hire-driver')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  Hire Driver <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 4: Tour Packages with Travel Picture */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
                  alt="Tour Packages"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-purple-600 shadow-xs">
                  Tour Packages
                </div>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">Tour Packages</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Coorg, Mysore, Chikmagalur & Ooty. Complete transport, resort stay, & sightseeing.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/available-trips')}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  View Packages <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR ROUTES WITH LIVE RATE ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Trending Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Popular Outstation Highway Routes
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            One-way & Round-trip transfers available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route, index) => (
            <div
              key={index}
              onClick={() => {
                setFromCity(route.from);
                setToCity(route.to);
                setActiveBookingType('WITH_DRIVER');
                navigate('/rent-with-driver');
              }}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-red-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
                  <span>{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1.5 transition-transform" />
                  <span>{route.to}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">{route.distance}</span>
                  <span>•</span>
                  <span>{route.duration}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting From</span>
                <span className="text-xl font-black text-red-600 block">{route.startingPrice}</span>
                <span className="text-[10px] text-slate-500 font-bold">Base Fare</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Customer Reviews
          </span>
          <h2 className="text-3xl font-black text-slate-900">Loved by Travelers Across India</h2>
          <p className="text-sm text-slate-500 font-medium">
            Real experiences from corporate professionals, families, and solo explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              "Booked an Innova Crysta with chauffeur Vikas for our Bangalore-Coorg family trip. The car was spotless, driver was extremely polite and route knowledgeable. Outstanding experience!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 font-black flex items-center justify-center text-xs">
                RS
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Rajesh Sharma</h4>
                <p className="text-[10px] text-slate-400 font-bold">Bangalore • Coorg Tour</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              "The Agency Portal with multi-pickup OTP verification made our corporate delegation airport transfers completely stress-free. The automated Duty Slip bill report was accepted immediately."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-xs">
                AG
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Agey George</h4>
                <p className="text-[10px] text-slate-400 font-bold">Corporate Travel Manager</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              "Self-drive Kia Carens booking was seamless. Zero hidden charges, vehicle was handed over on time in Koramangala with full tank fuel. Will definitely book again for Goa."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 font-black flex items-center justify-center text-xs">
                AR
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Anita Roy</h4>
                <p className="text-[10px] text-slate-400 font-bold">Self-Drive Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-black text-slate-900">Got Questions? We've Got Answers.</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-black text-sm text-slate-900 hover:text-red-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-45 bg-red-100 text-red-600' : ''
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
