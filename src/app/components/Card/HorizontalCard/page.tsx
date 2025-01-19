import { type NextPage } from 'next'
import HorizontalCard from './HorizontalCard'

const defaultComments = [
    {
        id: "1",
        title: "Sample Product",
        tag: "New",
        sales: "100",
        prices: "99.99",
        image: "/images/sample.jpg"
    }
]

const Page: NextPage = () => {
    return <HorizontalCard comments={defaultComments} />
}

export default Page 