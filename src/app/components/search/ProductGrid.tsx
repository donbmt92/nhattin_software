"use client"

import { Filter, Percent, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'

export default function ProductGrid() {

    const products = [
        {
            id: '123456',
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=200&width=200',
            price: '399.000 đ',
            tag: 'Giá tốt',
            type: 'canva',
        },
        {
            id: '123456',
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=200&width=200',
            price: '399.000 đ',
            tag: 'Giá tốt',
            type: 'adobe',
        },
        {
            id: '123456',
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=200&width=200',
            price: '399.000 đ',
            tag: 'Giá tốt',
            type: 'netflix',
        },
        {
            id: '123456',
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=200&width=200',
            price: '399.000 đ',
            tag: 'Giá tốt',
            type: 'canva',
        },
        {
            id: '123456',
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=200&width=200',
            price: '399.000 đ',
            tag: 'Giá tốt',
            type: 'adobe',
        },
        {
            id: '123456',
            name: 'Mua Tài khoản Netflix Premium',
            image: '/placeholder.svg?height=200&width=200',
            price: '399.000 đ',
            tag: 'Giá tốt',
            type: 'netflix',
        },
    ]

    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'canva':
                return 'bg-cyan-50'
            case 'adobe':
                return 'bg-gradient-to-r from-pink-500 to-orange-400'
            case 'netflix':
                return 'bg-red-600'
            default:
                return 'bg-gray-100'
        }
    }
    const [priceRange, setPriceRange] = useState('100.000đ - 1.000.000đ')
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    const filters = [
        { id: 'high-low', label: 'Giá Cao - Thấp', icon: '↓' },
        { id: 'low-high', label: 'Giá Thấp - Cao', icon: '↑' },
        { id: 'promotion', label: 'Khuyến mãi hot', icon: <Percent className="h-4 w-4" /> },
        { id: 'bestseller', label: 'Bán chạy', icon: <TrendingUp className="h-4 w-4" /> },
    ]

    const clearPriceRange = () => {
        setPriceRange('')
    }
    return (
        <div className="mx-auto max-w-7xl p-4">
            {/* Price Range Filter */}
            <div className=" items-center gap-3 p-2">
                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
                        <Filter className="h-4 w-4"/>
                        <span className="text-sm">Lọc</span>
                    </button>

                    {priceRange && (
                        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                            <span className="text-sm">Từ {priceRange}</span>
                            <button
                                onClick={clearPriceRange}
                                className="rounded-full p-1 hover:bg-gray-200"
                                aria-label="Clear price range"
                            >
                                <X className="h-3 w-3"/>
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sắp xếp theo</span>
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
                ${
                                    activeFilter === filter.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {typeof filter.icon === 'string' ? filter.icon : filter.icon}
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                    <div key={index} className="group relative rounded-lg border border-gray-200 bg-white p-4">
                        <div
                            className={`relative mb-4 aspect-square overflow-hidden rounded-lg ${getBackgroundColor(product.type)}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                {product.tag}
              </span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">{product.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Giá tốt</span>
                                <span>{product.id}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-red-500">{product.price}</span>
                                <button
                                    className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
