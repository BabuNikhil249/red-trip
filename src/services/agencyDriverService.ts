import type {
  AgencyBooking,
  DutySlipData,
  PickupPoint,
  Vehicle,
  AvailableTrip,
  Driver,
  ServiceType,
  Passenger,
  BookingStatus,
  AppNotification,
  DriverOnlineStatus,
  DriverWorkStatus,
} from '../types';
import {
  INITIAL_AGENCY_BOOKINGS,
  INITIAL_VEHICLES,
  INITIAL_AVAILABLE_TRIPS,
  INITIAL_DRIVERS,
} from '../data/mockData';

const AGENCY_BOOKINGS_KEY = 'red_trip_agency_bookings_v6';
const VEHICLES_KEY = 'red_trip_vehicles_v2';
const TRIPS_KEY = 'red_trip_trips_v2';
const DRIVERS_KEY = 'red_trip_drivers_v1';
const NOTIFICATIONS_KEY = 'red_trip_notifications_v1';

const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error(`Failed to load ${key}`, err);
  }
  return fallback;
};

const saveStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('red_trip_booking_updated'));
    }
  } catch (err) {
    console.error(`Failed to save ${key}`, err);
  }
};

const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const agencyDriverService = {
  // Get all agency bookings
  async getAgencyBookings(): Promise<AgencyBooking[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
  },

  // Get single booking by ID
  async getAgencyBookingById(id: string): Promise<AgencyBooking | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    return list.find((b) => b.id === id);
  },

  // Get Drivers Directory
  async getDrivers(): Promise<Driver[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
  },

  // Update Driver Online/Work Status
  async updateDriverStatus(
    driverId: string,
    onlineStatus: DriverOnlineStatus,
    workStatus: DriverWorkStatus
  ): Promise<Driver> {
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    const idx = drivers.findIndex((d) => d.id === driverId);
    if (idx === -1) throw new Error(`Driver ${driverId} not found`);

    drivers[idx] = {
      ...drivers[idx],
      onlineStatus,
      workStatus,
      available: onlineStatus === 'ONLINE' && workStatus === 'AVAILABLE',
    };

    saveStorage(DRIVERS_KEY, drivers);
    return drivers[idx];
  },

  // Get Notifications
  async getNotifications(recipientRole?: string, recipientId?: string): Promise<AppNotification[]> {
    const list = loadStorage<AppNotification[]>(NOTIFICATIONS_KEY, [
      {
        id: 'n-1',
        recipientRole: 'AGENCY',
        recipientId: 'ag-101',
        title: 'Booking Created',
        message: 'New trip AG-74520 created for passenger Ms. Agey George.',
        bookingId: 'AG-74520',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'INFO',
        read: false,
      },
      {
        id: 'n-2',
        recipientRole: 'DRIVER',
        recipientId: 'd-driver-vikas',
        title: 'Trip Request Dispatched',
        message: 'You have a new trip request AG-74520 from M/S Apoorva.',
        bookingId: 'AG-74520',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'INFO',
        read: false,
      },
    ]);

    if (!recipientRole) return list;
    return list.filter((n) => n.recipientRole === recipientRole && (!recipientId || n.recipientId === recipientId));
  },

  // Add Notification
  async addNotification(payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): Promise<AppNotification> {
    const list = loadStorage<AppNotification[]>(NOTIFICATIONS_KEY, []);
    const newNotif: AppNotification = {
      ...payload,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    const updated = [newNotif, ...list];
    saveStorage(NOTIFICATIONS_KEY, updated);
    return newNotif;
  },

  // Mark notification read
  async markNotificationRead(id: string): Promise<void> {
    const list = loadStorage<AppNotification[]>(NOTIFICATIONS_KEY, []);
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx].read = true;
      saveStorage(NOTIFICATIONS_KEY, list);
    }
  },

  // DYNAMIC DRIVER MATCHING ALGORITHM
  async findNextEligibleDriver(booking: AgencyBooking): Promise<Driver | null> {
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    const attempted = booking.attemptedDriverIds || [];

    // Filter available drivers (ONLINE + AVAILABLE + not attempted)
    const eligible = drivers.filter((d) => {
      if (d.onlineStatus !== 'ONLINE' || d.workStatus !== 'AVAILABLE') return false;
      if (attempted.includes(d.id)) return false;
      return true;
    });

    if (eligible.length === 0) return null;

    // Pick first/nearest driver
    return eligible[0];
  },

  // Create new booking by Travelling Agency with dynamic driver matching & passenger details
  async createAgencyBooking(payload: {
    agencyId?: string;
    agencyName: string;
    serviceType?: ServiceType;
    passenger: Passenger;
    travelDate: string;
    pickupTime: string;
    flightNo?: string;
    pickupPointsInput: {
      location: string;
      locationUrl?: string;
      pickupTime: string;
      passengerName: string;
      passengerPhone: string;
      flightNo?: string;
    }[];
    dropLocation: string;
    vehicleTypeRequested: string;
    vehicleNumber?: string;
    vehicleModel?: string;
    vehicleColor?: string;
    driverName?: string;
    driverPhone?: string;
    driverLicense?: string;
    notes?: string;
    bookedTripId?: string;
  }): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const serviceType = payload.serviceType || 'VEHICLE_AND_DRIVER';

    const pickupPoints: PickupPoint[] = payload.pickupPointsInput.map((p, idx) => ({
      id: `pk-${Date.now()}-${idx + 1}`,
      orderNumber: idx + 1,
      location: p.location,
      locationUrl: p.locationUrl || '',
      pickupTime: p.pickupTime || payload.pickupTime,
      passengerName: p.passengerName || payload.passenger.fullName,
      passengerPhone: p.passengerPhone || payload.passenger.phone,
      flightNo: p.flightNo || payload.flightNo || '',
      otp: generateOtp(),
      status: 'Pending',
    }));

    let initialStatus: BookingStatus = 'SEARCHING_DRIVER';
    let assignedCabNo = undefined;
    let assignedDriverId = undefined;
    let assignedDriverName = undefined;
    let assignedDriverPhone = undefined;
    let currentMatchingDriverId = undefined;
    let driverRequestExpiresAt = undefined;

    if (serviceType === 'VEHICLE_ONLY') {
      initialStatus = 'Assigned';
      assignedCabNo = 'KA 05 AM 2969';
    } else if (serviceType === 'AVAILABLE_TRIP') {
      initialStatus = 'Assigned';
      assignedCabNo = 'KA 09 AB 1234';
      assignedDriverName = 'Ramesh Gowda';
      assignedDriverPhone = '+91 98765 43210';
    } else {
      // Find nearest eligible driver
      const targetDriver = drivers.find((d) => d.onlineStatus === 'ONLINE' && d.workStatus === 'AVAILABLE') || drivers[0];
      if (targetDriver) {
        currentMatchingDriverId = targetDriver.id;
        driverRequestExpiresAt = Date.now() + 30000; // 30 seconds countdown timer
        initialStatus = 'SEARCHING_DRIVER';
      } else {
        initialStatus = 'NO_DRIVER_AVAILABLE';
      }
    }

    const newBooking: AgencyBooking = {
      id: `AG-${randomNum}`,
      agencyId: payload.agencyId || 'ag-101',
      agencyName: payload.agencyName || 'M/S Apoorva',
      serviceType,
      passenger: payload.passenger,
      travelDate: payload.travelDate,
      pickupTime: payload.pickupTime,
      flightNo: payload.flightNo || '',
      travelerName: payload.passenger.fullName,
      travelerPhone: payload.passenger.phone,
      pickupPoints,
      pickup1: pickupPoints[0]?.location || '',
      pickup2: pickupPoints[1]?.location || '',
      dropLocation: payload.dropLocation,
      vehicleTypeRequested: payload.vehicleTypeRequested,
      assignedCabNo: payload.vehicleNumber || assignedCabNo || 'KA 05 AM 2969',
      assignedDriverId,
      assignedDriverName: payload.driverName || assignedDriverName,
      assignedDriverPhone: payload.driverPhone || assignedDriverPhone,
      assignedDriverLicense: payload.driverLicense,
      vehicleNumber: payload.vehicleNumber,
      vehicleModel: payload.vehicleModel,
      vehicleColor: payload.vehicleColor,
      currentMatchingDriverId,
      driverRequestExpiresAt,
      attemptedDriverIds: currentMatchingDriverId ? [currentMatchingDriverId] : [],
      driverAccepted: false,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      notes: payload.notes || '',
      bookedTripId: payload.bookedTripId,
    };

    const updated = [newBooking, ...list];
    saveStorage(AGENCY_BOOKINGS_KEY, updated);

    // Notify agency and matching driver
    await this.addNotification({
      recipientRole: 'AGENCY',
      recipientId: newBooking.agencyId,
      title: 'Booking Created & Driver Search Started',
      message: `Booking ${newBooking.id} created for passenger ${payload.passenger.fullName}. System searching for eligible driver.`,
      bookingId: newBooking.id,
      type: 'INFO',
    });

    if (currentMatchingDriverId) {
      await this.addNotification({
        recipientRole: 'DRIVER',
        recipientId: currentMatchingDriverId,
        title: '⚡ New Trip Request Received (30s Timer)',
        message: `Trip Request ${newBooking.id} assigned to you. Passenger: ${payload.passenger.fullName} (${payload.passenger.phone}). Accept within 30 seconds!`,
        bookingId: newBooking.id,
        type: 'ALERT',
      });
    }

    return newBooking;
  },

  // ATOMIC DRIVER ASSIGNMENT LOCK (First driver acceptance succeeds)
  async assignDriverAtomically(bookingId: string, driverId: string): Promise<{ success: boolean; message: string; booking?: AgencyBooking }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      return { success: false, message: `Booking ${bookingId} not found` };
    }

    const booking = list[index];

    // Atomic Lock Check: If already assigned to another driver!
    if (booking.driverAccepted && booking.assignedDriverId && booking.assignedDriverId !== driverId) {
      return {
        success: false,
        message: `Trip ${bookingId} has already been accepted by another driver (${booking.assignedDriverName}). Assignment locked.`,
      };
    }

    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    const driverObj = drivers.find((d) => d.id === driverId) || {
      id: driverId,
      name: 'Vikas U',
      phone: '+91 98123 45678',
      cabNo: 'KA 05 AM 2969',
      rating: 4.95,
    };

    // Update booking atomically
    const updatedBooking: AgencyBooking = {
      ...booking,
      assignedDriverId: driverObj.id,
      assignedDriverName: driverObj.name,
      assignedDriverPhone: driverObj.phone,
      assignedCabNo: driverObj.cabNo || 'KA 05 AM 2969',
      assignedDriverRating: driverObj.rating || 4.9,
      driverAccepted: true,
      acceptedAt: new Date().toISOString(),
      status: 'DRIVER_ASSIGNED',
      currentStep: 'Driver Accepted Order — On the way to Pickup',
      currentMatchingDriverId: undefined,
      driverRequestExpiresAt: undefined,
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    // Update driver work status to BUSY
    await this.updateDriverStatus(driverId, 'ONLINE', 'BUSY');

    // Notify agency
    await this.addNotification({
      recipientRole: 'AGENCY',
      recipientId: booking.agencyId,
      title: '✓ Driver Assigned & Order Accepted',
      message: `Driver ${driverObj.name} (${driverObj.phone}) accepted trip ${booking.id} for passenger ${booking.travelerName}.`,
      bookingId: booking.id,
      type: 'SUCCESS',
    });

    return {
      success: true,
      message: `Order ${bookingId} accepted successfully! Reflected live on Agency Dashboard.`,
      booking: updatedBooking,
    };
  },

  // Driver accepts assigned trip
  async acceptTripByDriver(bookingId: string, driverId: string = 'd-driver-vikas'): Promise<AgencyBooking> {
    const res = await this.assignDriverAtomically(bookingId, driverId);
    if (!res.success) {
      throw new Error(res.message);
    }
    return res.booking!;
  },

  // Driver declines request / 30s timeout auto-forwarding
  async declineDriverRequest(bookingId: string, driverId: string, reason?: string): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = list[index];
    const attempted = [...(booking.attemptedDriverIds || []), driverId];

    // Find next driver
    booking.attemptedDriverIds = attempted;
    const nextDriver = await this.findNextEligibleDriver(booking);

    if (nextDriver) {
      booking.currentMatchingDriverId = nextDriver.id;
      booking.driverRequestExpiresAt = Date.now() + 30000;
      booking.status = 'SEARCHING_DRIVER';

      await this.addNotification({
        recipientRole: 'DRIVER',
        recipientId: nextDriver.id,
        title: '⚡ New Trip Request Received (30s Timer)',
        message: `Trip Request ${booking.id} dispatched to you. Passenger: ${booking.travelerName}. Accept within 30 seconds!`,
        bookingId: booking.id,
        type: 'ALERT',
      });
    } else {
      booking.currentMatchingDriverId = undefined;
      booking.driverRequestExpiresAt = undefined;
      booking.status = 'NO_DRIVER_AVAILABLE';
      booking.cancelReason = reason || 'All nearby drivers declined or timed out';

      await this.addNotification({
        recipientRole: 'AGENCY',
        recipientId: booking.agencyId,
        title: '⚠️ No Driver Available',
        message: `No drivers accepted booking ${booking.id}. Please retry or assign vehicle directly.`,
        bookingId: booking.id,
        type: 'WARNING',
      });
    }

    list[index] = { ...booking };
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return list[index];
  },

  // Driver cancels entire trip with selected dropdown reason
  async cancelTripByDriver(bookingId: string, reason: string, category?: string): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const updatedBooking: AgencyBooking = {
      ...list[index],
      status: 'CANCELLED_BY_DRIVER',
      cancelReason: reason || 'Trip cancelled by driver',
      cancelCategory: category || 'General',
      cancelledBy: 'DRIVER',
      cancelledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    if (updatedBooking.assignedDriverId) {
      await this.updateDriverStatus(updatedBooking.assignedDriverId, 'ONLINE', 'AVAILABLE');
    }

    await this.addNotification({
      recipientRole: 'AGENCY',
      recipientId: updatedBooking.agencyId,
      title: '❌ Trip Cancelled by Driver',
      message: `Driver ${updatedBooking.assignedDriverName} cancelled trip ${updatedBooking.id}. Reason: ${reason}`,
      bookingId: updatedBooking.id,
      type: 'ALERT',
    });

    return updatedBooking;
  },

  // Driver arrives at pickup location
  async driverArrivedAtPickup(bookingId: string): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = list[index];
    const otp = generateOtp();

    const updatedBooking: AgencyBooking = {
      ...booking,
      status: 'DRIVER_ARRIVED',
      currentStep: 'Driver Arrived at Pickup Location',
      tripOtp: booking.tripOtp || otp,
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    await this.addNotification({
      recipientRole: 'AGENCY',
      recipientId: booking.agencyId,
      title: '📍 Driver Arrived at Pickup',
      message: `Driver ${booking.assignedDriverName} arrived at pickup location for passenger ${booking.travelerName}. Trip OTP: ${booking.tripOtp || otp}`,
      bookingId: booking.id,
      type: 'INFO',
    });

    return updatedBooking;
  },

  // Verify Pickup OTP & Start Trip
  async verifyPickupOtp(bookingId: string, pickupPointId: string, enteredOtp: string): Promise<{ success: boolean; message: string; booking?: AgencyBooking }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const bIndex = list.findIndex((b) => b.id === bookingId);

    if (bIndex === -1) {
      return { success: false, message: 'Booking not found' };
    }

    const booking = list[bIndex];
    const pIndex = booking.pickupPoints.findIndex((p) => p.id === pickupPointId);

    if (pIndex === -1) {
      return { success: false, message: 'Pickup point not found' };
    }

    const point = booking.pickupPoints[pIndex];

    if (point.otp !== enteredOtp.trim() && booking.tripOtp !== enteredOtp.trim()) {
      return { success: false, message: `Invalid OTP '${enteredOtp}'. Expected correct 4-digit OTP provided to customer.` };
    }

    // OTP Verified! Mark passenger as PickedUp
    const updatedPoint: PickupPoint = {
      ...point,
      status: 'PickedUp',
      pickedUpAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    booking.pickupPoints[pIndex] = updatedPoint;

    const allPickedUp = booking.pickupPoints.every((p) => p.status === 'PickedUp');
    if (allPickedUp) {
      booking.status = 'TRIP_STARTED';
      booking.currentStep = 'All Passengers Picked Up — Trip In Progress to Drop Location';
      booking.tripStartedAt = new Date().toISOString();
    } else {
      booking.status = 'TRIP_STARTED';
      booking.currentStep = `Picked Up ${point.passengerName} (Stop #${point.orderNumber})`;
    }

    list[bIndex] = { ...booking };
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    await this.addNotification({
      recipientRole: 'AGENCY',
      recipientId: booking.agencyId,
      title: '🚗 Trip Started / Passenger Picked Up',
      message: `Passenger ${point.passengerName} picked up (OTP Verified). Trip status: TRIP IN PROGRESS.`,
      bookingId: booking.id,
      type: 'SUCCESS',
    });

    return {
      success: true,
      message: allPickedUp
        ? `OTP Verified! All passengers picked up. Trip in progress to drop location.`
        : `OTP Verified! ${point.passengerName} marked as Picked Up.`,
      booking: list[bIndex],
    };
  },

  // Driver updates live trip step (Uber/Ola/Rapido style)
  async updateDriverTripStep(bookingId: string, currentStep: string, status?: BookingStatus): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const updatedBooking: AgencyBooking = {
      ...list[index],
      currentStep,
      status: status || list[index].status,
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return updatedBooking;
  },

  // Complete Trip and Generate Bill
  async completeTripAndGenerateBill(bookingId: string, closingKmDetails?: { closingKm: number; tolls: number; parking: number; batta: number }): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    const booking = list[index];

    // Mark all pickup points as PickedUp
    const updatedPickups = booking.pickupPoints.map((p) => ({
      ...p,
      status: 'PickedUp' as const,
      pickedUpAt: p.pickedUpAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    const openingKm = 149103;
    const closingKm = closingKmDetails?.closingKm || 149228;
    const totalKm = Math.max(0, closingKm - openingKm);
    const ratePerKm = 18;
    const baseFare = totalKm * ratePerKm;
    const fastTag = closingKmDetails?.tolls || 350;
    const parking = closingKmDetails?.parking || 200;
    const tax = 150;
    const batta = closingKmDetails?.batta || 500;
    const totalAmount = baseFare + fastTag + parking + tax + batta;

    const dutySlip: DutySlipData = booking.dutySlip || {
      logSheetNo: `LS-${booking.id.replace('AG-', '')}`,
      agencyName: booking.agencyName || 'M/S Apoorva',
      guestName: booking.travelerName,
      guestMobile: booking.travelerPhone,
      reportingTo: booking.agencyName || 'M/S Apoorva',
      cabType: booking.vehicleTypeRequested || 'Innova Crysta',
      cabNo: booking.assignedCabNo || 'KA 05 AM 2969',
      driverName: booking.assignedDriverName || 'Vikas U',
      driverPhone: booking.assignedDriverPhone || '+91 98123 45678',
      particulars: 'Local',
      date: booking.travelDate || new Date().toLocaleDateString('en-GB'),
      openingKm,
      openingTime: booking.pickupTime || '06:00 AM',
      closingKm,
      closingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalKm,
      totalHours: 13,
      detailsOfJourney: `Pickups: ${booking.pickupPoints.map((p) => p.passengerName + ' (' + p.location + ')').join(' -> ')}\nDrop: ${booking.dropLocation}`,
      fastTag,
      parking,
      tax,
      batta,
      advance: 1000,
      others: 0,
      ratePerKm,
      baseFare,
      totalAmount,
      guestSignature: booking.travelerName.split(' ')[0] || 'Apoorva',
      updatedAt: new Date().toISOString(),
    };

    const updatedBooking: AgencyBooking = {
      ...booking,
      pickupPoints: updatedPickups,
      status: 'TRIP_COMPLETED',
      currentStep: 'Trip Completed & Billed',
      tripCompletedAt: new Date().toISOString(),
      dutySlip,
      fare: {
        baseFare,
        distanceKm: totalKm,
        ratePerKm,
        tolls: fastTag,
        parking,
        batta,
        totalFare: totalAmount,
      },
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    if (booking.assignedDriverId) {
      await this.updateDriverStatus(booking.assignedDriverId, 'ONLINE', 'AVAILABLE');
    }

    await this.addNotification({
      recipientRole: 'AGENCY',
      recipientId: booking.agencyId,
      title: '🏁 Trip Completed & Bill Report Generated',
      message: `Trip ${booking.id} completed by Driver ${booking.assignedDriverName}. Total Distance: ${totalKm} km. Total Fare: ₹${totalAmount.toLocaleString()}`,
      bookingId: booking.id,
      type: 'SUCCESS',
    });

    return updatedBooking;
  },

  // Save Duty Slip form
  async saveDutySlip(bookingId: string, dutySlipData: DutySlipData): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      throw new Error(`Agency booking ${bookingId} not found`);
    }

    const updatedBooking: AgencyBooking = {
      ...list[index],
      status: 'Duty Slip Updated',
      dutySlip: dutySlipData,
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return updatedBooking;
  },

  // Agency cancels booking
  async cancelBookingByAgency(bookingId: string, reason?: string): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);

    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = list[index];
    const updatedBooking: AgencyBooking = {
      ...booking,
      status: 'CANCELLED_BY_AGENCY',
      cancelReason: reason || 'Cancelled by Travelling Agency',
      cancelledBy: 'AGENCY',
      cancelledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    if (booking.assignedDriverId) {
      await this.updateDriverStatus(booking.assignedDriverId, 'ONLINE', 'AVAILABLE');
      await this.addNotification({
        recipientRole: 'DRIVER',
        recipientId: booking.assignedDriverId,
        title: '❌ Trip Cancelled by Agency',
        message: `Booking ${booking.id} was cancelled by agency ${booking.agencyName}.`,
        bookingId: booking.id,
        type: 'ALERT',
      });
    }

    return updatedBooking;
  },

  // Add Agency Rental Car
  async addAgencyVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const newId = `v-agency-${Date.now()}`;
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: newId,
      rating: vehicleData.rating || 4.9,
      reviewsCount: vehicleData.reviewsCount || 12,
      available: true,
    };

    const updated = [newVehicle, ...vehicles];
    saveStorage(VEHICLES_KEY, updated);
    return newVehicle;
  },

  // Get Agency Vehicles
  async getAgencyVehicles(): Promise<Vehicle[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
  },

  // Add Trip Package
  async addAgencyTripPackage(tripData: Omit<AvailableTrip, 'id'>): Promise<AvailableTrip> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const trips = loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
    const newId = `pkg-agency-${Date.now()}`;
    const newTrip: AvailableTrip = {
      ...tripData,
      id: newId,
      status: 'Scheduled',
    };

    const updated = [newTrip, ...trips];
    saveStorage(TRIPS_KEY, updated);
    return newTrip;
  },

  // Get Agency Trip Packages
  async getAgencyTripPackages(): Promise<AvailableTrip[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
  },

  // Get driver credentials by phone number (for driver login)
  async getDriverByPhone(phone: string): Promise<{ name: string; phone: string; cabNo: string; bookingId: string } | null> {
    const bookings = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    // Search through all bookings for a matching assigned driver phone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    for (const b of bookings) {
      const bPhone = (b.assignedDriverPhone || '').replace(/[^0-9]/g, '');
      if (bPhone && cleanPhone && (bPhone === cleanPhone || bPhone.endsWith(cleanPhone) || cleanPhone.endsWith(bPhone))) {
        return {
          name: b.assignedDriverName || 'Driver',
          phone: b.assignedDriverPhone || phone,
          cabNo: b.assignedCabNo || b.vehicleNumber || 'N/A',
          bookingId: b.id,
        };
      }
    }
    return null;
  },
};
