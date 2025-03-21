
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { getSessions, getSessionsByTeacher } from '@/lib/api/sessions';
import { getStudents } from '@/lib/api/students';
import { getUsers } from '@/lib/api/users';
import { useQuery } from '@tanstack/react-query';
import { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateSessionModal } from '@/components/modals/CreateSessionModal';
import { toast } from '@/hooks/use-toast';

// Import our new components
import { SessionFilters } from '@/components/sessions/SessionFilters';
import { SessionsTable } from '@/components/sessions/SessionsTable';
import { SessionPaymentsDialog } from '@/components/sessions/SessionPaymentsDialog';
import { CancelSessionDialog } from '@/components/sessions/CancelSessionDialog';
import { useSessionFilters } from '@/hooks/use-session-filters';

const SessionsPage: React.FC = () => {
  const { user } = useAuth();
  const [cancelReason, setCancelReason] = useState('');
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  
  // State for session payments dialog
  const [showSessionPayments, setShowSessionPayments] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Fetch sessions with React Query
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['sessions', user?.id, user?.role],
    queryFn: async () => {
      if (user?.role === 'teacher') {
        const { data, error } = await getSessionsByTeacher(user.id);
        if (error) throw new Error(error.message);
        return data || [];
      } else {
        const { data, error } = await getSessions();
        if (error) throw new Error(error.message);
        return data || [];
      }
    },
    enabled: !!user
  });
  
  // Fetch teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await getUsers();
      if (error) throw new Error(error.message);
      return data?.filter(u => u.role === 'teacher') || [];
    },
    enabled: user?.role !== 'teacher'
  });
  
  // Fetch students
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await getStudents();
      if (error) throw new Error(error.message);
      return data || [];
    }
  });
  
  // Use our new hooks for filtering
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    teacherFilter,
    setTeacherFilter,
    studentFilter,
    setStudentFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    showFilters,
    setShowFilters,
    clearFilters,
    filteredSessions
  } = useSessionFilters(sessions);
  
  // Handler for viewing session payments
  const handleViewSessionPayments = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowSessionPayments(true);
  };
  
  const handleMarkAttendance = (session: Session) => {
    toast({
      title: 'Attendance Confirmed',
      description: `Attendance for ${session.studentName} has been confirmed.`,
    });
  };
  
  const handleConfirmTeacherAttendance = (session: Session) => {
    if (user?.role === 'teacher') {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'Only admins and owners can confirm teacher attendance.',
      });
      return;
    }
    
    toast({
      title: 'Teacher Attendance Confirmed',
      description: `Teacher attendance for ${session.teacherName} has been confirmed.`,
    });
  };
  
  const handleConfirmPayment = (session: Session) => {
    if (user?.role !== 'teacher' && session.teacherId !== user?.id) {
      toast({
        title: 'Payment Confirmed',
        description: `Payment for this session has been confirmed by ${session.teacherName}.`,
      });
      return;
    }
    
    toast({
      title: 'Payment Confirmed',
      description: `You have confirmed receiving payment for this session.`,
    });
  };
  
  const handleCancelSession = (session: Session, reason: string) => {
    toast({
      title: 'Session Cancelled',
      description: `Session with ${session.studentName} has been cancelled. Reason: ${reason}`,
    });
    setCancelReason('');
  };
  
  const handleCreateSession = () => {
    setShowCreateSessionModal(true);
  };

  const handleRescheduleSession = (session: Session) => {
    toast({
      title: 'Reschedule Session',
      description: `Session with ${session.studentName} is being rescheduled.`,
    });
  };

  // Render the cancel dialog with the current session
  const renderCancelDialog = (session: Session) => (
    <CancelSessionDialog
      session={session}
      cancelReason={cancelReason}
      setCancelReason={setCancelReason}
      onCancel={() => setCancelReason('')}
      onConfirm={handleCancelSession}
    />
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sessions</h1>
        
        {(user?.role === 'admin') && (
          <Button onClick={handleCreateSession}>
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters Component */}
          <SessionFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            teacherFilter={teacherFilter}
            setTeacherFilter={setTeacherFilter}
            studentFilter={studentFilter}
            setStudentFilter={setStudentFilter}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearFilters={clearFilters}
            teachers={teachers}
            students={students}
            user={user}
          />
          
          {/* Sessions Table Component */}
          <SessionsTable
            sessions={filteredSessions}
            isLoading={isLoadingSessions}
            user={user}
            onMarkAttendance={handleMarkAttendance}
            onConfirmTeacherAttendance={handleConfirmTeacherAttendance}
            onConfirmPayment={handleConfirmPayment}
            onReschedule={handleRescheduleSession}
            onViewPayments={handleViewSessionPayments}
            renderCancelDialog={renderCancelDialog}
          />
        </CardContent>
      </Card>
      
      {/* Create Session Modal */}
      <CreateSessionModal
        open={showCreateSessionModal}
        onOpenChange={setShowCreateSessionModal}
      />
      
      {/* Session Payments Dialog */}
      <SessionPaymentsDialog
        open={showSessionPayments}
        onOpenChange={setShowSessionPayments}
        sessionId={selectedSessionId}
        sessions={sessions}
      />
    </div>
  );
};

export default SessionsPage;
