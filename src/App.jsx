import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { navItems } from './nav-items';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Navigation />
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {navItems.map((item) => (
                <Route
                  key={item.label}
                  path={`/${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  element={
                    <ProtectedRoute allowedRoles={item.roles || ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success']}>
                      <item.component />
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<div>404 Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;