import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import { BookingSummaryComponent } from '../components/booking/BookingSummary';
import type { CustomerInfo } from '../types';

export const BookingSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeBookingType,
    searchParams,
    selectedVehicle,
    selectedDriver,
    selectedTrip,
    selectedSeatsCount,
    user,
    addToast,
    resetDraft,
  } = useBookingContext();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    idProofType: 'Driving License',
    idProofNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickupLocation =
    selectedTrip?.from || searchParams.pickupLocation || 'Bangalore Central';
  const dropLocation =
    selectedTrip?.to || searchParams.dropLocation || 'Mysore Palace Gate';
  const travelDate = selectedTrip?.date || searchParams.travelDate;
  const returnDate = activeBookingType === 'SELF_DRIVE' ? searchParams.returnDate : undefined;
  const pickupTime = selectedTrip?.departureTime || searchParams.pickupTime;
  const passengers = searchParams.passengers;

  let baseFare = 0;
  let driverCharge = 0;
  let securityDeposit = 0;

  if (activeBookingType === 'WITH_DRIVER' && selectedVehicle) {
    baseFare = selectedVehicle.basePrice;
    driverCharge = 500;
  } else if (activeBookingType === 'SELF_DRIVE' && selectedVehicle) {
    baseFare = selectedVehicle.pricePerDay;
    securityDeposit = selectedVehicle.securityDeposit;
  } else if (activeBookingType === 'DRIVER_ONLY' && selectedDriver) {
    baseFare = selectedDriver.hourlyRate * searchParams.durationHours;
  } else if (activeBookingType === 'AVAILABLE_TRIP' && selectedTrip) {
    baseFare = selectedTrip.pricePerPassenger * selectedSeatsCount;
  } else {
    baseFare = 2500;
  }

  const subtotal = baseFare + driverCharge;
  const taxAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxAmount + securityDeposit;

  const handleConfirmBooking = async () => {
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.email) {
      addToast('Please complete all required customer information fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await bookingService.createBooking({
        bookingType: activeBookingType,
        customer: customerInfo,
        pickupLocation,
        dropLocation,
        travelDate,
        returnDate,
        pickupTime,
        passengers,
        vehicle: selectedVehicle || undefined,
        driver: selectedDriver || undefined,
        trip: selectedTrip || undefined,
        seatsBooked: selectedSeatsCount,
        durationHours: searchParams.durationHours,
        baseFare,
        driverCharge: driverCharge > 0 ? driverCharge : undefined,
        securityDeposit: securityDeposit > 0 ? securityDeposit : undefined,
        taxAmount,
        discount: 0,
        totalAmount,
      });

      addToast(`Booking ${created.id} confirmed successfully!`, 'success');
      resetDraft();
      navigate(`/confirmation/${created.id}`);
    } catch (err) {
      console.error(err);
      addToast('Failed to confirm booking. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BookingSummaryComponent
        bookingType={activeBookingType}
        pickupLocation={pickupLocation}
        dropLocation={dropLocation}
        travelDate={travelDate}
        returnDate={returnDate}
        pickupTime={pickupTime}
        passengers={passengers}
        vehicle={selectedVehicle}
        driver={selectedDriver}
        trip={selectedTrip}
        seatsBooked={selectedSeatsCount}
        durationHours={searchParams.durationHours}
        customerInfo={customerInfo}
        onCustomerInfoChange={setCustomerInfo}
        onBack={() => navigate(-1)}
        onConfirm={handleConfirmBooking}
        isLoading={isSubmitting}
      />
    </div>
  );
};
