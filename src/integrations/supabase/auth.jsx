import React, { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session data:', session);
        setSession(session);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      console.log('Fetching role for user ID:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      console.log('Fetched user role:', data?.role);
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error.message);
      setUserRole(null);
    }
  };

  const signUp = async (data) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp(data);
      if (error) throw error;

      if (user) {
        const { error: roleError } = await supabase
          .from('users')
          .upsert({ id: user.id, role: 'sales' });

        if (roleError) throw roleError;
      }

      return { user };
    } catch (error) {
      console.error('Sign Up Error:', error.message);
      return { error };
    }
  };

  const signIn = async (data) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      return { user };
    } catch (error) {
      console.error('Sign In Error:', error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign Out Error:', error.message);
    }
  };

  const value = {
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile: async (updates) => {
      try {
        const { data, error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
        if (data) {
          await supabase.from('users').upsert({ id: data.user.id, ...updates });
        }
        return { data };
      } catch (error) {
        console.error('Update Profile Error:', error.message);
        return { error };
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthUI = () => {
  return <div>Supabase Auth UI</div>;
};