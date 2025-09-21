// components/StatusIndicator.tsx
"use client";
import React from 'react';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
type GeneralStatus = 'active' | 'inactive' | 'success' | 'warning' | 'error';

interface StatusIndicatorProps {
  status: OrderStatus | PaymentStatus | GeneralStatus | string;
  type?: 'order' | 'payment' | 'general';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  type = 'general',
  size = 'medium',
  showIcon = false,
  className = ''
}) => {
  const getStatusConfig = (status: string, type: string) => {
    const statusLower = status.toLowerCase();
    
    if (type === 'order') {
      switch (statusLower) {
        case 'pending':
          return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: '⏳',
            label: 'PENDING'
          };
        case 'processing':
          return {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: '🔄',
            label: 'PROCESSING'
          };
        case 'shipped':
          return {
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            icon: '🚚',
            label: 'SHIPPED'
          };
        case 'delivered':
          return {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: '✅',
            label: 'DELIVERED'
          };
        case 'cancelled':
          return {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: '❌',
            label: 'CANCELLED'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: '❓',
            label: status.toUpperCase()
          };
      }
    }
    
    if (type === 'payment') {
      switch (statusLower) {
        case 'pending':
          return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: '⏳',
            label: 'PENDING'
          };
        case 'processing':
          return {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: '🔄',
            label: 'PROCESSING'
          };
        case 'completed':
          return {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: '✅',
            label: 'COMPLETED'
          };
        case 'failed':
          return {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: '❌',
            label: 'FAILED'
          };
        case 'cancelled':
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: '🚫',
            label: 'CANCELLED'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: '❓',
            label: status.toUpperCase()
          };
      }
    }
    
    // General status
    switch (statusLower) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '🟢',
          label: 'ACTIVE'
        };
      case 'inactive':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⚪',
          label: 'INACTIVE'
        };
      case 'success':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅',
          label: 'SUCCESS'
        };
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⚠️',
          label: 'WARNING'
        };
      case 'error':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌',
          label: 'ERROR'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓',
          label: status.toUpperCase()
        };
    }
  };
  
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-base';
      default: // medium
        return 'px-3 py-1 text-sm';
    }
  };
  
  const config = getStatusConfig(status, type);
  const sizeClasses = getSizeClasses(size);
  
  return (
    <span 
      className={`inline-flex items-center font-semibold rounded-full border ${config.color} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <span className="mr-1" role="img" aria-label={config.label}>
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );
};

// Specific components for common use cases
export const OrderStatusIndicator: React.FC<Omit<StatusIndicatorProps, 'type'>> = (props) => (
  <StatusIndicator {...props} type="order" />
);

export const PaymentStatusIndicator: React.FC<Omit<StatusIndicatorProps, 'type'>> = (props) => (
  <StatusIndicator {...props} type="payment" />
);

// Status badge with count
interface StatusBadgeProps extends StatusIndicatorProps {
  count?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  count, 
  ...props 
}) => {
  if (!count) {
    return <StatusIndicator {...props} />;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <StatusIndicator {...props} />
      <span className="text-sm text-gray-500">({count})</span>
    </div>
  );
};

// Status with description
interface StatusWithDescriptionProps extends StatusIndicatorProps {
  description?: string;
}

export const StatusWithDescription: React.FC<StatusWithDescriptionProps> = ({ 
  description, 
  ...props 
}) => {
  return (
    <div className="flex flex-col">
      <StatusIndicator {...props} />
      {description && (
        <span className="text-xs text-gray-500 mt-1">{description}</span>
      )}
    </div>
  );
};

// Status timeline component
interface StatusTimelineProps {
  statuses: Array<{
    status: string;
    label: string;
    active: boolean;
    completed: boolean;
  }>;
  type?: 'order' | 'payment';
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ 
  statuses, 
  type = 'order' 
}) => {
  return (
    <div className="flex items-center space-x-4">
      {statuses.map((item, index) => (
        <div key={index} className="flex items-center">
          <StatusIndicator
            status={item.status}
            type={type}
            size="small"
            className={item.completed ? '' : 'opacity-50'}
          />
          {index < statuses.length - 1 && (
            <div className={`w-8 h-0.5 mx-2 ${item.completed ? 'bg-gray-300' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};
