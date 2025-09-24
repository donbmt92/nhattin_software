import Link from 'next/link'
import { Button } from '@/app/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Không tìm thấy trang</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link href="/">
        <Button>
          Về trang chủ
        </Button>
      </Link>
    </div>
  )
}
