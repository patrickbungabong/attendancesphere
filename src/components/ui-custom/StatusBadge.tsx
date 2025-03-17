
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SessionStatus } from '@/types';

interface StatusBadgeProps {
  status: SessionStatus | 'paid' | 'partially-paid' | 'pending';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let label: string;
  let variant: 'outline' | 'destructive' | 'default' | 'secondary' = 'default';
  
  // Session status badges
  if (status === 'scheduled') {
    label = 'Scheduled';
    variant = 'outline';
  } else if (status === 'completed') {
    label = 'Completed';
    variant = 'default';
  } else if (status === 'cancelled-by-teacher') {
    label = 'Cancelled by Teacher';
    variant = 'destructive';
  } else if (status === 'cancelled-by-student') {
    label = 'Cancelled by Student';
    variant = 'destructive';
  } else if (status === 'cancelled-by-admin') {
    label = 'Cancelled by Admin';
    variant = 'destructive';
  } else if (status === 'no-show') {
    label = 'No Show';
    variant = 'destructive';
  } else if (status === 'rescheduled') {
    label = 'Rescheduled';
    variant = 'secondary';
  } else if (status === 'pending-makeup') {
    label = 'Pending Makeup';
    variant = 'secondary';
  }
  
  // Payment status badges
  else if (status === 'paid') {
    label = 'Paid';
    variant = 'default';
  } else if (status === 'partially-paid') {
    label = 'Partially Paid';
    variant = 'secondary';
  } else if (status === 'pending') {
    label = 'Pending';
    variant = 'outline';
  } else {
    label = status.replace(/-/g, ' ');
    variant = 'outline';
  }
  
  return (
    <Badge 
      variant={variant} 
      className={cn('capitalize', className)}
    >
      {label}
    </Badge>
  );
};
