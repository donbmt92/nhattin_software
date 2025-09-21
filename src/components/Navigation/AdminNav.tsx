// components/Navigation/AdminNav.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { LoadingSpinner } from '../LoadingSpinner';

export const AdminNav: React.FC = () => {
  const { isAdmin, isLoading, logoutAdmin } = useAdminAuth();

  if (isLoading) {
    return <LoadingSpinner size="small" />;
  }

  if (!isAdmin) {
    return (
      <Link 
        href="/admin/login"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Admin Login
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link 
        href="/admin/dashboard"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Admin Dashboard
      </Link>
      <Link 
        href="/dashboard/orders/enhanced"
        className="text-gray-600 hover:text-gray-800 font-medium"
      >
        Enhanced Orders
      </Link>
      <Link 
        href="/dashboard/payments/enhanced"
        className="text-gray-600 hover:text-gray-800 font-medium"
      >
        Enhanced Payments
      </Link>
      <button
        onClick={logoutAdmin}
        className="text-red-600 hover:text-red-800 font-medium"
      >
        Logout Admin
      </button>
    </div>
  );
};
