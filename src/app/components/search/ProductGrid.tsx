"use client"

import { Filter, Percent, TrendingUp, X, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import StandCard from '@/app/components/Card/StandCard/StandCard'
import { Product } from '@/app/profile/types'
import { ArrowUpRightIcon, FireIcon, TagIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

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

// Định nghĩa cấu trúc brands
interface BrandType {
    name: string;
    icon: string;
}

// Các brands được dùng cho biểu tượng
const BRANDS: BrandType[] = [
    { name: "Adobe", icon: "/images/icon/adobe.svg" },
    { name: "Microsoft", icon: "/images/icon/microsoft.svg" },
    { name: "Google", icon: "/images/icon/google.svg" },
    { name: "Netflix", icon: "/images/icon/netflix.svg" },
    { name: "Spotify", icon: "/images/icon/spotify.svg" },
    { name: "Youtube", icon: "/images/icon/youtube.svg" },
    { name: "Kaspersky", icon: "/images/icon/kas.svg" }
];

const FILTERS = [
    { id: 'newest', label: 'Mới nhất', icon: <ArrowUpRightIcon className="h-4 w-4" /> },
    { id: 'bestseller', label: 'Bán chạy', icon: <FireIcon className="h-4 w-4" /> },
    { id: 'promotion', label: 'Khuyến mãi', icon: <TagIcon className="h-4 w-4" /> },
    { id: 'low-high', label: 'Giá thấp đến cao', icon: <ArrowUpIcon className="h-4 w-4" /> },
    { id: 'high-low', label: 'Giá cao đến thấp', icon: <ArrowDownIcon className="h-4 w-4" /> }
]

const PRICE_RANGES = [
    'Dưới 200.000đ',
    '200.000đ - 500.000đ',
    '500.000đ - 1.000.000đ',
    '1.000.000đ - 2.000.000đ',
    'Trên 2.000.000đ'
]

function FilterSection({
    priceRange,
    onClearPrice,
    activeFilter,
    onFilterChange,
    selectedCategory,
    onCategoryChange,
    selectedBrand,
    onBrandChange,
    onPriceRangeChange,
    onClearAllFilters,
    categories,
    loadingCategories
}: {
    priceRange: string
    onClearPrice: () => void
    activeFilter: string | null
    onFilterChange: (id: string) => void
    selectedCategory: string | null
    onCategoryChange: (category: string) => void
    selectedBrand: string | null
    onBrandChange: (brand: string) => void
    onPriceRangeChange: (range: string) => void
    onClearAllFilters: () => void
    categories: { _id: string, name: string }[]
    loadingCategories: boolean
}) {
    // Kiểm tra có bất kỳ bộ lọc nào đang được áp dụng không
    const hasAnyFilter = !!priceRange || !!activeFilter || !!selectedCategory || !!selectedBrand;

    // Danh sách thương hiệu đơn giản
    const simpleBrands = ['Netflix', 'Spotify', 'Youtube', 'Microsoft', 'Google'];

    return (
        <div className="space-y-4 p-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
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

                {/* Nút xóa tất cả bộ lọc */}
                {hasAnyFilter && (
                    <button
                        onClick={onClearAllFilters}
                        className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        <X className="h-3 w-3" />
                        <span>Xóa tất cả bộ lọc</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {/* --- Giá --- */}
                {/* Dropdown cho mobile */}
                <div className="block md:hidden w-full">
                    <label className="text-sm text-gray-600">Giá:</label>
                    <select
                        value={priceRange}
                        onChange={(e) => onPriceRangeChange(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả</option>
                        {PRICE_RANGES.map((range) => (
                            <option key={range} value={range}>
                                {range}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Button list cho desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm text-gray-600">Giá:</span>
                    <div className="flex flex-wrap gap-2">
                        {PRICE_RANGES.map((range) => (
                            <button
                                key={range}
                                onClick={() => onPriceRangeChange(range)}
                                className={`rounded-lg border px-3 py-1 text-sm transition-colors
                                    ${priceRange === range
                                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Danh mục --- */}
                <div className="block md:hidden w-full">
                    <label className="text-sm text-gray-600 whitespace-nowrap">Danh mục:</label>
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm text-gray-600">Danh mục:</span>
                    <div className="flex flex-wrap gap-2">
                        {loadingCategories ? (
                            // Hiển thị skeleton loading khi đang tải
                            Array(5).fill(0).map((_, index) => (
                                <div key={index} className="h-8 w-20 animate-pulse rounded-lg bg-gray-200"></div>
                            ))
                        ) : (
                            // Hiển thị danh sách danh mục thực tế
                            categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => onCategoryChange(category.name)}
                                    className={`rounded-lg border px-3 py-1 text-sm transition-colors
                                        ${selectedCategory === category.name
                                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* --- Thương hiệu --- */}
                <div className="block md:hidden w-full">
                    <label className="text-sm text-gray-600">Thương hiệu:</label>
                    <select
                        value={selectedBrand || ''}
                        onChange={(e) => onBrandChange(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả</option>
                        {simpleBrands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm text-gray-600">Thương hiệu:</span>
                    <div className="flex flex-wrap gap-2">
                        {simpleBrands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => onBrandChange(brand)}
                                className={`rounded-lg border px-3 py-1 text-sm transition-colors
                                    ${selectedBrand === brand
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Sắp xếp --- */}
                <div className="block md:hidden w-full">
                    <label className="text-sm text-gray-600">Sắp xếp theo:</label>
                    <select
                        value={activeFilter || ''}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Mặc định</option>
                        {FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="hidden md:flex items-center gap-2">
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

export default function ProductGrid() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [priceRange, setPriceRange] = useState<string>('')
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [searchInput, setSearchInput] = useState<string>('')
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<{ _id: string, name: string }[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)
    
    // Danh sách thương hiệu đơn giản - di chuyển vào component này để tránh lỗi
    const simpleBrands = ['Netflix', 'Spotify', 'Youtube', 'Microsoft', 'Google'];

    // Lấy danh sách danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true)
                const response = await axios.get(`${API_URL}/categories`)
                if (Array.isArray(response.data)) {
                    setCategories(response.data)
                }
            } catch (error) {
                console.error('Error fetching categories for filter:', error)
            } finally {
                setLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [])

    const getPriceRangeValues = (range: string) => {
        const priceValues = range.match(/\d+(\.\d+)?/g);
        if (priceValues && priceValues.length >= 2) {
            const min = parseFloat(priceValues[0].replace(/\./g, ''));
            const max = parseFloat(priceValues[1].replace(/\./g, ''));
            return { min, max };
        } else if (priceValues && priceValues.length === 1) {
            if (range.includes('Dưới')) {
                const max = parseFloat(priceValues[0].replace(/\./g, ''));
                return { min: 0, max };
            } else if (range.includes('Trên')) {
                const min = parseFloat(priceValues[0].replace(/\./g, ''));
                return { min, max: 999999999 };
            }
        }
        return null;
    }

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Phân tích khoảng giá nếu có
            let minPrice, maxPrice;
            if (priceRange) {
                const priceRangeValues = getPriceRangeValues(priceRange);
                if (priceRangeValues) {
                    minPrice = priceRangeValues.min;
                    maxPrice = priceRangeValues.max;
                }
            }
            
            // Xác định tham số sắp xếp dựa trên bộ lọc đã chọn
            let sortBy, sortDir;
            if (activeFilter) {
                switch (activeFilter) {
                    case 'high-low':
                        sortBy = 'base_price';
                        sortDir = 'desc';
                        break;
                    case 'low-high':
                        sortBy = 'base_price';
                        sortDir = 'asc';
                        break;
                    case 'promotion':
                        sortBy = 'discount'; // Giả sử có trường này
                        sortDir = 'desc';
                        break;
                    case 'bestseller':
                        sortBy = 'sold'; // Giả sử có trường này
                        sortDir = 'desc';
                        break;
                    default:
                        break;
                }
            }

            // Kiểm tra xem có bất kỳ tiêu chí tìm kiếm nào được chọn không
            const hasFilters = searchQuery || selectedCategory || selectedBrand || minPrice || maxPrice || sortBy;
            
            // Nếu không có tiêu chí nào, lấy danh sách tất cả sản phẩm
            const endpoint = hasFilters ? `${API_URL}/products/search` : `${API_URL}/products`;
            
            // Sử dụng API tìm kiếm nâng cao
            const response = await axios.get(endpoint, {
                params: {
                    query: searchQuery || undefined,
                    categoryName: selectedCategory || undefined,
                    brand: selectedBrand || undefined,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                    sortBy: sortBy || undefined,
                    sortDir: sortDir || undefined
                }
            })
            
            console.log('Search response:', response.data)
            
            // Kiểm tra cấu trúc dữ liệu API trả về
            if (response.data && response.data.length > 0) {
                const sampleProduct = response.data[0];
                console.log('Sample product structure:', {
                    id: sampleProduct.id,
                    _id: sampleProduct._id,
                    name: sampleProduct.name,
                    // Thêm các field quan trọng khác
                    id_type: sampleProduct.id_type,
                    id_category: sampleProduct.id_category
                });
            }
            
            setProducts(response.data)
        } catch (err: any) {
            let errorMessage = 'Không thể tải danh sách sản phẩm';
            if (err.response) {
                // Lỗi phản hồi từ server (status code ngoài phạm vi 2xx)
                errorMessage = `Lỗi server: ${err.response.status} - ${err.response.data?.message || 'Không có thông tin lỗi'}`;
            } else if (err.request) {
                // Không nhận được phản hồi từ server
                errorMessage = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
            }
            setError(errorMessage);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const query = searchParams.get('q');

        // Cập nhật state từ query params
        if (category) setSelectedCategory(category);
        if (brand) setSelectedBrand(brand);
        if (query) {
            setSearchQuery(query);
            setSearchInput(query); // Đồng bộ input field với query param
        }
        
        // Gọi API tìm kiếm khi mount hoặc khi URL thay đổi
        fetchProducts();
    }, [searchParams]);

    // Cập nhật khi các bộ lọc thay đổi, trừ searchInput vì nó chỉ áp dụng khi submit form
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, selectedBrand, searchQuery, priceRange, activeFilter]);
    
    // Không cần lọc lại products vì API đã trả về dữ liệu đã lọc
    const filteredProducts = products;

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

    // Helper function để cập nhật URL
    const updateUrlWithFilters = () => {
        // Tạo một đối tượng URLSearchParams mới từ searchParams hiện tại
        const params = new URLSearchParams(searchParams.toString());
        
        // Cập nhật các params dựa trên state hiện tại
        if (searchQuery) {
            params.set('q', searchQuery);
        } else {
            params.delete('q');
        }
        
        if (selectedCategory) {
            params.set('category', selectedCategory);
        } else {
            params.delete('category');
        }
        
        if (selectedBrand) {
            params.set('brand', selectedBrand);
        } else {
            params.delete('brand');
        }
        
        // Chuyển hướng đến URL mới
        router.push(`/search?${params.toString()}`);
    }

    // Gọi updateUrlWithFilters khi các bộ lọc thay đổi
    useEffect(() => {
        if (selectedCategory || selectedBrand || searchQuery) {
            updateUrlWithFilters();
        }
    }, [selectedCategory, selectedBrand, searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        // URL sẽ được cập nhật thông qua useEffect
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category || null);
        // URL sẽ được cập nhật thông qua useEffect
    }

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand || null);
        // URL sẽ được cập nhật thông qua useEffect
    }

    // Hàm xử lý reset tất cả các bộ lọc
    const handleClearAllFilters = () => {
        setPriceRange('');
        setActiveFilter(null);
        setSelectedCategory(null);
        setSelectedBrand(null);
        setSearchQuery('');
        setSearchInput('');
        // Chuyển hướng về trang search không có query params
        router.push('/search');
    }

    // Hàm chuyển đổi định dạng dữ liệu từ API sang định dạng Product cho StandCard
    const convertToProductFormat = (data: any[]): Product[] => {
        console.log("Original data from API:", data);
        
        return data.map(item => {
            // Xác định giá trị ID thống nhất - đảm bảo lấy đúng ID từ dữ liệu
            let productId;
            
            if (item._id && typeof item._id === 'object' && item._id.id) {
                productId = item._id.id;
            } else if (item._id) {
                productId = item._id;
            } else if (item.id) {
                productId = item.id;
            } else {
                productId = ''; // Fallback nếu không tìm thấy ID
                console.warn('Product without ID:', item);
            }
            
            console.log(`Product ID for ${item.name}:`, productId);
            
            // Tạo đối tượng Product phù hợp với interface Product
            const product: Product = {
                _id: productId, // Lưu ID dưới dạng chuỗi đơn giản thay vì object
                id: productId,
                name: item.name || 'Không có tên',
                image: item.image || '/images/placeholder.png',
                base_price: String(item.base_price || item.price || 0),
                max_price: String(item.max_price || item.price || item.base_price || 0),
                min_price: String(item.min_price || item.price || item.base_price || 0),
                description: item.description || '',
                id_category: {
                    name: item.id_category?.name || item.category || "Không phân loại",
                    _id: item.id_category?._id || ''
                },
                sales: String(item.sales || item.sold || 0)
            };
            
            // Thêm thuộc tính product_id để có thể sử dụng bởi CartContext
            (product as any).product_id = productId;
            
            return product;
        });
    };

    return (
        <div className="mx-auto max-w-7xl p-4">
            {/* Thanh tìm kiếm */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                        />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Tìm kiếm
                    </button>
                </form>
            </div>
            
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
                onCategoryChange={handleCategoryChange}
                selectedBrand={selectedBrand}
                onBrandChange={handleBrandChange}
                onPriceRangeChange={setPriceRange}
                onClearAllFilters={handleClearAllFilters}
                categories={categories}
                loadingCategories={loadingCategories}
            />
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredProducts.length > 0 ? (
                // Wrapper cho StandCard để điều chỉnh padding và loại bỏ padding mặc định của component
                <div className="stand-card-wrapper mt-10 -mb-12">
                    <StandCard products={convertToProductFormat(filteredProducts)} />
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="mb-4 text-gray-400">
                        <Search className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">Không tìm thấy sản phẩm nào</h3>
                    <p className="mt-2 text-gray-500">Vui lòng thử lại với từ khóa hoặc bộ lọc khác</p>
                </div>
            )}

            {/* Styles cho StandCard */}
            <style jsx global>{`
                .stand-card-wrapper > div {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
                
                .stand-card-wrapper > div > div {
                    margin: 0 !important;
                }
            `}</style>
        </div>
    )
}
