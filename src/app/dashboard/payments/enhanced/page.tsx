// app/dashboard/payments/enhanced/page.tsx
"use client";
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LazyAdminPaymentManagement } from '@/components/LazyComponents';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react';

export default function EnhancedPaymentsPage() {
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
      <div className="enhanced-payments-page p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {isAdmin ? (
                <>
                  <Shield className="h-8 w-8 text-blue-600" />
                  Enhanced Payment Management
                </>
              ) : (
                <>
                  <CreditCard className="h-8 w-8 text-gray-600" />
                  Payment Management
                </>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin 
                ? 'Advanced payment management with comprehensive admin features and analytics'
                : 'View and manage your payments with enhanced features'
              }
            </p>
          </div>
          {isAdmin && (
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <Shield className="h-4 w-4" />
              Admin Access
            </Badge>
          )}
        </div>

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Real-time Analytics</p>
                  <p className="text-xs text-blue-600">Live payment tracking</p>
                </div>
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Advanced Filtering</p>
                  <p className="text-xs text-green-600">Smart search & filters</p>
                </div>
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Bulk Operations</p>
                  <p className="text-xs text-purple-600">Mass payment actions</p>
                </div>
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Export Reports</p>
                  <p className="text-xs text-orange-600">Download analytics</p>
                </div>
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        {isAdmin ? (
          <LazyAdminPaymentManagement />
        ) : (
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Shield className="h-5 w-5" />
                Admin Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="max-w-md mx-auto">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Enhanced Features Available
                </h3>
                <p className="text-gray-500 mb-4">
                  Advanced payment management features are available for admin users only.
                  Contact your administrator to request access.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Real-time payment analytics
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Advanced filtering and search
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Bulk payment operations
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Export and reporting tools
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}
