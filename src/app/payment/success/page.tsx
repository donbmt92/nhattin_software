"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const router = useRouter();

  // Redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--clr-txt-1)' }}>
          Thanh toán thành công!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
        </p>
        
        <div className="flex justify-center mb-6">
          <CheckCircle size={120} className="text-green-500" strokeWidth={1} />
        </div>
        
        <div className="text-sm text-gray-500 mb-6">
          Bạn sẽ được chuyển về trang chủ sau 5 giây...
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/order')}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-2 px-4 rounded-md text-white font-medium"
            style={{ backgroundColor: 'var(--clr-bg-7)' }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
} 