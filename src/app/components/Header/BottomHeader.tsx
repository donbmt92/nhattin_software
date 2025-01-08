import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BottomHeader() {
    const categories = [
        { name: "Hợp Tác", link: "/cooperation", icon: "/images/icon/icon25.png" },
        { name: "Hướng dẫn mua hàng", link: "/guide", icon: "/images/icon/icon27.png" },
    ]
    
    return (
        <div className="container mx-auto items-center justify-between grid grid-cols-1 lg:grid-cols-5">
            <div className="flex items-center justify-center my-5 col-span-1 cursor-pointer">
                <Image src="/images/icon/icon26.png" alt="Categories" width={24} height={24} />
                <span className="text-[var(--clr-txt-1)] text-lg ml-5 font-bold">
                    Danh mục
                </span>
            </div>
            <div className="flex col-span-4 lg:justify-end justify-center items-center space-x-10 mx-8">
                {categories.map((item, index) => (
                    <div key={index} className="flex items-center my-5">
                        <Image src={item.icon} alt={item.name} width={24} height={24} />
                        <Link
                            href={item.link}
                            className="text-[var(--clr-txt-1)] text-lg ml-5 font-bold"
                        >
                            {item.name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
