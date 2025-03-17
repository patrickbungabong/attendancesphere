
import { supabase, handleSupabaseError } from '../supabase';
import { Session, SessionStatus } from '@/types';

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
    const sessions: Session[] = data.map(session => ({
      id: session.id,
      date: session.date,
      startTime: session.start_time,
      endTime: session.end_time,
      teacherId: session.teacher_id,
      teacherName: session.teachers.name,
      studentId: session.student_id,
      studentName: session.students.name,
      status: session.status as SessionStatus,
      attendanceConfirmed: session.attendance_confirmed,
      teacherAttendanceConfirmed: session.teacher_attendance_confirmed,
      paymentStatus: session.payment_status as any,
      paymentConfirmedByTeacher: session.payment_confirmed_by_teacher,
      notes: session.notes || undefined,
      cancelledBy: session.cancelled_by as any || undefined,
      cancelReason: session.cancel_reason || undefined,
      rescheduleDate: session.reschedule_date || undefined,
      makeupSessionId: session.makeup_session_id || undefined
    }));
    
    return { data: sessions, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

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
    const sessions: Session[] = data.map(session => ({
      id: session.id,
      date: session.date,
      startTime: session.start_time,
      endTime: session.end_time,
      teacherId: session.teacher_id,
      teacherName: session.teachers.name,
      studentId: session.student_id,
      studentName: session.students.name,
      status: session.status as SessionStatus,
      attendanceConfirmed: session.attendance_confirmed,
      teacherAttendanceConfirmed: session.teacher_attendance_confirmed,
      paymentStatus: session.payment_status as any,
      paymentConfirmedByTeacher: session.payment_confirmed_by_teacher,
      notes: session.notes || undefined,
      cancelledBy: session.cancelled_by as any || undefined,
      cancelReason: session.cancel_reason || undefined,
      rescheduleDate: session.reschedule_date || undefined,
      makeupSessionId: session.makeup_session_id || undefined
    }));
    
    return { data: sessions, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

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
    const session: Session = {
      id: data.id,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      teacherId: data.teacher_id,
      teacherName: data.teachers.name,
      studentId: data.student_id,
      studentName: data.students.name,
      status: data.status as SessionStatus,
      attendanceConfirmed: data.attendance_confirmed,
      teacherAttendanceConfirmed: data.teacher_attendance_confirmed,
      paymentStatus: data.payment_status as any,
      paymentConfirmedByTeacher: data.payment_confirmed_by_teacher,
      notes: data.notes || undefined,
      cancelledBy: data.cancelled_by as any || undefined,
      cancelReason: data.cancel_reason || undefined,
      rescheduleDate: data.reschedule_date || undefined,
      makeupSessionId: data.makeup_session_id || undefined
    };
    
    return { data: session, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
