import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { RequestProvider } from './context/RequestContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { WasteGuidePage } from './pages/WasteGuidePage';
import { RequestPickupPage } from './pages/RequestPickupPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { TrackingPage } from './pages/TrackingPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminHistoryPage } from './pages/admin/AdminHistoryPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Public Layout Wrapper (with standard Navbar and Footer)
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <RequestProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/waste-guide" element={<WasteGuidePage />} />
              <Route path="/request" element={<RequestPickupPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/my-requests" element={<MyRequestsPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/track/:id" element={<TrackingPage />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Authenticated Area */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="requests" element={<AdminRequestsPage />} />
              <Route path="history" element={<AdminHistoryPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </RequestProvider>
    </AdminAuthProvider>
  );
};

export default App;
