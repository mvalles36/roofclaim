import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Index from './pages/Index';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <SignedIn>
            <div className="flex">
              <Navigation />
              <main className="flex-1 p-6">
                <Routes>
                  <Route index element={<Index />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="user-management" element={<UserManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </SignedIn>
        }
      />
      <Route path="*" element={<RedirectToSignIn />} />
    </Routes>
  );
};

export default AppRoutes;
