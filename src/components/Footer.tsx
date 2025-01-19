import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import LinkContact from '@/app/components/LinkContact/page'
const SocialLink = ({ href, icon, children }) => (
    <Link href={href} className="hover:opacity-80">
        {icon}
        <span className="sr-only">{children}</span>
    </Link>
)

const FooterLink = ({ href, className, children }) => (
    <Link href={href} className={`inline-flex justify-center items-center px-6 py-2 ${className}`}>
        {children}
    </Link>
)

const FooterLinks = ({ links }) => (
    <ul className="space-y-2">
        {links.map((link) => (
            <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                    {link.label}
                </Link>
            </li>
        ))}
    </ul>
)
const Footer = () => {
    return (
        <>
            <LinkContact />

            <footer className="bg-[#4B84F7] text-white">
                {/* <div className="bg-white text-[#4B84F7]">
                <div className="flex justify-end  container mx-auto px-4 py-8">
                    <SocialLink href="#" icon={<Facebook className="w-6 h-6"/>}>Facebook</SocialLink>
                    <SocialLink href="#"
                                icon={<Image src="/tiktok.svg" alt="TikTok" width={24}
                                             height={24}/>}>TikTok</SocialLink>
                    <SocialLink href="#" icon={<Instagram className="w-6 h-6"/>}>Instagram</SocialLink>
                    <SocialLink href="#" icon={<Youtube className="w-6 h-6"/>}>Youtube</SocialLink>
                </div>
            </div> */}

                <div className="container mx-auto px-4 py-8" style={{ backgroundImage: "url('image/footer-bg.svg')" }}>
                    {/* Main Footer Content */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Company Info */}
                        <div className="flex items-center gap-2">
                            <Link href="/">
                                <Image src="/images/icon/logo.svg" alt="Nhattin Software" width={100} height={100} />
                            </Link>
                            <span className="text-xl font-bold">Nhattin Software</span>
                        </div>

                        {/* Services Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <FooterLink href="/tro-thanh-nha-cung-cap"
                                className="border-2 border-white rounded-md hover:bg-white hover:text-[#4B84F7] transition-colors">
                                TRỞ THÀNH <br /> NHÀ CUNG CẤP
                            </FooterLink>
                            <FooterLink href="/tro-thanh-cong-tac-vien"
                                className="border-2 border-white rounded-md hover:bg-white hover:text-[#4B84F7] transition-colors">
                                TRỞ THÀNH <br /> CỘNG TÁC VIÊN
                            </FooterLink>
                        </div>
                    </div>

                    {/* Quick Links and Services */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        {/* Quick Links */}
                        <div>
                            <p className="mt-2 text-sm">Cửa hàng tài khoản giá rẻ.</p>
                            <p className="mt-4 text-sm">CTY TNHH SLUTON TECHNOLOGY</p>
                            <p className="text-sm">MST: 12345678</p>
                            <p className="text-sm">Địa chỉ: 123 Đông Khởi, Tân An, BMT, Đắk Lắk</p>
                        </div>
                        <div>
                            <FooterLinks
                                links={[
                                    { href: '/gioi-thieu', label: 'Giới thiệu' },
                                    { href: '/lien-he', label: 'Liên Hệ' },
                                    { href: '/bao-hanh', label: 'Bảo hành và hoàn tiền' },
                                    { href: '/huong-dan', label: 'Hướng dẫn mua hàng' },
                                    { href: '/tin-tuc', label: 'Bài viết & tin tức' },
                                ]}
                            />
                        </div>

                        {/* Services */}
                        <div>
                            <FooterLinks
                                links={[
                                    { href: '/dich-vu/facebook', label: 'Chăm sóc Facebook, Website' },
                                    { href: '/dich-vu/quang-cao', label: 'Dịch vụ quảng cáo' },
                                    { href: '/dich-vu/marketing', label: 'Phòng Marketing thuê ngoài' },
                                    { href: '/dich-vu/kenh-ban-hang', label: 'Quản trị kênh bán hàng' },
                                    { href: '/dich-vu/thiet-ke', label: 'Thiết kế ấn phẩm, xây dựng website, phần mềm' },
                                    { href: '/dich-vu/truyen-thong', label: 'Truyền thông, PR báo chí' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-8 border-t border-white/20 text-center">
                        <p className="text-sm">© 2024 DreakTech. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer


