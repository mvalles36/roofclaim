// src/router.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from './integrations/supabase/auth';
import ProtectedRoute from './components/ProtectedRoute'; // assuming you've extracted this

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contacts = lazy(() => import('./pages/Contacts'));
// ... other imports

const Router = () => {
  const { session } = useSupabaseAuth();

  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" replace />} />
        {/* ... other routes */}
        <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
