import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Car, UserCheck, Compass, FileText } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAdminMetrics().then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-8 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
              System Control Overview
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/fleet')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              + Add Vehicle
            </button>
            <button
              onClick={() => navigate('/admin/trips')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              + Schedule Trip
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Calculating admin analytics metrics..." />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Platform Revenue
                </span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                  ₹{metrics.totalRevenue.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">Confirmed bookings</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Fleet Vehicles
                </span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  {metrics.totalVehicles}
                </p>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {metrics.availableVehicles} active vehicles
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Driver Roster
                </span>
                <p className="text-2xl sm:text-3xl font-black text-purple-600">
                  {metrics.totalDrivers}
                </p>
                <span className="text-[10px] text-purple-600 font-semibold">
                  {metrics.activeDrivers} online drivers
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Reservations
                </span>
                <p className="text-2xl sm:text-3xl font-black text-blue-600">
                  {metrics.totalBookings}
                </p>
                <span className="text-[10px] text-blue-600 font-semibold">
                  {metrics.upcomingBookings} upcoming
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => navigate('/admin/fleet')}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                    Manage Fleet →
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Vehicle Fleet Control</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Add new rental vehicles, modify daily rates, update seating capacities, and toggle self-drive permissions.
                </p>
              </div>

              <div
                onClick={() => navigate('/admin/drivers')}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                    Manage Drivers →
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Driver Directory</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Add background-checked drivers, update hourly and daily wage rates, edit spoken languages, and check trip logs.
                </p>
              </div>

              <div
                onClick={() => navigate('/admin/trips')}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                    Manage Trips →
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Scheduled Departure Trips</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Schedule fixed departures between cities, assign vehicles and chauffeurs, set seat counts, and set passenger pricing.
                </p>
              </div>

              <div
                onClick={() => navigate('/admin/bookings')}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    All Bookings →
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Customer Bookings Manager</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  View all system bookings, override status (Confirm, Active, Completed, Cancelled), and view full customer details.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
