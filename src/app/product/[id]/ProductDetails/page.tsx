"use client";
import { faHeart, faMinus, faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

interface ProductDetailProps {
    data: {
        img: string;
        name: string;
        price: string;
        tag: string;
        sales: string;
        prices: string;
    };
}
export default function ProductDetail({ data }: ProductDetailProps) {
    const [selectedId, setSelectedId] = useState(0);
    const [selectedIdTH, setSelectedIdTH] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const buttons = [
        { id: 1, label: 'Premium' },
        { id: 2, label: 'ExTra' },
        { id: 3, label: 'Viet Nam' },
    ];
    const buttonsTH = [
        { id: 1, label: '01 Tháng' },
        { id: 2, label: '03 Tháng' },
        { id: 3, label: '06 Tháng' },
        { id: 4, label: '12 Tháng' },
        { id: 5, label: '1 Ngày' },
    ];

    // Hàm xử lý khi nhấn nút trừ
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Hàm xử lý khi nhấn nút cộng
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };
    return (
        <div className="container mx-auto my-6">
            <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-col-1">
                <div className='flex justify-center items-center md:col-span-5 px-3'>
                    <Image src="/images/image2.png" alt="" style={{ borderRadius: "10px", width: "100%" }} width={1000} height={100} />
                </div>
                <div className="md:col-span-1 mx-6"></div>
                <div className="md:col-span-6 mx-6">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: "30px" }}>
                            <p className="font-semibold text-[40px] " style={{ color: 'var(--clr-txt-1)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', alignItems: 'center' }}>
                                {data.name}
                            </p>
                            <p style={{ color: 'var(--clr-txt-2)', padding: '3px 20px', borderRadius: '5px', zIndex: 2, fontSize: '16px', margin: '0px 20px', border: '1px solid var(--clr-txt-2)' }}>
                                {data.tag}
                            </p>
                        </div>
                        <div className="flex justify-between items-center my-3">
                            <div className="flex items-center mx-1">
                                <div className="flex mr-3">
                                    <FontAwesomeIcon icon={faStar} style={{ color: 'var(--clr-txt-4)', width: '20px', height: '20px', marginTop: '2px' }} />
                                    <p className="text-[18px] mx-2" style={{ color: 'var(--clr-txt-1)' }}>
                                        5.0
                                    </p>

                                </div>
                                |
                                <div className="flex mx-2">
                                    <p
                                        className="text-[18px] mx-2"
                                        style={{ color: 'var(--clr-txt-1)' }}
                                    >
                                        <span
                                            style={{
                                                color: 'var(--clr-txt-4)',
                                                margin: '0px 5px',
                                                position: 'relative',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {data.sales}
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-3px',
                                                    left: '0',
                                                    right: '0',
                                                    height: '2px', 
                                                    backgroundColor: 'var(--clr-txt-4)',
                                                }}
                                            />
                                        </span>
                                        Đánh Giá
                                    </p>
                                </div>
                                |
                                <div className="flex mx-2">
                                    <p className="text-[18px] mx-2" style={{ color: 'var(--clr-txt-1)' }}>
                                        <span style={{ color: 'var(--clr-txt-4)', margin: '0px 5px' }}>{data.sales}</span> Đã Bán
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-start items-end my-2">
                            <p className="text-[35px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                                {data.prices} đ - {data.prices} đ
                            </p>
                        </div>
                        <div className=" justify-start items-end my-2">
                            <p className="text-[22px] mr-2 font-semibold my-3" style={{ color: 'var(--clr-txt-1)' }}>
                                Gói đăng ký:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0">
                                {buttons.map(btt => (
                                    <div key={btt.id} className="flex my-2 justify-center items-center">
                                        <button
                                            className="mx-3 rounded-full"
                                            onClick={() => setSelectedId(btt.id)} // Cập nhật ID nút được chọn
                                            style={{
                                                padding: '10px 10px',
                                                color: selectedId === btt.id ? 'var(--clr-txt-3)' : 'var(--clr-txt-2)',
                                                backgroundColor: selectedId === btt.id ? 'var(--clr-bg-4)' : 'var(--clr-bg)', // Đổi màu nền nếu được chọn
                                                fontSize: '16px',
                                                border: '1px solid var(--clr-bg-3)',
                                                fontWeight: 'bold',
                                                minWidth: '150px',
                                            }}
                                        >
                                            {btt.label}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className=" justify-start items-end my-2">
                            <p className="text-[22px] mr-2 font-semibold my-3" style={{ color: 'var(--clr-txt-1)' }}>
                                Thời hạn:
                            </p>
                            <div className="grid grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-0">
                                {buttonsTH.map(btt => (
                                    <div key={btt.id} className="flex my-3 justify-center items-center">
                                        <button
                                            className="mx-3 rounded-full"
                                            onClick={() => setSelectedIdTH(btt.id)} // Cập nhật ID nút được chọn
                                            style={{
                                                padding: '10px 10px',
                                                color: selectedIdTH === btt.id ? 'var(--clr-txt-3)' : 'var(--clr-txt-2)',
                                                backgroundColor: selectedIdTH === btt.id ? 'var(--clr-bg-4)' : 'var(--clr-bg)', // Đổi màu nền nếu được chọn
                                                fontSize: '16px',
                                                border: '1px solid var(--clr-bg-3)',
                                                fontWeight: 'bold',
                                                minWidth: '150px',
                                            }}
                                        >
                                            {btt.label}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2">
                            <div className="flex my-3 justify-center xl:justify-start items-center">
                                <p className="text-[22px] mr-6 font-semibold" style={{ color: 'var(--clr-txt-1)' }}>
                                    Số lượng:
                                </p>
                                <div className="flex mx-4">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="font-semibold rounded-l"
                                        style={{
                                            minWidth: '35px',
                                            minHeight: '35px',
                                            border: '1px solid var(--clr-bg-3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        disabled={quantity <= 1}
                                    >
                                        <FontAwesomeIcon icon={faMinus} style={{ color: 'var(--clr-txt-1)', width: '15px', height: '15px' }} />
                                    </button>
                                    <div
                                        className=" flex justify-center items-center"
                                        style={{
                                            minWidth: '70px',
                                            minHeight: '35px',
                                            fontSize: '20px',
                                            padding: '0px 20px',
                                            textAlign: 'center',
                                            border: '1px solid var(--clr-bg-3)'
                                        }}
                                    >
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={increaseQuantity}
                                        className="font-semibold rounded-r"
                                        style={{
                                            minWidth: '35px',
                                            minHeight: '35px',
                                            border: '1px solid var(--clr-bg-3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPlus} style={{ color: 'var(--clr-txt-1)', width: '15px', height: '15px' }} />
                                    </button>
                                </div>
                            </div>
                            <div className='flex my-3 justify-center items-center'>
                                <p className="text-[20px] mx-7" style={{ color: 'var(--clr-txt-1)' }}>
                                    <span style={{ color: 'var(--clr-txt-4)', margin: '0px 5px' }}>{data.sales}</span> Sản phẩm có sẵn
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-center items-center my-5">
                            <button className=" rounded-md"
                                style={{
                                    padding: '2px 60px',
                                    color: 'var(--clr-txt-2)',
                                    border: '1px solid var(--clr-bg-3)',
                                    fontSize: '18px',
                                    marginRight: '15px',
                                }}>
                                <div className="flex justify-center items-center mx-auto">
                                    <Image src="/images/icon/icon18.png" alt="" style={{ width: '25px', height: '25px', textAlign: 'center' }} width={1000} height={100} />
                                </div>
                                <div> Thêm vào giỏ</div>
                            </button>
                            &nbsp;
                            <button className=" rounded-md flex px-4"
                                style={{ padding: '15px 40px', color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-6)', fontSize: '18px' }}>
                               <Link href="/order">Mua ngay</Link> 
                            </button>
                        </div>
                        {/* <div className="flex justify-center items-center mb-2">
                            
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
