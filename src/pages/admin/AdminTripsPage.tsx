import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import type { AvailableTrip } from '../../types';
import { TripModal } from '../../components/admin/TripModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useBookingContext } from '../../context/BookingContext';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export const AdminTripsPage: React.FC = () => {
  const { addToast } = useBookingContext();
  const [trips, setTrips] = useState<AvailableTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTrips = () => {
    setLoading(true);
    adminService.getAllTrips().then((data) => {
      setTrips(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSaveTrip = async (payload: Omit<AvailableTrip, 'id'>) => {
    try {
      await adminService.addTrip(payload);
      addToast(`New trip ${payload.from} → ${payload.to} scheduled!`, 'success');
      fetchTrips();
    } catch (err) {
      console.error(err);
      addToast('Failed to schedule trip.', 'error');
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (window.confirm('Cancel and delete this scheduled trip departure?')) {
      await adminService.deleteTrip(id);
      addToast('Scheduled trip deleted.', 'info');
      fetchTrips();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
              Trip Scheduler
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Manage Scheduled Trips</h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Schedule Departure Trip
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching scheduled departures..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Trip ID / Route</th>
                    <th className="p-4">Departure & Timing</th>
                    <th className="p-4">Vehicle & Driver</th>
                    <th className="p-4">Seats Left</th>
                    <th className="p-4">Seat Fare</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trips.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <span className="text-[10px] font-bold text-slate-400 block">{t.id}</span>
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                          <span>{t.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-red-600" />
                          <span>{t.to}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{t.date}</span>
                        <span className="text-xs text-red-600 font-semibold">{t.departureTime}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{t.vehicleName}</span>
                        <span className="text-xs text-slate-500">Driver: {t.driverName}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-emerald-600 block">
                          {t.availableSeats} / {t.totalSeats} Seats
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-black text-slate-900 text-base">
                          ₹{t.pricePerPassenger}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteTrip(t.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <TripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTrip} />
    </div>
  );
};
