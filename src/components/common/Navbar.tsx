import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, ChevronDown, ShieldCheck, ShieldAlert, LogOut, Building2, UserCheck } from 'lucide-react';
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
              Trip Packages
            </Link>

            <Link
              to="/helpdesk"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/helpdesk') || isActive('/contact') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Help Desk
            </Link>

            {/* Role-based Nav Links (Only when logged in) */}
            {user.isLoggedIn && (
              <>
                {user.role === 'USER' && (
                  <>
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
                  </>
                )}

                {user.role === 'AGENCY' && (
                  <Link
                    to="/agency"
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${
                      isActive('/agency') ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-red-600" /> Agency Portal
                  </Link>
                )}

                {user.role === 'DRIVER' && (
                  <Link
                    to="/driver"
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${
                      isActive('/driver') ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-amber-600" /> Driver Duty
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${
                      isActive('/admin') ? 'text-slate-900 bg-slate-100' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-red-600" /> Admin Control
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right User & Logged In Role Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] truncate">{user.name}</span>
                    <span className="text-[9px] font-extrabold uppercase text-red-600">
                      {user.role === 'AGENCY'
                        ? 'Agency'
                        : user.role === 'DRIVER'
                        ? 'Driver'
                        : user.role === 'ADMIN'
                        ? 'Admin'
                        : 'Customer'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-red-600/20 active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
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
              </div>
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
            Trip Packages
          </Link>
          <Link
            to="/helpdesk"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Help Desk & Contact
          </Link>

          {user.isLoggedIn ? (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] font-extrabold uppercase text-red-600">{user.role} Account</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-600/20"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl font-bold border border-slate-200 text-slate-700 text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl font-bold bg-red-600 text-white text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
