import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data.user) {
        console.log('User created:', data.user);

        // Check if the user was added to the database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user from database:', userError);
          
          // If user not found, try to create them in the database
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              { id: data.user.id, email: data.user.email, role: 'homeowner' }
            ])
            .single();

          if (createError) {
            console.error('Error creating user in database:', createError);
            throw new Error('Failed to create user in database');
          } else {
            console.log('User created in database:', newUser);
          }
        } else {
          console.log('User found in database:', userData);
        }

        setSuccess(true);

        // Manually send confirmation email
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });

        if (resendError) {
          console.error('Error sending confirmation email:', resendError);
          throw new Error('Failed to send confirmation email');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
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