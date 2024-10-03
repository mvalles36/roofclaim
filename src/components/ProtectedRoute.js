import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth'; // Adjust this path based on your folder structure

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole, session } = useSupabaseAuth();

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect them to a "not authorized" page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // If authenticated and authorized, render the children (protected component)
  return children;
};

export default ProtectedRoute;
