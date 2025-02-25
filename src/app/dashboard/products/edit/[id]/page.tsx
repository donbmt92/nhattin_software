"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../ProductForm";
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
    price: number;
    desc: string;
    image: string;
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
}

export default function EditProduct({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
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
                console.log('Product data:', response.data);
                setProduct(response.data);
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
        const token = localStorage.getItem('token');
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
        name: product.name,
        price: product.price,
        desc: product.desc,
        image: product.image,
        id_category: product.id_category._id,
        id_discount: product.id_discount?.id || "",
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm 
                initialData={formData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 