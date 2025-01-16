"use client";
import React, { memo } from 'react';
import { Order } from '../types';

const OrderItem = memo(({ order }: { order: Order }) => {
    const displayName = 'OrderItem';
    OrderItem.displayName = displayName;

    return (
        <div className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">{order.id}</span>
                        <span className="font-medium">{order.productName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{order.date}</span>
                        <span className="text-sm text-gray-500">{order.duration}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{order.price}</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1 text-sm bg-orange-100 text-orange-500 rounded hover:bg-orange-200 transition-colors">
                            Mua Thêm
                        </button>
                        <button className="px-4 py-1 text-sm bg-blue-100 text-blue-500 rounded hover:bg-blue-200 transition-colors">
                            Chi Tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default OrderItem; 