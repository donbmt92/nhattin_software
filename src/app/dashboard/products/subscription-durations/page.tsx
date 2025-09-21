"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Clock, DollarSign, Package, Search, Save, Calculator } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from 'axios';

interface SubscriptionDuration {
    id: string;
    product_id: string;
    subscription_type_id: string;
    duration: string;
    price: number;
    days: number;
    createdAt: string;
    updatedAt: string;
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

interface Product {
    _id: string;
    name: string;
}

function SubscriptionDurationsContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product_id');
    
    const [subscriptionDurations, setSubscriptionDurations] = useState<SubscriptionDuration[]>([]);
    const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Popup states
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editingDuration, setEditingDuration] = useState<SubscriptionDuration | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<SubscriptionType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [subscriptionTypeSearchTerm, setSubscriptionTypeSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        product_id: '',
        subscription_type_id: '',
        duration: '',
        price: '',
        days: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    const fetchSubscriptionDurations = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập');
                return;
            }

            let url = `${process.env.NEXT_PUBLIC_API_URL}/subscription-durations`;
            if (productId) {
                url += `?product_id=${productId}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setSubscriptionDurations(response.data);
        } catch (error) {
            console.error('Error fetching subscription durations:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Không thể tải danh sách thời hạn gói đăng ký');
            } else {
                setError('Không thể tải danh sách thời hạn gói đăng ký');
            }
        }
    };

    const fetchSubscriptionTypes = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập');
                return;
            }

            let url = `${process.env.NEXT_PUBLIC_API_URL}/subscription-types`;
            if (productId) {
                url += `?product_id=${productId}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setSubscriptionTypes(response.data);
        } catch (error) {
            console.error('Error fetching subscription types:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Không thể tải danh sách loại gói đăng ký');
            } else {
                setError('Không thể tải danh sách loại gói đăng ký');
            }
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchSubscriptionDurations(), fetchSubscriptionTypes(), fetchProducts()]);
            setLoading(false);
        };
        loadData();
    }, [productId]);

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để xóa thời hạn gói đăng ký');
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Xóa thời hạn gói đăng ký thành công!');
            await fetchSubscriptionDurations();
        } catch (error) {
            console.error('Error deleting subscription duration:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể xóa thời hạn gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể xóa thời hạn gói đăng ký. Vui lòng thử lại.');
            }
        }
    };

    const handleCreateClick = () => {
        setFormData({
            product_id: '',
            subscription_type_id: '',
            duration: '',
            price: '',
            days: ''
        });
        setSelectedProduct(null);
        setSelectedSubscriptionType(null);
        setShowCreatePopup(true);
    };

    const handleEditClick = (duration: SubscriptionDuration) => {
        setEditingDuration(duration);
        setFormData({
            product_id: duration.product_id,
            subscription_type_id: duration.subscription_type_id,
            duration: duration.duration,
            price: duration.price.toString(),
            days: duration.days.toString()
        });
        const product = products.find(p => p._id === duration.product_id);
        setSelectedProduct(product || null);
        const subscriptionType = subscriptionTypes.find(st => st.id === duration.subscription_type_id);
        setSelectedSubscriptionType(subscriptionType || null);
        setShowEditPopup(true);
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setFormData(prev => ({
            ...prev,
            product_id: product._id
        }));
    };

    const handleSubscriptionTypeSelect = (subscriptionType: SubscriptionType) => {
        setSelectedSubscriptionType(subscriptionType);
        setFormData(prev => ({
            ...prev,
            subscription_type_id: subscriptionType.id
        }));
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!formData.product_id || !formData.subscription_type_id || !formData.duration || !formData.price || !formData.days) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setFormLoading(true);
            
            const requestData = {
                product_id: formData.product_id,
                subscription_type_id: formData.subscription_type_id,
                duration: formData.duration,
                price: parseInt(formData.price),
                days: parseInt(formData.days)
            };
            
            console.log('Sending data:', requestData);
            
            if (editingDuration) {
                // Update existing
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations/${editingDuration.id}`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Cập nhật thời hạn gói đăng ký thành công!');
                setShowEditPopup(false);
            } else {
                // Create new
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Tạo thời hạn gói đăng ký thành công!');
                setShowCreatePopup(false);
            }
            
            await fetchSubscriptionDurations();
        } catch (error) {
            console.error('Error saving subscription duration:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể lưu thời hạn gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể lưu thời hạn gói đăng ký. Vui lòng thử lại.');
            }
        } finally {
            setFormLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getProductName = (productId: string) => {
        const product = products.find(p => p._id === productId);
        return product ? product.name : 'Không xác định';
    };

    const getSubscriptionTypeName = (subscriptionTypeId: string) => {
        const subscriptionType = subscriptionTypes.find(st => st.id === subscriptionTypeId);
        return subscriptionType ? (subscriptionType.name || subscriptionType.type_name) : 'Không xác định';
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Thời hạn Gói Đăng ký</h1>
                    <p className="text-gray-600 mt-2">Quản lý thời hạn và giá cả cho các gói dịch vụ</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/products">
                        <Button variant="secondary">
                            <Package className="h-4 w-4 mr-2" />
                            Quản lý Sản phẩm
                        </Button>
                    </Link>
                    <Button onClick={handleCreateClick}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo Thời hạn Mới
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Thời hạn</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">{subscriptionDurations.length}</p>
                        <p className="text-xs text-muted-foreground">
                            thời hạn gói đăng ký
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giá Trung bình</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">
                            {subscriptionDurations.length > 0 
                                ? formatPrice(subscriptionDurations.reduce((sum, sd) => sum + sd.price, 0) / subscriptionDurations.length)
                                : '0 ₫'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            giá trung bình
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thời hạn Ngắn nhất</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">
                            {subscriptionDurations.length > 0 
                                ? Math.min(...subscriptionDurations.map(sd => sd.days)) + ' ngày'
                                : '0 ngày'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            thời hạn ngắn nhất
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thời hạn Dài nhất</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">
                            {subscriptionDurations.length > 0 
                                ? Math.max(...subscriptionDurations.map(sd => sd.days)) + ' ngày'
                                : '0 ngày'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            thời hạn dài nhất
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription Durations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Thời hạn Gói Đăng ký</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Loại Gói</TableHead>
                                <TableHead>Thời hạn</TableHead>
                                <TableHead>Số ngày</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptionDurations.map((subscriptionDuration) => (
                                <TableRow key={subscriptionDuration.id}>
                                    <TableCell className="font-medium">
                                        {getProductName(subscriptionDuration.product_id)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {getSubscriptionTypeName(subscriptionDuration.subscription_type_id)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{subscriptionDuration.duration}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-500">
                                            {subscriptionDuration.days} ngày
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-green-600">
                                            {formatPrice(subscriptionDuration.price)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(subscriptionDuration.createdAt).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEditClick(subscriptionDuration)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="secondary" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa thời hạn "{subscriptionDuration.duration}" với giá {formatPrice(subscriptionDuration.price)}? 
                                                            Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(subscriptionDuration.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {subscriptionDurations.length === 0 && (
                        <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có thời hạn gói đăng ký nào</p>
                            <Button onClick={handleCreateClick} className="mt-4">Tạo thời hạn đầu tiên</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Popup */}
            <Dialog open={showCreatePopup} onOpenChange={setShowCreatePopup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Thời hạn Gói Đăng ký Mới</DialogTitle>
                        <DialogDescription>
                            Thêm thời hạn và giá cả mới cho gói dịch vụ
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Form */}
                            <div className="space-y-6">
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
                                                <Button 
                                                    type="button"
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={() => setSelectedProduct(null)}
                                                >
                                                    Thay đổi
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Tìm kiếm sản phẩm..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
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
                                        </div>
                                    )}
                                </div>

                                {/* Subscription Type Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="subscription_type_id">Loại Gói Đăng ký *</Label>
                                    {selectedSubscriptionType ? (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Package className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-blue-900">{selectedSubscriptionType.name || selectedSubscriptionType.type_name}</p>
                                                        <p className="text-sm text-blue-700">ID: {selectedSubscriptionType.id}</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    type="button"
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={() => setSelectedSubscriptionType(null)}
                                                >
                                                    Thay đổi
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Tìm kiếm loại gói đăng ký..."
                                                    value={subscriptionTypeSearchTerm}
                                                    onChange={(e) => setSubscriptionTypeSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {subscriptionTypes
                                                    .filter(type => 
                                                        type.name?.toLowerCase().includes(subscriptionTypeSearchTerm.toLowerCase()) ||
                                                        type.type_name.toLowerCase().includes(subscriptionTypeSearchTerm.toLowerCase())
                                                    )
                                                    .map((type) => (
                                                        <div
                                                            key={type.id}
                                                            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                                            onClick={() => handleSubscriptionTypeSelect(type)}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Package className="h-5 w-5 text-gray-600" />
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{type.name || type.type_name}</p>
                                                                    <p className="text-sm text-gray-500">ID: {type.id}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
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
                            </div>

                            {/* Preview */}
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-3">Xem trước</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Sản phẩm:</span> {selectedProduct?.name || 'Chưa chọn'}</p>
                                        <p><span className="font-medium">Loại gói:</span> {selectedSubscriptionType?.name || selectedSubscriptionType?.type_name || 'Chưa chọn'}</p>
                                        <p><span className="font-medium">Thời hạn:</span> {formData.duration || 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Số ngày:</span> {formData.days ? `${formData.days} ngày` : 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Giá:</span> {formData.price ? formatPrice(parseInt(formData.price)) : 'Chưa nhập'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowCreatePopup(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={formLoading}>
                                {formLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Tạo Thời hạn
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Popup */}
            <Dialog open={showEditPopup} onOpenChange={setShowEditPopup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Cập nhật Thời hạn Gói Đăng ký</DialogTitle>
                        <DialogDescription>
                            Chỉnh sửa thông tin thời hạn và giá cả
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Form */}
                            <div className="space-y-6">
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
                                                <Button 
                                                    type="button"
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={() => setSelectedProduct(null)}
                                                >
                                                    Thay đổi
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Tìm kiếm sản phẩm..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
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
                                        </div>
                                    )}
                                </div>

                                {/* Subscription Type Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="subscription_type_id">Loại Gói Đăng ký *</Label>
                                    {selectedSubscriptionType ? (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Package className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-blue-900">{selectedSubscriptionType.name || selectedSubscriptionType.type_name}</p>
                                                        <p className="text-sm text-blue-700">ID: {selectedSubscriptionType.id}</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    type="button"
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={() => setSelectedSubscriptionType(null)}
                                                >
                                                    Thay đổi
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Tìm kiếm loại gói đăng ký..."
                                                    value={subscriptionTypeSearchTerm}
                                                    onChange={(e) => setSubscriptionTypeSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {subscriptionTypes
                                                    .filter(type => 
                                                        type.name?.toLowerCase().includes(subscriptionTypeSearchTerm.toLowerCase()) ||
                                                        type.type_name.toLowerCase().includes(subscriptionTypeSearchTerm.toLowerCase())
                                                    )
                                                    .map((type) => (
                                                        <div
                                                            key={type.id}
                                                            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                                            onClick={() => handleSubscriptionTypeSelect(type)}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Package className="h-5 w-5 text-gray-600" />
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{type.name || type.type_name}</p>
                                                                    <p className="text-sm text-gray-500">ID: {type.id}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
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
                            </div>

                            {/* Preview */}
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-3">Xem trước</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Sản phẩm:</span> {selectedProduct?.name || 'Chưa chọn'}</p>
                                        <p><span className="font-medium">Loại gói:</span> {selectedSubscriptionType?.name || selectedSubscriptionType?.type_name || 'Chưa chọn'}</p>
                                        <p><span className="font-medium">Thời hạn:</span> {formData.duration || 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Số ngày:</span> {formData.days ? `${formData.days} ngày` : 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Giá:</span> {formData.price ? formatPrice(parseInt(formData.price)) : 'Chưa nhập'}</p>
                                    </div>
                                </div>

                                {editingDuration && (
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h3 className="font-medium text-blue-900 mb-3">Thông tin hiện tại</h3>
                                        <div className="space-y-2 text-sm text-blue-800">
                                            <p>• Thời hạn: {editingDuration.duration}</p>
                                            <p>• Số ngày: {editingDuration.days} ngày</p>
                                            <p>• Giá: {formatPrice(editingDuration.price)}</p>
                                            <p>• Ngày tạo: {new Date(editingDuration.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowEditPopup(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={formLoading}>
                                {formLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Cập nhật
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function SubscriptionDurationsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubscriptionDurationsContent />
        </Suspense>
    );
}
