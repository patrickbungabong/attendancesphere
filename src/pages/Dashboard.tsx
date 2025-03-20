
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui-custom/MetricCard';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { CalendarIcon, Clock, UserRound, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Empty placeholder data
  const dashboardStats = {
    totalSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
    upcomingSessions: 0,
    totalEarnings: 0,
    weeklyEarnings: 0,
    dailyEarnings: 0,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'MMMM dd, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Sessions" value={dashboardStats.totalSessions} />
        <MetricCard title="Completed Sessions" value={dashboardStats.completedSessions} />
        <MetricCard title="Cancelled Sessions" value={dashboardStats.cancelledSessions} />
        <MetricCard title="Upcoming Sessions" value={dashboardStats.upcomingSessions} />
        <MetricCard
          title="Total Earnings"
          value={`₱${dashboardStats.totalEarnings.toLocaleString()}`}
        />
        <MetricCard
          title="Weekly Earnings"
          value={`₱${dashboardStats.weeklyEarnings.toLocaleString()}`}
        />
        <MetricCard
          title="Daily Earnings"
          value={`₱${dashboardStats.dailyEarnings.toLocaleString()}`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No upcoming sessions found.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
