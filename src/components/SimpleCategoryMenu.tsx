import React, {useState} from 'react';
import Link from 'next/link';
import {ChevronDown, ChevronUp, X} from 'lucide-react';

const SimpleCategoryMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const categories = [
        {name: 'Giải trí', items: ['Xem phim', 'Nghe nhạc']},
        {name: 'Học tập', items: ['Học Tiếng Anh', 'Khóa học']},
        {name: 'Làm việc', items: ['Thiết kế đồ họa']},
        {name: 'Bảo mật', items: ['Diệt Virus']},
        {name: 'Sức khỏe', items: []},
        {name: 'Game', items: []}
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

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="flex items-center justify-between px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
                <span className="font-bold">Danh mục</span>
                {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-8 w-[800px] max-w-full text-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Danh mục</h2>
                            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-300">
                                <X size={24}/>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            {/* Categories Section */}
                            <div>
                                <h3 className="text-purple-400 font-semibold mb-4">Danh mục</h3>
                                <div className="space-y-2">
                                    {categories.map((category, index) => (
                                        <div key={index} className="group">
                                            <Link
                                                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="block py-1 hover:text-orange-400 transition-colors"
                                                onClick={toggleMenu}
                                            >
                                                {category.name}
                                            </Link>
                                            {category.items.length > 0 && (
                                                <div className="pl-4 mt-1 space-y-1">
                                                    {category.items.map((item, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="block text-sm text-gray-400 hover:text-orange-400 transition-colors"
                                                            onClick={toggleMenu}
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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
                                            onClick={toggleMenu}
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
                                            onClick={toggleMenu}
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
                                    onClick={toggleMenu}
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
            )}
        </div>
    );
};

export default SimpleCategoryMenu;
