import { Star } from 'lucide-react'
import Image from 'next/image'

export default function NewProductList() {
    const products = [
        // {
        //     id: 1,
        //     name: 'Mua Tài khoản Netflix Premium',
        //     image: '/placeholder.svg?height=80&width=80',
        //     rating: 5,
        //     priceRange: '149,000đ-1,299,000đ',
        //     bgColor: 'bg-sky-100'
        // },
        // {
        //     id: 2,
        //     name: 'Mua Tài khoản Netflix Premium',
        //     image: '/placeholder.svg?height=80&width=80',
        //     rating: 5,
        //     priceRange: '149,000đ-1,299,000đ',
        //     bgColor: 'bg-red-600'
        // },
        // {
        //     id: 3,
        //     name: 'Mua Tài khoản Netflix Premium',
        //     image: '/placeholder.svg?height=80&width=80',
        //     rating: 5,
        //     priceRange: '149,000đ-1,299,000đ',
        //     bgColor: 'bg-red-500'
        // },
        // {
        //     id: 4,
        //     name: 'Mua Tài khoản Netflix Premium',
        //     image: '/placeholder.svg?height=80&width=80',
        //     rating: 5,
        //     priceRange: '149,000đ-1,299,000đ',
        //     bgColor: 'bg-green-500'
        // },
        // {
        //     id: 5,
        //     name: 'Mua Tài khoản Netflix Premium',
        //     image: '/placeholder.svg?height=80&width=80',
        //     rating: 5,
        //     priceRange: '149,000đ-1,299,000đ',
        //     bgColor: 'bg-gradient-to-r from-orange-400 to-pink-500'
        // },
        // {
        //     id: 6,
        //     name: 'Mua Tài khoản Netflix Premium',
        //     image: '/placeholder.svg?height=80&width=80',
        //     rating: 5,
        //     priceRange: '149,000đ-1,299,000đ',
        //     bgColor: 'bg-purple-900'
        // }
    ]

    return (
        <div></div>
        // <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        //     {products.map((product) => (
        //         <div key={product.id} className="group relative rounded-lg border border-gray-200 bg-white p-4">
        //             <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
        //                 <Image
        //                     src={product.image}
        //                     alt={product.name}
        //                     width={300}
        //                     height={300}
        //                     className="h-full w-full object-cover transition-transform group-hover:scale-105"
        //                 />
        //             </div>
        //             <div>
        //                 <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        //                 <div className="mt-1 text-sm text-gray-500">{product.priceRange}</div>
        //                 <div className="mt-1 flex items-center">
        //                     {[...Array(5)].map((_, i) => (
        //                         <Star
        //                             key={i}
        //                             className={`h-4 w-4 ${
        //                                 i < Math.floor(product.rating)
        //                                     ? "fill-yellow-400 text-yellow-400"
        //                                     : "fill-gray-200 text-gray-200"
        //                             }`}
        //                         />
        //                     ))}
        //                 </div>
        //             </div>
        //         </div>
        //     ))}
        // </div>
    )
}
