"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
import { Loader2, Plus, Clock, Package, Search, Save, Edit, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';

interface Product {
    _id: {
        id: string;
        id_category: {
            _id: string;
            type: string;
            name: string;
        };
        id_discount?: {
            _id: string;
            name: string;
            desc: string;
            discount_percent: number;
            time_start: string;
            time_end: string;
            status: string;
        };
        name: string;
        description: string;
        image: string;
        thumbnail: string;
        base_price: number;
        min_price: number;
        max_price: number;
        rating: number;
        total_reviews: number;
        sold: number;
        warranty_policy: boolean;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    id_category: {
        _id: string;
        type: string;
        name: string;
    };
    id_discount?: {
        _id: string;
        name: string;
        desc: string;
        discount_percent: number;
        time_start: string;
        time_end: string;
        status: string;
    };
    name: string;
    description: string;
    image: string;
    thumbnail: string;
    base_price: number;
    min_price: number;
    max_price: number;
    rating: number;
    total_reviews: number;
    sold: number;
    warranty_policy: boolean;
    status: string;
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

interface DurationItem {
    subscription_type_id: string;
    duration: string;
    price: string;
    days: string;
}

interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Categories management states
    const [showCategoriesManagement, setShowCategoriesManagement] = useState(false);
    const [showCreateCategoryPopup, setShowCreateCategoryPopup] = useState(false);
    const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        description: ''
    });
    
    // Multiple durations state
    const [showCreateMultipleDurationsPopup, setShowCreateMultipleDurationsPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [durationItems, setDurationItems] = useState<DurationItem[]>([
        { subscription_type_id: '', duration: '', price: '', days: '' }
    ]);
    const [formLoading, setFormLoading] = useState(false);

    // Helper function to check if a discount is valid
    const isDiscountValid = (discount?: Product['id_discount']) => {
        if (!discount) return false;
        return discount.status === 'active' && new Date(discount.time_end) > new Date();
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            const data = response.data;
            console.log("Products data:", data);
            
            // Verify that data is an array before setting it
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setError('Invalid data format received from server');
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Failed to fetch products');
            } else {
                setError('Failed to fetch products');
            }
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptionTypes = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types`);
            setSubscriptionTypes(response.data);
        } catch (error) {
            console.error('Error fetching subscription types:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                console.error('No token found');
                return;
            }
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchSubscriptionTypes(), fetchCategories()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để xóa sản phẩm');
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Refresh products list after successful deletion
            await fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.');
            } else {
                alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Multiple durations handlers
    const handleCreateMultipleDurationsClick = (product: Product) => {
        setSelectedProduct(product);
        setDurationItems([{ subscription_type_id: '', duration: '', price: '', days: '' }]);
        setShowCreateMultipleDurationsPopup(true);
    };

    const addDurationItem = () => {
        setDurationItems([...durationItems, { subscription_type_id: '', duration: '', price: '', days: '' }]);
    };

    const removeDurationItem = (index: number) => {
        if (durationItems.length > 1) {
            setDurationItems(durationItems.filter((_, i) => i !== index));
        }
    };

    const updateDurationItem = (index: number, field: keyof DurationItem, value: string) => {
        const updatedItems = [...durationItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setDurationItems(updatedItems);
    };

    const handleMultipleDurationsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!selectedProduct) {
            alert('Vui lòng chọn sản phẩm');
            return;
        }

        // Validate all duration items
        for (let i = 0; i < durationItems.length; i++) {
            const item = durationItems[i];
            if (!item.subscription_type_id || !item.duration || !item.price || !item.days) {
                alert(`Vui lòng điền đầy đủ thông tin cho thời hạn ${i + 1}`);
                return;
            }
        }

        try {
            setFormLoading(true);
            
            // Create all durations
            const promises = durationItems.map(item => 
                axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-durations`, {
                    product_id: selectedProduct._id.id,
                    subscription_type_id: item.subscription_type_id,
                    duration: item.duration,
                    price: parseInt(item.price),
                    days: parseInt(item.days)
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            );

            await Promise.all(promises);
            alert(`Tạo thành công ${durationItems.length} thời hạn gói đăng ký!`);
            setShowCreateMultipleDurationsPopup(false);
            
        } catch (error) {
            console.error('Error creating multiple durations:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể tạo thời hạn gói đăng ký. Vui lòng thử lại.');
            } else {
                alert('Không thể tạo thời hạn gói đăng ký. Vui lòng thử lại.');
            }
        } finally {
            setFormLoading(false);
        }
    };

    const getSubscriptionTypesForProduct = (productId: string) => {
        return subscriptionTypes.filter(type => type.product_id === productId);
    };

    // Categories management functions
    const handleCreateCategoryClick = () => {
        setCategoryFormData({ name: '', description: '' });
        setShowCreateCategoryPopup(true);
    };

    const handleEditCategoryClick = (category: Category) => {
        setEditingCategory(category);
        setCategoryFormData({
            name: category.name,
            description: category.description
        });
        setShowEditCategoryPopup(true);
    };

    const handleCategoryInputChange = (field: string, value: string) => {
        setCategoryFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCategorySubmit = async (e: React.FormEvent, isEdit: boolean = false) => {
        e.preventDefault();
        
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!categoryFormData.name.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            setFormLoading(true);
            
            const url = isEdit 
                ? `${process.env.NEXT_PUBLIC_API_URL}/categories?id=${editingCategory?._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
            
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await axios({
                method,
                url,
                data: categoryFormData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert(isEdit ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục thành công!');
                setShowCreateCategoryPopup(false);
                setShowEditCategoryPopup(false);
                setCategoryFormData({ name: '', description: '' });
                setEditingCategory(null);
                await fetchCategories(); // Refresh categories list
            }
            
        } catch (error) {
            console.error('Error saving category:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể lưu danh mục. Vui lòng thử lại.');
            } else {
                alert('Không thể lưu danh mục. Vui lòng thử lại.');
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để xóa danh mục');
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            alert('Xóa danh mục thành công!');
            await fetchCategories(); // Refresh categories list
            
        } catch (error) {
            console.error('Error deleting category:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể xóa danh mục. Vui lòng thử lại.');
            } else {
                alert('Không thể xóa danh mục. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on category and search term
    const filteredProducts = products.filter(product => {
        const matchesCategory = !selectedCategory || product.id_category._id === selectedCategory;
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id_category.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
            {/* Subscription Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/dashboard/products/subscription-types">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Quản lý Loại Gói</h3>
                                    <p className="text-gray-600">Quản lý các loại gói dịch vụ (Basic, Premium, Enterprise)</p>
                                </div>
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/dashboard/products/subscription-durations">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Quản lý Thời hạn</h3>
                                    <p className="text-gray-600">Quản lý thời hạn và giá cả cho các gói dịch vụ</p>
                                </div>
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Quản lý Sản phẩm</CardTitle>
                    <div className="flex space-x-2">
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowCategoriesManagement(!showCategoriesManagement)}
                            className="flex items-center space-x-1"
                        >
                            <Package className="h-4 w-4" />
                            <span>Quản lý Categories</span>
                        </Button>
                        <Link href="/dashboard/products/subscription-types">
                            <Button variant="secondary">Loại Gói</Button>
                        </Link>
                        <Link href="/dashboard/products/subscription-durations">
                            <Button variant="secondary">Thời hạn Gói</Button>
                        </Link>
                        <Link href="/dashboard/products/create">
                            <Button>Thêm Sản phẩm mới</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filter Section */}
                    <div className="mb-6 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Tìm kiếm sản phẩm hoặc danh mục..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            {/* Category Filter */}
                            <div className="sm:w-64">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Clear Filters */}
                            {(selectedCategory || searchTerm) && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSearchTerm('');
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                        
                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            Hiển thị {filteredProducts.length} / {products.length} sản phẩm
                            {selectedCategory && (
                                <span className="ml-2">
                                    • Danh mục: {categories.find(c => c._id === selectedCategory)?.name}
                                </span>
                            )}
                            {searchTerm && (
                                <span className="ml-2">
                                    • Tìm kiếm: "{searchTerm}"
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Categories Management Section */}
                    {showCategoriesManagement && (
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Quản lý Categories</h3>
                                <Button onClick={handleCreateCategoryClick} className="flex items-center space-x-1">
                                    <Plus className="h-4 w-4" />
                                    <span>Thêm Category</span>
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <div key={category._id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
                                                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                                                <p className="text-xs text-gray-500">
                                                    Tạo: {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1 ml-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleEditCategoryClick(category)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="secondary" 
                                                            size="sm"
                                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc chắn muốn xóa category "{category.name}"? 
                                                                Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm liên quan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteCategory(category._id)}
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
                                ))}
                                
                                {categories.length === 0 && (
                                    <div className="col-span-full text-center py-8">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có category nào</h3>
                                        <p className="text-gray-500 mb-4">Tạo category đầu tiên để bắt đầu quản lý sản phẩm.</p>
                                        <Button onClick={handleCreateCategoryClick} className="flex items-center space-x-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Tạo Category đầu tiên</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hình ảnh</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Khuyến mãi</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <TableRow key={product._id.id}>
                                        <TableCell>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            {isDiscountValid(product.id_discount) ? (
                                                <div>
                                                    <span className="line-through text-gray-500">
                                                        {product.base_price.toLocaleString('vi-VN')} VND
                                                    </span>
                                                    <br />
                                                    <span className="text-red-600">
                                                        {(product.base_price * (1 - (product.id_discount!.discount_percent || 0) / 100)).toLocaleString('vi-VN')} VND
                                                    </span>
                                                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                        -{product.id_discount!.discount_percent}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>{product.base_price.toLocaleString('vi-VN')} VND</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{product.id_category.name}</TableCell>
                                        <TableCell>
                                            {product.id_discount ? (
                                                isDiscountValid(product.id_discount) ? (
                                                    <span className="text-sm text-green-600">
                                                        {product.id_discount.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-orange-600">
                                                        {product.id_discount.name} (hết hạn)
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-sm text-gray-500">Không có khuyến mãi</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col space-y-1">
                                                <Link href={`/dashboard/products/subscription-types?product_id=${product._id}`}>
                                                    <Button variant="secondary" size="sm" className="w-full text-xs">
                                                        📦 Loại Gói
                                                    </Button>
                                                </Link>
                                                <Link href={`/dashboard/products/subscription-durations?product_id=${product._id}`}>
                                                    <Button variant="secondary" size="sm" className="w-full text-xs">
                                                        ⏰ Thời hạn
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="w-full text-xs"
                                                    onClick={() => handleCreateMultipleDurationsClick(product)}
                                                >
                                                    ⚡ Tạo Nhiều Thời hạn
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/dashboard/products/edit/${product._id.id}`}>
                                                <Button variant="secondary" size="sm">
                                                    Sửa
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="secondary" size="sm" className="bg-red-100 text-red-800 hover:bg-red-200">
                                                        Xóa
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xóa Sản phẩm</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(product._id.id)}
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Search className="h-12 w-12 text-gray-400" />
                                            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
                                            <p className="text-gray-500">
                                                {selectedCategory || searchTerm 
                                                    ? 'Không có sản phẩm nào phù hợp với bộ lọc của bạn.'
                                                    : 'Chưa có sản phẩm nào được tạo.'
                                                }
                                            </p>
                                            {(selectedCategory || searchTerm) && (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedCategory('');
                                                        setSearchTerm('');
                                                    }}
                                                    className="mt-2"
                                                >
                                                    Xóa bộ lọc
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Multiple Durations Popup */}
            <Dialog open={showCreateMultipleDurationsPopup} onOpenChange={setShowCreateMultipleDurationsPopup}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Nhiều Thời hạn Gói Đăng ký</DialogTitle>
                        <DialogDescription>
                            Tạo nhiều thời hạn cùng lúc cho sản phẩm: {selectedProduct?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMultipleDurationsSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {durationItems.map((item, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium text-gray-900">Thời hạn {index + 1}</h3>
                                        {durationItems.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => removeDurationItem(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Subscription Type */}
                                        <div className="space-y-2">
                                            <Label>Loại Gói Đăng ký *</Label>
                                            <select
                                                value={item.subscription_type_id}
                                                onChange={(e) => updateDurationItem(index, 'subscription_type_id', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                <option value="">Chọn loại gói</option>
                                                {getSubscriptionTypesForProduct(selectedProduct?._id.id || '').map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name || type.type_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Duration */}
                                        <div className="space-y-2">
                                            <Label>Thời hạn *</Label>
                                            <Input
                                                value={item.duration}
                                                onChange={(e) => updateDurationItem(index, 'duration', e.target.value)}
                                                placeholder="VD: 1 tháng, 3 tháng, 1 năm"
                                                required
                                            />
                                        </div>

                                        {/* Days */}
                                        <div className="space-y-2">
                                            <Label>Số ngày *</Label>
                                            <Input
                                                type="number"
                                                value={item.days}
                                                onChange={(e) => updateDurationItem(index, 'days', e.target.value)}
                                                placeholder="VD: 30, 90, 365"
                                                min="1"
                                                required
                                            />
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label>Giá (VND) *</Label>
                                            <Input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updateDurationItem(index, 'price', e.target.value)}
                                                placeholder="VD: 149000, 399000"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add More Button */}
                        <div className="flex justify-center">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addDurationItem}
                                className="flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Thêm Thời hạn</span>
                            </Button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowCreateMultipleDurationsPopup(false)}
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
                                        Tạo {durationItems.length} Thời hạn
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Category Popup */}
            <Dialog open={showCreateCategoryPopup} onOpenChange={setShowCreateCategoryPopup}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tạo Category Mới</DialogTitle>
                        <DialogDescription>
                            Tạo danh mục mới cho sản phẩm
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => handleCategorySubmit(e, false)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tên Category *</Label>
                            <Input
                                value={categoryFormData.name}
                                onChange={(e) => handleCategoryInputChange('name', e.target.value)}
                                placeholder="VD: Điện thoại, Laptop, Phụ kiện"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Textarea
                                value={categoryFormData.description}
                                onChange={(e) => handleCategoryInputChange('description', e.target.value)}
                                placeholder="Mô tả chi tiết về category..."
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowCreateCategoryPopup(false)}
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
                                        Tạo Category
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Popup */}
            <Dialog open={showEditCategoryPopup} onOpenChange={setShowEditCategoryPopup}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa Category</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin danh mục
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => handleCategorySubmit(e, true)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tên Category *</Label>
                            <Input
                                value={categoryFormData.name}
                                onChange={(e) => handleCategoryInputChange('name', e.target.value)}
                                placeholder="VD: Điện thoại, Laptop, Phụ kiện"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Textarea
                                value={categoryFormData.description}
                                onChange={(e) => handleCategoryInputChange('description', e.target.value)}
                                placeholder="Mô tả chi tiết về category..."
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowEditCategoryPopup(false)}
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
