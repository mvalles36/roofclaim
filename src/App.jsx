import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
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
import Contacts from './pages/Contacts';
import SupplementTracking from './pages/SupplementTracking';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, userRole, loading } = useSupabaseAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" />;

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
            <div className="flex h-screen bg-gray-100">
              <Navigation />
              <main className="flex-1 overflow-y-auto p-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        {({ userRole }) => {
                          if (userRole === 'admin') return <AdminDashboard />;
                          if (userRole === 'employee') return <EmployeeDashboard />;
                          return <CustomerDashboard />;
                        }}
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/inspection-scheduling" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><InspectionScheduling /></ProtectedRoute>} />
                  <Route path="/inspection-report" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><InspectionReport /></ProtectedRoute>} />
                  <Route path="/claim-management" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><ClaimManagement /></ProtectedRoute>} />
                  <Route path="/installation-tracking" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><InstallationTracking /></ProtectedRoute>} />
                  <Route path="/policy-comparison" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><PolicyComparison /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/find-leads" element={<ProtectedRoute allowedRoles={['admin']}><FindLeads /></ProtectedRoute>} />
                  <Route path="/contacts" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><Contacts /></ProtectedRoute>} />
                  <Route path="/supplement-tracking" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><SupplementTracking /></ProtectedRoute>} />
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