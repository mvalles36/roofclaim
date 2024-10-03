import React, { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      }
      setLoading(false); // Set loading to false after fetching session
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    console.log('Fetching role for user ID:', userId);
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error.message);
      setUserRole(null);
    } else {
      setUserRole(data.role);
    }
  };

  const signUp = async (data) => {
    const { user, error } = await supabase.auth.signUp(data);
    if (error) {
      console.error('Sign Up Error:', error.message);
      return { error };
    }
    
    // Assign default role only if user does not exist
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      const { error: roleError } = await supabase
        .from('users')
        .upsert({ id: user.id, role: 'sales' }); // Assign 'sales' role
    }

    return { user };
  };

  const value = {
    session,
    userRole,
    loading,
    signUp,
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    updateProfile: async (updates) => {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (!error && data) {
        await supabase.from('users').upsert({ id: data.user.id, ...updates });
      }
      return { data, error };
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children} {/* Show loading while fetching */}
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
  // Implement your Supabase Auth UI component here
  return <div>Supabase Auth UI</div>;
};
