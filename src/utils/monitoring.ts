// utils/monitoring.ts
"use client";

export class MonitoringService {
  static logError(error: Error, context: string) {
    console.error(`[${context}] Error:`, error);
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
      this.sendToMonitoringService('error', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'Server',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
      });
    }
  }
  
  static logEvent(event: string, data: any) {
    console.log(`[Event] ${event}:`, data);
    
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Send to Google Analytics, Mixpanel, etc.
      this.sendToAnalyticsService(event, {
        ...data,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'Server'
      });
    }
  }
  
  static trackOrderFlow(orderId: string, step: string) {
    this.logEvent('order_flow', { 
      orderId, 
      step, 
      timestamp: Date.now() 
    });
  }
  
  static trackPaymentFlow(paymentId: string, step: string) {
    this.logEvent('payment_flow', { 
      paymentId, 
      step, 
      timestamp: Date.now() 
    });
  }
  
  static trackUserAction(action: string, data: any) {
    this.logEvent('user_action', {
      action,
      ...data,
      timestamp: Date.now()
    });
  }
  
  static trackPerformance(metric: string, value: number, context?: string) {
    this.logEvent('performance', {
      metric,
      value,
      context,
      timestamp: Date.now()
    });
  }
  
  static trackApiCall(endpoint: string, method: string, status: number, duration: number) {
    this.logEvent('api_call', {
      endpoint,
      method,
      status,
      duration,
      timestamp: Date.now()
    });
  }
  
  static trackPageView(page: string, title?: string) {
    this.logEvent('page_view', {
      page,
      title: title || page,
      timestamp: Date.now()
    });
  }
  
  static trackConversion(type: string, value?: number, currency?: string) {
    this.logEvent('conversion', {
      type,
      value,
      currency,
      timestamp: Date.now()
    });
  }
  
  private static sendToMonitoringService(type: string, data: any) {
    // Implementation for sending to monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
    try {
      // Example Sentry integration
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(new Error(data.message), {
          tags: {
            context: data.context,
            type: type
          },
          extra: data
        });
      }
      
      // Example LogRocket integration
      if (typeof window !== 'undefined' && (window as any).LogRocket) {
        (window as any).LogRocket.captureException(new Error(data.message));
      }
    } catch (err) {
      console.error('Failed to send to monitoring service:', err);
    }
  }
  
  private static sendToAnalyticsService(event: string, data: any) {
    // Implementation for sending to analytics service
    try {
      // Example Google Analytics integration
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, data);
      }
      
      // Example Mixpanel integration
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        (window as any).mixpanel.track(event, data);
      }
      
      // Example custom analytics endpoint
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event,
            data,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Analytics request failed:', err));
      }
    } catch (err) {
      console.error('Failed to send to analytics service:', err);
    }
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();
  
  static startTimer(label: string): void {
    this.timers.set(label, performance.now());
  }
  
  static endTimer(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(label);
    
    // Log performance metric
    MonitoringService.trackPerformance(label, duration);
    
    return duration;
  }
  
  static measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(label);
    return fn().finally(() => {
      this.endTimer(label);
    });
  }
  
  static measureSync<T>(label: string, fn: () => T): T {
    this.startTimer(label);
    try {
      return fn();
    } finally {
      this.endTimer(label);
    }
  }
}

// Error boundary integration
export const logErrorToMonitoring = (error: Error, errorInfo: any) => {
  MonitoringService.logError(error, 'ErrorBoundary');
  
  // Additional context
  MonitoringService.logEvent('error_boundary_triggered', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    url: typeof window !== 'undefined' ? window.location.href : 'Server'
  });
};

// API monitoring wrapper
export const monitorApiCall = async <T>(
  endpoint: string,
  method: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    MonitoringService.trackApiCall(endpoint, method, 200, duration);
    
    return result;
  } catch (error: any) {
    const duration = performance.now() - startTime;
    const status = error.response?.status || 0;
    
    MonitoringService.trackApiCall(endpoint, method, status, duration);
    MonitoringService.logError(error, `API_${method}_${endpoint}`);
    
    throw error;
  }
};

// User session tracking
export class SessionTracker {
  private static sessionId: string = '';
  private static startTime: number = 0;
  
  static startSession(): void {
    this.sessionId = Math.random().toString(36).substr(2, 9);
    this.startTime = Date.now();
    
    MonitoringService.logEvent('session_start', {
      sessionId: this.sessionId,
      timestamp: this.startTime
    });
  }
  
  static endSession(): void {
    const duration = Date.now() - this.startTime;
    
    MonitoringService.logEvent('session_end', {
      sessionId: this.sessionId,
      duration,
      timestamp: Date.now()
    });
  }
  
  static getSessionId(): string {
    return this.sessionId;
  }
  
  static trackPageView(page: string): void {
    MonitoringService.trackPageView(page);
    
    MonitoringService.logEvent('page_view_session', {
      sessionId: this.sessionId,
      page,
      timestamp: Date.now()
    });
  }
}

// Business metrics tracking
export class BusinessMetrics {
  static trackOrderCreated(orderId: string, amount: number, affiliateCode?: string) {
    MonitoringService.trackConversion('order_created', amount, 'VND');
    
    MonitoringService.logEvent('order_created', {
      orderId,
      amount,
      affiliateCode,
      timestamp: Date.now()
    });
  }
  
  static trackPaymentCompleted(paymentId: string, amount: number, method: string) {
    MonitoringService.trackConversion('payment_completed', amount, 'VND');
    
    MonitoringService.logEvent('payment_completed', {
      paymentId,
      amount,
      method,
      timestamp: Date.now()
    });
  }
  
  static trackAffiliateCommission(affiliateCode: string, amount: number, orderId: string) {
    MonitoringService.logEvent('affiliate_commission', {
      affiliateCode,
      amount,
      orderId,
      timestamp: Date.now()
    });
  }
  
  static trackUserRegistration(userId: string, source?: string) {
    MonitoringService.trackConversion('user_registration');
    
    MonitoringService.logEvent('user_registration', {
      userId,
      source,
      timestamp: Date.now()
    });
  }
}
