"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    role: string;
    name?: string;
    email?: string;
}

interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalAffiliates: number;
    recentOrders: any[];
    topProducts: any[];
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 1234,
        totalOrders: 567,
        totalRevenue: 12345,
        totalProducts: 89,
        totalAffiliates: 45,
        recentOrders: [],
        topProducts: []
    });

    useEffect(() => {
        // Check if user is logged in and is admin
        const checkAuth = () => {
            const token = localStorage.getItem('nhattin_token');
            const userData = localStorage.getItem('nhattin_user');

            if (!token || !userData) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(userData);
            console.log(user);
            if (user.role !== 'ADMIN') {
                console.log('user', user.role);
                router.push('/');
                return;
            }

            setUser(user);
            setLoading(false);
        };

        checkAuth();
    }, [router]);

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

    const statsCards = [
        {
            title: 'Tổng Người dùng',
            value: stats.totalUsers.toLocaleString(),
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            href: '/dashboard/users'
        },
        {
            title: 'Tổng Đơn hàng',
            value: stats.totalOrders.toLocaleString(),
            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            href: '/dashboard/orders'
        },
        {
            title: 'Doanh thu',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            href: '/dashboard/payments'
        },
        {
            title: 'Tổng Sản phẩm',
            value: stats.totalProducts.toLocaleString(),
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            href: '/dashboard/products'
        },
        {
            title: 'Tổng Affiliate',
            value: stats.totalAffiliates.toLocaleString(),
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            href: '/dashboard/affiliates'
        }
    ];

    const quickActions = [
        { name: 'Thêm sản phẩm', href: '/dashboard/products/create', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
        { name: 'Tạo khuyến mãi', href: '/dashboard/discounts', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2' },
        { name: 'Quản lý Affiliate', href: '/dashboard/affiliates', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { name: 'Viết bài viết', href: '/dashboard/posts', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { name: 'Quản lý đơn hàng', href: '/dashboard/orders', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
    ];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan Quản trị</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Chào mừng trở lại, {user?.name || 'Quản trị viên'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Quản trị viên'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@nhattin.com'}</p>
                            </div>
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
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
                            {statsCards.map((card, index) => (
                                <Link key={index} href={card.href}>
                                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                                                    <svg className={`h-6 w-6 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                                    </svg>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                                                        {card.title}
                                                    </p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {card.value}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thao tác nhanh</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {quickActions.map((action, index) => (
                                    <Link key={index} href={action.href}>
                                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{action.name}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Orders */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đơn hàng gần đây</h3>
                                        <Link href="/dashboard/orders" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Đơn hàng #{1000 + item}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">2 giờ trước</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">$299</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trạng thái hệ thống</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">API Response</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">Fast</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">75% Used</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 