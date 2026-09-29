import type { Vehicle, Driver, AvailableTrip, Booking, BookingStatus } from '../types';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_AVAILABLE_TRIPS, INITIAL_BOOKINGS } from '../data/mockData';

const VEHICLES_KEY = 'red_trip_vehicles_v1';
const DRIVERS_KEY = 'red_trip_drivers_v1';
const TRIPS_KEY = 'red_trip_trips_v1';
const BOOKINGS_KEY = 'red_trip_bookings_v1';

// Helpers
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

export const adminService = {
  // 1. VEHICLES CRUD
  async getAllVehicles(): Promise<Vehicle[]> {
    await new Promise((res) => setTimeout(res, 150));
    return loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    await new Promise((res) => setTimeout(res, 200));
    const vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const newId = `v-${Date.now()}`;
    const newVehicle: Vehicle = { ...vehicle, id: newId };
    const updated = [newVehicle, ...vehicles];
    saveStorage(VEHICLES_KEY, updated);
    return newVehicle;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    await new Promise((res) => setTimeout(res, 200));
    const vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    const updatedVehicle = { ...vehicles[index], ...updates };
    vehicles[index] = updatedVehicle;
    saveStorage(VEHICLES_KEY, vehicles);
    return updatedVehicle;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    let vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    vehicles = vehicles.filter((v) => v.id !== id);
    saveStorage(VEHICLES_KEY, vehicles);
    return true;
  },

  // 2. DRIVERS CRUD
  async getAllDrivers(): Promise<Driver[]> {
    await new Promise((res) => setTimeout(res, 150));
    return loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
  },

  async addDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
    await new Promise((res) => setTimeout(res, 200));
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    const newId = `d-${Date.now()}`;
    const newDriver: Driver = { ...driver, id: newId };
    const updated = [newDriver, ...drivers];
    saveStorage(DRIVERS_KEY, updated);
    return newDriver;
  },

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
    await new Promise((res) => setTimeout(res, 200));
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    const index = drivers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Driver ${id} not found`);

    const updatedDriver = { ...drivers[index], ...updates };
    drivers[index] = updatedDriver;
    saveStorage(DRIVERS_KEY, drivers);
    return updatedDriver;
  },

  async deleteDriver(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    let drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    drivers = drivers.filter((d) => d.id !== id);
    saveStorage(DRIVERS_KEY, drivers);
    return true;
  },

  // 3. SCHEDULED TRIPS CRUD
  async getAllTrips(): Promise<AvailableTrip[]> {
    await new Promise((res) => setTimeout(res, 150));
    return loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
  },

  async addTrip(trip: Omit<AvailableTrip, 'id'>): Promise<AvailableTrip> {
    await new Promise((res) => setTimeout(res, 200));
    const trips = loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newTrip: AvailableTrip = { ...trip, id: `trip-${randomNum}` };
    const updated = [newTrip, ...trips];
    saveStorage(TRIPS_KEY, updated);
    return newTrip;
  },

  async deleteTrip(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    let trips = loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
    trips = trips.filter((t) => t.id !== id);
    saveStorage(TRIPS_KEY, trips);
    return true;
  },

  // 4. BOOKINGS OVERRIDE & STATUS CRUD
  async getAllBookings(): Promise<Booking[]> {
    await new Promise((res) => setTimeout(res, 150));
    return loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
  },

  async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 200));
    const bookings = loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Booking ${id} not found`);

    const updated = { ...bookings[index], status, notes: notes || bookings[index].notes };
    bookings[index] = updated;
    saveStorage(BOOKINGS_KEY, bookings);
    return updated;
  },

  // 5. METRICS & REVENUE REPORT
  async getAdminMetrics() {
    await new Promise((res) => setTimeout(res, 150));
    const vehicles = loadStorage<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const drivers = loadStorage<Driver[]>(DRIVERS_KEY, INITIAL_DRIVERS);
    const trips = loadStorage<AvailableTrip[]>(TRIPS_KEY, INITIAL_AVAILABLE_TRIPS);
    const bookings = loadStorage<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);

    const totalRevenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter((v) => v.available).length,
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter((d) => d.available).length,
      totalTrips: trips.length,
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter((b) => b.status === 'Upcoming').length,
      activeBookings: bookings.filter((b) => b.status === 'Active').length,
      completedBookings: bookings.filter((b) => b.status === 'Completed').length,
      cancelledBookings: bookings.filter((b) => b.status === 'Cancelled').length,
      totalRevenue,
    };
  },
};
