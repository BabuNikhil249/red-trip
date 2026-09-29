import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
          About RED TRIP
        </span>
        <h1 className="text-4xl font-black text-slate-900">
          Redefining Intercity & Local Travel across India
        </h1>
        <p className="text-slate-600 leading-relaxed text-base">
          RED TRIP is built to empower travelers with complete choice: whether you need a luxury SUV with a verified chauffeur, a self-drive car for a weekend roadtrip, a professional driver for your personal vehicle, or a scheduled seat on popular intercity routes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-red-600 block">50,000+</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Completed Trips
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-slate-900 block">1,200+</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Verified Vehicles
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-red-600 block">800+</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Senior Chauffeurs
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-slate-900 block">4.9 ★</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Customer Rating
          </span>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Contact RED TRIP Support</h1>
        <p className="text-sm text-slate-600">Our 24/7 travel desk team is ready to assist you.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone / Email
            </label>
            <input
              type="text"
              placeholder="Contact details"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Message / Inquiry
            </label>
            <textarea
              rows={4}
              placeholder="How can we help you?"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            ></textarea>
          </div>
        </div>

        <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20">
          Send Message
        </button>
      </div>
    </div>
  );
};
