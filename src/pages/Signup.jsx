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
  const [name, setName] = useState('');
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

      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            id: userId,
            name: name
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      console.log('Auth signup successful:', authData);

      if (authData.user) {
        // Step 2: Insert user in the database
        const { data: userData, error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              id: userId, 
              email: email,
              name: name,
              role: 'homeowner',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select();

        if (insertError) {
          console.error('Error inserting user in database:', insertError);
          throw new Error('Failed to create user in database: ' + insertError.message);
        }

        console.log('User inserted in database:', userData);

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
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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