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
            <a href="/product/1"><img src="images/image1.png" alt="Images" style={{ width: '100%', height: 'auto', borderRadius: '5px', objectFit: 'cover', zIndex: 1, cursor: 'pointer' }} /></a>          </div>
          <div style={{ flex: '7' }}>
            <div style={{ minHeight: '54px', display: 'flex', alignItems: 'center', }}>
              <p className="mb-1 font-semibold text-[18px] mt-1 mx-1" style={{ color: 'var(--clr-txt-1)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '22px', textAlign: 'left', }}>
                {comment.title}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center mx-1">
                <p className="text-[11px] mr-2" style={{ color: 'var(--clr-txt-1)' }}>
                  Đã Bán: {comment.sales}
                </p>
                <FontAwesomeIcon icon={faHeart} style={{ color: 'var(--clr-txt-1)', width: '12px', height: '12px' }} />
              </div>
            </div>
            <div className="flex justify-start items-end mb-2 mx-1">
              <p className="text-[16px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                {comment.prices} Vnđ
              </p>
              <span className="text-[12px] mr-2 font-semibold mb-1" style={{ color: 'var(--clr-txt-1)', textDecoration: 'line-through' }}>
                {comment.prices} vnđ
              </span>
            </div>
            <div className="flex justify-center items-center mb-2">
              <button
                onClick={() => handleAddToCart(comment)}
                style={{ borderRadius: '5px', padding: '5px 5px', color: 'var(--clr-txt-2)', border: '1px solid var(--clr-bg-3)', fontSize: '16px', fontWeight: 'bold', marginRight: '5px' }}>
                <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                Giỏ hàng
              </button>
              <button
                style={{ borderRadius: '5px', padding: '5px 10px', color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)', fontSize: '16px', fontWeight: 'bold' }}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
