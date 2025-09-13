"use client";
import { faRightToBracket, faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
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
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
            <div className={`${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''} transition-all duration-300`} 
                 style={{ backgroundColor:  'var(--clr-bg-4)' }}>
                <div className="container mx-auto items-center justify-between flex flex-row md:grid md:grid-cols-11 gap-1 md:gap-0 px-4 py-2 md:py-0">
                    {/* Logo + Search - Mobile Grouped */}
                    <div className="flex items-center gap-2 md:col-span-2 md:mx-4">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/icon/logo.svg"
                                alt="Nhất Tín Marketing"
                                width={80}
                                height={80}
                                className="md:w-[150px] md:h-[150px]"
                                style={{ objectFit: 'contain' }}
                            />
                        </Link>
                        {/* Mobile Search Button - Sát logo */}
                        <button
                            className="md:hidden px-2 py-1 cursor-pointer rounded-md"
                            style={{ color: 'var(--clr-txt-3)' }}
                            onClick={toggleSearchPopup}
                        >
                            <FontAwesomeIcon icon={faSearch} style={{ width: '16px', height: '16px' }} />
                        </button>
                    </div>
                    
                    {/* Search - Desktop Full */}
                    <div className="hidden md:flex md:col-span-6 mx-4 justify-center items-center">
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
                    {/* User & Cart - Mobile Compact */}
                    <div className="flex md:justify-end justify-end items-center space-x-3 md:space-x-8 text-sm md:col-span-3 md:mx-4">
                        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
                            <div
                                className="relative hover:border hover:border-white hover:rounded-md p-2 hover:p-1 transition-all duration-200"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <DropdownMenu.Trigger asChild>
                                    <div className="flex items-center cursor-pointer">
                                        <Image src="/images/icon/icon19.png" alt="Account" width={20} height={20} className="md:w-6 md:h-6" />
                                        <div className="text-left mx-1 md:mx-3 hidden lg:block" style={{ color: "var(--clr-txt-3)" }}>
                                            <p className="text-xs ">{user ? "Xin chào" : ""}</p>
                                            <p className="text-sm md:text-md font-semibold cursor-pointer" onClick={() => { if (!user) window.location.href = "/login"; }}>{user?.fullName || "Đăng nhập"}</p>
                                        </div>
                                    </div>
                                </DropdownMenu.Trigger>
                                {user && (
                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="w-50 bg-white shadow-md rounded-md border p-1 mt-3 z-[9999]"
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
                            className="hover:border hover:border-white hover:rounded-md p-1 md:p-2 hover:p-1 transition-all duration-200 relative"
                            style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-txt-3)' }}
                        >
                            <Image src="/images/icon/icon20.png" alt="Cart" width={20} height={20} className="md:w-6 md:h-6" />
                            {/* Cart Badge */}
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                            <div className="text-left mx-1 md:mx-3 hidden lg:block">
                                <p className="text-xs">Giỏ hàng</p>
                                <p className="text-sm md:text-md font-semibold">{totalItems}</p>
                            </div>
                        </button>
                    </div>
                </div >
                <CartPopup />
            </div>
            
            {/* Mobile Search Popup - Outside main container */}
            {isPopupVisible && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center pt-20">
                    <div className="relative bg-white rounded-md w-full max-w-lg mx-auto pt-10 pb-4 px-4">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl md:text-3xl"
                            onClick={toggleSearchPopup}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Nhập nội dung cần tìm..."
                                className="w-full py-3 px-3 mb-4 rounded-md text-sm md:text-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
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
        </>
    );
}
