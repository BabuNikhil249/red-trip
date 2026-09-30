import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import type { AvailableTrip } from '../../types';
import { TripModal } from '../../components/admin/TripModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useBookingContext } from '../../context/BookingContext';
import { Plus, Trash2, ArrowRight, Package } from 'lucide-react';

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
      addToast(`New package "${payload.title || payload.to}" created!`, 'success');
      fetchTrips();
    } catch (err) {
      console.error(err);
      addToast('Failed to create trip package.', 'error');
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (window.confirm('Delete this trip package?')) {
      await adminService.deleteTrip(id);
      addToast('Trip package deleted.', 'info');
      fetchTrips();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Package Management
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Manage Trip Packages</h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Trip Package
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching trip packages..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Package Details & Region</th>
                    <th className="p-4">Route & Duration</th>
                    <th className="p-4">Vehicle & Driver</th>
                    <th className="p-4">Available Slots</th>
                    <th className="p-4">Price / Person</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trips.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {t.image ? (
                            <img
                              src={t.image}
                              alt={t.title || t.from}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <span
                              className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-0.5 ${
                                t.region === 'Karnataka'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {t.region === 'Karnataka' ? '🌴 Karnataka' : '🇮🇳 All India'}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">
                              {t.title || `${t.from} to ${t.to}`}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-medium">ID: {t.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                          <span>{t.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{t.to}</span>
                        </div>
                        <span className="text-xs text-red-600 font-semibold block mt-0.5">
                          {t.durationDaysNights || t.estimatedDuration}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{t.vehicleName}</span>
                        <span className="text-xs text-slate-500">Chauffeur: {t.driverName}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-emerald-600 block">
                          {t.availableSeats} / {t.totalSeats} Spots
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
                          title="Delete Package"
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
