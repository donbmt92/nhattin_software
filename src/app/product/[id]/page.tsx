
import React from 'react'
import ProductDetails from './ProductDetails/page'
import Policys from './Policy/page';
import Footer from '@/components/Footer';
import ListProductSimilar from './ListProductSimilar/page';
import LinkContact from '@/app/components/LinkContact/page';
import Descriptions from './Descriptions/page';
import Headers from '@/app/components/Header/page';

export default function ProductDetailPage() {
    const productData = {
        img: "../images/image2.png",
        name: "Sample Product",
        price: "499.000",
        tag: "Giải trí",
        sales: "12342",
        prices: "399.000",
    };
    return (
        <div className="">
            <Headers/>
            <ProductDetails data={productData} />
            <Policys />
            <Descriptions/>
            <ListProductSimilar/>
            <LinkContact/>
            <Footer/>
        </div>
    )
}
