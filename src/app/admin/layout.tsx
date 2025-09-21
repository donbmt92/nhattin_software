// app/admin/layout.tsx
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/styles/responsive.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="admin-layout min-h-screen bg-gray-50">
        {children}
      </div>
    </ErrorBoundary>
  );
}
