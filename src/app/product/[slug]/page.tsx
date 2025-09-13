"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import api from '@/app/components/utils/api';

// Import the components directly from their component files
import ProductDetailComponent from './ProductDetails/components/ProductDetailComponent';
import PolicyComponent from './Policy/components/PolicyComponent';
import DescriptionsComponent from './Descriptions/components/DescriptionsComponent';
import ListProductSimilarComponent from './ListProductSimilar/components/ListProductSimilarComponent';
import QuickAffiliateLinkButton from '@/app/profile/components/QuickAffiliateLinkButton';
import ProductAffiliateSection from './components/ProductAffiliateSection';
import AffiliateLinkBanner from './components/AffiliateLinkBanner';
import BackendTest from './components/BackendTest';


export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<any[]>([]);
    const [subcriptionType, setSubcriptionType] = useState<any[]>([]);
    const [subcriptionDuration, setSubcriptionDuration] = useState<any[]>([]);
    
    const getProductDetail = async () => {
        try {
            const productResponse = await api.get(`/products/by-slug/${slug}`);
            console.log("productResponse", productResponse.data);
            const subcriptionTypeResponse = await api.get(`/subscription-types?product_id=${productResponse.data._id.id}`);
            const subcriptionDurationResponse = await api.get(`/subscription-durations?product_id=${productResponse.data._id.id}`);
            setProduct([productResponse.data]); 
            setSubcriptionType(subcriptionTypeResponse.data);
            setSubcriptionDuration(subcriptionDurationResponse.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        }
    };

    useEffect(() => {
        if (slug) {
            getProductDetail();
        }
    }, [slug]);

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
            
            {/* Backend Test */}
            <div className="container mx-auto px-4 mb-6">
                <BackendTest />
            </div>

            {/* Affiliate Section */}
            {product.length > 0 && (
                <div className="container mx-auto px-4">
                    <ProductAffiliateSection 
                        productId={product[0]._id.id}
                        productName={product[0].name}
                        productPrice={parseInt(product[0].base_price)}
                    />
                </div>
            )}
            
            <PolicyComponent />
            <DescriptionsComponent products={product} />
            <ListProductSimilarComponent />
            
            {/* Floating Affiliate Banner */}
            {product.length > 0 && (
                <AffiliateLinkBanner 
                    productId={product[0]._id.id}
                    productName={product[0].name}
                />
            )}
        </div>
    )
}
