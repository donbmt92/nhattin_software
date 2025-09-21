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
import { Loader2, Plus, Edit, Trash2, Package, Search, Save, Clock, DollarSign, Calculator } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from 'axios';

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

interface Product {
    _id: string;
    name: string;
}

function SubscriptionTypesContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product_id');
    
    const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
    const [subscriptionDurations, setSubscriptionDurations] = useState<SubscriptionDuration[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Popup states
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showCreateDurationPopup, setShowCreateDurationPopup] = useState(false);
    const [showEditDurationPopup, setShowEditDurationPopup] = useState(false);
    const [showDurationsListPopup, setShowDurationsListPopup] = useState(false);
    const [editingType, setEditingType] = useState<SubscriptionType | null>(null);
    const [editingDuration, setEditingDuration] = useState<SubscriptionDuration | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<SubscriptionType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [subscriptionTypeSearchTerm, setSubscriptionTypeSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        product_id: '',
        type_name: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
        name: '',
        description: ''
    });
    const [durationFormData, setDurationFormData] = useState({
        product_id: '',
        subscription_type_id: '',
        duration: '',
        price: '',
        days: ''
    });
    const [formLoading, setFormLoading] = useState(false);

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
            await Promise.all([fetchSubscriptionTypes(), fetchSubscriptionDurations(), fetchProducts()]);
            setLoading(false);
        };
        loadData();
    }, [productId]);

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để xóa loại gói đăng ký');
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            await fetchSubscriptionTypes();
        } catch (error) {
            console.error('Error deleting subscription type:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể xóa loại gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể xóa loại gói đăng ký. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getProductName = (productId: string) => {
        const product = products.find(p => p._id === productId);
        return product ? product.name : 'Không xác định';
    };

    const getSubscriptionTypeName = (subscriptionTypeId: string) => {
        const subscriptionType = subscriptionTypes.find(st => st.id === subscriptionTypeId);
        return subscriptionType ? (subscriptionType.name || subscriptionType.type_name) : 'Không xác định';
    };

    const getDurationsForType = (subscriptionTypeId: string) => {
        return subscriptionDurations.filter(duration => duration.subscription_type_id === subscriptionTypeId);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Popup handlers
    const handleCreateClick = () => {
        setFormData({
            product_id: productId || '',
            type_name: '',
            status: 'ACTIVE',
            name: '',
            description: ''
        });
        if (productId) {
            const product = products.find(p => p._id === productId);
            if (product) {
                setSelectedProduct(product);
            }
        } else {
            setSelectedProduct(null);
        }
        setShowCreatePopup(true);
    };

    const handleEditClick = (type: SubscriptionType) => {
        setEditingType(type);
        setFormData({
            product_id: type.product_id,
            type_name: type.type_name,
            status: type.status,
            name: type.name,
            description: type.description || ''
        });
        const product = products.find(p => p._id === type.product_id);
        setSelectedProduct(product || null);
        setShowEditPopup(true);
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setFormData(prev => ({
            ...prev,
            product_id: product._id
        }));
        // Cũng cập nhật durationFormData nếu đang trong duration form
        setDurationFormData(prev => ({
            ...prev,
            product_id: product._id
        }));
    };

    // Duration handlers
    const handleCreateDurationClick = (subscriptionType?: SubscriptionType) => {
        // Tìm product từ subscription type
        const product = subscriptionType ? products.find(p => p._id === subscriptionType.product_id) : null;
        
        setDurationFormData({
            product_id: subscriptionType?.product_id || '',
            subscription_type_id: subscriptionType?.id || '',
            duration: '',
            price: '',
            days: ''
        });
        setSelectedProduct(product || null);
        setSelectedSubscriptionType(subscriptionType || null);
        setShowCreateDurationPopup(true);
    };

    const handleDurationsListClick = (subscriptionType: SubscriptionType) => {
        setSelectedSubscriptionType(subscriptionType);
        setShowDurationsListPopup(true);
    };

    const handleEditDurationClick = (duration: SubscriptionDuration) => {
        setEditingDuration(duration);
        setDurationFormData({
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
        setShowEditDurationPopup(true);
    };

    const handleSubscriptionTypeSelect = (subscriptionType: SubscriptionType) => {
        setSelectedSubscriptionType(subscriptionType);
        setDurationFormData(prev => ({
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

    const handleDurationInputChange = (field: string, value: string) => {
        setDurationFormData(prev => ({
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

        if (!formData.product_id || !formData.type_name || !formData.name) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setFormLoading(true);
            if (editingType) {
                // Update existing
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/${editingType.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Cập nhật loại gói đăng ký thành công!');
                setShowEditPopup(false);
            } else {
                // Create new
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Tạo loại gói đăng ký thành công!');
                setShowCreatePopup(false);
            }
            
            await fetchSubscriptionTypes();
        } catch (error) {
            console.error('Error saving subscription type:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể lưu loại gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể lưu loại gói đăng ký. Vui lòng thử lại.');
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleDurationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!durationFormData.product_id || !durationFormData.subscription_type_id || !durationFormData.duration || !durationFormData.price || !durationFormData.days) {
            console.log('Vui lòng điền đầy đủ thông tin bắt buộc !', durationFormData);
            
            alert('Vui lòng điền đầy đủ thông tin bắt buộc !');
            return;
        }

        try {
            setFormLoading(true);
            
            const requestData = {
                product_id: durationFormData.product_id,
                subscription_type_id: durationFormData.subscription_type_id,
                duration: durationFormData.duration,
                price: parseInt(durationFormData.price),
                days: parseInt(durationFormData.days)
            };
            
            console.log('Sending duration data:', requestData);
            
            if (editingDuration) {
                // Update existing
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations/${editingDuration.id}`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Cập nhật thời hạn gói đăng ký thành công!');
                setShowEditDurationPopup(false);
            } else {
                // Create new
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Tạo thời hạn gói đăng ký thành công!');
                setShowCreateDurationPopup(false);
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

    const handleDeleteDuration = async (id: string) => {
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="text-center py-6 text-red-500">
                        {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý Gói Đăng ký & Thời hạn
                        {productId && (
                            <span className="text-lg font-normal text-blue-600 ml-2">
                                - {getProductName(productId)}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-600">
                        {productId 
                            ? `Quản lý loại gói và thời hạn dịch vụ cho sản phẩm "${getProductName(productId)}"`
                            : 'Quản lý loại gói và thời hạn dịch vụ cho sản phẩm'
                        }
                    </p>
                </div>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={handleCreateClick} className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Thêm Loại Gói</span>
                    </Button>
                    <Button onClick={() => handleCreateDurationClick()} className="flex items-center space-x-2" variant="secondary">
                        <Clock className="h-4 w-4" />
                        <span>Thêm Thời hạn</span>
                    </Button>
                    <Link href="/dashboard/products">
                        <Button variant="secondary">Quay lại</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng Loại Gói</p>
                                <p className="text-2xl font-bold text-gray-900">{subscriptionTypes.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đang Hoạt động</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {subscriptionTypes.filter(st => st.status === 'ACTIVE').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Package className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tạm Dừng</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {subscriptionTypes.filter(st => st.status === 'INACTIVE').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng Thời hạn</p>
                                <p className="text-2xl font-bold text-gray-900">{subscriptionDurations.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription Types & Durations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Gói Đăng ký & Thời hạn</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên Loại</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Thời hạn</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptionTypes.map((subscriptionType) => (
                                <TableRow key={subscriptionType.id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            <p className="font-semibold">{subscriptionType.type_name}</p>
                                            <p className="text-sm text-gray-500">{subscriptionType.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getProductName(subscriptionType.product_id)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleDurationsListClick(subscriptionType)}
                                                className="flex items-center space-x-1"
                                            >
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {getDurationsForType(subscriptionType.id).length} thời hạn
                                                </span>
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleCreateDurationClick(subscriptionType)}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            subscriptionType.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {subscriptionType.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {subscriptionType.description || 'Không có mô tả'}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(subscriptionType.createdAt).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            onClick={() => handleCreateDurationClick(subscriptionType)}
                                            variant="secondary" 
                                            size="sm" 
                                            className="flex items-center space-x-1"
                                        >
                                            <Clock className="h-3 w-3" />
                                            <span>Thêm Thời hạn</span>
                                        </Button>
                                        <Button 
                                            onClick={() => handleEditClick(subscriptionType)}
                                            variant="secondary" 
                                            size="sm" 
                                            className="flex items-center space-x-1"
                                        >
                                            <Edit className="h-3 w-3" />
                                            <span>Sửa</span>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center space-x-1">
                                                    <Trash2 className="h-3 w-3" />
                                                    <span>Xóa</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xóa Loại Gói Đăng ký</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn xóa loại gói đăng ký "{subscriptionType.type_name}"? 
                                                        Hành động này không thể hoàn tác.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(subscriptionType.id)}
                                                    >
                                                        Xóa
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    {subscriptionTypes.length === 0 && (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có loại gói đăng ký nào</p>
                            <p className="text-sm text-gray-400 mb-4">Tạo loại gói để bắt đầu thêm thời hạn và giá cả</p>
                            <Button onClick={handleCreateClick} className="mt-4">Tạo loại gói đầu tiên</Button>
                        </div>
                    )}
                </CardContent>
            </Card>


            {/* Create Popup */}
            <Dialog open={showCreatePopup} onOpenChange={setShowCreatePopup}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Loại Gói Đăng ký Mới</DialogTitle>
                        <DialogDescription>
                            Thêm loại gói dịch vụ mới cho sản phẩm
                        </DialogDescription>
                    </DialogHeader>
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
                            <Button type="button" variant="secondary" onClick={() => setShowCreatePopup(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={formLoading} className="flex items-center space-x-2">
                                {formLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>{formLoading ? 'Đang tạo...' : 'Tạo Loại Gói'}</span>
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Popup */}
            <Dialog open={showEditPopup} onOpenChange={setShowEditPopup}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa Loại Gói Đăng ký</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin loại gói dịch vụ
                        </DialogDescription>
                    </DialogHeader>
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

                        {/* Original Data */}
                        {editingType && (
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4 className="font-semibold text-yellow-900 mb-2">Dữ liệu Gốc</h4>
                                <div className="space-y-2 text-sm text-yellow-800">
                                    <p>• Tên loại: {editingType.type_name}</p>
                                    <p>• Tên hiển thị: {editingType.name}</p>
                                    <p>• Trạng thái: {editingType.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}</p>
                                    <p>• Ngày tạo: {new Date(editingType.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <Button type="button" variant="secondary" onClick={() => setShowEditPopup(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={formLoading} className="flex items-center space-x-2">
                                {formLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>{formLoading ? 'Đang cập nhật...' : 'Cập nhật'}</span>
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Duration Popup */}
            <Dialog open={showCreateDurationPopup} onOpenChange={setShowCreateDurationPopup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Thời hạn Gói Đăng ký Mới</DialogTitle>
                        <DialogDescription>
                            Thêm thời hạn và  cả mới cho gói dịch vụ
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDurationSubmit} className="space-y-6">
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
                                        value={durationFormData.duration}
                                        onChange={(e) => handleDurationInputChange('duration', e.target.value)}
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
                                        value={durationFormData.days}
                                        onChange={(e) => handleDurationInputChange('days', e.target.value)}
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
                                        value={durationFormData.price}
                                        onChange={(e) => handleDurationInputChange('price', e.target.value)}
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
                                        <p><span className="font-medium">Thời hạn:</span> {durationFormData.duration || 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Số ngày:</span> {durationFormData.days ? `${durationFormData.days} ngày` : 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Giá:</span> {durationFormData.price ? formatPrice(parseInt(durationFormData.price)) : 'Chưa nhập'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowCreateDurationPopup(false)}
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

            {/* Edit Duration Popup */}
            <Dialog open={showEditDurationPopup} onOpenChange={setShowEditDurationPopup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Cập nhật Thời hạn Gói Đăng ký</DialogTitle>
                        <DialogDescription>
                            Chỉnh sửa thông tin thời hạn và giá cả
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDurationSubmit} className="space-y-6">
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
                                        value={durationFormData.duration}
                                        onChange={(e) => handleDurationInputChange('duration', e.target.value)}
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
                                        value={durationFormData.days}
                                        onChange={(e) => handleDurationInputChange('days', e.target.value)}
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
                                        value={durationFormData.price}
                                        onChange={(e) => handleDurationInputChange('price', e.target.value)}
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
                                        <p><span className="font-medium">Thời hạn:</span> {durationFormData.duration || 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Số ngày:</span> {durationFormData.days ? `${durationFormData.days} ngày` : 'Chưa nhập'}</p>
                                        <p><span className="font-medium">Giá:</span> {durationFormData.price ? formatPrice(parseInt(durationFormData.price)) : 'Chưa nhập'}</p>
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
                                onClick={() => setShowEditDurationPopup(false)}
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

            {/* Durations List Popup */}
            <Dialog open={showDurationsListPopup} onOpenChange={setShowDurationsListPopup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Quản lý Thời hạn - {selectedSubscriptionType?.name || selectedSubscriptionType?.type_name}</DialogTitle>
                        <DialogDescription>
                            Quản lý các thời hạn cho loại gói đăng ký này
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {/* Header Actions */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">
                                    {getDurationsForType(selectedSubscriptionType?.id || '').length} thời hạn
                                </span>
                            </div>
                            <Button
                                onClick={() => {
                                    setShowDurationsListPopup(false);
                                    handleCreateDurationClick(selectedSubscriptionType || undefined);
                                }}
                                className="flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Thêm Thời hạn</span>
                            </Button>
                        </div>

                        {/* Durations List */}
                        <div className="space-y-3">
                            {getDurationsForType(selectedSubscriptionType?.id || '').length > 0 ? (
                                getDurationsForType(selectedSubscriptionType?.id || '').map((duration) => (
                                    <div key={duration.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium text-lg">{duration.duration}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calculator className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm text-gray-600">{duration.days} ngày</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="h-4 w-4 text-green-600" />
                                                        <span className="text-lg font-semibold text-green-600">
                                                            {formatPrice(duration.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setShowDurationsListPopup(false);
                                                        handleEditDurationClick(duration);
                                                    }}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    <span>Sửa</span>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="secondary" 
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            <span>Xóa</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc chắn muốn xóa thời hạn "{duration.duration}" với giá {formatPrice(duration.price)}? 
                                                                Hành động này không thể hoàn tác.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteDuration(duration.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Xóa
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thời hạn</h3>
                                    <p className="text-gray-500 mb-4">Loại gói này chưa có thời hạn nào được thiết lập.</p>
                                    <Button
                                        onClick={() => {
                                            setShowDurationsListPopup(false);
                                            handleCreateDurationClick(selectedSubscriptionType || undefined);
                                        }}
                                        className="flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Thêm Thời hạn đầu tiên</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function SubscriptionTypesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubscriptionTypesContent />
        </Suspense>
    );
}
