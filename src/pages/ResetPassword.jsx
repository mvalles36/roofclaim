import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // To handle query params like access_token
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams(); // To get access_token from URL

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    if (!accessToken) {
      setError('Invalid or missing reset token.');
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const accessToken = searchParams.get('access_token');
      if (!accessToken) {
        throw new Error('Invalid or missing reset token.');
      }

      // Update the password using Supabase auth.updateUser method with the token
      const { error } = await supabase.auth.updateUser({
        password,
        access_token: accessToken,  // Pass the access_token here
      });

      if (error) throw error;
      setMessage('Your password has been reset successfully.');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login page after success
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
          <Alert className="mb-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
