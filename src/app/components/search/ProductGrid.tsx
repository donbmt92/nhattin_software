"use client"

import { Filter, Percent, TrendingUp, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'

// Add API URL from env
const API_URL = process.env.NEXT_PUBLIC_API_URL

interface ProductType {
    id: string
    name: string
    image: string
    price: string
    tag: string
    type: string
    category: string
}

const CATEGORIES = [
    "Giải trí",
    "Xem phim",
    "Nghe nhạc", 
    "Học tập",
    "Học Tiếng Anh",
    "Khóa học",
    "Làm việc",
    "Thiết kế đồ họa",
    "Bảo mật",
    "Diệt Virus",
    "Sức khỏe",
    "Game"
]

const BRANDS = [
    { name: "Adobe", icon: "/images/icon/adobe.svg" },
    { name: "Microsoft", icon: "/images/icon/microsoft.svg" },
    { name: "Google", icon: "/images/icon/google.svg" },
    { name: "Netflix", icon: "/images/icon/netflix.svg" },
    { name: "Spotify", icon: "/images/icon/spotify.svg" },
    { name: "Kaspersky", icon: "/images/icon/kas.svg" }
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
    onFilterChange,
    selectedCategory,
    onCategoryChange,
    selectedBrand,
    onBrandChange
}: {
    priceRange: string
    onClearPrice: () => void
    activeFilter: string | null
    onFilterChange: (id: string) => void
    selectedCategory: string | null
    onCategoryChange: (category: string) => void
    selectedBrand: string | null
    onBrandChange: (brand: string) => void
}) {
    return (
        <div className="space-y-4 p-2">
            <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm">Lọc</span>
                </button>

                {priceRange && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                        <span className="text-sm">Từ {priceRange}</span>
                        <button onClick={onClearPrice} className="rounded-full p-1 hover:bg-gray-200">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}

                {selectedCategory && (
                    <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2">
                        <span className="text-sm">{selectedCategory}</span>
                        <button onClick={() => onCategoryChange('')} className="rounded-full p-1 hover:bg-blue-200">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}

                {selectedBrand && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2">
                        {selectedBrand && BRANDS.find(b => b.name === selectedBrand)?.icon && (
                            <Image src={BRANDS.find(b => b.name === selectedBrand)!.icon} alt={selectedBrand} width={16} height={16} />
                        )}
                        <span className="text-sm">{selectedBrand}</span>
                        <button onClick={() => onBrandChange('')} className="rounded-full p-1 hover:bg-green-200">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Danh mục:</span>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => onCategoryChange(category)}
                                className={`rounded-lg border px-3 py-1 text-sm transition-colors
                                    ${selectedCategory === category
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Thương hiệu:</span>
                    <div className="flex flex-wrap gap-2">
                        {BRANDS.map((brand) => (
                            <button
                                key={brand.name}
                                onClick={() => onBrandChange(brand.name)}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-1 text-sm transition-colors
                                    ${selectedBrand === brand.name
                                        ? 'border-green-500 bg-green-50 text-green-600'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Image src={brand.icon} alt={brand.name} width={16} height={16} />
                                {brand.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => onFilterChange(filter.id)}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-1 text-sm transition-colors
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
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
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
    const searchParams = useSearchParams();
    const [priceRange, setPriceRange] = useState('100.000đ - 1.000.000đ')
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = async (categoryName?: string) => {
        try {
            setLoading(true)
            setError(null)
            console.log(categoryName || selectedCategory)
            const response = await axios.get(`${API_URL}/products/search/by-category-name`, {
                    params: {
                    categoryName: categoryName || selectedCategory
                }
            })
            console.log(response.data)
            setProducts(response.data)
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm')
            console.error('Error fetching products:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const query = searchParams.get('q');

        if (category) {
            setSelectedCategory(category)
            fetchProducts(category)
        }
        if (brand) setSelectedBrand(brand);
        if (query) setSearchQuery(query);
    }, [searchParams]);

    useEffect(() => {
        if (selectedCategory) {
            fetchProducts()
        }
    }, [selectedCategory])

    const getBackgroundColor = (type: ProductType['type']) => {
        const colors: Record<string, string> = {
            netflix: 'bg-red-50',
            spotify: 'bg-green-50',
            youtube: 'bg-red-50',
            coursera: 'bg-blue-50',
            adobe: 'bg-gradient-to-r from-pink-50 to-orange-50',
            microsoft: 'bg-blue-50',
            google: 'bg-blue-50',
            kaspersky: 'bg-green-50'
        }
        return colors[type] || 'bg-gray-50'
    }

    const filteredProducts = products.filter(product => {
        if (selectedBrand && product.type !== selectedBrand.toLowerCase()) return false;
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="mx-auto max-w-7xl p-4">
            {searchQuery && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Kết quả tìm kiếm cho &quot;{searchQuery}&quot;</h2>
                    <p className="text-gray-600">Tìm thấy {filteredProducts.length} sản phẩm</p>
                </div>
            )}
            <FilterSection
                priceRange={priceRange}
                onClearPrice={() => setPriceRange('')}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                    setSelectedCategory(category)
                }}
                selectedBrand={selectedBrand}
                onBrandChange={setSelectedBrand}
            />
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <ProductList
                    products={filteredProducts}
                    getBackgroundColor={getBackgroundColor}
                />
            )}
        </div>
    )
}
