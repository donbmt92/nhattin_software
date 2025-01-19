import "../globals.css";
export const metadata = {
  title: 'Nhất Tín - Đăng ký',
  description: 'Đăng ký vào Nhất Tín',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
} 