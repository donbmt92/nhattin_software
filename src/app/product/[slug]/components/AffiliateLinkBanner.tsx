"use client";
import React, { useState, useEffect } from 'react';
import api from '@/app/components/utils/api';
import { AffiliateInfo } from '@/app/profile/types';

interface AffiliateLinkBannerProps {
    productId: string;
    productName: string;
}

const AffiliateLinkBanner: React.FC<AffiliateLinkBannerProps> = ({ 
    productId, 
    productName 
}) => {
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        checkAffiliateStatus();
        
        // Show banner after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const checkAffiliateStatus = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) return;

            const response = await api.get('/affiliates/profile');
            
            if (response.status === 200) {
                const data = response.data;
                if (data.success && data.data.status === 'ACTIVE') {
                    setIsAffiliate(true);
                    setAffiliateInfo(data.data);
                }
            }
        } catch (error) {
            console.error('Error checking affiliate status:', error);
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
            console.log('📅 [Banner] ExpiresAt ISO:', isoString);
            console.log('📅 [Banner] ExpiresAt Date:', expiresAt);

            const response = await api.post('/affiliate-links', {
                productId,
                expiresAt: isoString,
                campaignName: `Quick Link - ${productName}`,
                notes: `Tạo nhanh từ banner sản phẩm ${productName}`
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

    const dismissBanner = () => {
        setIsVisible(false);
    };

    if (!isAffiliate || !isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4 border border-blue-300">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-semibold text-sm mb-1">🎯 Kiếm hoa hồng!</h4>
                        <p className="text-xs opacity-90">
                            Tạo affiliate link cho sản phẩm này
                        </p>
                    </div>
                    <button
                        onClick={dismissBanner}
                        className="text-white opacity-70 hover:opacity-100 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                    <div className="text-xs">
                        <p>Hoa hồng: <span className="font-bold">{affiliateInfo?.commissionRate}%</span></p>
                        <p>Code: <span className="font-mono text-xs">{affiliateInfo?.affiliateCode}</span></p>
                    </div>
                </div>

                <button
                    onClick={createQuickLink}
                    className="w-full bg-white text-blue-600 py-2 px-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                    🔗 Tạo Link Nhanh
                </button>
            </div>
        </div>
    );
};

export default AffiliateLinkBanner;
