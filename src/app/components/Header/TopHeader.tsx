"use client";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartPopup from '../Cart/CartPopup';
import CategoryMenu from './CategoryMenu';

export default function TopHeader() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const { items, toggleCart } = useCart();

    const toggleSearchPopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <div className="container mx-auto items-center justify-between grid grid-cols-12">
                <div className="flex items-center col-span-3 mx-4">
                    <Link href="/" className="text-white font-bold text-2xl flex items-center">
                        <Image
                            src="/images/icon/logo.jpg"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="mr-2"
                        />
                        Nhattin
                    </Link>
                    <div className="ml-4 hidden lg:block">
                        <CategoryMenu />
                    </div>
                </div>
                <div className="flex-grow mx-4 col-span-1 lg:col-span-5">
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
                                <input
                                    type="text"
                                    placeholder="Nhập nội dung cần tìm..."
                                    className="w-full py-3 px-3 mb-4 rounded-md text-md border border-gray-300"
                                />
                                <button
                                    className="w-full py-3 text-white font-semibold rounded-md"
                                    style={{ backgroundColor: 'var(--clr-bg-4)' }}
                                    onClick={toggleSearchPopup}
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Desktop View: Full Search */}
                    <div className="hidden lg:block relative bg-white rounded-md">
                        <input
                            type="text"
                            placeholder="Nhập nội dung cần tìm..."
                            className="w-full py-3 px-3 pr-[130px] rounded-md text-md"
                        />
                        <button
                            className="absolute right-[1px] top-[1px] px-5 py-[11px] cursor-pointer rounded-r-md text-md"
                            style={{ color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)' }}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="flex justify-end items-center space-x-4 text-sm col-span-8 lg:col-span-4 mx-4">
                    <button style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-txt-3)' }}>
                        <Image src="/images/icon/icon19.png" alt="Account" width={24} height={24} />
                        <div className="text-left mx-3">
                            <p className="text-xs">Tài khoản</p>
                            <p className="text-md font-semibold">Nguyễn Quốc Duy</p>
                        </div>
                    </button>
                    <button
                        onClick={toggleCart}
                        style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-txt-3)' }}
                    >
                        <Image src="/images/icon/icon20.png" alt="Cart" width={24} height={24} />
                        <div className="text-left mx-3">
                            <p className="text-xs">Giỏ hàng</p>
                            <p className="text-md font-semibold">{totalItems}</p>
                        </div>
                    </button>
                </div>
            </div>
            <CartPopup />
        </>
    )
}
