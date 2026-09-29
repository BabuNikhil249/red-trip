import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import type { Driver } from '../../types';
import { DriverModal } from '../../components/admin/DriverModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useBookingContext } from '../../context/BookingContext';
import { Plus, Edit3, Trash2, Star } from 'lucide-react';

export const AdminDriversPage: React.FC = () => {
  const { addToast } = useBookingContext();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const fetchDrivers = () => {
    setLoading(true);
    adminService.getAllDrivers().then((data) => {
      setDrivers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSaveDriver = async (payload: Omit<Driver, 'id'>) => {
    try {
      if (editingDriver) {
        await adminService.updateDriver(editingDriver.id, payload);
        addToast(`Driver ${payload.name} updated!`, 'success');
      } else {
        await adminService.addDriver(payload);
        addToast(`New driver ${payload.name} added!`, 'success');
      }
      fetchDrivers();
    } catch (err) {
      console.error(err);
      addToast('Failed to save driver profile.', 'error');
    }
  };

  const handleDeleteDriver = async (id: string, name: string) => {
    if (window.confirm(`Remove ${name} from driver roster?`)) {
      await adminService.deleteDriver(id);
      addToast(`Driver ${name} removed.`, 'info');
      fetchDrivers();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
              Driver Roster
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Manage Driver Directory</h1>
          </div>

          <button
            onClick={() => {
              setEditingDriver(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Driver
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching driver profiles..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drivers.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={d.photo}
                    alt={d.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base truncate">{d.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {d.rating}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{d.experienceYears} Yrs Experience</p>
                    <p className="text-xs text-slate-600 font-semibold mt-1">{d.phone}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 font-medium block">Daily Rate</span>
                    <span className="font-bold text-slate-900 text-base">₹{d.dailyRate}/day</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Completed Trips</span>
                    <span className="font-bold text-slate-900">{d.completedTrips} Trips</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingDriver(d);
                        setModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Edit Driver"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(d.id, d.name)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Driver"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DriverModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDriver}
        initialDriver={editingDriver}
      />
    </div>
  );
};
