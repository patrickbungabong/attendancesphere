
import { supabase, handleSupabaseError } from '../supabase';
import { Teacher } from '@/types';

export const getTeachers = async (): Promise<{ data: Teacher[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const teachers: Teacher[] = data.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      number: teacher.number || undefined
    }));
    
    return { data: teachers, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getTeacherById = async (id: string): Promise<{ data: Teacher | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const teacher: Teacher = {
      id: data.id,
      name: data.name,
      email: data.email,
      number: data.number || undefined
    };
    
    return { data: teacher, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const createTeacher = async (teacher: Omit<Teacher, 'id'>): Promise<{ data: Teacher | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .insert([{
        name: teacher.name,
        email: teacher.email,
        number: teacher.number
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const newTeacher: Teacher = {
      id: data.id,
      name: data.name,
      email: data.email,
      number: data.number || undefined
    };
    
    return { data: newTeacher, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const updateTeacher = async (id: string, teacher: Partial<Teacher>): Promise<{ data: Teacher | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({
        name: teacher.name,
        email: teacher.email,
        number: teacher.number
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const updatedTeacher: Teacher = {
      id: data.id,
      name: data.name,
      email: data.email,
      number: data.number || undefined
    };
    
    return { data: updatedTeacher, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const deleteTeacher = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error).error };
  }
};
