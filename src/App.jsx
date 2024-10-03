import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Navigation from './components/Navigation';
import Router from './Router'; // Import the new Router component

// Create a QueryClient instance
const queryClient = new QueryClient();

// Lazy load components
const loadable = (importFunc) => {
  return lazy(() =>
    importFunc().then((module) => ({ default: module.default }))
  );
};

// Error boundary component to catch errors in lazy-loaded components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children; 
  }
}

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

// AppContent component to handle layout
const AppContent = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {session && <Navigation />}
      <main className={`flex-1 overflow-y-auto p-8 ${!session ? 'w-full' : ''}`}>
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <ErrorBoundary>
            <Router /> {/* Use the Router component here */}
          </ErrorBoundary>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
