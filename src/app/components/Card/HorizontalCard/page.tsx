import { type NextPage } from 'next'
import HorizontalCard from './HorizontalCard'
import { Product } from '@/app/profile/types'

// Mock data for demonstration
const defaultProducts: Product[] = [
    {
        _id: { id: "1" },
        name: "Sample Product",
        id_category: { name: "New" },
        sales: "100",
        base_price: "99.99",
        image: "/images/sample.jpg"
    } as Product
]

const Page: NextPage = () => {
    return <HorizontalCard products={defaultProducts} />
}

export default Page 
