import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MenuHeader() {
    const navbars = [
        { name: "Trang Chủ", link: "/", icon: "/images/icon/icon21.png" },
        { name: "Sản Phẩm", link: "/search", icon: "/images/icon/icon22.png" },
        { name: "Thủ Thuật & Tin Tức", link: "/news", icon: "/images/icon/icon23.png" },
        { name: "Về Chúng Tôi", link: "/about", icon: "/images/icon/icon24.png" },
    ]

    return (
        <div className="container mx-auto md:mt-4 mt-0 px-4">
            <div className="grid grid-cols-4 gap-4">
                {navbars.map((item, index) => (
                    <div key={index} className="relative group flex justify-center">
                        <Link
                            href={item.link}
                            className="flex lg:flex-row flex-col items-center justify-center p-3 group"
                        >
                            <Image src={item.icon} alt={item.name} width={28} height={28} />
                            {/* Tooltip for mobile */}
                            <span className="absolute bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-10 md:hidden whitespace-nowrap">
                                {item.name}
                            </span>
                            {/* Text for desktop */}
                            <span className="hidden md:inline-block text-[var(--clr-txt-3)] xl:text-md text-sm xl:mt-0 mt-2 font-medium mx-4">
                                {item.name}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
