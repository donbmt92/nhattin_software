"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { affiliateService, AffiliateProfile, AffiliateStats } from '../../../services/affiliateService';
import { log } from 'console';

interface AffiliateWithUser extends AffiliateProfile {
    id: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
    commissionRate: number;
    totalEarnings: number;
    totalReferrals: number;
    approvedReferrals: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function AffiliatesPage() {
    const router = useRouter();
    const [affiliates, setAffiliates] = useState<AffiliateWithUser[]>([]);
    const [stats, setStats] = useState<AffiliateStats>({
        totalAffiliates: 0,
        activeAffiliates: 0,
        pendingAffiliates: 0,
        totalCommissions: 0,
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

            loadAffiliates();
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (!loading) {
            loadAffiliates();
        }
    }, [currentPage, statusFilter]);

    const loadAffiliates = async () => {
        try {
            setLoading(true);
            
            // Load affiliates data
            const affiliatesResponse = await affiliateService.getAllAffiliates(currentPage, 10, statusFilter);
            console.log('API Response:', affiliatesResponse);
            if (affiliatesResponse.success && affiliatesResponse.data) {
                console.log('Affiliates data:', affiliatesResponse.data.affiliates);
                const affiliatesData = affiliatesResponse.data.affiliates || [];
                // Ensure each affiliate has proper user data structure
                const validatedAffiliates = affiliatesData.map((affiliate: any) => ({
                    ...affiliate,
                    user: {
                        id: affiliate.user?.id || '',
                        name: affiliate.user?.name || 'Không có tên',
                        email: affiliate.user?.email || 'Không có email',
                        avatar: affiliate.user?.avatar || ''
                    }
                }));
                setAffiliates(validatedAffiliates as AffiliateWithUser[]);
                setTotalPages(Math.ceil((affiliatesResponse.data.total || 0) / 10));
            } else {
                console.error('API response failed:', affiliatesResponse);
                throw new Error('Không thể tải dữ liệu affiliate');
            }
            
            // Load stats data
            const statsResponse = await affiliateService.getAdminStats();
            if (statsResponse.success) {
                setStats(statsResponse.data);
            }
        } catch (error) {
            console.error('Error loading affiliates:', error);
            // Fallback to mock data if API fails
            const mockAffiliates: AffiliateWithUser[] = [
                {
                    id: '1',
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
                    user: {
                        id: 'user1',
                        name: 'Nguyễn Văn A',
                        email: 'nguyenvana@email.com',
                        avatar: '/images/avatar1.jpg'
                    }
                },
                {
                    id: '2',
                    userId: 'user2',
                    affiliateCode: 'USER456DEF789',
                    commissionRate: 3.5,
                    totalEarnings: 0,
                    totalReferrals: 0,
                    approvedReferrals: 0,
                    status: 'PENDING',
                    minPayoutAmount: 100000,
                    createdAt: '2024-01-18T00:00:00Z',
                    updatedAt: '2024-01-18T00:00:00Z',
                    user: {
                        id: 'user2',
                        name: 'Trần Thị B',
                        email: 'tranthib@email.com'
                    }
                }
            ];

            setAffiliates(mockAffiliates);
            
            // Calculate stats from mock data
            const totalAffiliates = mockAffiliates.length;
            const activeAffiliates = mockAffiliates.filter(a => a.status === 'ACTIVE').length;
            const pendingAffiliates = mockAffiliates.filter(a => a.status === 'PENDING').length;
            const totalCommissions = mockAffiliates.reduce((sum, a) => sum + a.totalEarnings, 0);

            setStats({
                totalAffiliates,
                activeAffiliates,
                pendingAffiliates,
                totalCommissions,
                totalClicks: 0,
                totalConversions: 0,
                conversionRate: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (affiliateId: string, newStatus: string) => {
        try {
            const response = await affiliateService.updateAffiliateStatus(affiliateId, newStatus);
            if (response.success) {
                // Update the affiliate in the list
                setAffiliates(prev => 
                    prev.map(affiliate => 
                        affiliate.id === affiliateId 
                            ? { ...affiliate, status: newStatus as any, updatedAt: new Date().toISOString() }
                            : affiliate
                    )
                );
                
                // Reload stats
                const statsResponse = await affiliateService.getAdminStats();
                if (statsResponse.success) {
                    setStats(statsResponse.data);
                }
            }
        } catch (error) {
            console.error('Error updating affiliate status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái affiliate');
        }
    };

    const filteredAffiliates = affiliates.filter(affiliate => {
        console.log(affiliate);
        const userName = affiliate.user?.name || '';
        const userEmail = affiliate.user?.email || '';
        const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || affiliate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        console.log('Status received:', status, 'Type:', typeof status);
        
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
            ACTIVE: { color: 'bg-green-100 text-green-800', text: 'Hoạt động' },
            SUSPENDED: { color: 'bg-gray-100 text-gray-800', text: 'Tạm khóa' },
            REJECTED: { color: 'bg-red-100 text-red-800', text: 'Từ chối' },
            INACTIVE: { color: 'bg-gray-100 text-gray-800', text: 'Không hoạt động' }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || { 
            color: 'bg-gray-100 text-gray-800', 
            text: status || 'Không xác định' 
        };
        
        console.log('Config used:', config);
        
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

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Affiliate</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Quản lý chương trình affiliate và hoa hồng</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng Affiliate</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAffiliates || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang hoạt động</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAffiliates || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chờ duyệt</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingAffiliates || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng hoa hồng</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats.totalCommissions || 0).toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm theo tên hoặc email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:w-48">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="ALL">Tất cả trạng thái</option>
                                            <option value="PENDING">Chờ duyệt</option>
                                            <option value="ACTIVE">Hoạt động</option>
                                            <option value="REJECTED">Từ chối</option>
                                            <option value="SUSPENDED">Tạm khóa</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Affiliates Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách Affiliate</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Affiliate
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Tỷ lệ hoa hồng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Tổng thu nhập
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Referrals
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Đã duyệt
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Ngày tạo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredAffiliates.map((affiliate) => (
                                            <tr key={affiliate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    {affiliate.user.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {affiliate.user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {affiliate.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(affiliate.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {(affiliate.commissionRate || 0)}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {(affiliate.totalEarnings || 0).toLocaleString()}đ
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {affiliate.totalReferrals || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {affiliate.approvedReferrals || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(affiliate.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {affiliate.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(affiliate.id, 'ACTIVE')}
                                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                >
                                                                    Duyệt
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(affiliate.id, 'REJECTED')}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    Từ chối
                                                                </button>
                                                            </>
                                                        )}
                                                        {affiliate.status === 'ACTIVE' && (
                                                            <button
                                                                onClick={() => handleStatusChange(affiliate.id, 'SUSPENDED')}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                            >
                                                                Khóa
                                                            </button>
                                                        )}
                                                        {affiliate.status === 'SUSPENDED' && (
                                                            <button
                                                                onClick={() => handleStatusChange(affiliate.id, 'ACTIVE')}
                                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                            >
                                                                Mở khóa
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={`/dashboard/affiliates/${affiliate.id}`}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            Chi tiết
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
