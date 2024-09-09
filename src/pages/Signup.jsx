import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      console.log('Starting signup process...');

      // Generate a UUID for the user
      const userId = uuidv4();
      console.log('Generated UUID:', userId);

      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            id: userId // Include the UUID in the user metadata
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      console.log('Auth signup successful:', authData);

      if (authData.user) {
        // Step 2: Create user in the database
        const { data: userData, error: createError } = await supabase
          .from('users')
          .insert([
            { id: userId, email: authData.user.email, role: 'homeowner' }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user in database:', createError);
          throw new Error('Failed to create user in database: ' + createError.message);
        }

        console.log('User created in database:', userData);

        // Step 3: Manually send confirmation email
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });

        if (resendError) {
          console.error('Error sending confirmation email:', resendError);
          throw new Error('Failed to send confirmation email: ' + resendError.message);
        }

        setSuccess(true);
        console.log('Signup process completed successfully');
      } else {
        throw new Error('User object not found in auth response');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);

      // Additional error handling
      if (error.message.includes('duplicate key value violates unique constraint')) {
        setError('An account with this email already exists. Please try logging in.');
      } else if (error.message.includes('invalid email')) {
        setError('Please enter a valid email address.');
      } else if (error.message.includes('password')) {
        setError('Password must be at least 6 characters long.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Registration successful! Please check your email for confirmation.
            If you don't receive an email, please contact support.
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;