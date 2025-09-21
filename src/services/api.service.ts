// services/api.service.ts
"use client";
import axios, { AxiosResponse } from 'axios';

// Types
export interface CreateOrderDto {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  affiliateCode?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: 'vnpay' | 'bank_transfer';
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    final_price: number;
  }>;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  affiliateCode?: string;
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  paymentMethod: 'vnpay' | 'bank_transfer';
  userId: string;
}

export interface PaymentDetail {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: string;
  transactionRef?: string;
  bankTransferInfo?: {
    bankName: string;
    transferDate: string;
    transferNote: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export class ApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080/api';
  
  constructor() {
    // Setup axios defaults
    axios.defaults.baseURL = this.baseURL;
    axios.defaults.timeout = 10000;
    
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }
  
  // Order Management
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    try {
      const response: AxiosResponse<Order> = await axios.post('/orders', orderData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response: AxiosResponse<Order> = await axios.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async getOrderDetail(orderId: string): Promise<Order> {
    try {
      const response: AxiosResponse<Order> = await axios.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async getOrders(): Promise<Order[]> {
    try {
      const response: AxiosResponse<Order[]> = await axios.get('/orders');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Payment Management
  async createPayment(paymentData: CreatePaymentDto): Promise<PaymentDetail> {
    try {
      const response: AxiosResponse<PaymentDetail> = await axios.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async updatePayment(paymentId: string, updateData: any): Promise<PaymentDetail> {
    try {
      const response: AxiosResponse<PaymentDetail> = await axios.patch(`/payments/${paymentId}`, updateData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async approvePayment(paymentId: string, transactionRef: string): Promise<PaymentDetail> {
    try {
      const response: AxiosResponse<PaymentDetail> = await axios.patch(`/payments/${paymentId}/approve`, { transactionRef });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async handleBankTransfer(paymentId: string, transferData: any): Promise<PaymentDetail> {
    try {
      const response: AxiosResponse<PaymentDetail> = await axios.patch(`/payments/${paymentId}/bank-transfer`, transferData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async getPayments(): Promise<PaymentDetail[]> {
    try {
      const response: AxiosResponse<PaymentDetail[]> = await axios.get('/payments');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async getPaymentDetail(paymentId: string): Promise<PaymentDetail> {
    try {
      const response: AxiosResponse<PaymentDetail> = await axios.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Admin Operations
  async adminUpdateOrder(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response: AxiosResponse<Order> = await axios.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async adminApprovePayment(paymentId: string, data: any): Promise<PaymentDetail> {
    try {
      const response: AxiosResponse<PaymentDetail> = await axios.patch(`/admin/payments/${paymentId}/approve`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async adminGetAllOrders(): Promise<Order[]> {
    try {
      const response: AxiosResponse<Order[]> = await axios.get('/admin/orders');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async adminGetAllPayments(): Promise<PaymentDetail[]> {
    try {
      const response: AxiosResponse<PaymentDetail[]> = await axios.get('/admin/payments');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Affiliate Management
  async processCommission(data: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.post('/affiliate/commission', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async getAffiliateData(code: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.get(`/affiliate/${code}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Authentication
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    try {
      const response: AxiosResponse<{ token: string; user: any }> = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async register(userData: any): Promise<{ token: string; user: any }> {
    try {
      const response: AxiosResponse<{ token: string; user: any }> = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async adminLogin(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    try {
      const response: AxiosResponse<{ token: string; user: any }> = await axios.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Utility methods
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('adminToken');
    }
    return null;
  }
  
  private handleError(error: any): void {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Server error';
      
      switch (status) {
        case 400:
          console.error('Bad Request:', message);
          break;
        case 401:
          console.error('Unauthorized. Please login again.');
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            sessionStorage.removeItem('adminToken');
          }
          break;
        case 403:
          console.error('Forbidden. You do not have permission.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error(`Error ${status}:`, message);
      }
    } else if (error.request) {
      console.error('Network error. Please check your connection.');
    } else {
      console.error('An unexpected error occurred:', error.message);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
