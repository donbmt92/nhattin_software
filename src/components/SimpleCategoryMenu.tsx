"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import {ChevronDown, ChevronUp, X} from 'lucide-react';

const SimpleCategoryMenu = ({categories, brands, popularSearches}: {
    categories: any, brands: any, popularSearches: any
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={toggleMenu}
                className="flex items-center justify-between px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
                <span className="font-bold">Danh mục</span>
                {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-8 w-[600px] max-w-full text-white">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Danh mục</h2>
                            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-300">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* Categories Section */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <h3 className="text-purple-400 font-semibold mb-2">Danh mục</h3>
                                {categories.map((category: any, index: any) => (
                                    <Link
                                        key={index}
                                        href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block py-1 hover:text-orange-400 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        {category}
                                    </Link>
                                ))}
                            </div>

                            {/* Brands Section */}
                            <div>
                                <h3 className="text-purple-400 font-semibold mb-2">Thương hiệu</h3>
                                {brands.map((brand: string, index: number) => (
                                    <Link
                                        key={index}
                                        href={`/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block py-1 hover:text-orange-400 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        {brand}
                                    </Link>
                                ))}
                            </div>

                            {/* Popular Searches Section */}
                            <div>
                                <h3 className="text-purple-400 font-semibold mb-2">Tìm kiếm nhiều</h3>
                                {popularSearches.map((search: string, index: number) => (
                                    <Link
                                        key={index}
                                        href={`/search/${search.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block py-1 hover:text-orange-400 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        {search}
                                    </Link>
                                ))}
                                <Link
                                    href="/"
                                    className="block mt-2 text-orange-400 hover:underline"
                                    onClick={toggleMenu}
                                >
                                    Xem tất cả &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleCategoryMenu;
