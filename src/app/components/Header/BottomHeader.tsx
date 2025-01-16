"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BottomHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const categories = [
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
                <div className="flex col-span-4 lg:justify-end justify-center items-center space-x-10 mx-8">
                    {categories.map((item, index) => (
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

            {/* Popup Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Popup Content */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-[90%] max-w-5xl max-h-[80vh] overflow-y-auto">
                        {/* Close Button */}
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
                                {/* Categories Section */}
                                <div>
                                    <h3 className="font-bold text-xl mb-6 text-[var(--clr-txt-1)]">Danh mục</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <Link href="/category/giai-tri" className="block font-medium text-[var(--clr-txt-1)] hover:text-blue-600 mb-3">
                                                Giải trí
                                            </Link>
                                            <Link href="/category/giai-tri/xem-phim" className="block text-sm text-gray-600 hover:text-blue-600 mb-2">
                                                Xem phim
                                            </Link>
                                            <Link href="/category/giai-tri/nghe-nhac" className="block text-sm text-gray-600 hover:text-blue-600 mb-2">
                                                Nghe nhạc
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/category/hoc-tap" className="block font-medium text-[var(--clr-txt-1)] hover:text-blue-600 mb-3">
                                                Học tập
                                            </Link>
                                            <Link href="/category/hoc-tap/tieng-anh" className="block text-sm text-gray-600 hover:text-blue-600 mb-2">
                                                Học Tiếng Anh
                                            </Link>
                                            <Link href="/category/hoc-tap/khoa-hoc" className="block text-sm text-gray-600 hover:text-blue-600 mb-2">
                                                Khóa học
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/category/lam-viec" className="block font-medium text-[var(--clr-txt-1)] hover:text-blue-600 mb-3">
                                                Làm việc
                                            </Link>
                                            <Link href="/category/lam-viec/thiet-ke" className="block text-sm text-gray-600 hover:text-blue-600 mb-2">
                                                Thiết kế đồ họa
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/category/bao-mat" className="block font-medium text-[var(--clr-txt-1)] hover:text-blue-600 mb-3">
                                                Bảo mật
                                            </Link>
                                            <Link href="/category/bao-mat/diet-virus" className="block text-sm text-gray-600 hover:text-blue-600 mb-2">
                                                Diệt Virus
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/category/suc-khoe" className="block font-medium text-[var(--clr-txt-1)] hover:text-blue-600 mb-3">
                                                Sức khỏe
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/category/game" className="block font-medium text-[var(--clr-txt-1)] hover:text-blue-600 mb-3">
                                                Game
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Brands Section */}
                                <div>
                                    <h3 className="font-bold text-xl mb-6 text-[var(--clr-txt-1)]">Thương hiệu</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href="/brand/adobe" className="flex items-center space-x-3 hover:text-blue-600 mb-3">
                                            <Image src="/images/brands/adobe.png" alt="Adobe" width={24} height={24} />
                                            <span className="text-sm">Adobe</span>
                                        </Link>
                                        <Link href="/brand/microsoft" className="flex items-center space-x-3 hover:text-blue-600 mb-3">
                                            <Image src="/images/brands/microsoft.png" alt="Microsoft" width={24} height={24} />
                                            <span className="text-sm">Microsoft</span>
                                        </Link>
                                        <Link href="/brand/google" className="flex items-center space-x-3 hover:text-blue-600 mb-3">
                                            <Image src="/images/brands/google.png" alt="Google" width={24} height={24} />
                                            <span className="text-sm">Google</span>
                                        </Link>
                                        <Link href="/brand/netflix" className="flex items-center space-x-3 hover:text-blue-600 mb-3">
                                            <Image src="/images/brands/netflix.png" alt="Netflix" width={24} height={24} />
                                            <span className="text-sm">Netflix</span>
                                        </Link>
                                        <Link href="/brand/spotify" className="flex items-center space-x-3 hover:text-blue-600 mb-3">
                                            <Image src="/images/brands/spotify.png" alt="Spotify" width={24} height={24} />
                                            <span className="text-sm">Spotify</span>
                                        </Link>
                                        <Link href="/brand/kaspersky" className="flex items-center space-x-3 hover:text-blue-600 mb-3">
                                            <Image src="/images/brands/kaspersky.png" alt="Kaspersky" width={24} height={24} />
                                            <span className="text-sm">Kaspersky</span>
                                        </Link>
                                    </div>
                                    <Link href="/brands" className="block text-sm text-blue-600 hover:underline mt-4">
                                        Xem tất cả thương hiệu →
                                    </Link>
                                </div>

                                {/* Premium Services Section */}
                                <div>
                                    <h3 className="font-bold text-xl mb-6 text-[var(--clr-txt-1)]">Tìm kiếm nhiều</h3>
                                    <div className="space-y-4">
                                        <Link href="/service/spotify-premium" className="flex items-center space-x-3 hover:text-blue-600">
                                            <Image src="/images/premium/spotify.png" alt="Spotify Premium" width={24} height={24} />
                                            <span className="text-sm">Spotify Premium</span>
                                        </Link>
                                        <Link href="/service/netflix-premium" className="flex items-center space-x-3 hover:text-blue-600">
                                            <Image src="/images/premium/netflix.png" alt="Netflix Premium" width={24} height={24} />
                                            <span className="text-sm">Netflix Premium</span>
                                        </Link>
                                        <Link href="/service/youtube-premium" className="flex items-center space-x-3 hover:text-blue-600">
                                            <Image src="/images/premium/youtube.png" alt="Youtube Premium" width={24} height={24} />
                                            <span className="text-sm">Youtube Premium</span>
                                        </Link>
                                        <Link href="/service/coursera-plus" className="flex items-center space-x-3 hover:text-blue-600">
                                            <Image src="/images/premium/coursera.png" alt="Coursera Plus" width={24} height={24} />
                                            <span className="text-sm">Coursera Plus</span>
                                        </Link>
                                        <Link href="/services" className="block text-sm text-blue-600 hover:underline mt-4">
                                            Xem tất cả →
                                        </Link>
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
