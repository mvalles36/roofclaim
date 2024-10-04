import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'; // Import BrowserRouter as Router
import CustomRouter from './router';  // Renamed this to avoid conflict
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Navigation />
          <main className="flex-1 overflow-y-auto p-8">
            <Switch>
              <Route path="/login" component={Login} />  {/* Fixed component reference */}
              <ProtectedRoute path="/dashboard" component={Dashboard} /> {/* Fixed component reference */}
              <Redirect from="/" to="/login" /> {/* Redirect root to login */}
              <Route path="*" component={() => <div>404 Page Not Found</div>} />
            </Switch>
          </main>
        </div>
      </Router>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
