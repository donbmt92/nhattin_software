"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { affiliateService, AffiliateProfile, Commission, AffiliateLink } from '../../../../services/affiliateService';

interface AffiliateWithUser extends AffiliateProfile {
    id: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
    commissionRate: number;
    totalEarnings: number;
    totalReferrals: number;
    approvedReferrals: number;
    createdAt: string;
    updatedAt: string;
    paymentInfo?: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        phone?: string;
    };
}

export default function AffiliateDetailPage() {
    const router = useRouter();
    const params = useParams();
    const affiliateId = params.id as string;
    
    const [affiliate, setAffiliate] = useState<AffiliateWithUser | null>(null);
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Check authentication
        const checkAuth = () => {
            const token = localStorage.getItem('nhattin_token');
            const userData = localStorage.getItem('nhattin_user');

            if (!token || !userData) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(userData);
            if (user.role !== 'ADMIN') {
                router.push('/');
                return;
            }

            loadAffiliateData();
        };

        checkAuth();
    }, [router, affiliateId]);

    const loadAffiliateData = async () => {
        try {
            setLoading(true);
            
            // Load affiliate data
            const affiliateResponse = await affiliateService.getAffiliateById(affiliateId);
            if (affiliateResponse.success) {
                setAffiliate(affiliateResponse.data as AffiliateWithUser);
            }
            
            // Load commissions data
            const commissionsResponse = await affiliateService.getAffiliateCommissions(affiliateId);
            if (commissionsResponse.success) {
                setCommissions(commissionsResponse.data.commissions);
            }
            
            // Load affiliate links data
            const linksResponse = await affiliateService.getAdminAffiliateLinks(affiliateId);
            if (linksResponse.success) {
                setAffiliateLinks(linksResponse.data.links);
            }
        } catch (error) {
            console.error('Error loading affiliate data:', error);
            // Fallback to mock data if API fails
            const mockAffiliate: AffiliateWithUser = {
                id: affiliateId,
                userId: 'user1',
                affiliateCode: 'USER123ABC456',
                commissionRate: 5.0,
                totalEarnings: 1250000,
                totalReferrals: 25,
                approvedReferrals: 20,
                status: 'ACTIVE',
                minPayoutAmount: 100000,
                createdAt: '2024-01-15T00:00:00Z',
                updatedAt: '2024-01-20T00:00:00Z',
                paymentInfo: {
                    bankName: 'Vietcombank',
                    accountNumber: '1234567890',
                    accountHolder: 'Nguyễn Văn A'
                },
                user: {
                    id: 'user1',
                    name: 'Nguyễn Văn A',
                    email: 'nguyenvana@email.com',
                    phone: '0123456789'
                }
            };

            setAffiliate(mockAffiliate);
            setCommissions([]);
            setAffiliateLinks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            const response = await affiliateService.updateAffiliateStatus(affiliateId, newStatus);
            if (response.success && affiliate) {
                setAffiliate({
                    ...affiliate,
                    status: newStatus as any,
                    updatedAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error updating affiliate status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái affiliate');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
            ACTIVE: { color: 'bg-green-100 text-green-800', text: 'Hoạt động' },
            REJECTED: { color: 'bg-red-100 text-red-800', text: 'Từ chối' },
            SUSPENDED: { color: 'bg-gray-100 text-gray-800', text: 'Tạm khóa' }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getCommissionStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ thanh toán' },
            PAID: { color: 'bg-green-100 text-green-800', text: 'Đã thanh toán' },
            CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Đã hủy' }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
                {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="text-gray-600 font-medium">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!affiliate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy Affiliate</h1>
                    <Link href="/dashboard/affiliates" className="text-blue-600 hover:text-blue-800">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard/affiliates" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{affiliate.user.name}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Chi tiết Affiliate</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {affiliate.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange('ACTIVE')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('REJECTED')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Từ chối
                                    </button>
                                </>
                            )}
                            {affiliate.status === 'ACTIVE' && (
                                <button
                                    onClick={() => handleStatusChange('SUSPENDED')}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Khóa
                                </button>
                            )}
                            {affiliate.status === 'SUSPENDED' && (
                                <button
                                    onClick={() => handleStatusChange('ACTIVE')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Mở khóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        {/* Affiliate Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                                {affiliate.user.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{affiliate.user.name}</h2>
                                            <p className="text-gray-600 dark:text-gray-400">{affiliate.user.email}</p>
                                            <p className="text-gray-600 dark:text-gray-400">{affiliate.user.phone}</p>
                                            <div className="mt-2">
                                                {getStatusBadge(affiliate.status)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tỷ lệ hoa hồng</p>
                                        <p className="text-2xl font-bold text-purple-600">{affiliate.commissionRate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng thu nhập</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{affiliate.totalEarnings.toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng referrals</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{affiliate.totalReferrals}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã duyệt</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{affiliate.approvedReferrals}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ lệ duyệt</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {affiliate.totalReferrals > 0 ? Math.round((affiliate.approvedReferrals / affiliate.totalReferrals) * 100) : 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'overview'
                                                ? 'border-purple-500 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Tổng quan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('commissions')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'commissions'
                                                ? 'border-purple-500 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Hoa hồng
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('links')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'links'
                                                ? 'border-purple-500 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Links
                                    </button>
                                </nav>
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin ngân hàng</h3>
                                            {affiliate.paymentInfo ? (
                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Ngân hàng</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{affiliate.paymentInfo.bankName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Số tài khoản</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{affiliate.paymentInfo.accountNumber}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Chủ tài khoản</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{affiliate.paymentInfo.accountHolder}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400">Chưa cập nhật thông tin ngân hàng</p>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin đăng ký</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Ngày đăng ký</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {new Date(affiliate.createdAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật lần cuối</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {new Date(affiliate.updatedAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'commissions' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lịch sử hoa hồng</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Đơn hàng
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Số tiền đơn hàng
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Hoa hồng
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Tỷ lệ
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Trạng thái
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Ngày tạo
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {commissions.map((commission) => (
                                                        <tr key={commission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                {commission.orderId}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {commission.orderAmount.toLocaleString()}đ
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {commission.commission.toLocaleString()}đ
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {commission.commissionRate}%
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {getCommissionStatusBadge(commission.status)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(commission.transactionDate).toLocaleDateString('vi-VN')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'links' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Affiliate Links</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Sản phẩm
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Clicks
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Chuyển đổi
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Thu nhập
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Ngày tạo
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {affiliateLinks.map((link) => (
                                                        <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10">
                                                                        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                {link.product?.name.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {link.product?.name}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {link.product?.price.toLocaleString()}đ
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {link.clicks.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {link.conversions}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {link.earnings.toLocaleString()}đ
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(link.createdAt).toLocaleDateString('vi-VN')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
