import React, { useState, useEffect } from 'react';
import type { AgencyBooking } from '../../types';
import {
  Car,
  Compass,
  CheckCircle2,
  ExternalLink,
  Play,
  Pause,
} from 'lucide-react';

interface GoogleMapViewerProps {
  booking: AgencyBooking;
  height?: string;
  showDriverControls?: boolean;
  onUpdateStep?: (step: string) => void;
}

export const GoogleMapViewer: React.FC<GoogleMapViewerProps> = ({
  booking,
  height = 'h-96',
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const pickups = booking.pickupPoints || [];
  const pickedUpCount = pickups.filter((p) => p.status === 'PickedUp').length;
  const pendingPickup = pickups.find((p) => p.status === 'Pending');
  const allPickedUp = pickups.length > 0 && pickups.every((p) => p.status === 'PickedUp');
  const isCompleted =
    booking.status === 'Completed' || booking.status === 'Duty Slip Updated' || !!booking.dutySlip;
  const isCancelled = booking.status === 'Cancelled';

  // Calculate Dynamic Base Progress %
  const calculateBaseProgress = () => {
    if (isCancelled) return 0;
    if (isCompleted) return 100;
    if (booking.currentStep?.includes('Arrived at Final Drop')) return 96;
    if (booking.currentStep?.includes('Driving to Drop') || booking.currentStep?.includes('In Transit to Drop')) return 88;
    if (allPickedUp) return 82;
    if (pickups.length > 0) {
      const ratio = pickedUpCount / pickups.length;
      return Math.min(78, Math.max(15, Math.floor(15 + ratio * 60)));
    }
    return 35;
  };

  const [driverProgress, setDriverProgress] = useState(calculateBaseProgress());
  const [currentSpeed, setCurrentSpeed] = useState(isCompleted || isCancelled ? 0 : 42);

  // Sync progress dynamically whenever booking updates from driver
  useEffect(() => {
    if (!isSimulating) {
      setDriverProgress(calculateBaseProgress());
      setCurrentSpeed(isCompleted || isCancelled ? 0 : 38 + Math.floor(Math.random() * 10));
    }
  }, [booking.status, booking.currentStep, pickedUpCount, isCompleted, isCancelled]);

  // Simulation timer
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setDriverProgress((prev) => {
          if (prev >= 98) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 2;
        });
        setCurrentSpeed(Math.floor(35 + Math.random() * 20));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Construct Google Maps Embed Query
  const firstPickupLoc = pickups[0]?.location || 'Bangalore Airport';
  const dropLoc = booking.dropLocation || 'Bengaluru';

  const openGoogleMapsExternal = () => {
    const origin = encodeURIComponent(firstPickupLoc);
    const destination = encodeURIComponent(dropLoc);
    const waypoints = pickups.slice(1).map((p) => encodeURIComponent(p.location)).join('|');
    const mapsUrl = waypoints
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`
      : `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  };

  // Dynamic Telemetry Calculations
  let telemetryStatusText = 'In Transit';
  let telemetryEtaText = '12 Mins (4.5 km)';
  let telemetryNextStopText = 'Final Drop Off';

  if (isCancelled) {
    telemetryStatusText = '⚠️ Trip Cancelled by Chauffeur';
    telemetryEtaText = 'Cancelled';
    telemetryNextStopText = 'Trip Cancelled';
  } else if (isCompleted) {
    telemetryStatusText = '✓ Journey Completed & Bill Generated';
    telemetryEtaText = 'Arrived at Destination';
    telemetryNextStopText = 'Destination Reached 🎉';
  } else if (pendingPickup) {
    telemetryStatusText = booking.currentStep || `En Route to Pickup Stop #${pendingPickup.orderNumber}`;
    telemetryEtaText = `${pendingPickup.orderNumber * 8} Mins (${(pendingPickup.orderNumber * 3.8).toFixed(1)} km)`;
    telemetryNextStopText = `Stop #${pendingPickup.orderNumber} (${pendingPickup.passengerName.split(' ')[0]})`;
  } else if (allPickedUp) {
    telemetryStatusText = booking.currentStep || 'All Customers Picked Up — Driving to Drop';
    telemetryEtaText = '8 Mins (3.2 km)';
    telemetryNextStopText = `Final Drop Off (${booking.dropLocation.slice(0, 18)}...)`;
  }

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-0">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Car className="w-5 h-5" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                {booking.assignedCabNo || 'KA 05 AM 2969'}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                {booking.vehicleTypeRequested || 'Toyota Innova Crysta'}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-300">
              Chauffeur: {booking.assignedDriverName || 'Vikas U'} ({booking.assignedDriverPhone || '+91 98123 45678'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'Pause GPS Simulation' : 'Simulate Driver GPS Live'}
          </button>

          <button
            onClick={openGoogleMapsExternal}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Google Maps
          </button>
        </div>
      </div>

      {/* Main Interactive Visual Map Canvas */}
      <div className={`relative ${height} bg-slate-950 overflow-hidden`}>
        {/* Styled Simulated Leaflet / Google Map Visual Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 opacity-95">
          {/* Grid lines overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Animated Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {/* Base route path */}
            <path
              d="M 60 120 C 180 60, 320 220, 480 140 C 600 80, 720 240, 880 160"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="6"
              strokeDasharray="8 6"
              className="animate-pulse opacity-90"
            />

            {/* Completed Path */}
            <path
              d="M 60 120 C 180 60, 320 220, 480 140 C 600 80, 720 240, 880 160"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeDasharray={`${driverProgress * 8} 1000`}
            />
          </svg>

          {/* Stop Markers on Visual Canvas */}
          {/* Pickup Stop 1 Marker */}
          <div className="absolute top-[100px] left-[50px] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
            <div
              className={`p-2 rounded-2xl border-2 flex items-center gap-2 shadow-xl backdrop-blur-md transition-all ${
                pickups[0]?.status === 'PickedUp'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950/90 border-amber-500 text-amber-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                  pickups[0]?.status === 'PickedUp' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                }`}
              >
                📍 1
              </div>
              <div className="pr-2 text-left">
                <p className="text-[11px] font-black leading-none">{pickups[0]?.passengerName || 'Stop #1'}</p>
                <p className="text-[9px] text-slate-300 font-mono mt-0.5 truncate max-w-[140px]">
                  {pickups[0]?.location || 'Airport'}
                </p>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1 inline-block ${
                    pickups[0]?.status === 'PickedUp' ? 'bg-emerald-800 text-emerald-100' : 'bg-amber-800 text-amber-100'
                  }`}
                >
                  {pickups[0]?.status === 'PickedUp' ? '✓ Picked Up' : '⏳ Pending OTP'}
                </span>
              </div>
            </div>
          </div>

          {/* Pickup Stop 2 Marker (If exists) */}
          {pickups.length > 1 && (
            <div className="absolute top-[150px] left-[460px] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
              <div
                className={`p-2 rounded-2xl border-2 flex items-center gap-2 shadow-xl backdrop-blur-md transition-all ${
                  pickups[1]?.status === 'PickedUp'
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                    : 'bg-amber-950/90 border-amber-500 text-amber-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    pickups[1]?.status === 'PickedUp' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  📍 2
                </div>
                <div className="pr-2 text-left">
                  <p className="text-[11px] font-black leading-none">{pickups[1]?.passengerName || 'Stop #2'}</p>
                  <p className="text-[9px] text-slate-300 font-mono mt-0.5 truncate max-w-[140px]">
                    {pickups[1]?.location || 'Thanisandra'}
                  </p>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1 inline-block ${
                      pickups[1]?.status === 'PickedUp' ? 'bg-emerald-800 text-emerald-100' : 'bg-amber-800 text-amber-100'
                    }`}
                  >
                    {pickups[1]?.status === 'PickedUp' ? '✓ Picked Up' : '⏳ Pending OTP'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Final Drop Off Marker */}
          <div className="absolute top-[140px] left-[840px] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
            <div
              className={`p-2 rounded-2xl border-2 flex items-center gap-2 shadow-xl backdrop-blur-md transition-all ${
                isCompleted
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/90 border-red-500 text-red-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                  isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'
                }`}
              >
                🏁
              </div>
              <div className="pr-2 text-left">
                <p className="text-[11px] font-black leading-none">Drop Location</p>
                <p className="text-[9px] text-slate-300 font-mono mt-0.5 truncate max-w-[150px]">
                  {booking.dropLocation}
                </p>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1 inline-block ${
                    isCompleted ? 'bg-emerald-800 text-emerald-100' : 'bg-red-800 text-red-100'
                  }`}
                >
                  {isCompleted ? '✓ Reached & Billed' : 'Destination Drop'}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Animated Driver Car Marker */}
          <div
            className="absolute transition-all duration-700 ease-out transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${Math.min(860, 50 + (driverProgress / 100) * 790)}px`,
              top: `${120 + Math.sin(driverProgress / 15) * 40}px`,
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Driver Badge Overlay */}
              <div className="bg-slate-900/90 text-amber-400 border border-amber-500/60 px-2 py-0.5 rounded-lg text-[10px] font-mono font-black shadow-lg mb-1 whitespace-nowrap flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-400 animate-ping'}`} />
                <span>{booking.assignedCabNo || 'KA 05 AM 2969'}</span> • {currentSpeed} km/h
              </div>
              {/* Car Icon Circle */}
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-2xl ring-4 ring-amber-400/40">
                <Car className="w-6 h-6 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Dynamic Telemetry Box */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-4 z-30 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Compass className={`w-5 h-5 ${isCompleted ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Driver Status</span>
                <p className="text-xs font-black text-amber-400">{telemetryStatusText}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] block font-sans uppercase font-extrabold">Estimated ETA</span>
              <span className={isCompleted ? 'text-emerald-400 font-sans' : 'text-emerald-400'}>{telemetryEtaText}</span>
            </div>

            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] block font-sans uppercase font-extrabold">Next Stop</span>
              <span className="text-amber-300">{telemetryNextStopText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Route Timeline Footer */}
      <div className="bg-slate-950 p-4 border-t border-slate-800">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Rapido / Uber Style Multi-Stop Pickup Progress ({pickups.length} Stops)</span>
          <span className="text-amber-400">Travel Date: {booking.travelDate}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {pickups.map((p, idx) => (
            <React.Fragment key={p.id}>
              <div
                className={`p-3 rounded-2xl border shrink-0 text-left min-w-[200px] transition-all ${
                  p.status === 'PickedUp'
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                    Stop #{p.orderNumber}
                  </span>
                  {p.status === 'PickedUp' ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {p.pickedUpAt || 'Picked Up'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400 font-bold">OTP: {p.otp}</span>
                  )}
                </div>
                <p className="text-xs font-black text-white truncate">{p.passengerName}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.location}</p>
              </div>

              {idx < pickups.length - 1 && (
                <div className="text-slate-600 font-black text-sm shrink-0">➔</div>
              )}
            </React.Fragment>
          ))}

          <div className="text-slate-600 font-black text-sm shrink-0">➔</div>

          {/* Drop Location */}
          <div
            className={`p-3 rounded-2xl border shrink-0 text-left min-w-[180px] ${
              isCompleted
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                : 'bg-red-950/30 border-red-500/40 text-red-200'
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded block w-max mb-1 ${
                isCompleted ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
              }`}
            >
              {isCompleted ? '✓ Reached Drop' : 'Final Drop'}
            </span>
            <p className="text-xs font-black text-white truncate">Destination Drop</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{booking.dropLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
