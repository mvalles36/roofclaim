import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import AppRouter from './router'; // Import the AppRouter
import Navigation from './components/Navigation'; // Import the Navigation component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          <AppRouter />
        </main>
      </div>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;