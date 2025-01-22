"use client";
import ListCard3 from '@/app/components/Card/ListCard3/page';
import React from 'react'

export default function ListProductNews() {
    const category = ["Tất cả", "Sức khỏe", "Công việc", "Học tập", "Giải trí"];
    return (
        <div className="relative container mx-auto py-[50px] px-3">
           <div className="md:flex md:justify-between md:items-center mb-2">
                <div>
                    <h2 className="text-[30px] font-bold text-left mb-1">Sản phẩm mới</h2>
                    <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "40px", width: "140px" }} />
                </div>
                <div>
                    {category.map((item, index) => (
                        <button key={index} style={{ borderRadius: "5px", padding: "2px 10px", margin: "5px 5px", color: "var(--clr-txt-1)", border: "1px solid var(--clr-bg-3)", fontSize: "16px" }}>{item}</button>
                    ))}
                </div>

            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 gap-6 mx-auto">
                <div className="col-span-4">
                    <ListCard3 />
                </div>
            </div>
        </div>
    )
}
