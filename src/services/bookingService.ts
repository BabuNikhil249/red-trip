import type { Vehicle, Driver, AvailableTrip, Booking, BookingStatus } from '../types';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_AVAILABLE_TRIPS, INITIAL_BOOKINGS } from '../data/mockData';

const VEHICLES_KEY = 'red_trip_vehicles_v1';
const DRIVERS_KEY = 'red_trip_drivers_v1';
const TRIPS_KEY = 'red_trip_trips_v1';
const BOOKINGS_KEY = 'red_trip_bookings_v1';

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
  } catch (err) {
    console.error(`Failed to save ${key}`, err);
  }
};

export const bookingService = {
  // 1. Vehicles API
  async getVehicles(categoryFilter?: string): Promise<Vehicle[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    let list = vehicles.filter((v) => v.driverIncluded && v.available);
    if (categoryFilter && categoryFilter !== 'All') {
      list = list.filter((v) => v.category === categoryFilter);
    }
    return list;
  },

  async getSelfDriveVehicles(categoryFilter?: string): Promise<Vehicle[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    let list = vehicles.filter((v) => v.isSelfDriveAvailable && v.available);
    if (categoryFilter && categoryFilter !== 'All') {
      list = list.filter((v) => v.category === categoryFilter);
    }
    return list;
  },

  // 2. Drivers API
  async getDrivers(): Promise<Driver[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    return drivers.filter((d) => d.available);
  },

  // 3. Available Scheduled Trips API
  async getAvailableTrips(filters?: { from?: string; to?: string; date?: string }): Promise<AvailableTrip[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const trips = loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
    let list = [...trips];
    if (filters?.from) {
      list = list.filter((t) => t.from.toLowerCase().includes(filters.from!.toLowerCase()));
    }
    if (filters?.to) {
      list = list.filter((t) => t.to.toLowerCase().includes(filters.to!.toLowerCase()));
    }
    if (filters?.date) {
      list = list.filter((t) => t.date === filters.date);
    }
    return list;
  },

  async getTripById(id: string): Promise<AvailableTrip | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const trips = loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
    return trips.find((t) => t.id === id);
  },

  // 4. Bookings Management API
  async getBookings(statusFilter?: BookingStatus | 'All'): Promise<Booking[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const bookings = loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    if (statusFilter && statusFilter !== 'All') {
      return bookings.filter((b) => b.status === statusFilter);
    }
    return bookings;
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const bookings = loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    return bookings.find((b) => b.id === id);
  },

  async createBooking(payload: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const bookings = loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      ...payload,
      id: `RT-${randomSuffix}`,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    saveStorage(BOOKINGS_KEY, updated);
    return newBooking;
  },

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const bookings = loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Booking ${id} not found`);
    }

    const updatedBooking: Booking = {
      ...bookings[index],
      status: 'Cancelled',
      notes: reason ? `Cancelled by user. Reason: ${reason}` : 'Cancelled by user.',
    };

    bookings[index] = updatedBooking;
    saveStorage(BOOKINGS_KEY, bookings);
    return updatedBooking;
  }
};
