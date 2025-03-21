
import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { User } from '@/types';
import { CalendarIcon } from 'lucide-react';

interface SessionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  paymentStatusFilter: string | null;
  setPaymentStatusFilter: (status: string | null) => void;
  teacherFilter: string | null;
  setTeacherFilter: (teacherId: string | null) => void;
  studentFilter: string | null;
  setStudentFilter: (studentId: string | null) => void;
  startDateFilter: Date | undefined;
  setStartDateFilter: (date: Date | undefined) => void;
  endDateFilter: Date | undefined;
  setEndDateFilter: (date: Date | undefined) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;
  teachers: any[];
  students: any[];
  user: User | null;
}

export const SessionFilters: React.FC<SessionFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  teacherFilter,
  setTeacherFilter,
  studentFilter,
  setStudentFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  showFilters,
  setShowFilters,
  clearFilters,
  teachers,
  students,
  user
}) => {
  return (
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
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
