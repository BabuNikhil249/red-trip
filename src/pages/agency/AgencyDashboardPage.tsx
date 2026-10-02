import React, { useEffect, useState } from 'react';
import { useBookingContext } from '../../context/BookingContext';
import { agencyDriverService } from '../../services/agencyDriverService';
import type { AgencyBooking, Vehicle, AvailableTrip } from '../../types';
import { DutySlipDocument } from '../../components/duty/DutySlipDocument';
import { GoogleMapViewer } from '../../components/common/GoogleMapViewer';
import {
  Building2,
  Plus,
  MapPin,
  Car,
  FileText,
  CheckCircle,
  RefreshCw,
  Zap,
  Trash2,
  KeyRound,
  CheckCircle2,
  Globe,
  Compass,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Ban,
  Navigation,
  Clock,
} from 'lucide-react';

interface DynamicPickupInput {
  location: string;
  pickupTime: string;
  passengerName: string;
  passengerPhone: string;
  flightNo?: string;
}

export const AgencyDashboardPage: React.FC = () => {
  const { user, addToast } = useBookingContext();
  const [bookings, setBookings] = useState<AgencyBooking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tripPackages, setTripPackages] = useState<AvailableTrip[]>([]);
  const [loading, setLoading] = useState(true);

  // Main Section Navigation Tabs
  const [portalTab, setPortalTab] = useState<'TRIPS' | 'VEHICLES' | 'PACKAGES'>('TRIPS');

  // Booking Modal & Filter State
  const [bookingFilterTab, setBookingFilterTab] = useState<'ALL' | 'AGENCY' | 'CUSTOMER_WEBSITE'>('ALL');
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [selectedBookingForBill, setSelectedBookingForBill] = useState<AgencyBooking | null>(null);

  // Map Toggle per Booking ID
  const [mapToggleMap, setMapToggleMap] = useState<{ [id: string]: boolean }>({});

  // Vehicle Modal State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    name: 'Toyota Innova Crysta VX',
    model: '2.4 Diesel (2024)',
    category: 'SUV' as Vehicle['category'],
    capacity: 7,
    ac: true,
    fuelType: 'Diesel' as Vehicle['fuelType'],
    transmission: 'Manual' as Vehicle['transmission'],
    pricePerDay: 3200,
    pricePerKm: 18,
    basePrice: 2800,
    securityDeposit: 5000,
    driverIncluded: true,
    isSelfDriveAvailable: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    featuresInput: 'Captain Seats, Dual AC, Push Button Start, Bluetooth Audio',
  });

  // Trip Package Modal State
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [packageForm, setPackageForm] = useState({
    title: 'Chikmagalur Coffee Estate & Waterfall Tour',
    region: 'Karnataka' as AvailableTrip['region'],
    from: 'Bangalore',
    to: 'Chikmagalur',
    date: '2026-10-15',
    departureTime: '06:30 AM',
    arrivalTime: '11:30 AM',
    estimatedDuration: '5 hrs 00 mins',
    durationDaysNights: '3 Days / 2 Nights',
    vehicleName: 'Toyota Innova Crysta',
    vehicleType: 'SUV' as Vehicle['category'],
    driverName: 'Vikas U',
    driverRating: 4.95,
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    availableSeats: 5,
    totalSeats: 7,
    pricePerPassenger: 2499,
    pickupPoint: 'Indiranagar 100ft Road / Yeshwantpur Station',
    dropPoint: 'Chikmagalur KSRTC Stand & Hill Resorts',
    routeDescription: 'Scenic hill station journey with guided coffee estate walk and jeep waterfall safari.',
    cancellationPolicy: '100% refund if cancelled 12 hours prior to journey.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    categoryTag: 'Hill Station',
    inclusionsInput: 'Luxury AC SUV, Expert Chauffeur, Resort Stay, Coffee Estate Tour, All Tolls',
    highlightsInput: 'Mullayanagiri Peak Trek, Baba Budangiri Hills, Hebbe Waterfalls Jeep Safari',
  });

  // Form State for Agency Dynamic Pickups
  const [agencyNameInput, setAgencyNameInput] = useState(user.agencyName || 'M/S Apoorva');
  const [vehicleTypeInput, setVehicleTypeInput] = useState('Innova Crysta');
  const [travelDateInput, setTravelDateInput] = useState('2026-06-14');
  const [dropLocationInput, setDropLocationInput] = useState(
    'SAIACS CEO Centre (Kyalasanahalli, Bengaluru, Karnataka 560077)'
  );
  const [dynamicPickups, setDynamicPickups] = useState<DynamicPickupInput[]>([
    {
      location: 'Bangalore Airport (Terminal 1 Gate 4 Arrival)',
      pickupTime: '05:25 PM',
      passengerName: 'Ms. Agey George',
      passengerPhone: '9871418158',
      flightNo: 'IndiGo6E - 828',
    },
    {
      location:
        "Mr. Vivek's house (No. 56, Matrukrupa, 1st Floor, 3A Cross, Amarjyothi Layout, Ashwath Nagar, Thanisandra Main Road, Near Varsha Medicals, Bengaluru, Karnataka 560077)",
      pickupTime: '06:15 PM',
      passengerName: 'Mr. Vivek',
      passengerPhone: '9845012345',
      flightNo: '',
    },
  ]);

  const loadData = async () => {
    try {
      const [bData, vData, pData] = await Promise.all([
        agencyDriverService.getAgencyBookings(),
        agencyDriverService.getAgencyVehicles(),
        agencyDriverService.getAgencyTripPackages(),
      ]);
      setBookings(bData);
      setVehicles(vData);
      setTripPackages(pData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for live updates dispatched by driver actions
    const handleUpdateEvent = () => {
      loadData();
    };

    window.addEventListener('red_trip_booking_updated', handleUpdateEvent);
    window.addEventListener('storage', handleUpdateEvent);

    return () => {
      window.removeEventListener('red_trip_booking_updated', handleUpdateEvent);
      window.removeEventListener('storage', handleUpdateEvent);
    };
  }, []);

  const toggleMap = (id: string) => {
    setMapToggleMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Dynamic Pickup Handlers ---
  const handleAddPickupField = () => {
    setDynamicPickups([
      ...dynamicPickups,
      {
        location: '',
        pickupTime: '06:30 PM',
        passengerName: '',
        passengerPhone: '',
        flightNo: '',
      },
    ]);
  };

  const handleRemovePickupField = (index: number) => {
    if (dynamicPickups.length <= 1) {
      addToast('At least 1 pickup point is required', 'info');
      return;
    }
    setDynamicPickups(dynamicPickups.filter((_, i) => i !== index));
  };

  const handlePickupFieldChange = (index: number, field: keyof DynamicPickupInput, value: string) => {
    const updated = [...dynamicPickups];
    updated[index] = { ...updated[index], [field]: value };
    setDynamicPickups(updated);
  };

  const handleFillPromptExample = () => {
    setAgencyNameInput('M/S Apoorva');
    setVehicleTypeInput('Toyota Innova Crysta');
    setTravelDateInput('2026-06-14');
    setDropLocationInput('SAIACS CEO Centre (Kyalasanahalli, Bengaluru, Karnataka 560077)');
    setDynamicPickups([
      {
        location: 'Bangalore Airport (Terminal 1 Gate 4 Arrival)',
        pickupTime: '05:25 PM',
        passengerName: 'Ms. Agey George',
        passengerPhone: '9871418158',
        flightNo: 'IndiGo6E - 828',
      },
      {
        location:
          "Mr. Vivek's house (No. 56, Matrukrupa, 1st Floor, 3A Cross, Amarjyothi Layout, Ashwath Nagar, Thanisandra Main Road, Near Varsha Medicals, Bengaluru, Karnataka 560077)",
        pickupTime: '06:15 PM',
        passengerName: 'Mr. Vivek',
        passengerPhone: '9845012345',
        flightNo: '',
      },
    ]);
    addToast('Prompt multi-pickup details loaded!', 'info');
  };

  const handleCreateTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dynamicPickups.length === 0 || !dynamicPickups[0].location) {
      addToast('Please enter at least one valid pickup point', 'error');
      return;
    }

    try {
      const created = await agencyDriverService.createAgencyBooking({
        agencyName: agencyNameInput,
        travelDate: travelDateInput,
        pickupTime: dynamicPickups[0].pickupTime || '05:25 PM',
        flightNo: dynamicPickups[0].flightNo || '',
        travelerName: dynamicPickups[0].passengerName || 'Passenger 1',
        travelerPhone: dynamicPickups[0].passengerPhone || '',
        pickupPointsInput: dynamicPickups,
        dropLocation: dropLocationInput,
        vehicleTypeRequested: vehicleTypeInput,
      });

      addToast(`Trip ${created.id} created with ${created.pickupPoints.length} OTP pickup points!`, 'success');
      setShowCreateTripModal(false);
      loadData();
    } catch (err) {
      addToast('Failed to create agency trip', 'error');
    }
  };

  // --- Add Vehicle Handler ---
  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = vehicleForm.featuresInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const added = await agencyDriverService.addAgencyVehicle({
        name: vehicleForm.name,
        model: vehicleForm.model,
        category: vehicleForm.category,
        capacity: vehicleForm.capacity,
        ac: vehicleForm.ac,
        fuelType: vehicleForm.fuelType,
        transmission: vehicleForm.transmission,
        pricePerDay: vehicleForm.pricePerDay,
        pricePerKm: vehicleForm.pricePerKm,
        basePrice: vehicleForm.basePrice,
        securityDeposit: vehicleForm.securityDeposit,
        driverIncluded: vehicleForm.driverIncluded,
        isSelfDriveAvailable: vehicleForm.isSelfDriveAvailable,
        rating: 4.9,
        reviewsCount: 15,
        image: vehicleForm.image,
        features: features.length > 0 ? features : ['AC', 'GPS', 'Bluetooth'],
        available: true,
      });

      addToast(`Vehicle "${added.name}" published! Now available on customer rental pages.`, 'success');
      setShowAddVehicleModal(false);
      loadData();
    } catch (err) {
      addToast('Failed to add vehicle', 'error');
    }
  };

  // --- Add Trip Package Handler ---
  const handleAddPackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const inclusions = packageForm.inclusionsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const highlights = packageForm.highlightsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const added = await agencyDriverService.addAgencyTripPackage({
        title: packageForm.title,
        region: packageForm.region,
        from: packageForm.from,
        to: packageForm.to,
        date: packageForm.date,
        departureTime: packageForm.departureTime,
        arrivalTime: packageForm.arrivalTime,
        estimatedDuration: packageForm.estimatedDuration,
        durationDaysNights: packageForm.durationDaysNights,
        vehicleName: packageForm.vehicleName,
        vehicleType: packageForm.vehicleType,
        driverName: packageForm.driverName,
        driverRating: packageForm.driverRating,
        driverPhoto: packageForm.driverPhoto,
        availableSeats: packageForm.availableSeats,
        totalSeats: packageForm.totalSeats,
        pricePerPassenger: packageForm.pricePerPassenger,
        pickupPoint: packageForm.pickupPoint,
        dropPoint: packageForm.dropPoint,
        routeDescription: packageForm.routeDescription,
        cancellationPolicy: packageForm.cancellationPolicy,
        status: 'Scheduled',
        image: packageForm.image,
        categoryTag: packageForm.categoryTag,
        inclusions,
        highlights,
      });

      addToast(`Trip Package "${added.title}" published! Live on customer website.`, 'success');
      setShowAddPackageModal(false);
      loadData();
    } catch (err) {
      addToast('Failed to add trip package', 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterTab === 'CUSTOMER_WEBSITE') return b.isCustomerWebsiteBooking;
    if (bookingFilterTab === 'AGENCY') return !b.isCustomerWebsiteBooking;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Agency Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block">
                  Agency Operations Control Center
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name || 'M/S Apoorva'}</h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Live Rapido/Uber-style driver tracking, Google Maps navigation, multi-pickup OTP verification, and dynamic trip status updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadData}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Portal Feature Tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl gap-1 text-xs font-bold sm:text-sm">
        <button
          onClick={() => setPortalTab('TRIPS')}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            portalTab === 'TRIPS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-red-500" /> Dynamic Pickup Trips & OTPs ({bookings.length})
        </button>

        <button
          onClick={() => setPortalTab('VEHICLES')}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            portalTab === 'VEHICLES' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Car className="w-4 h-4" /> Rental Cars (With/Without Driver) ({vehicles.length})
        </button>

        <button
          onClick={() => setPortalTab('PACKAGES')}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            portalTab === 'PACKAGES' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" /> Scheduled Trip Packages ({tripPackages.length})
        </button>
      </div>

      {/* SECTION 1: DYNAMIC PICKUP TRIPS & OTP TRACKER */}
      {portalTab === 'TRIPS' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setBookingFilterTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  bookingFilterTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                All Trips ({bookings.length})
              </button>
              <button
                onClick={() => setBookingFilterTab('AGENCY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  bookingFilterTab === 'AGENCY' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Agency Trips
              </button>
              <button
                onClick={() => setBookingFilterTab('CUSTOMER_WEBSITE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  bookingFilterTab === 'CUSTOMER_WEBSITE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                🌐 Customer Bookings
              </button>
            </div>

            <button
              onClick={() => setShowCreateTripModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create Dynamic Multi-Pickup Trip
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 font-semibold">No agency trips found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.map((booking) => {
                const pickups = booking.pickupPoints || [];
                const pickedUpCount = pickups.filter((p) => p.status === 'PickedUp').length;
                const isCancelled = booking.status === 'Cancelled';
                const showMap = mapToggleMap[booking.id] !== false; // default map expanded

                return (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-3xl border-2 shadow-xl p-6 space-y-6 transition-all ${
                      isCancelled ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-black text-white bg-slate-900 px-3 py-1 rounded-xl">
                          {booking.id}
                        </span>
                        {booking.isCustomerWebsiteBooking && (
                          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Booked via Customer Website
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-600">Reporting: {booking.agencyName}</span>

                        {/* Driver Acceptance Indicator Badge */}
                        {!isCancelled && (
                          !booking.driverAccepted ? (
                            <span className="text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Driver Acceptance ({booking.assignedDriverName || 'Vikas U'})
                            </span>
                          ) : (
                            <span className="text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Driver Accepted Order
                            </span>
                          )
                        )}

                        {booking.currentStep && !isCancelled && booking.driverAccepted && (
                          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin" /> {booking.currentStep}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {isCancelled ? (
                          <span className="text-xs font-black bg-red-100 text-red-900 border border-red-300 px-3 py-1 rounded-xl flex items-center gap-1.5">
                            <Ban className="w-4 h-4 text-red-600" /> Cancelled / Rejected by Driver
                          </span>
                        ) : (
                          <span className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            {pickedUpCount} of {pickups.length} Picked Up (OTP Verified)
                          </span>
                        )}

                        {booking.dutySlip ? (
                          <button
                            onClick={() => setSelectedBookingForBill(booking)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-black shadow-lg ring-2 ring-amber-400/40 active:scale-95"
                          >
                            <FileText className="w-4 h-4 text-amber-400" /> View & Print Bill Report (Logbook #{booking.dutySlip.logSheetNo})
                          </button>
                        ) : (
                          !isCancelled && (
                            <button
                              onClick={async () => {
                                const updated = await agencyDriverService.completeTripAndGenerateBill(booking.id);
                                addToast(
                                  'Pickups completed & Bill Report generated for Agency & Driver!',
                                  'success'
                                );
                                setSelectedBookingForBill(updated);
                                loadData();
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Complete Pickups & Bill
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Pending Driver Acceptance Banner */}
                    {!isCancelled && !booking.driverAccepted && (
                      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-amber-950 font-bold text-xs">
                          <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                          <span>
                            Trip request dispatched to Chauffeur <strong>{booking.assignedDriverName || 'Vikas U'}</strong>. Driver must accept or reject this trip order before full route navigation unlocks.
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-black bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg">
                          Live Sync Active
                        </span>
                      </div>
                    )}

                    {/* Cancelled Trip Red Banner if Cancelled */}
                    {isCancelled && (
                      <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span>Trip Cancelled Notification (Reflected Live from Driver)</span>
                        </div>
                        <p className="text-xs text-red-800 font-semibold">
                          <strong>Cancellation Reason Selected by Driver:</strong>{' '}
                          <span className="bg-red-100 text-red-950 px-2 py-0.5 rounded font-mono font-bold">
                            {booking.cancelReason || 'Customer did not arrive after wait time'}
                          </span>
                        </p>
                        {booking.cancelledAt && (
                          <span className="text-[10px] text-red-600 font-mono block">
                            Cancelled Timestamp: {booking.cancelledAt} • Updated in real-time
                          </span>
                        )}
                      </div>
                    )}

                    {/* Chauffeur Details Bar */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-amber-600" />
                        <span>Assigned Vehicle:</span>
                        <span className="text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 font-mono">
                          {booking.assignedCabNo || 'KA 05 AM 2969'}
                        </span>
                        <span className="text-slate-500 font-normal">({booking.vehicleTypeRequested})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">Chauffeur: {booking.assignedDriverName || 'Vikas U'}</span>
                        <span className="text-slate-500 font-mono">{booking.assignedDriverPhone || '+91 98123 45678'}</span>
                      </div>
                    </div>

                    {/* Google Map Viewer Section */}
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleMap(booking.id)}
                        className="w-full flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-2xl text-xs font-black transition-all shadow-md"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" /> Live Chauffeur GPS Map Navigation & Multi-Stop Route
                        </span>
                        <span className="flex items-center gap-1 text-slate-300 font-normal">
                          {showMap ? 'Hide Map' : 'Show Map'}{' '}
                          {showMap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {showMap && <GoogleMapViewer booking={booking} height="h-72" />}
                    </div>

                    {/* Sequential Pickup Points & Customer OTP Tracker */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" /> Dynamic Pickup Stops & Customer OTP Verification
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pickups.map((pt) => (
                          <div
                            key={pt.id}
                            className={`p-4 rounded-2xl border-2 space-y-2 ${
                              pt.status === 'PickedUp'
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : isCancelled
                                ? 'bg-red-50/50 border-red-200'
                                : 'bg-amber-50/40 border-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                                📍 STOP #{pt.orderNumber}
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-black bg-slate-900 text-yellow-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                  <KeyRound className="w-3.5 h-3.5 text-amber-400" /> OTP: {pt.otp}
                                </span>
                                {pt.status === 'PickedUp' ? (
                                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                    ✓ Verified ({pt.pickedUpAt})
                                  </span>
                                ) : isCancelled ? (
                                  <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-md">
                                    ❌ Cancelled
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                                    ⏳ Pending Driver OTP
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1 pt-1">
                              <p className="font-extrabold text-slate-900 text-sm">{pt.passengerName}</p>
                              <p className="text-xs font-bold text-slate-700">{pt.passengerPhone}</p>
                              <p className="text-xs text-slate-800 font-medium bg-white p-2 rounded-xl border border-slate-200">
                                {pt.location}
                              </p>
                              {pt.flightNo && (
                                <p className="text-[11px] text-blue-700 font-bold">Flight: {pt.flightNo}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex justify-between">
                        <span className="font-bold text-slate-500">Drop Location:</span>
                        <span className="font-bold text-slate-900">{booking.dropLocation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: RENTAL CARS MANAGEMENT */}
      {portalTab === 'VEHICLES' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-black text-slate-900">Rental Vehicles Directory</h2>
              <p className="text-xs text-slate-500">
                Add rental cars with driver or self-drive, set per-KM rates, daily tariff, and security deposits.
              </p>
            </div>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add New Rental Car
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex flex-col gap-1 text-right">
                      {v.driverIncluded && (
                        <span className="bg-red-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                          With Driver
                        </span>
                      )}
                      {v.isSelfDriveAvailable && (
                        <span className="bg-blue-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                          Self-Drive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block">
                        {v.category}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{v.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{v.model}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl font-bold">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Rate / KM</span>
                        <span className="text-red-600 font-black">₹{v.pricePerKm}/km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Daily Tariff</span>
                        <span className="text-slate-900 font-black">₹{v.pricePerDay}/day</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {v.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Live for Customers
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">ID: {v.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TRIP PACKAGES MANAGEMENT */}
      {portalTab === 'PACKAGES' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-black text-slate-900">Scheduled Trip Packages Directory</h2>
              <p className="text-xs text-slate-500">
                Create & publish tour packages (Coorg, Mysore, Ooty, Kashmir).
              </p>
            </div>

            <button
              onClick={() => setShowAddPackageModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add New Trip Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-900 text-yellow-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      {pkg.region}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-black text-slate-900 leading-snug">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{pkg.routeDescription}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl font-bold">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Price / Seat</span>
                        <span className="text-blue-600 font-black">₹{pkg.pricePerPassenger}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Seats Left</span>
                        <span className="text-slate-900 font-black">
                          {pkg.availableSeats} / {pkg.totalSeats}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Scheduled
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">ID: {pkg.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE DYNAMIC MULTI-PICKUP TRIP (MATCHING USER REFERENCE IMAGE) */}
      {showCreateTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  New Agency Multi-Pickup Trip Request
                </h3>
                <p className="text-xs text-slate-500">
                  Dynamically add N pickup points with passenger contact details & OTP verification
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFillPromptExample}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-black border border-red-200 flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-red-600" /> Auto-Fill Prompt Example
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTripModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTripSubmit} className="space-y-6">
              {/* Top Row Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    AGENCY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyNameInput}
                    onChange={(e) => setAgencyNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    VEHICLE REQUESTED *
                  </label>
                  <select
                    value={vehicleTypeInput}
                    onChange={(e) => setVehicleTypeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                    <option value="Kia Carens">Kia Carens</option>
                    <option value="Swift Dzire">Swift Dzire</option>
                    <option value="Force Tempo Traveller">Force Tempo Traveller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    TRAVEL DATE *
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDateInput}
                    onChange={(e) => setTravelDateInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* DYNAMIC PASSENGER PICKUP POINTS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    DYNAMIC PASSENGER PICKUP POINTS ({dynamicPickups.length} STOPS)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPickupField}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Another Stop
                  </button>
                </div>

                {dynamicPickups.map((pickup, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50/80 p-5 rounded-2xl border-2 border-slate-200 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-300 shadow-xs">
                        📍 PICKUP STOP #{idx + 1}
                      </span>
                      {dynamicPickups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePickupField(idx)}
                          className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Remove Stop
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                          PASSENGER NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ms. Agey George"
                          value={pickup.passengerName}
                          onChange={(e) => handlePickupFieldChange(idx, 'passengerName', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                          PASSENGER PHONE *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9871418158"
                          value={pickup.passengerPhone}
                          onChange={(e) => handlePickupFieldChange(idx, 'passengerPhone', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        PICKUP ADDRESS *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bangalore Airport (Terminal 1 Gate 4 Arrival)"
                        value={pickup.location}
                        onChange={(e) => handlePickupFieldChange(idx, 'location', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                          PICKUP TIME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 05:25 PM"
                          value={pickup.pickupTime}
                          onChange={(e) => handlePickupFieldChange(idx, 'pickupTime', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                          FLIGHT NO (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IndiGo6E - 828"
                          value={pickup.flightNo}
                          onChange={(e) => handlePickupFieldChange(idx, 'flightNo', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-xs text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  FINAL DROP LOCATION *
                </label>
                <textarea
                  rows={2}
                  required
                  value={dropLocationInput}
                  onChange={(e) => setDropLocationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateTripModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  Create Trip & Generate Customer OTPs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD RENTAL CAR */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Publish New Rental Car</h3>
                <p className="text-xs text-slate-500">
                  Set rental options (With/Without driver) & per-KM rate live for customers
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddVehicleModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Innova Crysta / Kia Carens"
                    value={vehicleForm.name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={vehicleForm.category}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Premium">Premium Luxury</option>
                    <option value="Tempo Traveller">Tempo Traveller</option>
                    <option value="Bus">Bus Coach</option>
                  </select>
                </div>
              </div>

              {/* Rental Options & Per-KM Pricing */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
                <span className="text-xs font-black text-amber-900 uppercase block">
                  Rental Options & Pricing Rates
                </span>

                <div className="flex gap-4 text-xs font-bold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicleForm.driverIncluded}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, driverIncluded: e.target.checked })}
                      className="w-4 h-4 rounded text-red-600"
                    />
                    Available WITH Driver
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicleForm.isSelfDriveAvailable}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, isSelfDriveAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    Available WITHOUT Driver (Self-Drive)
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Rate per KM (₹) *</label>
                    <input
                      type="number"
                      required
                      value={vehicleForm.pricePerKm}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, pricePerKm: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Daily Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={vehicleForm.pricePerDay}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, pricePerDay: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Base Fare (₹)</label>
                    <input
                      type="number"
                      value={vehicleForm.basePrice}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, basePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Deposit (₹)</label>
                    <input
                      type="number"
                      value={vehicleForm.securityDeposit}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, securityDeposit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={vehicleForm.featuresInput}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, featuresInput: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm">
                  Publish Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD TRIP PACKAGE */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Publish New Scheduled Trip Package</h3>
                <p className="text-xs text-slate-500">Launch tour packages live on the customer website</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPackageModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddPackageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={packageForm.title}
                  onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">From *</label>
                  <input
                    type="text"
                    required
                    value={packageForm.from}
                    onChange={(e) => setPackageForm({ ...packageForm, from: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">To Destination *</label>
                  <input
                    type="text"
                    required
                    value={packageForm.to}
                    onChange={(e) => setPackageForm({ ...packageForm, to: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price / Seat (₹) *</label>
                  <input
                    type="number"
                    required
                    value={packageForm.pricePerPassenger}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, pricePerPassenger: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm">
                  Publish Trip Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW BILL REPORT DOCUMENT MODAL */}
      {selectedBookingForBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <DutySlipDocument
              booking={selectedBookingForBill}
              onClose={() => setSelectedBookingForBill(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
