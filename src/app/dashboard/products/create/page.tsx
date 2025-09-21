"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";
import axios from 'axios';

export default function CreateProduct() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (formData: FormData) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Please login to create a product');
            return;
        }
        setIsLoading(true);
        
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error('Error creating product:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Failed to create product. Please try again.');
            } else {
                alert('Failed to create product. Please try again.');
            }
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
