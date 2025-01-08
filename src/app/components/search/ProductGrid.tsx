"use client"

import { Filter, Percent, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'
import { ProductType } from '@/types/category'

const PRODUCTS: ProductType[] = [
    {
        id: '123456',
        name: 'Mua Tài khoản Netflix Premium',
        image: '/placeholder.svg?height=200&width=200',
        price: '399.000 đ',
        tag: 'Giá tốt',
        type: 'netflix',
    },
    // ... other products
]

const FILTERS = [
    { id: 'high-low', label: 'Giá Cao - Thấp', icon: '↓' },
    { id: 'low-high', label: 'Giá Thấp - Cao', icon: '↑' },
    { id: 'promotion', label: 'Khuyến mãi hot', icon: <Percent className="h-4 w-4" /> },
    { id: 'bestseller', label: 'Bán chạy', icon: <TrendingUp className="h-4 w-4" /> },
]

function FilterSection({ 
    priceRange, 
    onClearPrice, 
    activeFilter, 
    onFilterChange 
}: { 
    priceRange: string
    onClearPrice: () => void
    activeFilter: string | null
    onFilterChange: (id: string) => void
}) {
    return (
        <div className="items-center gap-3 p-2">
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
                    <Filter className="h-4 w-4"/>
                    <span className="text-sm">Lọc</span>
                </button>

                {priceRange && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                        <span className="text-sm">Từ {priceRange}</span>
                        <button onClick={onClearPrice} className="rounded-full p-1 hover:bg-gray-200">
                            <X className="h-3 w-3"/>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp theo</span>
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
                                ${activeFilter === filter.id 
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
    )
}

function ProductList({ 
    products, 
    getBackgroundColor 
}: { 
    products: ProductType[]
    getBackgroundColor: (type: ProductType['type']) => string
}) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
                <div key={product.id} className="group relative rounded-lg border border-gray-200 bg-white p-4">
                    <div className={`relative mb-4 aspect-square overflow-hidden rounded-lg ${getBackgroundColor(product.type)}`}>
                        <img src={product.image} alt={product.name} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
                        <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                            {product.tag}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-red-500">{product.price}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function ProductGrid() {
    const [priceRange, setPriceRange] = useState('100.000đ - 1.000.000đ')
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    const getBackgroundColor = (type: ProductType['type']) => {
        const colors = {
            canva: 'bg-cyan-50',
            adobe: 'bg-gradient-to-r from-pink-500 to-orange-400',
            netflix: 'bg-red-600',
        }
        return colors[type] || 'bg-gray-100'
    }

    return (
        <div className="mx-auto max-w-7xl p-4">
            <FilterSection 
                priceRange={priceRange}
                onClearPrice={() => setPriceRange('')}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
            <ProductList 
                products={PRODUCTS} 
                getBackgroundColor={getBackgroundColor} 
            />
        </div>
    )
}
