import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import ServicesPage from './pages/ServicesPage';
import StaffPage from './pages/StaffPage';
import LandingPage from './pages/LandingPage';

import FinancesPage from './pages/FinancesPage';

import ExpensesPage from './pages/ExpensesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

import { ExpensesProvider } from './lib/ExpensesContext';
import { AppointmentsProvider } from './lib/AppointmentsContext';
import { DataProvider } from './lib/DataContext';

export default function App() {
  return (
    <AuthProvider>
      <ExpensesProvider>
        <AppointmentsProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Admin/Staff Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="expenses" element={<ExpensesPage />} />
                  <Route path="finances" element={<FinancesPage />} />
                  <Route path="settings" element={<div className="text-2xl font-serif font-bold p-10">CILËSIMET (Coming Soon)</div>} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AppointmentsProvider>
      </ExpensesProvider>
    </AuthProvider>
  );
}
