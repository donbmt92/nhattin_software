import Image from 'next/image';
import React from 'react'

export default function ListCategories() {
    const categories = [
        { icon: <Image src="/images/icon/icon1.png" alt="" width={50} height={50} />, label: 'Xem Phim' },
        { icon: <Image src="/images/icon/icon2.png" alt="" width={50} height={50} />, label: 'Thể Thao' },
        { icon: <Image src="/images/icon/icon3.png" alt="" width={50} height={50} />, label: 'Sức Khỏe' },
        { icon: <Image src="/images/icon/icon4.png" alt="" width={50} height={50} />, label: 'Công Việc' },
        { icon: <Image src="/images/icon/icon5.png" alt="" width={50} height={50} />, label: 'Thiết Kế' },
        { icon: <Image src="/images/icon/icon6.png" alt="" width={50} height={50} />, label: 'AI' },
        { icon: <Image src="/images/icon/icon7.png" alt="" width={50} height={50} />, label: 'Học Tập' },
        { icon: <Image src="/images/icon/icon8.png" alt="" width={50} height={50} />, label: 'Âm Nhạc' },
    ];
    return (
            <div className="container mx-auto flex justify-center items-center">
                <div className="grid grid-cols-2 lg:grid-cols-8 md:grid-cols-4 gap-12">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-center text-center"
                            style={{ height: "100%" }}
                        >
                            <div
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                {item.icon}
                            </div>
                            <p
                                className="text-sm font-semibold mt-2"
                                style={{ color: "var(--clr-txt-1)" }}
                            >
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
    )
}
