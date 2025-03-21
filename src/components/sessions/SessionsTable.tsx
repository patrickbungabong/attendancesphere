
import React from 'react';
import { Session, User } from '@/types';
import { format, parseISO } from 'date-fns';
import { Check, X, CreditCard } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { SessionActions } from './SessionActions';

interface SessionsTableProps {
  sessions: Session[];
  isLoading: boolean;
  user: User | null;
  onMarkAttendance: (session: Session) => void;
  onConfirmTeacherAttendance: (session: Session) => void;
  onConfirmPayment: (session: Session) => void;
  onReschedule: (session: Session) => void;
  onViewPayments: (sessionId: string) => void;
  renderCancelDialog: (session: Session) => React.ReactNode;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  isLoading,
  user,
  onMarkAttendance,
  onConfirmTeacherAttendance,
  onConfirmPayment,
  onReschedule,
  onViewPayments,
  renderCancelDialog
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Student</TableHead>
            {user?.role !== 'teacher' && <TableHead>Teacher</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={user?.role !== 'teacher' ? 7 : 6} className="h-24 text-center">
                Loading sessions...
              </TableCell>
            </TableRow>
          ) : sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={user?.role !== 'teacher' ? 7 : 6} className="h-24 text-center">
                No sessions found.
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="font-medium">
                    {format(parseISO(session.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.startTime} - {session.endTime}
                  </div>
                </TableCell>
                
                <TableCell>{session.studentName}</TableCell>
                
                {user?.role !== 'teacher' && (
                  <TableCell>{session.teacherName}</TableCell>
                )}
                
                <TableCell>
                  <StatusBadge status={session.status} />
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={session.paymentStatus} />
                    {session.paymentConfirmedByTeacher && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Check className="h-3 w-3 mr-1 text-success" />
                        Confirmed by Teacher
                      </span>
                    )}
                    {/* View payment button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center mt-1 h-6 text-primary text-xs"
                      onClick={() => onViewPayments(session.id)}
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      View Payment
                    </Button>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {session.attendanceConfirmed ? (
                      <span className="text-xs flex items-center text-success">
                        <Check className="h-3 w-3 mr-1" />
                        Student Present
                      </span>
                    ) : (
                      <span className="text-xs flex items-center text-muted-foreground">
                        <X className="h-3 w-3 mr-1" />
                        Student Attendance
                      </span>
                    )}
                    
                    {(user?.role === 'admin' || user?.role === 'owner') && (
                      session.teacherAttendanceConfirmed ? (
                        <span className="text-xs flex items-center text-success">
                          <Check className="h-3 w-3 mr-1" />
                          Teacher Present
                        </span>
                      ) : (
                        <span className="text-xs flex items-center text-muted-foreground">
                          <X className="h-3 w-3 mr-1" />
                          Teacher Attendance
                        </span>
                      )
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <SessionActions 
                    session={session}
                    user={user}
                    onMarkAttendance={onMarkAttendance}
                    onConfirmTeacherAttendance={onConfirmTeacherAttendance}
                    onConfirmPayment={onConfirmPayment}
                    onReschedule={onReschedule}
                    onViewPayments={onViewPayments}
                    cancelDialogContent={renderCancelDialog(session)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
