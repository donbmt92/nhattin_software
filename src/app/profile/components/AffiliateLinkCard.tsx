"use client";
import React, { useState } from 'react';
import { AffiliateLink } from '../types';

interface AffiliateLinkCardProps {
    link: AffiliateLink;
    onDisable: (linkCode: string) => void;
}

const AffiliateLinkCard: React.FC<AffiliateLinkCardProps> = ({ link, onDisable }) => {
    const [copied, setCopied] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Không thể copy vào clipboard:', error);
            // Fallback: select text
            const textArea = document.createElement('textarea');
            textArea.value = link.shortUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDisable = () => {
        if (confirm('Bạn có chắc muốn vô hiệu hóa link này?')) {
            onDisable(link.linkCode);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': 
                return 'bg-green-100 text-green-800 border-green-200';
            case 'EXPIRED': 
                return 'bg-red-100 text-red-800 border-red-200';
            case 'DISABLED': 
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default: 
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Đang hoạt động';
            case 'EXPIRED': return 'Đã hết hạn';
            case 'DISABLED': return 'Đã vô hiệu hóa';
            default: return 'Không xác định';
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const isExpired = new Date(link.expiresAt) < new Date();
    const isActive = link.status === 'ACTIVE' && !isExpired;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">
                            {link.campaignName || 'Affiliate Link'}
                        </h4>
                        <p className="text-sm text-gray-600">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                {link.linkCode}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(link.status)}`}>
                            {getStatusText(link.status)}
                        </span>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {showDetails ? '▲' : '▼'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {link.clickCount}
                        </div>
                        <div className="text-xs text-gray-600">Clicks</div>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {link.conversionCount}
                        </div>
                        <div className="text-xs text-gray-600">Conversions</div>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            {link.clickCount > 0 ? ((link.conversionCount / link.clickCount) * 100).toFixed(1) : 0}%
                        </div>
                        <div className="text-xs text-gray-600">Rate</div>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                            {formatCurrency(link.totalCommissionEarned)}
                        </div>
                        <div className="text-xs text-gray-600">Hoa hồng</div>
                    </div>
                </div>

                {/* URL Display */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Affiliate Link:
                    </label>
                    <div className="flex">
                        <input 
                            type="text" 
                            value={link.shortUrl} 
                            readOnly 
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-gray-50 focus:outline-none"
                        />
                        <button
                            onClick={copyToClipboard}
                            className={`px-4 py-2 text-sm font-medium rounded-r-md border border-l-0 transition-colors ${
                                copied
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <p><strong>Hết hạn:</strong> {formatDate(link.expiresAt)}</p>
                        {link.notes && (
                            <p className="mt-1"><strong>Ghi chú:</strong> {link.notes}</p>
                        )}
                    </div>
                    
                    <div className="flex space-x-2">
                        {isActive && (
                            <button
                                onClick={handleDisable}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                                Vô hiệu hóa
                            </button>
                        )}
                        
                        <button
                            onClick={() => window.open(link.shortUrl, '_blank')}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                            Test Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {showDetails && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                    <div className="pt-4">
                        <h5 className="text-sm font-medium text-gray-800 mb-3">Chi tiết thống kê</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p><strong>Tạo lúc:</strong> {formatDate(link.createdAt)}</p>
                                <p><strong>Cập nhật:</strong> {formatDate(link.updatedAt)}</p>
                                <p><strong>Product ID:</strong> {link.productId}</p>
                            </div>
                            
                            <div>
                                <p><strong>Unique IPs:</strong> {link.clickedByIPs.length}</p>
                                <p><strong>Conversions:</strong> {link.convertedUserIds.length}</p>
                                <p><strong>Trạng thái:</strong> {getStatusText(link.status)}</p>
                            </div>
                        </div>

                        {/* IP Addresses (limited display) */}
                        {link.clickedByIPs.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    IP Addresses ({link.clickedByIPs.length}):
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {link.clickedByIPs.slice(0, 10).map((ip, index) => (
                                        <span 
                                            key={index}
                                            className="px-2 py-1 text-xs bg-white border border-gray-200 rounded"
                                        >
                                            {ip}
                                        </span>
                                    ))}
                                    {link.clickedByIPs.length > 10 && (
                                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                                            +{link.clickedByIPs.length - 10} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateLinkCard;
