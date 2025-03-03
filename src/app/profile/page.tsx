"use client";
import React, { useEffect, useState } from 'react';
import ProfileInfo from './components/ProfileInfo';
import StatCard from './components/StatCard';
import OrderItem from './components/OrderItem';
import { Order, UserProfile } from './types';
import api from '../components/utils/api';

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    console.log(user);

    const getUserDetail = async () => {
        const storedUser = localStorage.getItem("user");

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
        }
    };

    useEffect(() => {
        getUserDetail();
    }, []);
    // const user: UserProfile = {
    //     name: "Pahn Đăng Hiếu",
    //     id: "30452",
    //     email: "Luutru.phanhieu@gmail.com",
    //     phone: "0337575254",
    //     stats: {
    //         orders: 10,
    //         spending: "100.000 đ",
    //         vipStatus: "Kim cương"
    //     }
    // };

    const orders: Order[] = [
        {
            id: "#1547",
            productName: "Mua Tài khoản Netflix Premium",
            date: "20/10/2024",
            price: "220.000 đ",
            duration: "3 tháng"
        },
        {
            id: "#1547",
            productName: "Mua Tài khoản Netflix Premium",
            date: "20/10/2024",
            price: "220.000 đ",
            duration: "3 tháng"
        },
        {
            id: "#1547",
            productName: "Mua Tài khoản Netflix Premium",
            date: "20/10/2024",
            price: "220.000 đ",
            duration: "3 tháng"
        }
    ];

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ProfileInfo user={user} />

                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Đơn Đã Đặt"
                            // value={user.stats.orders}
                            type="orders"
                        />
                        <StatCard
                            title="Đã Chi Tiêu"
                            // value={user.stats.spending}
                            type="spending"
                        />
                        <StatCard
                            title="Khách hàng"
                            // value={user.stats.vipStatus}
                            type="vip"
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Đơn mua</h3>
                        <div className="space-y-4">
                            {orders.map((order, index) => (
                                <OrderItem key={`${order.id}-${index}`} order={order} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

