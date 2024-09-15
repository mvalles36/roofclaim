import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import SupplementSpecialistDashboard from './pages/SupplementSpecialistDashboard';
import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import Inspections from './pages/Inspections';
import InspectionReports from './pages/InspectionReports';
import InspectionReport from './pages/InspectionReport';
import FindLeads from './pages/FindLeads';
import Contacts from './pages/Contacts';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import SupplementTracking from './pages/SupplementTracking';
import Tasks from './pages/Tasks';
import InsuranceMortgageTracker from './pages/InsuranceMortgageTracker';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Invoices from './pages/Invoices';
import Jobs from './pages/Jobs';
import PolicyComparison from './pages/PolicyComparison';
import Claims from './pages/Claims';
import ClaimManagement from './pages/ClaimManagement';

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
                          if (userRole === 'sales') return <SalesDashboard />;
                          if (userRole === 'supplement_specialist') return <SupplementSpecialistDashboard />;
                          if (userRole === 'manager') return <ProjectManagerDashboard />;
                          return <Dashboard />;
                        }}
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/inspection-reports" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}><InspectionReports /></ProtectedRoute>} />
                  <Route path="/inspection-report" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}><InspectionReport /></ProtectedRoute>} />
                  <Route path="/claim-management" element={<ProtectedRoute allowedRoles={['admin', 'supplement_specialist']}><ClaimManagement /></ProtectedRoute>} />
                  <Route path="/claims" element={<ProtectedRoute allowedRoles={['admin', 'supplement_specialist']}><Claims /></ProtectedRoute>} />
                  <Route path="/find-leads" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager']}><FindLeads /></ProtectedRoute>} />
                  <Route path="/contacts" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}><Contacts /></ProtectedRoute>} />
                  <Route path="/supplement-tracking" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}><SupplementTracking /></ProtectedRoute>} />
                  <Route path="/tasks" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist' ]}><Tasks /></ProtectedRoute>} />
                  <Route path="/insurance-mortgage-tracker" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}><InsuranceMortgageTracker /></ProtectedRoute>} />
                  <Route path="/invoices" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}<Invoices /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/customers" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}<Customers /></ProtectedRoute>} />
                  <Route path="/jobs" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}<Jobs /></ProtectedRoute>} />
                  <Route path="/invoices" element={<ProtectedRoute allowedRoles={['admin', 'sales', 'manager', 'supplement_specialist']}<Invoices /></ProtectedRoute>} />
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
