
import Sliders from "./components/Sliders/page";
import ListCategories from "@/app/components/ListCategories/page";
import ListProductTop from "@/app/components/ListProductTop/page";
import ListProductSales from "@/app/components/ListProductSales/page";
import Poster from "@/app/components/Poster/page";
import ListProductNews from "@/app/components/ListProductNews/page";
import GiftCards from "@/app/components/GiftCard/page";
import Figures from "@/app/components/Figures/page";
import LinkContact from "./components/LinkContact/page";
import TopHeader from "./components/Header/TopHeader";
import Headers from "./components/Header/page";


export default function Home() {
    return (
        <>
            <Headers/>
            <Sliders />
            <ListCategories />
            <ListProductTop />
            <ListProductSales/>
            <Poster/>
            <ListProductNews />
            <GiftCards />
            <Figures/>
            <LinkContact/>
        </>
    );
}
