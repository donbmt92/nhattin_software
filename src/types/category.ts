export interface CategoryType {
    id: string
    name: string
    count: number
    expandable: boolean
}

export interface ProductType {
    id: string
    name: string
    image: string
    price: string
    tag: string
    type: 'canva' | 'adobe' | 'netflix'
} 