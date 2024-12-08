
import React, { HTMLAttributes } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardContent({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
}

