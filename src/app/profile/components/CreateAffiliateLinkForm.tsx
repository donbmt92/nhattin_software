"use client";
import React, { useState, useEffect } from 'react';
import { CreateAffiliateLinkRequest, AffiliateLink, Product } from '../types';
import AffiliateLinkService from '../services/affiliateLinkService';

interface CreateAffiliateLinkFormProps {
    onClose: () => void;
    onSuccess: (newLink: AffiliateLink) => void;
    productId?: string; // Optional: pre-select product
}

const CreateAffiliateLinkForm: React.FC<CreateAffiliateLinkFormProps> = ({ 
    onClose, 
    onSuccess,
    productId 
}) => {
    const [formData, setFormData] = useState<CreateAffiliateLinkRequest>({
        productId: productId || '',
        expiresAt: '',
        campaignName: '',
        notes: ''
    });
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Set default expiration date (30 days from now)
        const defaultExpiry = new Date();
        defaultExpiry.setDate(defaultExpiry.getDate() + 30);
        setFormData(prev => ({
            ...prev,
            expiresAt: defaultExpiry.toISOString().slice(0, 16) // Format for datetime-local input
        }));

        // Load products if not pre-selected
        if (!productId) {
            loadProducts();
        }
    }, [productId]);

    const loadProducts = async () => {
        try {
            const productsData = await AffiliateLinkService.getProducts();
            setProducts(productsData);
        } catch (error: any) {
            console.error('Lỗi khi tải danh sách sản phẩm:', error);
            setError('Không thể tải danh sách sản phẩm');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.productId) {
            setError('Vui lòng chọn sản phẩm');
            return false;
        }

        if (!formData.expiresAt) {
            setError('Vui lòng chọn thời gian hết hạn');
            return false;
        }

        const expiryDate = new Date(formData.expiresAt);
        const now = new Date();
        
        if (expiryDate <= now) {
            setError('Thời gian hết hạn phải lớn hơn thời gian hiện tại');
            return false;
        }

        // Check if expiry is not too far in the future (max 1 year)
        const maxExpiry = new Date();
        maxExpiry.setFullYear(maxExpiry.getFullYear() + 1);
        
        if (expiryDate > maxExpiry) {
            setError('Thời gian hết hạn không được quá 1 năm');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Convert datetime-local format to ISO 8601
            const expiresAtISO = new Date(formData.expiresAt).toISOString();
            console.log('📅 [Form] Original expiresAt:', formData.expiresAt);
            console.log('📅 [Form] Converted ISO:', expiresAtISO);
            
            const requestData = {
                ...formData,
                expiresAt: expiresAtISO
            };
            
            const response = await AffiliateLinkService.createAffiliateLink(requestData);
            
            setSuccess('Tạo affiliate link thành công!');
            
            // Copy link vào clipboard
            try {
                await navigator.clipboard.writeText(response.shortUrl);
                setSuccess('Tạo link thành công và đã copy vào clipboard!');
            } catch (clipboardError) {
                console.warn('Không thể copy vào clipboard:', clipboardError);
            }

            // Create a mock AffiliateLink object for the parent component
            const newLink: AffiliateLink = {
                _id: response._id,
                affiliateId: '', // Will be filled by the API
                productId: formData.productId,
                linkCode: response.linkCode,
                originalUrl: '', // Will be filled by the API
                shortUrl: response.shortUrl,
                expiresAt: new Date(response.expiresAt),
                clickCount: 0,
                conversionCount: 0,
                totalCommissionEarned: 0,
                status: response.status as 'ACTIVE' | 'EXPIRED' | 'DISABLED',
                campaignName: formData.campaignName,
                notes: formData.notes,
                clickedByIPs: [],
                convertedUserIds: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            onSuccess(newLink);
            
            // Reset form
            setFormData({
                productId: productId || '',
                expiresAt: '',
                campaignName: '',
                notes: ''
            });
        } catch (error: any) {
            console.error('Lỗi khi tạo affiliate link:', error);
            setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const getSelectedProduct = () => {
        return products.find(p => p._id === formData.productId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            🔗 Tạo Affiliate Link Mới
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Product Selection */}
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn sản phẩm *
                            </label>
                            <select
                                id="productId"
                                name="productId"
                                value={formData.productId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={!!productId}
                            >
                                <option value="">-- Chọn sản phẩm --</option>
                                {products.map(product => (
                                    <option key={product._id} value={product._id}>
                                        {product.name} - {parseInt(product.base_price).toLocaleString()} VNĐ
                                    </option>
                                ))}
                            </select>
                            {getSelectedProduct() && (
                                <div className="mt-2 p-2 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Sản phẩm:</strong> {getSelectedProduct()?.name}
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        <strong>Giá:</strong> {parseInt(getSelectedProduct()?.base_price || '0').toLocaleString()} VNĐ
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian hết hạn *
                            </label>
                            <input
                                type="datetime-local"
                                id="expiresAt"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Link sẽ tự động hết hạn sau thời gian này
                            </p>
                        </div>

                        {/* Campaign Name */}
                        <div>
                            <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên chiến dịch (tùy chọn)
                            </label>
                            <input
                                type="text"
                                id="campaignName"
                                name="campaignName"
                                value={formData.campaignName}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Black Friday Sale 2024"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Giúp bạn quản lý và phân loại các link
                            </p>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú (tùy chọn)
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Ghi chú về link này..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    setFormData(prev => ({
                                        ...prev,
                                        expiresAt: tomorrow.toISOString().slice(0, 16)
                                    }));
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                1 ngày
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const week = new Date();
                                    week.setDate(week.getDate() + 7);
                                    setFormData(prev => ({
                                        ...prev,
                                        expiresAt: week.toISOString().slice(0, 16)
                                    }));
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                1 tuần
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const month = new Date();
                                    month.setMonth(month.getMonth() + 1);
                                    setFormData(prev => ({
                                        ...prev,
                                        expiresAt: month.toISOString().slice(0, 16)
                                    }));
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                1 tháng
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const year = new Date();
                                    year.setFullYear(year.getFullYear() + 1);
                                    setFormData(prev => ({
                                        ...prev,
                                        expiresAt: year.toISOString().slice(0, 16)
                                    }));
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                1 năm
                            </button>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang tạo...
                                    </span>
                                ) : (
                                    'Tạo Link'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAffiliateLinkForm;
