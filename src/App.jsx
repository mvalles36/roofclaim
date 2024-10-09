import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import AppRouter from './router';
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  const { user } = useClerk();

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
};

export default App;