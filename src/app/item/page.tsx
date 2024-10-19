import React, {ReactElement, ReactNode} from 'react';
import {Star, ShoppingCart, Shield} from 'lucide-react';

interface InfoCardProps {
    icon: ReactNode;
    value?: string;
    label: string;
}

export default function item() {
    return (
        <div className="w-full h-full">
            <section
                className="relative bg-center leading-relaxed bg-no-repeat bg-cover flex justify-center bg-gray-900 p-4 w-full">
                {/* Lớp phủ làm mờ hình nền */}
                <div
                    className="absolute inset-0 bg-[url('https://images.alphacoders.com/133/thumb-1920-1330376.png')] bg-center bg-cover filter blur-md"></div>

                {/* Nội dung bên trong */}
                <div className="relative z-10 w-full max-w-7xl p-4 md:p-6 text-white rounded-lg shadow-lg">
                    {/* Breadcrumb */}
                    <div className="text-xs mb-4 text-gray-400">
                        <span className="hover:text-white cursor-pointer">Trang chủ</span> -{' '}
                        <span className="hover:text-white cursor-pointer">Game</span> -{' '}
                        <span className="hover:text-white cursor-pointer">Black Myth: Wukong Deluxe Edition STEAM | Tài khoản Offline</span>
                    </div>

                    {/* Flex container for content */}
                    <div className="flex md:flex-row gap-6">
                        {/* Image Section */}
                        <div className="flex items-center md:w-1/2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="w-full max-w-[275px] rounded-lg"
                                src="https://gamikey.com/wp-content/uploads/2024/08/Wukong-768x768.jpg"
                                alt="Black Myth: Wukong"
                            />

                            {/* Stats Section */}
                            <div className="mt-4 flex flex-col gap-2 pl-5">
                                <InfoCard icon={<Star/>} value="2" label="Đánh giá từ khách hàng"/>
                                <InfoCard icon={<ShoppingCart/>} value="120" label="Đã bán"/>
                                <InfoCard icon={<Shield/>} label="Chính sách bảo hành" value={undefined}/>
                                <RatingCard rating={5.0}/>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2">
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">
                                Black Myth: Wukong Deluxe Edition
                                <br/>
                                STEAM | Tài khoản Offline
                            </h1>
                            <div className="text-3xl font-bold mb-6">299,000đ</div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <ActionButton
                                    color="bg-green-600"
                                    icon={<ShoppingCart className="w-5 h-5 mr-2"/>}
                                    label="Mua Ngay"
                                />
                                <ActionButton
                                    color="bg-orange-600"
                                    icon={<ShoppingCart className="w-5 h-5 mr-2"/>}
                                    label="Thêm vào giỏ"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div
                className="relative bg-center bg-gray-100 leading-relaxed bg-no-repeat bg-cover flex flex-col items-center p-4 w-full">
                <div className="p-5 mb-4 rounded-[15px] w-full max-w-[1000px] bg-white shadow">
                    <div className="flex justify-between">
                        <div className="flex-1 px-2">
                            <div className="bg-[#ecf7e0] rounded-full p-3 flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full mr-3"/>
                                <div>
                                    <div className="text-[11px] text-[#333333] opacity-50 font-medium">Giao hàng</div>
                                    <div className="text-xs text-[#50b000] font-bold">Qua email</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 px-2">
                            <div className="bg-[#6cc030]/10 rounded-full p-3 flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full mr-3"/>
                                <div>
                                    <div className="text-[11px] text-[#333333] opacity-50 font-medium">Thời gian giao
                                        hàng
                                    </div>
                                    <div className="text-xs text-[#56bb00] font-bold">Trong vòng 24h</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 px-2">
                            <div className="bg-[#4575ef]/10 rounded-full p-3 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full mr-3"/>
                                <div>
                                    <div className="text-[11px] text-[#333333] opacity-50 font-medium">Bảo hành</div>
                                    <div className="text-xs text-[#036cb5] font-bold">12 tháng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[1000px] bg-white rounded-[15px] shadow p-6">
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
            </div>
        </div>
    );
}

// Reusable InfoCard Component
const InfoCard: React.FC<InfoCardProps> = ({icon, value, label}) => (
    <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
        {icon}
        {value && <span className="font-bold ml-1 pr-1"> {value}</span>}
        <span>{label}</span>
    </div>
);

// Reusable RatingCard Component
const RatingCard = ({rating}: {
    rating: number
}) => (
    <div className="flex items-center mt-4">
        <span className="mr-2">Rating</span>
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                <Star key={index} className="w-4 h-4 text-yellow-400 fill-current"/>
            ))}
        </div>
        <span className="ml-2 font-bold text-yellow-400">{rating.toFixed(2)}</span>
    </div>
);

// Reusable ActionButton Component
const ActionButton = ({color, icon, label}: {
    color: string, icon: ReactElement, label: string
}) => (
    <button className={`flex-1 ${color} text-white px-6 py-3 rounded font-bold flex items-center justify-center`}>
        {icon}
        {label}
    </button>
);
