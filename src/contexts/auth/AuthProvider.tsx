
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

    // Check if we have an active Supabase session
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // We have a session, get the user profile
          const { data: userData, error } = await getUserByEmail(session.user.email);
          if (userData && !error) {
            setUser(userData);
          } else {
            // Session exists but user not in database
            console.error("User authenticated but not found in database:", error);
            await supabase.auth.signOut();
          }
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
    
    // Set up the subscription for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const email = session.user.email;
          if (email) {
            const { data: userData, error } = await getUserByEmail(email);
            if (userData && !error) {
              setUser(userData);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
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
      return;
    }
    
    setIsLoading(true);
    try {
      // Authenticate with Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Get user profile from database
      const { data: userData, error: userError } = await getUserByEmail(email);
      
      if (userError) throw userError;
      
      if (userData) {
        setUser(userData);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${userData.name}!`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'User not found in the system',
        });
        // Sign out since we couldn't find the user in our database
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An error occurred during login',
      });
      console.error('Login error', error);
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
