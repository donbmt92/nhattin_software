"use client";
import Image from 'next/image';
import React, { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundImage: 'url("../images/Background.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                }}
            />
            <div
                className="container mx-auto py-4"
                style={{
                    backgroundColor: 'var(--clr-bg)',
                    padding: '20px',
                    borderRadius: '20px',
                    zIndex: 1,
                }}
            >
                <div className="grid xl:grid-cols-12">
                    <div className='xl:col-span-6 hidden xl:flex'>
                        <Image src="/images/image13.png" alt="Mô tả hình ảnh" style={{ width: '100%', height: 'auto', borderRadius:'15px', }} width={1000} height={100} />
                    </div>
                    <div className='col-span-6 m-[80px] justify-center flex'>
                        <div className="w-full xl:max-w-md">
                            <h1 className="text-[40px] font-bold text-center mb-6">Đăng ký tài khoản</h1>
                            <button className="flex items-center justify-center w-3/5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4 mx-auto">
                                <Image src="/images/icon/icon31.png" alt="Google Logo" className="w-5 h-5 mr-2" width={24} height={24}/>
                                Đăng ký với Google
                            </button>

                            <div className="flex items-center my-6">
                                <hr className="flex-grow border-gray-300" />
                                <span className="text-sm mx-2" style={{ color: 'var(--clr-txt-1)' }}>Hoặc với email</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>

                            <form>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Họ và tên "
                                        className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tên"
                                        className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                                    />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Địa chỉ email"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-6"
                                />

                                <div className="relative mb-6">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mật khẩu"
                                        className="border border-gray-300 rounded-lg py-2 px-3 w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <Image
                                            src={showPassword ? "/images/icon/icon32.png" : "/images/icon/icon33.png"}
                                            alt="Toggle Visibility"
                                            className="w-5 h-5"
                                            width={24}
                                            height={24}
                                        />
                                    </button>
                                </div>

                                <p className="text-sm mb-6" style={{ color: "var(--clr-txt-1)" }}>
                                    Bằng cách tạo tài khoản, bạn đồng ý với{" "}
                                    <a href="#" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>Chính sách bảo mật</a> và{" "}
                                    <a href="#" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>Chính sách truyền thông điện tử</a> của chúng tôi.
                                </p>

                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-bold"
                                    style={{ backgroundColor: "var(--clr-bg-8)", color: "var(--clr-txt-3)" }}
                                >
                                    Đăng Ký
                                </button>
                            </form>

                            <p className="text-sm text-center text-gray-500 mt-4">
                                Bạn đã có tài khoản?{" "}
                                <a href="/login" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>Đăng nhập</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
