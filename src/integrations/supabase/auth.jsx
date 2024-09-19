import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase'; // Adjust path if needed
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';

// Create a context for Supabase authentication
const SupabaseAuthContext = createContext();

// Provider component that wraps your app and provides authentication state
export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to get the current session
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listener for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
      queryClient.invalidateQueries(['user']);
    });

    getSession();

    // Cleanup listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Function to fetch the user's role from the database
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserRole(data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUserRole(null);
      queryClient.invalidateQueries(['user']);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Function to update user profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', session?.user?.id); // Handle possible null session

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, userRole, loading, login, logout, updateProfile }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

// Custom hook to use Supabase authentication context
export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};

// Component to render Supabase Auth UI
export const SupabaseAuthUI = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{
      theme: ThemeSupa,
      style: {
        button: { backgroundColor: '#4A5568' },
        input: { borderColor: '#E2E8F0' },
      },
    }}
    theme="default"
    providers={['google', 'github']}
  />
);
