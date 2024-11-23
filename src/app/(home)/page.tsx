
import Sliders from "../components/Sliders/page";
import ListCategories from "./ListCategories/page";
import ListProductTop from "./ListProductTop/page";
import ListProductSales from "./ListProductSales/page";
import Poster from "./Poster/page";
import ListProductNews from "./ListProductNews/page";
import GiftCards from "./GiftCard/page";
import Figures from "./Figures/page";


export default function Home() {
    return (
        <>
            <Sliders />
            <ListCategories />
            <ListProductTop />
            <ListProductSales/>
            <Poster/>
            <ListProductNews />
            <GiftCards />
            <Figures/>
        </>
    );
}
