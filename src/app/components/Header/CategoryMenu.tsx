"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const categories = {
        "Giải trí": ["Xem phim", "Nghe nhạc"],
        "Học tập": ["Học Tiếng Anh", "Khóa học"],
        "Làm việc": ["Thiết kế đồ họa"],
        "Bảo mật": ["Diệt Virus"],
        "Sức khỏe": [],
        "Game": []
    };

    const brands = {
        "Thương hiệu": [
            { name: "Adobe", icon: "/images/brands/adobe.png" },
            { name: "Autodesk", icon: "/images/brands/autodesk.png" },
            { name: "Google", icon: "/images/brands/google.png" },
            { name: "Netflix", icon: "/images/brands/netflix.png" },
            { name: "Grammarly", icon: "/images/brands/grammarly.png" },
            { name: "Disney", icon: "/images/brands/disney.png" },
            { name: "Discord", icon: "/images/brands/discord.png" },
            { name: "Apple", icon: "/images/brands/apple.png" },
            { name: "Microsoft", icon: "/images/brands/microsoft.png" },
            { name: "Kaspersky", icon: "/images/brands/kaspersky.png" },
            { name: "Spotify", icon: "/images/brands/spotify.png" },
            { name: "Tidal", icon: "/images/brands/tidal.png" },
            { name: "HBO", icon: "/images/brands/hbo.png" }
        ]
    };

    const premiumServices = {
        "Tìm kiếm nhiều": [
            { name: "Spotify Premium", icon: "/images/premium/spotify.png" },
            { name: "Netflix Premium", icon: "/images/premium/netflix.png" },
            { name: "Youtube Premium", icon: "/images/premium/youtube.png" },
            { name: "Coursera Plus", icon: "/images/premium/coursera.png" },
            { name: "O'Reilly Learning", icon: "/images/premium/oreilly.png" },
            { name: "Linkedin Premium", icon: "/images/premium/linkedin.png" },
            { name: "Datacamp Premium", icon: "/images/premium/datacamp.png" },
            { name: "Codecademy Pro", icon: "/images/premium/codecademy.png" }
        ]
    };

    return (
        <div className="relative">
            {/* <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: 'var(--clr-txt-3)' }}
            >
                <span className="font-medium">Danh mục</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button> */}

            {isOpen && (
                <div className="absolute left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg z-50 grid grid-cols-3 gap-4 p-6">
                    {/* Categories Section */}
                    <div>
                        <h3 className="font-bold mb-4">Danh mục</h3>
                        <div className="space-y-2">
                            {Object.entries(categories).map(([category, subcategories]) => (
                                <div key={category}>
                                    <Link href={`/category/${category.toLowerCase()}`} className="block hover:text-blue-600 font-medium">
                                        {category}
                                    </Link>
                                    {subcategories.map((sub) => (
                                        <Link
                                            key={sub}
                                            href={`/category/${category.toLowerCase()}/${sub.toLowerCase()}`}
                                            className="block pl-4 text-sm text-gray-600 hover:text-blue-600"
                                        >
                                            {sub}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Brands Section */}
                    <div>
                        <h3 className="font-bold mb-4">Thương hiệu</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {brands["Thương hiệu"].map((brand) => (
                                <Link
                                    key={brand.name}
                                    href={`/brand/${brand.name.toLowerCase()}`}
                                    className="flex items-center space-x-2 hover:text-blue-600"
                                >
                                    <Image src={brand.icon} alt={brand.name} className="w-5 h-5" width={24} height={24} />
                                    <span className="text-sm">{brand.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Premium Services Section */}
                    <div>
                        <h3 className="font-bold mb-4">Tìm kiếm nhiều</h3>
                        <div className="space-y-2">
                            {premiumServices["Tìm kiếm nhiều"].map((service) => (
                                <Link
                                    key={service.name}
                                    href={`/service/${service.name.toLowerCase()}`}
                                    className="flex items-center space-x-2 hover:text-blue-600"
                                >
                                    <Image src={service.icon} alt={service.name} className="w-5 h-5" width={24} height={24} />
                                    <span className="text-sm">{service.name}</span>
                                </Link>
                            ))}
                            <Link href="/services" className="block text-sm text-blue-600 hover:underline mt-2">
                                Xem tất cả →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 