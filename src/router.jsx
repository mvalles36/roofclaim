import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

const AppRouter = () => {
  return (
    <Router>
      <SignedIn>
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <Routes>
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          <Route path="*" element={<RedirectToSignIn />} />
        </Routes>
      </SignedOut>
    </Router>
  );
};

export default AppRouter;