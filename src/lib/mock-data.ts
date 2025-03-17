
import { User, Student, Session, Payment, UserRole, SessionStatus } from '@/types';
import { format, subDays, addDays } from 'date-fns';

// Generate a random ID for our mock data
const generateId = () => Math.random().toString(36).substring(2, 11);

// Current users in the system
export const users: User[] = [
  { 
    id: 'teacher1', 
    name: 'Sara Johnson', 
    email: 'sara.j@example.com', 
    role: 'teacher',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  { 
    id: 'teacher2', 
    name: 'David Chen', 
    email: 'david.c@example.com', 
    role: 'teacher',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  { 
    id: 'admin1', 
    name: 'Alex Morgan', 
    email: 'alex.m@example.com', 
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  { 
    id: 'owner1', 
    name: 'Michael Santos', 
    email: 'michael.s@example.com', 
    role: 'owner',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  }
];

// Students in the system
export const students: Student[] = [
  { id: 'student1', name: 'Emma Wilson', email: 'emma.w@example.com', phone: '123-456-7890' },
  { id: 'student2', name: 'Noah Martinez', email: 'noah.m@example.com', phone: '123-456-7891' },
  { id: 'student3', name: 'Olivia Smith', email: 'olivia.s@example.com', phone: '123-456-7892' },
  { id: 'student4', name: 'Liam Brown', email: 'liam.b@example.com', phone: '123-456-7893' },
  { id: 'student5', name: 'Ava Johnson', email: 'ava.j@example.com', phone: '123-456-7894' },
  { id: 'student6', name: 'Ethan Davis', email: 'ethan.d@example.com', phone: '123-456-7895' },
];

// Generate mock sessions
const today = new Date();
const generateMockSessions = (): Session[] => {
  const sessions: Session[] = [];
  const statuses: SessionStatus[] = [
    'scheduled', 
    'completed', 
    'cancelled-by-teacher', 
    'cancelled-by-student', 
    'cancelled-by-admin', 
    'no-show', 
    'rescheduled',
    'pending-makeup'
  ];
  const paymentStatuses: Session['paymentStatus'][] = ['pending', 'paid', 'partially-paid'];
  
  // Past sessions (last 7 days)
  for (let i = 1; i <= 15; i++) {
    const date = format(subDays(today, Math.floor(Math.random() * 7) + 1), 'yyyy-MM-dd');
    const teacherId = Math.random() > 0.5 ? 'teacher1' : 'teacher2';
    const teacherName = teacherId === 'teacher1' ? 'Sara Johnson' : 'David Chen';
    const studentId = `student${Math.floor(Math.random() * 6) + 1}`;
    const studentName = students.find(s => s.id === studentId)?.name || 'Unknown Student';
    
    // For past sessions, don't use 'scheduled' status
    const statusIndex = Math.floor(Math.random() * (statuses.length - 1)) + 1;
    const status = statuses[statusIndex];
    const isCompleted = status === 'completed';
    
    sessions.push({
      id: generateId(),
      date,
      startTime: `${Math.floor(Math.random() * 8) + 9}:00`,
      endTime: `${Math.floor(Math.random() * 8) + 10}:00`,
      teacherId,
      teacherName,
      studentId,
      studentName,
      status,
      attendanceConfirmed: isCompleted,
      teacherAttendanceConfirmed: isCompleted && Math.random() > 0.3,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      paymentConfirmedByTeacher: isCompleted && Math.random() > 0.5,
      notes: Math.random() > 0.7 ? 'Some notes about the session' : undefined,
      cancelledBy: status.includes('cancelled') ? status.split('-by-')[1] as 'teacher' | 'student' | 'admin' : undefined,
      cancelReason: status.includes('cancelled') ? 'Schedule conflict' : undefined,
      rescheduleDate: status === 'rescheduled' ? format(addDays(today, Math.floor(Math.random() * 7) + 1), 'yyyy-MM-dd') : undefined
    });
  }
  
  // Today's sessions
  for (let i = 1; i <= 5; i++) {
    const date = format(today, 'yyyy-MM-dd');
    const teacherId = Math.random() > 0.5 ? 'teacher1' : 'teacher2';
    const teacherName = teacherId === 'teacher1' ? 'Sara Johnson' : 'David Chen';
    const studentId = `student${Math.floor(Math.random() * 6) + 1}`;
    const studentName = students.find(s => s.id === studentId)?.name || 'Unknown Student';
    const status = Math.random() > 0.5 ? 'scheduled' : 'completed';
    const isCompleted = status === 'completed';
    
    sessions.push({
      id: generateId(),
      date,
      startTime: `${Math.floor(Math.random() * 8) + 9}:00`,
      endTime: `${Math.floor(Math.random() * 8) + 10}:00`,
      teacherId,
      teacherName,
      studentId,
      studentName,
      status,
      attendanceConfirmed: isCompleted && Math.random() > 0.3,
      teacherAttendanceConfirmed: isCompleted && Math.random() > 0.3,
      paymentStatus: Math.random() > 0.5 ? 'paid' : 'pending',
      paymentConfirmedByTeacher: isCompleted && Math.random() > 0.5,
      notes: Math.random() > 0.7 ? 'Some notes about the session' : undefined
    });
  }
  
  // Future sessions (next 7 days)
  for (let i = 1; i <= 10; i++) {
    const date = format(addDays(today, Math.floor(Math.random() * 7) + 1), 'yyyy-MM-dd');
    const teacherId = Math.random() > 0.5 ? 'teacher1' : 'teacher2';
    const teacherName = teacherId === 'teacher1' ? 'Sara Johnson' : 'David Chen';
    const studentId = `student${Math.floor(Math.random() * 6) + 1}`;
    const studentName = students.find(s => s.id === studentId)?.name || 'Unknown Student';
    
    // For future sessions, use 'scheduled', 'rescheduled', or 'pending-makeup'
    const futureStatuses: SessionStatus[] = ['scheduled', 'rescheduled', 'pending-makeup'];
    const status = futureStatuses[Math.floor(Math.random() * futureStatuses.length)];
    
    sessions.push({
      id: generateId(),
      date,
      startTime: `${Math.floor(Math.random() * 8) + 9}:00`,
      endTime: `${Math.floor(Math.random() * 8) + 10}:00`,
      teacherId,
      teacherName,
      studentId,
      studentName,
      status,
      attendanceConfirmed: false,
      teacherAttendanceConfirmed: false,
      paymentStatus: 'pending',
      notes: Math.random() > 0.7 ? 'Some notes about the session' : undefined,
      rescheduleDate: status === 'rescheduled' ? format(addDays(today, Math.floor(Math.random() * 7) + 7), 'yyyy-MM-dd') : undefined
    });
  }
  
  return sessions;
};

export const sessions: Session[] = generateMockSessions();

// Generate mock payments
export const generateMockPayments = (): Payment[] => {
  const payments: Payment[] = [];
  const methods: Payment['method'][] = ['cash', 'bank-transfer', 'gcash'];
  
  const paidSessions = sessions.filter(s => s.paymentStatus === 'paid' || s.paymentStatus === 'partially-paid');
  
  paidSessions.forEach(session => {
    const amount = Math.floor(Math.random() * 4000) + 1000; // Random amount between 1000-5000
    const adminFee = 200;
    const teacherFee = amount - adminFee;
    
    payments.push({
      id: generateId(),
      sessionId: session.id,
      date: session.date,
      amount,
      method: methods[Math.floor(Math.random() * methods.length)],
      proofImageUrl: Math.random() > 0.5 ? 'https://placehold.co/400x300/png' : undefined,
      notes: Math.random() > 0.7 ? 'Payment received on time' : undefined,
      adminFee,
      teacherFee,
      confirmedByTeacher: Math.random() > 0.5
    });
    
    // Add partial payment for some sessions
    if (session.paymentStatus === 'partially-paid') {
      const partialAmount = Math.floor(amount * 0.5);
      const partialAdminFee = Math.min(adminFee, partialAmount);
      const partialTeacherFee = partialAmount - partialAdminFee;
      
      payments.push({
        id: generateId(),
        sessionId: session.id,
        date: format(subDays(new Date(session.date), 2), 'yyyy-MM-dd'),
        amount: partialAmount,
        method: methods[Math.floor(Math.random() * methods.length)],
        proofImageUrl: Math.random() > 0.5 ? 'https://placehold.co/400x300/png' : undefined,
        notes: 'Partial payment',
        adminFee: partialAdminFee,
        teacherFee: partialTeacherFee,
        confirmedByTeacher: Math.random() > 0.5
      });
    }
  });
  
  return payments;
};

export const payments: Payment[] = generateMockPayments();

// Helper functions
export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const getSessionsByTeacher = (teacherId: string): Session[] => {
  return sessions.filter(session => session.teacherId === teacherId);
};

export const getSessionsByStudent = (studentId: string): Session[] => {
  return sessions.filter(session => session.studentId === studentId);
};

export const getPaymentsBySession = (sessionId: string): Payment[] => {
  return payments.filter(payment => payment.sessionId === sessionId);
};

export const getTeacherStats = (teacherId: string) => {
  const teacherSessions = getSessionsByTeacher(teacherId);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = teacherSessions.filter(s => s.date === today);
  
  const totalEarnings = payments
    .filter(p => {
      const session = sessions.find(s => s.id === p.sessionId);
      return session && session.teacherId === teacherId;
    })
    .reduce((sum, payment) => sum + payment.teacherFee, 0);
  
  const todayEarnings = payments
    .filter(p => {
      const session = sessions.find(s => s.id === p.sessionId);
      return session && session.teacherId === teacherId && p.date === today;
    })
    .reduce((sum, payment) => sum + payment.teacherFee, 0);
  
  return {
    totalSessions: teacherSessions.length,
    completedSessions: teacherSessions.filter(s => s.status === 'completed').length,
    cancelledSessions: teacherSessions.filter(s => s.status.includes('cancelled')).length,
    todaySessions: todaySessions.length,
    upcomingSessions: teacherSessions.filter(s => 
      new Date(s.date) > new Date() && s.status === 'scheduled'
    ).length,
    totalEarnings,
    todayEarnings
  };
};

export const getCurrentUser = (): User => {
  // For demo purposes, we'll default to the teacher role
  return users[0];
};
