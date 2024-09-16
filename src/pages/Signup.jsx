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
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Step 2: Use the add_user_with_role function to create the user in the database
        const { data, error: insertError } = await supabase.rpc('add_user_with_role', {
          new_user_id: authData.user.id,
          new_user_email: email,
          new_user_name: name,
          new_user_role: 'sales' // Default role for signup
        });

        if (insertError) throw insertError;

        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } else {
        throw new Error('User object not found in auth response');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);

      if (error.message.includes('duplicate key value violates unique constraint')) {
        setError(`Looks like your email is already on the VIP list! Try logging in instead—you've been here before!`);
      } else if (error.message.includes('invalid email')) {
        setError(`Uh-oh, looks like that's not a real email. Did you accidentally type in your grocery list? Give it another go!`);
      } else if (error.message.includes('password')) {
        setError(`Your password needs at least 6 characters. We promise, it's worth the extra keystrokes!`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Something weird just happened!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            You're in! 🎉 Check your email for the magic link to complete your registration. We'll see you on the inside!
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
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
        Already Registered? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
