// components/admin/AdminPaymentManagement.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { usePaymentState } from '../../hooks/usePaymentState';
import { apiService, PaymentDetail, PaymentStatus } from '../../services/api.service';
import { BankTransferModal } from '../BankTransferModal';

export const AdminPaymentManagement: React.FC = () => {
  const {
    payments,
    currentPayment,
    isLoading,
    error,
    fetchPayments,
    fetchPaymentDetail,
    approvePayment,
    handleBankTransfer,
    clearError
  } = usePaymentState();
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);
  
  const handlePaymentSelect = async (paymentId: string) => {
    try {
      const payment = await fetchPaymentDetail(paymentId);
      setSelectedPayment(payment);
      setShowPaymentDetail(true);
    } catch (err) {
      console.error('Error fetching payment detail:', err);
    }
  };
  
  const handleApprovePayment = async (paymentId: string, transactionRef: string) => {
    setActionLoading(paymentId);
    try {
      await approvePayment(paymentId, transactionRef);
      await fetchPayments();
    } catch (err) {
      console.error('Error approving payment:', err);
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleBankTransferSubmit = async (paymentId: string, transferData: any) => {
    setActionLoading(paymentId);
    try {
      await handleBankTransfer(paymentId, transferData);
      await fetchPayments();
      setShowBankTransferModal(false);
    } catch (err) {
      console.error('Error processing bank transfer:', err);
    } finally {
      setActionLoading(null);
    }
  };
  
  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const canApprove = (payment: PaymentDetail) => {
    return payment.status === 'PENDING' && payment.paymentMethod === 'vnpay';
  };
  
  const canProcessBankTransfer = (payment: PaymentDetail) => {
    return payment.status === 'PENDING' && payment.paymentMethod === 'bank_transfer';
  };
  
  if (error) {
    return (
      <div className="admin-payment-management">
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
    <div className="admin-payment-management">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Admin Payment Management
          </h3>
          
          {isLoading && !payments.length ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
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
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.orderId.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.amount.toLocaleString('vi-VN')} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handlePaymentSelect(payment.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {canApprove(payment) && (
                            <button
                              onClick={() => {
                                const transactionRef = prompt('Enter transaction reference:');
                                if (transactionRef) {
                                  handleApprovePayment(payment.id, transactionRef);
                                }
                              }}
                              disabled={actionLoading === payment.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {actionLoading === payment.id ? 'Processing...' : 'Approve'}
                            </button>
                          )}
                          {canProcessBankTransfer(payment) && (
                            <button
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowBankTransferModal(true);
                              }}
                              disabled={actionLoading === payment.id}
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                            >
                              Bank Transfer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {payments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payments found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Detail Modal */}
      {showPaymentDetail && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Details - {selectedPayment.id.slice(0, 8)}...
                </h3>
                <button
                  onClick={() => setShowPaymentDetail(false)}
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPayment.amount.toLocaleString('vi-VN')} VND
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-gray-900">{selectedPayment.paymentMethod}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-gray-900">{selectedPayment.orderId}</p>
                </div>
                
                {selectedPayment.transactionRef && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Reference</label>
                    <p className="text-gray-900">{selectedPayment.transactionRef}</p>
                  </div>
                )}
                
                {selectedPayment.bankTransferInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Transfer Info</label>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm"><strong>Bank:</strong> {selectedPayment.bankTransferInfo.bankName}</p>
                      <p className="text-sm"><strong>Date:</strong> {selectedPayment.bankTransferInfo.transferDate}</p>
                      <p className="text-sm"><strong>Note:</strong> {selectedPayment.bankTransferInfo.transferNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bank Transfer Modal */}
      {showBankTransferModal && selectedPayment && (
        <BankTransferModal
          payment={selectedPayment}
          onClose={() => setShowBankTransferModal(false)}
          onSubmit={handleBankTransferSubmit}
        />
      )}
    </div>
  );
};
