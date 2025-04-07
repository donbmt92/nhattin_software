import PromoBanner from "@/app/components/search/PromoBanner";
import CategoryFilter from "@/app/components/search/CategoryFilter";
import NewProductList from "@/app/components/search/NewProductList";
import ProductGrid from "@/app/components/search/ProductGrid";
import { Suspense } from "react";

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PromoBanner/>
            <div className="flex flex-col md:flex-row w-full mx-auto max-w-7xl pt-3 pb-3">
                <div className="w-full md:w-[300px] pr-0 md:pr-5 mb-5 md:mb-0">
                    <CategoryFilter/>
                    <NewProductList/>
                </div>

                <div className="flex-1 md:ml-5">
                    <ProductGrid/>
                </div>
            </div>
        </Suspense>
    );
}
