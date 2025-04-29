"use client";
import { faRightToBracket, faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartPopup from '../Cart/CartPopup';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function TopHeader() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, totalItems, toggleCart } = useCart();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 300);
    };
    const logout = () => {
        localStorage.removeItem('nhattin_token');
        localStorage.removeItem('nhattin_user');
        window.location.reload()
    }

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

    return (
        <>
            <div className="container mx-auto items-center justify-between grid grid-cols-12">
                <div className="flex items-center justify-center col-span-3 mx-4 w-full">
                    <Link href="/" className="flex items-center w-full">
                        <Image
                            src="/images/icon/logo.svg"
                            alt="Nhất Tín Marketing"
                            width={100}
                            height={100}
                            className="mr-2"
                            style={{ objectFit: 'contain' }}
                        />
                        <h2 className="text-base font-semibold hidden md:block text-white">Nhattin Software</h2>
                    </Link>
                </div>
                <div className="flex-grow mx-4 col-span-4 lg:col-span-5 flex justify-center items-center">
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
                    <form onSubmit={handleSearch} className="hidden lg:block relative bg-white rounded-md w-full max-w-3xl">
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
                <div className="flex justify-end items-center space-x-4 text-sm col-span-4 lg:col-span-4 mx-4">
                    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
                        <div
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <DropdownMenu.Trigger asChild>
                                <div className="flex items-center cursor-pointer mb-2">
                                    <Image src="/images/icon/icon19.png" alt="Account" width={24} height={24} />
                                    <div className="text-left mx-3 hidden md:block" style={{ color: "var(--clr-txt-3)" }}>
                                        <p className="text-xs ">{user ? "Xin chào" : ""}</p>
                                        <p className="text-md font-semibold cursor-pointer" onClick={() => { if (!user) window.location.href = "/login"; }}>{user?.fullName || "Đăng nhập"}</p>
                                    </div>
                                </div>
                            </DropdownMenu.Trigger>
                            {user && (
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        className="w-50 bg-white shadow-md rounded-md border p-1 mt-3"
                                        side="bottom"
                                        align="start"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded-md">
                                            <Link href="/profile">
                                                <FontAwesomeIcon icon={faUserCircle} className="mr-2" /> Thông tin cá nhân
                                            </Link>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded-md">
                                            <Link href="/" onClick={logout}>
                                                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" /> Đăng xuất
                                            </Link>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            )}
                        </div>
                    </DropdownMenu.Root>
                    <button
                        onClick={toggleCart}
                        style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-txt-3)' }}
                    >
                        <Image src="/images/icon/icon20.png" alt="Cart" width={24} height={24} className='mb-2' />
                        <div className="text-left mx-3 hidden md:block">
                            <p className="text-xs">Giỏ hàng</p>
                            <p className="text-md font-semibold">{totalItems}</p>
                        </div>
                    </button>
                </div>
            </div >
            <CartPopup />
        </>
    )
}
