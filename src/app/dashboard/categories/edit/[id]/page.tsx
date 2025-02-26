/* eslint-disable react/no-unescaped-entities */
"use client";

import { CategoryForm } from "../../CategoryForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
    _id: string;
    type: string;
    name: string;
}

export default function EditCategoryPage() {
    const params = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/categories/${params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch category');
                }

                const data = await response.json();
                setCategory(data);
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">⚠️</div>
                    <h3 className="text-lg font-medium text-gray-900">Category not found</h3>
                    <p className="mt-2 text-gray-600">The category you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Make changes to your category here. Click save when you're done.
                    </p>
                </div>
                <CategoryForm initialData={category} />
            </div>
        </div>
    );
} 