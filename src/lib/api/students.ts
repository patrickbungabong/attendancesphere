
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

export const createStudent = async (student: Omit<Student, 'id'>): Promise<{ data: Student | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        name: student.name,
        email: student.email,
        phone: student.phone
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const newStudent: Student = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined
    };
    
    return { data: newStudent, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const updateStudent = async (id: string, student: Partial<Student>): Promise<{ data: Student | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update({
        name: student.name,
        email: student.email,
        phone: student.phone
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const updatedStudent: Student = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined
    };
    
    return { data: updatedStudent, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const deleteStudent = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error).error };
  }
};
