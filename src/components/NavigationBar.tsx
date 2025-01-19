'use client'

import Image from 'next/image'
import Link from 'next/link'
import {ShoppingCart, Menu, Users, Book, Home} from 'lucide-react'
import {useState} from 'react'

const NavigationLinks = [
    {href: '/', label: 'Trang Chủ', icon: <Home/>},
    {href: '/products', label: 'Sản Phẩm', icon: <Home/>},
    {href: '/news', label: 'Thủ Thuật & Tin Tức', icon: <Home/>},
    {href: '/about', label: 'Về Chúng Tôi', icon: <Home/>}
]

const BottomNavLinks = [
    {
        href: '/partnership',
        label: 'Hợp Tác',
        icon: <Users className="h-5 w-5"/>
    },
    {
        href: '/guide',
        label: 'Hướng dẫn mua hàng',
        icon: <Book className="h-5 w-5"/>
    }
]

// Category Menu Component
const CategoryMenu = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
    const categories = [
        "Giải trí",
        "Học tập",
        "Làm việc",
        "Bảo mật",
        "Sức khỏe",
        "Game",
        "Xem phim",
        "Nghe nhạc",
        "Thiết kế đồ họa",
        "Diệt Virus",
        "Học Tiếng Anh",
        "Khóa học"
    ];
    const brands = [
        {name: 'Adobe', icon: '🅰️'},
        {name: 'Apple', icon: '🍎'},
        {name: 'Autodesk', icon: '🏢'},
        {name: 'Microsoft', icon: '⊞'},
        {name: 'Google', icon: 'G'},
        {name: 'Kaspersky', icon: '🛡️'},
        {name: 'Netflix', icon: 'N'},
        {name: 'Spotify', icon: '🎵'},
        {name: 'Grammarly', icon: '✓'},
        {name: 'Tidal', icon: '♪'},
        {name: 'Disney', icon: '🏰'},
        {name: 'HBO', icon: '📺'},
        {name: 'Discord', icon: '💬'}
    ];

    const popularServices = [
        {name: 'Spotify Premium', icon: '🎵'},
        {name: 'Netflix Premium', icon: 'N'},
        {name: 'Youtube Premium', icon: '▶️'},
        {name: 'Coursera Plus', icon: '📚'},
        {name: "O'Reilly Learning", icon: '📖'},
        {name: 'LinkedIn Premium', icon: '💼'},
        {name: 'Datacamp Premium', icon: '📊'},
        {name: 'Codecademy Pro', icon: '💻'}
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 w-[800px] max-w-full text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Danh mục</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-300">

                    </button>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Categories Section */}
                    <div>
                        <h3 className="text-purple-400 font-semibold mb-4">Danh mục</h3>
                        <div className="flex flex-wrap -mx-4">
                            {categories.map((category, index) => (
                                <Link
                                    key={index}
                                    href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="w-1/2 py-1 px-4 hover:text-orange-400 transition-colors whitespace-nowrap"
                                    onClick={onClose}
                                >
                                    {category}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Brands Section */}
                    <div>
                        <h3 className="text-purple-400 font-semibold mb-4">Thương hiệu</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {brands.map((brand, index) => (
                                <Link
                                    key={index}
                                    href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center gap-2 py-1 hover:text-orange-400 transition-colors"
                                    onClick={onClose}
                                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded-sm text-sm">
                    {brand.icon}
                  </span>
                                    <span>{brand.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Popular Services Section */}
                    <div>
                        <h3 className="text-purple-400 font-semibold mb-4">Tìm kiếm nhiều</h3>
                        <div className="space-y-2">
                            {popularServices.map((service, index) => (
                                <Link
                                    key={index}
                                    href={`/service/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center gap-2 py-1 hover:text-orange-400 transition-colors"
                                    onClick={onClose}
                                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded-sm text-sm">
                    {service.icon}
                  </span>
                                    <span>{service.name}</span>
                                </Link>
                            ))}
                        </div>
                        <Link
                            href="/services"
                            className="block mt-4 text-orange-400 hover:underline"
                            onClick={onClose}
                        >
                            Xem tất cả &rarr;
                        </Link>
                    </div>
                </div>

                <div className="flex gap-2 mt-6 pt-6 border-t border-gray-800">
                    <button
                        className="px-4 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors">
                        UPGRADE
                    </button>
                    <button
                        className="px-4 py-1 text-sm border border-gray-600 text-gray-400 rounded hover:bg-gray-700 transition-colors">
                        ACCOUNT
                    </button>
                    <button
                        className="px-4 py-1 text-sm border border-gray-600 text-gray-400 rounded hover:bg-gray-700 transition-colors">
                        KEY ACTIVE
                    </button>
                </div>
            </div>
        </div>
    );
};

const NavigationBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const toggleCategoryMenu = () => setIsCategoryMenuOpen(!isCategoryMenuOpen)

    return (
        <nav className="flex flex-col">
            {/* Top Bar */}
            <div className="bg-[#4B84F7] px-4 py-3">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"  // Replace with actual logo path
                                alt="DreakTech"
                                width={40}
                                height={40}
                                className="h-10 w-10"
                            />
                            <span className="text-xl font-bold text-white">DreakTech</span>
                        </Link>

                        {/* Search */}
                        <div className="w-full flex-1 md:max-w-2xl md:w-auto">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full rounded-l-md border-0 px-4 py-2 text-gray-900 placeholder:text-gray-400"
                                />
                                <button
                                    className="rounded-r-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Account & Cart */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <Link href="/account" className="flex items-center gap-2 text-white hover:text-blue-100">
                                <Users className="h-6 w-6"/>
                                <div className="text-sm hidden md:block">
                                    <div>Login</div>
                                    <div>Account</div>
                                </div>
                            </Link>
                            <Link href="/cart" className="flex items-center gap-2 text-white hover:text-blue-100">
                                <ShoppingCart className="h-6 w-6"/>
                                <div className="text-sm hidden md:block">
                                    <div>Your cart</div>
                                    <div>20</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="bg-[#4B84F7] px-4 pb-3">
                <div className="mx-auto max-w-7xl">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-between">
                        {NavigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 text-white hover:text-blue-100 px-4"
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="md:hidden flex items-center justify-between">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white hover:text-blue-100"
                        >
                            <Menu className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden absolute left-0 right-0 bg-[#4B84F7] z-50">
                            {NavigationLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-4 py-2 text-white hover:bg-blue-600"
                                    onClick={toggleMobileMenu}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-white px-4 py-2">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between">
                        <button
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                            onClick={toggleCategoryMenu}
                        >
                            <Menu className="h-5 w-5"/>
                            Category
                        </button>
                        <div className="flex items-center gap-6">
                            {BottomNavLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Menu */}
            <CategoryMenu
                isOpen={isCategoryMenuOpen}
                onClose={() => setIsCategoryMenuOpen(false)}
            />
        </nav>
    )
}

export default NavigationBar
