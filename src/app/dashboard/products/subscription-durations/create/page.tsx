"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Save, Calculator, Package, Search } from "lucide-react";
import Link from "next/link";
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
}

export default function CreateSubscriptionDurationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('product_id');
    
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        product_id: productId || '',
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

    useEffect(() => {
        fetchProducts();
    }, []);

    // Set selected product when productId changes
    useEffect(() => {
        if (productId && products.length > 0) {
            const product = products.find(p => p._id === productId);
            if (product) {
                setSelectedProduct(product);
                setFormData(prev => ({
                    ...prev,
                    product_id: productId
                }));
            }
        }
    }, [productId, products]);

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
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations`, {
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
            
            alert('Tạo thời hạn gói đăng ký thành công!');
            router.push(`/dashboard/products/subscription-durations${productId ? `?product_id=${productId}` : ''}`);
        } catch (error) {
            console.error('Error creating subscription duration:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể tạo thời hạn gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể tạo thời hạn gói đăng ký. Vui lòng thử lại.');
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

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setFormData(prev => ({
            ...prev,
            product_id: product._id
        }));
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-2xl font-bold text-gray-900">Tạo Thời hạn Gói Đăng ký Mới</h1>
                    <p className="text-gray-600">Thêm thời hạn và giá cả mới cho gói dịch vụ</p>
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
                                 {selectedProduct ? (
                                     <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                         <div className="flex items-center justify-between">
                                             <div className="flex items-center space-x-3">
                                                 <Package className="h-5 w-5 text-green-600" />
                                                 <div>
                                                     <p className="font-medium text-green-900">{selectedProduct.name}</p>
                                                     <p className="text-sm text-green-700">ID: {selectedProduct._id}</p>
                                                 </div>
                                             </div>
                                             <Dialog>
                                                 <DialogTrigger asChild>
                                                      <Button variant="secondary" size="sm">
                                                         Thay đổi
                                                     </Button>
                                                 </DialogTrigger>
                                                 <DialogContent className="max-w-2xl">
                                                     <DialogHeader>
                                                         <DialogTitle>Chọn Sản phẩm</DialogTitle>
                                                         <DialogDescription>
                                                             Chọn sản phẩm để tạo thời hạn gói đăng ký
                                                         </DialogDescription>
                                                     </DialogHeader>
                                                     <div className="space-y-4">
                                                         <div className="relative">
                                                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                             <Input
                                                                 placeholder="Tìm kiếm sản phẩm..."
                                                                 value={searchTerm}
                                                                 onChange={(e) => setSearchTerm(e.target.value)}
                                                                 className="pl-10"
                                                             />
                                                         </div>
                                                         <div className="max-h-60 overflow-y-auto space-y-2">
                                                             {filteredProducts.map((product) => (
                                                                 <div
                                                                     key={product._id}
                                                                     className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                                         selectedProduct?._id === product._id
                                                                             ? 'border-green-500 bg-green-50'
                                                                             : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                     }`}
                                                                     onClick={() => handleProductSelect(product)}
                                                                 >
                                                                     <div className="flex items-center space-x-3">
                                                                         <Package className="h-5 w-5 text-gray-600" />
                                                                         <div className="flex-1">
                                                                             <p className="font-medium text-gray-900">{product.name}</p>
                                                                             <p className="text-sm text-gray-500">ID: {product._id}</p>
                                                                         </div>
                                                                         {selectedProduct?._id === product._id && (
                                                                             <div className="text-green-600">
                                                                                 ✓
                                                                             </div>
                                                                         )}
                                                                     </div>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                         {filteredProducts.length === 0 && (
                                                             <div className="text-center py-8 text-gray-500">
                                                                 Không tìm thấy sản phẩm nào
                                                             </div>
                                                         )}
                                                     </div>
                                                 </DialogContent>
                                             </Dialog>
                                         </div>
                                     </div>
                                 ) : (
                                     <Dialog>
                                         <DialogTrigger asChild>
                                             <Button variant="secondary" className="w-full justify-start">
                                                 <Package className="h-4 w-4 mr-2" />
                                                 Chọn sản phẩm
                                             </Button>
                                         </DialogTrigger>
                                         <DialogContent className="max-w-2xl">
                                             <DialogHeader>
                                                 <DialogTitle>Chọn Sản phẩm</DialogTitle>
                                                 <DialogDescription>
                                                     Chọn sản phẩm để tạo thời hạn gói đăng ký
                                                 </DialogDescription>
                                             </DialogHeader>
                                             <div className="space-y-4">
                                                 <div className="relative">
                                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                     <Input
                                                         placeholder="Tìm kiếm sản phẩm..."
                                                         value={searchTerm}
                                                         onChange={(e) => setSearchTerm(e.target.value)}
                                                         className="pl-10"
                                                     />
                                                 </div>
                                                 <div className="max-h-60 overflow-y-auto space-y-2">
                                                     {filteredProducts.map((product) => (
                                                         <div
                                                             key={product._id}
                                                             className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                                             onClick={() => handleProductSelect(product)}
                                                         >
                                                             <div className="flex items-center space-x-3">
                                                                 <Package className="h-5 w-5 text-gray-600" />
                                                                 <div className="flex-1">
                                                                     <p className="font-medium text-gray-900">{product.name}</p>
                                                                     <p className="text-sm text-gray-500">ID: {product._id}</p>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     ))}
                                                 </div>
                                                 {filteredProducts.length === 0 && (
                                                     <div className="text-center py-8 text-gray-500">
                                                         Không tìm thấy sản phẩm nào
                                                     </div>
                                                 )}
                                             </div>
                                         </DialogContent>
                                     </Dialog>
                                 )}
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
                                    <span>{loading ? 'Đang tạo...' : 'Tạo Thời hạn'}</span>
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
                                             {selectedProduct?.name || 'Chưa chọn'}
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

                            {/* Common Duration Examples */}
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4 className="font-semibold text-yellow-900 mb-2">Gợi ý Thời hạn</h4>
                                <div className="space-y-1 text-sm text-yellow-800">
                                    <p>• 1 tháng = 30 ngày</p>
                                    <p>• 3 tháng = 90 ngày</p>
                                    <p>• 6 tháng = 180 ngày</p>
                                    <p>• 1 năm = 365 ngày</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
