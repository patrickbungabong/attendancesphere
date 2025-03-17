import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sessions, users, students } from '@/lib/mock-data';
import { DashboardStats } from '@/types';
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
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Clock, UserRound, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = sessions.filter(s => 
    s.status === 'cancelled-by-teacher' || 
    s.status === 'cancelled-by-student' || 
    s.status === 'cancelled-by-admin'
  ).length;
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled').length;

  const totalEarnings = sessions.reduce((acc, session) => {
    if (session.paymentStatus === 'paid') {
      return acc + 500; // Assuming each session costs $500
    }
    return acc;
  }, 0);

  const weeklyEarnings = 1200;
  const dailyEarnings = 200;

  const dashboardStats: DashboardStats = {
    totalSessions,
    completedSessions,
    cancelledSessions,
    upcomingSessions,
    totalEarnings,
    weeklyEarnings,
    dailyEarnings,
  };

  const teachers = users.filter(u => u.role === 'teacher');

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.slice(0, 5).map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="font-medium">
                        {format(parseISO(session.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime}
                      </div>
                    </TableCell>
                    <TableCell>{session.studentName}</TableCell>
                    <TableCell>{session.teacherName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {teachers.map((teacher) => {
          const teacherSessions = sessions.filter(s => s.teacherId === teacher.id);
          const cancelledByTeacher = teacherSessions.filter(
            s => s.status === 'cancelled-by-teacher'
          ).length;
          const completionRate =
            teacherSessions.length > 0
              ? ((teacherSessions.length - cancelledByTeacher) / teacherSessions.length) * 100
              : 0;

          return (
            <Card key={teacher.id}>
              <CardHeader>
                <CardTitle>Teacher Performance - {teacher.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{teacher.name}</p>
                    <Badge variant="secondary">{teacher.role}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-sm font-medium">{completionRate.toFixed(2)}%</p>
                  </div>
                  <Progress value={completionRate} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Sessions: {teacherSessions.length}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Cancelled: {cancelledByTeacher}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Students: {students.length}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Earnings: ₱{totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
