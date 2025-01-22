"use client";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartPopup from '../Cart/CartPopup';
import CategoryMenu from './CategoryMenu';
import { useRouter } from 'next/navigation';

export default function TopHeader() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { items, toggleCart } = useCart();
    const router = useRouter();

    const toggleSearchPopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsPopupVisible(false);
            setSearchQuery('');
        }
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <div className="container mx-auto items-center justify-between grid grid-cols-12">
                <div className="flex items-center lg:col-span-3 md:col-span-5 col-span-5 mx-4">
                    <Link href="/" className="text-white font-bold text-2xl flex items-center">
                        <Image
                            src="/images/icon/logo.svg"
                            alt="Nhất Tín Marketing"
                            width={120}
                            height={120}
                            className="mr-2"
                            style={{ objectFit: 'contain' }}
                        />
                        <div className=" flex-col hidden md:flex">
                            <span className="text-base font-semibold">Nhattin Software</span>
                        </div>
                    </Link>
                    <div className="ml-4 hidden lg:block">
                        <CategoryMenu />
                    </div>
                </div>
                <div className="flex-grow mx-4 col-span-2 lg:col-span-5">
                    {/* Mobile View: Icon */}
                    <div className="relative rounded-md lg:hidden">
                        <button
                            className="px-2 py-2 cursor-pointer rounded-md"
                            style={{ color: 'var(--clr-txt-3)' }}
                            onClick={toggleSearchPopup}
                        >
                            <FontAwesomeIcon icon={faSearch} style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>
                    {/* Popup for Search (Mobile) */}
                    {isPopupVisible && (
                        <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-50 z-50 p-4">
                            <div className="relative bg-white rounded-md w-full max-w-lg mx-auto pt-10 pb-4 px-4">
                                <button
                                    className="absolute top-0 right-2 text-gray-500 hover:text-gray-800 text-3xl"
                                    onClick={toggleSearchPopup}
                                >
                                    &times;
                                </button>
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Nhập nội dung cần tìm..."
                                        className="w-full py-3 px-3 mb-4 rounded-md text-md border border-gray-300"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-3 text-white font-semibold rounded-md"
                                        style={{ backgroundColor: 'var(--clr-bg-4)' }}
                                    >
                                        Tìm kiếm
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Desktop View: Full Search */}
                    <form onSubmit={handleSearch} className="hidden lg:block relative bg-white rounded-md">
                        <input
                            type="text"
                            placeholder="Nhập nội dung cần tìm..."
                            className="w-full py-3 px-3 pr-[130px] rounded-md text-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-[1px] top-[1px] px-5 py-[11px] cursor-pointer rounded-r-md text-md"
                            style={{ color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)' }}
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>
                <div className="flex justify-end items-center space-x-4 text-sm col-span-4 md:col-span-5 lg:col-span-4 mx-4">
                    <Link href="/profile" style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-txt-3)' }}>
                        <Image src="/images/icon/icon19.png" alt="Account" width={24} height={24} />
                        <div className="text-left mx-3">
                            <p className="text-xs hidden lg:block">Tài khoản</p>
                            <p className="text-md font-semibold hidden md:block">Nguyễn Quốc Duy</p>
                        </div>
                    </Link>
                    <button
                        onClick={toggleCart}
                        style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-txt-3)' }}
                    >
                        <Image src="/images/icon/icon20.png" alt="Cart" width={24} height={24} />
                        <div className="text-left mx-3">
                            <p className="text-xs hidden md:block">Giỏ hàng</p>
                            <p className="text-md font-semibold">{totalItems}</p>
                        </div>
                    </button>
                </div>
            </div>
            <CartPopup />
        </>
    )
}
