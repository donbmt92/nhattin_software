"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
    { name: "Giải trí", icon: "/images/icon/icon1.png" },
    { name: "Xem phim", icon: "/images/icon/netflix.svg" },
    { name: "Nghe nhạc", icon: "/images/icon/spotify.svg" },
    { name: "Học tập", icon: "/images/icon/coursera.svg" },
    { name: "Học Tiếng Anh", icon: "/images/icon/icon3.png" },
    { name: "Khóa học", icon: "/images/icon/icon5.png" },
    { name: "Làm việc", icon: "/images/icon/microsoft.svg" },
    { name: "Thiết kế đồ họa", icon: "/images/icon/adobe.svg" },
    { name: "Bảo mật", icon: "/images/icon/kas.svg" },
    { name: "Diệt Virus", icon: "/images/icon/kas.svg" },
    { name: "Sức khỏe", icon: "/images/icon/icon7.png" },
    { name: "Game", icon: "/images/icon/icon1.png" }
];

const BRANDS = [
    { name: "Adobe", icon: "/images/icon/adobe.svg" },
    { name: "Microsoft", icon: "/images/icon/microsoft.svg" },
    { name: "Google", icon: "/images/icon/google.svg" },
    { name: "Netflix", icon: "/images/icon/netflix.svg" },
    { name: "Spotify", icon: "/images/icon/spotify.svg" },
    { name: "Kaspersky", icon: "/images/icon/kas.svg" }
];

const POPULAR_SERVICES = [
    { name: "Spotify Premium", icon: "/images/icon/spotify.svg", category: "Nghe nhạc" },
    { name: "Netflix Premium", icon: "/images/icon/netflix.svg", category: "Xem phim" },
    { name: "Youtube Premium", icon: "/images/icon/youtube.svg", category: "Giải trí" },
    { name: "Coursera Plus", icon: "/images/icon/coursera.svg", category: "Học tập" }
];

export default function BottomHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const headerLinks = [
        { name: "Hợp Tác", link: "/cooperation", icon: "/images/icon/icon25.png" },
        { name: "Hướng dẫn mua hàng", link: "/guide", icon: "/images/icon/icon27.png" },
    ];

    return (
        <div className="relative">
            <div className="container mx-auto items-center justify-between grid grid-cols-1 lg:grid-cols-5">
                <div
                    className="flex items-center justify-center my-5 col-span-1 cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Image src="/images/icon/icon26.png" alt="Categories" width={24} height={24} />
                    <span className="text-[var(--clr-txt-1)] text-lg ml-5 font-bold flex items-center">
                        Danh mục
                        <svg
                            className={`w-4 h-4 ml-2 transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </div>
                <div className="col-span-4 lg:justify-end justify-center items-center space-x-10 mx-8 hidden lg:flex">
                    {headerLinks.map((item, index) => (
                        <div key={index} className="flex items-center my-5">
                            <Image src={item.icon} alt={item.name} width={24} height={24} />
                            <Link
                                href={item.link}
                                className="text-[var(--clr-txt-1)] text-lg ml-5 font-bold"
                            >
                                {item.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-[90%] max-w-5xl max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="font-bold text-xl mb-6 text-[var(--clr-txt-1)]">Danh mục</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {CATEGORIES.map((category) => (
                                            <Link
                                                key={category.name}
                                                href={`/search?category=${encodeURIComponent(category.name)}`}
                                                className="flex items-center space-x-3 hover:text-blue-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Image src={category.icon} alt={category.name} width={24} height={24} />
                                                <span className="text-sm">{category.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-xl mb-6 text-[var(--clr-txt-1)]">Thương hiệu</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {BRANDS.map((brand) => (
                                            <Link
                                                key={brand.name}
                                                href={`/search?brand=${encodeURIComponent(brand.name)}`}
                                                className="flex items-center space-x-3 hover:text-blue-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Image src={brand.icon} alt={brand.name} width={24} height={24} />
                                                <span className="text-sm">{brand.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-xl mb-6 text-[var(--clr-txt-1)]">Tìm kiếm nhiều</h3>
                                    <div className="space-y-4">
                                        {POPULAR_SERVICES.map((service) => (
                                            <Link
                                                key={service.name}
                                                href={`/search?category=${encodeURIComponent(service.category)}`}
                                                className="flex items-center space-x-3 hover:text-blue-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Image src={service.icon} alt={service.name} width={24} height={24} />
                                                <span className="text-sm">{service.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
