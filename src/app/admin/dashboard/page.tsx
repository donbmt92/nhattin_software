// app/admin/dashboard/page.tsx
"use client";
import React from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { LazyAdminOrderManagement } from '@/components/LazyComponents';
import { LazyAdminPaymentManagement } from '@/components/LazyComponents';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  return (
    <ErrorBoundary>
      <AdminRoute requiredPermission="admin_dashboard">
        <div className="admin-dashboard min-h-screen bg-gray-50">
          <div className="responsive-container py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Quản lý đơn hàng và thanh toán
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Management */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quản Lý Đơn Hàng
                  </h2>
                  <LazyAdminOrderManagement />
                </div>
              </div>
              
              {/* Payment Management */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quản Lý Thanh Toán
                  </h2>
                  <LazyAdminPaymentManagement />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminRoute>
    </ErrorBoundary>
  );
}
