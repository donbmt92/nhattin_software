// components/MessageToast.tsx
"use client";
import React, { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface MessageToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  showIcon?: boolean;
  className?: string;
}

export const MessageToast: React.FC<MessageToastProps> = ({ 
  message, 
  type, 
  duration = 5000,
  onClose,
  position = 'top-right',
  showIcon = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Animation duration
  };
  
  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          icon: '✅',
          borderColor: 'border-green-600'
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          icon: '❌',
          borderColor: 'border-red-600'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          icon: '⚠️',
          borderColor: 'border-yellow-600'
        };
      case 'info':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          icon: 'ℹ️',
          borderColor: 'border-blue-600'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          icon: 'ℹ️',
          borderColor: 'border-gray-600'
        };
    }
  };
  
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };
  
  const config = getToastConfig(type);
  const positionClasses = getPositionClasses(position);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed ${positionClasses} z-50 transition-all duration-300 ${
        isExiting ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
      }`}
    >
      <div 
        className={`${config.bgColor} ${config.textColor} px-6 py-3 rounded-lg shadow-lg border ${config.borderColor} max-w-sm ${className}`}
      >
        <div className="flex items-center">
          {showIcon && (
            <span className="mr-2 text-lg" role="img" aria-label={type}>
              {config.icon}
            </span>
          )}
          <span className="flex-1 text-sm font-medium">{message}</span>
          <button
            onClick={handleClose}
            className="ml-3 text-white hover:text-gray-200 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast container for managing multiple toasts
interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right' 
}) => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
  }>>([]);
  
  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };
  
  return (
    <div className={`fixed ${getPositionClasses(position)} z-50 space-y-2`}>
      {toasts.map((toast) => (
        <MessageToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const showToast = (message: string, type: ToastType, duration?: number) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium max-w-sm`;
    
    // Set background color based on type
    switch (type) {
      case 'success':
        toast.className += ' bg-green-500 border border-green-600';
        break;
      case 'error':
        toast.className += ' bg-red-500 border border-red-600';
        break;
      case 'warning':
        toast.className += ' bg-yellow-500 border border-yellow-600';
        break;
      case 'info':
        toast.className += ' bg-blue-500 border border-blue-600';
        break;
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration || 5000);
  };
  
  return {
    showSuccess: (message: string, duration?: number) => showToast(message, 'success', duration),
    showError: (message: string, duration?: number) => showToast(message, 'error', duration),
    showWarning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    showInfo: (message: string, duration?: number) => showToast(message, 'info', duration)
  };
};

// Predefined toast components
export const SuccessToast: React.FC<Omit<MessageToastProps, 'type'>> = (props) => (
  <MessageToast {...props} type="success" />
);

export const ErrorToast: React.FC<Omit<MessageToastProps, 'type'>> = (props) => (
  <MessageToast {...props} type="error" />
);

export const WarningToast: React.FC<Omit<MessageToastProps, 'type'>> = (props) => (
  <MessageToast {...props} type="warning" />
);

export const InfoToast: React.FC<Omit<MessageToastProps, 'type'>> = (props) => (
  <MessageToast {...props} type="info" />
);
