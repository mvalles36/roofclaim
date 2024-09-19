import { useState } from 'react';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Basic email validation function
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-4" aria-live="polite">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4" aria-live="polite">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !isValidEmail(email)}>
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
