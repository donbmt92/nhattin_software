'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function CategoryFilter() {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])

    const categories = [
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

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const getCategoryIcon = (categoryId: string) => {
        const icons = {
            security: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
            ),
            game: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                </svg>
            ),
            entertainment: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
            ),
            learning: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
            work: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
            activation: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                </svg>
            ),
            upgrade: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                </svg>
            ),
            health: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            ),
            account: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        }
        return icons[categoryId as keyof typeof icons]
    }

    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Danh Mục Sản Phẩm</h2>
            <div className="space-y-1">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => category.expandable && toggleCategory(category.id)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">{getCategoryIcon(category.id)}</span>
                            <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">({category.count})</span>
                            {category.expandable && (
                                <ChevronDown
                                    className={`h-4 w-4 text-gray-400 transition-transform ${
                                        expandedCategories.includes(category.id) ? 'rotate-180' : ''
                                    }`}
                                />
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
