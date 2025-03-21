
import { supabase, handleSupabaseError } from '../../supabase';
import { Session } from '@/types';
import { transformDbSessionToAppSession } from './types';

/**
 * Create a new session
 */
export const createSession = async (sessionData: Omit<Session, 'id' | 'teacherName' | 'studentName'>): Promise<{ data: Session | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        date: sessionData.date,
        start_time: sessionData.startTime,
        end_time: sessionData.endTime,
        teacher_id: sessionData.teacherId,
        student_id: sessionData.studentId,
        status: sessionData.status,
        attendance_confirmed: sessionData.attendanceConfirmed,
        payment_confirmed_by_teacher: sessionData.paymentConfirmedByTeacher,
        cancelled_by: sessionData.cancelledBy,
        cancel_reason: sessionData.cancelReason,
        makeup_session_id: sessionData.makeupSessionId
      }])
      .select(`
        *,
        teachers:teacher_id(name),
        students:student_id(name)
      `)
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const session = transformDbSessionToAppSession(data);
    
    return { data: session, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Update an existing session
 */
export const updateSession = async (id: string, sessionData: Partial<Session>): Promise<{ data: Session | null; error: any }> => {
  try {
    const updateData: any = {};
    
    if (sessionData.date !== undefined) updateData.date = sessionData.date;
    if (sessionData.startTime !== undefined) updateData.start_time = sessionData.startTime;
    if (sessionData.endTime !== undefined) updateData.end_time = sessionData.endTime;
    if (sessionData.teacherId !== undefined) updateData.teacher_id = sessionData.teacherId;
    if (sessionData.studentId !== undefined) updateData.student_id = sessionData.studentId;
    if (sessionData.status !== undefined) updateData.status = sessionData.status;
    if (sessionData.attendanceConfirmed !== undefined) updateData.attendance_confirmed = sessionData.attendanceConfirmed;
    if (sessionData.paymentConfirmedByTeacher !== undefined) updateData.payment_confirmed_by_teacher = sessionData.paymentConfirmedByTeacher;
    if (sessionData.cancelledBy !== undefined) updateData.cancelled_by = sessionData.cancelledBy;
    if (sessionData.cancelReason !== undefined) updateData.cancel_reason = sessionData.cancelReason;
    if (sessionData.makeupSessionId !== undefined) updateData.makeup_session_id = sessionData.makeupSessionId;
    
    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        teachers:teacher_id(name),
        students:student_id(name)
      `)
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const session = transformDbSessionToAppSession(data);
    
    return { data: session, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

/**
 * Delete a session
 */
export const deleteSession = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error).error };
  }
};
