import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Jobs from './pages/Jobs';
import ProtectedRoute from './components/ProtectedRoute';
import { navItems } from './nav-items';

const AppRouter = () => {
  const { user } = useSupabaseAuth();

  return (
    <Router>
      {user ? (
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success']}><Dashboard /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute allowedRoles={['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success']}><Contacts /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute allowedRoles={['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success']}><Jobs /></ProtectedRoute>} />
              {navItems.map((item) => (
                <Route
                  key={item.label}
                  path={`/${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  element={<ProtectedRoute allowedRoles={item.roles}>{React.createElement(item.component)}</ProtectedRoute>}
                />
              ))}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default AppRouter;