"use client";
import ListCard1 from "@/app/components/Card/ListCard1/ListCard1";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function ListProductTop() {
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
            <div className="grid grid-cols-1 xl:grid-cols-6 md:grid-cols-3  mx-auto">
                <div className="col-span-2 justify-center items-center hidden xl:flex mt-[-57px]">
                    <Image src="/images/banner1.png" alt="Images" style={{ width: "84%", objectFit: "cover", }} width={1000} height={100} />
                </div>
                <div className="col-span-4">
                    <ListCard1 products={product} />
                </div>

            </div>
        </div>
    );
}
