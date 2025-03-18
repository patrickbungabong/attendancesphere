
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { LoadingScreen } from '@/components/ui-custom/LoadingScreen';
import { isSupabaseConfigured } from '@/lib/supabase';

import MainLayout from '@/components/layout/MainLayout';
import IndexPage from '@/pages/Index';
import LoginPage from '@/pages/Login';
import NotFoundPage from '@/pages/NotFound';
import DashboardPage from '@/pages/Dashboard';
import StudentsPage from '@/pages/Students';
import TeachersPage from '@/pages/Teachers';
import SessionsPage from '@/pages/Sessions';
import SchedulePage from '@/pages/Schedule';
import PaymentsPage from '@/pages/Payments';
import EarningsPage from '@/pages/Earnings';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If Supabase isn't configured, we still allow access to the app
  // This is useful for demonstration purposes
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }
  
  // Normal authentication check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/students" element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/teachers" element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeachersPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sessions" element={
                <ProtectedRoute>
                  <MainLayout>
                    <SessionsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <MainLayout>
                    <SchedulePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/payments" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PaymentsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/earnings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <EarningsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default App;
