"use client";
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useCart } from '@/context/CartContext';

interface HeaderSectionsProps {
  comments: {
    id: string;
    title: string;
    tag: string;
    sales: string;
    prices: string;
    image: string;
  }[];
}

export default function HorizontalCard({ comments }: HeaderSectionsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (comment: HeaderSectionsProps['comments'][0]) => {
    addToCart({
      id: comment.id,
      title: comment.title,
      price: comment.prices,
      quantity: 1,
      image: comment.image
    });
  };

  return (
    <div className="flex">
      {comments.map((comment) => (
        <div key={comment.title} className="flex items-center justify-start text-left z-1" style={{ border: '1px solid var(--clr-txt-2)', backgroundColor: 'var(--clr-bg)', borderRadius: '5px', overflow: 'hidden', }}>
          <div style={{ flex: '5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', position: 'relative', }}>
            <p style={{ position: 'absolute', top: '5px', left: '5px', color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)', padding: '3px 10px', borderRadius: '5px', zIndex: 2, fontSize: '10px', }} >
              {comment.tag}
            </p>
            <a href="/product/1"><img src={comment.image} alt="Images" style={{ width: '100%', height: 'auto', borderRadius: '5px', objectFit: 'cover', zIndex: 1, cursor: 'pointer' }} /></a>          </div>
          <div style={{ flex: '7' }}>
            <div style={{ minHeight: '54px', display: 'flex', alignItems: 'center', }}>
              <p
                className="mb-3 font-semibold text-[20px] 2xl:text-[18px] xl:text-[20px] lg:text-[16px] md:text-[18px] sm:text-[25px] mt-1 px-2 max-w-[220px] sm:max-w-[350px]"
                style={{
                  color: "var(--clr-txt-1)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "25px",
                  textAlign: "left",
                  minWidth: "auto",
                }}
              >
                {comment.title}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center mx-1 mb-2">
                <p className="text-[14px] xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[16px] ml-[5px]" style={{ color: 'var(--clr-txt-1)' }}>
                  Đã Bán: {comment.sales}
                </p>
                <FontAwesomeIcon icon={faHeart} style={{ color: 'var(--clr-txt-1)', width: '12px', height: '12px' }} />
              </div>
            </div>
            <div className="flex justify-start items-end mb-2 mx-1 md:mb-3">
              <p className="text-[17px] 2xl:text-[16px] xl:text-[18px] lg:text-[14px] md:text-[16px] sm:text-[28px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                {comment.prices} Vnđ
              </p>
              <span className="text-[11px] 2xl:text-[11px] xl:text-[12px] lg:text-[10px] md:text-[12px] sm:text-[18px] mr-2 font-semibold mb-1" style={{ color: 'var(--clr-txt-1)', textDecoration: 'line-through' }}>
                {comment.prices} vnđ
              </span>
            </div>
            <div className="flex justify-center items-center mb-2">
              <button
                onClick={() => handleAddToCart(comment)}
                className='text-[16px] 2xl:text-[13px] xl:text-[14px] lg:text-[10px] md:text-[13px] sm:text-[25px] mr-2 font-semibold px-2 py-1'
                style={{ borderRadius: '5px', color: 'var(--clr-txt-2)', border: '1px solid var(--clr-bg-3)'}}>
                <FontAwesomeIcon icon={faCartShopping} style={{ marginRight: '5px' }} />
                Giỏ hàng
              </button>
              <button
                className='text-[16px] 2xl:text-[13px] xl:text-[14px] lg:text-[10px] md:text-[13px] sm:text-[25px] mr-2 font-semibold px-2 sm:px-4 py-1'
                style={{ borderRadius: '5px', color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)'}}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
