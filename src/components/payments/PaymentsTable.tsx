
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Eye, MoreVertical } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Payment, Session } from '@/types';

interface PaymentsTableProps {
  payments: Payment[];
  sessions: Session[];
  isLoading: boolean;
  onViewSession: (sessionId: string) => void;
  onViewPaymentProof: (payment: Payment) => void;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  sessions,
  isLoading,
  onViewSession,
  onViewPaymentProof,
}) => {
  const getSessionDetails = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Proof</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Loading payments...
              </TableCell>
            </TableRow>
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => {
              const session = getSessionDetails(payment.sessionId);
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(parseISO(payment.date), 'MMM dd, yyyy')}
                  </TableCell>
                  
                  <TableCell>{session?.studentName || 'Unknown'}</TableCell>
                  
                  <TableCell>{session?.teacherName || 'Unknown'}</TableCell>
                  
                  <TableCell>
                    <div className="font-medium">₱{payment.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      Admin: ₱{payment.adminFee.toLocaleString()} | Teacher: ₱{payment.teacherFee.toLocaleString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="capitalize">{payment.method.replace('-', ' ')}</span>
                  </TableCell>
                  
                  {/* Session Button Column */}
                  <TableCell>
                    {session ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center text-primary text-xs h-6"
                        onClick={() => onViewSession(session.id)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        View Session
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not Available</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {payment.proofImageUrl ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center text-primary"
                        onClick={() => onViewPaymentProof(payment)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Payment</DropdownMenuItem>
                        <DropdownMenuItem>Upload Proof</DropdownMenuItem>
                        {session && (
                          <DropdownMenuItem onClick={() => onViewSession(session.id)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Session
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
