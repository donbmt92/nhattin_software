"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ExternalLink } from 'lucide-react';
import { setAffiliateCode } from '@/app/services/orderService';

export default function AffiliateRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const linkCode = params.linkCode as string;

  useEffect(() => {
    if (!linkCode) {
      setError('Mã affiliate link không hợp lệ');
      setStatus('error');
      return;
    }

    handleAffiliateRedirect();
  }, [linkCode]);

  const handleAffiliateRedirect = async () => {
    try {
      setStatus('loading');
      
      // Gọi API backend để track click và lấy redirect URL
      const response = await fetch(`/api/affiliate/redirect/${linkCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Backend sẽ redirect 302, nên chúng ta cần lấy URL từ response
        const redirectUrl = response.url || '/';
        setRedirectUrl(redirectUrl);
        
        // Set affiliate code để tracking
        setAffiliateCode(linkCode);
        
        setStatus('redirecting');
        
        // Redirect sau 1 giây để user thấy loading
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      } else {
        throw new Error('Affiliate link không hợp lệ hoặc đã hết hạn');
      }
    } catch (error: any) {
      console.error('Error redirecting affiliate link:', error);
      setError(error.message || 'Có lỗi xảy ra khi xử lý affiliate link');
      setStatus('error');
    }
  };

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      router.push('/');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang xử lý affiliate link...
          </h2>
          <p className="text-gray-600">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (status === 'redirecting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang chuyển hướng...
          </h2>
          <p className="text-gray-600 mb-4">
            Bạn sẽ được chuyển đến trang sản phẩm ngay bây giờ
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không thể xử lý affiliate link
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleManualRedirect}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
