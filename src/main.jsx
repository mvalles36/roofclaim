import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import "./index.css";
import router from './router';
import { CLERK_PUBLISHABLE_KEY } from "./config/env.js";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>Error: {this.state.error.toString()}</p>
          <p>Please check the console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const Root = () => {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error("Clerk Publishable Key is missing");
    return <div>Error: Clerk Publishable Key is missing. Please check your environment variables.</div>;
  }

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);