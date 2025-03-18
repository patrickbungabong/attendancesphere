
import React from 'react';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Payment } from '@/types';

interface PaymentProofDialogProps {
  payment: Payment | null;
  onClose: () => void;
}

export const PaymentProofDialog: React.FC<PaymentProofDialogProps> = ({
  payment,
  onClose,
}) => {
  if (!payment) return null;

  return (
    <Dialog open={!!payment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Proof</DialogTitle>
          <DialogDescription>
            Payment for {format(parseISO(payment.date), 'MMMM dd, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center p-4">
          {payment.proofImageUrl && (
            <img 
              src={payment.proofImageUrl} 
              alt="Payment Proof"
              className="max-w-full rounded-md shadow-sm"
            />
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
