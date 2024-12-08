import React from 'react'
import {Card, CardContent} from "@/app/components/ui/card";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";

// Since we don't have Lucide React, let's create simple icon components
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-6 h-6 flex items-center justify-center">{children}</div>
)

const Edit = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    </IconWrapper>
)

const ShoppingBag = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    </IconWrapper>
)

const CreditCard = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    </IconWrapper>
)

const Award = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    </IconWrapper>
)

export default function UserDashboard() {
    return (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Profile Section - Left Side */}
            <div className="col-span-1">
                <Card className="max-w-sm mx-auto">
                    <CardContent className="p-6 flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">Pahn Dang Hieu</h2>
                            <p className="text-sm text-gray-500">#30452</p>
                        </div>
                        <div className="w-full space-y-3">
                            <Input
                                type="email"
                                placeholder="Email"
                                value="Luutru.phanhhieu@gmail.com"
                                readOnly
                            />
                            <Input type="tel" placeholder="Phone" value="0337575254" readOnly/>
                        </div>
                        <Button className="w-full flex items-center justify-center">
                            <Edit/>
                            <span className="ml-2">Chỉnh Sửa</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side Container */}
            <div className="col-span-3 space-y-6">
                {/* Stats Section - Top Right */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <ShoppingBag/>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Đơn Đã Đặt</p>
                                <h3 className="text-2xl font-bold text-blue-500">10</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CreditCard/>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Đã Chi Tiêu</p>
                                <h3 className="text-2xl font-bold text-green-500">100.000 đ</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Award/>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                                <h3 className="text-lg font-bold text-orange-500">Kim cương</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Section - Bottom Right */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">Đơn mua</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((order) => (
                                <div
                                    key={order}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="space-y-1 mb-4 md:mb-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">#1547</span>
                                            <h3 className="font-medium">Mua Tài khoản Netflix Premium</h3>
                                        </div>
                                        <p className="text-sm text-gray-500">20/10/2024</p>
                                        <p className="font-medium">220.000 đ</p>
                                        <p className="text-sm text-gray-500">3 tháng</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="secondary" size="sm">
                                            Chi Tiết
                                        </Button>
                                        <Button size="sm">
                                            Mua Thêm
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

