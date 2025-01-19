import Image from 'next/image';
import React from 'react'

export default function ListCategories() {
    const categories = [
        { icon: <Image src="/images/icon/icon1.png" alt="" width={100} height={100} />, label: 'Xem Phim' },
        { icon: <Image src="/images/icon/icon2.png" alt="" width={100} height={100} />, label: 'Thể Thao' },
        { icon: <Image src="/images/icon/icon3.png" alt="" width={100} height={100} />, label: 'Sức Khỏe' },
        { icon: <Image src="/images/icon/icon4.png" alt="" width={100} height={100} />, label: 'Công Việc' },
        { icon: <Image src="/images/icon/icon5.png" alt="" width={100} height={100} />, label: 'Thiết Kế' },
        { icon: <Image src="/images/icon/icon6.png" alt="" width={100} height={100} />, label: 'AI' },
        { icon: <Image src="/images/icon/icon7.png" alt="" width={100} height={100} />, label: 'Học Tập' },
        { icon: <Image src="/images/icon/icon8.png" alt="" width={100} height={100} />, label: 'Âm Nhạc' },
    ];
    return (
        <div className="bg-gray-100 py-8">
            <div className="container mx-auto flex justify-center items-center">
                <div className="grid grid-cols-2 lg:grid-cols-8 md:grid-cols-4 gap-24">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-center text-center"
                            style={{ height: "100%" }}
                        >
                            <div
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                {item.icon}
                            </div>
                            <p
                                className="text-base font-semibold mt-3"
                                style={{ color: "var(--clr-txt-1)", fontSize: "16px" }}
                            >
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
