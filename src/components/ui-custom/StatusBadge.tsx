
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SessionStatus } from '@/types';

interface StatusBadgeProps {
  status: SessionStatus | 'paid' | 'pending' | 'partially-paid';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'scheduled':
        return { label: 'Scheduled', variant: 'outline' as const };
      case 'completed':
        return { label: 'Completed', variant: 'success' as const };
      case 'cancelled-by-teacher':
        return { label: 'Cancelled by Teacher', variant: 'destructive' as const };
      case 'cancelled-by-student':
        return { label: 'Cancelled by Student', variant: 'destructive' as const };
      case 'cancelled-by-admin':
        return { label: 'Cancelled by Admin', variant: 'destructive' as const };
      case 'no-show':
        return { label: 'No Show', variant: 'destructive' as const };
      case 'rescheduled':
        return { label: 'Rescheduled', variant: 'warning' as const };
      case 'pending-makeup':
        return { label: 'Pending Makeup', variant: 'warning' as const };
      case 'paid':
        return { label: 'Paid', variant: 'success' as const };
      case 'partially-paid':
        return { label: 'Partially Paid', variant: 'warning' as const };
      case 'pending':
        return { label: 'Pending', variant: 'outline' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return (
    <Badge 
      variant={variant === 'success' ? 'default' : variant}
      className={cn(
        variant === 'success' && 'bg-success text-success-foreground hover:bg-success/80',
        variant === 'warning' && 'bg-yellow-500 text-white hover:bg-yellow-600',
        className
      )}
    >
      {label}
    </Badge>
  );
};
