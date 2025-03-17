
import { supabase, handleSupabaseError } from '../supabase';
import { Student } from '@/types';

export const getStudents = async (): Promise<{ data: Student[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const students: Student[] = data.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone || undefined
    }));
    
    return { data: students, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getStudentById = async (id: string): Promise<{ data: Student | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const student: Student = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined
    };
    
    return { data: student, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
