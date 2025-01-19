import Image from 'next/image'
import React from 'react'

export default function Policys() {
    const figures = [
        { name: "Giao hàng", title: "Gửi tài khoản qua email", img: "/images/icon/icon15.png" },
        { name: "Thời gian", title: "Gửi ngay lập tức", img: "/images/icon/icon16.png" },
        { name: "Bảo hành", title: "Trọn gói đăng ký",img: "/images/icon/icon17.png" },
    ]
    return (
        <div className="py-[50px] my-[100px]" style={{ backgroundColor: 'var(--clr-bg-1)' }}>
            <div className="container mx-auto" >
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-4">
                    {figures.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 px-[50px] py-[20px] items-center justify-center">
                             <div className="flex mx-auto justify-center items-center">
                                <Image src={item.img} alt="" width={100} height={100}/>
                            </div>
                            <div className=" col-span-2 w-full justify-start">
                                <h2 className="text-2xl font-bold mb-2 uppercase" style={{ color: "var(--clr-txt-1)"}}>{item.name}</h2>
                                <p className="text-md" style={{ color: "var(--clr-txt-1)"}}>{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
