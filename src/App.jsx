import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from './integrations/supabase/supabase';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeownerDashboard from './pages/HomeownerDashboard';
import InspectionScheduling from './pages/InspectionScheduling';
import InspectionReport from './pages/InspectionReport';
import ClaimManagement from './pages/ClaimManagement';
import InstallationTracking from './pages/InstallationTracking';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
    } else {
      setUserRole(data.role);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-100">
            <Navigation session={session} userRole={userRole} />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    session ? (
                      userRole === 'admin' ? (
                        <AdminDashboard />
                      ) : (
                        <HomeownerDashboard />
                      )
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/inspection-scheduling"
                  element={session ? <InspectionScheduling /> : <Navigate to="/login" />}
                />
                <Route
                  path="/inspection-report"
                  element={session ? <InspectionReport /> : <Navigate to="/login" />}
                />
                <Route
                  path="/claim-management"
                  element={session ? <ClaimManagement /> : <Navigate to="/login" />}
                />
                <Route
                  path="/installation-tracking"
                  element={session ? <InstallationTracking /> : <Navigate to="/login" />}
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;