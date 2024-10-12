import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DocumentHub from './pages/DocumentHub';
import FindProspects from './pages/FindProspects';
import DamageDetection from './pages/DamageDetection';
import Reports from './pages/Reports';
import KnowledgeBase from './pages/KnowledgeBase';
import ContractorPortal from './pages/ContractorPortal';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/document-hub" element={<DocumentHub />} />
                <Route path="/find-prospects" element={<FindProspects />} />
                <Route path="/damage-detection" element={<DamageDetection />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/contractor-portal" element={<ContractorPortal />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
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