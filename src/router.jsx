import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role || 'user';

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/*"
          element={
            <SignedIn>
              <div className="flex">
                <Navigation />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route
                      path="/user-management"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                  </Routes>
                </main>
              </div>
            </SignedIn>
          }
        />
        <Route path="*" element={<RedirectToSignIn />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;