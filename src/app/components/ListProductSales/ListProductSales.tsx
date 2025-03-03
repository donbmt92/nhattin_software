"use client";
import ListCard2 from '@/app/components/Card/ListCard2/ListCard2'
import React, { useEffect, useState } from 'react'
import api from '../utils/api';

export default function ListProductSales() {
    const [product, setProduct] = useState<any[]>([]);
    const getListProduct = async () => {
        const productResponse = await api.get("/products/");
        setProduct(productResponse.data);
    };

    useEffect(() => {
        getListProduct();
    }, []);
    return (
        <div className="relative container mx-auto py-[50px]">
            <div>
                <h2 className="text-[30px] font-bold text-left mb-1">Sản phẩm bán chạy</h2>
                <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "40px", width: "150px" }}/>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 gap-6 mx-auto">
                <div className="col-span-4">
                    <ListCard2 products={product} />
                </div>
            </div>
        </div>
    )
}
