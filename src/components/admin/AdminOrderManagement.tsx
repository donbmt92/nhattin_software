// components/admin/AdminOrderManagement.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useOrderState } from '../../hooks/useOrderState';
import { apiService, Order, OrderStatus } from '../../services/api.service';

export const AdminOrderManagement: React.FC = () => {
  const {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrderDetail,
    updateOrderStatus,
    syncOrderStatus,
    setCurrentOrder,
    clearError
  } = useOrderState();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const handleOrderSelect = async (orderId: string) => {
    try {
      const order = await fetchOrderDetail(orderId);
      setSelectedOrder(order);
      setCurrentOrder(order);
      setShowOrderDetail(true);
    } catch (err) {
      console.error('Error fetching order detail:', err);
    }
  };
  
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setStatusUpdateLoading(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh the order list
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setStatusUpdateLoading(null);
    }
  };
  
  const handleOrderLifecycle = async (orderId: string) => {
    setStatusUpdateLoading(orderId);
    try {
      // Complete lifecycle: PENDING -> PROCESSING -> SHIPPED -> DELIVERED
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      let nextStatus: OrderStatus;
      switch (order.status) {
        case 'PENDING':
          nextStatus = 'PROCESSING';
          break;
        case 'PROCESSING':
          nextStatus = 'SHIPPED';
          break;
        case 'SHIPPED':
          nextStatus = 'DELIVERED';
          break;
        default:
          return;
      }
      
      await updateOrderStatus(orderId, nextStatus);
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order lifecycle:', err);
    } finally {
      setStatusUpdateLoading(null);
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'PENDING': return 'PROCESSING';
      case 'PROCESSING': return 'SHIPPED';
      case 'SHIPPED': return 'DELIVERED';
      default: return null;
    }
  };
  
  if (error) {
    return (
      <div className="admin-order-management">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearError}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-order-management">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Admin Order Management
          </h3>
          
          {isLoading && !orders.length ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Order List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.userId.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.totalAmount.toLocaleString('vi-VN')} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleOrderSelect(order.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {getNextStatus(order.status) && (
                            <button
                              onClick={() => handleOrderLifecycle(order.id)}
                              disabled={statusUpdateLoading === order.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {statusUpdateLoading === order.id ? 'Updating...' : 'Next Step'}
                            </button>
                          )}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            disabled={statusUpdateLoading === order.id}
                            className="text-sm border-gray-300 rounded-md disabled:opacity-50"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {orders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - {selectedOrder.id.slice(0, 8)}...
                </h3>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedOrder.totalAmount.toLocaleString('vi-VN')} VND
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Items</label>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Product {item.productId.slice(0, 8)}...</span>
                        <span className="text-sm font-medium">
                          {item.quantity} x {item.final_price.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedOrder.affiliateCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Affiliate Code</label>
                    <p className="text-gray-900">{selectedOrder.affiliateCode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
