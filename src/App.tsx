import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastNotification } from './components/common/ToastNotification';

import { HomePage } from './pages/HomePage';
import { RentWithDriverPage } from './pages/RentWithDriverPage';
import { SelfDrivePage } from './pages/SelfDrivePage';
import { HireDriverPage } from './pages/HireDriverPage';
import { AvailableTripsPage } from './pages/AvailableTripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { BookingSummaryPage } from './pages/BookingSummaryPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage, SignupPage } from './pages/LoginPage';
import { AboutPage, ContactPage } from './pages/AboutPage';
import { HelpDeskPage } from './pages/HelpDeskPage';

// Agency & Driver Portal Pages
import { AgencyDashboardPage } from './pages/agency/AgencyDashboardPage';
import { DriverDashboardPage } from './pages/driver/DriverDashboardPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminAgenciesPage } from './pages/admin/AdminAgenciesPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <BookingProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/rent-with-driver" element={<RentWithDriverPage />} />
              <Route path="/self-drive" element={<SelfDrivePage />} />
              <Route path="/hire-driver" element={<HireDriverPage />} />
              <Route path="/available-trips" element={<AvailableTripsPage />} />
              <Route path="/trip/:id" element={<TripDetailPage />} />
              <Route path="/booking/summary" element={<BookingSummaryPage />} />
              <Route path="/confirmation/:id" element={<ConfirmationPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/helpdesk" element={<HelpDeskPage />} />

              {/* Agency & Driver Routes */}
              <Route path="/agency" element={<AgencyDashboardPage />} />
              <Route path="/driver" element={<DriverDashboardPage />} />

              {/* Admin Portal Routes (Solely Travel Agencies Management) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<Navigate to="/admin/agencies" replace />} />
              <Route path="/admin/agencies" element={<AdminAgenciesPage />} />
              <Route path="/admin/*" element={<Navigate to="/admin/agencies" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastNotification />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
