


import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary'
    size?: 'default' | 'sm'
}

export function Button({
                           children,
                           variant = 'default',
                           size = 'default',
                           className = '',
                           ...props
                       }: ButtonProps) {
    const baseStyles = 'font-medium rounded-lg transition-colors'
    const variantStyles = {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }
    const sizeStyles = {
        default: 'px-4 py-2',
        sm: 'px-3 py-1 text-sm'
    }

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

