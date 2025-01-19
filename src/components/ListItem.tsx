import React from 'react';
import Image from 'next/image';

// // const products = [
// //     {
// //         id: 1,
// //         name: 'Mua Tài khoản Netflix Premium',
// //         price: '10,000đ',
// //         type: 'Giải trí',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Spotify-2-300x300.png.webp',
// //     },
// //     {
// //         id: 2,
// //         name: 'Nâng cấp tài khoản Spotify Premium',
// //         price: '36,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Spotify-2-300x300.png.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 3,
// //         name: 'Nâng cấp Youtube Premium chính chủ',
// //         price: '149,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Image-product-5-Youtube-300x300.png.webp',
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 4,
// //         name: 'Mua Canva - Trang web thiết kế đồ họa',
// //         price: '49,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 5,
// //         name: 'Mua Tài khoản Disney+ Premium',
// //         price: '120,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Image-product-5-Youtube-300x300.png.webp',
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 6,
// //         name: 'Tài khoản Grammarly Premium',
// //         price: '65,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Học tập',
// //     },
// //     {
// //         id: 7,
// //         name: 'Mua Microsoft Office 365',
// //         price: '99,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         type: 'Làm việc',
// //     },
// //     {
// //         id: 8,
// //         name: 'Nâng cấp LinkedIn Premium',
// //         price: '199,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Netflix-300x300.jpg.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Làm việc',
// //     },
// //     {
// //         id: 9,
// //         name: 'Mua Apple Music Premium',
// //         price: '79,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Netflix-300x300.jpg.webp',
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 10,
// //         name: 'Mua Tidal HiFi Premium',
// //         price: '89,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 11,
// //         name: 'Mua Adobe Creative Cloud',
// //         price: '799,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Netflix-300x300.jpg.webp',
// //         type: 'Thiết kế đồ họa',
// //     },
// //     {
// //         id: 12,
// //         name: 'Nâng cấp Coursera Plus',
// //         price: '250,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         type: 'Học tập',
// //     },
// //     {
// //         id: 13,
// //         name: 'Mua Kaspersky Anti-Virus',
// //         price: '180,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Spotify-2-300x300.png.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Bảo mật',
// //     },
// //     {
// //         id: 14,
// //         name: 'Nâng cấp Codecademy Pro',
// //         price: '199,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         type: 'Học tập',
// //     },
// //     {
// //         id: 15,
// //         name: 'Mua Disney+ với gói HBO',
// //         price: '130,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/04/Untitled-3-Canva-300x300.png.webp',
// //         type: 'Giải trí',
// //     },
// //     {
// //         id: 16,
// //         name: 'Mua DataCamp Premium',
// //         price: '289,000đ',
// //         imgSrc: 'https://gamikey.com/wp-content/uploads/2022/03/Image-product-5-Youtube-300x300.png.webp',
// //         discount: getRandomDiscount(),
// //         type: 'Học tập',
// //     },
// // ];

// // Helper function to generate random discount values
// function getRandomDiscount() {
//     const discounts = ['-10%', '-20%', '-30%', '-40%', '-50%'];
//     return discounts[Math.floor(Math.random() * discounts.length)];
// }

interface ListItemProps {
    image: string;
    title: string;
    description: string;
}

export default function ListItem({ image, title, description }: ListItemProps) {
    return (
        <div className="flex items-center space-x-4 p-4 hover:bg-gray-50">
            <div className="flex-shrink-0 w-16 h-16 relative">
                <Image
                    src={image}
                    alt={title}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                />
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}
