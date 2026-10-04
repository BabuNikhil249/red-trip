import React, { useState } from 'react';
import type { BookingType, Vehicle, Driver, AvailableTrip, CustomerInfo } from '../../types';
import { PriceBreakdown } from './PriceBreakdown';
import {
  MapPin,
  User,
  Phone,
  Mail,
  Shield,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface BookingSummaryProps {
  bookingType: BookingType;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  returnDate?: string;
  pickupTime: string;
  passengers: number;
  vehicle?: Vehicle | null;
  driver?: Driver | null;
  trip?: AvailableTrip | null;
  seatsBooked?: number;
  durationHours?: number;
  durationDays?: number;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const BookingSummaryComponent: React.FC<BookingSummaryProps> = ({
  bookingType,
  pickupLocation,
  dropLocation,
  travelDate,
  returnDate,
  pickupTime,
  passengers,
  vehicle,
  driver,
  trip,
  seatsBooked = 1,
  durationHours: _durationHours,
  durationDays = 1,
  customerInfo,
  onCustomerInfoChange,
  onBack,
  onConfirm,
  isLoading = false,
}) => {
  const [discountAmount, setDiscountAmount] = useState(0);

  let baseFare = 0;
  let driverCharge = 0;
  let securityDeposit = 0;
  let breakdownDetails: { days: number; dayRate: number; km: number; kmRate: number; driverBattaPerDay?: number } | undefined;

  const actualDays = Math.max(1, durationDays || 1);
  const actualKm = 150; // default or passed

  if (bookingType === 'WITH_DRIVER' && vehicle) {
    const dayCost = (vehicle.pricePerDay || 2500) * actualDays;
    const kmCost = (vehicle.pricePerKm || 16) * actualKm;
    baseFare = dayCost + kmCost;
    driverCharge = 500 * actualDays;
    breakdownDetails = {
      days: actualDays,
      dayRate: vehicle.pricePerDay || 2500,
      km: actualKm,
      kmRate: vehicle.pricePerKm || 16,
      driverBattaPerDay: 500,
    };
  } else if (bookingType === 'SELF_DRIVE' && vehicle) {
    const dayCost = (vehicle.pricePerDay || 2500) * actualDays;
    const kmCost = (vehicle.pricePerKm || 16) * actualKm;
    baseFare = dayCost + kmCost;
    securityDeposit = vehicle.securityDeposit;
    breakdownDetails = {
      days: actualDays,
      dayRate: vehicle.pricePerDay || 2500,
      km: actualKm,
      kmRate: vehicle.pricePerKm || 16,
    };
  } else if (bookingType === 'DRIVER_ONLY' && driver) {
    baseFare = (driver.dailyRate || 1200) * actualDays + (actualKm * 2);
    breakdownDetails = {
      days: actualDays,
      dayRate: driver.dailyRate || 1200,
      km: actualKm,
      kmRate: 2,
    };
  } else if (bookingType === 'AVAILABLE_TRIP' && trip) {
    baseFare = trip.pricePerPassenger * seatsBooked;
  }

  const subtotal = Math.max(0, baseFare + driverCharge - discountAmount);
  const taxAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxAmount + securityDeposit;

  const agencyName = vehicle?.agencyName || driver?.agencyName || trip?.agencyName || 'M/S Apoorva Travels';

  const getBookingTypeLabel = () => {
    switch (bookingType) {
      case 'WITH_DRIVER':
        return 'Vehicle + Chauffeur Rental (KM + Day Rate)';
      case 'SELF_DRIVE':
        return 'Self-Drive Vehicle Rental (KM + Day Rate)';
      case 'DRIVER_ONLY':
        return 'Driver Only On-Demand Service (KM + Day Rate)';
      case 'AVAILABLE_TRIP':
        return 'Tour Package Reservation';
    }
  };

  return (
    <div className="space-y-8">
      {/* 4-STEP PROGRESS STEPPER */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              ✓
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Step 1</span>
              <span className="text-xs font-bold text-slate-900">Choose Service</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-red-600/30 ring-4 ring-red-100">
              2
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">Step 2 (Active)</span>
              <span className="text-xs font-bold text-slate-900">Passenger & Travel</span>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Step 3</span>
              <span className="text-xs font-bold text-slate-900">Review & Promo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Step 4</span>
              <span className="text-xs font-bold text-slate-900">Instant Ticket</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 md:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Review & Passenger Details
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{getBookingTypeLabel()}</h2>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Change Selection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Itinerary & Customer Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Agency Banner Badge */}
            <div className="flex items-center gap-3 bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                  Certified Operating Agency
                </span>
                <h4 className="text-base font-black text-white">{agencyName}</h4>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" /> Journey Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <span className="text-slate-400 font-bold text-[11px] uppercase block">Pickup Location</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{pickupLocation}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold text-[11px] uppercase block">Drop / Destination</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{dropLocation}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold text-[11px] uppercase block">Date & Scheduled Time</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {travelDate} at {pickupTime}
                  </span>
                  {returnDate && (
                    <span className="text-xs text-blue-700 font-bold block mt-0.5">Return: {returnDate}</span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 font-bold text-[11px] uppercase block">Capacity</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {bookingType === 'AVAILABLE_TRIP'
                      ? `${seatsBooked} Seat(s) Reserved`
                      : `${passengers} Passengers`}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold text-[11px] uppercase block">Tariff Calculation Basis</span>
                  <span className="font-bold text-red-600 block mt-0.5">
                    {actualDays} {actualDays === 1 ? 'Day' : 'Days'} • {actualKm} KM Est.
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Vehicle Card */}
            {vehicle && (
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-24 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-wider block">
                    Selected Vehicle
                  </span>
                  <h4 className="text-base font-black text-slate-900 truncate">{vehicle.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {vehicle.category} • {vehicle.capacity} Seats • {vehicle.ac ? 'AC' : 'Non-AC'} • ₹{vehicle.pricePerDay.toLocaleString()}/day • ₹{vehicle.pricePerKm}/km
                  </p>
                </div>
              </div>
            )}

            {/* Selected Driver Card */}
            {driver && (
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-wider block">
                    Assigned Chauffeur
                  </span>
                  <h4 className="text-base font-black text-slate-900 truncate">{driver.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {driver.experienceYears} Years Exp • ⭐ {driver.rating} ({driver.completedTrips} Trips) • ₹{driver.dailyRate}/day
                  </p>
                </div>
              </div>
            )}

            {/* Passenger Information Form */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" /> Passenger Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        onCustomerInfoChange({ ...customerInfo, fullName: e.target.value })
                      }
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) =>
                        onCustomerInfoChange({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) =>
                        onCustomerInfoChange({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {bookingType === 'SELF_DRIVE' && (
                  <div className="sm:col-span-2 bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-amber-600" /> Driving License Verification
                    </div>
                    <p className="text-xs text-amber-800">
                      Original driving license must be presented physically at the time of vehicle handover.
                    </p>
                    <input
                      type="text"
                      placeholder="Enter Driving License Number (e.g. KA01-20220098412)"
                      value={customerInfo.idProofNumber || ''}
                      onChange={(e) =>
                        onCustomerInfoChange({
                          ...customerInfo,
                          idProofType: 'Driving License',
                          idProofNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Price Breakdown & Instant Confirm */}
          <div className="lg:col-span-5 space-y-6">
            <PriceBreakdown
              baseFare={baseFare}
              driverCharge={driverCharge}
              securityDeposit={securityDeposit}
              taxAmount={taxAmount}
              discount={discountAmount}
              totalAmount={totalAmount}
              isSelfDrive={bookingType === 'SELF_DRIVE'}
              breakdownDetails={breakdownDetails}
              onApplyCoupon={(_code, disc) => setDiscountAmount(disc)}
            />

            <button
              onClick={onConfirm}
              disabled={isLoading || !customerInfo.fullName || !customerInfo.phone}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <Lock className="w-5 h-5" />
              <span>{isLoading ? 'Confirming Reservation...' : 'Confirm & Generate Ticket'}</span>
            </button>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Free Cancellation Protection</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Instant full refund if cancelled up to 6 hours prior to journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
