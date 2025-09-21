"use client";
import React, { useState, useEffect } from 'react';
import { AffiliateStats as AffiliateStatsType, AffiliateInfo } from '../types';
import api from '../../components/utils/api';
import AffiliateService from '../services/affiliateService';

interface AffiliateStatsProps {
    affiliateInfo: AffiliateInfo;
}

const AffiliateStats: React.FC<AffiliateStatsProps> = ({ affiliateInfo }) => {
    const [stats, setStats] = useState<AffiliateStatsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRequestingPayout, setIsRequestingPayout] = useState(false);
    const [payoutMessage, setPayoutMessage] = useState('');
    console.log("affiliateInfo",affiliateInfo);
    useEffect(() => {
        fetchAffiliateStats();
    }, [affiliateInfo._id]);

    const fetchAffiliateStats = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) return;

            const response = await api.get('/affiliates/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error: any) {
            console.error('Lỗi khi lấy thống kê affiliate:', error);
            setError('Không thể tải thống kê affiliate');
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

    const handleRequestPayout = async () => {
        if (!stats || stats.pendingEarnings < affiliateInfo.minPayoutAmount) {
            return;
        }

        try {
            setIsRequestingPayout(true);
            setPayoutMessage('');

            const result = await AffiliateService.requestPayout(stats.pendingEarnings);
            
            setPayoutMessage(result.message);
            
            // Refresh stats after successful payout request
            setTimeout(() => {
                fetchAffiliateStats();
            }, 1000);
            
        } catch (error: any) {
            setPayoutMessage(error.message || 'Có lỗi xảy ra khi yêu cầu rút tiền');
        } finally {
            setIsRequestingPayout(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </div>
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
                    <p>{error}</p>
                    <button 
                        onClick={fetchAffiliateStats}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                📊 Thống Kê Affiliate
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Tổng số giới thiệu */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                        {stats?.totalReferrals || 0}
                    </div>
                    <div className="text-sm text-gray-600">Tổng giới thiệu</div>
                </div>

                {/* Tổng số đơn hàng */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                        {stats?.totalOrders || 0}
                    </div>
                    <div className="text-sm text-gray-600">Đơn hàng thành công</div>
                </div>

                {/* Tổng thu nhập */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                        {formatCurrency(stats?.totalEarnings || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tổng thu nhập</div>
                </div>

                {/* Thu nhập đang chờ */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                        {formatCurrency(stats?.pendingEarnings || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Đang chờ rút</div>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                        💰 Thông Tin Hoa Hồng
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Tỷ lệ hoa hồng:</span>
                            <span className="font-semibold text-green-600">
                                {affiliateInfo.commissionRate}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Số tiền rút tối thiểu:</span>
                            <span className="font-semibold text-blue-600">
                                {formatCurrency(affiliateInfo.minPayoutAmount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                                affiliateInfo.status === 'ACTIVE' 
                                    ? 'bg-green-100 text-green-800'
                                    : affiliateInfo.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {affiliateInfo.status === 'ACTIVE' ? 'Đang hoạt động' :
                                 affiliateInfo.status === 'PENDING' ? 'Đang chờ duyệt' :
                                 affiliateInfo.status === 'INACTIVE' ? 'Không hoạt động' : 'Bị tạm khóa'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                        🏦 Thông Tin Thanh Toán
                    </h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-sm text-gray-600 mb-1">Ngân hàng</div>
                            <div className="font-medium">{affiliateInfo.paymentInfo.bankName}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-sm text-gray-600 mb-1">Số tài khoản</div>
                            <div className="font-mono font-medium">{affiliateInfo.paymentInfo.accountNumber}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-sm text-gray-600 mb-1">Chủ tài khoản</div>
                            <div className="font-medium">{affiliateInfo.paymentInfo.accountHolder}</div>
                        </div>
                        {affiliateInfo.paymentInfo.bankCode && (
                            <div className="p-3 bg-gray-50 rounded-md">
                                <div className="text-sm text-gray-600 mb-1">Mã ngân hàng</div>
                                <div className="font-medium">{affiliateInfo.paymentInfo.bankCode}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">💡 Hướng dẫn sử dụng:</h4>
                <div className="text-sm text-blue-700 space-y-2">
                    <p>
                        <strong>1. Chia sẻ mã affiliate:</strong> Sử dụng mã <code className="bg-blue-100 px-2 py-1 rounded">
                            {affiliateInfo.affiliateCode}
                        </code> để giới thiệu khách hàng.
                    </p>
                    <p>
                        <strong>2. Nhận hoa hồng:</strong> Bạn sẽ nhận được {affiliateInfo.commissionRate}% hoa hồng từ mỗi đơn hàng thành công.
                    </p>
                    <p>
                        <strong>3. Rút tiền:</strong> Khi đạt đủ {formatCurrency(affiliateInfo.minPayoutAmount)}, bạn có thể yêu cầu rút tiền về tài khoản ngân hàng.
                    </p>
                    <p>
                        <strong>4. Theo dõi:</strong> Cập nhật thống kê real-time để theo dõi hiệu quả của chương trình affiliate.
                    </p>
                </div>
            </div>

            {/* Nút rút tiền */}
            {stats && stats.pendingEarnings >= affiliateInfo.minPayoutAmount && (
                <div className="mt-6 text-center">
                    <button 
                        onClick={handleRequestPayout}
                        disabled={isRequestingPayout}
                        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRequestingPayout ? '⏳ Đang xử lý...' : '💰 Yêu Cầu Rút Tiền'}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                        Bạn có thể rút {formatCurrency(stats.pendingEarnings)} về tài khoản ngân hàng
                    </p>
                    
                    {/* Payout Message */}
                    {payoutMessage && (
                        <div className={`mt-3 p-3 rounded-md text-sm ${
                            payoutMessage.includes('thành công') 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {payoutMessage}
                        </div>
                    )}
                </div>
            )}

            {stats && stats.pendingEarnings < affiliateInfo.minPayoutAmount && (
                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-600">
                        Cần thêm {formatCurrency(affiliateInfo.minPayoutAmount - (stats.pendingEarnings || 0))} để có thể rút tiền
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateStats;
