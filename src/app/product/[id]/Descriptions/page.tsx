"use client";
import React from 'react'
import DescriptionsComponent from './components/DescriptionsComponent';

// Default export for Next.js page routing
export default function Page({ params, searchParams }: { 
    params: { id: string },
    searchParams: any
}) {
    // Mock data based on params.id
    const mockProducts: any[] = [{
        _id: params.id || "1",
        id: params.id || "1",
        name: "Sample Product",
        id_category: "Category",
        sales: "100",
        base_price: "99.99",
        max_price: "120",
        min_price: "89.99",
        image: "/sample.jpg",
        description: "<p>This is a sample product description.</p>"
    }];
    
    return <DescriptionsComponent products={mockProducts} />;
}
