import type { AgencyBooking, DutySlipData, PickupPoint, Vehicle, AvailableTrip } from '../types';
import { INITIAL_AGENCY_BOOKINGS, INITIAL_VEHICLES, INITIAL_AVAILABLE_TRIPS } from '../data/mockData';

const AGENCY_BOOKINGS_KEY = 'red_trip_agency_bookings_v5';
const VEHICLES_KEY = 'red_trip_vehicles_v1';
const TRIPS_KEY = 'red_trip_trips_v1';

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
    await new Promise((resolve) => setTimeout(resolve, 150));
    return loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
  },

  // Get single booking by ID
  async getAgencyBookingById(id: string): Promise<AgencyBooking | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    return list.find((b) => b.id === id);
  },

  // Create new booking by Agency with dynamic N pickup points & OTP generation
  async createAgencyBooking(payload: {
    agencyId?: string;
    agencyName: string;
    travelDate: string;
    pickupTime: string;
    flightNo?: string;
    travelerName: string;
    travelerPhone: string;
    assignedDriverName?: string;
    assignedDriverPhone?: string;
    assignedCabNo?: string;
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
    notes?: string;
  }): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);

    const randomNum = Math.floor(10000 + Math.random() * 90000);

    const pickupPoints: PickupPoint[] = payload.pickupPointsInput.map((p, idx) => ({
      id: `pk-${Date.now()}-${idx + 1}`,
      orderNumber: idx + 1,
      location: p.location,
      locationUrl: p.locationUrl || '',
      pickupTime: p.pickupTime || payload.pickupTime,
      passengerName: p.passengerName || payload.travelerName,
      passengerPhone: p.passengerPhone || payload.travelerPhone,
      flightNo: p.flightNo || payload.flightNo || '',
      otp: generateOtp(),
      status: 'Pending',
    }));

    const newBooking: AgencyBooking = {
      id: `AG-${randomNum}`,
      agencyId: payload.agencyId || 'ag-101',
      agencyName: payload.agencyName || 'M/S Apoorva',
      travelDate: payload.travelDate,
      pickupTime: payload.pickupTime,
      flightNo: payload.flightNo || '',
      travelerName: payload.travelerName,
      travelerPhone: payload.travelerPhone,
      pickupPoints,
      pickup1: pickupPoints[0]?.location || '',
      pickup2: pickupPoints[1]?.location || '',
      dropLocation: payload.dropLocation,
      vehicleTypeRequested: payload.vehicleTypeRequested,
      assignedCabNo: payload.assignedCabNo || 'KA 05 AM 2969',
      assignedDriverId: 'd-driver-vikas',
      assignedDriverName: payload.assignedDriverName || 'Vikas U',
      assignedDriverPhone: payload.assignedDriverPhone || '+91 98123 45678',
      driverAccepted: false,
      status: 'Pending Acceptance',
      createdAt: new Date().toISOString(),
      notes: payload.notes || '',
    };

    const updated = [newBooking, ...list];
    saveStorage(AGENCY_BOOKINGS_KEY, updated);
    return newBooking;
  },

  // Driver accepts the assigned trip
  async acceptTripByDriver(bookingId: string): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const updatedBooking: AgencyBooking = {
      ...list[index],
      driverAccepted: true,
      acceptedAt: new Date().toISOString(),
      status: 'Accepted',
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return updatedBooking;
  },

  // Driver cancels entire trip with selected dropdown reason
  async cancelTripByDriver(bookingId: string, reason: string, category?: string): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const updatedBooking: AgencyBooking = {
      ...list[index],
      status: 'Cancelled',
      cancelReason: reason || 'Trip cancelled by driver',
      cancelCategory: category || 'General',
      cancelledBy: 'DRIVER',
      cancelledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return updatedBooking;
  },

  // Driver updates live trip step (Uber/Ola/Rapido style)
  async updateDriverTripStep(bookingId: string, currentStep: string, status?: AgencyBooking['status']): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
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

  // Driver cancels specific pickup stop (customer no show for individual stop)
  async cancelPickupStopByDriver(bookingId: string, pickupPointId: string, reason?: string): Promise<{ success: boolean; message: string; booking: AgencyBooking }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const bIndex = list.findIndex((b) => b.id === bookingId);
    if (bIndex === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = list[bIndex];
    const pIndex = booking.pickupPoints.findIndex((p) => p.id === pickupPointId);
    if (pIndex === -1) throw new Error(`Pickup stop ${pickupPointId} not found`);

    const point = booking.pickupPoints[pIndex];
    const updatedPoint: PickupPoint = {
      ...point,
      status: 'Cancelled',
      cancellationReason: reason || 'Customer not arrived after waiting time',
    };

    booking.pickupPoints[pIndex] = updatedPoint;

    // If all pickup points are now cancelled, mark whole trip as Cancelled
    const allCancelled = booking.pickupPoints.every((p) => p.status === 'Cancelled');
    if (allCancelled) {
      booking.status = 'Cancelled';
      booking.cancelReason = 'All pickup stops cancelled (Customer No-Show)';
    }

    list[bIndex] = { ...booking };
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    return {
      success: true,
      message: `Pickup Stop #${point.orderNumber} (${point.passengerName}) marked as Cancelled. Reflected in Agency Dashboard!`,
      booking: list[bIndex],
    };
  },

  // Verify Pickup OTP by Driver
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

    if (point.otp !== enteredOtp.trim()) {
      return { success: false, message: `Invalid OTP '${enteredOtp}'. Expected correct 4-digit OTP provided to customer.` };
    }

    // OTP Verified! Mark passenger as PickedUp
    const updatedPoint: PickupPoint = {
      ...point,
      status: 'PickedUp',
      pickedUpAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    booking.pickupPoints[pIndex] = updatedPoint;

    // Check if all pickup points are now completed
    const allPickedUp = booking.pickupPoints.every((p) => p.status === 'PickedUp');
    if (allPickedUp) {
      booking.status = 'In Progress';
      booking.currentStep = 'All Passengers Picked Up — Driving to Drop Location';
    } else {
      booking.status = 'In Progress';
      booking.currentStep = `Picked Up ${point.passengerName} (Stop #${point.orderNumber})`;
    }

    list[bIndex] = { ...booking };
    saveStorage(AGENCY_BOOKINGS_KEY, list);

    return {
      success: true,
      message: allPickedUp
        ? `OTP Verified! All passengers picked up. Now driving to drop location.`
        : `OTP Verified! ${point.passengerName} marked as Picked Up.`,
      booking: list[bIndex],
    };
  },

  // Mark all pickups as completed and generate bill report for agency & driver
  async completeTripAndGenerateBill(bookingId: string): Promise<AgencyBooking> {
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
      openingKm: 149103,
      openingTime: booking.pickupTime || '06:00 AM',
      closingKm: 149228,
      closingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalKm: 125,
      totalHours: 13,
      detailsOfJourney: `Pickups: ${booking.pickupPoints.map((p) => p.passengerName + ' (' + p.location + ')').join(' -> ')}\nDrop: ${booking.dropLocation}`,
      fastTag: 350,
      parking: 200,
      tax: 150,
      batta: 500,
      advance: 1000,
      others: 0,
      ratePerKm: 18,
      baseFare: 2250,
      totalAmount: 3450,
      guestSignature: booking.travelerName.split(' ')[0] || 'Apoorva',
      updatedAt: new Date().toISOString(),
    };

    const updatedBooking: AgencyBooking = {
      ...booking,
      pickupPoints: updatedPickups,
      status: 'Duty Slip Updated',
      dutySlip,
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return updatedBooking;
  },

  // Driver updates or fills the Duty Slip
  async saveDutySlip(bookingId: string, dutySlipData: DutySlipData): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 200));
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

  // Update trip status
  async updateBookingStatus(bookingId: string, status: AgencyBooking['status']): Promise<AgencyBooking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = loadStorage<AgencyBooking[]>(AGENCY_BOOKINGS_KEY, INITIAL_AGENCY_BOOKINGS);
    const index = list.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      throw new Error(`Agency booking ${bookingId} not found`);
    }

    const updatedBooking: AgencyBooking = {
      ...list[index],
      status,
    };

    list[index] = updatedBooking;
    saveStorage(AGENCY_BOOKINGS_KEY, list);
    return updatedBooking;
  },

  // --- NEW AGENCY MANAGEMENT APIS (REFLECTED LIVE TO CUSTOMERS!) ---

  // Agency adds a new Rental Car (With Driver / Self-Drive)
  async addAgencyVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    await new Promise((resolve) => setTimeout(resolve, 250));
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

  // Get all vehicles for agency management
  async getAgencyVehicles(): Promise<Vehicle[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
  },

  // Agency adds a new Scheduled Trip Package
  async addAgencyTripPackage(tripData: Omit<AvailableTrip, 'id'>): Promise<AvailableTrip> {
    await new Promise((resolve) => setTimeout(resolve, 250));
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

  // Get all trip packages for agency management
  async getAgencyTripPackages(): Promise<AvailableTrip[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
  }
};
