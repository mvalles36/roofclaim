import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { navItems } from './nav-items';

const AppRouter = () => {
  const { session, loading } = useSupabaseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {session ? (
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default AppRouter;