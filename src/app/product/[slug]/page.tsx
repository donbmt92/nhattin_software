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
import SubscriptionDemo from './components/SubscriptionDemo';
import { ProductSchema, BreadcrumbSchema } from '@/components/StructuredData';


export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<any[]>([]);
    const [subcriptionType, setSubcriptionType] = useState<any[]>([]);
    const [subcriptionDuration, setSubcriptionDuration] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const getProductDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const productResponse = await api.get(`/products/by-slug/${slug}`);
            console.log("productResponse", productResponse.data);
            
            // Use productResponse.data.id instead of productResponse.data._id.id
            const productId = productResponse.data._id;
            console.log("Product ID:", productId);
            
            if (!productId) {
                console.error("Product ID is undefined");
                setError("Không tìm thấy ID sản phẩm");
                return;
            }
            
            // Lấy subscription types cùng với durations
            const subcriptionTypeResponse = await api.get(`/subscription-types?product_id=${productId}&with_durations=true`);
            console.log("subcriptionTypeResponse with durations", subcriptionTypeResponse.data);
            
            setProduct([productResponse.data]); 
            setSubcriptionType(subcriptionTypeResponse.data);
            // Không cần gọi API durations riêng nữa vì đã có trong subscription types
            setSubcriptionDuration([]);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            setError("Không thể tải thông tin sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            getProductDetail();
        }
    }, [slug]);

    // Show loading state
    if (loading) {
        return <div className="container mx-auto py-10 text-center">Loading...</div>;
    }
    
    // Show error state
    if (error) {
        return (
            <div className="container mx-auto py-10 text-center">
                <div className="text-red-600 mb-4">{error}</div>
                <button 
                    onClick={() => getProductDetail()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }
    
    // Show no product found state
    if (product.length === 0) {
        return (
            <div className="container mx-auto py-10 text-center">
                <div className="text-gray-600 mb-4">Không tìm thấy sản phẩm</div>
                <button 
                    onClick={() => getProductDetail()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }
    
    return (
        <div className="">
            {/* Structured Data */}
            {product.length > 0 && (
                <>
                    <ProductSchema
                        name={product[0].name}
                        description={product[0].desc}
                        image={product[0].image}
                        price={parseInt(product[0].base_price)}
                        currency="VND"
                        availability="InStock"
                        brand="Nhất Tín Software"
                        category={product[0].id_category?.name}
                        rating={product[0].rating ? {
                            ratingValue: product[0].rating,
                            reviewCount: product[0].total_reviews || 0
                        } : undefined}
                    />
                    <BreadcrumbSchema
                        items={[
                            { name: "Trang chủ", url: "https://nhattinsoftware.com" },
                            { name: "Sản phẩm", url: "https://nhattinsoftware.com/products" },
                            { name: product[0].name, url: `https://nhattinsoftware.com/product/${product[0].slug}` }
                        ]}
                    />
                </>
            )}
            
            <ProductDetailComponent 
                products={product} 
                subcriptionTypes={subcriptionType} 
                subcriptionDurations={[]} 
            />
            
            {/* Subscription Demo */}
            <div className="container mx-auto px-4 mb-6">
                <SubscriptionDemo subscriptionTypes={subcriptionType} />
            </div>

            {/* Backend Test */}
            <div className="container mx-auto px-4 mb-6">
                <BackendTest />
            </div>

            {/* Affiliate Section */}
            {product.length > 0 && (
                <div className="container mx-auto px-4">
                    <ProductAffiliateSection 
                        productId={product[0].id}
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
                    productId={product[0].id}
                    productName={product[0].name}
                />
            )}
        </div>
    )
}
