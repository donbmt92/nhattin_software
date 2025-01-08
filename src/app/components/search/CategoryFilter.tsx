'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { CategoryType } from '@/types/category'
import CategoryIcon from './CategoryIcon'

// Move categories data to a separate constant
const CATEGORIES: CategoryType[] = [
    { id: 'security', name: 'Bảo mật', count: 150, expandable: true },
    { id: 'game', name: 'Game', count: 11, expandable: true },
    { id: 'entertainment', name: 'Giải trí', count: 101, expandable: false },
    { id: 'learning', name: 'Học tập', count: 46, expandable: true },
    { id: 'work', name: 'Làm việc', count: 72, expandable: true },
    { id: 'activation', name: 'Mã kích hoạt', count: 114, expandable: false },
    { id: 'upgrade', name: 'Nâng cấp', count: 36, expandable: false },
    { id: 'health', name: 'Sức khỏe', count: 17, expandable: true },
    { id: 'account', name: 'Tài khoản', count: 187, expandable: false },
]

export default function CategoryFilter() {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Danh Mục Sản Phẩm</h2>
            <div className="space-y-1">
                {CATEGORIES.map((category) => (
                    <CategoryItem 
                        key={category.id}
                        category={category}
                        isExpanded={expandedCategories.includes(category.id)}
                        onToggle={toggleCategory}
                    />
                ))}
            </div>
        </div>
    )
}

// Separate CategoryItem component for better organization
function CategoryItem({ 
    category, 
    isExpanded, 
    onToggle 
}: { 
    category: CategoryType
    isExpanded: boolean
    onToggle: (id: string) => void
}) {
    return (
        <button
            onClick={() => category.expandable && onToggle(category.id)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100"
        >
            <div className="flex items-center gap-3">
                <span className="text-gray-600">
                    <CategoryIcon categoryId={category.id} />
                </span>
                <span>{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">({category.count})</span>
                {category.expandable && (
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                        }`}
                    />
                )}
            </div>
        </button>
    )
}
