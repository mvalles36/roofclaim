import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { lazy, Suspense } from 'react';

const queryClient = new QueryClient();

const loadable = (importFunc) => {
  return lazy(() =>
    importFunc().then((module) => ({ default: module.default }))
  );
};

const Dashboard = loadable(() => import('./pages/Dashboard'));
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
const UserManagement = loadable(() => import('./pages/UserManagement'));
const ClientPortal = loadable(() => import('./pages/ClientPortal'));
const SalesGPT = loadable(() => import('./pages/SalesGPT'));
const Inbox = loadable(() => import('./pages/Inbox'));

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
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

const AppContent = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {session && <Navigation />}
      <main className={`flex-1 overflow-y-auto p-8 ${!session ? 'w-full' : ''}`}>
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
            <Route path="/client-portal" element={<ProtectedRoute><ClientPortal /></ProtectedRoute>} />
            <Route path="/sales-gpt" element={<ProtectedRoute><SalesGPT /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
