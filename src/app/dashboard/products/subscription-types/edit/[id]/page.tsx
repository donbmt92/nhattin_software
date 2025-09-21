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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
}

interface SubscriptionType {
    id: string;
    product_id: string;
    type_name: string;
    status: 'ACTIVE' | 'INACTIVE';
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function EditSubscriptionTypePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const productId = searchParams.get('product_id');
    
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType | null>(null);
    const [formData, setFormData] = useState({
        product_id: '',
        type_name: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
        name: '',
        description: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchSubscriptionType = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                alert('Vui lòng đăng nhập');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = response.data;
            setSubscriptionType(data);
            setFormData({
                product_id: data.product_id,
                type_name: data.type_name,
                status: data.status,
                name: data.name,
                description: data.description || ''
            });
        } catch (error) {
            console.error('Error fetching subscription type:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể tải thông tin loại gói đăng ký');
            } else {
                alert('Không thể tải thông tin loại gói đăng ký');
            }
            router.push(`/dashboard/products/subscription-types${productId ? `?product_id=${productId}` : ''}`);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            await Promise.all([fetchProducts(), fetchSubscriptionType()]);
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

        if (!formData.product_id || !formData.type_name || !formData.name) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            alert('Cập nhật loại gói đăng ký thành công!');
            router.push(`/dashboard/products/subscription-types${productId ? `?product_id=${productId}` : ''}`);
        } catch (error) {
            console.error('Error updating subscription type:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể cập nhật loại gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể cập nhật loại gói đăng ký. Vui lòng thử lại.');
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

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!subscriptionType) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="text-center py-6 text-red-500">
                        Không tìm thấy loại gói đăng ký
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link href={`/dashboard/products/subscription-types${productId ? `?product_id=${productId}` : ''}`}>
                    <Button variant="secondary" size="sm" className="flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Quay lại</span>
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Loại Gói Đăng ký</h1>
                    <p className="text-gray-600">Cập nhật thông tin loại gói dịch vụ</p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Thông tin Loại Gói Đăng ký</CardTitle>
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

                        {/* Type Name */}
                        <div className="space-y-2">
                            <Label htmlFor="type_name">Tên Loại Gói *</Label>
                            <Input
                                id="type_name"
                                value={formData.type_name}
                                onChange={(e) => handleInputChange('type_name', e.target.value)}
                                placeholder="VD: Premium, Basic, Enterprise"
                                required
                            />
                        </div>

                        {/* Display Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên Hiển thị *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="VD: Gói Cao cấp, Gói Cơ bản"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Mô tả chi tiết về loại gói đăng ký..."
                                rows={4}
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE') => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                    <SelectItem value="INACTIVE">Tạm dừng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <Link href={`/dashboard/products/subscription-types${productId ? `?product_id=${productId}` : ''}`}>
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
        </div>
    );
}
