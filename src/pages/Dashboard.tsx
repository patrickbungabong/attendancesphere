
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTeacherStats, sessions, payments, users } from '@/lib/mock-data';
import { StatsCard } from '@/components/ui-custom/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { BarChart, LineChart, AreaChart } from 'recharts';
import {
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Users, DollarSign, Calendar, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Prepare data for charts
  const today = new Date();
  const lastWeek = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = subDays(today, 6 - i);
      return format(date, 'yyyy-MM-dd');
    });
  
  const weeklySessionsData = lastWeek.map((date) => {
    const daySessions = sessions.filter(s => s.date === date);
    const completedCount = daySessions.filter(s => s.status === 'completed').length;
    const cancelledCount = daySessions.filter(s => s.status === 'cancelled').length;
    
    return {
      date: format(new Date(date), 'EEE'),
      completed: completedCount,
      cancelled: cancelledCount,
      total: daySessions.length,
    };
  });
  
  const weeklyPaymentsData = lastWeek.map((date) => {
    const dayPayments = payments.filter(p => p.date === date);
    const totalAmount = dayPayments.reduce((sum, p) => sum + p.amount, 0);
    const adminFees = dayPayments.reduce((sum, p) => sum + p.adminFee, 0);
    const teacherFees = dayPayments.reduce((sum, p) => sum + p.teacherFee, 0);
    
    return {
      date: format(new Date(date), 'EEE'),
      total: totalAmount,
      adminFees,
      teacherFees,
    };
  });
  
  // Get teacher performance data
  const teacherPerformance = users
    .filter(u => u.role === 'teacher')
    .map(teacher => {
      const stats = getTeacherStats(teacher.id);
      return {
        name: teacher.name,
        sessions: stats.totalSessions,
        completed: stats.completedSessions,
        cancelled: stats.cancelledSessions,
        earnings: Math.floor(Math.random() * 50000) + 10000, // Random for demo
      };
    });
  
  // Calculate totals
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sessions"
          value={totalSessions}
          icon={<Calendar className="h-5 w-5" />}
          description="All-time sessions"
        />
        
        <StatsCard
          title="Completed Sessions"
          value={completedSessions}
          icon={<Calendar className="h-5 w-5" />}
          description={`${Math.round((completedSessions / totalSessions) * 100)}% completion rate`}
        />
        
        <StatsCard
          title="Cancelled Sessions"
          value={cancelledSessions}
          icon={<XCircle className="h-5 w-5" />}
          description={`${Math.round((cancelledSessions / totalSessions) * 100)}% cancellation rate`}
        />
        
        <StatsCard
          title="Total Revenue"
          value={`₱${totalPayments.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          description="All-time payments"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sessions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#10b981" />
                <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyPaymentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Total" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="adminFees" 
                  name="Admin Fees" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="teacherFees" 
                  name="Teacher Fees" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Teacher Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Completed Sessions" fill="#10b981" />
              <Bar dataKey="cancelled" name="Cancelled Sessions" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
