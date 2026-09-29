import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { BookingCard } from '../components/dashboard/BookingCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Car,
  ShieldCheck,
  UserCheck,
  Compass,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setActiveBookingType } = useBookingContext();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const totalBookings = bookings.length;
  const upcomingTrips = bookings.filter((b) => b.status === 'Upcoming').length;
  const activeBookings = bookings.filter((b) => b.status === 'Active').length;
  const completedTrips = bookings.filter((b) => b.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">
            Customer Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-black">Welcome back, {user.name}!</h1>
          <p className="text-xs md:text-sm text-slate-300">
            Track active rentals, view upcoming journeys, or make a new reservation.
          </p>
        </div>

        <button
          onClick={() => navigate('/my-bookings')}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-600/30"
        >
          View All Bookings ({totalBookings})
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalBookings}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Upcoming Trips
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-600">{upcomingTrips}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Rentals
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">{activeBookings}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed Trips
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-600">{completedTrips}</p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setActiveBookingType('WITH_DRIVER');
              navigate('/rent-with-driver');
            }}
            className="p-5 bg-white border border-slate-200 hover:border-red-500 rounded-2xl shadow-xs hover:shadow-lg transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Rent Vehicle + Driver</h3>
            <p className="text-xs text-slate-500 mt-0.5">Rent car/SUV with chauffeur</p>
          </button>

          <button
            onClick={() => {
              setActiveBookingType('SELF_DRIVE');
              navigate('/self-drive');
            }}
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl shadow-xs hover:shadow-lg transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Rent Vehicle</h3>
            <p className="text-xs text-slate-500 mt-0.5">Self-drive rental cars</p>
          </button>

          <button
            onClick={() => {
              setActiveBookingType('DRIVER_ONLY');
              navigate('/hire-driver');
            }}
            className="p-5 bg-white border border-slate-200 hover:border-purple-500 rounded-2xl shadow-xs hover:shadow-lg transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Hire Driver</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hire driver for your car</p>
          </button>

          <button
            onClick={() => {
              setActiveBookingType('AVAILABLE_TRIP');
              navigate('/available-trips');
            }}
            className="p-5 bg-white border border-slate-200 hover:border-amber-500 rounded-2xl shadow-xs hover:shadow-lg transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Available Trips</h3>
            <p className="text-xs text-slate-500 mt-0.5">Book shared route seat</p>
          </button>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
          <button
            onClick={() => navigate('/my-bookings')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading dashboard feeds..." />
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-600">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((b) => (
              <BookingCard key={b.id} booking={b} onViewDetails={(bk) => navigate(`/confirmation/${bk.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
