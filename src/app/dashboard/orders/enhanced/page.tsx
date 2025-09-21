// app/dashboard/orders/enhanced/page.tsx
"use client";
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LazyAdminOrderManagement } from '@/components/LazyComponents';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function EnhancedOrdersPage() {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="enhanced-orders-page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Enhanced Order Management' : 'Order Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin 
              ? 'Advanced order management with admin features'
              : 'View and manage your orders'
            }
          </p>
        </div>
        
        {isAdmin ? (
          <LazyAdminOrderManagement />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">
              Enhanced order management features are available for admin users.
              Please contact administrator for access.
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
