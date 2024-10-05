import React from 'react';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import AppRouter from './router';
import { Toaster } from "@/components/ui/sonner";

const App = () => (
  <SupabaseAuthProvider>
    <AppRouter />
    <Toaster />
  </SupabaseAuthProvider>
);

export default App;