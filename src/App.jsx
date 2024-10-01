import React, { lazy, Suspense } from 'react';
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

// Create a QueryClient instance
const queryClient = new QueryClient();

// Lazy load components
const loadable = (importFunc) => {
  return lazy(() =>
    importFunc().then((module) => ({ default: module.default }))
  );
};

const Dashboard = loadable(() => import('./pages/Dashboard'));
const Contacts = loadable(() => import('./pages/Contacts'));
const Jobs = loadable(() => import('./pages/Jobs'));
const Invoices = loadable(() => import('./pages/Invoices'));
const FindProspects = loadable(() => import('./pages/FindProspects'));
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
const EmailInbox = loadable(() => import('./components/EmailInbox'));
const AdminDashboard = loadable(() => import('./pages/AdminDashboard'));
const ProjectManagerDashboard = loadable(() => import('./pages/ProjectManagerDashboard'));
const CustomerSuccessDashboard = loadable(() => import('./pages/CustomerSuccessDashboard'));
const SalesManagerDashboard = loadable(() => import('./pages/SalesManagerDashboard'));
const SalesDashboard = loadable(() => import('./pages/SalesDashboard'));
const WebsiteVisitors = loadable(() => import('./components/WebsiteVisitors'));
const ContractorPortal = loadable(() => import('./pages/ContractorPortal'));

// Error boundary component to catch errors in lazy-loaded components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children; 
  }
}

// Protected route component for role-based access control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, userRole } = useSupabaseAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to an Unauthorized page instead of the homepage
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Main App component
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

// AppContent component to handle routing and main layout
const AppContent = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {session && <Navigation />}
      <main className={`flex-1 overflow-y-auto p-8 ${!session ? 'w-full' : ''}`}>
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
              <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" replace />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/find-prospects" element={<ProtectedRoute allowedRoles={['sales', 'sales_manager', 'admin']}><FindProspects /></ProtectedRoute>} />
              <Route path="/supplement-tracking" element={<ProtectedRoute allowedRoles={['customer_success', 'admin']}><SupplementTracking /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/insurance-mortgage-tracker" element={<ProtectedRoute allowedRoles={['customer_success', 'admin']}><InsuranceMortgageTracker /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/smart-supplement" element={<ProtectedRoute allowedRoles={['customer_success', 'admin']}><SmartSupplement /></ProtectedRoute>} />
              <Route path="/damage-detection" element={<ProtectedRoute allowedRoles={['sales', 'sales_manager', 'admin']}><DamageDetection /></ProtectedRoute>} />
              <Route path="/document-hub" element={<ProtectedRoute><DocumentHub /></ProtectedRoute>} />
              <Route path="/inspection-report" element={<ProtectedRoute><InspectionReport /></ProtectedRoute>} />
              <Route path="/document-editor" element={<ProtectedRoute><DocumentEditor /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/client-portal" element={<ProtectedRoute allowedRoles={['customer']}><ClientPortal /></ProtectedRoute>} />
              <Route path="/contractor-portal" element={<ProtectedRoute allowedRoles={['contractor']}><ContractorPortal /></ProtectedRoute>} />
              <Route path="/sales-gpt" element={<ProtectedRoute><SalesGPT /></ProtectedRoute>} />
              <Route path="/inbox" element={<ProtectedRoute><EmailInbox /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/sales-manager-dashboard" element={<ProtectedRoute allowedRoles={['admin', 'sales_manager']}><SalesManagerDashboard /></ProtectedRoute>} />
              <Route path="/project-manager-dashboard" element={<ProtectedRoute allowedRoles={['admin', 'project_manager']}><ProjectManagerDashboard /></ProtectedRoute>} />
              <Route path="/sales-dashboard" element={<ProtectedRoute allowedRoles={['employee', 'admin', 'sales']}><SalesDashboard /></ProtectedRoute>} />
              <Route path="/customer-success-dashboard" element={<ProtectedRoute allowedRoles={['admin', 'customer_success']}><CustomerSuccessDashboard /></ProtectedRoute>} />
              <Route path="/website-visitors" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'sales_manager']}><WebsiteVisitors /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
