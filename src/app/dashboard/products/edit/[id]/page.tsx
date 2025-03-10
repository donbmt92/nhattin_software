"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../ProductForm";
import axios from 'axios';

interface Product {
    _id: {
        id: string;
        id_category: {
            _id: string;
            type: string;
            name: string;
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

export default function EditProduct({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [discountWarning, setDiscountWarning] = useState<string | null>(null);

    // Helper function to check if a discount is valid
    const isDiscountValid = (discount?: Product['id_discount']) => {
        if (!discount) return true; // No discount is valid
        return discount.status === 'active' && new Date(discount.time_end) > new Date();
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('nhattin_token');
                if (!token) {
                    alert('Please login to view product details');
                    router.push('/dashboard/products');
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Product data Edit:', response.data);
                setProduct(response.data);
                
                // Check if product has an expired discount
                if (response.data.id_discount && !isDiscountValid(response.data.id_discount)) {
                    setDiscountWarning(`This product has an expired discount: ${response.data.id_discount.name}. The discount will not be applied to the product price.`);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data?.message || 'Failed to fetch product details');
                } else {
                    alert('Failed to fetch product details');
                }
                router.push('/dashboard/products');
            } finally {
                setIsFetching(false);
            }
        };

        fetchProduct();
    }, [params.id, router]);

    const handleSubmit = async (formData: FormData) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Please login to update the product');
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`, 
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
            console.error('Error updating product:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Failed to update product. Please try again.');
            } else {
                alert('Failed to update product. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    // Transform the data to match ProductForm's expected format
    const formData = {
        id: product._id.id,
        name: product.name,
        desc: product.description,
        image: product.image,
        id_category: product.id_category._id,
        id_discount: product.id_discount?._id || "none",
        base_price: product.base_price,
        min_price: product.min_price,
        max_price: product.max_price,
        rating: product.rating,
        total_reviews: product.total_reviews,
        sold: product.sold,
        warranty_policy: product.warranty_policy,
        status: product.status
    };

    console.log('Form data for edit:', formData);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            {discountWarning && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                {discountWarning}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <ProductForm 
                initialData={formData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 