"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../ProductForm";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

export default function EditProduct({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Failed to fetch product details');
                router.push('/dashboard/products');
            } finally {
                setIsFetching(false);
            }
        };

        fetchProduct();
    }, [params.id, router]);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm 
                initialData={product}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 