/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from 'react';
import ProfileInfo from './components/ProfileInfo';
import StatCard from './components/StatCard';
import OrderItem from './components/OrderItem';
import { Order, UserProfile } from './types';
import axios from 'axios';

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('user');
        const data = JSON.parse(token || '{}');
        console.log(data?._id);
         // Get the token
        if (token) {
            const userId = data?._id; // Function to decode the token and extract user ID
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            console.error('No token found'); // Handle case where token is not found
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Mock data - in real app, this would come from an API
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
                {user ? <ProfileInfo user={user} /> : <p>Loading...</p>}
                
                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <StatCard 
                            title="Đơn Đã Đặt"
                            value={user?.stats?.orders ?? 0}
                            type="orders"
                        />
                        <StatCard 
                            title="Đã Chi Tiêu"
                            value={user?.stats?.spending ?? '0 đ'}
                            type="spending"
                        />
                        <StatCard 
                            title="Khách hàng"
                            value={user?.stats?.vipStatus ?? 'Thường'}
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


