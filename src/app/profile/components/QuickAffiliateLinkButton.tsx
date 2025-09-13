"use client";
import React, { useState, useEffect } from 'react';
import { AffiliateInfo } from '../types';
import AffiliateLinkService from '../services/affiliateLinkService';

interface QuickAffiliateLinkButtonProps {
    productId: string;
    productName: string;
    className?: string;
}

const QuickAffiliateLinkButton: React.FC<QuickAffiliateLinkButtonProps> = ({ 
    productId, 
    productName,
    className = ""
}) => {
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        checkAffiliateStatus();
    }, []);

    const checkAffiliateStatus = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setIsChecking(false);
                return;
            }

            const response = await fetch('/api/affiliates/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data.status === 'ACTIVE') {
                    setIsAffiliate(true);
                    setAffiliateInfo(data.data);
                }
            }
        } catch (error) {
            console.error('Error checking affiliate status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const createQuickLink = async () => {
        if (!affiliateInfo) return;

        setIsLoading(true);
        
        try {
            // Set expiration date to 30 days from now
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            const response = await AffiliateLinkService.createAffiliateLink({
                productId,
                expiresAt: expiresAt.toISOString(),
                campaignName: `Quick Link - ${productName}`,
                notes: `Tạo nhanh từ trang sản phẩm ${productName}`
            });

            // Copy link to clipboard
            await navigator.clipboard.writeText(response.shortUrl);
            
            // Show success message
            alert(`✅ Đã tạo và copy affiliate link!\n\nLink: ${response.shortUrl}\n\nLink sẽ hết hạn sau 30 ngày.`);
            
        } catch (error: any) {
            console.error('Error creating quick link:', error);
            alert('❌ Lỗi khi tạo link: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show button if still checking or not an affiliate
    if (isChecking || !isAffiliate) {
        return null;
    }

    return (
        <div className={`affiliate-quick-actions ${className}`}>
            <button
                onClick={createQuickLink}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
                    isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                    </span>
                ) : (
                    <span className="flex items-center">
                        🔗 Tạo Affiliate Link
                    </span>
                )}
            </button>
            
            <div className="mt-2 text-xs text-gray-600">
                <p>💡 Tạo link nhanh cho sản phẩm này</p>
                <p>Hoa hồng: {affiliateInfo?.commissionRate}%</p>
            </div>
        </div>
    );
};

export default QuickAffiliateLinkButton;
