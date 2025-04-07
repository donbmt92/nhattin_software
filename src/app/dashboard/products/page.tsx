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
import { Loader2 } from "lucide-react";
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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        fetchProducts();
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Quản lý Sản phẩm</CardTitle>
                    <Link href="/dashboard/products/create">
                        <Button>Thêm Sản phẩm mới</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hình ảnh</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Khuyến mãi</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
} 