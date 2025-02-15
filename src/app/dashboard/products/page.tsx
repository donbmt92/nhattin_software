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

interface Product {
    _id: {
        id: string;
        id_category: any;
        name: string;
        image: string;
        desc: string;
        price: number;
        createdAt: string;
        updatedAt: string;
    };
    name: string;
    price: number;
    desc: string;
    image: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            const data = await response.json();
            console.log(data);
            
            // Verify that data is an array before setting it
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setError('Invalid data format received from server');
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token')
            console.log("Deleting product with ID:", id);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            // Refresh products list
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
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
                                    <TableCell>${product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/dashboard/products/edit/${product._id.id}`}>
                                            <Button variant="secondary" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
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