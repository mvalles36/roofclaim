import React from 'react';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import AppRouter from './router';

const App = () => (
  <SupabaseAuthProvider>
    <AppRouter />
  </SupabaseAuthProvider>
);

export default App;