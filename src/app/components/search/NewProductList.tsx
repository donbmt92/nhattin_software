import { Star } from 'lucide-react'

export default function NewProductList() {
    const products = [
        {
            id: 1,
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=80&width=80',
            rating: 5,
            priceRange: '149,000đ-1,299,000đ',
            bgColor: 'bg-sky-100'
        },
        {
            id: 2,
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=80&width=80',
            rating: 5,
            priceRange: '149,000đ-1,299,000đ',
            bgColor: 'bg-red-600'
        },
        {
            id: 3,
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=80&width=80',
            rating: 5,
            priceRange: '149,000đ-1,299,000đ',
            bgColor: 'bg-red-500'
        },
        {
            id: 4,
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=80&width=80',
            rating: 5,
            priceRange: '149,000đ-1,299,000đ',
            bgColor: 'bg-green-500'
        },
        {
            id: 5,
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=80&width=80',
            rating: 5,
            priceRange: '149,000đ-1,299,000đ',
            bgColor: 'bg-gradient-to-r from-orange-400 to-pink-500'
        },
        {
            id: 6,
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=80&width=80',
            rating: 5,
            priceRange: '149,000đ-1,299,000đ',
            bgColor: 'bg-purple-900'
        }
    ]

    return (
        <div className="w-full max-w-md rounded-lg bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Sản Phẩm Mới</h2>
            <div className="space-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-50"
                    >
                        <div className={`h-20 w-20 overflow-hidden rounded-lg ${product.bgColor}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="mt-1 flex items-center">
                                {Array.from({ length: product.rating }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">{product.priceRange}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
