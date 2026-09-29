import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import type { Booking, BookingStatus } from '../types';
import { BookingCard } from '../components/dashboard/BookingCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { useBookingContext } from '../context/BookingContext';
import { AlertTriangle } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useBookingContext();

  const [activeTab, setActiveTab] = useState<BookingStatus | 'All'>('Upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plans');
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    bookingService
      .getBookings(activeTab)
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(cancelModalBooking.id, cancelReason);
      addToast(`Booking ${cancelModalBooking.id} cancelled.`, 'info');
      setCancelModalBooking(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      addToast('Failed to cancel booking.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const tabs: (BookingStatus | 'All')[] = ['Upcoming', 'Active', 'Completed', 'Cancelled', 'All'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
            Customer Travel Hub
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">My Bookings</h1>
          <p className="text-sm text-slate-500">
            View, manage, and download tickets for all your RED TRIP rental reservations.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-600/20"
        >
          + New Booking
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab} {tab === 'All' ? 'Bookings' : ''}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner label="Fetching your reservations..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            title={`No ${activeTab} Bookings Found`}
            message="You do not have any reservations under this category."
            actionText="Make a Reservation"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={(b) => navigate(`/confirmation/${b.id}`)}
                onCancel={(b) => setCancelModalBooking(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl text-red-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Are you sure you want to cancel this booking?</span>
              <p>Booking ID: {cancelModalBooking?.id}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Cancellation
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            >
              <option value="Change of travel plans">Change of travel plans</option>
              <option value="Found alternative transport">Found alternative transport</option>
              <option value="Booked by mistake">Booked by mistake</option>
              <option value="Personal emergency">Personal emergency</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCancelModalBooking(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
            >
              {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
