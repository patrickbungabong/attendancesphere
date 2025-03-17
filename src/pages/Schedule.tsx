
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sessions, getSessionsByTeacher } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';

const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  // Get all days in the current week
  const days = eachDayOfInterval({ start, end });
  
  // Get sessions based on role
  const allSessions = user?.role === 'teacher'
    ? getSessionsByTeacher(user.id)
    : sessions;
  
  // Group sessions by day
  const sessionsByDay = days.map(day => {
    return {
      date: day,
      sessions: allSessions.filter(session => {
        const sessionDate = parseISO(session.date);
        return isSameDay(sessionDate, day);
      })
    };
  });
  
  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
            </span>
          </div>
          
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sessionsByDay.map(({ date, sessions }) => (
          <Card key={date.toString()} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-center">
                {format(date, 'EEEE')}
                <div className="text-sm font-normal text-muted-foreground">
                  {format(date, 'MMMM d, yyyy')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sessions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No sessions scheduled
                </div>
              ) : (
                <div className="divide-y">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-3 hover:bg-muted/50">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium">
                          {session.startTime} - {session.endTime}
                        </div>
                        <StatusBadge status={session.status} />
                      </div>
                      
                      <div className="text-sm">
                        <div>{session.studentName}</div>
                        <div className="text-muted-foreground">{session.teacherName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
