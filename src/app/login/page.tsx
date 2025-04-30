"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data);
            if (data) {
                localStorage.setItem('nhattin_token', data.access_token);
                console.log(JSON.stringify(data.data));

                localStorage.setItem('nhattin_user', JSON.stringify(data.data));
                // Kiểm tra role và điều hướng
                if (data.data.role === '"ADMIN"') {
                    console.log('admin', data.data.role);
                    router.push('/dashboard');
                } else {
                    console.log('user', data.data.role);
                    router.push('/');
                }
            }

        } catch (err) {
            setError('Email hoặc mật khẩu không đúng!!');
            console.error('Login error:', err);
        }
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
                    margin: '10px', 
                    borderRadius: '20px',
                    zIndex: 1,
                }}
            >
                <div className="grid xl:grid-cols-12">
                    <div className='xl:col-span-6 hidden xl:flex'>
                        <Image src="/images/image13.png" alt="Mô tả hình ảnh" style={{ width: '100%', height: 'auto', borderRadius:'15px', }} width={1000} height={100} />
                    </div>
                    <div className='col-span-6 md:m-[80px] justify-center flex'>
                        <div className="w-full xl:max-w-md">
                            <h1 className="md:text-[40px] text-[30px] font-bold text-center mb-6">Đăng nhập</h1>
                            <button className="flex items-center justify-center w-3/5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4 mx-auto md:text-[18px] text-[13px]">
                                <Image src="/images/icon/icon31.png" alt="Google Logo" className="w-5 h-5 mr-2" width={24} height={24}/>
                                Đăng nhập với Google
                            </button>

                            <div className="flex items-center my-6">
                                <hr className="flex-grow border-gray-300" />
                                <span className="text-sm mx-2" style={{ color: 'var(--clr-txt-1)' }}>Hoặc với email</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="Địa chỉ email"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <div className="relative mb-6">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mật khẩu"
                                        className="border border-gray-300 rounded-lg py-2 px-3 w-full pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: 'var(--clr-txt-1)' }}>
                                            Ghi nhớ
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <Link href="/forgot-password" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-6 text-center text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-bold"
                                    style={{ backgroundColor: "var(--clr-bg-8)", color: "var(--clr-txt-3)" }}
                                >
                                    Đăng Nhập
                                </button>
                            </form>

                            <p className="text-sm text-center text-gray-500 mt-4">
                                Bạn chưa có tài khoản?{" "}
                                <Link href="/register" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>Đăng ký</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 