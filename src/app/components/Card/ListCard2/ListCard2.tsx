"use client";

import { useEffect, useState } from 'react';
import HorizontalCard from '../HorizontalCard/HorizontalCard';
import { Product } from '@/app/profile/types';

export default function ListCard2({ products }: { products: Product[] }) {
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [itemsPerPage, setItemsPerPage] = useState(8);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280 && window.innerWidth <= 1535) {
                setItemsPerPage(6);
            } else {
                setItemsPerPage(8); // Các kích thước khác hiển thị 8 mục
            }
        };

        handleResize(); // Gọi ngay lần đầu
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Điều hướng đến thẻ trước
    // const goToPrevCard = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? comments.length - 1 : prevIndex - 1));
    // };

    // Điều hướng đến thẻ tiếp theo
    const goToNextCard = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex >= Math.ceil(products.length / itemsPerPage) ? 0 : nextIndex;
        });
    };

    // Lấy các thẻ cần hiển thị dựa trên chỉ mục hiện tại
    const getDisplayedProducts = () => {
        if (!Array.isArray(products)) return []; // Nếu không phải mảng, trả về mảng rỗng
        const startIndex = currentIndex * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <div className="relative container mx-auto pb-[20px] overflow-hidden">
            {/* Vùng hiển thị các card */}
            <div className="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 2xl:grid-rows-2 mx-auto gap-4">
                {(getDisplayedProducts() || []).map((prd, index) => (
                    <div key={index} className="flex-shrink-0">
                        <HorizontalCard products={[prd]} />
                    </div>
                ))}
            </div>

            {/* Nút điều hướng */}
            {products.length > itemsPerPage && (
                <>
                    {/* Nút điều hướng thẻ tiếp theo */}
                    <button
                        onClick={goToNextCard}
                        className="absolute right-[-7px] top-1/2 transform -translate-y-1/2 p-2 rounded-l-full z-4"
                        style={{
                            fontSize: '25px',
                            backgroundColor: 'var(--clr-bg)',
                            color: 'var(--clr-txt-1)',
                            border: '1px solid var(--clr-bg-3)',
                        }}
                    >
                        ❯
                    </button>
                </>
            )}
        </div>
    );
}
