"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [
        { src: "https://plus.unsplash.com/premium_photo-1675860538045-fe53a6cb75a8", title: "400GB" },
        { src: "https://images.unsplash.com/photo-1716285386261-8de02ca53ce9", title: "Adobe Creative Cloud 2024" },
        { src: "https://images.unsplash.com/photo-1716881139357-ddcb2f52940c", title: "Netflix EXTRA" },
        { src: "https://plus.unsplash.com/premium_photo-1675860538045-fe53a6cb75a8", title: "CapCut" },
        { src: "https://images.unsplash.com/photo-1716881139357-ddcb2f52940c", title: "Product 5" },
        { src: "https://images.unsplash.com/photo-1716285386261-8de02ca53ce9", title: "Product 6" }
    ];

    const imagesPerSlide = 4;
    const totalSlides = Math.ceil(images.length / imagesPerSlide);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    const goToSlide = (index: React.SetStateAction<number>) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
            <div className="relative h-48 md:h-64">
                <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="flex-none w-1/4 px-2">
                            <div className="h-full flex flex-col">
                                <Image
                                    src={image.src}
                                    alt={`Slide ${index + 1}`}
                                    width={300}
                                    height={225}
                                    className="object-cover w-full h-3/4 rounded-lg"
                                />
                                <p className="mt-2 text-center text-sm font-medium">{image.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={goToPrevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                ❮
            </button>
            <button
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                ❯
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(totalSlides)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                            currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
