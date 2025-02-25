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
            id: string;
            name: string;
            desc: string;
            discount_percent: number;
            time_start: string;
            time_end: string;
            status: string;
        };
        name: string;
        image: string;
        desc: string;
        price: number;
    };
    id_category: {
        _id: string;
        type: string;
        name: string;
    };
    id_discount?: {
        id: string;
        name: string;
        desc: string;
        discount_percent: number;
        time_start: string;
        time_end: string;
        status: string;
    };
    name: string;
    price: number;
    desc: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            const data = response.data;
            console.log("this is data", data);
            
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
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to delete a product');
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
                alert(error.response?.data?.message || 'Failed to delete product. Please try again.');
            } else {
                alert('Failed to delete product. Please try again.');
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
                    <CardTitle>Products Management</CardTitle>
                    <Link href="/dashboard/products/create">
                        <Button>Add New Product</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id.id}>
                                    <TableCell>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="rounded-md object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        {(product.id_discount || product._id.id_discount) ? (
                                            <div>
                                                <span className="line-through text-gray-500">
                                                    {product.price.toLocaleString('vi-VN')} VND
                                                </span>
                                                <br />
                                                <span className="text-red-600">
                                                    {(product.price * (1 - (product.id_discount?.discount_percent || product._id.id_discount?.discount_percent || 0) / 100)).toLocaleString('vi-VN')} VND
                                                </span>
                                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                    -{product.id_discount?.discount_percent || product._id.id_discount?.discount_percent}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span>{product.price.toLocaleString('vi-VN')} VND</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{product.id_category.name}</TableCell>
                                    <TableCell>
                                        {(product.id_discount || product._id.id_discount) ? (
                                            <span className="text-sm text-green-600">
                                                {product.id_discount?.name || product._id.id_discount?.name}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-500">No discount</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/dashboard/products/edit/${product._id.id}`}>
                                            <Button variant="secondary" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="bg-red-100 text-red-800 hover:bg-red-200">
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this product? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(product._id.id)}
                                                    >
                                                        Delete
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