import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, ChevronDown, ShieldCheck, ShieldAlert, LogOut } from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useBookingContext();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                RED<span className="text-red-600 ml-1">TRIP</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
                {isAdmin ? 'Admin Control' : 'Premium Travel'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Rent Vehicle Dropdown */}
            <div className="relative" onMouseLeave={() => setServicesDropdownOpen(false)}>
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/rent-with-driver') || isActive('/self-drive')
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                }`}
              >
                Rent Vehicle
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  className="absolute left-0 mt-1 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <Link
                    to="/rent-with-driver"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Vehicle + Driver</p>
                      <p className="text-xs text-slate-500">Rent car/SUV with chauffeur</p>
                    </div>
                  </Link>

                  <Link
                    to="/self-drive"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Vehicle Without Driver</p>
                      <p className="text-xs text-slate-500">Self-drive rental cars</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/hire-driver"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/hire-driver') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Hire Driver
            </Link>

            <Link
              to="/available-trips"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/available-trips') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Available Trips
            </Link>

            <Link
              to="/my-bookings"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/my-bookings') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              My Bookings
            </Link>

            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/dashboard') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Right User & Admin Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Admin Badge Shortcut */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-red-500" /> Admin Portal
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors px-2 py-1"
              >
                Admin Sign-In
              </Link>
            )}

            {user.isLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 pl-3 rounded-full border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-full"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20 active:scale-95"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-5 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/rent-with-driver"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-600"
          >
            Vehicle + Driver
          </Link>
          <Link
            to="/self-drive"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-600"
          >
            Vehicle Without Driver
          </Link>
          <Link
            to="/hire-driver"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Hire Driver
          </Link>
          <Link
            to="/available-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Available Trips
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            My Bookings
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-bold text-red-600 hover:bg-red-50"
          >
            Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
};
