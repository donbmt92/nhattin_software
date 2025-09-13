import Link from 'next/link'
import Image from 'next/image'
import LinkContact from '@/app/components/LinkContact/LinkContact'

interface FooterLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

interface FooterLinksProps {
    links: Array<{
        href: string;
        label: string;
    }>;
}

const FooterLink = ({ href, className, children }: FooterLinkProps) => (
    <Link
        href={href}
        className={`text-center px-4 py-3 border-2 border-white rounded-md hover:bg-white hover:text-[#4B84F7] transition-colors text-sm font-semibold w-full md:w-auto ${className}`}
    >
        {children}
    </Link>
)

const FooterLinks = ({ links }: FooterLinksProps) => (
    <ul className="space-y-2">
        {links.map(link => (
            <li key={link.href}>
                <Link href={link.href} className="hover:underline text-sm text-white">
                    {link.label}
                </Link>
            </li>
        ))}
    </ul>
)

const Footer = () => {
    return (
        <>
            <div className="footerNhattin">
                <LinkContact />

                <footer className="bg-[#4B84F7] text-white">
                    <div
                        className="bg-cover bg-no-repeat bg-center"
                        style={{ backgroundImage: "url('/image/footer-bg.svg')" }}
                    >
                        <div className="container mx-auto px-4 py-10">
                            {/* Header: Logo & Buttons */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                {/* Logo */}
                                <div className="flex items-center gap-3">
                                    <Link href="/">
                                        <Image
                                            src="/images/icon/logo.svg"
                                            alt="Nhattin Software"
                                            width={80}
                                            height={80}
                                        />
                                    </Link>
                                    <span className="text-xl font-bold">Nhattin Software</span>
                                </div>

                                {/* Call to action buttons */}
                                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                    <FooterLink href="/tro-thanh-nha-cung-cap">
                                        TRỞ THÀNH <br className="hidden md:block" /> NHÀ CUNG CẤP
                                    </FooterLink>
                                    <FooterLink href="/tro-thanh-cong-tac-vien">
                                        TRỞ THÀNH <br className="hidden md:block" /> CỘNG TÁC VIÊN
                                    </FooterLink>
                                </div>
                            </div>

                            {/* Body: Company Info & Links */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5 text-sm">
                                {/* Info */}
                                <div className="space-y-2">
                                    <p>Công Ty Cổ Phần Truyền Thông Quảng Cáo Đa Phương Tiện Nhất Tín</p>
                                    <p>Nhất Tín Marketing – Đơn vị chuyên tư vấn và triển khai hoạch định chiến lược Digital Marketing trên đa nền tảng tại Việt Nam.</p>
                                    <p>MST: 4201986407</p>
                                    <p>Địa chỉ: 123 Đông Khởi, Tân An, BMT, Đắk Lắk</p>
                                </div>

                                {/* Navigation Links */}
                                <div>
                                    <FooterLinks
                                        links={[
                                            { href: '/gioi-thieu', label: 'Giới thiệu' },
                                            { href: '/lien-he', label: 'Liên Hệ' },
                                            { href: '/bao-hanh', label: 'Bảo hành & hoàn tiền' },
                                            { href: '/huong-dan', label: 'Hướng dẫn mua hàng' },
                                            { href: '/tin-tuc', label: 'Tin tức' },
                                        ]}
                                    />
                                </div>

                                {/* Services */}
                                <div>
                                    <FooterLinks
                                        links={[
                                            { href: '/dich-vu/facebook', label: 'Chăm sóc Facebook, Website' },
                                            { href: '/dich-vu/quang-cao', label: 'Dịch vụ quảng cáo' },
                                            { href: '/dich-vu/marketing', label: 'Marketing thuê ngoài' },
                                            { href: '/dich-vu/kenh-ban-hang', label: 'Quản trị kênh bán hàng' },
                                            { href: '/dich-vu/thiet-ke', label: 'Thiết kế, xây dựng phần mềm' },
                                            { href: '/dich-vu/truyen-thong', label: 'Truyền thông, PR' },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs">
                                © 2025 DreakTech. All Rights Reserved.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Footer


