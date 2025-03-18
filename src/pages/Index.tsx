
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, User, ClipboardList, BarChart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Welcome to the Learning Management System</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A complete solution for managing students, teachers, sessions, and payments.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Manage Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Register and manage student profiles, track progress, and monitor attendance.
            </p>
            <Link to="/students">
              <Button variant="outline" className="w-full">Go to Students</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Teacher Management</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Organize teacher profiles, assign classes, and track their performance.
            </p>
            <Link to="/teachers">
              <Button variant="outline" className="w-full">Go to Teachers</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Schedule Sessions</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create, schedule, and manage teaching sessions efficiently.
            </p>
            <Link to="/sessions">
              <Button variant="outline" className="w-full">Go to Sessions</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Track Payments</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Record, track, and manage payments for all teaching sessions.
            </p>
            <Link to="/payments">
              <Button variant="outline" className="w-full">Go to Payments</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">View Analytics</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get insights on performance, earnings, and attendance metrics.
            </p>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90 mb-4">
              Access your dashboard to start managing your educational business.
            </p>
            <Link to="/dashboard">
              <Button variant="secondary" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need help? Contact support at support@example.com
        </p>
      </div>
    </div>
  );
};

export default Index;
