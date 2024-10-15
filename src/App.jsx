import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { CLERK_PUBLISHABLE_KEY } from './config/env';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

const App = () => {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error("Clerk Publishable Key is missing");
    return <div>Error: Clerk Publishable Key is missing. Please check your environment variables.</div>;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Navigation />
        <Outlet />
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;