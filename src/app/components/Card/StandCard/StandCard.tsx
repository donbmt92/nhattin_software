"use client"
import React from 'react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { Product } from '@/app/profile/types';

export default function StandCard({ products }: { products: Product[] }) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      title: product.name,
      price: product.base_price,
      quantity: 1,
      image: product.image
    });
  };

    return (
        <div className="py-[100px]">
            {products.map((prd, index) => (
                <div
                    key={index}
                    className="relative mx-4 my-8 flex flex-col items-center text-center z-1 border border-[var(--clr-txt-2)] bg-[var(--clr-bg)] rounded-md shadow-lg"
                >
                    {/* Khung ảnh */}
                    <div className="relative w-full h-[140px] flex items-end justify-center">
                        <a href={`/product/${prd._id}`} className="block w-[90%]">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${prd.image}`}
                                alt="Product Image"
                                width={300}
                                height={300}
                                className="w-auto h-auto object-cover rounded-md"
                            />
                        </a>
                    </div>

                    {/* Khung nội dung */}
                    <div className="px-4 py-5 w-full flex flex-col items-start">
                        <p className="mb-1 font-semibold text-[20px] text-left w-full truncate"
                            style={{ color: "var(--clr-txt-1)", maxWidth: "100%", display: "block" }}>
                            {prd.name}
                        </p>
                        <div className="flex justify-between items-center mb-2 w-full">
                            <button className="border border-[var(--clr-bg-3)] rounded-md px-3 py-1 text-[11px] text-[var(--clr-txt-2)]">
                                {prd.id_category.name}
                            </button>
                            <div className="flex items-center">
                                <p className="text-[14px] mr-1 text-[var(--clr-txt-1)]">{prd.sales}</p>
                                <Image src="/images/icon/icon9.png" alt="Sales Icon" width={15} height={17} className="mt-1" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-[24px] font-semibold text-[var(--clr-txt-4)]">
                                {Number(prd.base_price).toLocaleString('vi-VN')} đ
                            </p>
                            <button onClick={() => handleAddToCart(prd)} className="cursor-pointer">
                                <Image src="/images/icon/icon10.png" alt="Add to Cart" width={25} height={25} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
