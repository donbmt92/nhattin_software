"use client";
import React, { useState, useEffect } from 'react';
import { AffiliateInfo, AffiliateLink } from '@/app/profile/types';
import AffiliateLinkService from '@/app/profile/services/affiliateLinkService';
import CreateAffiliateLinkForm from '@/app/profile/components/CreateAffiliateLinkForm';
import api from '@/app/components/utils/api';

interface ProductAffiliateSectionProps {
    productId: string;
    productName: string;
    productPrice: number;
}

const ProductAffiliateSection: React.FC<ProductAffiliateSectionProps> = ({ 
    productId, 
    productName, 
    productPrice 
}) => {
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
    const [recentLinks, setRecentLinks] = useState<AffiliateLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        checkAffiliateStatus();
        loadRecentLinks();
    }, [productId]);

    const checkAffiliateStatus = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            console.log('🔍 Checking affiliate status...', { token: token ? 'exists' : 'missing' });
            
            if (!token) {
                console.log('❌ No token found');
                setIsChecking(false);
                return;
            }

            const response = await api.get('/affiliates/profile');
            
            console.log('📡 API Response:', { status: response.status, ok: response.status === 200 });
            
            if (response.status === 200) {
                const data = response.data;
                console.log('📊 Affiliate data:', data);

                if (data.success && data.data.status === 'ACTIVE') {
                    console.log('✅ Affiliate is active');
                    setIsAffiliate(true);
                    setAffiliateInfo(data.data);
                } else {
                    console.log('❌ Affiliate not active or not found:', data);
                }
            } else {
                console.log('❌ API call failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('💥 Error checking affiliate status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const loadRecentLinks = async () => {
        if (!isAffiliate) return;
        
        try {
            const links = await AffiliateLinkService.getAffiliateLinks();
            // Filter links for this product
            const productLinks = links.filter(link => link.productId === productId);
            setRecentLinks(productLinks.slice(0, 3)); // Show only 3 recent links
        } catch (error) {
            console.error('Error loading recent links:', error);
        }
    };

    const createQuickLink = async () => {
        if (!affiliateInfo) return;

        setIsLoading(true);
        
        try {
            // Tạo date 30 ngày từ bây giờ
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            
            // Đảm bảo format ISO 8601 đúng
            const isoString = expiresAt.toISOString();
            console.log('📅 [Section] ExpiresAt ISO:', isoString);
            console.log('📅 [Section] ExpiresAt Date:', expiresAt);

            const response = await AffiliateLinkService.createAffiliateLink({
                productId,
                expiresAt: isoString,
                campaignName: `Quick Link - ${productName}`,
                notes: `Tạo nhanh từ trang sản phẩm ${productName}`
            });

            await navigator.clipboard.writeText(response.shortUrl);
            
            alert(`✅ Đã tạo và copy affiliate link!\n\nLink: ${response.shortUrl}\n\nLink sẽ hết hạn sau 30 ngày.`);
            
            // Refresh recent links
            loadRecentLinks();
            
        } catch (error: any) {
            console.error('Error creating quick link:', error);
            alert('❌ Lỗi khi tạo link: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            alert('✅ Đã copy link vào clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    };

    // Don't show section if still checking or not an affiliate
    if (isChecking) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 my-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!isAffiliate) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        🎯 Affiliate Marketing
                    </h3>
                    <p className="text-sm text-gray-600">
                        Tạo link affiliate cho sản phẩm này và kiếm hoa hồng {affiliateInfo?.commissionRate}%
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Hoa hồng</div>
                    <div className="text-lg font-bold text-green-600">
                        {affiliateInfo?.commissionRate}%
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-gray-800">{productName}</h4>
                        <p className="text-sm text-gray-600">Giá: {formatCurrency(productPrice)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Hoa hồng tiềm năng</p>
                        <p className="text-lg font-bold text-green-600">
                            {formatCurrency((productPrice * (affiliateInfo?.commissionRate || 0)) / 100)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button
                    onClick={createQuickLink}
                    disabled={isLoading}
                    className={`px-4 py-3 rounded-lg font-medium text-white transition-all ${
                        isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            ⚡ Tạo Link Nhanh (30 ngày)
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
                >
                    <span className="flex items-center justify-center">
                        ⚙️ Tùy Chỉnh Link
                    </span>
                </button>
            </div>

            {/* Recent Links */}
            {recentLinks.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">🔗 Links gần đây</h4>
                    <div className="space-y-2">
                        {recentLinks.map((link) => (
                            <div key={link._id} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                        {link.campaignName || 'Affiliate Link'}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Hết hạn: {formatDate(link.expiresAt)} | 
                                        Clicks: {link.clickCount} | 
                                        Conversions: {link.conversionCount}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => copyToClipboard(link.shortUrl)}
                                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                    >
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => window.open(link.shortUrl, '_blank')}
                                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">💡 Mẹo tăng hiệu quả:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Chia sẻ link trên mạng xã hội và cộng đồng</li>
                    <li>• Tạo nội dung hấp dẫn về sản phẩm</li>
                    <li>• Theo dõi thống kê để tối ưu hóa</li>
                    <li>• Sử dụng tên chiến dịch để phân loại</li>
                </ul>
            </div>

            {/* Create Form Modal */}
            {showCreateForm && (
                <CreateAffiliateLinkForm 
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={(newLink) => {
                        setRecentLinks(prev => [newLink, ...prev.slice(0, 2)]);
                        setShowCreateForm(false);
                    }}
                    productId={productId}
                />
            )}
        </div>
    );
};

export default ProductAffiliateSection;
