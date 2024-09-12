import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';
import { HomeIcon, UsersIcon, ClipboardIcon, FileTextIcon } from "lucide-react";
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

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" />;

  const userRole = session.user.role;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" />;

  return children;
};

const Navigation = () => {
  const { session } = useSupabaseAuth();
  if (!session) return null;

  return (
    <nav className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/contacts" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <UsersIcon className="h-5 w-5" />
            <span>Contacts</span>
          </Link>
        </li>
        <li>
          <Link to="/inspection-scheduling" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <ClipboardIcon className="h-5 w-5" />
            <span>Inspections</span>
          </Link>
        </li>
        <li>
          <Link to="/claim-management" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FileTextIcon className="h-5 w-5" />
            <span>Supplements</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SupabaseAuthProvider>
          <BrowserRouter>
            <div className="flex">
              <Navigation />
              <main className="flex-1 ml-64 p-8">
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
                          return <CustomerDashboard />;
                        }}
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/contacts" element={<ProtectedRoute><div>Contacts Page</div></ProtectedRoute>} />
                  <Route path="/inspection-scheduling" element={<ProtectedRoute><InspectionScheduling /></ProtectedRoute>} />
                  <Route path="/inspection-report" element={<ProtectedRoute><InspectionReport /></ProtectedRoute>} />
                  <Route path="/claim-management" element={<ProtectedRoute><ClaimManagement /></ProtectedRoute>} />
                  <Route path="/installation-tracking" element={<ProtectedRoute><InstallationTracking /></ProtectedRoute>} />
                  <Route path="/policy-comparison" element={<ProtectedRoute><PolicyComparison /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/find-leads" element={<ProtectedRoute allowedRoles={['admin']}><FindLeads /></ProtectedRoute>} />
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