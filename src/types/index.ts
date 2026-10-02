export type BookingType = 'WITH_DRIVER' | 'SELF_DRIVE' | 'DRIVER_ONLY' | 'AVAILABLE_TRIP';

export type TripTypeOption = 'One Way' | 'Round Trip' | 'Local' | 'Outstation' | 'Multi-Day';

export type VehicleCategory = 'Sedan' | 'SUV' | 'Premium' | 'Tempo Traveller' | 'Bus';

export type FuelType = 'Petrol' | 'Diesel' | 'EV' | 'Hybrid';

export type TransmissionType = 'Manual' | 'Automatic';

export type BookingStatus = 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';

export type UserRole = 'USER' | 'ADMIN' | 'DRIVER' | 'AGENCY';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isLoggedIn: boolean;
  agencyName?: string;
  driverCabNo?: string;
}

export interface DutySlipData {
  logSheetNo: string;
  agencyName: string;
  guestName: string;
  guestMobile: string;
  reportingTo?: string;
  cabType: string;
  cabNo: string;
  driverName: string;
  driverPhone: string;
  particulars: 'Local' | 'Out Station';
  date: string;
  openingKm: number;
  openingTime: string;
  closingKm: number;
  closingTime: string;
  totalKm: number;
  totalHours: number;
  detailsOfJourney: string;
  fastTag: number;
  parking: number;
  tax: number;
  batta: number;
  advance: number;
  others: number;
  ratePerKm: number;
  baseFare: number;
  totalAmount: number;
  guestSignature?: string;
  updatedAt: string;
}

export interface TravelAgency {
  id: string;
  agencyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin?: string;
  address: string;
  commissionRate: number;
  status: 'Active' | 'Inactive';
  totalBookingsCount?: number;
  totalBilledAmount?: number;
  createdAt: string;
}

export interface PickupPoint {
  id: string;
  orderNumber: number;
  location: string;
  locationUrl?: string;
  pickupTime: string;
  passengerName: string;
  passengerPhone: string;
  flightNo?: string;
  otp: string;
  status: 'Pending' | 'PickedUp' | 'Cancelled';
  pickedUpAt?: string;
  cancellationReason?: string;
}

export interface AgencyBooking {
  id: string;
  agencyId: string;
  agencyName: string;
  travelDate: string;
  pickupTime: string;
  flightNo?: string;
  travelerName: string;
  travelerPhone: string;
  pickupPoints: PickupPoint[];
  pickup1?: string;
  pickup2?: string;
  dropLocation: string;
  vehicleTypeRequested: string;
  assignedCabNo?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  driverAccepted?: boolean;
  acceptedAt?: string;
  status: 'Pending' | 'Pending Acceptance' | 'Accepted' | 'Assigned' | 'In Progress' | 'Duty Slip Updated' | 'Billed' | 'Completed' | 'Cancelled';
  currentStep?: string;
  cancelReason?: string;
  cancelCategory?: string;
  cancelledBy?: 'DRIVER' | 'AGENCY' | 'PASSENGER';
  cancelledAt?: string;
  driverLocation?: {
    lat: number;
    lng: number;
    address: string;
    speedKm: number;
  };
  createdAt: string;
  notes?: string;
  dutySlip?: DutySlipData;
  isCustomerWebsiteBooking?: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  category: VehicleCategory;
  capacity: number;
  ac: boolean;
  fuelType: FuelType;
  transmission: TransmissionType;
  pricePerDay: number;
  pricePerKm: number;
  basePrice: number;
  securityDeposit: number;
  driverIncluded: boolean;
  isSelfDriveAvailable: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  features: string[];
  available: boolean;
  agencyName?: string;
}

export interface Driver {
  id: string;
  name: string;
  photo: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  completedTrips: number;
  languages: string[];
  hourlyRate: number;
  dailyRate: number;
  available: boolean;
  phone: string;
  bio: string;
  agencyName?: string;
}

export interface AvailableTrip {
  id: string;
  title: string;
  region: 'Karnataka' | 'All India';
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  estimatedDuration: string;
  durationDaysNights?: string;
  vehicleName: string;
  vehicleType: VehicleCategory;
  driverName: string;
  driverRating: number;
  driverPhoto: string;
  availableSeats: number;
  totalSeats: number;
  pricePerPassenger: number;
  pickupPoint: string;
  dropPoint: string;
  routeDescription: string;
  cancellationPolicy: string;
  status: 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
  image?: string;
  categoryTag?: string;
  inclusions?: string[];
  highlights?: string[];
  itinerary?: { day: number; title: string; details: string }[];
  agencyName?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  idProofType?: string;
  idProofNumber?: string;
}

export interface Booking {
  id: string;
  bookingType: BookingType;
  customer: CustomerInfo;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  returnDate?: string;
  pickupTime: string;
  returnTime?: string;
  tripType?: TripTypeOption;
  passengers: number;
  durationHours?: number;
  durationDays?: number;
  vehicle?: Vehicle;
  driver?: Driver;
  trip?: AvailableTrip;
  seatsBooked?: number;
  estimatedDistanceKm?: number;
  estimatedDurationHours?: number;
  baseFare: number;
  driverCharge?: number;
  securityDeposit?: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  agencyName?: string;
}

export interface SearchFilterState {
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  tripType: TripTypeOption;
  passengers: number;
  durationHours: number;
  vehicleCategory: VehicleCategory | 'All';
  priceMax: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
