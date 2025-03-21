
import React from 'react';
import { Session, Payment } from '@/types';
import { format, parseISO } from 'date-fns';
import { Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { getPaymentsBySessionId } from '@/lib/api/payments';

interface SessionPaymentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string | null;
  sessions: Session[];
}

export const SessionPaymentsDialog: React.FC<SessionPaymentsDialogProps> = ({ 
  open, 
  onOpenChange, 
  sessionId,
  sessions, 
}) => {
  const { data: sessionPayments = [] } = useQuery({
    queryKey: ['payments', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data } = await getPaymentsBySessionId(sessionId);
      return data || [];
    },
    enabled: !!sessionId && open
  });
  
  const session = sessions.find(s => s.id === sessionId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Session Payments</DialogTitle>
          <DialogDescription>
            {session ? (
              <span>Payments for session with {session.studentName} on {format(parseISO(session.date), 'MMMM dd, yyyy')}</span>
            ) : (
              <span>Session payments</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No payments found for this session.
                  </TableCell>
                </TableRow>
              ) : (
                sessionPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(parseISO(payment.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="capitalize">{payment.method.replace('-', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      {payment.confirmedByTeacher ? (
                        <span className="text-xs flex items-center text-success">
                          <Check className="h-3 w-3 mr-1" />
                          Confirmed by Teacher
                        </span>
                      ) : (
                        <span className="text-xs flex items-center text-muted-foreground">
                          <X className="h-3 w-3 mr-1" />
                          Not Confirmed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
