
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTeacherStats, getSessionsByTeacher, payments, sessions } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui-custom/StatsCard';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Filter, DollarSign } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const EarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [periodFilter, setPeriodFilter] = useState<'day' | 'week' | 'month'>('week');
  
  if (!user) return null;
  
  const teacherStats = getTeacherStats(user.id);
  const teacherSessions = getSessionsByTeacher(user.id);
  
  // Get completed sessions with payments
  const completedSessions = teacherSessions.filter(
    session => session.status === 'completed'
  );
  
  // Calculate earnings
  const teacherPayments = payments.filter(payment => {
    const session = sessions.find(s => s.id === payment.sessionId);
    return session && session.teacherId === user.id;
  });
  
  const totalEarnings = teacherPayments.reduce((sum, payment) => sum + payment.teacherFee, 0);
  
  // Get today's date
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');
  
  // Get week range
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
  
  // Create data for weekly earnings chart
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });
  
  const weeklyEarningsData = daysOfWeek.map(day => {
    const dayString = format(day, 'yyyy-MM-dd');
    const dayPayments = teacherPayments.filter(p => p.date === dayString);
    const dayEarnings = dayPayments.reduce((sum, p) => sum + p.teacherFee, 0);
    
    return {
      day: format(day, 'EEE'),
      date: dayString,
      earnings: dayEarnings,
    };
  });
  
  // Calculate today's and this week's earnings
  const todayEarnings = teacherPayments
    .filter(p => p.date === formattedToday)
    .reduce((sum, p) => sum + p.teacherFee, 0);
  
  const weekEarnings = teacherPayments
    .filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate >= startOfCurrentWeek && paymentDate <= endOfCurrentWeek;
    })
    .reduce((sum, p) => sum + p.teacherFee, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">My Earnings</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="h-4 w-4 mr-2" />
            Select Date Range
          </Button>
          
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Earnings"
          value={`₱${totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          description="All-time earnings"
        />
        
        <StatsCard
          title="Today's Earnings"
          value={`₱${todayEarnings.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          description={`From ${teacherPayments.filter(p => p.date === formattedToday).length} payments`}
        />
        
        <StatsCard
          title="This Week's Earnings"
          value={`₱${weekEarnings.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          description={`From ${teacherPayments.filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate >= startOfCurrentWeek && paymentDate <= endOfCurrentWeek;
          }).length} payments`}
        />
      </div>
      
      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earnings">Earnings Chart</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Earnings</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyEarningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Earnings']} />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Session Status</TableHead>
                      <TableHead>Payment Amount</TableHead>
                      <TableHead>Your Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      teacherPayments.map((payment) => {
                        const session = sessions.find(s => s.id === payment.sessionId);
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {format(parseISO(payment.date), 'MMM dd, yyyy')}
                            </TableCell>
                            
                            <TableCell>{session?.studentName || 'Unknown'}</TableCell>
                            
                            <TableCell>
                              {session && <StatusBadge status={session.status} />}
                            </TableCell>
                            
                            <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                            
                            <TableCell className="font-medium">
                              ₱{payment.teacherFee.toLocaleString()}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsPage;
