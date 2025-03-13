
export type UserRole = 'teacher' | 'admin' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  status: SessionStatus;
  attendanceConfirmed: boolean;
  paymentStatus: 'pending' | 'paid' | 'partially-paid';
  notes?: string;
  cancelledBy?: 'teacher' | 'student' | 'admin';
  cancelReason?: string;
}

export type PaymentMethod = 'cash' | 'bank-transfer' | 'gcash';

export interface Payment {
  id: string;
  sessionId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  proofImageUrl?: string;
  notes?: string;
  adminFee: number;
  teacherFee: number;
}

export interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  upcomingSessions: number;
  totalEarnings: number;
  weeklyEarnings: number;
  dailyEarnings: number;
}
