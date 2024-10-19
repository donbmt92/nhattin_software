import ImageSlider from "@/components/ImageSlider";
import ListItem from "@/components/ListItem";
import EGiftCards from "@/components/EGiftCards";
import PromoTrustCards from "@/components/PromoTrustCards";
import CategoryIcons from "@/components/CategoryIcons";

export default function Home() {
    return (
        <>
            <br/>
            <ImageSlider/>
            <CategoryIcons/>
            <ListItem/>
            <br/>
            <ListItem/>
            <EGiftCards/>
            <PromoTrustCards/>

        </>
    );
}
