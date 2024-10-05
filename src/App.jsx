import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import AppRouter from './router'; // Import the AppRouter

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <AppRouter />
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;