import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from './router';
import { Toaster } from "@/components/ui/sonner";
import { CLERK_PUBLISHABLE_KEY } from './config/env';

const queryClient = new QueryClient();

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

const App = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;