'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CategoryType } from '@/types/category'
import CategoryIcon from './CategoryIcon'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Cấu trúc dữ liệu danh mục
interface Category {
    _id: string;
    name: string;
    description?: string;
    type?: string; 
    isActive?: boolean;
}

export default function CategoryFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // Tải danh sách danh mục từ API khi component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${API_URL}/categories`)
                if (Array.isArray(response.data)) {
                    setCategories(response.data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Đồng bộ state với query params
    useEffect(() => {
        const categoryParam = searchParams.get('category')
        if (categoryParam) {
            setSelectedCategory(categoryParam)
        } else {
            setSelectedCategory(null)
        }
    }, [searchParams])

    // Xử lý khi người dùng nhấp vào một danh mục
    const handleCategoryClick = (categoryName: string) => {
        // Tạo một đối tượng URLSearchParams mới từ searchParams hiện tại
        const params = new URLSearchParams(searchParams.toString())
        
        if (selectedCategory === categoryName) {
            // Nếu đã chọn category này rồi, bỏ chọn nó
            params.delete('category')
            setSelectedCategory(null)
        } else {
            // Nếu chưa chọn, thêm vào URL
            params.set('category', categoryName)
            setSelectedCategory(categoryName)
        }
        
        // Chuyển hướng đến URL mới
        router.push(`/search?${params.toString()}`)
    }

    if (loading) {
        return (
            <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Danh Mục Sản Phẩm</h2>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Danh Mục Sản Phẩm</h2>
            <div className="space-y-1">
                {categories.map((category) => (
                    <CategoryItem 
                        key={category._id}
                        category={category}
                        isSelected={selectedCategory === category.name}
                        onClick={handleCategoryClick}
                    />
                ))}
            </div>
        </div>
    )
}

// Component hiển thị một mục danh mục
function CategoryItem({ 
    category, 
    isSelected,
    onClick
}: { 
    category: Category
    isSelected: boolean
    onClick: (name: string) => void
}) {
    return (
        <button
            onClick={() => onClick(category.name)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
                isSelected 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100'
            }`}
        >
            <div className="flex items-center gap-3">
                <span className={`text-${isSelected ? 'blue' : 'gray'}-600`}>
                    <CategoryIcon categoryId={category.type || 'default'} />
                </span>
                <span>{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
                {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                )}
            </div>
        </button>
    )
}
