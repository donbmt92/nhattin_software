"use client";
import React, { useState, useEffect } from 'react';
import { AffiliateLink, AffiliateLinkStats } from '../types';
import AffiliateLinkService from '../services/affiliateLinkService';
import CreateAffiliateLinkForm from './CreateAffiliateLinkForm';
import AffiliateLinkCard from './AffiliateLinkCard';

const AffiliateLinkManager: React.FC = () => {
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [stats, setStats] = useState<AffiliateLinkStats | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Fetch links and stats in parallel
            const [linksData, statsData] = await Promise.all([
                AffiliateLinkService.getAffiliateLinks(),
                AffiliateLinkService.getAffiliateLinkStats()
            ]);
            
            setLinks(linksData);
            setStats(statsData);
        } catch (error: any) {
            console.error('Lỗi khi tải dữ liệu:', error);
            setError(error.message || 'Không thể tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSuccess = (newLink: AffiliateLink) => {
        setLinks(prev => [newLink, ...prev]);
        setShowCreateForm(false);
        // Refresh stats
        fetchData();
    };

    const handleDisableLink = async (linkCode: string) => {
        try {
            await AffiliateLinkService.disableAffiliateLink(linkCode);
            // Update local state
            setLinks(prev => prev.map(link => 
                link.linkCode === linkCode 
                    ? { ...link, status: 'DISABLED' as const }
                    : link
            ));
            // Refresh stats
            fetchData();
        } catch (error: any) {
            console.error('Lỗi khi vô hiệu hóa link:', error);
            alert('Lỗi khi vô hiệu hóa link: ' + error.message);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="text-center text-red-600">
                    <p className="mb-4">{error}</p>
                    <button 
                        onClick={fetchData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                    🔗 Quản Lý Affiliate Links
                </h3>
                <button 
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    ➕ Tạo Link Mới
                </button>
            </div>

            {/* Thống kê tổng quan */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {stats.totalClicks}
                        </div>
                        <div className="text-sm text-blue-700">Tổng clicks</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {stats.totalConversions}
                        </div>
                        <div className="text-sm text-green-700">Tổng conversions</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            {stats.conversionRate.toFixed(2)}%
                        </div>
                        <div className="text-sm text-purple-700">Conversion rate</div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                            {formatCurrency(stats.totalCommission)}
                        </div>
                        <div className="text-sm text-orange-700">Tổng hoa hồng</div>
                    </div>
                </div>
            )}

            {/* Thống kê chi tiết */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tổng links:</span>
                            <span className="font-semibold text-gray-800">{stats.totalLinks}</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Đang hoạt động:</span>
                            <span className="font-semibold text-green-600">{stats.activeLinks}</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Đã hết hạn:</span>
                            <span className="font-semibold text-red-600">{stats.expiredLinks}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Danh sách links */}
            <div className="space-y-4">
                {links.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-4">🔗</div>
                        <p className="text-lg mb-2">Chưa có affiliate link nào</p>
                        <p className="text-sm">Tạo link đầu tiên để bắt đầu kiếm hoa hồng!</p>
                    </div>
                ) : (
                    links.map(link => (
                        <AffiliateLinkCard 
                            key={link._id} 
                            link={link} 
                            onDisable={handleDisableLink}
                        />
                    ))
                )}
            </div>

            {/* Form tạo link */}
            {showCreateForm && (
                <CreateAffiliateLinkForm 
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
};

export default AffiliateLinkManager;
