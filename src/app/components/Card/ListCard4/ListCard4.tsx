"use client";
import React, { useEffect, useRef, useState } from 'react';
import StandCard from "../StandCard/StandCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { Product } from '@/app/profile/types';

export default function ListCard4({ products }: { products: Product[] }) {
    const sliderRef = useRef<Slider | null>(null);
    const [imagesPerSlide, setImagesPerSlide] = useState(4);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 978) {
                setImagesPerSlide(4); // LG: 4 sản phẩm
            } else if (window.innerWidth >= 645) {
                setImagesPerSlide(3); // MD: 3 sản phẩm
            } else if (window.innerWidth >= 480) {
                setImagesPerSlide(2); // SM: 2 sản phẩm
            } else {
                setImagesPerSlide(1); // XS: 1 sản phẩm
            }
        };
        // Gọi hàm khi component được mount
        handleResize();

        // Lắng nghe sự kiện thay đổi kích thước
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const settings = {
        // dots: true, // Hiển thị dấu chấm điều hướng
        // infinite: true, // Vòng lặp vô hạn
        speed: 500, // Tốc độ chuyển slide
        slidesToShow: imagesPerSlide, // Hiển thị 1 slide mỗi lần
        slidesToScroll: 1, // Cuộn 1 slide mỗi lần
        // autoplay: true, // Tự động chạy slide
        autoplaySpeed: 5000, // Thời gian chuyển đổi slide (ms)
        dotsClass: 'slick-dots custom-dots',
        arrows: false
    };
    const goToNextSlide = () => {
        sliderRef.current?.slickNext();
    };
    return (
        <div className="relative w-full">
            <Slider ref={sliderRef} {...settings}>
                {products.map((prd) => (
                    <div key={prd.id} className="px-2">
                        <StandCard products={[prd]} />
                    </div>
                ))}
            </Slider>

            {/* Nút điều hướng */}

            <button
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-l-full z-4" style={{ fontSize: "25px", backgroundColor: "var(--clr-bg)", color: "var(--clr-txt-1)", border: "1px solid var(--clr-bg-3)" }}
            >
                ❯
            </button>
        </div>
    );
}
