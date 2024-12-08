import PromoBanner from "@/app/components/search/PromoBanner";
import CategoryFilter from "@/app/components/search/CategoryFilter";
import NewProductList from "@/app/components/search/NewProductList";
import ProductGrid from "@/app/components/search/ProductGrid";

export default function SearchPage() {
    return (
        <>
            <PromoBanner/>
            <div className="flex w-full h-full mx-auto max-w-7xl pt-3 pb-3">
                <div className="w-[300px] pr-5">
                    <CategoryFilter/>
                    <NewProductList/>
                </div>

                <div className="flex-1 ml-5">
                    <ProductGrid/>
                </div>
            </div>
        </>
    );
}
