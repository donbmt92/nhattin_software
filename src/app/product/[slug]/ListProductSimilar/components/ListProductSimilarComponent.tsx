"use client";
import ListCard4 from '@/app/components/Card/ListCard4/ListCard4';
import api from '@/app/components/utils/api';
import React, { useEffect, useState } from 'react'

export default function ListProductSimilarComponent() {
    const [product, setProduct] = useState<any[]>([]);
    
    const getListProduct = async () => {
        const productResponse = await api.get("/products/");
        setProduct(productResponse.data);
    };

    useEffect(() => {
        getListProduct();
    }, []);
    
    return (
        <div className="relative container mx-auto pt-[100px] pb-[50px]">
            <div>
                <h2 className="text-[30px] font-bold text-left mb-1">Sản phẩm tương tự</h2>
                <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "40px", width: "150px" }} />
            </div>
            <div>
                <ListCard4 products={product}/>
            </div>
        </div>
    )
} 