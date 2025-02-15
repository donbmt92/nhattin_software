"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getCategories = async (): Promise<Category[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 400) {
                const errorData = await response.json();
                console.log(errorData);     
                throw new Error(errorData.message || 'Bad Request');
            }
            if (response.status === 403) {
                throw new Error('Unauthorized access. Please login again.');
            }
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getCategories:', error);
        throw error;
    }
};

const deleteCategory = async (id: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        if (!id) {
            throw new Error('Category ID is required');
        }

        const response = await fetch(`${API_URL}/categories?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 400) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error(errorData.message || 'Bad Request');
            }
            if (response.status === 403) {
                throw new Error('Unauthorized access. Please login again.');
            }
            throw new Error('Failed to delete category');
        }
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        throw error;
    }
};



export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Show error message to user
            alert(error instanceof Error ? error.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id);
            setCategories(categories.filter((category) => category._id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
            // Show error message to user
            alert(error instanceof Error ? error.message : 'Failed to delete category');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link href="/dashboard/categories/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category._id}>
                            <TableCell>{category._id}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell>
                                {new Date(category.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Link href={`/dashboard/categories/edit/${category._id}`}>
                                    <Button variant="outline" size="sm">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(category._id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 