import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    // Example password validation: At least 8 characters, 1 uppercase, 1 lowercase, 1 digit
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check for empty fields
    if (!email || !password || !name) {
      setError('Please complete all fields.');
      setLoading(false);
      return;
    }

    // Validate password format
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, and 1 number.');
      setLoading(false);
      return;
    }

    try {
      // Call Supabase auth sign-up function
      const { data: { user }, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role: 'employee'  // Hardcode the role as employee
          }
        }
      });

      if (authError) throw authError;

      // Insert the new user into the 'users' table in the database
      if (user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert([{ 
            id: user.id, 
            email, 
            name, 
            role: 'employee', // Set the role in the users table as employee
            created_at: new Date(), 
            updated_at: new Date() 
          }]);

        if (dbError) throw dbError;

        // Show success notification
        toast.success('Account created successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Sign Up for RoofClaim
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full"
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
              disabled={loading}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, and 1 number.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUp;
