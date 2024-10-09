import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import AppRouter from './router';
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <AppRouter />
      <Toaster />
    </ClerkProvider>
  );
};

export default App;