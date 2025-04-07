"use client";
import React, { useState } from 'react'

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
                    </div>
                </>
            ))}
        </div>
    )
} 