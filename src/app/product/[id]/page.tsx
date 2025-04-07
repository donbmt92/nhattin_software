"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import api from '@/app/components/utils/api';

// Import the components directly from their component files
import ProductDetailComponent from './ProductDetails/components/ProductDetailComponent';
import PolicyComponent from './Policy/components/PolicyComponent';
import DescriptionsComponent from './Descriptions/components/DescriptionsComponent';
import ListProductSimilarComponent from './ListProductSimilar/components/ListProductSimilarComponent';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any[]>([]);
    const [subcriptionType, setSubcriptionType] = useState<any[]>([]);
    const [subcriptionDuration, setSubcriptionDuration] = useState<any[]>([]);
    
    const getProductDetail = async () => {
        try {
            const productResponse = await api.get(`/products/${id}`);
            const subcriptionTypeResponse = await api.get(`/subscription-types?product_id=${id}`);
            const subcriptionDurationResponse = await api.get(`/subscription-durations?product_id=${id}`);
            setProduct([productResponse.data]); 
            setSubcriptionType(subcriptionTypeResponse.data);
            setSubcriptionDuration(subcriptionDurationResponse.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getProductDetail();
        }
    }, [id]);

    // If data isn't loaded yet, we can show a loading state
    if (product.length === 0) {
        return <div className="container mx-auto py-10 text-center">Loading...</div>;
    }
    
    return (
        <div className="">
            <ProductDetailComponent 
                products={product} 
                subcriptionTypes={subcriptionType} 
                subcriptionDurations={subcriptionDuration} 
            />
            <PolicyComponent />
            <DescriptionsComponent products={product} />
            <ListProductSimilarComponent />
        </div>
    )
}
