"use client";
import React from 'react'
import ProductDetailComponent from './components/ProductDetailComponent';

// Default export for Next.js page routing
export default function Page({ params, searchParams }: { 
    params: { id: string },
    searchParams: any
}) {
    // Create mock data for the page case
    const mockProducts: any[] = [{
        _id: params.id || "1",
        id: params.id || "1",
        name: "Sample Product",
        id_category: { name: "Sample Category" },
        sales: "100",
        base_price: "99.99",
        image: "/images/sample.jpg",
    }];

    const mockSubscriptionTypes: any[] = [
        { _id: "1", type_name: "Basic" },
        { _id: "2", type_name: "Premium" },
        { _id: "3", type_name: "Enterprise" }
    ];

    const mockSubscriptionDurations: any[] = [
        { _id: "1", duration: "1 Month" },
        { _id: "2", duration: "3 Months" },
        { _id: "3", duration: "1 Year" }
    ];
    
    return <ProductDetailComponent 
        products={mockProducts} 
        subcriptionTypes={mockSubscriptionTypes} 
        subcriptionDurations={mockSubscriptionDurations} 
    />;
}
