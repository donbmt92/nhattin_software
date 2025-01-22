import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import StandCard from '../StandCard/page';

export default function ListCard1() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imagesPerSlide, setImagesPerSlide] = useState(3);
    const comments = [
        { id:"1", title: "Mua Tài Khoản Nexflix Premium Mua Tài Khoản Nexflix Premium", tag: "Giải trí", sales: "12342", prices: "399.000", image: "/images/image1.png" },
        { id:"2", title: "Web Development", tag: "Giải trí ", sales: "12342", prices: "399.000", image: "/images/image1.png" },
        { id:"3", title: "Mobile App Design", tag: "Giải trí", sales: "12342", prices: "299.000", image: "/images/image3.png" },
        { id:"4", title: "Mobile App Design 2", tag: "Giải trí", sales: "12342", prices: "199.000", image: "/images/image4.png" },
        { id:"5", title: "Mobile App Design 3", tag: "Giải trí", sales: "12342", prices: "499.000", image: "/images/image1.png" },
    ];
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setImagesPerSlide(3); // md trở lên: 3 sản phẩm
            } else if (window.innerWidth >= 640) {
                setImagesPerSlide(2); // sm: 2 sản phẩm
            } else {
                setImagesPerSlide(1); // xs: 1 sản phẩm
            }
        };
        // Gọi hàm khi component được mount
        handleResize();

        // Lắng nghe sự kiện thay đổi kích thước
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Điều hướng slide trái
    const goToPrevSlide = () => {
        setCurrentSlide((prevIndex) =>
            prevIndex - 1 < 0 ? comments.length - 1 : prevIndex - 1
        );
    };
    // Điều hướng slide phải
    const goToNextSlide = () => {
        setCurrentSlide((prevIndex) => (prevIndex + 1) % comments.length);
    };

    // Tính toán các phần tử trong slide hiện tại
    const currentItems = Array(imagesPerSlide)
        .fill(null)
        .map((_, i) => comments[(currentSlide + i) % comments.length]);
    const getTransformValue = () => {
        return `translateX(-${currentSlide * (200 / imagesPerSlide)}%)`;
    };
    return (
        <div className="relative container mx-auto pb-[20px] overflow-hidden">
            <div
                className="flex flex-nowrap mx-auto"
                style={{
                    transform: getTransformValue(),
                }}
            >
                {comments.map((comment, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                            width: `${100 / imagesPerSlide}%`,
                        }}
                    >
                        <StandCard comments={[comment]} />
                    </div>
                ))}
            </div>
            {/* Nút điều hướng */}
            <button
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-l-full z-4" style={{ fontSize: "25px", backgroundColor: "var(--clr-bg)", color: "var(--clr-txt-1)", border: "1px solid var(--clr-bg-3)" }}
            >
                ❯
            </button>
        </div>
    )
}
