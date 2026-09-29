import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { BookingTypeSelector } from '../components/booking/BookingTypeSelector';
import { BookingForm } from '../components/booking/BookingForm';
import { TripCard } from '../components/booking/TripCard';
import { bookingService } from '../services/bookingService';
import type { AvailableTrip } from '../types';
import { POPULAR_ROUTES } from '../data/mockData';
import {
  ShieldCheck,
  UserCheck,
  Zap,
  Tag,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBookingType, setActiveBookingType, setSelectedTrip } = useBookingContext();
  const [featuredTrips, setFeaturedTrips] = useState<AvailableTrip[]>([]);

  useEffect(() => {
    bookingService.getAvailableTrips().then((trips) => {
      setFeaturedTrips(trips.slice(0, 3));
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden rounded-b-3xl bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-600/30 via-slate-900/90 to-slate-950 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> India's Premier Travel & Rental Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Your Journey. <span className="text-red-500">Your Choice.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              Rent a vehicle with a driver, rent a vehicle without a driver, hire a driver for your own vehicle, or choose from available scheduled trips.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <BookingTypeSelector
              activeType={activeBookingType}
              onSelect={(type) => setActiveBookingType(type)}
            />
            <BookingForm />
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

      {/* FEATURED SCHEDULED TRIPS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 py-12 rounded-3xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Shared Travel
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Available Scheduled Trips
            </h2>
          </div>
          <button
            onClick={() => navigate('/available-trips')}
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            Browse All Trips <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onBookSeat={(t) => {
                setSelectedTrip(t);
                navigate(`/trip/${t.id}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* POPULAR ROUTES CAROUSEL / GRID */}
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
