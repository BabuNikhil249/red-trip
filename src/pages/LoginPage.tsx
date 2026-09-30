import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { Car, Mail, Lock, ShieldAlert, Building2, UserCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsUser, loginAsAdmin, loginAsAgency, loginAsDriver, addToast } = useBookingContext();

  const [activeTab, setActiveTab] = useState<'USER' | 'AGENCY' | 'DRIVER' | 'ADMIN'>('USER');
  const [email, setEmail] = useState('rajesh.sharma@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'ADMIN') {
      loginAsAdmin();
      addToast('Logged in as Administrator!', 'success');
      navigate('/admin');
    } else if (activeTab === 'AGENCY') {
      loginAsAgency('M/S Apoorva', email || 'apoorva.travels@example.com', '9871418158');
      addToast('Logged in as Agency (M/S Apoorva)!', 'success');
      navigate('/agency');
    } else if (activeTab === 'DRIVER') {
      loginAsDriver('Vikas U', '+91 98123 45678', 'KA 05 AM 2969');
      addToast('Logged in as Cab Driver (Vikas U)!', 'success');
      navigate('/driver');
    } else {
      loginAsUser(email.split('@')[0].replace('.', ' '), email, '+91 98765 43210');
      addToast('Logged in successfully!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
            {activeTab === 'ADMIN' ? (
              <ShieldAlert className="w-6 h-6" />
            ) : activeTab === 'AGENCY' ? (
              <Building2 className="w-6 h-6" />
            ) : activeTab === 'DRIVER' ? (
              <UserCheck className="w-6 h-6" />
            ) : (
              <Car className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {activeTab === 'ADMIN'
              ? 'Admin Portal Sign In'
              : activeTab === 'AGENCY'
              ? 'Agency Portal Sign In'
              : activeTab === 'DRIVER'
              ? 'Driver Duty Portal Sign In'
              : 'Customer Login'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'ADMIN'
              ? 'Control fleet, drivers, scheduled trips & system bookings.'
              : activeTab === 'AGENCY'
              ? 'Book multi-pickup trips, flight arrivals, and view Duty Slip Bill Reports.'
              : activeTab === 'DRIVER'
              ? 'Access 1st/2nd pickup instructions & fill Duty Slip Logbooks.'
              : 'Sign in to manage your RED TRIP rentals & tickets.'}
          </p>
        </div>

        {/* 4 Role Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('USER');
              setEmail('rajesh.sharma@example.com');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'USER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('AGENCY');
              setEmail('apoorva.travels@example.com');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AGENCY' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Agency
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('DRIVER');
              setEmail('vikas.driver@redtrip.in');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'DRIVER' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Driver
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('ADMIN');
              setEmail('admin@redtrip.in');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ADMIN' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Quick Demo Credentials shortcut buttons */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
          <span className="font-bold text-slate-400 text-[10px] uppercase block">Quick One-Click Demo Sign-in:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                loginAsAgency('M/S Apoorva', 'apoorva@example.com', '9871418158');
                addToast('Signed in as M/S Apoorva Agency!', 'success');
                navigate('/agency');
              }}
              className="px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-bold rounded-lg text-[11px] transition-colors"
            >
              🏢 Sign-In as Agency (M/S Apoorva)
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsDriver('Vikas U', '+91 98123 45678', 'KA 05 AM 2969');
                addToast('Signed in as Driver Vikas U!', 'success');
                navigate('/driver');
              }}
              className="px-2.5 py-1 bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold rounded-lg text-[11px] transition-colors"
            >
              🚘 Sign-In as Driver (Vikas U)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-md active:scale-95 text-white flex items-center justify-center gap-2 ${
              activeTab === 'ADMIN'
                ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30'
                : activeTab === 'AGENCY'
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
                : activeTab === 'DRIVER'
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-amber-500/30'
                : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
            }`}
          >
            {activeTab === 'ADMIN'
              ? 'Sign In as Administrator'
              : activeTab === 'AGENCY'
              ? 'Sign In to Agency Portal'
              : activeTab === 'DRIVER'
              ? 'Sign In to Driver Portal'
              : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-red-600 hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsUser, addToast } = useBookingContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsUser(name || 'New Customer', email || 'customer@example.com', phone || '+91 99999 88888');
    addToast('Account created successfully!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Create RED TRIP Account</h2>
          <p className="text-xs text-slate-500">Register to book cars, chauffeurs, and scheduled trips.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            Create Customer Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-red-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
