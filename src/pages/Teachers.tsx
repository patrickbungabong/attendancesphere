
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Mail, Phone, UserCheck, Clock, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth';
import { Teacher } from '@/types';
import { getTeachers, createTeacher } from '@/lib/api/teachers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const Teachers: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  
  // New teacher form state
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherNumber, setNewTeacherNumber] = useState('');
  
  // Fetch teachers data
  const { data: teachersData, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await getTeachers();
      if (error) throw new Error(error);
      return data || [];
    }
  });

  // Create teacher mutation
  const createTeacherMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsAddingTeacher(false);
      setNewTeacherName('');
      setNewTeacherEmail('');
      setNewTeacherNumber('');
      toast({
        title: "Teacher Added",
        description: "The teacher has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add teacher: ${error}`,
      });
    }
  });
  
  const teachers = teachersData || [];
  
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddTeacher = () => {
    if (!newTeacherName || !newTeacherEmail) return;
    
    createTeacherMutation.mutate({
      name: newTeacherName,
      email: newTeacherEmail,
      number: newTeacherNumber || undefined
    });
  };

  // Function to get initials from a name
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers & Staff</h1>
        
        {['admin', 'owner'].includes(user?.role || '') && (
          <Button 
            onClick={() => setIsAddingTeacher(!isAddingTeacher)} 
            className="mt-4 sm:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Teacher
          </Button>
        )}
      </div>
      
      {isAddingTeacher && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Teacher</CardTitle>
            <CardDescription>Enter the details for the new teacher or staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="teacher-name" className="block text-sm font-medium mb-1">Full Name</label>
                <Input 
                  id="teacher-name" 
                  placeholder="John Doe" 
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="teacher-email" className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  id="teacher-email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="teacher-number" className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  id="teacher-number" 
                  type="tel" 
                  placeholder="+1234567890" 
                  value={newTeacherNumber}
                  onChange={(e) => setNewTeacherNumber(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddTeacher} 
                  className="w-full"
                  disabled={createTeacherMutation.isPending || !newTeacherName || !newTeacherEmail}
                >
                  {createTeacherMutation.isPending ? 'Adding...' : 'Add Teacher'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search teachers..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center p-10">
            <div className="rounded-full bg-muted p-3 mb-3">
              <UserCheck size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No teachers found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Start by adding your first teacher'}
            </p>
            {['admin', 'owner'].includes(user?.role || '') && !isAddingTeacher && (
              <Button onClick={() => setIsAddingTeacher(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Teacher
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-14 w-14 mr-4">
                      <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{teacher.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 mt-2">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{teacher.email}</span>
                  </div>
                  
                  {teacher.number && (
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{teacher.number}</span>
                    </div>
                  )}
                  
                  {/* Empty statistics placeholders */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-muted">
                    <div className="text-center">
                      <div className="flex justify-center">
                        <UserCheck size={16} className="text-primary" />
                      </div>
                      <div className="text-xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center">
                        <Clock size={16} className="text-primary" />
                      </div>
                      <div className="text-xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center">
                        <DollarSign size={16} className="text-primary" />
                      </div>
                      <div className="text-xl font-bold">$0</div>
                      <div className="text-xs text-muted-foreground">Earnings</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teachers;
