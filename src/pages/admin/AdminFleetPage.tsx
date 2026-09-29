import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import type { Vehicle } from '../../types';
import { VehicleModal } from '../../components/admin/VehicleModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useBookingContext } from '../../context/BookingContext';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export const AdminFleetPage: React.FC = () => {
  const { addToast } = useBookingContext();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = () => {
    setLoading(true);
    adminService.getAllVehicles().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSaveVehicle = async (payload: Omit<Vehicle, 'id'>) => {
    try {
      if (editingVehicle) {
        await adminService.updateVehicle(editingVehicle.id, payload);
        addToast(`Vehicle ${payload.name} updated!`, 'success');
      } else {
        await adminService.addVehicle(payload);
        addToast(`New vehicle ${payload.name} added to fleet!`, 'success');
      }
      fetchVehicles();
    } catch (err) {
      console.error(err);
      addToast('Failed to save vehicle.', 'error');
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from fleet?`)) {
      await adminService.deleteVehicle(id);
      addToast(`Vehicle ${name} removed.`, 'info');
      fetchVehicles();
    }
  };

  const handleToggleAvailability = async (vehicle: Vehicle) => {
    await adminService.updateVehicle(vehicle.id, { available: !vehicle.available });
    addToast(`Vehicle ${vehicle.name} status updated.`, 'info');
    fetchVehicles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
              Fleet Management
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Manage Fleet Vehicles</h1>
          </div>

          <button
            onClick={() => {
              setEditingVehicle(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Vehicle
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading fleet roster..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Vehicle Details</th>
                    <th className="p-4">Category / Seats</th>
                    <th className="p-4">Rental Rates</th>
                    <th className="p-4">Services</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.image}
                            alt={v.name}
                            className="w-14 h-10 rounded-lg object-cover border shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{v.name}</span>
                            <span className="text-slate-400 text-xs">{v.model}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{v.category}</span>
                        <span className="text-xs text-slate-500">{v.capacity} Seats</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">₹{v.pricePerDay}/day</span>
                        <span className="text-[11px] text-slate-500 block">Base: ₹{v.basePrice}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-[11px]">
                          {v.driverIncluded && (
                            <span className="text-emerald-700 font-bold">✓ With Driver</span>
                          )}
                          {v.isSelfDriveAvailable && (
                            <span className="text-blue-700 font-bold">✓ Self Drive</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAvailability(v)}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            v.available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {v.available ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingVehicle(v);
                              setModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit Vehicle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id, v.name)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <VehicleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveVehicle}
        initialVehicle={editingVehicle}
      />
    </div>
  );
};
