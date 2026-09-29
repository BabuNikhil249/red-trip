import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBookingContext } from '../../context/BookingContext';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin, addToast } = useBookingContext();

  const [email, setEmail] = useState('admin@redtrip.in');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin();
    addToast('Authenticated as Administrator', 'success');
    navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900">
      <div className="max-w-md w-full bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            System Administration
          </span>
          <h2 className="text-2xl font-black">RED TRIP Control Portal</h2>
          <p className="text-xs text-slate-400">Sign in to manage fleet vehicles, drivers, trips, and bookings.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Admin Email *
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-900">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
