import { useState } from 'react';
import HorizontalCard from '../HorizontalCard/page';

export default function ListCard2() {
    const [currentIndex, setCurrentIndex] = useState(0); // Chỉ mục của thẻ hiện tại
    const [itemsPerPage, setItemsPerPage] = useState(8); // Mỗi lần hiển thị 8 thẻ (2 hàng x 4 cột)

    const comments = [
        { title: 'Mua Tài Khoản Nexflix Premium 1', tag: 'Giải trí', sales: '12342', prices: '399.000' },
        { title: 'Web Development 2', tag: 'Lorem ipsum', sales: '12342', prices: '399.000' },
        { title: 'Mobile App Design 3', tag: 'Lorem ipsum', sales: '12342', prices: '399.000' },
        { title: 'Graphic Design 4', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'SEO Optimization 5', tag: 'Marketing', sales: '12342', prices: '399.000' },
        { title: 'Digital Marketing 6', tag: 'Business', sales: '12342', prices: '399.000' },
        { title: 'UX/UI Design 7', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'Graphic Design 8', tag: 'Design', sales: '12342', prices: '399.000' },
        { title: 'SEO Optimizationv 9', tag: 'Marketing', sales: '12342', prices: '399.000' },
        { title: 'Digital Marketing 10', tag: 'Business', sales: '12342', prices: '399.000' },
        { title: 'UX/UI Design 11', tag: 'Design', sales: '12342', prices: '399.000' },
    ];

    // Điều hướng đến thẻ trước
    const goToPrevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? comments.length - 1 : prevIndex - 1));
    };

    // Điều hướng đến thẻ tiếp theo
    const goToNextCard = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex >= Math.ceil(comments.length / itemsPerPage) ? 0 : nextIndex;
        });
    };

    // Lấy các thẻ cần hiển thị dựa trên chỉ mục hiện tại
    const getDisplayedComments = () => {
        const startIndex = currentIndex * itemsPerPage;
        return comments.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <div className="relative container mx-auto pb-[20px] overflow-hidden">
            {/* Vùng hiển thị các card */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                {getDisplayedComments().map((comment, index) => (
                    <div key={index} className="flex-shrink-0">
                        <HorizontalCard comments={[comment]} />
                    </div>
                ))}
            </div>

            {/* Nút điều hướng */}
            {comments.length > itemsPerPage && (
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
