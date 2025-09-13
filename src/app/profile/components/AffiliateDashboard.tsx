"use client";
import React, { useState, useEffect } from 'react';
import { AffiliateInfo, AffiliateStats as AffiliateStatsType } from '../types';
import AffiliateLinkManager from './AffiliateLinkManager';
import AffiliateStats from './AffiliateStats';
import AffiliateService from '../services/affiliateService';

const AffiliateDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'links' | 'stats' | 'earnings'>('links');
    const [affiliateProfile, setAffiliateProfile] = useState<AffiliateInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAffiliateProfile();
    }, []);

    const fetchAffiliateProfile = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const profile = await AffiliateService.getAffiliateProfile();
            setAffiliateProfile(profile);
        } catch (error: any) {
            console.error('Error fetching affiliate profile:', error);
            setError(error.message || 'Không thể tải thông tin affiliate');
        } finally {
            setIsLoading(false);
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
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center text-red-600">
                    <p className="mb-4">{error}</p>
                    <button 
                        onClick={fetchAffiliateProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!affiliateProfile) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Chưa đăng ký Affiliate
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Bạn cần đăng ký làm affiliate để sử dụng các tính năng này.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/profile'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Đăng ký Affiliate
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            🎯 Affiliate Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và theo dõi hiệu quả affiliate marketing của bạn
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Trạng thái</div>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            affiliateProfile.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800'
                                : affiliateProfile.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {affiliateProfile.status === 'ACTIVE' ? 'Đang hoạt động' :
                             affiliateProfile.status === 'PENDING' ? 'Đang chờ duyệt' :
                             affiliateProfile.status === 'INACTIVE' ? 'Không hoạt động' : 'Bị tạm khóa'}
                        </span>
                    </div>
                </div>

                {/* Affiliate Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Affiliate Code</p>
                                <p className="text-lg font-bold text-blue-800 font-mono">
                                    {affiliateProfile.affiliateCode}
                                </p>
                            </div>
                            <div className="text-2xl">🎫</div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">Tỷ lệ hoa hồng</p>
                                <p className="text-lg font-bold text-green-800">
                                    {affiliateProfile.commissionRate}%
                                </p>
                            </div>
                            <div className="text-2xl">💰</div>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium">Tổng thu nhập</p>
                                <p className="text-lg font-bold text-purple-800">
                                    {formatCurrency(affiliateProfile.totalEarnings)}
                                </p>
                            </div>
                            <div className="text-2xl">💎</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('links')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'links'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            🔗 Quản lý Links
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'stats'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            📊 Thống kê
                        </button>
                        <button
                            onClick={() => setActiveTab('earnings')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'earnings'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            💰 Hoa hồng
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'links' && <AffiliateLinkManager />}
                    {activeTab === 'stats' && affiliateProfile && <AffiliateStats affiliateInfo={affiliateProfile} />}
                    {activeTab === 'earnings' && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Quản lý Hoa hồng
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Tính năng quản lý hoa hồng đang được phát triển.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <strong>Thu nhập đang chờ:</strong> {formatCurrency(affiliateProfile.pendingEarnings)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Số tiền rút tối thiểu:</strong> {formatCurrency(affiliateProfile.minPayoutAmount)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AffiliateDashboard;
