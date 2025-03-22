
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getUserByEmail } from '@/lib/api/users';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured properly
    if (!isSupabaseConfigured()) {
      console.error("Supabase is not properly configured. Check your environment variables.");
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Authentication system is not properly configured. Contact administrator.',
      });
      setIsLoading(false);
      return;
    }

    // Set up the subscription for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          try {
            const email = session.user.email;
            if (email) {
              const { data: userData, error } = await getUserByEmail(email);
              if (userData && !error) {
                console.log('User data fetched successfully:', userData.name);
                setUser(userData);
              } else {
                console.error('Failed to fetch user data after sign in:', error);
                toast({
                  variant: 'destructive',
                  title: 'Error',
                  description: 'Failed to load user profile',
                });
              }
            }
          } catch (error) {
            console.error('Error during auth state change handling:', error);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    // THEN check the current session
    const checkSession = async () => {
      try {
        console.log('Checking current session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Found existing session for:', session.user.email);
          // We have a session, get the user profile
          const { data: userData, error } = await getUserByEmail(session.user.email);
          if (userData && !error) {
            console.log('User profile loaded from session:', userData.name);
            setUser(userData);
          } else {
            console.error("Session exists but user not found in database:", error);
            await supabase.auth.signOut();
          }
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Failed to check your authentication status',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Authentication system is not properly configured. Contact administrator.',
      });
      return { error: 'Configuration error' };
    }
    
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        console.error('Authentication error:', authError);
        throw authError;
      }
      
      // Get user profile from database
      const { data: userData, error: userError } = await getUserByEmail(email);
      
      if (userError) {
        console.error('User data fetch error:', userError);
        throw userError;
      }
      
      if (userData) {
        console.log('Login successful for:', userData.name);
        setUser(userData);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${userData.name}!`,
        });
        return { data, error: null };
      } else {
        console.error('User not found in database after login');
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'User not found in the system',
        });
        // Sign out since we couldn't find the user in our database
        await supabase.auth.signOut();
        return { error: 'User not found' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An error occurred during login',
      });
      return { error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    if (!isSupabaseConfigured()) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Authentication system is not properly configured. Contact administrator.',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Register with Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. You can now log in.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration',
      });
      console.error('Signup error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const isSupabaseConfigured = () => {
    return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
