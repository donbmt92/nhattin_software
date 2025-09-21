// hooks/usePaymentState.ts
"use client";
import { useState, useCallback } from 'react';
import { apiService, PaymentDetail, PaymentStatus, CreatePaymentDto } from '../services/api.service';

export const usePaymentState = () => {
  const [payments, setPayments] = useState<PaymentDetail[]>([]);
  const [currentPayment, setCurrentPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const paymentsData = await apiService.getPayments();
      setPayments(paymentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchPaymentDetail = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const paymentData = await apiService.getPaymentDetail(paymentId);
      setCurrentPayment(paymentData);
      return paymentData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment detail');
      console.error('Error fetching payment detail:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const createPayment = useCallback(async (paymentData: CreatePaymentDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPayment = await apiService.createPayment(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      setCurrentPayment(newPayment);
      return newPayment;
    } catch (err: any) {
      setError(err.message || 'Failed to create payment');
      console.error('Error creating payment:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updatePaymentStatus = useCallback(async (paymentId: string, updateData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPayment = await apiService.updatePayment(paymentId, updateData);
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? updatedPayment : payment
        )
      );
      if (currentPayment?.id === paymentId) {
        setCurrentPayment(updatedPayment);
      }
      return updatedPayment;
    } catch (err: any) {
      setError(err.message || 'Failed to update payment');
      console.error('Error updating payment:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPayment?.id]);
  
  const handlePaymentStatusChange = useCallback(async (paymentId: string, newStatus: PaymentStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPayment = await apiService.updatePayment(paymentId, { status: newStatus });
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? updatedPayment : payment
        )
      );
      if (currentPayment?.id === paymentId) {
        setCurrentPayment(updatedPayment);
      }
      return updatedPayment;
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
      console.error('Error updating payment status:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPayment?.id]);
  
  const approvePayment = useCallback(async (paymentId: string, transactionRef: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const approvedPayment = await apiService.approvePayment(paymentId, transactionRef);
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? approvedPayment : payment
        )
      );
      if (currentPayment?.id === paymentId) {
        setCurrentPayment(approvedPayment);
      }
      return approvedPayment;
    } catch (err: any) {
      setError(err.message || 'Failed to approve payment');
      console.error('Error approving payment:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPayment?.id]);
  
  const handleBankTransfer = useCallback(async (paymentId: string, transferData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPayment = await apiService.handleBankTransfer(paymentId, transferData);
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? updatedPayment : payment
        )
      );
      if (currentPayment?.id === paymentId) {
        setCurrentPayment(updatedPayment);
      }
      return updatedPayment;
    } catch (err: any) {
      setError(err.message || 'Failed to process bank transfer');
      console.error('Error processing bank transfer:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPayment?.id]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const resetState = useCallback(() => {
    setPayments([]);
    setCurrentPayment(null);
    setError(null);
    setIsLoading(false);
  }, []);
  
  return {
    // State
    payments,
    currentPayment,
    isLoading,
    error,
    
    // Actions
    fetchPayments,
    fetchPaymentDetail,
    createPayment,
    updatePaymentStatus,
    handlePaymentStatusChange,
    approvePayment,
    handleBankTransfer,
    setCurrentPayment,
    clearError,
    resetState
  };
};
