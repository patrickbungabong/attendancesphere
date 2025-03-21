
import React from 'react';
import { Session } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Check, 
  X, 
  MoreVertical, 
  UserCheck, 
  DollarSign, 
  FileEdit, 
  Trash, 
  Clock, 
  CreditCard 
} from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface SessionActionsProps {
  session: Session;
  user: any;
  onMarkAttendance: (session: Session) => void;
  onConfirmTeacherAttendance: (session: Session) => void;
  onConfirmPayment: (session: Session) => void;
  onReschedule: (session: Session) => void;
  onViewPayments: (sessionId: string) => void;
  cancelDialogContent: React.ReactNode;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  session,
  user,
  onMarkAttendance,
  onConfirmTeacherAttendance,
  onConfirmPayment,
  onReschedule,
  onViewPayments,
  cancelDialogContent
}) => {
  return (
    <div className="flex items-center space-x-2">
      {session.status === 'scheduled' && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onMarkAttendance(session)}
            title="Mark Student Attendance"
          >
            <Check className="h-4 w-4 text-success" />
          </Button>
          
          {(user?.role === 'admin' || user?.role === 'owner') && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onConfirmTeacherAttendance(session)}
              title="Mark Teacher Attendance"
            >
              <UserCheck className="h-4 w-4 text-success" />
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                title="Cancel Session"
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </DialogTrigger>
            {cancelDialogContent}
          </Dialog>
        </>
      )}

      {session.status === 'completed' && user?.role === 'teacher' && !session.paymentConfirmedByTeacher && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onConfirmPayment(session)}
          title="Confirm Payment Received"
        >
          <DollarSign className="h-4 w-4 text-success" />
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          
          {user?.role === 'admin' && (
            <>
              <DropdownMenuItem>
                <FileEdit className="h-4 w-4 mr-2" />
                Edit Session
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </DropdownMenuItem>
            </>
          )}
          
          {session.status === 'scheduled' && (
            <DropdownMenuItem onClick={() => onReschedule(session)}>
              <Clock className="h-4 w-4 mr-2" />
              Reschedule
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => onViewPayments(session.id)}>
            <CreditCard className="h-4 w-4 mr-2" />
            View Payments
          </DropdownMenuItem>
          
          {user?.role === 'admin' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Session
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
