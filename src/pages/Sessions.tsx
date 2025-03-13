
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sessions, getSessionsByTeacher } from '@/lib/mock-data';
import { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { Check, X, MoreVertical, Search, Plus, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SessionsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Get sessions based on role
  const allSessions = user?.role === 'teacher' 
    ? getSessionsByTeacher(user.id)
    : sessions;
  
  // Filter sessions based on search and status
  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = 
      session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.date.includes(searchQuery);
    
    const matchesStatus = statusFilter ? session.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleMarkAttendance = (session: Session) => {
    toast({
      title: 'Attendance Confirmed',
      description: `Attendance for ${session.studentName} has been confirmed.`,
    });
  };
  
  const handleCancelSession = (session: Session) => {
    toast({
      title: 'Session Cancelled',
      description: `Session with ${session.studentName} has been cancelled.`,
    });
  };
  
  const handleCreateSession = () => {
    toast({
      title: 'Create Session',
      description: 'This feature would open a modal to create a new session.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sessions</h1>
        
        {(user?.role === 'admin') && (
          <Button onClick={handleCreateSession}>
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sessions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter ? `Status: ${statusFilter}` : 'Filter by status'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('scheduled')}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('no-show')}>
                  No Show
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Student</TableHead>
                  {user?.role !== 'teacher' && <TableHead>Teacher</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role !== 'teacher' ? 6 : 5} className="h-24 text-center">
                      No sessions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => (
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
                      
                      {user?.role !== 'teacher' && (
                        <TableCell>{session.teacherName}</TableCell>
                      )}
                      
                      <TableCell>
                        <StatusBadge status={session.status} />
                      </TableCell>
                      
                      <TableCell>
                        <StatusBadge status={session.paymentStatus} />
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {session.status === 'scheduled' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleMarkAttendance(session)}
                                title="Mark Attendance"
                              >
                                <Check className="h-4 w-4 text-success" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleCancelSession(session)}
                                title="Cancel Session"
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {user?.role === 'admin' && (
                                <>
                                  <DropdownMenuItem>Edit Session</DropdownMenuItem>
                                  <DropdownMenuItem>Record Payment</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage;
