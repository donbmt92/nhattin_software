"use client";
import React, { useEffect, useState } from 'react';
import ProfileInfo from './components/ProfileInfo';
import StatCard from './components/StatCard';
import { UserProfile } from './types';
import api from '../components/utils/api';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define a type for order items
interface OrderItemDetails {
    id: string;
    quantity: number;
    old_price: number;
    discount_precent: number;
    final_price: number;
    product_snapshot: {
        name: string;
        image: string;
        description: string;
        base_price: number;
        category_id: string;
        category_name: string;
    };
    product: {
        _id: string;
        name: string;
        image: string;
        thumbnail: string;
        base_price: number;
    };
}

// Define a type for API orders
interface ApiOrder {
    id: string;
    uid: string;
    note: string;
    voucher: string;
    status: string;
    total_items: number;
    items: OrderItemDetails[];
    createdAt: string;
    updatedAt: string;
}

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState('');
    const router = useRouter();
    
    console.log(user);

    // Function to handle user logout
    const handleLogout = () => {
        // Clear user data and token from localStorage
        localStorage.removeItem('nhattin_token');
        localStorage.removeItem('nhattin_user');
        
        // Redirect to login page
        router.push('/login');
    };

    // Function to handle API errors, specifically 401 Unauthorized
    const handleApiError = (error: unknown) => {
        // Check if error is an axios error with response property
        if (
            error && 
            typeof error === 'object' && 
            'response' in error && 
            error.response && 
            typeof error.response === 'object' && 
            'status' in error.response && 
            error.response.status === 401
        ) {
            console.log('Token expired or invalid. Logging out...');
            handleLogout();
            return true; // Error was handled
        }
        return false; // Error was not handled
    };

    const getUserDetail = async () => {
        const storedUser = localStorage.getItem("nhattin_user");

        if (!storedUser) return;

        try {
            const parsedUser = JSON.parse(storedUser);

            // Kiểm tra nếu parsedUser là một object hoặc array
            const userId = Array.isArray(parsedUser) ? parsedUser[0]?._id : parsedUser?._id;

            if (userId) {
                const productResponse = await api.get(`/users/${userId}`);
                setUser(productResponse.data);
            } else {
                console.error("Không tìm thấy _id của user.");
            }
        } catch (error) {
            console.error("Lỗi khi parse dữ liệu từ localStorage:", error);
            if (!handleApiError(error)) {
                // If it's not a 401 error, handle it normally
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        setOrdersError('');
        
        try {
            const token = localStorage.getItem('nhattin_token');
            
            if (!token) {
                setOrdersError('Không tìm thấy token xác thực.');
                setLoadingOrders(false);
                return;
            }
            
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/success-orders`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setOrders(response.data);
            setLoadingOrders(false);
        } catch (error) {
            if (!handleApiError(error)) {
                // If it's not a 401 error, handle it normally
                console.error('Error fetching orders:', error);
                setOrdersError('Không thể tải thông tin đơn hàng.');
                setLoadingOrders(false);
            }
        }
    };

    useEffect(() => {
        getUserDetail();
        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Calculate total spending from orders
    const calculateTotalSpending = () => {
        return orders.reduce((total, order) => {
            const orderTotal = order.items.reduce((sum, item) => sum + item.final_price, 0);
            return total + orderTotal;
        }, 0);
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ProfileInfo user={user} />

                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Đơn Đã Đặt"
                            value={orders.length.toString()}
                            type="orders"
                        />
                        <StatCard
                            title="Đã Chi Tiêu"
                            value={formatCurrency(calculateTotalSpending())}
                            type="spending"
                        />
                        <StatCard
                            title="Khách hàng"
                            value={orders.length > 5 ? "VIP" : "Thường"}
                            type="vip"
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Đơn mua</h3>
                        
                        {loadingOrders ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                <span className="ml-2 text-gray-600">Đang tải đơn hàng...</span>
                            </div>
                        ) : ordersError ? (
                            <div className="text-red-500 py-4 text-center">{ordersError}</div>
                        ) : orders.length === 0 ? (
                            <div className="text-gray-500 py-8 text-center">
                                <p>Bạn chưa có đơn hàng nào.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Mã đơn hàng:</span> <span className="font-medium">{order.id}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-500">Ngày mua:</span> <span className="font-medium">{formatDate(order.createdAt)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center border-t border-gray-100 pt-3">
                                                    <div className="w-16 h-16 relative flex-shrink-0">
                                                        <Image 
                                                            src={item.product_snapshot.image}
                                                            alt={item.product_snapshot.name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <h3 className="font-medium text-gray-800">{item.product_snapshot.name}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            <span className="mr-4">Danh mục: {item.product_snapshot.category_name}</span>
                                                            <span>Số lượng: {item.quantity}</span>
                                                        </p>
                                                        <div className="mt-1 flex justify-between">
                                                            <p className="text-sm text-gray-500">Đơn giá: {formatCurrency(item.old_price)}</p>
                                                            <p className="font-medium text-gray-800">
                                                                {formatCurrency(item.final_price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                            <div>
                                                <span className="text-gray-500 text-sm">Tổng số sản phẩm:</span> <span className="font-medium">{order.total_items}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 mr-2">Tổng tiền:</span>
                                                <span className="font-semibold text-blue-600">
                                                    {formatCurrency(order.items.reduce((total, item) => total + item.final_price, 0))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

