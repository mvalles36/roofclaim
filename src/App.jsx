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
import ClientPortal from './pages/ClientPortal';
import { lazy, Suspense } from 'react';

// Initialize React Query Client
const queryClient = new QueryClient();

// Lazy load components with error boundary
const loadable = (importFunc) => {
  return lazy(() =>
    importFunc().catch((error) => {
      console.error('Failed to load component', error);
      return { default: () => <div>Error loading component.</div> };
    })
  );
};

// Lazy loaded components
const Contacts = loadable(() => import('./pages/Contacts'));
const Jobs = loadable(() => import('./pages/Jobs'));
const Invoices = loadable(() => import('./pages/Invoices'));
const FindLeads = loadable(() => import('./pages/FindLeads'));
const SupplementTracking = loadable(() => import('./pages/SupplementTracking'));
const Tasks = loadable(() => import('./pages/Tasks'));
const InsuranceMortgageTracker = loadable(() => import('./pages/InsuranceMortgageTracker'));
const Profile = loadable(() => import('./pages/Profile'));
const Settings = loadable(() => import('./pages/Settings'));
const SmartSupplement = loadable(() => import('./pages/SmartSupplement'));
const DamageDetection = loadable(() => import('./pages/DamageDetection'));
const DocumentHub = loadable(() => import('./pages/DocumentHub'));
const InspectionReport = loadable(() => import('./pages/InspectionReport'));
const DocumentEditor = loadable(() => import('./pages/components/DocumentEditor'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, userRole } = useSupabaseAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
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
    <div className="flex h-screen bg-gray-100">
      {session && <Navigation onLogout={logout} />}
      <main className={session ? "flex-1 overflow-y-auto p-8" : "w-full"}>
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
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
            <Route path="/inspection-report" element={<ProtectedRoute><InspectionReport /></ProtectedRoute>} />
            <Route path="/document-editor" element={<ProtectedRoute><DocumentEditor /></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/client-portal/:contactId" element={<ClientPortal />} />
            <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
