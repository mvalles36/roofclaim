import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from './router';
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
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