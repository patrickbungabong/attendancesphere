
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value?: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  // Chart properties
  type?: 'bar' | 'line' | 'pie' | 'area';
  data?: any[];
  dataKey?: string;
  categoryKey?: string;
  valuePrefix?: string;
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  // Chart properties are not used in this simple version
  type,
  data,
  dataKey,
  categoryKey,
  valuePrefix,
  isLoading,
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {value !== undefined && (
          <div className="text-2xl font-bold">{valuePrefix || ''}{value}</div>
        )}
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span 
                className={cn(
                  "mr-1 inline-flex items-center",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
        {/* Note: In a real implementation, we'd render charts here based on type, data, etc. */}
        {isLoading && <div className="h-20 bg-gray-100 animate-pulse rounded mt-2"></div>}
        {!isLoading && data && data.length > 0 && (
          <div className="h-20 bg-gray-100 rounded mt-2 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart placeholder ({type})</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
