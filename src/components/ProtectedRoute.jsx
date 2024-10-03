import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole, user } = useSupabaseAuth();

  if (!user) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If the user does not have the correct role, redirect to unauthorized page
    return <Navigate to="/unauthorized" />;
  }

  // If the user is authenticated and has the right role, render the children
  return children;
};

export default ProtectedRoute;
