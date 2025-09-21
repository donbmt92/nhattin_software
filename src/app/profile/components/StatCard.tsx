"use client";
import React, { memo } from 'react';
import OrderIcon from './icons/OrderIcon';
import SpendingIcon from './icons/SpendingIcon';
import VipIcon from './icons/VipIcon';

interface StatCardProps {
    title: string;
    value: string | number;
    type: 'orders' | 'spending' | 'vip';
}

const StatCard = memo(({ title, value, type }: StatCardProps) => {
    const displayName = 'StatCard';
    StatCard.displayName = displayName;

    const getIcon = () => {
        switch (type) {
            case 'orders':
                return <OrderIcon />;
            case 'spending':
                return <SpendingIcon />;
            case 'vip':
                return <VipIcon />;
            default:
                return null;
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'orders':
                return 'text-blue-600';
            case 'spending':
                return 'text-green-500';
            case 'vip':
                return 'text-orange-500';
            default:
                return '';
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md relative h-36">
            <div className="flex flex-col mt-5">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                <p className={`text-2xl font-bold mt-1 ${getTextColor()}`}>
                    {value}
                </p>
            </div>
            <div className="absolute right-2 top-1 w-24 h-24 pr-[150px]">
                {getIcon()}
            </div>
        </div>
    );
});

export default StatCard; 
