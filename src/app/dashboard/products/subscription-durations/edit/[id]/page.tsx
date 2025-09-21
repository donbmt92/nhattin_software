"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, Calculator } from "lucide-react";
import Link from "next/link";
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
}

interface SubscriptionDuration {
    id: string;
    product_id: string;
    duration: string;
    price: number;
    days: number;
    createdAt: string;
    updatedAt: string;
}

export default function EditSubscriptionDurationPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const productId = searchParams.get('product_id');
    
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [subscriptionDuration, setSubscriptionDuration] = useState<SubscriptionDuration | null>(null);
    const [formData, setFormData] = useState({
        product_id: '',
        duration: '',
        price: '',
        days: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchSubscriptionDuration = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                alert('Vui lòng đăng nhập');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = response.data;
            setSubscriptionDuration(data);
            setFormData({
                product_id: data.product_id,
                duration: data.duration,
                price: data.price.toString(),
                days: data.days.toString()
            });
        } catch (error) {
            console.error('Error fetching subscription duration:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể tải thông tin thời hạn gói đăng ký');
            } else {
                alert('Không thể tải thông tin thời hạn gói đăng ký');
            }
            router.push(`/dashboard/products/subscription-durations${productId ? `?product_id=${productId}` : ''}`);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            await Promise.all([fetchProducts(), fetchSubscriptionDuration()]);
            setLoadingData(false);
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!formData.product_id || !formData.duration || !formData.price || !formData.days) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        const price = parseFloat(formData.price);
        const days = parseInt(formData.days);

        if (isNaN(price) || price < 0) {
            alert('Giá phải là số dương');
            return;
        }

        if (isNaN(days) || days < 1) {
            alert('Số ngày phải là số nguyên dương');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations/${id}`, {
                product_id: formData.product_id,
                duration: formData.duration,
                price: price,
                days: days
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            alert('Cập nhật thời hạn gói đăng ký thành công!');
            router.push(`/dashboard/products/subscription-durations${productId ? `?product_id=${productId}` : ''}`);
        } catch (error) {
            console.error('Error updating subscription duration:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể cập nhật thời hạn gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể cập nhật thời hạn gói đăng ký. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculatePricePerDay = () => {
        const price = parseFloat(formData.price);
        const days = parseInt(formData.days);
        if (price && days && days > 0) {
            return formatPrice(price / days);
        }
        return '0 VND';
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!subscriptionDuration) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="text-center py-6 text-red-500">
                        Không tìm thấy thời hạn gói đăng ký
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link href={`/dashboard/products/subscription-durations${productId ? `?product_id=${productId}` : ''}`}>
                    <Button variant="secondary" size="sm" className="flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Quay lại</span>
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Thời hạn Gói Đăng ký</h1>
                    <p className="text-gray-600">Cập nhật thời hạn và giá cả cho gói dịch vụ</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin Thời hạn Gói Đăng ký</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="product_id">Sản phẩm *</Label>
                                <Select value={formData.product_id} onValueChange={(value) => handleInputChange('product_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn sản phẩm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product._id} value={product._id}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration">Thời hạn *</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    placeholder="VD: 1 tháng, 3 tháng, 1 năm"
                                    required
                                />
                            </div>

                            {/* Days */}
                            <div className="space-y-2">
                                <Label htmlFor="days">Số ngày *</Label>
                                <Input
                                    id="days"
                                    type="number"
                                    value={formData.days}
                                    onChange={(e) => handleInputChange('days', e.target.value)}
                                    placeholder="VD: 30, 90, 365"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Giá (VND) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    placeholder="VD: 149000, 399000"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <Link href={`/dashboard/products/subscription-durations${productId ? `?product_id=${productId}` : ''}`}>
                                    <Button type="button" variant="secondary">
                                        Hủy
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    <span>{loading ? 'Đang cập nhật...' : 'Cập nhật'}</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calculator className="h-5 w-5" />
                            <span>Xem trước</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Thông tin Gói</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sản phẩm:</span>
                                        <span className="font-medium">
                                            {products.find(p => p._id === formData.product_id)?.name || 'Chưa chọn'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thời hạn:</span>
                                        <span className="font-medium">{formData.duration || 'Chưa nhập'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số ngày:</span>
                                        <span className="font-medium">{formData.days || '0'} ngày</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giá:</span>
                                        <span className="font-medium text-green-600">
                                            {formData.price ? formatPrice(parseFloat(formData.price)) : '0 VND'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {formData.price && formData.days && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">Tính toán</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Giá/ngày:</span>
                                            <span className="font-medium text-blue-900">{calculatePricePerDay()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Tổng giá:</span>
                                            <span className="font-medium text-blue-900">
                                                {formData.price ? formatPrice(parseFloat(formData.price)) : '0 VND'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Original Data */}
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4 className="font-semibold text-yellow-900 mb-2">Dữ liệu Gốc</h4>
                                <div className="space-y-2 text-sm text-yellow-800">
                                    <p>• Thời hạn: {subscriptionDuration.duration}</p>
                                    <p>• Số ngày: {subscriptionDuration.days} ngày</p>
                                    <p>• Giá: {formatPrice(subscriptionDuration.price)}</p>
                                    <p>• Ngày tạo: {new Date(subscriptionDuration.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
