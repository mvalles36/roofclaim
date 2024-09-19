import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate();
  const { session, login } = useSupabaseAuth();

  useEffect(() => {
    if (session) {
      navigate('/'); // Redirect to dashboard if session is active
    }
  }, [session, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setLoading(true); // Set loading state to true when login is processing
    try {
      const { error } = await login(email, password);
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message); // Set error state if login fails
    } finally {
      setLoading(false); // Always reset loading state after login attempt
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">roofClaim Login</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show error alert if there is an error */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={loading} // Disable input during loading
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              disabled={loading} // Disable input during loading
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Show different text when loading */}
          </Button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <Link to="/forgot-password" className="text-blue-600 hover:underline block">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-blue-600 hover:underline block">
            Need to register? Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
