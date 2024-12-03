import { icon } from '@fortawesome/fontawesome-svg-core'
import React from 'react'

export default function MenuHeader() {
    const navbars = [
        { name: "Trang Chủ", link: "/", icon: "../images/icon/icon21.png" },
        { name: "Sản Phẩm", link: "/", icon: "../images/icon/icon22.png" },
        { name: "Thủ Thuật & Tin Tức", link: "/", icon: "../images/icon/icon23.png" },
        { name: "Về Chúng Tôi", link: "/", icon: "../images/icon/icon24.png" },
    ]
    return (
        <div className="container mx-auto items-center justify-between grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 mt-[30px]">
            {navbars.map((item, index) => (
                <div key={index} className="flex items-center justify-center my-5">
                    <img src={item.icon} alt="" />
                    <a href={item.link} style={{ color: "var(--clr-txt-3)", fontSize: "18px", marginLeft: "20px", fontWeight: "bold" }}>{item.name}</a>
                </div>
            ))}
        </div>
    )
}
