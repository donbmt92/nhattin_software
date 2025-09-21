// components/LazyComponents.tsx
"use client";
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load admin components
const AdminOrderManagement = lazy(() => import('./admin/AdminOrderManagement'));
const AdminPaymentManagement = lazy(() => import('./admin/AdminPaymentManagement'));
const BankTransferModal = lazy(() => import('./BankTransferModal'));

// Lazy load regular components
const ErrorBoundary = lazy(() => import('./ErrorBoundary'));
const StatusIndicator = lazy(() => import('./StatusIndicator'));
const MessageToast = lazy(() => import('./MessageToast'));

// Lazy load pages (if needed)
// const AdminDashboard = lazy(() => import('../app/admin/dashboard/page'));
// const OrderManagement = lazy(() => import('../app/dashboard/orders/page'));
// const PaymentManagement = lazy(() => import('../app/dashboard/payments/page'));

// Wrapper components with loading fallbacks
export const LazyAdminOrderManagement = () => (
  <Suspense fallback={<LoadingSpinner text="Loading Order Management..." />}>
    <AdminOrderManagement />
  </Suspense>
);

export const LazyAdminPaymentManagement = () => (
  <Suspense fallback={<LoadingSpinner text="Loading Payment Management..." />}>
    <AdminPaymentManagement />
  </Suspense>
);

export const LazyBankTransferModal = () => (
  <Suspense fallback={<LoadingSpinner text="Loading Bank Transfer..." />}>
    <BankTransferModal />
  </Suspense>
);

export const LazyErrorBoundary = () => (
  <Suspense fallback={<LoadingSpinner text="Loading Error Handler..." />}>
    <ErrorBoundary />
  </Suspense>
);

export const LazyStatusIndicator = () => (
  <Suspense fallback={<div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>}>
    <StatusIndicator />
  </Suspense>
);

export const LazyMessageToast = () => (
  <Suspense fallback={<div className="animate-pulse bg-gray-200 h-12 w-64 rounded"></div>}>
    <MessageToast />
  </Suspense>
);

// Page-level lazy components (commented out to avoid circular imports)
// export const LazyAdminDashboard = () => (
//   <Suspense fallback={<LoadingSpinner size="large" text="Loading Admin Dashboard..." />}>
//     <AdminDashboard />
//   </Suspense>
// );

// export const LazyOrderManagement = () => (
//   <Suspense fallback={<LoadingSpinner size="large" text="Loading Order Management..." />}>
//     <OrderManagement />
//   </Suspense>
// );

// export const LazyPaymentManagement = () => (
//   <Suspense fallback={<LoadingSpinner size="large" text="Loading Payment Management..." />}>
//     <PaymentManagement />
//   </Suspense>
// );

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  const WrappedComponent = (props: P) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Utility for dynamic imports
export const loadComponent = async (componentPath: string) => {
  try {
    const module = await import(componentPath);
    return module.default;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    throw error;
  }
};

// Preload components for better performance
export const preloadComponents = () => {
  // Preload critical components
  import('./admin/AdminOrderManagement');
  import('./admin/AdminPaymentManagement');
  import('./ErrorBoundary');
  import('./StatusIndicator');
  import('./MessageToast');
};

// Component registry for dynamic loading (commented out to avoid warnings)
// export const componentRegistry = {
//   'AdminOrderManagement': () => import('./admin/AdminOrderManagement'),
//   'AdminPaymentManagement': () => import('./admin/AdminPaymentManagement'),
//   'BankTransferModal': () => import('./BankTransferModal'),
//   'ErrorBoundary': () => import('./ErrorBoundary'),
//   'StatusIndicator': () => import('./StatusIndicator'),
//   'MessageToast': () => import('./MessageToast'),
//   'LoadingSpinner': () => import('./LoadingSpinner')
// };

// Dynamic component loader
export const loadDynamicComponent = async (componentName: string) => {
  const loader = componentRegistry[componentName as keyof typeof componentRegistry];
  
  if (!loader) {
    throw new Error(`Component ${componentName} not found in registry`);
  }
  
  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load dynamic component: ${componentName}`, error);
    throw error;
  }
};
