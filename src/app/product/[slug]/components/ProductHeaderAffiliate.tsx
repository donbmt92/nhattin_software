"use client";
import React, { useState, useEffect } from 'react';
import { AffiliateInfo } from '@/app/profile/types';
import api from '@/app/components/utils/api';

interface ProductHeaderAffiliateProps {
    productId: string;
    productName: string;
}

const ProductHeaderAffiliate: React.FC<ProductHeaderAffiliateProps> = ({ 
    productId, 
    productName 
}) => {
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        checkAffiliateStatus();
    }, []);

    const checkAffiliateStatus = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            console.log('🔍 [Header] Checking affiliate status...', { token: token ? 'exists' : 'missing' });
            
            if (!token) {
                console.log('❌ [Header] No token found');
                return;
            }

            const response = await api.get('/affiliates/profile');
            
            console.log('📡 [Header] API Response:', { status: response.status, ok: response.status === 200 });
            
            if (response.status === 200) {
                const data = response.data;
                console.log('📊 [Header] Affiliate data:', data);

                if (data.success && data.data.status === 'ACTIVE') {
                    console.log('✅ [Header] Affiliate is active');
                    setIsAffiliate(true);
                    setAffiliateInfo(data.data);
                } else {
                    console.log('❌ [Header] Affiliate not active or not found:', data);
                }
            } else {
                console.log('❌ [Header] API call failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('💥 [Header] Error checking affiliate status:', error);
        }
    };

    const createQuickLink = async () => {
        if (!affiliateInfo) return;

        try {
            // Tạo date 30 ngày từ bây giờ
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            
            // Đảm bảo format ISO 8601 đúng
            const isoString = expiresAt.toISOString();
            console.log('📅 [Header] ExpiresAt ISO:', isoString);
            console.log('📅 [Header] ExpiresAt Date:', expiresAt);

            const response = await api.post('/affiliate-links', {
                productId,
                expiresAt: isoString,
                campaignName: `Quick Link - ${productName}`,
                notes: `Tạo nhanh từ header sản phẩm ${productName}`
            });

            const result = response.data;
            
            if (result.success) {
                await navigator.clipboard.writeText(result.data.shortUrl);
                alert(`✅ Đã tạo và copy affiliate link!\n\nLink: ${result.data.shortUrl}`);
            }
        } catch (error: any) {
            console.error('Error creating quick link:', error);
            alert('❌ Lỗi khi tạo link: ' + error.message);
        }
    };

    if (!isAffiliate) {
        return null;
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={createQuickLink}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
                <span className="mr-1">🎯</span>
                Affiliate
                <span className="ml-1 text-xs opacity-75">
                    {affiliateInfo?.commissionRate}%
                </span>
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-50">
                    <div className="text-center">
                        <p className="font-semibold mb-1">Tạo Affiliate Link</p>
                        <p className="opacity-90 mb-2">
                            Nhận hoa hồng {affiliateInfo?.commissionRate}% từ sản phẩm này
                        </p>
                        <p className="text-xs opacity-75">
                            Click để tạo link và copy vào clipboard
                        </p>
                    </div>
                    {/* Arrow */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductHeaderAffiliate;
