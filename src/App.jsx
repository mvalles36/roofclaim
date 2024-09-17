import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Customers from './pages/Customers';
import Jobs from './pages/Jobs';
import Invoices from './pages/Invoices';
import FindLeads from './pages/FindLeads';
import SupplementTracking from './pages/SupplementTracking';
import Tasks from './pages/Tasks';
import InsuranceMortgageTracker from './pages/InsuranceMortgageTracker';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PolicyComparison from './pages/PolicyComparison';
import Claims from './pages/Claims';
import ClaimManagement from './pages/ClaimManagement';
import DamageDetection from './pages/DamageDetection';
import DocumentHub from './pages/DocumentHub';
import Inspections from './pages/Inspections';
import InspectionReport from './pages/InspectionReport';

const queryClient = new QueryClient();

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

const AppRoutes = () => {
  const { session, logout } = useSupabaseAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {session ? (
        <div className="flex h-screen bg-gray-100">
          <Navigation onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/find-leads" element={<ProtectedRoute><FindLeads /></ProtectedRoute>} />
              <Route path="/supplement-tracking" element={<ProtectedRoute><SupplementTracking /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/insurance-mortgage-tracker" element={<ProtectedRoute><InsuranceMortgageTracker /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/policy-comparison" element={<ProtectedRoute><PolicyComparison /></ProtectedRoute>} />
              <Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
              <Route path="/claim-management" element={<ProtectedRoute><ClaimManagement /></ProtectedRoute>} />
              <Route path="/damage-detection" element={<ProtectedRoute><DamageDetection /></ProtectedRoute>} />
              <Route path="/document-hub" element={<ProtectedRoute><DocumentHub /></ProtectedRoute>} />
              <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
              <Route path="/inspection-report" element={<ProtectedRoute><InspectionReport /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
