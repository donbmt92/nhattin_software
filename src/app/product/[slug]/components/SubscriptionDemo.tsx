"use client";
import React from 'react';

interface SubscriptionDemoProps {
    subscriptionTypes: any[];
}

export default function SubscriptionDemo({ subscriptionTypes }: SubscriptionDemoProps) {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Demo Subscription Types với Durations</h2>
            
            {subscriptionTypes.map((type) => (
                <div key={type._id} className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">{type.type_name}</h3>
                    <p className="text-gray-600 mb-3">{type.name}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {type.durations.map((duration: any) => (
                            <div key={duration._id} className="p-3 bg-gray-50 rounded border">
                                <div className="font-semibold">{duration.duration}</div>
                                <div className="text-sm text-gray-600">{duration.days} ngày</div>
                                <div className="text-lg font-bold text-blue-600">
                                    {Number(duration.price).toLocaleString('vi-VN')} đ
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
