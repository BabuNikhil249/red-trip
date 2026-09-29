import React from 'react';
import type { Booking } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, MapPin, Car, User } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetails, onCancel }) => {
  const getTypeName = () => {
    switch (booking.bookingType) {
      case 'WITH_DRIVER':
        return 'Vehicle + Driver';
      case 'SELF_DRIVE':
        return 'Self Drive';
      case 'DRIVER_ONLY':
        return 'Driver Only';
      case 'AVAILABLE_TRIP':
        return 'Scheduled Seat Trip';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-slate-900">{booking.id}</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-md">
            {getTypeName()}
          </span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Pickup</span>
              <p className="text-sm font-bold text-slate-900 leading-snug">{booking.pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Destination</span>
              <p className="text-sm font-bold text-slate-900 leading-snug">{booking.dropLocation}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              {booking.travelDate} at {booking.pickupTime}
            </span>
          </div>

          {booking.vehicle && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Car className="w-4 h-4 text-red-600" />
              <span>{booking.vehicle.name}</span>
            </div>
          )}

          {booking.driver && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <User className="w-4 h-4 text-blue-600" />
              <span>Driver: {booking.driver.name}</span>
            </div>
          )}
        </div>

        <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block md:text-right">Total Amount</span>
            <span className="text-xl font-black text-slate-900">₹{booking.totalAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onViewDetails(booking)}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              View Ticket
            </button>
            {onCancel && booking.status === 'Upcoming' && (
              <button
                onClick={() => onCancel(booking)}
                className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
