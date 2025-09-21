// components/BankTransferModal.tsx
"use client";
import React, { useState } from 'react';
import { PaymentDetail } from '../services/api.service';

interface BankTransferModalProps {
  payment: PaymentDetail;
  onClose: () => void;
  onSubmit: (paymentId: string, transferData: any) => void;
}

export const BankTransferModal: React.FC<BankTransferModalProps> = ({
  payment,
  onClose,
  onSubmit
}) => {
  const [transferData, setTransferData] = useState({
    bankName: '',
    transferDate: '',
    transferNote: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transferData.bankName || !transferData.transferDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(payment.id, transferData);
    } catch (error) {
      console.error('Error submitting bank transfer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransferData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Bank Transfer Processing
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Payment ID:</strong> {payment.id.slice(0, 8)}...
            </p>
            <p className="text-sm text-gray-600">
              <strong>Amount:</strong> {payment.amount.toLocaleString('vi-VN')} VND
            </p>
            <p className="text-sm text-gray-600">
              <strong>Order ID:</strong> {payment.orderId.slice(0, 8)}...
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                Bank Name *
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={transferData.bankName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Vietcombank, Techcombank..."
              />
            </div>
            
            <div>
              <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">
                Transfer Date *
              </label>
              <input
                type="date"
                id="transferDate"
                name="transferDate"
                value={transferData.transferDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="transferNote" className="block text-sm font-medium text-gray-700">
                Transfer Note
              </label>
              <textarea
                id="transferNote"
                name="transferNote"
                value={transferData.transferNote}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Additional notes about the transfer..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Process Transfer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
