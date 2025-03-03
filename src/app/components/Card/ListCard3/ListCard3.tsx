"use client";
import React, { useEffect, useState } from 'react';
import HorizontalCard from '../HorizontalCard/HorizontalCard';
import { Product } from '@/app/profile/types';

export default function ListCard3({ products }: { products: Product[] }) {
    const [itemsToShow, setItemsToShow] = useState(8);
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth >= 1280 && window.innerWidth <= 1535) {
                    setItemsToShow(6);
                } else {
                    setItemsToShow(8);
                }
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Tính tổng số phần tử có thể hiển thị
    const totalItems = products.length;

    // Tính toán các phần tử trong trang hiện tại
    const currentItems = products.slice(0, itemsToShow);

    // Hàm xử lý sự kiện "Xem thêm"
    const loadMoreItems = () => {
        setItemsToShow((prev) => Math.min(prev + 10, totalItems));
    };
    const collapseItems = () => {
        setItemsToShow(8);
    };

    return (
        <div className="relative container mx-auto pb-[20px]">
            <div className="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 2xl:grid-rows-2 gap-4 mx-auto">
                {currentItems.map((prd, index) => (
                    <div key={index}>
                        <HorizontalCard products={[prd]} />
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center">
                {itemsToShow < totalItems && (
                    <button
                        className="mt-4 px-10 py-3 rounded-2xl font-semibold"
                        onClick={loadMoreItems}
                        style={{ color: 'var(--clr-txt-1)', border: '1px solid var(--clr-bg-3)' }}
                    >
                        Xem thêm 10 sản phẩm
                    </button>
                )}
                &nbsp;
                {/* Nút Thu gọn */}
                {itemsToShow > 8 && (
                    <button
                        className="mt-4 px-10 py-3 rounded-2xl font-semibold"
                        onClick={collapseItems}
                        style={{ color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)' }}
                    >
                        Thu gọn danh sách
                    </button>
                )}
            </div>
        </div>

    );
}
