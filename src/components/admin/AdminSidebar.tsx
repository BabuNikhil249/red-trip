import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, UserCheck, Compass, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/admin/fleet', label: 'Fleet Vehicles', icon: Car },
    { path: '/admin/drivers', label: 'Driver Directory', icon: UserCheck },
    { path: '/admin/trips', label: 'Scheduled Trips', icon: Compass },
    { path: '/admin/bookings', label: 'Customer Bookings', icon: FileText },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 p-5 rounded-3xl space-y-6 shrink-0 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white leading-tight">RED TRIP ADMIN</h3>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500">
            Control Portal
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                active
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Customer View
        </Link>
      </div>
    </aside>
  );
};
