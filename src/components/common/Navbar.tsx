import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Car,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Building2,
  UserCheck,
  Sparkles,
  PhoneCall,
  Compass,
  Zap,
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loginAsAgency, loginAsDriver, loginAsAdmin, addToast } =
    useBookingContext();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* TOP ANNOUNCEMENT & QUICK ROLE PORTAL SWITCHER BAR */}
      <div className="bg-slate-100/90 text-slate-700 text-xs border-b border-slate-200/80 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <Zap className="w-3.5 h-3.5 text-red-600" />
              <span>Flat 10% OFF on Outstation Trips • Code: <strong className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">REDTRIP10</strong></span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Insured Fleet & Police-Verified Chauffeurs
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Portal Switcher Pills */}
            <div className="flex items-center bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[11px] font-bold shadow-xs">
              <span className="text-slate-400 mr-2 text-[10px] uppercase tracking-wider">Quick Portals:</span>
              <button
                onClick={() => {
                  loginAsAgency('M/S Apoorva', 'apoorva@example.com', '9871418158');
                  addToast('Switched to Agency Portal (M/S Apoorva)', 'success');
                  navigate('/agency');
                }}
                className={`px-2 py-0.5 rounded transition-all ${
                  user.role === 'AGENCY'
                    ? 'bg-red-600 text-white font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🏢 Agency
              </button>

              <button
                onClick={() => {
                  loginAsDriver('Vikas U', '+91 98123 45678', 'KA 05 AM 2969');
                  addToast('Switched to Driver Portal (Vikas U)', 'success');
                  navigate('/driver');
                }}
                className={`px-2 py-0.5 rounded transition-all ${
                  user.role === 'DRIVER'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🚘 Driver
              </button>

              <button
                onClick={() => {
                  loginAsAdmin();
                  addToast('Switched to Admin Portal', 'success');
                  navigate('/admin/agencies');
                }}
                className={`px-2 py-0.5 rounded transition-all ${
                  user.role === 'ADMIN'
                    ? 'bg-blue-600 text-white font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                ⚡ Admin
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 pl-2 border-l border-slate-300">
              <PhoneCall className="w-3 h-3 text-red-600" />
              <span className="font-bold text-[11px] text-slate-900">+91 (800) RED-TRIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Premium Badge */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-all duration-300">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none flex items-center">
                RED<span className="text-red-600 ml-0.5">TRIP</span>
                <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest bg-red-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                  PRO
                </span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1 flex items-center gap-1">
                {isAdmin ? 'Admin Master Control' : 'Rentals • Chauffeurs • Tours'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/')
                  ? 'text-red-600 bg-red-50 font-black shadow-xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Rent Vehicle Dropdown */}
            <div className="relative" onMouseLeave={() => setServicesDropdownOpen(false)}>
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive('/rent-with-driver') || isActive('/self-drive')
                    ? 'text-red-600 bg-red-50 font-black shadow-xs'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                }`}
              >
                <span>Rent Vehicle</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-red-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {servicesDropdownOpen && (
                <div
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5"
                >
                  <Link
                    to="/rent-with-driver"
                    className="flex items-start gap-3.5 px-4 py-3 hover:bg-red-50/50 transition-colors group"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">
                        Vehicle + Chauffeur
                      </p>
                      <p className="text-xs text-slate-500 font-medium">Rent SUV/Sedan with certified driver</p>
                    </div>
                  </Link>

                  <Link
                    to="/self-drive"
                    className="flex items-start gap-3.5 px-4 py-3 hover:bg-blue-50/50 transition-colors group"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        Self-Drive (Without Driver)
                      </p>
                      <p className="text-xs text-slate-500 font-medium">Drive yourself with zero deposit options</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/hire-driver"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/hire-driver')
                  ? 'text-red-600 bg-red-50 font-black shadow-xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Hire Driver
            </Link>

            <Link
              to="/available-trips"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                isActive('/available-trips')
                  ? 'text-red-600 bg-red-50 font-black shadow-xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-red-500" />
              <span>Tour Packages</span>
            </Link>

            <Link
              to="/helpdesk"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/helpdesk') || isActive('/contact')
                  ? 'text-red-600 bg-red-50 font-black shadow-xs'
                  : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Help Desk
            </Link>

            {/* Role-based Direct Links */}
            {user.isLoggedIn && (
              <>
                {user.role === 'AGENCY' && (
                  <Link
                    to="/agency"
                    className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                      isActive('/agency')
                        ? 'text-white bg-red-600 shadow-md shadow-red-600/30'
                        : 'text-red-600 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Agency Portal
                  </Link>
                )}

                {user.role === 'DRIVER' && (
                  <Link
                    to="/driver"
                    className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                      isActive('/driver')
                        ? 'text-slate-950 bg-amber-400 shadow-md shadow-amber-400/30'
                        : 'text-amber-800 bg-amber-100 hover:bg-amber-200'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" /> Driver Duty
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/agencies"
                    className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                      isActive('/admin/agencies')
                        ? 'text-white bg-slate-900 shadow-md'
                        : 'text-slate-800 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-red-600" /> Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Actions & Account Status */}
          <div className="hidden lg:flex items-center gap-3">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'AGENCY' ? '/agency' : user.role === 'DRIVER' ? '/driver' : user.role === 'ADMIN' ? '/admin/agencies' : '/dashboard'}
                  className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 p-1.5 pr-3.5 rounded-2xl border border-slate-200 shadow-xs transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900 leading-tight max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-red-600">
                      {user.role === 'AGENCY'
                        ? '🏢 Agency'
                        : user.role === 'DRIVER'
                        ? '🚘 Driver'
                        : user.role === 'ADMIN'
                        ? '⚡ Admin'
                        : '👤 Customer'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs rounded-xl transition-all border border-slate-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-red-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-5 duration-200 shadow-2xl">
          {/* Quick Role Switcher on Mobile */}
          <div className="bg-slate-900 p-3 rounded-2xl text-white space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Quick Role Portal Access:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                onClick={() => {
                  loginAsAgency('M/S Apoorva', 'apoorva@example.com', '9871418158');
                  addToast('Signed in as Agency (M/S Apoorva)', 'success');
                  setMobileMenuOpen(false);
                  navigate('/agency');
                }}
                className="py-2 bg-red-600 rounded-xl text-center text-white"
              >
                🏢 Agency
              </button>

              <button
                onClick={() => {
                  loginAsDriver('Vikas U', '+91 98123 45678', 'KA 05 AM 2969');
                  addToast('Signed in as Driver (Vikas U)', 'success');
                  setMobileMenuOpen(false);
                  navigate('/driver');
                }}
                className="py-2 bg-amber-500 rounded-xl text-center text-slate-950"
              >
                🚘 Driver
              </button>

              <button
                onClick={() => {
                  loginAsAdmin();
                  addToast('Signed in as Admin', 'success');
                  setMobileMenuOpen(false);
                  navigate('/admin/agencies');
                }}
                className="py-2 bg-slate-800 rounded-xl text-center text-white"
              >
                ⚡ Admin
              </button>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/rent-with-driver"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50"
            >
              🚗 Vehicle + Chauffeur
            </Link>
            <Link
              to="/self-drive"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50"
            >
              🛡️ Self-Drive Rentals (Without Driver)
            </Link>
            <Link
              to="/hire-driver"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50"
            >
              👨‍✈️ Hire Verified Driver
            </Link>
            <Link
              to="/available-trips"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50"
            >
              🌴 Tour Packages (Karnataka & India)
            </Link>
            <Link
              to="/helpdesk"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50"
            >
              💬 24/7 Help Desk & Emergency
            </Link>
          </div>

          {user.isLoggedIn ? (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{user.name}</p>
                  <p className="text-[10px] font-black uppercase text-red-600">{user.role} Account Active</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-red-700 text-white font-bold rounded-2xl text-sm transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-2xl font-bold border border-slate-200 text-slate-800 text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-2xl font-black bg-red-600 text-white text-sm shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
