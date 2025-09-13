"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RegisterFormData {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    isDelete: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterFormData>({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        role: 'USER',
        isDelete: 'ACTIVE'
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Kích thước ảnh không được vượt quá 5MB');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                setError('Vui lòng chọn file ảnh hợp lệ');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const validateForm = (): boolean => {
        if (!formData.fullName.trim()) {
            setError('Vui lòng nhập họ tên');
            return false;
        }
        
        if (formData.fullName.length < 3 || formData.fullName.length > 30) {
            setError('Họ tên phải từ 3-30 ký tự');
            return false;
        }

        if (!formData.phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return false;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Số điện thoại phải đúng 10 số');
            return false;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email không hợp lệ');
            return false;
        }

        if (!formData.password) {
            setError('Vui lòng nhập mật khẩu');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('isDelete', formData.isDelete);
            
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/createUser`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data) {
                setSuccess('Đăng ký thành công! Đang chuyển hướng...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 409) {
                setError('Số điện thoại hoặc email đã tồn tại trong hệ thống');
            } else {
                setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
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
                    <div className="xl:col-span-6 hidden xl:flex">
                        <Image src="/images/image13.png" alt="Mô tả hình ảnh" style={{ width: '100%', height: 'auto', borderRadius:'15px', }} width={1000} height={100} />
                    </div>
                    <div className='col-span-6 md:m-[80px] justify-center flex'>
                        <div className="w-full xl:max-w-md">
                            <h1 className="md:text-[40px] text-[30px] font-bold text-center mb-6">Đăng ký tài khoản</h1>
                            
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                    {success}
                                </div>
                            )}

                            <button className="flex items-center justify-center w-3/5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4 mx-auto md:text-[18px] text-[13px]">
                                <Image src="/images/icon/icon31.png" alt="Google Logo" className="w-5 h-5 mr-2" width={24} height={24}/>
                                Đăng ký với Google
                            </button>

                            <div className="flex items-center my-6">
                                <hr className="flex-grow border-gray-300" />
                                <span className="text-sm mx-2" style={{ color: 'var(--clr-txt-1)' }}>Hoặc với email</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên (3-30 ký tự)"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-4"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Số điện thoại (10 số)"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-4"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Địa chỉ email (tùy chọn)"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-4"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />

                                <div className="relative mb-4">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                                        className="border border-gray-300 rounded-lg py-2 px-3 w-full pr-10"
                                        value={formData.password}
                                        onChange={handleInputChange}
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

                                {/* Image Upload */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ảnh đại diện (tùy chọn)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                width={100}
                                                height={100}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <p className="text-[13px] mb-6" style={{ color: "var(--clr-txt-1)" }}>
                                    Bằng cách tạo tài khoản, bạn đồng ý với{" "}
                                    <a href="#" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>Chính sách bảo mật</a> và{" "}
                                    <a href="#" className="hover:underline font-bold" style={{ color: "var(--clr-txt-6)" }}>Chính sách truyền thông điện tử</a> của chúng tôi.
                                </p>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: "var(--clr-bg-8)", color: "var(--clr-txt-3)" }}
                                >
                                    {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
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
