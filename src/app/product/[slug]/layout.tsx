import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm',
  description: 'Khám phá chi tiết sản phẩm phần mềm chất lượng cao tại Nhất Tín Software. Thông tin đầy đủ về tính năng, giá cả và cách sử dụng.',
  keywords: ['chi tiết sản phẩm', 'phần mềm', 'software', 'Nhất Tín'],
  openGraph: {
    title: 'Chi tiết sản phẩm | Nhất Tín Software',
    description: 'Khám phá chi tiết sản phẩm phần mềm chất lượng cao tại Nhất Tín Software.',
    type: 'website',
    images: ['/images/product-placeholder.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi tiết sản phẩm | Nhất Tín Software',
    description: 'Khám phá chi tiết sản phẩm phần mềm chất lượng cao tại Nhất Tín Software.',
    images: ['/images/product-placeholder.jpg'],
  },
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
