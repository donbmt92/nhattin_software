"use client";
import { Product, SubcriptionDurations, SubcriptionTypes } from '@/app/profile/types';
import { faMinus, faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function ProductDetail({
    products,
    subcriptionTypes,
    subcriptionDurations
}: {
    products: Product[];
    subcriptionTypes: SubcriptionTypes[];
    subcriptionDurations: SubcriptionDurations[];
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedIdTH, setSelectedIdTH] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    console.log(subcriptionTypes);

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
            {products.map((prd, index) => (
                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-col-1" key={index}>
                    <div className='flex justify-center items-center md:col-span-5'>
                        <Image src={`${prd.image}`} alt="" style={{ borderRadius: "10px", width: "100%" }} width={1000} height={100} />
                    </div>
                    <div className="md:col-span-1 mx-6"></div>
                    <div className="md:col-span-6 mx-6">

                        <div>
                            <div className="flex items-center mt-8">
                                {/* Tên sản phẩm chiếm 10 phần */}
                                <p className="font-semibold text-[40px] text-left text-ellipsis overflow-hidden"
                                    style={{ color: 'var(--clr-txt-1)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: '11' }}>
                                    {prd.name}
                                </p>

                                {/* Danh mục chiếm 2 phần */}
                                <p className="text-[16px] px-3 py-1 border rounded-md text-center"
                                    style={{ color: 'var(--clr-txt-2)', borderColor: 'var(--clr-txt-2)', flex: '1', minWidth: 'fit-content' }}>
                                    {prd.id_category.name}
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
                                                {prd.sales}
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
                                            <span style={{ color: 'var(--clr-txt-4)', margin: '0px 5px' }}>{prd.sales}</span> Đã Bán
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start items-end my-2">
                                <p className="text-[35px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                                    {Number(prd.base_price).toLocaleString('vi-VN')} đ -  {Number(prd.base_price).toLocaleString('vi-VN')} đ
                                </p>
                            </div>
                            <div className=" justify-start items-end my-2">
                                <p className="text-[22px] mr-2 font-semibold my-3" style={{ color: 'var(--clr-txt-1)' }}>
                                    Gói đăng ký:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0">
                                    {subcriptionTypes.map((subtype) => (
                                        <div key={subtype._id} className="flex my-2 justify-center items-center">
                                            <button
                                                className="mx-3 rounded-full"
                                                onClick={() => setSelectedId(subtype._id)}
                                                style={{
                                                    padding: "10px 10px",
                                                    color: selectedId === subtype._id ? "var(--clr-txt-3)" : "var(--clr-txt-2)",
                                                    backgroundColor: selectedId === subtype._id ? "var(--clr-bg-4)" : "var(--clr-bg)",
                                                    fontSize: "16px",
                                                    border: "1px solid var(--clr-bg-3)",
                                                    fontWeight: "bold",
                                                    minWidth: "150px",
                                                }}
                                            >
                                                {subtype.type_name}
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
                                    {subcriptionDurations.map((subduration) => (
                                        <div key={subduration._id} className="flex my-3 justify-center items-center">
                                            <button
                                                className="mx-3 rounded-full"
                                                onClick={() => setSelectedIdTH(subduration._id)}
                                                style={{
                                                    padding: '10px 10px',
                                                    color: selectedIdTH === (subduration._id) ? 'var(--clr-txt-3)' : 'var(--clr-txt-2)', // Chuyển id thành string khi so sánh
                                                    backgroundColor: selectedIdTH === (subduration._id) ? 'var(--clr-bg-4)' : 'var(--clr-bg)',
                                                    fontSize: '16px',
                                                    border: '1px solid var(--clr-bg-3)',
                                                    fontWeight: 'bold',
                                                    minWidth: '150px',
                                                }}
                                            >
                                                {subduration.duration}
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
                                        <span style={{ color: 'var(--clr-txt-4)', margin: '0px 5px' }}>{prd.sales}</span> Sản phẩm có sẵn
                                    </p>
                                </div>

                            </div>
                            <div className="flex justify-center items-center my-5">
                                <button className=" rounded-md px-[30px] md:px-[60px] py-[3px]"
                                    style={{
                                        color: 'var(--clr-txt-2)',
                                        border: '1px solid var(--clr-bg-3)',
                                        fontSize: '18px',
                                        marginRight: '15px',
                                    }}>
                                    <div className="flex justify-center items-center mx-auto">
                                        <Image src="/images/icon/icon18.png" alt="" style={{ width: '25px', height: '25px', textAlign: 'center' }} width={100} height={100} />
                                    </div>
                                    <div> Thêm vào giỏ</div>
                                </button>
                                &nbsp;
                                <button className=" rounded-md flex px-[30px] md:px-[60px] py-[15px]"
                                    style={{ color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-6)', fontSize: '18px' }}>
                                    <Link href="/order">Mua ngay</Link>
                                </button>
                            </div>
                            {/* <div className="flex justify-center items-center mb-2">
                            
                        </div> */}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}
