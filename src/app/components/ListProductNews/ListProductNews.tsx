"use client";
import ListCard3 from '@/app/components/Card/ListCard3/ListCard3';
import React, { useEffect, useState } from 'react'
import api from '../utils/api';
import { Category, Product } from '@/app/profile/types';


export default function ListProductNews() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const getListCategories = async () => {
        try {
            const categoryResponse = await api.get("/categories/");
            if (Array.isArray(categoryResponse.data)) {
                setCategories(categoryResponse.data);
            } else {
                console.error("API trả về không phải là mảng:", categoryResponse.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
            setCategories([]);
        }
    };

    const getListProducts = async () => {
        try {
            const productResponse = await api.get("/products/");
            if (Array.isArray(productResponse.data)) {
                setProducts(productResponse.data);
            } else {
                console.error("API trả về không phải là mảng:", productResponse.data);
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
        }
    };

    useEffect(() => {
        getListCategories();
        getListProducts();
    }, []);

    // Lọc ra danh mục có sản phẩm
    const categoriesWithProducts = categories.filter(category =>
        products.some(product => product.id_category._id === category._id)
    ).slice(0, 4);

    // Hàm xử lý khi click vào button category
    const handleCategoryClick = (categoryId: string | null) => {
        setSelectedCategoryId(categoryId);
    };
    // Lọc sản phẩm theo category được chọn
    const filteredProducts = selectedCategoryId
        ? products.filter(product => product.id_category._id === selectedCategoryId)
        : products;
    return (
        <div className="relative container mx-auto py-[50px]">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2 my-4">
                <div>
                    <h2 className="text-[30px] font-bold text-left mb-1">Sản phẩm mới</h2>
                    <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "40px", width: "140px" }} />
                </div>
                <div className='my-4'>
                    <button onClick={() => handleCategoryClick(null)} style={{ borderRadius: "5px", padding: "2px 10px", margin: "0px 5px", color: "var(--clr-txt-1)", border: "1px solid var(--clr-bg-3)", fontSize: "16px" }}>Tất cả</button>
                    {categoriesWithProducts.map((item) => (
                        <button key={item._id}
                            onClick={() => handleCategoryClick(item._id)}
                            style={{ borderRadius: "5px", padding: "2px 10px", margin: "0px 5px", color: "var(--clr-txt-1)", border: "1px solid var(--clr-bg-3)", fontSize: "16px" }}>
                            {item.name}
                        </button>
                    ))}
                </div>

            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 gap-6 mx-auto">
                <div className="col-span-4">
                    <ListCard3 products={filteredProducts} />
                </div>
            </div>
        </div>
    )
}
