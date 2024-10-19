import React from 'react';
import {Search, ShoppingCart} from 'lucide-react';
import {FaGoogle, FaMicrosoft, FaSpotify, FaGamepad, FaShieldAlt, FaBrain} from 'react-icons/fa';
import Link from "next/link";
import SimpleCategoryMenu from "@/components/SimpleCategoryMenu";

const categories = [
    {name: 'Netflix', icon: <FaGoogle className="text-red-500"/>},
    {name: 'Adobe', icon: <FaGoogle className="text-yellow-500"/>},
    {name: 'Google', icon: <FaGoogle className="text-blue-500"/>},
    {name: 'Microsoft', icon: <FaMicrosoft className="text-purple-500"/>},
    {name: 'Spotify', icon: <FaSpotify className="text-green-500"/>},
    {name: 'Canva', icon: <FaGoogle className="text-cyan-500"/>},
    {name: 'AI', icon: <FaBrain className="text-pink-500"/>},
    {name: 'Bảo mật', icon: <FaShieldAlt className="text-gray-500"/>},

];
const cate = ['Giải trí', 'Học tập', 'Làm việc', 'Bảo mật', 'Sức khoẻ', 'Game'];
const brands = ['Adobe', 'Autodesk', 'Google', 'Netflix', 'Grammarly', 'Disney', 'Discord', 'Apple', 'Microsoft', 'Kaspersky', 'Spotify', 'Tidal', 'HBO'];
const popularSearches = ['Spotify Premium', 'Netflix Premium', 'Youtube Premium', 'Coursera Plus', 'O’Reilly Learning', 'Linkedin Premium', 'Datacamp Premium', 'Codecademy Pro'];


const NavigationBar = () => {

    return (
            <div className="bg-blue-500 text-white p-4">
                <nav >
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-white font-bold text-2xl">Nhattin</Link>
                        </div>

                        <div className="flex-grow mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nhập nội dung cần tìm..."
                                    className="w-full bg-white rounded-full py-2 px-4 text-white focus:outline-none"
                                />
                                <Search className="absolute right-3 top-2 text-gray-400"/>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                            <button className="text-white hover:text-orange-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"
                                     fill="none"
                                     className="mr-2">
                                    <path d="M10.835 10.314C12.1585..." fill="#4A53B5"/>
                                    <path d="M19.2638 16.0589C19.2368..." fill="#4A53B5"/>
                                </svg>
                                Đăng nhập
                            </button>
                            <button className="text-white hover:text-orange-500 flex items-center">
                                <ShoppingCart className="w-5 h-5 ml-1"/>
                                Giỏ hàng
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="container mx-auto mt-4 flex flex-wrap gap-4 justify-start">
                    {/*<button*/}
                    {/*    className="bg-white text-blue-500 px-4 py-2 rounded-md flex items-center text-base shadow-sm">*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 22" fill="none">*/}
                    {/*        <path d="M2.76754 5.27334H18.3675..." fill="blue"/>*/}
                    {/*    </svg>*/}
                    {/*    <span className="ml-2">Danh mục</span>*/}
                    {/*</button>*/}
                    <SimpleCategoryMenu categories={cate} brands={brands} popularSearches={popularSearches} />
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md text-base shadow-sm"
                        >
                            {category.icon}
                            <span>{category.name}</span>
                        </button>
                ))}
            </div>
        </div>
    );
};

export default NavigationBar;
