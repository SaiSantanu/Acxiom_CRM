import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import FollowUps from './pages/FollowUps';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

/**
 * RootRoute: If unauthenticated, displays the Landing Page with the "Go to Login" button
 * and developer attribution. If authenticated, displays the full CRM Dashboard in MainLayout.
 */
function RootRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: '#0a0f1d', color: '#94a3b8' }}
      >
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: 44, height: 44 }} />
        <h6 className="fw-semibold text-white">Initializing AcxiomCRM Workspace...</h6>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Dedicated Landing Page route */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Root: Landing Page if guest, Dashboard layout if authenticated */}
          <Route path="/" element={<RootRoute />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* Authenticated CRM feature routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="customers" element={<Customers />} />
            <Route path="leads" element={<Leads />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="follow-ups" element={<FollowUps />} />
            <Route path="activities" element={<Activities />} />

            {/* Reports: Admin & Manager */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Settings & Admin: Admin only */}
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
