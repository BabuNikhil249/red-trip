import React, { createContext, useContext, useState } from 'react';
import type { BookingType, Vehicle, Driver, AvailableTrip, SearchFilterState, ToastMessage, AuthUser } from '../types';

interface BookingContextType {
  activeBookingType: BookingType;
  setActiveBookingType: (type: BookingType) => void;
  searchParams: SearchFilterState;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchFilterState>>;

  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (driver: Driver | null) => void;
  selectedTrip: AvailableTrip | null;
  setSelectedTrip: (trip: AvailableTrip | null) => void;
  selectedSeatsCount: number;
  setSelectedSeatsCount: (count: number) => void;

  resetDraft: () => void;

  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  user: AuthUser;
  setUser: (user: AuthUser) => void;
  loginAsAdmin: () => void;
  loginAsUser: (name: string, email: string, phone: string) => void;
  logout: () => void;
}

const DEFAULT_SEARCH: SearchFilterState = {
  pickupLocation: 'Bangalore',
  dropLocation: 'Mysore',
  travelDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  returnDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
  pickupTime: '08:00 AM',
  returnTime: '06:00 PM',
  tripType: 'One Way',
  passengers: 2,
  durationHours: 8,
  vehicleCategory: 'All',
  priceMax: 20000,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBookingType, setActiveBookingType] = useState<BookingType>('WITH_DRIVER');
  const [searchParams, setSearchParams] = useState<SearchFilterState>(DEFAULT_SEARCH);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<AvailableTrip | null>(null);
  const [selectedSeatsCount, setSelectedSeatsCount] = useState<number>(1);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [user, setUser] = useState<AuthUser>({
    id: 'u-101',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    isLoggedIn: true,
  });

  const resetDraft = () => {
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setSelectedTrip(null);
    setSelectedSeatsCount(1);
  };

  const loginAsAdmin = () => {
    setUser({
      id: 'admin-1',
      name: 'System Administrator',
      email: 'admin@redtrip.in',
      phone: '+91 800 RED-TRIP',
      role: 'ADMIN',
      isLoggedIn: true,
    });
  };

  const loginAsUser = (name: string, email: string, phone: string) => {
    setUser({
      id: `u-${Date.now()}`,
      name: name || 'Customer User',
      email: email || 'user@example.com',
      phone: phone || '+91 98765 43210',
      role: 'USER',
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'USER',
      isLoggedIn: false,
    });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BookingContext.Provider
      value={{
        activeBookingType,
        setActiveBookingType,
        searchParams,
        setSearchParams,
        selectedVehicle,
        setSelectedVehicle,
        selectedDriver,
        setSelectedDriver,
        selectedTrip,
        setSelectedTrip,
        selectedSeatsCount,
        setSelectedSeatsCount,
        resetDraft,
        toasts,
        addToast,
        removeToast,
        user,
        setUser,
        loginAsAdmin,
        loginAsUser,
        logout,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};
