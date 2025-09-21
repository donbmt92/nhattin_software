// hooks/useOrderState.ts
"use client";
import { useState, useCallback } from 'react';
import { apiService, Order, OrderStatus, CreateOrderDto } from '../services/api.service';

export const useOrderState = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ordersData = await apiService.getOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const orderData = await apiService.getOrderDetail(orderId);
      setCurrentOrder(orderData);
      return orderData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order detail');
      console.error('Error fetching order detail:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const createOrder = useCallback(async (orderData: CreateOrderDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const newOrder = await apiService.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await apiService.updateOrderStatus(orderId, status);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      if (currentOrder?.id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      return updatedOrder;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder?.id]);
  
  const syncOrderStatus = useCallback(async (orderId: string) => {
    try {
      const orderData = await apiService.getOrderDetail(orderId);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? orderData : order
        )
      );
      if (currentOrder?.id === orderId) {
        setCurrentOrder(orderData);
      }
      return orderData;
    } catch (err: any) {
      console.error('Error syncing order status:', err);
      throw err;
    }
  }, [currentOrder?.id]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const resetState = useCallback(() => {
    setOrders([]);
    setCurrentOrder(null);
    setError(null);
    setIsLoading(false);
  }, []);
  
  return {
    // State
    orders,
    currentOrder,
    isLoading,
    error,
    
    // Actions
    fetchOrders,
    fetchOrderDetail,
    createOrder,
    updateOrderStatus,
    syncOrderStatus,
    setCurrentOrder,
    clearError,
    resetState
  };
};
