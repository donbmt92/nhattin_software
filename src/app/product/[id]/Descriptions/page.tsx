"use client";
import React, { useState } from 'react'

export default function Descriptions() {
    const [activeTab, setActiveTab] = useState('description');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    return (
        <div className="container mx-auto">
            <div className="flex border-b justify-center">
                <button
                    className={`px-4 py-2 uppercase ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-600 font-bold' : ''}`}
                    onClick={() => handleTabClick('description')}
                >
                    Mô tả sản phẩm
                </button>
                <button
                    className={`px-4 py-2 uppercase ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-600 font-bold uppercase' : ''}`}
                    onClick={() => handleTabClick('reviews')}
                >
                    Đánh giá (0)
                </button>
            </div>
            {activeTab === 'description' && (
                <div className=" rounded-[15px] shadow p-6">
                    <h2 className="text-[#131336] text-[22px] font-bold uppercase mb-4">
                        Mô tả ngắn <span className="font-normal">sản phẩm</span>
                    </h2>
                    <p className="text-[#333333] text-sm mb-6">
                        Sau khi thanh toán bạn sẽ nhận được thông tin đăng nhập tài khoản Steam bao gồm email và mật
                        khẩu.
                    </p>

                    <h3 className="text-[#333333] text-sm font-bold mb-4">Những gì bạn nhận được khi mua hàng</h3>
                    <ul className="list-disc pl-5 mb-6">
                        <li className="text-[#333333] text-sm mb-2">Quyền truy cập vào tài khoản Steam chính thức</li>
                        <li className="text-[#333333] text-sm mb-2">Bảo hành tài khoản 12 tháng</li>
                        <li className="text-[#333333] text-sm mb-2">Quyền truy cập vào tất cả các bản cập nhật trò
                            chơi
                        </li>
                        <li className="text-[#333333] text-sm">Hỗ trợ kỹ thuật và trợ giúp miễn phí khi bắt đầu trò chơi
                            nếu cần
                        </li>
                    </ul>

                    <h3 className="text-[#333333] text-sm font-bold mb-4">Lưu ý</h3>
                    <ul className="list-none mb-6">
                        <li className="text-[#333333] text-sm mb-2">❗ Bạn đây là tài khoản STEAM mua chung để chơi ngoại
                            tuyến (offline)
                        </li>
                        <li className="text-[#333333] text-sm mb-2">❗ Kích hoạt một lần duy nhất trên một PC</li>
                        <li className="text-[#333333] text-sm mb-2">❗ Không cài lại Window trong quá trình sử dụng</li>
                        <li className="text-[#333333] text-sm mb-2">❗ Bạn mua một tài khoản STEAM dùng chung, nghĩa là
                            không chỉ mình bạn chơi trên đó
                        </li>
                        <li className="text-[#333333] text-sm mb-2">❗ Sau khi mua, bạn sẽ được cấp một tên đăng nhập và
                            mật khẩu từ tài khoản steam, sau khi cài đặt, bạn chỉ có thể chơi ở chế độ ngoại tuyến.
                        </li>
                        <li className="text-[#333333] text-sm">❗ Tài khoản không giới hạn, email và mật khẩu không thể
                            thay đổi. (Bạn sẽ có quyền truy cập vào tài khoản của mình mãi mãi)
                        </li>
                    </ul>

                    <h3 className="text-[#333333] text-sm font-bold mb-4">CÀI ĐẶT:</h3>
                    <ol className="list-decimal pl-5">
                        <li className="text-[#333333] text-sm mb-2">Tải xuống ứng dụng Steam từ trang web chính thức và
                            cài đặt.
                        </li>
                        <li className="text-[#333333] text-sm mb-2">Đăng nhập vào tài khoản của bạn bằng tên người dùng
                            và mật khẩu đã cho
                        </li>
                        <li className="text-[#333333] text-sm mb-2">Liên hệ Gamikey để được cấp mã Steam Guard</li>
                        <li className="text-[#333333] text-sm mb-2">Vào trò chơi một lần ở chế độ trực tuyến, sau đó
                            thoát;
                        </li>
                        <li className="text-[#333333] text-sm">Làm theo hướng dẫn để chuyển sang chế độ ngoại tuyến (✅
                            quan trọng)
                        </li>
                    </ol>
                </div>
            )}
            {activeTab === 'reviews' && (
                <div className="p-4">
                    <p>Chưa có đánh giá nào Hãy là người đầu tiên viết đánh giá!</p>
                </div>
            )}
        </div>
    )
}
