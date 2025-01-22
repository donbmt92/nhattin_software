"use client";
import React, { useEffect, useState } from 'react';
import HorizontalCard from '../HorizontalCard/page';

export default function ListCard3() {
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
    const comments = [
        { id: "1", title: 'Mua Tài Khoản Nexflix Premium 1', tag: 'Giải trí', sales: '12342', prices: '399.000', image: "/images/image1.png" },
        { id: "2", title: 'Web Development 2', tag: 'Lorem ipsum', sales: '12342', prices: '399.000', image: "/images/image2.png" },
        { id: "3", title: 'Mobile App Design 3', tag: 'Lorem ipsum', sales: '12342', prices: '399.000', image: "/images/image3.png" },
        { id: "4", title: 'Graphic Design 4', tag: 'Design', sales: '12342', prices: '399.000', image: "/images/image4.png" },
        { id: "5", title: 'SEO Optimization 5', tag: 'Marketing', sales: '12342', prices: '399.000', image: "/images/image2.png" },
        { id: "6", title: 'Digital Marketing 6', tag: 'Business', sales: '12342', prices: '399.000', image: "/images/image1.png" },
        { id: "7", title: 'UX/UI Design 7', tag: 'Design', sales: '12342', prices: '399.000', image: "/images/image2.png" },
        { id: "8", title: 'Graphic Design 8', tag: 'Design', sales: '12342', prices: '399.000', image: "/images/image3.png" },
        { id: "9", title: 'SEO Optimizationv 9', tag: 'Marketing', sales: '12342', prices: '399.000', image: "/images/image4.png" },
        { id: "10", title: 'Digital Marketing 10', tag: 'Business', sales: '12342', prices: '399.000', image: "/images/image2.png" },
        { id: "11", title: 'UX/UI Design 11', tag: 'Design', sales: '12342', prices: '399.000', image: "/images/image1.png" },
    ];

    // Tính tổng số phần tử có thể hiển thị
    const totalItems = comments.length;

    // Tính toán các phần tử trong trang hiện tại
    const currentItems = comments.slice(0, itemsToShow);

    // Hàm xử lý sự kiện "Xem thêm"
    const loadMoreItems = () => {
        setItemsToShow((prev) => Math.min(prev + 10, totalItems));
    };
    const collapseItems = () => {
        setItemsToShow(8);
    };

    return (
        <div className="relative container mx-auto pb-[20px]">
            <div className="grid grid-cols-1 2xl:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-rows-2 gap-4 mx-auto">
                {currentItems.map((comment) => (
                    <div key={comment.title}>
                        <HorizontalCard comments={[comment]} />
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
