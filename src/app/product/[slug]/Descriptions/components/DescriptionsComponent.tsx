"use client";
import React, { useState, useEffect } from 'react'
import { AffiliateInfo } from '@/app/profile/types';
import api from '@/app/components/utils/api';

interface Product {
    _id: string;
    id: string;
    name: string;
    id_category: string;
    sales: string;
    base_price: string;
    max_price: string;
    min_price: string;
    image: string;
    description: string;
}

interface DescriptionsComponentProps {
    products: any[];
}

// Component that receives products as props
export default function DescriptionsComponent({ products }: DescriptionsComponentProps) {
    const [activeTab, setActiveTab] = useState('description');
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);

    useEffect(() => {
        checkAffiliateStatus();
    }, []);

    const checkAffiliateStatus = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) return;

            const response = await api.get('/affiliates/profile');
            
            if (response.status === 200) {
                const data = response.data;
                if (data.success && data.data.status === 'ACTIVE') {
                    setIsAffiliate(true);
                    setAffiliateInfo(data.data);
                }
            }
        } catch (error) {
            console.error('Error checking affiliate status:', error);
        }
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    
    return (
        <div className="container mx-auto">
            {products.map((product) => (
                <>
                    <div className="flex border-b justify-center">
                        <button
                            className={`px-4 py-2 uppercase ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-600 font-bold' : ''}`}
                            onClick={() => handleTabClick('description')}
                        >
                            Mô tả sản phẩm
                        </button>
                        <button
                            className={`px-4 py-2 uppercase ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-600 font-bold uppercase' : ''}`}
                            onClick={() => handleTabClick('reviews')}
                        >
                            Đánh giá (0)
                        </button>
                        {isAffiliate && (
                            <button
                                className={`px-4 py-2 uppercase ${activeTab === 'affiliate' ? 'border-b-2 border-green-500 text-green-600 font-bold' : ''}`}
                                onClick={() => handleTabClick('affiliate')}
                            >
                                🎯 Affiliate
                            </button>
                        )}
                    </div>
                    <div>
                        {activeTab === 'description' && (
                            <div className="rounded-[15px] shadow p-6">
                                <h2 className="text-[#131336] text-[22px] font-bold uppercase mb-4">
                                    Mô tả ngắn <span className="font-normal">sản phẩm</span>
                                </h2>
                                <div 
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }} 
                                />
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="p-4">
                                <p>Chưa có đánh giá nào Hãy là người đầu tiên viết đánh giá!</p>
                            </div>
                        )}
                        {activeTab === 'affiliate' && isAffiliate && (
                            <div className="rounded-[15px] shadow p-6">
                                <h2 className="text-[#131336] text-[22px] font-bold uppercase mb-4">
                                    🎯 Affiliate <span className="font-normal">Marketing</span>
                                </h2>
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                                Thông tin Affiliate
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Mã Affiliate:</span>
                                                    <span className="font-mono font-bold text-blue-600">
                                                        {affiliateInfo?.affiliateCode}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tỷ lệ hoa hồng:</span>
                                                    <span className="font-bold text-green-600">
                                                        {affiliateInfo?.commissionRate}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tổng thu nhập:</span>
                                                    <span className="font-bold text-purple-600">
                                                        {affiliateInfo?.totalEarnings?.toLocaleString()} VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                                Hướng dẫn sử dụng
                                            </h3>
                                            <ul className="text-sm text-gray-700 space-y-2">
                                                <li>• Sử dụng mã affiliate để giới thiệu khách hàng</li>
                                                <li>• Nhận hoa hồng {affiliateInfo?.commissionRate}% từ mỗi đơn hàng</li>
                                                <li>• Tạo link có thời hạn cho sản phẩm cụ thể</li>
                                                <li>• Theo dõi thống kê clicks và conversions</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Mẹo:</strong> Tạo link affiliate cho sản phẩm này bằng cách sử dụng nút "Tạo Link Nhanh" ở trên trang.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ))}
        </div>
    )
} 