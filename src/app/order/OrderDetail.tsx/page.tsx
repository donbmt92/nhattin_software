"use client";
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function OrderDetails() {
    type Quantities = {
        [productId: string]: number;
    };

    const [quantities, setQuantities] = useState<Quantities>({});
    const [selectedMethod, setSelectedMethod] = useState("momo");

    // Hàm xử lý khi nhấn nút trừ
    const increaseQuantity = (productId: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 1) + 1,
        }));
    };

    const decreaseQuantity = (productId: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max((prev[productId] || 1) - 1, 1),
        }));
    };
    const [maxWidth, setMaxWidth] = useState("150px");

    useEffect(() => {
        const updateMaxWidth = () => {
            if (window.matchMedia("(min-width: 1537px)").matches) {
                setMaxWidth("600px"); // XXL
            } else if (window.matchMedia("(min-width: 1280px)").matches) {
                setMaxWidth("450px"); // Xl
            } else if (window.matchMedia("(min-width: 1024px)").matches) {
                setMaxWidth("600px"); // LG
            } else if (window.matchMedia("(min-width: 768px)").matches) {
                setMaxWidth("350px"); // MD
            } else {
                setMaxWidth("200px"); // smaller
            }
        };

        updateMaxWidth();
        window.addEventListener("resize", updateMaxWidth);

        return () => window.removeEventListener("resize", updateMaxWidth);
    }, []);
    const products = [
        {
            id: 1,
            name: 'Mua Tài khoản Netflix PremiumMua Tài khoản Netflix Premium',
            price: 1000,
            type: 'Giải trí',
            quantity: 1,
            imgSrc: '../images/image12.png',
        },
        {
            id: 2,
            name: 'Mua Tài khoản Netflix Premium',
            price: 1000,
            type: 'Giải trí',
            quantity: 1,
            imgSrc: '../images/image12.png',
        },
    ];

    const paymentMethods = [
        {
            id: "momo",
            label: "Thanh toán bằng ví MoMo",
            logo: "../images/momo.png",
        },
        {
            id: "vtcpay",
            label: "VTCPay",
            logo: "../images/vtcpay.png",
        },
        {
            id: "vietcombank",
            label: "Thanh toán Vietcombank",
            logo: "../images/vietcombank.png",
        },
        {
            id: "alepay",
            label: "Thanh toán trực tuyến",
            logo: "../images/alepay.png",
        },
    ];

    return (
        <div style={{ backgroundColor: 'var(--clr-bg-1)', padding: "40px 0px" }}>
            <div className="container mx-auto p-4" style={{ backgroundColor: 'var(--clr-bg)', borderRadius: '10px' }}>
                <div className="ml-6">
                    <h2 style={{ color: 'var(--clr-txt-1)', fontSize: '30px', marginBottom: '10px', fontWeight: 'bold' }}>Thanh Toán</h2>
                    <h2 className="text-[25px] text-left mb-1">Giỏ hàng</h2>
                    <hr style={{ border: "1px solid var(--clr-bg-5)", width: "60px" }} />
                    <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "20px", width: "65%" }} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3">
                    <div className='col-span-2' style={{ margin: '0px 10px', padding: '10px' }}>
                        {products.map((product) => (
                            <div className=" m-2 grid grid-cols-1 md:grid-cols-12">
                                <div key={product.id} className="col-span-10 flex py-6" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} >
                                    <div className='justify-center items-center flex mx-3 cursor-pointer'>
                                        <Image src="/images/icon/icon28.png" alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', }} width={40} height={40} />
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <Image src={product.imgSrc} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} width={100} height={100} />
                                        <div className='mx-3'>
                                            <h2 style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: maxWidth,
                                            }}>{product.name}</h2>
                                            <div className='flex my-2'>
                                                <h2 className='text-[16px] font-bold mr-2'>Gói đăng ký: </h2>
                                                <span>{product.type}</span>
                                            </div>

                                            <h2 className='text-[23px] font-bold' style={{ color: 'var(--clr-txt-4)' }}>{product.price}đ</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-2 py-6 justify-center' style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                    <p className="text-[18px] ml-4 font-semibold" style={{ color: 'var(--clr-txt-1)' }}>
                                        Số lượng:
                                    </p>
                                    <div className="flex my-3 justify-center xl:justify-start items-center">

                                        <div className="flex mx-4">
                                            <button
                                                onClick={() => decreaseQuantity(product.id)}
                                                className="font-semibold rounded-l"
                                                style={{
                                                    minWidth: '30px',
                                                    minHeight: '30px',
                                                    border: '1px solid var(--clr-bg-3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faMinus} style={{ color: 'var(--clr-txt-1)', width: '15px', height: '15px' }} />
                                            </button>
                                            <div
                                                className=" flex justify-center items-center"
                                                style={{
                                                    minWidth: '50px',
                                                    minHeight: '35px',
                                                    fontSize: '20px',
                                                    padding: '0px 20px',
                                                    textAlign: 'center',
                                                    // border: '1px solid var(--clr-bg-3)'
                                                }}
                                            >
                                                {quantities[product.id] || 1}
                                            </div>
                                            <button
                                                onClick={() => increaseQuantity(product.id)}
                                                className="font-semibold rounded-r"
                                                style={{
                                                    minWidth: '30px',
                                                    minHeight: '30px',
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
                                </div>
                            </div>
                        ))}
                        <div className=''>
                            <h2 style={{ color: 'var(--clr-txt-1)', fontSize: '26px', margin: '20px 0px', fontWeight: 'bold' }}>Thông tin nhận hàng</h2>
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <input type="text" placeholder='Họ và tên ...' className='w-full p-2 border border-gray-300 rounded-md text-[18px]' />
                                    </div>
                                    <div>
                                        <input type="text" placeholder='Số điện thoại ...' className='w-full p-2 border border-gray-300 rounded-md text-[18px]' />
                                    </div>
                                    <div>
                                        <input type="text" placeholder='Địa chỉ Email * ...' className='w-full p-2 border border-gray-300 rounded-md text-[18px]' />
                                    </div>
                                </div>
                                <div className='my-4'>
                                    <textarea placeholder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.' className='w-full p-2 border border-gray-300 rounded-md text-[18px]' style={{ minHeight: '150px' }} />
                                </div>
                                <div className='my-4'>
                                    <p>Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng, hỗ trợ trải nghiệm của bạn trên toàn
                                        bộ trang web này và cho các mục đích khác được mô tả trong <a href='/' style={{ color: 'var(--clr-txt-2)', fontWeight: 'bold' }}>chính sách riêng tư</a>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1' style={{ borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', margin: '0px 10px', padding: '10px' }}>
                        <div style={{ margin: '10px 20px', }}>
                            <h2 style={{ color: 'var(--clr-txt-1)', fontSize: '26px', fontWeight: 'bold' }}>Đơn hàng của bạn</h2>
                            <div className="my-3">
                                <h2 style={{ color: 'var(--clr-txt-2)', fontSize: '20px', fontWeight: 'semi-bold', marginBottom: '10px' }}>Nhập mã ưu đãi!</h2>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        className="w-full py-3 px-3 pr-[80px] rounded-md text-[18px]"
                                        style={{ border: '1px solid var(--clr-bg-3)' }}
                                    />
                                    <button
                                        className="absolute right-[7px] top-[7px]  cursor-pointer rounded-md"
                                        style={{ color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)' }}
                                    >
                                        <Image src="/images/icon/icon29.png" alt="" style={{ width: '45px', height: '40px' }} width={100} height={100} />
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-6 border-b">
                                        <div className="flex justify-between my-4">
                                            <p className="font-medium">Tạm tính</p>
                                            <p className="font-medium">1,148,000đ</p>
                                        </div>
                                        <div className="flex justify-between mb-6">
                                            <p className="font-semibold">Tổng</p>
                                            <p className="font-semibold">1,148,000đ</p>
                                        </div>
                                    </div>
                                    <div className="p-4 w-full justify-center">
                                        <div>
                                            {paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`items-center border rounded-md mb-3 ${method.id === "momo" ? "text-blue-600" : selectedMethod === method.id ? "border-blue-500" : "border-gray-300"
                                                        }`}
                                                >
                                                    <div
                                                        className="flex items-center justify-between p-3"
                                                        onClick={() => setSelectedMethod(method.id)}
                                                    >
                                                        <div className="flex items-center">
                                                            <p className="font-medium mr-2">{method.label}</p>
                                                            <Image
                                                                src={method.logo}
                                                                alt={method.label}
                                                                className="w-10 mr-3"
                                                                width={100} height={100}
                                                            />
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value={method.id}
                                                            checked={selectedMethod === method.id}
                                                            onChange={() => setSelectedMethod(method.id)}
                                                            className="mr-3 w-5 h-5"
                                                        />
                                                    </div>

                                                    {/* Hiển thị dòng thông báo cho MoMo dù được chọn hay không */}
                                                    {method.id === "momo" && (
                                                        <div className="border-t rounded-b-md p-3">
                                                            <p className="text-sm text-gray-600">
                                                                Quét mã thanh toán tới nhà cung cấp dịch vụ là GAMIKEY
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className="w-full py-2 rounded-md mt-4 flex items-center justify-center cursor-pointer"
                                            style={{ backgroundColor: 'var(--clr-bg-7)', color: 'var(--clr-txt-5)', fontWeight: 'bold' }}
                                        >
                                            Đặt Hàng <Image src="/images/icon/icon30.png" alt="" style={{ marginLeft: '10px' }}width={100} height={100} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
