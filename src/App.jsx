// src/App.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Router from './router'; // import the router

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <div className="flex h-screen bg-gray-100">
        <Navigation />
        <main className="flex-1 overflow-y-auto p-8">
          <Router /> {/* use the Router here */}
        </main>
      </div>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
