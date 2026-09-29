import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Shield, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-600/30">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                RED<span className="text-red-500 ml-1">TRIP</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your Journey. Your Choice. Premium travel & vehicle rental platform offering verified self-drive cars, professional chauffeur rentals, driver-on-demand, and shared trip seat bookings.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Shield className="w-4 h-4 text-emerald-400" /> 100% Insured Fleet
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Clock className="w-4 h-4 text-red-400" /> 24/7 Roadside Assistance
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Rental Options</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rent-with-driver" className="hover:text-red-400 transition-colors">
                  Rent Vehicle + Driver
                </Link>
              </li>
              <li>
                <Link to="/self-drive" className="hover:text-red-400 transition-colors">
                  Self Drive Rental
                </Link>
              </li>
              <li>
                <Link to="/hire-driver" className="hover:text-red-400 transition-colors">
                  Hire Chauffeur Only
                </Link>
              </li>
              <li>
                <Link to="/available-trips" className="hover:text-red-400 transition-colors">
                  Book Scheduled Trips
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-red-400 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Top Routes</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-red-400 transition-colors cursor-pointer">Bangalore → Mysore</li>
              <li className="hover:text-red-400 transition-colors cursor-pointer">Bangalore → Coorg</li>
              <li className="hover:text-red-400 transition-colors cursor-pointer">Bangalore → Chikmagalur</li>
              <li className="hover:text-red-400 transition-colors cursor-pointer">Bangalore → Mangalore</li>
              <li className="hover:text-red-400 transition-colors cursor-pointer">Bangalore → Goa</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">24/7 Helpline</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>+91 (800) RED-TRIP</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@redtrip.in</span>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>MG Road, Indiranagar, Bangalore, KA 560038</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RED TRIP Travel Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Refund & Cancellation</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
