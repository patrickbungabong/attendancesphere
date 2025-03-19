
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

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<{ data: Payment | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        session_id: payment.sessionId,
        date: payment.date,
        amount: payment.amount,
        method: payment.method,
        proof_image_url: payment.proofImageUrl,
        notes: payment.notes,
        admin_fee: payment.adminFee,
        teacher_fee: payment.teacherFee,
        confirmed_by_teacher: payment.confirmedByTeacher
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const newPayment: Payment = {
      id: data.id,
      sessionId: data.session_id,
      date: data.date,
      amount: data.amount,
      method: data.method as PaymentMethod,
      proofImageUrl: data.proof_image_url || undefined,
      notes: data.notes || undefined,
      adminFee: data.admin_fee,
      teacherFee: data.teacher_fee,
      confirmedByTeacher: data.confirmed_by_teacher
    };
    
    return { data: newPayment, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<{ data: Payment | null; error: any }> => {
  try {
    const updateData: any = {};
    
    if (payment.sessionId !== undefined) updateData.session_id = payment.sessionId;
    if (payment.date !== undefined) updateData.date = payment.date;
    if (payment.amount !== undefined) updateData.amount = payment.amount;
    if (payment.method !== undefined) updateData.method = payment.method;
    if (payment.proofImageUrl !== undefined) updateData.proof_image_url = payment.proofImageUrl;
    if (payment.notes !== undefined) updateData.notes = payment.notes;
    if (payment.adminFee !== undefined) updateData.admin_fee = payment.adminFee;
    if (payment.teacherFee !== undefined) updateData.teacher_fee = payment.teacherFee;
    if (payment.confirmedByTeacher !== undefined) updateData.confirmed_by_teacher = payment.confirmedByTeacher;
    
    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform from database schema to our app types
    const updatedPayment: Payment = {
      id: data.id,
      sessionId: data.session_id,
      date: data.date,
      amount: data.amount,
      method: data.method as PaymentMethod,
      proofImageUrl: data.proof_image_url || undefined,
      notes: data.notes || undefined,
      adminFee: data.admin_fee,
      teacherFee: data.teacher_fee,
      confirmedByTeacher: data.confirmed_by_teacher
    };
    
    return { data: updatedPayment, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const deletePayment = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error).error };
  }
};
