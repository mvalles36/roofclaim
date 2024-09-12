import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth'; // Updated import path
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InspectionScheduling from './pages/InspectionScheduling';
import InspectionReport from './pages/InspectionReport';
import ClaimManagement from './pages/ClaimManagement';
import InstallationTracking from './pages/InstallationTracking';
import PolicyComparison from './pages/PolicyComparison';
import Calendar from './pages/Calendar';
import FindLeads from './pages/FindLeads';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, loading } = useSupabaseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  const userRole = session.user.role; // Adjust according to how you store role in session

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SupabaseAuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        {({ session }) => {
                          const userRole = session?.user?.role;
                          if (userRole === 'admin') return <AdminDashboard />;
                          if (userRole === 'employee') return <EmployeeDashboard />;
                          if (userRole === 'customer') return <CustomerDashboard />;
                          return <div>Loading user role...</div>;
                        }}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute>
                        <Calendar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inspection-scheduling"
                    element={
                      <ProtectedRoute>
                        <InspectionScheduling />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inspection-report"
                    element={
                      <ProtectedRoute>
                        <InspectionReport />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/claim-management"
                    element={
                      <ProtectedRoute>
                        <ClaimManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/installation-tracking"
                    element={
                      <ProtectedRoute>
                        <InstallationTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/policy-comparison"
                    element={
                      <ProtectedRoute>
                        <PolicyComparison />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/find-leads"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <FindLeads />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;