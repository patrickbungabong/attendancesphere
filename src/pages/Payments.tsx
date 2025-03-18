
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PaymentMethod, Payment } from '@/types';
import { getPayments } from '@/lib/api/payments';
import { getSessions } from '@/lib/api/sessions';
import { useQuery } from '@tanstack/react-query';
import { RecordPaymentModal } from '@/components/modals/RecordPaymentModal';
import { SessionDetailsDialog } from '@/components/dialogs/SessionDetailsDialog';
import { PaymentProofDialog } from '@/components/dialogs/PaymentProofDialog';
import { PaymentFilters } from '@/components/payments/PaymentFilters';
import { PaymentsTable } from '@/components/payments/PaymentsTable';

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  
  // State for session details dialog
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
  
  // Handler for viewing session details
  const handleViewSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowSessionDetails(true);
  };

  const handleViewPaymentProof = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleClosePaymentProof = () => {
    setSelectedPayment(null);
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
          <PaymentFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
          />
          
          <PaymentsTable
            payments={filteredPayments}
            sessions={sessions}
            isLoading={isLoadingPayments}
            onViewSession={handleViewSession}
            onViewPaymentProof={handleViewPaymentProof}
          />
        </CardContent>
      </Card>
      
      {/* Payment Proof Dialog */}
      <PaymentProofDialog 
        payment={selectedPayment} 
        onClose={handleClosePaymentProof} 
      />
      
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
