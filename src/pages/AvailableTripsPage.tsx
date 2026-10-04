import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import type { AvailableTrip } from '../types';
import { TripCard } from '../components/booking/TripCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Filter, Sparkles } from 'lucide-react';

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
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden border border-slate-200/90">
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-15 hidden md:block pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80')`,
          }}
        ></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-widest border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Curated Travel & Tour Packages
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Tour Packages in <span className="text-red-600">Karnataka</span> & <span className="text-purple-600">All India</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            All-inclusive holiday packages featuring dedicated luxury vehicle, certified chauffeur, resort stays, guided sightseeing, and all highway tolls included.
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
            placeholder="Search destination, e.g. Coorg, Ooty, Hampi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            Available Tour Packages ({trips.length})
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Instant booking & customizable itineraries
          </span>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching holiday packages..." />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No Tour Packages Found"
            message="Try adjusting your region or category filter to discover other journeys."
            actionText="Show All Packages"
            onAction={() => {
              setActiveRegion('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onBookSeat={handleBookSeat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
