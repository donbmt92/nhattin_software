"use client";
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/profile/types';;

export default function HorizontalCard({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  
  // Hàm lấy slug sản phẩm, fallback về ID nếu không có slug
  const getProductSlug = (product: Product) => {
    console.log(product);
    
    // Ưu tiên sử dụng slug nếu có
    if ((product as any).slug) {
      return (product as any).slug;
    }
    // Fallback về ID nếu không có slug
    if (typeof product._id === 'object' && product._id?.id) {
      return product._id.id;
    }
    return product._id;
  };
  
  return (
    <div className="flex">
      {products.map((prd, index) => (
        <div key={index} className="flex items-center justify-start text-left z-1" style={{ border: '1px solid var(--clr-txt-2)', backgroundColor: 'var(--clr-bg)', borderRadius: '5px', overflow: 'hidden', }}>
          <div style={{ flex: '5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', position: 'relative', }}>
            <p className='text-[10px] lg:text-[10px] md:text-[10px] sm:text-[14px]' style={{ position: 'absolute', top: '5px', left: '5px', color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)', padding: '3px 10px', borderRadius: '5px', zIndex: 2 }} >
              {prd.id_category.name}
            </p>
            <Link href={`/product/${getProductSlug(prd)}`}>
              <Image
                src={prd.image}
                alt="Product Image"
                width={300}
                height={200}
                style={{ width: '100%', height: 'auto', borderRadius: '5px', objectFit: 'cover' }}
              />
            </Link>
          </div>
          <div style={{ flex: '7' }}>
            <div  className="md:min-h-[66px] sm:min-h-[100px] leading-[22px] 2xl:leading-[20px] sm:leading-[30px]" style={{ display: 'flex', alignItems: 'center', }}>
              <p className="mb-1 font-semibold 2xl:text-[15px] xl:text-[20px] md:text-[18px] sm:text-[23px] text-[14px] mt-1 mx-1" style={{ color: 'var(--clr-txt-1)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', }}>
                {prd.name}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center mx-1">
                <p className="text-[11px] 2xl:text-[11px] xl:text-[14px] lg:text-[16px] sm:text-[20px] mr-2" style={{ color: 'var(--clr-txt-1)' }}>
                  Đã Bán: {prd.sales}
                </p>
                <FontAwesomeIcon icon={faHeart} style={{ color: 'var(--clr-txt-1)', width: '12px', height: '12px' }} />
              </div>
            </div>
            <div className="flex justify-start items-end mb-2 mx-1">
              <p className="2xl:text-[14px] xl:text-[16px] lg:text-[20px] md:text-[14px] sm:text-[22px] text-[14px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                {Number(prd.base_price).toLocaleString('vi-VN')} Vnđ
              </p>
              <span className="2xl:text-[9px] xl:text-[10px] lg:text-[12px] md:text-[8px] sm:text-[16px] text-[8px] mr-2 font-semibold mb-1" style={{ color: 'var(--clr-txt-1)', textDecoration: 'line-through' }}>
                {Number(prd.base_price).toLocaleString('vi-VN')} vnđ
              </span>
            </div>
            <div className="flex justify-center items-center mb-2">
              <button
                onClick={() => addToCart(prd)}
                className='2xl:text-[11px] xl:text-[15px] lg:text-[18px] md:text-[12px] sm:text-[20px] text-[12px]'
                style={{ borderRadius: '5px', padding: '5px 5px', color: 'var(--clr-txt-2)', border: '1px solid var(--clr-bg-3)', fontWeight: 'bold', marginRight: '5px' }}>
                <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                Giỏ hàng
              </button>
              <button
                className='2xl:text-[11px] xl:text-[15px]  lg:text-[18px] md:text-[12px] sm:text-[20px] text-[12px]'
                style={{ borderRadius: '5px', padding: '5px 10px', color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)', fontWeight: 'bold' }}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
