import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { AvailableTrip } from '../types';
import { TripCard } from '../components/booking/TripCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Compass, Search, Filter, Sparkles } from 'lucide-react';

export const AvailableTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedTrip, setActiveBookingType } = useBookingContext();

  const [trips, setTrips] = useState<AvailableTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<'All' | 'Karnataka' | 'All India'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTrips = () => {
    setLoading(true);
    bookingService
      .getAvailableTrips({
        region: activeRegion,
        categoryTag: selectedCategory,
        query: searchQuery,
      })
      .then((data) => setTrips(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setActiveBookingType('AVAILABLE_TRIP');
    fetchTrips();
  }, [activeRegion, selectedCategory, searchQuery]);

  const handleBookSeat = (trip: AvailableTrip) => {
    setSelectedTrip(trip);
    navigate(`/trip/${trip.id}`);
  };

  const categories = [
    'All',
    'Hill Station',
    'Heritage & Culture',
    'Beach & Coastal',
    'Wildlife & Safari',
    'Adventure & Nature',
    'Spiritual',
    'Backwaters & Nature',
  ];

  const karnatakaCount = trips.filter((t) => t.region === 'Karnataka').length;
  const indiaCount = trips.filter((t) => t.region === 'All India').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Curated Travel & Tour Packages
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Trip Packages Available in <span className="text-red-500">Karnataka</span> & <span className="text-amber-400">All Over India</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Choose from all-inclusive curated tour packages—featuring dedicated vehicle, experienced chauffeur, resort stay, sight-seeing highlights, and toll inclusions.
          </p>
        </div>
      </div>

      {/* Region Tabs (All / Karnataka / All India) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveRegion('All')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shrink-0 ${
              activeRegion === 'All'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🌟 All Packages
          </button>

          <button
            onClick={() => setActiveRegion('Karnataka')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 ${
              activeRegion === 'Karnataka'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>🌴 Packages in Karnataka</span>
            <span className="bg-emerald-700/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {activeRegion === 'All' ? '6+' : karnatakaCount}
            </span>
          </button>

          <button
            onClick={() => setActiveRegion('All India')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 ${
              activeRegion === 'All India'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <span>🇮🇳 Packages All Over India</span>
            <span className="bg-indigo-700/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {activeRegion === 'All' ? '6+' : indiaCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination or package..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Package Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-red-600" />
            {activeRegion === 'All'
              ? 'Available Trip Packages'
              : activeRegion === 'Karnataka'
              ? 'Karnataka Tour Packages'
              : 'All Over India Travel Packages'}
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              ({trips.length} {trips.length === 1 ? 'Package' : 'Packages'})
            </span>
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching available trip packages..." />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No Trip Packages Found"
            message="No trip packages matching your region or category filter."
            actionText="Reset Filters"
            onAction={() => {
              setActiveRegion('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onBookSeat={handleBookSeat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
