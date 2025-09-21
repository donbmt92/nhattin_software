// utils/errorHandler.ts
"use client";
import axios from 'axios';

export class ErrorHandler {
  static handleApiError(error: any): string {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Server error';
      
      switch (status) {
        case 400:
          return `Bad Request: ${message}`;
        case 401:
          return 'Unauthorized. Please login again.';
        case 403:
          return 'Forbidden. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 422:
          return `Validation Error: ${message}`;
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 502:
          return 'Bad Gateway. Service temporarily unavailable.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `Error ${status}: ${message}`;
      }
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  }
  
  static handleOrderError(error: any): void {
    const message = this.handleApiError(error);
    this.showErrorMessage(message);
    console.error('Order error:', error);
    this.fallbackToOfflineMode('order');
  }
  
  static handlePaymentError(error: any): void {
    const message = this.handleApiError(error);
    this.showErrorMessage(message);
    console.error('Payment error:', error);
    this.fallbackToOfflineMode('payment');
  }
  
  static handleAuthError(error: any): void {
    const message = this.handleApiError(error);
    this.showErrorMessage(message);
    console.error('Auth error:', error);
    
    // Clear invalid tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
    }
  }
  
  static handleAdminError(error: any): void {
    const message = this.handleApiError(error);
    this.showErrorMessage(message);
    console.error('Admin error:', error);
    
    // If unauthorized, redirect to admin login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
  }
  
  private static showErrorMessage(message: string): void {
    // Show error message to user
    if (typeof window !== 'undefined') {
      // Create a simple toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = message;
      
      document.body.appendChild(toast);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 5000);
    }
  }
  
  private static fallbackToOfflineMode(context: string): void {
    // Implement offline mode logic
    console.log(`Fallback to offline mode for ${context}`);
    
    if (typeof window !== 'undefined') {
      // Store data in localStorage for offline access
      const offlineData = {
        context,
        timestamp: Date.now(),
        message: 'Data saved for offline access'
      };
      
      localStorage.setItem(`offline_${context}`, JSON.stringify(offlineData));
    }
  }
  
  static isNetworkError(error: any): boolean {
    return !error.response && error.request;
  }
  
  static isServerError(error: any): boolean {
    return error.response && error.response.status >= 500;
  }
  
  static isClientError(error: any): boolean {
    return error.response && error.response.status >= 400 && error.response.status < 500;
  }
  
  static getErrorCode(error: any): string | null {
    if (error.response) {
      return `HTTP_${error.response.status}`;
    } else if (error.request) {
      return 'NETWORK_ERROR';
    } else {
      return 'UNKNOWN_ERROR';
    }
  }
  
  static formatErrorForLogging(error: any, context: string): object {
    return {
      context,
      message: error.message || 'Unknown error',
      stack: error.stack,
      code: this.getErrorCode(error),
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'Server',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      ...(error.response && {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      })
    };
  }
  
  static retryableError(error: any): boolean {
    if (this.isNetworkError(error)) return true;
    if (this.isServerError(error)) return true;
    if (error.response?.status === 429) return true; // Rate limited
    return false;
  }
  
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (!this.retryableError(error) || i === maxRetries - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    
    throw lastError;
  }
}

// Utility functions for common error scenarios
export const showSuccessMessage = (message: string): void => {
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
};

export const showWarningMessage = (message: string): void => {
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }
};

export const showErrorMessage = (message: string): void => {
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }
};
