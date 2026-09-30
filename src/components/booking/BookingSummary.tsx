import React from 'react';
import type { BookingType, Vehicle, Driver, AvailableTrip, CustomerInfo } from '../../types';
import { PriceBreakdown } from './PriceBreakdown';
import { MapPin, User, Phone, Mail, Shield, ArrowLeft, Building2 } from 'lucide-react';

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
  durationHours,
  durationDays = 1,
  customerInfo,
  onCustomerInfoChange,
  onBack,
  onConfirm,
  isLoading = false,
}) => {
  let baseFare = 0;
  let driverCharge = 0;
  let securityDeposit = 0;

  if (bookingType === 'WITH_DRIVER' && vehicle) {
    baseFare = vehicle.basePrice;
    driverCharge = 500;
  } else if (bookingType === 'SELF_DRIVE' && vehicle) {
    baseFare = vehicle.pricePerDay * (durationDays || 1);
    securityDeposit = vehicle.securityDeposit;
  } else if (bookingType === 'DRIVER_ONLY' && driver) {
    baseFare = driver.hourlyRate * (durationHours || 8);
  } else if (bookingType === 'AVAILABLE_TRIP' && trip) {
    baseFare = trip.pricePerPassenger * seatsBooked;
  }

  const subtotal = baseFare + driverCharge;
  const taxAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxAmount + securityDeposit;

  const agencyName = vehicle?.agencyName || driver?.agencyName || trip?.agencyName || 'M/S Apoorva Travels';

  const getBookingTypeLabel = () => {
    switch (bookingType) {
      case 'WITH_DRIVER':
        return 'Vehicle + Chauffeur Rental';
      case 'SELF_DRIVE':
        return 'Self Drive Vehicle Rental';
      case 'DRIVER_ONLY':
        return 'Driver Only Service';
      case 'AVAILABLE_TRIP':
        return 'Scheduled Seat Booking';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
            Review Booking
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">{getBookingTypeLabel()}</h2>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Change Selection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary & Customer Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agency Banner Badge */}
          <div className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                Operating Travel Agency
              </span>
              <h4 className="text-base font-black text-white">{agencyName}</h4>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" /> Travel Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
              <div>
                <span className="text-slate-400 font-medium block">Pickup Location</span>
                <span className="font-bold text-slate-900 block mt-0.5">{pickupLocation}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Drop / Destination</span>
                <span className="font-bold text-slate-900 block mt-0.5">{dropLocation}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Date & Time</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {travelDate} at {pickupTime}
                </span>
                {returnDate && (
                  <span className="text-xs text-slate-500 block">Return: {returnDate}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Capacity / Seats</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {bookingType === 'AVAILABLE_TRIP'
                    ? `${seatsBooked} Seat(s)`
                    : `${passengers} Passengers`}
                </span>
              </div>
            </div>
          </div>

          {vehicle && (
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-24 h-16 rounded-xl object-cover border"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  Selected Vehicle
                </span>
                <h4 className="text-base font-bold text-slate-900 truncate">{vehicle.name}</h4>
                <p className="text-xs text-slate-500">
                  {vehicle.category} • {vehicle.capacity} Seats • {vehicle.ac ? 'AC' : 'Non-AC'}
                </p>
              </div>
            </div>
          )}

          {driver && (
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <img
                src={driver.photo}
                alt={driver.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-red-500"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  Assigned Chauffeur
                </span>
                <h4 className="text-base font-bold text-slate-900 truncate">{driver.name}</h4>
                <p className="text-xs text-slate-500">
                  {driver.experienceYears} Years Exp • ⭐ {driver.rating} ({driver.completedTrips} Trips)
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-red-600" /> Customer Information
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
                    placeholder="Enter your full name"
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
                <div className="sm:col-span-2 bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-amber-600" /> Driving License Required Notice
                  </div>
                  <p className="text-xs text-amber-800">
                    Valid original driving license and Aadhaar/Government ID must be presented physically at the time of vehicle handover.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      placeholder="Driving License Number"
                      value={customerInfo.idProofNumber || ''}
                      onChange={(e) =>
                        onCustomerInfoChange({
                          ...customerInfo,
                          idProofType: 'Driving License',
                          idProofNumber: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <PriceBreakdown
            baseFare={baseFare}
            driverCharge={driverCharge}
            securityDeposit={securityDeposit}
            taxAmount={taxAmount}
            totalAmount={totalAmount}
            isSelfDrive={bookingType === 'SELF_DRIVE'}
          />

          <button
            onClick={onConfirm}
            disabled={isLoading || !customerInfo.fullName || !customerInfo.phone}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isLoading ? 'Processing Booking...' : 'Confirm Booking'}
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-normal">
            By confirming, you agree to RED TRIP's Terms of Service and Cancellation Policies. Instant confirmation ticket will be generated.
          </p>
        </div>
      </div>
    </div>
  );
};
