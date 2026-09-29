import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  CheckCircle2,
  Download,
  Home,
  MapPin,
  Car,
  User,
} from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      bookingService.getBookingById(id).then((b) => {
        if (b) setBooking(b);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <LoadingSpinner label="Retrieving confirmation voucher..." />;

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Booking Confirmation Not Found</h2>
        <p className="text-slate-600">The requested booking ID does not exist or has expired.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 print:max-w-full">
      {/* Success Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Booking Confirmed!</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          Thank you for choosing RED TRIP. Your booking voucher has been generated and sent to{' '}
          <strong className="text-slate-900">{booking.customer.email}</strong>.
        </p>
      </div>

      {/* Main Voucher Ticket Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Ticket Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 block">
              Official Travel Pass
            </span>
            <span className="text-2xl font-black tracking-tight">{booking.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} size="lg" />
          </div>
        </div>

        {/* Voucher Body Details */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Customer & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 font-medium block">Customer Name</span>
              <span className="font-bold text-slate-900 text-base">{booking.customer.fullName}</span>
              <span className="text-slate-500 block">{booking.customer.phone}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Service Option</span>
              <span className="font-bold text-red-600 text-base">{booking.bookingType}</span>
              <span className="text-slate-500 block">Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Route & Schedule */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Route & Timings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" /> Pickup Location
                </span>
                <p className="font-bold text-slate-900">{booking.pickupLocation}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination
                </span>
                <p className="font-bold text-slate-900">{booking.dropLocation}</p>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-medium block">Departure Date & Time</span>
                  <span className="font-bold text-slate-900">
                    {booking.travelDate} at {booking.pickupTime}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-medium block">Capacity</span>
                  <span className="font-bold text-slate-900">{booking.passengers} Passengers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Vehicle / Driver Details */}
          {(booking.vehicle || booking.driver) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              {booking.vehicle && (
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Car className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                    <span className="font-bold text-slate-900">{booking.vehicle.name}</span>
                  </div>
                </div>
              )}

              {booking.driver && (
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <User className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Chauffeur</span>
                    <span className="font-bold text-slate-900">{booking.driver.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fare Summary */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Paid / Payable</span>
              <span className="text-xs text-emerald-600 font-semibold">Taxes & fees included</span>
            </div>
            <span className="text-3xl font-black text-slate-900">
              ₹{booking.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
        <button
          onClick={handlePrintDownload}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" /> Download Confirmation
        </button>

        <button
          onClick={() => navigate('/my-bookings')}
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
        >
          View in My Bookings
        </button>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
};
