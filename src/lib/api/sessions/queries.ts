
import { supabase, handleSupabaseError } from '../../supabase';
import { Session } from '@/types';
import { transformDbSessionToAppSession } from './types';

/**
 * Fetch all sessions
 */
export const getSessions = async (): Promise<{ data: Session[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        teachers:teacher_id(name),
        students:student_id(name)
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const sessions = data.map(transformDbSessionToAppSession);
    
    return { data: sessions, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Fetch sessions for a specific teacher
 */
export const getSessionsByTeacher = async (teacherId: string): Promise<{ data: Session[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        teachers:teacher_id(name),
        students:student_id(name)
      `)
      .eq('teacher_id', teacherId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const sessions = data.map(transformDbSessionToAppSession);
    
    return { data: sessions, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Fetch a single session by ID
 */
export const getSessionById = async (id: string): Promise<{ data: Session | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        teachers:teacher_id(name),
        students:student_id(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const session = transformDbSessionToAppSession(data);
    
    return { data: session, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
