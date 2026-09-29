export type BookingType = 'WITH_DRIVER' | 'SELF_DRIVE' | 'DRIVER_ONLY' | 'AVAILABLE_TRIP';

export type TripTypeOption = 'One Way' | 'Round Trip' | 'Local' | 'Outstation' | 'Multi-Day';

export type VehicleCategory = 'Sedan' | 'SUV' | 'Premium' | 'Tempo Traveller' | 'Bus';

export type FuelType = 'Petrol' | 'Diesel' | 'EV' | 'Hybrid';

export type TransmissionType = 'Manual' | 'Automatic';

export type BookingStatus = 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';

export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isLoggedIn: boolean;
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
}

export interface AvailableTrip {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  estimatedDuration: string;
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
