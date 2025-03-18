
import React from 'react';
import { format, parseISO } from 'date-fns';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Session } from '@/types';

interface SessionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string | null;
  sessions: Session[];
}

export const SessionDetailsDialog: React.FC<SessionDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  sessionId,
  sessions
}) => {
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>
            Information about the session this payment is for
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-base">{format(parseISO(session.date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-base">{session.startTime} - {session.endTime}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student</p>
              <p className="text-base">{session.studentName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teacher</p>
              <p className="text-base">{session.teacherName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Session Status</p>
              <div className="mt-1">
                <StatusBadge status={session.status} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
              <div className="mt-1">
                <StatusBadge status={session.paymentStatus} />
              </div>
            </div>
          </div>
          
          {session.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-base">{session.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
