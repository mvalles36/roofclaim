import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn({ email, password });
    if (!error) {
      navigate('/'); // Redirect to home on successful login
    } else {
      alert(error.message); // Handle error (better to use a toast notification)
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="mb-4 text-2xl">Login</h2>
        <div>
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2 mb-4"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full p-2 mb-4"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
