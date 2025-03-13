
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionsByTeacher, sessions } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { addDays, format, parseISO, startOfWeek } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8:00 to 19:00

const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  if (!user) return null;
  
  // Get all sessions for the teacher or all sessions for admin/owner
  const allSessions = user.role === 'teacher'
    ? getSessionsByTeacher(user.id)
    : sessions;
  
  // Generate the dates for the current week view
  const weekDates = daysOfWeek.map((_, i) => addDays(currentWeekStart, i));
  
  // Function to check if a session exists at a given time slot and date
  const getSessionAtTimeSlot = (date: Date, timeSlot: string) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return allSessions.find(session => 
      session.date === dateString && session.startTime === timeSlot
    );
  };
  
  // Navigate to previous/next week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prevDate => addDays(prevDate, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentWeekStart(prevDate => addDays(prevDate, 7));
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">
          {user.role === 'teacher' ? 'My Schedule' : 'Teaching Schedule'}
        </h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>
          
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>
              Week of {format(currentWeekStart, 'MMMM d, yyyy')}
            </span>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Month View
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[800px]">
            {/* Time column */}
            <div className="col-span-1">
              <div className="h-10 border-b font-medium flex items-center justify-center">
                Time
              </div>
              {timeSlots.map(time => (
                <div
                  key={time}
                  className="h-20 border-b flex items-center justify-center text-sm text-muted-foreground"
                >
                  {time}
                </div>
              ))}
            </div>
            
            {/* Days columns */}
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="col-span-1">
                <div className="h-10 border-b font-medium flex flex-col items-center justify-center">
                  <div>{daysOfWeek[dayIndex]}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(date, 'MMM d')}
                  </div>
                </div>
                
                {timeSlots.map(time => {
                  const session = getSessionAtTimeSlot(date, time);
                  
                  return (
                    <div
                      key={`${dayIndex}-${time}`}
                      className="h-20 border-b p-1 relative"
                    >
                      {session && (
                        <div className={`
                          absolute inset-1 rounded-md p-2 flex flex-col
                          ${session.status === 'completed' ? 'bg-primary/10 border border-primary/20' : 
                            session.status === 'cancelled' ? 'bg-destructive/10 border border-destructive/20' : 
                            'bg-secondary border border-border'}
                        `}>
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-sm truncate">
                              {user.role === 'teacher' ? session.studentName : session.teacherName}
                            </span>
                            <StatusBadge status={session.status} className="scale-75" />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {session.startTime} - {session.endTime}
                          </div>
                          {session.status === 'scheduled' && (
                            <div className="mt-auto text-xs">
                              <StatusBadge status={session.paymentStatus} className="scale-75" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
