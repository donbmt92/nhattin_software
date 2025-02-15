"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";

export default function CreateProduct() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (formData: FormData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to create a product');
            return;
        }
        setIsLoading(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error('Error creating product:', error);
            alert(error instanceof Error ? error.message : 'Failed to create product. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
            <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
} 