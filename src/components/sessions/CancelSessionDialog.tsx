
import React from 'react';
import { Session } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface CancelSessionDialogProps {
  session: Session;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  onCancel: () => void;
  onConfirm: (session: Session, reason: string) => void;
}

export const CancelSessionDialog: React.FC<CancelSessionDialogProps> = ({
  session,
  cancelReason,
  setCancelReason,
  onCancel,
  onConfirm,
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Session</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel this session with {session.studentName}?
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        <Label htmlFor="reason">Reason for cancellation</Label>
        <Textarea 
          id="reason" 
          placeholder="Please provide a reason..." 
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="mt-2"
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onConfirm(session, cancelReason)}
          disabled={!cancelReason.trim()}
        >
          Confirm Cancellation
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
