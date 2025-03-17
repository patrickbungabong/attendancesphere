
import { supabase, handleSupabaseError } from '../supabase';
import { User } from '@/types';

export const getUsers = async (): Promise<{ data: User[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const users: User[] = data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as any,
      avatar: data.avatar || undefined
    };
    
    return { data: user, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
