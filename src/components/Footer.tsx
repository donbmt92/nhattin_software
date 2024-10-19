import {FaFacebook, FaTelegram,  FaInstagram, FaTiktok, FaTwitter, FaEnvelope} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-blue-500 text-white p-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-orange-500">Nhất Tín Software</h2>
                    <p className="mt-2">Cửa hàng tài khoản giá rẻ.</p>
                    <p className="mt-2">CTY TNHH 1 THÀNH VIÊN NHẤT TÍN</p>
                    <p>MST: 3002252174</p>
                    <p>Địa chỉ: </p>
                    <div className="flex space-x-4 mt-4">
                        {/*<FaZalo size={24}/>*/}
                        <FaFacebook size={24}/>
                        <FaTelegram size={24}/>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Liên kết</h3>
                    <ul className="space-y-2">
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Bảo hành và hoàn tiền</li>
                        <li>Hướng dẫn mua hàng</li>
                        <li>Bài viết & tin tức</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Dịch vụ</h3>
                    <ul className="space-y-2">
                        <li>Mua Spotify Premium</li>
                        <li>Mua tài khoản Netflix</li>
                        <li>Mua Canva Pro vĩnh viễn</li>
                        <li>Mua Adobe bản quyền</li>
                        <li>Mua YouTube Premium</li>
                    </ul>
                    <div className="flex space-x-4 mt-4">
                        <button className="border border-white py-2 px-4 rounded-md">Trở thành nhà cung cấp</button>
                        <button className="border border-white py-2 px-4 rounded-md">Trở thành cộng tác viên</button>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
                <div className="flex justify-center space-x-4 mb-4">
                    <FaInstagram size={24}/>
                    <FaTiktok size={24}/>
                    <FaTwitter size={24}/>
                    <FaEnvelope size={24}/>
                </div>
                <p>Copyright © Gamikey. All Rights Reserved. Powered by Gamikey.com</p>
            </div>
        </footer>
    );
};

export default Footer;
