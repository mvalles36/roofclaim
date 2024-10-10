import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router';
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;