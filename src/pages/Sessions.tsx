import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSessions, getSessionsByTeacher } from '@/lib/api/sessions';
import { getPaymentsBySessionId } from '@/lib/api/payments';
import { getStudents } from '@/lib/api/students';
import { getUsers } from '@/lib/api/users';
import { useQuery } from '@tanstack/react-query';
import { Session, SessionStatus, Payment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { CreateSessionModal } from '@/components/modals/CreateSessionModal';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { 
  Check, 
  X, 
  MoreVertical, 
  Search, 
  Plus, 
  Filter, 
  CalendarIcon, 
  Clock, 
  UserCheck, 
  DollarSign, 
  FileEdit, 
  Trash, 
  RotateCcw,
  CreditCard
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// New component for viewing session payments
const SessionPaymentsDialog = ({ 
  open, 
  onOpenChange, 
  sessionId,
  sessions, 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  sessionId: string | null,
  sessions: Session[] 
}) => {
  const { data: sessionPayments = [] } = useQuery({
    queryKey: ['payments', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data } = await getPaymentsBySessionId(sessionId);
      return data || [];
    },
    enabled: !!sessionId && open
  });
  
  const session = sessions.find(s => s.id === sessionId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Session Payments</DialogTitle>
          <DialogDescription>
            {session ? (
              <span>Payments for session with {session.studentName} on {format(parseISO(session.date), 'MMMM dd, yyyy')}</span>
            ) : (
              <span>Session payments</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No payments found for this session.
                  </TableCell>
                </TableRow>
              ) : (
                sessionPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(parseISO(payment.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="capitalize">{payment.method.replace('-', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      {payment.confirmedByTeacher ? (
                        <span className="text-xs flex items-center text-success">
                          <Check className="h-3 w-3 mr-1" />
                          Confirmed by Teacher
                        </span>
                      ) : (
                        <span className="text-xs flex items-center text-muted-foreground">
                          <X className="h-3 w-3 mr-1" />
                          Not Confirmed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SessionsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<string | null>(null);
  const [studentFilter, setStudentFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [cancelReason, setCancelReason] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  
  // New state for session payments dialog
  const [showSessionPayments, setShowSessionPayments] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Fetch sessions with React Query
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['sessions', user?.id, user?.role],
    queryFn: async () => {
      if (user?.role === 'teacher') {
        const { data, error } = await getSessionsByTeacher(user.id);
        if (error) throw new Error(error.message);
        return data || [];
      } else {
        const { data, error } = await getSessions();
        if (error) throw new Error(error.message);
        return data || [];
      }
    },
    enabled: !!user
  });
  
  // Fetch teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await getUsers();
      if (error) throw new Error(error.message);
      return data?.filter(u => u.role === 'teacher') || [];
    },
    enabled: user?.role !== 'teacher'
  });
  
  // Fetch students
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await getStudents();
      if (error) throw new Error(error.message);
      return data || [];
    }
  });
  
  // Filter sessions based on search, status, and other filters
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.date.includes(searchQuery);
    
    // Status filter
    const matchesStatus = statusFilter ? session.status === statusFilter : true;
    
    // Payment status filter
    const matchesPaymentStatus = paymentStatusFilter ? session.paymentStatus === paymentStatusFilter : true;
    
    // Teacher filter
    const matchesTeacher = teacherFilter ? session.teacherId === teacherFilter : true;
    
    // Student filter
    const matchesStudent = studentFilter ? session.studentId === studentFilter : true;
    
    // Date range filter
    let matchesDateRange = true;
    if (startDateFilter) {
      const sessionDate = parseISO(session.date);
      matchesDateRange = isAfter(sessionDate, startDateFilter) || isEqual(sessionDate, startDateFilter);
    }
    if (endDateFilter && matchesDateRange) {
      const sessionDate = parseISO(session.date);
      matchesDateRange = isBefore(sessionDate, endDateFilter) || isEqual(sessionDate, endDateFilter);
    }
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && 
           matchesTeacher && matchesStudent && matchesDateRange;
  });
  
  // New function to check if a session has payments asynchronously
  const hasPaymentsCache: Record<string, boolean> = {};
  
  const checkHasPayments = async (sessionId: string): Promise<boolean> => {
    if (hasPaymentsCache[sessionId] !== undefined) {
      return hasPaymentsCache[sessionId];
    }
    
    const { data } = await getPaymentsBySessionId(sessionId);
    const hasPayments = (data || []).length > 0;
    hasPaymentsCache[sessionId] = hasPayments;
    return hasPayments;
  };
  
  // Handler for viewing session payments
  const handleViewSessionPayments = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowSessionPayments(true);
  };
  
  const handleMarkAttendance = (session: Session) => {
    toast({
      title: 'Attendance Confirmed',
      description: `Attendance for ${session.studentName} has been confirmed.`,
    });
  };
  
  const handleConfirmTeacherAttendance = (session: Session) => {
    if (user?.role === 'teacher') {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'Only admins and owners can confirm teacher attendance.',
      });
      return;
    }
    
    toast({
      title: 'Teacher Attendance Confirmed',
      description: `Teacher attendance for ${session.teacherName} has been confirmed.`,
    });
  };
  
  const handleConfirmPayment = (session: Session) => {
    if (user?.role !== 'teacher' && session.teacherId !== user?.id) {
      toast({
        title: 'Payment Confirmed',
        description: `Payment for this session has been confirmed by ${session.teacherName}.`,
      });
      return;
    }
    
    toast({
      title: 'Payment Confirmed',
      description: `You have confirmed receiving payment for this session.`,
    });
  };
  
  const handleCancelSession = (session: Session, reason: string) => {
    toast({
      title: 'Session Cancelled',
      description: `Session with ${session.studentName} has been cancelled. Reason: ${reason}`,
    });
    setCancelReason('');
  };
  
  const handleCreateSession = () => {
    setShowCreateSessionModal(true);
  };

  const handleRescheduleSession = (session: Session) => {
    toast({
      title: 'Reschedule Session',
      description: `Session with ${session.studentName} is being rescheduled.`,
    });
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setPaymentStatusFilter(null);
    setTeacherFilter(null);
    setStudentFilter(null);
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
    setSearchQuery('');
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              {showFilters && (
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto"
                  onClick={clearFilters}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <Label className="mb-2">Session Status</Label>
                  <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled-by-teacher">Cancelled by Teacher</SelectItem>
                      <SelectItem value="cancelled-by-student">Cancelled by Student</SelectItem>
                      <SelectItem value="cancelled-by-admin">Cancelled by Admin</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                      <SelectItem value="pending-makeup">Pending Makeup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Payment Status Filter */}
                <div>
                  <Label className="mb-2">Payment Status</Label>
                  <Select value={paymentStatusFilter || ''} onValueChange={(value) => setPaymentStatusFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Payment Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Payment Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partially-paid">Partially Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Teacher Filter (not for teacher role) */}
                {user?.role !== 'teacher' && (
                  <div>
                    <Label className="mb-2">Teacher</Label>
                    <Select value={teacherFilter || ''} onValueChange={(value) => setTeacherFilter(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Teachers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Teachers</SelectItem>
                        {teachers
                          .filter(u => u.role === 'teacher')
                          .map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Student Filter */}
                <div>
                  <Label className="mb-2">Student</Label>
                  <Select value={studentFilter || ''} onValueChange={(value) => setStudentFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Students</SelectItem>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Start Date Filter */}
                <div>
                  <Label className="mb-2">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDateFilter ? format(startDateFilter, 'PPP') : <span>Pick a start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={startDateFilter}
                        onSelect={setStartDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* End Date Filter */}
                <div>
                  <Label className="mb-2">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDateFilter ? format(endDateFilter, 'PPP') : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={endDateFilter}
                        onSelect={setEndDateFilter}
                        initialFocus
                        disabled={date => startDateFilter ? isBefore(date, startDateFilter) : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
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
                  <TableHead>Attendance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSessions ? (
                  <TableRow>
                    <TableCell colSpan={user?.role !== 'teacher' ? 7 : 6} className="h-24 text-center">
                      Loading sessions...
                    </TableCell>
                  </TableRow>
                ) : filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role !== 'teacher' ? 7 : 6} className="h-24 text-center">
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
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={session.paymentStatus} />
                          {session.paymentConfirmedByTeacher && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Check className="h-3 w-3 mr-1 text-success" />
                              Confirmed by Teacher
                            </span>
                          )}
                          {/* View payment button */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center mt-1 h-6 text-primary text-xs"
                            onClick={() => handleViewSessionPayments(session.id)}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            View Payment
                          </Button>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {session.attendanceConfirmed ? (
                            <span className="text-xs flex items-center text-success">
                              <Check className="h-3 w-3 mr-1" />
                              Student Present
                            </span>
                          ) : (
                            <span className="text-xs flex items-center text-muted-foreground">
                              <X className="h-3 w-3 mr-1" />
                              Student Attendance
                            </span>
                          )}
                          
                          {(user?.role === 'admin' || user?.role === 'owner') && (
                            session.teacherAttendanceConfirmed ? (
                              <span className="text-xs flex items-center text-success">
                                <Check className="h-3 w-3 mr-1" />
                                Teacher Present
                              </span>
                            ) : (
                              <span className="text-xs flex items-center text-muted-foreground">
                                <X className="h-3 w-3 mr-1" />
                                Teacher Attendance
                              </span>
                            )
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {session.status === 'scheduled' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleMarkAttendance(session)}
                                title="Mark Student Attendance"
                              >
                                <Check className="h-4 w-4 text-success" />
                              </Button>
                              
                              {(user?.role === 'admin' || user?.role === 'owner') && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleConfirmTeacherAttendance(session)}
                                  title="Mark Teacher Attendance"
                                >
                                  <UserCheck className="h-4 w-4 text-success" />
                                </Button>
                              )}
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    title="Cancel Session"
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </DialogTrigger>
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
                                    <Button variant="outline" onClick={() => setCancelReason('')}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleCancelSession(session, cancelReason)}
                                      disabled={!cancelReason.trim()}
                                    >
                                      Confirm Cancellation
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}

                          {session.status === 'completed' && user?.role === 'teacher' && !session.paymentConfirmedByTeacher && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleConfirmPayment(session)}
                              title="Confirm Payment Received"
                            >
                              <DollarSign className="h-4 w-4 text-success" />
                            </Button>
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
                                  <DropdownMenuItem>
                                    <FileEdit className="h-4 w-4 mr-2" />
                                    Edit Session
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Record Payment
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {session.status === 'scheduled' && (
                                <DropdownMenuItem onClick={() => handleRescheduleSession(session)}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Reschedule
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem onClick={() => handleViewSessionPayments(session.id)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                View Payments
                              </DropdownMenuItem>
                              
                              {user?.role === 'admin' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete Session
                                  </DropdownMenuItem>
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
      
      {/* Create Session Modal */}
      <CreateSessionModal
        open={showCreateSessionModal}
        onOpenChange={setShowCreateSessionModal}
      />
      
      {/* Session Payments Dialog */}
      <SessionPaymentsDialog
        open={showSessionPayments}
        onOpenChange={setShowSessionPayments}
        sessionId={selectedSessionId}
        sessions={sessions}
      />
    </div>
  );
};

export default SessionsPage;
