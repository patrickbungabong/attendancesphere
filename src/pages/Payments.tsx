
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { RecordPaymentModal } from '@/components/modals/RecordPaymentModal';
import { getPayments } from '@/lib/api/payments';
import { getSessions } from '@/lib/api/sessions';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { Search, Plus, Filter, MoreVertical, Eye, Calendar } from 'lucide-react';
import { PaymentMethod, Session, Payment } from '@/types';

// New component for viewing session details
const SessionDetailsDialog = ({ 
  open, 
  onOpenChange, 
  sessionId,
  sessions
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  sessionId: string | null,
  sessions: Session[]
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

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  
  // New state for session details dialog
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Fetch payments with React Query
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await getPayments();
      if (error) throw new Error(error.message);
      return data || [];
    }
  });
  
  // Fetch sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await getSessions();
      if (error) throw new Error(error.message);
      return data || [];
    }
  });
  
  // Filter payments based on search and method
  const filteredPayments = payments.filter(payment => {
    const session = sessions.find(s => s.id === payment.sessionId);
    if (!session) return false;
    
    const matchesSearch = 
      session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.date.includes(searchQuery);
    
    const matchesMethod = methodFilter ? payment.method === methodFilter : true;
    
    return matchesSearch && matchesMethod;
  });
  
  const handleCreatePayment = () => {
    setShowRecordPaymentModal(true);
  };
  
  const getSessionDetails = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId);
  };
  
  // Handler for viewing session details
  const handleViewSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowSessionDetails(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments</h1>
        
        <Button onClick={handleCreatePayment}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search payments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {methodFilter ? `Method: ${methodFilter}` : 'Filter by method'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setMethodFilter(null)}>
                  All Methods
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMethodFilter('cash')}>
                  Cash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMethodFilter('bank-transfer')}>
                  Bank Transfer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMethodFilter('gcash')}>
                  GCash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
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
                {isLoadingPayments ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => {
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
                              onClick={() => handleViewSession(session.id)}
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
                              onClick={() => setSelectedPayment(payment)}
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
                                <DropdownMenuItem onClick={() => handleViewSession(session.id)}>
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
        </CardContent>
      </Card>
      
      {/* Payment Proof Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <span>
                  Payment for {format(parseISO(selectedPayment.date), 'MMMM dd, yyyy')}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-4">
            {selectedPayment?.proofImageUrl && (
              <img 
                src={selectedPayment.proofImageUrl} 
                alt="Payment Proof"
                className="max-w-full rounded-md shadow-sm"
              />
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setSelectedPayment(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Session Details Dialog */}
      <SessionDetailsDialog
        open={showSessionDetails}
        onOpenChange={setShowSessionDetails}
        sessionId={selectedSessionId}
        sessions={sessions}
      />
      
      {/* Record Payment Modal */}
      <RecordPaymentModal
        open={showRecordPaymentModal}
        onOpenChange={setShowRecordPaymentModal}
      />
    </div>
  );
};

export default PaymentsPage;
