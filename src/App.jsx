import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router';
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <Router>
      <AppRouter />
      <Toaster />
    </Router>
  );
};

export default App;