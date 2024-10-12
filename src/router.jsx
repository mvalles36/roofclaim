import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import UserManagement from './components/UserManagement';
import Settings from './pages/Settings';
import Index from './pages/Index';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
      <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
      <Route
        path="/*"
        element={
          <>
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
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;