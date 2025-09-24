import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: "Nhất Tín Software - Phần mềm và dịch vụ công nghệ hàng đầu",
        template: "%s | Nhất Tín Software"
    },
    description: "Nhất Tín Software cung cấp các giải pháp phần mềm, dịch vụ công nghệ và ứng dụng di động chất lượng cao. Khám phá các sản phẩm phần mềm tốt nhất với giá cả hợp lý.",
    keywords: [
        "phần mềm",
        "software",
        "ứng dụng",
        "công nghệ",
        "Nhất Tín",
        "nhattin",
        "dịch vụ IT",
        "phần mềm Việt Nam",
        "ứng dụng di động",
        "web development"
    ],
    authors: [{ name: "Nhất Tín Software Team" }],
    creator: "Nhất Tín Software",
    publisher: "Nhất Tín Software",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://nhattinsoftware.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: 'https://nhattinsoftware.com',
        siteName: 'Nhất Tín Software',
        title: 'Nhất Tín Software - Phần mềm và dịch vụ công nghệ hàng đầu',
        description: 'Nhất Tín Software cung cấp các giải pháp phần mềm, dịch vụ công nghệ và ứng dụng di động chất lượng cao.',
        images: [
            {
                url: '/images/icon/logo.svg',
                width: 1200,
                height: 630,
                alt: 'Nhất Tín Marketing Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nhất Tín Software - Phần mềm và dịch vụ công nghệ hàng đầu',
        description: 'Nhất Tín Software cung cấp các giải pháp phần mềm, dịch vụ công nghệ và ứng dụng di động chất lượng cao.',
        images: ['/images/icon/logo.svg'],
        creator: '@nhattinsoftware',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
    },
}; 