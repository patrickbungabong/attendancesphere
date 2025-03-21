
import { Session, SessionStatus } from '@/types';

// Database to app model transformation function
export const transformDbSessionToAppSession = (dbSession: any): Session => ({
  id: dbSession.id,
  date: dbSession.date,
  startTime: dbSession.start_time,
  endTime: dbSession.end_time,
  teacherId: dbSession.teacher_id,
  teacherName: dbSession.teachers.name,
  studentId: dbSession.student_id,
  studentName: dbSession.students.name,
  status: dbSession.status as SessionStatus,
  attendanceConfirmed: dbSession.attendance_confirmed,
  paymentStatus: 'pending', // We'll compute this from payments table
  paymentConfirmedByTeacher: dbSession.payment_confirmed_by_teacher,
  cancelledBy: dbSession.cancelled_by as any || undefined,
  cancelReason: dbSession.cancel_reason || undefined,
  makeupSessionId: dbSession.makeup_session_id || undefined
});
