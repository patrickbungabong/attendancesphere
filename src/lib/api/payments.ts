
import { supabase, handleSupabaseError } from '../supabase';
import { Payment, PaymentMethod } from '@/types';

export const getPayments = async (): Promise<{ data: Payment[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const payments: Payment[] = data.map(payment => ({
      id: payment.id,
      sessionId: payment.session_id,
      date: payment.date,
      amount: payment.amount,
      method: payment.method as PaymentMethod,
      proofImageUrl: payment.proof_image_url || undefined,
      notes: payment.notes || undefined,
      adminFee: payment.admin_fee,
      teacherFee: payment.teacher_fee,
      confirmedByTeacher: payment.confirmed_by_teacher
    }));
    
    return { data: payments, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getPaymentsBySessionId = async (sessionId: string): Promise<{ data: Payment[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('session_id', sessionId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const payments: Payment[] = data.map(payment => ({
      id: payment.id,
      sessionId: payment.session_id,
      date: payment.date,
      amount: payment.amount,
      method: payment.method as PaymentMethod,
      proofImageUrl: payment.proof_image_url || undefined,
      notes: payment.notes || undefined,
      adminFee: payment.admin_fee,
      teacherFee: payment.teacher_fee,
      confirmedByTeacher: payment.confirmed_by_teacher
    }));
    
    return { data: payments, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
