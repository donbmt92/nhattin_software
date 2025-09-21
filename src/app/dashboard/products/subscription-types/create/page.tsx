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
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, ArrowLeft, Save, Package, Search } from "lucide-react";
import Link from "next/link";
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
}

export default function CreateSubscriptionTypePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('product_id');
    
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        product_id: productId || '',
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

        if (!formData.product_id || !formData.type_name || !formData.name) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            alert('Tạo loại gói đăng ký thành công!');
            router.push(`/dashboard/products/subscription-types${productId ? `?product_id=${productId}` : ''}`);
        } catch (error) {
            console.error('Error creating subscription type:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể tạo loại gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể tạo loại gói đăng ký. Vui lòng thử lại.');
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
                    <h1 className="text-2xl font-bold text-gray-900">Tạo Loại Gói Đăng ký Mới</h1>
                    <p className="text-gray-600">Thêm loại gói dịch vụ mới cho sản phẩm</p>
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
                                                         Chọn sản phẩm để tạo loại gói đăng ký
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
                                                 Chọn sản phẩm để tạo loại gói đăng ký
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
                                <span>{loading ? 'Đang tạo...' : 'Tạo Loại Gói'}</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
