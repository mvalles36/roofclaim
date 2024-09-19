import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import { lazy, Suspense } from 'react';

const queryClient = new QueryClient();

// Lazy load components
const Contacts = lazy(() => import('./pages/Contacts'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Invoices = lazy(() => import('./pages/Invoices'));
const FindLeads = lazy(() => import('./pages/FindLeads'));
const SupplementTracking = lazy(() => import('./pages/SupplementTracking'));
const Tasks = lazy(() => import('./pages/Tasks'));
const InsuranceMortgageTracker = lazy(() => import('./pages/InsuranceMortgageTracker'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const SmartSupplement = lazy(() => import('./pages/SmartSupplement'));
const DamageDetection = lazy(() => import('./pages/DamageDetection'));
const DocumentHub = lazy(() => import('./pages/DocumentHub'));
const Inspections = lazy(() => import('./pages/Inspections'));
const InspectionReport = lazy(() => import('./pages/InspectionReport'));
const DocumentEditor = lazy(() => import('./pages/DocumentEditor'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, userRole } = useSupabaseAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </SupabaseAuthProvider>
    </Router>
  </QueryClientProvider>
);

const AppContent = () => {
  const { session, logout } = useSupabaseAuth();

  return (
    <div className={session ? "flex h-screen bg-gray-100" : ""}>
      {session && <Navigation onLogout={logout} />}
      <main className={session ? "flex-1 overflow-y-auto p-8" : ""}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/find-leads" element={<ProtectedRoute><FindLeads /></ProtectedRoute>} />
            <Route path="/supplement-tracking" element={<ProtectedRoute><SupplementTracking /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/insurance-mortgage-tracker" element={<ProtectedRoute><InsuranceMortgageTracker /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/smart-supplement" element={<ProtectedRoute><SmartSupplement /></ProtectedRoute>} />
            <Route path="/damage-detection" element={<ProtectedRoute><DamageDetection /></ProtectedRoute>} />
            <Route path="/document-hub" element={<ProtectedRoute><DocumentHub /></ProtectedRoute>} />
            <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
            <Route path="/inspection-report" element={<ProtectedRoute><InspectionReport /></ProtectedRoute>} />
            <Route path="/document-editor" element={<ProtectedRoute><DocumentEditor /></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
