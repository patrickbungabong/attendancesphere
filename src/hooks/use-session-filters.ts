
import { useState } from 'react';
import { Session } from '@/types';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';

export const useSessionFilters = (sessions: Session[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<string | null>(null);
  const [studentFilter, setStudentFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    setStatusFilter(null);
    setPaymentStatusFilter(null);
    setTeacherFilter(null);
    setStudentFilter(null);
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
    setSearchQuery('');
  };

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

  return {
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
    filteredSessions
  };
};
