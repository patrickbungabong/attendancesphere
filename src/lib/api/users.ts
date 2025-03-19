
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
    // First get the user from auth.users
    const { data: authUser, error: authError } = await supabase
      .auth.admin.getUserByEmail(email);
    
    if (authError) throw authError;
    if (!authUser) throw new Error('User not found');
    
    // Then get the profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (error) throw error;
    
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
