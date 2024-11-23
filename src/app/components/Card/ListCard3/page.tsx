import React, { useState } from 'react';
import StandCard from '../StandCard/page';
import HorizontalCard from '../HorizontalCard/page';

export default function ListCard3() {
    const [itemsToShow, setItemsToShow] = useState(8); 
    const comments = [
        { title: 'Mua Tài Khoản Nexflix Premium', tag: 'Giải trí', sales: '12342', prices: '399.000' },
        { title: 'Web Development', tag: 'Lorem ipsum', sales: '12342', prices: '399.000' },
        { title: 'Mobile App Design', tag: 'Lorem ipsum', sales: '12342', prices: '399.000' },
        { title: 'Graphic Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'SEO Optimization', tag: 'Marketing', sales: '12342', prices: '399.000' },
        { title: 'Digital Marketing', tag: 'Business', sales: '12342', prices: '399.000' },
        { title: 'UX/UI Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'Graphic Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'SEO Optimization', tag: 'Marketing', sales: '12342', prices: '399.000' },
        { title: 'Digital Marketing', tag: 'Business', sales: '12342', prices: '399.000' },
        { title: 'UX/UI Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'Mobile App Design', tag: 'Lorem ipsum', sales: '12342', prices: '399.000' },
        { title: 'Graphic Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'SEO Optimization', tag: 'Marketing', sales: '12342', prices: '399.000' },
        { title: 'Digital Marketing', tag: 'Business', sales: '12342', prices: '399.000' },
        { title: 'UX/UI Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'Graphic Design', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'SEO Optimization', tag: 'Marketing', sales: '12342', prices: '399.000' },
        { title: 'Digital Marketing', tag: 'Business', sales: '12342', prices: '399.000' },
        { title: 'UX/UI Design', tag: 'Design', sales: '12342', prices: '399.000' },
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
        setItemsToShow(8); // Thu gọn về 8 phần tử
    };

    return (
        <div className="relative container mx-auto pb-[20px]">
            <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 gap-6 mx-auto">
            {currentItems.map((comment) => (
                <HorizontalCard comments={[comment]} />
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
