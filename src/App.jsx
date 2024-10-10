import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import AppRoutes from './router';
import { Toaster } from "@/components/ui/sonner";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  if (!clerkPubKey) {
    console.error("Missing Clerk Publishable Key");
    return <div>Error: Missing Clerk Publishable Key</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </ClerkProvider>
  );
};

export default App;