
"use client";
import React, { useEffect, useState } from 'react'
import ProductDetails from './ProductDetails/page'
import Policys from './Policy/page';
import ListProductSimilar from './ListProductSimilar/page';
import Descriptions from './Descriptions/page';
import { useParams } from 'next/navigation';
import api from '@/app/components/utils/api';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any[]>([]);
    const [subcriptionType, setSubcriptionType] = useState<any[]>([]);
    const [subcriptionDuration, setSubcriptionDuration] = useState<any[]>([]);
    console.log(subcriptionType);
    
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
    return (
        <div className="">
            <ProductDetails products={product} subcriptionTypes={subcriptionType} subcriptionDurations={subcriptionDuration} />
            <Policys />
            <Descriptions products={product} />
            <ListProductSimilar />
        </div>
    )
}
