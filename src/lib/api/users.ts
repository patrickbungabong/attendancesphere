
import { supabase, handleSupabaseError } from '../supabase';
import { User } from '@/types';

export const getUsers = async (): Promise<{ data: User[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const users: User[] = data.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role as any,
      avatar: user.avatar || undefined
    }));
    
    return { data: users, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getUserByEmail = async (email: string): Promise<{ data: User | null; error: any }> => {
  try {
    // Get the user from profiles table by email
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      // If not found in profiles, try to get from auth and then create a profile
      const { data: authUser } = await supabase.auth.getUser();
      
      if (authUser && authUser.user && authUser.user.email === email) {
        // User exists in auth but not in profiles, return basic data
        return { 
          data: {
            id: authUser.user.id,
            name: email.split('@')[0], // Use part of email as name
            email: email,
            role: 'user',
            avatar: undefined
          },
          error: null
        };
      }
      
      throw error;
    }
    
    // Transform from database schema to our app types
    const user: User = {
      id: data.id,
      name: data.name || email.split('@')[0], // Use part of email as name if not set
      email: email,
      role: data.role as any,
      avatar: data.avatar || undefined
    };
    
    return { data: user, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getCurrentUser = async (): Promise<{ data: User | null; error: any }> => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return { data: null, error: null };
    
    // Get profile data
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (error) throw error;
    
    const user: User = {
      id: authUser.id,
      name: data.name || authUser.email?.split('@')[0] || '',
      email: authUser.email || '',
      role: data.role as any,
      avatar: data.avatar || undefined
    };
    
    return { data: user, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
