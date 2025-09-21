// utils/memoization.ts
"use client";
import { useMemo, useCallback } from 'react';
import { Order, PaymentDetail } from '../services/api.service';

// Helper functions for status colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'completed':
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'failed': return 'bg-red-100 text-red-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Memoized orders with computed properties
export const useMemoizedOrders = (orders: Order[]) => {
  return useMemo(() => {
    return orders.map(order => ({
      ...order,
      totalAmount: order.items.reduce((sum, item) => sum + item.final_price, 0),
      statusColor: getStatusColor(order.status),
      formattedAmount: order.totalAmount.toLocaleString('vi-VN'),
      formattedDate: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      shortId: order.id.slice(0, 8) + '...',
      shortUserId: order.userId.slice(0, 8) + '...',
      itemCount: order.items.length,
      canUpdateStatus: ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.status),
      nextStatus: getNextOrderStatus(order.status)
    }));
  }, [orders]);
};

// Memoized payments with computed properties
export const useMemoizedPayments = (payments: PaymentDetail[]) => {
  return useMemo(() => {
    return payments.map(payment => ({
      ...payment,
      formattedAmount: payment.amount.toLocaleString('vi-VN'),
      statusColor: getPaymentStatusColor(payment.status),
      formattedDate: new Date(payment.createdAt).toLocaleDateString('vi-VN'),
      shortId: payment.id.slice(0, 8) + '...',
      shortOrderId: payment.orderId.slice(0, 8) + '...',
      canApprove: payment.status === 'PENDING' && payment.paymentMethod === 'vnpay',
      canProcessBankTransfer: payment.status === 'PENDING' && payment.paymentMethod === 'bank_transfer',
      hasTransactionRef: !!payment.transactionRef,
      hasBankTransferInfo: !!payment.bankTransferInfo
    }));
  }, [payments]);
};

// Memoized order statistics
export const useOrderStatistics = (orders: Order[]) => {
  return useMemo(() => {
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };
    
    orders.forEach(order => {
      switch (order.status) {
        case 'PENDING': stats.pending++; break;
        case 'PROCESSING': stats.processing++; break;
        case 'SHIPPED': stats.shipped++; break;
        case 'DELIVERED': 
          stats.delivered++; 
          stats.totalRevenue += order.totalAmount;
          break;
        case 'CANCELLED': stats.cancelled++; break;
      }
    });
    
    stats.averageOrderValue = stats.delivered > 0 ? stats.totalRevenue / stats.delivered : 0;
    
    return stats;
  }, [orders]);
};

// Memoized payment statistics
export const usePaymentStatistics = (payments: PaymentDetail[]) => {
  return useMemo(() => {
    const stats = {
      total: payments.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      totalAmount: 0,
      vnpayCount: 0,
      bankTransferCount: 0
    };
    
    payments.forEach(payment => {
      switch (payment.status) {
        case 'PENDING': stats.pending++; break;
        case 'PROCESSING': stats.processing++; break;
        case 'COMPLETED': 
          stats.completed++; 
          stats.totalAmount += payment.amount;
          break;
        case 'FAILED': stats.failed++; break;
        case 'CANCELLED': stats.cancelled++; break;
      }
      
      if (payment.paymentMethod === 'vnpay') {
        stats.vnpayCount++;
      } else if (payment.paymentMethod === 'bank_transfer') {
        stats.bankTransferCount++;
      }
    });
    
    return stats;
  }, [payments]);
};

// Memoized filtered data
export const useFilteredOrders = (orders: Order[], filters: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) => {
  return useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (filters.status && order.status !== filters.status) {
        return false;
      }
      
      // Date range filter
      if (filters.dateFrom) {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (orderDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(filters.dateTo);
        if (orderDate > toDate) return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          order.id.toLowerCase().includes(searchLower) ||
          order.userId.toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [orders, filters]);
};

export const useFilteredPayments = (payments: PaymentDetail[], filters: {
  status?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) => {
  return useMemo(() => {
    return payments.filter(payment => {
      // Status filter
      if (filters.status && payment.status !== filters.status) {
        return false;
      }
      
      // Payment method filter
      if (filters.paymentMethod && payment.paymentMethod !== filters.paymentMethod) {
        return false;
      }
      
      // Date range filter
      if (filters.dateFrom) {
        const paymentDate = new Date(payment.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (paymentDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const paymentDate = new Date(payment.createdAt);
        const toDate = new Date(filters.dateTo);
        if (paymentDate > toDate) return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          payment.id.toLowerCase().includes(searchLower) ||
          payment.orderId.toLowerCase().includes(searchLower) ||
          payment.status.toLowerCase().includes(searchLower) ||
          (payment.transactionRef && payment.transactionRef.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [payments, filters]);
};

// Helper function to get next order status
const getNextOrderStatus = (currentStatus: string) => {
  switch (currentStatus) {
    case 'PENDING': return 'PROCESSING';
    case 'PROCESSING': return 'SHIPPED';
    case 'SHIPPED': return 'DELIVERED';
    default: return null;
  }
};

// Memoized sorting functions
export const useSortedOrders = (orders: Order[], sortBy: string, sortOrder: 'asc' | 'desc') => {
  return useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [orders, sortBy, sortOrder]);
};

export const useSortedPayments = (payments: PaymentDetail[], sortBy: string, sortOrder: 'asc' | 'desc') => {
  return useMemo(() => {
    const sorted = [...payments].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [payments, sortBy, sortOrder]);
};
