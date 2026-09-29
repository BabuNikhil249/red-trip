import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import type { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useBookingContext } from '../../context/BookingContext';

export const AdminBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useBookingContext();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'All'>('All');

  const fetchBookings = () => {
    setLoading(true);
    adminService.getAllBookings().then((data) => {
      let list = data;
      if (filterStatus !== 'All') {
        list = list.filter((b) => b.status === filterStatus);
      }
      setBookings(list);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    try {
      await adminService.updateBookingStatus(id, status);
      addToast(`Booking ${id} status updated to ${status}.`, 'success');
      fetchBookings();
    } catch (err) {
      console.error(err);
      addToast('Failed to update booking status.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              System Reservations
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">All Customer Bookings</h1>
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Upcoming', 'Active', 'Completed', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching system bookings list..." />
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600 font-semibold text-sm">No reservations found under this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">{b.id}</span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                      {b.bookingType}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Booked on {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs sm:text-sm">
                  {/* Customer Info */}
                  <div className="md:col-span-4 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Customer</span>
                    <p className="font-bold text-slate-900">{b.customer.fullName}</p>
                    <p className="text-slate-500">{b.customer.phone}</p>
                    <p className="text-slate-500">{b.customer.email}</p>
                  </div>

                  {/* Route */}
                  <div className="md:col-span-5 space-y-1 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Itinerary</span>
                    <p className="font-semibold text-slate-800">
                      {b.pickupLocation} → {b.dropLocation}
                    </p>
                    <p className="text-slate-500">
                      {b.travelDate} at {b.pickupTime}
                    </p>
                    {b.vehicle && <p className="text-red-600 font-bold">{b.vehicle.name}</p>}
                  </div>

                  {/* Pricing & Admin Action */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium md:text-right">Amount</span>
                      <span className="text-xl font-black text-slate-900">₹{b.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/confirmation/${b.id}`)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                      >
                        Ticket
                      </button>

                      {b.status !== 'Active' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Active')}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold"
                        >
                          Mark Active
                        </button>
                      )}

                      {b.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Completed')}
                          className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold"
                        >
                          Mark Completed
                        </button>
                      )}

                      {b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                          className="px-2 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
