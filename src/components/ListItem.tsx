import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from "next/link";

const products = [
    {
        id: 1,
        name: 'Mua Tài khoản Netflix Premium',
        price: '10,000đ',
        type: 'Giải trí',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Spotify-2-300x300.png.webp',
    },
    {
        id: 2,
        name: 'Nâng cấp tài khoản Spotify Premium',
        price: '36,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Spotify-2-300x300.png.webp',
        discount: getRandomDiscount(),
        type: 'Giải trí',
    },
    {
        id: 3,
        name: 'Nâng cấp Youtube Premium chính chủ',
        price: '149,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Image-product-5-Youtube-300x300.png.webp',
        type: 'Giải trí',
    },
    {
        id: 4,
        name: 'Mua Canva - Trang web thiết kế đồ họa',
        price: '49,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        discount: getRandomDiscount(),
        type: 'Giải trí',
    },
    {
        id: 5,
        name: 'Mua Tài khoản Disney+ Premium',
        price: '120,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Image-product-5-Youtube-300x300.png.webp',
        type: 'Giải trí',
    },
    {
        id: 6,
        name: 'Tài khoản Grammarly Premium',
        price: '65,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        discount: getRandomDiscount(),
        type: 'Học tập',
    },
    {
        id: 7,
        name: 'Mua Microsoft Office 365',
        price: '99,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        type: 'Làm việc',
    },
    {
        id: 8,
        name: 'Nâng cấp LinkedIn Premium',
        price: '199,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Netflix-300x300.jpg.webp',
        discount: getRandomDiscount(),
        type: 'Làm việc',
    },
    {
        id: 9,
        name: 'Mua Apple Music Premium',
        price: '79,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Netflix-300x300.jpg.webp',
        type: 'Giải trí',
    },
    {
        id: 10,
        name: 'Mua Tidal HiFi Premium',
        price: '89,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        discount: getRandomDiscount(),
        type: 'Giải trí',
    },
    {
        id: 11,
        name: 'Mua Adobe Creative Cloud',
        price: '799,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Netflix-300x300.jpg.webp',
        type: 'Thiết kế đồ họa',
    },
    {
        id: 12,
        name: 'Nâng cấp Coursera Plus',
        price: '250,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        type: 'Học tập',
    },
    {
        id: 13,
        name: 'Mua Kaspersky Anti-Virus',
        price: '180,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Spotify-2-300x300.png.webp',
        discount: getRandomDiscount(),
        type: 'Bảo mật',
    },
    {
        id: 14,
        name: 'Nâng cấp Codecademy Pro',
        price: '199,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        type: 'Học tập',
    },
    {
        id: 15,
        name: 'Mua Disney+ với gói HBO',
        price: '130,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
        type: 'Giải trí',
    },
    {
        id: 16,
        name: 'Mua DataCamp Premium',
        price: '289,000đ',
        imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Image-product-5-Youtube-300x300.png.webp',
        discount: getRandomDiscount(),
        type: 'Học tập',
    },
];

// Helper function to generate random discount values
function getRandomDiscount() {
    const discounts = ['-10%', '-20%', '-30%', '-40%', '-50%'];
    return discounts[Math.floor(Math.random() * discounts.length)];
}




export default function ListItem() {
    return (
        <div className="w-full flex justify-center bg-gray-100 p-4">
            <div className="w-full max-w-7xl">
                <h2 className="text-2xl font-bold mb-4 text-center">SẢN PHẨM BÁN CHẠY</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Phần hình ảnh bên trái */}
                            <div className="relative w-1/2">
                                <img
                                    src={product.imgSrc}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.discount && (
                                    <span  className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {product.discount}
                                    </span>
                                )}
                            </div>

                            {/* Phần thông tin bên phải */}
                            <div className="p-4 w-1/2 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        <Link href="/item" className="hover:text-blue-500">{product.name}</Link>

                                    </h3>
                                    <span className="text-xs text-gray-500">{product.type}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                                    <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
