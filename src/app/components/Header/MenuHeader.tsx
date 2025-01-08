import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MenuHeader() {
    const navbars = [
        { name: "Trang Chủ", link: "/", icon: "/images/icon/icon21.png" },
        { name: "Sản Phẩm", link: "/products", icon: "/images/icon/icon22.png" },
        { name: "Thủ Thuật & Tin Tức", link: "/news", icon: "/images/icon/icon23.png" },
        { name: "Về Chúng Tôi", link: "/about", icon: "/images/icon/icon24.png" },
    ]
    
    return (
        <div className="container mx-auto items-center justify-between grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 mt-[30px]">
            {navbars.map((item, index) => (
                <div key={index} className="flex items-center justify-center my-5">
                    <Image src={item.icon} alt={item.name} width={24} height={24} />
                    <Link 
                        href={item.link} 
                        className="text-[var(--clr-txt-3)] text-lg ml-5 font-bold"
                    >
                        {item.name}
                    </Link>
                </div>
            ))}
        </div>
    )
}
