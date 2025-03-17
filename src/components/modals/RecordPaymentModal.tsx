
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Upload, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sessions, students, users } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  sessionId: z.string().min(1, "Session is required"),
  amount: z.number().min(200, "Amount must be at least ₱200"),
  method: z.enum(['cash', 'bank-transfer', 'gcash'] as const),
  notes: z.string().optional(),
});

type RecordPaymentFormValues = z.infer<typeof formSchema>;

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordPaymentModal({ open, onOpenChange }: RecordPaymentModalProps) {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [availableSessions, setAvailableSessions] = useState(sessions);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Create the form
  const form = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      method: 'cash',
      notes: '',
    },
  });

  // Filter sessions when student or teacher changes
  useEffect(() => {
    let filtered = sessions;
    
    if (studentId) {
      filtered = filtered.filter(s => s.studentId === studentId);
    }
    
    if (teacherId) {
      filtered = filtered.filter(s => s.teacherId === teacherId);
    }
    
    // Only include sessions that are completed but not fully paid
    filtered = filtered.filter(s => 
      s.status === 'completed' && 
      (s.paymentStatus === 'pending' || s.paymentStatus === 'partially-paid')
    );
    
    setAvailableSessions(filtered);
  }, [studentId, teacherId]);

  // Calculate teacher fee and admin fee
  const amount = form.watch('amount') || 0;
  const adminFee = Math.min(amount, 200);
  const teacherFee = Math.max(0, amount - 200);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: RecordPaymentFormValues) => {
    console.log('Recording payment:', values);
    console.log('Payment proof:', uploadedFile);
    
    // Here you would typically send this data to your backend API
    const selectedSession = sessions.find(s => s.id === values.sessionId);
    
    if (selectedSession) {
      toast({
        title: "Payment recorded",
        description: `Payment of ₱${values.amount} for ${selectedSession.studentName}'s session with ${selectedSession.teacherName} has been recorded.`,
      });
    }
    
    // Reset the form and state
    form.reset();
    setStudentId(null);
    setTeacherId(null);
    setPreviewImage(null);
    setUploadedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for a completed session.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Student Filter */}
              <div>
                <FormLabel>Student (Optional Filter)</FormLabel>
                <Select
                  value={studentId || ""}
                  onValueChange={(value) => setStudentId(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Teacher Filter */}
              <div>
                <FormLabel>Teacher (Optional Filter)</FormLabel>
                <Select
                  value={teacherId || ""}
                  onValueChange={(value) => setTeacherId(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Teachers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {users
                      .filter(u => u.role === 'teacher')
                      .map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {/* Session */}
              <FormField
                control={form.control}
                name="sessionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSessions.length === 0 ? (
                          <SelectItem value="no-sessions" disabled>
                            No unpaid sessions available
                          </SelectItem>
                        ) : (
                          availableSessions.map(session => (
                            <SelectItem key={session.id} value={session.id}>
                              {session.studentName} with {session.teacherName} - {format(parseISO(session.date), 'MMM dd, yyyy')} ({session.startTime})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Payment Method */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="gcash">GCash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="number"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Admin Fee: ₱{adminFee.toLocaleString()} | Teacher Fee: ₱{teacherFee.toLocaleString()}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Payment Proof */}
              <div>
                <FormLabel>Payment Proof (Optional)</FormLabel>
                <div className="mt-1">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="payment-proof"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                    >
                      {previewImage ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <img
                            src={previewImage}
                            alt="Payment Proof"
                            className="h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                        </div>
                      )}
                      <input
                        id="payment-proof"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any notes about this payment..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
