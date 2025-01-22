"use client";
import ListCard4 from '@/app/components/Card/ListCard4/page';
import React from 'react'

export default function ListProductSimilar() {
    return (
        <div className="relative container mx-auto pt-[100px] pb-[50px] px-3">
            <div>
                <h2 className="text-[30px] font-bold text-left mb-1">Sản phẩm tương tự</h2>
                <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "40px", width: "150px" }} />
            </div>
            <div>
                <ListCard4 />
            </div>
        </div>
    )
}
