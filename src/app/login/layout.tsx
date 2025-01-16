import "../globals.css";
export const metadata = {
  title: 'Nhất Tín - Đăng nhập',
  description: 'Đăng nhập vào Nhất Tín',
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