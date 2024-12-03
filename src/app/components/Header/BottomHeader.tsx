import React from 'react'

export default function BottomHeader() {
    const categories = [
        { name: "Hợp Tác", link: "/", icon: "../images/icon/icon25.png" },
        { name: "Hướng dẫn mua hàng", link: "/", icon: "../images/icon/icon27.png" },
    ]
    return (
        <div className="container mx-auto items-center justify-between grid grid-cols-1 lg:grid-cols-5">
            <div className="flex items-center justify-center my-5 col-span-1 cursor-pointer">
                <img src="../images/icon/icon26.png" alt="" />
                <a style={{ color: "var(--clr-txt-1)", fontSize: "18px", marginLeft: "20px", fontWeight: "bold" }}>Danh mục</a>
            </div>
            <div className="flex col-span-4 lg:justify-end justify-center items-center space-x-10 mx-8">
                {categories.map((item, index) => (
                    <div key={index} className="flex items-center  my-5 ">
                        <img src={item.icon} alt="" />
                        <a
                            href={item.link}
                            style={{
                                color: "var(--clr-txt-1)",
                                fontSize: "18px",
                                marginLeft: "20px",
                                fontWeight: "bold",
                            }}
                        >
                            {item.name}
                        </a>
                    </div>
                ))}
            </div>

        </div>
    )
}
