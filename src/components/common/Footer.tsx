import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  Sparkles,
  Building2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/90 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter / Trust Strip */}
        <div className="bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Exclusive Member Privileges
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Get ₹500 OFF Your First Luxury Chauffeur or Self-Drive Journey
            </h3>
            <p className="text-xs text-slate-400">
              Subscribe to our monthly road trip magazine and seasonal outstation deals.
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 w-full sm:w-64"
            />
            <button
              onClick={() => alert('Thank you for subscribing to RED TRIP Privileges!')}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 shadow-lg shadow-red-600/30 active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* 5 Columns Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-8 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 flex items-center justify-center text-white font-bold shadow-lg shadow-red-600/30">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                RED<span className="text-red-500 ml-0.5">TRIP</span>
                <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest bg-red-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                  PRO
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your Journey. Your Choice. Premier travel & mobility infrastructure platform connecting travelers with verified luxury car rentals, professional chauffeurs, on-demand drivers, and curated Karnataka & India tour packages.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Insured Fleet
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-red-400" /> 24/7 Roadside Assistance
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" /> Travel Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/rent-with-driver" className="hover:text-red-400 transition-colors">
                  Vehicle + Chauffeur Rental
                </Link>
              </li>
              <li>
                <Link to="/self-drive" className="hover:text-red-400 transition-colors">
                  Self-Drive Cars (Without Driver)
                </Link>
              </li>
              <li>
                <Link to="/hire-driver" className="hover:text-red-400 transition-colors">
                  Hire Chauffeur Only
                </Link>
              </li>
              <li>
                <Link to="/available-trips" className="hover:text-red-400 transition-colors">
                  Curated Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-red-400 transition-colors">
                  My Trips & Tickets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-500" /> Enterprise Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/agency" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  🏢 Agency Operations Center
                </Link>
              </li>
              <li>
                <Link to="/driver" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  🚘 Driver Duty & OTP Terminal
                </Link>
              </li>
              <li>
                <Link to="/admin/agencies" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  ⚡ Travel Agency Admin
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Multi-Role Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-red-500" /> 24/7 Concierge
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-bold">+91 (800) RED-TRIP</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>support@redtrip.in</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>100ft Road, Indiranagar, Bangalore, KA 560038</span>
              </div>
              <div className="pt-2 flex flex-col gap-1.5">
                <Link to="/helpdesk" className="text-red-400 font-bold hover:underline flex items-center gap-1">
                  → Open 24/7 Help Desk & FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RED TRIP Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Refund & Cancellation</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Security Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
